---
id: EPC-0220
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0220
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One thread opens a task's hint ladder, the ladder has one rung for each real step, the familiar frames each rung with an approved line, and the "with help" estimate keeps a share for each depth

Realises exactly ADR-0220: the price of a ladder and its ledger, the twin's own ladder, the end of the second attempt after a right or partial answer at rung 1 or less, the ladder's length by real steps with the basic fact's strategy rung and the fluent fact's rule, the checks that keep rungs 1 and 2 from stating the answer, the framing lines with their generator, review and display, the resume of an open ladder, the four shares by depth, and the report's «на пороге» mark and mean depth of help.

Until the epics realising ADR-0040, ADR-0060, ADR-0080, ADR-0130, ADR-0150, ADR-0180 and ADR-0210 exist, the tasks change the stand-ins and modules that stand where those epics will build: `src/server/play.ts`, `src/server/standin.ts`, `src/engine/projections/resume.ts` and `src/engine/projections/knowledge.ts`. Each task names what it leaves to those epics.

ADR-0220 no longer addresses REQ-5130, which REQ-7164 superseded and ADR-0430 addresses, so the trigger for a twin after a miss or a deep hint is that epic's. TSK-0773's tests are the evidence for REQ-5068 and REQ-5070, which ADR-0210 addresses and ADR-0220 realises by the payloads it defines; ADR-0220 doesn't address them, so no task here closes them.

## Acceptance criteria

1. A ledger test opens a ladder and shows rungs 1 to 3 and finds exactly one `thread_spent` with reason `hint_ladder` and three `hint_shown`, the first `thread` and the others `free_step`; after a resume and a repeated request with a new `clientSeq` the counts are unchanged; with the stock at 0 and the pocket used after the opening, the button stays active and rungs 2 and 3 show. Evidence: the ledger test's report, from TSK-0773, and the resume test's report, from TSK-0776.
2. A state-machine test drives `clean`, `partial` and `alt` at hint levels 0 to 3, finds no twin after `clean` or `partial` at levels 0 and 1, finds no third attempt, and finds that opening the twin's ladder spends 1 thread and that no task spends more than 4. Evidence: the state-machine test's report, from TSK-0775 and TSK-0774; the twin after a miss or a deep hint is ADR-0430's.
3. A template test runs every template over 1,000 seeds and finds a ladder of 1 to 3 rungs with no two identical, no digit in rung 1 unless the template is a basic fact, exactly one rung for a basic fact, no rung naming the answer node and no rung 1 or 2 holding the answer outside the givens. Evidence: the template test's report, from TSK-0777, TSK-0778 and TSK-0780.
4. A test shows a fluent mental-arithmetic basic fact with `hintMaxLevel` 0, the button inactive before the answer, `hint_level_beyond_ladder` on a forced request and the strategy line in the short solution with no thread spent. Evidence: the test's report, from TSK-0779.
5. A framing test feeds lines with a digit, «одна», «третьему», a brace and a familiar's name, and each fails before the queue while «раз» passes; a line with no `rung_framing_approved` never shows, and one removed by `rung_framing_removed` stops showing. Evidence: the framing tests' reports, from TSK-0781 and TSK-0782.
6. A Playwright test on the tablet viewport shows each rung with the portrait and an approved line, the same line after a resume although another was approved in between, and the portrait alone when no line is approved or the stored line was removed. Evidence: the Playwright report, from TSK-0783.
7. A model test feeds assisted attempts at each depth and finds the four shares move and the pooled estimate, `pKnow` and fluency move as ADR-0060 says, with each share giving each attempt half its weight at age 30 days. Evidence: the model test's report, from TSK-0784.
8. A report test builds logs that meet «на пороге» alone, «почти готово» alone and both, one with 3 rung 1 successes among 6 assisted attempts that doesn't meet it, one with 3 rung 1 successes and 2 second attempts among 5 that does, and one with 2 rung 1 first-attempt successes and 1 right second attempt among 3 that doesn't; the mean depth shows 4 for a second attempt and «нет данных» with no attempt. Evidence: the report test's reports, from TSK-0785 and TSK-0786.
9. Every requirement ADR-0220 addresses lands in exactly one closed task. Evidence: `paw check coverage` with no finding.

The epic can measure one thing before it is finished: the share of the stage 0.1 templates whose ladder has one rung, which TSK-0777's template test reports. ADR-0220's third reversal condition fires when more than a third of hinted first attempts fall on one-rung ladders, so the share of such templates shows early how likely that is.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0772 `hint_shown`, `thread_spent` and `attempt_submitted` carry the ladder's fields, and two framing events join the log
      closes: REQ-5156
      depends: none
- [ ] T-002 TSK-0773 The first tap opens the ladder for 1 thread, each later rung is free, and the log tells a paid rung from a free one
      closes: REQ-5100, REQ-5102, REQ-5152, REQ-5154
      depends: TSK-0772 - it writes the new versions of `hint_shown` and `thread_spent`.
- [ ] T-003 [P] TSK-0774 The parallel task opens its own ladder for 1 thread, keeps the first task's features, and draws a missing-number twin at random
      closes: REQ-5104, REQ-5166
      depends: TSK-0773 - it uses the charge key and the ladder ledger.
- [ ] T-004 [P] TSK-0775 A first attempt that ends right or almost right with at most rung 1 gets no second attempt
      closes: REQ-5132, REQ-5134
      depends: none
- [ ] T-005 [P] TSK-0776 A resume shows the open ladder with the rungs she saw, spends no thread and logs no second `hint_shown`
      closes: REQ-5158, REQ-5160, REQ-5168
      depends: TSK-0773 - it keeps the ladder's ledger and charge key unchanged on resume.
- [ ] T-006 [P] TSK-0777 A template's ladder has one rung for each real step of its graph, grouped into three above three steps
      closes: REQ-5106, REQ-5108, REQ-5164
      depends: none
- [ ] T-007 [P] TSK-0778 A basic fact's ladder is exactly one strategy rung with the engine's numbers, and no other first rung holds a number
      closes: REQ-5110, REQ-5112
      depends: TSK-0777 - it specialises the ladder's contract.
- [ ] T-008 TSK-0779 A fluent mental-arithmetic fact offers no ladder before the answer, and its strategy shows after the answer at no charge
      closes: REQ-5114, REQ-5116, REQ-5162
      depends: TSK-0778 - it carries the strategy rung's text; TSK-0773 - it leaves the price unchanged for a task with a ladder.
- [ ] T-009 [P] TSK-0780 A structural check and a seeded check fail a template whose rung 1 or 2 states the answer
      closes: REQ-5118
      depends: TSK-0777 - it reads the rungs.
- [ ] T-010 [P] TSK-0781 `npm run framings:generate` writes framing candidates under `FRAMING_MODEL`, and a code check rejects any line with a number before the queue
      closes: REQ-5126
      depends: none
- [ ] T-011 TSK-0782 The parent accepts, rejects or edits each framing line, and the server shows a line only after its approval event and the owner's commit
      closes: REQ-5124, REQ-5128
      depends: TSK-0781 - the screen lists its candidates and reruns its checks; TSK-0772 - it writes the two framing event types.
- [ ] T-012 TSK-0783 The task window shows the familiar's portrait and one approved line beside each rung, and the same line after a resume
      closes: REQ-5120, REQ-5122
      depends: TSK-0776 - the resume snapshot stores the picked line; TSK-0782 - it supplies the approved lines.
- [ ] T-013 [P] TSK-0784 The knowledge model keeps four shares of right answers by depth of help beside the pooled "with help" estimate
      closes: REQ-5136, REQ-5138, REQ-5140, REQ-5142, REQ-5144
      depends: TSK-0772 - the shares read `hintLevel` and `hintMaxLevel` from the attempt payload.
- [ ] T-014 TSK-0785 The report marks a node «на пороге» by an explicit rule, and shows it before «почти готово» when both hold
      closes: REQ-5146, REQ-5148
      depends: TSK-0784 - it reads the depth counts the model keeps.
- [ ] T-015 [P] TSK-0786 The node card and the help row show the mean depth of help over 30 days, with the count of attempts
      closes: REQ-5150
      depends: none

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0772, TSK-0775, TSK-0777, TSK-0781 and TSK-0786.
- After TSK-0772: TSK-0773, TSK-0784 and, with TSK-0781, TSK-0782.
- After TSK-0773: TSK-0774 and TSK-0776.
- After TSK-0777: TSK-0778 and TSK-0780.
- After TSK-0778 and TSK-0773: TSK-0779.
- After TSK-0776 and TSK-0782: TSK-0783.
- After TSK-0784: TSK-0785.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0772 | REQ-5156 |
| TSK-0773 | REQ-5100, REQ-5102, REQ-5152, REQ-5154 |
| TSK-0774 | REQ-5104, REQ-5166 |
| TSK-0775 | REQ-5132, REQ-5134 |
| TSK-0776 | REQ-5158, REQ-5160, REQ-5168 |
| TSK-0777 | REQ-5106, REQ-5108, REQ-5164 |
| TSK-0778 | REQ-5110, REQ-5112 |
| TSK-0779 | REQ-5114, REQ-5116, REQ-5162 |
| TSK-0780 | REQ-5118 |
| TSK-0781 | REQ-5126 |
| TSK-0782 | REQ-5124, REQ-5128 |
| TSK-0783 | REQ-5120, REQ-5122 |
| TSK-0784 | REQ-5136, REQ-5138, REQ-5140, REQ-5142, REQ-5144 |
| TSK-0785 | REQ-5146, REQ-5148 |
| TSK-0786 | REQ-5150 |

The smallest set of tasks that would test the decision is TSK-0773, TSK-0774, TSK-0780 and TSK-0782. Together they show whether one thread buys the whole ladder with the ledger right across a resume, whether the twin keeps its own price, whether a rung can state the answer, and whether a framing line reaches her only after the parent approved it, which are the cases the decision's premortem names.

## Not covered

- The twin after a miss or after rung 2 or 3 whatever the outcome: REQ-5130 was superseded by REQ-7164, which ADR-0430 addresses, so the epic realising ADR-0430 builds the trigger; TSK-0775 keeps the flow's decision in one function of outcome and deepest rung for it.
- A ladder the familiar opens free on a puzzle: RES-4070's decision owns when that happens; TSK-0773 takes it as an input and logs `free_step` on every rung.
- Framing lines in English and Dutch: they need `framings.en.json` and `framings.nl.json`, which ADR-0160's rule for a second language covers when that language ships.
- A knowledge model version that reads the depth: it waits for play data and the refit after the MVP; TSK-0784 keeps the gate.
