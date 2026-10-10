---
id: EPC-0040
artifact: epic
status: draft
revised: 2026-10-10
realises: ADR-0040
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Code generates every task from a versioned template, a seed and exact arithmetic

Realises exactly ADR-0040: the exact rational type and the seeded source, the template contract and the generator with its fallback, the answer checker for each kind, the classification of a wrong answer, the computation graph behind the solution, the hints and the explanations, the step matching of word problems, the word problem structures and their readability metrics, the strict view the client receives and the pictures drawn by code, the parallel task, and the verification run over 10,000 seeds.

Until the epics realising ADR-0050, ADR-0060 and ADR-0160 exist, the tasks run on fixture templates written for the stand-in tasks, and no real node, state or glossary entry is read. Each task names what it leaves to those epics.

## Acceptance criteria

1. `npm run verify:templates` runs every template on 10,000 seeds and shows, for each, zero failures of `valid()`, zero disagreements with the independent reference solver, zero equal trap answers, and zero numbers in the solution, hints or explanations that aren't a graph value or a given. Evidence: the verification run's output, from TSK-0493.
2. A golden test holds 20 seeds for each template version, and the same template, version and effective seed give a byte-identical view and parameters. Evidence: the golden test's report, from TSK-0493.
3. A unit test gives exactly `3/10` for `0,1 + 0,2`, and ESLint reports zero uses of `Math.random` in `src/`. Evidence: the unit test's report and the lint verb's output, from TSK-0480.
4. The acceptance test has one fixture for each answer rule, and every fixture passes, among them `3,,5` returning `unparsed`, `12 500` and `007` accepted, and 6 r 19 for 79 : 10 rejected although 6 · 10 + 19 = 79. Evidence: the acceptance test's report, from TSK-0482, TSK-0483 and TSK-0492.
5. A payload test serialises 1,000 client-bound payloads across templates and finds no node code, template id, seed, trap id, correct answer or solution before the first attempt. Evidence: the payload test's report, from TSK-0490.
6. A property test on 10,000 seeds finds exactly one unused given in every T4 problem, a sign comparison only under `warmup`, `easy` or `tutorial`, and at least 4 options in every scored choice task. Evidence: the property tests' reports, from TSK-0488 and TSK-0485.
7. A regular expression over 10,000 rendered Russian texts finds no `.` as a decimal point, no `*`, no `/` for division and no ungrouped number of 4 or more digits. Evidence: the verification run's output, from TSK-0493 and TSK-0480.
8. `frameMetrics` passes one fixture for each row of the readability table, each with a frame just inside and one just outside the limit. Evidence: the metrics test's report, from TSK-0489.
9. Verify times generation over 10,000 seeds for each template and reports the 95th percentile against the 50 ms budget. Evidence: the verification run's output, from TSK-0493.
10. Every requirement ADR-0040 addresses lands in exactly one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the 95th percentile of generation time for each template against 50 ms, and the share of generations that use a fallback entry, which the verification run of TSK-0493 reports. ADR-0040 reverses to a Python generator if the 50 ms budget fails for the heaviest template at the 95th percentile, and TSK-0493 is where that shows.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-0480 Exact arithmetic, a seeded generator source and Russian number formatting
      closes: REQ-1204, REQ-1226
      depends: none
- [ ] T-002 [P] TSK-0481 The template contract and the seeded generator with its fallback
      closes: REQ-1202, REQ-1206, REQ-1208, REQ-1210, REQ-1216, REQ-0830
      depends: TSK-0480 - it supplies `Q`, the seed and the format the generator uses.
- [ ] T-003 [P] TSK-0482 The checker accepts number answers by value and kind
      closes: REQ-0732, REQ-0742, REQ-0744, REQ-0746, REQ-0748, REQ-0750, REQ-0752, REQ-0754, REQ-0756, REQ-0758, REQ-0778
      depends: TSK-0480 - every comparison is by value in `Q`.
- [ ] T-004 [P] TSK-0483 The checker accepts time, point, choice, grid and order answers exactly
      closes: REQ-0760, REQ-0762, REQ-0766, REQ-0768, REQ-0770, REQ-0772
      depends: TSK-0482 - it builds the module and the result type these kinds share.
- [ ] T-005 [P] TSK-0484 A wrong answer is classified by its trap, and a choice task's wrong options are its traps' answers
      closes: REQ-0702, REQ-0704, REQ-0726, REQ-0728, REQ-0730
      depends: TSK-0481 - the traps come from the template contract.; TSK-0482 - the entry's value and form come from the number kinds.
- [ ] T-006 [P] TSK-0485 The build fails a template whose choice, comparison or traps break a rule
      closes: REQ-0706, REQ-0708, REQ-0710
      depends: TSK-0481 - the checks read the template contract.
- [ ] T-007 [P] TSK-0486 One computation graph gives the solution, the hints and the explanation of every trap
      closes: REQ-1214, REQ-1234
      depends: TSK-0481 - it carries the template contract the graph extends.
- [ ] T-008 TSK-0487 Entered steps are matched against every valid solution path and classified
      closes: REQ-0705, REQ-0707, REQ-0709, REQ-0713, REQ-0774, REQ-0776, REQ-0848
      depends: TSK-0486 - the valid graphs and the structure traps come from the graph module.; TSK-0482 - a step's value is compared in `Q`.
- [ ] T-009 TSK-0488 A word problem takes one of the seven structures, with numbers fixed before the story
      closes: REQ-0780, REQ-0782, REQ-0786, REQ-0788, REQ-0836
      depends: TSK-0486 - it supplies the graph the structures extend.; TSK-0481 - the generator draws the numbers.
- [ ] T-010 [P] TSK-0489 `frameMetrics` measures a frame against the limits of the readability table
      closes: REQ-0701, REQ-0790, REQ-0792, REQ-0794, REQ-0796, REQ-0798, REQ-3712
      depends: TSK-0480 - it uses `formatQ` to count a number as one word; either task can land first with a stub.
- [ ] T-011 [P] TSK-0490 The client gets only the view: no solution, no design, no meaning in the id, and pictures drawn from parameters
      closes: REQ-1218, REQ-1220, REQ-1222, REQ-1230
      depends: TSK-0481 - the view is built from the template contract.
- [ ] T-012 [P] TSK-0491 The parallel task keeps the difficulty and changes the numbers and the answer
      closes: REQ-1224
      depends: TSK-0481 - it reuses the generator's candidate loop and seed streams.
- [ ] T-013 TSK-0492 The play routes generate each task from a template and a seed, and an unparsed entry stays unanswered
      closes: REQ-1200, REQ-0734, REQ-0736, REQ-0740
      depends: TSK-0481 - the routes call the generator.; TSK-0482 - the checker parses the entry.; TSK-0483 - the structured kinds are part of the module the route calls.; TSK-0490 - the route sends only the strict view.; TSK-0491 - the second attempt uses the parallel task.
- [ ] T-014 TSK-0493 A verification run exercises every template on 10,000 seeds against an independent solver
      closes: none - it verifies what the other tasks build
      depends: TSK-0485 - it runs the build checks over every template.; TSK-0486 - it checks the graph's numbers.; TSK-0488 - it covers the word problem templates too.; TSK-0492 - it can run on the fixture templates before play uses them.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0480.
- After TSK-0480: TSK-0481, TSK-0482 and TSK-0489.
- After TSK-0481: TSK-0485, TSK-0486, TSK-0490 and TSK-0491.
- After TSK-0482: TSK-0483.
- After TSK-0481 and TSK-0482: TSK-0484.
- After TSK-0486: TSK-0487 and TSK-0488.
- After TSK-0481, TSK-0482, TSK-0483, TSK-0490 and TSK-0491: TSK-0492.
- After TSK-0485, TSK-0486 and TSK-0488: TSK-0493.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0480 | REQ-1204, REQ-1226 |
| TSK-0481 | REQ-1202, REQ-1206, REQ-1208, REQ-1210, REQ-1216, REQ-0830 |
| TSK-0482 | REQ-0732, REQ-0742, REQ-0744, REQ-0746, REQ-0748, REQ-0750, REQ-0752, REQ-0754, REQ-0756, REQ-0758, REQ-0778 |
| TSK-0483 | REQ-0760, REQ-0762, REQ-0766, REQ-0768, REQ-0770, REQ-0772 |
| TSK-0484 | REQ-0702, REQ-0704, REQ-0726, REQ-0728, REQ-0730 |
| TSK-0485 | REQ-0706, REQ-0708, REQ-0710 |
| TSK-0486 | REQ-1214, REQ-1234 |
| TSK-0487 | REQ-0705, REQ-0707, REQ-0709, REQ-0713, REQ-0774, REQ-0776, REQ-0848 |
| TSK-0488 | REQ-0780, REQ-0782, REQ-0786, REQ-0788, REQ-0836 |
| TSK-0489 | REQ-0701, REQ-0790, REQ-0792, REQ-0794, REQ-0796, REQ-0798, REQ-3712 |
| TSK-0490 | REQ-1218, REQ-1220, REQ-1222, REQ-1230 |
| TSK-0491 | REQ-1224 |
| TSK-0492 | REQ-1200, REQ-0734, REQ-0736, REQ-0740 |
| TSK-0493 | none |

The smallest set of tasks that would test the decision is TSK-0480, TSK-0481, TSK-0482, TSK-0486 and TSK-0493. Together they show whether a task rebuilds from its seed, whether the answer is computed exactly and checked by value, and whether every number in a solution comes from the graph, which are the three things the decision's premortem names.

## Not covered

- REQ-1232: every node in the template catalogue having templates for each subtype and answer kind, because the catalogue and the nodes come from ADR-0050's skill graph, whose epic isn't written; this epic builds the contract, the checks and the fixture templates, and the epic realising ADR-0050 writes the templates for the real nodes and adds the check.
- REQ-0784: a word problem using only nodes the player currently has fluent, because the knowledge model's states come from ADR-0060; TSK-0488 takes the allowed nodes as an argument, so the epic realising ADR-0060 only has to pass them.
- REQ-1240, REQ-1242 and REQ-0844: the risky-term lists, the build failure for a term without a glossary entry and the glossary's coverage of every MVP template, because the glossary file's format and its Russian strings belong to ADR-0160; TSK-0489 takes the risk terms as an argument, and the epic realising ADR-0160 adds the checks and the mutation test of ADR-0040's sixth criterion.
- ADR-0040's seventh criterion, the step-input share of 30 days: REQ-0703 was superseded and ADR-0230 carries the alternation of the two input forms, so its epic measures the share.
- The templates for the real nodes: which need ADR-0050's graph, ADR-0060's states and the language file ADR-0160 defines; this epic's fixture templates prove each part of the engine until then.
