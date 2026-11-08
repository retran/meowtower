// The SQLite implementation of `Db`, over one better-sqlite3 connection. The driver is
// synchronous, so a statement runs at once; the gate only keeps strangers out of an open
// transaction, which is the one thing an asynchronous caller can do that a synchronous one could not.
import { AsyncLocalStorage } from "node:async_hooks";
import Database from "better-sqlite3";
import type { Db, RunResult, Statement } from "./index.js";

export class SqliteDb implements Db {
  readonly native: Database.Database;
  private readonly inside = new AsyncLocalStorage<true>();
  private active: Promise<void> | null = null;
  private savepoints = 0;

  constructor(native: Database.Database) {
    this.native = native;
  }

  get open(): boolean {
    return this.native.open;
  }

  readonly dialect = "sqlite" as const;

  get name(): string {
    return this.native.name;
  }

  /** Waits while another caller's transaction is open, unless the caller is inside it. */
  private async enter(): Promise<void> {
    while (this.active && !this.inside.getStore()) await this.active;
  }

  prepare(sql: string): Statement {
    const statement = this.native.prepare(sql);
    return {
      run: async (...params): Promise<RunResult> => {
        await this.enter();
        return statement.run(...params);
      },
      get: async (...params): Promise<unknown> => {
        await this.enter();
        return statement.get(...params);
      },
      all: async (...params): Promise<unknown[]> => {
        await this.enter();
        return statement.all(...params);
      },
    };
  }

  async exec(sql: string): Promise<void> {
    await this.enter();
    this.native.exec(sql);
  }

  async pragma(
    source: string,
    options?: { simple?: boolean },
  ): Promise<unknown> {
    await this.enter();
    return this.native.pragma(source, options);
  }

  transaction<A extends unknown[], R>(
    fn: (...args: A) => Promise<R> | R,
  ): (...args: A) => Promise<R> {
    return async (...args: A): Promise<R> => {
      if (this.inside.getStore()) {
        const name = `sp${String(++this.savepoints)}`;
        this.native.exec(`SAVEPOINT ${name}`);
        try {
          const result = await fn(...args);
          this.native.exec(`RELEASE ${name}`);
          return result;
        } catch (err) {
          this.native.exec(`ROLLBACK TO ${name}`);
          this.native.exec(`RELEASE ${name}`);
          throw err;
        }
      }
      while (this.active) await this.active;
      let release!: () => void;
      this.active = new Promise<void>((resolve) => {
        release = resolve;
      });
      try {
        this.native.exec("BEGIN");
        try {
          const result = await this.inside.run(true, () => fn(...args));
          this.native.exec("COMMIT");
          return result;
        } catch (err) {
          this.native.exec("ROLLBACK");
          throw err;
        }
      } finally {
        this.active = null;
        release();
      }
    };
  }

  async close(): Promise<void> {
    while (this.active) await this.active;
    this.native.close();
  }
}
