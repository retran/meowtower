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
  const app = createApp({ db });
  const cookie = `meowtower_device=${registerDevice(db, "tablet")}`;
  const packets: { itemId?: string; body: unknown }[] = [];
  const answered = new Set<string>();
  const earlyAnswers: string[] = [];

  // A task's answer may reach the client only in a reply to an attempt on it:
  // its own room packet must not carry it, and no other packet may carry a
  // correctAnswer field before that task has been answered.
  const call = async (
    path: string,
    init: RequestInit = {},
  ): Promise<Record<string, unknown>> => {
    const res = await app.request(path, {
      ...init,
      headers: { cookie, "content-type": "application/json" },
    });
    const body = (await res.json()) as Record<string, unknown>;
    packets.push({ body });
    if (body["kind"] === "room") {
      const itemId = String(body["itemId"]);
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
  for (let day = 0; day < 30; day++) {
    const { sessionId } = (await call("/api/session/start", {
      method: "POST",
      body: JSON.stringify({ mode: "daily" }),
    })) as { sessionId: string };
    for (let t = 0; t < 20; t++) {
      const room = (await call(`/api/session/${sessionId}/next`)) as {
        itemId: string;
      };
      await call(`/api/session/${sessionId}/answer`, {
        method: "POST",
        body: JSON.stringify({
          itemId: room.itemId,
          raw: t % 3 === 0 ? "" : String(t),
          dontKnow: t % 5 === 0,
          input,
          clientSeq: day * 100 + t,
        }),
      });
      answered.add(room.itemId);
    }
  }
  const leaks = packets.flatMap((p) => forbiddenFields(p.body));
  console.log(
    `recorder: ${packets.length} packets, ${leaks.length} forbidden fields, ${earlyAnswers.length} early answers`,
  );
  expect(packets.length).toBe(30 * (1 + 20 * 2));
  expect(leaks).toEqual([]);
  expect(earlyAnswers).toEqual([]);
}, 120000);
