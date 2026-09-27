// REQ-2508: a write is durable before the server replies. Kill the process
// the moment the reply arrives, restart it, and look for the write: 100 times.
import { spawn, type ChildProcess } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { afterAll, describe, expect, it } from "vitest";
import { openDatabase } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";

const RUNS = Number(process.env["CRASH_RUNS"] ?? 100);
const dir = mkdtempSync(join(tmpdir(), "meowtower-crash-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));
const env = {
  ...process.env,
  MEOWTOWER_DB: join(dir, "meowtower.sqlite"),
  PORT: "3917",
  PARENT_PORT: "3918",
};

async function start(): Promise<ChildProcess> {
  // Spawn node itself, so SIGKILL hits the server and not a wrapper.
  const child = spawn(
    process.execPath,
    ["--import", "tsx", "src/server/main.ts"],
    {
      env,
      stdio: "ignore",
    },
  );
  for (let i = 0; i < 200; i++) {
    try {
      if ((await fetch("http://127.0.0.1:3917/health")).ok) return child;
    } catch {
      // not listening yet
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error("server did not start");
}

async function kill(child: ChildProcess): Promise<void> {
  const done = new Promise((r) => child.once("exit", r));
  child.kill("SIGKILL");
  await done;
}

describe("REQ-2508: no committed write is lost when the process dies", () => {
  it("finds no server already on the test port", async () => {
    await expect(fetch("http://127.0.0.1:3917/health")).rejects.toThrow();
  });

  it(
    `keeps the write ${RUNS} times out of ${RUNS}`,
    async () => {
      const seed = openDatabase(env.MEOWTOWER_DB);
      const cookie = `meowtower_device=${registerDevice(seed, "tablet")}`;
      seed.close();
      let lost = 0;
      for (let i = 0; i < RUNS; i++) {
        const id = `w${i}`;
        let child = await start();
        const res = await fetch("http://127.0.0.1:3917/api/stage0/write", {
          method: "POST",
          headers: { "content-type": "application/json", cookie },
          body: JSON.stringify({ id }),
        });
        expect(res.status).toBe(201);
        await kill(child);
        child = await start();
        const found = await fetch(
          `http://127.0.0.1:3917/api/stage0/write/${id}`,
          { headers: { cookie } },
        );
        if (found.status !== 200) lost++;
        await kill(child);
      }
      console.log(
        `crash test: ${RUNS - lost} of ${RUNS} writes kept, ${lost} lost`,
      );
      expect(lost).toBe(0);
    },
    RUNS * 8000,
  );
});

// TSK-0030 criterion 3: the same test against the answer request of ADR-0030.
describe("REQ-2508: no answer whose reply was sent is lost when the process dies", () => {
  it(
    `keeps the answer ${RUNS} times out of ${RUNS}`,
    async () => {
      const seed = openDatabase(env.MEOWTOWER_DB);
      const token = registerDevice(seed, "tablet");
      seed.close();
      const headers = {
        cookie: `meowtower_device=${token}`,
        "content-type": "application/json",
      };
      const input = {
        firstKeyMs: 500,
        submittedMs: 1500,
        edits: 0,
        erasures: 0,
        keyPresses: 1,
        focusLosses: { count: 0, totalMs: 0 },
        method: "keypad",
      };
      let lost = 0;
      for (let i = 0; i < RUNS; i++) {
        const child = await start();
        const { sessionId } = (await (
          await fetch("http://127.0.0.1:3917/api/session/start", {
            method: "POST",
            headers,
            body: JSON.stringify({ mode: "daily", clientSeq: i }),
          })
        ).json()) as { sessionId: string };
        const { itemId } = (await (
          await fetch(`http://127.0.0.1:3917/api/session/${sessionId}/next`, {
            headers,
          })
        ).json()) as { itemId: string };
        const res = await fetch(
          `http://127.0.0.1:3917/api/session/${sessionId}/answer`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              itemId,
              raw: String(i),
              dontKnow: false,
              input,
              clientSeq: i,
            }),
          },
        );
        expect(res.status).toBe(200);
        await kill(child);
        const log = new Database(env.MEOWTOWER_DB, { readonly: true });
        const found = log
          .prepare(
            "SELECT count(*) AS n FROM events WHERE type IN ('attempt_submitted', 'verdict') AND json_extract(payload, '$.itemId') = ?",
          )
          .get(itemId) as { n: number };
        log.close();
        if (found.n !== 2) lost++;
      }
      console.log(
        `crash test (answer): ${RUNS - lost} of ${RUNS} answers kept, ${lost} lost`,
      );
      expect(lost).toBe(0);
    },
    RUNS * 8000,
  );
});
