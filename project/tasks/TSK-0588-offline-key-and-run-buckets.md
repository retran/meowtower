---
id: TSK-0588
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-2708, REQ-2710, REQ-2712, REQ-2728]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Offline runs spend from their own key and stop at their own budgets: $40 for art, $25 for the bake-off, $0.5 for live art

After this task, the gateway refuses an offline role on the play key and a play role on the offline key outside `verify` mode, the art run stops at $40, the bake-off at $25, and live art is off in the MVP with a bucket of $0.5 an adventure once it arrives.

## Acceptance criteria

1. Given an offline role and the play key, when the call is built, then the gateway refuses it; given a play role and the offline key outside `verify` mode and outside a sandbox call, then it refuses that too (REQ-2728). Closed by: a unit test of each pairing.
2. Given `GATEWAY_MODE=verify`, when any call is built, then it uses the offline key, and a run's own `VERIFY_LIVE_BUDGET_USD` caps the run. Closed by: a unit test that records each call's key.
3. Given an art run whose spend reaches $40 and a bake-off whose spend reaches $25, when the next call is built, then it is refused and the run reports what it made (REQ-2708, REQ-2710). Closed by: a unit test for each bucket.
4. Given the MVP, when a call to `LIVE_ART_MODEL` is built, then the gateway refuses it because the role is off; a bucket of $0.5 an adventure exists for the role and is unused (REQ-2712). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the offline key, the `verify` mode and the three buckets to the engine of TSK-0585. A play role on the offline key is also allowed in a call marked as a sandbox call, and in the `bakeoff` mode that TSK-0594 sets, as ADR-0210 and ADR-0360 amend. The offline key's limit is set by the owner by hand before each run, so what remains equals the run's budget, and returned to the sandbox's $20 after it.

## Depends on

- TSK-0585 (blocking): the buckets use that task's reservation.

## Evidence

Not yet.

## Left alone

The sandbox's own bucket of $20 a month and its database file, which the epic realising ADR-0340 owns, and the art run itself, which ADR-0170 owns.
