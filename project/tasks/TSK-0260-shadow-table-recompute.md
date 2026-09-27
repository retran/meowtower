---
id: TSK-0260
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0020
closes: [REQ-2200, REQ-2242]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The shadow-table full recompute, `./meowtower recompute`, and the rebuild test

After this task, a full recompute rebuilds every registered projection into `<name>__next` while play goes on, catches up and swaps in one short transaction, touches none of the seven tables outside the projections, and runs on `./meowtower recompute`. A rebuild test proves each projection rebuilds identical from the log alone.

## Acceptance criteria

1. Given a 30-day log, when the test deletes each projection table in turn and recomputes with the same versions, then every row equals the row before in every column except `computed_at`. Closed by: `tests/integration/rebuild.test.ts`, run on the synthetic 30-day log now and on ADR-0190's simulated run once it exists.
2. Given the same log, when a recompute runs, then the row counts and a content hash of `blobs`, `explain_cache`, `devices`, `llm_log`, `art_jobs`, `frames` and `bakeoff` equal their values before it. Closed by: the same test.
3. Given a recompute running, when the test appends events during it, then no append waits for the rebuild beyond the swap transaction, and the swapped tables include the appended events. Closed by: the same test, reporting the longest append wait.
4. Given a stored projection that differs from a fresh derivation, when the verify check runs, then it reports `projection_diverged` with the table and the first differing row. Closed by: a test that edits one projection row.
5. Given a recompute that throws partway, when it ends, then the old projections are in place and the parent sees `recompute_failed` with the version and time. Closed by: a failure test and `./meowtower status` output.
6. Given a synthetic log of one year at ADR-0020's estimate of 180,000 events, when a full recompute runs on the Mac, then it finishes within 60 seconds, and a slower run raises `recompute_slow` once. Closed by: the measurement against ADR-0190's Baselines table. Above 10 minutes, ADR-0020 reverses to checkpoints.
7. Given `events` larger than 1 GB, when the check runs, then `log_large` is raised once. Closed by: a unit test with the size threshold injected.
8. Given the stack runs, when the parent runs `./meowtower recompute`, then it prints the tables rebuilt and the time taken. Closed by: the command's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the recompute to the projection registry of TSK-0250: build each registered table into `<name>__next` from `seq` 1 on its own connection, catch up to the head of the log, then apply the remaining events and rename the tables in one transaction, updating `derived_meta`. Rebuild only registered tables. Add the `recompute` subcommand to `./meowtower`, running inside `meowtower`, the `projection_diverged` and `recompute_slow` checks for the verify command, and the `recompute_failed`, `recompute_slow` and `log_large` notices. Add the fixture that writes a synthetic 30-day log and a synthetic year through `appendEvents`, from fixed seeds.

## Depends on

TSK-0250, because the recompute rebuilds the registered projections. TSK-0080, because the three notices reach the parent through the notices that task adds to the Parent Room and `./meowtower status`.

## Evidence

Not yet.

## Left alone

The start-up recompute on a version change and the versioned `node_snapshots` rows (TSK-0270).
