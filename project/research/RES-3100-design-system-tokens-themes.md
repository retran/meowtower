---
id: RES-3100
artifact: research
status: approved
revised: 2026-09-26
---

# The owner's design system proposes a soft pastel patisserie look built from semantic tokens, three themes, four palettes and a safe custom palette

## Summary

The owner's design files propose a look the player asked for, a soft pastel patisserie with cat girls "like Nekopara", built from semantic colour tokens whose values depend on a theme and a palette. The game root carries three attributes: `data-theme` (light or dark, plus a dreamcore layer the player doesn't choose), `data-palette` (four preset palettes) and `data-text` (large text). The player can also paint four colour roles herself, and `Tower.paletteVars` lightens her colours until text on them reaches a contrast of 4.5:1, so no choice she makes is unsafe. The main rules forbid grades, clocks, pure black and motion in the task window, and they take every number on screen from the code. The files also fix the type scale in three Cyrillic font families, a 4px spacing step, radii, strokes, touch sizes, shadows and spring easing. I checked the stated contrast guarantees with a script: every text pair passes in every preset palette and theme, but the 2px stroke falls below 3:1 on the sunken surface in three light palettes. This record covers `design/README.txt`, the design-system README and the two token files. The components are in RES-3200; the guidelines, key art, screens and prototype are in RES-3300 to RES-3500.

## The question

Which visual values and rules does the owner's design fix for the game's interface, and which of them does the code have to guarantee? The design files assume that a child can pick any theme, palette or colour and still get readable text, because the tokens and `paletteVars` enforce contrast. My check shows the assumption holds for text but not for every line and border. The files also contradict each other and two existing research records in places, so a reader can't take every statement as settled.

## Method

Read the owner's design files `README.txt`, `design-system/README.md`, `design-system/tokens.json` and `design-system/tokens.css` on 2026-09-26, together with the palette block at the end of `design-system/components/bundle.css` and the `paletteVars` function in `design-system/components/bundle.js`, because the palettes and the custom palette live there and not in the token files.

I checked the contrast claims with two scripts on 2026-09-26. The first parsed `tokens.css` and the palette block of `bundle.css`. It computed WCAG (Web Content Accessibility Guidelines) contrast ratios for 31 pairs in each of the four palettes in both player themes, plus sample pairs in the dreamcore theme and the Parent Room states. The second loaded `bundle.js` in Node and ran `Tower.paletteVars` on 20,000 random colour sets in each mode.

The files leave these open:

- Which script builds the palettes: `bundle.css` says they are «generated from themes.py», and no such file is in `design/`.
- Where in the player profile the theme, palette and custom colours live; the README says only that the choice is kept in the profile and restored on any device.
- Whether the dreamcore theme is set on the game root or on a nested scene layer. The cascade matters: if `data-theme="dream"` and `data-palette` sit on one element, the palette's fills win because `bundle.css` loads after `tokens.css`.
- What the custom palette does to grounds in the dark theme: `paletteVars` sets no surface there.

## Findings

### The design asks for a soft pastel patisserie look "like Nekopara", at the player's request

`design-system/README.md` describes «Хроники Башни» (Tower Chronicles) as an anime adventure for one primary-school girl: a knitted Tower, System windows, knots and maths as the physics of the world. The style is «как в Некопаре» (like Nekopara), «по просьбе игрока» (at the player's request): a soft pastel patisserie with cat girls, strawberry cream, vanilla, powder blue, lace, ribbons, and cat ears and paws as a motif. «Интерфейс никогда не оценивает героиню» (The interface never grades the heroine). The system serves the game screens (Preact and CSS) and the Parent Room. PixiJS draws scenes, sprites and effects in the same palette.

### The design's illustration style contradicts RES-1500's candy chibi style

`design-system/README.md`, section «Иллюстрации» (Illustrations), asks for «мягкий аниме-стиль визуальной новеллы в пастельной кондитерской гамме, «как в Некопаре»» (a soft anime visual-novel style in a pastel patisserie range, "like Nekopara"). The heroine and the Tower's residents are cat girls with ears and a tail, «без костюмов горничных и «взрослой» подачи» (no maid costumes and no "adult" presentation). Lines are thin, warm and brown; fills are soft; eyes are large and shiny; lace, ribbons, pastries and knitted details recur. All characters are the game's own, with no one else's characters, names or logos. The prompt blocks live in the section «Арт-дирекшн» (Art direction). The main reference is `keyart-heroine` in the Key art group. `keyart-tower` and `keyart-archive` «остались от первой, «конфетной» версии стиля и годятся только как эталон мира» (remain from the first, "candy" version of the style and serve only as a reference for the world).

RES-1500 records the draft's style as: "The style is bright and cute: round chibi characters, a saturated "candy" palette, springy animation, soft outlines and knitted details as the world's motif", under the heading "The draft proposes a bright, cute, original style in the spirit of Cookie Run". The design replaces round chibi figures and a saturated candy palette with soft visual-novel anime and pastels, and calls the candy version superseded.

### The design folder has a fixed layout, and the game loads two style sheets by path

`README.txt` lays out `design/` as follows:

| Folder | Contents |
| --- | --- |
| `design-system/` | tokens (`tokens.json` as data, `tokens.css` as CSS variables «для всех тем и палитр», for all themes and palettes); `components/bundle.js` and `bundle.css`, ready components (`window.Tower`, React 18); `index.d.ts`, the props; `README.md` and `guidelines/`, the rules, style, voice and screens |
| `screens/` | 45 mock-up sheets of screens with numbered notes and a key (PNG) |
| `key-art/` | style references; the main one is `keyart-heroine.png` |
| `icons/`, `elements/` | icons and elements (SVG) |
| `prototype/` | the clickable prototype |

The prototype opens through a local server, not by double-click: `cd prototype && python3 -m http.server 8000`, then `http://localhost:8000/Main.dc.html`, or any screen such as `05-Room.dc.html`. The game code loads `design-system/tokens.css` and `components/bundle.css`, and sets the theme, palette and text size with the attributes `data-theme`, `data-palette` and `data-text` on the game root.

### The design contradicts itself on where the palettes live

`README.txt` says `tokens.css` holds «CSS-переменные для всех тем и палитр» (CSS variables for all themes and palettes). `tokens.css` holds only the themes `light`, `dark` and `dream` and the theme-free tokens. The four palettes are in `components/bundle.css`, in a block headed «palettes (generated from themes.py)». `tokens.json` has no palettes either. A game that loads only `tokens.css` gets no palettes.

### Resolved: the palettes move into `tokens.json` and `tokens.css`, after the light and dark themes and before the dreamcore theme

Proposed by research on 2026-09-26 as a correction to the design; the owner approves it with this record.

Two options were weighed. Correcting `README.txt` to say the palettes live in `bundle.css` costs one sentence, but it leaves colour values in two files, one of them generated by a `themes.py` that isn't in `design/`, and a contrast check has to parse both. Moving the palette blocks into `tokens.json` as data and compiling them into `tokens.css` makes `tokens.json` the one source of every colour, which is what `README.txt` already says and what the contrast script reads. The move wins. It also settles the cascade question under Method: inside one file the order is the `light` and `dark` themes, then the four palettes, then the `dream` theme, so a dreamcore scene keeps its own dusty pastels even when `data-palette` sits on the same element. `bundle.css` keeps only the components. The game still loads `tokens.css` and then `bundle.css` by the same paths, so nothing that loads them changes.

### The design states six main rules

`design-system/README.md`, «Главные правила» (Main rules):

1. «Мягко, светло, кружевно» (Soft, light, lacy). Thin lines `stroke-bold` (2px) in `stroke`; large radii (`radius-md` for buttons and keys, `radius-lg` for windows, `radius-xl` for the task window); pill buttons with a white inner rim (`shadow-gloss`) and a soft lip below (`shadow-lip`). «Чистого чёрного нет нигде» (No pure black anywhere).
2. «Никаких оценок» (No grades). No red crosses, green ticks, the word «неправильно» (wrong), percentages or scores. A spell's outcome is an `OutcomeBadge` coloured `outcome-clean`, `outcome-partial` or `outcome-soft`. Red never means "bad".
3. «Никаких часов» (No clocks). No timers, countdowns or time bars. `XpBar` shows experience points. «Привал» (Rest stop) during its cooldown is only inactive (`disabled-alpha`).
4. «Окно задания спокойное» (The task window is calm). `TaskWindow` sits on `surface-200`, with no gradient, lace, animation or story text, in any palette and theme.
5. «Числа — только из кода» (Numbers come only from the code). Counters in System windows are `fields`, never digits inside a line of text.
6. «Палитру выбирает игрок» (The player chooses the palette). Light or dark theme, a preset or her own palette, all in the game settings, at any time, with no locks.

### The design sets two theming axes on the game root, plus a dreamcore layer the player doesn't choose

The theme is `data-theme`: `light` («Светлая», Light, the default) or `dark` («Тёмная», Dark: a chocolate ground and light text). A third theme, `dream` («Дримкор», dreamcore), isn't the player's choice but the sleepy layer of a scene: dusty pastel, with no black and no blood red. The task window, rest stops, eye exercises and the heroine's room never switch to dreamcore.

The palette is `data-palette`: `strawberry` («Клубничный крем», Strawberry cream, the default), `vanilla` («Ванильное облако», Vanilla cloud), `matcha` («Мятный чай», Mint tea) or `lavender` («Лавандовый сироп», Lavender syrup). A palette changes the fills in both themes and tints the grounds in the light theme only. The choice is kept in the player's profile and restored on any device.

### The theme tokens give each semantic colour a value per theme

`tokens.json` (version 3) and `tokens.css` define these themed colour tokens. Every interface colour is a semantic token, and its value depends on the theme and palette.

| Token | `light` | `dark` | `dream` | Use |
| --- | --- | --- | --- | --- |
| `surface-100` | `#FFF1EE` | `#2E2320` | `#F6E6F0` | screen and scene ground outside windows |
| `surface-200` | `#FFFBF8` | `#3B2D29` | `#FCF5F9` | cards, task window, input fields, Diary paper; the white lace panel |
| `surface-300` | `#FBE1E0` | `#4A3833` | `#DCEAF2` | sunken zones: keypad, experience track, inactive cells |
| `lace` | `#FFFFFF` | `#5A4640` | `#FFFFFF` | lace hem and inner white rim of panels and buttons |
| `ink` | `#5B3A36` | `#FBEDE6` | `#4E3A5C` | main text on `surface-100/200/300` (at least 4.5:1 in every palette); never on pastel fills |
| `ink-muted` | `#87574F` | `#D9C0B6` | `#6E5E86` | captions and secondary text on `surface-100` and `surface-200` |
| `on-fill` | `#5B3A36` | `#2E2320` | `#4E3A5C` | text and icons on any pastel fill: `accent`, `accent-2`, `magic`, `magic-2`, `warm`, `soft`, `ribbon`, element colours (at least 4.5:1); dark in the dark theme, where `ink` is light |
| `stroke` | `#B07570` | `#A88478` | `#8A78A5` | 2px outline of buttons, cards and fields (at least 3:1 to the ground) |
| `outline` | `#6B4540` | `#1E1614` | `#6E5E86` | drawing line: outlines of sprites, icons and placeholders |
| `focus-ring` | `#8A4F9E` | `#F7B6CB` | `#7A5A9E` | keyboard focus ring: 3px solid, offset 2px, at least 3:1 on every surface |
| `accent` | `#F6A5BA` | `#F6A5BA` | `#F0B8CC` | the main action: one «Готово» (Done) or «Дальше» (Next) button per screen |
| `accent-2` | `#AEE3D1` | `#AEE3D1` | `#C9E3EE` | second action, the heroine's lines, outcome «почти чисто» (nearly clean) |
| `magic` | `#B7DDF5` | `#B7DDF5` | `#DCEAF2` | everything the System does: System buttons, the guiding thread, a good reward |
| `magic-2` | `#E2CFF5` | `#E2CFF5` | `#E9D9F0` | second magic colour: end of window gradients, selection highlight |
| `warm` | `#FFD98E` | `#FFD98E` | `#FFF1B8` | experience, buttons (the currency), outcome «чисто» (clean), sparkling reward |
| `soft` | `#DCCBE6` | `#DCCBE6` | `#DCD3EA` | outcome «узел ослаблен» (knot loosened), inactive; never red |
| `mystery` | `#8A5A9E` | `#C7A6DE` | `#7A5A9E` | mystery: the Diary, ranks, links; as text on `surface-100/200`, as a fill with `on-mystery` text |
| `on-mystery` | `#FFFFFF` | `#2E2320` | `#FFFFFF` | text on a `mystery` fill (rank letter, chips) |
| `system-from` | `#CDE8FA` | `#4B5E78` | `#DCEAF2` | System window: top of the gradient |
| `system-to` | `#F8D3E4` | `#6A4E6E` | `#F3DDEB` | System window: bottom of the gradient |
| `system-ink` | `#4A3150` | `#FDF1EC` | `#4E3A5C` | text in System windows (at least 4.5:1 to both ends of the gradient) |
| `system-rim` | `#FFFFFF` | `#F2DCD3` | `#FFFFFF` | light rim, glow and gloss strip of the System window |
| `ribbon` | `#F6A5BA` | `#F6A5BA` | `#F0B8CC` | ribbon title of the System window with cat ears; text `on-fill` |

Six alias tokens follow other tokens in every theme and palette:

| Alias | Value | Use |
| --- | --- | --- |
| `outcome-clean` | `var(--warm)` | outcome «распутан начисто» (untangled cleanly) and «критическое распутывание» (critical untangling); not a green "correct" |
| `outcome-partial` | `var(--accent-2)` | outcome «почти чисто» (nearly clean) |
| `outcome-soft` | `var(--soft)` | outcome «узел ослаблен» (knot loosened) and «не знаю» (I don't know); never red |
| `tier-common` | `var(--surface-300)` | chest: common reward |
| `tier-good` | `var(--magic)` | chest: good reward |
| `tier-sparkle` | `var(--warm)` | chest: sparkling reward, plus `shadow-sparkle` |

### The Parent Room uses a plum scale that ignores the player's palette

The Parent Room doesn't follow the player's palette. Skill states use the plum scale `state-*`, with text in `state-ink` or `state-ink-inv`, the frontier outlined in `state-frontier`, and every state also named in words.

| Token | Value | Use |
| --- | --- | --- |
| `state-ink` | `#3B2A33` | text on light state chips |
| `state-ink-inv` | `#FFFFFF` | text on the dark chips «Бегло» (Fluent) and «Устойчиво» (Stable) |
| `state-untested` | `#EFE6DA` | skill not tested; text `state-ink` |
| `state-emerging` | `#E3D6F0` | «Пока не освоено» (Not mastered yet); text `state-ink` |
| `state-understands` | `#BCA6E0` | «Понимает, нужна скорость» (Understands, needs speed); text `state-ink` |
| `state-fluent` | `#7657B0` | «Бегло» (Fluent); text `state-ink-inv` |
| `state-stable` | `#4B3A7A` | «Устойчиво» (Stable); text `state-ink-inv` |
| `state-frontier` | `#E0668C` | 3px outline of skills on the frontier; doesn't mean "bad" |

### The eight element colours are the same in every palette and always carry an icon and a name

| Token | Value | Element | Floor | Hue |
| --- | --- | --- | --- | --- |
| `el-spark` | `#FFD98E` | «Искра» (Spark) | «Архив» (Archive) | honey |
| `el-stride` | `#F7B98A` | «Ход» (Stride) | «Завод» (Factory) | copper peach |
| `el-crumb` | `#F6A5BA` | «Крошка» (Crumb) | «Кондитерская» (Patisserie) | strawberry |
| `el-drop` | `#8FDCE0` | «Капля» (Drop) | «Канал» (Canal) | turquoise |
| `el-harmony` | `#AEE3C4` | «Лад» (Harmony) | «Ярмарка» (Fair) | mint |
| `el-measure` | `#FFD2A1` | «Мера» (Measure) | «Дюны» (Dunes) | sand |
| `el-facet` | `#D5BEF5` | «Грань» (Facet) | «Сад» (Garden) | lilac |
| `el-echo` | `#A9D3F4` | «Эхо» (Echo) | «Сортировочная» (Sorting House) | sky |

Text on an element colour is `on-fill`.

### The art palette and the location palettes serve illustrations, backgrounds and prompts only

The art palette `art-*` is for illustrations and prompts, never for the interface:

| Token | Value | Meaning |
| --- | --- | --- |
| `art-cream` | `#FFF4EC` | creamy patisserie ground |
| `art-strawberry` | `#F4A0B5` | strawberry cream, the main accent |
| `art-chocolate` | `#7A4B3A` | chocolate: hair, wood, warm shadows |
| `art-vanilla` | `#FFF8E7` | vanilla: light, highlights |
| `art-powder` | `#A9D3F2` | powder blue: magic, ribbons |
| `art-mint` | `#B5E5CF` | mint |
| `art-custard` | `#FFDF9A` | custard, gold |
| `art-lilac` | `#D8C2F0` | lilac: mystery, shadows |
| `art-line` | `#6B4540` | drawing line: warm dark brown, not black |
| `art-shadow` | `#E7C6D4` | pink-lavender shadow |

The location palettes come from the canon. Each has four roles: `base` for the ground and large masses, `second`, `accent` for lights, details and particles, and `shade` for cel shadows and haze. They serve scenes, backgrounds and art only, never text.

| Prefix | Location | `base` | `second` | `accent` | `shade` |
| --- | --- | --- | --- | --- | --- |
| `town` | «Город Туманный Брод» (the town of Misty Ford) | `#F4EEE6` | `#9FC7D9` | `#FF8FA3` | `#A7A9C9` |
| `forest` | «Шерстяной лес» (the Woollen Forest) | `#7FCB8E` | `#C7E59B` | `#FFB86B` | `#5C7A8C` |
| `archive` | floor 1, «Шуршащий Архив» (the Rustling Archive) | `#FFE7B3` | `#E8A857` | `#D9476E` | `#8C6A5A` |
| `factory` | floor 2, «Завод Тикающих Чайников» (the Ticking Kettle Factory) | `#F2A15A` | `#FFD1A8` | `#6FE0C8` | `#9E5F4A` |
| `bakery` | floor 3, «Кондитерская Облачных Долей» (the Cloud Slice Patisserie) | `#FF9EC4` | `#FFF3D6` | `#9EE3A0` | `#C9A0C9` |
| `canal` | floor 4, «Канал Капель» (the Canal of Drops) | `#5FD3D9` | `#A9E4FF` | `#FFE066` | `#5A7FA8` |
| `fair` | floor 5, «Ярмарка Весов» (the Fair of Scales) | `#8EEBC0` | `#FFF07A` | `#FF8A73` | `#6FA38E` |
| `dunes` | floor 6, «Мерные Дюны» (the Measuring Dunes) | `#FFC98A` | `#FFE2A8` | `#3FD1C4` | `#D98C8C` |
| `garden` | floor 7, «Сад Граней» (the Garden of Facets) | `#C3A6FF` | `#E6DBFF` | `#9EF2E0` | `#8C7AB8` |
| `sorting` | floor 8, «Сортировочная Шёпотов» (the Sorting House of Whispers) | `#8FCBFF` | `#FFF6E3` | `#FF5E5E` | `#7C98B8` |
| `observatory` | floor 9, «Обсерватория» (the Observatory) | `#4B3A7A` | `#FFD866` | `#9EEBB3` | `#2F2A55` |
| `dream` | «Дримкор (все слои)» (dreamcore, all layers) | `#F6E6F0` | `#DCEAF2` | `#FFF4B8` | `#C9C2DA` |

### The four preset palettes replace the fills, and three of them also tint the light grounds

`bundle.css` defines the palettes. Every palette sets these fills in both themes, and re-declares the six aliases so they follow the palette:

| Palette | Name | `accent` and `ribbon` | `accent-2` | `magic` | `magic-2` | `warm` | `soft` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `strawberry` | «Клубничный крем» (Strawberry cream) | `#F6A5BA` | `#AEE3D1` | `#B7DDF5` | `#E2CFF5` | `#FFD98E` | `#DCCBE6` |
| `vanilla` | «Ванильное облако» (Vanilla cloud) | `#9CCBF0` | `#F7C3D4` | `#C9D6FA` | `#EBD6F5` | `#FFE3A1` | `#D6D0EE` |
| `matcha` | «Мятный чай» (Mint tea) | `#9FDBB8` | `#F8D8A0` | `#BFE4F0` | `#DCEFD0` | `#FFE39A` | `#D3DDE8` |
| `lavender` | «Лавандовый сироп» (Lavender syrup) | `#CDB4F0` | `#F9C9DA` | `#B9D9F7` | `#F2D5F0` | `#FFDCA0` | `#D9D2E6` |

The strawberry palette equals the light theme's defaults. The other three override the grounds only when the theme is neither `dark` nor `dream`:

| Token | `vanilla` | `matcha` | `lavender` |
| --- | --- | --- | --- |
| `surface-100` | `#F2F6FC` | `#F1F8F2` | `#F6F1FC` |
| `surface-200` | `#FFFFFF` | `#FBFEFA` | `#FFFCFF` |
| `surface-300` | `#DDE9F6` | `#DCEEDF` | `#E6DCF3` |
| `ink` and `on-fill` | `#39365A` | `#2F4A3A` | `#46365E` |
| `ink-muted` | `#5E5B83` | `#4E6B58` | `#6B5A85` |
| `stroke` | `#7A86B3` | `#66917A` | `#9580B8` |
| `outline` | `#4A4670` | `#3E5E4B` | `#56426F` |
| `focus-ring` | `#3F5BB5` | `#2F7A55` | `#7A4FB0` |
| `mystery` | `#5B5FA8` | `#47705F` | `#7A4FA0` |
| `system-from` | `#D7E3FF` | `#D2EEF2` | `#DCE4FB` |
| `system-to` | `#F3D9F2` | `#E3F2D4` | `#F4D8EC` |
| `system-ink` | `#33305A` | `#2C4636` | `#3F2F57` |
| `shadow-lip` | `0 3px 0 #7A86B3` | `0 3px 0 #66917A` | `0 3px 0 #9580B8` |

In the dark theme the three palettes change only the System window gradient:

| Palette | `system-from` | `system-to` |
| --- | --- | --- |
| `vanilla` | `#3F5680` | `#5B4E7E` |
| `matcha` | `#3E6660` | `#556A4A` |
| `lavender` | `#4E4B7E` | `#6E4E78` |

### The custom palette lets the player paint four roles, and `Tower.paletteVars` keeps them readable

The player paints four roles herself through `ColorRole`: the main colour (`accent`), the second (`accent-2`), magic (`magic`) and warmth (`warm`). `Tower.paletteVars(colors, mode)` turns them into CSS variables for the `style` attribute of the game root. The README states that colours too dark are lightened until text on them reads at 4.5:1 or better. It adds that the other colours are derived from the chosen ones, and that «Любой её выбор безопасен» (any choice she makes is safe).

`bundle.js` implements it this way:

- `mode` is `dark` when passed as `dark`, and `light` otherwise. The mode sets the inks: light uses `ink` `#5B3A36`, `on-fill` `#5B3A36`, `system-ink` `#4A3150` and base `#FFFFFF`; dark uses `ink` `#FBEDE6`, `on-fill` `#2E2320`, `system-ink` `#FDF1EC` and base `#2E2320`.
- A missing role falls back to the strawberry value: `accent` `#F6A5BA`, `accent2` `#AEE3D1`, `magic` `#B7DDF5`, `warm` `#FFD98E`.
- `readableFill` mixes a fill towards white in steps of 0.05 until `on-fill` on it reaches 4.5:1, and stops at pure white. It applies to `accent`, `accent-2`, `magic` and `warm`.
- `ribbon` equals `accent`. `magic-2` is the 50 % mix of `magic` and `accent`, made readable. `soft` is `accent` mixed 60 % towards `#C8C0D0`, made readable.
- The aliases follow: `outcome-clean` and `tier-sparkle` are `warm`, `outcome-partial` is `accent-2`, `tier-good` is `magic`, `outcome-soft` is `soft`.
- Light mode only: `surface-100` is `accent` mixed 86 % towards white, `surface-200` 96 % and `surface-300` 70 %; `tier-common` is `surface-300`. `system-from` is `magic` mixed 35 % towards white and `system-to` is `accent` mixed 45 % towards white, each then mixed further towards white until `system-ink` reads at 4.5:1.
- Dark mode: `system-from` and `system-to` are `magic` and `accent` mixed 62 % towards `#2E2320`, then mixed further towards `#2E2320` until `system-ink` reads at 4.5:1. The grounds keep the dark theme's values.
- `Tower.contrast(a, b)` computes the WCAG ratio that these steps use.

`ColorRole/README.md` adds that the choice is saved in the player's profile together with `mode`, and that switching the theme recomputes the variables.

### My check confirms the text contrast claims, but the stroke falls below 3:1 on `surface-300` in three light palettes

The README states text reaches 4.5:1 to its ground «в каждой теме и палитре (проверено для всех четырёх палитр в обеих темах)» (in every theme and palette, checked for all four palettes in both themes). My script on 2026-09-26 computed 31 pairs for each palette in the light and dark themes. The pairs were `ink` on the three surfaces; `ink-muted` and `mystery` on `surface-100` and `surface-200`; `on-fill` on the six fills, `ribbon` and the eight element colours; `on-mystery` on `mystery`; `system-ink` on both gradient ends; and `focus-ring` and `stroke` on the three surfaces at 3:1.

Every text pair passed in all eight combinations. The stroke failed its 3:1 target on `surface-300` in the light theme for three palettes: `vanilla` 2.90, `matcha` 2.94 and `lavender` 2.62. The token's use says «≥3:1 к фону» (at least 3:1 to the ground), and `surface-300` is the sunken zone of the keypad and experience track, so this is a gap only if `surface-300` counts as a ground. Sample pairs in the dreamcore theme passed: `ink` on `surface-100` 8.40, `ink-muted` on `surface-100` 4.85, `on-fill` on `accent` 5.97, `system-ink` on `system-from` 8.20, `focus-ring` on `surface-300` 4.52 and `stroke` on `surface-100` 3.29. The Parent Room chips passed: `state-ink` on untested 10.86, emerging 9.68 and understands 6.18; `state-ink-inv` on fluent 5.58 and stable 9.61.

Over 20,000 random custom palettes per mode, `paletteVars` never let a fill or System window pair drop below 4.5:1. The minimum was 4.50 for every fill and for the dark gradient ends, 4.79 and 5.47 for `soft`, and 6.50 and 7.01 for the light gradient ends. In light mode `ink` stayed at 7.61 or above on the derived surfaces and `focus-ring` at 4.33 or above. The light stroke `#B07570` fell to 2.84 on a derived `surface-300`, which `paletteVars` doesn't correct.

### Resolved: the light stroke darkens towards `outline` until it reaches 3:1 on `surface-300`, in three preset palettes and in `paletteVars`

Proposed by research on 2026-09-26 as a correction to the design; the owner approves it with this record.

WCAG 2.2 success criterion 1.4.11 asks 3:1 for the visual information needed to identify a component, and it doesn't require a border where a control's own text or icon shows it is there. So the keypad keys, whose digits identify them, would pass WCAG without a 3:1 border. The design's own rule is stricter: `stroke` is «≥3:1 к фону» (at least 3:1 to the ground), and `surface-300` is the ground of the keypad, the experience track, familiar cards and familiar lines in the story log. Three options were weighed:

- Rule that `surface-300` isn't a ground. It costs nothing, but the rule then has an exception to remember, and the experience track's outline, which has no text to identify it, stays at 2.62 in the lavender palette.
- Lighten `surface-300`. This lowers the step between `surface-200` and `surface-300`, which is what makes the keypad and the track read as sunken.
- Darken `stroke` towards the palette's `outline` until it reaches 3:1 on all three surfaces. The lines get slightly darker in three palettes, and one rule holds everywhere.

The third option wins, because it keeps one rule that a script checks and leaves the grounds alone. My script on 2026-09-26 mixed each light stroke towards its palette's `outline` in steps of 0.05, the same step `paletteVars` uses, until it reached 3:1 on `surface-100`, `surface-200` and `surface-300`:

| Palette | `stroke` now | proposed `stroke` and `shadow-lip` colour | contrast on `surface-100` / `surface-200` / `surface-300` |
| --- | --- | --- | --- |
| `strawberry` | `#B07570` | `#B07570`, unchanged | 3.39 / 3.63 / 3.01 |
| `vanilla` | `#7A86B3` | `#7883B0` | 3.41 / 3.70 / 3.01 |
| `matcha` | `#66917A` | `#648E78` | 3.42 / 3.64 / 3.05 |
| `lavender` | `#9580B8` | `#8874A9` | 3.69 / 4.03 / 3.11 |

For the custom palette, `paletteVars` in light mode sets `--stroke` and the colour of `--shadow-lip` too: `#B07570` mixed towards `#6B4540` in steps of 0.05 until it reaches 3:1 on the derived `surface-300`, the darkest of the three derived surfaces. Over 200,000 random main colours the worst case needed a mix of 0.10, giving `#A9706B`. Strawberry passes by 0.01, so the check script must keep this pair in its list.

### The design uses three Cyrillic font families from Google Fonts

All three families have Cyrillic and come from Google Fonts. The link opens `components/bundle.css`: `https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=M+PLUS+Rounded+1c:wght@500;800&family=Nunito:wght@500;600;700;800&display=swap`.

| Family token | Stack | Use |
| --- | --- | --- |
| `display` | `"M PLUS Rounded 1c", "Nunito", system-ui, sans-serif` | weight 800: titles, speaker names, ribbons in capitals |
| `sans` | `"Nunito", system-ui, sans-serif` | story, System, task text, and digits with tabular figures |
| `hand` | `"Caveat", "Nunito", cursive` | the Diary and notes only, in `mystery` |

No text is smaller than 13px (`caption`). A task's text is never smaller than 24px.

### The type scale fixes size, line height and weight for sixteen styles

| Style | Family | Size / line | Weight | Sample | Use |
| --- | --- | --- | --- | --- | --- |
| `title-xl` | display | 56/60 | 800 | «Ранг: D» (Rank: D) | ceremonies: rank, awakening, evolution |
| `title-l` | display | 36/42 | 800 | «Шуршащий Архив» | floor name on entry, screen titles |
| `title-m` | display | 26/32 | 800 | «Сундук» (Chest) | card and modal titles |
| `ribbon` | display | 14/18, letter spacing 0.06em | 800 | «ЗАДАНИЕ» (TASK) | System window ribbon, in capitals |
| `story` | sans | 20/32 | 500 | «В конце коридора кто-то очень тихо пересчитывал ложки.» (At the end of the corridor someone was very quietly counting spoons.) | narrator and lines: column at most 68 characters, always on a solid ground |
| `story-large` | sans | 24/36 | 500 | same | large-text mode (`data-text="large"`) |
| `speaker` | display | 16/20 | 800 | «Бабушка Ирма» (Granny Irma) | speaker's name above a line |
| `system` | sans | 18/26 | 700 | «Ложка не является оружием.» (A spoon is not a weapon.) | text in System windows |
| `task` | sans | 24/34 | 600 | «Сколько пуговиц в трёх коробках?» (How many buttons are in three boxes?) | task text; 28/40 in large-text mode |
| `answer` | sans | 40/48 | 800 | «3 ¾» | digits in answer fields and fractions; tabular |
| `key` | sans | 28/32 | 800 | «7» | maths keypad labels |
| `label` | sans | 16/22 | 800 | «Привал» (Rest stop) | buttons, tabs, chips |
| `body` | sans | 16/24 | 500 | «Пуговка пересчитывает вполголоса.» (Pugovka counts under her breath.) | item descriptions, bestiary, Parent Room |
| `caption` | sans | 13/18 | 700 | «Мама и папа могут читать историю» (Mum and Dad can read the story) | notes, counter captions |
| `counter` | sans | 18/22 | 800 | «128» | counter numbers (experience, buttons, threads); tabular |
| `diary` | hand | 26/30 | 500 | «Нить — не костыль. Нить — дорога.» (The thread isn't a crutch. The thread is a road.) | pages of the Keeper's Diary, notes |

`bundle.css` sets the large-text sizes for components: story lines 24/36, System lines 21/30, the story input field 23/32, suggestion chips 18/24 and the task text 28/40.

### The design README gives the story style two line heights

The section «Шрифты» (Fonts) lists «история (`story`, 20/30)» (story, 20/30). The section «Текст и читаемость» (Text and readability) says «История — `story` 20/32». `tokens.json` and `bundle.css` use 20/32.

### Resolved: story text is 20/32, and the README's «Шрифты» line changes from 20/30

Proposed by research on 2026-09-26 as a correction to the design; the owner approves it with this record.

Both values meet WCAG 2.2 success criterion 1.4.8, which asks for line spacing of at least one and a half times the text size: 30 px is exactly 1.5 times 20 px, and 32 px is 1.6 times. 20/32 wins, because the tokens, the components and the readability section already use it, so only one README line changes, and the extra space helps a player who reads long story passages. The large size stays 24/36.

### The design puts reading first on story screens

The player reads a lot, so text and the input line are the main elements of story screens, with the scene picture at the side. The rules:

- Story text is `story` 20/32, or `story-large` 24/36 in the «Крупный текст» (Large text) mode, set by `data-text="large"`. The column is at most 68 characters wide, left-aligned, with `space-4` between lines.
- Long text sits only on solid `surface-200`, never over a picture and never on translucent glass. Translucent System windows are for short lines over a scene; inside the story log the System window is opaque.
- Text reaches 4.5:1 to its ground in every theme and palette, and the custom palette keeps this rule automatically.
- The input line (`StoryInput`) is always at the bottom of the story column: three suggestion chips, a two-line field in 20px type, a voice button and «Дальше» (Next). Writing is optional, because «Дальше» is always there.

### The colour rules assign each token one job

- Screen ground is `surface-100`, cards and the task window `surface-200`, sunken zones `surface-300`, the lace hem `lace`.
- Text on grounds is `ink`, secondary text `ink-muted`, and only on `surface-100/200`. Text on any pastel fill is `on-fill`: equal to `ink` in the light theme and dark in the dark theme, because fills stay pastel. White text on pastel isn't used.
- `accent` marks one main action per screen and the System window ribbon. `accent-2` marks the second action and the heroine's lines. `magic` and `magic-2` mark everything the System does and the guiding thread. `warm` marks experience, buttons, «чисто» (clean) and sparkling rewards. `soft` marks «узел ослаблен» (knot loosened). `mystery` marks mystery: the Diary, ranks and links, with `on-mystery` text on its fill.
- The System window is a gradient from `system-from` to `system-to` at opacity `system-alpha`, with rim and glow `system-rim` and text `system-ink`.
- Element colours `el-spark` to `el-echo` are the same in every palette and always come with an icon and a name.
- The Parent Room ignores the player's palette.
- The art palette and the floor palettes serve illustrations, backgrounds and prompts only.

### The design fixes spacing, radii, strokes, sizes, opacity and motion as theme-free tokens

| Token | Value | Use |
| --- | --- | --- |
| `space-1` | 4px | gap between an icon and its label |
| `space-2` | 8px | inside chips, between list lines |
| `space-3` | 12px | between buttons in a row |
| `space-4` | 16px | card padding |
| `space-5` | 24px | System window padding |
| `space-6` | 32px | task window padding, gaps between screen blocks |
| `space-7` | 48px | scene edges on the iPad |
| `space-8` | 64px | large breaks, ceremonies |
| `radius-sm` | 12px | chips, counters, fraction fields |
| `radius-md` | 18px | buttons, keys, cards |
| `radius-lg` | 26px | System windows, panels |
| `radius-xl` | 34px | task window, large panels |
| `radius-pill` | 999px | experience bar, ribbons, pills |
| `stroke-bold` | 2px | buttons, windows, cards, keys |
| `stroke-thin` | 1.5px | fields, chips, dividers |
| `stroke-art` | 2.5px | outline of 48px icons and placeholders |
| `touch-min` | 56px | minimum touch zone of any button («спецификация: не меньше 56pt», the specification: at least 56 pt) |
| `key-size` | 64px | a maths keypad key |
| `icon-md` | 28px | icon in a counter or button |
| `icon-lg` | 48px | reward icon in the chest |
| `system-alpha` | 0.84 | System window gradient opacity («канон: 80–85%», the canon: 80-85 %) |
| `disabled-alpha` | 0.5 | inactive «Привал» button, with no countdown |
| `ease-pop` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | the "pop" as a System window or chest appears |
| `ease-soft` | `cubic-bezier(0.25, 0.8, 0.3, 1)` | vanishing into a sparkle, transitions |
| `dur-pop` | 320ms | a window appearing |
| `dur-press` | 90ms | a button press |

The notes in `tokens.json` say lines are thinner than in the first version for the soft anime style, sizes are touch sizes on the iPad, and animation is springy (squash, stretch, a soft bounce) with none in the task window.

### Resolved: `touch-min` is the minimum touch zone of every control on the tablet, and 44 px sizes serve only a pointer

Proposed by research on 2026-09-26 as a correction to the design; the owner approves it with this record. RES-2500 compares accepting the design's 44 px controls, which meet the WCAG level AAA target of 44 by 44 CSS px, with holding the design's own 56 px on the tablet, and holds the reason for 56: the token names the minimum for any button, and the 44 px controls are the top bar, the story chips and the colour swatches, where a miss costs most. The token's use reads as a touch zone, so a control may be drawn smaller when its hit area reaches 56 px without overlapping a neighbour's. RES-3200 lists the components that change.

### The shadows are themed and meant to be warm

The shadow note reads «Тени мягкие и тёплые: розовые или лавандовые, без серого и чёрного» (Shadows are soft and warm: pink or lavender, with no grey or black).

| Token | `light` | `dark` | `dream` | Use |
| --- | --- | --- | --- | --- |
| `shadow-lip` | `0 3px 0 #B07570` | `0 3px 0 #A88478` | `0 3px 0 #8A78A5` | soft lip under buttons and keys; drops to 0 on press |
| `shadow-soft` | `0 10px 28px rgba(176, 117, 112, 0.22)` | `0 10px 28px rgba(0, 0, 0, 0.35)` | `0 10px 28px rgba(138, 120, 165, 0.2)` | cards and windows over a scene |
| `shadow-glow` | `0 0 0 3px rgba(255, 255, 255, 0.8), 0 0 26px rgba(246, 165, 186, 0.45)` | `0 0 0 3px rgba(242, 220, 211, 0.35), 0 0 26px rgba(242, 167, 189, 0.3)` | `0 0 0 3px rgba(255, 255, 255, 0.8), 0 0 26px rgba(240, 184, 204, 0.4)` | System window glow |
| `shadow-gloss` | `inset 0 0 0 2px rgba(255, 255, 255, 0.55)` in every theme | | | white inner rim of buttons and fills |
| `shadow-sparkle` | `0 0 0 3px #FFF4C8, 0 0 22px rgba(255, 217, 142, 0.85)` in every theme | | | sparkling reward, critical untangling |

### The design contradicts its own rule against black shadows

The shadow note forbids grey and black, and the main rules say «Чистого чёрного нет нигде» (no pure black anywhere). The dark theme's `shadow-soft` is `0 10px 28px rgba(0, 0, 0, 0.35)`, a black shadow. `bundle.css` also gives the System window ribbon `box-shadow: 0 2px 6px rgba(0, 0, 0, .08)` in every theme.

### Resolved: shadows take the theme's `outline` colour, never black

Proposed by research on 2026-09-26 as a correction to the design; the owner approves it with this record.

Two options were weighed: relax the rule to allow black in the dark theme, where a warm shadow barely shows on a chocolate ground, or keep the rule and give both shadows a warm dark colour. The rule wins, because it is one of the design's main rules and a warm near-black does the same work. The dark `shadow-soft` becomes `0 10px 28px rgba(30, 22, 20, 0.45)`, the dark theme's `outline` `#1E1614` at a higher opacity to keep the depth of the black at 0.35. The ribbon shadow becomes a token, `shadow-ribbon`, set to `0 2px 6px` in the theme's `outline` at 0.12 opacity: `#6B4540` in the light theme, `#1E1614` in the dark theme and `#6E5E86` in the dreamcore theme. No shadow in the design is then grey or black.

### The design sets forms and motifs

- A 4px step, `space-1` to `space-8`: `space-5` inside a System window, `space-6` in the task window, `space-7` at the scene edges on the iPad.
- Touch zones are at least `touch-min` (56px), keys are `key-size` (64px), and the keypad sits on the right under the thumb.
- Cat motifs: ears above the story log (on screens), on the System window ribbon and on the rank badge, plus the icons `paw` and `bell`. Lace: scallops along the bottom edge of the System window (`tw-lace`). Knitting is the motif of the Tower itself.
- Shadows are soft, pink or lavender: `shadow-soft` for panels, `shadow-glow` for System windows, `shadow-sparkle` for sparkling rewards.
- Keyboard focus is a solid 3px `focus-ring` ring offset by 2px, at 3:1 or better on every surface in every theme and palette.

### The design keeps motion springy and the task window still

A System window appears with a "pop" (`ease-pop`, `dur-pop`) and vanishes into a sparkle (`ease-soft`). Buttons sink in `dur-press`. Nothing moves in the task window. Nothing flashes sharply, and there are no sudden loud sounds.

### The design draws its own flat 48x48 icons and uses no emoji

Icons are a flat 48x48 system: a 2.5px outline in `art-line`, pastel fills and a white highlight. The Icons group holds resources and motifs: «пуговица» (button), «путеводная нить» (guiding thread), «звёздная пряжа» (star yarn), «осколок» (shard), «сундук» (chest), «Дневник» (Diary), «привал» (rest stop), «лапка» (paw) and «колокольчик» (little bell). The Elements group holds the eight elements. Code renders them with `Tower.Icon` by file name. Emoji aren't used. The README lists nine icons, but the icons folder also holds `mic.svg`, and `bundle.js` carries `mic` for the voice button.

### Resolved: `mic` joins the README's icon list as the tenth icon

Proposed by research on 2026-09-26 as a correction to the design; the owner approves it with this record. The icon exists in the folder and the code, and `StoryInput` needs it for dictation, so the list is what is wrong. The README's Icons group adds «микрофон» (microphone) for the voice button, and `IconName` in `index.d.ts` adds `mic` (RES-3200).

### Every heroine screen follows the player's theme, palette and text size

All screens of the game and the Parent Room are in the groups «Экраны · …» (Screens), non-interactive mock-ups with numbered notes, and in the section «Экраны и сценарии» (Screens and scenarios). Every heroine screen obeys the player's `data-theme`, `data-palette` and `data-text` on the root. In the dark theme the screen ground becomes `surface-100` and text on pastel fills becomes `on-fill`. The parent's check mode has a striped frame and doesn't count towards the player's statistics.

### The files carry two version marks and name a generator that isn't in `design/`

`tokens.json` says `"version": 3`. The header of `bundle.css` says «Хроники Башни v2 — soft pastel patisserie look. Every value is a token from tokens.css». The palette block says it is «generated from themes.py», and `design/` holds no `themes.py`. `tokens.css` says it is «compiled from tokens.json».

### Resolved: the design system has one version, 3, set in `tokens.json` and stamped into every compiled file

Proposed by research on 2026-09-26 as a correction to the design; the owner approves it with this record.

The «v2» in the `bundle.css` header reads as the style's version, the pastel look after the first candy one (RES-3400), while `"version": 3` in `tokens.json` is the token set's version. Keeping two marks would ask a reader which one a change must bump. One number wins: `tokens.json` holds it, and `tokens.css`, `bundle.css` and `bundle.js` carry it in their headers. The current number is 3, because `tokens.json` is the source the others compile from. The header of `bundle.css` then reads «Хроники Башни v3». With the palettes moved into `tokens.json` (above), the reference to `themes.py` goes away.

## Conclusions

1. The game must load `design-system/tokens.css` and then `components/bundle.css`, and set `data-theme`, `data-palette` and `data-text` on the game root; the palettes must live in `tokens.json` and `tokens.css`, after the light and dark themes and before the dreamcore theme, not in `bundle.css`.
2. Every interface colour must come from a semantic token, and the art palette and the location palettes must never colour interface text.
3. The player must be able to choose the light or dark theme, any of the four preset palettes or a custom palette at any time in the game settings, with no lock or price.
4. The dreamcore theme must never be the player's choice, and the task window, rest stops, eye exercises and the heroine's room must never switch to it.
5. The theme, palette, custom colours and mode must be saved in the player's profile and restored on any device, and switching the theme must recompute custom palette variables.
6. A custom palette must pass through `paletteVars` or an equivalent that lightens each fill until `on-fill` reaches 4.5:1 and adjusts the System gradient until `system-ink` reaches 4.5:1.
7. Text must reach 4.5:1 against its ground or fill, and the focus ring 3:1 against every surface, in every theme, preset palette and custom palette.
8. The 2px stroke must reach 3:1 against `surface-100`, `surface-200` and `surface-300` in every theme and palette: the light `stroke` must be `#7883B0` in `vanilla`, `#648E78` in `matcha` and `#8874A9` in `lavender`, and `paletteVars` must darken the custom light stroke towards `#6B4540` until it passes. The draft record left `surface-300` as a question for the owner.
9. The interface must show no grade: no red for "bad", no ticks or crosses, no «неправильно», no percentages and no scores; outcomes use only the three outcome colours with an icon and a word.
10. The interface must show no timer, countdown or time bar, and an inactive rest stop button must be dimmed to `disabled-alpha` with no countdown.
11. Numbers in System windows must come from code-supplied fields, never from digits inside a line of text.
12. Long text must sit on solid `surface-200`, in a column of at most 68 characters, and never over a picture or on translucent glass.
13. Story text must be 20/32 and 24/36 in large-text mode, task text at least 24px (28/40 in large-text mode), and no text smaller than 13px.
14. The game must use the families M PLUS Rounded 1c, Nunito and Caveat with Cyrillic, the hand font only for the Diary and notes, and tabular figures for answers, keys and counters.
15. Every touch target must be at least 56px and every maths key 64px, with the keypad on the right under the thumb.
16. Spacing, radii, strokes, opacities, easings and durations must use the token values in this record.
17. No shadow may be black or grey: the dark `shadow-soft` must use `rgba(30, 22, 20, 0.45)`, and the ribbon shadow must be a token `shadow-ribbon` in the theme's `outline` colour at 0.12 opacity.
18. Element colours must be the same in every palette and always appear with the element's icon and name.
19. The Parent Room must use the plum `state-*` scale, independent of the player's palette, and name every state in words.
20. Icons must be the game's own flat 48x48 drawings with a 2.5px `art-line` outline, rendered by name, and emoji must not be used.
21. Illustrations must follow the soft visual-novel anime style in the patisserie palette with original characters, and the owner must settle this against the candy chibi style in RES-1500.
22. Motion must be springy outside the task window, absent inside it, and never flash sharply or play sudden loud sounds.
23. The design README must give story text as 20/32 in both of its sections.
24. The README's icon list must include `mic` as the tenth icon.
25. The design system must carry one version number, set in `tokens.json` and stamped into `tokens.css`, `bundle.css` and `bundle.js`, now 3.
26. On the tablet every control must have a touch zone of at least `touch-min`, 56px, drawn or extended without overlapping a neighbour's; 44px sizes may serve only a pointer.

## Sources

- The owner's design file «README.txt», read 2026-09-26; not kept in the repository - the folder layout, the two style sheets the game loads, the root attributes, the prototype's server command and the claim that `tokens.css` holds the palettes.
- The owner's design file «design-system/README.md», read 2026-09-26; not kept in the repository - the style, the main rules, themes and palettes, the custom palette, colour, fonts, readability, screens, forms, motion, icons and illustrations.
- The owner's design file «design-system/tokens.json», read 2026-09-26; not kept in the repository - every token's value per theme and its stated use, the type scale and the notes on shadows, strokes, sizes and easing.
- The owner's design file «design-system/tokens.css», read 2026-09-26; not kept in the repository - the compiled theme blocks and theme-free tokens used in the contrast check.
- The owner's design file «design-system/components/bundle.css», read 2026-09-26; not kept in the repository - the font link, the four palettes, the large-text sizes and the ribbon's black shadow.
- The owner's design file «design-system/components/bundle.js», read 2026-09-26; not kept in the repository - the `paletteVars` and `contrast` functions and the `mic` icon.
- The owner's design file «design-system/components/ColorRole/README.md», read 2026-09-26; not kept in the repository - saving the custom palette with its mode and recomputing it on a theme switch.
- The owner's design file «icons/mic.svg», read 2026-09-26; not kept in the repository - the tenth icon, which the README's list of nine leaves out.
- W3C, «Understanding Success Criterion 1.4.11: Non-text Contrast», WCAG 2.2, https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html, read 2026-09-26 - 3:1 for the visual information that identifies a component, and no border needed where the control's own text or icon shows it.
- W3C, «Understanding Success Criterion 1.4.8: Visual Presentation», WCAG 2.2, https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html, read 2026-09-26 - line spacing of at least one and a half times the text size, which both 20/30 and 20/32 meet.
- W3C, «Understanding Success Criterion 2.5.5: Target Size (Enhanced)», WCAG 2.2, https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html, read 2026-09-26 - a pointer target of at least 44 by 44 CSS pixels at level AAA.
- A contrast script run by research on 2026-09-26 over the light strokes of the four palettes and 200,000 random custom main colours; not kept in the repository - the proposed stroke values and the custom palette's worst case.
