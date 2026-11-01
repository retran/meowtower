// The scenario loop (ADR-3270, REQ-8100): an agent plans, writes, gets code's check and a critic's
// reading, and revises until no major fault is left (REQ-8254). Every step is a structured reply (REQ-8236).
import { readFileSync } from "node:fs";
import { z } from "zod";
import type { Gateway } from "../server/gateway/gateway.js";
import type { Lang } from "../shared/i18n.js";
import {
  checkScenario,
  MAX_ENCOUNTERS,
  MIN_ENCOUNTERS,
  Scenario,
} from "./scenario.js";

const Prompt = z.object({
  system: z.string(),
  brief: z.string(),
  size: z.string(),
  plan: z.string(),
  write: z.string(),
  revise: z.string(),
  critic: z.string(),
  review: z.string(),
});

const promptOf = (lang: Lang): z.infer<typeof Prompt> =>
  Prompt.parse(
    JSON.parse(
      readFileSync(
        new URL(`../../content/story/scenario.${lang}.json`, import.meta.url),
        "utf8",
      ),
    ),
  );

/** The world and its limits, which every story request of the game shares. */
const worldOf = (lang: Lang): string => {
  const { setting, never } = World.parse(
    JSON.parse(
      readFileSync(
        new URL(`../../content/frames/prompt.${lang}.json`, import.meta.url),
        "utf8",
      ),
    ),
  );
  return `${setting}\n\n${never}`;
};

const World = z.object({ setting: z.string(), never: z.string() });

const Plan = z.object({
  logline: z.string(),
  synopsis: z.string(),
  treatment: z.string(),
  beats: z.array(z.string()),
});
const Critique = z.object({
  major: z.array(z.string()),
  minor: z.array(z.string()),
});

/** A ceiling so a critic that never settles can't spend the budget. */
const MAX_REVISIONS = 6;

export interface ScenarioAsk {
  readonly bucket: string;
  readonly lang: Lang;
  readonly brief: string;
  readonly minChecks: number;
}

export interface WrittenScenario {
  readonly scenario: Scenario;
  readonly revisions: number;
  /** Major faults the critic still found in the version kept, for the parent's report. */
  readonly unresolved: readonly string[];
  readonly minor: readonly string[];
}

/** A playable scenario, or null when no version passed code's check (REQ-8198, REQ-8204). */
export async function writeScenario(
  gateway: Gateway,
  { bucket, lang, brief, minChecks }: ScenarioAsk,
): Promise<WrittenScenario | null> {
  const prompt = promptOf(lang);
  const system = `${prompt.system}\n\n${worldOf(lang)}`;
  const task = [
    prompt.brief.replace("{brief}", brief),
    prompt.size
      .replace("{min}", String(MIN_ENCOUNTERS))
      .replace("{max}", String(MAX_ENCOUNTERS))
      .replace("{checks}", String(minChecks)),
  ].join("\n");

  async function step<T>(
    schema: z.ZodType<T>,
    system: string,
    user: string,
  ): Promise<{ text: string; value: T | null } | null> {
    const reply = await gateway.call({
      role: "SHOWRUNNER_MODEL",
      bucket,
      system,
      user,
      schema: z.toJSONSchema(schema),
    });
    if (!reply.ok) return null;
    try {
      return {
        text: reply.text,
        value: schema.parse(JSON.parse(reply.text)),
      };
    } catch {
      return { text: reply.text, value: null };
    }
  }

  // A hole found in the treatment costs far less than one found in a finished graph.
  let planAsk = `${task}\n${prompt.plan}`;
  let plan = await step(Plan, system, planAsk);
  if (!plan?.value) return null;
  const read = await step(
    Critique,
    `${prompt.critic}\n\n${worldOf(lang)}`,
    prompt.review.replace("{scenario}", plan.text),
  );
  if (!read) return null;
  if (read.value && read.value.major.length > 0) {
    planAsk = `${planAsk}\n${prompt.revise
      .replace("{scenario}", plan.text)
      .replace("{faults}", read.value.major.join("; "))}`;
    plan = await step(Plan, system, planAsk);
    if (!plan?.value) return null;
  }
  let user = `${task}\n${prompt.write.replace("{plan}", plan.text)}`;
  let kept: WrittenScenario | null = null;
  for (let revisions = 0; revisions <= MAX_REVISIONS; revisions += 1) {
    const draft = await step(Scenario, system, user);
    if (!draft) return kept;
    const faults = draft.value
      ? checkScenario(draft.value, { minChecks })
      : ["schema"];
    let unresolved: readonly string[] = [];
    if (draft.value && faults.length === 0) {
      const review = await step(
        Critique,
        `${prompt.critic}\n\n${worldOf(lang)}`,
        prompt.review.replace("{scenario}", draft.text),
      );
      kept = { scenario: draft.value, revisions, unresolved: [], minor: [] };
      if (!review?.value) return kept;
      unresolved = review.value.major;
      kept = { ...kept, unresolved, minor: review.value.minor };
      if (unresolved.length === 0) return kept;
    }
    user = `${task}\n${prompt.revise
      .replace("{scenario}", draft.text)
      .replace("{faults}", [...faults, ...unresolved].join("; "))}`;
  }
  return kept;
}
