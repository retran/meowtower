---
id: TSK-0592
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-1692]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A Master order that fails goes to the fallback model before the scene falls back to the library

After this task, every Master request names `[MASTER_MODEL, MASTER_FALLBACK_MODEL]`, so a failure at the first provider moves the same order to the second model before the caller retries or falls back.

## Acceptance criteria

1. Given a Master request, when its body is read, then `models` holds `MASTER_MODEL` and then `MASTER_FALLBACK_MODEL` (REQ-1692). Closed by: a unit test over the body.
2. Given a mocked failure at the first provider, when the request is made, then the same order is answered by the second model, and `llm_log` holds the provider that answered. Closed by: an integration test with a mocked OpenRouter.
3. Given both models fail, when the result returns, then it is a typed `ProviderFailed` and the caller plays the library scene. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `models` list to the `StoryRequest` builder of the gateway. The defaults are `z-ai/glm-5.3` for the Master and `z-ai/glm-5` for the fallback, from RES-1600, and each is set in `.env`.

## Depends on

- TSK-0580 (blocking): the list belongs to the roles of that gateway.

The epic realising ADR-0110 retries an order and falls back to the library after this task returns `ProviderFailed`.

## Evidence

Not yet.

## Left alone

What the Master's order holds and how a reply is checked, which ADR-0110 settles.
