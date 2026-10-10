---
id: TSK-0606
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1502, REQ-1660, REQ-1662, REQ-1664, REQ-1666, REQ-1668, REQ-1670, REQ-1672]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# She names and renames her heroine, familiars, items, floors, Tangles and room, and a name passes the content check first

After this task, every nameable thing has a stable id with its current name looked up at use, a name is at most 24 characters and passes the forbidden-word list, the triggers and the safety check, a floor or a Tangle shows its canon name as a placeholder until she meets it, and a name with a digit never reaches a task statement.

## Acceptance criteria

1. Given a renamed floor, creature or focus, when every screen and order that shows it is read, then each shows the new name and nothing else tied to it changed (REQ-1502). Closed by: an integration test over the book, the room and an order.
2. Given a name of 25 characters, a name with a forbidden word and a name the safety check refuses, when each is submitted, then each is refused with a line that names the limit it broke, her text stays in the field and the three suggestions show again (REQ-1662, REQ-1664). Closed by: a unit test and a Playwright test of the naming window.
3. Given the heroine, familiars, forged items, opened floors, every Tangle met and her room, when each is renamed, then each rename is accepted (REQ-1660). Closed by: an integration test for each of the six kinds.
4. Given a floor or a Tangle she hasn't met, when it shows, then it shows the canon name as a placeholder, and at the first meeting the window offers three suggestions, the canon name and two from `name_suggest` or from the hand-written list when that order fails (REQ-1666). Closed by: an integration test with a failing Master.
5. Given a Guardian's name and a canon name outside the four renameable kinds, when a rename is tried, then it is refused (REQ-1668, REQ-1670). Closed by: a unit test.
6. Given a name with a digit or a numeral word, when a task statement is built, then the frame filler of ADR-0130 doesn't use it, and the name carries the flag that makes it refuse (REQ-1672). Closed by: a unit test over the filler's input.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the name table keyed by stable id, the `name_given` event, the naming window's route, and the numeral flag. A name refused for a digit still shows in her story; only the task statement refuses it. Library, branch and pool texts name characters by entity id, as ADR-0370 states.

## Depends on

- TSK-0599 (blocking): a name passes that task's checks before use.

The epic realising ADR-0130 honours the numeral flag in its frame filler; until it exists this task tests the flag on the filler's input.

## Evidence

Not yet.

## Left alone

The window's art and the Guardians' arcs, which ADR-0170 and the canon own.
