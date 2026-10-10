---
id: TSK-1013
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-2210, REQ-2224]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The disk ceiling counts the live database, every projection has a class, and a lost blob row comes back

After this task, `storage_ceiling` counts `data/` and the database with its write-ahead log, each projection declares `game` or `knowledge` and an import check holds it to that, no projection reads `llm_log`, and a blob file with no row is recovered or refused.

## Acceptance criteria

1. Given 15 GB in `data/` and 6 GB in `meowtower.sqlite` and `meowtower.sqlite-wal`, when the ceiling is checked, then `storage_ceiling` fires, and with 15 GB and 3 GB it doesn't. Closed by: a unit test over temporary directories.
2. Given the projection registry, when each entry is read, then it declares a class, `grouping_stream`, the composing stream, the `plan` stream, `check_week` and `estimate_stream` are `knowledge`, `phrase_counts`, `cito_rules` and both word-problem counters are `game`, and the import check fails a `game` projection that imports the model, threshold or graph modules (REQ-2224). Closed by: the registry test and the import check's fixture.
3. Given a blob file whose hash matches its name and no `blobs` row, when a write meets it, then the row is inserted and the write goes on; given a file whose hash doesn't match, then the write is refused with `blob_changed`; and at start-up the same holds for every file in `data/blobs/` with no row (REQ-2210). Closed by: a start-up test that deletes a `blobs` row and finds it back, and a refusal test.
4. Given projection code that names `llm_log`, when the import check runs, then it fails; given a copied `llm_call` event whose `llm_log` row a snapshot leaves empty, then no projection changes. Closed by: the check's fixture and a replay test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Check what `src/server/backups.ts`, `src/engine/projections/registry.ts` and `src/engine/blobs/` hold first, because `tests/unit/projection-class.test.ts` and `tests/integration/blob-recovery.test.ts` exist; add only what the four cases above still lack. The volume sits on the same Mac disk and grows with every event, so a ceiling that leaves it out lets the disk fill unannounced. The file's name is its hash, so the hash proves the content and a crash between the sync and the insert loses nothing. The `grouping_stream` and its kin are `knowledge` because they hold scores the parent's figures read, and the `game` ones read no model, threshold or graph version.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The blob store's format and the snapshot's content, which ADR-0020 and ADR-0010 own.
