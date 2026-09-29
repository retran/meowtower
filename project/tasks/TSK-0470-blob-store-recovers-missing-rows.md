---
id: TSK-0470
artifact: task
status: approved
revised: 2026-09-29
epic: EPC-0020
closes: []
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The blob store recovers a file that has no row

After this task, when a file for a hash exists in `data/blobs/` with no `blobs` row, `meowtower` hashes the file. When the hash matches the file's name it inserts the missing row and goes on; when it doesn't it refuses the write with `blob_changed`. It does this at a write and, for every file with no row, at start-up. ADR-0370 entry 3 amended ADR-0020 this way after TSK-0240 was done, because a crash between syncing the file and inserting its row otherwise leaves a file the store refuses for good, while the file's name, its hash, already proves its content. It closes no requirement of its own: REQ-2210 stays closed by TSK-0240, and this task realises the amendment's recovery.

## Acceptance criteria

1. Given a draft-pad image whose file exists with no `blobs` row and hashes to its name, when `storeScratch` is called with the same image, then the row is inserted with the hash and size the table holds today, `scratch_snapshot` is appended, and the file is left as it was. Closed by: `tests/integration/blob-recovery.test.ts`.
2. Given such a file whose content no longer hashes to its name, when `storeScratch` is called with the image of that name, then the write is refused with `blob_changed`, and no `blobs` row or `scratch_snapshot` event is written; this case shows the store hashing the file on disk rather than trusting the image it was given. Closed by: the same test file.
3. Given two WebP files with no rows at start-up, one that hashes to its name and one that doesn't, and a `.pdf` file with no row, when the server starts, then before the first request is accepted the first gets its row, the second gets none and `blob_changed` naming it is written to the server's log once, the `.pdf` is left as it is, and the server starts. The server starts because one damaged file mustn't keep the game offline, and the verify command's `blob_changed` check goes on reporting the file. Closed by: the same test file, on a fixture folder.

## What to do

In `src/engine/blobs/store.ts`, replace the insert that ignores an existing file with the recovery above, and add the start-up pass over `data/blobs/` that `src/server/main.ts` runs before it accepts requests, as SPC-0020 states them.

## Depends on

TSK-0240, because it built the store.

## Evidence

Not yet.

## Left alone

The school snapshot files and their media types, which ADR-0310's epic adds to the store; until then the start-up pass leaves a file of another extension as it is, and that epic extends the pass to it.
