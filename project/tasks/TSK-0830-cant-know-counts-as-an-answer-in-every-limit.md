---
id: TSK-0830
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0250
closes: [REQ-5458, REQ-5460]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# «Нельзя узнать» breaks a run of «Не знаю» and adds nothing to the help limit or the help share

After this task, three «Не знаю» with a «Нельзя узнать» between them log no avoidance signal and offer no rest stop, and the help limit, the help share and the holding-steps limit count the new answer as an ordinary committed answer.

## Acceptance criteria

1. Given «Не знаю», «Нельзя узнать», «Не знаю», «Не знаю», when the avoidance projection runs, then the run length is 2 and no avoidance signal is logged; given three «Не знаю» in a row with no other answer between, then the signal is logged and the rest stop is offered (REQ-5458). Closed by: a projection test with both sequences.
2. Given a log with 10 first attempts, 3 of them «Нельзя узнать», when the help limit and the help share are computed, then both count the «Не знаю» and the hints only (REQ-5460). Closed by: a projection test.
3. Given an unanswerable problem answered by any means, when the holding-steps limit is computed, then it counts nothing for that problem, and a surplus problem counts as ADR-0250 says. Closed by: a projection test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the three projections in the epics' modules so each reads the verdict and not the `dontKnow` flag alone: `dont_know` counts, `insufficient_correct`, `insufficient_partial` and `false_insufficient` don't. ADR-0250 chose that the new answer ends a run like any other answer, because it is a committed answer she must confirm.

## Depends on

- TSK-0821 (blocking): the verdicts come from that task's checker.

The epics realising ADR-0180 and ADR-0090 supply the avoidance run, the help limit and the rest stop offer; this task changes only the counting rule.

## Evidence

Not yet.

## Left alone

The report's counts, which TSK-0831 shows, and the refusal guard's own count of presses, which TSK-0827 builds.
