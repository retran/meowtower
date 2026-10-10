---
id: TSK-0578
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0134]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every event of Session 0 carries `session0: true` and the knowledge projection skips it

After this task, Session 0's events are marked, the knowledge projection ignores them, and the knowledge state after Session 0 equals the state before it.

## Acceptance criteria

1. Given a played Session 0, when its events are read, then every one carries `session0: true`, and an event of the first adventure after it doesn't (REQ-0134). Closed by: an integration test over the log.
2. Given a log with and without Session 0's events, when the knowledge projection is run on both, then the two results are identical (REQ-0134). Closed by: a projection test.
3. Given a Session 0 event without the mark, when `appendEvents` receives it during Session 0, then it is refused. Closed by: a unit test of the append guard.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Carry the flag in the envelope of every event the flow of TSK-0577 appends, and make the knowledge projection of EPC-0060 skip events with the flag. The motor calibration and the vocabulary probe produce an input-speed correction and risky terms as their own events, so they update no skill estimate.

## Depends on

- TSK-0577 (blocking): it builds the flow whose events this task marks.

The epic realising ADR-0060 owns the knowledge projection; until it exists, the task adds the skip to the stand-in projection in `src/engine/projections/knowledge.ts` and leaves the real estimates to that epic.

## Evidence

Not yet.

## Left alone

What the correction does to the rapid-guess threshold, which ADR-0070 owns.
