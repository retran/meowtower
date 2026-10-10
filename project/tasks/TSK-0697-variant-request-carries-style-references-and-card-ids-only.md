---
id: TSK-0697
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-2800, REQ-3400, REQ-3408, REQ-3410, REQ-1510]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each variant request carries the style, the references and the floor's palette, and takes card ids only

After this task, the request for a variant holds the `STYLE` block, the `NEGATIVE` block, the floor's palette where the asset has a floor, and 1 to 3 references, is built only from catalogue card ids, and goes to the model of the asset's role.

## Acceptance criteria

1. Given a catalogue entry with a `floor`, when its request is built, then it holds the `STYLE` block, the `NEGATIVE` block, that floor's palette and 1 to 3 references; given an entry with no floor, then it holds no palette (REQ-3400, REQ-2800). Closed by: a unit test over one entry of each kind.
2. Given the heroine's sheet entries, when the style check isn't recorded, then each request carries keyart-heroine; given the style check is recorded, then every later request for the heroine carries the chosen sheet in its place, and keyart-tower or keyart-archive appears only in a request for a world picture (REQ-3400). Closed by: a unit test with and without the `art_style_check` row.
3. Given a card of a familiar, a Tangle or a Guardian, when the request is built, then the card's description is followed by "round plush creature, chibi proportions", and a card of anything else carries no suffix (REQ-3410). Closed by: a unit test.
4. Given the request builder, when it is called with free text, a player's word or the name of another work, then it refuses at the type and at run time, and the gateway's content request class accepts only card ids; the `NEGATIVE` block and each character's card carry the child proportions and covered clothes (REQ-1510, REQ-3408). Closed by: a type-level test, a unit test that passes free text and fails, and a unit test that reads the blocks.
5. Given the roles of ADR-0100, when a sheet, a character or an item is requested, then `ART_MODEL_CHAR` serves it, a key scene takes `ART_MODEL_KEY` and a background takes `ART_MODEL_BG`; given Seed refuses `bytedance-seed/seedream-4.5` under the content tier, then `ART_MODEL_BG` takes `google/gemini-3.1-flash-image`. Closed by: a unit test with the stub refusing.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Build the request from the style file and the catalogue of TSK-0692 through ADR-0100's content request class. The class takes card ids and never free text, so no word the player wrote and no name of another work reaches a prompt. References: keyart-heroine or the chosen heroine sheet always, the character's sheet where one exists, and keyart-tower or keyart-archive only for a world picture. A heroine sheet and an item with no character carry the heroine reference alone.

This task builds the request. Whether the picture matches the style, the proportions and the palette is the person's judgement at the choice screen of TSK-0701.

## Depends on

- TSK-0692 (blocking): the request reads the style file and the catalogue's fields.

## Evidence

Not yet.

## Left alone

The queue's order, which TSK-0698 and TSK-0699 own, the judge, which TSK-0696 builds, and the gateway's content request class and roles, which the epic realising ADR-0100 supplies. Until it exists the tests use a stand-in class with the same signature.
