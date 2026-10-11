// TSK-0481: the generator, the templates, the renderer and the answer checker
// import no model gateway and no network module, so a task is computed from its
// seed alone (REQ-1216). A fixture that imports one makes the rule fail.
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const lint = async (code: string, filePath: string) =>
  new ESLint().lintText(code, { filePath });

const restricted = [
  "src/math/fixture.ts",
  "src/templates/fixture.ts",
  "src/render/fixture.ts",
  "src/shared/answer.ts",
];

describe("REQ-1216: no model gateway or network module under the computing folders", () => {
  it.each(restricted)("fails a network import in %s", async (filePath) => {
    const [result] = await lint(
      'import { request } from "node:http";\nexport const send = request;\n',
      filePath,
    );
    expect(result?.messages.map((m) => m.ruleId)).toContain(
      "no-restricted-imports",
    );
  });

  it.each(restricted)("fails a gateway import in %s", async (filePath) => {
    const [result] = await lint(
      'import { call } from "../server/gateway/client.js";\nexport const ask = call;\n',
      filePath,
    );
    expect(result?.messages.map((m) => m.ruleId)).toContain(
      "no-restricted-imports",
    );
  });

  it("passes a fixture that imports only the seeded source", async () => {
    const [result] = await lint(
      'import { Xoshiro128 } from "../math/rng.js";\nexport const draw = Xoshiro128;\n',
      "src/templates/fixture.ts",
    );
    expect(result?.messages).toEqual([]);
  });
});
