// The checks of a live frame (ADR-3100): code first, then the safety question, then the blind solves.
import { readFileSync } from "node:fs";
import { z } from "zod";
import type { Gateway } from "../gateway/gateway.js";
import { textGate } from "../../shared/voice/gate.js";
import type { Compiled, Lang } from "../../templates/spec.js";
import { MAX_SENTENCES, MAX_WORDS, promptOf } from "./request.js";

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
  if (/\d/u.test(bare)) return "digit";
  const words = bare.toLowerCase().match(/\p{L}+/gu) ?? [];
  const lexicon = numeralsOf(lang);
  if (words.some((w) => lexicon.has(w))) return "number_word";
  const sentences = frame
    .split(/(?<=[.!?…])\s+/u)
    .filter((s) => s.trim() !== "");
  if (
    sentences.length > MAX_SENTENCES ||
    sentences.some((s) => s.trim().split(/\s+/u).length > MAX_WORDS)
  )
    return "length";
  if (
    lang === "ru" &&
    !textGate(bare, { lang, kind: "task", source: "frame" }).ok
  )
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

/** One blind solve: the model reads the filled text alone, and the engine's checker reads its answer. */
export async function solvesBlind(
  gateway: Gateway,
  bucket: string,
  template: Compiled,
  seed: Uint8Array,
  lang: Lang,
  frame: string,
): Promise<boolean> {
  const made = template.make(seed, lang, frame);
  const reply = await gateway.call({
    role: "LIVE_CHECK_MODEL",
    bucket,
    system: promptOf(lang).solve,
    user: made.text,
  });
  return reply.ok && made.checker(reply.text.trim()).verdict === "correct";
}
