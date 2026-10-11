// TSK-0491: the parallel task of a second attempt keeps the original's difficulty
// and changes its given numbers and its correct answer. When the template has no
// such task within 1,000 candidates, the result is twin_unavailable and the
// second attempt is skipped (REQ-1224, ADR-0080).
import { describe, expect, it } from "vitest";
import { Q } from "../../src/math/q.js";
import { baseSeed } from "../../src/math/rng.js";
import { generate, type Template } from "../../src/engine/tasks/template.js";
import { sampleParallel } from "../../src/engine/tasks/parallel.js";

interface Fraction {
  a: number;
  b: number;
}

const q = (n: number, d = 1): Q => Q.of(BigInt(n), BigInt(d));

/** The given numbers are a and b; the answer is a/b. */
const fixture: Template<Fraction> = {
  id: "fixture.parallel",
  version: "1",
  inputClass: "fixture",
  answerKind: "fraction",
  draw: (rng) => ({ a: 1 + rng.int(20), b: 2 + rng.int(9) }),
  valid: (p) => p.a < p.b,
  solve: (p) => q(p.a, p.b),
  traps: (p) => [{ id: "plus", value: q(p.a + 1, p.b) }],
  fallback: [
    { a: 1, b: 2 },
    { a: 1, b: 3 },
    { a: 2, b: 3 },
    { a: 1, b: 4 },
    { a: 3, b: 4 },
  ],
};

/** Difficulty is a bucket of the denominator: easy up to 5, hard above. */
const difficulty = (p: Fraction): number => (p.b > 5 ? 1 : 0);

describe("REQ-1224: the parallel task keeps the difficulty and changes the numbers and the answer", () => {
  it("on 1,000 seeds keeps the difficulty and changes the given numbers and the answer", () => {
    for (let i = 0; i < 1000; i++) {
      const base = baseSeed(`par-${i}`, "N1", 0);
      const original = generate(fixture, base);
      if (original.status === "generation_error")
        throw new Error("no original");
      const twin = sampleParallel(fixture, base, original.built, difficulty);
      expect(twin.status).toBe("ok");
      if (twin.status !== "ok") continue;
      expect(difficulty(twin.built.params)).toBe(
        difficulty(original.built.params),
      );
      const sameSet =
        [twin.built.params.a, twin.built.params.b].sort().join(",") ===
        [original.built.params.a, original.built.params.b].sort().join(",");
      expect(sameSet).toBe(false);
      expect(twin.built.answer.eq(original.built.answer)).toBe(false);
    }
  });
});

describe("REQ-1224: a template with one parameter set has no parallel task", () => {
  it("returns twin_unavailable after 1,000 candidates", () => {
    const single: Template<Fraction> = {
      ...fixture,
      draw: () => ({ a: 1, b: 2 }),
      fallback: [
        { a: 1, b: 2 },
        { a: 1, b: 3 },
        { a: 2, b: 3 },
        { a: 1, b: 4 },
        { a: 3, b: 4 },
      ],
    };
    const base = baseSeed("single", "N1", 0);
    const original = generate(single, base);
    if (original.status === "generation_error") throw new Error("no original");
    expect(sampleParallel(single, base, original.built, difficulty)).toEqual({
      status: "twin_unavailable",
    });
  });
});
