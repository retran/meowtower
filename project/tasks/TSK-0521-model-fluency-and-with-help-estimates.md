---
id: TSK-0521
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0060
closes: [REQ-0922, REQ-0924, REQ-0926, REQ-0928]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Assisted attempts feed a "with help" estimate, and speed feeds a fluency estimate, and neither touches the "on her own" estimate

After this task, each pair of node and subtype keeps two beta estimates beside `pKnow`: fluency, the share of first attempts that are right, unassisted and no slower than the threshold, and "with help", over assisted attempts only, each giving an attempt half its weight at 30 days.

## Acceptance criteria

1. Given an assisted attempt, when it is applied, then the "with help" estimate changes and `pKnow` and the fluency estimate of its node stay exactly as before (REQ-0922). Closed by: a unit test that compares the three before and after.
2. Given a right assisted attempt 30 days old, when its contribution to "with help" is read, then it is half the weight of one made today (REQ-0924). Closed by: a unit test.
3. Given an unassisted right first attempt no slower than the template's threshold for the device type, a right one slower than it, and a wrong one, when fluency is read from `αf = βf = 1`, then the first adds `w` to `αf` and the other two add `w` to `βf` (REQ-0926). Closed by: a unit test with exact values.
4. Given an observation 30 days old, when its contribution to fluency is read, then it is half of what it was on the day (REQ-0928). Closed by: a unit test.
5. Given an attempt flagged `interrupted` or `crossDevice`, when fluency is read, then the attempt is not `fast` and adds its weight to `βf`. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the two estimates to `src/engine/model/beta.ts`, each a beta estimate from `α = β = 1` with the score and weight of TSK-0516 and a weight of `2^(-age / 30 days)`. The fluency threshold comes from the active threshold version for the device type; "with help" counts a right assisted attempt as a success.

The four shares by depth of help beside "with help" are ADR-0220's and read the same assisted attempts, so they stay out of this task.

Until the epic realising ADR-0180 owns the thresholds, the task reads the catalogue values of RES-1200 through one function `fluencyThreshold(template, device)`, which that epic replaces.

## Depends on

- TSK-0516 (blocking): the observations with their scores, weights and time flags.

## Evidence

Not yet.

## Left alone

The shares by depth of help, which ADR-0220's epic builds, and the threshold versions and the motor correction, which ADR-0180's epic owns.
