---
id: TSK-0918
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0310
closes: [REQ-6004, REQ-6088]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The blob store keeps each snapshot file once under its hash and byte for byte

After this task, `data/blobs/` holds school snapshot files in PDF, PNG, JPEG and WebP as `<sha256>.<ext>`, each written once and read-only, the `blobs` table records the media type, and the verify check re-hashes files of every extension.

## Acceptance criteria

1. Given a fixture file of each of the four types, when the store keeps it, then there is one file `data/blobs/<sha256>.<ext>` with `<ext>` `pdf`, `png`, `jpg` or `webp`, its hash equals its name, and one `blobs` row holds the hash, the size and the media type (REQ-6004). Closed by: a store test for each type.
2. Given the same bytes kept twice, when the store runs, then it holds one file and one row (REQ-6004). Closed by: a store test.
3. Given a kept file and a byte changed on disk, when `verify` runs, then `blob_changed` fails and names the file, for a PDF as for a WebP; given a lint fixture that writes under `data/blobs/` outside the store, then `blob_write` fails (REQ-6088). Closed by: the verify check's test and the lint rule's fixture.
4. Given the existing draft-pad rows, when the migration runs, then each gets `media_type` of `image/webp`, `storeScratch` behaves as before, and its 512 KB ceiling for draft-pad images stays (ADR-0310). Closed by: a migration test and the existing `storeScratch` tests.
5. Given a kept file, when any route or command is listed, then none deletes or replaces it, and the exclusive create, the read-only mode and the `blobs` triggers refuse a second write under the same name (REQ-6088). Closed by: a test that attempts each write.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the migration for `blobs.media_type`, extend the store to take a snapshot file at most 25 MB beside draft-pad images at most 512 KB, and change `verifyBlobs` to re-hash every file in `data/blobs/` and to check each `school_snapshot_imported` event's file as it checks `scratch_snapshot`. Today it reads only `.webp` files, so a PDF would go unchecked.

The order of a keep is the scratch-pad order of ADR-0020: create the file with exclusive create, set it read-only and sync it and its directory, then insert the row. A file that already sits under its hash is kept when its hash matches its name; when it doesn't, the keep stops and the verify check names the file.

## Depends on

Nothing. The epic realising ADR-0020 is done and supplies the store, its triggers and the lint rule this task extends.

## Evidence

Not yet.

## Left alone

The import route that calls the store, which TSK-0920 builds. Erasing a snapshot, which ADR-0020 forbids: the family can withdraw and can't erase.
