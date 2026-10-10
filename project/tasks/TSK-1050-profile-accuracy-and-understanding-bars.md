---
id: TSK-1050
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0390
closes: [REQ-6748, REQ-6750]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The accuracy bar reads mastered nodes only, and the understanding bar reads four streams only

After this task, the computational accuracy bar reads unassisted first attempts on bare tasks of nodes that were «бегло» or «устойчиво» at the attempt, and the conceptual understanding bar reads unassisted first attempts from the estimate, composing, surplus and unanswerable streams.

## Acceptance criteria

1. Given a node that becomes «устойчиво» at sequence number 120 and unassisted bare first attempts at 100 and at 140, when the bar is built, then only the attempt at 140 counts, and an attempt with a `factId` or a non-empty `forms` counts for neither (REQ-6748). Closed by: a fixture log with the node's state history.
2. Given first attempts in the `estimate`, `compose`, `surplus`, `missing` and `grouping` streams, when the conceptual understanding bar is built, then the first four count, each right by its own rule (`estimateRight`, the riddle rule, the unanswerable verdict), and `grouping` counts for no bar (REQ-6750). Closed by: a fixture log.
3. Given an item with an estimate whose exact answer is right and whose `estimateRight` is wrong, when both bars are built, then the exact answer is one success for computational accuracy and the verdict is one failure for conceptual understanding, each in one bar only (REQ-6748, REQ-6750). Closed by: a fixture log.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/parent/profile/accuracy.ts` and `src/parent/profile/understanding.ts`. Read the tested state at an attempt's sequence number from ADR-0060's state history. The Director sets frontier tasks near her limit, so a bar over mastered nodes escapes most of that pull towards 70 to 80 %. An item with an estimate keeps `forms` empty (ADR-0210), which is why its exact answer is an ordinary first attempt.

## Depends on

- TSK-1045 (blocking): the routing order.
- TSK-1046 (blocking): the windows.
- TSK-1047 (blocking): the bar builder.

The epic realising ADR-0060 supplies the state history, and the epics realising ADR-0240, ADR-0230 and ADR-0250 supply the three right-or-wrong rules; fixtures hold their verdicts until then.

## Evidence

Not yet.

## Left alone

A stream's own rule for right and wrong, which its decision owns.
