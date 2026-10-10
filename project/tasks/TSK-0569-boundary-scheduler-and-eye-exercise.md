---
id: TSK-0569
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0304, REQ-0308]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A due eye exercise plays at the next boundary, the four exercises take turns, and two due events play in a fixed order

After this task, `next` carries an eye exercise as a `break` packet at the first boundary after the eye count reaches 20 minutes, never while a task window is open, and when two timed events are due at one boundary the first in the stated order plays and the other waits.

## Acceptance criteria

1. Given a log whose eye count reaches 20 minutes during an open task, when the answer's review closes, then the next packet is the eye exercise, and no packet before it carried one (REQ-0304). Closed by: a boundary test.
2. Given four eye exercises logged in a row, when the next one is chosen, then the four kinds `far`, `blink`, `figure_eight` and `palms` come in turn and the log's last `eye_exercise` sets the next (REQ-0308). Closed by: a unit test.
3. Given an eye exercise and a soft stop due at one boundary, when `next` is read twice, then the first packet is the soft stop and the second, at the boundary its scene ends at, is the eye exercise; each fires once, and a long task never queues two of one kind. Closed by: a boundary test.
4. Given a packet of `break`, when it is read, then it carries the exercise's kind and no time value (REQ-0300). Closed by: a payload test over the packet.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the boundary scheduler to `GET /api/session/:id/next`: a boundary is the moment after an answer with its review closes or after a scene ends, and only there does the server check for due events. Keep each due condition as a flag, in the order the soft stop, the eye exercise, the offered rest stop and the gentle sequence after an anxiety signal, and make the scheduler's interface take a list of due events so TSK-0571, TSK-0575 and TSK-0576 add theirs without changing the order. Log `eye_exercise` with its kind. This task writes the exercise as a content scene with no skip, which TSK-0570 adds on request of the parent; the exercise ends by itself after the length ADR-0320 states, and until that epic exists it ends after 35 seconds.

## Depends on

- TSK-0564 (blocking): the eye count it reads is that task's projection.

The epic realising ADR-0320 states how long each exercise lasts and how an eyes-off exercise ends.

## Evidence

Not yet.

## Left alone

The soft stop, the rest stop and the gentle sequence, which each have their own task and join this scheduler.
