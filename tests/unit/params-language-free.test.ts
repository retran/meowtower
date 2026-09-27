import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  checkParamsLanguageFree,
  loadTemplateSchemas,
} from "../../tools/params-language-free.js";

const rational = z.object({ num: z.number().int(), den: z.number().int() });

describe("REQ-3808: a task's parameters don't depend on the display language", () => {
  it("reads this repository's templates and finds no string parameter", async () => {
    const templates = await loadTemplateSchemas(process.cwd());
    expect(checkParamsLanguageFree(templates)).toEqual([]);
  });

  it("names a free string parameter", () => {
    const findings = checkParamsLanguageFree([
      {
        template: "N1.words",
        schema: z.object({ a: z.number(), unit: z.string() }),
      },
    ]);
    expect(findings).toEqual([
      { check: "params_language", file: "N1.words", match: "unit" },
    ]);
  });

  it("names a string nested in an object or an array", () => {
    const findings = checkParamsLanguageFree([
      {
        template: "F2.nested",
        schema: z.object({
          part: z.object({ label: z.string() }),
          names: z.array(z.string()),
        }),
      },
    ]);
    expect(findings).toEqual([
      { check: "params_language", file: "F2.nested", match: "part.label" },
      { check: "params_language", file: "F2.nested", match: "names[]" },
    ]);
  });

  it("passes numbers, rationals, booleans and enum identifiers", () => {
    const findings = checkParamsLanguageFree([
      {
        template: "A3.clean",
        schema: z.object({
          a: z.number().int(),
          b: rational,
          carry: z.boolean(),
          op: z.enum(["add", "sub"]),
          parts: z.array(rational),
        }),
      },
    ]);
    expect(findings).toEqual([]);
  });
});
