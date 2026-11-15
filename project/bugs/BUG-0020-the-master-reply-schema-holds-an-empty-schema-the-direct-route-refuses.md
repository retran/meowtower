---
id: BUG-0020
artifact: bug
status: approved
severity: major
violates: REQ-8236
enters: implement
found: 2026-11-15
revised: 2026-11-15
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The direct route refuses the schema of the Master's reply, so no turn of the Master can run

The Master's reply schema declares the input of each tool call as any value, which is an empty schema, and Anthropic's direct route answers 400 because a structured reply needs a concrete type, so every turn of the Master fails.

## Reproduction

Seen at revision `29a7b5a` of `main`, on 2026-11-15, with `MASTER_MODEL` set to a Claude model on the direct route and `ANTHROPIC_ZDR_ATTESTED` true. From a state with no data:

1. Build the gateway with `createGateway` over a fresh database and `liveRoutes(config)`.
2. Call `takeTurn` with `gatewayMaster(gateway, bucket)`, a scenario and her words.
3. The first call is refused.

It happens every time, because the schema never changes.

## What the system does

The call returns no tokens and the gateway logs `provider_failed` with this response: `400 invalid_request_error: output_config.format.schema: Empty schema ({}) that accepts any JSON value is not supported. Please specify a concrete type.` `takeTurn` throws `MasterFailed` with the reason `provider_failed`, and the studio answers 502.

## What it should do, and why

The Master returns a structured reply that code reads (REQ-8236), so the schema must be one the provider accepts. The schema can name each tool and its input, which code already validates after the reply with `parseToolCall`.

## Triage

It enters at implement, because REQ-8236 already requires the reply and the cause is known. Severity major: no turn of the Master can run on the real model, and nothing but a live call shows it, since every test uses a stand-in model. It shares its root with BUG-0010: a schema the provider refuses.

## Closed by

A test that no schema the code sends holds an empty schema, and a live turn of the Master that is answered.

## Plan

1. The Master's reply schema names each tool and its input, one entry for each tool of the Master. It touches `src/story/master-gateway.ts`.
