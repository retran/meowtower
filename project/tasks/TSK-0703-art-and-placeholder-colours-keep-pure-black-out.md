---
id: TSK-0703
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-3402]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The colours of art, placeholders, shaders and particles can't reach pure black

After this task, a token test fails any colour token of the art, the placeholders, the shaders or the particle effects whose three channels are all at or below 16 out of 255, and a lint rule fails a colour literal in the code that draws them, so pure black can't reach the screen outside a picture a person chose.

## Acceptance criteria

1. Given the colour tokens of the art set, the placeholders, the shaders and the particle effects, when the token test runs, then it passes; given a fixture token `#101010`, then it fails and names the token (REQ-3402). Closed by: a unit test with the failing fixture.
2. Given a colour literal in the placeholder, shader or particle code, when the lint verb runs, then it fails and names the file; given the same code reading a token, then it passes (REQ-3402). Closed by: the lint rule's fixture test.
3. Given the SVG placeholder of any asset in the catalogue, when its fills and strokes are read, then each is a token (REQ-3402). Closed by: a unit test over every catalogue entry.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the token test and the lint rule. The tokens come from `design/design-system/tokens.css` by the path CLAUDE.md fixes, until the epic realising ADR-0150 supplies how the design files reach the build. The threshold of 16 is the one TSK-0695 uses on pictures, and both read it from one constant so the two can't drift.

## Depends on

- TSK-0702 (blocking): criterion 3 reads the placeholders it draws.

## Evidence

Not yet.

## Left alone

The tint shader's rule that each channel is raised to at least 17, which TSK-0705 builds beside the shader, and the colour of the design system's other tokens, which ADR-0150 owns.
