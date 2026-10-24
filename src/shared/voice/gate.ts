// The text gate (ADR-0160, SPC-0160, TSK-0681): one function checks a text against the one list in
// content/shaming.ru.json and returns a pass, or the rule and the match that failed. It is the only
// reader of the list, so every check reads the same words (REQ-3328). A blocked text returns the
// rule and the match, never the list.
import { readFileSync } from "node:fs";

export type Kind = "story" | "system" | "label" | "task";
export type Rule =
  | "forbidden_form"
  | "forbidden_phrase"
  | "shortage_phrase"
  | "rejected_label"
  | "system_punctuation"
  | "system_digit"
  | "emoji";

export type GateResult =
  { ok: true } | { ok: false; rule: Rule; match: string };

export interface GateInput {
  readonly lang: "ru";
  readonly kind: Kind;
  /** Where the text came from: `player` is exempt, as is any key under `parent.`. */
  readonly source: string;
  /** The string key, where the text is a fixed string. */
  readonly key?: string;
}

interface ListFile {
  forms: { forms: string[] }[];
  phrases: { runs: string[][] }[];
  shortage: { runs: string[][] }[];
  rejectedLabels: string[];
  knot: { keys: string[]; forms: string[] };
}

const list = JSON.parse(
  readFileSync(
    new URL("../../../content/shaming.ru.json", import.meta.url),
    "utf8",
  ),
) as ListFile;

/** Latin letters that look like Cyrillic ones; folded only inside a token that mixes both scripts. */
const LOOKALIKE: Record<string, string> = {
  a: "\u0430",
  c: "\u0441",
  e: "\u0435",
  o: "\u043e",
  p: "\u0440",
  x: "\u0445",
  y: "\u0443",
  k: "\u043a",
  m: "\u043c",
  h: "\u043d",
  t: "\u0442",
  b: "\u0432",
};

const INVISIBLE = new RegExp(
  "[\u00AD\u200B-\u200D\u2060\uFEFF\u0300\u0301]",
  "g",
);

/** NFC, lower case, the letter yo read as ye, and no soft hyphen, zero-width character or stress mark (REQ-3328). */
export function normalise(text: string): string {
  return text
    .normalize("NFD")
    .replace(INVISIBLE, "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/\u0451/g, "\u0435");
}

/** The word tokens of a text, with Latin look-alikes folded in a token that also holds Cyrillic. */
export function tokens(text: string): string[] {
  return (normalise(text).match(/\p{L}+/gu) ?? []).map((token) =>
    /\p{Script=Cyrillic}/u.test(token) && /\p{Script=Latin}/u.test(token)
      ? [...token].map((ch) => LOOKALIKE[ch] ?? ch).join("")
      : token,
  );
}

const formSet = new Set(list.forms.flatMap((e) => e.forms));
const runsOf = (groups: { runs: string[][] }[]): Map<string, string[][]> => {
  const byFirst = new Map<string, string[][]>();
  for (const run of groups.flatMap((g) => g.runs)) {
    const first = run[0];
    if (first !== undefined)
      byFirst.set(first, [...(byFirst.get(first) ?? []), run]);
  }
  return byFirst;
};
const phraseRuns = runsOf(list.phrases);
const shortageRuns = runsOf(list.shortage);
const rejected = new Set(list.rejectedLabels.map((l) => normalise(l).trim()));

const matchRun = (
  words: readonly string[],
  at: number,
  byFirst: Map<string, string[][]>,
): string | undefined => {
  for (const run of byFirst.get(words[at] ?? "") ?? [])
    if (run.every((w, i) => words[at + i] === w)) return run.join(" ");
  return undefined;
};

const fail = (rule: Rule, match: string): GateResult => ({
  ok: false,
  rule,
  match,
});

/** Checks a text against the list; the player's own words and the Parent Room are exempt (REQ-3328). */
export function textGate(text: string, input: GateInput): GateResult {
  if (input.source === "player" || input.key?.startsWith("parent."))
    return { ok: true };
  const emoji = /\p{Extended_Pictographic}/u.exec(text);
  if (emoji) return fail("emoji", emoji[0]);
  if (input.kind === "system") {
    if (text.includes("!")) return fail("system_punctuation", "!");
    const digit = /\d/.exec(text);
    if (digit) return fail("system_digit", digit[0]);
  }
  if (input.kind === "label" && rejected.has(normalise(text).trim()))
    return fail("rejected_label", text.trim());
  const words = tokens(text);
  for (let i = 0; i < words.length; i += 1) {
    const phrase = matchRun(words, i, phraseRuns);
    if (phrase) return fail("forbidden_phrase", phrase);
    const shortage = matchRun(words, i, shortageRuns);
    if (shortage) return fail("shortage_phrase", shortage);
    const word = words[i] as string;
    if (formSet.has(word)) return fail("forbidden_form", word);
  }
  return { ok: true };
}

/**
 * The keys whose value calls a knot by the diminutive word for it (REQ-3320): only the knot's own keys are
 * checked, and the same form in another key passes. Returns the key and the match.
 */
export function knotViolations(
  entries: Readonly<Record<string, string>>,
): { key: string; match: string }[] {
  const knotForms = new Set(list.knot.forms);
  const found: { key: string; match: string }[] = [];
  for (const [key, value] of Object.entries(entries)) {
    if (!list.knot.keys.some((prefix) => key.startsWith(prefix))) continue;
    const hit = tokens(value).find((w) => knotForms.has(w));
    if (hit) found.push({ key, match: hit });
  }
  return found;
}

/** The rejected labels of REQ-3312 and the shapes of a time left, for the label check. */
export const labelRules = (): { labels: string[]; patterns: RegExp[] } => ({
  labels: [...rejected],
  patterns: (
    JSON.parse(
      readFileSync(
        new URL("../../../content/shaming.ru.json", import.meta.url),
        "utf8",
      ),
    ) as { labelPatterns: string[] }
  ).labelPatterns.map((p) => new RegExp(p, "iu")),
});
