// The request for a story frame (ADR-3100). A frame keeps the template's placeholders, so the model
// never sees or writes a number. The three summaries have their places here and stay null until a
// decision moves `TASK_TEXT_MODEL` to the player tier, because a summary is story material (REQ-7580).
import { readFileSync } from "node:fs";
import type { Lang } from "../../templates/spec.js";

export interface StorySlots {
  readonly arc: null;
  readonly adventure: null;
  readonly situation: null;
}

export const NO_SLOTS: StorySlots = {
  arc: null,
  adventure: null,
  situation: null,
};

export interface FrameRequest {
  readonly blank: string;
  readonly roles: Readonly<Record<string, string>>;
  readonly lang: Lang;
  readonly slots: StorySlots;
}

export const VARIANTS = 5;
export const MAX_SENTENCES = 3;
export const MAX_WORDS = 22;

export const FRAME_SCHEMA = {
  type: "object",
  properties: {
    frames: { type: "array", items: { type: "string" } },
  },
  required: ["frames"],
  additionalProperties: false,
} as const;

export interface FramePrompt {
  readonly setting: string;
  readonly intro: string;
  readonly rules: readonly string[];
  readonly variants: string;
  readonly judge: Readonly<
    Record<"variant" | "unsafe" | "joke" | "changed" | "best", string>
  >;
}

const prompts = new Map<Lang, FramePrompt>();

/** Every prompt is in the game's language (ADR-3100), so it lives in a per-language file. */
export function promptOf(lang: Lang): FramePrompt {
  const hit = prompts.get(lang);
  if (hit) return hit;
  const file = new URL(
    `../../../content/frames/prompt.${lang}.json`,
    import.meta.url,
  );
  const prompt = JSON.parse(readFileSync(file, "utf8")) as FramePrompt;
  prompts.set(lang, prompt);
  return prompt;
}

/** The part of the prompt every frame of a language shares. */
export const frameSystem = (lang: Lang): string => {
  const { intro, setting, rules } = promptOf(lang);
  return [
    intro,
    setting,
    ...rules.map(
      (r) =>
        "- " +
        r
          .replace("{sentences}", MAX_SENTENCES.toString())
          .replace("{words}", MAX_WORDS.toString()),
    ),
  ].join("\n\n");
};

const slot = (name: string, value: string | null): string =>
  `<${name}>${value ?? ""}</${name}>`;

/** The part of the prompt that changes with each task. */
export const frameUser = ({
  blank,
  roles,
  lang,
  slots,
}: FrameRequest): string =>
  [
    slot("story_arc", slots.arc),
    slot("adventure", slots.adventure),
    slot("game_situation", slots.situation),
    `<task>${blank}</task>`,
    `<number_roles>${JSON.stringify(roles)}</number_roles>`,
    promptOf(lang).variants.replace("{count}", VARIANTS.toString()),
  ].join("\n");
