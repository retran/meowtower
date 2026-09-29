---
id: TSK-0380
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0030
closes: [REQ-2400, REQ-2434, REQ-2436, REQ-2438]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The client queues every answer before sending it, and plays no task while offline

After this task, the client commits each answer to IndexedDB before it sends it, retries until the server logs it, flushes the queue on launch, and while offline shows the waiting scene with the three help controls inactive and computes nothing.

## Acceptance criteria

1. Given an answer tapped, when the test kills the page between the tap and the send, then the answer is in IndexedDB, and the next launch sends it before asking to resume (REQ-2434). Closed by: a Playwright test that records the order of the IndexedDB commit and the request.
2. Given the network cut after an answer, when the client is closed and reopened and the network restored, then the answer is in the log exactly once; while the network was down the waiting scene «Туман над тропой, фамильяр ищет дорогу» showed, no new task appeared, and the hint, explanation and second-attempt controls were inactive (REQ-2434, REQ-2436, REQ-2438). Closed by: the Playwright report.
3. Given no connection, when the player answers, then the client shows no outcome, no correct answer and no next task until the server replies, and the outcome and grants then arrive together (REQ-2400). Closed by: the same Playwright test, which checks the screen before and after the network returns.
4. Given an answer unsent for 24 hours, when the parent opens that device's settings, then `queue_stuck` shows with the answer's time and a retry button. Closed by: a Playwright test with a fake clock.

## What to do

Build the queue on TSK-0420's event-queue store: write, wait for the transaction to commit, then send; retry from 1 second, doubling to at most 30 seconds; flush on launch before resume; hold at most one answer; remove an answer once the server replies, `409 lease_moved` included. Add the offline state, the waiting scene for `server_unreachable` and `queue_stuck`, as SPC-0030 states them. The waiting scene's text sits in the `ru` language file as a stand-in until ADR-0110's epic writes it. ADR-0190's definition of done applies; the iPad checklist it names also covers 0 lost answers after 30 seconds without Wi-Fi.

## Depends on

TSK-0320, because a resent answer must be recorded once. TSK-0340, because it disables controls and replaces screens that task draws. TSK-0420, because the queue lives in its event-queue store.

## Evidence

Not yet.

## Left alone

A service worker with Background Sync and prefetched tasks, which ADR-0030's reversal conditions hold back.

Amended by ADR-0370, entry 45, approved on 2026-09-28: TSK-0420 replaced TSK-0110, so this task builds on TSK-0420's event-queue store.
