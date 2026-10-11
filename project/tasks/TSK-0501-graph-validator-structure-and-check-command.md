---
id: TSK-0501
artifact: task
status: done
revised: 2026-10-10
epic: EPC-0050
closes: [REQ-0802, REQ-0854]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The validator rejects a cycle, a science topic in a prerequisite and a node dropped for the player's school group

After this task, `./meowtower graph check` prints the validator's report on `content/graph.yaml`, the validator runs at every server start, and it fails a prerequisite cycle, a link between a science topic and a maths node, and any module that filters the nodes by school group.

## Acceptance criteria

1. Given a graph in which A3 requires A4 and A4 requires A3, when it is validated, then the report fails and names A3 and A4 as the cycle; given a node whose id doesn't start with its domain's letter, whose `typicalGroup` is 9, or whose subtype weight is 0, then each fails naming the node and the field. Closed by: unit tests on the validator.
2. Given topics E1 to E5 and a maths node whose `prereqs` names E1, when the file is validated, then it fails; given a topic that carries a `prereqs` field, then it fails too, and the schema holds no way to write either (REQ-0802). Closed by: unit tests on the schema.
3. Given a valid fixture graph, when the school-group setting in the log is 7 and then 8, then `nodes()` returns the same list, equal to the file's nodes in file order (REQ-0854). Closed by: a unit test that appends the two `settings_changed` events.
4. Given a fixture module that drops nodes by `typicalGroup`, and another that imports `typicalGroup` from `src/engine/graph.ts` outside the allowed folders, when lint runs, then each fails; given a module that names `graph.yaml` outside `src/engine/graph.ts`, then lint fails too (REQ-0854). Closed by: the lint verb's output on the fixtures.
5. Given a valid file and a broken one, when `./meowtower graph check` runs on each, then it exits 0 with a report for the first and non-zero with the failing rule and the node for the second. Closed by: the command's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the validator to `src/engine/graph.ts`'s loader: rule 1 of SPC-0050, which is the schema, the field checks of the node table, `level` agreeing with the subtypes, and an acyclic prerequisite graph by topological sort. Wire it into the server start so a failure takes TSK-0500's `graph_invalid` and `graph_unloadable` paths, and add `./meowtower graph check`. Its report names each rule and each failure; the verify command of ADR-0190's epic runs the same validator when it exists.

Add `typicalGroup(node)` to the query module and the lint rules: `no-restricted-imports` with `importNames` for `typicalGroup`, and `no-restricted-syntax` for a string literal that matches `graph(\.[a-z]+)?\.yaml` outside `src/engine/graph.ts`. SPC-0050 allows `typicalGroup` under `src/parent/` and in the Director's cold start. The allowed folders are one list in the lint configuration, holding `src/parent/` and `src/engine/director/cold-start.ts`, so the cold-start task adds no second rule.

The rules for counts, the fixture and the 17 split nodes need the full file and come with TSK-0502 and TSK-0505.

## Depends on

- TSK-0500 (blocking): the loader, the schema and the query module this task extends.

## Evidence

Every criterion is checkable by a program. Two parts are closed in a weaker form, as the last section says.

1. `tests/unit/graph-loader.test.ts`: an id that doesn't start with its domain's letter, a `typicalGroup` of 9 and a subtype weight of 0 each fail, naming the node and the field. A prerequisite cycle fails, and the message names its nodes.
2. The same file: a topic with a prerequisite field fails, and a maths node whose prerequisite is a topic fails. The schema holds no field for either.
3. Partly closed. `nodes()` lists the file's nodes in file order, and `typicalGroup()` answers from the file. The test doesn't append the two `settings_changed` events the criterion names, because the query reads only the file and never the log.
4. `tests/unit/lint-graph-rules.test.ts`: a module outside the allowed folders that imports `typicalGroup` fails. The same import under `src/parent/` or in the Director's cold start passes. A module outside the loader that names the graph file fails, and the loader itself passes. The lint verb is clean on the whole repository.
5. Partly closed. `./meowtower graph check` ran by hand: on the valid file it printed `graph check: g-3fc6ff3ac75b passes rule 1 ...` and exited 0; on a file with level `2F` it printed the rule and the node and exited 1. No test runs the command.

Stages at tree `9d1d7682014b`, from `meow-checks evidence`:

- format: passed, record bf72133fb156, current at tree 9d1d7682014b, revision 361
- lint: passed, record dd3ed65cc7e8, current at tree 9d1d7682014b, revision 361
- check: passed, record 3af54e3c90a0, current at tree 9d1d7682014b, revision 361
- test: passed, record 45b40fd4b279, current at tree 9d1d7682014b, revision 361
- build: passed, record e86e54231203, current at tree 9d1d7682014b, revision 361

## Left alone

The counts of 79 nodes and the fixture comparison, which TSK-0502 and TSK-0505 add once the file holds the nodes, and the `typicalGroup` reading of the Director's cold start, which the epic realising ADR-0070 builds.
