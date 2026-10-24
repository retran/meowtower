// TSK-0677: a string written into the code fails the build (ADR-0160, REQ-3810). The Cyrillic scan
// reports the file and the match, and the ESLint rule reports literal text in markup and in the
// aria-label, title, placeholder and alt attributes of a component.
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ESLint } from "eslint";
import { afterAll, describe, expect, it } from "vitest";
import { checkNoCyrillic } from "../../tools/static-checks.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-literal-"));
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe("REQ-3810: the Cyrillic scan reports a Russian label in src", () => {
  it("names the file and the match, and passes a folder of fixtures and clean code", () => {
    mkdirSync(join(root, "src", "client"), { recursive: true });
    mkdirSync(join(root, "src", "client", "__fixtures__"), { recursive: true });
    writeFileSync(
      join(root, "src", "client", "label.ts"),
      'export const label = "Играть";\n',
    );
    writeFileSync(
      join(root, "src", "client", "__fixtures__", "ok.ts"),
      'export const x = "Играть";\n',
    );
    writeFileSync(
      join(root, "src", "client", "clean.ts"),
      "export const y = 1;\n",
    );
    expect(checkNoCyrillic(root)).toEqual([
      {
        check: "cyrillic_in_src",
        file: join("src", "client", "label.ts"),
        match: "Играть",
      },
    ]);
  });

  it("finds nothing in the committed src", () => {
    expect(checkNoCyrillic(process.cwd())).toEqual([]);
  });
});

describe("REQ-3810: no-literal-string reports literal text in markup and attributes", () => {
  const eslint = new ESLint({ cwd: process.cwd() });
  const lint = async (code: string) => {
    const [result] = await eslint.lintText(code, {
      filePath: join(process.cwd(), "src", "client", "probe.tsx"),
    });
    return (result?.messages ?? []).filter(
      (m) => m.ruleId === "i18next/no-literal-string",
    );
  };

  it("reports English text in markup", async () => {
    expect(await lint("export const a = <p>Play now</p>;\n")).toHaveLength(1);
  });

  it.each(["aria-label", "title", "placeholder", "alt"])(
    "reports a literal %s",
    async (attr) => {
      expect(
        await lint(`export const a = <img ${attr}="Dutch label" />;\n`),
      ).toHaveLength(1);
    },
  );

  it("reports nothing when the text comes from a key", async () => {
    expect(
      await lint(
        'declare const t: (k: string) => string;\nexport const a = <p aria-label={t("ui.a")}>{t("ui.b")}</p>;\n',
      ),
    ).toHaveLength(0);
  });
});
