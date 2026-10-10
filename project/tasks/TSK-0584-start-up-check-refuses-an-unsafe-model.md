---
id: TSK-0584
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-1644, REQ-1646, REQ-2628]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server refuses to start when a configured model is missing or a player-tier model has no zero-retention endpoint

After this task, the server reads both OpenRouter catalogue listings and the zero-retention list before it listens, refuses to start on a missing model or on a player-tier model without an endpoint at an allowed provider, and starts with live calls off when the catalogue can't be reached.

## Acceptance criteria

1. Given a configured model absent from the catalogue, image and judge models included, when the server starts, then it refuses and the message names the role, the model and the missing fact (REQ-1644). Closed by: an integration test with a mocked catalogue.
2. Given a player-tier model, an entry of `MASTER_MODEL_CHOICES` included, with no zero-retention endpoint at a provider the tier allows, when the server starts, then it refuses with the same naming (REQ-2628). Closed by: an integration test.
3. Given a role's model changed in `.env`, when the server starts, then the check runs on the new value before any call uses it (REQ-1646). Closed by: an integration test that changes one role.
4. Given the catalogue unreachable, when the server starts, then it starts with every live call off and plays on the library and the cache; the check retries every 10 minutes and the first pass turns live calls on. Closed by: an integration test with a fake clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the check to the server's start-up, reading the default listing, the image-output listing and `GET /api/v1/endpoints/zdr`. Log `model_config_invalid` and `models_unverified` for the two states, as the failure table of ADR-0100 names them. The 10-minute retry is a period ADR-0100 chose. Also refuse a provider in `content/providers.json` that has no row of company, country and retention, which ADR-0370 added. Between checks `zdr: true` on each request keeps the guard.

## Depends on

- TSK-0580 (blocking): the check reads the roles of that gateway.
- TSK-0583 (blocking): the check reads the player-tier list that task builds.

## Evidence

Not yet.

## Left alone

The question for the owner whether a refused start should become a fallback-only start, which ADR-0100 leaves open and the approved requirements answer with a refusal.
