---
id: TSK-0661
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-3108, REQ-3142, REQ-3246]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The root carries her theme, palette and text size, the dreamcore layer sits on the scene alone, and the Parent Room keeps the light theme

After this task, the root element holds `data-theme`, `data-palette` and `data-text`, `paletteVars` sets a custom palette's variables, the dreamcore theme is set only on the scene layer, and the Parent Room's root carries `data-theme="light"` and no palette.

## Acceptance criteria

1. Given the profile holds theme `dark`, palette 3 and large text, when a story screen renders, then the root carries those attributes and the task window's computed colours and sizes are those of that theme, palette and size, and so are a rest stop, an eye exercise and the heroine's room (REQ-3246). Closed by: a Playwright test that reads computed styles on each of the four screens.
2. Given a story event from ADR-0110 sets the dreamcore theme, when the scene renders, then `data-theme="dream"` is on the scene element only, the root attribute is unchanged, and the task window opened during the event keeps her theme (REQ-3108). Closed by: a Playwright test that opens a task window during a dream event.
3. Given the Parent Room, when any of its pages renders under every theme and palette she can choose, then its root carries `data-theme="light"` and no `data-palette`, and the computed `state-*` colours are the same each time (REQ-3142). Closed by: a Playwright test over the 8 choices of theme and preset.
4. Given four custom colours, when `paletteVars` builds the variables, then each role's text and stroke variables are corrected so the stroke on `surface-300` reaches the ratio RES-3100 resolves, and where no correction reaches it the variable falls back per surface to black or white (REQ-3246). Closed by: a unit test with a pale, a dark and a saturated palette.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Port `paletteVars` to `src/ui/ds/palette.ts`. Put the dreamcore theme on a nested scene element because RES-3100 left open whether it sits on the root, and the element's own `[data-theme="dream"]` variables win over the inherited palette. Set the attributes from the profile on the root of every client page, and set the Parent Room's root apart from them.

## Depends on

- TSK-0660 (blocking): the ports and the style sheets whose variables the attributes select.

The epic realising ADR-0110 supplies the story event that asks for dreamcore; until it lands, tests dispatch the event by hand.

## Evidence

Not yet.

## Left alone

Offering a choice: the settings screen of TSK-0663 writes the profile, and the server shell that puts the attributes in the first HTML is there too. The dreamcore caps and rarity are ADR-0110's.
