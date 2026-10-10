---
id: TSK-0632
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3630, REQ-3634]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A frame passes only when a checking model, solving blind, gets the engine's answer on three sets of numbers

After this task, `blindSolve` fills a frame with three sets of numbers, asks a checking model to solve each problem with nothing but its text, and passes the frame only when all three answers match the engine's.

## Acceptance criteria

1. Given a frame, when `blindSolve` runs, then the template's generator is called under three seeds, the name placeholders take fixed stand-in names, and three filled problems go to the checking model (REQ-3630). Closed by: a unit test that reads the three seeds and the three problems.
2. Given a checking model that returns the engine's answer for two sets and a different answer for the third, when the frame is checked, then it is rejected with the rule `blind_solve` and the set that differed; given all three match, then it passes; given a reply the engine's answer checker can't parse, then that set counts as a mismatch (REQ-3630). Closed by: a unit test with three stub models.
3. Given every blind-solve request, when a recording of the requests is searched, then each holds the problem text and the instruction to solve it and nothing else, so no engine answer and no list of candidate answers appears (REQ-3634). Closed by: a unit test that reads the recorded request bodies and fails on any other field.
4. Given an offline run and a live run, when the model is chosen, then the offline run asks `CHECK_MODEL` and the live run asks `LIVE_CHECK_MODEL`, and neither is the judge model that picks from a list (REQ-3634). Closed by: a unit test of the model choice.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write `src/frames/blind-solve.ts`. Compare with the engine's answer checker in free form, with the answer kind of the template, because the checking model states its answer in words and digits. A mismatch that is a formatting difference the checker accepts, such as `2,50` for 2,5, passes. The judge model isn't used here because it picks from a list and a list would show the checker the answer, as RES-1600 records.

## Depends on

- TSK-0628 (blocking): the three problems are filled with `fillFrame`.

The epic realising ADR-0040 supplies the generator and the answer checker; its fixture templates run this task until real templates exist. The epic realising ADR-0100 supplies the gateway and the model roles; tests pass a stub function.

## Evidence

Not yet.

## Left alone

The final solve with the task's own numbers, which TSK-0638 adds for live frames, and the three seeds' choice beyond "three distinct seeds of the template", because ADR-0040's seed streams decide it.
