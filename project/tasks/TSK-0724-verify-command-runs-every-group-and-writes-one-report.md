---
id: TSK-0724
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-2900]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One verify command runs every check group in the tools container and writes one report

After this task, `docker compose run --rm tools npm run verify` runs the nine check groups of ADR-0190 against fixed seeds, writes `artifacts/verify-report.html` and `artifacts/verify-report.json`, exits 0 only when every group required at the current stage passes, and names each group not yet required, so a group nobody ran never reads as green.

## Acceptance criteria

1. Given the repository at stage 0, when `docker compose run --rm tools npm run verify` runs, then both report files exist, groups 1, 4 and 9 have run, every other group is listed by name as `not_required_yet`, and after 21 runs `artifacts/` holds the reports of the last 20 only (REQ-2900). Closed by: the command's output, the two files, and an integration test that runs the runner 21 times against fixture groups.
2. Given a required check that fails, when verify ends, then it exits non-zero and the report names the group, the check and the failing case as `verify_red`; given only a group that isn't required yet would fail, then it exits 0 (REQ-2900). Closed by: two integration tests with a failing fixture check.
3. Given `verify --fast`, when it runs, then it runs group 1 and group 2 on 1,000 seeds, and its report states that it gates no stage (REQ-2900). Closed by: an integration test that reads the report's `gate` field.
4. Given a value in `verify/baselines.json` that differs from the Baselines table of ADR-0190, when group 1 runs, then it fails and names the budget; given a measurement past its baseline, then the report records a baseline finding and the full verify still passes. Closed by: two integration tests, one with an edited value and one with a measurement over its budget.
5. Given verify is pointed at the data directory the `meowtower` service uses, when it starts, then it refuses to start; given its own data directory, then it starts. Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `tools` service to `compose.yaml` with an image that carries Node, the project's dev dependencies and Playwright's browsers, the runner under `tools/verify/`, the report writers and `verify/baselines.json` with each budget's source record beside it. The runner calls the groups and reads `verify/`, and a group reads the code under `src/` and never changes it. Each group declares the first stage at which it is required. A group is required once any of its checks is.

Verify runs on its own data directory and reads the newest file in `data/snapshots/`; it never writes there. The report prints each baseline beside its measured value, as ADR-0190's Baselines table lists them, with the budget of 3 minutes for `verify --fast` and 30 minutes for a full verify among them. A measurement past a baseline is recorded as a defect and the baseline doesn't move to meet it.

The runner takes the current stage from the stage function TSK-0735 builds. Until that task lands, the tests pass the stage explicitly and no file holds it. Other tasks of this epic and the epics of the decisions that name checks add their groups' content; this task builds the frame and the three groups ADR-0190 requires at stage 0.

## Depends on

Nothing.

## Evidence

Not yet.

## Left alone

The content of each check another decision names, which that decision's epic builds, and the groups' own checks, which the other tasks of this epic add. The browsers' matrix after the MVP, and group 8's budgets, which the specification step still has to set.
