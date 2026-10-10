---
id: TSK-0913
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5986, REQ-5988]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A track task is snapshotted in WebKit and Chromium, and the adult tests it on a real iPad

After this task, acceptance test 15 stores snapshots of a track task with its drawn source in WebKit at the iPad viewport and in Chromium, and `docs/ipad-checklist.md` holds three track items that the adult runs on a real iPad.

## Acceptance criteria

1. Given a track task of each source kind, when acceptance test 15 runs, then it stores a snapshot in WebKit at the iPad viewport and one in Chromium, and a changed source or layout changes a snapshot (REQ-5986). Closed by: the acceptance test's report and its stored snapshots.
2. Given a source at the size ceilings of each kind, when it shows at zoom 1 at 1180 by 820, then it fits the task window with every region at its 56 px zone (ADR-0300). Closed by: the same snapshots at the ceiling sizes.
3. Given `docs/ipad-checklist.md`, when it is read, then it holds a track task answered by a tap, a pinch inside the source and a page pinch outside it (REQ-5988). Closed by: a check that reads the file for the three items.
4. Given a real iPad, when the adult runs the three items, then the tap selects a region, the pinch inside the source zooms only the source, and the page pinch is recorded as it behaves, with the result written in the stage's acceptance record (REQ-5988). Closed by: the adult's judgement, because Playwright's WebKit isn't Safari on an iPad and only the device shows what page zoom does to the task window.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add acceptance test 15 to ADR-0190's matrix: WebKit at the iPad viewport as the nearest automated stand-in for Safari on the iPad, and Chromium for the computer. Add the three items to `docs/ipad-checklist.md` with what the adult looks for in each. If the checklist shows Safari zooming the page on a pinch inside the source, ADR-0300's fourth reversal condition applies and `SourceView` is reopened, because the zoom's rule that nothing else moves then fails on the device.

## Depends on

- TSK-0907 (blocking): the drawn source the snapshots show.
- TSK-0911 (blocking): the pinch the checklist item tests.

The epic realising ADR-0190 supplies the acceptance matrix and the checklist file.

## Evidence

Not yet.

## Left alone

Fixing a zoom failure the device shows, which is a defect of its own once found.
