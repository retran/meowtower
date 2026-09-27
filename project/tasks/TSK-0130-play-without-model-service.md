---
id: TSK-0130
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0010
closes: [REQ-2506]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The adventure plays on without the model service

After this task, a test blocks OpenRouter at the network and plays a simulated adventure day to its finale on library and pool texts, and the Parent Room shows `model_service_down` for the parent.

## Acceptance criteria

1. Given OpenRouter blocked at the network for the `tower` container, when a simulated adventure day runs, then it reaches its finale and every text shown comes from the scene library or the fallback pools. Closed by: the simulation's report.
2. Given the same run, when the parent opens the Parent Room, then it shows `model_service_down` as one line, and the player's screens show nothing about it. Closed by: an end-to-end test.

## What to do

Add the network block for the test, the check that no request path waits on the model service without a deadline, and the Parent Room line, as SPC-0010 states them.

## Depends on

TSK-0050, because the line shows in the Parent Room. Outside this epic, the simulated day needs the epics realising ADR-0030, ADR-0040, ADR-0100 and ADR-0110, which don't exist yet.

## Evidence

Not yet.

## Left alone

The gateway's timeouts and the pools' content, which ADR-0100 and ADR-0110 define.
