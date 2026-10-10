---
id: TSK-0723
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-0105, REQ-0107]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent prepares, previews and approves the next adventure, and the player gets it with no live model call

After this task, the Parent Room prepares the next adventure, previews its route, scenes, task statements, parameters and answers, lets the parent swap a task and approve it, and the next game day serves the approved adventure from the unplayed pool with no model call.

## Acceptance criteria

1. Given the Parent Room, when the parent calls `POST /api/parent/adventures/prepare`, then planning and scene drafting run for the next adventure, and `GET /api/parent/adventures/prepared` returns its route, story scenes, math task statements, parameters and answers before the player plays (REQ-0105). Closed by: an integration test and a Playwright test of the preview screen.
2. Given a prepared adventure, when the parent swaps a task from the template bank and approves it, then `adventure_approved` is logged and the adventure is queued for the next game day (REQ-0107). Closed by: an integration test.
3. Given an approved adventure and the next game day, when the player's session starts, then the adventure served is the approved one, with its swapped task, and the log holds no model request for it (REQ-0107). Closed by: an integration test that reads the log.
4. Given a prepared and unapproved adventure, when the player's routes are called, then none carries it. Closed by: an integration test.
5. Given the Parent Room's navigation, when its entries are listed, then they hold the summary, VWO readiness, graph map, node card, misconceptions, limits, science and adventure preview screens, and none for dynamics, home and school or a timeline. Closed by: a Playwright test that lists the entries.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the three routes from ADR-0180's table, the preview screen, the swap and the pool the play lifecycle draws from. The prepared contents are stored in the log with the approval, so serving them needs no model call.

The epics realising ADR-0070, ADR-0090 and ADR-0110 supply the Director's planning, the day plan and the Master's scene drafting. Until they exist, preparing uses the stand-in adventure and its fixed scenes, which the same routes return, and the real planner replaces it.

## Depends on

- TSK-0708 (blocking): the screen and routes sit behind the parent session of the report.
- TSK-0709 (blocking): criterion 5 lists the node card among the screens, which exists once it lands.
- TSK-0710 (blocking): criterion 5 lists the summary.
- TSK-0711 (blocking): criterion 5 lists the graph map.
- TSK-0712 (blocking): criterion 5 lists the misconceptions and science screens.
- TSK-0713 (blocking): criterion 5 lists the VWO readiness screen.
- TSK-0717 (blocking): criterion 5 lists the limits screen.

## Evidence

Not yet.

## Left alone

How the Director plans the adventure, how scenes are drafted and how the day plan fits an approved adventure, which ADR-0070, ADR-0110 and ADR-0090 own, and the story book screen, which ADR-0110 provides.
