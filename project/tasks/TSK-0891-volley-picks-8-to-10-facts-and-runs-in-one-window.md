---
id: TSK-0891
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5844]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Volley shows 8 to 10 basic facts in one window, picked from the facts that aren't automatic first

After this task, the Director can build a Volley of 8 to 10 facts from `fact_states`, the server sends it as one `volley` packet, and the client shows its rows in one task window on one keypad with no hint, no twin and no time on the screen.

## Acceptance criteria

1. Given fixture fact states with at least 3 facts that aren't automatic and at least 7 that are, when the Director picks Volleys over 1,000 seeds, then each holds 10 distinct facts, exactly 3 of them not automatic, due facts first, then «вычисляет» before «не знает», then the lower block number, with ties broken by the seed (REQ-5844). Closed by: a seeded pick test.
2. Given fewer than 3 facts that aren't automatic, when a Volley is picked, then it holds all of them; given fewer than 10 places filled by the first three steps, then the Volley holds as many as were found and never fewer than 8, filled by the least recently shown other fact of blocks 1 and 2, and never more than 10 (REQ-5844). Closed by: the same test with sparse fixtures.
3. Given a picked Volley, when its rows are ordered by the seed, then no two facts that aren't automatic stand side by side where the mix allows it, and as few such pairs as it allows otherwise (REQ-5844). Closed by: a property test over 1,000 seeds.
4. Given the Volley's window in a Playwright test, when the player answers every row on the one keypad, then the player never leaves the window, no timer, time or speed shows, «Не знаю» counts as a miss, a wrong row shows the correct answer at once and the next row opens, and the window offers no hint ladder, twin or detailed explanation; the `volley` packet holds `volleyId` and rows with `itemId` and `view`, and no `factId` or time (REQ-5844). Closed by: a Playwright test and a packet test.
5. Given a player who leaves mid-Volley, when the player resumes, then the same Volley reopens at its first unanswered row as the same first attempt, and that row counts for accuracy with no time (REQ-5844). Closed by: a resume test that reads the log.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the pick as a Director function that reads `fact_states` and the seed, the packet kind `volley` on `GET /api/session/:id/next`, each row's answer on `POST /api/session/:id/answer`, the `volley_started` event with `volleyId`, the floor and the `factId` list, and `volleyId` on `item_shown` in the payload version TSK-0889 added.

Pick in this order. Three places go to facts that aren't automatic, or to every such fact when fewer than 3 exist. The other places go to automatic facts, due ones first and then those with the oldest last show. Places they can't fill go to facts in «вычисляет», then facts never shown in the file's order. A Volley that holds fewer than 8 takes any other fact of blocks 1 and 2, the least recently shown first. A Volley holds 10 whenever the first three steps find 10.

A row runs `open`, `first_answered` and `closed` in the Volley's window. The window shows no time, no timer and no speed. A fact's answer time reaches only the server's measure.

## Depends on

- TSK-0889 (blocking): the fact states, due days and `factId`.

The epic realising ADR-0080 supplies the attempt flow and the epic realising ADR-0150 the task window and keypad. Until they exist, the Volley's rows run on the stand-in flow and the plainest window the client shell draws, and those epics adopt the packet.

## Evidence

Not yet.

## Left alone

The Volley's result, its yarn, the record and the replies to a miss, which TSK-0892 builds. Which floors carry a Volley, which TSK-0893 decides.
