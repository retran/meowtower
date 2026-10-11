---
id: TSK-0502
artifact: task
status: done
revised: 2026-10-10
epic: EPC-0050
closes: [REQ-0806]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A graph edit with a stated reason takes effect with no code change, and an edit with none fails

After this task, the validator compares each maths node's domain, level and prerequisites with `tests/fixtures/res-0800.yaml`, a `changes` line excuses one node and field from that comparison, and the query module reports which `changes` lines are new, so the parent or a developer changes a level by editing the file alone.

## Acceptance criteria

1. Given a graph that equals the fixture, when the level of one node is changed in a copy with no `changes` line, then the validator fails with `graph_drift` naming the node and the field; given the same copy with a line naming that node and field and a reason, then it passes and has a new version (REQ-0806). Closed by: a unit test on a 3-node fixture pair.
2. Given a `changes` line that names a node and field and a copy that edits another field of the same node, when it is validated, then it fails, because a line excuses only the field it names. Closed by: a unit test.
3. Given a valid start, when the file gains a `changes` line and a changed weight and the server restarts, then `changes()` marks the new line as new, the earlier lines as not new, and no source file changed between the two starts (REQ-0806). Closed by: an integration test over two starts on the stored versions of TSK-0500.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add rule 3 of SPC-0050's validator: load `tests/fixtures/res-0800.yaml`, which holds each maths node's `domain`, `level` and `prereqs` as RES-0800 gives them after its 17 corrections, and compare it field by field with the base file. A difference with no `changes` line naming that node and field is `graph_drift`, raised as the validator's failure, which at start-up makes the file invalid and takes TSK-0500's fallback. A `changes` line holds a node, a field and a reason, the list is cumulative, and a line stays for every later version.

Add `changes()` to the query module, marking a line new when the previous stored version in `graph_versions` lacks it, so ADR-0180's report can open with those lines after a graph change. The fixture file starts with the 3 nodes of the small test graph and gains its rows with TSK-0503 to TSK-0505.

## Depends on

- TSK-0500 (blocking): `graph_versions`, the loader and the query module.
- TSK-0501 (blocking): the validator this task adds a rule to.

## Evidence

Every criterion is checkable by a program.

1. REQ-0806, `tests/unit/graph-drift.test.ts`: a level changed in a copy with no changes line is refused as `graph_drift`, and the message names the node and the field. The same copy with a changes line naming that node and field passes and has a new version.
2. The same file: a changes line excuses only the field it names. A copy that also changes that node's prerequisites is refused.
3. `tests/integration/graph-start.test.ts`: after a restart on a file that gains a changes line and a weight change, `changes(previous)` marks the earlier line not new and the new line new. The two starts read the same file names but different stored contents, so no source file changed between them.

Two limits, which are the task text's own, and one thing to know:
- Rule 3 runs in `./meowtower graph check` and in the tests, where `tests/fixtures/res-0800.yaml` exists. The server doesn't pass the fixture at start, because the fixture isn't shipped in the image.
- A fixture node that the base file lacks is skipped by rule 3. The node count is TSK-0503's rule, and until its nodes are written the base file has none to compare.
- The fixture starts with the three nodes of the small test graph and gains its rows with TSK-0503 to TSK-0505.

Stages, from `meow-checks evidence`:

- format: passed, record f3a8d08c8d21, current at tree 68b2bd00b42d, revision 373, now 374
- lint: passed, record 359e167924d4, current at tree 68b2bd00b42d, revision 373, now 374
- check: passed, record 3c977459ebeb, current at tree 68b2bd00b42d, revision 373, now 374
- test: passed, record 47aafe429419, current at tree 68b2bd00b42d, revision 373, now 374
- build: passed, record 7fff578ace77, current at tree 68b2bd00b42d, revision 373, now 374

## Left alone

The report's opening with the `changes` lines, which is ADR-0180's, and the node data itself, which TSK-0503 to TSK-0505 write.
