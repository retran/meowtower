---
id: TSK-0571
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0320, REQ-0322, REQ-0326, REQ-0340]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The soft stop plays at the first boundary after 60 minutes, offers «Ещё один ряд» beside saving, and ends the day through a story scene

After this task, an unfinished adventure whose day's active time reaches the soft-stop point gets a soft stop at the next boundary that offers to save and continue tomorrow beside «Ещё один ряд», accepting the save ends the day's play through a story scene, and no rule ends play or withholds a task because of the day's total.

## Acceptance criteria

1. Given a synthetic log whose day's active time passes 60 minutes during a task, when the answer's review closes, then `next` returns `stop_offer` with `canExtend: true`, and every earlier packet returned a task or a scene (REQ-0320, REQ-0326). Closed by: a boundary test.
2. Given a soft stop on an unfinished adventure, when she accepts the save, then `save_accepted` is logged with the reason `adventure`, the server returns a closing story scene at once, and the resume point holds the open task, the scene and the rewards (REQ-0340). Closed by: an integration test.
3. Given a day with 90, 120 and 180 minutes of active time and an extension chosen each time, when `next` is read, then it returns a task each time and never a refusal tied to the total (REQ-0322). Closed by: an integration test with a fake clock.
4. Given she comes back on the same game day after saving, when the adventure reopens, then the soft stop plays at the entry scene with «Ещё один ряд» offered again. Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the soft stop to the scheduler of TSK-0569 as the first event in its order, log `soft_stop`, and replace the stand-in `stop_offer` of EPC-0030, which TSK-0410 left coming only from `finish_today`, with one driven by the soft-stop point of TSK-0564. Return the closing scene from the library when the save is accepted. The offer's line holds no digit and no word about time; TSK-0579 checks the line pool.

## Depends on

- TSK-0564 (blocking): the soft-stop point is that task's projection.
- TSK-0569 (blocking): the scheduler and its order are that task's.

## Evidence

Not yet.

## Left alone

The extension itself, which TSK-0572 builds, the day's finale and the three-day rule, which EPC-0030 holds.
