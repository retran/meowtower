---
id: TSK-1044
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0390
closes: [REQ-6702, REQ-6704, REQ-6706, REQ-6708, REQ-6790, REQ-6798]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The profile model holds eight bars in a fixed order, no total, and serialises byte for byte

After this task, `src/parent/profile/` holds `ProfileModel` with exactly two top-level fields, `bars` and `meta`, and `computeProfile`, a pure function that takes the log and the versions as arguments and returns the model, so no later task has a place to put a total and no recompute can change a byte.

## Acceptance criteria

1. Given three fixture logs whose bar values sort differently, when `computeProfile` runs, then `bars` holds exactly eight entries keyed `basic_facts`, `computational_accuracy`, `conceptual_understanding`, `model_building`, `transfer`, `finding_patterns`, `retention` and `language_format` in that order, and no entry carries a rank or a comparison with other children (REQ-6704, REQ-6708). Closed by: a schema test over the three logs.
2. Given a `ProfileModel` fixture with a field `total`, `sum` or `average` at the top level or in `meta`, when the schema validates it, then the schema rejects it; given a report model whose home scale θ is set to the marker 0.123456, when the profile is built, then the serialised profile doesn't contain the marker (REQ-6706, REQ-6798). Closed by: a schema test and a marker search.
3. Given one fixture log, when `computeProfile` runs twice and a third time after a full recompute of the projections, then the three outputs are byte-identical, with sorted keys and every share and bound rounded to 6 decimals by one function (REQ-6790). Closed by: a reproducibility test.
4. Given the event catalogue before and after this task, when the two are compared, then no event type and no payload field was added for the profile, and `computeProfile` takes a read-only handle to the log (REQ-6702). Closed by: the event schema test, which fails on a changed catalogue, and a type test that passes a write handle and fails to compile.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Create `src/parent/profile/model.ts` with the schema (zod, strict) and `src/parent/profile/compute.ts` with `computeProfile`. Each of the eight entries starts in the state `no_data`, and the tasks that follow fill them. `meta` holds the mapping version, which TSK-1045 fills, beside the model, threshold, graph and content versions of `DerivedMeta`. Serialise through one function that sorts keys and rounds every share and bound to 6 decimals; I chose 6 because it holds every percentage point the screen shows and absorbs no difference a replay can produce.

The epic realising ADR-0180 supplies `ReportModel` and the report rebuild that writes the `profile` part into `report_cache`. Until it exists, a test calls `computeProfile` directly and nothing stores the result.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

What each bar reads, which TSK-1047 to TSK-1053 build, and the screen, which TSK-1055 builds.
