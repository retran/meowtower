---
id: TSK-0929
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0310
closes: [REQ-6066, REQ-6068, REQ-6070, REQ-6072]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The export for the school holds school values, corrections and Cito results only, and is written only on the Mac

After this task, `./meowtower export-school` and the button «Выгрузка для школы» write one CSV file with the school's values as the parser read them, the parent's corrections marked as the parent's and the Cito results the parent entered, and nothing from play.

## Acceptance criteria

1. Given a snapshot with a parse and a correction and a Cito result, when `./meowtower export-school` runs, then it writes `data/exports/school-<UTC timestamp>/school-data.csv`, one UTF-8 file with a byte-order mark and the columns `record`, `snapshot_date`, `date_source`, `goal_code`, `goal_wording`, `subdomain`, `field`, `value`, `value_source` and `parser_version`, apart from the export of the whole log (REQ-6066, REQ-6068). Closed by: a command test that reads the file.
2. Given the same fixture, when the file's rows are read, then each school value appears as the parser read it for each snapshot date, each correction in a row of its own with `value_source` `parent_correction`, and each entered Cito result with the form's fields in the same columns (REQ-6068). Closed by: a content test of the rows.
3. Given a fixture log with play events, estimates, node states, free text and story, when the export runs, then every row's `record` is `school_value` or `cito_result` and no row holds any of them; given a fixture `export.ts` that names another event type or reaches the knowledge model, the Director or a game projection, then `school_export_scope` fails and names it (REQ-6070). Closed by: a content test and the check's test.
4. Given a Parent Room opened on another device and the same route through `https://<mac-name>.local`, when each asks for the export, then the device offers no button and the route answers `404` (REQ-6072). Closed by: a route test on both listeners and a Playwright test on the iPad viewport.
5. Given no snapshot that isn't withdrawn and no Cito result, when the export runs, then it writes no file and says `school_export_empty`; given a withdrawn snapshot, then none of its values is in the file (ADR-0310). Closed by: a command test over both cases.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/parent/school/export.ts`, which reads only `school_values` and the projection of Cito results the epic realising ADR-0290 builds, the command, the button in the tab «Выгрузка данных» and the two routes `POST /api/parent/school/export` and the file's route, all on the loopback listener. I chose one CSV file in UTF-8 with a byte-order mark, as ADR-0310 did, because a teacher opens it in a spreadsheet with no tool of ours, and the research decided on one file. The Cito rows use the form's fields in the same columns. Add `school_export_scope` to the lint verb.

## Depends on

- TSK-0922 (blocking): `school_values`, the file's source.
- TSK-0924 (blocking): withdrawal, which the file must respect.
- TSK-0925 (not blocking): the three other static checks; this task adds the fourth in the same file and doesn't need them.

## Evidence

Not yet.

## Left alone

Whether a school reads the file without help, and a Dutch version of its column names, which the first hand-over to a teacher shows.
