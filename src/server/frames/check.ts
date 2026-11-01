// The checks of a live frame (ADR-3100): code first, then the safety question, then the blind solves.
import { z } from "zod";
import type { Gateway } from "../gateway/gateway.js";
import { textGate } from "../../shared/voice/gate.js";
import type { Lang } from "../../templates/spec.js";
import {
  type Creepiness,
  type FramePrompt,
  type JudgeKey,
  MAX_SENTENCES,
  MAX_WORDS,
  promptOf,
} from "./request.js";
import { present, type RegistryItem } from "../task-source.js";
import type { AnswerKind } from "../../templates/spec.js";

export type FrameFault = "length" | "gate" | "question";

/** A fault that lowers a variant's score: a forbidden word removes it. */
export const SOFT_FAULTS: readonly FrameFault[] = ["length"];

const sentencesOf = (text: string): string[] =>
  text.split(/(?<=[.!?…])\s+/u).filter((s) => s.trim() !== "");
const wordCount = (s: string): number => s.trim().split(/\s+/u).length;

/** The first thing wrong with a frame by code alone, or null. */
export function codeFault(
  frame: string,
  task: string,
  lang: Lang,
): FrameFault | null {
  if (!textGate(frame, { lang, kind: "task", source: "frame" }).ok)
    return "gate";
  if (!frame.trim().endsWith("?")) return "question";
  const sentences = sentencesOf(frame);
  const longest = Math.max(MAX_WORDS, ...sentencesOf(task).map(wordCount));
  return sentences.length > MAX_SENTENCES + sentencesOf(task).length ||
    sentences.some((s) => wordCount(s) > longest)
    ? "length"
    : null;
}

/** Only a plainly unsafe text is removed: everything else ranks, so a task always shows its best. */
const UNSAFE_VETO = 0.7;

/** What each answer adds to a variant's score: faults subtract, and a soft code fault costs 0.15. */
const WEIGHTS = {
  fits: 0.3,
  flows: 0.2,
  clear: 0.2,
  sense: 0.2,
  alive: 0.1,
  changed: -1,
  numbers: -1,
  unsafe: -1,
} as const;
const SOFT_COST = 0.15;

export const Answers = z.object({
  unsafe: z.number(),
  changed: z.number(),
  fits: z.number(),
  flows: z.number(),
  clear: z.number(),
  alive: z.number(),
  sense: z.number(),
  numbers: z.number(),
  answer: z.string(),
});
export type Answers = z.infer<typeof Answers>;

/** A variant's weighted score, or null when it is plainly unsafe. */
export function scoreOf(
  answers: Omit<Answers, "answer">,
  soft = false,
): number | null {
  if (answers.unsafe >= UNSAFE_VETO) return null;
  const score = (Object.keys(WEIGHTS) as (keyof typeof WEIGHTS)[]).reduce(
    (sum, k) => sum + answers[k] * WEIGHTS[k],
    0,
  );
  return soft ? score - SOFT_COST : score;
}

export interface Judged {
  /** The variant with the highest score, or null when every one was plainly unsafe. */
  readonly best: string | null;
  /** The score of the best variant. */
  readonly score: number | null;
  readonly rejected: readonly string[];
  readonly unused: readonly string[];
}

const FORMAT: Readonly<Record<AnswerKind, keyof FramePrompt["formats"]>> = {
  integer: "number",
  decimal: "number",
  line: "number",
  fraction: "fraction",
  mixed: "mixed",
  pair: "pair",
  time: "time",
  compare: "options",
  choice: "options",
  set: "options",
  order: "options",
};

const JUDGE_KEYS = Object.keys(Answers.shape).filter((k) => k !== "answer");

/** The judge's prompt: each question with what yes and no mean. */
const judgeSystem = (
  lang: Lang,
  level: Creepiness,
  kind: AnswerKind,
): string => {
  const { judge, formats } = promptOf(lang);
  const judge_format = formats[FORMAT[kind]];
  const lines = JUDGE_KEYS.map((key) => {
    const q = judge.questions[key as JudgeKey];
    const no = key === "unsafe" ? judge.safeAtLevel[level] : q.criteria.false;
    return `${key}: ${q.instructions}\n1: ${q.criteria.true}\n0: ${no}`;
  });
  return [judge.intro, judge_format, ...lines].join("\n\n");
};

const JUDGE_SCHEMA = {
  type: "object",
  properties: {
    answer: { type: "string" },
    ...Object.fromEntries(JUDGE_KEYS.map((key) => [key, { type: "number" }])),
  },
  required: ["answer", ...JUDGE_KEYS],
  additionalProperties: false,
};

/** Whether the solver's answer is the engine's, read through the task's own checker (REQ-7950). */
function solved(
  raw: string,
  item: Pick<RegistryItem, "template" | "made">,
): boolean {
  const values = present(item).input.values;
  const entry = values
    ? (raw.match(/\d+/gu) ?? [])
        .map((n) => values[Number(n) - 1] ?? "")
        .join(",")
    : raw.trim();
  return item.made.checker(entry).verdict === "correct";
}

/** A wrong or impossible blind solve takes a story below the bar. */
const UNSOLVED_COST = 1;

/** One request solves the story from itself and scores it, and the code decides (REQ-3600, REQ-7750).
 *  Null means the judge failed, and the task keeps its template text. */
export async function judged(
  gateway: Gateway,
  bucket: string,
  variants: readonly { readonly text: string; readonly soft: boolean }[],
  item: Pick<RegistryItem, "template" | "made">,
  answers: readonly string[],
  lang: Lang,
  level: Creepiness,
): Promise<Judged | null> {
  const { judge, answerForms } = promptOf(lang);
  const results = await Promise.all(
    variants.map(async ({ text, soft }) => {
      const reply = await gateway.call({
        role: "FRAME_JUDGE_MODEL",
        bucket,
        system: judgeSystem(lang, level, item.template.answer),
        user: [
          `${judge.story}:\n${text}`,
          ...(item.made.svg ? [item.made.svg] : []),
          `${judge.task}:\n${item.made.text}`,
          `${judge.form}:\n${answerForms[item.template.answer]}`,
          ...(answers.length > 0
            ? [
                `${judge.answers}:\n${answers
                  .map((a, i) => `${(i + 1).toString()}) ${a}`)
                  .join("; ")}`,
              ]
            : []),
        ].join("\n\n"),
        schema: JUDGE_SCHEMA,
      });
      if (!reply.ok) return { text, answered: false, score: null };
      let parsed: ReturnType<typeof Answers.safeParse>;
      try {
        parsed = Answers.safeParse(JSON.parse(reply.text));
      } catch {
        return { text, answered: false, score: null };
      }
      if (!parsed.success) return { text, answered: false, score: null };
      const score = scoreOf(parsed.data, soft);
      return {
        text,
        answered: true,
        score:
          score === null || solved(parsed.data.answer, item)
            ? score
            : score - UNSOLVED_COST,
      };
    }),
  );
  const answered = results.filter((r) => r.answered);
  if (answered.length === 0) return null;
  const passing = answered
    .filter((r) => r.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return {
    best: passing[0]?.text ?? null,
    score: passing[0]?.score ?? null,
    rejected: answered.filter((r) => r.score === null).map((r) => r.text),
    unused: passing.slice(1).map((r) => r.text),
  };
}
