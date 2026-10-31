---
id: EPC-0350
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0350
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Judge checks move one by one to a pinned model on the Mac, each only when its own test set proves it

Realises exactly ADR-0350: the local judge process behind a loopback binding and a key, the candidate list with its Russian filter, the reading of a local answer as label probabilities, the start-up confirmation and the probe that holds back a changed file's checks, the local bake-off, the route each check takes, the play key and the log rows for judge calls, and the Parent Room's list of where each check runs.

Until the epics realising ADR-0100, ADR-0180, ADR-0190 and ADR-0360 exist, the tasks run on the stand-ins their text names: a stub judge that serves the same routes as `llama-server`, a minimal gateway module, fixture test sets and a stand-in Parent Room page. The judge's account, the network watch and the refusal to start on a swapped file belong to the epic realising ADR-0360, and the tasks leave them there.

## Acceptance criteria

1. With `LOCAL_JUDGES` empty, a test resolves every check's route and finds the routes ADR-0100 gives, and a replayed adventure makes the same calls it made before. Evidence: the route test and the replay test, from TSK-0985.
2. From a second machine on the home network and from the iPad's browser, a completion request to each judge's port gets no model answer: the connection is refused or the reply is `401`. Evidence: the network test's output, from TSK-0980.
3. A stage 0 test on the family Mac shows whether the `tower` container reaches a judge bound to `127.0.0.1` and records which binding the Mac uses. Evidence: the stage 0 test's output, from TSK-0980.
4. A test with a mocked local judge returns a label outside the set, a missing label probability and a probability of 1.2; each time the same question reaches `SAFETY_MODEL` and `llm_log` records `judge_fell_back`. Evidence: the gateway test's report, from TSK-0982.
5. A route test over synthetic `bakeoff` rows gives a check to the judge at 95 % over the one at 91 %, breaks a tie of 95.0 % and 94.5 % by the number of checks passed and then by parameters, and keeps on its hosted route a check whose only local row failed latency. Evidence: the route test's report, from TSK-0985.
6. A test changes the served file's hash while the server runs and a second test changes one check's prompt; within 60 seconds the checks whose row no longer matches take their route without that judge, one `local_judge_retest` notice appears for each change and the other checks don't move, and a passing row written after that moves them back within 60 seconds with no restart. Evidence: the probe test's report, from TSK-0983.
7. A test starts the server with a judge down; the server listens, the judge's checks go to their standby route while their route stays local, no `judge_route_changed` is appended and `./meowtower status` names `local_judge_unverified`; when the judge comes up its calls resume after the warm-up. Evidence: the start-up test's report, from TSK-0983.
8. The group 1 check fails a candidate entry whose card languages omit Russian and passes one that gives only a count. Evidence: the static check's report, from TSK-0981.
9. The disclosure test builds the Parent Room page for the three configurations and finds every row equal to the route table and the judges' states. Evidence: the disclosure test's report, from TSK-0987.
10. A static test finds the play key on `JUDGE_MODEL` and `SAFETY_MODEL` in `play` mode and no key on a local call. Evidence: the static test's report, from TSK-0986.
11. At stage 0 on the family Mac, each check that moved has a `bakeoff` row with p95 at or under 1500 ms at 6 in flight, and in the first week of play `./meowtower status` shows the local calls' fallback share and p95 beside the bake-off figure. Evidence: the bake-off command's output, from TSK-0984, and the status output, from TSK-0985.
12. Every requirement ADR-0350 addresses lands in at least one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: each candidate's p95 latency per check at 6 in flight and its agreement with the reference, which the local bake-off of TSK-0984 writes, and the share of routed checks answered elsewhere, which `./meowtower status` shows from TSK-0985. ADR-0350 reverses if the stage 0 bake-off passes no check for any candidate, and TSK-0984 is where that shows.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0980 A local judge answers only the Mac and only with the key
      closes: REQ-3910
      depends: none
- [ ] T-002 [P] TSK-0981 A model whose card lists no Russian never answers a judge check
      closes: REQ-3918
      depends: none
- [ ] T-003 [P] TSK-0982 A local judge's answer is read as one label with a probability for each label, and anything else goes to the safety model
      closes: REQ-3912
      depends: TSK-0980 is not blocking, because the task tests on a stub judge that serves the same routes.
- [ ] T-004 TSK-0983 A judge is confirmed before it gets a check, and a changed file or prompt holds only the checks it affects
      closes: REQ-3920, REQ-3922
      depends: TSK-0982 - the warm-up reuses its request and answer reading, and the state `down` is the same state machine.; TSK-0980 is not blocking, because the task tests on a stub judge.
- [ ] T-005 TSK-0984 `tools/bakeoff.ts --local` measures each candidate's latency at the gateway and agreement with the reference
      closes: REQ-3914
      depends: TSK-0982 - the bake-off goes through the gateway's local route and its answer reading.; TSK-0981 - the candidate list names each candidate's file and the checks it may take.
- [ ] T-006 TSK-0985 Each judge check takes the route its own test set proves, and every other check stays on its hosted route
      closes: REQ-3916, REQ-3924
      depends: TSK-0983 - the judges' states and the probe decide the standby route.; TSK-0984 is not blocking, because the task tests on synthetic rows.
- [ ] T-007 TSK-0986 Hosted judge calls go on the play key, and local calls carry no key, reserve nothing and replay from recordings
      closes: REQ-2732
      depends: TSK-0982 - the local call and its answer reading exist there.
- [ ] T-008 TSK-0987 The Parent Room tells, for each check on her text, where it runs and which company reads it
      closes: REQ-2648
      depends: TSK-0985 - the page reads the route table that task builds.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0980, TSK-0981 and TSK-0982.
- After TSK-0982: TSK-0983 and TSK-0986.
- After TSK-0982 and TSK-0981: TSK-0984.
- After TSK-0983: TSK-0985.
- After TSK-0985: TSK-0987.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0980 | REQ-3910 |
| TSK-0981 | REQ-3918 |
| TSK-0982 | REQ-3912 |
| TSK-0983 | REQ-3920, REQ-3922 |
| TSK-0984 | REQ-3914 |
| TSK-0985 | REQ-3916, REQ-3924 |
| TSK-0986 | REQ-2732 |
| TSK-0987 | REQ-2648 |

The smallest set of tasks that would test the decision is TSK-0980, TSK-0983, TSK-0984 and TSK-0985. Together they show whether another device can reach a judge, whether a changed file or prompt holds back exactly its checks, whether a check moves only on measured latency and agreement, and whether the owner is told when fallbacks climb, which are the failures the decision's premortem names: a bake-off that measured an idle Mac and a notice that didn't say why.

## Not covered

No requirement ADR-0350 addresses is deferred. What this epic leaves to other records:

- Which model answers which check: the stage 0 bake-off decides it, and it may decide that every check stays hosted.
- The measure of agreement and the test sets (REQ-1688): the epic realising ADR-0100; TSK-0984 calls its function.
- The judge's dedicated account, `data/judges/owners.json`, the network watch and the refusal to start on a swapped file (REQ-2512, REQ-1644): the epic realising ADR-0360 builds them.
- The Master and every role that writes text: they stay on ADR-0100's routes.
