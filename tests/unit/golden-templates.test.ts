// TSK-0493: the golden test rebuilds each stand-in template at twenty seeds and
// compares the stored view and parameters byte for byte. A change in the output
// under an unchanged template version fails here (ADR-0040's second criterion).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { goldenRecords, GOLDEN_PATH } from "../../tools/verify-templates.js";

describe("ADR-0040 criterion 2: the same template, version and seed give the stored view", () => {
  it("rebuilds every stored record byte for byte", () => {
    const stored = readFileSync(GOLDEN_PATH, "utf8");
    const rebuilt = `${JSON.stringify(goldenRecords(), null, 2)}\n`;
    expect(rebuilt).toBe(stored);
  });
});
