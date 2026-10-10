---
id: TSK-0976
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0340
closes: [REQ-6368]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The repository scan fails on a tracked file that holds output of a run on a snapshot of the player's state

After this task, group 1's scan for personal data fails when a tracked file matches `snap-[0-9A-HJKMNP-TV-Z]{26}` or holds a value from `personal/player.md`, and passes on a file that holds only an `empty-` identifier.

## Acceptance criteria

1. Given a tracked fixture holding a `snap-` identifier of 26 characters from the ULID alphabet, when group 1 runs, then the scan fails and names the file (REQ-6368). Closed by: a fixture test of the scan.
2. Given a tracked fixture holding a value from `personal/player.md` and no mark, such as an edited copy of a run's output, when group 1 runs, then the scan fails and names the file (REQ-6368). Closed by: a fixture test with a synthetic value in a stand-in `personal/player.md`.
3. Given a tracked fixture holding only an `empty-<ULID>` identifier, when group 1 runs, then the scan passes (REQ-6368). Closed by: a fixture test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Extend the personal-data scan of group 1 with the `snap-` pattern. The scan keeps reading the values of `personal/player.md`, because the mark alone misses an edited copy and the values alone miss the names she gave. Write the fixtures with synthetic values and keep the player's name and age out of every tracked file, as the repository's rule requires.

## Depends on

- TSK-0975 (blocking): the scan keys on the mark that task puts in every output, and its fixtures reuse that format.

The epic realising ADR-0190 owns group 1 and its scan; this task adds one pattern to it.

## Evidence

Not yet.

## Left alone

Replacing her free text and names with placeholders in the output of `adventure --from-snapshot`, which ADR-0340 holds as a reversal condition and not as work now.
