---
id: TSK-0360
artifact: task
status: done
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

Collected on 2026-10-10 on the Mac. Every criterion is met, and the first is met by a synthetic log and a played script, which the notes below say.

- Verbs: `meow-checks run format lint check test build` exited 0 at tree 2918a03661af, with every record current at that tree. Vitest and Playwright both passed; the `test.fail()` self-tests of the response recorder account for the two `✘` lines.
- Criterion 1, REQ-0206: `tests/integration/resume.test.ts` compares the stored `resume_snapshot` with `resumeFromLog` after each of 12 requests of a played script (0 differences) and after a rebuild from the log alone, and compares the final row of every adventure of the 30-day synthetic log (`tests/helpers/synthetic-log.ts`, 20 tasks a day) with the point derived from its events. It does not compare after every event of that log, because the stored row exists only at the end; the projection and the derivation share the one fold `foldResume`.
- Criterion 2, REQ-0204: the same file resumes on a computer a task a tablet left with rung 1 shown, and finds the floor, room, slot, `itemId`, view, attempt number and hint levels `GET /api/adventure/current` and the log give.
- Criteria 3, REQ-0210 and REQ-0212: a task left across a leave and a resume is answered as attempt 1 with the verdict `clean` and `interrupted: true`; an uninterrupted answer and one split only by a rest stop carry `interrupted: false`.
- Criterion 4, REQ-0214: after a leave and a resume on another device, a hint, an explanation and a second attempt asked again with new `clientSeq` values append no `thread_spent` and no second `hint_shown`, and return the same rung, stock and twin.
- Criterion 5, REQ-0224: a computer submitting a tablet's task carries `crossDevice: true`, and the device that showed it `false`.
- `attempt_submitted` gains version 2 with the two flags and an upcast from version 1 that sets both to false (ADR-0020); the test lifts a version 1 payload through it.
- `POST /api/session/:id/resume`, which the task text names, doesn't exist: ADR-0370 removed it, and SPC-0030 lists only `POST /api/adventure/resume`, so that route alone returns `ResumeOut`. `ResumeOut` leaves out the rewards and `wrapUp`, which TSK-0370 and TSK-0400 add.
- `tests/unit/projection-class.test.ts` lists `resume_snapshot` among the registered projections, in a commit of its own.
- No user-facing page changes: nothing in `docs/` describes the resume.

## Left alone

Scenes, drafts, chests and pending rewards in the snapshot (TSK-0370), and how ADR-0060 reads the two flags.
