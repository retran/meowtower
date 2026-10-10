---
id: SPC-0150
artifact: spec
status: live
revised: 2026-09-29
states: [REQ-0712, REQ-0714, REQ-0716, REQ-0718, REQ-0720, REQ-0722, REQ-0724, REQ-0738, REQ-0764, REQ-0840, REQ-0842, REQ-3100, REQ-3102, REQ-3104, REQ-3106, REQ-3108, REQ-3110, REQ-3112, REQ-3114, REQ-3116, REQ-3118, REQ-3120, REQ-3122, REQ-3124, REQ-3126, REQ-3128, REQ-3130, REQ-3132, REQ-3134, REQ-3136, REQ-3138, REQ-3140, REQ-3142, REQ-3144, REQ-3146, REQ-3148, REQ-3200, REQ-3202, REQ-3204, REQ-3206, REQ-3208, REQ-3210, REQ-3212, REQ-3214, REQ-3216, REQ-3218, REQ-3220, REQ-3222, REQ-3224, REQ-3226, REQ-3228, REQ-3230, REQ-3232, REQ-3234, REQ-3238, REQ-3240, REQ-3242, REQ-3244, REQ-3246, REQ-3500, REQ-3502, REQ-3504, REQ-3506, REQ-3508, REQ-3510, REQ-3514, REQ-3516, REQ-3522, REQ-3526, REQ-3528, REQ-3530]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The interface: design-system components, the task window, the screens and the scene layer

## Scope

This document covers the game's interface in the browser: the Preact components ported from the owner's design system, the style sheets and root attributes that give them her looks, the settings that choose those looks, the story screen and its top bar, the task window with its answer fields, keypad and term hints, the components that show game state, the screen-reader announcements, the fonts, motion and sound limits, and the PixiJS scene layer. It is written at the component and screen level: components, root attributes, layout, the two events the interface logs and the checks that hold each rule. A reader who needs the routes and packets the interface draws reads SPC-0030, and one who needs the event log reads SPC-0020.

It leaves out what other specifications state. ADR-0160 states the per-language string files and `t()`, from which every label here comes. SPC-0040 states the `InputSpec`, the checker, «Нельзя узнать» (can't be known) and its options step. SPC-0080 states the attempt flow, what the task window may hold, the hint ladder and the review. ADR-0270 states which opening phase a word problem takes, the model choice or the plan's cards. SPC-0110 states the Master's scenes, what «Мне страшно» (I'm scared) does and when the dreamcore layer starts. SPC-0140 states the game rules behind every counter, badge, chest and rank. ADR-0170 states the art the scene column draws. ADR-0180 states the Parent Room's pages. ADR-0320 states the sound channels, `playSound` and the pressed look. ADR-0330 states the starters, the schedule that opens guiding threads and the other systems, and ADR-0340 states the sandbox and its frame. ADR-0430 states the Dutch probe's letters and their controls, and ADR-0390 states the profile's bars. SPC-0010 states the tablet and computer interfaces and how a device picks one.

## Boundary

### Files and modules

| Surface | What it is |
| --- | --- |
| `design/design-system/tokens.css`, then `design/design-system/components/bundle.css` | The owner's token and component sheets, loaded in this order by these paths. The build reads them from the working tree, strips the remote Google Fonts `@import` from its copy of `bundle.css`, and bakes the compiled CSS into the image. |
| `src/ui/ds/corrections.css` | Loads after `bundle.css` and sets each value RES-3100 corrected that the owner's files don't yet carry, at most 30 rules, each citing its finding. |
| `src/ui/ds/` | One Preact component per owner component, 23 in all: `Button`, `SystemWindow`, `TaskWindow`, `AnswerField`, `MathKeypad`, `ChoiceGrid`, `OutcomeBadge`, `KnotScheme`, `XpBar`, `RankBadge`, `ElementChip`, `Counter`, `RewardChest`, `FamiliarCard`, `StoryLog`, `StoryInput`, `QuestList`, `TermHint`, `SkillState`, `TopBar`, `PalettePicker`, `ColorRole` and `Icon`. |
| `src/ui/ds/divergences.json` | Each place a port departs from `bundle.js`, with the finding in RES-3100, RES-3200 or RES-4110 or the decision it follows, at most 30 entries. |
| `src/ui/ds/palette.ts` | `paletteVars`, which turns a custom palette's four colour roles into CSS variables. |
| `src/ui/scene/` | The PixiJS scene layer, the only code that imports `pixi.js`. This path is a choice this document makes. |
| `tools/ds-drift.ts` | The drift check, which compares each port with its owner component. |
| Fonts | Nunito, M PLUS Rounded 1c and Caveat from the Fontsource packages with their Cyrillic subsets, served by the game itself and preloaded. |

The game never loads `bundle.js` at run time, so the page has no `window.Tower` global.

### Root attributes

| Attribute | Values | Set by |
| --- | --- | --- |
| `data-theme` | `light` or `dark` | her choice; the Parent Room's root always carries `light` |
| `data-palette` | `strawberry`, `vanilla`, `matcha` or `lavender` | her choice; absent on the Parent Room's root |
| `data-text` | `normal` or `large` | her choice |
| custom palette variables | one `#RRGGBB` per colour role, set through `paletteVars` | her choice |
| `data-mode` | `sandbox` | the sandbox, as ADR-0340 states |

A story event sets the dreamcore layer's `data-theme="dream"` on the scene element only, never on the root.

### Components and their departures from the owner's code

Each port has the markup, `tw-*` class names and roles of its owner component, so `bundle.css` styles it unchanged, and takes every label, caption and accessible name from the string file. The ports depart from `bundle.js` in these places, each listed in `divergences.json`:

| Component | Departure |
| --- | --- |
| `TaskWindow` | Renders «Путеводная нить · N» (Guiding thread · N) once guiding threads have opened, with `threads` and `threadDisabled` as props; takes an optional familiar's portrait and framing line beside a shown hint rung; holds «Нельзя узнать» in its action row on a T1 to T4 word problem other than a Dutch probe letter. |
| `TopBar` | Renders its buttons at 56 px when `(pointer: coarse)` matches, and holds the settings paw. |
| `StoryInput` | Chips grow to 56 px on a coarse pointer; keys 1 to 3 insert a starter while the field is empty, as ADR-0330 states; holds the voice button. |
| `ColorRole` | Swatches get a 56 px hit area on a coarse pointer. |
| `SystemWindow` | Enters with `ease-pop` over `dur-pop`; a pause line appears as a line of its own 1000 ms after the line before it; inside the story log it drops `role="status"`; draws its text on an opaque fill and keeps the gradient at `system-alpha` on its frame alone. |
| `ChoiceGrid` | Keys 1 to 4 select an option. |
| `AnswerField` | Takes typed digits and signs from a physical keyboard. |
| `OutcomeBadge` | Maps the three game outcomes to its five views. |
| `.tw-btn` inside the task window | `transition: none`, so the pressed look is an instant change of state. |

### Events the interface logs

| Event | Payload | When |
| --- | --- | --- |
| `looks_set` | the theme, the palette, the text size and the custom colours | she changes one of them in her settings |
| `glossary_opened` | the term and the `itemId` | she taps a marked term |

Both go through the client's event queue, which SPC-0030 states: it holds answers, grouping sets, `looks_set`, `glossary_opened` and `plan_draft` in the order she made them, and IndexedDB keeps any unsent entry, so a change made offline waits there beside her answers.

### Checks that hold the rules

The verify command runs these static checks, and each stops the build when it fails:

| Check | What it rejects |
| --- | --- |
| Contrast script | Any of the 31 colour pairs RES-3100 lists, per palette and theme below 4.5:1 for text or 3:1 for strokes and the focus ring, in both themes, the four presets and 20,000 seeded random custom palettes per theme, with every colour `paletteVars` derives, the black and white fallbacks included. |
| stylelint | A colour literal in `src/`, a reference to an `--art-*` or location token outside `src/ui/scene/`, and a `font-size` that isn't a type-scale token. |
| Shadow and element script | A shadow token whose colour is black or has equal red, green and blue values, and an `el-*` token redefined inside a palette block. |
| Character scan | Any Unicode `Extended_Pictographic` character, "✓" or "✗" in `src/` or in the string files. |
| Animation check | A repeating animation whose period is under 334 ms, in CSS or among the scene effects `src/ui/scene/` declares with their periods, a sprite's frame loop included. |
| Drift check | A port that differs from its owner component outside `divergences.json`. |

Playwright tests on WebKit at the iPad's 1180 by 820 and at a 1440 by 900 desktop check every rule in Behaviour that the page shows when it runs and that no static check above or parent judgement holds, on both viewports.

### What this part requires from other parts

- SPC-0030 supplies the packets the screens draw, the event queue and the lease; SPC-0020 supplies `looks_set` and `glossary_opened` in the event catalogue.
- ADR-0160 supplies `t()`, the string files and the glossary entries in `lexicon.ru.json`; SPC-0040 supplies the `InputSpec`, `check()` and the term spans in the task view; ADR-0180 supplies the parent's approval of each Dutch word.
- SPC-0140 supplies the rank, the chest's rewards, the element names she gave, the creatures she has met and the quests; SPC-0110 supplies the scenes, the Underside flag and the dreamcore event; ADR-0170 supplies the scene art and each scene's still image.
- ADR-0190 holds this part's budgets in its Baselines table: a screen change on the iPad within 100 ms, 200 story messages in the DOM, 30 entries each in `corrections.css` and `divergences.json`, and the sound loudness.

The permitted dependencies run one way. Screens import the ports in `src/ui/ds/`, and the ports import only Preact, `t()` and `src/shared/`. Only `src/ui/scene/` imports `pixi.js`, and a port or a screen reaches the scene only through the scene element's props. The task window's components never import the audio module. `src/ui/source/` draws the SVG of a source from the task view the server sends and never imports `src/render/source/`, so the server alone renders a source, as ADR-0300 states. Nothing in `src/` imports `design/` at run time, and only the build and `tools/ds-drift.ts` read it.

## Behaviour

### Components and styles

Every screen the player and the parent see renders from the ported components, styled by `tokens.css`, `bundle.css` and `corrections.css` in that order. Preact escapes every text node, and a port uses `dangerouslySetInnerHTML` only for the icon SVG constants the build takes from the owner's files, so a model's text reaches the page as text. The interface draws its icons from `Icon` and never uses an emoji as an icon or a label (REQ-3144).

Interface text takes its colour from the interface tokens, `ink`, `ink-muted`, `on-fill`, `system-ink` and their kin, and never from an `--art-*` token or a location's palette; stylelint holds this (REQ-3100). Shadows use warm tints, and the shadow script rejects a black or neutral grey one (REQ-3138). Each element's `el-*` colour is the same in every palette, because no palette block redefines it (REQ-3140).

After the MVP, `src/ui/ds/profile.css` loads after `corrections.css` and holds one neutral bar colour token and a thin-bar class for a previous window, which the Parent Room's profile draws its bars with, as ADR-0390 states. The file's name is a choice this document makes. The contrast script checks the bar token at 3:1 against every surface the Parent Room's light theme puts behind a bar.

### Her looks

Her settings screen offers, all at once and at any time, the light and the dark theme (REQ-3102), the four preset palettes and a custom palette (REQ-3104), and normal or large text (REQ-3522). No theme, palette or text size is locked behind progress or carries a price (REQ-3106). The theme choice holds `light` and `dark` only, and the dreamcore theme is never among them (REQ-3108). A change applies on the next frame and logs one `looks_set` when she commits it, and a tap on a theme, a palette card, a text size or a swatch commits it; a drag in the device's colour picker logs one `looks_set` when it ends.

Each palette card in `PalettePicker` previews its own colours in the current theme (REQ-3242). A custom palette has four colour roles, and each `ColorRole` accepts any colour she picks from the offered swatches or from the device's colour picker (REQ-3244). `paletteVars` sets the variables for her four colours and derives the text, stroke and focus colours from them, shifting each until it reaches its contrast threshold against every surface it sits on. When no single shift of a derived colour reaches its threshold against every surface, `paletteVars` derives that colour for each surface on its own, and on a surface where no shift of her colour reaches the threshold it takes black or white, whichever reaches it, so every colour she picks is accepted.

The server writes her last looks into the HTML shell it serves as the root attributes and custom variables, so every paired device opens in the theme, palette, text size and colours she last chose, with no flash of the default (REQ-3110). The service worker never answers a request for the HTML shell, which always comes from the server. The server's `looks_set` schema accepts `light` and `dark` for the theme, `strawberry`, `vanilla`, `matcha` or `lavender` for the palette or none for a custom palette, `normal` or `large` for the text size and a `#RRGGBB` colour for a role, and refuses anything else with 400, so no request sets dreamcore or writes CSS into the `style` attribute.

The dreamcore layer sets `data-theme="dream"` on the scene element alone. The task window, rest stops, eye exercises and the heroine's room therefore keep her theme and palette, and the task window follows every look she chooses (REQ-3246). The Parent Room's root carries `data-theme="light"` and no palette, so the `state-*` colours of skill states stay the same whatever she picks (REQ-3142).

### Contrast

Every text on screen reaches 4.5:1 against the ground or fill behind it (REQ-3112). The keyboard focus ring reaches 3:1 against every surface it appears on (REQ-3114). Every outline that marks the edge of a control or panel reaches 3:1 against each surface it sits on, the sunken `surface-300` included (REQ-3116). Each of the three holds in both themes, the four presets and any custom palette, and the contrast script checks all three over the 31 pairs RES-3100 lists and the 20,000 random palettes per theme.

The player's screens never use red to mark a wrong answer or a poor result: an outcome takes `outcome-clean`, `outcome-partial` or `outcome-soft`, and the parent judges every screen in both themes and all four presets at stage acceptance (REQ-3118).

### Text and fonts

No text on any screen is smaller than 13 CSS pixels, the SVG text inside a source included (REQ-3124). Story text is at least 20 px (REQ-3126) and task text at least 24 px (REQ-3128) in normal text. With `data-text` large, story text is at least 24 px (REQ-3130) and task text at least 28 px (REQ-3132). SVG text inside a source is at the `task` size or above. Every `font-size` is a type-scale token, which stylelint holds, and a Playwright test measures the rendered sizes in both text sizes.

A column of long text, the story column included, is at most 68 characters wide (REQ-3120). Long text sits on an opaque surface token, never over the scene picture or on a translucent panel, and the parent judges it at stage acceptance (REQ-3122). A System message counts as long text: `SystemWindow` draws its lines on an opaque fill, and the translucent gradient at `system-alpha` stays on its frame, as ADR-0150 states.

Every font the game uses is served from its own Cyrillic subset and draws the whole Russian alphabet, «ё» included, with no fallback face inside a word (REQ-3134). Digits in answers, keypad keys and counters use `font-variant-numeric: tabular-nums`, and a test reads the digits 0 to 9 from each served font file with `tnum` applied and finds one advance width (REQ-3136).

On a computer the same grid runs at CSS pixel sizes, centred, with no scaling transform, so every text keeps the size set above.

### Motion and sound

Animations use only the duration and easing tokens. No repeating animation has a period under 334 ms, so nothing flashes more than three times in any one second (REQ-3146). The scene layer's effects, a sprite's frame loop included, keep the same limit: each declares its period in `src/ui/scene/`, and the animation check reads it. A Playwright test samples the running animations on each screen, through `getAnimations()` and the scene layer's active effects, and finds no period under 334 ms.

Every sound plays through `playSound` and one Web Audio gain node, with one gain per channel under it at -6 dB or less, as ADR-0320 states. The gain ramps up over at least 50 ms from silence, and the build normalises each sound file to -20 LUFS integrated loudness and a -3 dBTP true peak, so no sound starts loud (REQ-3148). The parent judges this at stage acceptance.

### The story screen

Every story screen is one CSS grid: the top bar across the top, the scene column 380 px wide on the left, and the story column in the centre with the story log above the input line (REQ-3500). The parent judges the layout at stage acceptance.

The scene column is a PixiJS canvas with no button and no interactive element in it (REQ-3502). The top bar always holds «Привал» (Rest stop), «Сохранить и уйти» (Save and leave) and the paw that opens her settings, so every story screen shows the way out and the way into her settings (REQ-3504, REQ-3506). The task window, System windows and ceremonies are layers over a scrim above the grid.

Every Underside screen shows the «Мне страшно» button (REQ-3514) and a lantern drawn by the interface layer over the scene column, so no scene picture can leave the screen without a light (REQ-3516). The parent judges the lantern at stage acceptance. SPC-0110 states what the button does.

`StoryLog` keeps its latest 200 messages in the DOM, the budget ADR-0190 holds, and fetches older ones when she scrolls up. It gives the narrator, characters, familiars, the heroine, the Diary and System windows each a look of its own through the message's speaker, and the parent judges the looks at stage acceptance (REQ-3232).

`StoryInput` holds a voice button beside its text field (REQ-3234). The button starts speech recognition in `ru-RU` only in Safari and only where Safari offers it. Every other browser counts as offering none, whatever it exposes. Where none is offered on the tablet, the button focuses the field, so the system keyboard opens with its own dictation key. Where none is offered on the computer, the button focuses the field and shows one line from the Russian string file that names the Mac's dictation key.

At the Awakening's closing System window, the window shows «Пробуждение завершено. Добро пожаловать в Башню.» (Awakening complete. Welcome to the Tower.) from the string file (REQ-3528), with a `RankBadge` beside it at rank E, the rank SPC-0140's progression holds at that point (REQ-3530).

The Parent Room's creepiness setting carries the heading «Уровень жуткости» (Creepiness level) from the string file (REQ-3526).

### The task window

The task window is a flat layer on `surface-200` over a scrim, and SPC-0080 states what it may hold. It animates nothing while it is open: `getAnimations()` inside it returns nothing, the PixiJS ticker stops while it is open, the pressed look of a button inside it has no transition, and a term popover opens as a layer with no motion (REQ-3508). A Playwright test opens the window during each phase and finds no running animation.

Its action row holds, left to right, «Не знаю» (I don't know), «Нельзя узнать» on a T1 to T4 word problem other than a Dutch probe letter, the guiding thread button and «Готово» (Done), so the thread button sits beside «Готово» on every task (REQ-3510). The row keeps this order on solvable and unsolvable word problems alike. A gap of at least one button's width separates «Не знаю» from «Нельзя узнать». «Готово» is a button of the action row and never a key of the keypad (REQ-0720). «Не знаю» sits in the action row, away from the digit keys, and never on the keypad (REQ-0724). The thread button shows only once guiding threads have opened, as ADR-0330 states.

A Playwright test finds «Нельзя узнать» in every phase of every T1 to T4 word problem other than a Dutch probe letter, and on no letter. Letters come after the MVP and only once the owner amends the Russian-only rule in `CLAUDE.md`, as ADR-0430 states, so the test's letter case runs from the stage that builds them.

Every task offers «Не знаю», whatever its answer form: a choice, model-choice, grid or source task that shows no keypad still shows the button in its action row (REQ-0722). A Playwright test opens one task of every answer kind and finds it.

### Answer input

The task window draws the answer input its `InputSpec` describes. The maths keypad holds the digits, the decimal comma, «дробь» (fraction), «целая часть» (whole part), «остаток» (remainder), «:» for time, minus and erase, and no other key (REQ-0712). Every key is at least 64 by 64 CSS pixels (REQ-3204). On the tablet the keypad sits in the right half of the screen, under her thumb (REQ-3206). Each key keeps its cell in every task, and a key a task doesn't use leaves its cell empty (REQ-3208). A Playwright test on the iPad viewport finds every key at least 64 px and in the same cell across a fraction task and a time task.

A fraction field is two-storey, the numerator above the denominator (REQ-0714). A mixed number gets three fields: the whole part, the numerator and the denominator (REQ-0716). A quantity with a unit shows the unit's label from the string file beside its field (REQ-0718). A point answer is a tap on a node of the coordinate grid, and the grid takes no typed coordinates (REQ-0764).

With a physical keyboard, the answer field takes typed digits, the comma, minus, "/" and ":" as the matching keypad keys, Enter as «Готово» and "?" as «Не знаю» (REQ-3210). SPC-0040 states the key for «Нельзя узнать». During a multiple-choice task, keys 1 to 4 select the matching option in `ChoiceGrid`, and «Готово» submits it, as a tap would (REQ-3238).

When `check()` returns `unparsed`, the field takes a soft outline from the design tokens, with no text, no icon and no error colour, and «Готово» stays inactive until the entry parses (REQ-0738). The parent judges at stage acceptance whether the mark reads as soft.

### Term hints

The task view carries a span for each maths term the template lists and for each glossary word its story frame adds, at most 2 (SPC-0040), and the task window draws every span with a glossary entry as a `TermHint`: a button with a dotted underline (REQ-0840). A tap opens a popover inside the task window with the term's Russian explanation and its picture from `lexicon.ru.json`, and the Dutch word only when the parent has approved it, and logs `glossary_opened` with the term and the `itemId` (REQ-0842). A span with no glossary entry shows as plain text.

### Taps and pans

A one-finger contact that moves less than 10 CSS px from its start before it lifts is a tap, and a longer move is a pan, as ADR-0300 states. A Playwright test on the iPad viewport lifts a contact after a 9 px move and finds a tap, and after an 11 px move and finds a pan.

### Outcomes and the review

Every outcome shows an `OutcomeBadge` with an icon and a word together (REQ-3214). The badge maps the three game outcomes to five views: `crit` for `clean` with `critical` true, `clean`, `partial`, `soft` for `alt` after a wrong answer or a wrong «Нельзя узнать», and `unknown`, «Принято» (Accepted), for `alt` after «Не знаю». No player screen shows a tick or a cross to mark an answer or a result, and the character scan holds it (REQ-3200).

After a multiple-choice answer, every option keeps the colours it had before the answer, and none turns right or wrong (REQ-3212). The `KnotScheme` shows her own answer as «Твоё заклинание» (Your spell) beside the steps the code builds, or «—» when she gave none (REQ-3216).

### Game state on screen

The experience bar `XpBar` shows experience points towards the next level and never progress through the day (REQ-3218). An element always appears as an `ElementChip` with its colour, its icon and its name together (REQ-3220), and where she has given the element her own name, every place that shows it shows her name in place of the default (REQ-3222). Every `Counter` carries its resource's name as its accessible name, so a screen reader names the resource with the count (REQ-3224).

Each reward in a `RewardChest` states its quality in words, the string file's word for its tier, `common`, `good` or `sparkle`, beside the tier's colour (REQ-3226). A `FamiliarCard` for a creature she hasn't met shows «???» in place of its name (REQ-3228). `QuestList` marks a finished quest as done and leaves an unfinished one unmarked, never as failed (REQ-3240).

### Screen-reader announcements

The root holds one live region with `aria-live="polite"`, present from the first paint. A new System window drawn over the scrim writes its text there, so a screen reader announces it without interrupting what it is reading (REQ-3202). The story log is a `role="log"` region that announces each new line politely (REQ-3230). A System window that lands in the story log is announced by the log alone: it doesn't write to the root live region and drops `role="status"`, so a screen reader announces it once (REQ-3202). A Playwright test shows a System window of each kind and counts one announcement in the accessibility tree's live-region updates.

### The scene layer

PixiJS draws the scene picture, sprites and effects inside the scene column and nothing else. It keeps textures for the current floor and destroys them on a floor change. Text, buttons and the input line stay in the DOM, where a screen reader and the focus ring reach them.

## Failure paths

| Condition | What happens | Audience |
| --- | --- | --- |
| The build finds no `design/design-system/` | `design_system_missing`: the build stops and prints the path it looked in; restore the folder from the owner's copy. | developer |
| `bundle.js` changed, or a port differs outside `divergences.json` | `ds_drift`: the drift check reports once; port the change or list it with its finding. | developer |
| `corrections.css` or `divergences.json` passes 30 entries | The drift check reports once. | developer |
| A rule in `corrections.css` duplicates a value the owner's tokens now carry | The drift check reports the rule once, so it can go. | developer |
| A colour pair falls below its threshold in any theme, preset or fuzzed palette | `contrast_failed`: the build stops; fix the token or `palette.ts`. | developer |
| A colour literal, an art or location token, or a raw `font-size` appears in `src/` | stylelint fails the build. | developer |
| An emoji, "✓" or "✗" appears in `src/` or a string file | The character scan fails the build. | developer |
| A repeating animation has a period under 334 ms | The animation check fails the build. | developer |
| A test finds a running animation inside an open task window | The Playwright run fails. | developer |
| WebGL is missing or its context is lost | `scene_unavailable`: the scene column shows the scene's still image, the story goes on, and the client reports the error. | developer; the player sees the still |
| A font file fails to load within the preload | `font_missing`: that screen renders in `system-ui`, and the client reports the error. | developer |
| The browser isn't Safari, or Safari offers no speech recognition | `voice_unavailable`: the voice button focuses the field; on the tablet the system keyboard's dictation key serves, and on the computer a line from the string file names the Mac's dictation key. | player |
| `looks_set` carries `dream`, a palette or text size outside its list, a colour that isn't `#RRGGBB` or a sound field | The server answers 400 and logs nothing. | developer |
| A `looks_set` write can't reach the server | It waits in the client's event queue, and the look stays applied on this device. | player |
| An entry doesn't parse | The field takes the soft outline, «Готово» stays inactive, and the clock keeps running. | player |
| A glossary entry's Dutch word isn't approved | The popover shows the Russian explanation and the picture only. | player |
| A term span has no glossary entry | The span shows as plain text. | player |


## Open review findings

- Rejected, round 1: add a reason beside the gap before «Нельзя узнать», the live region present from the first paint, the textures destroyed on a floor change and the 380 px scene column. A specification states what the system does and never why (spec rule S8); the reasons stay in ADR-0150, ADR-0250 and ADR-0190. The 200-message limit now names ADR-0190 as the budget that holds it.
- Rejected, round 1: drop the plain-text rendering of a term span with no glossary entry, since SPC-0040's build check refuses such a template. The rule still defines what the task window draws for a span that reaches it by any other path, and it can be tested with a fixture task view.
- Rejected, round 1: move the post-MVP bar token and the letter case of the «Нельзя узнать» test out to ADR-0390 and ADR-0430. The spec states post-MVP parts it offers, marked as after the MVP, and the letter case depends on the owner amending the Russian-only rule, which the paragraph states.
- Rejected, round 1: settle the keypad-cell test's viewport or the keypad's place on the computer. The paragraph names the iPad viewport for that test, and REQ-3206 places the keypad on the tablet only; the computer layout follows SPC-0010.
