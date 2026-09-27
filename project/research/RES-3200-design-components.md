---
id: RES-3200
artifact: research
status: draft
revised: 2026-09-26
---

# The owner's design proposes 22 ready components on `window.Tower` that build grades, clocks and hard-coded numbers out of the interface

## Summary

The owner's design ships 22 interface components and an icon renderer in one script, `bundle.js`, with their styles in `bundle.css` and their props in `index.d.ts`. The components use the React 18 API and run in the game through `preact/compat`. Each component builds a rule of the design into its markup. Outcome badges carry a word and an icon and never a tick or a cross. The experience bar measures points and never time, the task window has no motion, and System windows take numbers only from code-supplied fields. The task window, the answer field and the maths keypad form the task screen. The story log and the story input form the story screens, and the Parent Room has its own skill-state chip. The typings and the code disagree in five places, and several controls are smaller than the design's own 56px touch minimum. The components also differ from seven existing research records on the task window, the keypad, the outcomes, the skill states, the name of the creatures, the thread supply and touch sizes. This record covers every component README, `index.d.ts`, and the parts of `bundle.js` and `bundle.css` that show what each component does. The tokens, themes and palettes are in RES-3100; the guidelines, key art, screens and prototype are in RES-3300 to RES-3500.

## The question

What does each component of the owner's design do, and what does it guarantee to the game that uses it? The design assumes that ready components can carry the game's rules on grades, clocks and numbers, so that screens built from them can't break those rules. That assumption holds only where the code enforces the rule. Where a README states a rule and the code doesn't enforce it, for example the always-visible thread button or the pop animation, the game has to enforce it itself.

## Method

Read the owner's design files `design-system/components/*/README.md` (all 22), `design-system/components/index.d.ts`, `design-system/components/bundle.js` (all 294 lines) and `design-system/components/bundle.css` (all 299 lines) on 2026-09-26. I compared each README with the code that renders the component and the typings that describe it. I loaded `bundle.js` in Node with a stub `window` to confirm what it registers on `window.Tower`. I searched the existing research records for the outcomes, keypad, skill states, familiars, guiding threads, touch sizes and the task window, and quoted each disagreement.

The files leave these open:

- How the game adds the "pop" entrance for System windows: the README asks for `ease-pop`, and `bundle.css` has no animation or keyframes.
- How number keys pick a suggestion or an option on a computer: the READMEs promise keys 1-3 and 1-4, and the components only show the numbers.
- What the component set does for the scratchpad, the rest stop scene, eye exercises and the hunter's sheet, which have no component here.

## Findings

### The bundle registers the components on `window.Tower` and reads React lazily

`bundle.js` is an immediately invoked function that merges its API into `window.Tower`. Its header declares format 4, namespace `Tower`, and the components `Button`, `SystemWindow`, `TaskWindow`, `AnswerField`, `MathKeypad`, `ChoiceGrid`, `OutcomeBadge`, `KnotScheme`, `XpBar`, `RankBadge`, `ElementChip`, `Counter`, `RewardChest`, `FamiliarCard`, `StoryLog`, `StoryInput`, `QuestList`, `TermHint`, `SkillState`, `TopBar`, `PalettePicker`, `ColorRole` and `Icon`. It reads `window.React` only when a component renders, «so the bundle can load before React does». Besides the components it exports `PALETTES`, `paletteVars`, `contrast`, `ICONS`, `ELEMENTS` and `RANKS`. `README.txt` says the components are for React 18. `index.d.ts` says «Components use the React 18 API (preact/compat in the game)», which agrees with RES-2500's stack of "Preact and CSS animations for screens and System windows".

### The typings describe every component's props

`index.d.ts`, as the owner wrote it:

```typescript
// Хроники Башни — window.Tower. Components use the React 18 API (preact/compat in the game).
type Node = any;
export type Element = 'spark' | 'stride' | 'crumb' | 'drop' | 'harmony' | 'measure' | 'facet' | 'echo';
export type IconName = 'button' | 'thread' | 'yarn' | 'shard' | 'chest' | 'diary' | 'camp' | 'paw' | 'bell' | Element;
export interface IconProps { name: IconName; label?: string; size?: number | string; className?: string }
export interface ButtonProps { variant?: 'primary' | 'secondary' | 'system' | 'honey' | 'quiet'; size?: 'sm' | 'md' | 'lg'; icon?: IconName; disabled?: boolean; onClick?: () => void; type?: 'button' | 'submit'; ariaLabel?: string; className?: string; children?: Node }
export interface SystemWindowProps { title?: string; lines?: Array<string | { pause: true; text: string }>; fields?: Array<{ label: string; value: string | number }>; className?: string; children?: Node }
export interface TaskWindowProps { label?: string | false; prompt?: string; threads?: number; onThread?: () => void; onDontKnow?: () => void; onSubmit?: () => void; submitDisabled?: boolean; className?: string; children?: Node }
export interface AnswerFieldProps { kind?: 'number' | 'fraction' | 'mixed' | 'remainder' | 'time'; value?: { number?: string; num?: string; den?: string; whole?: string; quotient?: string; remainder?: string; hours?: string; minutes?: string }; unit?: string; unparsed?: boolean; className?: string }
export type KeypadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | ',' | 'back' | 'frac' | 'whole' | 'minus' | 'rem' | 'colon' | 'done';
export interface MathKeypadProps { onKey?: (k: KeypadKey) => void; hide?: KeypadKey[]; className?: string }
export interface ChoiceGridProps { options: Array<string | { value: string; label: Node }>; selected?: string; onSelect?: (value: string) => void; label?: string; className?: string }
export interface OutcomeBadgeProps { outcome?: 'crit' | 'clean' | 'partial' | 'soft' | 'unknown'; className?: string; children?: Node }
export interface KnotSchemeProps { given?: Node; answer: Node; steps?: Node[]; outcome?: OutcomeBadgeProps['outcome']; className?: string; children?: Node }
export interface XpBarProps { level: number; value: number; max: number; next?: string; className?: string }
export interface RankBadgeProps { rank?: 'E' | 'D' | 'C' | 'B' | 'A' | 'S'; title?: string; sub?: string; className?: string }
export interface ElementChipProps { element: Element; className?: string; children?: Node }
export interface CounterProps { kind?: 'buttons' | 'threads' | 'yarn' | 'shards' | 'days'; value: number | string; icon?: IconName; label?: string; showLabel?: boolean; className?: string }
export interface Reward { tier?: 'common' | 'good' | 'sparkle'; icon?: IconName; image?: string; name: string; desc?: string }
export interface RewardChestProps { rewards: Reward[]; selected?: number; onPick?: (index: number) => void; className?: string }
export interface FamiliarCardProps { name?: string; element?: Element; image?: string; stage?: number; stages?: number; known?: boolean; className?: string }
export interface StoryMessage { who?: 'narrator' | 'npc' | 'familiar' | 'hero' | 'diary'; speaker?: string; text: Node }
export interface StoryLogProps { messages: StoryMessage[]; className?: string }
export interface StoryInputProps { value?: string; onChange?: (e: any) => void; onSend?: () => void; suggestions?: string[]; onSuggest?: (s: string) => void; placeholder?: string; note?: string; className?: string }
export interface QuestListProps { quests: Array<{ text: string; done?: boolean; pattern?: boolean; row?: string }>; className?: string }
export interface TermHintProps { term: string; definition: string; dutch?: string; picture?: Node; defaultOpen?: boolean; onOpen?: () => void; children?: Node }
export interface SkillStateProps { state: 'untested' | 'emerging' | 'understands' | 'fluent' | 'stable'; code?: string; frontier?: boolean; inferred?: boolean; className?: string; children?: Node }
export interface TopBarProps { left?: Node; right?: Node; onCamp?: () => void; campDisabled?: boolean; onSaveExit?: () => void; className?: string }
export type PaletteId = 'strawberry' | 'vanilla' | 'matcha' | 'lavender';
export interface PalettePickerProps { selected?: PaletteId | string; mode?: 'light' | 'dark'; onPick?: (id: PaletteId) => void; palettes?: Array<{ id: string; name: string }>; label?: string; className?: string }
export interface ColorRoleProps { label: string; hint?: string; value?: string; swatches?: string[]; onChange?: (hex: string) => void; className?: string }
export interface CustomPalette { accent?: string; accent2?: string; magic?: string; warm?: string }
/** CSS custom properties for the game root's style; lightens colours until text stays readable. */
export declare function paletteVars(colors: CustomPalette, mode: 'light' | 'dark'): Record<string, string>;
export declare function contrast(a: string, b: string): number;
```

### The typings disagree with the code in five places

- `IconName` leaves out `mic`, which `ICONS` holds and `StoryInput` uses for its voice button.
- `StoryMessage.who` leaves out `system`, and `StoryMessage` has no `title` or `fields`. `StoryLog/README.md` and `bundle.js` support all three.
- `StoryInputProps` leaves out `sendLabel`, `rows` and `onVoice`, and types `note` as a string, although the README and the code accept `note={false}`.
- The typings declare only props and the two functions `paletteVars` and `contrast`. They don't declare the component functions or the exports `PALETTES`, `ICONS`, `ELEMENTS` and `RANKS`.
- `TermHintProps.term` is required, but `TermHint` renders `children` in its place when both are given, and uses `term` only as the heading inside the popover.

### Resolved: the typings follow the code in all five places

Proposed by research on 2026-09-26 as a correction to the design; the owner approves it with this record.

The code is what renders, and the READMEs agree with it in every case, so the typings change and the code stays. `IconName` adds `mic`. `StoryMessage.who` adds `system`, and `StoryMessage` adds `title?: string` and `fields?: Array<{ label: string; value: string | number }>`. `StoryInputProps` adds `sendLabel?: string`, `rows?: number` and `onVoice?: () => void`, and types `note` as `string | false`. The file declares each component as a function of its props and exports `PALETTES`, `ICONS`, `ELEMENTS` and `RANKS` with their shapes. `TermHintProps.term` stays required, because the popover always needs its heading, and the comment says that `children`, when given, replaces the visible word. Two changes from the resolutions below also land here: `TaskWindowProps.threads` becomes required, and `SkillStateProps` documents that `children` carries the report's label.

### Shared styles guarantee a focus ring, tabular digits and screen-reader text

`bundle.css` says «Every value is a token from tokens.css» and «Text on any pastel fill is --on-fill; text on grounds is --ink». Every component root uses `box-sizing: border-box`. Buttons, keys, options, answer inputs, rewards, terms, the story textarea, suggestion chips, the voice button, palette cards and swatches show a solid 3px `focus-ring` outline offset by 2px on `:focus-visible`. `.tw-num` sets tabular figures, `.tw-ico` sizes an icon to `icon-md` (28px), and `.tw-sr` hides text visually while leaving it for a screen reader.

### `Icon` renders the game's own inline SVG by name

`Icon` renders a `span` holding the SVG from `ICONS` for `name`. With a `label` it gets `role="img"` and `aria-label`; without one it is `aria-hidden`. `size` sets its width and height. `ICONS` holds 18 drawings, each 48x48 with a 2.5px `#6B4540` outline: `button`, `thread`, `yarn`, `shard`, `chest`, `diary`, `camp`, `paw`, `bell`, `mic` and the eight elements `spark`, `stride`, `crumb`, `drop`, `harmony`, `measure`, `facet` and `echo`. An unknown name renders an empty span.

### `Button` is a pill with a lip that sinks on press, and five variants map to five jobs

`Button/README.md` calls it a candy button with an outline and a lip below that sinks when pressed. The variants:

| Variant | Fill | Job |
| --- | --- | --- |
| `primary` | `accent` | one main action per screen: «Готово» (Done), «Дальше» (Next) |
| `secondary` | `accent-2` | «Привал» (Rest stop), the second action |
| `system` | `magic` | System actions, the guiding thread |
| `honey` | `warm` | rewards |
| `quiet` (default) | `surface-200` | «Не знаю» (I don't know), «Сохранить и уйти» (Save and leave) |

Sizes: `sm` 44px, «только в верхней панели на компьютере» (only in the top bar on a computer); `md` 56px; `lg` 64px. `bundle.css` sets `md` as `min-height: var(--touch-min)` with padding `space-5`, `sm` at 44px with padding `space-4` and 15px type, and `lg` at 64px with padding `space-6` and 20px type. The label is 800 16/22. A press moves the button down 3px and removes the lip over `dur-press`. A disabled button drops to `disabled-alpha` «без отсчёта и без пояснения про время» (with no countdown and no word about time). `icon` names an icon from `Tower.ICONS`, drawn before the label. The type defaults to `button`. A label is a verb or a short action name, «Никогда «Проверить» или «Сдаться»» (never "Check" or "Give up").

### Several controls are smaller than the 56px touch minimum that RES-2500 and the tokens set

`tokens.json` says `touch-min` is 56px, «Минимальная зона касания любой кнопки (спецификация: не меньше 56pt)» (the minimum touch zone of any button; the specification says at least 56 pt). RES-2500 records the draft's keypad buttons as "at least 56 pt, on the right under the thumb". These controls are smaller in `bundle.css`: `Button` size `sm` at 44px, the `StoryInput` suggestion chips at a minimum of 44px, and the `ColorRole` swatches at 44px. `Button/README.md` limits `sm` to the top bar on a computer, but `TopBar` always renders its two buttons at `sm`, whatever the device.

### Resolved: on the tablet the top bar's buttons use `md`, the suggestion chips grow to 56px, and the colour swatches reach a 56px touch zone

Proposed by research on 2026-09-26 as a correction to the design; the owner approves it with this record.

RES-2500 compares accepting the 44px controls with holding 56px on the tablet and holds the reason for 56: `touch-min` is the design's own minimum for any button, and the three exceptions sit on controls where a miss costs most. For the components this means:

- `TopBar` renders «Привал» and «Сохранить и уйти» at `md` (56px) when the device has a coarse pointer, and at `sm` (44px) only with a fine pointer, as `Button/README.md` already says. The top bar grows from 44px to 56px high on the tablet, and the anatomy sheet in RES-3500 changes with it.
- `StoryInput` chips take `min-height: var(--touch-min)` on the tablet.
- `ColorRole` swatches either grow to 56px or keep a 44px circle inside a 56px hit area, with gaps wide enough that no two hit areas overlap.

On the computer the 44px sizes stay, because a mouse or trackpad aims more precisely than a finger and WCAG's strictest target is 44 by 44 CSS px.

### `SystemWindow` is a translucent candy panel that takes numbers only as fields

`SystemWindow/README.md` describes a translucent candy panel with a ribbon title and a knitted stitch. `title` is the word on the ribbon: «Задание» (Task), «Уровень» (Level), «Внимание» (Attention) or «Утро» (Morning). `lines` are the lines of the message; an object `{pause: true, text}` is the System's correction after a pause and is indented. `fields` are counters the code fills, such as `[{label: 'Опыт', value: '+50'}]` (Experience), and «Цифры не пишутся внутри `lines`» (digits are never written inside `lines`). `children` takes inserts such as `QuestList`. The README asks for an `ease-pop` entrance and says the window isn't used in the task window.

The code renders a `section` with `role="status"` and `aria-live="polite"`, so a screen reader announces it. The gradient runs at 165 degrees from `system-from` to `system-to` at `system-alpha`, with a 2px `system-rim` border, radius `radius-lg`, `shadow-glow` and `shadow-soft`, padding `space-6` by `space-5`, and a maximum width of 520px. A white gloss strip 8px high sits 7px from the top at 60 % opacity. The ribbon sits 16px above the top edge in the `display` font, 800 14/18, capitals with 0.06em spacing, on `ribbon` with `on-fill` text and two cat ears 11px tall tilted by 12 degrees. Lines are 700 18/26; pause lines are italic and indented by `space-4`. Fields are pills on `surface-200` with the value in bold tabular figures. A lace hem of scallops every 14px hangs 9px below the bottom edge. `bundle.css` has no animation, so the entrance isn't in the component.

### `TaskWindow` is the calm task frame with «Не знаю», the thread and «Готово»

`TaskWindow/README.md` describes a calm window holding the task text, the answer field, the keypad, «Не знаю», the guiding thread and «Готово». `prompt` is the task in the `task` style, at least 24px. `label` is a small caption naming the node, or `false`. `children` holds `AnswerField` or `ChoiceGrid` and `MathKeypad`, and the keypad's `done` key should be hidden, because the window already has «Готово». `threads` is the number of guiding threads; «кнопку нельзя прятать: нитей всегда хватает» (the button can't be hidden: there are always enough threads). The callbacks are `onThread`, `onDontKnow` and `onSubmit`. The README forbids animation, sprites, story text and timers inside the window, and ends «Всегда в теме `tower`» (Always in the `tower` theme).

The code renders a `section` labelled «Задание» (Task) on `surface-200` with a 2px `stroke` border, radius `radius-xl`, `shadow-soft`, padding `space-6`, a maximum width of 760px and no gradient, lace or motion. The caption defaults to «Узел» (Knot), in 14px capitals in `ink-muted`. The prompt is 600 24/34, or 28/40 in large-text mode. The action row puts «Не знаю» (`quiet`) and «Путеводная нить · N» (Guiding thread · N, `system`, thread icon) on the left, and «Готово» (`primary`, `lg`) on the right, disabled by `submitDisabled`.

### `TaskWindow` contradicts its README and the design README in two places

The README says the thread button can't be hidden, but `bundle.js` renders it only when `threads != null`, so a caller that omits `threads` hides it. The README says «Всегда в теме `tower`», but the design has no theme called `tower`; its themes are `light`, `dark` and `dream`. `design-system/README.md` says the task window sits on `surface-200` «в любой палитре и теме» (in any palette and theme) and never switches to dreamcore.

### Resolved: `TaskWindow` always renders the thread button, and `threads` becomes a required prop

Proposed by research on 2026-09-26 as a correction to the design; the owner approves it with this record. The README's rule is the one the game needs, because the thread button must never disappear (RES-0500 holds the reason), so the code follows the README. `bundle.js` renders «Путеводная нить · N» whatever `threads` holds, and `index.d.ts` makes `threads: number` required, so a caller can't hide the button by leaving the prop out. `TaskWindow` also takes `threadDisabled?: boolean`, which the game sets when the stock is zero after the room's pocket thread; the button then shows at `disabled-alpha`, with no words about running out.

### Resolved: `TaskWindow/README.md` drops the `tower` theme and follows the player's theme and palette, never `dream`

Proposed by research on 2026-09-26 as a correction to the design; the owner approves it with this record. No theme called `tower` exists; the design's themes are `light`, `dark` and `dream`. `design-system/README.md` states the intended rule, and the README's last line becomes «В любой палитре и теме игрока; никогда в `dream`» (In any of the player's palettes and themes; never in `dream`). This matches RES-1500 and RES-3100, which keep the task window out of dreamcore.

### `TaskWindow` separates the task from the System window that RES-0100 places it in

RES-0100 records the draft as: "A task opens in a separate System window. The window holds no sprite animations, flickering effects or story text: only the task, the keyboard, the «Не знаю» (I don't know) button and the guiding thread button". The design makes the task window a separate component that isn't a System window. `design-system/README.md` puts it on `surface-200` «без градиента, без кружева, без анимаций» (with no gradient, no lace and no animation), and `SystemWindow/README.md` says the System window isn't used in the task window. Both agree on the contents and on the absence of motion and story text.

### Resolved: the task opens in `TaskWindow`, never in a System window

Proposed by research on 2026-09-26; the owner approves it with this record. RES-0100 compares the draft's System window with the design's separate task window and holds the reason for the design: a solid `surface-200` ground keeps long task text readable, and one still frame keeps answer times comparable. A `SystemWindow` announces the knot before the task and the outcome line follows after it; CAN-0030 says the same in the world.

### `AnswerField` shows five answer shapes and never opens the system keyboard

`AnswerField/README.md` describes an answer field for the game's own keypad. `kind` is `number`, `fraction` (two-storey), `mixed` (three fields), `remainder` or `time`. `value` holds the fields `number`, `num` and `den`, `whole`, `quotient` and `remainder`, or `hours` and `minutes`, and the input controller fills it. `unit` is the unit caption on the right, such as «см» (cm) or «кг» (kg). `unparsed` softly highlights a field whose input doesn't parse, such as «3,,5», «без слов об ошибке» (with no words about an error). The iPad system keyboard never appears (`inputMode="none"`).

The code makes each input read-only unless `readOnly` is `false`, and gives each an accessible name: «ответ» (answer), «числитель» (numerator), «знаменатель» (denominator), «целая часть» (whole part), «частное» (quotient), «остаток» (remainder), «часы» (hours) and «минуты» (minutes). The whole part, quotient and remainder also show a caption under the field. A field is 800 40/48 in tabular figures, 3.6em wide and 72px high on `surface-100`; the small field for a remainder, time or the fraction of a mixed number is 2.4em wide, 60px high and 32px. A fraction bar is 4px of `ink`. A time answer puts a 36px «:» between hours and minutes. An unparsed field gets a `mystery` border on `surface-300`. The unit is 700 20px in `ink-muted`.

### `MathKeypad` is a fixed 4-column keypad whose hidden keys keep their cells

`MathKeypad/README.md` lists digits, the decimal comma, fraction, whole part, remainder, colon, minus, erase and «Готово». `onKey(k)` receives `'0'` to `'9'`, `','`, `'back'`, `'frac'`, `'whole'`, `'minus'`, `'rem'`, `'colon'` or `'done'`. `hide` lists keys a task doesn't need, such as `['colon','minus']`. Keys are `key-size` (64px) and the keypad sits on the right under the thumb. A physical keyboard works alongside.

The code lays out a group labelled «Клавиатура» (Keypad) on `surface-300`, four 64px columns with gaps of `space-2`:

| Row | Keys |
| --- | --- |
| 1 | 7, 8, 9, «Стереть» (Erase) |
| 2 | 4, 5, 6, «Дробь» (Fraction) |
| 3 | 1, 2, 3, «Целая» (Whole) |
| 4 | 0, «,», «−», «Остаток» (Remainder) |
| 5 | «:», «Готово» (two columns wide) |

Word labels longer than two characters drop to 13/16. «Готово» is `accent`; fraction, whole and remainder are `magic`. A hidden key leaves an empty cell, «so the layout never shifts», except `done`, which is removed. A press moves a key down 3px and removes its lip.

### `MathKeypad` has no «Не знаю» key, which RES-0700 puts on the keypad

RES-0700 records the draft's keypad as: "digits, the decimal comma, «дробь» ("fraction"), «целая часть» ("whole part"), «остаток» ("remainder"), «:» for time, minus, erase, «Готово» ("Done") and «Не знаю» ("I don't know")". `MathKeypad` has no «Не знаю» key; «Не знаю» is a `TaskWindow` button, and `TaskWindow/README.md` says the keypad's «Готово» should be hidden in favour of the window's own.

### Resolved: «Не знаю» lives in the task window's action row, and the keypad has no such key

Proposed by research on 2026-09-26; the owner approves it with this record. RES-0700 compares a keypad key with a task-window button and holds the reason for the design's button: «Не знаю» must exist in choice and grid tasks that show no keypad, and a key beside the digits invites a slip that ends a first attempt with a false «Не знаю». `MathKeypad` stays as it is, and the game always hides its `done` key inside `TaskWindow`.

### `ChoiceGrid` offers at least four options and marks the choice without grading it

`ChoiceGrid/README.md` describes a choice of one of four options with key hints 1-4. `options` are strings or `{value, label}`, «в оцениваемых заданиях не меньше четырёх» (at least four in scored tasks). `selected` and `onSelect(value)` handle the choice. The selected option turns `magic`, with no tick. After the answer the options aren't coloured "right" or "wrong"; `KnotScheme` shows the review.

The code renders a group labelled «Варианты» (Options) in two columns. Each option is a button at least 72px high, 700 22/28, with `aria-pressed` and a 32px round badge showing its number from 1. The component only shows the numbers; it handles no keys.

### `OutcomeBadge` names each outcome with a word and an icon and never grades

`OutcomeBadge/README.md` calls the outcome «событие мира, а не оценка» (an event in the world, not a grade). Each outcome always carries an icon and a word:

| `outcome` | Word | Icon | Colour |
| --- | --- | --- | --- |
| `crit` | «Критическое распутывание» (Critical untangling) | spark | `outcome-clean` plus `shadow-sparkle` |
| `clean` (default) | «Распутан начисто» (Untangled cleanly) | spark | `outcome-clean` |
| `partial` | «Почти чисто» (Nearly clean) | yarn | `outcome-partial` |
| `soft` | «Узел ослаблен» (Knot loosened) | thread | `outcome-soft` |
| `unknown` | «Принято» (Accepted), after «Не знаю» | thread | `outcome-soft` |

`children` replaces the word. The badge is a pill, 800 15/20 in `on-fill`, with a 1.5px `stroke` border.

### `OutcomeBadge` splits «Не знаю» from a wrong answer, which RES-1700 merges

RES-1700 records three outcomes: `clean`, `partial` and "wrong or «Не знаю» (I don't know) | `alt` - knot loosened". The design names the third outcome `soft`, not `alt`, and gives «Не знаю» its own outcome `unknown` with the word «Принято» (Accepted), in the same colour as `soft`. It also gives critical untangling its own badge `crit`, where RES-1700 treats it as a kind of `clean` strike.

### Resolved: the badge's five values are views of the three game outcomes, and «Не знаю» stays inside `alt`

Proposed by research on 2026-09-26; the owner approves it with this record. RES-1700 compares a fourth outcome for «Не знаю» with one outcome shown two ways, and a rename of `alt` to `soft`, and holds the reasons: «Не знаю» has every consequence of a wrong answer, so it stays `alt`, and `alt` stays the outcome's name in the API, the log and the Director. The badge keeps the design's names and colours: `crit` for a `clean` outcome with `critical` true, `clean`, `partial`, `soft` for `alt` after a wrong answer and `unknown` («Принято») for `alt` after «Не знаю». `OutcomeBadge/README.md` should state this mapping, and RES-2400 adds `dontKnow` to the answer request so the client can pick the badge.

### `KnotScheme` shows the review after the first attempt without ticks or red

`KnotScheme/README.md` calls it «Схема узла» (the knot's scheme): the review after the first attempt, showing her spell, how the thread lay and the steps. `given` is what the heroine entered; `answer` is how the thread lay; `steps` are the solution steps, which the code fills; `outcome` adds a badge. `children` holds the buttons «Подробнее за нить» (More detail for a thread) and the twin knot. It has no ✓ or ✗, no red and no «верно/неверно» (right/wrong).

The code renders a `section` labelled «Схема узла», with the title in `display` 22/28 and an optional `OutcomeBadge`. A definition list pairs «Твоё заклинание» (Your spell) with `given`, or «—» when it is empty, and «Как легла нить» (How the thread lay) with `answer` in bold tabular figures. The steps are an ordered list, each numbered in a 32px `magic` circle, in 600 18/26. The maximum width is 560px.

### `XpBar` measures experience points and never time

`XpBar/README.md` describes the level and experience bar as «всегда видимая ближняя цель» (an always visible near goal). `level`, `value` and `max` are experience points, not time; `next` captions the next goal. «Не превращать в полосу времени или дневной прогресс» (Don't turn it into a time bar or a daily progress bar).

The code shows the level in a 56px `warm` circle labelled «Уровень N» (Level N). The track is a `progressbar` labelled «Опыт» (Experience), 20px high on `surface-300`, filled with `warm` to `value / max`, clamped to 0-100 %, and 0 when `max` is 0. The caption reads «Опыт value / max» in tabular figures, with `next` on the right. The minimum width is 260px.

### `RankBadge` shows the hunter's rank E to S with its title and never falls

`RankBadge/README.md` shows the hunter's rank from E to S with a title. `title` overrides the title and `sub` adds a line under it. «Ранг никогда не понижается и не показывает мастерство» (The rank never falls and doesn't show mastery).

| Rank | Title |
| --- | --- |
| E (default) | «Пробуждённая» (the Awakened) |
| D | «Петелька» (Little Loop) |
| C | «Кружевница» (Lacemaker) |
| B | «Спица» (Knitting Needle) |
| A | «Веретено» (Spindle) |
| S | «Смотрительница» (Warden) |

The letter sits in a 56x58 `mystery` badge in 30px `display` type in `on-mystery`, labelled «Ранг X» (Rank X), with two cat ears 15px tall tilted by 14 degrees. These ranks and titles match RES-2000.

### `ElementChip` always shows an element's colour, icon and name together

`ElementChip/README.md` shows an element as a chip with its colour, icon and name together: `spark` «Искра» (Spark), `stride` «Ход» (Stride), `crumb` «Крошка» (Crumb), `drop` «Капля» (Drop), `harmony` «Лад» (Harmony), `measure` «Мера» (Measure), `facet` «Грань» (Facet) and `echo` «Эхо» (Echo). `children` carries the player's own name if she renamed the element. The code draws a pill filled with `el-*`, the icon at 26px in a `lace` circle, and the name in 800 15/20 `on-fill`.

### `Counter` shows a resource with its icon and counts days only as a total

`Counter/README.md` shows a resource counter with an icon. «Для дней — только общий счёт, никогда «подряд»» (for days, only the total, never "in a row"), which matches RES-2000's total day count.

| `kind` | Icon | Name |
| --- | --- | --- |
| `buttons` | button | «Пуговицы» (Buttons) |
| `threads` | thread | «Путеводные нити» (Guiding threads) |
| `yarn` | yarn | «Звёздная пряжа» (Star yarn) |
| `shards` | shard | «Осколки звёздной стали» (Star-steel shards) |
| `days` | diary | «Дней в Башне» (Days in the Tower) |

`icon` and `label` override the pair. `showLabel` shows the name beside the value; otherwise the name is screen-reader text, and it is always the `title`. The value is 800 18/22 in tabular figures on a `surface-200` pill.

### `RewardChest` shows three visible rewards and lets the player pick one, with no lottery

`RewardChest/README.md` shows a chest with three visible rewards; the player picks one. «Без лотереи и шансов» (No lottery and no odds). `rewards` are `[{tier, icon | image, name, desc}]` with `tier` `common`, `good` or `sparkle`; `selected` and `onPick(index)` handle the choice. The quality is always named in a word, and «сверкающая» (sparkling) uses `tier-sparkle` and `shadow-sparkle`.

The code renders a group labelled «Сундук: выбери одну награду» (Chest: pick one reward) in three columns, at most 720px wide. Each reward is a button with `aria-pressed`, a 48px icon or image, the tier word «Обычная» (Common), «Хорошая» (Good) or «Сверкающая» (Sparkling) in 13px capitals, the name in 800 17/22 and the description in 600 14/20. Common rewards sit on `tier-common` with `ink` text; good on `tier-good`; sparkling on `tier-sparkle` with `shadow-sparkle`. The chosen reward gets a 4px `focus-ring` outline offset by 3px. This matches RES-2100's visible, deterministic chest.

### `FamiliarCard` shows a creature for the bestiary and team, and hides one not yet met

`FamiliarCard/README.md` says the component is called FamiliarCard «по историческим причинам; в игре эти существа — узелки» (for historical reasons; in the game these creatures are «узелки», little knots). The card serves the bestiary and the team. `name` is the name the player gave it, `element` its element, `image` its sprite (without one, the element icon), `stage` and `stages` its evolution, and `known: false` shows a silhouette and «???».

The code draws a 200px card with a 150px art area on `surface-300`. A known creature shows its image, or its element icon at 88px, defaulting to `spark`. An unknown one shows the element icon greyed to 35 % opacity, the name «???», and no element chip or stage dots. Stages default to 1 of 3; each is a 14px dot, `warm` when reached, and the row is labelled «Стадия N из M» (Stage N of M).

### The design renames the familiars «узелки», which RES-1900 and the glossary call familiars

`FamiliarCard/README.md` says «в игре эти существа — узелки» (in the game these creatures are little knots), and `bundle.css` labels the card «Familiar (узелок) card». RES-1900 records "familiars: small companion creatures that hatch from knitted eggs", and takes them from the canon's section 6 as «фамильяры». `StoryLog/README.md` also calls them «узелки» (little knots).

### `StoryLog` is the story column, with one style for each speaker

`StoryLog/README.md` calls it the centre of the scene screens: narrator, characters, little knots, the heroine's moves, the Diary and System windows. `messages` are `[{who, speaker?, text, title?, fields?}]` with `who` one of `narrator`, `npc`, `familiar`, `hero`, `diary` or `system`. The narrator has no frame and uses `story` 20/32, or 24/36 in large text. Characters and little knots speak in cards. The heroine's moves sit on the right on `accent-2`. The Diary is in the `hand` font in `mystery`. A `system` message is an opaque System window inside the log, with `title` on its ribbon, `text` as one line or several, and `fields` as code-supplied counters. The column is at most 68 characters wide, and new messages appear at the bottom, above the input line.

The code renders a `log` with `aria-live="polite"`, at most `68ch` wide, with `space-4` between messages. `npc` cards sit on `surface-200` and `familiar` cards on `surface-300`, both with a sharp 8px lower-left corner. `hero` messages are at most 80 % wide, right-aligned, with a sharp lower-right corner. `diary` messages are 500 26/30 `hand` on `surface-200` with a dashed `mystery` border. A `system` message has `role="status"`, the gradient with no opacity so it stays opaque, 700 18/26 text (21/30 in large text), and a 13/17 ribbon. The speaker's name is `display` 800 16/20.

### `StoryInput` is the input line at the foot of every story screen, and «Дальше» always works

`StoryInput/README.md` calls it the main element of the scene screens: the player writes or says what the heroine does. `suggestions` are three numbered chips (keys 1-3 on a computer), «третий всегда странный и смешной» (the third always strange and funny), with `onSuggest(text)`. `value`, `onChange` and `onSend` handle the text; `sendLabel` defaults to «Дальше» (Next), `placeholder` and `rows` (default 2) shape the field. `onVoice` is the voice button, dictation in Russian. `note` is the note under the field, by default «Эту историю могут читать мама и папа.» (Mum and Dad can read this story.), and `note={false}` is allowed only outside the story. The line is always at the bottom of the story column, across its full width, and «Дальше» works with an empty field.

The code renders the chips as a group labelled «Варианты» (Options), each at least 44px high with a numbered `magic` badge. The field is a textarea labelled «Твой ход» (Your move), placeholder «Что делает героиня?» (What does the heroine do?), 500 20/28 (23/32 in large text), at least 64px high, inside a `surface-200` pill with radius `radius-xl`. The voice button is a 56px `magic` circle labelled «Сказать голосом» (Say it aloud). The send button is `primary`, `lg`, and never disabled. The note is 700 13/18 in `ink-muted`. The component only shows the chip numbers; it handles no keys.

### `QuestList` shows the day's quests as rows of a knitting pattern, and an unfinished quest isn't a failure

`QuestList/README.md` shows the day's quests as a knitting pattern: «Ряд 1… Ряд 2… Ряд 3…» (Row 1, Row 2, Row 3) and an optional «узорный ряд» (pattern row). `quests` are `[{text, done?, pattern?, row?}]`, and the code puts numbers into the text. An unfinished quest isn't marked as a failure. The list usually sits inside a `SystemWindow`.

The code labels each row with `row`, or «Узорный ряд» (Pattern row) for a pattern quest, or «Ряд N» (Row N). A 26px mark ends each row, labelled «связан» (knitted) when done and «в работе» (in progress) otherwise; a done mark fills with `warm` and a dot. Pattern quests are italic. The list inherits its text colour, so it reads correctly inside a System window.

### `TermHint` explains a Russian term with a picture and its Dutch word, and logs the opening

`TermHint/README.md` describes a hint word for Russian terms: tapping it shows an explanation, a picture and the Dutch equivalent. The props are `term`, `definition`, `dutch`, `picture` (SVG from the code) and `onOpen`, which marks in the log that the dictionary was opened. The word has a dotted `mystery` underline and works by touch and from the keyboard.

The code renders a button with `aria-expanded`, a 3px dotted underline offset by 5px, and a hit area widened by 14px above and below and 6px to each side. Opening it shows a 280px `note` popover with the term in `display` 18/22, the picture on `surface-300`, the definition in 16/22 and «По-голландски: X» (In Dutch: X) in `mystery`. `onOpen` fires only on opening. `defaultOpen` starts it open.

### `SkillState` names a skill's state for the parent, behind the PIN

`SkillState/README.md` shows the state of a skill node in the Parent Room, «Только за PIN, ребёнок этого не видит» (only behind the PIN; the child never sees it). `code` is the node's identifier, such as F3 or A6. `frontier` outlines a node on the frontier; `inferred` hatches an inferred state.

| `state` | Label | Fill | Text |
| --- | --- | --- | --- |
| `untested` | «Не проверено» (Not checked) | `state-untested`, dashed border | `state-ink` |
| `emerging` | «Пока не освоено» (Not mastered yet) | `state-emerging` | `state-ink` |
| `understands` | «Понимает, нужна скорость» (Understands, needs speed) | `state-understands` | `state-ink` |
| `fluent` | «Бегло» (Fluent) | `state-fluent` | `state-ink-inv` |
| `stable` | «Устойчиво» (Stable) | `state-stable` | `state-ink-inv` |

The code draws a 700 14/20 chip with radius `radius-sm`. `inferred` adds 135-degree white stripes at 18 % opacity and the tooltip «Выведено, не проверено напрямую» (Inferred, not checked directly). `frontier` adds a 3px `state-frontier` ring. The code is bold in tabular figures. `children` replaces the label.

### `SkillState` has five states where RES-0900 has seven

RES-0900 records seven report states: «Не освоен» (Not mastered), «Понимает» (Understands), «Бегло» (Fluent), «Устойчиво» (Stable), «Уточняется» (Being clarified), «Бегло (выведено)» (Fluent, inferred) and «Не проверялся, отрезан узлом X» (Not tested, cut off by node X). `SkillState` has five: `untested`, `emerging`, `understands`, `fluent` and `stable`, with inference as a hatching on any state. It has no state for "being clarified" or "cut off by node X", and its labels differ: «Пока не освоено» for «Не освоен», «Понимает, нужна скорость» for «Понимает», and «Не проверено» where RES-0900 has no plain untested state.

### Resolved: `SkillState` keeps its five fills, the report passes every rule state's label through `children`, and `understands` defaults to «Понимает»

Proposed by research on 2026-09-26 as a correction to the design; the owner approves it with this record. RES-0900 compares the design's five states with the rule states and holds the reason for keeping the rule states: the report must tell "being clarified" and "cut off by node X" from "not checked", because the VWO ladder and «почти готово» treat them differently. The component needs no new fill. «Уточняется», «Не проверялся, отрезан узлом X» and «Stretch: не проверялся» use the `untested` fill with their label in `children`; «Бегло (выведено)» is `fluent` with `inferred`. One default changes: `understands` shows «Понимает», and the game passes «Понимает, нужна скорость» only when a block score of 4 or more failed on time, because after a score of 3 the missing part is accuracy. `SkillState/README.md` should list the full mapping from RES-0900.

### `TopBar` keeps the counters, «Привал» and «Сохранить и уйти» always on screen

`TopBar/README.md` puts counters on the left and «Привал» (Rest stop) and «Сохранить и уйти» (Save and leave) on the right, always visible. `left` and `right` take nodes, usually `Counter`. `onCamp` and `campDisabled` handle the rest stop, whose cooldown has no countdown, and `onSaveExit` handles leaving. The code renders a `header` on `surface-200` with radius `radius-lg` and always adds the two buttons after `right`: «Привал» as `secondary` `sm` with the `camp` icon, disabled by `campDisabled`, and «Сохранить и уйти» as `quiet` `sm`. This matches RES-0200's always-present save button and RES-0300's always-present rest stop button.

### `PalettePicker` shows each preset palette in its own colours, with no locks

`PalettePicker/README.md` picks a preset palette in the game settings, and each card shows its own colours. `selected` is a palette id: `strawberry` («Клубничный крем», Strawberry cream, the default), `vanilla` («Ванильное облако», Vanilla cloud), `matcha` («Мятный чай», Mint tea) or `lavender` («Лавандовый сироп», Lavender syrup); `onPick(id)` reports the choice. `mode` is `light` or `dark`, so the cards render in the current theme. The chosen palette goes on the game root as `data-palette`, the theme as `data-theme`; a custom palette goes through `Tower.paletteVars`. «Никаких замков и цен: все палитры доступны сразу» (No locks and no prices: every palette is available at once).

The code renders a group labelled «Палитра» (Palette) in two columns. Each card is a button that carries its own `data-theme` and `data-palette`, so the tokens inside it resolve to that palette. It shows a small System window gradient and three dots in `accent`, `accent-2` and `warm`, and a footer with the name and «Выбрано» (Chosen) or «Выбрать» (Choose). The chosen card gets `aria-pressed` and a 4px `focus-ring` outline. `palettes` replaces the list.

### `ColorRole` lets the player paint one role from swatches or her own colour, and no colour is wrong

`ColorRole/README.md` is one row of a custom palette: swatches plus «свой цвет» (own colour) through the system colour picker. `label` and `hint` name the role: «Главный цвет — кнопки, ленточки» (Main colour: buttons, ribbons), «Второй цвет — реплики героини» (Second colour: the heroine's lines), «Магия — окна Системы» (Magic: System windows) and «Тепло — опыт и награды» (Warmth: experience and rewards). `value`, `swatches` (hex values) and `onChange(hex)` handle the choice. `Tower.paletteVars({accent, accent2, magic, warm}, mode)` applies her colours as CSS variables on the game root. It lightens colours too dark for readable text (4.5:1 or better) and picks the System window colours, so ««неправильного» цвета не бывает» (there's no "wrong" colour). The choice is saved in the player's profile with `mode`, and switching the theme recomputes the variables.

The code renders a group with a 170px label column. Each swatch is a 44px round button with `aria-pressed` and its hex value as its name. The last swatch is a conic rainbow wrapping an invisible native colour input titled «Свой цвет» (Own colour), named «<label>: свой цвет»; it reports the colour in upper case. RES-3100 records how `paletteVars` derives the variables and my check of its contrast.

### The design's always-enough threads contradict RES-0500's once-a-day top-up

`TaskWindow/README.md` says the thread button can't be hidden because «нитей всегда хватает» (there are always enough threads). RES-0500 records: "If she has no threads at the start of a room, she finds one in her backpack pocket, no more than once a day". Under RES-0500 the player can reach zero threads in the middle of a room, or at the start of a second room on the same day, so the button would show «Путеводная нить · 0».

### Resolved: threads stay a bounded resource, the pocket yields one thread at the moment of need once in each room, and the button never hides

Proposed by research on 2026-09-26; the owner approves it with this record. RES-0500 compares unlimited threads, the once-a-day pocket and a pocket at the moment of need, and holds the reason for the last: unlimited hints would make most first attempts assisted and starve the estimate of what she does alone, while the pocket at the moment of need keeps the design's promise in every room. For the component this means the button is always rendered with its count, and at zero after the room's pocket thread it shows inactive, as the resolved finding on `threads` above sets out. The README's sentence «нитей всегда хватает» holds as a promise about the economy, not as an unlimited supply.

## Conclusions

1. The game's interface components must keep each rule of the design. They must show no tick, cross or red for a wrong answer and no clock or time bar, keep the task window still, and take numbers only from code-supplied fields.
2. The typings must match the code, including the `mic` icon, the `system` story message with `title` and `fields`, the `StoryInput` props `sendLabel`, `rows`, `onVoice` and `note={false}`, and the exported constants.
3. Every interactive control must show a solid 3px focus ring offset by 2px when focused from the keyboard.
4. Every touch target on the tablet must have a touch zone of at least 56px: the top bar's buttons must use `md` there, the suggestion chips must grow to 56px and the colour swatches must reach a 56px hit area; 44px sizes may serve only a fine pointer.
5. A System window must announce itself politely to a screen reader, take its numbers only from `fields`, enter with the `ease-pop` pop, and never appear inside the task window.
6. The task window must hold only the task text, the answer field or options, the keypad, «Не знаю», the guiding thread button and «Готово», on a flat `surface-200` panel with no gradient, lace, animation, sprite, story text or timer.
7. The guiding thread button must always be rendered in the task window with its count, whatever props the caller passes, and must show inactive, with no words about running out, when the stock is zero after the room's pocket thread.
8. Answer fields must support number, fraction, mixed number, quotient with remainder and time, never open the device keyboard, and mark unparsed input softly with no words about an error.
9. The maths keypad must keep 64px keys in a fixed layout where a hidden key keeps its cell, and a physical keyboard must work alongside it.
10. «Не знаю» must live in the task window's action row, and the maths keypad must have no «Не знаю» key.
11. A multiple-choice task must offer at least four options and must never colour an option right or wrong after the answer.
12. Each outcome must show an icon and a word, and the badge must map the three game outcomes `clean`, `partial` and `alt` to `crit`, `clean`, `partial`, `soft` and `unknown` («Принято» after «Не знаю») as RES-1700 sets out.
13. The knot's scheme must show her answer, how the thread lay and the code-built steps, with no tick, cross, red or right-or-wrong wording.
14. The experience bar must show points and the next goal, and must never show time or daily progress.
15. The rank badge must show the ranks E to S with their titles and must never fall or reflect mastery.
16. An element must always appear with its colour, icon and name, and the player's own name for it must replace the default.
17. Resource counters must name their resource for screen readers, and the day counter must show only the total.
18. The chest must show three visible rewards with their quality in words and let the player pick one, with no odds.
19. The owner must settle whether the game calls its creatures familiars or «узелки» (little knots), and a creature not yet met must show only a silhouette and «???».
20. The story log must be a polite live region, at most 68 characters wide, with a distinct style for the narrator, characters, creatures, the heroine, the Diary and opaque System windows.
21. The story input must sit at the foot of the story column with three suggestions, a voice button and «Дальше», which must work with an empty field, and must show the note that parents can read the story.
22. Number keys 1-3 must pick a suggestion and 1-4 an option on a computer, because the components show the numbers but handle no keys.
23. Unfinished quests must never be marked as failures.
24. A term hint must work by touch and keyboard, show the definition, picture and Dutch word, and log each opening.
25. Skill states must appear only behind the parent's PIN, named in words with the labels RES-0900 gives for every rule state, on the five chip fills, with inferred states hatched and the frontier outlined.
26. The top bar must always show the rest stop and save-and-leave buttons, and an inactive rest stop must show no countdown.
27. Every preset palette must be selectable at once with no lock or price, and each card must preview its own colours in the current theme.
28. A custom colour role must accept any colour, from a swatch or the system picker, and must save it with the mode in the player's profile.
29. A task must open in `TaskWindow`, never in a `SystemWindow`, and a System window must announce the knot before it.
30. `TaskWindow` must follow the player's theme and palette and never switch to `dream`; its README must drop the `tower` theme.
31. `TaskWindowProps.threads` must be required, and the typings must declare the component functions and the exports `PALETTES`, `ICONS`, `ELEMENTS` and `RANKS`.
32. `SkillState`'s `understands` state must default to «Понимает», and the game must pass «Понимает, нужна скорость» only when a block failed on time.

## Sources

- The owner's design file «design-system/components/AnswerField/README.md», read 2026-09-26; not kept in the repository - the answer shapes, `unparsed` and the hidden device keyboard.
- The owner's design file «design-system/components/Button/README.md», read 2026-09-26; not kept in the repository - the variants, sizes, disabled state and label rule.
- The owner's design file «design-system/components/ChoiceGrid/README.md», read 2026-09-26; not kept in the repository - at least four options, key hints and no right-or-wrong colouring.
- The owner's design file «design-system/components/ColorRole/README.md», read 2026-09-26; not kept in the repository - the four roles, their hints, `paletteVars` and saving with the mode.
- The owner's design file «design-system/components/Counter/README.md», read 2026-09-26; not kept in the repository - the resource kinds and the total-only day count.
- The owner's design file «design-system/components/ElementChip/README.md», read 2026-09-26; not kept in the repository - the eight elements and renaming.
- The owner's design file «design-system/components/FamiliarCard/README.md», read 2026-09-26; not kept in the repository - the card's props and the name «узелки».
- The owner's design file «design-system/components/KnotScheme/README.md», read 2026-09-26; not kept in the repository - the review after the first attempt and its ban on ticks and red.
- The owner's design file «design-system/components/MathKeypad/README.md», read 2026-09-26; not kept in the repository - the keys, `hide`, key size and the physical keyboard.
- The owner's design file «design-system/components/OutcomeBadge/README.md», read 2026-09-26; not kept in the repository - the five outcomes and their colours.
- The owner's design file «design-system/components/PalettePicker/README.md», read 2026-09-26; not kept in the repository - the four palettes, the mode and the absence of locks.
- The owner's design file «design-system/components/QuestList/README.md», read 2026-09-26; not kept in the repository - the knitting rows and the no-failure rule.
- The owner's design file «design-system/components/RankBadge/README.md», read 2026-09-26; not kept in the repository - the ranks, titles and the never-falling rule.
- The owner's design file «design-system/components/RewardChest/README.md», read 2026-09-26; not kept in the repository - three visible rewards, one pick and no lottery.
- The owner's design file «design-system/components/SkillState/README.md», read 2026-09-26; not kept in the repository - the five states, frontier, inference and the PIN.
- The owner's design file «design-system/components/StoryInput/README.md», read 2026-09-26; not kept in the repository - the suggestions, voice, note and the always-working «Дальше».
- The owner's design file «design-system/components/StoryLog/README.md», read 2026-09-26; not kept in the repository - the message kinds and the opaque System window in the log.
- The owner's design file «design-system/components/SystemWindow/README.md», read 2026-09-26; not kept in the repository - the ribbon titles, pause lines, fields and the pop entrance.
- The owner's design file «design-system/components/TaskWindow/README.md», read 2026-09-26; not kept in the repository - the task window's contents, the always-present thread button and the `tower` theme.
- The owner's design file «design-system/components/TermHint/README.md», read 2026-09-26; not kept in the repository - the term popover, the Dutch word and logging.
- The owner's design file «design-system/components/TopBar/README.md», read 2026-09-26; not kept in the repository - the always-visible rest stop and save-and-leave buttons.
- The owner's design file «design-system/components/XpBar/README.md», read 2026-09-26; not kept in the repository - experience as a near goal and never a time bar.
- The owner's design file «design-system/components/index.d.ts», read 2026-09-26; not kept in the repository - the props of every component and the two typing mismatches in `StoryMessage` and `StoryInputProps`.
- The owner's design file «design-system/components/bundle.js», read 2026-09-26; not kept in the repository - what each component renders, its labels, defaults and accessibility roles, and the exports on `window.Tower`.
- The owner's design file «design-system/components/bundle.css», read 2026-09-26; not kept in the repository - each component's sizes, colours and states, the shared focus ring, the 44px controls and the absence of an entrance animation.
- The owner's design file «design-system/README.md», read 2026-09-26; not kept in the repository - the task window in any palette and theme, and the themes that exist.
- The owner's design file «README.txt», read 2026-09-26; not kept in the repository - the components as React 18 components on `window.Tower`.
- W3C, «Understanding Success Criterion 2.5.5: Target Size (Enhanced)», WCAG 2.2, https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html, read 2026-09-26 - a pointer target of at least 44 by 44 CSS pixels at level AAA, the size kept for a fine pointer.
