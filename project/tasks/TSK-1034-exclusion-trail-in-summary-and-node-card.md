---
id: TSK-1034
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6610, REQ-6612]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The summary counts excluded attempts as right and wrong, and each node card strikes them through

After this task, the full report's summary shows how many attempts the parent excluded with how many were right and how many wrong, and each node card lists the excluded attempts struck through with their source, so a one-sided exclusion is visible.

## Acceptance criteria

1. Given a log with 6 excluded attempts, 4 right and 2 wrong, when the summary is built, then it shows "6, 4 right, 2 wrong" in its Russian wording (REQ-6610). Closed by: a report test.
2. Given the same log, when each node card is opened, then the 6 attempts are listed struck through on their cards with their source, the Parent Room or the sandbox, and the list pages at 50 rows (REQ-6612). Closed by: a report test and a Playwright test.
3. Given a sandbox exclusion by template version and parameter hash that removes 3 of her attempts on that task, when the projection runs, then each of the 3 counts in the split (REQ-6610). Closed by: a projection test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the projection `excluded_attempts`, which joins every `item_excluded` event, version 2 with its `source`, to the attempts it removed. Exclusion is the one path by which an approved rule removes evidence, and the split shows a one-sided exclusion without taking away the parent's right to exclude an ambiguous task. The count and the list apply after the MVP, and report v1 stays as approved.

## Depends on

Nothing in this epic.

The epic realising ADR-0340 supplies `item_excluded` version 2 and the sandbox's exclusion; the epic realising ADR-0180 supplies the summary and the node card. Fixture events stand in until they exist.

## Evidence

Not yet.

## Left alone

The reversal condition on a month's exclusions, which needs a month of play.
