// ADR-0520: the set and pair answer kinds and the distance a number placed on a line may miss by.
import { describe, expect, it } from "vitest";
import {
  lineAnswer,
  pairAnswer,
  pointAnswer,
  setAnswer,
} from "../../src/shared/answer.js";
import { Q } from "../../src/math/q.js";

const q = (n: number) => Q.of(BigInt(n));
const options = ["12", "15", "20", "25"];

describe("ADR-0520: a set is right only as the exact set, and half right one option away", () => {
  const check = setAnswer(["15", "20"], options);

  it("credits the exact set in any order", () => {
    expect(check("15,20")).toMatchObject({
      verdict: "correct",
      credit: 1,
      form: "set",
    });
    expect(check("20, 15")).toMatchObject({ verdict: "correct", credit: 1 });
  });

  it("gives half for one option missing and for one wrong option added", () => {
    expect(check("15")).toMatchObject({ verdict: "half", credit: 0.5 });
    expect(check("15,20,25")).toMatchObject({ verdict: "half", credit: 0.5 });
  });

  it("gives nothing for two options off, and calls an empty, repeated or unknown entry unparsed", () => {
    expect(check("12,25")).toMatchObject({ verdict: "wrong", credit: 0 });
    expect(check("")).toMatchObject({ verdict: "unparsed" });
    expect(check("15,15")).toMatchObject({ verdict: "unparsed" });
    expect(check("15,99")).toMatchObject({ verdict: "unparsed" });
  });

  it("accepts dont_know with no credit", () => {
    expect(check("dont_know")).toMatchObject({
      verdict: "dont_know",
      credit: 0,
    });
  });
});

describe("ADR-0520: a pair is two numbers in order", () => {
  const check = pairAnswer(q(29), q(31));

  it("credits both, half for one, nothing for none", () => {
    expect(check("29; 31")).toMatchObject({
      verdict: "correct",
      credit: 1,
      form: "pair",
    });
    expect(check("29; 32")).toMatchObject({ verdict: "half", credit: 0.5 });
    expect(check("28; 32")).toMatchObject({ verdict: "wrong", credit: 0 });
  });

  it("does not forgive the order", () => {
    expect(check("31; 29")).toMatchObject({ verdict: "wrong", credit: 0 });
  });

  it("reads grouped numbers by value and calls a lone number unparsed", () => {
    expect(pairAnswer(q(12500), q(12501))("12 500; 12501")).toMatchObject({
      verdict: "correct",
    });
    expect(check("29")).toMatchObject({ verdict: "unparsed" });
    expect(check("29; x")).toMatchObject({ verdict: "unparsed" });
  });
});

describe("ADR-0520: a number placed on a line is right within the distance and wrong beyond it", () => {
  const check = lineAnswer(q(598), q(10));

  it("accepts the target and the edge of the distance, and refuses one more", () => {
    expect(check("598")).toMatchObject({ verdict: "correct", form: "line" });
    expect(check("608")).toMatchObject({ verdict: "correct" });
    expect(check("588")).toMatchObject({ verdict: "correct" });
    expect(check("609")).toMatchObject({ verdict: "wrong" });
    expect(check("587")).toMatchObject({ verdict: "wrong" });
  });

  it("takes only the exact value at distance zero", () => {
    expect(lineAnswer(q(7500), q(0))("7501")).toMatchObject({
      verdict: "wrong",
    });
    expect(lineAnswer(q(7500), q(0))("7500")).toMatchObject({
      verdict: "correct",
    });
  });

  it("applies the distance to each coordinate of a grid point", () => {
    expect(pointAnswer(3, 4, 1)("(4; 3)")).toMatchObject({
      verdict: "correct",
    });
    expect(pointAnswer(3, 4, 1)("(5; 4)")).toMatchObject({ verdict: "wrong" });
    expect(pointAnswer(3, 4)("(4; 3)")).toMatchObject({
      verdict: "wrong",
      form: "point_swapped",
    });
  });
});
