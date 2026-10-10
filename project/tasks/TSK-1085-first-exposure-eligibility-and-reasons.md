---
id: TSK-1085
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0410
closes: [REQ-6946, REQ-6948, REQ-6950, REQ-6952]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A first encounter is eligible only when it measures transfer, and its reason names the first failing condition

After this task, each `firstExposure` row says whether it counts as a transfer observation and, when it doesn't, names the first failing condition from a fixed list of eleven reasons.

## Acceptance criteria

1. Given a fixture log with one case for each reason, when the projection runs, then each row's `reason` is the first failing condition in this order: `version_missing`, `no_attempt`, `side_slot`, `not_graded`, `excluded`, `rapid_guess`, `fatigue`, `lesson_mark`, then `no_prerequisites` or `prerequisites_not_fluent` for kind `subtype` and `node_not_fluent` for kind `format` or `context` (REQ-6946). Closed by: the projection test with eleven fixtures.
2. Given a show in a side slot, a show with a non-empty `forms` such as a Dutch probe letter's, or a show in the 21 game days after a lesson mark on its node, when the projection runs, then the row is ineligible and its pair is marked used (REQ-6946). Closed by: the projection test.
3. Given a subtype whose node has no prerequisite, such as a Sources track node, then the far encounter is `no_prerequisites`; given a prerequisite that is only inferred fluent, then it is `prerequisites_not_fluent`; given every prerequisite fluent by a probe or a full block, then it is eligible (REQ-6948). Closed by: the projection test.
4. Given a format or context encounter on a node not fluent by a tested result, then `node_not_fluent`; given the node fluent by a probe or a full block, then eligible (REQ-6950). Closed by: the projection test.
5. Given a walkthrough shown to her before the encounter, when the row is built, then the walkthrough doesn't make it ineligible (REQ-6952). Closed by: the projection test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Fill `eligible` and `reason` of each row by the ordered conditions of ADR-0410. `version_missing` comes first, as ADR-0460 settles, because conditions 8 and 9 can't be read without the model file; a show with no active model version holds `expected: null` with condition 8 or 9 as its reason, because with no model no node is fluent by a tested result. The parent's exclusion through `item_excluded` makes the attempt ineligible with the reason `excluded`, a choice ADR-0410 made because ADR-0180 drops an excluded attempt from every measure. The 21 game days of `lesson_mark` match addendum 2's rule for retention. A rapid guess reads `rapidGuess: true` on the verdict, and the fatigue weight reads ADR-0070's fatigue weight.

## Depends on

- TSK-1084 (blocking): it fills the `eligible` and `reason` fields of that task's rows.

The epic realising ADR-0060 supplies the tested states and the epic realising ADR-0180 the lesson marks and exclusions; the task runs on fixtures of both.

## Evidence

Not yet.

## Left alone

How `expected` is computed under a version, which TSK-1086 sets, and what the report does with ineligible rows, which TSK-1089 sets.
