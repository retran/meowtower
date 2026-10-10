---
id: EPC-0150
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0150
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The interface is Preact components ported from the owner's design system, styled by its sheets, with PixiJS drawing only the scene

Realises exactly ADR-0150: the typed port of the owner's 23 components and its drift check, the root's theme, palette and text size, the contrast and token checks, the settings screen and the looks that follow her to every device, the type scale and the local fonts, the still task window and the loudness cap, the announcements, the keypad and the answer fields, the term hints, the story screen's grid, the Underside and Awakening screens, the displays, the voice button, and the parent's look at every screen.

Until the epics realising ADR-0040, ADR-0110, ADR-0140 and ADR-0160 exist, the tasks run on fixtures: fixture `InputSpec`s and views, a fixed rank, fixture outcome and chest props and the existing `t` of `src/shared/i18n.ts`. Each task names what it leaves to those epics.

## Acceptance criteria

1. `grep -rP '[\x{0400}-\x{04FF}]' src/ui` finds nothing outside test fixtures, and the game's network log on the iPad shows no request for `bundle.js` or to `fonts.googleapis.com`. Evidence: the command's output and the network log test's report, from TSK-0660 and TSK-0664.
2. The contrast script reports every pair at or above its threshold in 2 themes by 4 presets and in 20,000 random custom palettes per mode, including the stroke on `surface-300`. Evidence: the script's output, from TSK-0662.
3. The drift check passes against the `bundle.js` in `design/` on the day the port lands, with every divergence listed. Evidence: the drift check's output, from TSK-0660.
4. A Playwright test switches the theme, palette, text size and a custom colour on one paired device, reloads a second paired device, and finds the same `data-*` attributes and custom variables before first paint. Evidence: the Playwright test's report, from TSK-0663.
5. A Playwright test on the iPad viewport finds every keypad key at least 64 by 64 px in the same cell across a fraction task and a time task, every other control with a hit area of at least 56 px, and no running animation inside an open task window. Evidence: the Playwright tests' reports, from TSK-0667, TSK-0671 and TSK-0665.
6. A test reads the digits 0 to 9 from each served font file with `tnum` applied and finds one advance width. Evidence: the font test's report, from TSK-0664.
7. A test sends `looks_set` with the theme `dream` or a colour that isn't `#RRGGBB` and gets a 400 response. Evidence: the integration test's report, from TSK-0663.
8. The parent, at the stage 0.3 acceptance, looks at every screen in both themes and all four presets and signs off REQ-3118, REQ-3122, REQ-3232, REQ-3500 and REQ-3516. Evidence: the parent's judgement, from TSK-0675.
9. Every requirement ADR-0150 addresses lands in a closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the number of divergences and correction rules against their ceiling of 30 each, which the drift check of TSK-0660 reports, and the time a screen change takes on the stage 0 iPad against the 100 ms budget, which ADR-0150 reverses its framework on and which a Playwright run of TSK-0671's grid shows.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-0660 The owner's 23 components are ported to typed Preact components, and a drift check compares the port with the owner's script
      closes: REQ-3144, REQ-3200
      depends: none
- [ ] T-002 [P] TSK-0661 The root carries her theme, palette and text size, the dreamcore layer sits on the scene alone, and the Parent Room keeps the light theme
      closes: REQ-3108, REQ-3142, REQ-3246
      depends: TSK-0660 - the ports and the style sheets whose variables the attributes select.
- [ ] T-003 [P] TSK-0662 The verify command fails on a contrast below its threshold, on a colour literal and on a grey shadow
      closes: REQ-3100, REQ-3112, REQ-3114, REQ-3116, REQ-3138, REQ-3140
      depends: TSK-0660 - the check reads the owner's token and component sheets.; TSK-0661 - custom palettes are checked after `paletteVars`.
- [ ] T-004 [P] TSK-0663 She changes the look in her settings at any time, and every paired device opens in it
      closes: REQ-3102, REQ-3104, REQ-3106, REQ-3110, REQ-3242, REQ-3244, REQ-3522
      depends: TSK-0661 - the root attributes and `paletteVars` it sets.
- [ ] T-005 [P] TSK-0664 Text sizes, line length, local fonts and equal-width digits hold on the iPad and on a computer
      closes: REQ-3120, REQ-3124, REQ-3126, REQ-3128, REQ-3130, REQ-3132, REQ-3134, REQ-3136
      depends: TSK-0660 - the type-scale tokens and style sheets.; TSK-0662 - the stylelint configuration the type-scale rule extends.
- [ ] T-006 [P] TSK-0665 Nothing moves in the task window, nothing flashes more than three times a second, and no sound starts loud
      closes: REQ-3508, REQ-3146, REQ-3148
      depends: TSK-0660 - the task window and its layers are ported components.
- [ ] T-007 [P] TSK-0666 A screen reader announces a System window and a new story line without interrupting, and every counter names its resource
      closes: REQ-3202, REQ-3230, REQ-3224
      depends: TSK-0660 - `SystemWindow`, the story log and the counters are ported components.
- [ ] T-008 [P] TSK-0667 The maths keypad holds its keys in fixed cells on the right, and «Готово» and «Не знаю» sit apart from it
      closes: REQ-0712, REQ-0720, REQ-0724, REQ-3204, REQ-3206, REQ-3208, REQ-3210
      depends: TSK-0660 - the ported `TaskWindow`.
- [ ] T-009 TSK-0668 Each answer kind has its own field, and an entry the engine can't parse is marked softly
      closes: REQ-0714, REQ-0716, REQ-0718, REQ-0764, REQ-0738
      depends: TSK-0667 - the keypad and the action row these fields sit with.
- [ ] T-010 [P] TSK-0669 «Не знаю» is on every task kind, a choice keeps its colours after an answer, and keys 1 to 4 select an option
      closes: REQ-0722, REQ-3212, REQ-3238
      depends: TSK-0660 - `ChoiceGrid`, `TaskWindow` and the action row.
- [ ] T-011 [P] TSK-0670 A maths term with a glossary entry is marked, and a tap opens its explanation, picture and approved Dutch word
      closes: REQ-0840, REQ-0842
      depends: TSK-0660 - the ported `TaskWindow` and its popover layer.
- [ ] T-012 [P] TSK-0671 Every story screen is one grid with the story in the centre, a scene column with no button, and a top bar that always leaves
      closes: REQ-3500, REQ-3502, REQ-3504, REQ-3506, REQ-3510
      depends: TSK-0660 - the grid is built from ported components and tokens.; TSK-0661 - the grid reads the root's theme and text size.
- [ ] T-013 TSK-0672 Every Underside screen shows «Мне страшно» and a lantern, and the Awakening closes with rank E
      closes: REQ-3514, REQ-3516, REQ-3526, REQ-3528, REQ-3530
      depends: TSK-0671 - the screen layout the lantern and the button belong to.
- [ ] T-014 [P] TSK-0673 Outcomes, the knot scheme, the experience bar, elements, chests, unmet creatures and quests show what the rules require
      closes: REQ-3214, REQ-3216, REQ-3218, REQ-3220, REQ-3222, REQ-3226, REQ-3228, REQ-3240
      depends: TSK-0660 - the ported components these displays are made of.
- [ ] T-015 [P] TSK-0674 The story field has a voice button, and where Safari offers no speech recognition it opens the keyboard's dictation
      closes: REQ-3234
      depends: TSK-0660 - `StoryInput` is a ported component.
- [ ] T-016 TSK-0675 The parent looks at every screen in both themes and all four presets and signs off the five rules a person must judge
      closes: REQ-3118, REQ-3122, REQ-3232, REQ-3500, REQ-3516
      depends: TSK-0663 - the looks can be set through the profile.; TSK-0671 - the story screen the images show.; TSK-0672 - the Underside screens and their light.; TSK-0673 - the displays the images show.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0660.
- After TSK-0660: TSK-0661, TSK-0665, TSK-0666, TSK-0667, TSK-0669, TSK-0670, TSK-0673 and TSK-0674.
- After TSK-0661: TSK-0662, TSK-0663 and TSK-0671.
- After TSK-0662: TSK-0664.
- After TSK-0667: TSK-0668.
- After TSK-0671: TSK-0672.
- After TSK-0663, TSK-0671, TSK-0672 and TSK-0673: TSK-0675.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0660 | REQ-3144, REQ-3200 |
| TSK-0661 | REQ-3108, REQ-3142, REQ-3246 |
| TSK-0662 | REQ-3100, REQ-3112, REQ-3114, REQ-3116, REQ-3138, REQ-3140 |
| TSK-0663 | REQ-3102, REQ-3104, REQ-3106, REQ-3110, REQ-3242, REQ-3244, REQ-3522 |
| TSK-0664 | REQ-3120, REQ-3124, REQ-3126, REQ-3128, REQ-3130, REQ-3132, REQ-3134, REQ-3136 |
| TSK-0665 | REQ-3508, REQ-3146, REQ-3148 |
| TSK-0666 | REQ-3202, REQ-3230, REQ-3224 |
| TSK-0667 | REQ-0712, REQ-0720, REQ-0724, REQ-3204, REQ-3206, REQ-3208, REQ-3210 |
| TSK-0668 | REQ-0714, REQ-0716, REQ-0718, REQ-0764, REQ-0738 |
| TSK-0669 | REQ-0722, REQ-3212, REQ-3238 |
| TSK-0670 | REQ-0840, REQ-0842 |
| TSK-0671 | REQ-3500, REQ-3502, REQ-3504, REQ-3506, REQ-3510 |
| TSK-0672 | REQ-3514, REQ-3516, REQ-3526, REQ-3528, REQ-3530 |
| TSK-0673 | REQ-3214, REQ-3216, REQ-3218, REQ-3220, REQ-3222, REQ-3226, REQ-3228, REQ-3240 |
| TSK-0674 | REQ-3234 |
| TSK-0675 | REQ-3118, REQ-3122, REQ-3232, REQ-3500, REQ-3516 |

REQ-3500 and REQ-3516 sit in two tasks each: a program test shows the structure, and the parent judges how it reads.

The smallest set of tasks that would test the decision is TSK-0660, TSK-0662, TSK-0664 and TSK-0667. Together they show whether the port keeps the owner's markup, whether any palette the player can pick stays readable, whether digits keep their width in the served fonts, and whether the keypad holds its cells, which are the failures the decision's premortem names.

## Not covered

None of the 71 requirements is deferred. The epic leaves out what ADR-0150 names as other work:

- Test mode's frame (REQ-3518 and the sandbox frame of ADR-0340): the epic realising ADR-0340 draws it, and TSK-0675 leaves it out of the parent's list.
- The strings the components read: the epic realising ADR-0160 owns the file and `t`, so the two epics ship together.
- Art beyond placeholders in the scene column, which ADR-0170 owns, and portrait orientation on the iPad, which the stage 0 spike of REQ-3002 decides before anyone designs it.
- The scratchpad, the rest stop scene, the eye exercises and the hunter's sheet: they have no owner component, are built on the same tokens by their own epics, and join TSK-0675's route list when they land.
