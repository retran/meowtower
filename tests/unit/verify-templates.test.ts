// TSK-0493: the verification run reports each check and flags a template that
// breaks it. Each planted fault below must be caught (ADR-0040's criteria 1, 9
// and 11).
import { describe, expect, it } from "vitest";
import { Q } from "../../src/math/q.js";
import type { Template } from "../../src/engine/tasks/template.js";
import { verifyTemplate } from "../../tools/verify-templates.js";

interface Pair {
  a: number;
  b: number;
}

const q = (n: number, d = 1): Q => Q.of(BigInt(n), BigInt(d));

const good: Template<Pair> = {
  id: "fixture.sum",
  version: "1",
  inputClass: "fixture",
  answerKind: "number",
  draw: (rng) => ({ a: 1 + rng.int(20), b: 1 + rng.int(20) }),
  valid: () => true,
  solve: (p) => q(p.a + p.b),
  traps: () => [],
  fallback: [
    { a: 1, b: 1 },
    { a: 2, b: 2 },
    { a: 3, b: 3 },
    { a: 4, b: 4 },
    { a: 5, b: 5 },
  ],
};
const render = (built: { params: Pair; answer: Q }) => ({
  texts: [`Сложи ${built.params.a} и ${built.params.b}.`],
  solution: [
    `${built.params.a} + ${built.params.b} = ${built.answer.toString()}`,
  ],
});
const SEEDS = 300;

describe("ADR-0040 criterion 1: a clean template reports no findings", () => {
  it("passes the fixture", () => {
    const r = verifyTemplate(good, "add", render, SEEDS);
    expect(r.findings).toEqual([]);
    expect(r.invalid + r.disagreements + r.equalTraps + r.foreignNumbers).toBe(
      0,
    );
  });
});

describe("ADR-0040 criterion 1: each planted fault is caught", () => {
  it("catches a solver that disagrees with the reference", () => {
    const wrong: Template<Pair> = { ...good, solve: (p) => q(p.a + p.b + 1) };
    expect(verifyTemplate(wrong, "add", render, SEEDS).disagreements).toBe(
      SEEDS,
    );
  });

  it("catches parameters that fail valid()", () => {
    const invalid: Template<Pair> = { ...good, valid: () => false };
    const r = verifyTemplate(invalid, "add", render, SEEDS);
    expect(r.invalid).toBeGreaterThan(0);
    expect(r.findings).toContain(`invalid ${r.invalid}`);
  });

  it("catches a number in the solution that the graph doesn't give", () => {
    const foreign = (built: { params: Pair; answer: Q }) => ({
      texts: [],
      solution: [`${built.params.a} + ${built.params.b} = 99`],
    });
    expect(verifyTemplate(good, "add", foreign, SEEDS).foreignNumbers).toBe(
      SEEDS,
    );
  });

  it("catches a text that breaks a rule of the text gate", () => {
    const bad = (built: { params: Pair; answer: Q }) => ({
      texts: [
        "Длина 2.5 метра, стоимость 5*2 рубля, ответ 1000 штук, 3/4 части.",
      ],
      solution: [
        `${built.params.a} + ${built.params.b} = ${built.answer.toString()}`,
      ],
    });
    expect(
      verifyTemplate(good, "add", bad, SEEDS).textFindings,
    ).toBeGreaterThan(0);
  });
});

describe("ADR-0040 criterion 11: a template whose fallback share exceeds 1 % is reported once", () => {
  it("reports a template that always takes a fallback entry", () => {
    const always: Template<Pair> = { ...good, valid: () => false };
    const r = verifyTemplate(always, "add", render, SEEDS);
    expect(r.fallbackShare).toBe(1);
    expect(
      r.findings.filter((f) => f.startsWith("fallback share")),
    ).toHaveLength(1);
  });
});
