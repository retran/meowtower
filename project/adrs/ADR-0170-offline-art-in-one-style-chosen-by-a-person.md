---
id: ADR-0170
artifact: adr
status: approved
revised: 2026-10-10
addresses: [REQ-1924, REQ-2800, REQ-2802, REQ-2804, REQ-2806, REQ-2808, REQ-2810, REQ-2812, REQ-2814, REQ-2816, REQ-2818, REQ-2820, REQ-2822, REQ-2824, REQ-2826, REQ-2828, REQ-2830, REQ-2832, REQ-2834, REQ-2836, REQ-2838, REQ-2840, REQ-3400, REQ-3402, REQ-3406, REQ-3408, REQ-3410, REQ-3412, REQ-3414, REQ-3416, REQ-3418, REQ-3420, REQ-3422, REQ-1510]
supersedes: []
---

<!-- Reader: the owner and whoever writes the spec, evaluating the decision. They know RES-2800 and RES-3400. -->

# 0170. Game art is generated offline in one style, scored by a judge model, chosen by a person and animated as whole sprites

## Decision

An offline tool, `tools/art-generate.ts`, makes every picture in the game before play, in the one style RES-3400 fixes, and a person chooses each picture before it ships. The game makes no picture during play. It shows a chosen picture, or the best draft, or an SVG placeholder, so it runs with any set of art. Characters move as whole sprites in PixiJS, and emotions are separate pictures.

The tool works from two content files:

- `content/art-style.md` holds the design's `STYLE` block, the `NEGATIVE` block RES-3400 resolves, which the owner approved on 2026-09-27, and the canon's dreamcore blocks. It also holds the suffix "round plush creature, chibi proportions" that every familiar, Tangle and Guardian prompt adds after its description.
- `content/art.yaml` is the asset catalogue. Each entry gives the id, the description as a card, the size, whether it needs a transparent background, and its references. It also gives the fields this record's rules read: the kind (sheet, emotion, pose, stage, background, item), the character, the floor, the minimum creepiness level and the id of the cosy variant.

The tool reads the key art from `design/key-art/` by that path, because CLAUDE.md fixes the design folder's layout. It builds each prompt from catalogue cards through the content request class of ADR-0100's gateway. That class takes card ids and never free text, so no word the player wrote and no name of another work can reach a prompt.

No picture or prompt reuses another work's characters, assets, logos or recognisable silhouettes (REQ-1510). Cards describe only the canon's own characters and things, the negative block lists the likenesses RES-3400 guards against, the judge scores likeness to a known character on every variant, and the person who chooses each picture judges it, as the requirement asks.

### The order of generation

The queue starts with the four heroine sheets and nothing else. Each sheet is a card drawn from keyart-heroine that differs from the other three only in hair colour and style, eye colour and the cardigan's colour. All four keep the catgirl ears and tail, the dress silhouette, and the hooded cable-knit cardigan with knitted ears on the hood and a heart patch on the sleeve. The heroine card shows an empty mint backpack, so no sheet carries keyart-heroine's grey mouse. A catalogue check fails when the four sheet cards differ in any other field.

The queue refuses every other asset until the Parent Room has recorded the style check: the family showed the player the key art and the four sheets, and the parent recorded her choice. The recorded sheet becomes the reference for every later picture of the heroine. keyart-heroine serves only as a prompt reference until then, and the game shows the heroine's placeholder, because keyart-heroine carries the grey mouse REQ-3420 forbids in a heroine picture.

After the style check, each character gets a character sheet first: front, side and 3 to 4 emotions. The queue schedules no other asset of that character until the sheet has at least one variant that passed the judge. Until a person chooses the sheet, dependent assets use the best-scored sheet variant as reference and are marked as drafts; when the person chooses a different variant, one command queues the dependents again. Each emotion the game shows is its own picture, generated from the sheet. A familiar's stage picture takes the chosen picture of its previous stage as reference, and the person who chooses it judges that it is still the same creature. The card for Pugovka fixes her honey colour and the four holes that spill sparks, and every card carries the character's look from the canon, so the judge checks the match against it.

### Making a variant

Each request carries the style block, the negative block, the floor's palette and 2 to 3 references. keyart-heroine or the chosen heroine sheet goes always, the character's sheet where one exists, and keyart-tower or keyart-archive only for world pictures. The role table of ADR-0100 picks the model: `ART_MODEL_CHAR` for sheets, characters and items, `ART_MODEL_KEY` for key scenes and `ART_MODEL_BG` for backgrounds. If Seed refuses `bytedance-seed/seedream-4.5` under the content tier at stage 0, `ART_MODEL_BG` takes `google/gemini-3.1-flash-image`, as ADR-0100 expects of this record.

A transparent asset is generated on a flat key colour outside its palette, magenta `#FF00FF` by default and green for pink and lilac assets. sharp (0.35.4 on npm on 2026-09-27) cuts it out, removes the key colour's spill from the edge pixels and writes WebP with alpha and a preview. A post-process check rejects a variant when any semi-transparent edge pixel stays within a set distance of the key's hue, so no fringe of the key colour ships.

Two programs check every variant before the judge sees it, because a program settles these rules every time. The pure-black check rejects any opaque pixel whose three channels are all at or below 16 out of 255, a value I chose so the warm brown line `#6B4540` and its shading pass. The key-fringe check is the one above.

The judge, `ART_JUDGE_MODEL`, which is `google/gemini-3.8-flash` by RES-2800, scores each variant from 1 to 10 against the checklist of RES-2800. The checklist covers the match to the card, the style against the references, the same character, the count of fingers and eyes, no text or watermark, no likeness to a known character, a flat background and fitness for a child. Six items fail a variant whatever its score: adult presentation, a maid uniform, a suggestive pose, an adult body, any text, and for a heroine picture a grey mouse. A variant below 7 is never offered and never used, and the queue generates a replacement.

### The queue

Every asset is a job in the service table `art_jobs` (RES-2550), with the states waiting, generating, ready to choose, chosen, rejected and error. The queue writes each variant's file, checks and score to the table before it starts the next generation. A run that stops for any reason therefore resumes from the first missing variant, and no finished variant is generated again.

An asset needs 4 passing variants. Each variant slot gets at most 4 generations, the first and 3 regenerations as RES-2800 allows, so an asset costs at most 16. An asset that ends with fewer than 4 passing variants stays out of the choice screen, and its best passing variant becomes its draft. Transient errors retry with exponential backoff; after 3 errors in a row, a value I chose for RES-2800's open N, the job goes to error and the run moves on.

Before each generation, the queue sums the cost OpenRouter reported for this run in `llm_log` and starts nothing new once it reaches the run's budget, `ART_BUDGET_USD`, $40 (REQ-2708, imposed on this decision). ADR-0100's gateway reserves each call's worst-case cost on the offline key, and the owner sets that key's limit to $40 before the run, so a generation in flight can't pass the key's limit either. By my calculation from the OpenRouter listing read on 2026-09-27, a `google/gemini-3.1-flash-image` picture at an assumed 1,290 output tokens costs about $0.08 and a `google/gemini-3-pro-image` picture about $0.16. The MVP's about 40 assets (RES-3000) need 160 passing variants; if a third of generations fail, about 240 generations cost about $20 to $25 before the judge, inside one run.

Before a run starts, the tool's model check reads both OpenRouter listings, the default one and the one filtered by `output_modalities=image`. It reports a configured model missing only when neither lists it, because image-only models such as `bytedance-seed/seedream-4.5` appear only in the filtered listing. It reuses ADR-0100's start-up check.

### The person's choice

The Parent Room's screen "Graphics choice", behind the PIN of ADR-0180, offers each asset that reached ready to choose as its 4 variants, each with its judge score, beside the floor's palette for a floor asset and the chosen previous stage for a familiar stage, with three actions: choose, redo all, and redo with a correction. A correction edits the asset's card in the catalogue, and the queue regenerates from the edited card, so the gateway still receives card ids only. A person chooses every asset that ships; the choice is logged, and the chosen file goes to `public/art/<id>.webp`, which the owner commits with the change that ships it. A familiar joins the MVP roster only when every stage picture it lists has a chosen variant (ADR-0140).

### Showing art in play

The server resolves each asset id to the chosen picture, then the draft, then an SVG placeholder drawn in code from the design tokens. It filters by the creepiness level in force, which ADR-0110 owns: it never sends an asset whose minimum creepiness level is above that level, and at level 0 it sends a background's cosy variant. A catalogue check fails when a dreamcore asset has no minimum level or a dreamcore background has no cosy variant.

PixiJS (8.21.0 on npm on 2026-09-27; ADR-0150 adopts it) animates each character as one sprite: breathing by squash, a bounce, a sway, and a hit with squash and stretch. An emotion swaps the picture, and a blink overlays a picture of eyelids. Nothing moves a part of a picture on its own until a person has approved that character's part masks, which RES-2800 leaves to stage 0.5. Effects such as the Tangles' glitch, the garland and chest flashes are shaders and particles in code.

The cloak colour the player picks, one of six on screen 02 (RES-3500), tints only the cardigan and the bows. Each heroine picture ships with a tint mask made offline by selecting the chosen sheet's cardigan and bow colours, and the person approves the mask with the picture. At runtime a PixiJS colour filter, limited to the mask, moves the masked pixels to the chosen colour and keeps their shading. A heroine picture without an approved mask shows untinted.

Icons and element symbols are the owner's SVG drawings in `design/icons/` and `design/elements/`, not generated art. An SVG check fails when one uses any outline colour other than `#6B4540`, uses black, or isn't 48 by 48.

### What works once this is accepted

On top of ADR-0010 to ADR-0160, the owner can run the art tool, record the style check, choose variants and see chosen pictures in scenes. Every screen still works on placeholders where art is missing. What doesn't work yet: the Parent Room screens themselves wait for ADR-0180, and the stage gates that make the style check a prerequisite of stage 0.3 wait for ADR-0190. Removing this decision leaves the game on placeholders, which is how it runs before stage 0.3 anyway.

## Why

RES-2800 answers how the game gets consistent, child-safe art with no artist: image models with a fixed style block and references, a judge model, and a person who chooses. RES-3400 fixes the style the player asked for and the guards its adult reference needs. The research leaves the mechanics open, and three constraints decide them.

The person is the only guard that isn't a model. The style reference has an adult version (RES-3400, citing the Wikipedia article "Nekopara"), and a judge model shares the generator's blind spots, so the design never ships a picture a person didn't choose (REQ-2828) and never runs art during play, where no person can look (REQ-2836).

The person is also the bottleneck, so nothing may wait on them in real time. The queue runs unattended, the game runs on drafts and placeholders, and a choice made two weeks late changes only which picture shows.

Programs settle what a program can settle. Pure black, key-colour fringes, the sheets' fixed fields, the icon outlines and the creepiness fields are checks that run every time, so the judge and the person spend their attention on style and safety.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: SVG placeholders for the whole MVP | no cost, no model risk and no parent time | the style is what the player asked for (RES-3400), and stage 0.3 ships about 40 assets (RES-3000); placeholders give her none of the world she chose |
| Commission a human illustrator | one consistent hand, safety judged at creation, and part rigs for cutout animation | by my estimate an illustrator's fee for about 40 assets and a year of later content is many times the $40 run budget, and new familiars and stages would wait on someone else's schedule |
| Generate art during play | a new creature or item gets its picture at once | REQ-2836 forbids it in the MVP, nothing AI-made exists to draw until after the MVP, and no person could look before the player does |
| A local image model on the Mac, such as a Stable Diffusion or Flux checkpoint | no per-picture cost, and nothing leaves the house | holding one style across hundreds of pictures needs model tuning the family can't maintain, and the research names the OpenRouter models it checked |
| Cutout or skeletal animation, such as Spine | livelier motion from one picture | automatic cutting of generated pictures is unreliable without a person (RES-2800), and REQ-2810 forbids it before masks are approved |

## What it costs

The parent pays in attention: about 40 assets at 4 variants is about 160 pictures to look at, plus the tint masks, in sittings the parent chooses. If nobody opens the choice screen for a month, the game shows drafts, the judge's best picks, and loses nothing. The only cost is that no person has seen the drafts, and the Parent Room says so on the screen that lists them.

The owner pays in runs: each run takes the offline key's limit set by hand, at most $40, and a re-run after a different sheet choice spends again on the dependent assets. The family pays one sitting for the style check before stage 0.3.

The player pays with stiffer motion. Whole-sprite squash and sway are simpler than a rig, and a character's pose changes only between pictures.

The strongest objection is that the only guard that isn't a model is one parent's attention at choice time, against a style whose reference pulls towards adult presentation. Across 160 pictures, a tired parent approving the judge's top pick can let drift through, because each picture looks fine beside the last. I keep the design because every other guard stands in front of the parent: the negative block, the creature suffix, the six hard-fail items and the programs. The objection is the first reversal condition.

## What would reverse it

- If the parent rejects a judge-passed variant for adult presentation or for looking frightening more than once in 50 choices, the judge is failing as a filter. The design would then add a second, different judge model before the choice.
- If fewer than half the MVP assets reach 4 passing variants within the $40 budget, the style is too hard for the configured models, and the models or the style block would change before stage 0.3.
- If the style check with the player picks none of the four sheets, the style itself is wrong for her now, and RES-3400's choice would go back to the owner.

## Consequences

- ADR-0100 carries the image roles and the offline key; this record adds the fallback of `ART_MODEL_BG` to `google/gemini-3.1-flash-image`.
- ADR-0180's Parent Room gains the style check, the "Graphics choice" screen with the three actions, the tint-mask approval and a line listing drafts no person has seen.
- ADR-0140's roster check reads the chosen state of each familiar's stage pictures.
- ADR-0150 renders sprites, the colour filter and the placeholders in PixiJS and Preact.
- ADR-0190's verify command runs the catalogue, pure-black, fringe and SVG checks.
- Unchosen variants accumulate in `data/art/variants/` and drain automatically 30 days after their asset is chosen, a value I chose. The Parent Room reports once when more than 400 variants wait, which is more than 2 full MVP catalogues; the ceiling stands in the Baselines table of ADR-0190.

The failure states, each with one audience:

| State | What happens next | Audience |
| --- | --- | --- |
| `style_check_missing` | the queue refuses every asset but the four sheets | the owner, who runs the style check |
| `art_references_missing` | the run doesn't start, because `design/key-art/` is absent | the owner |
| `art_model_missing` | the run doesn't start, naming the role and model | the owner |
| `art_budget_reached` | no new generation starts; the report lists what is done, and the next run resumes | the owner |
| `art_job_error` | after 3 errors in a row the job stops and the run moves on | the owner |
| `art_variants_short` | the asset stays off the choice screen and its draft shows | the parent, who can redo with a correction |
| `art_missing` | the game shows the draft or the placeholder; the player sees a picture that looks intended | the parent, through the drafts line |
| `tint_mask_missing` | the heroine shows untinted | the parent, who approves the mask |

The security boundary protects four things, most likely damage first. The player is protected from an unsafe or adult picture by the blocks, the judge's hard fails and the person. The game's originality is protected from a franchise likeness by the negative block and the judge. The player's data stays out of prompts through the gateway's card-only picture builder, and the offline spend stops at the key's $40 limit. The attacker is mostly not a person: it is the model's drift.

Premortem, written as if it happened: the queue ran overnight after the style check and made 38 assets, and the parent chose most of them in one evening on the iPad, beside the player. Two Guardian pictures showed adult proportions in a mild form that the judge scored 8, and they shipped because the parent chose quickly and the player liked them. A week later the owner saw them in a scene and pulled them, and the game fell back to drafts that were no better. The reversal condition on judge misses would have caught the drift earlier if choices had been logged with a reason, so the spec should record the reason for every rejection.

## How I will know it was realised

1. A test runs the queue against a stub gateway, kills it mid-run, restarts it, and finds no variant generated twice and every missing variant made.
2. A test sets the run budget below the stub's reported costs and finds no generation started after the sum reached it.
3. A test asks the queue for a background before a style check is recorded and gets `style_check_missing`; the four heroine sheets still generate.
4. A test asks for a character's emotion before its sheet has a passing variant and finds it not scheduled.
5. Unit tests feed pictures with a pure-black pixel, a magenta fringe and a judge verdict of "maid uniform" at score 9, and each is rejected.
6. The server, given an asset with no chosen variant, sends its draft, and with no draft its placeholder; given creepiness level 0, it sends cosy variants only, and at level 1 no asset with minimum level 2.
7. The model check, given a catalogue whose default listing lacks `bytedance-seed/seedream-4.5` and whose image listing has it, reports nothing missing.
8. A grep of the client code finds no image-generation call and no part-mask animation code.
9. Before stage 0.3 starts, the Parent Room shows a recorded style check, and every picture in the stage 0.3 build has a logged choice by a person.

## What this does not settle

- How the creepiness level is set, lowered for the day and applied to text; ADR-0110 owns it, and this record only filters pictures by it.
- The Parent Room's layout, PIN and navigation; ADR-0180 owns them.
- How design files reach the game's build and how PixiJS and Preact share the screen; ADR-0150 owns them.
- The run budget's value, the offline key and the model roles; ADR-0100 owns them.
- The canon's list of pictures, the five dreamcore locations and each card's wording; the canon and the spec own them.
- Live art, part-mask animation and art for AI-made creatures, which come after the MVP; the live art design in RES-2800 stays for that stage.
- Whether a floor asset uses its floor's palette and whether a stage picture keeps its creature recognisable. The person who chooses judges both, with the palette and the previous stage shown beside the variants, because no program can.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0370, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended on 2026-10-10: this record no longer addresses 1 requirement that was superseded, because a decision cannot realise a requirement that is no longer in force: REQ-3404 (superseded by REQ-6418, which ADR-0360 addresses).
