// The database the game talks to (ADR-3310, REQ-8520). One asynchronous interface hides the
// driver, so the same callers run on SQLite now and on Postgres after the switch. The statement
// methods keep the shape better-sqlite3 gave them, and each returns a promise.
export interface RunResult {
  readonly changes: number;
  readonly lastInsertRowid: number | bigint;
}

export interface Statement {
  run(...params: unknown[]): Promise<RunResult>;
  get(...params: unknown[]): Promise<unknown>;
  all(...params: unknown[]): Promise<unknown[]>;
}

export interface Db {
  /** False once the database is closed. */
  readonly open: boolean;
  /** Where the database lives: the file of a SQLite database. */
  readonly name: string;
  prepare(sql: string): Statement;
  exec(sql: string): Promise<void>;
  pragma(source: string, options?: { simple?: boolean }): Promise<unknown>;
  /**
   * Wraps `fn` so that each call runs in one transaction that commits when `fn` resolves and rolls
   * back when it throws. A call made inside a transaction joins it. Statements from other callers
   * wait until a transaction ends, so a transaction never sees a stranger's write.
   */
  transaction<A extends unknown[], R>(
    fn: (...args: A) => Promise<R> | R,
  ): (...args: A) => Promise<R>;
  close(): Promise<void>;
}

export { SqliteDb } from "./sqlite.js";
