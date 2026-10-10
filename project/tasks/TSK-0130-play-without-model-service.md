---
id: TSK-0130
artifact: task
status: superseded
revised: 2026-10-10
epic: EPC-0010
closes: []
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The adventure plays on without the model service

After this task, a test blocks OpenRouter at the network and plays a simulated adventure day to its finale on library and pool texts, and the Parent Room shows `model_service_down` for the parent.

## Acceptance criteria

1. Given OpenRouter blocked at the network for the `tower` container, when a simulated adventure day runs, then it reaches its finale and every text shown comes from the scene library or the fallback pools. Closed by: the simulation's report.
2. Given the same run, when the parent opens the Parent Room, then it shows `model_service_down` as one line, and the player's screens show nothing about it. Closed by: an end-to-end test.
3. Given a full simulated day that goes through ADR-0100's gateway in `replay` mode, with a fake value set for each of `OPENROUTER_PLAY_KEY` and `OPENROUTER_OFFLINE_KEY`, when Playwright records every response body and header the client receives over it, then no response carries either value or the prefix `sk-or-` (REQ-2504). Closed by: the Playwright report of that run. Moved here from TSK-0090 on 2026-10-10.

## What to do

Add the network block for the test, the check that no request path waits on the model service without a deadline, and the Parent Room line, as SPC-0010 states them.

## Depends on

Dropped from EPC-0010 on 2026-10-10. Its simulated day needs the epics realising ADR-0040, ADR-0100 and ADR-0110, and none is written, so the task could not be done and held the chain at its next step. The epic realising ADR-0100 takes this text as a task of its own, with the criteria below, and closes REQ-2506 there; REQ-2504's part of it, criterion 3, is carried with it.


TSK-0050, because the line shows in the Parent Room. Outside this epic, the simulated day needs the epics realising ADR-0030, ADR-0040, ADR-0100 and ADR-0110, which don't exist yet.

## Evidence

Not yet.

## Left alone

The gateway's timeouts and the pools' content, which ADR-0100 and ADR-0110 define.
