import Database from "better-sqlite3";

export type Db = Database.Database;

/** Opens the live database file; the durability settings come with TSK-0030. */
export function openDatabase(path: string): Db {
  return new Database(path);
}

export function isOpen(db: Db): boolean {
  return db.open;
}
