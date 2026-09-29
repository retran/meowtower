// TSK-0080: a snapshot when a session ends (REQ-2526), retention of the
// newest 30 and the first of each month (REQ-2530), and the parent's
// `backup_failed` and `storage_ceiling` notices.
import { mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { afterAll, describe, expect, it, vi } from "vitest";
import {
  backupAfterSession,
  KEEP_NEWEST,
  readNotices,
  snapshotFiles,
} from "../../src/server/backups.js";
import { createApp } from "../../src/server/app.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { createParentApp } from "../../src/server/parent.js";
import { snapshotName } from "../../src/server/snapshots.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-backups-"));
const opened: Db[] = [];
afterAll(() => {
  for (const db of opened) db.close();
  rmSync(root, { recursive: true, force: true });
});

let worlds = 0;
function world(start = Date.parse("2026-07-01T09:00:00Z")) {
  const base = join(root, `w${++worlds}`);
  mkdirSync(base, { recursive: true });
  const live = join(base, "live.sqlite");
  const dir = join(base, "snapshots");
  const db = openDatabase(live);
  opened.push(db);
  const clock = { ms: start };
  const now = () => clock.ms;
  let pending: Promise<void> = Promise.resolve();
  const app = createApp({
    db,
    now,
    onSessionEnded: () => {
      pending = backupAfterSession({ live, dir, dataRoot: base, now });
    },
  });
  const cookie = `meowtower_device=${registerDevice(db, "tablet")}`;
  let seq = 0;
  const post = (path: string, body: object) =>
    app.request(path, {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ ...body, clientSeq: ++seq }),
    });
  /** One session: start, one task shown, leave; resolves once its backup is done. */
  async function session(): Promise<void> {
    const { sessionId } = (await (
      await post("/api/session/start", { mode: "daily" })
    ).json()) as { sessionId: string };
    await app.request(`/api/session/${sessionId}/next`, {
      headers: { cookie },
    });
    const left = await post(`/api/session/${sessionId}/pause`, {
      reason: "leave",
    });
    expect(left.status).toBe(200);
    await pending;
  }
  return { base, live, dir, clock, session };
}

describe("REQ-2526: a snapshot when a session ends", () => {
  it("writes a new snapshot after the leave that ends the session", async () => {
    const w = world();
    expect(snapshotFiles(w.dir)).toEqual([]);
    await w.session();
    expect(snapshotFiles(w.dir)).toEqual([snapshotName(new Date(w.clock.ms))]);
    expect(readNotices(w.dir)).toEqual({
      backup_failed: null,
      storage_ceiling: null,
    });
  });
});

describe("REQ-2530: the newest 30 and the first of each month", () => {
  it("keeps them after 40 sessions over three months, each one readable", async () => {
    const w = world();
    const taken: string[] = [];
    const step = Math.round((91 * 24 * 60 * 60 * 1000) / 40);
    for (let i = 0; i < 40; i++) {
      await w.session();
      taken.push(snapshotName(new Date(w.clock.ms)));
      w.clock.ms += step;
    }
    const firstOfMonth = new Map<string, string>();
    for (const name of taken) {
      const month = name.slice("meowtower-".length, "meowtower-".length + 7);
      if (!firstOfMonth.has(month)) firstOfMonth.set(month, name);
    }
    const expected = [
      ...new Set([...taken.slice(-KEEP_NEWEST), ...firstOfMonth.values()]),
    ].sort();
    const kept = snapshotFiles(w.dir);
    expect(kept).toEqual(expected);
    const events = kept.map((f) => {
      const copy = new Database(join(w.dir, f), { readonly: true });
      const n = (
        copy.prepare("SELECT count(*) AS n FROM events").get() as { n: number }
      ).n;
      copy.close();
      return n;
    });
    expect(events.every((n) => n > 0)).toBe(true);
    // Each later snapshot holds more of the log than the one before.
    expect([...events].sort((a, b) => a - b)).toEqual(events);
    console.log(
      `retention: 40 sessions over ${firstOfMonth.size} months kept ${kept.length} snapshots: the newest ${KEEP_NEWEST} and the first of ${[...firstOfMonth.keys()].join(", ")}; events from ${events[0]} to ${events.at(-1)}`,
    );
  }, 120000);
});

describe("the parent's notices", () => {
  it("raises backup_failed once, shows it in the Parent Room, and clears it on the next good snapshot", async () => {
    const w = world();
    const errors = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    await w.session();
    // A live database that isn't there makes the snapshot fail, twice.
    const broken = {
      live: join(w.base, "missing.sqlite"),
      dir: w.dir,
      dataRoot: w.base,
      now: () => w.clock.ms,
    };
    w.clock.ms += 60_000;
    await backupAfterSession(broken);
    w.clock.ms += 60_000;
    await backupAfterSession(broken);
    expect(readNotices(w.dir).backup_failed?.reason).toBeTruthy();
    expect(
      errors.mock.calls.filter((c) => String(c[0]).startsWith("backup_failed")),
    ).toHaveLength(1);

    const page = async () =>
      (
        await createParentApp({
          db: opened.at(-1) as Db,
          snapshots: w.dir,
        }).request("/")
      ).text();
    const shown = await page();
    expect(shown.match(/role="alert"/g)).toHaveLength(1);
    expect(shown).toContain("Резервная копия не получилась");

    w.clock.ms += 60_000;
    await w.session();
    expect(readNotices(w.dir).backup_failed).toBeNull();
    expect(await page()).not.toContain('role="alert"');
    errors.mockRestore();
  });

  it("gives a second session ending in the same second its own snapshot", async () => {
    const w = world();
    await w.session();
    await w.session();
    expect(snapshotFiles(w.dir)).toEqual([
      snapshotName(new Date(w.clock.ms)),
      snapshotName(new Date(w.clock.ms + 1000)),
    ]);
    expect(readNotices(w.dir).backup_failed).toBeNull();
  });

  // TSK-0450: the ceiling counts data/ together with the live database and
  // its write-ahead log, which sit in the volume outside data/ (ADR-0370 entry 1).
  it("raises storage_ceiling on data/ and the database together, at 20 GB and each further 10 GB", async () => {
    const base = join(root, "size");
    const data = join(base, "data");
    mkdirSync(data, { recursive: true });
    const live = join(base, "volume", "live.sqlite");
    mkdirSync(join(base, "volume"), { recursive: true });
    opened.push(openDatabase(live));
    const dir = join(data, "snapshots");
    const errors = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    let clock = Date.parse("2026-08-01T00:00:00Z");
    const GiB = 1024 ** 3;
    const raised: (number | null)[] = [];
    // Each step: data/, the database file and its write-ahead log, in GB.
    for (const [d, db, wal] of [
      [14, 5.9, 0],
      [15, 5, 1],
      [20, 8, 1],
      [22, 8, 1],
      [30, 10, 1],
    ] as const) {
      clock += 60_000;
      await backupAfterSession({
        live,
        dir,
        dataRoot: data,
        now: () => clock,
        sizeOf: (path) =>
          path === data
            ? d * GiB
            : path === live
              ? db * GiB
              : path === `${live}-wal`
                ? wal * GiB
                : 0,
      });
      raised.push(readNotices(dir).storage_ceiling?.gb ?? null);
      // TSK-0450 criterion 2: the page names the threshold reached at 30.
      if (raised.at(-1) === 30 && raised.at(-2) !== 30) {
        const at30 = await (
          await createParentApp({
            db: opened.at(-1) as Db,
            snapshots: dir,
          }).request("/")
        ).text();
        expect(at30).toContain(
          "Папка data/ и база данных заняли больше 30 ГБ.",
        );
      }
    }
    // 19.9 stays under; 21 raises 20; 29 doesn't rise again; 31 raises 30; 41 raises 40.
    expect(raised).toEqual([null, 20, 20, 30, 40]);
    const logged = errors.mock.calls
      .map((c) => String(c[0]))
      .filter((line) => line.startsWith("storage_ceiling"));
    expect(logged).toHaveLength(3);
    expect(logged[0]).toBe(
      "storage_ceiling: data/ and the database hold 21.0 GB",
    );
    const page = await (
      await createParentApp({
        db: opened.at(-1) as Db,
        snapshots: dir,
      }).request("/")
    ).text();
    expect(page).toContain("Папка data/ и база данных заняли больше 40 ГБ.");
    errors.mockRestore();
    // Each session still took its snapshot.
    expect(readdirSync(dir).filter((f) => f.endsWith(".sqlite"))).toHaveLength(
      5,
    );
  });

  it("raises one notice for a jump across two thresholds", async () => {
    const base = join(root, "jump");
    mkdirSync(base, { recursive: true });
    const live = join(base, "live.sqlite");
    opened.push(openDatabase(live));
    const dir = join(base, "snapshots");
    const errors = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    let clock = Date.parse("2026-08-01T00:00:00Z");
    const raised: (number | null)[] = [];
    for (const gb of [28, 41]) {
      clock += 60_000;
      await backupAfterSession({
        live,
        dir,
        dataRoot: join(base, "data"),
        now: () => clock,
        sizeOf: (path) => (path === live ? gb * 1024 ** 3 : 0),
      });
      raised.push(readNotices(dir).storage_ceiling?.gb ?? null);
    }
    expect(raised).toEqual([20, 40]);
    expect(
      errors.mock.calls.filter((c) =>
        String(c[0]).startsWith("storage_ceiling"),
      ),
    ).toHaveLength(2);
    errors.mockRestore();
  });

  it("counts a database inside data/ once", async () => {
    const base = join(root, "inside");
    mkdirSync(base, { recursive: true });
    const live = join(base, "live.sqlite");
    opened.push(openDatabase(live));
    const dir = join(base, "snapshots");
    await backupAfterSession({
      live,
      dir,
      dataRoot: base,
      now: () => Date.parse("2026-08-01T00:00:00Z"),
      // data/ at 12 GB already holds the database; counted twice it would pass 20.
      sizeOf: (path) => (path === base ? 12 * 1024 ** 3 : 11 * 1024 ** 3),
    });
    expect(readNotices(dir).storage_ceiling).toBeNull();
  });
});
