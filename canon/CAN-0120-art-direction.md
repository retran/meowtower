---
id: CAN-0120
artifact: canon
status: approved
revised: 2026-09-27
---

# Art direction

## Summary

This record holds the game's art direction: the overall style, the global
palette, the palettes of each floor and of dreamcore, shapes and lines,
proportions, System windows, the English style and negative blocks for image
generation, the dreamcore art direction with its own blocks, and seven sample
prompts. It draws the places of CAN-0020 and CAN-0040, the heroine of
CAN-0070, the familiars of CAN-0060, the Tangles of CAN-0050, the items of
CAN-0100 and the System windows of CAN-0030. The dreamcore layer and its
creepiness levels are set out in CAN-0130, which this record gives a look.
The prompt blocks stay in English, as the bible gives them, because the image
models read English.

## Overall style

A soft pastel anime style in the manner of a visual novel, set in a gentle
patisserie: everything looks like a shop window full of cakes on a sunny
morning. Strawberry cream, vanilla, powder-blue ribbons, lace doilies, bells
and knitted details. The heroine and the Tower's residents are catgirls, with
soft ears and tails. The line is thin, soft and warm brown, never black;
shadows are pink and lavender; highlights are white ovals and the air glows
slightly. Familiars, Tangles and Guardians stay round and plush, with a
silhouette that reads at first glance. Animations are bouncy: squash and
stretch, swaying, a soft rebound.

The style takes a mood and techniques from a visual-novel series the player
asked for, and nothing else: no other work's characters, names, logos or
recognisable outfits, no maid costumes, revealing poses, fan service, or
"adult" or romantic presentation. The reference's name stays with the adult
developer and never enters a prompt or the game's text. The earlier, "candy"
chibi version of this style survives only in two old reference pictures of
the world (keyart-tower and keyart-archive); RES-3400 holds why it was
replaced.

No realism, sharp corners, gloomy tones or frightening shadows. Even the
slightly eerie (the Underside, the fog, the Tangles) is soft, with round shapes
and gentle colours. The dreamcore layer below is the exception in mood but not
in softness: it's eerie through emptiness, light and silence, never through
darkness and threat.

## Global palette

The art palette is the design system's `art-*` set, used only for
illustrations, backgrounds and prompts.

| Token | Colour | Hex |
| --- | --- | --- |
| `art-cream` | Cream | #FFF4EC |
| `art-vanilla` | Vanilla | #FFF8E7 |
| `art-strawberry` | Strawberry cream | #F4A0B5 |
| `art-chocolate` | Chocolate | #7A4B3A |
| `art-powder` | Powder blue | #A9D3F2 |
| `art-mint` | Mint | #B5E5CF |
| `art-custard` | Custard | #FFDF9A |
| `art-lilac` | Lilac | #D8C2F0 |
| `art-line` | Warm brown line | #6B4540 |
| `art-shadow` | Pink-lavender shadow | #E7C6D4 |

The earlier saturated palette (strawberry #FF6F91, mint #5EE6C0, honey
#FFC94A, outline #4A2E2A) belonged to the candy version and no longer
applies.

## Floor palettes

| Floor | Main | Second | Accent | Shadow |
| --- | --- | --- | --- | --- |
| The town «Туманный Брод» (Misty Ford) | #F4EEE6 | #9FC7D9 | #FF8FA3 | #A7A9C9 |
| «Шерстяной лес» (the Woollen Forest) | #7FCB8E | #C7E59B | #FFB86B | #5C7A8C |
| 1. «Шуршащий Архив» (the Rustling Archive) | #FFE7B3 | #E8A857 | #D9476E | #8C6A5A |
| 2. «Завод Тикающих Чайников» (the Ticking Teapot Works) | #F2A15A | #FFD1A8 | #6FE0C8 | #9E5F4A |
| 3. «Кондитерская Облачных Долей» (the Cloud Share Confectionery) | #FF9EC4 | #FFF3D6 | #9EE3A0 | #C9A0C9 |
| 4. «Канал Капель» (the Canal of Drops) | #5FD3D9 | #A9E4FF | #FFE066 | #5A7FA8 |
| 5. «Ярмарка Весов» (the Scales Fair) | #8EEBC0 | #FFF07A | #FF8A73 | #6FA38E |
| 6. «Мерные Дюны» (the Measuring Dunes) | #FFC98A | #FFE2A8 | #3FD1C4 | #D98C8C |
| 7. «Сад Граней» (the Garden of Facets) | #C3A6FF | #E6DBFF | #9EF2E0 | #8C7AB8 |
| 8. «Сортировочная Шёпотов» (the Whisper Sorting Office) | #8FCBFF | #FFF6E3 | #FF5E5E | #7C98B8 |
| 9. «Обсерватория» (the Observatory) | #4B3A7A | #FFD866 | #9EEBB3 | #2F2A55 |
| The Underside (spring) | The floor's palette inverted, softened to pastel, with a light bluish sheen | | | |
| Dreamcore (all layers) | #F6E6F0 (dusty pink) | #DCEAF2 (foggy blue) | #FFF4B8 (humming lemon light) | #C9C2DA (lilac haze) |

## Shapes and lines

- The line is thin and soft, in the warm brown `art-line`, and inner lines
  are lighter than the outline. Never pure black.
- Shapes are circles and drops. Corners are rounded, even on cubes and
  crystals. Anything sharp appears only as a soft little tooth.
- Shadows have two steps (cel shading), pink-lavender (`art-shadow`), with a
  light gradient inside the shadow. Highlights are white ovals on eyes,
  cheeks, icing and shop-window glass.
- Backgrounds are a little simpler than the characters, with soft depth and a
  light haze.
- Icons and element symbols are flat 48 by 48 drawings with a 2.5 px
  `art-line` outline, pastel fills and a white highlight. The symbol of
  «Мера» (Measure) is an hourglass whose sand never runs. No hourglass
  appears in the task window, on a rest stop, an eye exercise or a soft stop,
  or as a sign that the game is waiting, because nothing on her screen may
  look like a clock.

## Proportions

- The heroine and people: soft anime proportions, about 6 heads tall in
  scenes and 2.5 to 3 in chibi inserts, big glossy eyes with two highlights,
  rosy cheeks, full hair. Child proportions and covered clothes always:
  shoulders covered, knee length or longer.
- The heroine is a catgirl: soft ears and a fluffy tail the colour of her
  hair, and a bell on a ribbon. Her ears move with emotion: up for surprise,
  flat for thinking, one tilted for cunning. The picture keyart-heroine fixes
  her look: a chestnut bob, big brown eyes, a cream cable-knit cardigan with a
  hood that has its own knitted ears, mint bows and cuffs, a heart patch on
  the sleeve, a cream frilled dress with a patisserie apron and a mint belt,
  a frilled headband with a mint bow, the needle staff with a glowing ball of
  yarn and mint threads, and a mint backpack. The mouse the picture shows
  in the backpack is a prop: it is grey, while «Пуговка» is honey-coloured
  (CAN-0060), and the heroine may have picked another starter, so no
  heroine sheet or prompt copies it. The cardigan is «Плащ охотницы» (the
  hunter's cloak, CAN-0070), and the cloak colour she chooses tints the
  cardigan and bows only. The family picks one of four character sheets
  drawn from keyart-heroine before heroine art is made, and that sheet is the
  reference for every later frame. The four sheets vary only hair colour and
  style, eye colour and the cardigan's colour; the catgirl ears and tail, the
  cardigan and the dress silhouette stay as keyart-heroine shows them. Before
  any art is generated in volume, the family shows the player the key-art
  pictures and the four sheets, and her choice is recorded.
- The Tower's residents often have ears and tails of different breeds.
- Familiars: 1.5 to 2 heads tall, or simply a round head-body, huge eyes and
  tiny paws. The silhouette must read at first glance.
- Guardians: 2 to 4 times bigger than the heroine, but just as round and soft.
  A Guardian must be imposing but likeable.
- Tangles: round, fluffy or jelly-like, with one "glitch detail": a colour
  shifted by a pixel, a trembling edge, an extra ear, tangled threads inside.

## System windows

Semi-transparent glowing panels in the style of a boiled sweet:

- rounded corners with the design system's `radius-lg` (26 px);
- a soft gradient from `system-from` to `system-to`, which follow the theme
  and palette, at the opacity `system-alpha`;
- a white rim with a glow;
- a ribbon tag with cat ears, and lace scallops along the bottom edge;
- a light glossy strip along the top, like a sweet in its wrapper;
- a round, easily read typeface;
- the window title on a small ribbon tag: «Задание» (Task), «Уровень»
  (Level), «Внимание» (Attention);
- it appears with a soft springy "pop" and disappears by shrinking into a
  sparkle;
- a small knitted stitch as decor along the edges.

Trial windows look the same but calmer and larger, with no lace and nothing
distracting.

## Style blocks for generation (English)

```
STYLE: soft pastel anime visual-novel illustration, gentle patisserie cafe aesthetic, cute child catgirl with soft cat ears and tail, bell on a ribbon, strawberry cream, vanilla, powder blue and mint palette, thin warm brown lineart (no pure black), soft cel shading with pink and lavender shadows, big glossy eyes with two highlights, rosy cheeks, lace, ribbons, bows and knitted yarn details, cozy sunlit bakery mood, cute rounded shapes, original character design, child-friendly, high quality game asset
```

```
NEGATIVE: realistic, photorealistic, 3d render, horror, scary, dark, gore, blood, wounds, skeleton, creepy eyes, empty eyes, sharp teeth, claws, long thin limbs, body horror, weapons with blades, guns, text, watermark, logo, signature, triangle with one eye, pyramid with eye, owl mascot, circus, clown, ringmaster, drone, robot with screen face, cookie character, gingerbread man, ball-shaped capture device, existing characters, fan art, franchise characters, maid uniform, cleavage, bare shoulders, short skirt, suggestive pose, mature content, adult body, romance, kissing, messy lines, muted colors, grey palette, pure black lines
```

For a familiar, a Tangle or a Guardian, the prompt adds `round plush
creature, chibi proportions` after the description, because these stay round
in the new style. The picture keyart-heroine goes with every request as the
main reference; keyart-tower and keyart-archive go only as references for the
world, because their heroine is out of date.

## Dreamcore art direction

Dreamcore is the world's rare second layer: empty liminal spaces, pastel
surreal rooms, familiar places that are slightly "not right", an empty
children's playground at dusk, endless soft carpeted corridors, floating
objects, light fog, humming lamps, a sky of soft television static, and warm
nostalgia. Characters and familiars in dreamcore stay just as round and cute;
what changes is light, emptiness and silence.

- Light: diffused, like dusk or fluorescent lamps, and always with a warm
  source (a lamp, a window, the familiar's lantern). Never darkness without a
  light source.
- Colour: dusty pastel (the dreamcore palette above), with no black and no
  blood red; light grain and a soft vignette.
- Composition: a lot of empty space, repeating elements (doors, lamps,
  tiles), and one strange object (a floating ball, a teapot on the ceiling, a
  swing moving with no wind). The exit is always visible: a door, a staircase,
  a light at the end.
- Creepiness by level: level 0 is only a soft dream with no eerie details;
  level 1 adds watching portraits, notes, music boxes and eerie-cute
  creatures; level 2 adds a static sky, humming lamps and long empty halls.
- Never: jump scares, blood, injuries, death, skulls, melting or distorted
  faces, empty black eyes, toothy maws, long thin limbs, faceless figures in
  shadow, mannequins, dolls with cracked faces, realistic dangerous places
  (roofs, water you could drown in, fire), cages and locked rooms, threats to
  loved ones.

The dreamcore style block (English) replaces `[STYLE]` for dreamcore
backgrounds and joins `[STYLE]` for characters in a dreamcore scene:

```
DREAMCORE STYLE: soft dreamcore aesthetic for a children's game, liminal pastel space, empty but peaceful, dusty pink and foggy blue palette with warm lemon lamp light, gentle haze and light film grain, soft vignette, nostalgic and dreamy, familiar-yet-slightly-odd architecture, repeating doors or tiles, one gently floating object, always a visible warm light source and a visible exit, rounded soft shapes, cozy-mysterious not scary, same soft pastel anime style for any characters, high quality game background
```

```
DREAMCORE LEVEL 0: fully cozy dream, no eerie details, no staring eyes, no notes, bright soft daylight
DREAMCORE LEVEL 1: very mild kid-friendly eeriness, a friendly portrait with following eyes, a small music box, a folded paper note, cute odd creatures, mystery that feels curious not frightening
DREAMCORE LEVEL 2: mild kid-friendly eeriness, soft TV-static sky, humming fluorescent lamps, longer empty halls, still gentle, safe and cute, warm light always present
```

```
DREAMCORE NEGATIVE: horror, scary, creepy, jump scare, dark, darkness without light, pitch black, gore, blood, wounds, death, skull, skeleton, corpse, body horror, melting face, distorted face, faceless figure, shadow person, empty black eyes, sharp teeth, gaping mouth, claws, long thin limbs, mannequin, cracked doll, clown, abandoned asylum, hospital, cage, locked room, chains, trapped, fire, drowning, deep dark water, realistic, photorealistic, analog horror, found footage, glitch horror, red eyes, crying blood, text, watermark, logo, existing characters, fan art
```

For dreamcore assets `NEGATIVE` and `DREAMCORE NEGATIVE` go in together. The
image judge also asks: «выглядит ли это страшно для ребёнка N лет?» (does
this look scary to a child of N?), where N is the player's age (kept in
`personal/player.md`). Any answer other than "no" rejects
the variant.

## Seven sample prompts

1. The heroine's sheet:
   `Character reference sheet of a young catgirl tower hunter, child proportions about 6 heads tall, chestnut bob, big brown eyes, soft chestnut cat ears and fluffy tail, cream cable-knit hooded cardigan with knitted ears on the hood, mint bows and cuffs, heart-shaped patch on the sleeve, cream frilled knee-length dress with a patisserie apron and mint belt, frilled headband with a mint bow, empty mint backpack, holding a long silver knitting-needle staff tipped with a glowing ball of yarn, front view, side view, back view, three expressions (curious, determined, deadpan), color swatches, [STYLE]`
2. A familiar:
   `A tiny round familiar creature: a mouse shaped like a honey-yellow button with four little holes on its belly that sprinkle golden sparks, thread-like tail, big serious eyes, tiny paws counting on fingers, chibi, single character, [STYLE]`
3. A Guardian («Мадам Корж», Madame Sponge, of the Confectionery):
   `Floor guardian boss: a huge plump bear shaped like a three-tier layered cake in strawberry pink, vanilla cream and chocolate, a cherry hat on top, dreamy dramatic expression, holding a ribbon-tied cake knife she refuses to use, standing in a cloud bakery, larger scale but soft and cute, [STYLE]`
4. A floor background:
   `Game background, no characters: an evening canal town inside a magical knitted tower, turquoise water flowing down gentle steps, round humpback bridges, lanterns with glowing droplets inside, lock gates with brass wheels, pastel sky-blue and silver palette with lemon lantern light, soft depth haze, cozy calm mood, wide 16:9, [STYLE]`
5. An item icon:
   `Game item icon: a single left sock, striped mint and strawberry, slightly mysterious sparkle around it, tiny tag with a knitted stitch, centered on a soft circular pastel badge, 512x512, [STYLE]`
6. A dreamcore location (level 1):
   `Game background, no characters: an empty children's playground at dusk inside a magical knitted tower, a soft knitted swing gently moving by itself, a pastel carousel with warm lemon lights humming, dusty pink and foggy blue sky with faint soft stars, light haze, a glowing doorway on the right as a visible exit, wide 16:9, [DREAMCORE STYLE], [DREAMCORE LEVEL 1]`
7. An eerie-cute Tangle (level 1):
   `A tiny round cute creature: a plump picture frame with a portrait of a round nearsighted lady in a bonnet, her big friendly eyes looking sideways curiously, slight glitchy shimmer at the frame edge, rosy cheeks, soft pastel colors, chibi, single character, [STYLE], [DREAMCORE LEVEL 1]`

## Assembling a prompt

In every prompt `[STYLE]` is replaced by the style block, and `[DREAMCORE
STYLE]` and `[DREAMCORE LEVEL n]` by the dreamcore blocks. The level is never
above the parent's setting; at level 0 dreamcore assets are taken in their
"cosy" variant. `NEGATIVE`, and for dreamcore also `DREAMCORE NEGATIVE`, goes
in as the negative prompt.

The background is added separately by asset type:

- for characters, familiars, items and icons: `centered, full body, isolated
  on a solid flat {CHROMA} background, no shadow on background`, where the
  pipeline picks the chroma-key colour (the specification's section «Генерация
  графики без присмотра», Unattended image generation);
- for floor backgrounds: nothing, because the scene is the background.

For new entities the AI creates, the prompt is assembled from the card's
visual description plus the style block. A judge with vision checks that the
image is cute, round, in the floor's palette and unlike any known characters.
This live art comes after the first release, with the AI-made entities it
draws; until then every picture is made offline and a person chooses it
(RES-2800).

## Open questions

- Resolved on 2026-09-26: the owner's pastel patisserie anime style with a
  catgirl heroine replaces the candy style "in the spirit of Cookie Run", and
  no prompt or game text names either reference. The negative block keeps
  "cookie character, gingerbread man" as a guard against drifting into
  cookie people. RES-3400 holds the reason.
- Approved by the owner on 2026-09-27: the negative block above leaves out
  the name of the style's reference series, because "existing characters,
  fan art, franchise characters" already covers its characters. RES-3400
  holds the reason.
- Dreamcore light is "diffused, like dusk or fluorescent lamps", and level 2
  keeps "warm light always present", while `DREAMCORE LEVEL 0` asks for
  "bright soft daylight". Is daylight the intended look at level 0, or should
  level 0 keep the dusk light with the eerie details removed?
- The prompt 5 sock is "striped mint and strawberry"; nothing else in the
  canon sets the Left Sock's colours (CAN-0100). Is this its canonical look?
- The specification keeps a machine-readable copy of this art direction as a
  separate content file. Which of the two wins if they differ?
- Resolved on 2026-09-26: the grey mouse in keyart-heroine is a prop, the
  heroine's sheet prompt shows an empty backpack, and «Пуговка» stays
  honey-coloured. RES-3400 holds the reason.
- Resolved on 2026-09-26: the hourglass stays the symbol of «Мера», drawn
  still and kept away from anything timed. RES-3400 holds the reason.
- Resolved on 2026-09-26: the heroine's look is one of four character sheets
  drawn from keyart-heroine, which the family picks before heroine art is
  made. RES-3400 holds the reason.
- Resolved on 2026-09-27: the four sheets vary only hair colour and style,
  eye colour and the cardigan's colour, with the ears, tail, cardigan and
  dress silhouette fixed; and the style check with the player comes before
  any art is generated in volume. Research decided both on the owner's
  instruction, and RES-3400 holds the reason.
