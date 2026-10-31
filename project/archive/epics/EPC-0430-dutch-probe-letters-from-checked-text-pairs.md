---
id: EPC-0430
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0430
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Dutch probe ships after the MVP and only once the owner allows Dutch probe text: families of letters from checked text pairs, read only in the stream `nl_probe`

Realises exactly ADR-0430: the scope guard and the parent's switch, the template field that joins a template to a family, the offline run with its roles and refusals, the pipeline that checks each candidate pair, the review screen that approves each pair with its marks and cards, the family builder, the letters' place on the floor and their balanced order, the letter's single set of controls, the word cards, the stream `nl_probe` and the fence that keeps it from every other projection, the report section «Язык или математика?», the canon record for the Mainland, and the 60-day simulation.

Nothing here starts before the owner amends the principle `project_in_english` in `CLAUDE.md`, which only the owner does and no task does. If the owner declines the amendment, ADR-0430 is withdrawn and none of these tasks is built. The work lands in two increments, each removable on its own: the offline run, the review screen and the pair library (TSK-1109 to TSK-1112) change nothing she sees, and the letters, families, stream and report (TSK-1113 to TSK-1119) sit behind `probe.enabled`.

Until the epics realising ADR-0040, ADR-0070, ADR-0080, ADR-0100, ADR-0130, ADR-0160, ADR-0180, ADR-0300 and ADR-0380 exist, the tasks run on fixtures: fixture templates, fixture pairs, a stand-in model gateway and a stand-in report. Each task names what it leaves to those epics.

## Acceptance criteria

1. With `probe.enabled` off, a Playwright walk through a simulated day and a search of every server packet find no letter, no Latin-script word outside the approved bridge keywords and the Dutch words of term hints, and no probe card. Evidence: the Playwright test's report and the packet search's output, from TSK-1108.
2. `npm run probe:generate` refuses to start with two roles on one model id, with an empty `nl` section in the forbidden list and with no style guide, and makes no model call in any of the three cases. Evidence: the run's output in each case, from TSK-1110.
3. A recording of every request of a probe run holds no field from the event log, and the import check fails a build in which `tools/probe/` imports the log or the database or `src/engine/probe/` imports the gateway. Evidence: the recording test's report and the check's output, from TSK-1110.
4. The pipeline rejects, each with its step, a frame with `{a}` missing, a Dutch frame holding «twaalf», a Russian frame holding a Latin word, a Dutch frame holding a form from the `nl` section, a pair whose Dutch frame gets a wrong blind answer on one of its three sets, a pair the language check marks as telling another context, a prompt or pair holding "Cito", and a pair with 9 marks. Evidence: the pipeline test's report, from TSK-1111.
5. A pair in `content/probe/pairs.json` with no `probe_text_approved` for its current hash is never shown, and editing an approved pair keeps it from play until a new approval holds its new hash. Evidence: the show test's report, from TSK-1112.
6. A simulation of 60 game days with the switch on and some days skipped finds the ordering, window, floor and phase rules of ADR-0430 hold, with 3 or 4 letters on every completed first-phase day. Evidence: the simulation's report, from TSK-1121, with the rules built in TSK-1113 and TSK-1114.
7. A property test on random logs changes the answers of `nl_probe` attempts, and every «сама» estimate, track row, limit, bridge share, refusal-guard window and Director success share stays equal. Evidence: the property test's report, from TSK-1117.
8. A packet test of every presentation of a T family finds the same `InputSpec`: no model choice, plan, step fields, «Нельзя узнать», options, estimate or inverse check. Evidence: the packet test's report, from TSK-1115.
9. A state-machine test answers a letter wrong, and the flow shows the short solution with no `twin_open` and no detailed explanation, whatever rung she saw. Evidence: the state-machine test's report, from TSK-1115.
10. A test taps a card in `nl`: the attempt is `assisted: true`, stays in the `nl` count and logs one `probe_card_opened` a word, and in `nl_after_words` the planned cards open first and the attempt stays unassisted. Evidence: the card test's report, from TSK-1116.
11. A reward test finds the same experience and streak effect for a clean letter in each presentation, with cards and without. Evidence: the reward test's report, from TSK-1115.
12. A report fixture shows «мало данных» with the count for a cell with 11 observations and a share for one with 12, «мало данных» for a gap whose one side holds 11, the mark «тексты не проверены носителем» at a native share of 0.4 and not at 0.5, the word list, the practice gain by position, the card counts and the count of families closed short. Evidence: the report test's report, from TSK-1118 and TSK-1119.
13. ADR-0290's word check fails a build with "Cito" in `content/probe/`, `tools/probe/` or a probe event schema or `item_shown`'s `probe` and `forms` values. Evidence: the check's fixture test, from TSK-1110.
14. The owner reads the canon record for the Mainland at the stage acceptance, and the line pool holds no letter scene before that record is approved. Evidence: the owner's judgement and the line pool check, from TSK-1120.
15. Every requirement ADR-0430 addresses lands in exactly one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the pass rate of candidate pairs by pipeline step, which the run's report of TSK-1111 gives and which sets the cost estimate of about $10 a run against the $20 budget, and the share of eligible templates holding an approved pair, which the settings row of TSK-1108 shows and which decides whether the switch can turn on. ADR-0430 reverses its language role if more than 1 in 4 native-reviewed decisions are declined or edited, and TSK-1112 is where those decisions are recorded.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-1108 No Dutch probe trace exists before the owner's amendment, and the parent's switch holds the whole probe
      closes: REQ-6684, REQ-7100
      depends: none
- [ ] T-002 [P] TSK-1109 A template joins the probe only by naming its family
      closes: REQ-6664, REQ-7104
      depends: none
- [ ] T-003 [P] TSK-1110 The offline run refuses to start on shared models, holds no player data and runs under roles of its own
      closes: REQ-7110, REQ-7114, REQ-7116, REQ-7124, REQ-7126
      depends: TSK-1108 (not blocking) - its scope guard keeps the tree clean until the owner's amendment, so this task lands after the amendment.
- [ ] T-004 TSK-1111 The pipeline passes a candidate pair only after code, the forbidden list, a blind solve and the language check
      closes: REQ-7112, REQ-7118, REQ-7120, REQ-7128, REQ-7196
      depends: TSK-1110 - it runs under that task's roles and refusals.
- [ ] T-005 [P] TSK-1112 The parent approves each pair, its marks and its cards, and the game shows only an approved pair
      closes: REQ-7102, REQ-7122, REQ-7144
      depends: TSK-1111 (not blocking) - the screen reads the candidates file that task writes, and runs on a fixture file until then.
- [ ] T-006 TSK-1113 A family is one ordinary template shown in up to five presentations from one approved pair
      closes: REQ-6656, REQ-7106, REQ-7108, REQ-7156
      depends: TSK-1109 - the family's template carries `probeFamily`.; TSK-1112 - the family takes an approved pair.; TSK-1120 (not blocking) - it supplies the Mainland names, and fixture names stand in until it lands.
- [ ] T-007 TSK-1114 Letters take a fixed place on the floor, one presentation of a family a game day, in a balanced order
      closes: REQ-7130, REQ-7132, REQ-7134, REQ-7136, REQ-7146, REQ-7148
      depends: TSK-1113 - it plans the presentations that task builds.
- [ ] T-008 [P] TSK-1115 A letter keeps one set of controls in every presentation and gets no twin and no second attempt
      closes: REQ-7152, REQ-7154, REQ-7158, REQ-7160, REQ-7162, REQ-7164
      depends: TSK-1113 - the controls belong to the presentations it builds.
- [ ] T-009 [P] TSK-1116 A tapped card marks the attempt assisted, and the after-words presentation opens with its cards
      closes: REQ-7138, REQ-7140, REQ-7142, REQ-7150
      depends: TSK-1113 - the cards belong to the presentations it builds.; TSK-1115 (not blocking) - both change the task window, and either can land first.
- [ ] T-010 [P] TSK-1117 Letters feed only the stream `nl_probe`, and no other measure counts them
      closes: REQ-7166, REQ-7168, REQ-7170, REQ-7172, REQ-7174, REQ-7176, REQ-7178
      depends: TSK-1113 - the `item_shown` fields it keys on come from that task.
- [ ] T-011 TSK-1118 The report shows each presentation's share and the two gaps, with «мало данных» under 12 observations
      closes: REQ-7180, REQ-7182
      depends: TSK-1117 - it reads only the stream `nl_probe`.
- [ ] T-012 TSK-1119 The report shows the card counts, the word list, the practice gain, the native-review share and the families closed short
      closes: REQ-7184, REQ-7186, REQ-7188, REQ-7190, REQ-7198
      depends: TSK-1118 - it adds to that task's section.; TSK-1116 - the card counts and the word list read its events.
- [ ] T-013 [P] TSK-1120 A canon record adds the Mainland and its letters before any letter scene is written
      closes: REQ-7194
      depends: none
- [ ] T-014 TSK-1121 A 60-day simulation shows the probe's order, window, floor and phase rules hold
      closes: none - it verifies what the other tasks build
      depends: TSK-1114 - it checks the floor and the order.; TSK-1117 - it checks the stream's fence.; TSK-1118 - it reads the phase's cells.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-1108, TSK-1109, TSK-1110 and TSK-1120.
- After TSK-1110: TSK-1111.
- Any time: TSK-1112 on a fixture candidates file.
- After TSK-1109 and TSK-1112: TSK-1113.
- After TSK-1113: TSK-1114, TSK-1115, TSK-1116 and TSK-1117.
- After TSK-1117: TSK-1118.
- After TSK-1116 and TSK-1118: TSK-1119.
- After TSK-1114, TSK-1117 and TSK-1118: TSK-1121.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-1108 | REQ-6684, REQ-7100 |
| TSK-1109 | REQ-6664, REQ-7104 |
| TSK-1110 | REQ-7110, REQ-7114, REQ-7116, REQ-7124, REQ-7126 |
| TSK-1111 | REQ-7112, REQ-7118, REQ-7120, REQ-7128, REQ-7196 |
| TSK-1112 | REQ-7102, REQ-7122, REQ-7144 |
| TSK-1113 | REQ-6656, REQ-7106, REQ-7108, REQ-7156 |
| TSK-1114 | REQ-7130, REQ-7132, REQ-7134, REQ-7136, REQ-7146, REQ-7148 |
| TSK-1115 | REQ-7152, REQ-7154, REQ-7158, REQ-7160, REQ-7162, REQ-7164 |
| TSK-1116 | REQ-7138, REQ-7140, REQ-7142, REQ-7150 |
| TSK-1117 | REQ-7166, REQ-7168, REQ-7170, REQ-7172, REQ-7174, REQ-7176, REQ-7178 |
| TSK-1118 | REQ-7180, REQ-7182 |
| TSK-1119 | REQ-7184, REQ-7186, REQ-7188, REQ-7190, REQ-7198 |
| TSK-1120 | REQ-7194 |
| TSK-1121 | none |

The smallest set of tasks that would test the decision is TSK-1108, TSK-1111, TSK-1114, TSK-1117 and TSK-1121. Together they show whether the probe stays invisible with its switch off, whether a text reaches the parent only after the three checks, whether the presentations of a family are balanced and spaced, and whether a letter moves no figure it wasn't built for, which are the failures the decision's premortem names.

## Not covered

No requirement ADR-0430 addresses is deferred. The decision leaves these things to a person or to other records, and no task here builds them:

- The owner's amendment of `CLAUDE.md`, the style guide's text, the Dutch forbidden forms and the Dutch numeral list, which a person writes; TSK-1110 and TSK-1111 refuse to run until they exist.
- Native review of any text, which needs a person who reads Dutch natively; TSK-1112 records whether it happened.
- Which templates carry `probeFamily` beyond the rule of 1 to 2 for each group, which the owner approves at the stage acceptance.
- How the profile's dimension «Язык и формат» reads the stream `nl_probe`, which ADR-0390 owns, and the report's intervals, language and maths lines and build check 5, which ADR-0380 owns.
- The English and Dutch interface and the rest of the Dutch layer.
