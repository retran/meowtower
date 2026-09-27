---
id: RES-2800
artifact: research
status: draft
revised: 2026-09-27
---

# The draft proposes AI-generated art made offline in one style, chosen by a person and animated as whole sprites

## Summary

The owner's draft generates the game's illustrations offline through
OpenRouter, in one style fixed by the canon. It also describes live art for
new items and creatures during play, which comes after the MVP. Each character starts from a character sheet, and
every other asset follows that sheet. Transparent backgrounds come from a
chroma key cut out with sharp. Characters animate as whole sprites through
PixiJS transformations, because automatic cutting of AI pictures into parts is
unreliable without a person. A judge model scores each variant from 1 to 10
against a checklist, with 7 as the pass mark. An unattended job queue
generates variants within a hard budget, and the parent picks from four
variants in the Parent Room. The game works with any set of art, falling back
to drafts and then SVG placeholders. This record covers offline art, live art
and unattended generation. Art costs are in the daily cost record, and the
tests of the art judge are in the autonomous development record.

## The question

How does the game get consistent, child-safe art without an artist? The draft
assumes that image models, a style block, reference pictures and a judge model
can hold one style across hundreds of assets. That assumption fails when the
model drifts between runs, and the draft's answer is a person choosing each
character sheet, so the judge alone isn't trusted to hold the style.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles -
specification), the opening paragraph and the subsections «Графика»
(graphics) and «Генерация графики без присмотра» (unattended graphics
generation), on 2026-09-26. No alternatives were compared, because the record
carries the owner's proposal for later requirements to cite.

The draft leaves these open:

- The models behind `ART_MODEL_CHAR`, `ART_MODEL_KEY`, `ART_MODEL_BG`,
  `LIVE_ART_MODEL` and `ART_JUDGE_MODEL`, which point to a model table this
  range doesn't hold. The table is in RES-1600, and research checked its
  identifiers on 2026-09-26; see the resolved finding on art models.
- N, the number of consecutive errors after which an art job is marked as
  failed.
- Which five dreamcore locations the draft means; it refers to the canon's
  section 12, which this range doesn't hold.

## Findings

### The draft generates illustrations offline and new items during play

The illustrations are the heroine, familiars, Tangles, Guardians, NPCs
(non-player characters), backgrounds of floors and the city, items and pages
of the Diary; the canon holds the list. They are generated offline through
OpenRouter. Live art for new items and creatures during play comes after the
MVP, as the next finding says.

### Resolved: live art is deferred until after the MVP, together with the AI-made items and creatures it would draw

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's graphics section said new items and creatures are generated «во
время игры» (during play) and described live art without marking it as later.
Its cost table lists «Живые картинки (позже)» (live pictures, later), and its
data model marks `generated_entities`, the table for AI-made items and
creatures, as «позже» (later).

I compared two options:

| Option | Better at | Why it loses or wins |
| --- | --- | --- |
| Live art in the MVP | a new familiar or item gets its own picture at once, which could make the collection feel alive | loses: it has nothing to draw, because RES-1600 defers AI-made items and creatures until after the MVP, and it adds a paid call, a judge and a silhouette fallback to every new thing |
| Live art after the MVP | every MVP picture is chosen by a person from offline variants (RES-1900, RES-0010), and the MVP budget carries no live art line (RES-2700) | wins |

The MVP draws every item, familiar and familiar stage offline, and a person
picks each one. The live art design below stays in the record for the stage
that brings AI-made items and creatures, and `LIVE_ART_MODEL` and
`LIVE_ART_BUDGET_USD` stay unset until then.

### The draft names three models for offline art

The offline art tool is `tools/art-generate.ts`. It uses the models
`ART_MODEL_CHAR`, `ART_MODEL_KEY` and `ART_MODEL_BG` from the model table.

### The draft holds one style across all assets

- Every request carries the style block and the negative block from the canon
  (section 12), the floor palette and 2 to 3 reference pictures.
- Prompts name no other games or titles, and no other characters.
- Each character gets a character sheet first (front, side, 3 to 4 emotions),
  and everything else for that character follows the sheet.
- The asset catalogue `content/art.yaml` holds, for each asset, an id, a
  description, a size, whether it needs a transparent background, and its
  references.

### Resolved: the art follows the owner's pastel patisserie anime style with a catgirl heroine, and no prompt names Nekopara or Cookie Run

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's canon style block was a candy chibi style in the spirit of Cookie Run (RES-1500). The owner's newer design file «design-system/guidelines/20-art.md» replaces it with a soft pastel anime style in the manner of a visual novel, «как в Некопаре» (like in Nekopara), at the player's request, and gives new style and negative blocks. RES-3400 compares four options and chooses the design's style, because the player asked for it and the owner built every later design file on it; it keeps familiars, Tangles and Guardians round, which is what the chibi style did best. For this record it means three things. The style block in every request is the design's block. The negative block is the one RES-3400 resolves: the design's block without "Nekopara characters", because this record's rule forbids naming another work in a prompt, plus the old block's guards against other works' silhouettes. The 2 to 3 reference pictures come from the design's key art: keyart-heroine goes with every request, and keyart-tower and keyart-archive go only as references for the world, because they show an out-of-date heroine. The judge's check for a known character's likeness now also covers the style's reference series, whose Wikipedia article (read 2026-09-26) describes an adult version. For the same reason the judge's fitness-for-a-child check rejects the things the design's table leaves out: adult presentation, maid uniforms, suggestive poses and adult bodies.

The owner decided on 2026-09-27: removing "Nekopara characters" from the negative block is approved, so every art request uses the negative block RES-3400 resolves, as approved by the owner.

### Resolved: before any art is generated in volume, the family shows the player the key art and the four heroine sheets and records her choice

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record.

The offline queue in the finding on unattended art below generates character sheets first and the assets that depend on them after, with no person watching. Without a check first, it could generate most of the about 40 MVP assets in a style the player hasn't seen. So the style check is a step before the queue runs in volume: the family shows the player the key-art pictures and the four heroine sheets (RES-3400), and the parent records her choice. The chosen sheet becomes the heroine reference for the queue. The step is a prerequisite of stage 0.3 (RES-3000). RES-1500 compares it with leaving the check as an open question.

### The draft cuts transparent backgrounds from a chroma key

Assets are generated on a flat chroma key background, cut out with sharp and
saved as PNG or WebP with an alpha channel. The key colour lies outside the
asset's palette: magenta `#FF00FF` by default, and green for pink and lilac
assets.

### The draft chooses whole-sprite animation over cutting pictures into parts

Until stage 0.5 there is no cutting. Every character is a whole sprite,
animated by PixiJS transformations: breathing by squash, bouncing, swaying and
a hit with squash and stretch. The emotions of the heroine, Guardians and
familiars are separate pictures from the character sheet (4 emotions), and a
blink is an overlaid picture of eyelids. The draft's reason: automatic cutting
of AI pictures into parts is unreliable without a person. Cutout animation is
an optional improvement at stage 0.5, and only with part masks a person has
approved. Cutout animation is deferred until after the MVP by the draft.

### The draft makes effects in code

Effects are shaders and particles in code: the Tangles' glitch, spell
particles, flashes of windows and chests, the critical untangling, the
garland of a clean row, the soft fading of a thread, dreamcore fog and
«помехи» (static) in the sky.

### The draft ties each dreamcore asset to a minimum creepiness level

Dreamcore assets are the backgrounds of dreamcore variants of floors, 5
dreamcore locations and creepy-cute Tangles. They follow the canon's
dreamcore block (section 12) with its negative block against real horror.
Each asset stores a minimum creepiness level, and the game never shows an
asset above the level the parent set. At level 0 the game shows the «уютный»
(cosy) variant of the same background.

### The draft runs on SVG placeholders until art exists

Until the art exists, the game runs on SVG placeholders.

### The draft specifies live art for new items and familiars, for after the MVP

Live art uses `LIVE_ART_MODEL` for new items and familiars during play. It
arrives with AI-made items and creatures, after the MVP.

- The picture is generated on a chroma key background and cut out with sharp
  inside the `tower` container, with no rembg and no Python during play.
- The prompt follows the creepiness level: at level 0 the dreamcore block is
  left out, and at levels 1 and 2 it goes in with its negative block. The
  judge rejects anything that looks frightening and not creepy-cute.
- `ART_JUDGE_MODEL` scores against a checklist on a scale of 1 to 10, with 7
  as the pass mark. Below 7 the picture is generated once more, and after that
  a silhouette placeholder is shown.
- The picture is static, and animation uses transformations of the whole
  sprite.
- A familiar's evolution edits the previous picture, using it as the
  reference.

### Resolved: the art models are the draft's defaults, all present in the OpenRouter catalogue, with `google/gemini-3.8-flash` as the judge

Proposed by research on 2026-09-26; the owner approves it with this record.

The model table in RES-1600 gives `ART_MODEL_CHAR` and `LIVE_ART_MODEL` as
`google/gemini-3.1-flash-image`, `ART_MODEL_KEY` as `google/gemini-3-pro-image`,
`ART_MODEL_BG` as `bytedance-seed/seedream-4.5` and `ART_JUDGE_MODEL` as
`google/gemini-3.8-flash`. Research read the OpenRouter catalogue on
2026-09-26, and all five exist. The image models appear only in the listing
filtered by `output_modalities=image`, and `bytedance-seed/seedream-4.5` is
missing from the default listing, so a check against the default listing
alone would report it missing. The draft's bake-off named
`google/gemini-3.5-flash`, and RES-1600 settles on `google/gemini-3.8-flash`,
the newer and cheaper model of the same class. Art prompts carry canon JSON
cards and no player text, so these requests belong to the content tier in
RES-2600; `bytedance-seed/seedream-4.5` has one endpoint, Seed, and whether
it serves under `data_collection: "deny"` shows at stage 0.

### The draft runs offline art as an unattended, resumable queue

`art:generate` starts an AI agent that runs unattended; a person picks the
variants later.

- Queue and resume: each asset is a job in `art_jobs` with the states
  waiting, generating, ready to choose, chosen, rejected and error. An
  interrupted run continues from where it stopped.
- Order by reference: character sheets come first, then the assets that
  depend on them. Until a person chooses a sheet, dependent assets follow the
  best-scored variant and are marked as drafts. When a person chooses a
  different sheet, one command regenerates them.
- Automatic scoring: `ART_JUDGE_MODEL` checks the match to the description,
  the style against the references, that it is the same character, the number
  of fingers and eyes, no stray text or watermarks, no likeness to known
  characters, a flat background and fitness for a child. The score is 1 to 10
  with 7 as the pass mark; below it the asset is regenerated up to 3 times.
- Post-processing: background removal, WebP, previews.
- Budget: `ART_BUDGET_USD` is a hard ceiling for a run, with the cost taken
  from OpenRouter's response. Retries back off exponentially. After N errors in
  a row a job is marked as an error, and the run moves on.
- Result: `artifacts/art-report.html`. A person chooses on the «Выбор
  графики» (Graphics choice) screen in the Parent Room: 4 variants with the
  judge's score and the actions «выбрать» (choose), «все плохи, переделать»
  (all bad, redo) and «переделать с правкой» (redo with a correction). The
  draft suggests going through the screen with the player on the iPad. The
  agent commits the chosen art to `public/art/`.
- The game works with any set: with no chosen variant it shows the draft, and
  with no draft it shows an SVG placeholder.

## Conclusions

1. Every art request must carry the canon's style block and negative block,
   the floor palette and 2 to 3 reference pictures.
2. Art prompts must not name other games, titles or characters.
3. Each character must have a character sheet with front, side and 3 to 4
   emotions before any other asset of that character is generated.
4. Every asset must be listed in `content/art.yaml` with its id, description,
   size, transparency need and references.
5. Transparent assets must be generated on a chroma key colour outside the
   asset's palette and cut out with sharp.
6. Characters must animate as whole sprites through transformations, with
   emotions as separate pictures, until a person approves part masks.
7. Each dreamcore asset must store a minimum creepiness level, and the game
   must never show an asset above the level the parent set.
8. At creepiness level 0, the game must show the cosy variant of a background.
9. A judge model must score every generated asset from 1 to 10 against the
   checklist, and an asset below 7 must not be used without regeneration.
10. Offline art generation must run as a resumable queue that continues an
    interrupted run from where it stopped.
11. An offline art run must stop at the hard budget `ART_BUDGET_USD`, using the
    cost OpenRouter reports.
12. A person must choose the final variant of each asset in the Parent Room
    from 4 variants with the judge's scores.
13. The game must run with any set of art, falling back from a chosen variant
    to a draft and from a draft to an SVG placeholder.
14. Effects must be made in code as shaders and particles, not as generated
    pictures.
15. Every art request must use the style and negative blocks RES-3400
    resolves, with keyart-heroine as a reference, and keyart-tower and
    keyart-archive may go only as references for the world.
16. The judge must reject any variant with adult presentation, a maid
    uniform, a suggestive pose or an adult body, whatever its score.
17. The MVP must generate no art during play: every picture of an item,
    familiar or familiar stage must be made offline and chosen by a person,
    and live art must wait for AI-made items and creatures.
18. The art tool's model check must read the OpenRouter listing of image
    models, because image-only models such as `bytedance-seed/seedream-4.5`
    are absent from the default listing.
19. The offline art queue must not generate art in volume until the family has shown the player the key-art pictures and the four heroine sheets and recorded her choice, as research decided on 2026-09-27 on the owner's instruction.

## Sources

- The owner's draft «Хроники Башни — спецификация», the opening paragraph and the subsections «Графика» and «Генерация графики без присмотра», with the cost table and table list checked for when live art arrives, read 2026-09-26; not kept in the repository - supports every finding above.
- The owner's design file «design-system/guidelines/20-art.md», read 2026-09-26; not kept in the repository - the new style and negative blocks and the role of the key art.
- The owner's design file «key-art/README.md», read 2026-09-26; not kept in the repository - which key-art picture is the main reference.
- Wikipedia, "Nekopara", https://en.wikipedia.org/wiki/Nekopara, read 2026-09-26 - the style reference's adult and all-ages versions.
- OpenRouter API, `GET https://openrouter.ai/api/v1/models` and `GET https://openrouter.ai/api/v1/models?output_modalities=image`, read 2026-09-26 - the five art models exist, and image-only models appear only in the filtered listing.
- OpenRouter API, `GET https://openrouter.ai/api/v1/models/bytedance-seed/seedream-4.5/endpoints`, read 2026-09-26 - the model's only endpoint is Seed.
