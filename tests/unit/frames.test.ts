// ADR-3100: a frame keeps the engine's numbers, passes its checks ahead of the room, and a task with no
// frame shows its template text.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { baseSeed } from "../../src/math/rng.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { adminPage } from "../../src/server/admin.js";
import { llmAudit } from "../../src/server/audit.js";
import { codeFault } from "../../src/server/frames/check.js";
import { createFrameQueue, framable } from "../../src/server/frames/queue.js";
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
  (t) => framable(t, base) && t.blank("ru").includes("{a}"),
);
if (!template) throw new Error("no_framable_template");

/** A model that wraps the blank, is safe, and solves through a function. */
function model(
  solve: (r: GatewayRequest) => string,
): Gateway & { seen: GatewayRequest[] } {
  return {
    seen: [],
    call(r) {
      this.seen.push(r);
      const text =
        r.role === "TASK_TEXT_MODEL"
          ? JSON.stringify({
              frames: [`На этаже Башни узел. ${template?.blank("ru") ?? ""}`],
            })
          : r.role === "SAFETY_MODEL"
            ? JSON.stringify({ safe: true, joke: false })
            : solve(r);
      return Promise.resolve({ ok: true, text });
    },
  };
}

const answerOf = (r: GatewayRequest): string => {
  for (const k of [0, 1, 2]) {
    const seed =
      k === 0
        ? base
        : baseSeed(Buffer.from(base).toString("hex"), template.id, k);
    const made = template.make(
      seed,
      "ru",
      `На этаже Башни узел. ${template.blank("ru")}`,
    );
    if (made.text === r.user) return made.entry;
  }
  return "?";
};

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
  it("rejects a text that is too long", () => {
    expect(
      codeFault(`Раз. Два слова. Ещё фраза. И {a} {=a+b}.`, blank, "en"),
    ).toBe("length");
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
  it("makes a frame ready, and the task shows it with the engine's numbers", async () => {
    const queue = createFrameQueue({
      db: database(),
      gateway: model(answerOf),
      zone: "UTC",
    });
    await queue.prepare(task);
    const frame = queue.take(task);
    expect(frame).not.toBeNull();
    expect(queue.take(task)).toBeNull();
    const plain = template.make(base, "ru");
    const framed = template.make(base, "ru", frame?.text);
    expect(framed.text).toContain("На этаже Башни");
    expect(framed.entry).toBe(plain.entry);
  });
  it("rejects a frame that fails one blind solve and shows no answer to the solver", async () => {
    const db = database();
    let count = 0;
    const gateway = model((r) => {
      count += 1;
      return count === 2 ? "?" : answerOf(r);
    });
    const queue = createFrameQueue({ db, gateway, zone: "UTC" });
    await queue.prepare(task);
    expect(queue.take(task)).toBeNull();
    expect(db.prepare("SELECT status, step FROM frames").get()).toEqual({
      status: "rejected",
      step: "blind_solve",
    });
    const solves = gateway.seen.filter((r) => r.role === "LIVE_CHECK_MODEL");
    expect(solves).toHaveLength(3);
    for (const solve of solves) expect(solve.schema).toBeUndefined();
  });
  it("leaves no frame when the model fails", async () => {
    const queue = createFrameQueue({
      db: database(),
      gateway: {
        call: () => Promise.resolve({ ok: false, reason: "provider_failed" }),
      },
      zone: "UTC",
    });
    await queue.prepare(task);
    expect(queue.take(task)).toBeNull();
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
