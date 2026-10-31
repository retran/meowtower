---
id: EPC-0440
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0440
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# «Сплети загадку» takes the seven constructions by expanding each named operation into the four operations, masking fraction words as tokens of their own and letting each number family play in text only after its own test

Realises exactly ADR-0440: the widened masker and its two token classes, the egress guard and the masking test from an independent dictionary, the parse reply that names six operations over tokens, the expansion inside `judgeCompose` and the three new error classes, the construction templates and the Director's gate on their nodes, the choice of a division meaning, the construction card sets and strings, the composing stream's counts and the report line, acceptance test 3 with a subset for each family, and the rule that a family plays in text only after its own pass.

The whole item is post-MVP, because REQ-6682 keeps the extension of «Сплети загадку» out of the first version, but ADR-0460 settles that the masker and the reply check of REQ-7202 and REQ-7210 bind from the MVP, so TSK-1124 and the number check of TSK-1127 are built with the MVP's composing and the rest after it. The item adds no event type and no event field.

Until the epics realising ADR-0230, ADR-0060, ADR-0040, ADR-0100 and ADR-0160 exist, the tasks run on fixtures: fixture riddles, fixture node states, a stand-in parse model and a stand-in gateway. Each task names what it leaves to those epics.

## Acceptance criteria

1. A property test runs `judgeCompose` over generated pairs and finds that «три четверти от 20» and «разделили 20 на 4 части и взяли 3» give the same expanded graph and `match`, that «четверть от 80» for `25 % от 80` gives `match_other_structure`, and that every verdict on a pair without named operations equals the verdict before this epic. Evidence: the property test's report, from TSK-1128.
2. Fixtures give `compose_times_vs_divide` to `2,5 : 4` for the target `2,5 · 4`, `compose_percent_as_number` to `80 − 20` for `80 − 20 % от 80`, and `compose_ratio_additive` to `6 + 2 − 3` for the part from K = 6 in the ratio 3 : 2, each beside `wrong_structure`. Evidence: the fixture test's report, from TSK-1129.
3. A masking test generates every case and gender form of the added words and of cardinal-plus-ordinal runs from OpenCorpora, runs them through the masker, finds no number word left, and finds «2 1/2», «3/4» and «2,5» each as one token and «двадцать пятых» as one `d` token. Evidence: the masking test's report, from TSK-1124, TSK-1125 and TSK-1126.
4. A gateway test sends a `ParseRequest` holding an unmasked «четверть», «вдвое» and «пятая», and the guard refuses each as `mask_incomplete` before any network call, and the riddle turns into cards. Evidence: the gateway test's report, from TSK-1126.
5. A replayed test gives `parse_invalid` to a graph that names 1000 for «2 кг 500 г», and accepts the 100 of a percentage and the sum of a ratio's parts from the expansion. Evidence: the replay test's report, from TSK-1127.
6. A Director test with a synthetic log opens and closes each construction's gate by its node states, an inferred "fluent" included, and asks for grouping on a tie and then for the meaning with fewer clean `match` riddles. Evidence: the Director test's report, from TSK-1131 and TSK-1132.
7. A content test refuses a division template without `divisionMeaning`, a ratio template naming no total or known part and a construction without card frames, paraphrase templates or a meaning note. Evidence: the content test's report, from TSK-1130 and TSK-1133.
8. `verify --live --compose` reports the 200 texts, each subset against 48 of 50, the unit stories apart and the division-kind agreement per meaning within $9, and writes one record per model and prompt hash; a start-up test with a changed prompt hash offers only cards for every family. Evidence: the verify run's output and the start-up test's report, from TSK-1136 and TSK-1134.
9. A projection test replays a log with construction riddles and finds the stream's counts per construction, form and meaning, and no change to any estimate, state, probe, block, success share, holding-steps count or step-input share when they are removed. Evidence: the projection test's report, from TSK-1135.
10. Every requirement ADR-0440 addresses lands in exactly one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the agreement of the stand-in parse on each family's fixture subset, which TSK-1136 reports before any live run, and the cost of a live run against the $9 budget, which the same task reports from the 420 worst-case parses. ADR-0440 reverses a family to cards when 5 of its last 30 labelled riddles were judged other than labelled, and TSK-1134 is where a family goes back to cards.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-1124 The masker takes decimals, slash fractions, mixed numbers and multiplicative words as `n` tokens
      closes: REQ-7202, REQ-7208
      depends: none
- [ ] T-002 TSK-1125 The masker takes fraction words, ordinals and cardinal-plus-ordinal runs as `d` tokens whose values stay on the Mac
      closes: REQ-7204, REQ-7206, REQ-7212
      depends: TSK-1124 - both passes share the numerals file and the longest-form-first order.
- [ ] T-003 TSK-1126 The egress guard refuses an unmasked word, and a masking test generates forms from an independent dictionary
      closes: REQ-7214, REQ-7216
      depends: TSK-1124 - it guards that task's words.; TSK-1125 - it guards that task's words.
- [ ] T-004 TSK-1127 The parse reply names six operations over tokens, refuses any other number, and ends a unit story as `unparsed`
      closes: REQ-7210, REQ-7218, REQ-7220, REQ-7232
      depends: TSK-1125 - the graph's tokens include the `d` tokens.
- [ ] T-005 TSK-1128 `judgeCompose` expands each named operation before it applies the verdict table, and the log keeps the named graph
      closes: REQ-7222, REQ-7224, REQ-7226, REQ-7228, REQ-7230
      depends: TSK-1127 - the named operations are the parse reply's.
- [ ] T-006 [P] TSK-1129 Three new error classes mark the times-or-divide, percentage-as-number and additive-ratio ideas
      closes: REQ-7246, REQ-7248, REQ-7250, REQ-7252
      depends: TSK-1128 - they read the expanded and the named graphs.
- [ ] T-007 [P] TSK-1130 A construction template declares its construction and a division's meaning, and a ratio names a total or a known part
      closes: REQ-7234, REQ-7236
      depends: none
- [ ] T-008 TSK-1131 The Director offers a construction only when its nodes are at "understands" or above, from any floor that lets a riddle play
      closes: REQ-7200, REQ-7238, REQ-7240
      depends: TSK-1130 - the gate reads the construction a template declares.
- [ ] T-009 [P] TSK-1132 The Director asks for the division meaning with fewer clean riddles, and the target names the meaning in words
      closes: REQ-7242, REQ-7244
      depends: TSK-1131 - it chooses among the offered constructions.; TSK-1135 - it reads the counts per requested meaning.
- [ ] T-010 [P] TSK-1133 Card frames, paraphrase templates and meaning notes come from content files, pass the frame checks and are written offline
      closes: REQ-7276, REQ-7278, REQ-7280, REQ-7282
      depends: TSK-1130 (not blocking) - the seven construction names are fixed by REQ-7200, so the strings can be written before the templates land.
- [ ] T-011 [P] TSK-1135 The composing stream counts each verdict per construction, form and meaning, and the report line shows the counts
      closes: REQ-7254, REQ-7256, REQ-7258
      depends: TSK-1129 - it counts the new error classes.; TSK-1130 - its key is the construction a template declares.
- [ ] T-012 TSK-1136 Acceptance test 3 holds a subset of 50 texts for each family and reports the unit stories and the division kinds apart
      closes: REQ-7260, REQ-7262, REQ-7268, REQ-7272, REQ-7274
      depends: TSK-1126 - the run goes through the guard.; TSK-1127 - it parses with the new reply and prompt.; TSK-1128 - it judges through the expansion.
- [ ] T-013 TSK-1137 A construction riddle plays as sentence cards with three roles and a distractor of the named error
      closes: REQ-7266
      depends: TSK-1130 - the cards build from the declared construction.; TSK-1133 - the frames are those files.
- [ ] T-014 TSK-1134 A family plays in text only after its own pass on the configured model and prompt, and the whole-number constructions after the 200 texts alone
      closes: REQ-7264, REQ-7270
      depends: TSK-1136 - it reads that task's records.; TSK-1137 - the family plays as cards until it passes.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-1124, TSK-1130 and TSK-1133.
- After TSK-1124: TSK-1125.
- After TSK-1124 and TSK-1125: TSK-1126.
- After TSK-1125: TSK-1127.
- After TSK-1127: TSK-1128.
- After TSK-1128: TSK-1129.
- After TSK-1130: TSK-1131.
- After TSK-1129 and TSK-1130: TSK-1135.
- After TSK-1131 and TSK-1135: TSK-1132.
- After TSK-1130 and TSK-1133: TSK-1137.
- After TSK-1126, TSK-1127 and TSK-1128: TSK-1136.
- After TSK-1136 and TSK-1137: TSK-1134.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-1124 | REQ-7202, REQ-7208 |
| TSK-1125 | REQ-7204, REQ-7206, REQ-7212 |
| TSK-1126 | REQ-7214, REQ-7216 |
| TSK-1127 | REQ-7210, REQ-7218, REQ-7220, REQ-7232 |
| TSK-1128 | REQ-7222, REQ-7224, REQ-7226, REQ-7228, REQ-7230 |
| TSK-1129 | REQ-7246, REQ-7248, REQ-7250, REQ-7252 |
| TSK-1130 | REQ-7234, REQ-7236 |
| TSK-1131 | REQ-7200, REQ-7238, REQ-7240 |
| TSK-1132 | REQ-7242, REQ-7244 |
| TSK-1133 | REQ-7276, REQ-7278, REQ-7280, REQ-7282 |
| TSK-1134 | REQ-7264, REQ-7270 |
| TSK-1135 | REQ-7254, REQ-7256, REQ-7258 |
| TSK-1136 | REQ-7260, REQ-7262, REQ-7268, REQ-7272, REQ-7274 |
| TSK-1137 | REQ-7266 |

The smallest set of tasks that would test the decision is TSK-1125, TSK-1126, TSK-1128, TSK-1131 and TSK-1136. Together they show whether her fractions stay on the Mac, whether a story and its operator form get one verdict, whether a construction is offered only to a player whose nodes support it, and whether each family's own test can fail, which are the three failures the decision's premortem names.

## Not covered

No requirement ADR-0440 addresses is deferred. The decision leaves these things to a person or to other records, and no task here builds them:

- The parent's labelling of the four family subsets, the unit stories and the replaced texts of the 200, which is a person's work of about 3.5 hours at worst, and the owner's live run of test 3 on the offline key; until both happen every family plays as cards, which TSK-1134 enforces.
- How the profile's conceptual-understanding bar counts a construction riddle, which ADR-0390 owns under REQ-6750.
- A report of operator stories against divide-then-multiply stories from the named graph, which a later record writes and which needs no new field.
- A composing state, the rewards for construction riddles, unit conversions in the graph, and Dutch or English strings for the constructions.
