// TSK-0310: a 30-day run over the stand-in adventure through the API. The
// recorder reads every packet: none carries the task's design (REQ-2428), and
// none carries a correct answer before that task's first attempt (REQ-2420).
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, expect, it } from "vitest";
import { itemEvents } from "../../src/engine/events/read.js";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { forbiddenFields } from "../helpers/packets.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-recorder-"));
const db = openDatabase(join(dir, "live.sqlite"));
afterAll(() => {
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

// Every string a packet shows, leaving out identifiers: a UUID's digits are
// not an answer, and a key ending in "Id" names a record rather than shows it.
const strings = (value: unknown): string[] =>
  typeof value === "string"
    ? [value]
    : Array.isArray(value)
      ? value.flatMap(strings)
      : value && typeof value === "object"
        ? Object.entries(value)
            .filter(([k]) => !k.endsWith("Id"))
            .flatMap(([, v]) => strings(v))
        : [];

it("finds 0 forbidden fields and 0 early answers in 30 days of packets", async () => {
  // A clock that moves 100 ms a request keeps the run under the rate cap, and
  // an explainer that answers at once puts explanation_ready on the poll route.
  let clock = 0;
  const app = createApp({
    db,
    now: () => (clock += 100),
    explainer: () => Promise.resolve("Объяснение."),
  });
  const cookie = `meowtower_device=${registerDevice(db, "tablet")}`;
  const packets: { itemId?: string; body: unknown }[] = [];
  const answered = new Set<string>();
  const earlyAnswers: string[] = [];
  const refused: string[] = [];

  // A task's answer may reach the client only in a reply to an attempt on it:
  // its own room packet must not carry it, and no other packet may carry a
  // correctAnswer field before that task has been answered.
  // A hint names the task it helps with, which has no answer yet either.
  const call = async (
    path: string,
    init: RequestInit = {},
    helps?: string,
  ): Promise<Record<string, unknown>> => {
    const res = await app.request(path, {
      ...init,
      headers: { cookie, "content-type": "application/json" },
    });
    const body = (await res.json()) as Record<string, unknown>;
    if (res.status !== 200) refused.push(`${path}: ${res.status}`);
    packets.push({ body });
    if (body["kind"] === "room" || helps) {
      const itemId = helps ?? String(body["itemId"]);
      if (!answered.has(itemId)) {
        const shown = itemEvents(db, itemId).find(
          (x) => x.type === "item_shown",
        );
        const answer = (shown?.payload as { correctAnswer: string })
          .correctAnswer;
        const whole = new RegExp(`(^|[^0-9])${answer}([^0-9]|$)`);
        if (strings(body).some((s) => whole.test(s)))
          earlyAnswers.push(`${itemId}: ${answer}`);
        if (JSON.stringify(body).includes("correctAnswer"))
          earlyAnswers.push(`${itemId}: field`);
      }
    } else if (
      JSON.stringify(body).includes("correctAnswer") &&
      !path.endsWith("/answer")
    ) {
      earlyAnswers.push(`${path}: correctAnswer outside an answer reply`);
    }
    return body;
  };

  const input = {
    firstKeyMs: 400,
    submittedMs: 1200,
    edits: 0,
    erasures: 0,
    keyPresses: 1,
    focusLosses: { count: 0, totalMs: 0 },
    method: "keypad",
  };
  let ends = 0;
  for (let day = 0; day < 30; day++) {
    let seq = day * 1000;
    const start = async (): Promise<string> =>
      (
        (await call("/api/session/start", {
          method: "POST",
          body: JSON.stringify({ mode: "daily", clientSeq: ++seq }),
        })) as { sessionId: string }
      ).sessionId;
    let sessionId = await start();
    const post = (path: string, body: object, helps?: string) =>
      call(
        path,
        { method: "POST", body: JSON.stringify({ ...body, clientSeq: ++seq }) },
        helps,
      );
    const answer = async (itemId: string, t: number): Promise<void> => {
      await post(`/api/session/${sessionId}/answer`, {
        itemId,
        raw: t % 3 === 0 ? "" : String(t),
        dontKnow: t % 5 === 0,
        input,
      });
      answered.add(itemId);
    };
    for (let t = 0; t < 20; t++) {
      let room = (await call(`/api/session/${sessionId}/next`)) as {
        itemId: string;
        kind: string;
      };
      // After the finale a new session plans the next adventure.
      if (room.kind === "end") {
        ends++;
        sessionId = await start();
        room = (await call(`/api/session/${sessionId}/next`)) as typeof room;
      }
      // Two hints and two explanations a day stay inside the thread stock.
      if (t % 10 === 1)
        await post(`/api/item/${room.itemId}/hint`, { level: 1 }, room.itemId);
      await answer(room.itemId, t);
      if (t % 10 === 2) {
        await post(`/api/item/${room.itemId}/explain`, {});
        const twin = (await post(
          `/api/item/${room.itemId}/second-attempt`,
          {},
        )) as { itemId: string };
        await answer(twin.itemId, t);
        await call(`/api/session/${sessionId}/poll?after=0`);
      }
    }
    await post(`/api/session/${sessionId}/pause`, { reason: "leave" });
  }
  const leaks = packets.flatMap((p) => forbiddenFields(p.body));
  console.log(
    `recorder: ${packets.length} packets, ${leaks.length} forbidden fields, ${earlyAnswers.length} early answers`,
  );
  // A day: the start, 20 tasks shown and answered, 2 hints, 2 rounds of
  // explanation, second attempt, its answer and a poll, and the leave. Each
  // finale adds the end packet and a new start: 600 tasks in adventures of
  // 60 reach 9 finales.
  expect(ends).toBe(9);
  expect(packets.length).toBe(30 * (1 + 20 * 2 + 2 + 2 * 4 + 1) + 2 * ends);
  expect(refused).toEqual([]);
  expect(leaks).toEqual([]);
  expect(earlyAnswers).toEqual([]);
}, 120000);
