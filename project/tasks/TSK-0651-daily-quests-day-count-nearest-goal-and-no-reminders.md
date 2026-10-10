---
id: TSK-0651
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-2006, REQ-2008, REQ-2010, REQ-2012, REQ-2014, REQ-2016, REQ-2018, REQ-2034, REQ-2132, REQ-2144]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Daily quests count acts of play, the day count counts days played, and the game never reminds her to return

After this task, the module picks 3 daily quests a day from day 3 of play, counts days from the log, keeps no streak of days, sends no notification, and sends the nearest goal with the main screen and the end of every scene.

## Acceptance criteria

1. Given a game day from day 3 of play, when it starts, then the module picks 3 quests from the template pool by the day's seed, the same 3 for the same seed, and a template whose counter reads a verdict fails the content check (REQ-2006). Closed by: a unit test of the pick and the check's fixture test.
2. Given a day played with every answer wrong, when it ends, then every quest that counts an act of play, such as clearing floors or picking from a chest, can be met, and a met quest gives 50 experience, 10 buttons and 1 thread (REQ-2006, REQ-2034, REQ-2132). Closed by: a test that plays one day with all wrong answers and reads the grants.
3. Given a quest unmet when the game day ends at 04:00, when the day rolls over, then the quest is gone and no event the player sees is written, and the optional pattern row comes at most once in 3 days from a success branch and gives 2 star yarn and nothing else (REQ-2008, REQ-2144). Closed by: a unit test with a stubbed clock and a 30-day simulation of the pattern row.
4. Given a log with three played days and two skipped, when the day count is computed, then it is 3, no streak of days exists in any projection or reply, and a static check fails the build on a Web Push subscription, a Notification API call or a service-worker push handler outside the Parent Room's code (REQ-2010, REQ-2012, REQ-2014). Closed by: a unit test of the count and the static check's fixture test.
5. Given a state where the next level has the smallest remaining share, when the main screen and the end of a scene are built, then each carries that goal, and ties break in the order next level, next evolution, next forge recipe, bestiary percentage and next Diary page among the systems already open; the experience bar carries its points toward the next level (REQ-2016, REQ-2018). Closed by: a unit test with a tie and an integration test of the two replies.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/game/quests.ts` and `src/game/goal.ts`, with the quest pool in `economy.json`. Quests start on day 3 of play, as ADR-0330 amends it. Pick "the smallest remaining share" as the nearest goal so the goal shown is the one she can reach soonest, as ADR-0140 chose. The day count is `COUNT` of game days with at least one answered task in the log, and it needs no state of its own.

## Depends on

- TSK-0644 (blocking): the quest pool and amounts are content.
- TSK-0650 (blocking): the quest's experience and the level the goal reads.

The game day's 04:00 boundary is `src/shared/game-day.ts`, which already exists. The day count this task computes is the day of play that ADR-0330's gates read: quests from day 3, the bestiary on day 4, the forge on day 6 and the shop on day 8, so the other tasks of this epic take their opening day from this function. Where a stage 0 adventure has no log of days yet, tests pass a fixture day number.

## Evidence

Not yet.

## Left alone

The parent's alarm that ADR-0110 leaves to a later stage, which this static check keeps room for by exempting the Parent Room, and the drawing of the goal, which the epic realising ADR-0150 owns.
