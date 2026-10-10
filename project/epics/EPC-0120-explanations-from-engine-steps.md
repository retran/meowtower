---
id: EPC-0120
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0120
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A model writes each explanation from the engine's steps with placeholders, code checks it and a blind solver reads it, and the template covers every failure

Realises exactly ADR-0120: the text checks in code, the forbidden-word and safety checks on the unfilled text, the blind solve, the familiar's voice, the group cache with three variants, the template fallback and the single payment, offline generation, the parent's hide control, and the rule that explanation text stays out of the story.

Until the epics realising ADR-0040, ADR-0080, ADR-0100, ADR-0150 and ADR-0160 exist, the tasks run on fixture graphs and templates, a mocked gateway and a fixture forbidden list. Each task names what it leaves to those epics.

## Acceptance criteria

1. A test feeds six bad model replies, a digit, «половина», 9 sentences, a step the graph lacks, step results out of order and a forbidden word, and each shows the template explanation and logs `explanation_fallback` with reason `check_failed` and the right check. Evidence: the integration test's report, from TSK-0612, TSK-0613 and TSK-0617.
2. A test replaces the model with one that answers after 11 seconds, and the template explanation appears at 10 seconds with the same thread spend id and no second debit or refund. Evidence: the integration test's report, from TSK-0617.
3. A test records every request to the judge and `SAFETY_MODEL` for explanations and finds no digit, no number word and no value of her answer. Evidence: the recorded-request test's report, from TSK-0613.
4. A test records every request to `LIVE_CHECK_MODEL` for explanations and finds only the task text and the explanation. Evidence: the recorded-request test's report, from TSK-0614.
5. Over a simulated 30 days, no group shows more than 3 distinct texts of one prompt version, and each group's texts appear in round-robin order. Evidence: the simulation's report, from TSK-0616.
6. A test over `llm_log` for a simulated adventure finds no Master or planner request holding a 20-character run of a shown explanation. Evidence: the test's report, from TSK-0620.
7. A static check finds no player-facing string and no stored variant holding «Объяснитель» or "Explainer". Evidence: the static check's output and its failing fixture, from TSK-0615.
8. `npm run explain:generate` run with no session open fills trap groups, and the game then shows those variants. Evidence: the integration test's report, from TSK-0618.
9. After the parent hides a variant in the Parent Room, a simulated month never shows it. Evidence: the simulation's report, from TSK-0619.
10. At stage 0.2 acceptance, the parent reads 50 visible variants and judges the familiar's voice, whether each addresses the given answer and the trap, and whether any names a wrong operation, and `llm_log` gives the 90th percentile of the time from spend to shown explanation under 10 seconds. Evidence: the parent's judgement recorded in TSK-0615, and the percentile from TSK-0617's test until stage 0.2.
11. Every requirement ADR-0120 addresses lands in exactly one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the share of spends that fall back to the template over a simulated 30 days, which TSK-0617's test reports and ADR-0120 reverses on above 30 % over 14 days of play, and the 90th percentile of the time from spend to shown explanation against 10 seconds.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0612 A model's explanation text passes code checks for its schema, placeholders, length, numbers and step order before it is shown
      closes: REQ-0600, REQ-0610, REQ-0612, REQ-0614
      depends: none
- [ ] T-002 [P] TSK-0613 The forbidden-word and safety checks read the explanation with its placeholders unfilled and without her answer
      closes: REQ-0618, REQ-0620, REQ-0638
      depends: TSK-0612 - both checks are steps of its module.
- [ ] T-003 [P] TSK-0614 A blind solver reads the filled explanation with the task alone, and its answer must equal the engine's
      closes: REQ-0616
      depends: TSK-0612 - check 7 is a step of its module and runs on the filled text.
- [ ] T-004 TSK-0615 The Explainer writes as her familiar about her answer and its trap, and the Explainer never appears in the world
      closes: REQ-0602, REQ-0604, REQ-0606, REQ-0636
      depends: TSK-0612 - the reply passes its checks.; TSK-0613 - the reply passes the word and safety checks.; TSK-0614 - the reply passes the blind solve.
- [ ] T-005 TSK-0616 The cache keeps up to three visible variants for each group and shows them in turn
      closes: REQ-0628
      depends: TSK-0615 - the variants stored are the ones it produces.
- [ ] T-006 [P] TSK-0617 A failed or late explanation is replaced by the engine's template within 10 seconds, and the thread pays once
      closes: REQ-0622, REQ-0624
      depends: TSK-0615 - the fallback replaces what it generates.; TSK-0616 - the order variant, then template, reads the cache.
- [ ] T-007 [P] TSK-0618 `npm run explain:generate` fills trap groups with checked variants outside any session
      closes: REQ-0630
      depends: TSK-0616 - it fills the cache that task builds.
- [ ] T-008 [P] TSK-0619 The parent lists stored variants by group and hides any one from the player
      closes: REQ-0632
      depends: TSK-0616 - the list reads that task's cache.
- [ ] T-009 [P] TSK-0620 An explanation's text never enters a story event or the Master's memory
      closes: REQ-0634
      depends: TSK-0615 - the event is written where that task shows an explanation.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0612.
- After TSK-0612: TSK-0613 and TSK-0614.
- After TSK-0612, TSK-0613 and TSK-0614: TSK-0615.
- After TSK-0615: TSK-0616 and TSK-0620.
- After TSK-0616: TSK-0618 and TSK-0619, and with TSK-0615 TSK-0617.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0612 | REQ-0600, REQ-0610, REQ-0612, REQ-0614 |
| TSK-0613 | REQ-0618, REQ-0620, REQ-0638 |
| TSK-0614 | REQ-0616 |
| TSK-0615 | REQ-0602, REQ-0604, REQ-0606, REQ-0636 |
| TSK-0616 | REQ-0628 |
| TSK-0617 | REQ-0622, REQ-0624 |
| TSK-0618 | REQ-0630 |
| TSK-0619 | REQ-0632 |
| TSK-0620 | REQ-0634 |

The smallest set of tasks that would test the decision is TSK-0612, TSK-0614, TSK-0615 and TSK-0617. Together they show whether every number comes from the engine, whether the blind solve catches a wrong answer, whether the familiar's text reaches her, and whether a failure still gives her an explanation, which are the failures the decision's premortem names.

## Not covered

- REQ-2604, REQ-2606 and REQ-2716: the epic realising ADR-0100 closes them, in its tasks for the request classes and for the explanation budget, because the gateway owns the request classes and the budget; the tasks here build the caller that fills those classes and test its requests.
