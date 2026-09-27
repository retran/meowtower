---
id: TSK-0400
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0030
closes: [REQ-0228, REQ-0230, REQ-0232, REQ-0236]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The three-day rule wraps up an adventure after its adventure days and queues its secrets

After this task, the server counts an adventure's adventure days, and on the first session of a new game day past `threeDayLimit` it finishes the open task and room, plays the short ending, logs `adventure_wrapped_up` with the unopened secrets, and puts them in `reward_queue`.

## Acceptance criteria

1. Given an adventure played on three game days with game days without play between them, when the first session of a fourth game day starts, then `ResumeOut.wrapUp` is true; the gaps don't count (REQ-0236). Closed by: the three-day test with a fake clock.
2. Given `wrapUp`, when the player finishes the open task and room, then the stand-in short ending plays and `adventure_wrapped_up` is logged with the secrets she didn't open (REQ-0228). Closed by: the three-day test.
3. Given the wrap-up, when `inventory` and `reward_queue` are read, then every grant from before it is still held, no event was removed or reversed, and the unopened secrets are in `reward_queue` (REQ-0230, REQ-0232). Closed by: the three-day test.
4. Given `threeDayLimit` off, when the same days pass, then no wrap-up happens. Closed by: the three-day test.

## What to do

Count adventure days as SPC-0030 states them: a game day runs from 04:00 to 04:00 in the time zone of the device she plays on. ADR-0090 owns the game day; until its epic exists, add the boundary function in `src/shared/` for that epic to take over. Set `wrapUp`, finish the room, log `adventure_wrapped_up`, and fold its secrets into `reward_queue`.

Stand-ins: the stand-in adventure's secrets list for ADR-0140's secrets, and a stand-in ending scene for the library's short ending, which ADR-0110 writes. ADR-0190's definition of done applies.

## Depends on

TSK-0360, because `wrapUp` travels in `ResumeOut`. TSK-0390, because the rule reads `threeDayLimit`.

## Evidence

Not yet.

## Left alone

When queued secrets return, which ADR-0140 decides, and the short ending's text, which ADR-0110 writes.
