// TSK-0484: a wrong answer is classified by the trap it equals, or as
// computational (one digit off, two digits swapped or a neighbouring times-table
// fact) or as unclassified. A choice task's wrong options are its traps' answers
// as far as they are distinct, and the rest are filled in close in form to the
// correct answer (REQ-0702, REQ-0704, REQ-0726, REQ-0728, REQ-0730).
import { describe, expect, it } from "vitest";
import { Q } from "../../src/math/q.js";
import { baseSeed, candidateSeed, Xoshiro128 } from "../../src/math/rng.js";
import {
  buildOptions,
  classify,
  type ClassifiableTask,
} from "../../src/engine/tasks/classify.js";

const q = (n: number, d = 1): Q => Q.of(BigInt(n), BigInt(d));

const twelve: ClassifiableTask = {
  answer: q(12),
  kind: "number",
  traps: [
    { id: "add", value: q(14) },
    { id: "skip", value: q(3) },
  ],
};

describe("REQ-0726: a wrong answer equal to a trap's answer is that trap's type", () => {
  it("classifies 14 as add and 3 as skip", () => {
    expect(classify(q(14), twelve)).toBe("add");
    expect(classify(q(3), twelve)).toBe("skip");
  });
});

describe("REQ-0728: a wrong answer one digit off, or with two digits swapped, is computational", () => {
  it("classifies 13 (one digit off) as computational", () => {
    expect(classify(q(13), twelve)).toBe("computational");
  });
  it("classifies 21 (the digits of 12 swapped) as computational", () => {
    expect(classify(q(21), twelve)).toBe("computational");
  });
});

describe("REQ-0730: a neighbouring times-table fact is computational", () => {
  const sixtySeven: ClassifiableTask = {
    answer: q(42),
    kind: "number",
    traps: [],
    factors: [q(6), q(7)],
  };
  it("classifies 6 × 8 = 48 and 5 × 7 = 35 as computational", () => {
    expect(classify(q(48), sixtySeven)).toBe("computational");
    expect(classify(q(35), sixtySeven)).toBe("computational");
  });
});

describe("REQ-0730: any other unmatched wrong answer is unclassified", () => {
  it("classifies 99 as unclassified", () => {
    expect(classify(q(99), twelve)).toBe("unclassified");
  });
});

describe("REQ-0702: a choice task's wrong options are the traps' answers", () => {
  it("builds the correct answer and the three distinct trap answers", () => {
    const task: ClassifiableTask = {
      answer: q(12),
      kind: "number",
      traps: [
        { id: "a", value: q(14) },
        { id: "b", value: q(3) },
        { id: "c", value: q(20) },
      ],
    };
    const options = buildOptions(task, 4);
    expect(options.map((o) => o.value.toString()).sort()).toEqual(
      ["12", "14", "20", "3"].sort(),
    );
    expect(options.filter((o) => o.role === "correct")).toHaveLength(1);
  });
});

describe("REQ-0704: missing options take the answer's form", () => {
  it("fills a two-digit answer with two-digit options", () => {
    const fillers = buildOptions(twelve, 4).filter((o) => o.role === "filler");
    expect(fillers).toHaveLength(1);
    for (const o of fillers) expect(o.value.n.toString().length).toBe(2);
    const single: ClassifiableTask = {
      answer: q(12),
      kind: "number",
      traps: [{ id: "skip", value: q(3) }],
    };
    const filled = buildOptions(single, 4);
    expect(filled).toHaveLength(4);
    for (const o of filled.filter((o) => o.role === "filler")) {
      expect(o.value.n.toString().length).toBe(2);
      expect(o.value.isInteger()).toBe(true);
    }
    const values = filled.map((o) => o.value.toString());
    expect(new Set(values).size).toBe(4);
  });

  it("fills a fraction answer with fractions of the same denominator", () => {
    const half: ClassifiableTask = {
      answer: q(1, 2),
      kind: "fraction",
      traps: [{ id: "flip", value: q(2, 1) }],
    };
    for (const o of buildOptions(half, 4)) {
      if (o.role === "filler") expect(o.value.d).toBe(2n);
    }
  });
});

describe("REQ-0702, REQ-0704: over 1,000 seeds every choice task has the right options", () => {
  it("gives four distinct options, each close in form to the answer", () => {
    for (let i = 0; i < 1000; i++) {
      const rng = Xoshiro128.fromSeed(
        candidateSeed(baseSeed(`opt-${i}`, "N1", 0), 0),
      );
      const a = 10 + rng.int(89);
      const task: ClassifiableTask = {
        answer: q(a),
        kind: "number",
        traps: [{ id: "plus", value: q(a + 1) }],
      };
      const options = buildOptions(task, 4);
      expect(options).toHaveLength(4);
      expect(new Set(options.map((o) => o.value.toString())).size).toBe(4);
      for (const o of options) expect(o.value.n.toString().length).toBe(2);
    }
  });
});
