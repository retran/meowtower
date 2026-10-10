---
id: TSK-1130
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0440
closes: [REQ-7234, REQ-7236]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A construction template declares its construction and a division's meaning, and a ratio names a total or a known part

After this task, a word-problem template with the purpose `compose` can declare one of seven constructions, a division template declares its meaning, a ratio template names a total or a known part, and code computes the template's number families from its target.

## Acceptance criteria

1. Given a template with `construction` set to one of `equal_groups`, `division_meanings`, `fraction_of`, `decimal`, `percent`, `ratio` or `multi_step`, when the schema validates it, then it is accepted, and any other value is refused (REQ-7236). Closed by: a schema test, seven accepted fixtures and one refused.
2. Given a division template, when the content test runs, then it fails without `divisionMeaning` set to `share` or `group`; given a `:` inside another construction's target, such as `(120 − 30) : 3`, then it declares no meaning and `compose_partition_vs_quotition` doesn't fire on it (REQ-7236). Closed by: the content test's fixtures and a unit test of the class.
3. Given a ratio template, when the content test runs, then it fails unless its target names a total or a known part, so that the target has one value, as «разделить 30 в отношении 3 : 2» does and `3 : 2` alone doesn't (REQ-7234). Closed by: the content test's fixtures, one passing and one failing.
4. Given a target, when code computes its families, then it returns fractions, decimals, percentages or ratios from the target's own numbers, whole-number when it holds none, and a multi-step target that holds a decimal and a percentage belongs to both families. Closed by: a unit test, five fixtures.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the fields `construction` and, for `division_meanings` alone, `divisionMeaning` to the template schema of ADR-0040, owned by ADR-0440. Code computes each template's families from its target, and the template doesn't declare them, because a declared family could disagree with the numbers the target holds. A multi-step target that holds two families needs both passes, a default ADR-0440 chose because the parse of such a story has to handle both. The content test refuses an invalid template so the rule holds every time and needs no reviewer.

## Depends on

Nothing within this epic. The epic realising ADR-0040 supplies the template schema and the generator that these templates extend.

## Evidence

Not yet.

## Left alone

The Director's use of the construction, which TSK-1131 adds, and the card frames and meaning notes a construction needs, which TSK-1133 and TSK-1137 build.
