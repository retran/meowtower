---
id: TSK-0583
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-2614, REQ-2616, REQ-2618, REQ-2620, REQ-2622, REQ-2624, REQ-2626, REQ-2644]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each request goes under a privacy tier its role fixes, to a provider list the owner can change without a rebuild

After this task, every request carries `data_collection: "deny"`, a player-tier request also carries `zdr: true` and the player list, and the two lists come from `.env` and apply at a restart with no rebuild.

## Acceptance criteria

1. Given a recorded full simulated adventure, when every request body is read, then each has `data_collection: "deny"`, and each player-tier request has `zdr: true` and `only` set to the player list (REQ-2614, REQ-2616, REQ-2618). Closed by: a test with a mocked OpenRouter.
2. Given the default lists, when they are read, then the player tier holds Google Vertex, Amazon Bedrock, Azure and xAI, with Mistral for GLM models only and TypeSafe for Jev only, and the content tier adds Anthropic, OpenAI, Google AI Studio, Seed and Mistral (REQ-2622, REQ-2624). Closed by: a unit test over the defaults.
3. Given a request outside the player tier, when it is built, then its `only` list is the player list plus the content list, and a request that carries story material or an explanation never gets the content list (REQ-2620). Closed by: a unit test with both kinds.
4. Given `PLAYER_TIER_PROVIDERS` changed in `.env`, when the server container restarts, then the new list applies with no rebuild; a role's tier can't be changed by any setting (REQ-2626). Closed by: an integration test with two `.env` files, and a unit test that tries to move the Master to the content tier.
5. Given a request with a region, when it is built, then the gateway applies no region filter (REQ-2644). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the tier to each role's fixed attributes, build the `provider` block from the role's tier and the two settings, and refuse a role whose request class belongs to a stricter tier. The Master, the planner, the Explainer, `LIVE_CHECK_MODEL`, `SAFETY_MODEL` and `JUDGE_MODEL` sit in the player tier; every other role sits in the content tier. The owner's OpenRouter account settings (no storage, no training, no provider outside the two lists, REQ-2614's other half) are set by hand at stage 0 and aren't code.

## Depends on

- TSK-0580 (blocking): the tier is a fixed attribute of that gateway's roles.

## Evidence

Not yet.

## Left alone

The start-up check that a model has a zero-retention endpoint, which TSK-0584 adds, and the owner's hand work in the OpenRouter account.
