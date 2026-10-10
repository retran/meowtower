---
id: TSK-1156
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-0914, REQ-0916, REQ-6842, REQ-6874, REQ-6890]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Only unassisted first attempts feed the estimate, an excluded task can be restored and a hinted retention check counts as wrong

After this task, the knowledge model counts as evidence only what measures her on her own, the parent can undo an exclusion of a task from the flagged-task list, and a retention check that she opened the hint ladder on is a wrong observation that asks for a review the next day. This settles entries 4, 8, 9, 15, 34 and 68 of ADR-0460.

## Acceptance criteria

1. Given a `form: new` subtype that isn't in `admittedForms`, when attempts on it are logged, then its `node_estimates` row holds only its prior and its attempts feed only its stream, `surplus` or `missing`; and when the activation that admits it runs a full recompute, then the estimate is built from the whole log (REQ-0914). Closed by: a projection test over a log before and after the admission.
2. Given a log in which a warm-up, a rapid guess and an excluded task follow an observation of the "on her own" estimate, when it is replayed, then `lastSeen` is still the date of that observation (REQ-0914). Closed by: a replay test over the three attempts.
3. Given a task the parent marked as ambiguous, when she presses «вернуть» beside it, then `DELETE /api/parent/items/:itemId/exclude` logs `item_included` and, from the recompute it triggers, the task counts in every estimate, state and block again (REQ-0916). Closed by: a route test and a Playwright test of the flagged-task list.
4. Given a retention check on which she opened the hint ladder, when it is recorded, then it is a wrong retention observation, `nextReview` is the check's day plus 1, `lastSeen` is unchanged and the ladder resumes from that result (REQ-6874, REQ-6842). Closed by: a replay test over a hinted check.
5. Given the projection registry and the event schemas, when they are read, then `retention_observations` and `retention_series` are `knowledge` projections that no `game` projection imports from, and `solution_shown` and `hint_shown` hold a required `itemId` at version 1 with no upcaster (REQ-6890). Closed by: the import check's output and a schema test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply the rules as ADR-0460 states them: an unadmitted subtype keeps its prior only, so nothing is lost and no check covers a figure no aggregate reads; `lastSeen` moves only on an observation the Observations list of ADR-0060 keeps; the restore route and `item_included` are owned by ADR-0180 and take `itemId` from the path; and a hinted check resumes the ladder from its wrong result. Add `item_included` to the catalogue of ADR-0020 with an `itemId` payload. The Russian wording of «вернуть» comes from ADR-0160's language file.

## Depends on

Nothing. The epic realising ADR-0060 owns the model; this task changes its rows and rules and runs on its fixtures.

## Evidence

Not yet.

## Left alone

The review ladder's intervals, which ADR-0400 sets, and the Russian wording of the restore control, which ADR-0160 and the parent's review settle.
