---
id: EPC-0190
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0190
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One verify command, simulations and a person's acceptance gate every stage, and the MVP holds exactly the approved scope

Realises exactly ADR-0190: the verify command and its report, the property tests, the simulation, the replayed and live model runs, the building agent's handoff and the guards of group 1, the stage order with its acceptance, the iPad checklist, the MVP and backlog acceptance, and the agent's readings of the open questions and the canon.

Until the epics realising ADR-0040, ADR-0050, ADR-0060, ADR-0070, ADR-0090, ADR-0100, ADR-0110 and ADR-0180 exist, the checks run on fixtures: fixture templates, a stand-in knowledge model and play loop, a stub gateway with recorded answers and fixture snapshots. Each task names what it leaves to those epics, and the checks apply to each real part as its epic lands.

## Acceptance criteria

1. At stage 0, `docker compose run --rm tools npm run verify` writes both report files, runs groups 1, 4 and 9 and names every other group as not required yet. Evidence: the command's output and the two files, from TSK-0724.
2. Making one template's answer wrong on one seed turns group 2 red, and the report names the template and the seed. Evidence: the integration test's report, from TSK-0725.
3. Deleting one recording makes the dependent check fail as `recording_missing`, with no network call made. Evidence: the integration test's report, from TSK-0731.
4. Adding `docs/decisions.md`, a `checkpoints` migration or a Dutch locale string file turns group 1 red. Evidence: the integration tests' reports, from TSK-0734.
5. The report's budgets equal the values in `verify/baselines.json`, and each carries its source record. Evidence: the integration test's report, from TSK-0724.
6. `artifacts/handoff.md` exists after every run and lists the run's drafts, open questions, verify status and offline-key spend. Evidence: the integration test's report, from TSK-0733.
7. The groups required at stage 0.1 stay not required until stage 0's acceptance task is `done`, and no file but the record names the stage. Evidence: the integration tests' report, from TSK-0735.
8. `verify --live` reports the discard share, the branch readiness share and the 95th percentile of the Master's wait, and stops at its $10 budget, against a stub provider. Evidence: the integration tests' report, from TSK-0732.
9. The report's acceptance section prints the fast-guess share of the last 14 days against 15 %, and the stage acceptance page names what the stage 0.3 acceptance holds, with the parent's two-week judgement. Evidence: the integration tests' report from TSK-0737, and the parent's judgement recorded in TSK-0737.
10. Every requirement ADR-0190 addresses lands in a closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding for this epic.

The epic can measure two things before it is finished: the time of `verify --fast` against 3 minutes and of a full verify against 30 minutes on fixtures, which the report of TSK-0724 prints beside each budget. ADR-0190 moves the slow groups to a nightly run if a full verify takes longer than 60 minutes on the Mac three runs in a row, and the report is where that shows.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-0724 One verify command runs every check group in the tools container and writes one report
      closes: REQ-2900
      depends: none
- [ ] T-002 [P] TSK-0725 Group 2 runs every template on 10,000 fixed seeds against an independent reference solver
      closes: REQ-2902, REQ-2904, REQ-2906
      depends: TSK-0724 (blocking) - the group runs in the runner.
- [ ] T-003 [P] TSK-0727 Every export matches the log's row count, is fully described, and opens in DuckDB and pandas
      closes: REQ-2926, REQ-2928, REQ-2930
      depends: TSK-0724 (blocking) - the test is a check of group 2 and the image is the runner's.
- [ ] T-004 [P] TSK-0728 Ten synthetic profiles are classified, converge over 30 days and tell "knows" from "doesn't know"
      closes: REQ-2908, REQ-2910, REQ-2920
      depends: TSK-0724 (blocking) - group 3 runs in the runner.
- [ ] T-005 TSK-0726 The same seeds, times and verdicts give the same outcomes, branches, states, awards and finale
      closes: REQ-2924
      depends: TSK-0724 (blocking) - the test is a check of group 2.; TSK-0728 (blocking) - it reuses the harness's profiles and seeds.
- [ ] T-006 TSK-0729 A 60-minute simulated adventure yields enough scored attempts and keeps the success share in its corridor
      closes: REQ-2912, REQ-2914, REQ-2916, REQ-2918
      depends: TSK-0728 (blocking) - it supplies the profiles and the headless run.
- [ ] T-007 TSK-0730 A new knowledge-model version scores no lower than the last one on any simulation metric
      closes: REQ-2922
      depends: TSK-0728 (blocking) - the metrics are its checks' outputs.
- [ ] T-008 [P] TSK-0731 Automated checks replay recorded model answers, and a missing recording fails the check
      closes: REQ-2950, REQ-2952
      depends: TSK-0724 (blocking) - group 5 lives in the runner.
- [ ] T-009 TSK-0732 `verify --live` measures the discard share, the branch readiness and the Master's wait within $10
      closes: REQ-2932, REQ-2934
      depends: TSK-0724 (blocking) - the flag lives in the runner.; TSK-0731 (blocking) - it reuses the `verify` mode wiring and the stub provider.
- [ ] T-010 [P] TSK-0733 Every agent run ends with a handoff, and five unapproved drafts stop work that needs a new decision
      closes: REQ-2938, REQ-2940, REQ-2942, REQ-2944, REQ-2946
      depends: TSK-0724 (blocking) - the handoff reads the verify status.
- [ ] T-011 [P] TSK-0734 Group 1 refuses a decision log outside the record, a deferred item's trace and the player's personal data
      closes: REQ-2948
      depends: TSK-0724 (blocking) - the checks run in group 1.
- [ ] T-012 [P] TSK-0735 Verify reads the current stage from the record, and a stage opens only after the one before it is accepted
      closes: REQ-3000, REQ-3006, REQ-3008
      depends: TSK-0724 (blocking) - the runner calls the stage function.
- [ ] T-013 [P] TSK-0736 An adult runs a checklist on a real iPad at every stage, and 30 seconds without Wi-Fi lose no answer
      closes: REQ-2936, REQ-3002, REQ-3004, REQ-3010
      depends: TSK-0724 (blocking) - the Playwright test is a check of group 4.
- [ ] T-014 TSK-0737 The MVP and each backlog item are accepted from the player's play and a fast-guess share below 15 %
      closes: REQ-3012, REQ-3014, REQ-3016, REQ-3018
      depends: TSK-0724 (blocking) - the section is part of the report.; TSK-0735 (blocking) - criterion 5 reads the stage function.
- [ ] T-015 TSK-0738 A stage's acceptance task holds the verify report, the checklist result and the agent's two readings
      closes: REQ-3020, REQ-3708
      depends: TSK-0735 (blocking) - the page names the acceptance tasks the stage function reads.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0724.
- After TSK-0724: TSK-0725, TSK-0727, TSK-0728, TSK-0731, TSK-0733, TSK-0734, TSK-0735 and TSK-0736.
- After TSK-0728: TSK-0726, TSK-0729 and TSK-0730.
- After TSK-0731: TSK-0732.
- After TSK-0735: TSK-0737 and TSK-0738.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0724 | REQ-2900 |
| TSK-0725 | REQ-2902, REQ-2904, REQ-2906 |
| TSK-0726 | REQ-2924 |
| TSK-0727 | REQ-2926, REQ-2928, REQ-2930 |
| TSK-0728 | REQ-2908, REQ-2910, REQ-2920 |
| TSK-0729 | REQ-2912, REQ-2914, REQ-2916, REQ-2918 |
| TSK-0730 | REQ-2922 |
| TSK-0731 | REQ-2950, REQ-2952 |
| TSK-0732 | REQ-2932, REQ-2934 |
| TSK-0733 | REQ-2938, REQ-2940, REQ-2942, REQ-2944, REQ-2946 |
| TSK-0734 | REQ-2948 |
| TSK-0735 | REQ-3000, REQ-3006, REQ-3008 |
| TSK-0736 | REQ-2936, REQ-3002, REQ-3004, REQ-3010 |
| TSK-0737 | REQ-3012, REQ-3014, REQ-3016, REQ-3018 |
| TSK-0738 | REQ-3020, REQ-3708 |

The smallest set of tasks that would test the decision is TSK-0724, TSK-0731, TSK-0733, TSK-0734 and TSK-0735. Together they show whether one command reports every group by name, whether a check can run with no live model call, whether the agent's work stays inside approved scope, whether a deferred item can enter the tree, and whether a stage opens only after the one before it is accepted. Those are the failures the premortem names: a gate that passed on assumptions, stale recordings and a queue of drafts.

## Not covered

- The real runs: the first `verify --live` run, the two weeks of daily play and the parent's judgement at stage 0.3, and the real-iPad checklist at each stage. They need the Master, the family and a device that don't exist when this epic is done, so the tasks above build the commands, the report sections and the checklist, and each stage's acceptance task holds the results.
- The checks other decisions name for group 1 and group 2, such as ADR-0040's template checks, ADR-0100's gateway lint rule and ADR-0180's report and threshold checks: ADR-0190 owns the command and the report, and each decision's epic wires its check in.
- Group 8's budgets for load time, bundle size and frames per second: the research sets none, so group 8 reports its measurements and fails nothing until the specification step adds the rows to the Baselines table.
- The scope list's requirements for what the first version holds and defers: REQ-5076, REQ-5078 and REQ-5080 belong to ADR-0210, and TSK-0734 builds the guard they use.
