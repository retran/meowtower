---
id: TSK-0572
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0328, REQ-0330, REQ-0332]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each «Ещё один ряд» continues the adventure with tasks and moves the soft stop 20 minutes on

After this task, choosing «Ещё один ряд» logs `extension`, the adventure continues with tasks, the soft-stop point moves to 20 minutes of active time after the moment she chose, and the soft stop comes again at the next boundary when those minutes run out on an unfinished adventure.

## Acceptance criteria

1. Given a soft stop with `canExtend: true`, when she chooses «Ещё один ряд», then `extension` is logged and the next packet is a task or a scene of the adventure (REQ-0328). Closed by: an integration test.
2. Given an extension chosen at 63 minutes of active time, when the soft-stop point is read, then it stands at 83 minutes, and a second extension chosen at 80 minutes moves it to 100 (REQ-0330). Closed by: a time-projection test with synthetic logs.
3. Given the 20 minutes of an extension run out on an unfinished adventure, when the next boundary comes, then `stop_offer` is returned again with «Ещё один ряд» offered (REQ-0332). Closed by: a boundary test.
4. Given a repeated `extend` request with the same `clientSeq`, when it arrives twice, then one `extension` is logged. Closed by: the existing idempotency test extended to the new route.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Make `POST /api/session/:id/extend` log `extension` with the instant and let the soft-stop projection of TSK-0564 read it. The extension adds 20 minutes from the moment she chose it, and not from the old point, so a late choice doesn't shorten the extension. The route keeps its `409 day_finished` after `finish_today` from TSK-0410.

## Depends on

- TSK-0571 (blocking): the offer she answers is the one that task plays.

## Evidence

Not yet.

## Left alone

The Parent Room's «Закончить на сегодня», which TSK-0573 covers, and the report's mark for a long day, which ADR-0180's epic owns.
