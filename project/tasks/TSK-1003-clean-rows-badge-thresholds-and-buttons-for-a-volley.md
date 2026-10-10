---
id: TSK-1003
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-1730, REQ-1732, REQ-1752, REQ-1754, REQ-1760, REQ-6250, REQ-6414]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A clean row closes with a `crit` badge and its thread waits in the stock, the threshold simulation reads a band, and a Volley pays 2 buttons

After this task, a `clean` outcome that brings the streak to 3 or to a multiple of 5 closes a clean row and shows `crit`, a thread granted on day 1 stays in her stock undrawn until guiding threads open, the threshold simulation passes when the finale's triumph variant plays in 40 % to 60 % of chapters, and a Volley pays the 2 buttons of the first attempts it replaces.

## Acceptance criteria

1. Given streaks of 2, 3, 4, 5 and 10 clean answers, when the outcome badge is read, then `crit` shows on the 3rd, 5th and 10th and `clean` on the others, `partial`, `soft` and `unknown` show as REQ-1760 lists, and the 3rd grants one guiding thread (REQ-1752, REQ-1754, REQ-1760). Closed by: a unit test of the outcome table.
2. Given a clean row on day 1, when the stock is read, then it holds the thread, and the task window draws the thread button with the current count only once guiding threads have opened (REQ-6250). Closed by: a ledger test and a component test on days 1 and 2.
3. Given mixed-knowledge profiles after a cold start, when the threshold simulation runs, then `success` holds in 55 % to 75 % of rooms, the cunning bypass in at most 25 % of floor-days, triumph in 15 % to 35 % of floor-days and the finale's triumph variant in 40 % to 60 % of chapters (REQ-1730, REQ-1732). Closed by: the simulation in ADR-0190's group 3 and its automatic test.
4. Given a Volley of 8 to 10 facts and a task that is a first attempt, when buttons are paid, then each first attempt gives 1 button whatever its outcome and a Volley gives 2 in all (REQ-6414). Closed by: an economy unit test over both.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply ADR-0360 entries 33, 34, 36 and 37 to the game rules module and the threshold simulation. The stock keeps a thread granted before threads open, and nothing is back-filled by any other source.

## Depends on

Nothing in this epic. The epic realising ADR-0140 supplies the outcome table, the economy and the simulation, the epic realising ADR-0330 the schedule that opens guiding threads, and the epic realising ADR-0290 the Volley; until they exist, the tests run on a fixture schedule with threads opening on day 2 and a fixture Volley of 8 facts, and the real ones are left to those epics.

## Evidence

Not yet.

## Left alone

The nearest goal's candidates, which TSK-1009 proves, and the Volley's contents, which TSK-1005 changes.
