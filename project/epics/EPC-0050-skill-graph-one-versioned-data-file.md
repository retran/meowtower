---
id: EPC-0050
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0050
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The skill graph is one versioned data file, the single source of nodes, levels, prerequisites, subtypes and weights

Realises exactly ADR-0050: the file `content/graph.yaml` with its schema and loader, the version that is a hash of its content, the validator and its seven rules, the research fixture and the `changes` list, the 79 maths nodes with their subtypes, the SLO goals and their mapping, the descent query, the build checks that keep a second copy of a level or weight out of every other file, and the rule an overlay must pass. SPC-0050 states what the finished part does.

The tasks need nothing from another epic to start, because they run on a small graph of their own and then on the real file. Until the epic realising ADR-0190 builds the verify command, `./meowtower graph check` carries the validator's report that ADR-0050's first criterion names.

## Acceptance criteria

1. `./meowtower graph check` loads `content/graph.yaml` and reports 79 maths nodes in nine domains, 69 at 1F, 1S or 1F/1S and 10 at stretch, no cycle and no difference from `tests/fixtures/res-0800.yaml`. Evidence: the command's output, from TSK-0505.
2. A test changes one weight in a copy of the file and gets a new `graphVersion`, and a test that changes only a comment gets the same one. Evidence: the unit test's report, from TSK-0500.
3. `descentTargets("M1", "decimal")` returns D3 only, and `descentTargets("M5", "grid")` returns A3 only. Evidence: the unit test's report, from TSK-0508.
4. A mutation test adds `level` to one template, a subtype weight to `catalogue.yaml`, an E1 prerequisite to a maths node, and a template that names a missing subtype, and each fails the build. Evidence: the mutation tests' reports, from TSK-0509 and TSK-0501.
5. Each of the 17 split nodes has at least one 1F and one 1S subtype, and every M4, M5 and M7 subtype marked `formula` is 1S. Evidence: the validator's report and the unit tests, from TSK-0505 and TSK-0506.
6. Starting the server with a broken file after one valid start serves play from the last valid version and shows the notice once in the Parent Room's notices. Evidence: the integration test's report, from TSK-0500.
7. The reviewing agent's report on the SLO mapping names every goal and at least one subtype for each. Evidence: the agent's report, from TSK-0507, which rests on judgement.
8. Every requirement ADR-0050 addresses lands in at least one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the time the loader takes to parse and validate the finished file against the 1-second budget in ADR-0190's baselines table, which TSK-0505 prints, and the list of subtypes marked `not_generatable`, which TSK-0509 shows and which falls as the epic realising ADR-0040 writes templates. ADR-0050 reverses to a Parent Room editor if a validation failure reaches the parent more than twice in a month; no task here can show that before play begins.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-0500 The server loads the skill graph from one file, versions it by its content and serves it through one query module
      closes: REQ-0804, REQ-0808
      depends: none
- [ ] T-002 TSK-0501 The validator rejects a cycle, a science topic in a prerequisite and a node dropped for the player's school group
      closes: REQ-0802, REQ-0854
      depends: TSK-0500 (blocking) - it extends the loader and the schema.
- [ ] T-003 [P] TSK-0502 A graph edit with a stated reason takes effect with no code change, and an edit with none fails
      closes: REQ-0806
      depends: TSK-0500 (blocking) - it reads `graph_versions` and the query module.; TSK-0501 (blocking) - it adds a rule to the validator.
- [ ] T-004 TSK-0503 The graph file holds the nodes of numbers, arithmetic and fractions with their subtypes, and the five science topics
      closes: REQ-0800
      depends: TSK-0501 (blocking) - the validator checks the nodes as they are written.; TSK-0502 (blocking) - the fixture comparison needs the rows.
- [ ] T-005 TSK-0504 The graph file holds the nodes of decimals, percentages and measures with their subtypes
      closes: REQ-0800
      depends: TSK-0503 (not blocking) - both edit `content/graph.yaml` and the fixture, so merging in order avoids a conflict.; TSK-0501 (blocking) - the validator.; TSK-0502 (blocking) - the fixture comparison.
- [ ] T-006 TSK-0505 The graph file is complete: 79 maths nodes, the counts hold whatever an edit says, and the 17 split nodes have both levels
      closes: REQ-0800, REQ-0814, REQ-0850
      depends: TSK-0503 (blocking) - the first third of the file.; TSK-0504 (blocking) - the counts rule needs all 79 nodes.
- [ ] T-007 [P] TSK-0506 Area and volume by formula sit at 1S, and the perimeter node M4 splits as the requirement says
      closes: REQ-0816, REQ-0818
      depends: TSK-0504 (blocking) - the M nodes and their subtypes.
- [ ] T-008 [P] TSK-0507 Every SLO goal at 1F and 1S maps to a subtype of the graph
      closes: REQ-0812
      depends: TSK-0505 (blocking) - the full set of subtypes the goals map to.
- [ ] T-009 [P] TSK-0508 A failed subtype descends only to its own prerequisite
      closes: REQ-0810
      depends: TSK-0504 (blocking) - M1, M5, D3 and A3 with their subtype tags exist.
- [ ] T-010 [P] TSK-0509 The build fails on a template that names a subtype the graph lacks and on a second copy of a level or weight
      closes: REQ-0852, REQ-1244
      depends: TSK-0500 (blocking) - the loader and the query module the checks read.
- [ ] T-011 [P] TSK-0510 A curriculum overlay adds nodes and links and never changes the base graph
      closes: REQ-3812
      depends: TSK-0500 (blocking) - the loader and the version hash.; TSK-0501 (blocking) - the validator whose rules the overlay shares.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0500.
- After TSK-0500: TSK-0501.
- After TSK-0500 and TSK-0501: TSK-0502, TSK-0509 and TSK-0510.
- After TSK-0501 and TSK-0502: TSK-0503, then TSK-0504 in the same file.
- After TSK-0504: TSK-0506 and TSK-0508.
- After TSK-0503 and TSK-0504: TSK-0505, then TSK-0507.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0500 | REQ-0804, REQ-0808 |
| TSK-0501 | REQ-0802, REQ-0854 |
| TSK-0502 | REQ-0806 |
| TSK-0503 | REQ-0800 |
| TSK-0504 | REQ-0800 |
| TSK-0505 | REQ-0800, REQ-0814, REQ-0850 |
| TSK-0506 | REQ-0816, REQ-0818 |
| TSK-0507 | REQ-0812 |
| TSK-0508 | REQ-0810 |
| TSK-0509 | REQ-0852, REQ-1244 |
| TSK-0510 | REQ-3812 |

The smallest set of tasks that would test the decision is TSK-0500, TSK-0501, TSK-0505 and TSK-0508. Together they show whether the file loads and versions itself from its content, whether the validator holds the structure, whether the real file equals the research it came from, and whether a failed subtype descends to its own prerequisite, which are the four things the decision's premortem and first criteria rest on.

## Not covered

- The stretch gate's admission by tested results, REQ-0820, the weekly limit on stable nodes in mental arithmetic, REQ-0832, and the descent in play: ADR-0070 applies them with this epic's `stretchGate` and `descentTargets`, so the epic realising ADR-0070 closes them.
- The report's gap and ceiling lists, the coverage by level, the word problem matrix and the Parent Room's drawing of `graph_invalid`, `graph_changed` and `not_generatable`: ADR-0180's epic. The tasks here write the notices and the `changes` lines the report reads.
- Node states and how subtype weights enter the node estimate: ADR-0060's epic, which reads the query module.
- Templates for each subtype of the real nodes, the independent mental arithmetic tasks and the model-choice problems: ADR-0040's epic, which this epic's `not_generatable` list tells what to write.
- The fields and parts that later decisions add to the file, `citoBlock` of ADR-0290, `tracks` of ADR-0300 and the `form: new` and `requires` subtype fields of ADR-0250: their epics extend the schema this epic builds.
- The Dutch overlay `graph.nl.yaml` and the `nl` curriculum layer, which RES-2550 defers until after the MVP; TSK-0510 builds only the rule every overlay must pass.
- The `typicalGroup` reading of the Director's cold start: SPC-0050 allows the import only under `src/parent/` and SPC-0070 has the Director read it, so TSK-0501 keeps the allowed folders in one list and the owner settles the contradiction.
