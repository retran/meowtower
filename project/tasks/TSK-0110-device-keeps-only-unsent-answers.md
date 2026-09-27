---
id: TSK-0110
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0010
closes: [REQ-2542]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A device keeps no game data except unsent answers

After this task, the client stores in IndexedDB only the store for unsent answers, asks for persistent storage on first launch, caches only assets in its service worker, and a test proves it.

## Acceptance criteria

1. Given a fresh device, when the client launches for the first time, then it calls `navigator.storage.persist()`. Closed by: a Playwright test.
2. Given a device that has used the client, when the test inspects its storage, then IndexedDB holds at most the unsent-answer store, `localStorage` holds no game data, and the service worker's caches hold only code, pictures and sound. Closed by: the storage inspection test's report.
3. Given a device that has played a simulated day, when the same inspection runs, then the result is the same. Closed by: the storage inspection test's report of that run.

## What to do

Add the unsent-answer store, the persistence request, the service worker's asset cache and the storage inspection test, as SPC-0010 states them. Criterion 3 runs once the epic realising ADR-0030 provides play and the queue's behaviour.

## Depends on

TSK-0100, because the storage it restricts belongs to the client shell.

## Evidence

Not yet.

## Left alone

How the queue sends, retries and flushes, which ADR-0030 defines.
