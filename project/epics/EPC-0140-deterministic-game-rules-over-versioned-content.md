---
id: EPC-0140
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0140
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Outcomes, progression, rewards and familiars run as deterministic server rules over versioned content data

Realises exactly ADR-0140: the three content files and their loader, the spell outcome and the badge, the streak and the clean rows, the room branch, the floor state and the chapter finale, the Guardian endings and the reward queue, the calibration test, experience and level, the daily quests and the nearest goal, the grants, the chests, the shop, the forge, the roster, friendship and evolution, the hatching names and the bestiary.

Until the epics realising ADR-0070, ADR-0090, ADR-0110, ADR-0170 and ADR-0330 exist, the tasks run on stand-ins: slots, verdicts and flags that tests set by hand, fixture pictures, a fixture day of play and fallback endings from the content file. Each task names what it leaves to those epics.

## Acceptance criteria

1. A replay test feeds a recorded adventure's log twice, with the same content versions, and gets identical outcomes, branches, states, grants, chests, shelf, quests, friendship and evolutions. Evidence: the replay tests' reports, from TSK-0647, TSK-0651, TSK-0652, TSK-0653, TSK-0654 and TSK-0657.
2. A test changes `content/thresholds.json` to version 2 and rebuilds the projections, and every past room branch and floor state stays as logged. Evidence: the rebuild test's report, from TSK-0647.
3. Unit tests cover each row of the badge mapping, each streak rule including resume and a new adventure, the rapid-guess and assisted-attempt caps in both shares, and the stateless floor. Evidence: the unit tests' reports, from TSK-0645, TSK-0646 and TSK-0647.
4. The simulation on the mixed profiles reports, for version 1, success in 55-75 % of rooms, cunning in at most 25 % of floor-days, triumph in 15-35 % and triumph chapters near half, or fails the build. Evidence: the simulation test's report, from TSK-0649.
5. A test plays one adventure with every answer «Не знаю» and gets the same experience, buttons, quest completions and friendship as the same adventure with every answer correct. Evidence: the comparison tests' reports, from TSK-0650, TSK-0651, TSK-0652 and TSK-0657.
6. A test plays the same state on the same day twice and gets the same chest, and a test with two categories tied shows the tie broken the same way whatever the answers. Evidence: the unit tests' reports, from TSK-0654.
7. Static checks fail the build on a notification API in the player's client, a payment SDK, a leaderboard route or a verdict-reading quest template, on a trick field read by any rule, an element-ring import from outcome or selection code, a canon threshold number, and a Guardian with fewer than three fallback endings. Evidence: the checks' fixture tests, from TSK-0651, TSK-0653, TSK-0659 and TSK-0648.
8. A test in a simulated first week shows the forge open on day 6 and the shop on day 8 of play, and neither before. Evidence: the tests' reports, from TSK-0655 and TSK-0653.
9. Every requirement ADR-0140 addresses lands in a closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the four target shares of the thresholds in force on the fixture profiles, which TSK-0649 reports for each version, and the number of content files that fail their schema at start, which TSK-0644's loader reports once. ADR-0140 reverses to thresholds relative to her own recent shares when no version meets all four targets, and TSK-0649 is where that shows.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-0644 Every number the game rules use lives in a versioned content file that the server validates and never half-loads
      closes: REQ-1728, REQ-1930, REQ-2158, REQ-2174
      depends: none
- [ ] T-002 [P] TSK-0645 A spell has three outcomes judged on the unassisted first attempt, and the answer reply carries its outcome and badge
      closes: REQ-1702, REQ-1704, REQ-1706, REQ-1712, REQ-1714, REQ-1742, REQ-1760, REQ-1762
      depends: none
- [ ] T-003 TSK-0646 The streak grows on clean unassisted first attempts, fires a clean row at 3 and every 5, and shows only as a garland
      closes: REQ-1708, REQ-1710, REQ-1746, REQ-1748, REQ-1750, REQ-1752, REQ-1754, REQ-1756, REQ-1758
      depends: TSK-0645 - the outcome and the rapid and assisted flags the streak reads.
- [ ] T-004 TSK-0647 A room takes its branch, a floor its state and a chapter its finale from the versioned thresholds, and the Director logs each decision
      closes: REQ-1700, REQ-1716, REQ-1718, REQ-1722, REQ-1724, REQ-1736, REQ-1738
      depends: TSK-0644 - the thresholds and their version.; TSK-0645 - the slot values and the caps.
- [ ] T-005 [P] TSK-0648 A Guardian always has its three endings, a missed reward always comes back within 7 sessions, and the canon names no threshold
      closes: REQ-1720, REQ-1726, REQ-1744, REQ-1764
      depends: TSK-0647 - the branch and state the endings and the queue key on.
- [ ] T-006 [P] TSK-0649 The build fails when the thresholds in force miss the target shares, and a new version needs a decision record that names it
      closes: REQ-1730, REQ-1732, REQ-1734, REQ-1740
      depends: TSK-0647 - the rules the simulation runs.
- [ ] T-007 [P] TSK-0650 Experience comes from effort, never falls, and the MVP shows no stats, paths or rank change
      closes: REQ-2000, REQ-2002, REQ-2004, REQ-2020, REQ-2022, REQ-2024, REQ-2028, REQ-2030, REQ-2032, REQ-2036, REQ-2038, REQ-2182
      depends: TSK-0644 - the amounts, the curve and the nine floors are content.
- [ ] T-008 TSK-0651 Daily quests count acts of play, the day count counts days played, and the game never reminds her to return
      closes: REQ-2006, REQ-2008, REQ-2010, REQ-2012, REQ-2014, REQ-2016, REQ-2018, REQ-2034, REQ-2132, REQ-2144
      depends: TSK-0644 - the quest pool and amounts are content.; TSK-0650 - the quest's experience and the level the goal reads.
- [ ] T-009 [P] TSK-0652 Grants follow one table in the content file, read no clock, and take nothing away
      closes: REQ-2100, REQ-2102, REQ-2130, REQ-2136, REQ-2138, REQ-2142, REQ-2148, REQ-2150, REQ-2152, REQ-2154
      depends: TSK-0644 - the grant table.; TSK-0645 - the clean, rapid and assisted flags a grant keys on.
- [ ] T-010 [P] TSK-0653 The shop sells for buttons at fixed prices from a shelf of six items that changes by the same rule every day
      closes: REQ-2112, REQ-2114, REQ-2118, REQ-2120, REQ-2122, REQ-2156, REQ-2160, REQ-2162, REQ-2164, REQ-2166, REQ-2168, REQ-2178
      depends: TSK-0644 - the catalogue and the prices are content.
- [ ] T-011 TSK-0654 A chest offers three rewards from the three largest shortfalls by rules she could compute, and answers never enter the choice
      closes: REQ-2104, REQ-2106, REQ-2108, REQ-2110, REQ-2134, REQ-2140, REQ-2146, REQ-2184, REQ-2186
      depends: TSK-0644 - the amounts are content.; TSK-0647 - the room branch and floor state the quality follows.; TSK-0653 - the cosmetic items and their categories.
- [ ] T-012 TSK-0655 The Thread Forge opens on day 6 of play with six recipes of three rows each
      closes: REQ-2126, REQ-2170, REQ-2172, REQ-2176
      depends: TSK-0644 - the recipes are content.; TSK-0653 - the items a recipe makes are catalogue items of its schema.
- [ ] T-013 [P] TSK-0656 The roster is six approved familiars, up to three more when their pictures are chosen, and Session 0 lets her choose and name a starter
      closes: REQ-1912, REQ-1914, REQ-1916, REQ-1918, REQ-1920, REQ-1922, REQ-1924, REQ-1926, REQ-1928, REQ-1932, REQ-1948
      depends: TSK-0644 - the roster is a versioned content file with a schema.
- [ ] T-014 TSK-0657 Friendship grows from shared scenes, a familiar evolves at set levels, and no answer changes either
      closes: REQ-1900, REQ-1902, REQ-1904, REQ-1908, REQ-1910, REQ-1934, REQ-1936, REQ-1938
      depends: TSK-0644 - the thresholds and costs are content.; TSK-0656 - the roster and its stages.
- [ ] T-015 [P] TSK-0658 A hatching offers the canon name first, lets her give her own, and never suggests a name already in use
      closes: REQ-1952, REQ-1954, REQ-3532, REQ-3534
      depends: TSK-0656 - the roster, the canon names and the moves.
- [ ] T-016 [P] TSK-0659 The bestiary is a projection of the creatures she met, and the element ring never reaches a task
      closes: REQ-1906, REQ-1940, REQ-1942, REQ-1944, REQ-1946
      depends: TSK-0656 - the roster, the elements and the first-stage pictures' ids.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0644 and TSK-0645.
- After TSK-0644: TSK-0650, TSK-0653 and TSK-0656.
- After TSK-0645: TSK-0646, and TSK-0652 once TSK-0644 is done as well.
- After TSK-0644 and TSK-0645: TSK-0647.
- After TSK-0647: TSK-0648 and TSK-0649.
- After TSK-0650: TSK-0651.
- After TSK-0647 and TSK-0653: TSK-0654.
- After TSK-0653: TSK-0655.
- After TSK-0656: TSK-0657, TSK-0658 and TSK-0659.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0644 | REQ-1728, REQ-1930, REQ-2158, REQ-2174 |
| TSK-0645 | REQ-1702, REQ-1704, REQ-1706, REQ-1712, REQ-1714, REQ-1742, REQ-1760, REQ-1762 |
| TSK-0646 | REQ-1708, REQ-1710, REQ-1746, REQ-1748, REQ-1750, REQ-1752, REQ-1754, REQ-1756, REQ-1758 |
| TSK-0647 | REQ-1700, REQ-1716, REQ-1718, REQ-1722, REQ-1724, REQ-1736, REQ-1738 |
| TSK-0648 | REQ-1720, REQ-1726, REQ-1744, REQ-1764 |
| TSK-0649 | REQ-1730, REQ-1732, REQ-1734, REQ-1740 |
| TSK-0650 | REQ-2000, REQ-2002, REQ-2004, REQ-2020, REQ-2022, REQ-2024, REQ-2028, REQ-2030, REQ-2032, REQ-2036, REQ-2038, REQ-2182 |
| TSK-0651 | REQ-2006, REQ-2008, REQ-2010, REQ-2012, REQ-2014, REQ-2016, REQ-2018, REQ-2034, REQ-2132, REQ-2144 |
| TSK-0652 | REQ-2100, REQ-2102, REQ-2130, REQ-2136, REQ-2138, REQ-2142, REQ-2148, REQ-2150, REQ-2152, REQ-2154 |
| TSK-0653 | REQ-2112, REQ-2114, REQ-2118, REQ-2120, REQ-2122, REQ-2156, REQ-2160, REQ-2162, REQ-2164, REQ-2166, REQ-2168, REQ-2178 |
| TSK-0654 | REQ-2104, REQ-2106, REQ-2108, REQ-2110, REQ-2134, REQ-2140, REQ-2146, REQ-2184, REQ-2186 |
| TSK-0655 | REQ-2126, REQ-2170, REQ-2172, REQ-2176 |
| TSK-0656 | REQ-1912, REQ-1914, REQ-1916, REQ-1918, REQ-1920, REQ-1922, REQ-1924, REQ-1926, REQ-1928, REQ-1932, REQ-1948 |
| TSK-0657 | REQ-1900, REQ-1902, REQ-1904, REQ-1908, REQ-1910, REQ-1934, REQ-1936, REQ-1938 |
| TSK-0658 | REQ-1952, REQ-1954, REQ-3532, REQ-3534 |
| TSK-0659 | REQ-1906, REQ-1940, REQ-1942, REQ-1944, REQ-1946 |

The smallest set of tasks that would test the decision is TSK-0644, TSK-0645, TSK-0647, TSK-0649 and TSK-0654. Together they show whether every number sits in a validated file, whether the outcome rests on the unassisted first attempt, whether a logged branch survives a threshold change, whether the thresholds meet the target shares, and whether a chest is the same for the same state, which are the failures the decision's premortem names.

## Not covered

- REQ-1950: a battle's outcome depending only on the player's tactical choices. Familiar battles come after the MVP, so no function exists to test; ADR-0140 fixes the rule they must follow, a pure function of the team, the moves chosen and the opponent with no seed, and TSK-0659's dependency check keeps the element ring out of every other rule until then. The epic that builds battles closes it.
- The calibrated thresholds themselves: they arrive in a later decision record named by version, after the stage 0.1 simulation on the real Director, and TSK-0649 holds the check they must pass.
- The screens and ceremonies that draw these results, which the epic realising ADR-0150 builds, the pictures of familiars, which ADR-0170 owns, and the Russian words, which the epic realising ADR-0160 owns.
