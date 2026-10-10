---
id: TSK-0491
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0040
closes: [REQ-1224]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parallel task keeps the difficulty and changes the numbers and the answer

After this task, `sampleParallel(p, rng)` builds the second attempt's task from the stream `hash(baseSeed, "parallel")`, keeps `difficulty(p)` equal and accepts a candidate only when its set of given numbers and its correct answer both differ from the original's, and returns `twin_unavailable` after 1,000 candidates.

## Acceptance criteria

1. Given 1,000 seeds of a fixture template, when a parallel task is built, then its difficulty equals the original's and both its set of given numbers and its correct answer differ (REQ-1224). Closed by: a property test.
2. Given a template with one parameter set only, when a parallel task is asked for, then the result is `twin_unavailable` after 1,000 candidates and the attempt flow of ADR-0080 skips the second attempt. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `sampleParallel` to `src/engine/tasks/` and use it from the second-attempt route in place of the stand-in task's fixed twin.

## Depends on

- TSK-0481 (blocking): it reuses the generator's candidate loop and seed streams.

## Evidence

Not yet.

## Left alone

When the second attempt is offered and what it is worth, which ADR-0080 owns.
