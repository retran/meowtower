// The checks of a live frame (ADR-3100): code first, then the safety question, then the blind solves.
import { readFileSync } from "node:fs";
import { z } from "zod";
import type { Gateway } from "../gateway/gateway.js";
import { textGate } from "../../shared/voice/gate.js";
import type { Lang } from "../../templates/spec.js";
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

/** Doubt counts as a no: Jev reads languages other than English less well (ADR-3210). */
const UNSAFE_AT = 0.2;
const JOKE_AT = 0.5;
const CHANGED_AT = 0.2;

const Answers = z.record(
  z.string(),
  z.union([
    z.number(),
    z.object({
      choice: z.string(),
      probabilities: z.record(z.string(), z.number()).optional(),
    }),
  ]),
);

export interface Judged {
  /** The variant chosen, or null when none passed. */
  readonly best: string | null;
  readonly rejected: readonly string[];
  readonly unused: readonly string[];
}

/** One request checks every variant against the template and chooses the best (REQ-3600, REQ-7750).
 *  Null means the judge failed, and the task keeps its template text. */
export async function judged(
  gateway: Gateway,
  bucket: string,
  variants: readonly string[],
  blank: string,
  lang: Lang,
): Promise<Judged | null> {
  const { judge } = promptOf(lang);
  const names = variants.map((_, i) => String(i + 1));
  const ask = (text: string, n: string): string => text.replace("{n}", n);
  const reply = await gateway.call({
    role: "FRAME_JUDGE_MODEL",
    bucket,
    system: "",
    user: [
      ...variants.map((v, i) => `${judge.variant} ${names[i] ?? ""}: ${v}`),
      "---",
      blank,
    ].join("\n"),
    questions: {
      ...Object.fromEntries(
        names.flatMap((n) => [
          [`unsafe_${n}`, ask(judge.unsafe, n)],
          [`joke_${n}`, ask(judge.joke, n)],
          [`changed_${n}`, ask(judge.changed, n)],
        ]),
      ),
      best: {
        instructions: judge.best,
        criteria: Object.fromEntries(
          names.map((n) => [`variant_${n}`, `${judge.variant} ${n}`]),
        ),
      },
    },
  });
  if (!reply.ok) return null;
  const parsed = Answers.safeParse(JSON.parse(reply.text));
  if (!parsed.success) return null;
  const answers = parsed.data;
  const below = (key: string, limit: number): boolean | null => {
    const value = answers[key];
    return typeof value === "number" ? value < limit : null;
  };
  const passes = names.map((n) => {
    const all = [
      below(`unsafe_${n}`, UNSAFE_AT),
      below(`joke_${n}`, JOKE_AT),
      below(`changed_${n}`, CHANGED_AT),
    ];
    return all.includes(null) ? null : all.every(Boolean);
  });
  if (passes.includes(null)) return null;
  const best = answers["best"];
  if (best === undefined || typeof best === "number") return null;
  const chance = (i: number): number =>
    best.probabilities?.[`variant_${names[i] ?? ""}`] ?? 0;
  const passing = names.flatMap((_, i) => (passes[i] ? [i] : []));
  // The choice stands when its variant passed; otherwise the likeliest variant that did.
  const chosen = passing.includes(
    names.indexOf(best.choice.replace("variant_", "")),
  )
    ? names.indexOf(best.choice.replace("variant_", ""))
    : [...passing].sort((a, b) => chance(b) - chance(a))[0];
  return {
    best: chosen === undefined ? null : (variants[chosen] ?? null),
    rejected: variants.filter((_, i) => !passes[i]),
    unused: variants.filter((_, i) => passes[i] && i !== chosen),
  };
}
