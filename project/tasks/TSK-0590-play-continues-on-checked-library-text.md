---
id: TSK-0590
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-2714, REQ-2726]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# When a budget runs out or the service is down, the game plays checked library text at its usual pace

After this task, a spent adventure budget or a blocked OpenRouter leaves the adventure running on the scene library and the fallback pools with no live frames, no text that hasn't passed a safety check is shown, and the simulated day through the gateway shows no key in any response.

## Acceptance criteria

1. Given an adventure bucket spent on the second floor, when the adventure continues, then it reaches its finale on library and pool text with no live frame, at the story's usual pace (REQ-2714). Closed by: an integration test over a simulated adventure.
2. Given any bucket spent, when a generated text sits unchecked because its check can't be paid for, then the gateway drops it and only library text checked offline shows (REQ-2726). Closed by: a unit test that spends the bucket between a reply and its check.
3. Given OpenRouter blocked at the network for the `tower` container, when a simulated adventure day runs, then it reaches its finale and every text shown comes from the library or the pools, and the Parent Room shows `model_service_down` as one line while the player's screens show nothing about it (REQ-2506). Closed by: the simulation's report and an end-to-end test.
4. Given the same day through the gateway in `replay` mode with a fake value set for each of `OPENROUTER_PLAY_KEY` and `OPENROUTER_OFFLINE_KEY`, when Playwright records every response body and header, then no response carries either value or the prefix `sk-or-`. Closed by: the Playwright report of that run.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Return a typed `BudgetExhausted` or `ProviderFailed` to every caller, add the network block for the test, the check that no request path waits on the model service without a deadline, and the Parent Room's `model_service_down` line. This text comes from TSK-0130, which EPC-0010 dropped on 2026-10-10 because it needed this gateway; REQ-2506 is addressed by ADR-0010 and stays open there until this task closes it, so criterion 3 is the one place it can close.

## Depends on

- TSK-0585 (blocking): the typed result comes from that task's refusal.

The epics realising ADR-0040, ADR-0030 and ADR-0110 supply the generated tasks, the routes and the library; until they land the simulated day runs on the stand-in routes of `src/server/standin.ts` and the library the scenes already use.

## Evidence

Not yet.

## Left alone

What the Master plays from the library when a live scene is refused, which ADR-0110's epic builds.
