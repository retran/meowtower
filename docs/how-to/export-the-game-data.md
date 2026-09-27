# Export the game data

For the parent on the Mac, comfortable with a terminal. `./meowtower export` writes a copy of everything the game has logged, and the tables built from it, into files you can open in a spreadsheet or query with DuckDB.

## Before you start

- The server runs: `./meowtower status` shows `meowtower: running`.
- You work in the project folder on the Mac, because the Parent Room's listener answers only requests from the Mac.
- To query the Parquet files, DuckDB is installed: `duckdb --version` prints a version.

## Steps

1. Run the export:

   ```sh
   ./meowtower export
   ```

2. Open the folder the command prints, such as `data/exports/2026-09-27T23-20-41Z/`. Each export gets its own folder, named by the time in Coordinated Universal Time (UTC) it was taken, so an earlier export is never overwritten.

3. To query the data, go into that folder, replacing `<folder>` below with the name the command printed, and open a Parquet file with DuckDB, for example to count the verdicts of every attempt:

   ```sh
   cd data/exports/<folder>/
   duckdb -c "SELECT verdict, count(*) FROM 'attempts.parquet' GROUP BY verdict ORDER BY verdict"
   ```

## Result

The command prints the folder it wrote:

```text
Export written to data/exports/2026-09-27T23-20-41Z/
```

The folder holds seven files:

| File | What it holds |
| --- | --- |
| `events.jsonl` | The whole event log, one event a line. |
| `events.parquet` | The same log, for DuckDB. |
| `attempts.csv` and `attempts.parquet` | One row per attempt: the answer, its verdict and outcome, hints and timings. |
| `items.csv` and `items.parquet` | One row per task shown: its template, node, purpose and correct answer. |
| `fields.csv` | What every column of the other files means. |

The export reads a fresh copy of the database, so the player can go on playing, and the export holds only what she did before the command started.

## If it fails

| Message | Cause | Fix |
| --- | --- | --- |
| `export_failed: the server wrote no export; is it up?` | The server isn't running. | Run `./meowtower up`, then the export again. |
| `export_failed: the server wrote no export; is it up?` while `./meowtower status` shows the server running | `MEOWTOWER_PARENT_PORT` is set in your shell to another port than the one in `.env`. | Clear it with `set -e MEOWTOWER_PARENT_PORT` in fish, then run the export again. |
