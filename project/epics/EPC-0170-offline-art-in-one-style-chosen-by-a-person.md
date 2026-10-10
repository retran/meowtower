---
id: EPC-0170
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0170
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Game art is generated offline in one style, scored by a judge model, chosen by a person and animated as whole sprites

Realises exactly ADR-0170: the art tool and its catalogue, the queue and its budget, the program checks and the judge, the style check, the choice screen, the server's resolution of a picture, whole-sprite animation and the tint mask.

Until the epics realising ADR-0100, ADR-0110, ADR-0150 and ADR-0180 exist, the tasks run on stand-ins: a stub gateway for the model calls, a stand-in creepiness level that defaults to 0, a test page for the sprites and the stand-in `/parent` area for the panels. Each task names what it leaves to those epics.

## Acceptance criteria

1. A test runs the queue against a stub gateway, kills it in the middle of a run, restarts it, and finds no variant generated twice and every missing variant made. Evidence: the integration test's report, from TSK-0693.
2. A test sets the run budget below the stub's reported costs and finds no generation started after the sum reached it. Evidence: the integration test's report, from TSK-0694.
3. A test asks the queue for a background before a style check is recorded and gets `style_check_missing`, while the four heroine sheets still generate. Evidence: the integration test's report, from TSK-0699.
4. A test asks for a character's emotion before its sheet has a passing variant and finds it not scheduled. Evidence: the integration test's report, from TSK-0698.
5. Unit tests feed pictures with a pure-black pixel and a magenta fringe, and a judge verdict of "maid uniform" at score 9, and each is rejected. Evidence: the unit tests' reports, from TSK-0695 and TSK-0696.
6. The server, given an asset with no chosen variant, sends its draft, and with no draft its placeholder; given creepiness level 0 it sends cosy variants only, and at level 1 no asset with minimum level 2. Evidence: the integration test's report, from TSK-0702.
7. The model check, given a catalogue whose default listing lacks `bytedance-seed/seedream-4.5` and whose image listing has it, reports nothing missing. Evidence: the unit test's report, from TSK-0694.
8. A search of the client and server code finds no image-generation call and no part-mask animation code. Evidence: the static check's report, from TSK-0705.
9. The Parent Room records a style check and a choice with who made it and when, the ship check names a picture under `public/art/` that has no logged choice, and the parent's judgement closes each picture's look. Evidence: the integration and Playwright tests' reports, from TSK-0699 and TSK-0701, and the parent's judgement recorded in TSK-0701.
10. Every requirement ADR-0170 addresses lands in a closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding for this epic.

The epic can measure two things before it is finished. The first is the share of variants that the program checks and the judge reject in a run against recorded answers, which the queue's report states for each asset against the 16 generations an asset may take. The second is the count of choices a parent redoes with a reason, which TSK-0701 logs. ADR-0170 reverses to a second judge model if more than 1 in 50 judge-passed variants is rejected for adult presentation or fright, and the reasons TSK-0701 records are where that count comes from.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-0692 The art catalogue and the style file exist, and a check fails on a card that breaks a rule
      closes: REQ-2802, REQ-2806, REQ-2814, REQ-3416, REQ-3418, REQ-3420, REQ-3422
      depends: none
- [ ] T-002 TSK-0693 The art queue keeps each variant before the next generation and resumes without repeating one
      closes: REQ-2824
      depends: TSK-0692 (blocking) - the queue lists its jobs from the catalogue.
- [ ] T-003 [P] TSK-0694 An art run starts only with its models and references, and stops at its budget
      closes: REQ-2826, REQ-2838
      depends: TSK-0693 (blocking) - the budget stop and the resume read its job rows.
- [ ] T-004 [P] TSK-0695 A transparent asset is cut from its key colour, and two program checks reject pure black and a key-colour fringe
      closes: REQ-2808, REQ-3402
      depends: TSK-0693 (blocking) - the check results go on the variant's row.
- [ ] T-005 [P] TSK-0696 The judge scores every variant from 1 to 10 and rejects six findings whatever the score
      closes: REQ-2820, REQ-2822, REQ-2834, REQ-3412, REQ-3420, REQ-1510
      depends: TSK-0693 (blocking) - the score goes on the variant's row.; TSK-0695 (blocking) - a variant a program check rejects never reaches the judge.
- [ ] T-006 [P] TSK-0697 Each variant request carries the style, the references and the floor's palette, and takes card ids only
      closes: REQ-2800, REQ-3400, REQ-3408, REQ-3410, REQ-1510
      depends: TSK-0692 (blocking) - the request reads the style file and the catalogue.
- [ ] T-007 TSK-0698 A character's sheet is generated first, and a familiar's stage waits for its previous stage
      closes: REQ-2804, REQ-1924
      depends: TSK-0693 (blocking) - it extends the queue.; TSK-0692 (blocking) - the fields come from the catalogue.; TSK-0697 (blocking) - the references are part of the request.
- [ ] T-008 [P] TSK-0699 The queue makes only the four heroine sheets until the parent records the style check
      closes: REQ-2840
      depends: TSK-0693 (blocking) - the gate extends the queue.; TSK-0701 (not blocking) - the panel and the choice screen share one write of the chosen file.
- [ ] T-009 TSK-0701 A person chooses each picture on the Graphics choice screen, and nothing ships without a logged choice
      closes: REQ-2828, REQ-2830, REQ-2800, REQ-3400, REQ-3408, REQ-3410, REQ-3412, REQ-3416, REQ-3418, REQ-3420, REQ-3422, REQ-1510, REQ-1924
      depends: TSK-0693 (blocking) - it reads and writes the job rows.; TSK-0696 (blocking) - the score and the pass rule come from the judge.
- [ ] T-010 TSK-0700 A character's other pictures follow the sheet a person chose, and a different choice queues them again
      closes: REQ-2804
      depends: TSK-0698 (blocking) - it supplies the sheet-first rule and `sheet_reference`.; TSK-0701 (blocking) - the choice screen is where a sheet is chosen.
- [ ] T-011 [P] TSK-0702 The server sends the chosen picture, else the draft, else a placeholder, and filters by creepiness level
      closes: REQ-2832, REQ-2816, REQ-2818
      depends: TSK-0693 (blocking) - the drafts and the seen mark come from its rows.
- [ ] T-012 TSK-0703 The colours of art, placeholders, shaders and particles can't reach pure black
      closes: REQ-3402
      depends: TSK-0702 (blocking) - criterion 3 reads the placeholders it draws.
- [ ] T-013 TSK-0704 A heroine picture's tint mask is made offline, approved by a person and sent only once approved
      closes: REQ-3406
      depends: TSK-0701 (blocking) - the mask is made from a chosen picture.; TSK-0702 (blocking) - the server holds an unapproved mask back.
- [ ] T-014 TSK-0705 Characters move as whole sprites, emotions swap pictures, and the cloak colour tints only the mask
      closes: REQ-2810, REQ-2812, REQ-2836, REQ-3406, REQ-3402
      depends: TSK-0704 (blocking) - the filter reads the approved mask.; TSK-0702 (blocking) - the client receives pictures by asset id.; TSK-0703 (not blocking) - the token test and the lint cover the shader.
- [ ] T-015 [P] TSK-0706 An SVG check fails an icon or element symbol with a wrong outline, black or a wrong size
      closes: REQ-3414
      depends: none

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0692 and TSK-0706.
- After TSK-0692: TSK-0693 and TSK-0697.
- After TSK-0693: TSK-0694, TSK-0695, TSK-0696, TSK-0699 and TSK-0702.
- After TSK-0693, TSK-0692 and TSK-0697: TSK-0698.
- After TSK-0693 and TSK-0696: TSK-0701.
- After TSK-0698 and TSK-0701: TSK-0700.
- After TSK-0701 and TSK-0702: TSK-0704.
- After TSK-0702: TSK-0703.
- After TSK-0702, TSK-0704: TSK-0705.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0692 | REQ-2802, REQ-2806, REQ-2814, REQ-3416, REQ-3418, REQ-3420, REQ-3422 |
| TSK-0693 | REQ-2824 |
| TSK-0694 | REQ-2826, REQ-2838 |
| TSK-0695 | REQ-2808, REQ-3402 |
| TSK-0696 | REQ-2820, REQ-2822, REQ-2834, REQ-3412, REQ-3420, REQ-1510 |
| TSK-0697 | REQ-2800, REQ-3400, REQ-3408, REQ-3410, REQ-1510 |
| TSK-0698 | REQ-2804, REQ-1924 |
| TSK-0699 | REQ-2840 |
| TSK-0700 | REQ-2804 |
| TSK-0701 | REQ-2828, REQ-2830, REQ-2800, REQ-3400, REQ-3408, REQ-3410, REQ-3412, REQ-3416, REQ-3418, REQ-3420, REQ-3422, REQ-1510, REQ-1924 |
| TSK-0702 | REQ-2832, REQ-2816, REQ-2818 |
| TSK-0703 | REQ-3402 |
| TSK-0704 | REQ-3406 |
| TSK-0705 | REQ-2810, REQ-2812, REQ-2836, REQ-3406, REQ-3402 |
| TSK-0706 | REQ-3414 |

Several requirements land in more than one task on purpose. The program side of a look, such as the creature suffix or the card's phrases, closes in a task of its own, and the person's judgement of the picture closes in TSK-0701, as E17 allows.

The smallest set of tasks that would test the decision is TSK-0692, TSK-0693, TSK-0696, TSK-0699 and TSK-0701. Together they show whether the queue resumes without waste, whether a variant the judge scores high can still be rejected on a hard finding, whether the style check holds back the rest of the queue, and whether a picture ships only after a person chose it and gave a reason, which are the failures the decision's premortem names.

## Not covered

- Part-mask animation, live art and art for AI-made creatures: they come after the MVP, and REQ-2810 and REQ-2836 are met here by shipping no code for them, which TSK-0705's static check keeps true.
- The stage gate that makes the recorded style check a prerequisite of stage 0.3, and the verify command's run of the catalogue, pure-black, fringe, SVG and ship checks: the epic realising ADR-0190 owns the gate and wires each check in.
- The first real art run and the parent's sittings at the choice screen: they need the offline key's limit set to $40 by hand and a person's time, so they happen at stage 0.3, after this epic's tasks are done.
- The creepiness level's setting, the Parent Room's layout and the PixiJS scene column: ADR-0110, ADR-0180 and ADR-0150 own them, and this epic's stand-ins hold until their epics land.
