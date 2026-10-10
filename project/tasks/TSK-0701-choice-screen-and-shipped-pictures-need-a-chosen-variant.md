---
id: TSK-0701
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-2828, REQ-2830, REQ-2800, REQ-3400, REQ-3408, REQ-3410, REQ-3412, REQ-3416, REQ-3418, REQ-3420, REQ-3422, REQ-1510, REQ-1924]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A person chooses each picture on the Graphics choice screen, and nothing ships without a logged choice

After this task, the Parent Room's "Graphics choice" screen offers each asset that is ready as 4 variants with their judge scores, lets the parent choose, redo all or redo with a correction and record a reason, writes only a chosen variant to `public/art/<id>.webp`, and a check fails for any picture there that has no logged choice.

## Acceptance criteria

1. Given a job that is `ready_to_choose` and whose sheet, where it has one, is chosen, when the parent opens the screen behind the PIN, then it shows the 4 variants each with its judge score (REQ-2830); a floor asset shows the floor's palette beside them, a familiar's stage shows the chosen previous stage beside them, and a `rejected` job is listed under them with its draft and the two redo actions. Closed by: a Playwright test.
2. Given the parent chooses a variant, when the action ends, then the job is `chosen`, the variant is written to `public/art/<id>.webp` and `art_jobs` records who chose it and when; given redo all or redo with a correction, then the person's reason is required and recorded, the job is `waiting` with each slot at 0 generations, its old variants serve as its draft, and a correction has edited the asset's card in the catalogue (REQ-2828). Closed by: an integration test and a Playwright test.
3. Given a file under `public/art/` whose id has no `chosen` row with that file's hash, when `tools/art-generate.ts ship-check` runs, then it exits non-zero and names the id (REQ-2828). Closed by: an integration test with one chosen and one unchosen file.
4. Given variants of a character, a familiar and a creature, when the parent chooses among them, then the parent judges that the picture follows the one style, shows child proportions and covered clothes, is round and plush where it is a creature, holds no text in any language and reuses no other work's characters, assets, logos or silhouettes (REQ-3400, REQ-3408, REQ-3410, REQ-3412, REQ-1510). Closed by: the parent's judgement at the screen, because no program can tell whether a picture reads as the style the player asked for or whether a silhouette recalls another work.
5. Given variants of the heroine's sheets, of «Пуговка», of a floor's asset and of a familiar's later stage, when the parent chooses among them, then the parent judges that the cardigan is hooded and cable-knit with knitted ears and a heart patch and not a second garment, that no grey mouse is in the backpack, that the four sheets differ only in hair, eyes and cardigan colour, that «Пуговка» is honey-coloured with four holes that spill sparks, that a floor asset uses its palette, and that a stage is still the same creature as the one before (REQ-3416, REQ-3420, REQ-3422, REQ-3418, REQ-2800, REQ-1924). Closed by: the parent's judgement at the screen, because each is a likeness or a palette fit that a program can't decide.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the screen, its routes under `/api/parent`, the three actions and the ship check. A person chooses every asset that ships, and only a choice writes under `public/art/`, which the owner commits with the change that ships it. A redo action records the reason in `art_jobs`, because ADR-0170's premortem asks for the reason of every rejection: a parent who rejects judge-passed variants for adult presentation more than once in 50 choices is the signal that the judge fails, and the log is where that count comes from.

A job whose sheet is unchosen isn't offered, as TSK-0700 states. A familiar joins the MVP roster only when every stage picture it lists is chosen, which ADR-0140's epic reads from the `chosen` state this task writes.

The screen's tab placement and the Parent Room's layout belong to the epic realising ADR-0180; until it exists the screen is a page under the stand-in `/parent` area.

## Depends on

- TSK-0693 (blocking): the screen reads and writes job rows.
- TSK-0696 (blocking): the score it shows and the pass rule that makes a job ready come from the judge.

## Evidence

Not yet.

Criteria 4 and 5 rest on the parent's judgement, because REQ-3400, REQ-3408, REQ-3410, REQ-3412, REQ-1510, REQ-3416, REQ-3418, REQ-3420, REQ-3422, REQ-2800 and REQ-1924 ask whether a picture looks right, and the judge model shares the generator's blind spots.

## Left alone

The tint-mask approval, which TSK-0704 builds, the drafts line, which TSK-0702 builds, and the stage gate that requires a choice before stage 0.3, which the epic realising ADR-0190 owns. The verify command's run of `ship-check`, which that epic wires in.
