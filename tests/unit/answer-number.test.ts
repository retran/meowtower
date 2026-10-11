// TSK-0482: each number answer kind compares an entry with the correct answer by
// value and by kind, and returns correct, half credit, wrong or unparsed. A
// `dont_know` is accepted for every kind (REQ-0732 to REQ-0778).
import { describe, expect, it } from "vitest";
import { Q } from "../../src/math/q.js";
import {
  type Checker,
  decimalAnswer,
  DONT_KNOW,
  equationValue,
  fractionAnswer,
  integerAnswer,
  mixedAnswer,
  quotientRemainder,
} from "../../src/shared/answer.js";

const q = (n: number, d = 1): Q => Q.of(BigInt(n), BigInt(d));

describe("REQ-0732: an integer is accepted by value, with group spaces and leading zeros", () => {
  const twelve = integerAnswer(q(12500));
  it("accepts a grouped entry with a regular or a no-break space", () => {
    expect(twelve("12 500").verdict).toBe("correct");
    expect(twelve("12 500").verdict).toBe("correct");
  });
  it("accepts leading zeros", () => {
    expect(twelve("012500").verdict).toBe("correct");
    expect(integerAnswer(q(7))("007").verdict).toBe("correct");
  });
  it("rejects a wrong value and refuses a malformed grouping", () => {
    expect(twelve("12 501").verdict).toBe("wrong");
    expect(twelve("1 2 5 0 0").verdict).toBe("unparsed");
  });
});

describe("REQ-0742: a decimal is accepted by value, with a comma or a point and any trailing zeros", () => {
  const twoPointFive = decimalAnswer(q(5, 2));
  it("accepts every written form of 2,5", () => {
    for (const entry of ["2,5", "2.5", "2,50", "2,500"])
      expect(twoPointFive(entry).verdict).toBe("correct");
  });
  it("accepts a whole number without a decimal part", () => {
    const three = decimalAnswer(q(3));
    expect(three("3").verdict).toBe("correct");
    expect(three("3").form).toBe("integer");
    expect(three("3,0").verdict).toBe("correct");
  });
  it("refuses a malformed decimal and rejects a wrong value", () => {
    expect(twoPointFive("3,,5").verdict).toBe("unparsed");
    expect(twoPointFive("2,6").verdict).toBe("wrong");
  });
});

describe("REQ-0744, REQ-0746: an equivalent-fraction task accepts any equal fraction and no decimal", () => {
  const half = fractionAnswer(q(1, 2), "equivalent");
  it("accepts equal fractions", () => {
    expect(half("2/4").verdict).toBe("correct");
    expect(half("3/6").verdict).toBe("correct");
  });
  it("accepts an improper fraction equal to the answer", () => {
    expect(fractionAnswer(q(3, 2), "equivalent")("6/4").verdict).toBe(
      "correct",
    );
  });
  it("rejects a decimal even when its value is equal", () => {
    expect(half("0,5").verdict).toBe("wrong");
    expect(half("0,5").form).toBe("decimal");
  });
});

describe("REQ-0748, REQ-0750: a simplest-form fraction task gives full credit only to the reduced fraction", () => {
  const half = fractionAnswer(q(1, 2), "simplest");
  it("gives full credit to 1/2", () => {
    expect(half("1/2").credit).toBe(1);
  });
  it("gives half credit to 2/4", () => {
    expect(half("2/4").verdict).toBe("half");
    expect(half("2/4").credit).toBe(0.5);
  });
});

describe("REQ-0752, REQ-0754, REQ-0756: a mixed number is judged by its value and, for the simplest form, by reduction", () => {
  const twoAndAHalf = (rule: "equivalent" | "simplest") =>
    mixedAnswer(q(5, 2), rule);
  it("gives full credit to 2 1/2 under both rules", () => {
    expect(twoAndAHalf("equivalent")("2 1/2").verdict).toBe("correct");
    expect(twoAndAHalf("simplest")("2 1/2").verdict).toBe("correct");
  });
  it("accepts an equal improper fraction under the equivalent rule", () => {
    expect(twoAndAHalf("equivalent")("5/2").verdict).toBe("correct");
  });
  it("gives half credit to an equal improper fraction under the simplest rule", () => {
    expect(twoAndAHalf("simplest")("5/2").credit).toBe(0.5);
  });
  it("gives half credit to a mixed number whose fractional part isn't reduced", () => {
    expect(twoAndAHalf("simplest")("2 2/4").credit).toBe(0.5);
    expect(twoAndAHalf("equivalent")("2 2/4").verdict).toBe("correct");
  });
});

describe("REQ-0758: a quotient with remainder needs a remainder below the divisor", () => {
  const seventyNineByTen = quotientRemainder(79n, 10n);
  it("rejects 6 r 19 although 6 · 10 + 19 = 79", () => {
    expect(seventyNineByTen("6 r 19").verdict).toBe("wrong");
  });
  it("accepts 7 r 9", () => {
    expect(seventyNineByTen("7 r 9").verdict).toBe("correct");
  });
});

describe("REQ-0778: an equation answer is accepted as the value of the unknown", () => {
  const threeQuarters = equationValue(q(3, 4));
  it("accepts a fraction or a decimal equal to the value", () => {
    expect(threeQuarters("3/4").verdict).toBe("correct");
    expect(threeQuarters("0,75").verdict).toBe("correct");
  });
  it("rejects a wrong value", () => {
    expect(threeQuarters("0,7").verdict).toBe("wrong");
  });
});

describe("Every kind: dont_know is accepted with no credit", () => {
  const kinds: [string, Checker][] = [
    ["integer", integerAnswer(q(7))],
    ["decimal", decimalAnswer(q(5, 2))],
    ["fraction", fractionAnswer(q(1, 2), "simplest")],
    ["mixed", mixedAnswer(q(5, 2), "equivalent")],
    ["equation", equationValue(q(3, 4))],
    ["quotient", quotientRemainder(79n, 10n)],
  ];
  it.each(kinds)("gives dont_know for the %s kind", (_, check) => {
    const result = check(DONT_KNOW);
    expect(result.verdict).toBe("dont_know");
    expect(result.credit).toBe(0);
  });
});

describe("An entry the kind can't parse is unparsed and nothing else", () => {
  it("marks free text and a malformed fraction as unparsed", () => {
    expect(equationValue(q(3, 4))("abc").verdict).toBe("unparsed");
    expect(fractionAnswer(q(1, 2), "equivalent")("1/0").verdict).toBe(
      "unparsed",
    );
  });
});
