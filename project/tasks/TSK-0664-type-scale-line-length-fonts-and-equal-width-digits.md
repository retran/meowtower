---
id: TSK-0664
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-3120, REQ-3124, REQ-3126, REQ-3128, REQ-3130, REQ-3132, REQ-3134, REQ-3136]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Text sizes, line length, local fonts and equal-width digits hold on the iPad and on a computer

After this task, no text is under 13 px, story and task text meet their sizes in both text sizes, a text column is at most 68 characters wide, three fonts are served from the game itself with the whole Russian alphabet, and every digit has one width.

## Acceptance criteria

1. Given WebKit at 1180 by 820 and at 1440 by 900, when every screen is measured, then no text is under 13 CSS px, story text is at least 20 px and task text at least 24 px, and with large text on, story text is at least 24 px and task text at least 28 px (REQ-3124, REQ-3126, REQ-3128, REQ-3130, REQ-3132). Closed by: a Playwright test that reads the computed `font-size` of every text node.
2. Given the stylelint configuration, when a `font-size` that isn't a type-scale token is written in `src/`, then the lint verb fails with the file and the value (REQ-3124). Closed by: the lint verb's output and a fixture.
3. Given the story column, when a long paragraph renders, then no line holds more than 68 characters (REQ-3120). Closed by: a Playwright test that measures the longest rendered line with `Range` rectangles.
4. Given the built game, when a Russian text with «ё» renders in each font, then no glyph falls back to another face, the fonts load from the game's own origin with the Cyrillic subsets preloaded, and the build's copy of `bundle.css` holds no Google Fonts `@import` (REQ-3134). Closed by: a Playwright test that reads the network log and `document.fonts`, and a build check on the copy.
5. Given the digits 0 to 9 in each served font file with `tnum` applied, when their advance widths are read, then all ten are equal, and the answer field, keypad keys and counters set `font-variant-numeric: tabular-nums` (REQ-3136). Closed by: a unit test that reads each font file with a font parser, because the premortem of ADR-0150 records a subset that lost the feature while the CSS looked right.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add Nunito, M PLUS Rounded 1c and Caveat from the Fontsource packages with their Cyrillic subsets and the `tnum` feature kept, and preload them. Strip the remote `@import` from the build's copy of `bundle.css`. On a computer the same grid runs at CSS pixel sizes, centred, with no scaling transform, because a transform would shrink text below the sizes in CSS pixels. Add the type-scale rule to the stylelint configuration of TSK-0662. The 300 KB the fonts add to the image is ADR-0150's estimate; report the measured size in the evidence.

## Depends on

- TSK-0660 (blocking): the type-scale tokens and the style sheets it loads come from the port.
- TSK-0662 (blocking): the stylelint configuration the type-scale rule extends.

The epic realising ADR-0300 adds SVG text inside its sources, measured at the task size or above by this same test.

## Evidence

Not yet.

## Left alone

The measures of readability for task statements, which ADR-0040 owns; this task measures the page, not the words.
