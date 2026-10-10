---
id: TSK-0565
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0100, REQ-0124]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server plans the day's adventure from a seeded plan sized to about 60 minutes at her pace

After this task, a game day that opens with no adventure in progress gets a `plan_built` event holding a seeded plan of 3 floors, or 4 when the forecast fits, whose forecast stays within 60 minutes of her active time, and every room's length is drawn when the room opens and never changes.

## Acceptance criteria

1. Given synthetic pace histories, one fast and one slow, when the planner forecasts, then the forecast is within 60 minutes, and a fourth floor joins the plan only when the forecast with it stays within 60 minutes (REQ-0100). Closed by: a forecast test over both histories.
2. Given 3 days of history, when the forecast runs, then the median covers those 3 days; given no history, then the forecast takes 75 seconds per first attempt with its review (REQ-0100). Closed by: the same forecast test.
3. Given 1,000 seeds, when a room opens, then its length is between 3 and 5 tasks, `room_opened` holds it, and it is the same on every later read of the room; given a trim to 3 tasks, then the draw is capped at 3 (REQ-0124). Closed by: a plan test over 1,000 seeds.
4. Given a `plan_built` event, when the plan is rebuilt from its adventure seed and the same pace history, then the rebuilt plan equals the logged one. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the plan builder that SPC-0090 places in the planner, run it when a game day opens with no adventure in progress, and log `plan_built` and `room_opened`. The pace is the median over her last 5 adventure days of three durations: a first attempt with its review, a second attempt and a scene. The forecast adds the story, at most 10 minutes, and the expected eye exercises, 3 an hour at 35 seconds each until `eye_exercise_ended` exists. An adventure that stops at the soft stop continues the next game day from the same slot with the rest of the plan recomputed from her pace, and a new adventure starts only after the previous finale.

## Depends on

The epic realising ADR-0070 supplies the floors, the rooms per floor and every task in them, and recomputes the forecast before each floor. This task runs before that work against the stand-in task table in `src/server/standin.ts`, which fills the floors with fixed tasks, and leaves the choice of nodes and the trim order to that epic.

## Evidence

Not yet.

## Left alone

The warm-ups and the easy tasks, which TSK-0566 places in this plan, the transitions of TSK-0567 and the model budget of ADR-0100.
