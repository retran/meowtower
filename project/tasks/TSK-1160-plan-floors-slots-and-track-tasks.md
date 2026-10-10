---
id: TSK-1160
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-1040, REQ-7148, REQ-5248, REQ-5912]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The day's plan keeps both floors at a slow pace, a room slot names its floor's own domain and the track tasks follow one order

After this task, the plan keeps its minimum of graded first attempts and of probe letters and plays to the soft stop when both don't fit, no room slot names a word-problem node, and the Sources track's tasks go to the older open block first and lapse when the only host floor ends. This settles entries 16, 17, 60, 61 and 62 of ADR-0460.

## Acceptance criteria

1. Given a pace slow enough that 25 graded first attempts and 3 probe letters can't both fit before the soft stop, when the plan is made, then it keeps both floors, plays to the soft stop and resumes on the next game day, and neither measurement yields to the other (REQ-1040, REQ-7148). Closed by: a planner test over a slow-pace fixture.
2. Given a day's plan, when each room slot is read, then it names a node of its floor's own domain and none of T1 to T4, and word problems reach play through the Guardian (REQ-5248). Closed by: a planner test over 100 seeded plans.
3. Given two track nodes with open blocks, when the day's tasks are placed, then the node whose block's first observation is older gets both tasks, ties broken by identifier; given a track node with no built template, then every node rule skips it and it shows «не проверено» (REQ-5912). Closed by: a planner test over the two cases.
4. Given a route whose only host floor ends before both track tasks are shown, when the day ends, then the unshown tasks lapse for that game day and the track window counts the day (REQ-5912). Closed by: a planner test over a one-floor route.
5. Given a one-finger contact on a source, when it moves under 10 CSS px before it lifts, then it is a tap, and given a longer move, a pan; and given the built client, then `src/ui/source/` imports nothing from `src/render/source/`. Closed by: a Playwright test over a 9 px and an 11 px move and the lint verb's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply entries 16, 17, 60, 61 and 62 as written. The 10 CSS px threshold is a starting value ADR-0460 chose, about a fifth of the 56 px touch zone of REQ-5974; the stage 0.2 acceptance on a real iPad tests it, and ADR-0460 reopens it when a pan is taken for a tap on more than 1 in 20 tries. The server alone renders the source, because the view the server sends already holds the SVG.

## Depends on

Nothing. The epics realising ADR-0070 and ADR-0300 own the planner and the track; this task runs on their fixtures. The epic realising ADR-0430 supplies the probe's letters, and the planner counts a fixed 3 letters from a stand-in until it exists.

## Evidence

Not yet.

## Left alone

The probe's own schedule, which TSK-1171 builds, and the track's block rules, which ADR-0300 and ADR-0400 own.
