---
id: TSK-0732
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-2932, REQ-2934]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `verify --live` measures the discard share, the branch readiness and the Master's wait within $10

After this task, `verify --live` plays 10 simulated adventures of about 90 rooms with real model calls on the offline key, reports the share of live frames discarded, the share of rooms with both branches ready and the 95th percentile of the wait for the Master, and stops at its budget of $10.

## Acceptance criteria

1. Given a stub provider that discards 31 % of live frames, when the live run ends, then it fails the discard check; given 30 %, then it passes (REQ-2932). Closed by: two integration tests with the stub in `verify` mode.
2. Given a stub under which both branches are ready before the room ends in 94 % of rooms, when the run ends, then it fails the branch check; given 95 %, then it passes (REQ-2934). Closed by: two integration tests.
3. Given the log of the run, when the report computes the 95th percentile of the wait from `free_text` to `scene_shown` over a first-try reply, a retried reply, a library scene and the pool line alike, then it passes at 6 seconds or less and fails above. Closed by: an integration test with a fixture log.
4. Given the run reaches `VERIFY_LIVE_BUDGET_USD`, which is $10, when the next call is about to start, then the run stops as `live_budget_spent` and the report marks what it measured as incomplete. Closed by: an integration test with a budget of $0.50.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `verify --live` to the runner. It runs the gateway in `verify` mode, in which every call, play roles included, spends from the offline key. Before each real run the owner sets the key's limit so that what remains equals the run's budget, and afterwards sets it back. The run is required at the stage 0.3 acceptance and after every change of a model role. A run of about 90 rooms is what makes a 95 % share rest on enough rooms to mean something.

The tests use the stub provider, so no real call is made by this task. The first real run belongs to the stage 0.3 acceptance and needs the Master of the epic realising ADR-0110 and the frames of the epic realising ADR-0130.

## Depends on

- TSK-0724 (blocking): the flag lives in the runner.
- TSK-0731 (blocking): it reuses the gateway's `verify` mode wiring and the stub provider.

## Evidence

Not yet.

## Left alone

The Master's own 6-second budget and its split, which ADR-0110 owns, and the offline key's limit, which the owner sets and ADR-0100 owns.
