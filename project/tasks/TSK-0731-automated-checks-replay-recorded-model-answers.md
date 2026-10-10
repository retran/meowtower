---
id: TSK-0731
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-2950, REQ-2952]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Automated checks replay recorded model answers, and a missing recording fails the check

After this task, every automated check reaches a model only through the gateway in `replay` mode, which answers from `tests/recordings/` by the hash of the request and opens no network connection, and the no-shame check replays the model that play uses for it.

## Acceptance criteria

1. Given verify runs with every outgoing connection blocked, when the model-dependent checks run, then they pass on recordings and no connection is attempted (REQ-2950). Closed by: an integration test that fails on any socket connect.
2. Given a request with no recording, when its check runs, then the check fails as `recording_missing` and names the request, and no network call is made (REQ-2950). Closed by: an integration test that deletes one recording.
3. Given the no-shame check, when it replays, then the recordings it reads were made by the model the role table routes that check to in play, and a recording by another model fails the check (REQ-2952). Closed by: an integration test that reads the role table and each recording's model field.
4. Given `verify --record`, when it runs, then the gateway is in `verify` mode, makes each call that has no recording on the offline key, stores the answers and never gates a stage. Closed by: an integration test with the stub provider.
5. Given a recording no test has used for 30 days, when `artifacts/` and `tests/recordings/` are tidied, then it is dropped; given a recording used yesterday, then it stays. Closed by: an integration test with a fake clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the replay wiring to group 5 and the `--record` mode to the runner. Recordings come from synthetic inputs only, so no personal value reaches the repository. The gateway's `replay` and `verify` modes, the model roles and the judge belong to the epics realising ADR-0100 and ADR-0350; until they exist the tests use a stub gateway with the same two modes.

A recording goes stale when a prompt changes, and each change adds requests without recordings. `verify --record` spends a little of the offline key to fill them, as a deliberate step outside the gate.

## Depends on

- TSK-0724 (blocking): group 5 and the `--record` flag live in the runner.

## Evidence

Not yet.

## Left alone

The live run against real models, which TSK-0732 builds, and the blind solve and safety check of each template's explanation, which ADR-0120's epic supplies to group 5.
