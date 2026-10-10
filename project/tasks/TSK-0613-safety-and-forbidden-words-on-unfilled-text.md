---
id: TSK-0613
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0120
closes: [REQ-0618, REQ-0620, REQ-0638]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The forbidden-word and safety checks read the explanation with its placeholders unfilled and without her answer

After this task, an explanation holding any form of a forbidden word is rejected by lemma, the safety check runs on the text with its placeholders unfilled, and no request to a judge or the safety model holds a digit, a number word or her answer.

## Acceptance criteria

1. Given a reply holding a shame word, a praise of intelligence or a school word of the voice guideline in any grammatical form, when the check runs, then it is rejected (REQ-0620). Closed by: a unit test with one form of each class.
2. Given a reply the safety check marks unsafe, when it runs, then the reply is rejected (REQ-0618). Closed by: a unit test with a mocked judge.
3. Given every request to the judge and to `SAFETY_MODEL` over a simulated set of explanations, when the bodies are read, then none holds a digit, a number word or the value of her answer, and `{given}` stands unfilled (REQ-0638). Closed by: a test over the recorded requests.
4. Given the judge that errs or times out, when the check runs, then the same question goes to `SAFETY_MODEL` with the same unfilled text, with the route ADR-0350 amends. Closed by: a unit test with a mocked judge that times out.
5. Given `{given}` after `dont_know` or `insufficient`, when the text is built, then `{given}` is empty, as ADR-0370 states. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add checks 5 and 6 to the module of TSK-0612: the forbidden-list lemma check and the safety question, a yes-or-no question typed as a `JudgeRequest`. The safety check runs before the fill, because REQ-0638 forbids it to see numbers or her answer.

## Depends on

- TSK-0612 (blocking): both checks are steps of that module.

The epic realising ADR-0160 owns the forbidden list and its lemma checker; until it exists the check reads a fixture list. The epic realising ADR-0100 supplies the judge route and its fall back to `SAFETY_MODEL`.

## Evidence

Not yet.

## Left alone

The list's words, which ADR-0160 owns.
