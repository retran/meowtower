---
id: TSK-0692
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-2802, REQ-2806, REQ-2814, REQ-3416, REQ-3418, REQ-3420, REQ-3422]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The art catalogue and the style file exist, and a check fails on a card that breaks a rule

After this task, `content/art-style.md` and `content/art.yaml` exist, and `tools/art-generate.ts catalogue-check` exits non-zero and names the entry and the field whenever a catalogue entry lacks a field its kind needs, a character has no sheet, a dreamcore asset has no creepiness field, or a card breaks one of the canon's fixed looks.

## Acceptance criteria

1. Given an entry that lacks `id`, `card`, `size`, `transparent` or `references`, or whose `kind` isn't one of `sheet`, `emotion`, `overlay`, `pose`, `stage`, `background` and `item`, when the catalogue check runs, then it exits non-zero and names the entry and the field (REQ-2806). Closed by: a unit test with one failing fixture for each field.
2. Given a character that has entries and no entry of kind `sheet`, or whose sheet card doesn't state the front view, the side view and 3 or 4 emotions, when the check runs, then it fails and names the character (REQ-2802). Closed by: a unit test with both failing fixtures.
3. Given a dreamcore asset with no `minCreepiness`, or a dreamcore background with no `cosyVariant`, when the check runs, then it fails and names the asset (REQ-2814). Closed by: a unit test with both failing fixtures.
4. Given the four heroine sheet cards, when one differs from the others in a field other than hair colour and style, eye colour and the cardigan's colour, then the check fails and names the field (REQ-3422). Closed by: a unit test that changes the dress, the ears, the tail and the backpack of one card in turn.
5. Given a heroine card, when it lacks the hooded cable-knit cardigan with knitted ears on the hood and a heart patch on the sleeve, or shows anything but an empty mint backpack, then the check fails; given the card of «Пуговка», when it lacks the honey colour or the four holes that spill sparks, then the check fails (REQ-3416, REQ-3418, REQ-3420). Closed by: a unit test with one failing fixture for each phrase.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write `content/art-style.md` with the `STYLE` block, the `NEGATIVE` block the owner approved on 2026-09-27, the dreamcore blocks and the suffix "round plush creature, chibi proportions", all taken from the canon's art direction. Write `content/art.yaml` with the fields SPC-0170 lists: `id`, `card`, `size`, `transparent`, `references`, `kind`, `character`, `floor`, `minCreepiness`, `cosyVariant` and `previousStage`. Fill it with the four heroine sheets and an entry for every picture the canon's lists name for the MVP, which RES-3000 puts at about 40. Cards describe only the canon's own characters and things.

Start `tools/art-generate.ts` with the `catalogue-check` subcommand. The subcommands that follow in this epic extend the same file. ADR-0190's verify command runs the check in its first group.

Choices this task makes where SPC-0170 leaves a gap. The check finds the three layout words of a sheet card (front, side, and a count of 3 or 4 emotions) by a fixed phrase list, and it finds the cardigan, the backpack and «Пуговка» phrases the same way, because the cards are free text and no field holds those facts. The phrase lists sit in the check's own fixture file, so a change to the canon's wording changes one place.

## Depends on

Nothing.

## Evidence

Not yet.

Whether a picture drawn from a card shows the cardigan, the backpack and the honey colour is the parent's judgement at the choice screen of the later task that builds it, because no program can read a picture's meaning.

## Left alone

The queue, the generation and the judge, which later tasks build. The wording of each card beyond the fixed looks above, which belongs to the canon.
