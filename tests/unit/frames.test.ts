// ADR-3100: a frame keeps the engine's numbers, passes its checks ahead of the room, and a task with no
// frame shows its template text.
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { baseSeed } from "../../src/math/rng.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { dashboard, llmAudit } from "../../src/server/audit.js";
import { codeFault, scoreOf } from "../../src/server/frames/check.js";
import { present, presentFramed } from "../../src/server/task-source.js";
import { textGate } from "../../src/shared/voice/gate.js";
import { createFrameQueue } from "../../src/server/frames/queue.js";
import {
  frameSystem,
  frameUser,
  promptOf,
  situationOf,
  NO_SLOTS,
} from "../../src/server/frames/request.js";
import type {
  Gateway,
  GatewayRequest,
} from "../../src/server/gateway/gateway.js";
import { templates } from "../../src/templates/index.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-frames-"));
const opened: Db[] = [];
afterAll(async () => {
  for (const db of opened) await db.close();
  rmSync(root, { recursive: true, force: true });
});
let n = 0;
const database = async (): Promise<Db> => {
  n += 1;
  const db = await openDatabase(join(root, `${n.toString()}.sqlite`));
  opened.push(db);
  return db;
};

const base = baseSeed("s", "t", 0);
const template = templates.find(
  (t) => t.answer === "integer" && t.blank("ru").includes("{a}"),
);
if (!template) throw new Error("no_framable_template");

const clean = {
  unsafe: 0,
  changed: 0,
  fits: 0.5,
  flows: 0.5,
  clear: 0.5,
  alive: 0.5,
  sense: 0.5,
  numbers: 0,
};
/** The judge's answers: `other` scores higher unless a test says otherwise. */
const answering =
  (
    of: (variant: string) => Partial<typeof clean & { ignores: number }>,
  ): ((r: GatewayRequest) => string) =>
  (r) =>
    JSON.stringify({
      ...clean,
      ...of(/^История:\n(.*)\n\nИсходная/su.exec(r.user)?.[1] ?? ""),
    });

describe("the code checks", () => {
  const task = "Найди 7.";
  it("passes a text with any numbers", () => {
    expect(codeFault("Страж просит найти 7 и ещё 9?", task, "ru")).toBeNull();
  });
  it("marks a text that ends with no question", () => {
    expect(codeFault("Он стоит над яблоками.", task, "ru")).toBe("question");
  });
  it("marks a forbidden word and a text that is too long", () => {
    expect(codeFault("Это ошибка?", task, "ru")).toBe("gate");
    expect(
      codeFault("Ax. Bx. Cx. Dx. Ex. Fx. Gx. Hx. Ix. Jx?", task, "en"),
    ).toBe("length");
  });
});

describe("the prompt", () => {
  it("is in the game's language and keeps empty places for the summaries", () => {
    expect(frameSystem("ru", 2)).toContain("Башня");
    expect(frameSystem("en", 2)).toContain("Tower");
    expect(frameSystem("nl", 2)).toContain("Toren");
    const user = frameUser({
      task: "x",
      roles: {},
      lang: "ru",
      slots: NO_SLOTS,
      told: ["old story"],
      answers: [],
      kind: "integer",
    });
    expect(user).toContain("<told>\nold story\n</told>");
    expect(user).toContain("<story_arc></story_arc>");
    expect(user).toContain("<adventure></adventure>");
    expect(user).toContain("<game_situation></game_situation>");
  });
});

describe("REQ-8176: the story is set in what she tried", () => {
  const situation = { tried: "pick the lock", hard: "it is stiff" };
  const request = (slots: Parameters<typeof frameUser>[0]["slots"]) =>
    frameUser({
      task: "x",
      roles: {},
      lang: "en",
      slots,
      told: [],
      answers: [],
      kind: "integer",
    });

  it("puts her action in the situation, in the game's language", () => {
    for (const lang of ["ru", "en", "nl"] as const) {
      const user = frameUser({
        task: "x",
        roles: {},
        lang,
        slots: { ...NO_SLOTS, situation: situationOf(lang, situation) },
        told: [],
        answers: [],
        kind: "integer",
      });
      expect(user).toMatch(/<game_situation>[^<]*pick the lock[^<]*<\//u);
      expect(user).toContain("it is stiff");
    }
  });

  it("leaves the situation empty with no action", () => {
    expect(request(NO_SLOTS)).toContain("<game_situation></game_situation>");
  });
});

describe("the queue", () => {
  const rightAnswer = template.make(base, "ru").entry;
  const task = { template, base, bucket: "b", lang: "ru" as const };
  const queueOf = async (
    gateway: Gateway,
    db?: Awaited<ReturnType<typeof database>>,
  ) => createFrameQueue({ db: db ?? (await database()), gateway, zone: "UTC" });
  /** An author that writes `stories` in turn, and a judge that scores each by `of`. */
  const writing = (
    stories: readonly string[],
    of: (story: string) => Partial<typeof clean & { ignores: number }>,
    solve: (r: GatewayRequest) => string = (r) =>
      r.user.length > 0 ? rightAnswer : "",
  ): Gateway & { seen: GatewayRequest[] } => {
    let round = 0;
    return {
      seen: [],
      async call(r) {
        this.seen.push(r);
        if (r.role === "TASK_TEXT_MODEL") {
          round += 1;
          return Promise.resolve({
            ok: true,
            text: JSON.stringify({ story: stories[round - 1] ?? "x?" }),
          });
        }
        return Promise.resolve({
          ok: true,
          text: JSON.stringify({
            ...JSON.parse(answering(of)(r)),
            answer: solve(r),
          }),
        });
      },
    };
  };
  it("takes the first story that clears the bar, with two calls", async () => {
    const gateway = writing(["Первая?"], () => ({}));
    const queue = await queueOf(gateway);
    await queue.prepare(task);
    expect(gateway.seen.map((r) => r.role)).toEqual([
      "TASK_TEXT_MODEL",
      "FRAME_JUDGE_MODEL",
    ]);
    expect((await queue.take(task))?.text).toBe("Первая?");
    expect(await queue.take(task)).toBeNull();
  });
  it("writes again below the bar", async () => {
    const queue = await queueOf(
      writing(["Плохая?", "Хорошая?"], (v) =>
        v === "Плохая?" ? { changed: 0.9 } : {},
      ),
    );
    await queue.prepare(task);
    expect((await queue.take(task))?.text).toBe("Хорошая?");
  });
  it("writes again when the story can't be solved to the engine's answer", async () => {
    const gateway = writing(
      ["Нерешаемая?", "Решаемая?"],
      () => ({}),
      (r) => (r.user.includes("Нерешаемая") ? "нет" : rightAnswer),
    );
    const queue = await queueOf(gateway);
    await queue.prepare(task);
    expect((await queue.take(task))?.text).toBe("Решаемая?");
  });
  it("shows the best of three rounds when none clears the bar", async () => {
    const queue = await queueOf(
      writing(["Раз?", "Два?", "Три?"], (v) => ({
        changed: v === "Два?" ? 0.6 : 0.9,
      })),
    );
    await queue.prepare(task);
    expect((await queue.take(task))?.text).toBe("Два?");
  });
  it("removes only a plainly unsafe text", async () => {
    const db = await database();
    const queue = await queueOf(
      writing(["Жуть?"], () => ({ unsafe: 0.7 })),
      db,
    );
    await queue.prepare(task);
    expect(await queue.take(task)).toBeNull();
    expect(
      await db.prepare("SELECT DISTINCT status, step FROM frames").all(),
    ).toEqual([{ status: "rejected", step: "judge" }]);
  });
  it("counts numbers that differ from the task against a story", async () => {
    const score = (over: Partial<typeof clean>): number =>
      scoreOf({ ...clean, ...over }) ?? 0;
    expect(score({ numbers: 0.6 })).toBeLessThan(score({}));
    expect(score({ fits: 1, alive: 0 })).toBeGreaterThan(
      score({ fits: 0, alive: 1 }),
    );
  });
  it("follows the parent's level in the author's tone and the judge's safety bar", async () => {
    const gateway = writing(["Текст?"], () => ({}));
    const queue = createFrameQueue({
      db: await database(),
      gateway,
      zone: "UTC",
      level: async () => 0,
    });
    await queue.prepare(task);
    expect(gateway.seen[0]?.system).toContain("без жути");
    expect(gateway.seen[0]?.system).toContain("Никогда");
    expect(
      gateway.seen.find((r) => r.role === "FRAME_JUDGE_MODEL")?.system,
    ).toContain("без жути");
  });
  it("gives the author and the judge a task's answer options", async () => {
    const choice = templates.find((t) => t.answer === "compare");
    if (!choice) throw new Error("no_compare");
    const gateway = writing(["Текст?"], () => ({}));
    await (await queueOf(gateway)).prepare({ ...task, template: choice });
    expect(gateway.seen[0]?.user).toContain("<answers><; =; ></answers>");
    expect(gateway.seen[0]?.user).toContain("кнопки со знаками");
    expect(
      gateway.seen.find((r) => r.role === "FRAME_JUDGE_MODEL")?.user,
    ).toContain("кнопки со знаками");
  });
  it("waits for a frame, starts one nobody started, and gives up at its limit", async () => {
    const queue = await queueOf(writing(["Текст?"], () => ({})));
    await queue.ready(task, 1000);
    expect(await queue.take(task)).not.toBeNull();
    const stuck = await queueOf({ call: () => new Promise(() => undefined) });
    await stuck.ready(task, 10);
    expect(await stuck.take(task)).toBeNull();
  });
  it("shows the author a task's picture", async () => {
    const drawn = templates.find((t) => t.make(base).svg !== null);
    if (!drawn) throw new Error("no_picture");
    const gateway = writing(["Текст?"], () => ({}));
    await (await queueOf(gateway)).prepare({ ...task, template: drawn });
    expect(gateway.seen[0]?.user).toContain("<picture><svg");
  });
  it("gives the author her action when the task has one", async () => {
    const gateway = writing(["Текст?"], () => ({}));
    await (
      await queueOf(gateway)
    ).prepare({
      ...task,
      situation: { tried: "pick the lock", hard: "it is stiff" },
    });
    expect(gateway.seen[0]?.user).toContain("pick the lock");
    expect(gateway.seen[0]?.user).toContain("it is stiff");
  });
  const acting = { tried: "pick the lock", hard: "it is stiff" };
  it("REQ-8214: asks the judge whether the story ignores her action, and shows it the action", async () => {
    const gateway = writing(["Текст?"], () => ({ ignores: 0 }));
    await (await queueOf(gateway)).prepare({ ...task, situation: acting });
    const judge = gateway.seen.find((r) => r.role === "FRAME_JUDGE_MODEL");
    expect(judge?.system).toContain("ignores:");
    expect(judge?.user).toContain("pick the lock");
    expect(judge?.user).toContain("it is stiff");
    expect(
      (judge?.schema as { properties: Record<string, unknown> }).properties,
    ).toHaveProperty("ignores");
  });
  it("REQ-8214: does not ask it for a task with no action", async () => {
    const gateway = writing(["Текст?"], () => ({}));
    await (await queueOf(gateway)).prepare(task);
    const judge = gateway.seen.find((r) => r.role === "FRAME_JUDGE_MODEL");
    expect(judge?.system).not.toContain("ignores:");
    expect(
      (judge?.schema as { properties: Record<string, unknown> }).properties,
    ).not.toHaveProperty("ignores");
  });
  it("REQ-8214: writes again when the story ignores her action", async () => {
    const gateway = writing(["Мимо действия?", "По действию?"], (v) => ({
      ignores: v === "Мимо действия?" ? 1 : 0,
    }));
    const queue = await queueOf(gateway);
    await queue.prepare({ ...task, situation: acting });
    expect(
      gateway.seen.filter((r) => r.role === "TASK_TEXT_MODEL"),
    ).toHaveLength(2);
    expect((await queue.take({ ...task, situation: acting }))?.text).toBe(
      "По действию?",
    );
  });
  it("gives a second attempt the story it continues, and no other stories", async () => {
    const gateway = writing(["Старая?", "Новая?"], () => ({}));
    const queue = await queueOf(gateway);
    await queue.prepare(task);
    await queue.prepare({
      ...task,
      base: baseSeed("s", "t", 1),
      previous: "Мост вздохнул.",
    });
    const user =
      gateway.seen.filter((r) => r.role === "TASK_TEXT_MODEL")[1]?.user ?? "";
    expect(user).toContain("<previous_story>Мост вздохнул.</previous_story>");
    expect(user).toContain("Не начинай новую историю");
    expect(user).not.toContain("Старая?");
  });
  it("gives the author the same filled task on every attempt, ", async () => {
    const gateway = writing(
      ["Это ошибка.", "Это ошибка.", "Это ошибка."],
      () => ({}),
    );
    await (await queueOf(gateway)).prepare(task);
    const filled = template.make(base, "ru", template.blank("ru")).text;
    const authored = gateway.seen.filter((r) => r.role === "TASK_TEXT_MODEL");
    expect(authored).toHaveLength(3);
    for (const r of authored)
      expect(r.user).toContain(`<task>${filled}</task>`);
  });
  it("tells the author the recent stories of its language", async () => {
    const gateway = writing(["Старая?", "Новая?"], () => ({}));
    const queue = await queueOf(gateway);
    await queue.prepare(task);
    await queue.prepare({ ...task, base: baseSeed("s", "t", 1) });
    const authored = gateway.seen.filter((r) => r.role === "TASK_TEXT_MODEL");
    expect(authored[1]?.user).toContain("Старая?");
  });
  it("leaves no frame when a model fails", async () => {
    const queue = await queueOf({
      call: async () =>
        Promise.resolve({ ok: false, reason: "provider_failed" }),
    });
    await queue.prepare(task);
    expect(await queue.take(task)).toBeNull();
  });
});

describe("every template", () => {
  it("keeps its buttons and answer under a frame in each language", () => {
    for (const lang of ["ru", "en", "nl"] as const)
      for (const t of templates) {
        const item = { template: t, made: t.make(base, lang) };
        const framed = presentFramed(item, "Страж ждёт.");
        const plain = present(item);
        expect(framed.options).toEqual(plain.options);
        expect(framed.answer).toBe(plain.answer);
        expect(framed.text).toBe("Страж ждёт.");
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

describe("the parent's figures and model audit", () => {
  it("hold the month's spend and the whole of a model call", async () => {
    const db = await database();
    await db
      .prepare(
        `INSERT INTO llm_log (at, role, route, model, tier, bucket, input_tokens, output_tokens,
         cost_usd, latency_ms, outcome, request, response)
       VALUES ('2026-10-31', 'SAFETY_MODEL', 'anthropic', 'm', 'player', 'b', 1, 2, 0.5, 3, 'ok', '{"q":"<x>"}', 'reply')`,
      )
      .run();
    expect(await llmAudit(db, 10)).toHaveLength(1);
    expect(
      (await dashboard(db, new Date("2026-10-31T12:00:00Z"))).monthUsd,
    ).toBe(0.5);
    const [row] = await llmAudit(db, 10);
    expect(row?.request).toBe('{"q":"<x>"}');
    expect(row?.response).toBe("reply");
  });
});

describe("REQ-8214: what the judge's answer about her action costs", () => {
  it("lowers the score of a story that ignores the action, by the whole answer", () => {
    const base = scoreOf(clean) ?? 0;
    expect((scoreOf({ ...clean, ignores: 0 }) ?? 0) - base).toBeCloseTo(0, 5);
    expect((scoreOf({ ...clean, ignores: 1 }) ?? 0) - base).toBeCloseTo(-1, 5);
  });

  it("has the question and the label of the action in every language", () => {
    for (const lang of ["ru", "en", "nl"] as const) {
      const judge = promptOf(lang).judge;
      expect(judge.questions.ignores.instructions.length, lang).toBeGreaterThan(
        0,
      );
      expect(
        judge.questions.ignores.criteria.true.length,
        lang,
      ).toBeGreaterThan(0);
      expect(
        judge.questions.ignores.criteria.false.length,
        lang,
      ).toBeGreaterThan(0);
      expect(judge.action.length, lang).toBeGreaterThan(0);
    }
  });
});
