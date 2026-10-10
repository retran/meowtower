---
id: TSK-1100
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0420
closes: [REQ-7040, REQ-7042, REQ-7044, REQ-7046, REQ-7048, REQ-7050]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each quadrant shows its checks, and the two disagreeing quadrants name their causes on both sides

After this task, each quadrant has its heading, its checks as links or sentences, and the line that the two sides measure different things, and the two disagreeing quadrants word their causes as things to check on both sides.

## Acceptance criteria

1. Given a row in each quadrant, when the screen shows it, then the heading and checks are those of ADR-0420's table: confirm by retention for high-high, a link to the lesson-mark form with the row's nodes filled in for low-low, the Sources track and the Dutch memo's question on test conditions for high at home and low at school, the sandbox link and recalibration for low at home and high at school; the retention check, the trajectory and the Dutch probe checks stay hidden until their decisions' epics exist (REQ-7040). Closed by: a Playwright test, one row for each quadrant.
2. Given a high-at-home, low-at-school row, then the screen reads «Что проверить. Дома: состояние может держаться на одном блоке из 5 ответов. В школе: формат заданий, язык, волнение, условия теста»; given low at home and high at school, then «Что проверить. Дома: задания игры могут быть сложнее или плохо откалиброваны, состояние может держаться на одном блоке. В школе: цель может проверяться в узком формате», and no cause is worded as a finding or a fault (REQ-7042, REQ-7046). Closed by: a Playwright test and the string check of ADR-0160.
3. Given a goal row, then it carries «Школа и игра меряют разное: школа сравнивает с целью и с учениками по стране, игра считает ответы самой»; given a Cito row, then «Cito и игра меряют разное: Cito сравнивает раздел с её общим баллом, игра сравнивает её ответы по узлам раздела с остальными узлами» (REQ-7044). Closed by: a Playwright test.
4. Given a check link, when the parent follows it, then the log gets no event and no Director input changes; given the lesson-mark link, then `parent_tag_added` is written only after the parent submits the form (REQ-7048). Closed by: a Playwright test that counts events before and after.
5. Given the low-at-home, high-at-school check, when the parent follows the sandbox link, then ADR-0340's sandbox opens on the row's nodes, a goal's linked nodes or a Cito category's tested nodes, and lists them at its head, each linking to that node's templates (REQ-7050). Closed by: a Playwright test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the checks, causes and lines to the screen of TSK-1099, every string under `parent.school.*` in `ru.json`. Each check is a link or a sentence, because ADR-0310 keeps school data out of play and a quadrant is built from it. Cito rows carry a line of their own, because ADR-0310's line names a target and national pupils, which a Cito category has neither of. The lesson-mark form of ADR-0180 opens with the nodes filled in from the link, and ADR-0340's sandbox takes a list of nodes.

## Depends on

- TSK-1099 (blocking): it extends the screen the route returns.

The epic realising ADR-0340 supplies the sandbox and the epic realising ADR-0180 the lesson-mark form; each gains the entry parameter this task passes. The decisions from RES-4220 and RES-4250 own the retention check, the trajectory and the Dutch probe, whose links this task hides until they exist.

## Evidence

Not yet.

## Left alone

The wording judgement by the parent, which TSK-1104 records, and the Dutch memo's new lines, which TSK-1103 adds.
