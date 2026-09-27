---
id: TSK-0360
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0030
closes: [REQ-0204, REQ-0206, REQ-0210, REQ-0212, REQ-0214, REQ-0224]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Resume returns the exact step from `resume_snapshot`, and attempt flags keep broken times out of every measure

After this task, `resume_snapshot` updates with every adventure event, the resume returns the same floor, room, slot, task, view and attempt step, a paid action repeated after a resume charges nothing, and an attempt split by a pause or by a change of device kind carries a flag that keeps its time out of every measure.

## Acceptance criteria

1. Given the 30-day simulation, when each adventure event commits, then the stored `resume_snapshot` equals the snapshot derived from the log alone (REQ-0206). Closed by: the snapshot equality test's report, which counts events compared and finds 0 differences.
2. Given play left at a task, when `POST /api/adventure/resume` arrives on another device, then `ResumeOut` carries the same floor, room, slot, `itemId`, view, attempt step and hint levels shown (REQ-0204). Closed by: an integration test.
3. Given a task left unanswered, when the player resumes and answers, then it is the same first attempt, its verdict counts towards accuracy, and the attempt carries `interrupted: true` (REQ-0210, REQ-0212). Closed by: an integration test reading the attempt's events.
4. Given a hint, an explanation and a second attempt paid before leaving, when each is requested again after a resume with a new `clientSeq`, then no thread is spent and the same result returns (REQ-0214). Closed by: the resume charge test.
5. Given a task shown on a `tablet` device, when its attempt is submitted from a `computer` device, then the attempt carries `crossDevice: true` (REQ-0224). Closed by: an integration test.

## What to do

Register `resume_snapshot` as a projection updated in the same transaction as the event that changes it, and return it as `ResumeOut` from `POST /api/adventure/resume` and `POST /api/session/:id/resume`, as SPC-0030 states them. Set `interrupted` and `crossDevice` on the attempt as SPC-0030 states; if `attempt_submitted` has no such fields yet, add a payload version with them under ADR-0020's rule. A device's kind is set once at pairing from the pointer test; if the `devices` row has no kind yet, add it there, apart from the interface choice TSK-0100 stores. ADR-0190's definition of done applies.

## Depends on

TSK-0350, because the resume takes the lease. TSK-0320, because it tests those charge keys across a resume. TSK-0250, because `resume_snapshot` is a registered projection.

## Evidence

Not yet.

## Left alone

Scenes, drafts, chests and pending rewards in the snapshot (TSK-0370), and how ADR-0060 reads the two flags.
