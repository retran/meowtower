---
id: TSK-1103
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0420
closes: [REQ-7070]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Dutch memo lists the category analysis and the test conditions among what the parent can ask the school for

After this task, the parent-facing Dutch memo under `parent.cito.memo` lists the category analysis of a Cito result and the test conditions, such as reading aloud or extra time, among what the parent can ask the school for.

## Acceptance criteria

1. Given the memo after the MVP, when the parent opens it, then its list of what to ask the school for holds the category analysis and the test conditions, each with a Russian gloss from `ru.json` (REQ-7070). Closed by: a Playwright test on the memo.
2. Given the memo's strings, when the string check of ADR-0160 runs, then it passes with the Dutch text of the memo as parent-facing text, and the repository adds no player-facing Dutch (REQ-7070). Closed by: the string check's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the two entries to the memo's list, which ADR-0290 defines as "the level of the test taken, the expert view of the group report and the split between bare and context items". Both sit on the teacher's side: the category analysis feeds the Cito rows, and the test conditions are the check for high at home and low at school. The memo is parent-facing Dutch with a Russian gloss, so it needs no change to the Russian-only rule in `CLAUDE.md`.

## Depends on

Nothing within this epic. The epic realising ADR-0290 supplies the memo, which exists only after the MVP.

## Evidence

Not yet.

## Left alone

Any Dutch text the player sees, which waits on the owner amending the Russian-only rule.
