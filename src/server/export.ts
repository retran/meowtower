// The export (SPC-0020): a fresh VACUUM INTO copy, read alone, written as the
// raw log in JSONL and Parquet, the flat views in CSV and Parquet, and the
// field dictionary. Offered only on the Mac (REQ-2240).
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DuckDBInstance } from "@duckdb/node-api";
import Database from "better-sqlite3";
import { eventRows } from "../engine/events/read.js";
import { VIEW_COLUMNS } from "../engine/projections/flat-views.js";
import { fieldDictionary } from "../shared/events.js";

export const EXPORT_FILES = [
  "events.jsonl",
  "events.parquet",
  "attempts.csv",
  "attempts.parquet",
  "items.csv",
  "items.parquet",
  "fields.csv",
] as const;

const ENVELOPE: Record<string, string> = {
  seq: "the event's position in the log",
  id: "the event's unique identifier (ULID)",
  ts: "the server's time of the event, UTC",
  client_ms: "the device's clock when the event happened",
  device_id: "the device, or 'server'",
  session_id: "the session, if any",
  adventure_id: "the adventure, if any",
  type: "the event type",
  v: "the payload's schema version",
  payload: "the event's facts, by type and version",
  idem_key: "the request key that makes a repeat append nothing",
};

const csvCell = (v: unknown): string => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (header: string[], rows: unknown[][]): string =>
  [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n") + "\n";

export const exportDirName = (at: Date): string =>
  at
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z")
    .replace(/:/g, "-");

export interface ExportResult {
  dir: string;
  counts: { events: number; attempts: number; items: number };
}

/** Exports from a copy taken synchronously when called; play after that isn't seen. */
export async function exportAll(
  live: string,
  root: string,
  at: Date,
): Promise<ExportResult> {
  const dir = join(root, exportDirName(at));
  mkdirSync(dir, { recursive: true });
  const copyPath = join(dir, ".copy.sqlite");
  const source = new Database(live, { readonly: true });
  source.prepare("VACUUM INTO ?").run(copyPath);
  source.close();

  const copy = new Database(copyPath, { readonly: true });
  const events = eventRows(copy);
  // One event a line; an empty log is an empty file.
  writeFileSync(
    join(dir, "events.jsonl"),
    events
      .map(
        (e) =>
          JSON.stringify({ ...e, payload: JSON.parse(String(e["payload"])) }) +
          "\n",
      )
      .join(""),
  );
  const counts = { events: events.length, attempts: 0, items: 0 };
  for (const [file, view] of [
    ["attempts", "attempts_view"],
    ["items", "items_view"],
  ] as const) {
    const columns = Object.keys(VIEW_COLUMNS[view] ?? {});
    const rows = copy
      .prepare(`SELECT ${columns.join(", ")} FROM ${view}`)
      .raw()
      .all() as unknown[][];
    writeFileSync(join(dir, `${file}.csv`), csv(columns, rows));
    counts[file] = rows.length;
  }
  copy.close();

  const fields: unknown[][] = [
    ...Object.entries(ENVELOPE).map(([c, d]) => ["events", c, d]),
    ...fieldDictionary().map((f) => [
      "events",
      `payload.${f.field}`,
      `${f.type} v${f.v}: ${f.description}`,
    ]),
    ...Object.entries(VIEW_COLUMNS["attempts_view"] ?? {}).map(([c, d]) => [
      "attempts.csv",
      c,
      d,
    ]),
    ...Object.entries(VIEW_COLUMNS["items_view"] ?? {}).map(([c, d]) => [
      "items.csv",
      c,
      d,
    ]),
  ];
  writeFileSync(
    join(dir, "fields.csv"),
    csv(["file", "column", "description"], fields),
  );

  const duck = await DuckDBInstance.create(":memory:");
  const conn = await duck.connect();
  await conn.run(
    `COPY (SELECT * FROM read_json_auto('${join(dir, "events.jsonl")}')) TO '${join(dir, "events.parquet")}' (FORMAT parquet)`,
  );
  for (const file of ["attempts", "items"]) {
    await conn.run(
      `COPY (SELECT * FROM read_csv_auto('${join(dir, `${file}.csv`)}', header = true)) TO '${join(dir, `${file}.parquet`)}' (FORMAT parquet)`,
    );
  }
  conn.closeSync();
  duck.closeSync();
  rmSync(copyPath, { force: true });
  return { dir, counts };
}
