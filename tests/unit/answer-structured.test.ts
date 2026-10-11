// TSK-0483: the time, point, choice, grid and order kinds accept an entry exactly
// as the correct answer's reading allows, and no other (REQ-0760 to REQ-0772).
import { describe, expect, it } from "vitest";
import {
  choiceAnswer,
  DONT_KNOW,
  gridAnswer,
  orderAnswer,
  pointAnswer,
  timeAnswer,
} from "../../src/shared/answer.js";

describe("REQ-0760: an analogue clock accepts the morning and the afternoon reading", () => {
  const quarterPastThree = timeAnswer(3, 15, "analogue");
  it("accepts 3:15, 03:15 and 15:15", () => {
    for (const entry of ["3:15", "03:15", "15:15"])
      expect(quarterPastThree(entry).verdict).toBe("correct");
  });
  it("rejects a wrong minute", () => {
    expect(quarterPastThree("3:20").verdict).toBe("wrong");
  });
});

describe("REQ-0762: a digital time accepts the 24-hour reading with or without a leading zero", () => {
  const nineOhFive = timeAnswer(9, 5, "digital");
  it("accepts 9:05 and 09:05", () => {
    expect(nineOhFive("9:05").verdict).toBe("correct");
    expect(nineOhFive("09:05").verdict).toBe("correct");
  });
  it("rejects the afternoon reading of a digital time", () => {
    expect(nineOhFive("21:05").verdict).toBe("wrong");
  });
});

describe("REQ-0766: a point is accepted as a grid node and its swap is a trap", () => {
  const point = pointAnswer(3, 5);
  it("accepts (3; 5)", () => {
    expect(point("(3; 5)").verdict).toBe("correct");
  });
  it("classifies (5; 3) as the swapped-coordinates trap", () => {
    const swapped = point("(5; 3)");
    expect(swapped.verdict).toBe("wrong");
    expect(swapped.form).toBe("point_swapped");
  });
});

describe("REQ-0768: a choice or a sign comparison takes exactly one option", () => {
  const sign = choiceAnswer("<", ["<", ">", "="]);
  it("is unparsed when two signs are marked", () => {
    expect(sign("<,>").verdict).toBe("unparsed");
  });
  it("is correct for the one sign and wrong for another", () => {
    expect(sign("<").verdict).toBe("correct");
    expect(sign(">").verdict).toBe("wrong");
  });
});

describe("REQ-0770: a grid is accepted only when the marked cells are exactly the correct set", () => {
  const grid = gridAnswer(["A1", "B2", "C3"]);
  it("accepts the exact set in any order", () => {
    expect(grid("C3,A1,B2").verdict).toBe("correct");
  });
  it("rejects one cell more or fewer", () => {
    expect(grid("A1,B2").verdict).toBe("wrong");
    expect(grid("A1,B2,C3,D4").verdict).toBe("wrong");
  });
});

describe("REQ-0772: an order is accepted only as the exact correct permutation", () => {
  const order = orderAnswer(["2", "5", "9"]);
  it("accepts the correct sequence", () => {
    expect(order("2,5,9").verdict).toBe("correct");
  });
  it("rejects any other order of the same items", () => {
    expect(order("5,2,9").verdict).toBe("wrong");
  });
  it("is unparsed when the items differ", () => {
    expect(order("2,5,7").verdict).toBe("unparsed");
  });
});

describe("Every structured kind: dont_know is accepted with no credit", () => {
  it.each([
    timeAnswer(3, 15, "analogue"),
    pointAnswer(3, 5),
    choiceAnswer("<", ["<", ">", "="]),
    gridAnswer(["A1"]),
    orderAnswer(["2", "5"]),
  ])("gives dont_know", (check) => {
    expect(check(DONT_KNOW).verdict).toBe("dont_know");
  });
});
