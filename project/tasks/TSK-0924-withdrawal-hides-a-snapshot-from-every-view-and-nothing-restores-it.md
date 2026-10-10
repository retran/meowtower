---
id: TSK-0924
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0310
closes: [REQ-6078, REQ-6080]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A withdrawn snapshot disappears from every projection, report and export, and its file never leaves the Mac

After this task, the parent can withdraw a snapshot with a reason, the projections and the mapping panel hide it, the export of the whole log still holds its events, and no route sends the file or its values off the Mac.

## Acceptance criteria

1. Given a snapshot with a parse and a correction, when the parent withdraws it, then one `school_snapshot_withdrawn` event holds the hash and a reason of `not_about_player`, `wrong_document` or `other`, and the snapshot is absent from `school_values`, `school_snapshot_changes` and the mapping panel (REQ-6078). Closed by: a projection test and a panel test.
2. Given the export of the whole log after a withdrawal, when its rows are counted, then it holds the snapshot's import, parse, correction and withdrawal events and its count equals the log's, and a full recompute from it hides the snapshot again (REQ-6078). Closed by: an export test and a recompute test.
3. Given a withdrawn hash, when the same bytes are imported again, then nothing is written, and no event, route or command restores a withdrawn snapshot (REQ-6078). Closed by: a route test and a search of the route list.
4. Given a withdrawn snapshot, when its file's route is called on the loopback listener and through `https://<mac-name>.local`, then the first refuses it and the second answers `404`, and the snapshot's values reach no route, listing or export a parent on another device can call (REQ-6080). Closed by: a route test on both listeners that calls every route of the part.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `POST /api/parent/school/snapshots/:sha256/withdraw` with `{ reason, clientSeq }` on the loopback listener, and make every reader of snapshot values, the mapping panel and the file route read through the projections that drop a withdrawn snapshot. The kept file stays in `data/blobs/`, which ADR-0020's rule that nothing is erased requires. I chose that a withdrawn hash stays withdrawn when imported again, as ADR-0310 did, because a withdrawn file is most often a wrong pupil's, and a second import of the same bytes is more likely a mistake than a correction. A withdrawn document comes back only as a new file with other bytes. I also chose that the file's route refuses a withdrawn snapshot on the loopback listener too, because the Parent Room lists none and a file that nobody can open has no reason to be served.

## Depends on

- TSK-0922 (blocking): `school_values`, which the withdrawal removes the snapshot from.
- TSK-0923 (blocking): `school_snapshot_changes`, which it removes the snapshot from too.

## Evidence

Not yet.

## Left alone

The two screens and the export for the school, which hide a withdrawn snapshot because they read through these projections, and which TSK-0927, TSK-0928 and TSK-0929 each test. A snapshot copy in Time Machine, which holds withdrawn files and which nothing here defends.
