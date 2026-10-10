---
id: TSK-0594
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-1648, REQ-1650, REQ-1652, REQ-1654, REQ-1656]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The bake-off sends every candidate through the play route, scores answers blind and excludes a model with a safety failure

After this task, `tools/bakeoff.ts` sends the 12 prompts of RES-1600 to each candidate through the gateway with the tier and provider list play would use, stores anonymised answers for the parent's blind scoring, excludes a model with any safety failure, and only an owner-approved decision record puts a model into play.

## Acceptance criteria

1. Given the candidate list, when the tool runs against a mocked OpenRouter, then it includes GLM 5.3, Claude Haiku 4.5, Gemini 3.8 Flash and GPT-6 Luna, and the fallback GLM 5, and sends 12 prompts to each (REQ-1652). Closed by: an integration test over the request log.
2. Given each candidate's request, when its body is read, then it has the provider block and `only` list play would use for that role (REQ-1654). Closed by: a test comparing the bake-off's request with play's for each role.
3. Given the stored answers, when the `bakeoff` table is read, then the answers carry no model name and the scoring route reveals none before the parent has scored (REQ-1648). Closed by: an integration test over the table and the route.
4. Given a candidate with one safety failure, when the result is read, then it is excluded from the list the tool proposes (REQ-1650). Closed by: a unit test.
5. Given `.env` that names a model absent from every approved decision record, when the server starts, then it refuses (REQ-1656). Closed by: an integration test with and without the record.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `tools/bakeoff.ts`, which runs on the offline key under the $25 bucket of TSK-0588 in the `bakeoff` mode ADR-0360 adds. It runs play roles on the offline key through the play route, and a local candidate through the local route when ADR-0350's epic adds it. The parent's scoring screen is ADR-0180's; this task stores the answers and exposes a route that returns one anonymised answer at a time.

## Depends on

- TSK-0583 (blocking): the tool uses the tiers and provider lists that task builds.
- TSK-0588 (blocking): the tool runs on that task's offline key and bucket.

## Evidence

Not yet.

## Left alone

The owner's approval of the decision record that names the models, which is the owner's action and no code, and the run's cost, which the bucket bounds.
