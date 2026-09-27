import { describe, expect, it } from "vitest";
import { z } from "zod";
import { createRegistry } from "../../src/shared/events.js";

describe("upcasters lift an old payload to the newest shape", () => {
  const registry = createRegistry([
    {
      type: "demo",
      v: 1,
      schema: z.object({ n: z.number().describe("a number") }),
    },
    {
      type: "demo",
      v: 2,
      schema: z.object({
        n: z.number().describe("a number"),
        unit: z.enum(["kg"]).describe("unit"),
      }),
      upcastFrom: (p: unknown) => ({ ...(p as object), unit: "kg" }),
    },
  ]);

  it("reads a stored version-1 event as version 2", () => {
    const stored = { n: 3 };
    expect(registry.upcast("demo", 1, stored)).toEqual({
      v: 2,
      payload: { n: 3, unit: "kg" },
    });
    expect(stored).toEqual({ n: 3 });
  });

  it("leaves a current version as it is", () => {
    expect(registry.upcast("demo", 2, { n: 1, unit: "kg" })).toEqual({
      v: 2,
      payload: { n: 1, unit: "kg" },
    });
  });
});
