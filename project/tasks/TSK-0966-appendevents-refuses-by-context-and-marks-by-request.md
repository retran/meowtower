---
id: TSK-0966
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0340
closes: [REQ-6310, REQ-6318]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every sandbox event carries its mark, and `appendEvents` refuses a mismatch before the database sees it

After this task, `appendEvents(ctx, events)` stamps each event with the profile of the engine context `{ db, profile }`, throws `SandboxEventRefused` when an event's profile differs from the role cached on the handle, and writes the device identifier `sandbox` on every event appended inside a sandbox request, so a sandbox event that reaches the wrong file is stopped or found.

## Acceptance criteria

1. Given a sandbox engine context, when a floor is played, then every event written to `sandbox.sqlite` has `profile = 'sandbox'` (REQ-6310). Closed by: an integration test that reads the column.
2. Given the player's read-write handle and a context with `profile: 'sandbox'`, when an event is appended, then `appendEvents` throws `SandboxEventRefused` before the `INSERT` and no row is written, and the request fails with `500 sandbox_event_refused` (REQ-6318). Closed by: an integration test.
3. Given a context `{ mainDb, profile: 'main' }` built inside a sandbox route, when an event is appended, then it carries the device identifier `sandbox`, and the next nightly run reports exactly one `sandbox_leak_found` with the event type and sequence number (REQ-6310). Closed by: an integration test that runs the nightly job once.
4. Given a request to `/api/parent/sandbox-actions/confirm`, when it appends an event, then the event doesn't carry the device identifier `sandbox`, because the router sets the flag only on the prefix `/api/parent/sandbox/` with its trailing slash (REQ-6310). Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Make the engine context `{ db, profile }` the only source of an event's profile, never the handle, because a profile read from the handle would stamp a sandbox event `main` exactly when a bug hands sandbox code the main handle. Cache the role on the handle at open. Add the middleware that `main.ts` mounts on the sandbox route trees and sets a flag in `AsyncLocalStorage`; `appendEvents` writes the device identifier `sandbox` while the flag is set, whatever context the caller built. Add the nightly job that counts events with that identifier in her file and reports `sandbox_leak_found` once to the owner. Add the owner's one-a-day Parent Room notice for `sandbox_event_refused`, naming the route and the event type.

## Depends on

- TSK-0965 (blocking): the trigger is the second line behind this check, and the test of criterion 3 needs the column.

The epic realising ADR-0020 supplies `appendEvents` and the nightly job runner. The route trees this middleware guards are mounted by a later task of this epic; until then the test mounts a stand-in route under the same prefix.

## Evidence

Not yet.

## Left alone

The lint that forbids timers and the flag's storage module in `src/server/sandbox/`, which TSK-0967 holds with the other import checks.
