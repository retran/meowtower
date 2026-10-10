---
id: TSK-0663
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-3102, REQ-3104, REQ-3106, REQ-3110, REQ-3242, REQ-3244, REQ-3522]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# She changes the look in her settings at any time, and every paired device opens in it

After this task, the settings screen offers the theme, the four presets, a custom palette and the text size together with no lock or price, a change is one `looks_set` event, and the server writes her last looks into the page it serves.

## Acceptance criteria

1. Given the settings screen, when she opens it at any time, then it offers light and dark, the four presets, a custom palette of four roles from swatches or the device's colour picker, and normal or large text, all at once, nothing is locked or priced, and a change shows on the next frame (REQ-3102, REQ-3104, REQ-3106, REQ-3244, REQ-3522). Closed by: a Playwright test that changes each choice and reads the computed style on the next frame.
2. Given the palette cards, when she looks at them in the dark theme, then each card previews its own colours in that theme (REQ-3242). Closed by: a Playwright test that reads each card's computed colours in both themes.
3. Given a change on one paired device, when a second paired device is reloaded, then its first paint already carries the same `data-theme`, `data-palette`, `data-text` and custom variables, with no flash of the default (REQ-3110). Closed by: a Playwright test over two browser contexts that reads the attributes before first paint.
4. Given a `looks_set` request with the theme `dream` or a colour that isn't `#RRGGBB`, when the server receives it, then it answers 400 and writes no event (REQ-3244). Closed by: an integration test.
5. Given a change made while offline, when the connection returns, then the one `looks_set` event is sent through the client queue like any other write (REQ-3110). Closed by: a Playwright test with the network cut.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the settings screen as a layer on the existing settings route, with a `ColorRole` swatch at a 56 px hit area on a coarse pointer. Write the last looks as attributes into the HTML shell the server serves, in `src/server/shell.ts`, so no client script has to set them before first paint. Validate `looks_set` with a zod schema that accepts only `light` and `dark` for the theme and `#RRGGBB` for a role, so no request can set dreamcore or inject CSS. The sound switch of ADR-0150's first text left this screen when ADR-0320 made play silent by default, so this screen offers text size and looks only; the sound settings are that decision's.

## Depends on

- TSK-0661 (blocking): the root attributes and `paletteVars` it sets.

The event queue of the epic realising ADR-0030 already carries every client write, and `looks_set` is one more event type.

## Evidence

Not yet.

## Left alone

The Parent Room's own look, which stays light, and the contrast of a custom palette, which `paletteVars` corrects and TSK-0662 checks.
