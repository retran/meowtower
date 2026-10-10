---
id: TSK-1108
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0430
closes: [REQ-6684, REQ-7100]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# No Dutch probe trace exists before the owner's amendment, and the parent's switch holds the whole probe

After this task, the scope guard fails on every trace of the probe in the tree until the owner has amended the Russian-only rule, and the Parent Room has a switch, off by default, that keeps every letter, Dutch probe text and probe card away from the player.

## Acceptance criteria

1. Given the principle `project_in_english` in `CLAUDE.md` still holds "Text the player sees is in Russian only for now", when verify runs on a tree with the directory `content/probe/`, the directory `tools/probe/`, a schema for an event type ADR-0430 owns or the route `/parent/probe`, then the scope guard fails and names the trace (REQ-6684). Closed by: the guard's fixture tests, one tree for each trace.
2. Given the settings, when a fresh database starts, then `probe.enabled` is off, and the parent turns it on through `PUT /api/parent/settings`, which writes a `settings_changed` event the way `bridge.enabled` does (REQ-7100). Closed by: a server test.
3. Given the switch off, when a Playwright walk runs through a simulated day and a search runs over every server packet, then it finds no letter, no Latin-script word outside the approved bridge keywords and the Dutch words of term hints, and no probe card; given a letter already planned for the day, then it is dropped when the switch goes off (REQ-7100). Closed by: the Playwright test's report and the packet search's output.
4. Given fewer than 4 eligible templates that hold an approved pair, when the parent opens the settings, then the switch is inactive and the row shows the count of eligible templates with an approved pair; given the switch turned off and on again, then the families whose 14 days passed are closed, and the phase counters and balance counts keep their values (REQ-7100). Closed by: a Playwright test and a unit test over a fixture log.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the four traces to the scope guard of ADR-0190 and tie their lifting to the stage whose acceptance follows the owner's amendment of `CLAUDE.md`; the guard never edits that file, and the amendment is the owner's act. Add `probe.enabled` to the Parent Room's settings. While it is off, the Director plans no letter, the server builds no probe view and serves no probe card. The switch turns on only when at least 4 eligible templates hold an approved pair, because the first phase keeps 4 families open on no two the same template; a thinner first week would be unbalanced. Until the first approved pair exists, the count reads 0 and the row stays inactive.

## Depends on

Nothing within this epic. The epic realising ADR-0190 supplies the scope guard and the epic realising ADR-0070 the Director's plan; the task runs against fixtures of both.

## Evidence

Not yet.

## Left alone

The families, the letters and the pairs that the count reads, which TSK-1109 to TSK-1113 build, and the owner's amendment of `CLAUDE.md`, which no task makes.
