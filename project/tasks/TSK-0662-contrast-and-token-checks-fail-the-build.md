---
id: TSK-0662
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-3100, REQ-3112, REQ-3114, REQ-3116, REQ-3138, REQ-3140]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The verify command fails on a contrast below its threshold, on a colour literal and on a grey shadow

After this task, a contrast script, a stylelint configuration and two token scripts run in the lint verb and fail the build on the look's rules, and each failure names the pair, the token or the file.

## Acceptance criteria

1. Given every pair RES-3100 lists, 31 for each palette and theme, when the contrast script runs over the 2 themes, the 4 presets and 20,000 seeded random custom palettes for each mode, then every text pair reaches 4.5:1 and every stroke and focus ring pair reaches 3:1, among them the stroke on `surface-300` (REQ-3112, REQ-3114, REQ-3116). Closed by: the script's output.
2. Given a fixture palette whose stroke on `surface-300` reaches 2.9:1, when the script runs, then it fails with `contrast_failed`, the pair, the theme and the palette (REQ-3116). Closed by: the script's fixture test.
3. Given the stylelint configuration, when it reads `src/`, then a colour literal and a reference to an `--art-*` or location token outside the scene code are rejected, and the committed files pass (REQ-3100). Closed by: the lint verb's output and one fixture for each rejected form.
4. Given the shadow tokens, when the token script runs, then a shadow whose colour has equal red, green and blue values or is black fails, and a warm tint passes (REQ-3138). Closed by: a unit test with a grey, a black and a warm fixture.
5. Given the palette blocks, when an `el-*` token is redefined inside one, then the script fails naming the token and the block (REQ-3140). Closed by: a unit test with one fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `tools/contrast.ts`, a stylelint configuration and `tools/tokens.ts` to the lint verb. Use a seeded generator for the random palettes so a failing palette repeats; the 20,000 palettes add a few seconds to the run. Read the thresholds and the pair list from one table in `src/ui/ds/contrast-pairs.ts`, so a pair added there is checked at once. Text that sits on a surface the player can colour is checked on the surface after `paletteVars`'s correction.

## Depends on

- TSK-0660 (blocking): the check reads the owner's token and component sheets and the corrections.
- TSK-0661 (blocking): custom palettes are checked after `paletteVars`.

## Evidence

Not yet.

## Left alone

The type-scale rule of stylelint, which TSK-0664 adds to the same configuration, and the owner's `design/` files, which this task reads and never edits.
