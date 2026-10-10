---
id: TSK-0812
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0240
closes: [REQ-5350, REQ-5352, REQ-5354]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Using the check doesn't make an attempt assisted, the checked answer isn't an attempt, and the first attempt after a check feeds "on her own" from the first day

After this task, a check leaves the attempt unassisted, the preliminary answer is logged only inside `self_check_used` and never as `attempt_submitted`, so the answer she sends with «Готово» after a check is her first attempt and a right one is `clean`, and that attempt feeds the "on her own" estimate from the first day.

## Acceptance criteria

1. Given an attempt after one or more checks, when it is read, then `assisted` is false and no rule of ADR-0080 or ADR-0140 reads the check (REQ-5350). Closed by: an integration test and a code search for a read of `self_check_used` in those rules.
2. Given a preliminary answer 167, a check and a final answer 167 sent with «Готово», when the log is read, then it holds one `self_check_used` with `preliminaryRaw` and one `attempt_submitted` for the final answer, and no attempt for 167 before it (REQ-5352). Closed by: an integration test.
3. Given a wrong preliminary answer corrected after a check to a right one, when the first attempt is judged, then it is `clean` under ADR-0080 and ADR-0140 as they stand (REQ-5352). Closed by: an integration test.
4. Given a first attempt made after a check, when the "on her own" estimate is computed on the first day of play, then it counts like any other first attempt of its subtype (REQ-5354). Closed by: a model test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Keep the check out of the `assisted` flag's inputs; the match compares two numbers already on her screen, so it gives her no information her own calculation doesn't, and a player who types 345 without adding gets a match that tells her nothing. Keep the preliminary answer out of the attempt rows. The check is a control on an existing task and not a new form, and its match leaks nothing, so ADR-0210's wait for a new stream doesn't apply: `forms` stays empty for an item that uses it.

Time spent correcting after a check stays in the answer time, which TSK-0809 reads.

## Depends on

- TSK-0811 (blocking): the route the first attempt follows.

## Evidence

Not yet.

## Left alone

The report's counting of saved and spoiled answers from the preliminary answer and the first attempt, which TSK-0815 holds.
