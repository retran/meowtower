---
id: TSK-0983
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0350
closes: [REQ-3920, REQ-3922]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A judge is confirmed before it gets a check, and a changed file or prompt holds only the checks it affects

After this task, the server confirms that each local judge answers and reads the hash of the file it serves before it sends that judge a check, probes every 60 seconds, and holds back only the checks whose `bakeoff` row no longer matches.

## Acceptance criteria

1. Given a judge that is down when the server starts, when the server starts, then it listens, the judge's checks go to their standby route while their route stays local, no `judge_route_changed` is appended, `./meowtower status` names `local_judge_unverified`, and when the judge comes up its calls resume after the warm-up (REQ-3922). Closed by: a start-up test with a stub judge.
2. Given a model file of 10 GB, when the server starts twice, then the second start reads its size and modification time and takes the SHA-256 from `local_judge_files`, and a changed modification time hashes it again (REQ-3922). Closed by: a unit test with a fixture file and a counting reader.
3. Given a running server, when the served file's hash changes, and in a second test when one check's prompt changes, then within 60 seconds the checks whose row no longer matches take their route without that judge, one `local_judge_retest` notice appears for each change, and the other checks don't move (REQ-3920). Closed by: a probe test with a clock stub.
4. Given those held checks, when `tools/bakeoff.ts --local` writes a passing row for the new inputs, then the checks return to the judge within 60 seconds, with no restart (REQ-3920). Closed by: the same probe test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Run four steps before a judge takes a check: `/health` answers 200, `/props` names the configured file and a runtime build, the file's hash is known, and one warm-up request for each check and slot, each within 30 seconds, returns an answer TSK-0982 accepts. The judge is `unverified` until all four pass, and the server doesn't wait for them, because a start that waited on the judge would keep her waiting on a process she can't fix.

Probe every 60 seconds with `/health` and `/props` and read the file's size and modification time again. A connection refused, or a `/props` answer whose file or build differs from the last read, makes the judge `unverified` at once. A `/props` that names another file while the server starts is not this task's: the epic realising ADR-0360 makes the server refuse to start with `judge_file_mismatch` (entry 95).

Notices: `local_judge_retest` once for each changed input, naming it and `tools/bakeoff.ts --local`.

## Depends on

- TSK-0982 (blocking): the warm-up reuses the request and the answer reading, and the state `down` that ends a run of errors is the same state machine.
- TSK-0980 (not blocking): the task tests on a stub judge, so it can land first.

The epic realising ADR-0360 builds the dedicated account and the owner check that is the first of SPC-0350's four steps; until it lands, the step passes for a stub owner.

## Evidence

Not yet.

## Left alone

The route each check takes, which TSK-0985 resolves from the rows and these states, and the bake-off that writes the rows, which TSK-0984 builds.
