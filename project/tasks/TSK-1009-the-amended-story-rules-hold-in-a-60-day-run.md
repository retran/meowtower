---
id: TSK-1009
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-5268, REQ-6202, REQ-6204, REQ-6210, REQ-6216, REQ-6218, REQ-6228, REQ-6240, REQ-6244, REQ-6292, REQ-6434, REQ-6436, REQ-6438]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The 60-day run proves the rules ADR-0360 amended in the pen, the starters, the interlude, the routes and the schedule

After this task, a test group in ADR-0190's simulation proves each rule that ADR-0360 entries 33 to 35 and 81 to 89 changed in the story: the pen reopens after a soft stop, starters appear only where the field is open, an adventure with the field off has no free-action points and stays out of the signal, and the schedule and routes behave as amended. This task builds none of those parts.

## Acceptance criteria

1. Given a pen closed by a soft stop, when she opens it again, then it closes the book again after its first turn until an «Ещё один ряд» moves the point; with the gateway off or the adventure's budget spent it stays closed; a pen reply that fails twice closes through a library scene with `free_pen_ended` reason `reply_failed` and she can open it again (REQ-6434, REQ-6228). Closed by: a pen test over the four cases.
2. Given scenes with the free-text field open and closed, when starters are read, then three starters appear only where the field is open, every scene offers «Дальше», `route_choice` holds `choices` and no field, a tap or key 1 to 3 inserts without sending, and an unchanged starter at the finale's `session_end` doesn't count as her own action (REQ-6436, REQ-5268, REQ-6210, REQ-6218, REQ-6216). Closed by: a component test and a schema test.
3. Given an adventure played with the field off, when its free-action points and the signal's windows are read, then it has none, its `session_end` counts no own action, and both windows of the signal leave it out; given the field on, then it has at least 2 points, one not tied to a trial (REQ-6438, REQ-6292). Closed by: the 60-day run's synthetic profiles, with the signal rising on the profile whose own words fall 40 % while its unchanged starters rise.
4. Given sends with each origin, when the planner's order is built, then every send is a `player_action` fact with its `origin`, the order lists open facts older than the current adventure first and then the newest, at most 10, and the plan check fails only on older `own` or `starter_edited` facts the order carried (REQ-6202). Closed by: a planner test over a plan that leaves one such fact unechoed, and the parent's judgement at the stage 0.3 review that a later scene shows the consequence, because only a person reads whether a scene echoes her action.
5. Given plans of 1, 2 and 3 floors, when the interlude is placed, then it plays after the first floor's chest on 1 or 2 floors and after the second floor's chest on 3 or more, once on a resumed adventure (REQ-6204). Closed by: a planner test over the three lengths and a resume.
6. Given routes A and B of equal total value and of unequal value, when she presses «Дальше», then the game takes the higher one and A on a tie (REQ-6240). Closed by: a route test over both cases.
7. Given a familiar's first grant that reaches its evolution threshold and the Director's first slip, when the transactions commit, then `system_unlocked` for evolution and for the Underside is in those same transactions, and the nearest goal picks only among systems already open (REQ-6244). Closed by: a ledger test and a goal test on day 2.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the test group and the synthetic profiles to ADR-0190's simulation and the unit and component tests above. The epic realising ADR-0330 builds the pen, starters, routes, interlude and schedule to SPC-0330, which already states the amended rules; where a test fails, the fix belongs to that epic and this task reports it as a finding. The nearest-goal rule is the one part here that sits in the game rules of ADR-0140.

## Depends on

The epic realising ADR-0330 supplies the pen, the starters, the route choice, the interlude and the schedule, and the epic realising ADR-0140 supplies the nearest goal. Until they exist the tests run on fixtures that state each rule's inputs, and the 60-day run on the real parts is left to the epic realising ADR-0330.

## Evidence

Not yet.

## Left alone

The pen's, the starters' and the schedule's own behaviour, which ADR-0330's epic builds, and the parent's reading of the dialogue book, which ADR-0330's checks hold.
