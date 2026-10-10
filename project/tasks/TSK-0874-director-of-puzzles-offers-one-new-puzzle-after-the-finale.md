---
id: TSK-0874
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0280
closes: [REQ-5702, REQ-5704, REQ-5718, REQ-5720, REQ-5790, REQ-5794, REQ-5795]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Director of puzzles offers at most one new puzzle a game day, after a finale, and never more than three are open

After this task, a module in `src/engine/puzzles/` that imports nothing from ADR-0070's Director offers one puzzle when the adventure that just finished is at least her second, none was offered that day, fewer than 3 are open and the schedule has unlocked the branch, and it rotates themes and difficulties by the rules below.

## Acceptance criteria

1. Given a 60-day simulation with puzzle play, when the log is read, then at most one `puzzle_offered` a game day exists, none before a finale or before the second adventure's finale, session 0 not counted, and never more than 3 puzzles open (REQ-5702, REQ-5704, REQ-5718, REQ-5720). Closed by: the simulation's report.
2. Given the same run, when the themes are read, then a theme returns only after at least 4 other themes have come since it last came, unless no theme meets that rule, and then the theme offered longest ago is taken (REQ-5794). Closed by: the simulation's report and a unit test of the fallback.
3. Given a theme with no approved puzzle left, when the Director picks, then it never picks that theme, and when no theme has one it offers nothing and the state is `puzzle_bank_exhausted` (REQ-5795). Closed by: a unit test.
4. Given a puzzle of the week, when it is offered, then it counts as that day's one new puzzle and as one of the three open, and it is offered in place of an ordinary one only when none was offered in the last 7 game days and none is open (REQ-5790). Closed by: a simulation and a unit test.
5. Given a puzzle with a running clue, when the Director picks, then it is offered only when the campaign has reached the clue's earliest checkpoint and no clue puzzle was offered in the last 5 adventure days, which are game days on which she played an adventure; otherwise the Director passes it over for the next puzzle of its theme. Closed by: a unit test and the simulation's report.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the module. Within a theme it offers the lowest-difficulty approved puzzle not yet offered, ties broken by the day's seed. An open puzzle is offered, unsolved and not in the box. I chose 5 adventure days as my reading of CAN-0080's "once every several sessions", as ADR-0280 does, and 7 game days for the week, because a calendar week would put a weekday on the game's logic.

## Depends on

- TSK-0873 (blocking): the module offers only puzzles whose current hash is approved.
- TSK-0876 (blocking): the offers write `puzzle_offered`.

The epics realising ADR-0210 and ADR-0330 supply the schedule of new systems and the game day; the epic realising ADR-0090 supplies the adventure-day count. The module runs on a fixture schedule until they land.

## Evidence

Not yet.

## Left alone

The owner's rule for growing the branch from the report's counts and difficulty 5, which come after the MVP.
