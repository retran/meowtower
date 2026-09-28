---
id: SPC-0170
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-1510, REQ-2800, REQ-2802, REQ-2804, REQ-2806, REQ-2808, REQ-2810, REQ-2812, REQ-2814, REQ-2816, REQ-2818, REQ-2820, REQ-2822, REQ-2824, REQ-2826, REQ-2828, REQ-2830, REQ-2832, REQ-2834, REQ-2836, REQ-2838, REQ-2840, REQ-3400, REQ-3402, REQ-6418, REQ-3406, REQ-3408, REQ-3410, REQ-3412, REQ-3414, REQ-3416, REQ-3418, REQ-3420, REQ-3422]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The offline art pipeline: generation in one style, the judge's score, a person's choice and whole-sprite animation

## Scope

This document covers how every picture in the game is made, checked, chosen and shown. It covers the art tool `tools/art-generate.ts` and its queue, the style and catalogue files it reads, the program checks and the judge that score each variant, the choice a person makes in the Parent Room, how the server picks the picture to send, and how the client animates characters and tints the heroine's cardigan. It is written at the level of files, commands, table rows, states and checks. A reader who needs a screen's layout reads the interface decision, ADR-0150.

It leaves out what other decisions define. The gateway, its request classes, the model roles, the offline key and the art run's budget belong to ADR-0100. The creepiness level in force, how the parent sets it and how it applies to text belong to ADR-0110. The Parent Room's layout, PIN and navigation belong to ADR-0180, the MVP familiar roster to ADR-0140, and the verify command, the stages and the Baselines table to ADR-0190. The canon's list of pictures and each card's wording belong to the canon. Live art, art for AI-made creatures and part-mask animation come after the MVP and are not part of the system.

## Boundary

### Files

| Path | What it holds |
| --- | --- |
| `tools/art-generate.ts` | The art tool: the model check, the queue, the program checks, the judge call and the requeue command. It runs in the `tools` container of ADR-0190. |
| `content/art-style.md` | The `STYLE` block, the `NEGATIVE` block the owner approved on 2026-09-27, the canon's dreamcore blocks, and the creature suffix "round plush creature, chibi proportions". |
| `content/art.yaml` | The asset catalogue, one entry per asset, with the fields below. |
| `design/key-art/` | The key art the tool sends as references: keyart-heroine, keyart-tower and keyart-archive. The tool reads it by this path. |
| `data/art/variants/` | Every generated variant with its preview, until it drains. |
| `public/art/<id>.webp` | The chosen picture of each asset, which the owner commits with the change that ships it. |
| `data/art/masks/<id>.mask.webp` | The candidate tint mask of a heroine picture, which `tools/art-generate.ts mask <id>` makes from the chosen picture, until a person approves it. |
| `public/art/<id>.mask.webp` | The approved tint mask of a heroine picture, copied here on approval and committed with the picture. |
| `design/icons/`, `design/elements/` | The owner's SVG icons and element symbols, 48 by 48. |

### The catalogue entry

Every asset has an entry in `content/art.yaml` (REQ-2806). The entry gives:

- `id`, the asset's identifier;
- `card`, the description as a card of the canon's own characters and things;
- `size`, in pixels;
- `transparent`, whether the asset needs a transparent background;
- `references`, the 1 to 3 reference pictures;
- `kind`, one of `sheet`, `emotion`, `overlay`, `pose`, `stage`, `background` and `item`;
- `character`, for an asset of a character;
- `floor`, for an asset that belongs to a floor;
- `minCreepiness`, for a dreamcore asset;
- `cosyVariant`, the id of the «уютный» (cosy) variant, for a dreamcore background;
- `previousStage`, for a familiar's stage after the first.

### The service table `art_jobs`

Every asset is one job in the service table `art_jobs`, which no projection reads or rebuilds (SPC-0020). A job's row holds its state, its run, each slot's count of generations, each variant's file, check results, judge score and verdict, the chosen variant, the key colour each transparent variant used, whether a person has seen the job's draft, `sheet_reference` (the id of the sheet variant a character's asset was drawn from, and whether that variant was chosen), for a heroine picture the tint mask's approval with who approved it and when, and each person's action with its time and reason. A job is in one of six states:

| State | Meaning |
| --- | --- |
| `waiting` | The job is queued and has no generation in flight. |
| `generating` | The queue is making the job's variants. |
| `ready_to_choose` | The job has 4 passing variants and shows on the choice screen. |
| `chosen` | A person has chosen one variant. |
| `rejected` | The job used every generation and has fewer than 4 passing variants. |
| `error` | The job failed 3 times in a row on errors. |

A job's draft is its best-scored passing variant while it has no chosen variant, whatever its state.

### The service table `art_style_check`

The style check is one row in the service table `art_style_check`: the chosen heroine sheet's job id and variant, who recorded it and when. The queue reads this table before it schedules any asset other than the four heroine sheets.

### Model roles the tool calls

The tool calls every model through ADR-0100's gateway on the offline key and the content tier: `ART_MODEL_CHAR` for sheets, characters and items, `ART_MODEL_KEY` for key scenes, `ART_MODEL_BG` for backgrounds, and `ART_JUDGE_MODEL` for the judge, which is `google/gemini-3.8-flash`. A prompt is built only through the gateway's `ContentRequest` class from catalogue card ids.

### Failure states

| State | What happens next | Audience |
| --- | --- | --- |
| `style_check_missing` | the queue refuses every asset but the four heroine sheets | the owner, who runs the style check |
| `art_references_missing` | the run doesn't start, because `design/key-art/` is absent | the owner |
| `art_model_missing` | the run doesn't start, and the message names the role and the model | the owner |
| `art_budget_reached` | no new generation starts; the report lists what is done, and the next run resumes | the owner |
| `art_job_error` | after 3 errors in a row the job goes to `error` and the run moves on | the owner |
| `offline_key_refused` | OpenRouter answers 402 on the offline key; no new generation starts, the report lists what is done, and the next run resumes | the owner |
| `art_variants_short` | the asset stays off the choice screen, its draft shows, and it is listed under the choice screen's rejected list | the parent, who can redo it from that list |
| `art_missing` | the game shows the draft or the placeholder | the parent, through the drafts line |
| `tint_mask_missing` | the heroine shows untinted | the parent, who approves the mask |

### What this part requires from other parts

- ADR-0100 supplies the gateway, the `ContentRequest` class, the image roles, the offline key, `llm_log` with each call's reported cost, the art run's budget of $40 in `ART_BUDGET_USD`, and the start-up model check this tool reuses.
- ADR-0110 supplies the creepiness level in force.
- ADR-0180 supplies the Parent Room, its PIN and the panels where the style check, the choice screen, the tint-mask approval and the drafts line sit.
- ADR-0150 supplies PixiJS 8.21.0 and Preact, the design tokens the placeholders are drawn from, and the scene column the sprites render in.
- ADR-0190 runs this part's catalogue, pure-black, fringe, SVG, colour-token and colour-literal checks in its verify command and holds this part's ceilings in its Baselines table.
- ADR-0140 reads each familiar's stage pictures' `chosen` state to decide the MVP roster.

The permitted dependencies run one way. `tools/art-generate.ts` reaches a model only through ADR-0100's gateway and reads the design folder only under `design/key-art/`. The server reads `content/art.yaml`, `public/art/`, drafts in `data/art/variants/` and `art_jobs`, and never imports the art tool. The client imports no image-generation code and no gateway code; it receives pictures by asset id from the server.

## Behaviour

### One style, no picture during play

The tool makes every picture before play, and the game makes none during play: the server and the client hold no image-generation call (REQ-2836). Every picture follows one style, soft pastel patisserie anime in the manner of a visual novel with a thin warm brown line, because every request carries the `STYLE` block, the `NEGATIVE` block and the style references (REQ-3400). The person who chooses each picture judges the style (REQ-3400).

No picture or prompt reuses another work's characters, assets, logos or recognisable silhouettes (REQ-1510). Cards describe only the canon's own characters and things, the gateway takes card ids and never free text, the `NEGATIVE` block lists the likenesses to avoid, the judge scores likeness to a known character on every variant, and the person who chooses judges it (REQ-1510).

Every character is drawn with child proportions and covered clothes: shoulders covered, hems at the knee or longer, no maid costume and no suggestive pose (REQ-3408). The `NEGATIVE` block and each character's card carry these rules, the judge fails a variant that breaks them, and the person judges (REQ-3408). Every familiar, Tangle and Guardian prompt adds the creature suffix after its description, so the creature is drawn round and plush with a silhouette that reads at first glance (REQ-3410).

### The order of generation

The queue starts with the four heroine sheets and generates nothing else until the style check is recorded (REQ-2840). The style check is recorded in the Parent Room when the family has shown the player the key-art pictures and the four heroine sheets and the parent has recorded her choice. The style-check panel shows each heroine sheet job's variants, and the parent records one variant of one job. Recording it sets that job to `chosen`, writes the variant to `public/art/<id>.webp` and writes the `art_style_check` row. The other three sheet jobs stay unchosen, serve no picture and are never offered on the choice screen. Until then the queue refuses every other asset with `style_check_missing` (REQ-2840).

Each heroine sheet is a card drawn from keyart-heroine. The four sheet cards differ only in hair colour and style, eye colour and the cardigan's colour, and all four keep the catgirl ears and tail, the cardigan and the dress silhouette (REQ-3422). A catalogue check fails when two sheet cards differ in any other field (REQ-3422).

Every heroine card draws «Плащ охотницы» (the huntress's cloak) as her hooded cable-knit cardigan, with knitted ears on the hood and a heart patch on the sleeve, and never as a second garment over it (REQ-3416). Every heroine card shows an empty mint backpack, so no picture of the heroine shows a grey mouse in it (REQ-3420).

After the style check, the recorded sheet is the reference for every later picture of the heroine, and every picture of her shows her as a catgirl matching the sheet the family chose (REQ-6418). Before the style check, keyart-heroine is only a prompt reference for the four sheets, and the game shows the heroine's placeholder and no picture of her (REQ-6418).

Each character gets a character sheet first, showing the character from the front and the side and with 3 to 4 emotions (REQ-2802). The queue schedules no other asset of a character until that character's sheet has at least one variant that passed the judge (REQ-2804). Until a person chooses the sheet, the character's other assets use the best-scored sheet variant as reference, their jobs record it in `sheet_reference` as unchosen, and they serve only as drafts: the choice screen doesn't offer a job whose sheet is unchosen. When the person chooses the best-scored variant, the dependents' `sheet_reference` becomes chosen and they are offered. When the person chooses a different variant, the requeue command sets every dependent job back to `waiting` with fresh slots, and its old variants serve as drafts until new ones pass.

Each emotion the game shows is its own picture of kind `emotion`, generated from the sheet (REQ-2812). A familiar's stage picture takes the chosen picture of its previous stage as a reference, and the queue leaves a stage `waiting` until its `previousStage` is `chosen`. The card for «Пуговка» (Little Button) draws her honey-coloured with four holes that spill sparks (REQ-3418), and every card carries the character's look from the canon, so the judge checks the match against it.

### Making a variant

Each request carries the `STYLE` block, the `NEGATIVE` block, the floor's palette for an asset with a `floor`, and 1 to 3 references. The floor's palette serves REQ-2800. keyart-heroine before the style check, or the chosen heroine sheet after it, goes with every request, the character's sheet where one exists, and keyart-tower or keyart-archive only with a world picture. A heroine sheet and an item with no character carry keyart-heroine or the chosen heroine sheet alone (REQ-2806). `ART_MODEL_BG` falls back to `google/gemini-3.1-flash-image` when Seed refuses `bytedance-seed/seedream-4.5` under the content tier.

A transparent asset is generated on a flat key colour outside its palette: magenta `#FF00FF`, or green `#00FF00` for a pink or lilac asset. sharp 0.35.4 cuts it out, removes the key colour's spill from the edge pixels, and writes WebP with alpha and a preview (REQ-2808).

### The program checks and the judge

Two program checks run on every variant before the judge sees it, and each rejects the variant on its own:

- The pure-black check rejects a variant with any opaque pixel whose three channels are all at or below 16 out of 255, in lines or in fills (REQ-3402). The warm brown line `#6B4540` and its shading pass it.
- The fringe check rejects a transparent variant with any semi-transparent edge pixel, or any opaque pixel, whose hue lies within 20 degrees of the key colour's hue, so no trace of the key colour ships (REQ-2808).

A variant a program check rejects gets the score 1 with the failed check named, and the judge never sees it (REQ-2820). The judge scores every variant that passes both from 1 to 10 against the art checklist, so every variant has a score from 1 to 10 (REQ-2820). The checklist covers the match to the card, the style against the references, the same character as the sheet, the count of fingers and eyes, no text or watermark, no likeness to a known character, a flat background, and fitness for a child.

Six judge findings reject a variant whatever its score: adult presentation, a maid uniform, a suggestive pose, an adult body, any text in any language, and a grey mouse in a heroine picture (REQ-2834, REQ-3412, REQ-3420). A variant scored below 7 is never offered and never used, and the queue generates a replacement in its slot (REQ-2822). A variant passes when both program checks pass, no hard-fail finding is present and the score is 7 or more.

Outside a checked variant or icon, a pixel of art reaches the screen only through the placeholders, the shaders, the particle effects and the tint, and each of them keeps pure black off the screen (REQ-3402). A token test fails any colour token of the art, the placeholders, the shaders and the particle effects whose three channels are all at or below 16 out of 255. A lint fails a colour literal in the placeholder, shader and particle code, which takes its colours only from those tokens. The tint shader raises each channel of a tinted pixel to at least 17.

### The queue

An asset needs 4 passing variants. Each of the 4 variant slots gets at most 4 generations, the first and 3 regenerations, so an asset costs at most 16 generations. A job with 4 passing variants moves to `ready_to_choose`. A job that uses its generations with fewer than 4 passing variants moves to `rejected` with `art_variants_short`, stays off the list of jobs to choose from, and shows its draft.

The queue writes each variant's file, check results and score to `art_jobs` before it starts the next generation. When a run is interrupted for any reason, the next run resumes from the first missing variant and generates no finished variant again (REQ-2824).

A transient error retries with exponential backoff. After 3 errors in a row on one job, the job moves to `error` with `art_job_error` and the run moves on to the next job. The next run sets each `error` job back to `waiting` with its slots' counts kept and its error count at 0.

Before each generation, the queue sums the cost the provider reported in `llm_log` for this run and starts no new generation once the sum reaches `ART_BUDGET_USD` (REQ-2826). The run then reports `art_budget_reached` with what is done. This sum alone enforces `ART_BUDGET_USD`, so the generations in flight when the sum reaches it can pass it by their reserved cost. The offline key's limit and each call's reservation belong to ADR-0100, and the sandbox spends from the same key. When OpenRouter answers 402 on the offline key, the queue counts no error against the job, starts no new generation and reports `offline_key_refused` with what is done, and the next run resumes from the first missing variant.

### The model check

Before a run starts, the model check reads both provider listings, the default one and the one filtered by `output_modalities=image`. The check reports a configured image model as missing only when neither listing holds it (REQ-2838), and the run then refuses to start with `art_model_missing`.

### The person's choice

The Parent Room's "Graphics choice" screen, behind the PIN, offers each job in `ready_to_choose` whose sheet, where it has one, is chosen, as its 4 variants, each shown with its judge score (REQ-2830). Below them it lists each job in `rejected` with its draft and the two redo actions. A floor asset shows the floor's palette beside the variants, so the person judges the palette (REQ-2800). A familiar's stage shows the chosen previous stage beside them.

The screen has three actions: choose, redo all, and redo with a correction. A choice sets the job to `chosen`, writes the variant to `public/art/<id>.webp` and records who chose it and when in `art_jobs`. Both redo actions record the person's reason in `art_jobs` and set the job back to `waiting` with each of its 4 slots at 0 generations; its old variants serve as its draft until new ones pass. A correction edits the asset's card in the catalogue, and the queue regenerates from the edited card. An asset ships when its picture is committed under `public/art/`, and only a choice writes there, so no asset ships until a person has chosen its final variant (REQ-2828). The person who chooses judges the palette, the style, the likeness to other works and the heroine's match to her sheet (REQ-2800, REQ-3400, REQ-1510, REQ-6418).

### Showing art in play

The server resolves each asset id to its chosen picture, then its draft, then an SVG placeholder drawn in code from the design tokens, so the game runs with any set of art (REQ-2832). The Parent Room's drafts line lists every asset the server resolves to a draft or a placeholder whose job has not been marked seen; opening an asset on that line or on the choice screen marks it seen in `art_jobs`, and a new draft clears the mark.

Every dreamcore asset carries `minCreepiness` (REQ-2814). The server never sends an asset whose `minCreepiness` is above the creepiness level in force (REQ-2816). At level 0 it sends the `cosyVariant` of every background that has a dreamcore variant (REQ-2818). A catalogue check fails when a dreamcore asset has no `minCreepiness` or a dreamcore background has no `cosyVariant`.

### Animation

PixiJS animates each character as one sprite: breathing by squash, a bounce, a sway, and a hit with squash and stretch. An emotion swaps the picture for the emotion's own picture (REQ-2812), and a blink overlays a picture of eyelids of kind `overlay`, generated from the character's sheet. Nothing moves a separate part of a character's picture, because no character has approved part masks (REQ-2810). Effects such as the Tangles' glitch, the garland and the chest flashes are shaders and particles in code.

### The cloak colour

The cloak colour the player picks tints only the heroine's cardigan and bows (REQ-3406). Each heroine picture ships with a tint mask. `tools/art-generate.ts mask <id>` makes a candidate in `data/art/masks/` by selecting the chosen sheet's cardigan and bow colours; the Parent Room's tint-mask panel shows it over the picture, and the person's approval copies it to `public/art/<id>.mask.webp` and records who approved it and when in `art_jobs`. The server sends a mask only once it is approved. At runtime a PixiJS colour filter limited to the mask moves the masked pixels to the chosen colour, keeps their shading and raises each channel to at least 17 (REQ-3402). A heroine picture with no approved mask shows untinted with `tint_mask_missing`.

### Icons and element symbols

Icons and element symbols are the owner's SVG drawings in `design/icons/` and `design/elements/`, flat, with a warm brown outline, pastel fills and a white highlight, and the tool generates none (REQ-3414). An SVG check fails when a file uses an outline colour other than `#6B4540`, uses black, or isn't 48 by 48 (REQ-3414, REQ-3402).

### Storage

Unchosen variants stay in `data/art/variants/` and drain 30 days after their asset is chosen. The Parent Room shows one notice when more than 400 variants wait.

## Failure paths

- `design/key-art/` is absent: the run doesn't start, reports `art_references_missing`, and changes no job.
- A configured image model is in neither listing: the run doesn't start and reports `art_model_missing` with the role and the model (REQ-2838).
- An asset other than the four heroine sheets is asked for before the style check: the queue refuses it with `style_check_missing` and still generates the sheets (REQ-2840).
- A character's asset is asked for before the character's sheet has a passing variant: the queue leaves it `waiting` and schedules it after the sheet passes (REQ-2804).
- A variant has a pure-black pixel or a key-colour fringe: the variant gets the score 1 with the failed check named, the judge doesn't see it, it is never offered, and its slot regenerates while generations remain (REQ-3402, REQ-2808, REQ-2820, REQ-2822).
- A variant has a hard-fail finding or a score below 7: the variant is rejected, never offered, and its slot regenerates while generations remain (REQ-2834, REQ-2822).
- A job uses its 16 generations with fewer than 4 passing variants: it moves to `rejected` with `art_variants_short`, and its best passing variant shows as its draft; with none, the placeholder shows (REQ-2832).
- A job errs 3 times in a row: it moves to `error` with `art_job_error`, the run continues with the next job, and the next run sets it back to `waiting`.
- A familiar's stage is asked for before its previous stage is chosen: the queue leaves it `waiting`.
- The run's reported spend reaches `ART_BUDGET_USD`: no new generation starts, the run reports `art_budget_reached`, and the next run resumes from the first missing variant (REQ-2826, REQ-2824).
- OpenRouter answers 402 on the offline key: the job's error count doesn't change, no new generation starts, the run reports `offline_key_refused`, and the next run resumes from the first missing variant (REQ-2824).
- The run is killed mid-generation: the unfinished variant has no row, so the next run generates it and no finished one (REQ-2824).
- The person chooses a sheet variant other than the best-scored one: the requeue command sets the character's dependent jobs to `waiting` with fresh slots, and their old variants stay as drafts until new ones pass (REQ-2804). No dependent can be `chosen` at that moment, because the choice screen offers none before its sheet is chosen.
- An asset has no chosen variant: the server sends its draft, or its placeholder where no draft exists, with `art_missing` (REQ-2832).
- A dreamcore asset's `minCreepiness` is above the level in force: the server doesn't send it, and a background sends its `cosyVariant` at level 0 (REQ-2816, REQ-2818).
- A heroine picture has no approved tint mask: it shows untinted with `tint_mask_missing` (REQ-3406).
- A catalogue entry lacks a required field, a sheet card differs from the others outside the four free fields, or a dreamcore asset lacks its creepiness fields: the catalogue check fails the verify command (REQ-2806, REQ-3422, REQ-2814).
- An SVG icon breaks the outline, black or size rule: the SVG check fails the verify command (REQ-3414).
- A colour token of the art, the placeholders, the shaders or the particle effects has all three channels at or below 16, or the placeholder, shader or particle code holds a colour literal: the token test or the lint fails the verify command (REQ-3402).

## Choices this document makes

- The six job states take the code names `waiting`, `generating`, `ready_to_choose`, `chosen`, `rejected` and `error`, and a job with fewer than 4 passing variants after its generations is `rejected`, because ADR-0170 names the states in words and gives the short job no state of its own.
- Both redo actions record the person's reason in `art_jobs`, because ADR-0170's premortem asks for the reason for every rejection.
- The catalogue fields take the names above, and `previousStage` is added for a familiar's stage, because ADR-0170 shows the previous stage beside a stage's variants and the catalogue needs to name it.
- The blink's eyelid picture is a catalogue `kind` of its own, `overlay`, because ADR-0170 names the picture and gives it no kind.
- A draft is the best-scored passing variant of any job without a choice, because ADR-0170 resolves to "the draft" for every unchosen asset and defines it only for a short job.
- The dependents of an unchosen sheet stay off the choice screen and record their reference sheet in `sheet_reference`, because ADR-0170 marks them as drafts without saying where, and holding them off means the requeue never meets a chosen dependent.
- A rejected job is listed on the choice screen with the two redo actions, and a redo restarts each of the 4 slots at 0 generations, because ADR-0170 lets the parent redo a short job and gives it no other place or count.
- The style check is a row in `art_style_check` that also chooses its sheet job, and a tint mask is made by `tools/art-generate.ts mask` into `data/art/masks/` and approved into `public/art/<id>.mask.webp`, because ADR-0170 names both records and gives neither a home.
- The fringe check's hue distance is 20 degrees, because ADR-0170 says "a set distance" and gives no value.
- An `error` job returns to `waiting` at the next run, a familiar's stage waits for its chosen previous stage, a draft carries a seen mark, and an opaque pixel near the key hue fails the fringe check, because ADR-0170 leaves each case without a rule.
- A 402 on the offline key stops new generations and counts as no job error, because ADR-0210 says only that the run reports `offline_key_refused`, and the refusal comes from the key, not the job.

## Open review findings

- Round 1 asked to give the reasons for the model check reading both listings and for the one-way dependencies, and the reason keyart-heroine isn't shown before the style check. Rejected: a spec states what the system does and never why (S8), and ADR-0170 holds these reasons.
- Round 1 asked to say where the values 3 errors, 30 days and 400 variants come from. Rejected for the same rule (S8): ADR-0170 marks them as chosen values.
- Round 2, finding 13: the header comment asks each rule to carry its reason. Rejected: the comment is the writing standard's header, and a spec states no reasons (S8).
