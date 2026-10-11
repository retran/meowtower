// TSK-0518: a parameter file that breaks a bound never loads; it names the template and
// the bound. A right answer never lowers p, checked on 10,000 random valid parameter
// sets with fast-check (ADR-0060, REQ-0986).
import { readFileSync } from "node:fs";
import * as fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  applyObservation,
  freshPair,
  pKnowAt,
} from "../../src/engine/model/bkt.js";
import {
  ModelParamsInvalid,
  loadParams,
  validateParams,
  type ModelParamsT,
} from "../../src/engine/model/params.js";

const text = readFileSync(
  new URL("../../content/model.v1.json", import.meta.url),
  "utf8",
);
const v1 = JSON.parse(text) as ModelParamsT;

describe("REQ-0986: a file whose pGuess + pSlip reaches 1 never loads, and names the template", () => {
  it("refuses a free-input guess of 0.95 and names the template and the bound", () => {
    const bad = { ...v1, pGuessFree: 0.95 };
    expect(() => validateParams(bad)).toThrow(ModelParamsInvalid);
    expect(() => validateParams(bad)).toThrow(
      /model_params_invalid.*free\/1 steps.*pGuess \+ pSlip/,
    );
  });
});

describe("REQ-0986: a learning rate above the bound never loads, and names the bound", () => {
  it("refuses a feedback rate of 0.9 for the one-step free template", () => {
    const bad = { ...v1, pLearnFeedback: 0.9 };
    expect(() => validateParams(bad)).toThrow(
      /free\/1 steps.*pLearnFeedback.*bound/,
    );
  });

  it("refuses a file that is not JSON", () => {
    expect(() => loadParams("{")).toThrow(/model_params_invalid/);
  });
});

describe("REQ-0986: the v1 file passes the validator for every answer form and step count", () => {
  it("loads the v1 file", () => {
    expect(() => loadParams(text)).not.toThrow();
  });
});

describe("REQ-0986: a right answer never lowers p, on 10,000 random valid parameter sets", () => {
  const arbitrary = fc.record({
    pGuessFree: fc.double({ min: 0, max: 0.5, noNaN: true }),
    pLearnPractice: fc.double({ min: 0, max: 0.5, noNaN: true }),
    pLearnFeedback: fc.double({ min: 0, max: 0.5, noNaN: true }),
    slipBase: fc.double({ min: 0.5, max: 0.99, noNaN: true }),
    pSlipMin: fc.double({ min: 0, max: 0.3, noNaN: true }),
    prior: fc.double({ min: 0.01, max: 0.99, noNaN: true }),
    days: fc.double({ min: 0, max: 400, noNaN: true }),
    w: fc.double({ min: 0.1, max: 1, noNaN: true }),
    feedback: fc.boolean(),
    steps: fc.integer({ min: 1, max: 6 }),
  });

  it("holds for every valid set", () => {
    fc.assert(
      fc.property(arbitrary, (c) => {
        const candidate = {
          ...v1,
          pGuessFree: c.pGuessFree,
          pLearnPractice: c.pLearnPractice,
          pLearnFeedback: c.pLearnFeedback,
          slipBase: c.slipBase,
          pSlipMin: c.pSlipMin,
        };
        let p: ModelParamsT;
        try {
          p = validateParams(candidate);
        } catch {
          return true;
        }
        const state = { p: c.prior, halfLifeDays: 60, last: 0 };
        const at = c.days * 86_400_000;
        const forgotten = pKnowAt(state, at);
        const after = applyObservation(
          { ...freshPair(c.prior, p), p: c.prior, last: 0 },
          {
            itemId: "i",
            node: "N1",
            subtype: "sum",
            c: 1,
            w: c.w,
            timeMs: 0,
            at,
            form: "free",
            options: 0,
            steps: c.steps,
            postFeedback: c.feedback,
            timeCounts: true,
            control: false,
          },
          p,
        );
        return after.p >= forgotten - 1e-12;
      }),
      { numRuns: 10_000 },
    );
  });
});
