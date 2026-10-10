---
id: TSK-0552
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0080
closes: [REQ-0420, REQ-0422, REQ-0424]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The second attempt runs on a parallel task, is logged as assisted, and earns base experience and no bonus

After this task, a first attempt that brings a twin gets one second attempt on a task built by `sampleParallel` with the same template, subtype and difficulty features and new numbers, the log marks it `attempt: 2` with `assisted: true` and a link to the original, and a right answer shows «Нить закреплена» and earns base experience with no bonus.

## Acceptance criteria

1. Given a first attempt that brings a twin, when the second attempt is asked for, then the task is built from the same template and subtype with the same difficulty features and different numbers, over 1,000 seeds for each template. Closed by: a template test.
2. Given a second attempt, when its events are read, then `attempt_submitted` carries `attempt: 2`, `assisted: true` and the link to the original task (REQ-0420). Closed by: an integration test.
3. Given a right second answer, when the review shows, then the line «Нить закреплена» is on the screen (REQ-0422). Closed by: a Playwright test on the tablet viewport.
4. Given a right second answer, when the reward is computed, then the event holds base experience and no bonus (REQ-0424). Closed by: an integration test that reads the reward event; the amount is ADR-0140's.
5. Given a wrong second answer or «Не знаю», when the review shows, then the parallel task's short solution is at once on the screen, the flow ends and no third attempt is offered. Closed by: a state-machine test.
6. Given the generator can't build a twin within its retry limit, when the second attempt is asked for, then the server logs `twin_unavailable`, closes the review as it does when no twin is due, and the player sees no error. Closed by: an integration test with a generator that always fails.
7. Given a second-attempt request repeated under a new `clientSeq` after a resume, when it arrives, then the same parallel task returns and nothing is charged twice. Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Replace the stand-in twin of `src/server/standin.ts` in the second-attempt route with `sampleParallel(p, rng)` from the epic realising ADR-0040, and route its states through TSK-0548's flow. The first attempt's outcome, streak and rewards come from the first attempt alone, so the second attempt changes none of them.

The twin's trigger and the missing-number twin's draw (REQ-5130 to REQ-5134, REQ-5166) are ADR-0220's and ADR-0250's, and no twin for a Dutch probe letter is ADR-0430's.

## Depends on

- TSK-0548 (blocking): the flow states `twin_open` and `twin_review`.
- The epic realising ADR-0040 supplies `sampleParallel`; its fixture templates serve until real ones exist.

## Evidence

Not yet.

## Left alone

The experience amount and the streak, which ADR-0140's epic decides, and the explanation after the second attempt, which TSK-0556 prices.
