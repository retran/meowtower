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

export type GateLang = "ru" | "en" | "nl";

export interface GateInput {
  readonly lang: GateLang;
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
  labelPatterns: string[];
  knot: { keys: string[]; forms: string[] };
}

const listOf = (lang: GateLang): ListFile =>
  JSON.parse(
    readFileSync(
      new URL(`../../../content/shaming.${lang}.json`, import.meta.url),
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

const runsOf = (groups: { runs: string[][] }[]): Map<string, string[][]> => {
  const byFirst = new Map<string, string[][]>();
  for (const run of groups.flatMap((g) => g.runs)) {
    const first = run[0];
    if (first !== undefined)
      byFirst.set(first, [...(byFirst.get(first) ?? []), run]);
  }
  return byFirst;
};

interface GateList {
  readonly forms: ReadonlySet<string>;
  readonly phrases: Map<string, string[][]>;
  readonly shortage: Map<string, string[][]>;
  readonly labels: readonly RegExp[];
  readonly rejected: ReadonlySet<string>;
}

const lists = new Map<GateLang, GateList>();

/** One list a language, read once. A person reads each list; only the Russian one gates fixed labels. */
function gateList(lang: GateLang): GateList {
  const hit = lists.get(lang);
  if (hit) return hit;
  const file = listOf(lang);
  const gate: GateList = {
    forms: new Set(file.forms.flatMap((e) => e.forms)),
    phrases: runsOf(file.phrases),
    shortage: runsOf(file.shortage),
    labels: file.labelPatterns.map((p) => new RegExp(p, "iu")),
    rejected: new Set(file.rejectedLabels.map((l) => normalise(l).trim())),
  };
  lists.set(lang, gate);
  return gate;
}

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
  const list = gateList(input.lang);
  const emoji = /\p{Extended_Pictographic}/u.exec(text);
  if (emoji) return fail("emoji", emoji[0]);
  if (input.kind === "system") {
    if (text.includes("!")) return fail("system_punctuation", "!");
    const digit = /\d/.exec(text);
    if (digit) return fail("system_digit", digit[0]);
  }
  if (input.kind === "label") {
    const folded = normalise(text).trim();
    if (list.rejected.has(folded)) return fail("rejected_label", text.trim());
    // A time left is a clock, so a count of minutes left is refused as a label (REQ-3312).
    const clock = list.labels.map((re) => re.exec(folded)).find(Boolean);
    if (clock) return fail("rejected_label", clock[0]);
  }
  const words = tokens(text);
  for (let i = 0; i < words.length; i += 1) {
    const phrase = matchRun(words, i, list.phrases);
    if (phrase) return fail("forbidden_phrase", phrase);
    const shortage = matchRun(words, i, list.shortage);
    if (shortage) return fail("shortage_phrase", shortage);
    const word = words[i] as string;
    if (list.forms.has(word)) return fail("forbidden_form", word);
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
  const { knot } = listOf("ru");
  const knotForms = new Set(knot.forms);
  const found: { key: string; match: string }[] = [];
  for (const [key, value] of Object.entries(entries)) {
    if (!knot.keys.some((prefix) => key.startsWith(prefix))) continue;
    const hit = tokens(value).find((w) => knotForms.has(w));
    if (hit) found.push({ key, match: hit });
  }
  return found;
}
