---
id: TSK-1021
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-3606, REQ-3608, REQ-3636, REQ-3638]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An edited frame is accepted only after its checks, and verify counts only frames the log shows accepted

After this task, the Parent Room accepts an edited frame as `as_edited` only after its safety check and three blind solves passed, the log gains the three frame events with `candidateSince`, and verify counts a frame only when the newest snapshot holds its acceptance.

## Acceptance criteria

1. Given an edited candidate whose checks haven't run, when the parent opens the review screen, then it shows the edit as waiting for its check with no accept control; given the checks passed at the last `frames:generate`, then she can accept it and the Parent Room writes `frame_accepted` with `as_edited` (REQ-3636, REQ-3638). Closed by: a Playwright test and a route test.
2. Given a candidate rejected on the review screen, a science question rejected, and a candidate that turns 60 days old at the first change of game day, when each happens, then the log holds `frame_candidate_rejected`, `science_rejected` and `frame_candidate_expired`, and `frame_accepted`, `science_approved` and these three carry `candidateSince`, the day the candidate or question entered its file (ADR-0130). Closed by: an event schema test and a log test.
3. Given `content/frames.ru.json` with a hand-added frame that has no `frame_accepted` in the newest snapshot, when verify counts frames, then it doesn't count that frame; given no snapshot in `data/snapshots/`, then it counts the file and reports `frames_acceptance_unchecked` (REQ-3606, REQ-3608). Closed by: verify's output on the two fixtures.
4. Given a frame accepted and later removed by `frame_removed`, when verify counts, then it doesn't count it (REQ-3606, REQ-3608). Closed by: the same run.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the three event types to the catalogue with owner ADR-0130 and the `candidateSince` field, and change verify's frame count. Only the Parent Room writes a parent's event, so acceptance is a second action after the check. A snapshot is how a program on the Mac reads the log (ADR-0010), so verify reads acceptance where it lives. The review time ADR-0130's reversal conditions need is the event's day minus `candidateSince`.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The frame generator and its prompts, and the review queue's layout, which ADR-0130 and ADR-0150 own.
