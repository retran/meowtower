---
id: TSK-0920
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0310
closes: [REQ-6006, REQ-6008, REQ-6010, REQ-6012, REQ-6074, REQ-6076]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent imports a snapshot on the Mac, checks the name and the date, and nothing is written until the parent confirms

After this task, the tab «Данные школы» takes a PDF, PNG, JPEG or WebP file on the Mac, shows it beside the name the parser read, and keeps the file and writes the import and first parse events only on «Это документ моего ребёнка».

## Acceptance criteria

1. Given a file of each of the four types, when it is uploaded, then the server tells the type from its first bytes and the preview shows it; given a GIF, a file renamed to `.pdf` that isn't one, a 26 MB file and a 21-page PDF, then each is refused with `snapshot_type_refused` or `snapshot_too_large` and nothing is written (REQ-6006). Closed by: a route test for each file.
2. Given a preview, when it is read, then it shows the document beside the pupil's name the parser read, or «Имя ученика в документе не найдено»; then, until the parent confirms, `data/blobs/` holds no new file, the `blobs` table no row and the log no event; a cancel deletes the temporary file at once, and the hourly sweep deletes an import file older than one hour (REQ-6074, REQ-6076). Closed by: a route test that lists the three stores after preview, cancel and an aged file.
3. Given a confirmation, when the server keeps the file, then the order is the file, the row, then `school_snapshot_imported` and the first `school_snapshot_parsed` in one call to `appendEvents`, and the import event carries the document's date, the date of upload, the source the parent named and the hash (REQ-6008). Closed by: a route test that reads the log and a crash test that stops after the file.
4. Given a document with no date, when the parent confirms, then the confirmation is refused until the parent enters a date, and the import event records `documentDateSource: parent` (REQ-6010). Closed by: a route test with a dateless fixture.
5. Given a file whose hash already has an import event, when it is uploaded, then the server writes no file, no row and no event, shows the earlier import's date and whether it was withdrawn, and a withdrawn hash stays withdrawn (REQ-6012). Closed by: a route test that imports, withdraws and imports again.
6. Given the same routes through `https://<mac-name>.local`, when each is called, then it answers `404` and a Parent Room opened on the iPad offers no import (ADR-0310). Closed by: a route test on the two listeners.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the routes of SPC-0310 for the import: `POST /api/parent/school/import`, the temporary file's route, the confirm route, the cancel route, and the tab. They mount only on the loopback listener `http://localhost:8080`. I chose this, as ADR-0310 did, because REQ-6074 already puts the preview on the Mac and a file that carries the pupil's name and school has no reason to travel further.

Write the upload to `data/tmp/school-import/<ULID>`, which belongs to no store, hash it before the preview, and parse it. The confirmation keeps the file through the store, inserts the row, and appends both events in one call. A confirmation that arrives after the sweep answers `snapshot_import_expired`. A file already under its hash in `data/blobs/` is kept when its hash matches its name; when it doesn't, the reply is `409` and the import stops.

## Depends on

- TSK-0916 (blocking): the two event schemas the confirmation appends.
- TSK-0918 (blocking): the store that keeps the file.
- TSK-0919 (blocking): the parser the preview shows.

The epic realising ADR-0180 supplies the Parent Room, its PIN session and its tabs.

## Evidence

Not yet.

## Left alone

Withdrawal, which TSK-0924 builds, and corrections, which TSK-0922 builds. The preview's time budget of 30 s at the 95th percentile for 4 pages, which the verify run reports against ADR-0190's baselines and which doesn't fail this task.
