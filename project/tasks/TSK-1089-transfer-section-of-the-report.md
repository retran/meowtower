---
id: TSK-1089
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0410
closes: [REQ-6968, REQ-6970, REQ-6972, REQ-6974, REQ-6976, REQ-6978]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# After the MVP, the report shows near and far transfer apart, pooled, with the expected chance beside each share

After this task, the report's transfer section reads only eligible rows of `first_exposures` and shows near and far apart, pooled across the graph and by domain, each with its share «сама», its count, its 80 % interval and the mean `expected`, and «мало данных» below 10 observations.

## Acceptance criteria

1. Given a fixture log with eligible near and far rows, when the section is built, then it shows near and far as separate figures, each pooled across the graph and by domain, and no figure for a single node (REQ-6968, REQ-6970). Closed by: the report test.
2. Given a figure, then it shows the share «сама», the count of eligible observations, its 80 % Wilson interval under ADR-0380's rules and the mean `expected` of the observations it counts beside it (REQ-6972). Closed by: the report test.
3. Given a figure on 9 eligible observations, then it reads «мало данных» with the count 9; given 10, then it shows the share (REQ-6974). Closed by: the report test, two fixtures.
4. Given the section, then it defines near as «новый формат или сюжет знакомого подтипа» and far as «новый подтип, пререквизиты которого освоены», and states «Игра не видит, что прошли в школе», each from `parent.transfer.*` in `ru.json` (REQ-6976, REQ-6978). Closed by: the report test and the string check of ADR-0160.
5. Given the section, then it adds no interpretation line comparing the share with the mean `expected`. Closed by: the report test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the section to the report after the MVP, as ADR-0380 sets its place and scope. The 10-observation floor is the one this measure owns, so register it in ADR-0380's floor registry, `src/parent/measures.ts`. Use the rows' `eligible`, `kind`, `expected` and `transferred` and nothing else of the log. Write the strings under `parent.transfer.*`.

## Depends on

- TSK-1085 (blocking): it reads only eligible rows.
- TSK-1086 (not blocking): its mean `expected` reads the rows with or without the version rule, and the figure is right only once both are done.

The epic realising ADR-0380 supplies the report's intervals, the floor registry and the fixed interpretation list; until it exists the task uses a stand-in Wilson function with the same signature.

## Evidence

Not yet.

## Left alone

The profile's transfer bar, which ADR-0390 builds, and a line comparing the share with the mean `expected`, which needs its own record under ADR-0380's fixed list.
