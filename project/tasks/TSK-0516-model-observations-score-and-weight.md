---
id: TSK-0516
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0060
closes: [REQ-0914, REQ-0916, REQ-0918, REQ-0930]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The model reads only graded unassisted first attempts as observations, each with a score and a weight

After this task, a pure function in `src/engine/model/` turns the event log into the list of observations every estimate and state reads, so no later task re-decides which attempt counts, how much it scores or what the parent's exclusion drops.

## Acceptance criteria

1. Given a log with a graded unassisted first attempt, a second attempt, a first attempt on which a hint rung was bought, a warm-up, a Session 0 task and an `attempt_late` event, when the observations are read, then only the first attempt is an observation of the "on her own" estimate, and the second attempt and the assisted attempt are listed apart for the "with help" estimate (REQ-0914). Closed by: a unit test over a hand-written log.
2. Given a task the parent excluded with `item_excluded` and a second one excluded and then re-included, when the log is read, then the first is in no observation list, no probe and no block, and the second is in them (REQ-0916). Closed by: a unit test.
3. Given verdicts right, partially right, wrong and «Не знаю», when each becomes an observation, then the scores are 1, 0,5, 0 and 0 and the weight is 1; given an attempt that carries ADR-0070's fatigue mark, then its weight is 0,5 (REQ-0918). Closed by: a unit test.
4. Given an attempt that carries ADR-0070's `rapidGuess` mark, when the observations are read, then it is in none of them; given an attempt flagged `interrupted` or `crossDevice`, then it is an observation for accuracy and its time counts in no measure. Closed by: a unit test.
5. Given an attempt on a control fact, when the observations are read, then it is an observation of its own node and subtype (REQ-0930). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/model/observations.ts`: one function from the event log, in order, to the observations, each with its node, subtype, score `c`, weight `w`, time, the flag that its time counts in no measure, and whether it is a control fact. It does no input or output, so one log always gives the same list.

The estimate takes only graded first attempts with no help before the answer. A partial answer counts as half right and half wrong through its score of 0,5. `item_excluded` and its reversal take effect at the next recompute, which is the one the parent's action triggers. The model drops an attempt from every estimate, state, probe and block for each reason ADR-0060 lists, apart from the forms outside `admittedForms` and the riddles, which belong to ADR-0210 and ADR-0230.

Until the epic realising ADR-0070 writes the `rapidGuess` mark and the fatigue weight, a fixture log carries both fields by hand and an attempt without them is an ordinary one.

## Depends on

Nothing. The event schemas for attempts, verdicts, exclusions and settings exist from the epic realising ADR-0020.

## Evidence

Not yet.

## Left alone

The estimate that reads these observations, which TSK-0517 builds, and what marks an attempt as a rapid guess or as after a fatigue signal, which the epic realising ADR-0070 decides.
