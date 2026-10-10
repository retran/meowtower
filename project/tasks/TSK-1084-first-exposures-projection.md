---
id: TSK-1084
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0410
closes: [REQ-6934, REQ-6938, REQ-6940, REQ-6944, REQ-6958, REQ-6960, REQ-6962]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `first_exposures` marks each first show of a subtype, format and context once, at its highest kind, with its category

After this task, the `knowledge` projection `first_exposures` reads the log and gives one `firstExposure` for the first show of each subtype, of each subtype in a format and of each subtype in a context, with its kind, distance, category and `transferred`, and it counts no later attempt.

## Acceptance criteria

1. Given a fixture log whose first show of subtype S is in format F and context C, when the projection runs, then it holds one row of kind `subtype` for S and none for the pairs (S, F) and (S, C), which become used, and a later show of S in a new format gives one row of kind `format` (REQ-6934, REQ-6944). Closed by: the projection test.
2. Given a show new on all three counts, when the projection runs, then it gives one row of the highest kind, subtype before format before context (REQ-6944). Closed by: the projection test.
3. Given a row of kind `subtype`, then `distance` is `far`; given kind `format` or `context`, then `near`; and every row carries `kind`, `distance`, `eligible`, `reason` and `expected` (REQ-6938, REQ-6940). Closed by: the projection test and the row schema test.
4. Given a first attempt with no hint, when the row is built, then `category` is «сама» and `transferred` is true; given a first attempt after a rung 1 hint, then `category` is «хватило первой ступени» and `transferred` is false, and so for «с опорой» and «требует обучения» (REQ-6958, REQ-6960). Closed by: the projection test, one fixture for each category.
5. Given a second attempt on a subtype, format or context already met, when the projection runs, then it gives no observation for it (REQ-6962). Closed by: the projection test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `first_exposures` to the projection registry of ADR-0020 in the `knowledge` class. It reads, show by show in `seq` order, the subtype and `format` from `item_shown` and the context from the `frame_accepted` of the show's `frameId`, and extends the used sets TSK-1080 folds. A bare task and a live frame add no context. It writes no event and keeps `firstExposure` off `item_shown`, so the projection can be corrected when the list grows. A row has at most one per subtype, subtype-and-format pair and subtype-and-context pair, and `first_exposures_ceiling` reports once in `./meowtower status` at 20,000 rows. The first attempt alone is the observation, sorted into the four categories of the weekly breakdown.

A letter's show marks its subtype, format and context used and gives no observation, as ADR-0460 settles. `eligible`, `reason` and `expected` start as fixture values here; TSK-1085 and TSK-1086 fill them.

## Depends on

- TSK-1078 (blocking): the context of a show comes from its frame's acceptance.
- TSK-1080 (blocking): the projection extends the used sets that task folds.

The epic realising ADR-0400 supplies the weekly breakdown's categories by depth of help; until it exists the task reads the hint rung of the first attempt through a stand-in function with the four categories ADR-0410 names.

## Evidence

Not yet.

## Left alone

Eligibility, which TSK-1085 sets, the model-version rule for `expected`, which TSK-1086 sets, and the report, which TSK-1089 builds.
