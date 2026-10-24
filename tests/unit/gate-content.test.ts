// TSK-0682: the build passes every fixed string and 200 rendered seeds of every template through
// the gate (ADR-0160, REQ-3326, REQ-3308).
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import {
  contentFiles,
  gateContent,
  gateStrings,
  gateTemplates,
  kindOf,
} from "../../tools/gate-content.js";
import { renderLines } from "../../src/shared/i18n.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-gate-"));
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe("REQ-3326: every fixed string passes the gate with the kind its key group names", () => {
  it("picks the kind from the key group", () => {
    expect(kindOf("system.awakening")).toBe("system");
    expect(kindOf("ui.home.play")).toBe("label");
    expect(kindOf("canon.ally.name")).toBe("story");
  });

  it("fails a fixture value holding a forbidden form with the file, the key and the form", () => {
    expect(
      gateStrings("fixture.json", { "story.line": "Опять ошибкой?" }),
    ).toEqual([
      {
        check: "forbidden_in_content",
        file: "fixture.json",
        key: "story.line",
        rule: "forbidden_form",
        match: "ошибкой",
      },
    ]);
  });

  it("passes the committed content", () => {
    expect(gateContent(process.cwd())).toEqual([]);
  });

  it("gates a canon paragraph", () => {
    mkdirSync(join(root, "content"), { recursive: true });
    writeFileSync(
      join(root, "content", "canon.ru.md"),
      "Тихая башня.\n\nУрок начался.\n",
    );
    expect(gateContent(root).map((f) => [f.key, f.match])).toEqual([
      ["paragraph 2", "урок"],
    ]);
  });
});

describe("REQ-3326: 200 seeds of every template are rendered and gated", () => {
  it("names the template, the seed and the form for a template that fails on some seeds", () => {
    const bad = {
      id: "fixture.bad",
      render: (seed: number) => [seed === 37 ? "Это задача" : "Ряд открыт"],
    };
    const clean = { id: "fixture.clean", render: () => ["Ряд открыт"] };
    expect(gateTemplates([bad, clean])).toEqual([
      {
        check: "forbidden_in_content",
        file: "fixture.bad",
        key: "fixture.bad",
        rule: "forbidden_form",
        match: "задача",
        seed: 37,
      },
    ]);
  });
});

describe("REQ-3308: a System line holds no digit and a number comes from a placeholder", () => {
  it("fails a system value with a digit", () => {
    expect(
      gateStrings("f.json", { "system.rows": "Открыто 3 ряда" }),
    ).toMatchObject([{ key: "system.rows", rule: "system_digit" }]);
  });

  it("renders a number into a window from a field code fills, and the stored text holds no digit", () => {
    const stored = ["Открыто рядов: {n}"];
    expect(gateStrings("f.json", { "system.rows": stored })).toEqual([]);
    expect(renderLines(stored, { n: 3 })).toEqual([
      { text: "Открыто рядов: 3", pause: false },
    ]);
  });
});

describe("REQ-3326: a language outside the shipped set is skipped", () => {
  it("lists ru.json and skips nl.json", () => {
    mkdirSync(join(root, "content", "i18n"), { recursive: true });
    writeFileSync(join(root, "content", "i18n", "ru.json"), "{}");
    writeFileSync(join(root, "content", "i18n", "nl.json"), "{}");
    expect(contentFiles(root).json).toEqual([
      join("content", "i18n", "ru.json"),
    ]);
  });
});
