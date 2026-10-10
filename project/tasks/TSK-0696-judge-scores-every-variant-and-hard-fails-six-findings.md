---
id: TSK-0696
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-2820, REQ-2822, REQ-2834, REQ-3412, REQ-3420, REQ-1510]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The judge scores every variant from 1 to 10 and rejects six findings whatever the score

After this task, every variant that passes both program checks is scored from 1 to 10 by `ART_JUDGE_MODEL` against the art checklist, a variant below 7 is never offered or used and is regenerated, and six findings reject a variant at any score.

## Acceptance criteria

1. Given a judge verdict of "maid uniform" at score 9, when the queue reads it, then the variant is rejected and its slot regenerates; the same holds for adult presentation, a suggestive pose and an adult body (REQ-2834). Closed by: four unit tests with a stub judge.
2. Given a verdict that finds text in any language or a watermark, then the variant is rejected at any score (REQ-3412); given a verdict that finds a grey mouse in a heroine picture, then it is rejected, and the same finding on a picture of another kind doesn't reject it (REQ-3420). Closed by: three unit tests.
3. Given a variant a program check rejected, when the judge step runs, then the judge isn't called and the variant's score is 1; given any other variant, then it has a score from 1 to 10 on its row, and a judge answer outside that range counts as a transient error (REQ-2820). Closed by: a unit test over the three cases.
4. Given scores 6 and 7, when the queue decides, then the variant scored 6 is never offered for choice or used as a draft and its slot regenerates while generations remain, and the one scored 7 passes (REQ-2822). Closed by: an integration test with the stub.
5. Given the request the judge receives, when it is read, then it holds the card, the references, the checklist of the match to the card, the style against the references, the same character, the count of fingers and eyes, no text or watermark, no likeness to a known character, a flat background and fitness for a child, and the verdict names the likeness finding (REQ-1510). Closed by: a unit test that reads the recorded request.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the judge call through ADR-0100's gateway on the offline key and the content tier, with `ART_JUDGE_MODEL`, which is `google/gemini-3.8-flash` by RES-2800. The judge sees the variant, its card and its references, never free text. The six findings that reject at any score are adult presentation, a maid uniform, a suggestive pose, an adult body, any text in any language and, for a heroine picture, a grey mouse. A variant passes when both program checks pass, no finding is present and the score is 7 or more.

A judge shares the generator's blind spots, which is why the person's choice in TSK-0701 stays the last guard. This task makes no claim that a passing variant is safe.

## Depends on

- TSK-0693 (blocking): the score and the findings go on the variant's row, and the queue's regeneration reads them.
- TSK-0695 (blocking): a variant that fails a program check gets the score 1 and never reaches the judge.

## Evidence

Not yet.

## Left alone

The person's choice, which TSK-0701 builds, and the prompt blocks, which TSK-0697 sends. The picture's meaning for REQ-1510 and REQ-3412 rests on the person at the choice screen as well.
