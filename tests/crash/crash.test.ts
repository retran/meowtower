// REQ-2508: a write is durable before the server replies. Kill the process
// the moment the reply arrives, restart it, and look for the write: 100 times.
import { spawn, type ChildProcess } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const RUNS = Number(process.env["CRASH_RUNS"] ?? 100);
const dir = mkdtempSync(join(tmpdir(), "meowtower-crash-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));
const env = {
  ...process.env,
  MEOWTOWER_DB: join(dir, "meowtower.sqlite"),
  PORT: "3917",
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
      let lost = 0;
      for (let i = 0; i < RUNS; i++) {
        const id = `w${i}`;
        let child = await start();
        const res = await fetch("http://127.0.0.1:3917/api/stage0/write", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id }),
        });
        expect(res.status).toBe(201);
        await kill(child);
        child = await start();
        const found = await fetch(
          `http://127.0.0.1:3917/api/stage0/write/${id}`,
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
