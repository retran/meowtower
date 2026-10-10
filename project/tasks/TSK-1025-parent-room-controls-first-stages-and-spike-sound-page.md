---
id: TSK-1025
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-0952, REQ-1400, REQ-1402, REQ-2900, REQ-3008, REQ-5080, REQ-6158, REQ-6160, REQ-6162]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Marks can be removed, checks declare their stage, the stage is read from approvals, and the spike has a sound page

After this task, the lessons list and the flagged-task list have remove and exclude controls with routes, each check declares its first stage, verify reads the current stage from the approved review records, and the stage 0 spike carries a page for its three sound rows.

## Acceptance criteria

1. Given a mark on the lessons list and a task on the flagged-task list, when the parent presses the remove control and the exclude control, then `DELETE /api/parent/tags/:tagId` logs `parent_tag_removed` and `POST /api/parent/items/:itemId/exclude` logs `item_excluded` in version 2; from the recompute they trigger, the knowledge projections treat the removed mark as never set, its open recheck windows close, and the full-block split of REQ-0952 no longer applies to it (REQ-0952, REQ-1400, REQ-1402). Closed by: two route tests and a projection test.
2. Given a check that declares stage 0.3 and the project at stage 0.1, when verify runs, then the report lists it as `not_required_yet` by name and a group is required once any of its checks is; given the Dutch word bridge and its checks, then they join at stage 0.3 and verify requires them from there (REQ-2900, REQ-5080). Closed by: verify's report on a fixture project.
3. Given the project record, when verify reads the current stage, then it is the first stage in the order 0, 0.1, 0.15, 0.2, 0.3 whose epic has no approved review record, no file holds it, and two epics without a record never both count as current (REQ-3008). Closed by: a verify test over three fixture records.
4. Given the 0.2 review record, when the family's choice of key art and heroine sheet is entered, then it names the chosen sheet's asset id as an acceptance note, the Parent Room's choice screen records the same choice in `art_jobs`, and the 0.3 epic's `ready` check sees it through the owner's approval (REQ-3008). Closed by: a check that fails on a record with no note.
5. Given the stage 0 spike, when its test page is opened on a new install, then its music switch and effects switch are both off and it plays through the audio path the game will use; and the stage 0 checklist's three sound rows are run on it on a real iPad: a new install plays no sound, the switches work separately, and silent mode silences both (REQ-6158, REQ-6160, REQ-6162). Closed by: a Playwright test of the defaults, and judgement for the three rows, because only a real iPad can flip the silent switch and the test browser's WebKit can't.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the two routes and controls to the Parent Room (`src/server/parent-room.ts`), the stage declaration to each check of verify, the stage reader, and the spike's test page. An event with no route is never written, and a mark the parent removes was set by mistake by her own account. A check on an item built at stage 0.3 is then neither required from 0.1 nor missing without a line. The building agent can't lower the stage because no file holds it, and only the owner's approval of a review moves it. REQ-5080 lets the bridge into the first version, which the owner judges at the stage 0.3 acceptance. The checklist repeats the sound rows at stage 0.3 on the game's own settings.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The Russian wording of the controls, which ADR-0160 and the parent's review own, and the sound registry itself, which ADR-0320 owns.
