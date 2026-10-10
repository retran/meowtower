---
id: TSK-0950
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6236, REQ-6238]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `planDay` returns two routes that keep the three-day window and the planned graded slots

After this task, `planDay` returns routes A and B for every new adventure, both with the same number of floors and the same planned graded slots, both keeping the three-day domain window and the overdue-first rule, and B differing from A in a floor wherever the window allows and in order and opening beat where it doesn't.

## Acceptance criteria

1. Given 90 simulated days, when `planDay` runs on each, then both routes of every adventure keep the three-day window and the rule that a domain overdue for 2 adventure days comes first, and both hold the same number of floors and the same planned graded slots, the smaller of their two forecasts (REQ-6236). Closed by: a route test over the 90 simulated days.
2. Given a day on which a swap keeps the window for the next two days, when B is built, then B swaps A's free floor of lowest total value for the domain of highest total value not on A, `differsIn` is `floor`, and this holds on every such day of the 90 (REQ-6238). Closed by: the same route test, which counts `differsIn: "floor"`.
3. Given a day on which no swap keeps the window, when B is built, then B holds A's floors in another order with another opening beat, and `differsIn` is `order` (REQ-6238). Closed by: a unit test on a fixture day with one free floor.
4. Given a remainder of one floor, when `planDay` runs, then it returns one route, no choice scene follows and `route_offered` isn't written (`routes_identical`), and verify counts such days. Closed by: a unit test and the count in verify's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Extend `planDay` in `src/engine/director/` to return `{ A, B }`. Build A as `planDay` builds today. Build B from A by one swap, because the three-day window leaves about one free floor in three days, so a swap is easier to check against the window than a second independent run, which would mostly agree with the first. Cap both routes at the smaller of the two forecasts and never top up the shorter one with a room, because that could push the forecast past 60 minutes. Only the chosen route's floors count in the window, which TSK-0951 records.

Verify prints the share of days on which `differsIn` is `order`, so the owner sees how often the choice is one of order and story only. RES-4120 expects about two days in three.

## Depends on

Nothing in this epic. The epic realising ADR-0070 supplies `planDay`, the total value of each floor and the window check. Until it exists the task runs on a fixture `planDay` that returns A from a table of days, and the real ranking and the real window check stay with that epic.

## Evidence

Not yet.

## Left alone

The scene that shows the two routes, which TSK-0951 builds, and the amendment to ADR-0070's route length, which the epic realising ADR-0070 carries in its own text.
