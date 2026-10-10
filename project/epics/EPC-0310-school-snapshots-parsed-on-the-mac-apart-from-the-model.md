---
id: EPC-0310
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0310
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# After the MVP, the parent imports school snapshots on the Mac only, each kept once, parsed locally into events that the model and every model call can't read, and shown beside home states without converting one into the other

Realises exactly ADR-0310: the six event types and the goal key, the blob store's school files, the local parser and its version, the import with its confirmation, the reparse worker, corrections and disagreements, the view of changes, withdrawal, the static checks that fence school data off, the catalogue and the mapping panel, the «home and school» screen, the timeline, the export for the school and the generated fixtures.

The epic belongs to the stage after the MVP, because ADR-0210's scope guard keeps `src/engine/school/`, the six schemas and the import route out of the tree until the MVP ends. No task runs before that stage opens, and none is marked `[>]` before then. The epics realising ADR-0020, ADR-0060, ADR-0100, ADR-0180 and ADR-0190 are the foundations; the epic realising ADR-0290 supplies the Cito results, the home skill scale and the Director's school-goal term, and the epic realising ADR-0420 places the quadrants on the screen this epic builds.

## Acceptance criteria

1. A test imports each of the four types from generated fixtures and finds one file `data/blobs/<sha256>.<ext>` whose hash matches its name, one `blobs` row with the media type, and one import and one parse event in the same transaction; a GIF, a 26 MB file and a 21-page PDF write nothing. Evidence: the import and store tests' reports, from TSK-0918 and TSK-0920.
2. A test cancels an import after the preview and finds no new file in `data/blobs/`, no `blobs` row, no event and no temporary file. Evidence: the route test's report, from TSK-0920.
3. A test imports the same file twice and finds one file, one row and one import event; it withdraws the file, imports it a third time and again finds nothing new written. Evidence: the route test's report, from TSK-0920 and TSK-0924.
4. A fixture with no document date can't be confirmed until a date is entered, and its import event records `documentDateSource: parent`. Evidence: the route test's report, from TSK-0920.
5. A fixture lacking codes, open flags, task counts, dates, subdomain shares and the material level imports, and every such field is `null` in the parse event. Evidence: the parser test's report, from TSK-0919.
6. Changing the parser version in a test run writes one new parse event per kept file that isn't withdrawn, none for a withdrawn file, and leaves the earlier parse events unchanged. Evidence: the worker test's report, from TSK-0921.
7. A correction followed by a reparse with another value keeps the correction's value in `school_values`, marks the row `disagrees` and raises one notice; a second reparse under the same version raises none. Evidence: the projection test's report, from TSK-0922.
8. A failed parse writes a parse event with `outcome: failed`, a restart under the same parser version writes no second parse of that file, and after a failed reparse `school_values` keeps the earlier parse's values; a withdrawal removes the snapshot from `school_values`, `school_snapshot_changes`, both screens and the export for the school, while the export of the whole log still holds its four kinds of events. Evidence: the worker, projection and export tests' reports, from TSK-0921, TSK-0922, TSK-0924, TSK-0927, TSK-0928 and TSK-0929.
9. A fixture pair with a changed target marks the target change and the status change of that pair `target_moved`, and after a full recompute both projections equal their stored rows. Evidence: the projection test's report, from TSK-0923 and TSK-0922.
10. The property test finds `node_estimates` and `node_snapshots` byte-identical with and without school events over a 30-day simulated log, a deliberate import of `src/engine/school/` into `src/engine/states/` fails `school_events_in_model`, and one into the gateway fails `school_data_to_gateway`. Evidence: the property test's report and the lint verb's output, from TSK-0925.
11. With an empty catalogue, the mapping panel proposes no node for any goal and the «home and school» screen shows no goal until the parent confirms a link; a fixture pair where one linked goal is reworded shows a count of 1 for its subdomain at the head of the panel. Evidence: the panel and report tests' reports, from TSK-0926 and TSK-0927.
12. A log holding only snapshot links gives the Director the same value for every node as a log with no links. Evidence: the Director unit test's report, from TSK-0925.
13. The export for the school, over a fixture with play events, estimates and free text, holds only rows whose `record` is a school value or a Cito result, and every correction row carries `parent_correction`; the same route through `https://<mac-name>.local` gets `404`. Evidence: the export tests' reports, from TSK-0929.
14. A scan of the tracked files finds no fixture outside the output directory of `tools/school-fixtures.ts`, and the personal-data scan of group 1 passes over them. Evidence: the scan's output, from TSK-0917.
15. The parent judges the labels of level and status, the screen's wording and the timeline's source labels on a synthetic snapshot before the feature's acceptance. Evidence: the parent's recorded judgement, from TSK-0927 and TSK-0928.
16. Every requirement ADR-0310 addresses lands in at least one task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure one thing before it is finished: the preview's 95th percentile for a generated document of up to 4 pages on the family Mac against the 30 s baseline, which TSK-0920 reports. ADR-0310 reverses if the parent corrects or adds more than half of the goal fields of the first 3 real snapshots, and only real use shows that.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0916 Six school snapshot event types have schemas and names that don't name the school's vendor
      closes: REQ-6084, REQ-6086
      depends: none
- [ ] T-002 [P] TSK-0917 The parser's tests read only generated pupil overviews, and no real overview enters a tracked file
      closes: REQ-6082, REQ-6090
      depends: none
- [ ] T-003 [P] TSK-0918 The blob store keeps each snapshot file once under its hash and byte for byte
      closes: REQ-6004, REQ-6088
      depends: none
- [ ] T-004 TSK-0919 A local parser reads an overview into goals, names its version, and leaves every field the document doesn't show empty
      closes: REQ-6014, REQ-6024, REQ-6026, REQ-6028
      depends: TSK-0916 - the schema of `school_snapshot_parsed` the result fills.; TSK-0917 - the generated overviews the tests read.
- [ ] T-005 TSK-0920 The parent imports a snapshot on the Mac, checks the name and the date, and nothing is written until the parent confirms
      closes: REQ-6006, REQ-6008, REQ-6010, REQ-6012, REQ-6074, REQ-6076
      depends: TSK-0916 - the two event schemas the confirmation appends.; TSK-0918 - the store that keeps the file.; TSK-0919 - the parser the preview shows.
- [ ] T-006 [P] TSK-0921 A new parser version rereads every kept file that isn't withdrawn and leaves earlier parses unchanged
      closes: REQ-6016
      depends: TSK-0919 - the parser and its version.; TSK-0918 - the kept files the worker reads.
- [ ] T-007 [P] TSK-0922 A correction names the file, the goal and the field, wins over a parse, and a disagreement shows both values
      closes: REQ-6018, REQ-6020, REQ-6022
      depends: TSK-0916 - the schemas of the correction and parse events.
- [ ] T-008 [P] TSK-0923 The view of changes between snapshots derives from the four snapshot events and marks a moved target
      closes: REQ-6032, REQ-6034
      depends: TSK-0916 - the event schemas the fold reads.
- [ ] T-009 TSK-0924 A withdrawn snapshot disappears from every projection, report and export, and its file never leaves the Mac
      closes: REQ-6078, REQ-6080
      depends: TSK-0922 - `school_values`, which the withdrawal removes the snapshot from.; TSK-0923 - `school_snapshot_changes`, which it removes the snapshot from too.
- [ ] T-010 [P] TSK-0925 Static checks keep school data out of the knowledge model, the Director and every model call
      closes: REQ-6000, REQ-6002, REQ-6030, REQ-6048, REQ-6058
      depends: TSK-0916 - the event names the checks search for.
- [ ] T-011 TSK-0926 The parent maps each school goal to nodes through a catalogue or by hand, and only a confirmed link counts
      closes: REQ-6050, REQ-6052, REQ-6054, REQ-6056, REQ-6092
      depends: TSK-0916 - the goal key and the link events.; TSK-0922 - `school_values`, which holds the goals the panel lists.
- [ ] T-012 TSK-0927 After the MVP, the «home and school» screen sets the school's values beside the home states and converts neither
      closes: REQ-6036, REQ-6038, REQ-6040, REQ-6060, REQ-6064
      depends: TSK-0922 - the values in force the school column shows.; TSK-0926 - the confirmed links that select the rows.; TSK-0924 (not blocking) - withdrawal; the criterion on a withdrawn snapshot reads through the same projections.
- [ ] T-013 TSK-0928 After the MVP, the timeline draws the school's levels, the Cito results and the home scale as three labelled series
      closes: REQ-6044, REQ-6046, REQ-6062
      depends: TSK-0922 - the school levels in force.; TSK-0923 - the `target_moved` marks.
- [ ] T-014 TSK-0929 The export for the school holds school values, corrections and Cito results only, and is written only on the Mac
      closes: REQ-6066, REQ-6068, REQ-6070, REQ-6072
      depends: TSK-0922 - `school_values`, the file's source.; TSK-0924 - withdrawal, which the file must respect.; TSK-0925 (not blocking) - the three other static checks; this task adds the fourth in the same file and doesn't need them.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0916, TSK-0917 and TSK-0918.
- After TSK-0916: TSK-0922, TSK-0923 and TSK-0925.
- After TSK-0916 and TSK-0917: TSK-0919.
- After TSK-0918 and TSK-0919: TSK-0921.
- After TSK-0922 and TSK-0923: TSK-0924 and TSK-0928.
- After TSK-0922: TSK-0926.
- After TSK-0922 and TSK-0924: TSK-0929.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0916 | REQ-6084, REQ-6086 |
| TSK-0917 | REQ-6082, REQ-6090 |
| TSK-0918 | REQ-6004, REQ-6088 |
| TSK-0919 | REQ-6014, REQ-6024, REQ-6026, REQ-6028 |
| TSK-0920 | REQ-6006, REQ-6008, REQ-6010, REQ-6012, REQ-6074, REQ-6076 |
| TSK-0921 | REQ-6016 |
| TSK-0922 | REQ-6018, REQ-6020, REQ-6022 |
| TSK-0923 | REQ-6032, REQ-6034 |
| TSK-0924 | REQ-6078, REQ-6080 |
| TSK-0925 | REQ-6000, REQ-6002, REQ-6030, REQ-6048, REQ-6058 |
| TSK-0926 | REQ-6050, REQ-6052, REQ-6054, REQ-6056, REQ-6092 |
| TSK-0927 | REQ-6036, REQ-6038, REQ-6040, REQ-6060, REQ-6064 |
| TSK-0928 | REQ-6044, REQ-6046, REQ-6062 |
| TSK-0929 | REQ-6066, REQ-6068, REQ-6070, REQ-6072 |

The smallest set of tasks that would test the decision is TSK-0918, TSK-0919, TSK-0920, TSK-0922 and TSK-0925. Together they show whether a file is kept once and unchanged, whether the parser leaves an unseen field empty, whether nothing is written before the parent confirms, whether a correction survives a reparse, and whether school data stays out of the model, which are the failures the decision's security boundary and premortem name first.

## Not covered

- REQ-6042, the line that the school and the game measure different things beside each differing mark, which ADR-0420 addresses as REQ-7046 after it superseded REQ-6042; ADR-0310 no longer addresses it, and the epic realising ADR-0420 places the line and the quadrants on the rows TSK-0927 builds.
