---
id: TSK-0977
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0340
closes: [REQ-6348, REQ-6370]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Acceptance test 18 shows the sandbox changes the player's file only through the six confirmed actions

After this task, a scripted run hashes each table of her file after the parent's PIN login, plays a sandbox floor, a batch of 50, a puzzle and a scene with no confirmed action, and finds every hash unchanged; a second run confirms each action once and finds exactly six new main-file events.

## Acceptance criteria

1. Given the PIN login done, when a sandbox floor, a batch of 50, a puzzle and a scene are played with no confirmed action, then every table of her file hashes the same as just after the login, with the player not playing and the parent not logging in again meanwhile (REQ-6370). Closed by: the acceptance test's first run.
2. Given the second run that confirms an ambiguous mark, a disable and a restore of a template, a disable and a restore of a puzzle and the approval of a puzzle variant, when her log is read, then it holds exactly six new events, each of its action's type with `source: "sandbox"` and `profile = 'main'`, and the sandbox file holds six `sandbox_action_applied` pointing to them (REQ-6348). Closed by: the acceptance test's second run.
3. Given the whole run, when her file is compared by the table list, then no other table changed and no event carries the device identifier `sandbox` (REQ-6348). Closed by: the acceptance test's final assertions.
4. Given the parent's notes, when the sandbox is used, then no note reaches her file from it (REQ-6348). Closed by: an assertion in the acceptance test that the note routes are absent under the sandbox's prefix.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the script as an integration test under `tests/` that runs against the real server, the sandbox's tree and the confirmed-action routes, and compare per-table row hashes, never the file's bytes. Keep the scenario's steps in SPC-0340 as ADR-0340's realisation check. Until the epic realising ADR-0280 exists the puzzle steps run on a fixture puzzle and a stand-in `puzzle_approved`, and the test notes which steps ran on stand-ins so it can't pass quietly.

## Depends on

- TSK-0968 (blocking): the scenario may start from a copy of the player.
- TSK-0971 (blocking): the scenario plays under the sandbox's routes.
- TSK-0973 (blocking): the second run confirms through its routes.
- TSK-0974 (blocking): the disable, restore and exclusion events exist.
- TSK-0975 (not blocking): the batch can run through the Parent Room route, so the command line is added to the same test once it lands.

## Evidence

Not yet.

## Left alone

Models behind the sandbox's calls, which run in `replay` mode here, and the 1 GB snapshot timing, which TSK-0968 reports.
