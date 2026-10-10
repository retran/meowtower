---
id: EPC-0230
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0230
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# «Сплети загадку» plays as cards first and as a masked, blind parse of her text only after a live test passes

Realises exactly ADR-0230: the pure judge of a riddle, the card form, the compose flow, the five compose events, the masker, the safety path her text takes before a parse, the parse model's fixed endpoint and its logging, the reply check and the paraphrase, the Director's offer of at most 2 riddles a day, the riddle's field and strings, the composing stream, the report line and the Parent Room's list, the Diary pages, and the live acceptance test of the masked parser.

Until the epics realising ADR-0040, ADR-0060, ADR-0070, ADR-0100, ADR-0110, ADR-0130, ADR-0180, ADR-0210 and ADR-0440 exist, the tasks run on fixture targets, a stand-in judge route and a stand-in parse reply. Each task names what it leaves to those epics. The card form works end to end with no model; the text form's code can be built and replayed, and no text riddle reaches her until the parent has labelled the 200 texts and the live test has passed.

## Acceptance criteria

1. A property test runs `judgeCompose` over generated pairs of target and graph and finds one verdict for each pair, the same on repeat, `match` for every reordering of `+` and `·`, and `wrong_structure` for «6 : 48» against «48 : 6»; fixtures give «6 · 4 + 6» and «6 · 5» `match_other_structure` and the target's operations on other numbers `wrong_structure` with `wrongNumbers: true`. Evidence: the property test's report, from TSK-0788.
2. A masking test generates every case form of the number words from the OpenCorpora dictionary, finds each in `content/numerals.ru.json`, runs them and the reference set's number words through the masker and finds no number left. Evidence: the masking test's report, from TSK-0792.
3. Replayed tests give `unparsed` for a 10-second timeout, invalid JSON, a graph with no question, a graph naming `n9` for a text with 3 tokens and a span not in her text. Evidence: the replayed tests' report, from TSK-0795.
4. A state-machine test drives a text riddle through yes, through no then yes, through no then no and through a failed correction parse, and a card riddle through each verdict, and finds the states of the flow, at most one correction, no twin and the same states whatever the riddle's purpose. Evidence: the state-machine test's report, from TSK-0790.
5. A projection test replays a log with riddles and finds that no estimate, block, probe, node state, success share, holding-steps count or step-input share changes when the riddles are removed. Evidence: the projection test's report, from TSK-0798.
6. A code search finds no path from `compose_submitted` text to a `StoryRequest` or the Master's story memory. Evidence: the search test's report, from TSK-0800.
7. `verify --live --compose` reports agreement, the 2 % bound, the confusion table, the body-hash check and the planted target within its budget. Evidence: the harness test's report, from TSK-0801.
8. A Parent Room test labels a logged riddle, reads the label back from the log as a new event and finds the riddle's verdict unchanged. Evidence: the Parent Room test's report, from TSK-0799.
9. A test with a text that trips a serious trigger finds the serious path taken and nothing sent, and a test with neither judge model answering finds `unparsed` with `safety_unchecked`. Evidence: the integration tests' reports, from TSK-0793.
10. Every requirement ADR-0230 addresses lands in exactly one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the agreement of the masked parser with the parent's labels on the fixture set, which TSK-0801's harness reports, and the worst-case reservation of one parse, about $0.017, which TSK-0794's gateway test computes from `max_tokens` and the prices.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0788 `judgeCompose` gives one verdict and an error class for a target and a graph, the same every time
      closes: REQ-5224, REQ-5226, REQ-5228, REQ-5230, REQ-5298, REQ-5244
      depends: none
- [ ] T-002 TSK-0789 A card riddle has her build the problem from sentence cards the engine made, and the engine judges it with no model
      closes: REQ-5292
      depends: TSK-0788 - it judges the cards' graph.
- [ ] T-003 TSK-0790 Every riddle runs one compose flow on the server, with one correction, an unassisted attempt and no twin
      closes: REQ-5236, REQ-5238, REQ-5260, REQ-5262
      depends: TSK-0788 - it shows the review's verdict; TSK-0789 - it takes the card form's input.
- [ ] T-004 [P] TSK-0791 The five compose events record verdicts and both texts only in their own fields, and mark a corrected riddle
      closes: REQ-5232, REQ-5240, REQ-5242
      depends: TSK-0788 - the payloads hold its verdict and class names.
- [ ] T-005 [P] TSK-0792 The masker replaces every number in her cleaned text with a token, and the map from tokens to numbers never leaves the Mac
      closes: REQ-5204
      depends: none
- [ ] T-006 TSK-0793 Her composed text passes the local triggers, the cleaning, the masking and the judge's safety check before any parse request leaves the Mac
      closes: REQ-5200, REQ-5212, REQ-5220, REQ-5222
      depends: TSK-0792 - it runs the masker as its third step.
- [ ] T-007 [P] TSK-0794 `PARSE_MODEL` is fixed to a zero-retention player-tier endpoint, every parse call is logged, and it spends only from the parse bucket
      closes: REQ-5208, REQ-5210, REQ-5214, REQ-5216
      depends: none
- [ ] T-008 [P] TSK-0795 The engine refuses an invalid parse reply as `unparsed`, and the paraphrase holds only template strings and spans found in her own text
      closes: REQ-5234, REQ-5288
      depends: none
- [ ] T-009 [P] TSK-0796 The Director offers at most 2 riddles a game day as a story scene outside the room slots, on a node she understands
      closes: REQ-5256, REQ-5258, REQ-5264
      depends: TSK-0789 - the Director falls back to the card form.
- [ ] T-010 TSK-0797 The riddle's field is the story's free-text field with its note and three starters, and every string comes from the language files
      closes: REQ-5266, REQ-5268
      depends: TSK-0790 - it fills the flow's windows.
- [ ] T-011 TSK-0798 The composing stream counts verdicts apart, and no estimate, block, probe, state, ladder or input share reads a riddle
      closes: REQ-5246, REQ-5248, REQ-5250, REQ-5252
      depends: TSK-0791 - the stream reads `compose_confirmed`.
- [ ] T-012 TSK-0799 The report shows «Может составить задачу» as counts, and the Parent Room lists every riddle with its texts, paraphrase, answer and verdict
      closes: REQ-5254, REQ-5294, REQ-5296
      depends: TSK-0791 - the list reads the events; TSK-0798 - the line shows the stream's counts.
- [ ] T-013 TSK-0800 «Загадки героини» pages are rendered by the server from the log, and no composed text reaches the Master
      closes: REQ-5270, REQ-5272
      depends: TSK-0791 - the pages render from the events.
- [ ] T-014 TSK-0801 `verify --live --compose` runs the masked parser on labelled texts and reports agreement, the match bound, the confusion and the request check
      closes: REQ-5274, REQ-5280, REQ-5282, REQ-5284, REQ-5286
      depends: TSK-0788 - the labels use its rules; TSK-0792 - the run sends the masker's output; TSK-0795 - the run judges with the reply check.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0788, TSK-0792, TSK-0794 and TSK-0795.
- After TSK-0788: TSK-0789 and TSK-0791.
- After TSK-0789: TSK-0790 and TSK-0796.
- After TSK-0792: TSK-0793.
- After TSK-0790: TSK-0797.
- After TSK-0791: TSK-0798 and TSK-0800.
- After TSK-0791 and TSK-0798: TSK-0799.
- After TSK-0788, TSK-0792 and TSK-0795: TSK-0801.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0788 | REQ-5224, REQ-5226, REQ-5228, REQ-5230, REQ-5298, REQ-5244 |
| TSK-0789 | REQ-5292 |
| TSK-0790 | REQ-5236, REQ-5238, REQ-5260, REQ-5262 |
| TSK-0791 | REQ-5232, REQ-5240, REQ-5242 |
| TSK-0792 | REQ-5204 |
| TSK-0793 | REQ-5200, REQ-5212, REQ-5220, REQ-5222 |
| TSK-0794 | REQ-5208, REQ-5210, REQ-5214, REQ-5216 |
| TSK-0795 | REQ-5234, REQ-5288 |
| TSK-0796 | REQ-5256, REQ-5258, REQ-5264 |
| TSK-0797 | REQ-5266, REQ-5268 |
| TSK-0798 | REQ-5246, REQ-5248, REQ-5250, REQ-5252 |
| TSK-0799 | REQ-5254, REQ-5294, REQ-5296 |
| TSK-0800 | REQ-5270, REQ-5272 |
| TSK-0801 | REQ-5274, REQ-5280, REQ-5282, REQ-5284, REQ-5286 |

The smallest set of tasks that would test the decision is TSK-0788, TSK-0790, TSK-0792, TSK-0795 and TSK-0801. Together they show whether the verdict is the engine's and replayable, whether the flow keeps a parse error from becoming her error, whether a number can slip the masker and whether the live test measures what play will send, which are the three failures the decision's premortem names.

## Not covered

- REQ-5036, REQ-5038 and REQ-5040: the masked parse request, its missing target and its zero-retention provider, because the `ParseRequest` class, its schema and its guard belong to ADR-0210's epic, whose task for the masked parse request closes them; this epic's TSK-0793 and TSK-0794 build the path that uses the class and the endpoint check.
- REQ-5046 and REQ-5096: the parse bucket of $0.1 and sentence cards while the parser isn't accepted or the bucket is spent, because ADR-0210's epic builds the bucket and the guard in its task for the play key's buckets; the Director's fallback here is TSK-0796's.
- REQ-5290: the composing flag staying off unless the live test passed on the configured model, because the guard that reads `verify/parser-eval.json` is ADR-0210's, in its task for the play key's buckets, which as ADR-0360 amends it turns the text form off and shows `compose_flag_off`, and this epic's TSK-0801 writes the record it reads.
- REQ-5276 and REQ-5278: the 200 reference texts and the parent's labels set before the parser runs, because writing and labelling them is the parent's and the content author's work that no code change brings about; TSK-0801 builds the harness and its checks on a fixture set, and the run fails until the file holds the 200.
- The wording of REQ-5218, which went to the requirements step and was superseded by REQ-6420 under ADR-0360; TSK-0796 follows ADR-0230's reading that its four conditions gate the text form only.
