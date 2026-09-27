import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  checkEventsSqlConfined,
  checkGameProjectionImports,
  checkNoKeyInClient,
  checkNoPush,
  checkNoVerdictWords,
} from "../../tools/static-checks.js";

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0))
    rmSync(dir, { recursive: true, force: true });
});
function repo(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "meowtower-static-"));
  dirs.push(root);
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(join(root, path, ".."), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  return root;
}

describe("REQ-2504: no model key in anything a client receives", () => {
  it("passes this repository", () => {
    expect(checkNoKeyInClient(process.cwd())).toEqual([]);
  });
  it("names a client file that carries a key", () => {
    const root = repo({ "dist/client/app.js": 'const k = "sk-or-v1-abc123";' });
    expect(checkNoKeyInClient(root)).toEqual([
      {
        check: "key_in_client",
        file: "dist/client/app.js",
        match: "sk-or-v1-abc123",
      },
    ]);
  });
});

describe("REQ-2544, REQ-2546: the MVP holds no push code", () => {
  it("passes this repository", () => {
    expect(checkNoPush(process.cwd())).toEqual([]);
  });
  it.each([
    [
      "migrations/0009_push.sql",
      "CREATE TABLE push_subscriptions (id TEXT);",
      "push_subscriptions",
    ],
    ["src/server/push.ts", "const VAPID_PUBLIC = 'x';", "VAPID"],
    ["package.json", '{"dependencies":{"web-push":"3"}}', "web-push"],
    [
      "src/server/notify.ts",
      'fetch("https://api.push.apple.com/3/device")',
      "push.apple.com",
    ],
  ])("names %s", (file, text, match) => {
    expect(checkNoPush(repo({ [file]: text }))).toEqual([
      { check: "push_code", file, match },
    ]);
  });
});

describe("REQ-2226: only appendEvents and the migrations name events in SQL", () => {
  it("passes this repository", () => {
    expect(checkEventsSqlConfined(process.cwd())).toEqual([]);
  });
  it.each([
    ["src/server/rogue.ts", 'db.exec("DELETE FROM events");', "FROM events"],
    [
      "src/server/rogue.ts",
      'db.prepare("UPDATE events SET v = 2");',
      "UPDATE events",
    ],
    [
      "src/engine/game/fold.ts",
      "INSERT INTO events (type) VALUES (?)",
      "INTO events",
    ],
    ["tools/fix.sql", "DROP TABLE events;", "TABLE events"],
  ])("names %s for %s", (file, text, match) => {
    expect(checkEventsSqlConfined(repo({ [file]: text }))).toEqual([
      { check: "events_sql", file, match },
    ]);
  });
  it("allows SQL on events in src/engine/events/ and migrations/", () => {
    const root = repo({
      "src/engine/events/append.ts": "INSERT INTO events (type) VALUES (?)",
      "migrations/0002_events.sql": "CREATE TABLE events (seq INTEGER);",
    });
    expect(checkEventsSqlConfined(root)).toEqual([]);
  });
});

describe("projections are pure folds", () => {
  it("finds no clock, random source or network in src/engine/projections", async () => {
    const { checkProjectionsPure } =
      await import("../../tools/static-checks.js");
    expect(checkProjectionsPure(process.cwd())).toEqual([]);
  });
  it("names a projection that reads the clock", async () => {
    const { checkProjectionsPure } =
      await import("../../tools/static-checks.js");
    const root = mkdtempSync(join(tmpdir(), "meowtower-pure-"));
    mkdirSync(join(root, "src/engine/projections"), { recursive: true });
    writeFileSync(
      join(root, "src/engine/projections/bad.ts"),
      "const t = Date.now();",
    );
    expect(checkProjectionsPure(root)).toEqual([
      {
        check: "projection_purity",
        file: "src/engine/projections/bad.ts",
        match: "Date.now",
      },
    ]);
    rmSync(root, { recursive: true, force: true });
  });
});

describe("REQ-2414: no answer reply says «верно» or «неверно»", () => {
  const ru = (strings: Record<string, string>): string =>
    repo({ "content/i18n/ru.json": JSON.stringify(strings) });
  it("passes this repository", () => {
    expect(checkNoVerdictWords(process.cwd())).toEqual([]);
  });
  it("names a battle line holding «Верно!»", () => {
    const root = ru({ "battle.clean.1": "Верно!" });
    expect(checkNoVerdictWords(root)).toEqual([
      {
        check: "verdict_words",
        file: join("content", "i18n", "ru.json"),
        match: "battle.clean.1: Верно!",
      },
    ]);
  });
  it("names «неверно» in a short solution, in any case", () => {
    const root = ru({ "standin.task.2.solution": "Это НЕВЕРНО." });
    expect(checkNoVerdictWords(root)).toHaveLength(1);
  });
  it("passes a word that only contains it, and keys no reply shows", () => {
    const root = ru({
      "battle.alt.1": "Достоверно известно одно.",
      "parent.room.title": "Верно",
    });
    expect(checkNoVerdictWords(root)).toEqual([]);
  });
});

describe("REQ-2224: no game projection reaches the knowledge model, the Director or the answer check", () => {
  const P = "src/engine/projections";
  it("passes this repository", () => {
    expect(checkGameProjectionImports(process.cwd())).toEqual([]);
  });
  it("names a direct import of the knowledge model", () => {
    const root = repo({
      [`${P}/quests.ts`]: 'import { estimate } from "../model/estimate.js";\n',
      "src/engine/model/estimate.ts": "export const estimate = 1;\n",
    });
    expect(checkGameProjectionImports(root)).toEqual([
      {
        check: "game_projection_imports",
        file: join(P, "quests.ts"),
        match: `${join(P, "quests.ts")} -> ${join("src", "engine", "model", "estimate.ts")}`,
      },
    ]);
  });
  it("names the chain through a helper both sides import, to the Director", () => {
    const root = repo({
      [`${P}/rewards.ts`]: 'import { pick } from "../util/shared.js";\n',
      "src/engine/util/shared.ts":
        'export { pick } from "../director/pick.js";\n',
      "src/engine/director/pick.ts": "export const pick = 1;\n",
    });
    const [found] = checkGameProjectionImports(root);
    expect(found?.match).toBe(
      [
        join(P, "rewards.ts"),
        join("src", "engine", "util", "shared.ts"),
        join("src", "engine", "director", "pick.ts"),
      ].join(" -> "),
    );
  });
  it("names an import of the knowledge model's state rules", () => {
    const root = repo({
      [`${P}/familiars.ts`]: 'import { state } from "../states/rules.js";\n',
      "src/engine/states/rules.ts": "export const state = 1;\n",
    });
    expect(checkGameProjectionImports(root)).toHaveLength(1);
  });
  it("names an import of the answer check", () => {
    const root = repo({
      [`${P}/outcomes.ts`]: 'import { check } from "../../shared/answer.js";\n',
      "src/shared/answer.ts": "export const check = 1;\n",
    });
    expect(checkGameProjectionImports(root)).toHaveLength(1);
  });
  it("passes a type-only import and a knowledge projection that reads the model", () => {
    const root = repo({
      [`${P}/threads.ts`]:
        'import type { Estimate } from "../model/estimate.js";\n',
      [`${P}/knowledge.ts`]:
        'import { estimate } from "../model/estimate.js";\n',
      "src/engine/model/estimate.ts": "export const estimate = 1;\n",
    });
    expect(checkGameProjectionImports(root)).toEqual([]);
  });
});
