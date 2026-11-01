// The scenario writer (ADR-3270): one structured reply, checked by code, and one more try with its
// faults named. A second failure gives up, so the adventure falls back to the current flow.
import { readFileSync } from "node:fs";
import { z } from "zod";
import type { Gateway } from "../server/gateway/gateway.js";
import type { Lang } from "../shared/i18n.js";
import { checkScenario, MAX_SCENES, MIN_SCENES, Scenario } from "./scenario.js";

const Prompt = z.object({
  system: z.string(),
  brief: z.string(),
  size: z.string(),
  faults: z.string(),
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

const SCHEMA = z.toJSONSchema(Scenario);
const TRIES = 2;

export interface ScenarioAsk {
  readonly bucket: string;
  readonly lang: Lang;
  readonly brief: string;
  readonly minChecks: number;
}

/** A scenario that passed its checks, or null after two failures (REQ-8198, REQ-8204). */
export async function writeScenario(
  gateway: Gateway,
  { bucket, lang, brief, minChecks }: ScenarioAsk,
): Promise<Scenario | null> {
  const prompt = promptOf(lang);
  const ask = [
    prompt.brief.replace("{brief}", brief),
    prompt.size
      .replace("{min}", String(MIN_SCENES))
      .replace("{max}", String(MAX_SCENES))
      .replace("{checks}", String(minChecks)),
  ].join("\n");
  let faults: readonly string[] = [];
  for (let attempt = 0; attempt < TRIES; attempt += 1) {
    const reply = await gateway.call({
      role: "SHOWRUNNER_MODEL",
      bucket,
      system: prompt.system,
      user:
        faults.length === 0
          ? ask
          : `${ask}\n${prompt.faults.replace("{faults}", faults.join(", "))}`,
      schema: SCHEMA,
    });
    if (!reply.ok) return null;
    let parsed: Scenario;
    try {
      parsed = Scenario.parse(JSON.parse(reply.text));
    } catch {
      faults = ["schema"];
      continue;
    }
    faults = checkScenario(parsed, { minChecks });
    if (faults.length === 0) return parsed;
  }
  return null;
}
