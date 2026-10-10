---
id: TSK-0837
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0260
closes: [REQ-5500]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Six grouping templates, two for each technique a template can declare, show an expression with a convenient grouping

After this task, the build ships at least 6 grouping templates, 2 for each of `commutative_associative`, `rounding` and `convenient_pairs`, each showing an expression such as `25 · 37 · 4`, `38 + 47 + 62 + 53`, `125 · 8 · 13`, `998 + 347` or `99 · 6` with a convenient grouping.

## Acceptance criteria

1. Given the shipped templates, when the build check runs, then every template passes TSK-0836's checks and every optimal plan agrees with `solve()` over 1,000 seeds. Closed by: the build check's report.
2. Given the shipped templates, when they are grouped by declared technique, then each of the three has at least 2 and none declares `distributive`. Closed by: a count in the build check's report.
3. Given the template `38 + 47 + 62 + 53`, when the plain calculation is read, then its steps give 85, 147 and 200, and the optimal plan links 38 with 62 and 47 with 53 (REQ-5500). Closed by: a unit test of the template.
4. Given a template of `998 + 347` and one of `99 · 6`, when each is built, then the number to round is a mark, not a link, and the plan stands for `1000 - 2` and `100 · 6 - 6`. Closed by: a unit test of both templates.
5. Given a template, when `sampleParallel` builds the twin, then the twin has the same technique, the same number of numbers and the same plan structure. Closed by: a unit test over 100 seeds.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the six templates on the host nodes of the fixture node table, with their `grouping` declarations, as content that the build checks of TSK-0836 verify. I chose 2 for each technique as ADR-0260 does, because with 1 the repeat window of ADR-0070 would show the same expression shape on every grouping task of a technique.

The player-facing strings, if the template holds any, go in the per-language file.

## Depends on

- TSK-0836 (blocking): the declaration and the build checks the templates pass.

The epic realising ADR-0050 supplies the real node table; until it lands, the host nodes are fixture nodes and the epic's templates are re-pointed by that epic's work.

## Evidence

Not yet.

## Left alone

The hint ladder's rung texts, which wait for ADR-0220's framing, and the shipped templates for expressions that mix operations, which ADR-0260 leaves out.
