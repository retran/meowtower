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
