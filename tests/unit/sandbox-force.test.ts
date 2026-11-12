// REQ-8290 (ADR-3280): the parent forces the next check's outcome in the sandbox, once.
import { expect, it } from "vitest";
import { Force } from "../../src/server/sandbox/force.js";

it("accepts an outcome, a fall and a rise", () => {
  for (const next of ["clean", "partial", "alt", "fall", "rise"])
    expect(Force.safeParse({ next }).success, next).toBe(true);
});

it("refuses anything else, an open gate included while no gate is built", () => {
  for (const body of [
    { next: "gate" },
    { next: "win" },
    {},
    { next: "alt", x: 1 },
  ])
    expect(Force.safeParse(body).success, JSON.stringify(body)).toBe(false);
});
