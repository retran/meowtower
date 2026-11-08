// The Postgres implementation of `Db` (ADR-3310, REQ-8520). One database object serves one
// schema: its pool opens every connection with that schema first on the search path, so the SQL a
// caller writes names no schema and a request sees only its own profile's tables.
import { AsyncLocalStorage } from "node:async_hooks";
import pg from "pg";
import type { Db, RunResult, Statement } from "./index.js";

// A bigint column holds counts and sequence numbers far below 2^53, so it reads as a number, the
// way SQLite gave it.
pg.types.setTypeParser(20, (value) => Number(value));
// A sum or an average comes back as numeric, which the driver keeps as text; the figures here are
// money, counts and estimates, all well inside a double.
pg.types.setTypeParser(1700, (value) => Number(value));

const SCHEMA_NAME = /^[a-z_][a-z0-9_]*$/;

interface Bound {
  readonly text: string;
  readonly values: unknown[];
}

/**
 * Rewrites the placeholders of SQLite's style into Postgres's: each `?` becomes `$n` in order, and
 * each `@name` becomes the `$n` of that name's value in the object passed. Text inside quotes and
 * comments stays as it is.
 */
export function bind(sql: string, params: unknown[]): Bound {
  const named =
    params.length === 1 &&
    typeof params[0] === "object" &&
    params[0] !== null &&
    !Array.isArray(params[0]) &&
    !Buffer.isBuffer(params[0]) &&
    !(params[0] instanceof Uint8Array)
      ? (params[0] as Record<string, unknown>)
      : null;
  const values: unknown[] = [];
  const slots = new Map<string, number>();
  let text = "";
  let i = 0;
  while (i < sql.length) {
    const c = sql[i] as string;
    if (c === "'" || c === '"') {
      let j = i + 1;
      while (j < sql.length) {
        if (sql[j] === c) {
          if (sql[j + 1] === c) j += 2;
          else break;
        } else j += 1;
      }
      text += sql.slice(i, j + 1);
      i = j + 1;
    } else if (c === "-" && sql[i + 1] === "-") {
      const end = sql.indexOf("\n", i);
      const stop = end === -1 ? sql.length : end;
      text += sql.slice(i, stop);
      i = stop;
    } else if (c === "?" && named === null) {
      values.push(params[values.length]);
      text += `$${String(values.length)}`;
      i += 1;
    } else if (
      c === "@" &&
      named !== null &&
      /[A-Za-z_]/.test(sql[i + 1] ?? "")
    ) {
      let j = i + 1;
      while (/[A-Za-z0-9_]/.test(sql[j] ?? "")) j += 1;
      const name = sql.slice(i + 1, j);
      let slot = slots.get(name);
      if (slot === undefined) {
        values.push(named[name]);
        slot = values.length;
        slots.set(name, slot);
      }
      text += `$${String(slot)}`;
      i = j;
    } else {
      text += c;
      i += 1;
    }
  }
  return {
    text,
    values: values.map((v) =>
      v === undefined ? null : v instanceof Uint8Array ? Buffer.from(v) : v,
    ),
  };
}

/**
 * Turns the SQLite spelling of a table definition into Postgres's: the projections declare their
 * tables once, with `STRICT` and SQLite's type names. Other statements pass unchanged.
 */
export function ddl(sql: string): string {
  if (!/^\s*CREATE\s+TABLE\b/i.test(sql)) return sql;
  return sql
    .replace(/\)\s*STRICT\s*$/i, ")")
    .replace(/\bINTEGER\b/gi, "BIGINT")
    .replace(/\bREAL\b/gi, "DOUBLE PRECISION");
}

interface Inside {
  readonly client: pg.PoolClient;
  savepoints: number;
}

export class PgDb implements Db {
  readonly name: string;
  readonly dialect = "postgres" as const;
  private readonly pool: pg.Pool;
  private readonly inside = new AsyncLocalStorage<Inside>();
  private closed = false;

  constructor(pool: pg.Pool, schema: string) {
    this.pool = pool;
    this.name = schema;
  }

  get open(): boolean {
    return !this.closed;
  }

  private async query(sql: string, params: unknown[]): Promise<pg.QueryResult> {
    const { text, values } = bind(sql, params);
    const store = this.inside.getStore();
    return store
      ? store.client.query(text, values)
      : this.pool.query(text, values);
  }

  prepare(sql: string): Statement {
    return {
      run: async (...params): Promise<RunResult> => {
        const res = await this.query(sql, params);
        return { changes: res.rowCount ?? 0, lastInsertRowid: 0 };
      },
      get: async (...params): Promise<unknown> =>
        (await this.query(sql, params)).rows[0],
      all: async (...params): Promise<unknown[]> =>
        (await this.query(sql, params)).rows,
    };
  }

  async exec(sql: string): Promise<void> {
    const store = this.inside.getStore();
    await (store ? store.client : this.pool).query(ddl(sql));
  }

  /** Postgres has no pragmas; the call exists so shared start-up code runs on both. */
  async pragma(): Promise<unknown> {
    return undefined;
  }

  async tableExists(name: string): Promise<boolean> {
    const res = await this.query(
      "SELECT 1 FROM information_schema.tables WHERE table_schema = current_schema() AND table_name = ?",
      [name],
    );
    return res.rows.length > 0;
  }

  async tableNames(): Promise<string[]> {
    const res = await this.query(
      "SELECT table_name AS name FROM information_schema.tables WHERE table_schema = current_schema() AND table_type = 'BASE TABLE' ORDER BY table_name",
      [],
    );
    return (res.rows as { name: string }[]).map((r) => r.name);
  }

  async columnsOf(table: string): Promise<string[]> {
    const res = await this.query(
      "SELECT column_name AS name FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = ? ORDER BY ordinal_position",
      [table],
    );
    return (res.rows as { name: string }[]).map((c) => c.name);
  }

  jsonField(column: string, field: string): string {
    return `(${column}::jsonb ->> '${field}')`;
  }

  transaction<A extends unknown[], R>(
    fn: (...args: A) => Promise<R> | R,
  ): (...args: A) => Promise<R> {
    return async (...args: A): Promise<R> => {
      const store = this.inside.getStore();
      if (store) {
        const name = `sp${String(++store.savepoints)}`;
        await store.client.query(`SAVEPOINT ${name}`);
        try {
          const result = await fn(...args);
          await store.client.query(`RELEASE ${name}`);
          return result;
        } catch (err) {
          await store.client.query(`ROLLBACK TO ${name}`);
          await store.client.query(`RELEASE ${name}`);
          throw err;
        }
      }
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        try {
          const result = await this.inside.run(
            { client, savepoints: 0 },
            async () => fn(...args),
          );
          await client.query("COMMIT");
          return result;
        } catch (err) {
          await client.query("ROLLBACK");
          throw err;
        }
      } finally {
        client.release();
      }
    };
  }

  async close(): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    await this.pool.end();
  }
}

/** Opens the schema `schema` of the database at `url`, creating the schema when it is missing. */
export async function openPostgres(url: string, schema: string): Promise<PgDb> {
  if (!SCHEMA_NAME.test(schema))
    throw new Error(`schema_name_invalid: ${schema}`);
  const bootstrap = new pg.Pool({ connectionString: url, max: 1 });
  try {
    await bootstrap.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
  } finally {
    await bootstrap.end();
  }
  const pool = new pg.Pool({
    connectionString: url,
    max: 8,
    options: `-c search_path=${schema},public`,
  });
  return new PgDb(pool, schema);
}

/** Drops a schema and everything in it; for tests and for removing a profile. */
export async function dropSchema(url: string, schema: string): Promise<void> {
  if (!SCHEMA_NAME.test(schema))
    throw new Error(`schema_name_invalid: ${schema}`);
  const pool = new pg.Pool({ connectionString: url, max: 1 });
  try {
    await pool.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
  } finally {
    await pool.end();
  }
}
