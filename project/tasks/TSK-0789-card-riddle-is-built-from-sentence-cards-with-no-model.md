---
id: TSK-0789
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0230
closes: [REQ-5292]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A card riddle has her build the problem from sentence cards the engine made, and the engine judges it with no model

After this task, a card riddle for a target shows sentence cards, each with a role the engine gave it, plus two distractors and a strip to order them in, and her ordered cards form a graph that `judgeCompose` judges, with no model call and nothing leaving the Mac.

## Acceptance criteria

1. Given a target and its template's card frames, when the card set is built, then it holds the cards for the target's numbers and relations plus 2 distractors, one with the other relation and one asking a different unknown, and each card carries its role (REQ-5292). Closed by: a unit test over fixture templates.
2. Given each verdict, when a card order is submitted, then the graph her cards form is judged by `judgeCompose` and the riddle reaches review with that verdict, with no paraphrase (REQ-5292). Closed by: an integration test over each verdict.
3. Given a full play of a card riddle, when the gateway and egress logs are read, then they hold no model call and no request (REQ-5292). Closed by: the same integration test, reading both logs.
4. Given a template with no card frames, when the content test runs, then the build fails, and the Director skips that template for riddles (REQ-5292). Closed by: the content test with a fixture template.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the card builder to `src/shared/compose.ts`: for a word-problem template, it builds the cards from the template's card frames and the target's numbers, with each card's role set by the engine, so nothing can be misread. I chose 2 distractors, one with the other relation («на» for «в», or by for times) and one question for a different unknown, as ADR-0230 does, to keep the hint they give small. The card form's known weakness is that distractors can hint at the structure.

Add the card frames per word-problem template to the frame files and a content test that fails a template with none. The cards' texts are the content author's; this task builds the builder and a fixture set.

## Depends on

- TSK-0788 (blocking): the verdicts the cards' graph is judged by.

The epic realising ADR-0130 supplies the frame files and their checks; this task adds card frames to the files as they stand.

## Evidence

Not yet.

## Left alone

The text form and its parse, which TSK-0793 and TSK-0795 hold, and the screen's look, which ADR-0150 owns.
