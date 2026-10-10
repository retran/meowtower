---
id: TSK-1129
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0440
closes: [REQ-7246, REQ-7248, REQ-7250, REQ-7252]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Three new error classes mark the times-or-divide, percentage-as-number and additive-ratio ideas

After this task, `judgeCompose` gives a confirmed graph one more class, `compose_times_vs_divide`, `compose_percent_as_number` or `compose_ratio_additive`, beside its verdict, the three sit in the conceptual class of the error-type limit, and a riddle that fits two takes the narrower.

## Acceptance criteria

1. Given the target `2,5 · 4` and the confirmed graph `2,5 : 4`, when `judgeCompose` runs, then it gives `compose_times_vs_divide` beside `wrong_structure`, and the same for `:` where the target has `·` (REQ-7246). Closed by: a fixture test, two fixtures.
2. Given the target `80 − 20 % от 80` and the graph `80 − 20`, then it gives `compose_percent_as_number` beside `wrong_structure`, reading the named target and the named graph because the expansion hides where the percentage stood (REQ-7248). Closed by: a fixture test.
3. Given the target a part K : a · b from a known part K, with K = 6 in the ratio 3 : 2, and the graph `6 + 2 − 3`, then it gives `compose_ratio_additive` whatever the value, and a share of a total gets no additive class (REQ-7250). Closed by: a fixture test, two fixtures.
4. Given a riddle that fits two classes, when the class is logged, then the order is `compose_percent_as_number`, `compose_ratio_additive`, `compose_times_vs_divide`, `compose_on_vs_times`, `compose_partition_vs_quotition`, `compose_order`, and the riddle keeps one `composeErrorClass` (REQ-7252). Closed by: a unit test, one fixture for each adjacent pair.
5. Given the error-type limit, when it classifies the three, then it places each in the conceptual class, as the three approved compose classes of REQ-5244 are (REQ-7252). Closed by: a unit test of the limit's classes.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the three classes to `src/shared/compose.ts` and to the error-type limit of ADR-0180. A narrow class names the idea she missed and a wide one would hide it, so the narrower pattern wins where two fit. The studies RES-4260 read name each: the numbers change which of times or divide pupils choose, adults apply whole-number arithmetic to percentages, and the additive strategy is the most reported error in ratio tasks.

## Depends on

- TSK-1128 (blocking): they read the expanded and the named graphs.

The epic realising ADR-0180 supplies the error-type limit.

## Evidence

Not yet.

## Left alone

The stream's counts of each class, which TSK-1135 keeps, and an error class for an inverted fraction, which no study RES-4260 read names.
