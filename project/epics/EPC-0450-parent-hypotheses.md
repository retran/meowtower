---
id: EPC-0450
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0450
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent's hypotheses are two parent events from the first version, and after the MVP a label judges each only on later data

Realises exactly ADR-0450: the two events and their payloads, the tab «Гипотезы» with its form, history and text-criteria notice, the scope guard that keeps the post-MVP part out of the first version, the fixed list of home measures, the condition states and the label, the daily projection with its hold, the restart on a version change, the report line, the four static checks, the hold measurement and the example hypothesis with its lock.

TSK-1140 to TSK-1142 are the first version and ship in the MVP. TSK-1143 to TSK-1150 are the part after the MVP. They wait for the profile of ADR-0390, the probe of ADR-0430 and the owner's amendment of the Russian-only rule in `CLAUDE.md`, so each of them runs on fixture measures and fixture logs until the epics realising those decisions exist, and each names what it leaves to them.

## Acceptance criteria

1. Saving a new hypothesis writes one `hypothesis_recorded` with the whole text, both criteria texts and the node links; editing the text and a criterion in one save writes one `hypothesis_updated` with `change: "criteria"`; resending the same `clientSeq` writes nothing more. Evidence: the route test's report, from TSK-1140.
2. Every hypothesis route answers 401 without a parent session, and the end-to-end scan of the player's screens finds neither a canary hypothesis text nor any `parent.hypotheses.*` label. Evidence: the route test's report from TSK-1140 and the scan's report from TSK-1142.
3. The form's route schema has no numeric field for a node or measure, and a Playwright test of the form finds no percentage or state label on it. Evidence: the schema test's report and the Playwright report, from TSK-1141.
4. The history of a hypothesis edited three times lists three earlier versions, each with the date it was replaced. Evidence: the Playwright report, from TSK-1141.
5. A first-version build shows «Критерии записаны текстом — отчёт их не проверяет» on every hypothesis, and the scope guard fails when a fixture adds `content/hypothesis-measures.json`, the `hypothesis_days` table or a version 2 hypothesis schema to the tree. Evidence: the Playwright report from TSK-1141 and the scope guard's fixture test from TSK-1142.
6. After the MVP, a fixture with 100 observations of a measure logged before the hypothesis and 19 after it gives «открыто», one more observation after it gives a state, and the 100 show apart under «до записи». Evidence: the rule functions' test report from TSK-1144 and the report line's test from TSK-1147.
7. A fixture whose computed label turns on day 1 shows «мало данных» through day 6 of the new label and the new label on day 7 at H = 7. Evidence: the projection test's report, from TSK-1145.
8. A version change in a fixture restarts the hold, a label change it causes reads «пересчитано по новой версии», and the count of changes from play stays the same. Evidence: the version test's report, from TSK-1146.
9. Each of the four static checks fails on a fixture that breaks it: a changed measure list with an unchanged `RULES_VERSION`, an import of the model from `src/parent/hypotheses/`, a gateway import of a hypothesis schema, and an example file whose hash has no approved lock entry. Evidence: the static checks' fixture tests, from TSK-1143, TSK-1144, TSK-1148 and TSK-1150.
10. `tools/hypothesis-hold.ts` reports the false-label rate for each H from 7 to 56 on 200 hypotheses, and verify either records the H it chose or reports `hold_uncalibrated`. Evidence: the tool's output, from TSK-1149.
11. The example run, with the conditions of `verify/check5/example-hypothesis.json`, reports for the maths-gap and the language-gap players the number of seeds of 20 that pass, and the lock file names ADR-0450 for that file's hash. Evidence: the run's output, from TSK-1150.
12. On a fixture of a year of play with 20 open hypotheses, the rebuild after an adventure stays within 5 seconds and the full recompute within 60. Evidence: the performance test's report, from TSK-1146.
13. A `criteria` change in a fixture shows «мало данных» until H play days pass under the new criteria, puts the data between the record and the change under «до смены критериев», and leaves the count of changes from play as it was. Evidence: the projection test's report from TSK-1145 and the report line's test from TSK-1147.
14. Every requirement ADR-0450 addresses lands in exactly one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished. The first is the false-label rate for each H from 7 to 56, which TSK-1149 reports from the rule functions alone, before any screen of the label is built. The second is the number of seeds of 20 that the example hypothesis passes at the measured H, which TSK-1150 reports. ADR-0450 sends the computed label back to research when TSK-1149 finds no H of 56 or less, and ADR-0450's own sketch predicts that outcome, so TSK-1149 is where the label's fate shows. The events, the form and the history of the first version stay either way.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-1140 Two parent events record a hypothesis whole, behind the parent session
      closes: REQ-7300, REQ-7302, REQ-7306
      depends: none
- [ ] T-002 TSK-1141 The tab «Гипотезы» holds the form, the node links, the history and the text-criteria notice
      closes: REQ-7308, REQ-7310, REQ-7366, REQ-7370, REQ-7372
      depends: TSK-1140 - the form saves through its routes and the history reads its events.
- [ ] T-003 [P] TSK-1142 The scope guard keeps the post-MVP part out, and the player's screens show no hypothesis
      closes: REQ-7354, REQ-7358, REQ-7374
      depends: TSK-1141 - the scan needs the tab and its strings to exist.
- [ ] T-004 [P] TSK-1143 Version 2 of the events and the fixed list of home measures
      closes: REQ-7320, REQ-7322, REQ-7324
      depends: TSK-1140 - it adds version 2 to the schemas the first task defines.
- [ ] T-005 TSK-1144 Condition states and the label come from counted observations after the judging window opened
      closes: REQ-7312, REQ-7316, REQ-7326, REQ-7328, REQ-7330, REQ-7332, REQ-7346, REQ-7368
      depends: TSK-1143 - it reads the condition shape and the measure list.
- [ ] T-006 TSK-1145 `hypothesis_days` keeps each day's states and the hold decides the shown label
      closes: REQ-7304, REQ-7336, REQ-7338, REQ-7364
      depends: TSK-1144 - the computed label is its input.
- [ ] T-007 TSK-1146 A version change restarts every hold and marks the label change it causes
      closes: REQ-7340, REQ-7342, REQ-7344
      depends: TSK-1145 - it rewrites and compares the rows of the projection.; TSK-1147 - the count and the mark show on its line.
- [ ] T-008 [P] TSK-1147 The report line shows the label, the states, the versions and the data before the window
      closes: REQ-7314, REQ-7318, REQ-7334, REQ-7348, REQ-7356
      depends: TSK-1141 - it extends the tab.; TSK-1144 - it shows the states.; TSK-1145 - it shows the shown label and its versions.
- [ ] T-009 [P] TSK-1148 Static checks keep a hypothesis off the gateway and the model off the label
      closes: REQ-7350, REQ-7352
      depends: TSK-1140 - it names the schemas the check forbids the gateway to import.
- [ ] T-010 [P] TSK-1149 `tools/hypothesis-hold.ts` measures the false-label rate for each hold
      closes: none - it measures what TSK-1144 and TSK-1145 build
      depends: TSK-1144 - it runs the rule functions on synthetic logs.
- [ ] T-011 TSK-1150 The example hypothesis tells the maths-gap player from the language-gap player, behind a lock
      closes: REQ-7362
      depends: TSK-1144 - it judges the example by the rule functions.; TSK-1145 - the shown label and the hold decide the pass.; TSK-1149 - it runs at the H the tool measured.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-1140.
- After TSK-1140: TSK-1141, TSK-1143 and TSK-1148.
- After TSK-1141: TSK-1142.
- After TSK-1143: TSK-1144.
- After TSK-1144: TSK-1145 and TSK-1149.
- After TSK-1141, TSK-1144 and TSK-1145: TSK-1147.
- After TSK-1145 and TSK-1147: TSK-1146.
- After TSK-1144, TSK-1145 and TSK-1149: TSK-1150.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-1140 | REQ-7300, REQ-7302, REQ-7306 |
| TSK-1141 | REQ-7308, REQ-7310, REQ-7366, REQ-7370, REQ-7372 |
| TSK-1142 | REQ-7354, REQ-7358, REQ-7374 |
| TSK-1143 | REQ-7320, REQ-7322, REQ-7324 |
| TSK-1144 | REQ-7312, REQ-7316, REQ-7326, REQ-7328, REQ-7330, REQ-7332, REQ-7346, REQ-7368 |
| TSK-1145 | REQ-7304, REQ-7336, REQ-7338, REQ-7364 |
| TSK-1146 | REQ-7340, REQ-7342, REQ-7344 |
| TSK-1147 | REQ-7314, REQ-7318, REQ-7334, REQ-7348, REQ-7356 |
| TSK-1148 | REQ-7350, REQ-7352 |
| TSK-1149 | none |
| TSK-1150 | REQ-7362 |

The smallest set of tasks that would test the decision is TSK-1140, TSK-1144, TSK-1145, TSK-1149 and TSK-1150. Together they show whether a hypothesis is recorded whole and dated by the log, whether a label reads only observations after its judging window opened, whether the hold keeps a label from flipping on one day's data, and whether the hold can reach the false-label bar at all, which are the failures the decision's premortem names.

## Not covered

No requirement ADR-0450 addresses is deferred. What the epic leaves to other epics:

- The profile dimensions and how each counts an observation, which the epic realising ADR-0390 supplies; the `dimension.<id>` measures run on a fixture mapping until then.
- The probe's presentations, schedule and help rule, which the epic realising ADR-0430 supplies; the `probe.*` measures run on fixture logs, and a condition on them stays «открыто» under `measure_not_collected` until the probe exists.
- The Wilson and Newcombe interval functions and check 5's four players, which the epic realising ADR-0380 supplies; TSK-1144 and TSK-1150 call them through one module and write a stand-in with the same signature where that epic hasn't landed.
- The owner's amendment of the Russian-only rule in `CLAUDE.md`, which ADR-0450 doesn't settle; no task changes `CLAUDE.md`.
- The both-gaps player of the example, the deletion of a hypothesis, the Dutch text shown to the player and the PDF snapshot of the tab, which ADR-0450 names under what it does not settle.
- The hold bar of REQ-7504, an upper limit of the 95 % Wilson interval over 2,000 hypotheses read once: ADR-0460 addresses REQ-7504, and the epic realising ADR-0460 moves the tool of TSK-1149 to that rule. Until then the tool reports the rate for 200 hypotheses, as ADR-0450's tenth criterion states.
