---
id: TSK-0694
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-2826, REQ-2838]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An art run starts only with its models and references, and stops at its budget

After this task, a run reads both OpenRouter model listings and the key-art folder before it makes anything, refuses to start when a configured model or the folder is missing, and starts no new generation once the cost the provider reported for the run reaches `ART_BUDGET_USD`.

## Acceptance criteria

1. Given a stub whose reported costs add up past a run budget set below them, when the queue is about to start a generation, then it starts none once the sum in `llm_log` for this run has reached the budget, reports `art_budget_reached` with what is done, and the next run resumes from the first missing variant (REQ-2826). Closed by: an integration test with the stub and a budget of $0.50.
2. Given the stub answers 402 on the offline key, when a generation is requested, then no job's error count changes, no new generation starts, the run reports `offline_key_refused` with what is done, and the next run resumes. Closed by: an integration test.
3. Given a default listing that lacks `bytedance-seed/seedream-4.5` and an image-filtered listing that holds it, when the model check runs, then it reports nothing missing; given a model in neither listing, then the run refuses to start with `art_model_missing` naming the role and the model (REQ-2838). Closed by: two unit tests with recorded listings.
4. Given `design/key-art/` is absent, when a run is asked for, then it doesn't start, reports `art_references_missing` and changes no job. Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Before each generation, sum the cost OpenRouter reported in `llm_log` for this run and compare it with `ART_BUDGET_USD`, which ADR-0100 sets at $40 and the offline key's limit backs. The sum alone enforces the budget, so the generations in flight when it reaches the value can pass it by their reserved cost, and the report says so. The offline key's limit and each call's reservation belong to ADR-0100.

Run the model check before the first generation by reusing ADR-0100's start-up check, and have it read the default listing and the listing filtered by `output_modalities=image`. A model is missing only when neither lists it, because image-only models appear in the filtered listing alone. The tool reads the key art from `design/key-art/` by that path, which CLAUDE.md fixes.

Until the epic realising ADR-0100 supplies the real `llm_log` and the listings, the tests use the stub gateway of TSK-0693 and recorded listing files.

## Depends on

- TSK-0693 (blocking): the budget stop and the resume read the job rows and slot counts it creates.

## Evidence

Not yet.

## Left alone

The value of the budget, the offline key and the model roles, which ADR-0100 owns, and the `ART_MODEL_BG` fallback, which TSK-0697 builds into the request.
