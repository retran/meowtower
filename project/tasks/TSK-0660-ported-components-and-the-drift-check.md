---
id: TSK-0660
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-3144, REQ-3200]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The owner's 23 components are ported to typed Preact components, and a drift check compares the port with the owner's script

After this task, `src/ui/ds/` holds one Preact component for each of the owner's 23 components with the same element names, `tw-*` class names and roles as `design/design-system/components/bundle.js`, the game loads the owner's two style sheets and never the script, and the drift check passes against the script on the day the port lands.

## Acceptance criteria

1. Given the owner's `bundle.js` in `design/` and the port, when `tools/ds-drift.ts` renders each component and its port from one fixture set with `window.React` set to `preact/compat`, strips text nodes and accessible-name values, and compares element names, class names and roles, then it passes only when each difference is listed in `src/ui/ds/divergences.json` with the finding it follows. Closed by: the drift check's output and a fixture port that differs by one class name and makes it fail.
2. Given the built game, when its network log on the iPad viewport is read and `src/ui` is searched, then no request is for `bundle.js` or `fonts.googleapis.com` and `grep -rP '[\x{0400}-\x{04FF}]' src/ui` finds nothing outside test fixtures. Closed by: a Playwright test of the log and the grep's output.
3. Given `src/` and every per-language file, when the scan runs, then any Unicode `Extended_Pictographic` character, and "✓" and "✗", fails the lint verb with the file and the character, and the committed files pass (REQ-3144, REQ-3200). Closed by: the static check's fixture test and the lint verb's output.
4. Given a working tree with no `design/design-system/`, when the build runs, then it stops with `design_system_missing` and the path it looked in, and given `bundle.js` changed since the last pass, then the check reports `ds_drift` once and stores the new hash. Closed by: a unit test of each case.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add Preact 10.29.8, PixiJS 8.21.0 and Vite 8.3.1, the versions ADR-0150 checked on 2026-09-27, and the Vite step that builds the client; leave the existing screens working and let later tasks replace them one by one. Write each port with the owner's markup, no literal text and every label from the language file through `t`. List each departure ADR-0150 names in `divergences.json`: the thread button with `threads` and `threadDisabled` props, rendered once guiding threads have opened as ADR-0330 amends it, `TopBar` buttons at 56 px on a coarse pointer, the 56 px chips and swatches, `SystemWindow`'s pop entrance and its pause line, the polite live region, keys 1 to 4 for `ChoiceGrid`, the answer field's keyboard mapping and the `OutcomeBadge` mapping. Add the rules of `corrections.css` for the three light strokes, the warm shadows and `shadow-ribbon`, each citing its finding, loaded after `bundle.css`. The ceiling is 30 entries in `divergences.json` and 30 rules in `corrections.css`, and the check reports once when one is exceeded.

The build reads `design/design-system/` from the working tree and bakes the compiled CSS into the image, so the running game never needs `design/`. Do not commit anything under `design/`.

## Depends on

Nothing in this epic. The epic realising ADR-0160 types `t`; the ports call the existing `t` of `src/shared/i18n.ts`, and their calls keep compiling when it is typed.

## Evidence

Not yet.

## Left alone

The behaviours the divergences name, which later tasks of this epic build and test one by one, and the art in the scene column, which ADR-0170 owns.
