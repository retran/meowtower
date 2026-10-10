---
id: TSK-0839
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0260
closes: [REQ-5566, REQ-5568, REQ-5570, REQ-5572]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server logs each set of links as `grouping_submitted`, restores it on resume and holds the one grouping each attempt submits

After this task, `POST /api/item/:itemId/grouping` takes the whole current set with a `clientSeq`, writes one `grouping_submitted` event holding the set and its score, a resume restores the last set, and an answer sent before its grouping request is refused with `grouping_out_of_order`.

## Acceptance criteria

1. Given an attempt, when links are drawn, changed and removed, then each change writes one `grouping_submitted` with `links`, `mark`, `score`, `change` and `capped`, and a resent request with the same `clientSeq` leaves the same state (REQ-5566). Closed by: a route test.
2. Given links drawn on one device, when the player resumes on another, then the same links and mark show and no thread is spent (REQ-5568). Closed by: a resume test.
3. Given an attempt, when the answer is submitted, then the attempt's grouping is the last `grouping_submitted` before its `attempt_submitted`, or an empty set scored `none` that the server appends in the attempt's transaction when she drew nothing, and no other event repeats the links or the score (REQ-5570, REQ-5572). Closed by: a schema check over a replayed log.
4. Given an answer whose `lastGroupingSeq` differs from the last request the log holds, when it arrives, then the server refuses it with `grouping_out_of_order`, and the client's queue sends the grouping request first and the answer after it. Closed by: a route test and a queue test.
5. Given 41 changes on one attempt, when they are sent, then exactly one event holds `capped: true` and 40 events exist in all; given a change for a closed attempt or a position outside the expression, then no event is written and the reply carries the current set. Closed by: a route test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the route, the event type with the payload ADR-0260 defines, the cap of 40 changes, and `lastGroupingSeq` on `AnswerIn`. The reply carries the accepted set and the `clientSeq` and never a score. Per ADR-0360, the client's queue keeps every set in order in ADR-0030's persisted answer queue and not the newest only. Add `grouping_submitted` to the event schemas in `src/shared/events.ts`.

I chose to send the whole set on each change because a repeated or reordered request then leaves the same state, and a resume reads only the last event.

## Depends on

- TSK-0838 (blocking): the server scores each set with that function.

The epics realising ADR-0030 and ADR-0020 supply the answer queue, the resume point, the route conventions and the event catalogue.

## Evidence

Not yet.

## Left alone

The client's drawing of the links, which TSK-0841 builds, and the projection that folds the events, which TSK-0843 builds.
