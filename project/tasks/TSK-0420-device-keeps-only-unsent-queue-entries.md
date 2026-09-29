---
id: TSK-0420
artifact: task
status: draft
revised: 2026-09-29
epic: EPC-0010
closes: [REQ-6506]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A device keeps no game data except the unsent entries of its event queue

After this task, the client keeps in IndexedDB only the event queue's store, asks for persistent storage on first launch, and caches in its service worker only code and pictures. A static check and a storage inspection prove it. It replaces TSK-0110.

An entry counts as unsent until the server acknowledges it with a reply SPC-0030 names as removing it, `2xx` or `409 lease_moved`, because the queue writes an entry before it sends it and keeps it until that reply (ADR-0030). An entry sent but not yet acknowledged is therefore unsent in REQ-6506's sense.

## Acceptance criteria

1. Given a fresh device, when the client launches for the first time, then it calls `navigator.storage.persist()`. Closed by: a Playwright test.
2. Given the client's source, when `npm run lint` runs, then its static check finds `indexedDB` opened only in the event queue's module, `caches` used only in the service worker, and no `localStorage` or `sessionStorage` write, no `document.cookie` write and no `navigator.storage.getDirectory()` call anywhere in `src/client/` (REQ-6506). Closed by: the lint verb's output, and one fixture per banned use, IndexedDB outside the queue's module, `localStorage`, `caches` outside the service worker, `document.cookie` and the origin-private file system, each of which makes the check fail.
3. Given a device that has used the client with every sound channel off, when the test inspects its storage, then IndexedDB holds at most the event queue's store, every entry in it is an answer, a grouping set, `looks_set`, `glossary_opened` or `plan_draft` whose `idem_key` the server's log doesn't hold, `localStorage` and `sessionStorage` are empty, `document.cookie` holds no cookie the page can read, the origin-private file system is empty, and the service worker's caches hold only code, which counts scripts, styles, fonts and the language file, and pictures, with no sound file (REQ-6506). Closed by: the storage inspection test's report.
4. Given a device that has played a simulated day, when the same inspection runs, then the result is the same, and no entry the server acknowledged is left in the store. Closed by: the storage inspection test's report of that run.

## What to do

Create the event queue's IndexedDB store, which owns its schema for all five entry kinds, and add the persistence request, the service worker's asset cache, the static check and the storage inspection test, as SPC-0010 states them. TSK-0380 writes answers into this store and sends them. No task writes the other four entry kinds yet: the epics realising ADR-0150 and ADR-0370 entry 45 add them.

## Depends on

TSK-0100, because the storage it restricts belongs to the client shell. Criterion 4 also waits on TSK-0380 in EPC-0030, which fills and flushes the queue, and on a simulated day, which needs the epics realising ADR-0030 and ADR-0040.

## Evidence

Not yet.

## Left alone

How the queue sends, retries and flushes, which ADR-0030 defines and TSK-0380 builds. Sound files in the service worker's cache while a sound channel is on, and their removal once every channel is off, which ADR-0320 defines and its epic, not yet written, will check; until then no channel can be switched on, so criterion 3 finds no sound file.
