---
id: TSK-0604
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1526, REQ-1528, REQ-1530, REQ-1532, REQ-1534, REQ-1536, REQ-1538, REQ-1572, REQ-1574]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A dreamcore floor changes only the decoration, and a slip into the Underside is rare, short and ends where it began

After this task, the Director draws a floor's dreamcore variant from the day's seed with probability 1/4 after the trials are set, the variant changes only background, music, lines and scenes, a slip into the Underside comes at most once in 7 calendar days for 2 or 3 scenes and ends where she slipped from, and the three eerie Tangles carry level 1.

## Acceptance criteria

1. Given one day's seed with the variant on and off, when the plans are compared, then the trials, their order, the floor's budget and the task window are identical, and the selection code's types have no field for the variant (REQ-1532). Closed by: a plan test and a type test.
2. Given an Ascent and Session 0, when the variant is drawn, then it never appears (REQ-1534). Closed by: a unit test for each.
3. Given 30 replayed days, when the log is read, then at most one slip stands in any 7 calendar days, each of 2 to 3 scenes whose last scene returns her to where she slipped from, from the library when the Master fails (REQ-1526, REQ-1528, REQ-1530). Closed by: a replay test over 30 days with and without a failing Master.
4. Given a dreamcore reply, when its schema is read, then it requires a familiar among its speakers and an `exit` of `door`, `light` or `stair`, and a reply without either is discarded (REQ-1536, REQ-1538). Closed by: a schema test.
5. Given the canon data, when «Шепотун», «Шкатулочница» and «Портретница» are read, then each carries creepiness level 1 and none appears at level 0 (REQ-1572, REQ-1574). Closed by: a content test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the draw to the Director after the route and the trials are set, the slip scheduler counted in calendar days, and the dreamcore reply's two required fields. The client draws the exit beside the heroine; its art is ADR-0170's, so this task passes the `exit` value and a placeholder.

## Depends on

- TSK-0603 (blocking): the variant and the Tangles read the level in force and the forced level 0 kinds.

The epic realising ADR-0070 selects the floor's trials; this task works on the stand-in order.

## Evidence

Not yet.

## Left alone

The art of the Underside and the exits, which ADR-0170 owns.
