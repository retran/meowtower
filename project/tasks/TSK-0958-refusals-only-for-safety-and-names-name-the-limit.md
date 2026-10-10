---
id: TSK-0958
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6278, REQ-6279, REQ-6280, REQ-6282]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Master refuses a story action only for safety, keeps the trial with a "yes, and", and a refused name says which limit it broke

After this task, a reply that refuses her action without a safety reason fails the judge's checklist and takes the retry, a trial's lead-in order carries `trialFixed: true`, and the line for a refused name names the limit and leaves her text in the field.

## Acceptance criteria

1. Given a Master reply that blocks her action with no safety reason, when the judge answers the checklist item "refuses or blocks her action without a safety reason", then the reply fails and takes the retry, and a reply that refuses on the safety path passes (REQ-6278). Closed by: a checklist test with a stub judge on both replies.
2. Given a lead-in order, when it is built, then it carries `trialFixed: true` and the prompt asks for a "yes, and" redirection when her action would cancel the trial; and no effect in the Director's closed set touches a trial (REQ-6280). Closed by: an order test and a schema test.
3. Given the sample scenes of a week, when the parent reads them, then each refusal is for safety, each carries a turn in the story in the same reply, and each action that would cancel a trial is answered with a redirection that keeps it (REQ-6278, REQ-6279, REQ-6280). Closed by: judgement, the parent's at the stage 0.3 acceptance, because whether a reply gives her a way on is a reading.
4. Given a name that is too long and a name with a word the Tower doesn't take, when the game refuses each, then its line names the limit broken, length or word, without a number, her text stays in the field beside the suggestions, and no digit appears in the line (REQ-6282). Closed by: a component test and a string check for digits.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the checklist item to the judge's list and the canon's «Да, и…» (Yes, and…) rule to the prompt. The reply schema has no refusal field of its own, because a refusal is prose and the checklist item and the parent's reading are what hold it. Replace «Система не смогла принять это имя» with a line from the string file that names the limit; a System line carries no digits, so the limit is named without its number.

## Depends on

Nothing in this epic. The epic realising ADR-0110 supplies the safety path, the judge's checklist, `name_suggest` and the retry; the epic realising ADR-0160 supplies the string file. Until they exist the task runs on a stub judge and the fixture string file.

## Evidence

Not yet.

## Left alone

The refusal lines' wording, which is the owner's content and the parent's judgement, and the safety pipeline itself, which ADR-0110 owns.
