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
  readonly report: Report;
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
) => Promise<GeneratedScenario | null>;

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
      const written = await write({
        bucket: node.id,
        lang,
        brief: prompt,
        minChecks: DEFAULT_MIN_CHECKS,
        report,
      });
      if (!written) return await fail(cause ?? "check_failed");
      const current = await currentBodyOf(db, node.id);
      const base =
        typeof current === "object" &&
        current !== null &&
        !Array.isArray(current)
          ? current
          : {};
      const waiting = await proposeVersion(
        db,
        now(),
        node.id,
        {
          ...base,
          premise: written.scenario.premise,
          logline: written.scenario.logline,
          scenario: written.scenario,
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
