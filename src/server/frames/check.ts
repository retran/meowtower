// The checks of a live frame (ADR-3100): code first, then the safety question, then the blind solves.
import { readFileSync } from "node:fs";
import { z } from "zod";
import type { Gateway } from "../gateway/gateway.js";
import { textGate } from "../../shared/voice/gate.js";
import type { AnswerKind, Compiled, Lang } from "../../templates/spec.js";
import { presentFramed } from "../task-source.js";
import {
  type FramePrompt,
  MAX_SENTENCES,
  MAX_WORDS,
  promptOf,
} from "./request.js";

const PLACEHOLDER = /\{[^{}]+\}/g;

export const placeholdersOf = (text: string): string[] =>
  [...text.matchAll(PLACEHOLDER)].map((m) => m[0]).sort();

const numerals = new Map<Lang, Set<string>>();

function numeralsOf(lang: Lang): Set<string> {
  const hit = numerals.get(lang);
  if (hit) return hit;
  const file = new URL(
    `../../../content/numerals.${lang}.json`,
    import.meta.url,
  );
  const words = new Set(
    (JSON.parse(readFileSync(file, "utf8")) as string[]).map((w) =>
      w.toLowerCase(),
    ),
  );
  numerals.set(lang, words);
  return words;
}

const splitSentences = (text: string): string[] =>
  text.split(/(?<=[.!?…])\s+/u).filter((s) => s.trim() !== "");
const wordCount = (s: string): number => s.trim().split(/\s+/u).length;

export type FrameFault =
  "placeholders" | "digit" | "number_word" | "length" | "gate";

/** The first thing wrong with a frame by code alone, or null. */
export function codeFault(
  frame: string,
  blank: string,
  lang: Lang,
): FrameFault | null {
  const want = placeholdersOf(blank);
  const got = placeholdersOf(frame);
  if (want.join("\u0000") !== got.join("\u0000")) return "placeholders";
  const bare = frame.replace(PLACEHOLDER, " ");
  const plain = blank.replace(PLACEHOLDER, " ");
  // A number the template writes itself stays, and the frame adds none.
  const digits = (t: string): string =>
    (t.match(/\d+/gu) ?? []).sort().join(" ");
  if (digits(bare) !== digits(plain)) return "digit";
  const wordsOf = (t: string): string[] =>
    t.toLowerCase().match(/\p{L}+/gu) ?? [];
  const lexicon = numeralsOf(lang);
  const own = new Set(wordsOf(plain));
  if (wordsOf(bare).some((w) => lexicon.has(w) && !own.has(w)))
    return "number_word";
  const sentences = splitSentences(frame);
  const longest = Math.max(MAX_WORDS, ...splitSentences(blank).map(wordCount));
  if (
    sentences.length > MAX_SENTENCES + splitSentences(blank).length ||
    sentences.some((s) => wordCount(s) > longest)
  )
    return "length";
  if (!textGate(bare, { lang, kind: "task", source: "frame" }).ok)
    return "gate";
  return null;
}

const Verdict = z.object({ safe: z.boolean(), joke: z.boolean() });
const VERDICT_SCHEMA = {
  type: "object",
  properties: { safe: { type: "boolean" }, joke: { type: "boolean" } },
  required: ["safe", "joke"],
  additionalProperties: false,
} as const;

/** The safety question on the text with its placeholders unfilled (REQ-3600). */
export async function safe(
  gateway: Gateway,
  bucket: string,
  frame: string,
  lang: Lang,
): Promise<boolean> {
  const reply = await gateway.call({
    role: "SAFETY_MODEL",
    bucket,
    system: promptOf(lang).safety,
    user: frame,
    schema: VERDICT_SCHEMA,
  });
  if (!reply.ok) return false;
  try {
    const verdict = Verdict.parse(JSON.parse(reply.text));
    return verdict.safe && !verdict.joke;
  } catch {
    return false;
  }
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

/** One blind solve: the model reads the task as the player does, buttons and picture included, and the
 *  engine's checker reads its answer. Nothing marks the right option (REQ-7710). */
export async function solvesBlind(
  gateway: Gateway,
  bucket: string,
  template: Compiled,
  seed: Uint8Array,
  lang: Lang,
  frame: string,
): Promise<boolean> {
  const made = template.make(seed, lang);
  const shape = presentFramed(template, seed, lang, frame);
  const prompt = promptOf(lang);
  const labels = shape.options;
  const reply = await gateway.call({
    role: "LIVE_CHECK_MODEL",
    bucket,
    system: `${prompt.solve} ${prompt.formats[FORMAT[template.answer]]}`,
    user: [
      shape.text,
      ...(labels ?? []).map((l, i) => `${(i + 1).toString()}) ${l}`),
      ...(made.svg ? [made.svg] : []),
    ].join("\n"),
  });
  if (!reply.ok) return false;
  const raw = reply.text.trim();
  const values =
    shape.input.kind === "choice" ||
    shape.input.kind === "set" ||
    shape.input.kind === "order"
      ? shape.input.values
      : null;
  const entry = values
    ? (raw.match(/\d+/gu) ?? [])
        .map((n) => values[Number(n) - 1] ?? "")
        .join(",")
    : raw;
  return made.checker(entry).verdict === "correct";
}
