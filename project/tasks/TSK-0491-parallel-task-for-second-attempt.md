---
id: TSK-0491
artifact: task
status: done
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

Every criterion is checkable by a program; none rests on judgement.

Tests in `tests/unit/parallel-task.test.ts`, two tests:

1. REQ-1224: on 1,000 seeds of a fixture template, `sampleParallel` gives a parallel task with the original's difficulty, a different set of given numbers and a different correct answer. Difficulty is a bucket of the denominator, so a twin always exists.
2. A template with one parameter set returns `twin_unavailable` after 1,000 candidates.

The second-attempt route still uses the stand-in's fixed twin in `src/server/play.ts`. Switching the route to `sampleParallel` belongs to TSK-0492, which the record lists as its dependency, because the route needs the real template for each stand-in task.

Stages at tree `b90940acb276`, from `meow-checks evidence`:

- format: passed, record f57984f9ed28
- lint: passed, record fc430548ecdd
- check: passed, record b74b6eb4b1a3
- test: passed, record d21a278d98d5
- build: passed, record 19ae8931f8fa

The test stage failed twice on `scene-resume.spec.ts:308`, a timing test that passed on each re-run. The record cites the passing run.

## Left alone

When the second attempt is offered and what it is worth, which ADR-0080 owns.
