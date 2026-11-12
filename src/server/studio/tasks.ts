// The task lab (ADR-3280, REQ-8298): any template opened as a task, with its text, its answer, its
// solution, its hints and its typical mistakes, in any shipped language and for any seed, and what a
// story written for it would cost. It reads the templates the game itself plays from.
import { baseSeed } from "../../math/rng.js";
import { type Lang, SHIPPED } from "../../shared/i18n.js";
import { templates } from "../../templates/index.js";
import { ROLES } from "../gateway/config.js";
import { costOf } from "../gateway/prices.js";
import { present } from "../task-source.js";

export interface TemplateRow {
  readonly id: string;
  readonly node: string;
  readonly subtype: string;
  readonly form: string;
  readonly groups: readonly [number, number];
  readonly answerKind: string;
}

export interface OpenedTask {
  readonly template: TemplateRow;
  readonly seed: string;
  readonly lang: Lang;
  readonly text: string;
  readonly svg: string | null;
  readonly options: readonly string[] | null;
  readonly answer: string;
  readonly solution: readonly string[];
  readonly hints: readonly string[];
  readonly traps: readonly {
    id: string;
    kind: string;
    entry: string;
    explanation: string;
  }[];
  /** The template's text with its placeholders, which a story frame rewrites. */
  readonly blank: string;
  /** What one live story for this task would cost at most, in dollars. */
  readonly storyEstimateUsd: number;
}

const rowOf = (t: (typeof templates)[number]): TemplateRow => ({
  id: t.id,
  node: t.node,
  subtype: t.subtype,
  form: t.form,
  groups: t.groups,
  answerKind: t.answer,
});

export const listTemplates = (): TemplateRow[] => templates.map(rowOf);

const HEX = /^[0-9a-f]{1,64}$/;

/** A seed the parent typed, as bytes; none gives the lab's first seed of that template. */
function seedOf(
  templateId: string,
  seed: string | undefined,
): { hex: string; bytes: Uint8Array } {
  if (seed !== undefined && HEX.test(seed)) {
    const padded = seed.padStart(seed.length + (seed.length % 2), "0");
    return { hex: seed, bytes: Uint8Array.from(Buffer.from(padded, "hex")) };
  }
  const bytes = baseSeed("studio", templateId, 0);
  return { hex: Buffer.from(bytes).toString("hex"), bytes };
}

/** About three characters a token, as the gateway counts. */
const tokensIn = (text: string): number => Math.ceil(text.length / 3);

/** The default model of the story role, which the gateway's price table knows. */
const STORY_MODEL = "claude-haiku-5-5";

export function openTask(
  id: string,
  seed: string | undefined,
  language: string,
): OpenedTask | null {
  const template = templates.find((t) => t.id === id);
  if (!template) return null;
  const lang = (SHIPPED as readonly string[]).includes(language)
    ? (language as Lang)
    : "ru";
  const picked = seedOf(id, seed);
  const made = template.make(picked.bytes, lang);
  const shown = present({ template, made });
  const blank = template.blank(lang);
  return {
    template: rowOf(template),
    seed: picked.hex,
    lang,
    text: shown.text,
    svg: made.svg,
    options: shown.options ?? null,
    answer: shown.answer,
    solution: made.solution,
    hints: made.hints,
    traps: made.traps.map((t) => ({
      id: t.id,
      kind: t.kind,
      entry: t.entry,
      explanation: t.explanation,
    })),
    blank,
    storyEstimateUsd: costOf(
      STORY_MODEL,
      tokensIn(blank) + 600,
      ROLES.TASK_TEXT_MODEL.maxTokens,
    ),
  };
}
