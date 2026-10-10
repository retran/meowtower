---
id: TSK-0961
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6221, REQ-6222, REQ-6224, REQ-6226, REQ-6228, REQ-6230]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# «Свободное перо» writes with the Master outside the task window and spends only what the adventure's bucket left

After this task, the free pen opens on day 8 from the heroine's room and the scene screen whenever the task window is closed and the parent's setting is on, each turn passes the checks of free text and writes no task, score or knowledge-model event, and the pen closes the book through a library scene when time or the bucket runs out.

## Acceptance criteria

1. Given day 7 and day 8 of play and `freePen` on, when she asks to open the pen, then day 7 answers `404 system_closed` and day 8 appends `free_pen_started`; given the setting off, a task window open, the gateway off or a bucket that can't pay a turn, then the answer is `409 pen_unavailable` with `parent_off`, `task_window_open`, `gateway_off` or `budget` and the client draws no pen button (REQ-6224). Closed by: a route test over the five states.
2. Given the pen is open, when the parent switches `freePen` off, then it closes with `free_pen_ended` reason `parent_off`; and the setting starts on (REQ-6224). Closed by: a settings test.
3. Given 20 pen turns, when the log is compared before and after, then each turn ran the triggers, judge and checks of free text, the field showed the parent note, each was a `StoryRequest` of kind `free_pen` to `FREE_PEN_MODEL`, and no task, score or knowledge-model event was appended (REQ-6221, REQ-6222). Closed by: a pen test over a log diff.
4. Given the day's active time passes the soft-stop point, and given the adventure's bucket can't pay the next turn, when the next turn arrives, then a library scene closes the book with no extension, both closes look the same to her, and `free_pen_ended` records `soft_stop` or `budget` (REQ-6228). Closed by: a pen test across the soft-stop point and across an empty bucket.
5. Given an unfinished adventure, when the pen spends, then it spends only what exceeds the forecast cost of the adventure's remaining scenes and has no bucket of its own; and pen time counts in the day's active time and in the eye count (REQ-6226, REQ-6230). Closed by: a budget test against the adventure's bucket and a time-projection test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `POST /api/pen/start`, `POST /api/pen/:penSessionId/turn` and `POST /api/pen/:penSessionId/end`, the `free_pen` order kind and a pen reply that may apply only `remember` with scope `pen`, at most 50 pen facts in a pen order. The planner never reads scope `pen`, because the planner's 200 facts would otherwise fill with pen facts and push out the adventure's own.

The reservation for an unfinished adventure is stricter than REQ-6230, a choice ADR-0330 records, because writing in the pen would otherwise turn the rest of the adventure into library scenes. After a soft-stop close she can open the pen again, and it closes the book again after its first turn until an «Ещё один ряд» (One more row) moves the soft-stop point, as SPC-0330 states; a pen reply that fails its checks twice closes through a library scene with `reply_failed` and she can open it again. The closes for time and for the bucket look the same to her on purpose, because a close that named money or time would give her a clock or a price.

## Depends on

- TSK-0948 (blocking): the pen opens on day 8 of the schedule and answers 404 until then.

The epic realising ADR-0210 supplies the adventure's bucket and the role `FREE_PEN_MODEL`, the epic realising ADR-0090 the soft stop and the active time, and the epic realising ADR-0110 the safety pipeline and the checks. Until they exist the task runs on a stub gateway, a fixture bucket and a fixture soft-stop point, and the real prices stay with those epics.

## Evidence

Not yet.

## Left alone

The Parent Room's switch itself beside the other settings, which the settings route of TSK-0948 shares, and the pen's count in the Interest section, which TSK-0962 reads.
