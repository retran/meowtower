---
id: TSK-0240
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0020
closes: [REQ-2210]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The write-once blob store logs each draft-pad image by its hash

After this task, a draft-pad image stored with an answer becomes the file `data/blobs/<sha256>.webp`, written once and synced, then a `blobs` row, then a `scratch_snapshot` event naming the hash, and the verify command re-hashes every file and reports one that changed.

## Acceptance criteria

1. Given a WebP image under 512 KB, when the store function takes it, then `data/blobs/<sha256>.webp` exists, the `blobs` row holds the same hash, and a `scratch_snapshot` event with that hash follows both in the log. Closed by: `tests/unit/blob-store.test.ts`.
2. Given a file already present for a hash, when the same image is stored again, then the file's bytes and modification time are unchanged. Closed by: the same test.
3. Given an image over 512 KB, when it is stored, then the function refuses it and no file, row or event appears. Closed by: the same test.
4. Given a `blobs` row, when a test runs `UPDATE blobs SET sha256 = ...` or deletes the row, then SQLite refuses it, and `meowtower` refuses to start when a `blobs` trigger is missing. Closed by: the guard test of TSK-0200, extended.
5. Given a file in `data/blobs/` whose bytes were changed, when the verify check runs, then it reports `blob_changed` naming the file; and for every `scratch_snapshot` event of a log, the file exists and hashes to its name. Closed by: `tests/unit/blob-check.test.ts`.
6. Given the process is killed between the file's sync and the event's commit, when it restarts, then no `scratch_snapshot` event names a missing file. Closed by: a crash case in the same test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the migration for `blobs` and its two triggers, and register them in TSK-0200's list of guarded triggers. Add the store function the answer route of ADR-0030 will call: hash with SHA-256, create the file with exclusive create, sync it, insert the row, then call `appendEvents` with `scratch_snapshot`, whose version-1 schema this task adds. Add the verify check that re-hashes `data/blobs/`. TSK-0070 makes the directory write-once for all server code; whichever task lands second uses the other's writer, and neither depends on the other.

## Depends on

TSK-0210, because `scratch_snapshot` enters the schema registry that task makes.

## Evidence

Not yet.

## Left alone

The draft pad on the client and its scaling to 1024 px, which ADR-0150 and ADR-0080 define, and the answer route, which ADR-0030 defines.
