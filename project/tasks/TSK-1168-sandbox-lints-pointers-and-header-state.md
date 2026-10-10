---
id: TSK-1168
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-6324, REQ-6348]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Sandbox code can't start timers or change the flag, a reset is compared by table hashes and a start-up writes missing pointers

After this task, a group 1 lint fails a timer, an interval, `setImmediate` or the job queue's API in `src/server/sandbox/` and any import of the sandbox flag's storage module there, the tests of a reset compare a hash of each table's rows, and start-up writes each missing `sandbox_action_applied`. This settles entries 63 to 66 of ADR-0460.

## Acceptance criteria

1. Given a fixture with `setTimeout` in `src/server/sandbox/`, when group 1 runs, then it fails and names the file; given a `setInterval`, a `setImmediate`, a call of the job queue's API and an import of the flag's storage module, then each fails the same way (REQ-6348). Closed by: five fixture tests of the lint.
2. Given a sandbox reset after a WAL checkpoint, when the player's database is compared with its state before, then a hash of each table's rows is equal though the file's bytes differ (REQ-6324). Closed by: acceptance test 18 and ADR-0340's test 6, both on per-table hashes.
3. Given a main-file event with `source: "sandbox"` that no pointer names and a `sandbox_action_applied` row deleted by hand, when the server starts, then it writes the missing `sandbox_action_applied` for each, and a retry after the restart no longer gets `410` (REQ-6348). Closed by: a start-up test that deletes a row and finds it written back.
4. Given a snapshot of a 1 GB file taking 180 seconds, when verify runs, then check 17 records it as a baseline finding and verify passes; given a sandbox file of 2 GB or more, then `sandbox_large` shows in the sandbox header until a reset brings it below 2 GB and nowhere else. Closed by: a verify fixture test and a Playwright test of the header.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply entries 63 to 66 as written. Every append from sandbox code then happens inside a sandbox request, where the flag marks it, and sandbox code can't change the flag. The acceptance test's steps stay in SPC-0340 as ADR-0340's realisation check, and the work here writes them as the tests named above.

## Depends on

Nothing. The epic realising ADR-0340 owns the sandbox; this task runs on its fixtures.

## Evidence

Not yet.

## Left alone

The sandbox's confirmed actions, which ADR-0340 lists, and the 2 GB limit itself, which it sets.
