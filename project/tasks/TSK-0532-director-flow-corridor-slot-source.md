---
id: TSK-0532
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-1006, REQ-1008, REQ-1010]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The success share of the last 10 graded attempts decides whether a room slot is review or frontier

After this task, a pure function in `src/engine/director/corridor.ts` computes the success share over the last 10 graded first attempts and answers `review` or `frontier` for each room slot, so a session below 0,70 gets only review, above 0,80 only frontier, and in between a deficit rule that keeps review at 30 % to 40 %.

## Acceptance criteria

1. Given a log of 10 graded first attempts with outcomes `clean`, `partial` and `alt`, when the share is computed, then `clean` counts 1, `partial` 0,5 and `alt` 0, the attempts come across adventure boundaries, mental arithmetic and control facts count, and with fewer than 10 the share uses what exists; given none, then the slot counts as inside the corridor. Closed by: a unit test for each case.
2. Given a share below 0,70, when the slot type is asked, then it is `review` (REQ-1006); given a share above 0,80, then it is `frontier` (REQ-1008). Closed by: a unit test for each bound, at 0,69 and 0,81, and at 0,70 and 0,80 for the inside.
3. Given a share from 0,70 to 0,80 and `n` such slots so far, when the slot type is asked, then it is `review` when the adventure's review count among them is below `0.30 * (n + 1)` rounded up, and `frontier` otherwise (REQ-1010). Closed by: a unit test over `n` from 0 to 30.
4. Given a simulated adventure with the share held inside the corridor, when it has 8 or more such slots, then review is between 30 % and 40 % of them; given 7, then the rule still runs and whole slots may land outside the band, as with 2 of 7. Closed by: a unit test at 8, 10, 20 and 30 slots and at 7.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/director/corridor.ts` with the share and the slot type. It reads the log and the adventure's own counts and nothing else, so one log gives one answer. ADR-0070 as ADR-0360 amends it sets the deficit rule at `0.30 * (n + 1)` rounded up, which keeps the band from 8 slots on; I read REQ-1010 as a share over the adventure, since whole slots can't always land in the band below that.

The attempts ADR-0230, ADR-0260 and ADR-0300 keep out of the share, riddles, grouping tasks and track tasks, and the Volley that counts as one entry, are each a filter on the list of attempts the function receives, which those epics add. Raised mode's larger review count is TSK-0546.

## Depends on

Nothing. The outcomes `clean`, `partial` and `alt` are on the `verdict` events the epic realising ADR-0020 built.

## Evidence

Not yet.

## Left alone

Which node a review or frontier slot gets, which TSK-0533 and TSK-0534 decide, and the grouping slot of ADR-0260, which adds a fourth source beside these two.
