// TSK-0481: a template returns parameters, an answer and traps for a seed.
// `generate` draws candidate k from hash(baseSeed, k) until one passes valid(),
// the distinctness test and the reject predicate, or takes a fallback entry, so
// the same template, version and seed rebuild the same task (REQ-1202,
// REQ-1206, REQ-1208, REQ-1210, REQ-0830).
import { describe, expect, it } from "vitest";
import { Q } from "../../src/math/q.js";
import { baseSeed } from "../../src/math/rng.js";
import {
  checkTemplate,
  distinct,
  generate,
  rebuild,
  type Built,
  type Generation,
  type Template,
} from "../../src/engine/tasks/template.js";

interface Fraction {
  a: number;
  b: number;
}

/** A fraction `n/d` in `Q`; `Q.of` takes bigints, so the numbers convert here. */
const q = (n: number, d = 1): Q => Q.of(BigInt(n), BigInt(d));

const gcd = (a: bigint, b: bigint): bigint => {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x;
};

/** A fixture: the answer is a/b, and the traps are (a+1)/b and (a-1)/b. */
const fixture: Template<Fraction> = {
  id: "fixture.fraction",
  version: "1",
  inputClass: "fixture",
  answerKind: "fraction",
  draw: (rng) => ({ a: 1 + rng.int(20), b: 2 + rng.int(9) }),
  valid: (p) => p.a < p.b,
  solve: (p) => q(p.a, p.b),
  traps: (p) => [
    { id: "plus", value: q(p.a + 1, p.b) },
    { id: "minus", value: q(p.a - 1, p.b) },
  ],
  fallback: [
    { a: 1, b: 2 },
    { a: 1, b: 3 },
    { a: 2, b: 3 },
    { a: 1, b: 4 },
    { a: 3, b: 4 },
  ],
};

const base = (session: string): Uint8Array => baseSeed(session, "N1", 0);

/** `generate`, for a test that expects a task: the error state fails it. */
const produce = <P>(
  template: Template<P>,
  seed: Uint8Array,
  reject?: (built: Built<P>) => boolean,
): Exclude<Generation<P>, { status: "generation_error" }> => {
  const result = reject
    ? generate(template, seed, reject)
    : generate(template, seed);
  if (result.status === "generation_error") throw new Error(result.reason);
  return result;
};

describe("REQ-1202: the same template, version and seed rebuild the same task", () => {
  it("builds equal parameters, answer and traps twice", () => {
    const first = produce(fixture, base("sess-1"));
    const again = rebuild(fixture, first.effectiveSeed);
    expect(first.built).toEqual(again);
    expect(rebuild(fixture, first.effectiveSeed)).toEqual(again);
  });

  it("rebuilds a fallback task from its effective seed with no history", () => {
    const result = produce(fixture, base("sess-2"), () => true);
    expect(result.status).toBe("generation_fallback");
    expect(result.effectiveSeed).toMatch(/\/f\d+$/);
    expect(rebuild(fixture, result.effectiveSeed)).toEqual(result.built);
  });
});

describe("REQ-1208: a fallback entry takes over when sampling finds nothing", () => {
  const nothingValid: Template<Fraction> = { ...fixture, valid: () => false };

  it("draws exactly 1,000 candidates before it gives up", () => {
    let draws = 0;
    const counted: Template<Fraction> = {
      ...nothingValid,
      draw: (rng) => {
        draws++;
        return fixture.draw(rng);
      },
    };
    produce(counted, base("sess-9"));
    expect(draws).toBe(1000);
  });

  it("reports generation_fallback and takes the first entry when none is accepted", () => {
    const result = produce(nothingValid, base("sess-3"));
    expect(result.status).toBe("generation_fallback");
    expect(result.effectiveSeed).toMatch(/\/f0$/);
    expect(result.built.params).toEqual(fixture.fallback[0]);
  });

  it("takes the first fallback entry the predicate accepts", () => {
    const refuseFirstTwo = (c: { params: Fraction }) =>
      c.params.a === 1 && (c.params.b === 2 || c.params.b === 3);
    const result = produce(nothingValid, base("sess-4"), refuseFirstTwo);
    expect(result.status).toBe("generation_fallback");
    expect(result.effectiveSeed).toMatch(/\/f2$/);
  });

  it("reports generation_error when the template has no fallback list", () => {
    const empty: Template<Fraction> = { ...nothingValid, fallback: [] };
    expect(generate(empty, base("sess-5"))).toEqual({
      status: "generation_error",
      reason: "no_fallback",
    });
  });

  it("refuses a template whose fallback list is shorter than five", () => {
    const short: Template<Fraction> = {
      ...fixture,
      fallback: fixture.fallback.slice(0, 4),
    };
    expect(checkTemplate(short)).toContain("fallback_too_short");
  });

  it("refuses a fallback entry that valid() rejects", () => {
    const bad: Template<Fraction> = {
      ...fixture,
      fallback: [...fixture.fallback.slice(0, 4), { a: 3, b: 2 }],
    };
    expect(checkTemplate(bad)).toContain("fallback_invalid_4");
    expect(checkTemplate(fixture)).toEqual([]);
  });
});

describe("REQ-1206: every task meets the constraints its template sets", () => {
  const sevens: Template<Fraction> = {
    id: "fixture.sevens",
    version: "1",
    inputClass: "fixture",
    answerKind: "fraction",
    draw: (rng) => ({ a: 7 * (1 + rng.int(9)), b: 2 + rng.int(20) }),
    valid: (p) => p.a % 7 === 0 && gcd(BigInt(p.a), BigInt(p.b)) === 1n,
    solve: (p) => q(p.a, p.b),
    traps: (p) => [{ id: "plus", value: q(p.a + 1, p.b) }],
    fallback: [
      { a: 7, b: 2 },
      { a: 7, b: 3 },
      { a: 14, b: 3 },
      { a: 7, b: 4 },
      { a: 21, b: 4 },
    ],
  };

  it("holds divisibility by 7 and an irreducible fraction on 10,000 seeds", () => {
    for (let i = 0; i < 10_000; i++) {
      const result = produce(sevens, baseSeed(`prop-${i}`, "N1", 0));
      expect(result.status).not.toBe("generation_error");
      expect(result.built.params.a % 7).toBe(0);
      expect(gcd(result.built.answer.n, result.built.answer.d)).toBe(1n);
    }
  });
});

describe("REQ-1210: a trap equal to the answer or to another trap is rejected", () => {
  it("compares values, so 2/4 and 1/2 are one value", () => {
    expect(distinct(q(1, 2), [{ id: "t", value: q(2, 4) }])).toBe(false);
    expect(
      distinct(q(1, 2), [
        { id: "a", value: q(1, 3) },
        { id: "b", value: q(2, 6) },
      ]),
    ).toBe(false);
    expect(distinct(q(1, 2), [{ id: "t", value: q(1, 3) }])).toBe(true);
  });

  it("never returns a candidate whose trap equals the answer", () => {
    const doubled: Template<Fraction> = {
      ...fixture,
      traps: (p) => [{ id: "same", value: q(2 * p.a, 2 * p.b) }],
    };
    const result = produce(doubled, base("sess-6"));
    expect(result.status).toBe("generation_fallback");
    expect(result.effectiveSeed).toMatch(/\/f\d+$/);
  });
});

describe("REQ-0830: consecutive mental arithmetic tasks never share an answer", () => {
  it("refuses a candidate whose answer equals the previous task's answer", () => {
    const previous = produce(fixture, base("sess-7"));
    const next = produce(fixture, base("sess-8"), (c) =>
      c.answer.eq(previous.built.answer),
    );
    expect(next.status).toBe("ok");
    expect(next.built.answer.eq(previous.built.answer)).toBe(false);
    expect(next.effectiveSeed).not.toBe(previous.effectiveSeed);
  });
});
