import { readFileSync } from "node:fs";

// Every player-facing string lives in content/i18n/<lang>.json (ADR-0160);
// Russian is the only language shipped for now.
const strings = JSON.parse(
  readFileSync(new URL("../../content/i18n/ru.json", import.meta.url), "utf8"),
) as Record<string, string>;

export const lang = "ru";

export function t(key: string): string {
  const value = strings[key];
  if (value === undefined) throw new Error(`string_missing: ${key}`);
  return value;
}
