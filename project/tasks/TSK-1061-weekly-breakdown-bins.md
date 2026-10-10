---
id: TSK-1061
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6796, REQ-6802, REQ-6804, REQ-6806, REQ-6808, REQ-6810, REQ-6812]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A projection puts each counted first attempt into exactly one weekly bin

After this task, one projection reads the counted first attempts of every node and gives each to one of four bins for its Monday-to-Sunday week, so the report can say how many attempts she did alone and how many needed teaching.

## Acceptance criteria

1. Given graded first attempts shown for a block, a probe, review, a lesson recheck and a retention check, and a rapid guess, an excluded task, a second attempt, a mental arithmetic task, a control fact, a Volley row and a task with a new form, when the projection runs, then only the first five are counted (REQ-6810). Closed by: a report test over a fixture log.
2. Given outcomes `clean` with no hint, `clean` with deepest rung 1 and `hintMaxLevel` 2, `clean` after rung 2, `clean` after rung 1 with `hintMaxLevel` 1, `partial`, and «Не знаю» after a hint, when the projection runs, then they land in «сама», «хватило первой ступени», «с опорой», «с опорой», «требует обучения» and «требует обучения», each in exactly one bin (REQ-6802, REQ-6804, REQ-6806, REQ-6808). Closed by: the same report test.
3. Given an adventure played after midnight on a Sunday, when the week is computed, then its attempts stay in the week of that game day (REQ-6812). Closed by: a fixture log with a session across midnight.
4. Given a view of the dynamics, when its inputs are read, then it reads first attempts from blocks, probes, review, lesson rechecks and retention checks only, assisted attempts appear only in figures labelled as help, and every «сама» share reads unassisted attempts alone (REQ-6796). Closed by: a unit test over the view's input filter.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the projection `weekly_breakdown` under `src/engine/projections/`. It reads `attempt_submitted`'s outcome, `hintLevel` and `hintMaxLevel` and the `item_shown` it belongs to; the counted set is the one the trajectory reads too, so export it as one function. The rule replaces REQ-1414's list as REQ-6796 states. The owner named the rung 1 bin «на пороге», but an approved node label owns that name, so the bin is «хватило первой ступени» (REQ-6650 in ADR-0380).

## Depends on

- TSK-1060 (not blocking): the bins don't read `solution_shown` or `hint_shown`, so this task can land first.

The epic realising ADR-0060 supplies the knowledge model's drop rule; a fixture list of dropped attempts stands in until it exists.

## Evidence

Not yet.

## Left alone

The screen that shows the counts, which TSK-1063 builds, and the profile's own dynamics, which ADR-0390 states.
