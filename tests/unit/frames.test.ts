// ADR-3100: a frame keeps the engine's numbers, passes its checks ahead of the room, and a task with no
// frame shows its template text.
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { baseSeed } from "../../src/math/rng.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { adminPage } from "../../src/server/admin.js";
import { llmAudit } from "../../src/server/audit.js";
import { codeFault } from "../../src/server/frames/check.js";
import { present, presentFramed } from "../../src/server/task-source.js";
import { textGate } from "../../src/shared/voice/gate.js";
import { createFrameQueue } from "../../src/server/frames/queue.js";
import {
  frameSystem,
  frameUser,
  NO_SLOTS,
} from "../../src/server/frames/request.js";
import type {
  Gateway,
  GatewayRequest,
} from "../../src/server/gateway/gateway.js";
import { templates } from "../../src/templates/index.js";
import type { Lang } from "../../src/templates/spec.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-frames-"));
const opened: Db[] = [];
afterAll(() => {
  for (const db of opened) db.close();
  rmSync(root, { recursive: true, force: true });
});
let n = 0;
const database = (): Db => {
  n += 1;
  const db = openDatabase(join(root, `${n.toString()}.sqlite`));
  opened.push(db);
  return db;
};

const base = baseSeed("s", "t", 0);
const template = templates.find(
  (t) => t.answer === "integer" && t.blank("ru").includes("{a}"),
);
if (!template) throw new Error("no_framable_template");

const wrapped = `На этаже Башни узел. ${template.blank("ru")}`;
const other = `Страж ждёт у нити. ${template.blank("ru")}`;
const answers = (
  over: Record<string, number> = {},
  choice = "variant_2",
): string =>
  JSON.stringify({
    unsafe_1: 0,
    joke_1: 0,
    changed_1: 0,
    unsafe_2: 0,
    joke_2: 0,
    changed_2: 0,
    best: { choice, probabilities: { variant_1: 0.3, variant_2: 0.7 } },
    ...over,
  });
const CLEAN = answers();

/** A model that wraps the blank, and a judge that answers `verdict`. */
function model(verdict: string | null): Gateway & { seen: GatewayRequest[] } {
  return {
    seen: [],
    call(r) {
      this.seen.push(r);
      if (r.role === "TASK_TEXT_MODEL")
        return Promise.resolve({
          ok: true,
          text: JSON.stringify({ frames: [wrapped, other] }),
        });
      return Promise.resolve(
        verdict === null
          ? { ok: false, reason: "provider_failed" }
          : { ok: true, text: verdict },
      );
    },
  };
}

describe("the code checks", () => {
  const blank = "Найди {a} и {=a+b}.";
  it("passes a frame that keeps every placeholder", () => {
    expect(
      codeFault("Страж просит: найди {=a+b} и {a}.", blank, "ru"),
    ).toBeNull();
  });
  it("rejects a missing or doubled placeholder", () => {
    expect(codeFault("Найди {a}.", blank, "ru")).toBe("placeholders");
    expect(codeFault("{a} {a} {=a+b}.", blank, "ru")).toBe("placeholders");
  });
  it("rejects a digit and a number word in each language", () => {
    expect(codeFault("Найди 7, {a} и {=a+b}.", blank, "ru")).toBe("digit");
    const words: Record<Lang, string> = {
      ru: "дюжина",
      en: "dozen",
      nl: "dozijn",
    };
    for (const lang of ["ru", "en", "nl"] as const)
      expect(codeFault(`${words[lang]} {a} {=a+b}.`, blank, lang)).toBe(
        "number_word",
      );
  });
  it("keeps a number the template writes itself", () => {
    expect(
      codeFault("Страж просит: 10 и {a}.", "Сложи 10 и {a}.", "ru"),
    ).toBeNull();
    expect(codeFault("Страж просит {a}.", "Сложи 10 и {a}.", "ru")).toBe(
      "digit",
    );
  });
  it("rejects a text that is too long", () => {
    expect(codeFault("Ax. Bx. Cx. Dx. Ex. {a} {=a+b}.", blank, "en")).toBe(
      "length",
    );
  });
});

describe("the prompt", () => {
  it("is in the game's language and keeps empty places for the summaries", () => {
    expect(frameSystem("ru")).toContain("Башня");
    expect(frameSystem("en")).toContain("Tower");
    expect(frameSystem("nl")).toContain("Toren");
    const user = frameUser({
      blank: "x",
      roles: {},
      lang: "ru",
      slots: NO_SLOTS,
    });
    expect(user).toContain("<story_arc></story_arc>");
    expect(user).toContain("<adventure></adventure>");
    expect(user).toContain("<game_situation></game_situation>");
  });
});

describe("the queue", () => {
  const task = { template, base, bucket: "b", lang: "ru" as const };
  const queueOf = (gateway: Gateway, db = database()) =>
    createFrameQueue({ db, gateway, zone: "UTC" });
  it("makes a frame ready with two calls, and the task shows the engine's numbers", async () => {
    const gateway = model(CLEAN);
    const queue = queueOf(gateway);
    await queue.prepare(task);
    const frame = queue.take(task);
    expect(gateway.seen.map((r) => r.role)).toEqual([
      "TASK_TEXT_MODEL",
      "FRAME_JUDGE_MODEL",
    ]);
    expect(queue.take(task)).toBeNull();
    const framed = template.make(base, "ru", frame?.text);
    expect(framed.text).toContain("Страж ждёт у нити");
    expect(framed.entry).toBe(template.make(base, "ru").entry);
  });
  it("keeps the variant that passed when the choice fell on a rejected one", async () => {
    const queue = queueOf(model(answers({ unsafe_2: 0.9 })));
    await queue.prepare(task);
    expect(queue.take(task)?.text).toBe(wrapped);
  });
  it("sends the judge every variant and the original in one request", async () => {
    const gateway = model(CLEAN);
    await queueOf(gateway).prepare(task);
    const judge = gateway.seen[1];
    expect(judge?.user).toBe(
      `Вариант 1: ${wrapped}\nВариант 2: ${other}\n---\n${template.blank("ru")}`,
    );
    expect(Object.keys(judge?.questions ?? {})).toHaveLength(7);
    expect(judge?.questions?.["best"]).toMatchObject({
      criteria: { variant_1: "Вариант 1", variant_2: "Вариант 2" },
    });
  });
  it.each([
    { unsafe_1: 0.3, unsafe_2: 0.3 },
    { joke_1: 0.6, joke_2: 0.6 },
    { changed_1: 0.3, changed_2: 0.3 },
  ])("rejects doubt: %j", async (over) => {
    const db = database();
    const queue = queueOf(model(answers(over)), db);
    await queue.prepare(task);
    expect(queue.take(task)).toBeNull();
    expect(
      db.prepare("SELECT DISTINCT status, step FROM frames").all(),
    ).toEqual([{ status: "rejected", step: "judge" }]);
  });
  it("leaves no frame when the judge fails", async () => {
    const db = database();
    const queue = queueOf(model(null), db);
    await queue.prepare(task);
    expect(queue.take(task)).toBeNull();
    expect(db.prepare("SELECT COUNT(*) AS n FROM frames").get()).toEqual({
      n: 0,
    });
  });
  it("leaves no frame when the author fails", async () => {
    const queue = queueOf({
      call: () => Promise.resolve({ ok: false, reason: "provider_failed" }),
    });
    await queue.prepare(task);
    expect(queue.take(task)).toBeNull();
  });
});

describe("every template", () => {
  it("takes a frame in each language with its buttons and picture unchanged", () => {
    for (const lang of ["ru", "en", "nl"] as const)
      for (const t of templates) {
        const framed = presentFramed(
          t,
          base,
          lang,
          `Страж ждёт. ${t.blank(lang)}`,
        );
        const plain = present({ template: t, made: t.make(base, lang) });
        expect(framed.options).toEqual(plain.options);
        expect(framed.input).toEqual(plain.input);
        expect(framed.answer).toBe(plain.answer);
        expect(framed.text).toContain("Страж ждёт.");
      }
  });
});

describe("the forbidden lists", () => {
  it("hold each language's words and leave its plain text alone", () => {
    const gate = (text: string, lang: "en" | "nl") =>
      textGate(text, { lang, kind: "task", source: "frame" }).ok;
    expect(gate("You made a mistake.", "en")).toBe(false);
    expect(gate("Solve this sum.", "en")).toBe(false);
    expect(gate("Dat is een fout.", "nl")).toBe(false);
    expect(gate("Een Toren vol draden.", "nl")).toBe(true);
    expect(gate("A Tower of threads.", "en")).toBe(true);
    for (const lang of ["en", "nl"] as const) {
      const file = new URL(
        `../../content/shaming.${lang}.json`,
        import.meta.url,
      );
      const { fixtures } = JSON.parse(readFileSync(file, "utf8")) as {
        fixtures: { match: string[]; pass: string[] };
      };
      for (const m of fixtures.match) expect(gate(m, lang)).toBe(false);
      for (const m of fixtures.pass) expect(gate(m, lang)).toBe(true);
    }
  });
});

describe("the admin page", () => {
  it("shows the figures and the whole of a model call", () => {
    const db = database();
    db.prepare(
      `INSERT INTO llm_log (at, role, route, model, tier, bucket, input_tokens, output_tokens,
         cost_usd, latency_ms, outcome, request, response)
       VALUES ('2026-10-31', 'SAFETY_MODEL', 'anthropic', 'm', 'player', 'b', 1, 2, 0.5, 3, 'ok', '{"q":"<x>"}', 'reply')`,
    ).run();
    expect(llmAudit(db, 10)).toHaveLength(1);
    const page = adminPage(db, new Date("2026-10-31T12:00:00Z"), []);
    expect(page).toContain("$0.50");
    expect(page).toContain("&lt;x&gt;");
    expect(page).toContain("reply");
  });
});
