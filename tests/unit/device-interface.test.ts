// TSK-0100, REQ-2538: the settings switch stores the interface in the
// device's `devices` row, and it holds until switched again. The client
// reads its strings from the server: only the `ui.` keys, since the same file
// holds the tasks' texts and short solutions.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";
import { hashToken, registerDevice } from "../../src/server/devices.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-interface-"));
const db = openDatabase(join(dir, "live.sqlite"));
const app = createApp({ db });
afterAll(() => {
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

const token = registerDevice(db, "tablet");
const headers = {
  cookie: `meowtower_device=${token}`,
  "content-type": "application/json",
};
const row = (): string =>
  (
    db
      .prepare("SELECT kind FROM devices WHERE token_hash = ?")
      .get(hashToken(token)) as { kind: string }
  ).kind;

describe("REQ-2538: the interface switch is kept in the device's row", () => {
  it("reads the interface the device paired with", async () => {
    const res = await app.request("/api/device", { headers });
    expect(await res.json()).toEqual({ kind: "tablet" });
  });

  it("stores a switch in the row and serves it back", async () => {
    const res = await app.request("/api/device", {
      method: "PUT",
      headers,
      body: JSON.stringify({ kind: "computer" }),
    });
    expect(res.status).toBe(200);
    expect(row()).toBe("computer");
    const again = await app.request("/api/device", { headers });
    expect(await again.json()).toEqual({ kind: "computer" });
  });

  it("refuses an unknown interface and an unpaired device", async () => {
    const bad = await app.request("/api/device", {
      method: "PUT",
      headers,
      body: JSON.stringify({ kind: "phone" }),
    });
    expect(bad.status).toBe(400);
    expect(row()).toBe("computer");
    const unpaired = await app.request("/api/device", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "tablet" }),
    });
    expect(unpaired.status).toBe(401);
  });
});

describe("the client's strings", () => {
  it("serves the ui keys and no task text or solution", async () => {
    const strings = (await (
      await app.request("/i18n/ru.json")
    ).json()) as Record<string, string>;
    const keys = Object.keys(strings);
    expect(keys.length).toBeGreaterThan(0);
    expect(keys.every((k) => k.startsWith("ui."))).toBe(true);
    expect((await app.request("/i18n/xx.json")).status).toBe(404);
  });

  it("serves the compiled client modules and nothing else under /client", async () => {
    expect((await app.request("/client/../server/main.js")).status).toBe(404);
    expect((await app.request("/client/secret.txt")).status).toBe(404);
  });
});
