---
id: TSK-0738
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-3020, REQ-3708]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A stage's acceptance task holds the verify report, the checklist result and the agent's two readings

After this task, `docs/reference/stage-acceptance.md` states what each stage's acceptance task holds, and at each stage's review the agent matches the nine open questions to the record and reads the canon against the specification, so a contradiction becomes a defect against the canon.

## Acceptance criteria

1. Given `docs/reference/stage-acceptance.md`, when a test reads it, then it names, for each of stages 0, 0.1, 0.15, 0.2 and 0.3 and for a backlog item, the verify report, the checklist result and the acceptance notes the stage's acceptance task holds, and for stage 0.2 the chosen heroine sheet's asset id, and for stage 0.3 the family's order of backlog items. Closed by: a unit test that lists the headings.
2. Given the nine open questions of RES-3000, when the agent starts work on a part a question affects, then it matches the question to a record that answers it or defers it, and the match is attached to the pull request (REQ-3020). Closed by: the agent's judgement, because only reading the record tells whether an answer applies to the part about to be built.
3. Given a passage of the canon that contradicts the specification on method, time, rewards or safety, when the agent reads the canon at a stage's review, then it writes a defect against the canon and the canon is corrected (REQ-3708). Closed by: the agent's judgement, because a contradiction is a matter of meaning that a search can't settle.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the reference page. It names each stage's acceptance task and says what its Evidence holds, in the place ADR-0190 gives to the review record. It lists the nine open questions with their status from ADR-0190's table: seven answered in RES-3000 and the two deferred to the stage 0.3 review, the pure-measurement mode and hints before an answer as a habit, with their interim flags, a fast-guess flag above 15 % and an assisted first-attempt share above 30 %. It states that a contradiction between the canon and the specification on method, time, rewards or safety is a `canon_contradiction` defect against the canon and never a change to the specification.

The two readings are done by the agent and aren't code, so the page states them. It gives each reading its input and its output, so the pull request can show them.

## Depends on

- TSK-0735 (blocking): the page names the acceptance tasks the stage function reads.

## Evidence

Not yet.

Criteria 2 and 3 rest on the agent's judgement, because REQ-3020 and REQ-3708 are marked as judgements for an agent: matching a question to a record and reading a passage for a contradiction are readings of meaning.

## Left alone

The canon's wording, which the canon's records own and which the agent corrects only after a defect is written, and the answers to the two deferred questions, which the stage 0.3 review gives.
