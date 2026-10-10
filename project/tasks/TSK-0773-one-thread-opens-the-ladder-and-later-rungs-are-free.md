---
id: TSK-0773
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5100, REQ-5102, REQ-5152, REQ-5154]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The first tap opens the ladder for 1 thread, each later rung is free, and the log tells a paid rung from a free one

After this task, the first tap on the thread button before an answer spends 1 guiding thread and shows rung 1, each later tap on the same attempt shows the next rung and spends nothing, the explanation still costs 1 thread, and the log records each rung as `thread` or `free_step` and each spend with its reason.

## Acceptance criteria

1. Given a task with a ladder of three rungs, when the player taps the thread button three times, then the log holds exactly one `thread_spent` with reason `hint_ladder` and three `hint_shown`, the first with `ladderOpenedBy: "thread"` and the others `free_step` (REQ-5100, REQ-5102, REQ-5152, REQ-5154). Closed by: a ledger test.
2. Given the same request sent twice with one `clientSeq` and again with a new `clientSeq` after a resume, when the log is read, then the count of `thread_spent` and `hint_shown` is unchanged, because the charge key is a ladder opening at most once for each item (REQ-5100). Closed by: the ledger test.
3. Given a stock of 0 threads with the pocket's thread used after the opening, when the ladder is open and a rung remains, then the thread button stays active and rungs 2 and 3 still show (REQ-5102). Closed by: the ledger test and a state-machine test.
4. Given a detailed explanation asked for after the answer, when it is opened, then it costs 1 thread whether or not the ladder was open, logged as `thread_spent` with reason `explanation`, and the short solution stays free (REQ-5070). Closed by: the ledger test.
5. Given the catalogue, when `hint_shown` and `thread_spent` are read, then their meanings are "a hint rung was shown, whether or not a thread paid for it" and "a thread was spent on opening a task's hint ladder or on an explanation" (REQ-5068, REQ-5070). Closed by: the catalogue test that compares the meaning text.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the hint route in `src/server/play.ts` so its charge is one a ladder and not one a rung. The first tap before an answer spends 1 thread under the pocket rule of ADR-0080, which pays from the pocket at a stock of 0, logs `thread_spent` with reason `hint_ladder` and `hint_shown` with `ladderOpenedBy: "thread"`. Each later tap on the same attempt logs `hint_shown` with `ladderOpenedBy: "free_step"` and spends nothing. A ladder the familiar opens free on a puzzle logs `free_step` on every rung; when that happens is RES-4070's decision, so the route takes it as an input.

The thread button keeps its label and count while the ladder is open, and the count stays the same on a free rung. I chose this in ADR-0220, because a second label for "free" is a string and a state the design doesn't draw, and the familiar's line already frames the rung. While the ladder is open the button stays active up to `hintMaxLevel` whatever the stock, because an inactive button would withhold a rung she paid for.

Change the charge key in SPC-0030 from "once for each item and hint level" to "a ladder opening at most once for each item". The error `409 no_threads` then covers a ladder opening or an explanation only.

## Depends on

- TSK-0772 (blocking): the new versions of `hint_shown` and `thread_spent` this task writes.

The epic realising ADR-0080 owns the attempt flow; this task changes the stand-in route of `src/server/play.ts` and leaves the price rule's other grants to it. The epic realising ADR-0210 addresses REQ-5068 and REQ-5070, whose behaviour criteria 1, 4 and 5 test; ADR-0220 doesn't address them, so this task's tests serve as their evidence and no task here closes them. ADR-0210 also asks the log to say each fact once, which this task meets by writing no second record of a rung.

## Evidence

Not yet.

## Left alone

When the thread button first appears, which is ADR-0080's later decision (REQ-6250), and the explanation's price, which ADR-0080 and ADR-0120 keep.
