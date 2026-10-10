---
id: TSK-0698
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-2804, REQ-1924]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A character's sheet is generated first, and a familiar's stage waits for its previous stage

After this task, the queue schedules no other asset of a character until the character's sheet has a variant that passed the judge, draws each emotion from that sheet, and leaves a familiar's stage waiting until its previous stage is chosen.

## Acceptance criteria

1. Given a character whose sheet job has no passing variant, when the queue schedules, then every other asset of that character stays `waiting` and no generation starts for it; given the sheet gets one passing variant, then they are scheduled (REQ-2804). Closed by: an integration test with the stub.
2. Given an emotion entry of a character, when its request is built, then its references include that character's sheet variant (best-scored or chosen) and the entry is a picture of its own (REQ-2804). Closed by: a unit test.
3. Given a familiar's second stage whose `previousStage` isn't `chosen`, when the queue runs, then the stage stays `waiting`; given the previous stage is chosen, then the stage's request carries the previous stage's chosen picture as a reference (REQ-1924). Closed by: two integration tests.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the scheduling rules to the queue of TSK-0693: a character's sheet precedes every other entry with that `character`, and a stage with a `previousStage` waits for it. The `sheet_reference` column records the sheet variant a dependent was drawn from and whether that variant was chosen, for TSK-0700 to use. A job left `waiting` for either reason isn't an error and doesn't count against the run.

That the stage picture keeps the creature recognisable is the person's judgement at the choice screen, because no program can tell it; TSK-0701 shows the previous stage beside the variants for it.

## Depends on

- TSK-0693 (blocking): the rules extend its queue and job rows.
- TSK-0692 (blocking): `character`, `kind` and `previousStage` come from the catalogue.
- TSK-0697 (blocking): the references are part of the request it builds.

## Evidence

Not yet.

## Left alone

The style check that holds back every asset but the four heroine sheets, which TSK-0699 builds, and what happens to dependents when the sheet is chosen, which TSK-0700 builds.
