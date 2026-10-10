---
id: TSK-0949
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6243, REQ-6245, REQ-6248, REQ-6250]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every attempt is unassisted until guiding threads open on day 2

After this task, before guiding threads open the task window draws no thread button and offers no hint, detailed explanation or backpack pocket but still shows the free short solution, Session 0 trains no thread, and on the day threads open the morning grant of 3 arrives with the unlock.

## Acceptance criteria

1. Given day 1 of play, when she answers a task with `partial` or `alt`, then the packet holds no thread count, hint route, detailed explanation or backpack pocket, and the free short solution shows (REQ-6245). Closed by: a packet test and a component test on day 1.
2. Given the log of days 1 and 2, when it is read, then no `thread_granted` precedes the `system_unlocked` for guiding threads except a clean row's thread, which sits undrawn in her stock; the unlock on day 2 comes with 3 threads at the start of the adventure even when the day's first contact came earlier, and nothing is back-filled for day 1 (REQ-6248). Closed by: a ledger test over a synthetic two-day log.
3. Given guiding threads are open, when the task window draws, then «Путеводная нить · N» (Guiding thread · N) shows with her current count, including 0 (REQ-6250). Closed by: a component test for counts 0, 3 and 7.
4. Given Session 0, when its training step runs, then it trains the answer field and «Не знаю» (I don't know) on trivial numbers and offers no thread, hint or explanation (REQ-6243). Closed by: a Playwright run through Session 0 that finds none of the three.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Read `systems_open` in the task window's packet builder and in the thread ledger. Until the unlock, the packet carries no thread fields, the explanation offer and the backpack pocket are absent, and the free short solution after `partial` and `alt` stays. Move ADR-0080's morning grant to the start of the adventure of the day threads open.

Choice I made: a thread granted by a clean row before day 2 counts into her stock and stays undrawn, which is the rule SPC-0330 states after ADR-0360 entry 33; ADR-0330's own text says no source grants one, and the specification holds because a clean row can't be undone and the thread arrives as no pile.

## Depends on

- TSK-0948 (blocking): it supplies `systems_open`, which the packet builder and the ledger read.

The epic realising ADR-0080 supplies the attempt flow, the ledger and the hint ladder; until it exists the task runs on the stand-in task window of the play routes, and it leaves the ladder's own rules to that epic.

## Evidence

Not yet.

## Left alone

How a thread opens the hint ladder once threads have opened, which ADR-0220 owns.
