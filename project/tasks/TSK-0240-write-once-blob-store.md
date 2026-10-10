---
id: TSK-0240
artifact: task
status: done
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

Collected on 2026-09-27 on the Mac. Every criterion holds.

- Verbs: `meow-verbs run format lint check test build` exited 0; 21 test files, 253 Vitest tests and 2 Playwright tests passed.
- Seen failing first: `tests/unit/blob-store.test.ts` and `tests/unit/blob-check.test.ts` couldn't load before `src/engine/blobs/` existed. With the simulated crash moved after the event, the crash case failed (an event named a file whose write had "died"), and passed again once restored.
- Criterion 1, REQ-2210: storing a WebP writes `<sha256>.webp` with the image's bytes, then the `blobs` row, then `scratch_snapshot` with `{ itemId, attemptNo, sha256 }`.
- Criterion 2: storing the same image again leaves the file's bytes and modification time unchanged; the file is opened with exclusive create, and an existing file is never rewritten.
- Criterion 3: an image over 512 KB is refused with `BlobRefused` (`blob_too_large`) and no file, row or event appears; bytes that aren't WebP are refused as `blob_not_webp`.
- Criterion 4: `UPDATE` and `DELETE` on `blobs` fail with `events are append-only`; `blobs_no_update` and `blobs_no_delete` joined `GUARDED_TRIGGERS`, so TSK-0200's guard test now also shows `meowtower` refusing to start without either, and the migration runner refuses a migration that drops them. The update trigger guards the whole row, stricter than the hash column alone, because a row never needs any change.
- Criterion 5: `verifyBlobs` passes a clean store, reports `blob_changed` for a file whose bytes were changed, and reports `blob_missing` for a `scratch_snapshot` event with no file (`tests/unit/blob-check.test.ts`). It is a function the verify command of ADR-0190 calls once that command exists.
- Criterion 6: with the process "killed" right after the file's sync (a hook that throws), no `scratch_snapshot` is logged, and every logged event's file exists.
- The writer lives in `src/engine/blobs/store.ts`; TSK-0070 reuses it for the write-once rule on `data/blobs/`.

## Left alone

The draft pad on the client and its scaling to 1024 px, which ADR-0150 and ADR-0080 define, and the answer route, which ADR-0030 defines.
