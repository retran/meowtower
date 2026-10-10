---
id: TSK-0668
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-0714, REQ-0716, REQ-0718, REQ-0764, REQ-0738]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each answer kind has its own field, and an entry the engine can't parse is marked softly

After this task, the task window draws the fraction as a two-storey field, the mixed number as three fields, a quantity with its unit beside the field and a point as a tap on a grid node, and an unparsed entry gets a soft outline with no words.

## Acceptance criteria

1. Given a fraction task, when the window renders, then the numerator field sits above the denominator field; given a mixed-number task, then three fields hold the whole part, the numerator and the denominator (REQ-0714, REQ-0716). Closed by: a Playwright test that reads the fields' rectangles and labels.
2. Given a quantity task with the unit «см», when the window renders, then the unit's label sits beside the field and comes from the language file (REQ-0718). Closed by: a Playwright test and a search of `src/ui` for a literal unit.
3. Given a point task, when the window renders, then the coordinate grid offers nodes to tap and no field takes typed coordinates, and tapping a node sets the entry (REQ-0764). Closed by: a Playwright test that taps a node and searches the task window for a text input.
4. Given an entry the checker returns `unparsed` for, when the entry is shown, then the field takes a soft outline from the design tokens with no text, no icon and no error colour, «Готово» stays inactive until the entry parses, and the task's clock keeps running (REQ-0738). Closed by: a Playwright test that reads the field's computed outline, the button's state and the absence of any added text or icon, with the parent's judgement at stage acceptance whether the mark reads as soft.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Draw each field from the `InputSpec` of ADR-0040 and let its `check()` result `unparsed` drive the outline; the outline's colour and width come from tokens, and the red of the state colours isn't used. The point field is a tap on a node of the grid, and the grid has no typed coordinates. The soft mark is a layer of the task window and adds no animation there.

## Depends on

- TSK-0667 (blocking): the keypad and the action row these fields sit with.

The epic realising ADR-0040 supplies `InputSpec`, the answer kinds and the checker; until it lands, tests drive the fields from fixture specs and a fixture checker.

## Evidence

Not yet.

## Left alone

What counts as unparsed, which the checker of the epic realising ADR-0040 decides, and the task's clock, which the epic realising ADR-0030 keeps; this task only leaves both running.
