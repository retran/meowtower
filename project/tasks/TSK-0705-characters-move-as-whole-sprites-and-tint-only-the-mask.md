---
id: TSK-0705
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-2810, REQ-2812, REQ-2836, REQ-3406, REQ-3402]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Characters move as whole sprites, emotions swap pictures, and the cloak colour tints only the mask

After this task, PixiJS animates each character as one sprite, an emotion swaps the picture for its own, a blink overlays an eyelid picture, the cloak colour moves only the masked pixels, and a static check fails when client or server code makes a picture during play or moves a part of a picture.

## Acceptance criteria

1. Given a character's sprite, when it breathes, bounces, sways or is hit, then only the sprite's own transform changes by squash, stretch, offset and rotation, and the sprite has no child display object cut from its picture (REQ-2810). Closed by: a unit test over the sprite's scene graph.
2. Given an emotion change, when the client draws it, then the sprite's texture becomes the emotion's own picture, and a blink adds the `overlay` picture generated from the sheet (REQ-2812). Closed by: a unit test and a Playwright test.
3. Given a heroine picture with an approved mask and a chosen cloak colour, when the filter runs, then the masked pixels take that colour, keep their shading and have each channel at or above 17, and the pixels outside the mask are unchanged (REQ-3406, REQ-3402). Closed by: a unit test on a fixture picture that includes a masked pixel of (0, 0, 0).
4. Given a heroine picture with no approved mask, when it is drawn, then it shows untinted (REQ-3406). Closed by: a Playwright test.
5. Given `src/client/` and `src/server/`, when the static check runs, then it finds no image-generation call and no code that moves a part of a picture, and a fixture with either makes the check fail (REQ-2836, REQ-2810). Closed by: the static check's fixture test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the sprite animations, the emotion swap, the blink overlay and the colour filter limited to the mask, in the scene layer. Effects such as the Tangles' glitch, the garland and the chest flashes are shaders and particles in code. No part-mask animation exists until a person has approved a character's part masks, which RES-2800 leaves to stage 0.5, so no code for it is written. The static check joins the lint verb and ADR-0190's first verify group.

The scene layer, PixiJS 8.21.0 and the six cloak colours of screen 02 come from the epic realising ADR-0150. Until it exists the task draws on a test page with fixture pictures and one fixed colour.

## Depends on

- TSK-0704 (blocking): the filter reads the approved mask.
- TSK-0702 (blocking): the client receives pictures by asset id from the server's resolution.
- TSK-0703 (not blocking): the token test and the colour-literal lint cover the shader this task writes; either can land first.

## Evidence

Not yet.

## Left alone

Live art and art for AI-made creatures, which come after the MVP, and the layout of the scene column, which ADR-0150 owns.
