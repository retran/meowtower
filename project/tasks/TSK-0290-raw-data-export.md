---
id: TSK-0290
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0020
closes: [REQ-2234, REQ-2236, REQ-2238, REQ-2240]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `./meowtower export` and the loopback-only export routes

After this task, `./meowtower export` writes the raw log as JSONL and Parquet, the flat tables of attempts and of tasks shown as CSV and Parquet, and the field dictionary, all from a fresh `VACUUM INTO` copy, and the Parent Room serves the same files only on `http://localhost:8080`.

## Acceptance criteria

1. Given a database holding a 30-day log, when the parent runs `./meowtower export` on the Mac, then `data/exports/<UTC timestamp>/` holds `events.jsonl`, `events.parquet`, `attempts.csv`, `attempts.parquet`, `items.csv`, `items.parquet` and `fields.csv`, and the command prints the directory. Closed by: the command's output and `tests/integration/export.test.ts`.
2. Given that export, when DuckDB reads each Parquet file, then it opens, and the row counts of `events.jsonl` and `events.parquet` equal the count of `events` in the copy, and those of `attempts` and `items` equal the rows of `attempts_view` and `items_view`. Closed by: the same test.
3. Given play writes events during the export, when the export ends, then its files match the copy taken at its start, and the live database was never read by the export. Closed by: the same test.
4. Given `fields.csv`, when the test reads it, then every column of every export file has a row with its description. Closed by: the same test.
5. Given the stack runs, when a request to `/api/parent/export/events.jsonl` goes through `https://<mac-name>.local`, then it gets 404, and the same path on `http://localhost:8080` returns the file. Closed by: both requests' output on the Mac.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the export module, which takes `VACUUM INTO` a temporary copy, reads only that copy, and writes the seven files through DuckDB by `@duckdb/node-api` for the Parquet files. Generate `fields.csv` from the zod schemas' descriptions and the flat views' columns. Add the `export` subcommand to `./meowtower`, running inside `meowtower`, and mount `GET /api/parent/export/<file>` only on the loopback app in `src/server/parent.ts`. ADR-0190's export test checks the same files further against each matching event type, and opens them in pandas.

## Depends on

TSK-0250, because `attempts` and `items` are the flat projections it adds. TSK-0060, because the export routes mount on the loopback listener that task made.

## Evidence

Not yet.

## Left alone

The Parent Room page that links the export, which ADR-0180 defines, and the pandas and Parquet checks of ADR-0190's export test.
