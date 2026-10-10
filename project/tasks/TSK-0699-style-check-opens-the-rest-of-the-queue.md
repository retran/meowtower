---
id: TSK-0699
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-2840]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The queue makes only the four heroine sheets until the parent records the style check

After this task, the queue refuses every asset except the four heroine sheets with `style_check_missing` until the parent has recorded the family's choice among those sheets in the Parent Room, and the recorded sheet becomes the reference for every later picture of the heroine.

## Acceptance criteria

1. Given no row in `art_style_check`, when a background is asked for, then the queue refuses it with `style_check_missing` and the four heroine sheets still generate (REQ-2840). Closed by: an integration test with the stub.
2. Given the four sheet jobs are `ready_to_choose`, when the parent records one variant of one job on the style-check panel, then that job is `chosen`, the variant is written to `public/art/<id>.webp`, the `art_style_check` row holds the job, the variant, who recorded it and when, and the queue then schedules other assets (REQ-2840). Closed by: an integration test and a Playwright test of the panel.
3. Given the style check is recorded, when the choice screen lists jobs, then the three other sheet jobs stay unchosen, serve no picture and aren't offered. Closed by: an integration test.
4. Given no style check is recorded, when the server resolves the heroine's picture, then it sends the heroine's placeholder and never keyart-heroine, which carries the grey mouse. Closed by: an integration test on the server's resolution.
5. Given no parent session, when the style-check route is called, then it answers 401. Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the service table `art_style_check`, the queue's gate that reads it before it schedules anything but the four heroine sheets, and the style-check panel with its route under `/api/parent`, behind the PIN and the parent session. The panel shows each heroine sheet job's variants with their scores and records one variant of one job. The recording does what a choice does in TSK-0701 for that job and writes the row. Until the family has shown the player the key art and the four sheets, the parent has nothing to record, and the queue stays on the sheets.

The tab that holds the panel and the Parent Room's layout belong to the epic realising ADR-0180. Until it exists the panel is a page under the stand-in `/parent` area that TSK-0390 built.

## Depends on

- TSK-0693 (blocking): the gate extends its queue.
- TSK-0701 (not blocking): the panel's choosing code and the choice screen share one write of `public/art/<id>.webp`; either task can land first, and the second reuses the first's function.

## Evidence

Not yet.

## Left alone

The family's showing of the key art to the player, which no program does, and the stage gate that makes the recorded style check a prerequisite of stage 0.3, which the epic realising ADR-0190 owns.
