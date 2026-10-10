---
id: EPC-0110
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0110
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Master narrates only from the Director's story events, inside checked scene orders, a hand-written canon with story memory and a safety pipeline that runs before any text shows

Realises exactly ADR-0110: the split between the Director and the Master, the strict order and reply, the canon filtered by checkpoint, the reply checks and `CheckedText`, the retry and the library, her text before a model reads it, creepiness and dreamcore, the pool and the parent's loop, names, the campaign, the planner, and the adventure prepared ahead.

Until the epics realising ADR-0100, ADR-0070, ADR-0140, ADR-0160 and ADR-0180 exist, the tasks run against a gateway stub, the stand-in order of `src/server/standin.ts`, a fixture word list and the Parent Room's stand-in page. Each task names what it leaves to those epics.

## Acceptance criteria

1. A test plays a simulated adventure with a gateway stub that never answers; every consequence of an answer shows without a wait, every scene comes from the library or the pools, and no unchecked text shows. Evidence: the simulation's report, from TSK-0600.
2. A test builds the prompt at each checkpoint and finds no text from a later checkpoint's sections. Evidence: the unit test's report, from TSK-0598.
3. A test feeds replies with an unknown speaker, an extra field, an effect outside the set, a missing branch, a digit, a forbidden word and a creepiness Score above the level; the service discards each, retries once and takes the library scene. Evidence: the unit tests' reports, from TSK-0597, TSK-0599 and TSK-0600.
4. A test runs the fixed trigger phrases and the labelled serious lines through the text path; each pauses the game with the fixed line and writes one notice, and none of their text reaches a mocked model. Evidence: the integration test's report, from TSK-0601.
5. A test gives the judge a lower level than the triggers found and the trigger's level holds. Evidence: the unit test's report, from TSK-0601.
6. A test runs one day's seed with the dreamcore variant on and off; the trials, their order, the floor budget and the task window are identical. Evidence: the plan test's report, from TSK-0604.
7. A test replays 30 days and finds at most one Underside slip in any 7 calendar days, each of 2 to 3 scenes that ends where it began. Evidence: the replay test's report, from TSK-0604.
8. In the first two weeks of play, `llm_log` shows a p95 wait after free text of 6 seconds or less, and `fallback_rate_high` fires on fewer than a third of adventures. Evidence: the latency test's report from TSK-0600 now, and the first two weeks of `llm_log` once the gateway's log of EPC-0100 exists.
9. The parent reads a week of the dialogue book and finds no line that breaks the judged rules: trials told as spells, Guardians who agree to let her pass, no fault in `alt` lines, the Reverse One's rules and text that fits the age the parent set. Evidence: the parent's judgement recorded in TSK-0610, TSK-0611 and TSK-0597.
10. Every requirement ADR-0110 addresses lands in exactly one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure three things before it is finished: the p95 of the wait after free text in the latency test of TSK-0600, the count of labelled positives for each checklist item in the test set of TSK-0599, and the share of scenes taken from the library in the simulated adventure of TSK-0600, which ADR-0110 reverses on above a third of the first month's adventures.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0596 The Director emits story events with no free strings, and the Master can import neither the maths nor the task engine
      closes: REQ-1600, REQ-1602, REQ-1608, REQ-1612
      depends: none
- [ ] T-002 [P] TSK-0597 The scene order and the Master's reply are strict schemas, and the whole reply is discarded when one rule fails
      closes: REQ-1604, REQ-1606, REQ-1610, REQ-1518, REQ-1840
      depends: none
- [ ] T-003 [P] TSK-0598 The prompt takes only the canon sections up to the current checkpoint, and nothing in the game writes the canon
      closes: REQ-1634, REQ-1636, REQ-1638
      depends: TSK-0597 - the builder fills the order that task defines.
- [ ] T-004 [P] TSK-0599 A Master reply reaches the screen only as `CheckedText`, after the schema, length, speaker, numeral, word and safety checks
      closes: REQ-1616, REQ-1548, REQ-1812, REQ-1814, REQ-3316, REQ-3320, REQ-3330
      depends: TSK-0597 - the schema is the first check.
- [ ] T-005 TSK-0600 A failed reply is retried once and then replaced from the library, and no consequence of an answer waits for a model
      closes: REQ-1614, REQ-1618, REQ-1620, REQ-1622, REQ-1624
      depends: TSK-0599 - a reply is retried when its checks fail.
- [ ] T-006 [P] TSK-0601 Hand-written triggers read her text on the Mac first, a serious signal pauses the game and no model lowers the level they found
      closes: REQ-1808, REQ-1816, REQ-1822, REQ-1824, REQ-1826, REQ-1832, REQ-1834, REQ-1836
      depends: TSK-0597 - the judge's signal runs beside that task's order.
- [ ] T-007 [P] TSK-0603 The parent sets a creepiness level of 0, 1 or 2, no line above it shows, and a fixed list of things never shows at any level
      closes: REQ-1514, REQ-1516, REQ-1520, REQ-1522, REQ-1524
      depends: TSK-0597 - the order's level field is that task's.
- [ ] T-008 TSK-0602 An everyday signal gets a warm answer and a quiet mark, and fear resolves the scene kindly and lowers the level for the day
      closes: REQ-1818, REQ-1820, REQ-1540, REQ-1542, REQ-1544
      depends: TSK-0601 - the paths branch from its trigger runner.; TSK-0603 - the level in force is that task's.
- [ ] T-009 [P] TSK-0604 A dreamcore floor changes only the decoration, and a slip into the Underside is rare, short and ends where it began
      closes: REQ-1526, REQ-1528, REQ-1530, REQ-1532, REQ-1534, REQ-1536, REQ-1538, REQ-1572, REQ-1574
      depends: TSK-0603 - the variant reads the level in force.
- [ ] T-010 [P] TSK-0605 A pool line enters play only after the parent approves it, a flagged scene teaches later orders, and every dialogue is saved
      closes: REQ-1550, REQ-1552, REQ-1556, REQ-1558, REQ-1838, REQ-1632
      depends: TSK-0599 - a line passes the check module at approval.
- [ ] T-011 [P] TSK-0606 She names and renames her heroine, familiars, items, floors, Tangles and room, and a name passes the content check first
      closes: REQ-1502, REQ-1660, REQ-1662, REQ-1664, REQ-1666, REQ-1668, REQ-1670, REQ-1672
      depends: TSK-0599 - a name passes its checks before use.
- [ ] T-012 [P] TSK-0607 The campaign runs from a calendar in a content file, its MVP stand-ins hold, and a cipher answer is play and never maths
      closes: REQ-1508, REQ-1658, REQ-1678, REQ-1680, REQ-1682, REQ-1684
      depends: none
- [ ] T-013 [P] TSK-0608 After each session the planner writes a summary and a plan of 5 to 7 beats, and two failures fall back to unused beats
      closes: REQ-1640
      depends: TSK-0599 - the plan passes the same checks as a reply.; TSK-0598 - it takes the filtered canon.
- [ ] T-014 [P] TSK-0609 The parent prepares the day's adventure ahead, previews it, and the approved one plays with no live model call
      closes: REQ-0105, REQ-0107
      depends: TSK-0600 - the pre-checked scenes come from its queue and library.
- [ ] T-015 [P] TSK-0610 The prompt tells every trial as a spell and every outcome as an event, and the parent judges a week of dialogues against the rules
      closes: REQ-1500, REQ-1504, REQ-1506, REQ-1554, REQ-1560, REQ-1566, REQ-1802, REQ-1804, REQ-1806, REQ-1810, REQ-2610
      depends: TSK-0597 - the rules sit in its order and prompt.; TSK-0598 - the rules are canon sections the builder serves.
- [ ] T-016 [P] TSK-0611 The Reverse One is always reversed, wants nothing of hers and is the only look-alike, and the game's music has no tick
      closes: REQ-1562, REQ-1564, REQ-1568, REQ-1570, REQ-1512
      depends: TSK-0599 - the checklist items run in its safety check.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0596, TSK-0597 and TSK-0607.
- After TSK-0597: TSK-0598, TSK-0599, TSK-0601 and TSK-0603.
- After TSK-0599: TSK-0600, TSK-0605, TSK-0606 and TSK-0611.
- After TSK-0598 and TSK-0599: TSK-0608.
- After TSK-0597 and TSK-0598: TSK-0610.
- After TSK-0603: TSK-0604.
- After TSK-0601 and TSK-0603: TSK-0602.
- After TSK-0600: TSK-0609.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0596 | REQ-1600, REQ-1602, REQ-1608, REQ-1612 |
| TSK-0597 | REQ-1604, REQ-1606, REQ-1610, REQ-1518, REQ-1840 |
| TSK-0598 | REQ-1634, REQ-1636, REQ-1638 |
| TSK-0599 | REQ-1616, REQ-1548, REQ-1812, REQ-1814, REQ-3316, REQ-3320, REQ-3330 |
| TSK-0600 | REQ-1614, REQ-1618, REQ-1620, REQ-1622, REQ-1624 |
| TSK-0601 | REQ-1808, REQ-1816, REQ-1822, REQ-1824, REQ-1826, REQ-1832, REQ-1834, REQ-1836 |
| TSK-0602 | REQ-1818, REQ-1820, REQ-1540, REQ-1542, REQ-1544 |
| TSK-0603 | REQ-1514, REQ-1516, REQ-1520, REQ-1522, REQ-1524 |
| TSK-0604 | REQ-1526, REQ-1528, REQ-1530, REQ-1532, REQ-1534, REQ-1536, REQ-1538, REQ-1572, REQ-1574 |
| TSK-0605 | REQ-1550, REQ-1552, REQ-1556, REQ-1558, REQ-1838, REQ-1632 |
| TSK-0606 | REQ-1502, REQ-1660, REQ-1662, REQ-1664, REQ-1666, REQ-1668, REQ-1670, REQ-1672 |
| TSK-0607 | REQ-1508, REQ-1658, REQ-1678, REQ-1680, REQ-1682, REQ-1684 |
| TSK-0608 | REQ-1640 |
| TSK-0609 | REQ-0105, REQ-0107 |
| TSK-0610 | REQ-1500, REQ-1504, REQ-1506, REQ-1554, REQ-1560, REQ-1566, REQ-1802, REQ-1804, REQ-1806, REQ-1810, REQ-2610 |
| TSK-0611 | REQ-1562, REQ-1564, REQ-1568, REQ-1570, REQ-1512 |

The smallest set of tasks that would test the decision is TSK-0597, TSK-0598, TSK-0599, TSK-0600 and TSK-0601. Together they show whether the order can carry maths, whether a later secret can enter the prompt, whether unchecked text can show, whether a failure reaches the player as a wait, and whether a model can lower a level the triggers found, which are the failures the decision's threats and premortem name.

## Not covered

- REQ-1828 and REQ-1830: the web push for a serious signal and the log of its failure arrive after the MVP, by the owner's decision of 2026-09-27; the notice in the Parent Room of TSK-0601 is the MVP's whole route.
- REQ-1674 and REQ-1676: items and creatures the game invents arrive after the MVP through a `reward_hint`, and the Parent Room's hide and redraw controls come with them.
- REQ-2714 and REQ-2726: the epic realising ADR-0100 closes both in TSK-0590, because that task holds the typed budget result they hang on; TSK-0600 here builds the queue that plays the library when the result comes.
- REQ-3712: TSK-0489 of the epic realising ADR-0040 closes it; TSK-0597 here reads the age from the parent's setting through the same rule.
