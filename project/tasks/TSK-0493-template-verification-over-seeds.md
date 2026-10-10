---
id: TSK-0493
artifact: task
status: draft
revised: 2026-10-10
epic: EPC-0040
closes: []
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A verification run exercises every template on 10,000 seeds against an independent solver

After this task, `tools/verify-templates.ts` runs every template on 10,000 seeds and shows, for each, zero failures of `valid()`, zero disagreements with an independent reference solver, zero equal trap answers, zero numbers outside the graph in the solution, hints or explanations, the fallback share and the 95th percentile of generation time against the 50 ms budget, and a golden test holds 20 seeds for each template version.

## Acceptance criteria

1. Given the fixture templates, when the run executes, then each shows 0 failures of `valid()`, 0 disagreements with the reference solver, 0 equal trap answers and 0 foreign numbers, and the output names each template with its counts (ADR-0040's first realisation criterion). Closed by: the run's output.
2. Given a template version and an effective seed, when the golden test rebuilds it, then the view and parameters are byte-identical to the stored ones, and a changed output under an unchanged version fails the test (ADR-0040's second criterion). Closed by: the golden test.
3. Given 10,000 rendered Russian texts, when a regular expression runs over them, then it finds no `.` as a decimal point, no `*`, no `/` for division and no ungrouped number of 4 or more digits (ADR-0040's ninth criterion). Closed by: the run's output.
4. Given the run, when generation is timed, then the 95th percentile per template is reported against 50 ms, and a template whose fallback share exceeds 1 % of its generations appears once in the report (ADR-0040's eleventh criterion). Closed by: the run's output and a fixture with a high share.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the tool and its golden fixtures under `tests/golden/`. ADR-0190's verify command calls it as one of its groups once that epic exists; until then the lint verb runs the cheap checks and `npm run verify:templates` runs the 10,000-seed pass. The independent reference solver is written separately from the templates, in `tools/reference/`, so a template and the solver don't share a bug.

## Depends on

- TSK-0485 (blocking): it runs the build checks over every template.
- TSK-0486 (blocking): it checks the graph's numbers.
- TSK-0488 (blocking): it covers the word problem templates too.
- TSK-0492 (not blocking): it can run on the fixture templates before play uses them.

## Evidence

Not yet.

## Left alone

The simulation's 30-day run and ADR-0190's verify command, which that epic builds.
