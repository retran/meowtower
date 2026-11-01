// The scenario loop (ADR-3270, REQ-8100): an agent plans, writes, gets code's check and a critic's
// reading, and revises at most twice (REQ-8102). Every step is a structured reply (REQ-8236).
import { readFileSync } from "node:fs";
import { z } from "zod";
import type { Gateway } from "../server/gateway/gateway.js";
import type { Lang } from "../shared/i18n.js";
import { checkScenario, MAX_SCENES, MIN_SCENES, Scenario } from "./scenario.js";

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

const Plan = z.object({
  premise: z.string(),
  want: z.string(),
  stakes: z.string(),
  twist: z.string(),
  endings: z.array(z.string()),
});
const Critique = z.object({
  pass: z.boolean(),
  faults: z.array(z.string()),
});

const MAX_REVISIONS = 2;

export interface ScenarioAsk {
  readonly bucket: string;
  readonly lang: Lang;
  readonly brief: string;
  readonly minChecks: number;
}

export interface WrittenScenario {
  readonly scenario: Scenario;
  readonly revisions: number;
  /** What the critic still found in the version kept, for the parent's report. */
  readonly unresolved: readonly string[];
}

/** A playable scenario, or null when no version passed code's check (REQ-8198, REQ-8204). */
export async function writeScenario(
  gateway: Gateway,
  { bucket, lang, brief, minChecks }: ScenarioAsk,
): Promise<WrittenScenario | null> {
  const prompt = promptOf(lang);
  const task = [
    prompt.brief.replace("{brief}", brief),
    prompt.size
      .replace("{min}", String(MIN_SCENES))
      .replace("{max}", String(MAX_SCENES))
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

  const plan = await step(Plan, prompt.system, `${task}\n${prompt.plan}`);
  if (!plan?.value) return null;
  let user = `${task}\n${prompt.write.replace("{plan}", plan.text)}`;
  let kept: WrittenScenario | null = null;
  for (let revisions = 0; revisions <= MAX_REVISIONS; revisions += 1) {
    const draft = await step(Scenario, prompt.system, user);
    if (!draft) return kept;
    const faults = draft.value
      ? checkScenario(draft.value, { minChecks })
      : ["schema"];
    let unresolved: readonly string[] = [];
    if (draft.value && faults.length === 0) {
      const review = await step(
        Critique,
        prompt.critic,
        prompt.review.replace("{scenario}", draft.text),
      );
      kept = { scenario: draft.value, revisions, unresolved: [] };
      if (!review?.value || review.value.pass) return kept;
      unresolved = review.value.faults;
      kept = { ...kept, unresolved };
    }
    user = `${task}\n${prompt.revise
      .replace("{scenario}", draft.text)
      .replace("{faults}", [...faults, ...unresolved].join("; "))}`;
  }
  return kept;
}
