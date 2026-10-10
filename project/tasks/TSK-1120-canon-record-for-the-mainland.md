---
id: TSK-1120
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0430
closes: [REQ-7194]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A canon record adds the Mainland and its letters before any letter scene is written

After this task, a record in `canon/` adds the Mainland and says why some letters arrive as bare sums or in Russian, and the line pool holds no letter scene until the owner has approved that record.

## Acceptance criteria

1. Given the canon, when the record is added, then it names the Mainland as a land beyond Misty Ford, the forest and the Tower, gives the sender or senders of the letters, and says why some letters arrive as bare sums or in Russian (REQ-7194). Closed by: the owner's judgement at the stage acceptance, because the canon changes only through its own records and only the owner approves the world.
2. Given the line pool, when a check runs, then it fails on a letter scene entry while the record isn't approved, and passes with the record approved (REQ-7194). Closed by: the check's fixture test with the record in both states.
3. Given the record, then it holds the Mainland's names used for the letters' senders, and no letter scene is written in the record itself. Closed by: the owner's judgement, together with a search of the record for the player's name and age, which the repository keeps out of every tracked file.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write a record in `canon/` under the rules of `canon/README.md`, in English, naming the Mainland, the people who write the letters, and the in-world reason that some letters arrive as bare sums, some in Russian and some in Dutch. Add the check on the line pool. The record is read by the owner at the stage acceptance, as ADR-0430 requires.

## Depends on

Nothing within this epic. The canon's existing records, such as the tower and the world outside, are the context the new record extends and doesn't change.

## Evidence

Not yet.

## Left alone

Any letter scene's lines, which come after the record is approved, and the interface text of the letters, which ADR-0160 keeps in the language files.
