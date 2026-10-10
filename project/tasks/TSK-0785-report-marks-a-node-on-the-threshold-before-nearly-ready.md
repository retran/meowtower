---
id: TSK-0785
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5146, REQ-5148]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The report marks a node «на пороге» by an explicit rule, and shows it before «почти готово» when both hold

After this task, the report marks a node «на пороге» (on the threshold) when its state is «Пока не освоено» (not mastered yet) or «Уточняется» (being clarified), it has at least 3 assisted attempts in the last 14 days and at least 60 % of them were first attempts answered right with rung 1 as the deepest rung, and a node that meets both this rule and «почти готово» shows both, «на пороге» first.

## Acceptance criteria

1. Given a log with 3 rung 1 successes among 6 assisted attempts, when the report is built, then the node isn't marked «на пороге», and given 3 rung 1 first-attempt successes among 5 assisted attempts of which 2 are second attempts, then it is (REQ-5146). Closed by: a report test with both logs.
2. Given a log with 2 rung 1 first-attempt successes and 1 right second attempt with rung 1 among 3 assisted attempts, when the report is built, then the node isn't marked, because a second attempt counts in the denominator and never in the numerator (REQ-5146). Closed by: the report test.
3. Given a node whose state is «Не проверено», «Не проверялся, отрезан узлом X» or «Stretch: не проверялся», when it meets the counts, then it never gets the mark (REQ-5146). Closed by: the report test.
4. Given logs that meet «на пороге» alone, «почти готово» alone and both, when the Summary list and the node card are built, then the first shows one mark, the second the other, and the third both with «на пороге» first (REQ-5148). Closed by: the report test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the rule to the report's rule table of ADR-0180, reading the node's state and the counted attempts, because every label there comes from an explicit rule over counted attempts and never from a probability. Every assisted attempt counts in the denominator, first and second alike, so a node where she mostly needs rung 3 or a twin can't pass on its few rung 1 successes. I chose to keep a second attempt out of the numerator, which is my reading of REQ-5146 in ADR-0220: a twin follows a review, so its success says less about a nudge than a first attempt's does.

Show the mark in the Summary list and on the node card, before «почти готово», whose rule stays unchanged.

## Depends on

- TSK-0784 (blocking): the depth counts the rule reads from the model's attempts.

The epic realising ADR-0180 supplies the report, the Summary list and the node card; this task adds the rule and the label to them.

## Evidence

Not yet.

## Left alone

The wording of the mark's explanation text for the parent, which ADR-0160's strings and ADR-0180's screen spec hold.
