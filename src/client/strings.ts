// Player-facing strings, from the server's per-language file (CLAUDE.md):
// the client holds no text of its own, so a second language needs no code.
import type { Key, StringParams } from "../shared/i18n-keys.js";

let strings: Record<string, string> = {};

export async function loadStrings(lang: string): Promise<void> {
  const res = await fetch(`/i18n/${lang}.json`);
  strings = (await res.json()) as Record<string, string>;
}

export type UiKey = Extract<Key, `ui.${string}`>;

/** A key built at run time, such as `ui.reward.<kind>`; a key the file lacks is reported when it is read. */
export const uiKey = (candidate: string): UiKey => candidate as UiKey;
type Args<K extends UiKey> = keyof StringParams[K] extends never
  ? [vars?: StringParams[K]]
  : [vars: StringParams[K]];

/** The string for `key`, with each `{name}` replaced from `vars`; the key and its parameters are typed. */
export function t<K extends UiKey>(key: K, ...args: Args<K>): string {
  const vars = args[0] as Record<string, string | number> | undefined;
  const value = strings[key];
  if (value === undefined) {
    console.error(`string_missing: ${key}`);
    return key;
  }
  return value.replace(/\{(\w+)\}/g, (whole, name: string) =>
    vars?.[name] === undefined ? whole : String(vars[name]),
  );
}

/** A time of day as the player's language writes it, such as 14:32. */
export function clock(at: Date): string {
  return at.toLocaleTimeString(document.documentElement.lang || "ru", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
