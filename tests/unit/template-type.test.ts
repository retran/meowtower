// TSK-0509: a template reads its level and its subtype weight from the graph, so the
// template type holds neither field (REQ-0852).
import { describe, expectTypeOf, it } from "vitest";
import type { Template } from "../../src/engine/tasks/template.js";

describe("REQ-0852: the template type has no level and no weight", () => {
  it("holds no level and no weight field", () => {
    expectTypeOf<Template<{ a: number }>>().not.toHaveProperty("level");
    expectTypeOf<Template<{ a: number }>>().not.toHaveProperty("weight");
  });

  it("is a test that runs", () => {
    expectTypeOf<Template<{ a: number }>>().toHaveProperty("id");
  });
});
