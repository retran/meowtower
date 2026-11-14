// REQ-8630, REQ-8632 (ADR-3370): the cost of a generation is shown in dollars before it runs, from the
// mean cost of earlier calls where ten or more exist and from a stated default where fewer do, and the
// figure says which. Each end of the range rounds up to the cent.
import { describe, expect, it } from "vitest";
import {
  DEFAULT_CALL_USD,
  dollarEstimate,
  GENERATION_CALLS,
} from "../../src/server/studio/generate.js";

describe("REQ-8632: the estimate says what it rests on", () => {
  it("rests on the default with no earlier calls, and with fewer than ten", () => {
    expect(dollarEstimate([])).toEqual({
      minUsd: 0.2,
      maxUsd: 0.85,
      basis: "default",
      measuredCalls: 0,
    });
    expect(dollarEstimate(Array(9).fill(0.02))).toMatchObject({
      basis: "default",
      measuredCalls: 0,
    });
    expect(DEFAULT_CALL_USD).toBe(0.05);
  });

  it("rests on the mean of earlier calls from ten of them", () => {
    expect(dollarEstimate(Array(10).fill(0.02))).toEqual({
      minUsd: 0.08,
      maxUsd: 0.34,
      basis: "measured",
      measuredCalls: 10,
    });
  });

  it("reads only the last fifty calls, the newest being last", () => {
    const costs = [...Array(10).fill(9), ...Array(50).fill(0.01)];
    expect(dollarEstimate(costs)).toEqual({
      minUsd: 0.04,
      maxUsd: 0.17,
      basis: "measured",
      measuredCalls: 50,
    });
  });
});

describe("REQ-8630: the range is in dollars, rounded up to the cent", () => {
  it("is the fewest and the most calls times the price of one", () => {
    const e = dollarEstimate(Array(10).fill(0.0123));
    expect(e.minUsd).toBe(0.05);
    expect(e.maxUsd).toBe(0.21);
    expect(GENERATION_CALLS).toEqual({ min: 4, max: 17 });
  });
});
