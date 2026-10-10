---
id: TSK-0549
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0080
closes: [REQ-0430, REQ-0432]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# No packet carries the correct answer or a solution step before the first attempt, and the window shows the answer after every attempt

After this task, the server sends no correct answer, no solution step and no rung the player didn't buy before or during a first attempt, and the reply to each attempt, the second included, carries the correct answer for the window to show.

## Acceptance criteria

1. Given a warm-up, a mental arithmetic task, a room task, an easy task and a Guardian task, when every packet sent before the first answer is read, then none carries the correct answer, a solution step or a rung the player didn't buy, which is what the player would find reading the raw packets in the browser's developer tools (REQ-0432). Closed by: a packet test over the five kinds that reads the raw bytes of the replies, the stream, the poll and a resume.
2. Given a bought rung, when the next packet is read, then it carries that rung and no deeper one. Closed by: a packet test.
3. Given a first attempt, when the answer reply is read, then it carries the correct answer for the first time (REQ-0430). Closed by: an integration test.
4. Given a second attempt on the parallel task, when its reply is read, then it carries that task's correct answer, and the window shows the correct answer after every attempt (REQ-0430). Closed by: a Playwright test on the tablet viewport that reads the window after each attempt.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Extend the packet test the epic realising ADR-0030 built to every task kind and to the stream, the poll and the resume packet, and fix any packet that leaks. `Room`'s fields and the answer reply's `feedback.correctAnswer` are SPC-0030's; this task asserts on them and adds none.

## Depends on

- TSK-0548 (blocking): the flow's states that say when the answer may be sent.

## Evidence

Not yet.

## Left alone

The estimate's four options and the inverse check's prompt, which ADR-0240's epic adds and asserts the same way, and the layout of the window, which ADR-0150's epic builds.
