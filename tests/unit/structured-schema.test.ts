// BUG-0010 (REQ-8236): the direct route refuses a schema that holds number or length limits, so the
// gateway sends the schema without them. Code validates the ranges itself after the reply, so nothing is
// lost; a reply is still parsed by `Scenario` and checked by `checkScenario`.
import Anthropic from "@anthropic-ai/sdk";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  anthropicRoute,
  forStructuredOutput,
} from "../../src/server/gateway/routes.js";
import { FRAME_SCHEMA } from "../../src/server/frames/request.js";
import { MASTER_REPLY_SCHEMA } from "../../src/story/master-gateway.js";
import { MASTER_TOOL_NAMES } from "../../src/story/master-tools.js";
import { Scenario } from "../../src/story/scenario.js";

/** Every keyword of the schema, at any depth, so a test can say a limit is nowhere in it. */
const keywordsOf = (value: unknown, found = new Set<string>()): Set<string> => {
  if (Array.isArray(value)) for (const v of value) keywordsOf(v, found);
  else if (typeof value === "object" && value !== null)
    for (const [k, v] of Object.entries(value)) {
      found.add(k);
      keywordsOf(v, found);
    }
  return found;
};

const REFUSED = [
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "multipleOf",
  "minLength",
  "maxLength",
  "maxItems",
];

describe("BUG-0010: the schema the provider gets", () => {
  it("drops the number and length limits at any depth and keeps the rest", () => {
    const schema = {
      type: "object",
      properties: {
        tension: { type: "integer", minimum: 1, maximum: 5 },
        name: { type: "string", minLength: 1, maxLength: 80 },
        list: {
          type: "array",
          minItems: 3,
          maxItems: 9,
          items: { type: "number", exclusiveMinimum: 0, multipleOf: 2 },
        },
        either: { anyOf: [{ type: "integer", minimum: 0 }, { type: "null" }] },
        kind: { enum: ["a", "b"] },
      },
      required: ["tension", "name"],
      additionalProperties: false,
    };
    const clean = forStructuredOutput(schema);
    for (const word of REFUSED)
      expect(keywordsOf(clean).has(word), word).toBe(false);
    expect(clean).toMatchObject({
      type: "object",
      required: ["tension", "name"],
      additionalProperties: false,
      properties: {
        tension: { type: "integer" },
        name: { type: "string" },
        kind: { enum: ["a", "b"] },
        either: { anyOf: [{ type: "integer" }, { type: "null" }] },
      },
    });
  });

  it("keeps a minimum of one item or none, which the provider accepts, and leaves its input alone", () => {
    const schema = { type: "array", minItems: 1, items: { type: "string" } };
    expect(forStructuredOutput(schema)).toMatchObject({ minItems: 1 });
    const input = { type: "integer", minimum: 1 };
    forStructuredOutput(input);
    expect(input).toEqual({ type: "integer", minimum: 1 });
  });

  it("sends a scenario's schema to the direct route with none of the refused keywords", () => {
    const body = anthropicRoute({} as Anthropic).body({
      model: "claude-opus-5-5",
      system: "s",
      user: "u",
      maxTokens: 1000,
      timeoutMs: 1000,
      tier: "content",
      schema: z.toJSONSchema(Scenario),
    } as never) as {
      output_config: { format: { schema: unknown } };
    };
    const sent = keywordsOf(body.output_config.format.schema);
    for (const word of REFUSED) expect(sent.has(word), word).toBe(false);
    // The schema still names the fields, so the reply keeps its shape.
    expect(sent.has("encounters")).toBe(true);
  });
});

/** Whether a schema holds an empty schema where a schema is expected, which the provider refuses (BUG-0020). */
const holdsEmptySchema = (node: unknown): boolean => {
  if (Array.isArray(node)) return node.some(holdsEmptySchema);
  if (typeof node !== "object" || node === null) return false;
  const isEmpty = (v: unknown): boolean =>
    typeof v === "object" &&
    v !== null &&
    !Array.isArray(v) &&
    Object.keys(v).length === 0;
  return Object.entries(node).some(([key, value]) => {
    if (
      ["properties", "$defs", "definitions", "patternProperties"].includes(key)
    )
      return Object.values(value as object).some(
        (v) => isEmpty(v) || holdsEmptySchema(v),
      );
    if (["anyOf", "oneOf", "allOf"].includes(key))
      return (value as unknown[]).some(
        (v) => isEmpty(v) || holdsEmptySchema(v),
      );
    if (
      ["items", "additionalProperties"].includes(key) &&
      typeof value === "object"
    )
      return isEmpty(value) || holdsEmptySchema(value);
    return holdsEmptySchema(value);
  });
};

describe("BUG-0020: no schema the code sends holds an empty schema", () => {
  it("catches one that does", () => {
    expect(holdsEmptySchema({ properties: { input: {} } })).toBe(true);
    expect(holdsEmptySchema({ items: { anyOf: [{}] } })).toBe(true);
    expect(holdsEmptySchema({ properties: {}, type: "object" })).toBe(false);
  });

  it("holds for the Master's reply, a scenario and a frame", () => {
    expect(holdsEmptySchema(MASTER_REPLY_SCHEMA)).toBe(false);
    expect(holdsEmptySchema(z.toJSONSchema(Scenario))).toBe(false);
    expect(holdsEmptySchema(FRAME_SCHEMA)).toBe(false);
  });

  it("names each tool of the Master and its input, one entry for each", () => {
    const calls = (
      MASTER_REPLY_SCHEMA as {
        properties: {
          calls: {
            items: {
              anyOf: { properties: { tool: { enum: string[] } } }[];
            };
          };
        };
      }
    ).properties.calls.items.anyOf;
    expect(calls.map((c) => c.properties.tool.enum[0])).toEqual([
      ...MASTER_TOOL_NAMES,
    ]);
  });
});
