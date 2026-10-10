---
id: TSK-1056
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0390
closes: [REQ-6788, REQ-6794]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The profile never reaches the player, the Master or the school export

After this task, a lint rule keeps `src/parent/profile/` out of every module outside `src/parent/`, no player packet, Master order or school export carries a profile field, and the scan of the player's screens fails on any string under `parent.profile.*`.

## Acceptance criteria

1. Given a fixture module in `src/engine/`, one in the Master's order builder and one in the school export that each import `src/parent/profile/`, when the lint verb runs, then it fails on each (REQ-6788). Closed by: the lint verb's output on the three fixtures.
2. Given a simulated adventure, when every player packet, Master order and school export is serialised, then none holds a bar identifier or a `ProfileModel` field, and the strict schema of each refuses a fixture with a `profile` field (REQ-6788). Closed by: a payload test over 1,000 serialised payloads.
3. Given one of the player's screens with a string under `parent.profile.*`, when the scan runs, then it fails; given a simulated adventure, then it finds none (REQ-6794). Closed by: the scan's test on both cases.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add an ESLint rule, `no-restricted-imports` with a path pattern, that allows `src/parent/profile/` only from modules under `src/parent/`. Extend the strict schemas and the scan of the player's screens of ADR-0190's group 4 with the `parent.profile.*` keys. The export's own `school_export_scope` check stays beside the lint rule, because the export is the one route by which data reaches the school.

## Depends on

- TSK-1044 (blocking): the module the rule protects.
- TSK-1055 (not blocking): the rule and the scan can run on a fixture string until the screen's strings exist, and the scan then covers the real keys with no change.

The epic realising ADR-0190 supplies the scan of the player's screens; where it doesn't exist yet, add the scan's rule for these keys to the Playwright fixture the screens' tests already use.

## Evidence

Not yet.

## Left alone

The PIN and parent session, which SPC-0180 states for every parent route.
