---
id: TSK-0380
artifact: task
status: done
revised: 2026-10-10
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
5. Given a device that has played a day of the stand-in adventure through this queue, when the storage inspection of TSK-0420 runs, then its result holds as for a fresh device, and no entry the server acknowledged is left in the store (REQ-6506). Closed by: the storage inspection test's report of that run. Moved here from TSK-0420 on 2026-10-10.

## What to do

Build the queue on TSK-0420's event-queue store: write, wait for the transaction to commit, then send; retry from 1 second, doubling to at most 30 seconds; flush on launch before resume; hold at most one answer; remove an answer once the server replies, `409 lease_moved` included. Add the offline state, the waiting scene for `server_unreachable` and `queue_stuck`, as SPC-0030 states them. The waiting scene's text sits in the `ru` language file as a stand-in until ADR-0110's epic writes it. ADR-0190's definition of done applies; the iPad checklist it names also covers 0 lost answers after 30 seconds without Wi-Fi.

## Depends on

TSK-0320, because a resent answer must be recorded once. TSK-0340, because it disables controls and replaces screens that task draws. TSK-0420, because the queue lives in its event-queue store.

## Evidence

Collected on 2026-10-10 on the Mac, at commit 34c45cc of the branch `tsk-0380-answer-queue-and-offline`, in pull request #11. Every criterion is met, with the one limit named below.

- Verbs: `meow-verbs` isn't installed on this Mac, so each command of `.meowpaw/profile.toml` ran by itself and exited 0: `npx prettier --check .`, `npm run lint`, `npx tsc --noEmit`, `npm test` (49 Vitest files with 454 tests, and 57 Playwright tests passed, 1 skipped; the two `✘` lines are the response recorder's `test.fail()` self-tests) and `npm run build && docker compose build`.
- Criterion 1, REQ-2434: `tests/e2e/answer-queue.spec.ts` aborts the answer request and reads the queue's store from inside the request's route: the entry is already there when the request leaves. The page is then closed; the next launch sends the answer before its resume request, the log holds the attempt once, and the store is empty.
- Criterion 2, REQ-2434, REQ-2436 and REQ-2438: with the context offline the waiting scene «Туман над тропой, фамильяр ищет дорогу» shows and no task, outcome, correct answer, submit or next control does; a closed client's answer reaches the log exactly once when the network is back.
- Criterion 3, REQ-2400: in the same run the outcome and its short solution arrive together after the network returns, with the waiting scene gone.
- Criterion 4: with Playwright's clock, an answer unsent for 24 hours and one minute shows as `queue_stuck` in the device's settings with its time and a retry button, nothing shows before that, and the retry sends it and clears the row.
- Criterion 5 (moved from TSK-0420), REQ-6506: after eight tasks played through the queue the store holds no entry, the device holds only the database `meowtower-queue`, and `localStorage`, `sessionStorage` and `document.cookie` are empty. The service worker's cache and the origin-private file system are checked by TSK-0420's spec on a played device.

Resting on judgement: criterion 2 also asks that the hint, explanation and second-attempt controls be inactive while offline. The stand-in play screen draws none of them, so no program can check it; the waiting scene replaces the whole screen, which leaves no control to press. The iPad checklist's 0 lost answers after 30 seconds without Wi-Fi is a run on the iPad, which the owner makes.

Choices made here, because the approved records left them open:

- An entry's key is `answer:<clientSeq>` in the store, and its body keeps the session it was made in, so a launch sends it to that session and the server records it as the attempt, as SPC-0030 states for a lapsed lease.
- A send gets a new wait of 1 second doubling to 30, and an `online` event ends the wait at once.
- With no connection at launch, or on the next packet, the waiting scene shows and the client goes on trying; no screen asks her to retry.
- Answers the server refused for good leave the store at once and are listed in the settings until the page is closed.
- `call` in the client returns status 0 for a request that got no usable reply, so no screen needs a handler for a thrown fetch.

## Left alone

A service worker with Background Sync and prefetched tasks, which ADR-0030's reversal conditions hold back.

Amended by ADR-0370, entry 45, approved on 2026-09-28: TSK-0420 replaced TSK-0110, so this task builds on TSK-0420's event-queue store.
