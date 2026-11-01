// The request for a story frame (ADR-3100, ADR-3210). The template is filled once, and that one task
// goes to the model on every attempt.
// decision moves `TASK_TEXT_MODEL` to the player tier, because a summary is story material (REQ-7580).
import { readFileSync } from "node:fs";
import type { AnswerKind, Lang } from "../../templates/spec.js";

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
  /** The task with its numbers filled in. */
  readonly task: string;
  readonly roles: Readonly<Record<string, string>>;
  readonly lang: Lang;
  readonly slots: StorySlots;
  /** Recent frames, because a model remembers no earlier request. They hold no player material. */
  readonly told: readonly string[];
  /** The buttons the child answers with, so the story's question leads to them. */
  readonly answers: readonly string[];
  /** The task's picture as SVG source, because a task can state its numbers only there. */
  readonly picture?: string | null;
  /** How the player answers, so the story's question fits it. */
  readonly kind: AnswerKind;
  /** The first attempt's story, which a second attempt continues. */
  readonly previous?: string;
}

export const VARIANTS = 1;
export const MAX_SENTENCES = 4;
export const MAX_WORDS = 22;

export const FRAME_SCHEMA = {
  type: "object",
  properties: { story: { type: "string" } },
  required: ["story"],
  additionalProperties: false,
} as const;

/** The parent's creepiness level, which sets a frame's tone (REQ-7840). */
export type Creepiness = 0 | 1 | 2;
/** The player's gender, which the parent sets, so the text addresses them rightly. */
export type Gender = "f" | "m";
type Levels = readonly [string, string, string];

export interface JudgeQuestion {
  readonly instructions: string;
  readonly criteria: Readonly<Record<"true" | "false", string>>;
}

export type JudgeKey =
  "unsafe" | "changed" | "fits" | "flows" | "clear" | "alive";

export interface FramePrompt {
  readonly setting: string;
  readonly intro: string;
  readonly rules: readonly string[];
  readonly variants: string;
  readonly continuation: string;
  readonly formats: Readonly<
    Record<
      "number" | "fraction" | "mixed" | "pair" | "time" | "options",
      string
    >
  >;
  readonly tones: Levels;
  readonly reader: Readonly<Record<Gender, string>>;
  readonly answerForms: Readonly<Record<AnswerKind, string>>;
  readonly never: string;
  readonly judge: {
    readonly intro: string;
    readonly story: string;
    readonly task: string;
    readonly answers: string;
    readonly form: string;
    readonly safeAtLevel: Levels;
    readonly questions: Readonly<Record<JudgeKey, JudgeQuestion>>;
  };
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
export const frameSystem = (
  lang: Lang,
  level: Creepiness,
  gender: Gender = "f",
): string => {
  const { intro, setting, rules, tones, never, reader } = promptOf(lang);
  return [
    intro,
    setting,
    tones[level],
    never,
    reader[gender],
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
  task,
  roles,
  lang,
  slots,
  told,
  answers,
  kind,
  previous,
  picture,
}: FrameRequest): string =>
  [
    slot("story_arc", slots.arc),
    slot("adventure", slots.adventure),
    slot("game_situation", slots.situation),
    slot("previous_story", previous ?? null),
    // Recent stories would pull a continuation away from the story it continues.
    `<told>\n${previous ? "" : told.join("\n")}\n</told>`,
    `<task>${task}</task>`,
    ...(picture ? [`<picture>${picture}</picture>`] : []),
    `<answer_form>${promptOf(lang).answerForms[kind]}</answer_form>`,
    `<answers>${answers.join("; ")}</answers>`,
    `<number_roles>${JSON.stringify(roles)}</number_roles>`,
    ...(previous ? [promptOf(lang).continuation] : []),
    promptOf(lang).variants.replace("{count}", VARIANTS.toString()),
  ].join("\n");
