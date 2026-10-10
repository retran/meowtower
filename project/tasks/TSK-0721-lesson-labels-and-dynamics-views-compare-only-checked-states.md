---
id: TSK-0721
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-1406, REQ-1408, REQ-1410, REQ-1412, REQ-1416, REQ-1418, REQ-1420, REQ-1422, REQ-1424]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Lesson labels compare checked states only, and the dynamics views carry their caveats

After this task, the node card's state history shows the four lesson labels by the rules of ADR-0180, counts only a state computed from a full block as a check, and carries the labels that mark a lower comparability, a changed template and a time compared across one device type.

## Acceptance criteria

1. Given a node or a prerequisite with a lesson mark and a check after it higher than the last check before it, when the label is built, then it is «Улучшилось после урока» (REQ-1406); given a higher check with no mark on the node or any prerequisite in the 30 days before it, then it is «Улучшилось без урока» (REQ-1408). Closed by: unit tests over the five states in their order, «Пока не освоено», «Понимает», «Понимает, нужна скорость», «Бегло», «Устойчиво».
2. Given recheck 2 at a state no lower than recheck 1, when the label is built, then it is «Сохранилось» (REQ-1410); given a lower one, then «Не сохранилось» (REQ-1412). Closed by: a unit test.
3. Given an inferred, unchecked or cut-off state, when the history is built, then it isn't a check and no label compares it, and a node with no check before the mark gets no improvement label and shows its first checked state (REQ-1416). Closed by: a unit test.
4. Given a dynamics view, when it renders, then it carries «без контрольных прогонов: сравнимость ниже» (REQ-1418); given a node whose template version changed between the compared checks, then it carries «контент изменён» (REQ-1424). Closed by: a Playwright test.
5. Given tasks answered on an iPad and on a computer, when times are compared, then only tasks of one device type are compared (REQ-1420); given accuracy, then it may span both (REQ-1422). Closed by: a unit test with a mixed fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the labels and the dynamics rules to the node card's state history, reading only unassisted first attempts from blocks, probes and review. A check is a state computed from a full block, because RES-0900 makes a full block the evidence for a state and both rechecks are blocks; a two-task probe can't flip a label. The labels are Russian strings under `parent.*`.

## Depends on

- TSK-0709 (blocking): it builds the node card and its state history these labels extend.
- TSK-0720 (blocking): it builds the lesson marks and recheck windows the labels read.

## Evidence

Not yet.

## Left alone

The dynamics screen, the node-by-Ascent matrix and the full views, which come after the MVP, and the node states and full-block rule, which ADR-0060 owns.
