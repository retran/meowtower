---
id: TSK-0580
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-1642]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One gateway module opens every model connection and takes each role's model from `.env`

After this task, `src/server/gateway/` is the only code that opens a connection to a model service, each role reads its model id from `.env` at server start, and the gateway runs in `play` or `replay` mode and answers a request in `replay` mode from a recording with no network.

## Acceptance criteria

1. Given a role's model id changed in `.env`, when the server restarts, then the gateway uses the new id with no code change and no rebuild (REQ-1642). Closed by: an integration test that restarts the server with two `.env` files.
2. Given a source file outside `src/server/gateway/` that calls `fetch` to a host, when the lint verb runs, then the rule reports it, and a fixture of that file makes the rule's test fail. Closed by: the lint verb's output and the rule's fixture test.
3. Given `GATEWAY_MODE=replay` and a recording for a request's hash, when the request is sent, then the gateway answers from `tests/recordings/` and opens no connection; given no recording, then it fails as `recording_missing`. Closed by: a unit test with the network blocked.
4. Given the `tower` service, when it starts with `GATEWAY_MODE=verify` or `replay`, then it refuses to start. Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the gateway module with the roles ADR-0100 lists, each with a model id from `.env` and, fixed in code, its tier, key, budget bucket, timeout and request class. A setting can change a role's model and never its tier. Add the lint rule beside the existing `Math.random` rule, the mode switch with the `play` and `replay` modes, and the recordings lookup by the hash of the request body. The `verify` mode and the `bakeoff` mode are added by TSK-0588 and TSK-0594, which need the offline key. Choice I made: the module lives in `src/server/gateway/`, so the lint rule's allowed path is one directory.

## Depends on

Nothing in this epic. TSK-0090 keeps the keys in `.env`, so no key reaches a client.

## Evidence

Not yet.

## Left alone

The request classes, the egress guard, the tiers and the budgets, which the tasks after this one build into the module.
