---
id: TSK-1024
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-2806, REQ-3234, REQ-3244, REQ-3402]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A custom palette always passes contrast, the voice button always leads somewhere, and art never uses pure black

After this task, `paletteVars` falls back to a colour for each surface and then to black or white, the voice button on a computer with no speech recognition shows the dictation line, an art request carries 1 to 3 references, and a token test keeps every art colour above 16 of 255.

## Acceptance criteria

1. Given 20,000 seeded random custom palettes in each mode, when `paletteVars` derives its colours, then every derived text, stroke and focus colour, the black and white fallbacks included, reaches its contrast threshold on every surface, and the picker accepts every colour she picks (REQ-3244). Closed by: ADR-0150's contrast script run over the palettes.
2. Given a browser with no speech recognition on the computer, when she taps the voice button, then it focuses the field and shows one line from the Russian string file that names the Mac's dictation key (REQ-3234). Closed by: a Playwright test with recognition removed.
3. Given an art request for a heroine sheet and one for an item with no character, when the request is built, then it carries `keyart-heroine` or the chosen heroine sheet alone; given any other request, then it carries 1 to 3 references; and the catalogue entry lists the references (REQ-2806). Closed by: a request-builder test and a catalogue schema test.
4. Given a colour token of the art, the placeholders, the shaders or the particle effects with all three channels at or below 16 of 255, when the token test runs, then it fails; given a colour literal in placeholder, shader or particle code, then lint fails; and the tint shader raises each channel of a tinted pixel to at least 17 (REQ-3402). Closed by: the token test, the lint verb's output and a shader unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change `paletteVars`, the voice button's fallback, the art request builder and the token and lint checks. Every colour has at least 4.58:1 contrast against black or against white, so black or white always passes and REQ-3244 holds; black text is interface, not art, so REQ-3402 doesn't reach it. macOS dictation works in any text field, so the button still leads to voice input. The keyart-tower and keyart-archive references show an out-of-date heroine in the first, "candy" version of the style (RES-3400), so a second reference from them would pull the picture towards that style. Add the dictation key's string with a marked placeholder text; the Russian wording is ADR-0160's and the parent's review.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The Russian wording of the dictation line, and the variants and icons that are checked on their own paths.
