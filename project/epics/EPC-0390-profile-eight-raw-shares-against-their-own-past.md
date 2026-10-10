---
id: EPC-0390
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0390
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The profile is a Parent Room screen of eight raw shares, each read against its own previous window

Realises exactly ADR-0390: the profile model and its reproducible output, the versioned mapping file and the order that gives each observation to one bar, the two windows of 28 played game days, the raw share with its 80 % Wilson interval and its two empty states, the change line at 97.5 %, the eight bars' own sources, the gap bar, the counting lines and observation lists, the screen, and the boundary that keeps the profile with the parent. The epic is post-MVP work, as ADR-0380 sets, so report v1 keeps its nine screens.

Until the epics realising ADR-0380, ADR-0400, ADR-0410 and ADR-0180 exist, the tasks run on fixture logs and a stand-in for each source they read. Each task names what it leaves to those epics.

## Acceptance criteria

1. A reproducibility test computes the profile from each fixture log twice, and again after a full recompute of the projections, and the three outputs are byte-identical. Evidence: the reproducibility test's report, from TSK-1044.
2. A schema test finds exactly eight bars in the order of REQ-6704 and rejects a `ProfileModel` fixture with a field `total`, `sum` or `average`. Evidence: the schema test's report, from TSK-1044.
3. A Playwright test renders the screen from a fixture of 60 played game days and finds every bar that shows a value with its count and its interval, no number outside a bar's element and its notes, and one fill colour on all eight bars. Evidence: the Playwright report, from TSK-1055.
4. A fixture with 9 observations in a bar and one with 20 observations at a share of 0.5 whose 80 % Wilson interval is 28 points wide show «мало данных» and a value respectively; a mapping with `built: false` on transfer shows «нет данных», and the same log under `built: true` with no transfer events shows «мало данных» with a count of 0. Evidence: the unit tests' report, from TSK-1047.
5. A fixture log with a fact threshold change between the two windows computes both windows' fact states under the new threshold version, and the basic facts change line equals the one computed with the new threshold from the start. Evidence: the fixture test's report, from TSK-1049.
6. A unit test reproduces RES-4210's figures: 5 of 10 gives 0.31 to 0.69 at 80 %, and 47 of 50 against 19 of 30 gives a gap of 31 points with an 80 % interval of 19 to 43. Evidence: the unit test's report, from TSK-1047 and TSK-1053.
7. A simulation of 1,000 seeds with a synthetic student whose accuracy in every family stays constant, one profile per seed at played game day 56, shows a change line claiming a change on at most 20 % of profiles. Evidence: the simulation's report, from TSK-1048.
8. A fixture log where one attempt carries a `factId` and sits on node S6 counts it under basic facts only, a Guardian problem with a surplus number counts under conceptual understanding only, and a property test over random logs finds no observation in two bars apart from the gap bar's bare side. Evidence: the routing tests' report, from TSK-1045.
9. A fixture with 9 `correct` plans, 1 followed by a wrong answer, and 12 faulty plans, 6 followed by a wrong answer, shows the plan count under model building and no plan in the bar; a tenth `correct` plan followed by a right answer brings the labels into the bar. Evidence: the fixture tests' report, from TSK-1051.
10. A fixture with puzzles solved in the patterns theme shows their count under the finding patterns bar and leaves the bar's count unchanged. Evidence: the fixture test's report, from TSK-1052.
11. The scan of the player's screens, run on a simulated adventure, finds no string under `parent.profile.*`, and the lint rule fails on a fixture module in `src/engine/` that imports `src/parent/profile/`. Evidence: the scan's report and the lint verb's output, from TSK-1056.
12. A read of the language and format bar on a fixture with Russian and bridge presentations lists three presentation rows and no Dutch row. Evidence: the unit test's report, from TSK-1053.
13. Every requirement ADR-0390 addresses lands in a closed task. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the share of profiles that claim a change at played game day 56 for a constant student, which TSK-1048's simulation reports against the limit of 20 %, and the share of bars that read «мало данных» on the 60-day fixture, which TSK-1055's render counts. ADR-0390 reopens its change level if the first exceeds 20 %.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-1044 The profile model holds eight bars in a fixed order, no total, and serialises byte for byte
      closes: REQ-6702, REQ-6704, REQ-6706, REQ-6708, REQ-6790, REQ-6798
      depends: none
- [ ] T-002 [P] TSK-1045 A versioned mapping file and a fixed order give every observation to one bar
      closes: REQ-6736, REQ-6738, REQ-6740, REQ-6766
      depends: TSK-1044 - `meta` and the bar identifiers come from the model.
- [ ] T-003 [P] TSK-1046 Each bar reads the last 28 played game days and the 28 before them
      closes: REQ-6726, REQ-6728, REQ-6796
      depends: TSK-1044 - the windows live in the model's entries.
- [ ] T-004 [P] TSK-1047 A bar is one raw share with its 80 % Wilson interval, or «мало данных», or «нет данных»
      closes: REQ-6714, REQ-6716, REQ-6778, REQ-6780
      depends: TSK-1044 - the bar entry is part of the model.
- [ ] T-005 TSK-1048 A change line claims a rise or a fall only when a 97.5 % interval excludes zero
      closes: REQ-6722, REQ-6730, REQ-6732, REQ-6734
      depends: TSK-1046 - the two windows.; TSK-1047 - the shares and the floor.
- [ ] T-006 [P] TSK-1049 The basic facts bar counts each fact once and shows the time and threshold behind it
      closes: REQ-6744, REQ-6746
      depends: TSK-1045 - the routing order.; TSK-1046 - the windows.; TSK-1047 - the bar builder.
- [ ] T-007 [P] TSK-1050 The accuracy bar reads mastered nodes only, and the understanding bar reads four streams only
      closes: REQ-6748, REQ-6750
      depends: TSK-1045 - the routing order.; TSK-1046 - the windows.; TSK-1047 - the bar builder.
- [ ] T-008 [P] TSK-1051 The model building bar counts a Guardian problem's modelling phase, and plan labels enter only after a check
      closes: REQ-6752, REQ-6754, REQ-6762, REQ-6764
      depends: TSK-1045 - the routing order.; TSK-1046 - the windows.; TSK-1047 - the bar builder.
- [ ] T-009 [P] TSK-1052 The finding patterns, transfer and retention bars read their own sources and carry the slow-bar note
      closes: REQ-6724, REQ-6756, REQ-6758, REQ-6760, REQ-6768
      depends: TSK-1045 - the routing order.; TSK-1046 - the windows.; TSK-1047 - the bar builder.
- [ ] T-010 [P] TSK-1053 The language and format bar shows a gap centred on zero, with its presentations and no Dutch row
      closes: REQ-6718, REQ-6720, REQ-6742, REQ-6770, REQ-6772, REQ-6774, REQ-6776
      depends: TSK-1045 - the routing order.; TSK-1046 - the windows.; TSK-1047 - the bar builder.
- [ ] T-011 TSK-1054 Each bar states what it counts and links to the observations behind it
      closes: REQ-6782, REQ-6784
      depends: TSK-1049 - the basic facts rows.; TSK-1050 - the accuracy and understanding rows.; TSK-1051 - the model building rows.; TSK-1052 - the patterns, transfer and retention rows.; TSK-1053 - the language and format rows.
- [ ] T-012 TSK-1055 The profile screen comes first among the report tabs and shows no number outside a bar
      closes: REQ-6700, REQ-6710, REQ-6712, REQ-6786, REQ-6792
      depends: TSK-1048 - the change line the screen draws.; TSK-1054 - the counting lines and the lists.
- [ ] T-013 [P] TSK-1056 The profile never reaches the player, the Master or the school export
      closes: REQ-6788, REQ-6794
      depends: TSK-1044 - the module the rule protects.; TSK-1055 (not blocking) - the scan runs on a fixture string until the screen's strings exist.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-1044.
- After TSK-1044: TSK-1045, TSK-1046, TSK-1047 and TSK-1056.
- After TSK-1046 and TSK-1047: TSK-1048.
- After TSK-1045, TSK-1046 and TSK-1047: TSK-1049, TSK-1050, TSK-1051, TSK-1052 and TSK-1053.
- After TSK-1049 to TSK-1053: TSK-1054.
- After TSK-1048 and TSK-1054: TSK-1055.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-1044 | REQ-6702, REQ-6704, REQ-6706, REQ-6708, REQ-6790, REQ-6798 |
| TSK-1045 | REQ-6736, REQ-6738, REQ-6740, REQ-6766 |
| TSK-1046 | REQ-6726, REQ-6728, REQ-6796 |
| TSK-1047 | REQ-6714, REQ-6716, REQ-6778, REQ-6780 |
| TSK-1048 | REQ-6722, REQ-6730, REQ-6732, REQ-6734 |
| TSK-1049 | REQ-6744, REQ-6746 |
| TSK-1050 | REQ-6748, REQ-6750 |
| TSK-1051 | REQ-6752, REQ-6754, REQ-6762, REQ-6764 |
| TSK-1052 | REQ-6724, REQ-6756, REQ-6758, REQ-6760, REQ-6768 |
| TSK-1053 | REQ-6718, REQ-6720, REQ-6742, REQ-6770, REQ-6772, REQ-6774, REQ-6776 |
| TSK-1054 | REQ-6782, REQ-6784 |
| TSK-1055 | REQ-6700, REQ-6710, REQ-6712, REQ-6786, REQ-6792 |
| TSK-1056 | REQ-6788, REQ-6794 |

The smallest set of tasks that would test the decision is TSK-1044, TSK-1045, TSK-1047, TSK-1048 and TSK-1055. Together they show whether the profile rebuilds byte for byte, whether one observation moves one bar, whether a thin bar says «мало данных» and a change line fires at its stated rate, and whether the screen holds a number outside a bar, which are the things the decision's premortem and its strongest objection turn on.

## Not covered

- No requirement ADR-0390 addresses is deferred.
- The Dutch rows of the language and format bar: they wait for the owner's amendment of the Russian-only rule in `CLAUDE.md` and for the epic realising ADR-0430, and REQ-6776 holds until then.
- The transfer and retention bars' real sources: TSK-1052 reads them through `ObservationSource`, and the epics realising ADR-0410 and ADR-0400 wire the projections and raise the mapping file's version.
- A Rasch θ per dimension and a profile at a past date: ADR-0390 leaves them to a later decision.
