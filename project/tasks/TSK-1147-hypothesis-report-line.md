---
id: TSK-1147
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0450
closes: [REQ-7314, REQ-7318, REQ-7334, REQ-7348, REQ-7356]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The report line shows the label, the states, the versions and the data before the window

After this task, the tab «Гипотезы» is also the report's line «Гипотезы и их статус», and for each hypothesis with numeric criteria it shows the shown label with its four versions, each condition's state beside it, the measures in the window with their 80 % intervals, the earlier data apart under its mark, and the dated marks of criteria changes.

## Acceptance criteria

1. Given a hypothesis with a shown label, when its line is rendered, then the label carries the model, threshold, rules and graph versions it was computed under, and each condition's state shows beside it even while the label reads «мало данных» (REQ-7348, REQ-7334). Closed by: a Playwright test over a label with one condition met and one not.
2. Given 100 observations before the hypothesis and 40 between its record and its last change of criteria, when the line is rendered, then the first 100 show apart under «до записи», the 40 under «до смены критериев», and neither enters a state or the label (REQ-7314). Closed by: a Playwright test and a rule function test over the three data sets.
3. Given a hypothesis whose criteria changed twice after it was recorded, when the line is rendered, then it shows «критерии изменены после записи» with the date of each change (REQ-7318). Closed by: a Playwright test over two criteria changes.
4. Given the line, when its markup is read, then every label, state and mark, among them the three labels, the three states and the four marks, comes from `content/i18n/ru.json` under `parent.hypotheses.*` and no Russian string stands in a component (REQ-7356). Closed by: ADR-0180's check of `parent.*` values over the keys and a source scan of the component for Cyrillic literals.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Extend the tab TSK-1141 builds. Each measure shows its right answers, attempts and 80 % Wilson interval over the raw counts of the window it names beside it, or «мало данных» under its floor, as REQ-6616 asks of every addendum 2 share. Report v1 keeps its nine screens, and the line sits in the tab, not as a screen. A closed hypothesis shows the label and versions its `closed` event holds beside the current ones. The count of changes from play and the version mark are shown here once TSK-1146 supplies them.

## Depends on

- TSK-1141 (blocking): it extends the tab.
- TSK-1144 (blocking): it shows the condition states.
- TSK-1145 (blocking): it shows the shown label and its versions.

## Evidence

Not yet.

## Left alone

The restart of the hold on a version change, which TSK-1146 builds, and the other report screens, which ADR-0180 owns.
