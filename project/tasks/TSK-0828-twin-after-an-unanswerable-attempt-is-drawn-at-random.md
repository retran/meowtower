---
id: TSK-0828
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0250
closes: [REQ-5166]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The twin after an unanswerable first attempt is unanswerable or ordinary with equal odds

After this task, `sampleParallel` draws the twin of an unanswerable first attempt from `hash(baseSeed, "parallel")`: an unanswerable problem of the same template with probability 0.5, and otherwise an ordinary problem of the same node, structure and answer form, so she can't tell the twin's kind from the first attempt's.

## Acceptance criteria

1. Given 1,000 unanswerable first attempts, when each twin is drawn, then each kind of twin is between 40 % and 60 % of the draws. Closed by: the twin test's report.
2. Given a solvable first attempt, when its twin is drawn, then the twin keeps the template and is always solvable. Closed by: a unit test over 1,000 seeds.
3. Given neither kind of twin can be built, when the draw runs, then the state is ADR-0080's `twin_unavailable`, unchanged. Closed by: a unit test with a template that offers neither.
4. Given the twin of an unanswerable attempt, when it is answered, then the answer writes nothing to the `missing` stream or to "on her own" (REQ-0922). Closed by: a projection test over a replayed log.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change `sampleParallel` as ADR-0250 amends ADR-0040, using the stream named `parallel` and the probability 0.5. I chose 0.5 as ADR-0250 does, because at 0.5 she can do no better than chance on the twin's kind.

## Depends on

- TSK-0823 (blocking): the twin of an unanswerable problem is built from the same template's withholding step.

The epic realising ADR-0080 supplies the attempt flow and `twin_unavailable`; this task changes only the twin's kind.

## Evidence

Not yet.

## Left alone

The twin after rung 2 or 3 of the hint ladder, which ADR-0220's epic owns.
