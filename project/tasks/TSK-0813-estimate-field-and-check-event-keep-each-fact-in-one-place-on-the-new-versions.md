---
id: TSK-0813
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0240
closes: [REQ-5356, REQ-5358, REQ-5072]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The estimate is a field of the attempt, each check is a `self_check_used` event, and each fact has one record

After this task, `attempt_submitted` carries `estimate` with `option` and `value` and `timings.checkMs`, `verdict` carries `estimateRight` and `estimateLabel`, `item_shown` carries the estimate's four values and the correct index, the log accepts `self_check_used` with owner ADR-0240, and no `estimate_submitted` type exists.

## Acceptance criteria

1. Given an attempt with an estimate, when `attempt_submitted` is read, then it holds `estimate` with `option` (0 to 3) and `value` as a rational, and its `verdict` holds `estimateRight` as a boolean the server judged with the exact answer (REQ-5358). Closed by: a schema test and an integration test.
2. Given a use of the check, when the log is read, then `self_check_used` holds `itemId`, `preliminaryRaw`, `checkRaw`, `checkParsed`, `target` and `match` (REQ-5356). Closed by: a schema test and an integration test.
3. Given a search of the log schemas, when it looks for `estimate_submitted` and for a `selfCheck` field on `attempt_submitted`, then it finds neither, and a recompute over a log with estimates and checks rebuilds every count from the log alone (REQ-5072, REQ-5356). Closed by: the schema search test and a recompute test.
4. Given an item with an estimate, when its `item_shown` is read, then it holds the four values and the index of the correct one and an empty `forms` (REQ-5358). Closed by: a schema test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add each field to the one new version of the three types that the epic realising ADR-0210 registers for the whole addendum, and never register a second version for it: `estimate` and `timings.checkMs` on `attempt_submitted`, `estimateRight` and `estimateLabel` on `verdict`, and the options and the correct index on `item_shown`, each optional. Register `self_check_used` with owner ADR-0240. A fact that arrives in the same request as the answer is a field, and a fact she commits before the answer is a type of its own, as ADR-0210 sets; so the estimate, which arrives with the answer, is a field, and each check, which comes before it, is a type.

The addendum's `self_corrected` is no field: the report derives it from the preliminary answer and the first attempt.

## Depends on

Nothing.

The epic realising ADR-0210 supplies the one new version and the owner field; until that work lands, this task registers the version with these fields, and ADR-0210's work adds its own fields to the same version.

## Evidence

Not yet.

## Left alone

What writes each field, which TSK-0806 and TSK-0811 hold, and the projections `estimate_stream` and `check_week`, which TSK-0808 and TSK-0815 hold.
