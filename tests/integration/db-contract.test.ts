// REQ-8520: both implementations of `Db` keep one contract, so the game runs on either. The same
// cases run on SQLite and on Postgres.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { afterAll, describe, expect, it } from "vitest";
import {
  dropSchema,
  openPostgres,
  SqliteDb,
  type Db,
} from "../../src/server/db/index.js";
import { bind } from "../../src/server/db/postgres.js";

const URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";
const root = mkdtempSync(join(tmpdir(), "meowtower-contract-"));
const cleanup: (() => Promise<void>)[] = [];
afterAll(async () => {
  for (const c of cleanup) await c();
  rmSync(root, { recursive: true, force: true });
});

let n = 0;
const backends: [string, () => Promise<Db>][] = [
  [
    "sqlite",
    async () => {
      const db = new SqliteDb(
        new Database(join(root, `c${String(++n)}.sqlite`)),
      );
      cleanup.push(() => db.close());
      return db;
    },
  ],
  [
    "postgres",
    async () => {
      const schema = `t_${String(process.pid)}_${String(++n)}`;
      const db = await openPostgres(URL, schema);
      cleanup.push(async () => {
        await db.close();
        await dropSchema(URL, schema);
      });
      return db;
    },
  ],
];

describe.each(backends)("the Db contract on %s", (_name, open) => {
  const fresh = async (): Promise<Db> => {
    const db = await open();
    await db.exec(
      "CREATE TABLE t (id INTEGER PRIMARY KEY, name TEXT NOT NULL)",
    );
    return db;
  };

  it("binds positional and named parameters and reads rows back", async () => {
    const db = await fresh();
    await db.prepare("INSERT INTO t (id, name) VALUES (?, ?)").run(1, "one");
    await db
      .prepare("INSERT INTO t (id, name) VALUES (@id, @name)")
      .run({ id: 2, name: "two" });
    expect(await db.prepare("SELECT name FROM t WHERE id = ?").get(2)).toEqual({
      name: "two",
    });
    expect(await db.prepare("SELECT id FROM t ORDER BY id").all()).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
    expect(
      await db.prepare("SELECT name FROM t WHERE id = ?").get(9),
    ).toBeUndefined();
  });

  it("reports how many rows a statement changed", async () => {
    const db = await fresh();
    await db
      .prepare("INSERT INTO t (id, name) VALUES (1, 'a'), (2, 'a')")
      .run();
    const done = await db
      .prepare("UPDATE t SET name = 'b' WHERE name = ?")
      .run("a");
    expect(done.changes).toBe(2);
  });

  it("commits a transaction that returns and rolls one back that throws", async () => {
    const db = await fresh();
    await db.transaction(async () => {
      await db.prepare("INSERT INTO t (id, name) VALUES (1, 'kept')").run();
    })();
    await expect(
      db.transaction(async () => {
        await db.prepare("INSERT INTO t (id, name) VALUES (2, 'lost')").run();
        throw new Error("boom");
      })(),
    ).rejects.toThrow("boom");
    expect(await db.prepare("SELECT id FROM t ORDER BY id").all()).toEqual([
      { id: 1 },
    ]);
  });

  it("rolls back only the inner transaction when it throws inside an outer one", async () => {
    const db = await fresh();
    await db.transaction(async () => {
      await db.prepare("INSERT INTO t (id, name) VALUES (1, 'outer')").run();
      await expect(
        db.transaction(async () => {
          await db
            .prepare("INSERT INTO t (id, name) VALUES (2, 'inner')")
            .run();
          throw new Error("inner");
        })(),
      ).rejects.toThrow("inner");
    })();
    expect(await db.prepare("SELECT id FROM t ORDER BY id").all()).toEqual([
      { id: 1 },
    ]);
  });

  it("keeps a stranger's write out of the transaction it lands in", async () => {
    const db = await fresh();
    let release!: () => void;
    const latch = new Promise<void>((resolve) => {
      release = resolve;
    });
    // The stranger starts outside the transaction, as another request does.
    const stranger = (async () => {
      await latch;
      await db.prepare("INSERT INTO t (id, name) VALUES (2, 'out')").run();
    })();
    await expect(
      db.transaction(async () => {
        await db.prepare("INSERT INTO t (id, name) VALUES (1, 'in')").run();
        release();
        await new Promise((r) => setTimeout(r, 20));
        throw new Error("undo");
      })(),
    ).rejects.toThrow("undo");
    await stranger;
    expect(await db.prepare("SELECT name FROM t ORDER BY id").all()).toEqual([
      { name: "out" },
    ]);
  });

  it("runs several statements in one exec", async () => {
    const db = await fresh();
    await db.exec(
      "INSERT INTO t VALUES (1, 'a'); INSERT INTO t VALUES (2, 'b');",
    );
    expect(
      ((await db.prepare("SELECT COUNT(*) AS n FROM t").get()) as { n: number })
        .n,
    ).toBe(2);
  });

  it("says it is closed once it is", async () => {
    const db = await open();
    expect(db.open).toBe(true);
    await db.close();
    expect(db.open).toBe(false);
  });
});

describe("bind", () => {
  it("numbers positional placeholders and leaves quoted text alone", () => {
    expect(bind("SELECT '?' , ? , ?", [1, 2])).toEqual({
      text: "SELECT '?' , $1 , $2",
      values: [1, 2],
    });
  });
  it("gives a repeated name one slot", () => {
    expect(bind("SELECT @a, @b, @a", [{ a: 1, b: 2 }])).toEqual({
      text: "SELECT $1, $2, $1",
      values: [1, 2],
    });
  });
  it("skips a line comment", () => {
    expect(bind("SELECT ? -- what?\n, ?", [1, 2]).text).toBe(
      "SELECT $1 -- what?\n, $2",
    );
  });
});
