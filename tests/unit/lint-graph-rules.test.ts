// TSK-0501: typicalGroup is read only under the allowed folders, and only the
// graph loader names the graph file (REQ-0854, SPC-0050). Each fixture below
// decides one rule, and the names are built from pieces so this file itself
// names no graph file.
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const lint = async (code: string, filePath: string) =>
  new ESLint().lintText(code, { filePath });
const ruleIds = (messages: { ruleId: string | null }[]) =>
  messages.map((m) => m.ruleId);
const FILE_NAME = ["graph", ".yaml"].join("");

describe("REQ-0854: typicalGroup is imported only under the allowed folders", () => {
  const importing =
    'import { typicalGroup } from "../engine/graph.js";\nexport const g = typicalGroup;\n';

  it("fails a module outside the allowed folders", async () => {
    const [r] = await lint(importing, "src/server/fixture.ts");
    expect(ruleIds(r?.messages ?? [])).toContain("no-restricted-imports");
  });

  it("passes a module under src/parent/", async () => {
    const [r] = await lint(importing, "src/parent/fixture.ts");
    expect(r?.messages).toEqual([]);
  });

  it("passes the Director's cold start", async () => {
    const [r] = await lint(importing, "src/engine/director/cold-start.ts");
    expect(r?.messages).toEqual([]);
  });
});

describe("SPC-0050: only the graph loader names the graph file", () => {
  const naming = `export const file = "content/${FILE_NAME}";\n`;

  it("fails a module outside the loader that names the file", async () => {
    const [r] = await lint(naming, "src/server/fixture.ts");
    expect(ruleIds(r?.messages ?? [])).toContain("no-restricted-syntax");
  });

  it("passes the loader itself", async () => {
    const [r] = await lint(naming, "src/engine/graph.ts");
    expect(r?.messages).toEqual([]);
  });
});
