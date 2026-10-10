---
id: TSK-0702
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-2832, REQ-2816, REQ-2818]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server sends the chosen picture, else the draft, else a placeholder, and filters by creepiness level

After this task, the server resolves every asset id to its chosen picture, then its draft, then an SVG placeholder drawn in code from the design tokens, never sends an asset above the creepiness level in force, and the Parent Room lists the drafts no person has seen.

## Acceptance criteria

1. Given an asset with no chosen variant, when the server resolves it, then it sends the draft with `art_missing` logged; given an asset with no draft either, then it sends the SVG placeholder, and the game screen renders with it (REQ-2832). Closed by: an integration test with three assets and a Playwright test of one screen.
2. Given creepiness level 1, when the server resolves an asset whose `minCreepiness` is 2, then it doesn't send it; given an asset at level 1, then it does (REQ-2816). Closed by: an integration test.
3. Given level 0 and a background with a dreamcore variant, when the server resolves it, then it sends the `cosyVariant` (REQ-2818). Closed by: an integration test.
4. Given a draft no person has seen, when the parent opens the Parent Room, then the drafts line lists it; given the parent opens it on the line or on the choice screen, then it is marked seen, and a new draft clears the mark. Closed by: a Playwright test.
5. Given more than 400 variants waiting in `data/art/variants/`, when the parent opens the Parent Room, then one notice says so. Closed by: an integration test with a fixture directory.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the resolution function and its route, reading `content/art.yaml`, `public/art/`, the drafts in `data/art/variants/` and `art_jobs`. The server never imports the art tool. The creepiness level in force belongs to ADR-0110; until the epic realising it exists, the function reads the level from a stand-in setting that defaults to 0, so the cosy variants show, and the tests set it. The placeholder is an SVG of the asset's size drawn from the design tokens, so the game runs with any set of art.

The 400-variant notice appears once, a value ADR-0170 chose, and the Parent Room's placement belongs to the epic realising ADR-0180.

## Depends on

- TSK-0693 (blocking): the draft, the seen mark and the variant files come from its rows.

## Evidence

Not yet.

## Left alone

The rule that the placeholder uses no pure-black colour, which TSK-0703 builds, and the way the player sets the creepiness level, which ADR-0110 owns.
