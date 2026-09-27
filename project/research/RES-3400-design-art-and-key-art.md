---
id: RES-3400
artifact: research
status: approved
revised: 2026-09-27
---

# The owner's design proposes a soft pastel patisserie anime style with a catgirl heroine, fixed by one key-art reference

## Summary

The owner's design replaces the draft's bright candy chibi style with a soft pastel anime style in the manner of a visual novel. The player asked for it herself, «как в Некопаре» (like in Nekopara): a patisserie shop window on a sunny morning, with catgirls. The design takes the mood and the techniques and leaves out the franchise's characters and its adult presentation. The heroine is a catgirl in a cream cable-knit cardigan, and the picture keyart-heroine fixes her look. Two older pictures, keyart-tower and keyart-archive, show the first, "candy" version of the style and serve only as references for the world. Icons and element symbols are flat 48 by 48 SVG drawings with a warm brown line. The style contradicts CAN-0120 on the style, the line, the proportions, the global palette and the prompt blocks, and CAN-0070 on the heroine's look. Research resolves gap 31 here in favour of the design's style, with no reference name in any prompt. This record covers the art guideline, the key art, the icons and the elements; the voice is in RES-3300, the screens in RES-3500, and tokens and components in RES-3100 and RES-3200.

## The question

Which visual style should the game's art follow, so that the player wants to come back every day for a year? The design assumes that the style the player asked for is the style that keeps her coming back. That holds for her taste today, but a primary-school girl's taste can move within the campaign year, and the reference the player named belongs to an adult franchise. The design answers the second risk with a table of what it takes and leaves, and says nothing about the first.

## Method

Read the owner's design files `design-system/guidelines/20-art.md` and `key-art/README.md` on 2026-09-26. Listed the files in `key-art/`, `icons/` and `elements/`, looked at the three key-art pictures with an image reader, and read the source of each SVG file for its shape and colours. Read `design-system/README.md`, section «Иллюстрации» (Illustrations), for the style line it repeats. Compared the design with CAN-0070, CAN-0120, RES-1500 and RES-2800. For gap 31, searched the record for "Cookie Run", "Nekopara", "chibi" and "candy", and read two outside pages on 2026-09-26: the Wikipedia article "Nekopara" and the App Store page of "CookieRun: Kingdom".

The design leaves these points open:

- how the player's taste is checked again during the year, before art is generated in volume (closed on 2026-09-27: research decided, on the owner's instruction, that the family shows her the key art and the four heroine sheets first, as a prerequisite of stage 0.3; see the resolved finding on the style block below);
- who draws the heroine's poses for other screens (at the campfire, in a floor scene), which the screens guideline lists as still to draw;
- whether the heroine's look stays fixed by keyart-heroine or the player picks one of four sheets, as the prototype's hero screen says (RES-3500) (resolved below: the family picks one sheet drawn from keyart-heroine before art is made);
- whether the hourglass symbol for «Мера» (Measure) sits well beside the rule of no clocks on screen (RES-0300) (resolved below: it stays, still and away from anything timed).

## Findings

### The design sets a soft pastel patisserie style with catgirls, at the player's request

«Стиль по просьбе игрока — «как в Некопаре»: мягкая пастельная кондитерская с девочками-кошками в аниме-стиле визуальной новеллы.» (The style, at the player's request, is "like in Nekopara": a soft pastel patisserie with catgirls in a visual-novel anime style.) Everything looks like a shop window with cakes on a sunny morning: strawberry cream, vanilla, powder-blue ribbons, lace doilies, bells, knitted details. No realism, sharp corners, gloomy tones or frightening shadows.

### The design takes Nekopara's mood and techniques and leaves its characters and adult presentation

The design notes that the original Nekopara games are for adults (18+), so it takes only the mood and the techniques.

| Take | Leave |
| --- | --- |
| The pastel patisserie: shop windows, cakes, lace, bows, bells | The franchise's characters, names, logos and recognisable outfits |
| Catgirls: ears and a tail on the heroine and the Tower's residents | Maid costumes, revealing poses, "adult" and romantic presentation |
| Big glossy eyes, blush, chibi emotions | Fan service of any kind |
| The visual-novel layout: a sprite beside the text, with the speaker's name | Long scenes with no choice and no action by the heroine |
| Cat motifs in the interface: ears over the story ribbon, the settings paw, the bell | Cat motifs that get in the way of reading |

### The design draws a thin warm line, pastel fills and pink-lavender shadows

- The line is thin and soft, in the warm dark brown `art-line`, never black. Inner lines are lighter than the outline.
- Fills are soft pastels from the `art-*` tokens and the floor palette. Shadows have two steps, pink-lavender (`art-shadow`), with a light gradient inside the shadow.
- Highlights are white ovals on eyes, cheeks, icing and shop-window glass. The air glows slightly.

The art tokens are: `art-cream` #FFF4EC, `art-vanilla` #FFF8E7, `art-strawberry` #F4A0B5, `art-chocolate` #7A4B3A, `art-powder` #A9D3F2, `art-mint` #B5E5CF, `art-custard` #FFDF9A, `art-lilac` #D8C2F0, `art-line` #6B4540 and `art-shadow` #E7C6D4. The floor palettes in the design's tokens (`archive-*` to `observatory-*`, `town-*`, `forest-*`, `dream-*`) match the hex values of CAN-0120's floor table.

### The design sets soft anime proportions and keeps creatures round

- The heroine and people have soft anime proportions: about 6 heads tall in scenes and 2.5 to 3 in chibi inserts, big glossy eyes with two highlights, rosy cheeks, full hair.
- The heroine is a catgirl: soft cat ears and a tail the colour of her hair, and a bell on a ribbon. The ears move with emotion: up for surprise, flat for thinking, one tilted for cunning.
- Clothes: a hunter in a hooded cloak (with slits for the ears) and a patch, over a dress with a patisserie apron, ribbons and bows. No maid costumes and no "adult" presentation: covered shoulders, knee length or longer, child proportions.
- The Tower's residents often have ears and tails of different breeds. Guardians are animals or odd adults in the same soft manner, 2 to 4 times the heroine's size.
- Familiars («узелки», little knots) are round and plush, 1.5 to 2 heads, or a head-body; the silhouette reads at once.
- Tangles are round, fluffy or jelly-like, with one glitch detail: a colour shifted by a pixel, a trembling edge, an extra ear.

### The design fixes the heroine's look by the picture keyart-heroine

keyart-heroine is the canon of her look, kept in every new frame:

- a chestnut bob, big brown eyes with two highlights, cat ears and a fluffy tail of the same chestnut;
- a cream cable-knit cardigan with a hood, and the hood has its own knitted ears; mint bows, mint cuffs, a heart patch on the sleeve;
- under the cardigan, a cream frilled dress with a patisserie apron and a mint belt with buttons; a frilled headband with a mint bow;
- the focus is the needle staff with a glowing ball of yarn, and its threads glow mint;
- a mouse peeks out of a mint backpack, and yarn-ball hedgehogs roll on the floor nearby;
- the frame's palette is cream, mint, peach sunset and warm wood, with a warm brown line.

The cloak colour from the heroine's settings tints the cardigan and the bows; everything else stays as in the reference.

### The design contradicts CAN-0070 on the heroine's look

CAN-0070 says the player "chooses her name, looks, hairstyle and cloak", and gives her «„Плащ охотницы“ (the hunter's cloak), with a hood and one patch». The design fixes the look by keyart-heroine: a catgirl with a chestnut bob in a cream cardigan with a hood, where the chosen cloak colour only tints the cardigan and bows. The design's own art guideline also says the heroine wears «плащ с капюшоном (с прорезями для ушек)» (a hooded cloak with slits for the ears), while its reference shows a cardigan. The heroine's species, a catgirl, appeared nowhere in the draft of CAN-0070. The resolved finding on her look and cloak below settles both points.

### The design sets backgrounds, System windows and dreamcore in the same softness

- Backgrounds: interiors and streets with a patisserie tenderness (shop windows, shelves of jars, lace curtains, soft window light), in the floor palette (`<floor>-base/second/accent/shade`). Backgrounds are simpler than characters, with haze.
- System windows: translucent boiled-sweet panels, `radius-lg`, a gradient `system-from` to `system-to`, a white glowing rim, a ribbon with cat ears, lace scallops at the bottom. Trial windows are calmer and larger, with no lace.
- Dreamcore: empty liminal spaces in dusty pastel (`dream-*`), always with a warm light source and a visible exit, one strange object, light grain. The creepiness follows the parent's level from 0 to 2 and is never frightening.

### The design gives new style and negative blocks for prompts

```
STYLE: soft pastel anime visual-novel illustration, gentle patisserie cafe aesthetic, cute child catgirl with soft cat ears and tail, bell on a ribbon, strawberry cream, vanilla, powder blue and mint palette, thin warm brown lineart (no pure black), soft cel shading with pink and lavender shadows, big glossy eyes with two highlights, rosy cheeks, lace, ribbons, bows and knitted yarn details, cozy sunlit bakery mood, cute rounded shapes, original character design, child-friendly, high quality game asset
```

```
NEGATIVE: realistic, photorealistic, 3d render, horror, scary, dark, gore, blood, wounds, skeleton, creepy eyes, empty eyes, sharp teeth, claws, body horror, weapons with blades, guns, text, watermark, logo, signature, existing characters, fan art, franchise characters, Nekopara characters, maid uniform, cleavage, bare shoulders, short skirt, suggestive pose, mature content, adult body, romance, kissing, messy lines, muted colors, grey palette, pure black lines
```

The dreamcore blocks (`DREAMCORE STYLE`, `DREAMCORE LEVEL 0-2`, `DREAMCORE NEGATIVE`) stay in the canon (CAN-0120). The design says the canon's section still describes the first, "candy" version of the style and should be updated from this guideline. The key-art pictures go with every generation request; keyart-heroine is the main one.

### The design contradicts CAN-0120 on style, line, proportions, palette and prompts

| Point | CAN-0120 | The design |
| --- | --- | --- |
| Style | "Bright, cute and round, like a sweet. Chibi proportions, a thick soft outline, a saturated boiled-sweet palette" | «мягкая пастельная кондитерская с девочками-кошками в аниме-стиле визуальной новеллы» (a soft pastel patisserie with catgirls in visual-novel anime style) |
| Line | "thick (3 to 5 px on a 512 px sprite), soft, warm chocolate, and thicker at the turns" | «тонкая и мягкая, тёплого тёмно-коричневого `art-line`» (thin and soft, warm dark brown) |
| People | "2.5 to 3 heads tall" | about 6 heads in scenes, 2.5 to 3 in chibi inserts |
| Outline colour | "Warm dark chocolate #4A2E2A" | `art-line` #6B4540 |
| Global palette | saturated: strawberry #FF6F91, mint #5EE6C0, honey #FFC94A | pastel `art-*`: strawberry #F4A0B5, mint #B5E5CF, custard #FFDF9A |
| STYLE block | "cute chibi mobile-game art, candy-bright saturated palette, soft thick warm-brown outlines" | "soft pastel anime visual-novel illustration, gentle patisserie cafe aesthetic, cute child catgirl" |
| NEGATIVE block | bans "cookie character, gingerbread man", "anime screenshot" and other works' silhouettes | drops those, adds "Nekopara characters", "maid uniform", "suggestive pose" and "mature content" |

### The design's negative block names a franchise, which RES-1500 and RES-2800 forbid

The design's negative block contains "Nekopara characters". RES-1500 concludes that prompts must "never reuse another work's characters, assets, logos or recognisable silhouettes, or name that work". RES-2800 concludes: "Art prompts must not name other games, titles or characters."

### keyart-heroine shows the catgirl heroine in the Tower's round room at sunset

The picture shows the heroine from the knees up in a round wooden room with three round windows: misty water and pines on the left, a hill of pines in the middle, a peach sunset over a pine forest on the right. She has a chestnut bob, brown eyes, brown cat ears and a brown tail with a darker tip. She wears a cream cable-knit hooded cardigan with knitted ears on the hood, mint bows at the collar and headband, a heart patch on the sleeve, and a cream frilled dress with a mint belt and apron. She holds a long silver needle staff tipped with a ball of cream yarn, and mint threads with tiny knots swirl from it. A grey mouse peeks out of a mint backpack, another mouse sits on the right window sill, and five mint yarn-ball hedgehogs sit on a yarn-textured floor. The picture carries no text.

### keyart-tower shows the first-style heroine before a knitted Tower above a canal town

The picture shows a glowing cream Tower knitted in cable stitch, with arched coloured windows and a small door, rising above trees at a pink and lilac dusk. Below lies a canal town with tall gabled brick houses, humpback bridges, bicycles and a shop awning with the English sign "YESTERDAY'S BREAD". On a grassy hill in the foreground stands a chibi heroine with no cat ears: a brown bob, a green hooded cloak with a red heart patch, a silver staff with a pearl tip, a brown backpack with a honey-yellow mouse on it. The design marks this heroine as out of date.

### keyart-archive shows the first-style heroine in the Rustling Archive meeting a Tangle

The picture shows tall bookcases framed by giant cream cable-knit pillars, with books flying loose. On the left floats a round, fluffy grey-lilac Tangle with one rabbit ear and a glitchy blue edge. The same green-cloaked chibi heroine, with the honey-yellow mouse on her backpack, holds her staff. A translucent System window with a pastel gradient carries English text: "SYSTEM: GLITCH DETECTED. RANK: E. PUGOVKA: Spark of Finding activated. OBJECTIVE: Restore the correct order." The design marks this heroine as out of date and keeps the picture as a reference for the Tower, the Archive and the System window.

### The key art's mouse differs from the canon's familiar

CAN-0060 describes «Пуговка» (Little Button) as "A round honey-coloured button-mouse; four holes on her belly spill sparks". keyart-tower and keyart-archive show a honey-yellow mouse. keyart-heroine, the main reference, shows a grey mouse in the backpack, with no holes or sparks visible. The resolved finding on the mouse below keeps «Пуговка» honey-coloured.

### The design ships ten interface icons as flat 48 by 48 SVG drawings

Every icon is 48 by 48, with a 2.5 px outline in #6B4540, pastel fills and a white oval highlight at 75 % opacity.

| File | What it shows | Fills |
| --- | --- | --- |
| bell.svg | a bell with a clapper and a top ring (the cat motif) | #FFD98E, #E9BE7E |
| button.svg | a round sewing button with four holes (buttons, the currency) | #FFD98E, #E9BE7E |
| camp.svg | a flame over two crossed logs (the rest stop) | #FFD98E, #F6A5BA |
| chest.svg | a chest with a pink domed lid, a clasp and stitched bands | #F6A5BA, #FFD98E, #FFF4B8 |
| diary.svg | a purple book with a darker spine, dashed lines and a round clasp (the Keeper's Diary) | #9A6DB0, #7A5294, #FFD98E |
| mic.svg | a microphone on a stand (voice input) | #B7DDF5 |
| paw.svg | a pink cat paw with four toes (settings) | #F6A5BA |
| shard.svg | a blue faceted crystal (a star-steel shard) | #A9D3F4 |
| thread.svg | a spool of thread with a loose end (the guiding thread) | #E9BE7E, #DCE6F2, #A9D3F4 |
| yarn.svg | a lilac ball of yarn with a gold star (star yarn) | #D5BEF5, #FFD98E |

### The design ships eight element symbols in the same drawing style

| File | Element | What it shows | Fill |
| --- | --- | --- | --- |
| spark.svg | «Искра» (Spark) | a four-pointed star with a small circle | #FFD98E |
| stride.svg | «Ход» (Stride) | a cog with a round hub | #F7B98A |
| crumb.svg | «Крошка» (Crumb) | a pie cut into a pink and a cream slice, with cream drips | #F6A5BA, #FFF3D6 |
| drop.svg | «Капля» (Drop) | a water drop | #8FDCE0 |
| harmony.svg | «Лад» (Harmony) | balance scales with mint pans | #AEE3C4 |
| measure.svg | «Мера» (Measure) | an hourglass with peach sand | #FFF3E0, #FFD2A1 |
| facet.svg | «Грань» (Facet) | a cut gem | #D5BEF5 |
| echo.svg | «Эхо» (Echo) | a paper plane | #A9D3F4 |

The symbols follow the canon's element list in CAN-0060: Measure's magic there is "Trickles of sand, measuring lines, ticking", and Echo's is "Paper birds".

### Resolved: the design's pastel patisserie anime style with a catgirl heroine holds, and no prompt or game text names Nekopara or Cookie Run

Proposed by research on 2026-09-26; the owner approves it with this record.

Gap 31 asked which style holds: RES-1500 proposes a style "in the spirit of Cookie Run", CAN-0120's negative block bans "cookie character, gingerbread man", and the design asks for a Nekopara-like pastel style. Four options were weighed.

- Doing nothing, keeping both styles in the record. It is better at nothing: image generation takes one `STYLE` block (RES-2800), so two styles give two looks.
- The draft's candy chibi style (RES-1500, CAN-0120). It is better at small sprites, where a round chibi silhouette reads at once, and it is already written out in full, with floor palettes, blocks and seven sample prompts. Its reference game is rated 13+ on the App Store page of "CookieRun: Kingdom" (Devsisters, read 2026-09-26), so the reference itself carries little risk. Against it: the player didn't choose it, the owner's newer design replaced it, and the canon had to ban the reference's own characters in the negative block.
- The design's pastel patisserie anime style. It is better at the player's motivation, because she asked for it, and the game has to hold her every day for a year. It is the owner's most recent work: the `art-*` tokens, the cat motifs in the components, the 45 screen sheets and the prototype are all built on it. Its visual-novel layout, a sprite beside the text with the speaker's name, fits screens where text is the centre (RES-3500). Against it: the Wikipedia article "Nekopara" (read 2026-09-26) describes the series as "slice-of-life eroge visual novels", released in "an uncensored adult version" and "a censored all ages version", so the reference can pull the image models towards adult presentation.
- A mix: the anime heroine with candy chibi for everything else. It is better at reusing the canon's existing prompts. It loses because one picture would carry two line weights and two palettes, while RES-2800 holds one style across every asset, and the design already keeps familiars, Tangles and Guardians round and plush.

The design's style wins, because the player chose it, the owner built every later design file on it, and its risk has a written guard: the take-and-leave table, child proportions, covered clothes and the negative block. The resolution keeps what the chibi style was better at: familiars, Tangles and Guardians stay round, with silhouettes that read at once, and chibi inserts stay at 2.5 to 3 heads.

The names of both references stay with the adult developer, as RES-1500 does for Gravity Falls, and never enter the canon's prompts or the game's text. The negative block therefore takes the design's block without "Nekopara characters", because "existing characters, fan art, franchise characters" already covers it and naming the work breaks RES-1500 and RES-2800. It keeps the old block's guards against other works' silhouettes, which the design dropped: "long thin limbs, triangle with one eye, pyramid with eye, owl mascot, circus, clown, ringmaster, drone, robot with screen face, cookie character, gingerbread man, ball-shaped capture device". "cookie character" and "gingerbread man" stay, because a patisserie prompt with cute characters drifts towards cookie people more easily than a candy prompt did. "anime screenshot" goes, because it fights the new anime style. A prompt for a familiar, a Tangle or a Guardian adds "round plush creature, chibi proportions" after its description, because the style block now describes an anime girl and the creatures must stay round.

The resolved negative block:

```
NEGATIVE: realistic, photorealistic, 3d render, horror, scary, dark, gore, blood, wounds, skeleton, creepy eyes, empty eyes, sharp teeth, claws, long thin limbs, body horror, weapons with blades, guns, text, watermark, logo, signature, triangle with one eye, pyramid with eye, owl mascot, circus, clown, ringmaster, drone, robot with screen face, cookie character, gingerbread man, ball-shaped capture device, existing characters, fan art, franchise characters, maid uniform, cleavage, bare shoulders, short skirt, suggestive pose, mature content, adult body, romance, kissing, messy lines, muted colors, grey palette, pure black lines
```

The owner decided on 2026-09-27: removing "Nekopara characters" from the negative block is approved. The resolved negative block above is therefore approved by the owner, not only proposed by research.

CAN-0120, RES-1500 and RES-2800 carry the same resolution. The player's taste can change over the year, so the style has to be checked with her before art is generated in volume. The draft of this finding left that to the owner, because only the player knows her taste.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. The style check is a step, not a question: before any art is generated in volume, the family shows the player the key-art pictures and the four heroine sheets, and the parent records her choice. The step is a prerequisite of stage 0.3 (RES-3000). A step with a recorded result catches a mismatch while only a handful of pictures exist, and an open question would let the offline queue run first. RES-1500 holds the comparison.

### Resolved: «Плащ охотницы» is the hooded knitted cardigan in keyart-heroine, and her look is one of four character sheets the family picks before art is made

Proposed by research on 2026-09-26; the owner approves it with this record.

Two questions meet here. The first is whether «Плащ охотницы» (the hunter's cloak) in CAN-0070 is the cardigan in keyart-heroine or a second garment. Two options were weighed. A cloak worn over the cardigan is better at keeping the word «плащ» literal, but keyart-heroine, the main reference, shows no cloak, so every frame would contradict the reference. One garment is better at matching every design file: the cardigan has the hood, the knitted ears on the hood and the one patch (a heart on the sleeve) that CAN-0070 gives the cloak; screen 02 shows keyart-heroine with the pill «Плащ: …» for the chosen colour; the art guideline says the cloak colour «красит кардиган и банты» (tints the cardigan and bows); and the shop sells outfits called «Плащ цвета тумана» (the fog-coloured cloak). So the design uses «плащ» as the world's name for the hooded knitted cardigan, and one garment wins. The art guideline's «прорези для ушек» (slits for the ears) give way to the reference's knitted ears on the hood, because keyart-heroine wins where the guideline and the reference differ.

The second is whether keyart-heroine fixes her look or the player picks one of four sheets, as screen 02 says: «Лист героини выбираем вместе из четырёх вариантов» (We choose the heroine's sheet together from four variants). Three options were weighed.

- keyart-heroine fixes her look, with no choice. It is better at cost: one set of heroine art. But it drops the choice of looks and hairstyle that CAN-0070, RES-0100 and RES-1500 give the player, and it ignores the design's own note.
- The player picks one of four sheets in Session 0. It is better at a feeling of making her own heroine in the game. But every later pose, the campfire and the floor scenes (still to draw, by the screens guideline) would need four versions, against an MVP budget of about 40 assets (RES-3000). Screen 02 has no sheet picker, only the sketch.
- The family picks one of four sheets once, before art is made. The four are drawn from keyart-heroine as character sheets (front, side and 3 to 4 emotions, RES-2800), and the chosen one becomes the reference for every later frame. It is better at keeping the player's choice and the one-heroine art budget together, and it matches the design's «выбираем вместе» (we choose together) and the screen that doesn't show a picker.

The third option wins. In Session 0 the player then chooses the name, the cloak colour and the focus, and the colour tints the cardigan and bows on the chosen sheet. Until the sheet is chosen, keyart-heroine stays the reference. What the four sheets may vary isn't in any design file. The draft of this finding assumed they keep the catgirl, the cardigan and the dress, and left the rest to the owner.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. The four sheets vary only hair colour and style, eye colour and the cardigan's colour. The catgirl ears and tail, the cardigan and the dress silhouette stay fixed. The fixed parts carry what the design and the canon rely on: the catgirl is the style the player asked for, the hooded cardigan is «Плащ охотницы» (CAN-0070), and the dress silhouette keeps the child proportions and covered clothes that conclusion 3 requires. The varied parts are the ones a player reads as "her own" heroine at a glance. The cardigan's colour on the sheet is only a starting look, because the cloak colour she picks in Session 0 tints the cardigan and bows in play.

### Resolved: «Пуговка» stays a honey-coloured button-mouse, and no heroine picture or prompt copies keyart-heroine's grey mouse

Proposed by research on 2026-09-26; the owner approves it with this record.

CAN-0060, the old key art and the prototype's own starter card («Мышка-пуговица цвета мёда», a honey-coloured button-mouse, screen 03) make «Пуговка» honey-coloured, with four holes that spill sparks. keyart-heroine shows a grey mouse with no holes or sparks. Two options were weighed. A grey «Пуговка» is better at matching the main reference, but it contradicts the canon, the old pictures and the design's own card text. Honey is better at all three, and the grey mouse can't be «Пуговка» in any case: the player may pick «Винтик» or «Безешка» in Session 0 (CAN-0060), so the heroine's reference can't fix which familiar sits in her backpack. Honey wins. The grey mouse is a prop of the reference picture. The heroine's sheet prompt shows an empty mint backpack, and a frame with her familiar draws it from its own sheet.

### Resolved: the hourglass stays the symbol of «Мера», drawn still and never placed beside anything timed

Proposed by research on 2026-09-26; the owner approves it with this record.

RES-0300 forbids timers, countdowns, clocks and time bars on her screen. The hourglass has two readings. The Wikipedia article "Hourglass" (read 2026-09-26) says it is often used as a symbol that «the 'sands of time' will run out», and that interfaces «may change the pointer to an hourglass while the program is in the middle of a task». So an hourglass beside a task could read as a timer. Two options were weighed. A new symbol, such as a tape measure, is better at avoiding the time reading. The hourglass is better at the world: Measure holds size and time (CAN-0030), its magic is trickles of sand (CAN-0060), the Measuring Dunes grow huge hourglasses (CAN-0040) and «Минутка» is an hourglass chick. The symbol shows on familiar cards, the route map, the Diary, the forge and the shop, not in the task window (the prototype). The hourglass wins, with three limits: its sand never moves and never shows a level that changes; it never appears in the task window, on the soft stop, the eye exercise or the rest stop; and the game never uses an hourglass as a waiting sign.

## Conclusions

1. The game's art must follow one style: soft pastel patisserie anime in the manner of a visual novel, with a thin warm brown line and no pure black.
2. The heroine must be drawn as a catgirl whose look matches the character sheet the family picks from four drawn from keyart-heroine, with keyart-heroine as the reference until then, and the chosen cloak colour must tint only the cardigan and the bows. The draft record fixed her look by keyart-heroine alone.
3. Every character must keep child proportions and covered clothes: shoulders covered, knee length or longer, no maid costume and no suggestive pose.
4. Familiars, Tangles and Guardians must stay round and plush, with a silhouette that reads at first glance.
5. No prompt, canon text or game text may name Nekopara, Cookie Run or any other work, including in a negative block.
6. Every art request must use the design's `STYLE` block and the resolved `NEGATIVE` block in this record.
7. keyart-heroine must go with every generation request as the main reference; keyart-tower and keyart-archive may go only as references for the world, never for the heroine.
8. No art asset may carry text, including the English text shown in the old key art.
9. Icons and element symbols must be flat 48 by 48 drawings with a 2.5 px `art-line` outline, pastel fills and a white highlight, and every element symbol must appear with its name.
10. The owner must confirm the style with the player again before art is generated in volume.
11. «Плащ охотницы» must be drawn as the hooded cable-knit cardigan of keyart-heroine, with knitted ears on the hood and a heart patch on the sleeve, and never as a second garment over it.
12. Before heroine art is made in volume, the family must pick one of four character sheets drawn from keyart-heroine, and every later heroine frame must go with that sheet as its reference.
13. «Пуговка» must be drawn honey-coloured with four holes that spill sparks, and no heroine sheet or prompt may put keyart-heroine's grey mouse in her backpack.
14. The «Мера» symbol must be a still hourglass whose sand never moves, and no hourglass may appear in the task window, on the soft stop, the eye exercise or the rest stop, or as a waiting sign.
15. The resolved `NEGATIVE` block, without "Nekopara characters", is approved by the owner on 2026-09-27, and every art request must use it.
16. Before any art is generated in volume, the family must show the player the key-art pictures and the four heroine sheets and record her choice, as a prerequisite of stage 0.3, as research decided on 2026-09-27 on the owner's instruction; this is how conclusion 10's check is made.
17. The four heroine sheets must vary only hair colour and style, eye colour and the cardigan's colour, and must keep the catgirl ears and tail, the cardigan and the dress silhouette fixed, as research decided on 2026-09-27 on the owner's instruction.

## Sources

- The owner's design file «design-system/guidelines/20-art.md», read 2026-09-26; not kept in the repository - the style, the take-and-leave table, line and colour, characters, the heroine's reference, backgrounds, System windows, dreamcore and the prompt blocks.
- The owner's design file «key-art/README.md», read 2026-09-26; not kept in the repository - the role of each key-art picture.
- The owner's design file «key-art/keyart-heroine.png», read 2026-09-26; not kept in the repository - the description of the main reference.
- The owner's design file «key-art/keyart-tower.png», read 2026-09-26; not kept in the repository - the description of the first-style Tower picture.
- The owner's design file «key-art/keyart-archive.png», read 2026-09-26; not kept in the repository - the description of the first-style Archive picture.
- The owner's design file «icons/bell.svg», read 2026-09-26; not kept in the repository - its row in the icon table.
- The owner's design file «icons/button.svg», read 2026-09-26; not kept in the repository - its row in the icon table.
- The owner's design file «icons/camp.svg», read 2026-09-26; not kept in the repository - its row in the icon table.
- The owner's design file «icons/chest.svg», read 2026-09-26; not kept in the repository - its row in the icon table.
- The owner's design file «icons/diary.svg», read 2026-09-26; not kept in the repository - its row in the icon table.
- The owner's design file «icons/mic.svg», read 2026-09-26; not kept in the repository - its row in the icon table.
- The owner's design file «icons/paw.svg», read 2026-09-26; not kept in the repository - its row in the icon table.
- The owner's design file «icons/shard.svg», read 2026-09-26; not kept in the repository - its row in the icon table.
- The owner's design file «icons/thread.svg», read 2026-09-26; not kept in the repository - its row in the icon table.
- The owner's design file «icons/yarn.svg», read 2026-09-26; not kept in the repository - its row in the icon table.
- The owner's design file «elements/crumb.svg», read 2026-09-26; not kept in the repository - its row in the element table.
- The owner's design file «elements/drop.svg», read 2026-09-26; not kept in the repository - its row in the element table.
- The owner's design file «elements/echo.svg», read 2026-09-26; not kept in the repository - its row in the element table.
- The owner's design file «elements/facet.svg», read 2026-09-26; not kept in the repository - its row in the element table.
- The owner's design file «elements/harmony.svg», read 2026-09-26; not kept in the repository - its row in the element table.
- The owner's design file «elements/measure.svg», read 2026-09-26; not kept in the repository - its row in the element table.
- The owner's design file «elements/spark.svg», read 2026-09-26; not kept in the repository - its row in the element table.
- The owner's design file «elements/stride.svg», read 2026-09-26; not kept in the repository - its row in the element table.
- The owner's design file «design-system/README.md», section «Иллюстрации», read 2026-09-26; not kept in the repository - the style line and the role of the old key art.
- The owner's design file «design-system/tokens.css», read 2026-09-26; not kept in the repository - the `art-*` and floor palette values.
- Wikipedia, "Nekopara", https://en.wikipedia.org/wiki/Nekopara, read 2026-09-26 - the series' genre and its adult and all-ages versions.
- Apple App Store, "CookieRun: Kingdom", https://apps.apple.com/us/app/cookierun-kingdom/id1509450845, read 2026-09-26 - the 13+ age rating and the developer.
- Wikipedia, "Hourglass", https://en.wikipedia.org/wiki/Hourglass, read 2026-09-26 - the hourglass as a symbol of time running out and as a computer's waiting pointer.
- The owner's design files «prototype/02-Hero.dc.html», «prototype/03-Familiar.dc.html» and «design-system/components/ElementChip/README.md», read 2026-09-26; not kept in the repository - the cloak pill over keyart-heroine, the four-sheet note, the honey-coloured starter card and where element symbols show.
