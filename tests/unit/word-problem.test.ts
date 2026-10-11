// TSK-0488: a word problem takes one of the seven structures, its numbers and
// answer are fixed before its frame is chosen, a T4 problem carries exactly one
// number its solution doesn't use, a noun takes the Russian form its number
// needs, and a model choice offers four notes drawn as SVG (REQ-0780 to
// REQ-0836).
import { describe, expect, it } from "vitest";
import { checkWordStructures } from "../../tools/word-rules.js";
import {
  NO_FLUENT_NUMBERS,
  STRUCTURES,
  compose,
  modelChoice,
  nounForm,
  opensWithModel,
  t4Problem,
} from "../../src/templates/word-problem.js";
import { baseSeed } from "../../src/math/rng.js";

describe("REQ-0780: a word problem declares one of the seven structures", () => {
  it("has exactly the seven structures of the catalogue", () => {
    expect([...STRUCTURES]).toEqual([
      "chain",
      "fork_comparison",
      "parts_whole",
      "more_times",
      "price_change",
      "motion",
      "work",
    ]);
  });

  it("fails a template that declares no structure of the catalogue", () => {
    const findings = checkWordStructures([
      { template: "fixture.story", structure: "guess" },
      { template: "fixture.ok", structure: "parts_whole" },
    ]);
    expect(findings).toEqual([
      expect.objectContaining({
        check: "word_structure",
        file: "fixture.story",
        match: "guess",
      }),
    ]);
  });
});

describe("REQ-0782: the steps, numbers and answer are fixed before the frame", () => {
  it("fixes the numbers and the answer before it chooses a frame", () => {
    const built = compose("parts_whole", [4, 7], ["a", "b"]);
    expect(built.status).toBe("ok");
    if (built.status !== "ok") return;
    expect(built.answer).toBe(11);
    expect(built.frame.placeholders.every((p) => p.startsWith("{role:"))).toBe(
      true,
    );
  });

  it("hands the frame chooser the numbers and the answer already fixed", () => {
    const seen: unknown[] = [];
    compose("parts_whole", [4, 7], ["a"], (fixed) => {
      seen.push(fixed);
      return { placeholders: ["{role:part}"] };
    });
    expect(seen).toEqual([
      { structure: "parts_whole", numbers: [4, 7], answer: 11 },
    ]);
  });

  it("builds nothing and returns no_fluent_numbers when no node is allowed", () => {
    expect(compose("chain", [4, 7], [])).toEqual({
      status: NO_FLUENT_NUMBERS,
    });
  });
});

describe("REQ-0786: a T4 problem holds exactly one number its solution doesn't use", () => {
  it("holds exactly one unused number on 10,000 seeds", () => {
    for (let i = 0; i < 10_000; i++) {
      const problem = t4Problem(baseSeed(`t4-${i}`, "N1", 0));
      const unused = problem.numbers.filter((n) => !problem.used.includes(n));
      expect(unused).toHaveLength(1);
    }
  });
});

describe("REQ-0788: a noun after a number takes the form the number requires", () => {
  const forms = ["зелье", "зелья", "зелий"] as const;
  it("takes зелье, зелья and зелий for 1, 3 and 5", () => {
    expect(nounForm(1, forms)).toBe("зелье");
    expect(nounForm(3, forms)).toBe("зелья");
    expect(nounForm(5, forms)).toBe("зелий");
  });

  it("follows the Russian rule for every number from 1 to 100", () => {
    const expected = (n: number): string => {
      const last = n % 10;
      const tens = n % 100;
      if (last === 1 && tens !== 11) return "зелье";
      if (last >= 2 && last <= 4 && (tens < 12 || tens > 14)) return "зелья";
      return "зелий";
    };
    for (let n = 1; n <= 100; n++) expect(nounForm(n, forms)).toBe(expected(n));
  });
});

describe("REQ-0836: a model choice offers four notes, and one problem in four opens with it", () => {
  it("builds four notes: one from the valid graph and three from the traps", () => {
    const choice = modelChoice(11, [9, 13, 2], 42);
    expect(choice.notes).toHaveLength(4);
    expect(choice.notes.filter((n) => n.correct)).toHaveLength(1);
    expect(choice.svg.every((s) => s.startsWith("<svg"))).toBe(true);
  });

  it("opens one problem in four over 1,000 seeds", () => {
    let opened = 0;
    for (let k = 0; k < 1000; k++) if (opensWithModel(k)) opened++;
    expect(opened).toBe(250);
  });
});
