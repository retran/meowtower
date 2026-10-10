---
id: TSK-0727
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-2926, REQ-2928, REQ-2930]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every export matches the log's row count, is fully described, and opens in DuckDB and pandas

After this task, group 2 builds each export from a 30-day simulated log, fails when a row count differs from the matching events or the field dictionary leaves a column out, and opens every JSONL, CSV and Parquet file in DuckDB and in pandas from the `tools` image.

## Acceptance criteria

1. Given an export built from a 30-day simulated log, when the test counts its rows, then each export's row count equals the number of matching events in the log; given one row dropped, then the test fails and names the export (REQ-2926). Closed by: an integration test with the dropped-row fixture.
2. Given the field dictionary, when the test lists every column of every export, then each column has an entry; given a column added with no entry, then the test fails and names it (REQ-2928). Closed by: an integration test.
3. Given every JSONL, CSV and Parquet file the export writes, when the test opens each in DuckDB and in pandas in the `tools` image, then none raises an error; given a truncated file, then the test fails and names the file (REQ-2930). Closed by: an integration test run in the `tools` container.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the export test to group 2, and add Python with pandas and pyarrow, and DuckDB, to the `tools` image beside Node, because the parent reads the exports in these two tools. The export's formats, the field dictionary and the Mac-only rule belong to ADR-0020, and this task only checks them. The simulated log comes from the generator TSK-0728 builds; until it exists the test uses the synthetic log helper that `tests/helpers/synthetic-log.ts` already holds.

The epic realising ADR-0020 supplies each export's formats. The Parquet export arrives at stage 0.2, so until then the Parquet files in the test are the ones the export has written, and the test names a format that isn't yet written as `not_required_yet`, as the runner does for a group.

## Depends on

- TSK-0724 (blocking): the test is a check of group 2 and the image is the runner's.

## Evidence

Not yet.

## Left alone

The exports themselves and the field dictionary's wording, and the PDF snapshot of the report, which comes after the MVP.
