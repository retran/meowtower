import { readFileSync } from "node:fs";
import type { Key, LinesKey, PluralKey, StringParams } from "./i18n-keys.js";

// Every player-facing string lives in content/i18n/<lang>.json (ADR-0160). The key and parameter
// types come from the Russian file (tools/gen-keys.ts), so a missing key or a missing placeholder
// value fails `tsc` at the call (REQ-3810).

/** The languages the server ships; a language is added only when its keys match Russian. */
export const SHIPPED = ["ru", "en", "nl"] as const;
export type Lang = (typeof SHIPPED)[number];
export let lang: Lang = "ru";

/** Chooses the language of the server's strings, as the parent set it. */
export const setLang = (chosen: Lang): void => {
  lang = chosen;
};

export const isShipped = (candidate: string): candidate is Lang =>
  (SHIPPED as readonly string[]).includes(candidate);

type Plural = Record<"one" | "few" | "many" | "other", string>;
export type Line = string | { pause: string };
type Value = string | Plural | Line[];

const read = (code: string): Record<string, Value> =>
  JSON.parse(
    readFileSync(
      new URL(`../../content/i18n/${code}.json`, import.meta.url),
      "utf8",
    ),
  ) as Record<string, Value>;

const files: Record<Lang, Record<string, Value>> = {
  ru: read("ru"),
  en: read("en"),
  nl: read("nl"),
};

type ParamArgs<K extends Key> = keyof StringParams[K] extends never
  ? [params?: StringParams[K]]
  : [params: StringParams[K]];

const fill = (
  text: string,
  params: Record<string, string | number> | undefined,
): string =>
  text.replace(/\{(\w+)\}/g, (whole, name: string) =>
    params?.[name] === undefined ? whole : String(params[name]),
  );

/** The value of `key` in `language`; a key the language lacks falls back to Russian and is logged. */
function valueOf(language: Lang, key: string): Value {
  const own = files[language][key];
  if (own !== undefined) return own;
  const fallback = files.ru[key];
  if (fallback === undefined) throw new Error(`string_missing: ${key}`);
  console.error(`string_missing: ${key} in ${language}`);
  return fallback;
}

/** `Intl.PluralRules` picks the form for `n` in the language (REQ-3810). */
function pluralForm(language: Lang, value: Plural, n: number): string {
  return value[new Intl.PluralRules(language).select(n) as keyof Plural];
}

/** A string value, or a plural value for `n`, with its placeholders filled. */
export function renderValue(
  value: Value,
  language: Lang,
  params: Record<string, string | number> | undefined,
  key = "value",
): string {
  if (typeof value === "string") return fill(value, params);
  if (Array.isArray(value)) throw new Error(`string_is_lines: ${key}`);
  return fill(pluralForm(language, value, Number(params?.["n"] ?? 0)), params);
}

/** The lines of a System message; the self-correction carries the pause mark and no other line does. */
export function renderLines(
  value: Value,
  params: Record<string, string | number> | undefined,
  key = "value",
): { text: string; pause: boolean }[] {
  if (!Array.isArray(value)) throw new Error(`string_is_not_lines: ${key}`);
  return value.map((line) =>
    typeof line === "string"
      ? { text: fill(line, params), pause: false }
      : { text: fill(line.pause, params), pause: true },
  );
}

/** A function that renders keys in one language. */
export function translator(language: Lang) {
  return {
    /** The string for `key` with its placeholders filled; a plural key takes `n` and picks the form. */
    t<K extends Exclude<Key, LinesKey>>(key: K, ...args: ParamArgs<K>): string {
      const params = args[0] as Record<string, string | number> | undefined;
      return renderValue(valueOf(language, key), language, params, key);
    },
    /** A System message: each line, with the self-correction marked as a pause (REQ-3304). */
    lines<K extends LinesKey>(
      key: K,
      ...args: ParamArgs<K>
    ): { text: string; pause: boolean }[] {
      const params = args[0] as Record<string, string | number> | undefined;
      return renderLines(valueOf(language, key), params, key);
    },
  };
}

/** The string for `key` in the language the parent set. */
export const t: ReturnType<typeof translator>["t"] = (key, ...args) =>
  translator(lang).t(key, ...args);
/** A System message in the language the parent set. */
export const lines: ReturnType<typeof translator>["lines"] = (key, ...args) =>
  translator(lang).lines(key, ...args);

/** Keys whose value is a plain string with no placeholder. */
export type PlainKey = {
  [K in Exclude<Key, LinesKey | PluralKey>]: keyof StringParams[K] extends never
    ? K
    : never;
}[Exclude<Key, LinesKey | PluralKey>];

/**
 * A key built at run time, checked against the file: it must exist and be a plain string with no
 * placeholder, so the call needs no parameters and cannot miss one.
 */
export function keyFor(candidate: string): PlainKey {
  const value = files.ru[candidate];
  if (value === undefined) throw new Error(`string_missing: ${candidate}`);
  if (typeof value !== "string" || names(value).length > 0)
    throw new Error(`string_not_plain: ${candidate}`);
  return candidate as PlainKey;
}

export type { Key, PluralKey, LinesKey };

/** The strings the client shell shows: the `ui.` keys only, because the file
 *  also holds task texts and short solutions no client may read early. */
export function uiStrings(): Record<string, string> {
  return Object.fromEntries(
    Object.entries({ ...files.ru, ...files[lang] }).filter(
      (entry): entry is [string, string] =>
        entry[0].startsWith("ui.") && typeof entry[1] === "string",
    ),
  );
}

const names = (value: Value): string[] => {
  const texts = Array.isArray(value)
    ? value.map((l) => (typeof l === "string" ? l : l.pause))
    : typeof value === "string"
      ? [value]
      : Object.values(value);
  return [
    ...new Set(
      texts.flatMap((x) =>
        [...x.matchAll(/\{(\w+)\}/g)].map((m) => m[1] as string),
      ),
    ),
  ].sort();
};

export interface ParityProblem {
  readonly language: string;
  readonly key: string;
  /** The placeholder the language lacks; absent when the whole key is missing. */
  readonly placeholder?: string;
}

/**
 * Compares a language file with the reference: every reference key must exist and carry every
 * placeholder. A language with a problem is not shipped and the profile can't select it (REQ-3810).
 */
export function checkParity(
  reference: Record<string, Value>,
  other: Record<string, Value>,
  language: string,
): ParityProblem[] {
  const problems: ParityProblem[] = [];
  for (const [key, value] of Object.entries(reference)) {
    const mine = other[key];
    if (mine === undefined) {
      problems.push({ language, key });
      continue;
    }
    const have = new Set(names(mine));
    for (const placeholder of names(value))
      if (!have.has(placeholder)) problems.push({ language, key, placeholder });
  }
  return problems;
}
