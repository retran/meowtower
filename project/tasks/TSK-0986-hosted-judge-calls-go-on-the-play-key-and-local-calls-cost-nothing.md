---
id: TSK-0986
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0350
closes: [REQ-2732]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Hosted judge calls go on the play key, and local calls carry no key, reserve nothing and replay from recordings

After this task, every hosted judge call in `play` mode goes on the play key and counts inside its monthly limit, and every local call writes an `llm_log` row with cost 0 and no key.

## Acceptance criteria

1. Given the gateway's key table, when the static test reads it, then `JUDGE_MODEL` and `SAFETY_MODEL` have the play key in `play` mode, `SAFETY_MODEL` as a fallback and as a standby route included, and the local route has no key (REQ-2732). Closed by: a static test.
2. Given a local call, when it completes, then `llm_log` holds a row with provider `local`, the judge's name, the file hash, the check, the latency, the parsed answer, cost 0 and no key, and nothing was reserved from any bucket (REQ-2732). Closed by: a gateway test.
3. Given `replay` mode, when a local request arrives, then the gateway answers it from `tests/recordings/` by the request's hash, which holds the judge's name and file hash, and a stub that fails on any network call stays unused (REQ-2732). Closed by: a replay test; `verify --record` records local answers on the family Mac.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the key assertion and the local `llm_log` row. A hosted judge billed on another key would escape the monthly limit that stops a bug the daily caps miss, so the static test fails on any other key; a judge on the Mac spends nothing from the key.

## Depends on

- TSK-0982 (blocking): the local call and its answer reading exist there, and this task adds the log row and the replay path to it.

The epic realising ADR-0100 supplies the key table, the modes and `llm_log`; until it exists the task runs on a stand-in key table with the same two entries. The epic realising ADR-0190 supplies `verify --record`.

## Evidence

Not yet.

## Left alone

The play key's monthly count, which counts only calls on that key and which the epic realising ADR-0100 owns.
