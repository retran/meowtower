---
id: TSK-0821
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0250
closes: [REQ-5416, REQ-5418, REQ-5420, REQ-5422, REQ-5426, REQ-5428]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The checker accepts «Нельзя узнать» with or without a chosen option and records three verdicts apart from «Не знаю»

After this task, `AnswerIn` carries `insufficient: { missing: 0 | 1 | 2 | 3 | null } | null`, the checker returns `insufficient_correct`, `insufficient_partial` or `false_insufficient` as ADR-0250's table sets, and the log keeps each of them apart from `dont_know`.

## Acceptance criteria

1. Given an unanswerable problem, when the answer is «Нельзя узнать» with the withheld given chosen, then the verdict is `insufficient_correct` with credit 1 and outcome `clean`; with another option or none chosen, then it is `insufficient_partial` with credit 0.5 and outcome `partial` (REQ-5416, REQ-5418, REQ-5420). Closed by: one fixture each in the checker's acceptance test.
2. Given a solvable word problem, when the answer is «Нельзя узнать» with any option, then the verdict is `false_insufficient` with credit 0, outcome `alt` and badge `soft` (REQ-5422). Closed by: a fixture in the checker's acceptance test.
3. Given an unanswerable problem, when the answer is a number, then the class is `answered_insufficient` with credit 0 and outcome `alt`; when it is «Не знаю», then the verdict is `dont_know` (REQ-5428). Closed by: one fixture each.
4. Given a request with `insufficient` set, when `dontKnow` is true or `raw` isn't empty, or the item's `InputSpec` lacks `allowInsufficient`, then the server replies 422 with `answer_kind_refused` and writes no event. Closed by: a route test with three requests.
5. Given a played log with answers of each kind, when the log is read, then `insufficient_correct`, `insufficient_partial`, `false_insufficient` and `dont_know` are four distinct verdict values, and entered step values are logged but change no verdict (REQ-5426). Closed by: an integration test that reads the verdict events.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Extend `AnswerIn` and the checker in `src/shared/` as ADR-0250 amends ADR-0040 and ADR-0030, add the three verdicts and the class `answered_insufficient` to `verdict` as optional fields of ADR-0210's `v: 2` payload, and add `insufficient` to `attempt_submitted`. The checker reads the item's kind from its `forms` and from data the item carries, so it needs no graph query and tests run on fixture items.

The checker doesn't use the withheld given's identity until it compares the chosen option's position with the position the server holds for it.

## Depends on

- TSK-0820 (not blocking): the subtype names appear in the fixtures' item data; fixtures can use the names before the graph file holds them.

The epic realising ADR-0040 supplies the checker module and the verdict type this task extends, and the epic realising ADR-0030 supplies `AnswerIn`'s route. This task adds the new answer kind to both; it leaves their other kinds to those epics.

## Evidence

Not yet.

## Left alone

The class `used_extra_data` and its place in the order of classes, which TSK-0822 adds; the controls that send the answer, which TSK-0825 builds; and the knowledge model's scores for the three verdicts, which TSK-0829 sets.
