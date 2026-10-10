---
id: TSK-0757
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5004, REQ-5018, REQ-5020]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server plans one adventure a game day, and daily quests and rewards come on every game day she plays

After this task, the server refuses to log `adventure_planned` when the log already holds one for the same game day, Session 0 included, and once daily quests and daily rewards have first appeared they are offered on every game day with play, with the choice of two routes beside the three quests and never in their place.

## Acceptance criteria

1. Given a game day that already holds an `adventure_planned` event, when a request asks for a second adventure the same game day, then the server logs no second `adventure_planned` and the player stays in the Tower with the screens without tasks (REQ-5004). Closed by: an integration test.
2. Given the player's first game day, whose Session 0 counts as that day's adventure, when a request asks for a new adventure that day, then the server refuses it, and at the first server contact of the next game day it plans one (REQ-5004). Closed by: an integration test over two game days.
3. Given a 60-day simulation in which quests and rewards first appear on day 3, when the simulation counts offers, then every game day with play after day 3 has daily quests and daily rewards, and no gap in play removes them afterwards (REQ-5018). Closed by: the simulation's report.
4. Given a game day on which a stand-in route choice is offered, when the day's offers are read, then the three daily quests are all present beside the route choice (REQ-5020). Closed by: the simulation's report with a fixture route offer.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the refusal to the append path for `adventure_planned`: it reads the game day of the event through `gameDayOf` and compares it with the days already in the log. The log is the only truth, so no flag outside it records that a day's adventure was started.

Make the daily quest and daily reward offer read the game-day index and nothing else once the first offer has been made. ADR-0330's schedule of one new system a day may set the day they first appear, and the offer reads that day from the schedule when it exists. Until then a fixture sets it. Nothing counts consecutive days or punishes a gap, as ADR-0140's day count already ensures.

Offer the route choice of ADR-0330 beside the quests. Until the epic realising ADR-0330 exists, a fixture route offer stands in; this task owns only the rule that it never takes a quest's place.

## Depends on

- TSK-0756 (blocking): it supplies `gameDayOf` and the daily job runner that the offers and the refusal read.

The epic realising ADR-0330 supplies the schedule and the route choice; this task runs on fixtures and leaves their content to that epic.

## Evidence

Not yet.

## Left alone

The route choice's content and the schedule's dates, which ADR-0330 owns, and the adventure planner of ADR-0070.
