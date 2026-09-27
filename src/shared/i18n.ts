import { readFileSync } from "node:fs";

// Every player-facing string lives in content/i18n/<lang>.json (ADR-0160);
// Russian is the only language shipped for now.
const strings = JSON.parse(
  readFileSync(new URL("../../content/i18n/ru.json", import.meta.url), "utf8"),
) as Record<string, string>;

export const lang = "ru";

/** The string for `key`, with each `{name}` replaced from `vars`. */
export function t(key: string, vars: Record<string, string> = {}): string {
  const value = strings[key];
  if (value === undefined) throw new Error(`string_missing: ${key}`);
  return value.replace(
    /\{(\w+)\}/g,
    (whole, name: string) => vars[name] ?? whole,
  );
}

/** The strings the client shell shows: the `ui.` keys only, because the file
 *  also holds task texts and short solutions no client may read early. */
export function uiStrings(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(strings).filter(([key]) => key.startsWith("ui.")),
  );
}
