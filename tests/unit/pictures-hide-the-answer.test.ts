// REQ-7546: a picture shows what the task gives and never writes what it asks.
import { describe, expect, it } from "vitest";
import { templates } from "../../src/templates/index.js";

const seedOf = (i: number): Uint8Array =>
  Uint8Array.from({ length: 32 }, (_, k) => (i * 41 + k * 3) % 256);
const plain = (text: string): string =>
  text.replace(/[\s ]/g, "").replace("−", "-").replace("/", "⁄");
const NUMBERS = /\d+(?:[  ]\d{3})*(?:,\d+)?(?:⁄\d+)?/g;

/** A scale whose numbers are the tool of the task: the axes of a grid, a line, a ruler or a thermometer. */
const SCALES = /^(G3\.symmetry\.02|G4\.|G7\.plan-1S\.09|M13\.)/;

describe("a picture", () => {
  it("does not write the answer", () => {
    const leaks = new Set<string>();
    for (const t of templates) {
      if (SCALES.test(t.id)) continue;
      for (let i = 0; i < 30; i += 1) {
        const made = t.make(seedOf(i));
        if (!made.svg) continue;
        const labels = [
          ...made.svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g),
        ].map((m) => plain(m[1] ?? ""));
        const given = (
          `${made.text} ${(made.options ?? []).join(" ")}`.match(NUMBERS) ?? []
        ).map(plain);
        const answer = plain(made.entry);
        if (labels.includes(answer) && !given.includes(answer)) leaks.add(t.id);
      }
    }
    expect([...leaks]).toEqual([]);
  });
});
