// TSK-0480: `Math.random` is banned in `src/`, because a task has to rebuild
// from its seed (REQ-1202). A fixture that calls it makes the rule fail.
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const lint = async (code: string, filePath: string) =>
  new ESLint().lintText(code, { filePath });

describe("REQ-1202: Math.random is reported under src", () => {
  it("fails a fixture that calls it", async () => {
    const [result] = await lint(
      "export const roll = (): number => Math.random();\n",
      "src/engine/tasks/fixture.ts",
    );
    expect(result?.messages.map((m) => m.ruleId)).toContain(
      "no-restricted-properties",
    );
  });

  it("passes a fixture that draws from the seeded source", async () => {
    const [result] = await lint(
      "export const roll = (next: () => number): number => next();\n",
      "src/engine/tasks/fixture.ts",
    );
    expect(result?.messages).toEqual([]);
  });
});
