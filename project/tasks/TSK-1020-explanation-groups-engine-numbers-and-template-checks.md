---
id: TSK-1020
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-0604, REQ-0616, REQ-0618, REQ-6500, REQ-6502]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Explanations are grouped by the kind of answer, hold only engine numbers, and are checked offline per template

After this task, the explanation group key includes the kind of answer, at most 3 model-written texts can be shown for a group, every number in an explanation is one the engine computed or the answer she entered, and verify fails a template whose explanation fails the blind solve or the safety check.

## Acceptance criteria

1. Given an answer `correct`, `partial`, `wrong`, `dont_know` or `insufficient`, when the group key is built, then it holds the kind, `{given}` is empty after `dont_know` and `insufficient`, and the build check fails a variant for those two kinds that uses `{given}` (REQ-0604). Closed by: a group key test and the check's fixture; the parent judges a sample of explanations for fit with the answer at the acceptance of the stage that shows them, because "addresses the answer" is a reading.
2. Given a group with 3 texts that can be shown, when a fourth is produced, then it isn't shown; given the parent hides one of the three, then the fourth is shown (REQ-6502). Closed by: an explanation cache test.
3. Given an explanation text in which the model wrote a number in place of a placeholder, when the text is checked, then it fails, and a text that shows her own entered answer passes (REQ-6500). Closed by: a check test with two fixtures.
4. Given a template whose explanation fails the blind solve, and another whose short solution fails the safety check, when `verify` runs with the templates' sample seeds, then each fails with `explanation_template_rejected` (REQ-0616, REQ-0618). Closed by: verify's output on the two fixtures.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the group key in the explanation cache (`tests/integration/explain-cache.test.ts` shows its present form) and ADR-0120's check 1. A variant then reaches only the kind of answer it was written for. Both texts are fixed at build time, so one offline check covers every showing without a model call in play. REQ-6500 replaces REQ-0608, REQ-6502 replaces REQ-0626, so build to the new texts: held literally, REQ-0626 would freeze a group after its third text, so a better prompt or a text the parent hid could never be replaced.

## Depends on

Nothing in this epic.

The epic realising ADR-0120 supplies the explanation roles and the blind solve; recorded replies stand in for the model until the check runs live.

## Evidence

Not yet.

## Left alone

The explanation prompts themselves, which ADR-0120 and the content step own.
