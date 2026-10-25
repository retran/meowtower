import { describe, expect, it } from "vitest";
import { templates } from "../../src/templates/index.js";
import { strayIn } from "../../src/templates/spec.js";

const compiled = templates;
const SEEDS = 200;
const seedOf = (i: number): Uint8Array =>
  Uint8Array.from({ length: 32 }, (_, k) => (i * 31 + k * 7) % 256);

describe("domain N templates", () => {
  it("holds at least ten templates for each subtype", () => {
    for (const subtype of [
      "compare",
      "before-after",
      "compose",
      "words-digits",
      "compare-six",
    ]) {
      expect(
        compiled.filter((c) => c.subtype === subtype).length,
      ).toBeGreaterThanOrEqual(10);
    }
  });

  it("gives every template its own id and form", () => {
    expect(new Set(compiled.map((c) => c.id)).size).toBe(compiled.length);
    expect(new Set(compiled.map((c) => c.form)).size).toBe(compiled.length);
  });

  it("keeps the groups inside 1 to 8", () => {
    for (const c of compiled) {
      expect(c.groups[0]).toBeGreaterThanOrEqual(1);
      expect(c.groups[1]).toBeLessThanOrEqual(8);
      expect(c.groups[0]).toBeLessThanOrEqual(c.groups[1]);
    }
  });

  for (const c of compiled) {
    describe(c.id, () => {
      it("agrees with its second route and accepts its own answer", () => {
        for (let i = 0; i < SEEDS; i += 1) {
          const made = c.make(seedOf(i));
          expect(made.referenceAgrees).toBe(true);
          expect(made.checker(made.entry).verdict).toBe("correct");
        }
      });

      it("rejects every trap answer and gives each a different one", () => {
        for (let i = 0; i < SEEDS; i += 1) {
          const made = c.make(seedOf(i));
          for (const t of made.traps) {
            expect(made.checker(t.entry).verdict).not.toBe("correct");
            expect(t.explanation.length).toBeGreaterThan(0);
          }
          expect(new Set(made.traps.map((t) => t.entry)).size).toBe(
            made.traps.length,
          );
        }
      });

      it("states no number its task does not hold", () => {
        for (let i = 0; i < SEEDS; i += 1) {
          expect(strayIn(c.make(seedOf(i)))).toEqual([]);
        }
      });

      it("rebuilds the same task from the same seed and varies with the seed", () => {
        const a = c.make(seedOf(1));
        const b = c.make(seedOf(1));
        expect(b.text).toBe(a.text);
        expect(b.entry).toBe(a.entry);
        const keys = new Set(
          Array.from({ length: 30 }, (_, i) => c.make(seedOf(i)).paramsKey),
        );
        expect(keys.size).toBeGreaterThan(3);
      });
    });
  }
});
