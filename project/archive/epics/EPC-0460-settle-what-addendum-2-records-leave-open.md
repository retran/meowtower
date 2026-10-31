---
id: EPC-0460
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0460
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every gap the addendum 2 records still leave open settles by ADR-0360's defaults, and eight requirements get replacements

Realises exactly ADR-0460: the 82 entries that settle what the addendum 2 specifications recorded as open, with the eight replacement requirements REQ-7500 to REQ-7514. The entries cut across 22 specifications, so the tasks group them by the part of the system each one changes: the model and its evidence, the plan and the Director, the generator and the task view, the gateway and the text gate, the report and verify, the sandbox, and the probe.

ADR-0460 changes rules that other epics build. Each task therefore runs on the fixtures and stand-ins of those epics and names what it leaves to them. Every probe task waits on the owner's amendment of the Russian-only rule in `CLAUDE.md` before it changes anything the player sees.

## Acceptance criteria

1. After the spec step's rewrite, each specification's open sections hold only findings their authors rejected, and the owner counts them against the 134 ADR-0460's classification names. Evidence: the owner's judgement at review, because only the owner can say a rule is stated once; no task builds it.
2. A route test finds `DELETE /api/parent/items/:itemId/exclude` logging `item_included` and the task counting again after the recompute, and `POST /api/session/:id/save` with the reason `puzzle` returning the branch with no closing scene. Evidence: the route tests' reports, from TSK-1156 and TSK-1158.
3. A replay of a log with a warm-up and a rapid guess after an observation leaves `lastSeen` at the observation's date, and a hinted retention check sets `nextReview` to the next day. Evidence: the replay tests' reports, from TSK-1156.
4. A generator test with a held node finds no candidate drawn, no fallback taken and `held_node_refused` returned, and a word problem's steps drawn from no held node. Evidence: the generator test's report, from TSK-1159.
5. A gateway test with a bucket that runs out finds a reserved check answered and an unreserved one refused, and a call at 00:30 UTC on the 1st takes the fallback. Evidence: the gateway test's report, from TSK-1163.
6. `tools/hypothesis-hold.ts` reports, for each H, the false-label rate with its 95 % Wilson interval and the number of hypotheses run. Evidence: the tool's output, from TSK-1167.
7. A lint fixture with `setTimeout` in `src/server/sandbox/` fails group 1, and a start-up test that deletes a `sandbox_action_applied` row finds it written back. Evidence: the fixture test's report and the start-up test's report, from TSK-1168.
8. The owner reads the settled specifications at the next review and finds each entry's rule stated once. Evidence: the owner's judgement at review, because the criterion asks whether a reader finds one rule for each entry, which no test reads.
9. Every requirement ADR-0460 addresses lands in exactly one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure one thing before it is finished: the number of entries whose rule a test already checks, which grows as each task lands, and the two defaults ADR-0460 marks for reversal, the token ceilings of TSK-1163 and the 10 CSS px tap threshold of TSK-1160, which stage 0.3's `llm_log` and the stage 0.2 acceptance on a real iPad measure.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-1156 Only unassisted first attempts feed the estimate, an excluded task can be restored and a hinted retention check counts as wrong
      closes: REQ-0914, REQ-0916, REQ-6842, REQ-6874, REQ-6890
      depends: none
- [ ] T-002 [P] TSK-1157 The model's block, uncertainty, number-sense stream and parameter gate follow the settled rules, and a submitted plan logs its choice
      closes: REQ-0950, REQ-0988, REQ-5318, REQ-7506, REQ-5646, REQ-7508
      depends: none
- [ ] T-003 [P] TSK-1158 Pocket-thread and twin events carry what the ledger needs, and a puzzle's state and save route follow the settled rules
      closes: none - its entries cite no requirement ADR-0460 addresses
      depends: none
- [ ] T-004 [P] TSK-1159 A word problem draws no step from a held node, an unanswerable problem asks for its estimate like a solvable one, and a frame's glossary words get spans
      closes: REQ-0784, REQ-0840, REQ-5300, REQ-5414
      depends: none
- [ ] T-005 [P] TSK-1160 The day's plan keeps both floors at a slow pace, a room slot names its floor's own domain and the track tasks follow one order
      closes: REQ-1040, REQ-7148, REQ-5248, REQ-5912
      depends: none
- [ ] T-006 [P] TSK-1161 The Volley's share, fact mix and intervals, the bare count and the school goal follow the settled rules
      closes: REQ-5858, REQ-5864, REQ-6424, REQ-7510, REQ-5824
      depends: none
- [ ] T-007 [P] TSK-1162 The masker and reply check hold from the MVP, the reference set holds every error class and a family's text form waits for its own pass
      closes: REQ-5278, REQ-7202, REQ-7210, REQ-7264
      depends: none
- [ ] T-008 [P] TSK-1163 Each role has its timeout and token ceiling, a reserved check is never refused and the month's reset spends the daily buckets
      closes: REQ-2726, REQ-5048, REQ-6412
      depends: none
- [ ] T-009 [P] TSK-1164 The text gate blocks Latin test names, the judge checks four System-line and joke rules, and the gate counts what it checks
      closes: REQ-3300, REQ-3304, REQ-3306, REQ-3318, REQ-5812
      depends: none
- [ ] T-010 [P] TSK-1165 A live frame moves to the library only after its checks, and a discarded reply counts as five rejected frames
      closes: REQ-3640, REQ-3644
      depends: none
- [ ] T-011 [P] TSK-1166 Report v1 has nine screens, its interval table covers every count, and a thin week pools up to four weeks
      closes: REQ-6064, REQ-6616, REQ-7502
      depends: none
- [ ] T-012 [P] TSK-1167 Check 5 waits for 20 on every cell, the hold tool reads its interval once, and each scope-guard trace names its backlog item
      closes: REQ-7500, REQ-7504
      depends: none
- [ ] T-013 [P] TSK-1168 Sandbox code can't start timers or change the flag, a reset is compared by table hashes and a start-up writes missing pointers
      closes: REQ-6324, REQ-6348
      depends: none
- [ ] T-014 [P] TSK-1169 A first encounter is computed from the log at its recorded versions, and a side slot takes a context she has met
      closes: REQ-6946, REQ-6956, REQ-7512
      depends: none
- [ ] T-015 [P] TSK-1170 A probe template names its family, every Dutch text passes its checks and the player's word cards reach the source question
      closes: REQ-6664, REQ-7110, REQ-7120, REQ-7122, REQ-7128, REQ-7150
      depends: none
- [ ] T-016 [P] TSK-1171 A letter's seed is its task's base seed, a family closes at its last presentation, and the day's letters follow the count of templates
      closes: REQ-7106, REQ-7136, REQ-7514
      depends: TSK-1160 (not blocking) - its planner counts the letters this task plans; it runs on a fixed 3 letters until then.

These tasks can run in parallel once their dependencies are done:

- From the start: every task, TSK-1156 to TSK-1171. No task needs another's output; the changes touch different parts, so each runs on the fixtures of the epics that own those parts.
- The one declared link, TSK-1171 after TSK-1160, is not blocking: the planner counts a fixed 3 letters until the schedule lands.
- Two tasks edit tables other tasks read: TSK-1156 adds `item_included` and TSK-1158 adds payloads to the same event catalogue of ADR-0020, so land them in separate pull requests and rebase the second.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-1156 | REQ-0914, REQ-0916, REQ-6842, REQ-6874, REQ-6890 |
| TSK-1157 | REQ-0950, REQ-0988, REQ-5318, REQ-7506, REQ-5646, REQ-7508 |
| TSK-1158 | none |
| TSK-1159 | REQ-0784, REQ-0840, REQ-5300, REQ-5414 |
| TSK-1160 | REQ-1040, REQ-7148, REQ-5248, REQ-5912 |
| TSK-1161 | REQ-5858, REQ-5864, REQ-6424, REQ-7510, REQ-5824 |
| TSK-1162 | REQ-5278, REQ-7202, REQ-7210, REQ-7264 |
| TSK-1163 | REQ-2726, REQ-5048, REQ-6412 |
| TSK-1164 | REQ-3300, REQ-3304, REQ-3306, REQ-3318, REQ-5812 |
| TSK-1165 | REQ-3640, REQ-3644 |
| TSK-1166 | REQ-6064, REQ-6616, REQ-7502 |
| TSK-1167 | REQ-7500, REQ-7504 |
| TSK-1168 | REQ-6324, REQ-6348 |
| TSK-1169 | REQ-6946, REQ-6956, REQ-7512 |
| TSK-1170 | REQ-6664, REQ-7110, REQ-7120, REQ-7122, REQ-7128, REQ-7150 |
| TSK-1171 | REQ-7106, REQ-7136, REQ-7514 |

The smallest set of tasks that would test the decision is TSK-1156, TSK-1159, TSK-1163, TSK-1167 and TSK-1168. Together they check the five claims ADR-0460 makes about what it settles without a requirement of its own to lean on: that the model counts only evidence that measures her, that a held node is refused before a draw, that a reserved check is never refused, that the hold's bar is read once over 2,000 hypotheses and that sandbox code can't change the flag. A wrong number among its defaults shows first in the ceilings of TSK-1163 and the threshold of TSK-1160, which the reversal conditions watch.

## Not covered

- REQ-1306: the full limits screen's twelve views after the MVP, because ADR-0460 only withdraws the sentence "adding views and no measures" and adds to `LimitsResult` the figures each view needs, each named by the decision that builds that screen, and no such decision exists. The epic realising it writes the figures and the views.
- The 134 findings their authors rejected, which stay in their files as records, and the 24 findings already settled by approved text; no code changes for either.
- Entries that change the wording of another record and no code: 33's "keeps its nine screens" in ADR-0380 and ADR-0450 (the requirement REQ-6064 itself is closed by TSK-1166), 38 (the backlog order is a numbered list in a review record), 39 (SPC-0190's file table), 40 (ADR-0420's Consequences), 47 (the colon in ADR-0270's cycle), 68's wording in ADR-0400 and 71 (`./tower` becomes `./meowtower` in ADR-0410 and ADR-0370 entry 15). The spec step carries them.
- The Russian wording of the restore control (entry 34) and of the probe screen's context control (entry 69), which ADR-0160 and the parent's review settle, and REQ-7404's open finding, which waits for the owner.
- Whether the hypothesis label ships at all, which ADR-0450's first reversal condition sends back to research; TSK-1167 changes the tool's bar and leaves that decision alone.
