---
id: TSK-0969
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0340
closes: [REQ-6324, REQ-6326, REQ-6378]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A reset starts the sandbox from an empty profile or a copy of the player and leaves her file unchanged

After this task, the parent's reset offers «Пустой профиль» and «Копия игрока», takes a snapshot first when the copy is chosen and none exists, and replaces only `sandbox.sqlite`.

## Acceptance criteria

1. Given each start, empty and copy, including the copy with no snapshot yet, when the reset runs, then a hash of each table's rows in her file is the same before and after (REQ-6324). Closed by: an integration test that compares per-table row hashes, never the file's bytes, because a WAL checkpoint changes the bytes and not the data.
2. Given the reset's two offers, when the parent chooses the copy, then the new sandbox holds the events of `sandbox-snapshot.sqlite`; when the parent chooses the empty profile, then it holds none (REQ-6326). Closed by: an integration test and a Playwright test of both buttons.
3. Given no `sandbox-snapshot.sqlite`, when the parent chooses the copy, then the game takes a snapshot and starts the sandbox from it, with no separate control used (REQ-6378). Closed by: an integration test.
4. Given a reset that runs, when a sandbox request or a confirm arrives, then it answers `409 sandbox_resetting`, the confirm's token stays unused and nothing is appended to either file (REQ-6324). Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the reset: close the sandbox handle, answer every request in flight with `409 sandbox_resetting`, build the new file under a temporary name, and rename it over `sandbox.sqlite`. The copy start copies `sandbox-snapshot.sqlite`; when it is missing, it calls the snapshot builder first. Add the button «Снять снимок заново» that replaces the snapshot. Sweep the reset's temporary file at server start. Show `sandbox_large` in the sandbox header when `sandbox.sqlite` is over 2 GB, until a reset brings it under, and nowhere else (the choice ADR-0460 records), and read the file's size from the same place the reset reads it. A reset never touches `sandbox-spend.sqlite`; TSK-0970 tests that.

## Depends on

- TSK-0968 (blocking): the copy start and the missing-snapshot case call the builder.

The Parent Room of ADR-0180's epic holds the sandbox tab; until it exists the buttons sit on the sandbox's own header.

## Evidence

Not yet.

## Left alone

The month's spend after a reset, which TSK-0970 owns, and the `sandbox_large` threshold's number, which stays the 2 GB ADR-0340 chose.
