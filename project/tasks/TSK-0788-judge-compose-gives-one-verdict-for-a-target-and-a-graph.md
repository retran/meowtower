---
id: TSK-0788
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0230
closes: [REQ-5224, REQ-5226, REQ-5228, REQ-5230, REQ-5298, REQ-5244]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `judgeCompose` gives one verdict and an error class for a target and a graph, the same every time

After this task, `src/shared/compose.ts` holds `judgeCompose(target, graph)`, a pure function that normalises both graphs and returns exactly one of `match`, `match_other_structure`, `wrong_structure` (marked `wrongNumbers: true` for the target's operations on other numbers) or `unparsed`, with an error class where one applies, and the error-type limit places the three compose classes in the conceptual class.

## Acceptance criteria

1. Given generated pairs of a target and a graph, when `judgeCompose` runs twice on each, then it returns one verdict for each pair and the same verdict on the repeat (REQ-5224). Closed by: a property test.
2. Given every reordering of `+` and `·` terms, when `judgeCompose` runs against the target «6 · 4 + 6», then each gives `match`, and «6 : 48» against «48 : 6» gives `wrong_structure` (REQ-5226, REQ-5298). Closed by: the property test and a fixture.
3. Given a graph «6 · 5» for the target «6 · 4 + 6», when it is judged, then the verdict is `match_other_structure`; given the target's operations on other numbers, then `wrong_structure` with `wrongNumbers: true`; given any other value, then `wrong_structure` (REQ-5228, REQ-5230, REQ-5298). Closed by: fixtures in a unit test.
4. Given a `+` or `−` where the target has a `·` or `:` on the same numbers, or the reverse, when it is judged, then the class is `compose_on_vs_times`; given matching operations and numbers in another order, then `compose_order`; given a division whose kind differs from the kind the target's template declares, then `compose_partition_vs_quotition` and the verdict stays `match` (REQ-5244, REQ-5226). Closed by: fixtures in a unit test.
5. Given the error-type limit's table, when the three compose classes are read, then each is in the conceptual class (REQ-5244). Closed by: a table test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `judgeCompose` in `src/shared/compose.ts`, a pure function of the target and the graph she confirmed or her cards form. Normalise both graphs with `+` and `·` commutative and associative and `−` and `:` in fixed order, then decide by the table in ADR-0230. REQ-5298 gives every confirmed graph one verdict, which REQ-5224 needs.

I took ADR-0230's reading for a division of a different kind than the template declares: the graph still gets `match`, because REQ-5226 decides by operations and numbers alone, and the class records the difference beside it for the stream to count apart.

The error classes `compose_times_vs_divide`, `compose_percent_as_number` and `compose_ratio_additive`, the expansion of named operations before normalising and the fixed constants they carry belong to ADR-0440, and its epic extends this function.

## Depends on

Nothing.

The epic realising ADR-0040 supplies the target as an expression, a bar diagram or a short note and the graph type; this task runs on fixture targets and leaves the generator's `compose` purpose to the Director's task.

## Evidence

Not yet.

## Left alone

The rewards for each verdict, which ADR-0140 owns, and the parse that makes a graph from her text, which TSK-0795 holds.
