---
id: BUG-0010
artifact: bug
status: done
pr: 150
severity: major
violates: REQ-8236
enters: implement
found: 2026-11-15
revised: 2026-11-15
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The direct route refuses the schema of a scenario reply, so no scenario can be written

The scenario writer asks for its draft with the JSON schema of `Scenario`, and Anthropic's direct route answers 400 because that schema holds number limits it does not accept, so a generation never gets past its first draft.

## Reproduction

Seen at revision `7303d95` of `main`, on 2026-11-15, with `SHOWRUNNER_MODEL` set to a Claude model on the direct route and a valid key. From a state with no data:

1. Build the gateway with `createGateway` over a fresh database and `liveRoutes(config)`.
2. Call `writeScenario(gateway, { bucket, lang: "ru", brief: "autumn fog over a canal", minChecks: 5 })`.
3. The plan, its critique and the rewritten plan are answered, then the first draft is refused.

It happens every time, because the schema never changes.

## What the system does

The plan, the critique and the rewritten plan cost 0.0723 dollars over 53 seconds. The fourth call, the draft, returns no tokens, and the gateway logs `provider_failed` with this response from the provider: `400 invalid_request_error: output_config.format.schema: For 'integer' type, properties maximum, minimum are not supported`. `writeScenario` returns null with the cause `provider_failed`, and the studio shows the generation as failed for the provider.

## What it should do, and why

An agent returns a structured reply that code reads (REQ-8236), so the schema must be one the provider accepts. The code validates ranges itself after the reply, with `Scenario.parse` and `checkScenario`, so the schema sent to the model need not carry them.

## Triage

It enters at implement, because REQ-8236 already requires the reply and the cause is known. Severity major: the generation of an adventure cannot work on the real model at all, and nothing but a live call shows it, since every test uses a stand-in gateway.

## Closed by

A test that the body the direct route sends for `Scenario` holds no number or length limit the provider refuses, and a live run of the writer that reaches its first draft.

## Plan

1. The gateway removes the keywords the provider does not support from a schema before it sends it, on the direct route and on OpenRouter. It touches `src/server/gateway/routes.ts`.
