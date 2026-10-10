---
id: TSK-0827
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0250
closes: [REQ-5438]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A refusal guard reads 20 solvable first attempts, halves the unanswerable share once and clears itself

After this task, the server writes `refusal_guard_changed` with `state: "raised"` when 3 or more of the last 20 first attempts on solvable T1 to T4 problems are `false_insufficient`, the Director halves `p` to 0.025 without compounding, and a clear needs 2 or fewer presses in the 20 attempts after the raise.

## Acceptance criteria

1. Given replayed logs, when the guard reads them, then 2 presses in 20 never raise it, 3 do, and 19 solvable attempts never do. Closed by: the guard test's report.
2. Given a raised guard, when a window of 3 or more presses follows, then no event is written and the share stays at 0.025; when the 20 attempts after the raise hold 2 or fewer presses, then `state: "cleared"` is written and `p` returns to 0.05. Closed by: the guard test's report.
3. Given a log, when the events are listed, then `raised` and `cleared` alternate, no raise follows a raise, and each event holds the 20 item ids of its window, `count` and `share`. Closed by: a schema test and an alternation check over 10 replayed logs.
4. Given a second attempt or a task the parent excluded, when the window is built, then it counts neither, and an assisted first attempt does count. Closed by: a unit test.
5. Given a simulation of 2,000 slots with the guard raised, when it runs, then unanswerable is 1.5 % to 3.5 % of T1 to T4 slots. Closed by: the simulation's report.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the guard as a projection over `verdict` events with a window of 20 and a threshold of 3, both read from `content/thresholds.json`, and the event type `refusal_guard_changed` that this decision owns, with the payload ADR-0250 defines. Add `refusal_guard_changed` to the catalogue of ADR-0020. The Director reads the guard's state when it computes `p`.

I chose to write nothing when a new window of 3 or more presses follows a raise, as ADR-0250 says, so the parent sees no second observation for a pattern already shown.

## Depends on

- TSK-0821 (blocking): the guard counts `false_insufficient` verdicts.
- TSK-0826 (blocking): the Director's draw reads `p`, which this task halves.

The epic realising ADR-0020 supplies the event catalogue and the projection registry.

## Evidence

Not yet.

## Left alone

The report's observation «склонна отказываться от задачи», which TSK-0831 shows.
