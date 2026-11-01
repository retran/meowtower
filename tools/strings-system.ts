// Prints each `system.*` key with its lines in order and nothing else (ADR-0160, TSK-0679,
// REQ-3300), so the parent reads the whole section in a terminal at the stage acceptance.
//   npm run strings:system
import { readFileSync } from "node:fs";
import { stringsOf } from "./gate-content.js";

type Entry = unknown;

/** The text the parent reads: each `system.*` key, then its lines, one to a row. */
export function systemSection(file: Record<string, Entry>): string[] {
  return Object.entries(file)
    .filter(([key]) => key.startsWith("system."))
    .flatMap(([key, value]) => [
      key,
      ...stringsOf(value).map((line) => `  ${line}`),
    ]);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ru = JSON.parse(
    readFileSync(new URL("../content/i18n/ru.json", import.meta.url), "utf8"),
  ) as Record<string, Entry>;
  console.log(systemSection(ru).join("\n"));
}
