// Generating a version of an adventure (ADR-3360, REQ-8260, REQ-8318, REQ-8610): a run of the scenario
// writer as a background job with a visible step, whose result waits as a version for the parent to keep
// (REQ-8604). The job's message is a code the page words, so it can name the step or the cause.
import {
  type Cause,
  GENERATION_CALLS,
  type Report,
} from "../../story/writer.js";
import type { Lang } from "../../shared/i18n.js";
import type { Db } from "../db/index.js";
import {
  currentBodyOf,
  type Job,
  proposeVersion,
  reportJob,
  startJob,
  StudioRefused,
  type StoryNode,
} from "./store.js";

export { GENERATION_CALLS };

/** What the writer is asked for one adventure, and the report it makes while it works. */
export interface GenerateAsk {
  readonly bucket: string;
  readonly lang: Lang;
  readonly brief: string;
  readonly minChecks: number;
  /** `level` reworks the adventure's own texts with a plan; `inside` writes the whole scenario (REQ-8310). */
  readonly scope: Scope;
  readonly report: Report;
}

export type Scope = "level" | "inside";
export const SCOPES: readonly Scope[] = ["level", "inside"];

/** What a level rework returns: the plan alone. */
export interface GeneratedPlan {
  readonly plan: {
    readonly logline: string;
    readonly synopsis: string;
    readonly treatment: string;
    readonly beats: readonly string[];
  };
}

/** The part of a written scenario the studio keeps: the whole scenario, and its premise and logline. */
export interface GeneratedScenario {
  readonly scenario: { readonly premise: string; readonly logline: string };
  readonly revisions: number;
  readonly unresolved: readonly string[];
  readonly minor: readonly string[];
}

/** Writes a scenario for an adventure, or returns null with the cause told to the report. */
export type AdventureWriter = (
  ask: GenerateAsk,
) => Promise<GeneratedScenario | GeneratedPlan | null>;

/** The calls a run of each scope makes: a plan alone is one call, and the inside is a whole run. */
export const callsOf = (scope: Scope): { min: number; max: number } =>
  scope === "level" ? { min: 1, max: 1 } : GENERATION_CALLS;

/** The checks a scenario must hold when the parent names none; a default that I chose. */
export const DEFAULT_MIN_CHECKS = 5;

/** What the month's calls have cost so far, from the gateway's own log (REQ-8608). */
export async function monthSpendUsd(db: Db, now: number): Promise<number> {
  const at = new Date(now);
  const first = new Date(
    Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), 1),
  ).toISOString();
  const row = (await db
    .prepare(
      "SELECT COALESCE(SUM(cost_usd), 0) AS usd FROM llm_log WHERE at >= ?",
    )
    .get(first)) as { usd: number };
  return Number(row.usd);
}

/**
 * The price of one call, in dollars, where fewer than `MEASURED_FROM` calls are logged (ADR-3410): a live run
 * of the scenario writer on 2026-11-15 made 14 calls for 0.9222 dollars, 0.066 a call, rounded up.
 */
export const DEFAULT_CALL_USD = 0.07;
/** From this many earlier calls the price is their mean, and the estimate says it is measured. */
export const MEASURED_FROM = 10;
/** The newest calls that make the mean. */
export const MEASURED_WINDOW = 50;

export interface DollarEstimate {
  readonly minUsd: number;
  readonly maxUsd: number;
  /** What the price rests on: the mean of earlier calls, or the default (REQ-8632). */
  readonly basis: "measured" | "default";
  readonly measuredCalls: number;
}

const upToCent = (usd: number): number => Math.ceil(usd * 100 - 1e-6) / 100;

/**
 * The cost of a run in dollars (REQ-8630): the fewest and the most calls a run makes times the price of
 * one call, each end rounded up to the cent. `costs` are the costs of earlier answered calls, oldest first.
 */
export function dollarEstimate(
  costs: readonly number[],
  calls: { min: number; max: number } = GENERATION_CALLS,
): DollarEstimate {
  const recent = costs.slice(-MEASURED_WINDOW);
  const measured = recent.length >= MEASURED_FROM;
  const price = measured
    ? recent.reduce((sum, c) => sum + c, 0) / recent.length
    : DEFAULT_CALL_USD;
  return {
    minUsd: upToCent(calls.min * price),
    maxUsd: upToCent(calls.max * price),
    basis: measured ? "measured" : "default",
    measuredCalls: measured ? recent.length : 0,
  };
}

/** The costs of the newest answered calls of the showrunner, oldest first. */
export async function showrunnerCosts(db: Db): Promise<number[]> {
  const rows = (await db
    .prepare(
      "SELECT cost_usd FROM llm_log WHERE role = 'SHOWRUNNER_MODEL' AND outcome = 'ok' ORDER BY id DESC LIMIT ?",
    )
    .all(MEASURED_WINDOW)) as { cost_usd: number }[];
  return rows.map((r) => Number(r.cost_usd)).reverse();
}

/** The body of a level without the scenario inside it, which a level rework does not need to read. */
const omit = (
  body: Record<string, unknown>,
  key: string,
): Record<string, unknown> =>
  Object.fromEntries(Object.entries(body).filter(([k]) => k !== key));
const withoutScenario = (
  body: Record<string, unknown>,
): Record<string, unknown> => omit(body, "scenario");

/** How far along a step is, as a share of the run; the draft steps climb with each draft. */
const progressOf = (name: string, n: number): number =>
  name === "plan"
    ? 10
    : name === "review"
      ? 20
      : name === "replan"
        ? 30
        : Math.min(95, 30 + n * 10 + (name === "critic" ? 5 : 0));

/**
 * Starts a generation as a job and returns it at once; the run goes on in the background and ends in
 * `done` or `failed`, with the step or the cause in the job's message. `done` resolves when it ends.
 */
export async function startGeneration(
  db: Db,
  now: () => number,
  node: StoryNode,
  prompt: string,
  write: AdventureWriter,
  lang: Lang,
  scope: Scope = "level",
): Promise<{ job: Job; done: Promise<void> }> {
  const job = await startJob(db, now(), "generate", node.id);
  let cause: Cause | null = null;
  let chain: Promise<unknown> = Promise.resolve();
  const tell = (update: { progress?: number; message: string }): void => {
    chain = chain.then(() =>
      reportJob(db, now(), job.id, update).catch(() => undefined),
    );
  };
  const report: Report = {
    step: (name, n) => {
      tell({
        progress: progressOf(name, n),
        message: n > 0 ? `${name}:${String(n)}` : name,
      });
    },
    fault: (found) => {
      cause = found;
    },
  };
  const fail = async (message: string): Promise<void> => {
    await chain;
    await reportJob(db, now(), job.id, { state: "failed", message });
  };
  const run = async (): Promise<void> => {
    try {
      const current = await currentBodyOf(db, node.id);
      const base: Record<string, unknown> =
        typeof current === "object" &&
        current !== null &&
        !Array.isArray(current)
          ? { ...(current as Record<string, unknown>) }
          : {};
      // The model reworks what the level holds now and does not start over: the prompt comes with the
      // current version, less the critic's notes of an earlier run (REQ-8262).
      const held = omit(base, "review");
      const brief =
        Object.keys(held).length === 0
          ? prompt
          : `${prompt}\n\n---\n${JSON.stringify(scope === "level" ? withoutScenario(held) : held)}`;
      const written = await write({
        bucket: node.id,
        lang,
        brief,
        minChecks: DEFAULT_MIN_CHECKS,
        scope,
        report,
      });
      if (!written) return await fail(cause ?? "check_failed");
      const waiting = await proposeVersion(
        db,
        now(),
        node.id,
        "plan" in written
          ? {
              ...base,
              logline: written.plan.logline,
              synopsis: written.plan.synopsis,
              treatment: written.plan.treatment,
              beats: written.plan.beats,
            }
          : {
              ...base,
              premise: written.scenario.premise,
              logline: written.scenario.logline,
              scenario: written.scenario,
              // What the critic still found, which the page shows beside the comparison (REQ-8642).
              review: {
                revisions: written.revisions,
                unresolved: written.unresolved,
                minor: written.minor,
              },
            },
        { prompt },
      );
      await chain;
      await reportJob(db, now(), job.id, {
        state: "done",
        message: `version:${String(waiting.version)}`,
      });
    } catch (err) {
      await fail(err instanceof StudioRefused ? "version_waits" : "failed");
    }
  };
  return { job, done: run() };
}
