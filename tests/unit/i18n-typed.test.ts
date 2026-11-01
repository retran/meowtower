// TSK-0676: one typed function reads every string from the language file, and a language is
// shipped only when its keys match (ADR-0160, REQ-3810, REQ-3304).
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import {
  checkParity,
  isShipped,
  keyFor,
  renderLines,
  renderValue,
  SHIPPED,
  t,
} from "../../src/shared/i18n.js";
import { checkKeysFresh } from "../../tools/static-checks.js";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-i18n-"));
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe("REQ-3810: a missing key or a missing placeholder value fails the type check", () => {
  it("fails tsc at a call with an unknown key and at a call with no value for a placeholder", () => {
    const repo = process.cwd();
    const fixture = join(root, "bad.ts");
    writeFileSync(
      fixture,
      [
        `import { t } from "${repo}/src/shared/i18n.js";`,
        `t("ui.no.such.key");`,
        `t("ui.pair.locked");`,
        `t("ui.pair.locked", { time: "09:00" });`,
        `t("ui.home.play");`,
      ].join("\n"),
    );
    writeFileSync(
      join(root, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          target: "ES2023",
          module: "NodeNext",
          moduleResolution: "NodeNext",
          strict: true,
          skipLibCheck: true,
          noEmit: true,
          typeRoots: [`${repo}/node_modules/@types`],
          types: ["node"],
        },
        files: [fixture],
      }),
    );
    const run = spawnSync(`${repo}/node_modules/.bin/tsc`, ["-p", root], {
      encoding: "utf8",
    });
    const lines = run.stdout.split("\n").filter((l) => l.includes("error TS"));
    expect(run.status).not.toBe(0);
    expect(lines.some((l) => l.includes("bad.ts(2,"))).toBe(true);
    expect(lines.some((l) => l.includes("bad.ts(3,"))).toBe(true);
    expect(lines.some((l) => l.includes("bad.ts(4,"))).toBe(false);
    expect(lines.some((l) => l.includes("bad.ts(5,"))).toBe(false);
  }, 60_000);

  it("fills placeholders from the call", () => {
    expect(t("ui.pair.locked", { time: "09:00" })).toContain("09:00");
  });
});

describe("REQ-3810: a plural value picks the form Intl.PluralRules selects for Russian", () => {
  const plural = {
    one: "{n} задача",
    few: "{n} задачи",
    many: "{n} задач",
    other: "{n} задачи",
  };
  it.each([
    [1, "1 задача"],
    [2, "2 задачи"],
    [5, "5 задач"],
    [21, "21 задача"],
  ])("renders n = %i as %s", (n, text) => {
    expect(renderValue(plural, "ru", { n }, "test")).toBe(text);
  });
});

describe("REQ-3304: the self-correction is its own line, marked as a pause", () => {
  it("marks only the pause line", () => {
    const rendered = renderLines(
      ["Первая строка.", { pause: "Нет, подожди: {what}." }, "Последняя."],
      {
        what: "ошибка",
      },
    );
    expect(rendered).toEqual([
      { text: "Первая строка.", pause: false },
      { text: "Нет, подожди: ошибка.", pause: true },
      { text: "Последняя.", pause: false },
    ]);
  });
});

describe("REQ-3810: a language is shipped only when its keys and placeholders match", () => {
  const reference = JSON.parse(
    readFileSync("content/i18n/ru.json", "utf8"),
  ) as Record<string, string>;

  it("reports the language, the key and the placeholder a second file lacks", () => {
    const other = { ...reference };
    delete other["ui.home.play"];
    other["ui.pair.locked"] = "Locked.";
    expect(checkParity(reference, other, "nl")).toEqual([
      { language: "nl", key: "ui.home.play" },
      { language: "nl", key: "ui.pair.locked", placeholder: "time" },
    ]);
  });

  it("passes the reference against itself", () => {
    expect(checkParity(reference, reference, "ru")).toEqual([]);
  });

  it("ships Russian, English and Dutch", () => {
    expect(SHIPPED).toEqual(["ru", "en", "nl"]);
    expect(isShipped("ru")).toBe(true);
    expect(isShipped("de")).toBe(false);
  });
});

describe("REQ-3810: a key built at run time is checked against the file", () => {
  it("accepts a plain key and refuses a missing key and a key with a placeholder", () => {
    expect(keyFor("ui.home.play")).toBe("ui.home.play");
    expect(() => keyFor("ui.no.such")).toThrow("string_missing");
    expect(() => keyFor("ui.pair.locked")).toThrow("string_not_plain");
  });
});

describe("REQ-3810: a request for a language outside the shipped set gets Russian and a 400", () => {
  const db = openDatabase(join(root, "route.sqlite"));
  const app = createApp({ db });
  afterAll(() => db.close());

  it("answers 400 with the Russian strings for de and 200 for ru", async () => {
    const de = await app.request("/i18n/de.json");
    expect(de.status).toBe(400);
    expect(((await de.json()) as Record<string, string>)["ui.home.play"]).toBe(
      t("ui.home.play"),
    );
    expect((await app.request("/i18n/ru.json")).status).toBe(200);
    expect((await app.request("/i18n/x.txt")).status).toBe(404);
  });
});

describe("TSK-0676: the generated key file is current", () => {
  it("matches what tools/gen-keys.ts writes from ru.json", async () => {
    expect(await checkKeysFresh()).toEqual([]);
  });
});
