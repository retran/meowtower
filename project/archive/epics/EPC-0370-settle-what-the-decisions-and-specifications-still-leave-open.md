---
id: EPC-0370
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0370
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every gap the decisions and specifications still leave open is built to the rule ADR-0370 settles

Realises exactly ADR-0370: the 66 entries that settle a gap, grouped into 16 tasks by the part of the system they touch, and the three replacement requirements REQ-6500, REQ-6502 and REQ-6504. The 84 findings that their authors rejected stay in their files as records, and the 3 already settled elsewhere need no work, so no task covers them.

The entries are small rules over parts that other epics build, so the tasks change code that exists or code those epics are building. Each task names what it leaves to them. Because 66 entries outnumber the 16 tasks, each task holds the entries of one part of the system, and each acceptance criterion states the rule of the entry it closes.

## Acceptance criteria

1. After the specification step's rewrite, each specification's `## Open findings` and `## Open review findings` hold only findings their authors rejected, and the owner counts them against the 84 ADR-0370 names. Evidence: the owner's judgement at review, because the specification step does the rewrite and no task of this epic does; the count is a reading of the specifications.
2. A start-up test that deletes a `blobs` row finds the row back after start-up, and a replay of version 1 hint events finds every ladder read as paid. Evidence: the start-up test's and the replay test's reports, from TSK-1013 and TSK-1012.
3. A route test finds `next` repeated three times logging one `item_shown`, an expired-lease answer with no other holder getting its `AnswerOut`, and each of `estimate_missing`, `check_limit_reached`, `check_late` and `check_unparsed` with its status. Evidence: the route tests' report, from TSK-1014.
4. A replay of a log with a `fact_threshold_set` and a changed `content/versions.json` finds one full recompute at start-up and `derived_meta` holding the composite version. Evidence: the start-up test's report, from TSK-1012.
5. A content test over every `content/*.ru.json` and string file finds no form of «узелок», no guilt phrase and no numeral in scenes or branches, and every library scene with a minimum level. Evidence: the content test's report, from TSK-1019.
6. Verify, run with a template whose explanation fails the blind solve, fails with `explanation_template_rejected`, and run with a hand-added frame, doesn't count it. Evidence: verify's output, from TSK-1020 and TSK-1021.
7. ADR-0150's contrast script, run over its 20,000 seeded random custom palettes per mode, finds every colour `paletteVars` derives, the black and white fallbacks included, at or above its threshold on every surface. Evidence: the script's output, from TSK-1024.
8. The stage 0 acceptance record holds the three sound rows run on the spike page on a real iPad. Evidence: the owner's recorded acceptance of stage 0, from TSK-1025, as a judgement because only a real iPad flips the silent switch.
9. The owner reads the settled specifications at their next review and finds each entry's rule stated once. Evidence: the owner's judgement at review, because whether a rule is stated once is a reading.
10. Every requirement ADR-0370 addresses lands in exactly one closed task. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the 95th percentile of the wait from `free_text` to `scene_shown` over all four paths against 6 seconds, which TSK-1018's verify run reports, and the number of findings left under the specifications' open sections, which the owner counts against 84.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-1012 Version 1 events read as paid and adventure, and the threshold version joins both of its sources
      closes: REQ-5068, REQ-5152, REQ-5154, REQ-2230, REQ-5838
      depends: none
- [ ] T-002 [P] TSK-1013 The disk ceiling counts the live database, every projection has a class, and a lost blob row comes back
      closes: REQ-2210, REQ-2224
      depends: none
- [ ] T-003 [P] TSK-1014 A moved lease, a resumed adventure and a repeated `next` each have one answer a route test can assert
      closes: REQ-0204, REQ-0220, REQ-0222, REQ-0226, REQ-2432, REQ-2438
      depends: none
- [ ] T-004 [P] TSK-1015 A bought explanation comes back on resume, and the client sends every kind of event through one queue
      closes: REQ-0208, REQ-0214, REQ-2424, REQ-2434, REQ-5642
      depends: none
- [ ] T-005 [P] TSK-1016 The knowledge model fixes which check sets a state, when forgetting is read, and what a partial answer does
      closes: REQ-0912, REQ-0918, REQ-0926, REQ-0934, REQ-0956, REQ-0984, REQ-6402
      depends: none
- [ ] T-006 [P] TSK-1017 A Volley counts as two first attempts, and three measurement edge cases get one rule each
      closes: REQ-1040, REQ-6414
      depends: none
- [ ] T-007 [P] TSK-1018 A judge's `scared` label starts the fear path, a creepy scene has one definition, and the wait is measured on every path
      closes: REQ-1540, REQ-1544, REQ-1622, REQ-1662, REQ-1836
      depends: TSK-1026 (not blocking) - the bake-off's `scared` items; this task runs on recorded judge replies.
- [ ] T-008 [P] TSK-1019 Every library text carries a minimum level, names characters by id, and passes the numeral and guilt tests
      closes: REQ-1518, REQ-1520, REQ-1548, REQ-1620, REQ-3316, REQ-3320, REQ-3330
      depends: none
- [ ] T-009 [P] TSK-1020 Explanations are grouped by the kind of answer, hold only engine numbers, and are checked offline per template
      closes: REQ-0604, REQ-0616, REQ-0618, REQ-6500, REQ-6502
      depends: none
- [ ] T-010 [P] TSK-1021 An edited frame is accepted only after its checks, and verify counts only frames the log shows accepted
      closes: REQ-3606, REQ-3608, REQ-3636, REQ-3638
      depends: none
- [ ] T-011 [P] TSK-1022 The naming filter, the reward return, the chest slots and the assisted share each get one stated rule
      closes: REQ-1712, REQ-1716, REQ-1720, REQ-2108, REQ-3534
      depends: none
- [ ] T-012 [P] TSK-1023 A first start-up with no content stops, a floor's first triumph gives a special reward, and the day opens on «В прошлый раз…»
      closes: REQ-6234
      depends: none
- [ ] T-013 [P] TSK-1024 A custom palette always passes contrast, the voice button always leads somewhere, and art never uses pure black
      closes: REQ-2806, REQ-3234, REQ-3244, REQ-3402
      depends: none
- [ ] T-014 [P] TSK-1025 Marks can be removed, checks declare their stage, the stage is read from approvals, and the spike has a sound page
      closes: REQ-0952, REQ-1400, REQ-1402, REQ-2900, REQ-3008, REQ-5080, REQ-6158, REQ-6160, REQ-6162
      depends: none
- [ ] T-015 [P] TSK-1026 A judge passes by one stated agreement bar, providers come from one table, and the sandbox choices stand
      closes: REQ-1688, REQ-2512, REQ-2648, REQ-6348, REQ-6504
      depends: none
- [ ] T-016 [P] TSK-1027 The Director takes the least recently shown template, and four counters and notices get one rule each
      closes: REQ-5670, REQ-5796
      depends: none

Every task can run in parallel with every other, because none reads another's output.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-1012 | REQ-5068, REQ-5152, REQ-5154, REQ-2230, REQ-5838 |
| TSK-1013 | REQ-2210, REQ-2224 |
| TSK-1014 | REQ-0204, REQ-0220, REQ-0222, REQ-0226, REQ-2432, REQ-2438 |
| TSK-1015 | REQ-0208, REQ-0214, REQ-2424, REQ-2434, REQ-5642 |
| TSK-1016 | REQ-0912, REQ-0918, REQ-0926, REQ-0934, REQ-0956, REQ-0984, REQ-6402 |
| TSK-1017 | REQ-1040, REQ-6414 |
| TSK-1018 | REQ-1540, REQ-1544, REQ-1622, REQ-1662, REQ-1836 |
| TSK-1019 | REQ-1518, REQ-1520, REQ-1548, REQ-1620, REQ-3316, REQ-3320, REQ-3330 |
| TSK-1020 | REQ-0604, REQ-0616, REQ-0618, REQ-6500, REQ-6502 |
| TSK-1021 | REQ-3606, REQ-3608, REQ-3636, REQ-3638 |
| TSK-1022 | REQ-1712, REQ-1716, REQ-1720, REQ-2108, REQ-3534 |
| TSK-1023 | REQ-6234 |
| TSK-1024 | REQ-2806, REQ-3234, REQ-3244, REQ-3402 |
| TSK-1025 | REQ-0952, REQ-1400, REQ-1402, REQ-2900, REQ-3008, REQ-5080, REQ-6158, REQ-6160, REQ-6162 |
| TSK-1026 | REQ-1688, REQ-2512, REQ-2648, REQ-6348, REQ-6504 |
| TSK-1027 | REQ-5670, REQ-5796 |

The smallest set of tasks that would test the decision is TSK-1012, TSK-1014, TSK-1016, TSK-1018 and TSK-1026. Together they show whether old events replay as the settled rules read them, whether the play routes answer each state with one status, whether the model's new rules hold on a recompute, whether the `scared` label fires only on fear, and whether the judge's bar is reachable and guards the serious class, which are the two things the decision's premortem names: the bake-off that no local judge passes, and a `scared` label that starts the fear path on a story about a brave mouse.

## Not covered

- No requirement ADR-0370 addresses is deferred.
- The 84 rejected findings: they stay in their files as records, and a later reviewer can raise any again with a new reason.
- The 3 findings already settled by ADR-0360 entry 62, by ADR-0210's current text and by SPC-0310's failure table.
- The Russian wording of the dictation line, the remove and exclude controls and each floor's special reward: ADR-0160 and the parent's review.
- The guilt list's phrases beyond REQ-3316's two examples: the content step, reviewed by the parent.
- REQ-5130's missing twin on a ladder of one rung, and a raised-mode exception to REQ-1010: ADR-0220 and ADR-0360 keep them with their own reversal conditions.
- The replacement requirements' approval: the owner approves REQ-6500, REQ-6502 and REQ-6504 with ADR-0370, and the tasks build to their texts.
