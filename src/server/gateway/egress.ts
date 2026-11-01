// The egress guard's cleaning (ADR-0100, SPC-0100): names the parent set and contact details leave the
// Mac only as neutral labels, which live in a content file with the street words they match.
import { readFileSync } from "node:fs";

const { labels, streetWords } = JSON.parse(
  readFileSync(
    new URL("../../../content/frames/egress.json", import.meta.url),
    "utf8",
  ),
) as {
  labels: Record<"name" | "mail" | "address" | "phone", string>;
  streetWords: string[];
};

const PATTERNS: readonly (readonly [RegExp, string])[] = [
  [/[\p{L}\p{N}._%+-]+@[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)+/gu, labels.mail],
  [/\b\d{4} ?[A-Z]{2}\b/g, labels.address],
  [
    new RegExp(
      `(?:${streetWords.join("|")}|\\p{L}+(?:straat|laan|weg|plein|gracht))\\s+\\d+\\p{L}?`,
      "giu",
    ),
    labels.address,
  ],
  [/(?<![\p{N}])(?:\+|0|8)[\d ().-]{8,}\d/gu, labels.phone],
];

export function cleanEgress(text: string, names: readonly string[]): string {
  const named = names.reduce(
    (t, name) =>
      t.replace(
        new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "giu"),
        labels.name,
      ),
    text,
  );
  return PATTERNS.reduce((t, [re, label]) => t.replace(re, label), named);
}
