---
id: TSK-0501
artifact: task
status: approved
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

Add `typicalGroup(node)` to the query module and the lint rules: `no-restricted-imports` with `importNames` for `typicalGroup`, and `no-restricted-syntax` for a string literal that matches `graph(\.[a-z]+)?\.yaml` outside `src/engine/graph.ts`. SPC-0050 allows `typicalGroup` only under `src/parent/`, and SPC-0070 has the Director's cold start read it. I chose to keep the allowed folders in one list in the lint configuration, holding `src/parent/` and `src/engine/director/cold-start.ts`, so the cold-start task adds no second rule and the report names the contradiction for the owner to settle.

The rules for counts, the fixture and the 17 split nodes need the full file and come with TSK-0502 and TSK-0505.

## Depends on

- TSK-0500 (blocking): the loader, the schema and the query module this task extends.

## Evidence

Not yet.

## Left alone

The counts of 79 nodes and the fixture comparison, which TSK-0502 and TSK-0505 add once the file holds the nodes, and the `typicalGroup` reading of the Director's cold start, which the epic realising ADR-0070 builds.
