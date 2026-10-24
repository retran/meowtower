// ADR-0500: item_included reverses item_excluded; its schema takes the task's id only.
import { describe, expect, it } from "vitest";
import { createRegistry, EVENT_DEFS } from "../../src/shared/events.js";

const registry = createRegistry(EVENT_DEFS);

describe("ADR-0500: the item_included schema", () => {
  it("accepts an item id", () => {
    expect(() =>
      registry.validate("item_included", 1, {
        itemId: "01J0000000000000000000000C",
      }),
    ).not.toThrow();
  });

  it("refuses a field beyond the item id", () => {
    expect(() =>
      registry.validate("item_included", 1, {
        itemId: "01J0000000000000000000000C",
        reason: "x",
      }),
    ).toThrow();
  });
});

describe("ADR-0510: the model_activated schema", () => {
  const figs = { logLoss: 0.5, ece: 0.05 };
  it("accepts the first version, with no earlier figures", () => {
    expect(() =>
      registry.validate("model_activated", 1, {
        modelVersion: "v1",
        previous: null,
        heldOutAttempts: 40,
        figures: { active: null, candidate: figs },
      }),
    ).not.toThrow();
  });

  it("refuses an event with no candidate figures", () => {
    expect(() =>
      registry.validate("model_activated", 1, {
        modelVersion: "v2",
        previous: "v1",
        heldOutAttempts: 40,
        figures: { active: figs },
      }),
    ).toThrow();
  });
});
