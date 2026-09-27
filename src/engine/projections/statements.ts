// Prepared statements cached per connection. The write path runs every
// projection for every event, and preparing afresh each time leaves thousands
// of native statement objects for the collector, whose pauses stall play.
import type Database from "better-sqlite3";

type Db = Database.Database;

const cache = new WeakMap<Db, Map<string, Database.Statement>>();

export function prepared(db: Db, sql: string): Database.Statement {
  let statements = cache.get(db);
  if (!statements) {
    statements = new Map();
    cache.set(db, statements);
  }
  let statement = statements.get(sql);
  if (!statement) {
    statement = db.prepare(sql);
    statements.set(sql, statement);
  }
  return statement;
}
