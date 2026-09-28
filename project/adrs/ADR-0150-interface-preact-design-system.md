---
id: ADR-0150
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-3100, REQ-3102, REQ-3104, REQ-3106, REQ-3108, REQ-3110, REQ-3112, REQ-3114, REQ-3116, REQ-3118, REQ-3120, REQ-3122, REQ-3124, REQ-3126, REQ-3128, REQ-3130, REQ-3132, REQ-3134, REQ-3136, REQ-3138, REQ-3140, REQ-3142, REQ-3144, REQ-3146, REQ-3148, REQ-3200, REQ-3202, REQ-3204, REQ-3206, REQ-3208, REQ-3210, REQ-3212, REQ-3214, REQ-3216, REQ-3218, REQ-3220, REQ-3222, REQ-3224, REQ-3226, REQ-3228, REQ-3230, REQ-3232, REQ-3234, REQ-3236, REQ-3238, REQ-3240, REQ-3242, REQ-3244, REQ-3246, REQ-3500, REQ-3502, REQ-3504, REQ-3506, REQ-3508, REQ-3510, REQ-3512, REQ-3514, REQ-3516, REQ-3520, REQ-3522, REQ-3524, REQ-3526, REQ-3528, REQ-3530, REQ-0712, REQ-0714, REQ-0716, REQ-0718, REQ-0720, REQ-0722, REQ-0724, REQ-0738, REQ-0764, REQ-0840, REQ-0842]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0150. The interface is Preact components ported from the owner's design system, styled by its token and component sheets, with PixiJS drawing only the scene

## Decision

The game's interface is written in Preact, and its components are typed ports of the owner's 23 components in `design/design-system/components/bundle.js`. The game loads the owner's `design-system/tokens.css` and then `components/bundle.css` by those paths, as `design/README.txt` and CLAUDE.md require, and never loads `bundle.js` at run time. PixiJS draws the scene picture, sprites and effects inside the scene column and nothing else. I checked the versions on the npm registry on 2026-09-27: Preact 10.29.8, PixiJS 8.21.0, Vite 8.3.1.

The decision has eight parts, each a rule a program checks.

1. Components. `src/ui/ds/` holds one Preact component per owner component, with the same markup, `tw-*` class names and roles as `bundle.js`, so `bundle.css` styles them unchanged. A port takes no literal text: every label, caption and accessible name comes from the per-language string file that ADR-0160 defines, so the roughly 37 distinct Russian strings baked into `bundle.js` stay out of the code (REQ-3810). A port departs from `bundle.js` only where a resolved finding in RES-3200 or RES-3100 says so, and `src/ui/ds/divergences.json` lists each departure with the finding it follows. The departures are these:
   - `TaskWindow` always renders «Путеводная нить · N» and takes `threads` as a required prop, plus `threadDisabled`.
   - `TopBar` renders its buttons at `md` (56 px) when `(pointer: coarse)` matches, and adds the settings paw (REQ-3506).
   - `StoryInput` chips grow to 56 px and `ColorRole` swatches get a 56 px hit area on a coarse pointer.
   - `SystemWindow` enters with `ease-pop` over `dur-pop`, and a pause line appears as its own line 1000 ms after the line before it (a delay I chose).
   - Screen-reader announcements go through one polite live region at the root; see part 5.
   - `ChoiceGrid` selects with keys 1-4 and `StoryInput` picks with keys 1-3 while its field is empty (REQ-3238, REQ-3236).
   - The answer field takes typed digits, the comma, minus, "/" and ":" as the keypad keys, Enter as «Готово» and "?" as «Не знаю» (REQ-3210, RES-3500).
   - `OutcomeBadge` maps the three game outcomes to its five views as RES-3200 sets out.
2. Tokens and looks. The root carries `data-theme` (`light` or `dark`), `data-palette` (the four presets) and `data-text`, and a custom palette sets its variables through `paletteVars`, ported to `src/ui/ds/palette.ts` with the stroke correction from RES-3100. The dreamcore theme is set only on the scene layer, by a story event from ADR-0110, never on the root, so the task window, rest stops, eye exercises and the heroine's room keep her theme (REQ-3108, REQ-3246). The Parent Room's root carries `data-theme="light"` and no palette, so the `state-*` colours never follow her choice (REQ-3142). Until the owner's files carry the corrections RES-3100 resolved (the three light strokes, the warm shadows, `shadow-ribbon`), `src/ui/ds/corrections.css` loads after `bundle.css` and sets those values, each rule citing its finding.
3. Choosing looks. The settings screen offers light and dark, the four presets, a custom palette of four roles from swatches or the device colour picker, normal or large text and sound on or off, all at once, with no lock or price, and applies a change on the next frame (REQ-3102, REQ-3104, REQ-3106, REQ-3244, REQ-3522, REQ-3524). Each palette card previews itself in the current theme (REQ-3242). A change becomes one `looks_set` event in the log of ADR-0020, sent through the client queue of ADR-0030. The server writes the last looks as attributes into the HTML shell it serves, so every paired device opens in her looks with no flash of the default (REQ-3110). The server's schema accepts only `light` and `dark` for the theme and only a `#RRGGBB` colour for a role, so no request can set dreamcore or inject CSS.
4. Checks on the look. The verify command of ADR-0190 runs these static checks:
   - A contrast script computes every pair RES-3100 lists (31 pairs per palette and theme) at 4.5:1 for text and 3:1 for strokes and the focus ring, in both themes, the four presets and 20,000 seeded random custom palettes per mode (REQ-3112, REQ-3114, REQ-3116).
   - A stylelint configuration rejects colour literals in `src/`, references to `--art-*` or location tokens outside the scene code, and any `font-size` that isn't a type-scale token (REQ-3100, REQ-3124 to REQ-3132).
   - A script fails when a shadow token's colour has equal red, green and blue values or is black (REQ-3138), and when an `el-*` token is redefined inside a palette block (REQ-3140).
   - A scan rejects any Unicode `Extended_Pictographic` character or "✓" or "✗" in `src/` and in the string files (REQ-3144, REQ-3200).
5. Behaviour on screen. Playwright tests on WebKit at the iPad's 1180 by 820 and at a 1440 by 900 desktop check the rest:
   - text sizes: at least 13 px everywhere, story 20 px and task 24 px, or 24 px and 28 px with large text;
   - the story column at 68 characters or less;
   - no `getAnimations()` result inside the task window, with the PixiJS ticker stopped while the window is open (REQ-3508);
   - keypad keys of 64 by 64 px in fixed cells on the right half of the screen (REQ-3204, REQ-3206, REQ-3208);
   - options that keep their colours after an answer (REQ-3212);
   - the rules for the badge, knot scheme, experience bar, elements, counters, chest, unmet creatures and quests (REQ-3214 to REQ-3228, REQ-3240).
   The root holds one live region with `aria-live="polite"`, present from the first paint. A new System window writes its text there, and the story log's own `role="log"` region announces new lines, so a window appears in the accessibility tree once and nothing interrupts the reader (REQ-3202, REQ-3230). A System window inside the log drops `role="status"`, which the bundle gives it, so it isn't announced twice.
6. Screens. Every story screen is one CSS grid: the top bar, the scene column 380 px wide on the left and the story column as the centre, with the log above the input line (REQ-3500). The scene column is a PixiJS canvas with no interactive element in it (REQ-3502). The top bar always holds «Привал», «Сохранить и уйти» and the paw (REQ-3504, REQ-3506). The task window, System windows and ceremonies are layers over a scrim. The task window's action row holds «Не знаю», the thread button and «Готово» side by side (REQ-3510). A Guardian's word problem opens a `ChoiceGrid` of the four short models that ADR-0040 supplies, and only then the step rows (REQ-3512). Every Underside screen renders «Мне страшно» and a lantern drawn by the interface layer, not by the scene art, so no generated picture can leave the screen without a light (REQ-3514, REQ-3516); ADR-0110 decides what the button does. A root attribute `data-mode="test"` draws the striped frame and the label «Проверка · не идёт в статистику игрока» on every screen of the parent's test mode (REQ-3520). The Awakening's closing System window shows the line from the string file with a `RankBadge` beside it at the rank ADR-0140's progression holds, which is E at that point (REQ-3528, REQ-3530). The Parent Room's creepiness setting takes its heading from the string file (REQ-3526). On a computer the same grid runs at CSS pixel sizes, centred, with no scaling transform, because a transform would shrink text below the sizes REQ-3124 to REQ-3132 set in CSS pixels.
7. Fonts, motion and sound. The game serves Nunito, M PLUS Rounded 1c and Caveat itself, from the Fontsource packages with their Cyrillic subsets, preloaded, and the build strips the remote Google Fonts `@import` from its copy of `bundle.css`. Serving the fonts locally means a slow or blocked Google request never shows a fallback face inside a word (REQ-3134), and the iPad sends no request to Google. Digits use `font-variant-numeric: tabular-nums` (REQ-3136). Animations use only the duration and easing tokens, and a check rejects any repeating animation whose period is under 334 ms, so nothing can flash more than three times a second (REQ-3146). Every sound plays through one Web Audio gain node that ramps up over at least 50 ms. The build normalises each sound file to -20 LUFS integrated loudness and a -3 dBTP true peak, so no sound starts loud (REQ-3148); both figures are budgets I chose. The voice button starts the browser's speech recognition in `ru-RU` where Safari offers it. The owner decided on 2026-09-27: voice input may use Safari's speech recognition, which sends her voice to Apple; ADR-0100 records it at the privacy boundary. Where Safari offers none, the button focuses the field, so the system keyboard opens with its own dictation key (REQ-3234).
8. Answer fields, the keypad and term hints. The task window draws the answer input the `InputSpec` of ADR-0040 describes, and ADR-0040's checker judges it:
   - The maths keypad holds the digits, the decimal comma, «дробь», «целая часть», «остаток», «:» for time, minus and erase, and nothing else (REQ-0712). «Готово» and «Не знаю» sit in the action row, apart from the digit keys, and never on the keypad (REQ-0720, REQ-0724), because a slip onto «Не знаю» ends a first attempt that can't be taken back.
   - A fraction is a two-storey field with the numerator above the denominator (REQ-0714), a mixed number gets three fields, whole part, numerator and denominator (REQ-0716), and a quantity with a unit shows the unit's label from the string file beside its field (REQ-0718).
   - A point answer is a tap on a node of the coordinate grid, and the grid has no typed coordinates (REQ-0764). A choice, model-choice or grid task shows no keypad and still shows «Не знаю» in its action row (REQ-0722); a Playwright test opens one task of every answer kind and finds the button.
   - When `check()` returns `unparsed`, the field takes a soft outline from the design tokens, with no text, no icon and no error colour, and «Готово» stays inactive until the entry parses, so the clock keeps running (REQ-0738). The parent judges at stage acceptance whether the mark reads as soft.
   - ADR-0040 builds the term spans in the task view from each template's `riskyTerms`, and the task window draws every span that has a glossary entry with a dotted underline as a button (REQ-0840). A tap opens a popover inside the task window with the term's Russian explanation and its picture from `lexicon.ru.json`, and its Dutch word only for an entry the parent approved (ADR-0180), and logs `glossary_opened` with the term and the `itemId` (REQ-0842). The popover is a layer of the task window, so it adds no animation there.

What works once this is accepted and built: every screen the player and the parent see renders from the ported components in her theme, palette and text size, the contrast and size rules fail the build when broken, and her looks follow her to every device. What doesn't work yet: the strings the components read need ADR-0160's file and `t()`, so the two decisions ship together; art beyond placeholders waits for ADR-0170; the scratchpad, the rest stop scene, the eye exercises and the hunter's sheet have no owner component and are built on the same tokens, reviewed by the parent at stage acceptance (ADR-0190).

## Why

The owner's design system already encodes most of the rules the requirements ask for: no ticks, no clocks, the task window still, numbers only in fields (RES-3200). Using its markup and style sheets keeps those rules. Using its script does not work, for four reasons RES-3200 records. `bundle.js` hard-codes about 37 distinct Russian strings, including accessible names such as «Клавиатура» and «числитель», which no prop reaches, and CLAUDE.md requires every player-facing string in a per-language file. It lacks behaviours the requirements need: the number keys, the pop entrance, the always-rendered thread button and the touch sizes. Its typings disagree with its code in five places. And it reads a global `window.React` lazily, so the game would ship `preact/compat` and a global namespace to run 294 lines it has to override anyway. A port of 294 lines into typed components costs less than wrapping every one of them.

Preact is the stack RES-2500 names, and `index.d.ts` says the components run on "preact/compat in the game". PixiJS draws only the scene because RES-3500's anatomy keeps text, buttons and the input line in the DOM, where a screen reader and the focus ring reach them, and the scene picture holds no buttons.

The design folder isn't committed (CLAUDE.md), so the build reads `design/design-system/` from the working tree on the family Mac and bakes the compiled CSS into the Docker image; the running game never needs `design/`. The dreamcore layer goes on a nested scene element because RES-3100 left open whether it sits on the root. On a nested element the cascade question disappears: the element's own `[data-theme="dream"]` variables win over the inherited palette.

The strongest objection is that a port forks the owner's components. Every change the owner makes to `bundle.js` must now be carried over by hand, and a port that looks right can drift from the owner's markup in a way nobody sees until a style breaks. I accept this because the alternative leaves the strings in the code, and I limit it with the drift check under Consequences, which compares the two trees on every verify run while `design/` is present.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: build each screen ad hoc, without the design system | nothing to port; each screen written when needed | the rules on grades, clocks, contrast and touch sizes would be re-made per screen and checked nowhere, which RES-3100 and RES-3200 exist to prevent |
| Load `bundle.js` as it is, with `window.React` set to `preact/compat` | zero porting; the owner's updates arrive untouched | about 37 hard-coded Russian strings break REQ-3810 and CLAUDE.md; the number keys, pop entrance, announcer and coarse-pointer sizes would all need wrappers around a global script; typings are wrong in five places |
| Edit `bundle.js` in place to read strings and add the missing behaviour | one copy of the components | edits an untracked owner file that has no history, so the game's behaviour would depend on changes git can't show or restore |
| React 18 in place of Preact | runs `bundle.js` natively, no compat layer | RES-2500 chose Preact for size on the iPad; with a port neither needs compat, so React's extra weight buys nothing |
| Draw the whole interface in PixiJS | one renderer, uniform animation | text on a canvas is invisible to screen readers and the focus ring, and REQ-3202, REQ-3224 and REQ-3230 need the DOM |

## What it costs

The port is about 300 lines of TSX by my estimate, with a test per component, written once. The drift check and `divergences.json` cost the developer a review each time the owner changes `bundle.js`; the check reports the change once, and the game keeps running on the port while nobody reviews it, even for a month. The owner does more work only by choice: carrying the RES-3100 corrections into `design/` lets `corrections.css` shrink, and nothing waits on it. The parent judges REQ-3118, REQ-3122, REQ-3148, REQ-3232, REQ-3500 and REQ-3516 at stage acceptance, about 15 minutes per stage by my estimate, and never in real time. Self-hosted fonts add about 300 KB of font files to the image, by my estimate for the Cyrillic and Latin subsets of the weights RES-3100 lists. The 20,000-palette contrast fuzz adds a few seconds to each verify run.

## What would reverse it

- The owner rewrites `bundle.js` to take every string through a prop or a table and adds the missing behaviours. The port then has nothing left to add, and the game would load the owner's script directly.
- A Playwright run on the stage 0 iPad spike (REQ-3002) shows a screen change taking longer than 100 ms on the iPad, a budget I chose for a tap to feel immediate, which stands in the Baselines table of ADR-0190 with this record's other budgets. A heavier or lighter framework would then be weighed again.
- Safari on the iPad stops honouring `(pointer: coarse)`, so the tablet sizes can't be told from the desktop sizes by media query.

## Consequences

The drift check `tools/ds-drift.ts` loads `bundle.js` in jsdom with `window.React` set to `preact/compat`. It renders each owner component and its port from one fixture set, strips text nodes and accessible-name values, and compares element names, class names and roles. It passes when every difference appears in `divergences.json`. It stores the hash of the `bundle.js` it last passed against, reports once when the hash changes, and reports once when a rule in `corrections.css` has become redundant because the owner's tokens now carry the value. That drains `corrections.css` as the owner's files catch up. The ceiling is 30 rules in `corrections.css` and 30 entries in `divergences.json`, both limits I chose; the check reports once when either is exceeded, because a longer list means the port has become a separate design.

The story log keeps its latest 200 messages in the DOM and fetches older ones on scroll, a ceiling I chose so a long day's log never slows the iPad. PixiJS keeps textures for the current floor only and destroys them on a floor change, because Safari on the iPad caps canvas memory per page.

The security boundary is the text and the colours that reach the DOM. Ordered by the likelihood of damage:

1. Text from the Master or the Explainer could carry markup. Preact escapes every text node, and the ports use `dangerouslySetInnerHTML` only for the icon SVG constants built from the owner's files at build time.
2. A custom colour goes into a `style` attribute. The client and the server accept only `#RRGGBB`, so no value can close the declaration.
3. The client never loads `bundle.js`, so no `window.Tower` global is exposed to the page.

The adversary is our own models' output and a malformed request, not a person attacking the home network, which ADR-0010 covers.

Failure states, each with its next step and one audience:

| State | When | Next step | Audience |
| --- | --- | --- | --- |
| `design_system_missing` | the build finds no `design/design-system/` | restore the folder from the owner's copy; the build stops with the path it looked in | developer |
| `ds_drift` | `bundle.js` changed or a port differs outside `divergences.json` | port the change or list the divergence with its finding | developer |
| `contrast_failed` | a pair falls below its threshold in any theme, preset or fuzzed palette | fix the token or `palette.ts`; the build stops | developer |
| `scene_unavailable` | WebGL is missing or its context is lost | the scene column shows the scene's still image and the story goes on | developer, through a client error report; the player sees the still |
| `font_missing` | a font file fails to load within the preload | the text renders in `system-ui` for that screen, and the client reports the error | developer |
| `voice_unavailable` | Safari offers no speech recognition | the voice button focuses the field for the system keyboard's dictation | player |

A lost `looks_set` write has no state of its own: it waits in ADR-0030's queue like any other write.

The premortem, written as though it already happened: the port shipped and the owner, a month later, changed the keypad's layout in `bundle.js`. Nobody was working on the game that month, so the drift report sat unread, and the game kept the old layout, which was fine. The real failure came from the other side. The Fontsource Nunito files were subset without the `tnum` feature, so `tabular-nums` did nothing, digits in the answer field jumped as she typed, and no test caught it because the checks looked at CSS and not at glyph widths. The test under "How I will know" that measures digit advance widths in the served font exists because of this. A second failure: `(pointer: coarse)` matched on a touch-screen laptop a guest used, so the top bar grew, which was harmless.

## How I will know it was realised

1. `grep -rP '[\x{0400}-\x{04FF}]' src/ui` finds nothing outside test fixtures, and the game's network log on the iPad shows no request for `bundle.js` or to `fonts.googleapis.com`.
2. The contrast script reports every pair at or above its threshold in 2 themes by 4 presets and in 20,000 random custom palettes per mode, including the stroke on `surface-300`.
3. The drift check passes against the `bundle.js` in `design/` on the day the port lands, with every divergence listed.
4. A Playwright test switches the theme, palette, text size and a custom colour on one paired device, reloads a second paired device, and finds the same `data-*` attributes and custom variables before first paint.
5. A Playwright test on the iPad viewport finds every keypad key at least 64 by 64 px in the same cell across a fraction task and a time task, every other control with a hit area of at least 56 px, and no running animation inside an open task window.
6. A test reads the digits 0 to 9 from each served font file with `tnum` applied and finds one advance width.
7. A test sends `looks_set` with the theme `dream` or a colour that isn't `#RRGGBB` and gets a 400 response.
8. The parent, at the stage 0.3 acceptance, looks at every screen in both themes and all four presets and signs off REQ-3118, REQ-3122, REQ-3232, REQ-3500 and REQ-3516.

## What this does not settle

- REQ-3518, that test mode leaves the player's record untouched: ADR-0180 settles the separate test profile on ADR-0020's log. This decision only draws the frame.
- REQ-3532 and REQ-3534, the names the hatching screen suggests: ADR-0140 filters the suggestion list, and the screen only shows it.
- The file format of the strings, the `t()` function and the forbidden-word check: ADR-0160.
- What «Мне страшно» does, when dreamcore starts and what the Master says: ADR-0110.
- The art in the scene column and its style: ADR-0170.
- The Parent Room's contents and the PIN: ADR-0180. This decision fixes only its colours and heading.
- Where the sound files come from. This decision only caps their loudness.
- Portrait orientation on the iPad. The design draws landscape only, and the stage 0 spike (REQ-3002) should show whether the home-screen app can be held in landscape before anyone designs a portrait layout.

Amended by ADR-0220, ADR-0250, ADR-0270, ADR-0300, ADR-0320, ADR-0330 and ADR-0340, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0370, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
