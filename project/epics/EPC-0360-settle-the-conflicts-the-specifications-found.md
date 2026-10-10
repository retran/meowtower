---
id: EPC-0360
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0360
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each conflict the specifications found settles for the approved requirement and a fair measurement

Realises exactly ADR-0360: the code and tests that make each of the 95 settled entries true in the parts the entries change, grouped by the area they touch, and the replacement requirements REQ-6400 to REQ-6438 that carry the rules where an approved text couldn't hold.

Most parts the entries change belong to the epics realising ADR-0010 to ADR-0330, which are written at the same time. Each task states its change as a rule and tests it on fixtures until the real part exists, and names what it leaves to the other epic. The story area, entries 81 to 89, is built by the epic realising ADR-0330 to SPC-0330, which already states the amended rules; TSK-1009 proves them and builds none of them.

## Acceptance criteria

1. A route test finds `POST /api/stage0/write` answering 404 from stage 0.1 on, `POST /api/session/:id/save` logging `save_accepted` and `POST /api/item/:itemId/plan` logging `plan_submitted`. Evidence: the route tests of TSK-0996, TSK-1001 and TSK-1008.
2. A schema test finds no `planChoice` in `attempt_submitted`, and a replay of version 1 attempts finds `hintMaxLevel` 3 on every one. Evidence: the schema and replay tests of TSK-0998.
3. A packet test over 1,000 seeds per tier finds the same `HintOut` field shapes, and no given's value in any rung, on unanswerable and solvable word problems. Evidence: the packet test of TSK-0998.
4. A 90-day simulation finds all 8 domains in every 3 consecutive adventure days of 3 completed floors, no completed adventure below 25 graded first attempts, raised mode's in-corridor review count at or above the ordinary count after every slot and above it in total, and every stretch block complete within 3 adventure days of its probe's day. Evidence: the simulation tests of TSK-0999 and TSK-1000.
5. Time-projection tests find the soft stop on a puzzle at the puzzle's first boundary after the soft-stop point, `open` accepted after `finish_today` and after a put-away, and the soft stop again at the first boundary of a puzzle opened after it. Evidence: the time-projection tests of TSK-1001.
6. A setup test finds the local judge's process owned by a standard account, and a network test finds the stack stopped within 70 seconds of a changed gateway. Evidence: the setup and network tests of TSK-0996.
7. A grouping replay finds every drawn set in the log after an offline session, and a `grouping_submitted` with `none` before every attempt on which she drew nothing. Evidence: the replay tests of TSK-1007.
8. A Volley test finds 8 to 10 facts in every Volley of a simulated first week, and a content check finds the fact's placeholder in every miss reply. Evidence: the Volley test and content check of TSK-1005.
9. Every requirement ADR-0360 addresses lands in exactly one task of this epic or sits under Not covered with its reason. Evidence: `paw check coverage` with no finding.

Two of the decision's own checks belong to other records and sit under Not covered: its first, which the specification step closes, and its tenth, which is the owner's reading.

The epic can measure two things before it is finished. The network watch's stops on the home network over a week, which TSK-0996's host job counts and the decision's second reversal condition reads at more than one. The rate at which she opens the hint ladder on T1 to T4 word problems against arithmetic tasks she answers wrong, which TSK-0998 changes the rungs for and the first reversal condition reads at less than half.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0996 The host stops the stack when its gateway changes, the stage 0 write routes are gone and the local judge runs as an unprivileged account
      closes: REQ-2510, REQ-2512, REQ-1644
      depends: none
- [ ] T-002 [P] TSK-0997 A bake-off runs play roles through the play route on the offline key and stops at its budget, and an offline run starts with no more limit left than its budget
      closes: REQ-1654, REQ-2710, REQ-6412
      depends: none
- [ ] T-003 [P] TSK-0998 A hint rung gives one real step and names quantities on every word problem, and each estimate and plan choice has one record
      closes: REQ-5066, REQ-5068, REQ-5072, REQ-5156, REQ-5414, REQ-5106, REQ-5112, REQ-6408, REQ-6410
      depends: none
- [ ] T-004 [P] TSK-0999 The Director visits every domain in 3 days, takes a host floor first when the Sources window falls due and never trims an adventure below 25 graded attempts
      closes: REQ-0800, REQ-0806, REQ-0814, REQ-0830, REQ-1024, REQ-1040, REQ-1050, REQ-5914, REQ-6400
      depends: none
- [ ] T-005 [P] TSK-1000 Raised mode gives review at least the ordinary share, rapid guesses skip interrupted attempts, and one stretch block at a time completes within 3 adventure days
      closes: REQ-1004, REQ-1006, REQ-1008, REQ-1010, REQ-1124, REQ-1130, REQ-6402, REQ-6404, REQ-6406
      depends: TSK-0999 (not blocking) - both change the planner; either can land first.
- [ ] T-006 [P] TSK-1001 The soft stop plays at a puzzle's first boundary, a put-away closes that one puzzle, and the save route ends the day through a story scene
      closes: REQ-0320, REQ-0340, REQ-0362, REQ-0364, REQ-2444, REQ-5004, REQ-5012, REQ-5016, REQ-5728, REQ-5730, REQ-5731
      depends: none
- [ ] T-007 [P] TSK-1002 The rest stop is offered after three «Не знаю» and on fatigue, ends at her tap, and an eye exercise ends by her hand unless the parent switched skipping on
      closes: REQ-0314, REQ-0316, REQ-0342, REQ-0344, REQ-0346, REQ-0350, REQ-1106, REQ-6430, REQ-6432
      depends: TSK-1001 (not blocking) - both change the day's timed events; either can land first.
- [ ] T-008 [P] TSK-1003 A clean row closes with a `crit` badge and its thread waits in the stock, the threshold simulation reads a band, and a Volley pays 2 buttons
      closes: REQ-1730, REQ-1732, REQ-1752, REQ-1754, REQ-1760, REQ-6250, REQ-6414
      depends: none
- [ ] T-009 [P] TSK-1004 The System window's text sits on an opaque fill, the action row keeps the thread button beside «Готово», and the report keeps assisted attempts in the help figures
      closes: REQ-3122, REQ-3510, REQ-1306, REQ-2312
      depends: none
- [ ] T-010 [P] TSK-1005 A Volley holds 8 facts at least, names the fact in every miss reply, and a node's priority reads its own Cito block
      closes: REQ-5822, REQ-5844, REQ-5852, REQ-5854, REQ-5858, REQ-5864, REQ-5896, REQ-6424
      depends: none
- [ ] T-011 [P] TSK-1006 A text riddle plays only when four conditions hold, a card riddle plays otherwise, and a parse request carries the fixed prompt and the masked text alone
      closes: REQ-5200, REQ-5256, REQ-5284, REQ-5290, REQ-6420
      depends: none
- [ ] T-012 [P] TSK-1007 A grouping task's ladder follows its graph, every drawn set reaches the log in order, and the short loop plays a placeholder spell until its art ships
      closes: REQ-5528, REQ-5562, REQ-5566, REQ-5570
      depends: none
- [ ] T-013 TSK-1008 A plan has its own route and draft, the band counts problems chosen for a plan, and an untested form stays out of every estimate
      closes: REQ-0204, REQ-0208, REQ-5024, REQ-5026, REQ-5608, REQ-5642, REQ-5644, REQ-5646, REQ-5664, REQ-6422
      depends: TSK-0998 (blocking) - it moves `planChoice` into `plan_submitted`, which the plan route writes.
- [ ] T-014 [P] TSK-1009 The 60-day run proves the rules ADR-0360 amended in the pen, the starters, the interlude, the routes and the schedule
      closes: REQ-5268, REQ-6202, REQ-6204, REQ-6210, REQ-6216, REQ-6218, REQ-6228, REQ-6240, REQ-6244, REQ-6292, REQ-6434, REQ-6436, REQ-6438
      depends: none
- [ ] T-015 [P] TSK-1010 Every route that touches the school's goal list answers on the loopback listener alone, a region is one tap, and the sources screen counts only calculation tasks
      closes: REQ-5058, REQ-6048, REQ-5950, REQ-6428
      depends: none
- [ ] T-016 [P] TSK-1011 Twenty neutral reaction lines answer first, a puzzle gives no sound information, rejected art variants score 1 and the heroine shows as a placeholder
      closes: REQ-2820, REQ-3420, REQ-6124, REQ-6150, REQ-6418
      depends: none

These tasks can run in parallel once their dependencies are done:

- From the start: every task except TSK-1008.
- After TSK-0998: TSK-1008.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0996 | REQ-2510, REQ-2512, REQ-1644 |
| TSK-0997 | REQ-1654, REQ-2710, REQ-6412 |
| TSK-0998 | REQ-5066, REQ-5068, REQ-5072, REQ-5156, REQ-5414, REQ-5106, REQ-5112, REQ-6408, REQ-6410 |
| TSK-0999 | REQ-0800, REQ-0806, REQ-0814, REQ-0830, REQ-1024, REQ-1040, REQ-1050, REQ-5914, REQ-6400 |
| TSK-1000 | REQ-1004, REQ-1006, REQ-1008, REQ-1010, REQ-1124, REQ-1130, REQ-6402, REQ-6404, REQ-6406 |
| TSK-1001 | REQ-0320, REQ-0340, REQ-0362, REQ-0364, REQ-2444, REQ-5004, REQ-5012, REQ-5016, REQ-5728, REQ-5730, REQ-5731 |
| TSK-1002 | REQ-0314, REQ-0316, REQ-0342, REQ-0344, REQ-0346, REQ-0350, REQ-1106, REQ-6430, REQ-6432 |
| TSK-1003 | REQ-1730, REQ-1732, REQ-1752, REQ-1754, REQ-1760, REQ-6250, REQ-6414 |
| TSK-1004 | REQ-3122, REQ-3510, REQ-1306, REQ-2312 |
| TSK-1005 | REQ-5822, REQ-5844, REQ-5852, REQ-5854, REQ-5858, REQ-5864, REQ-5896, REQ-6424 |
| TSK-1006 | REQ-5200, REQ-5256, REQ-5284, REQ-5290, REQ-6420 |
| TSK-1007 | REQ-5528, REQ-5562, REQ-5566, REQ-5570 |
| TSK-1008 | REQ-0204, REQ-0208, REQ-5024, REQ-5026, REQ-5608, REQ-5642, REQ-5644, REQ-5646, REQ-5664, REQ-6422 |
| TSK-1009 | REQ-5268, REQ-6202, REQ-6204, REQ-6210, REQ-6216, REQ-6218, REQ-6228, REQ-6240, REQ-6244, REQ-6292, REQ-6434, REQ-6436, REQ-6438 |
| TSK-1010 | REQ-5058, REQ-6048, REQ-5950, REQ-6428 |
| TSK-1011 | REQ-2820, REQ-3420, REQ-6124, REQ-6150, REQ-6418 |

The smallest set of tasks that would test the decision is TSK-0996, TSK-0998, TSK-1000 and TSK-1001. Together they show whether the network watch stops the stack only on a changed gateway, whether word-problem rungs stay useful and leak no given, whether raised mode keeps the corridor's band, and whether the soft stop ends a puzzle's day without a daily maximum, which are the two failures the decision's premortem names and the two reversal conditions that need the least play to read.

## Not covered

- ADR-0360's first criterion, that no specification keeps an open finding this record settles: the specification step rewrites the specifications, and no task of this epic edits one.
- ADR-0360's tenth criterion, the owner's reading of the settled specifications at their next review: it is the owner's judgement and no task can bring it about.
- Entries 90 to 94 of the decision, which leave the specification step's choices standing or state a rule in force already: entry 90's two snapshot-table rules are ADR-0340's group 1 check, which the epic realising ADR-0340 builds, and entries 91 to 94 change no behaviour.
- Entry 20, entries 49 to 51 and the confirmed choices of SPC-0050, SPC-0070, SPC-0230 and SPC-0350: they keep their behaviour and add no code beyond what TSK-0999, TSK-1000, TSK-1006 and TSK-0996 already state.
- The interval ladder of entries 63 and 64 (REQ-6426): ADR-0360 no longer addresses it, because REQ-7510 supersedes it and ADR-0460 carries it, so no task of this epic changes the ladder.
