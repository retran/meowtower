---
id: TSK-0780
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5118]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A structural check and a seeded check fail a template whose rung 1 or 2 states the answer

After this task, the build fails a template whose rung names the answer node's value, and a check that renders every template over 1,000 seeds fails a rung 1 or 2 whose text holds the answer as a number, unless that number is one of the task's givens.

## Acceptance criteria

1. Given a fixture template whose rung 2 names the answer node's placeholder, when the structural check runs, then it fails and names the template and the rung (REQ-5118). Closed by: the structural check's test.
2. Given a fixture template whose rung 1 renders the answer as a number on some seeds, when the seeded check runs over 1,000 seeds, then it fails and names the seed (REQ-5118). Closed by: the seeded check's test.
3. Given a template where the answer equals a given, such as "3 boxes" when the answer is 3, when the seeded check runs, then it passes (REQ-5118). Closed by: the seeded check's test with a fixture.
4. Given every template in `src/templates/`, when both checks run, then they pass and the ladder-length check of verify group 2 passes (REQ-5118). Closed by: the verify group 2 report.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the structural check: it reads each rung's placeholders and fails a template whose rung names the answer node's value, and no rung on any ladder refers to the graph's answer node. Add the seeded check: it renders every template over 1,000 seeds and searches rungs 1 and 2 for the answer. The structural check is first because placeholders show which node a rung names on every seed, where a string search catches only what it samples; the string search stays because REQ-5118 names it.

Both join verify group 2 beside the ladder-length check.

## Depends on

- TSK-0777 (blocking): the rungs the checks read.

## Evidence

Not yet.

## Left alone

The wording of the rungs, which the template authors write, and the parent's reading of each rung, which TSK-0777 holds.
