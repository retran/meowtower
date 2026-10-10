---
id: TSK-1086
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0410
closes: [REQ-6942]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A rebuild keeps the `expected` each show had under the model version active then

After this task, each row of `first_exposures` holds the model's chance of success for the subtype under the model, threshold and graph versions active at its show, a full recompute keeps that value, and a model file that can't load makes the row ineligible with no `expected`.

## Acceptance criteria

1. Given a log with a show under model v1 followed by `model_activated` for v2, when the projection recomputes in full, then the `expected` of that show equals its value under v1 and a show after the activation holds the value under v2 (REQ-6942). Closed by: the recompute test.
2. Given `content/model.v1.json` removed, when the table is rebuilt, then the rows of v1 shows read `eligible: false`, `reason: version_missing` and `expected: null`, and the server reports `first_exposure_version_missing` once at start (REQ-6942). Closed by: the recompute test with the file removed.
3. Given a build that lacks `content/model.vN.json` for a version below the current one, when verify runs, then `model_files_kept` fails and names the version. Closed by: the check's fixture test.
4. Given a log replayed under a newer model version, when a hold's release is recomputed, then the hold releases on the same show as it did in play, because it reads the tested state recorded under the versions active then. Closed by: a replay test over a fixture log with two versions.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Compute `expected` by ADR-0070's formula under the versions active at each show, from `model_activated`, `settings_changed` and `fact_threshold_set`, as SPC-0020 does for `node_snapshots`. A full recompute keeps the model-derived fields of every row whose show fell under an earlier version set and recomputes the rest from the log. A rebuild after the table is lost replays each version set over the part of the log it governed. Add `model_files_kept` to group 1 of ADR-0190's verify command.

## Depends on

- TSK-1084 (blocking): it keeps the model-derived fields of that task's rows.

The epic realising ADR-0060 supplies the model files, the version events and the formula's inputs; until it exists the task runs on fixture model files with two versions.

## Evidence

Not yet.

## Left alone

Conditions 8 and 9 of eligibility, which TSK-1085 reads under the same versions, and the report's use of `expected`, which TSK-1089 builds.
