---
id: TSK-0809
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0240
closes: [REQ-5334]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An item with an estimate counts for accuracy and no speed measure reads its time, and the check's time is taken off every other attempt

After this task, an attempt on an item with an estimate never counts as `fast`, never enters a block's median time and is never a rapid guess, while an attempt's answer time on any other item excludes `checkMs`, the time the check field was open.

## Acceptance criteria

1. Given an attempt on an item with an estimate, when the speed measures are computed, then it counts for accuracy and its time counts in no measure: it can't be `fast`, it enters no block median and ADR-0070 doesn't test it for a rapid guess or impulsiveness (REQ-5334). Closed by: a measure test.
2. Given an attempt with 20 s of `checkMs` whose time without the check is under the fluency threshold, when it is read, then it is `fast` (REQ-5334). Closed by: the measure test.
3. Given an attempt that spends 4 s correcting her answer after a check, when its time is read, then those seconds stay in, because they are calculation (REQ-5334). Closed by: the measure test.
4. Given a client that measures `checkMs`, when it sends `AnswerIn`, then `timings.checkMs` is the time the check field was open and the fluency and rapid-guess tests read the time from the task's appearance to «Готово» without pauses and without `checkMs` (REQ-5334). Closed by: an integration test with a fixture timing.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the third reason to ADR-0060's rule that already drops the time of `interrupted` and `crossDevice` attempts from every measure: the item carries an estimate. I took ADR-0240's choice to drop the whole time and not subtract the estimate step, because she may start calculating while she estimates, so subtracting would make her exact answer look faster than it was and she could fall under the minimum time and be marked a rapid guess. The estimate appears on about 15 % of eligible tasks, so the loss is small.

The check's time is subtracted, not dropped, because a player who checks every answer would otherwise lose all her fluency evidence. Change ADR-0070's definition of the measured time to exclude `checkMs`.

## Depends on

- TSK-0813 (blocking): `timings.checkMs` on `attempt_submitted` and the `estimate` field.

The epics realising ADR-0060 and ADR-0070 supply the measures; this task changes their time rule.

## Evidence

Not yet.

## Left alone

The estimate step's own time as evidence, which no measure reads, and the check's slow-habit reversal, which ADR-0240's fourth reversal condition watches.
