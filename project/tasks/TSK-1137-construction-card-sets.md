---
id: TSK-1137
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0440
closes: [REQ-7266]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A construction riddle plays as sentence cards with three roles and a distractor of the named error

After this task, a construction riddle of a family that hasn't passed its test plays as sentence cards for the same target, and each construction's card set holds the cards the target needs with their roles and two distractors.

## Acceptance criteria

1. Given a construction riddle of a family with no pass on the configured model and prompt, when it is offered, then it plays as sentence cards for the same target and calls no parse (REQ-7266). Closed by: a play-route test with a fixture record.
2. Given equal groups or a division meaning, when the cards are built, then the target's cards carry the three roles of the size of a group, the number of groups and the total, and the unknown's role decides the operation. Closed by: a card builder test.
3. Given a target, when its distractors are built, then one has the other relation from the construction's named error, a `·` card where the target divides or the reverse, for a percentage a card that uses the percentage as a plain number, and for a ratio from a known part a card that adds the difference, and the second asks for a different unknown. Closed by: a card builder test, one fixture for each.
4. Given any construction card set, then it holds the cards the target needs and exactly two distractors, the number ADR-0230 chose to keep the hint small. Closed by: the card builder test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add construction card sets to the card builder of ADR-0230: the cards the target needs, each with its role, and two distractors. The roles follow Yamamoto and colleagues (2014, in RES-4260). The card form offers the errors the studies name and still shows only two distractors. Cards need no parse, so the family stays playable while its text form waits. The frames come from the files of TSK-1133.

## Depends on

- TSK-1130 (blocking): the cards build from the declared construction.
- TSK-1133 (blocking): the frames are those files.

The epic realising ADR-0230 supplies the card builder.

## Evidence

Not yet.

## Left alone

The gate that decides when a family plays as text, which TSK-1134 builds, and the verdict on a card riddle, which TSK-1128 changes for both forms alike.
