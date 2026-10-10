---
id: TSK-0420
artifact: task
status: done
revised: 2026-10-10
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


## What to do

Create the event queue's IndexedDB store, which owns its schema for all five entry kinds, and add the persistence request, the service worker's asset cache, the static check and the storage inspection test, as SPC-0010 states them. TSK-0380 writes answers into this store and sends them. No task writes the other four entry kinds yet: the epics realising ADR-0150 and ADR-0370 entry 45 add them.

## Depends on

TSK-0100, because the storage it restricts belongs to the client shell. That queue task builds on this task's store, so it is no dependency of this one.

Amended by ADR-0370, entry 45, on 2026-09-29: the queue task that builds on this store was named here as a dependency, which made the two tasks wait on each other.

Amended on 2026-10-10: the criterion that inspects the store after a played day moved to the queue task of EPC-0030 as its criterion 5, because only that task fills and flushes the store, and it depends on this task being done. Left here it made the two tasks wait on each other again.

## Evidence

Collected on 2026-10-10 on the Mac, at commit 2f47113 of the branch `tsk-0420-event-queue-store`; the pull request is not opened yet. Criteria 1 to 3 are met.

- Verbs: `meow-verbs` isn't installed on this Mac, so each command of `.meowpaw/profile.toml` ran by itself and exited 0: `npx prettier --check .`, `npm run lint`, `npx tsc --noEmit`, `npm test` (49 Vitest files with 454 tests, and 49 Playwright tests passed, 1 skipped; the two `✘` lines are the response recorder's `test.fail()` self-tests) and `npm run build && docker compose build`.
- Criterion 1, REQ-6506: `tests/e2e/storage.spec.ts` replaces `navigator.storage.persist` and finds it called on the first launch, in the ipad and computer projects.
- Criterion 2, REQ-6506: `tools/static-checks.ts` gains `client_storage`, which runs in the lint verb and passes here. `tests/unit/static-checks.test.ts` gives it one fixture for each banned use, IndexedDB outside `src/client/event-queue.ts`, `localStorage` and `sessionStorage` writes, `caches` outside `src/client/sw.ts`, a `document.cookie` write and `getDirectory(`, and each fixture fails the check; comments naming them don't.
- Criterion 3, REQ-6506: after the spec pairs a device, answers a task and reloads, IndexedDB holds the one database `meowtower-queue` with the one store `entries` and no entry, `localStorage` and `sessionStorage` are empty, `document.cookie` is empty, and the service worker's cache holds `/`, the manifest, `/client/*.js` and `/i18n/ru.json` and no `/api` path. On the computer project the origin-private file system is empty; WebKit won't open it for a test, so there that part rests on the static check. The device's sound channels are all off, as no channel can be switched on yet.
- The queue's store, `src/client/event-queue.ts`, keeps the five entry kinds in the order made, and the spec writes one of each, reads them back in that order and removes them; every write resolves once its transaction has committed.

Moved out: the criterion that inspects the store after a played day is criterion 5 of the queue task of EPC-0030, because only that task fills and flushes the store.

Choices made here, because the approved records left them open:

- The service worker is `src/client/sw.ts`, registered at `/sw.js` as a module worker, asks the network first and keeps a copy of each code, language and picture file it fetches. It keeps no `/api` reply and no sound file.
- `./client/*.js` and the page's other files come from the same server routes as before; `/sw.js` is a new route beside them.
- The e2e config blocks service workers for every spec except the storage one, because a running worker answers requests before a test's routes see them.

## Left alone

How the queue sends, retries and flushes, which ADR-0030 defines and TSK-0380 builds. Sound files in the service worker's cache while a sound channel is on, and their removal once every channel is off, which ADR-0320 defines and its epic, not yet written, will check; until then no channel can be switched on, so criterion 3 finds no sound file.
