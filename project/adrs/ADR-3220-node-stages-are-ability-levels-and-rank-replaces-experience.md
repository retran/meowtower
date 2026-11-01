---
id: ADR-3220
artifact: adr
status: approved
revised: 2026-11-01
addresses: [REQ-7960, REQ-7962, REQ-7964, REQ-7966, REQ-7968, REQ-7970, REQ-7972, REQ-7974, REQ-7976, REQ-7978, REQ-7980, REQ-8158, REQ-7986, REQ-7988, REQ-7990, REQ-7992, REQ-7994, REQ-7996, REQ-7998, REQ-8000, REQ-8004, REQ-8006, REQ-8008, REQ-8010, REQ-8012, REQ-8014, REQ-8016, REQ-8018, REQ-8020, REQ-8022, REQ-8024, REQ-8026, REQ-8028, REQ-8030, REQ-8032, REQ-8034, REQ-8386, REQ-8388]
supersedes: []
concerns: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3220. Each node is an ability with a level from its estimate, the rank is computed from those levels, and experience goes

## Decision

A node of the skill graph is an ability to the player. Its stage is the ability's level, from 1 to 5, and the record's word "stage" and the player's words "ability level" name one thing.

- Rule `level.v1` sets the level from the node's estimate, or, for a node with no evidence of its own, from ADR-3230's inference. Levels 2, 3, 4 and 5 start at lines 0.35, 0.6, 0.8 and 0.92. A node stays on level 1 until three answers stand behind it, so a prior alone never gives a level or a rank. A node rises as soon as the estimate reaches the next line, and falls after three observations in a row with the estimate at least 0.1 below its level's line. A node with olympiad tasks reaches level 5 only with two clean first attempts on them.
- A pure function of the event log and the active versions gives each node's level. Each change she is shown writes `ability_level_changed` with the node, both levels and the rule, and a recompute under new versions writes one such event per changed node with no warning or fall; this event replaces `level_up`.
- A level picks the node's candidate tasks: the node's templates, ordered by highest group and then steps, split into five equal bands, with band 5 led by olympiad templates. An empty band takes the nearest lower band. The Director's corridor keeps its shares.
- Rule `rank.v1` computes the rank. A rank's nodes are those with a typical group up to its own (ADR-3230), word-problem nodes included, each by its weight. The rank rises when 80 % of that weight stands at level 4 or higher, and falls when the share has stayed below 65 % on 14 played game days in a row. Rank S takes the same shares at level 5 over all nodes. The levels only qualify her: a higher rank reaches her through a story event within 3 adventures (ADR-3230), and that event writes `rank_changed`.
- After a second observation in a row below the line, the game shows a warning in the setting. A fall shows a story event that says what happened to the threads and how to mend them. Neither says anything about the player herself. A rise plays a ceremony and pays no item or currency. Nothing else is taken by a fall.
- The player's character sheet shows each ability with its level number, a bar to the next level and her rank letter. The raw estimate stays with the parent. The Parent Room lists falls and holds a setting that hides falls of rank.
- A content table ties ability levels to what they open, in the manner of a metroidvania: a place, a passage or a move in the Tower that an ability of a stated level opens. What a level opened stays open after a fall. An opening adds to the game and never blocks the campaign, because the story never waits for a rank or a level.
- The game accumulates no experience. Experience, `L`, its curve and the experience bar go, and the second attempt, the riddle's ending, a puzzle and a quest keep every other effect they have.

Once accepted, the record says what the game must do, and nothing works yet. After the plan, the sheet, levels, rank and falls work on tasks from the current task source. The Director reads the same candidate function when ADR-0070 is built. Characteristics, paths and level names stay out.

## Why

RES-4311 measured that a stage needs a count of observations more than a band: three in a row cut changes from 17 to 0.5 in 180 days and found a true drop in 12 days at a task every two days. It also found that 66 of 79 nodes span more than one group, so level can set difficulty, and 78 hold olympiad tasks. The owner then decided three things: no experience, everything computed from node levels, and that the player sees ability levels and rank because the game is an RPG. That last decision narrows RES-4311's conclusion 12, which gave "level" to the rank: the player's "level" is now the ability's, and the rank is a letter.

The 80 % and 65 % shares and the 14 days are my choices, set so a rank can't move on one bad week; the simulation in the plan tests them. Mueller and Dweck's result on ability praise is why the fall's text speaks of threads. "Ability" here is the game's word for a skill the player trains, so it doesn't conflict with that.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep experience and a fixed rank E | No new rules, nothing can fall | The owner removed experience, and a level that can't fall would pick tasks beyond her reach |
| A character level as the sum of node levels, beside the rank | One growing number, the classic RPG shape | The owner chose ability levels and rank; a sum also hides which ability fell |
| A level from counted checks, like the report's states | The parent checks it against attempts | It moves only on full blocks, so it can't follow daily play, and the owner made the estimate primary |
| Levels with no hysteresis | Simplest, reacts at once | 17 changes in 180 days for a steady player |

## What it costs

The parent reads two views of a node, a state and a level, which will sometimes disagree. A fall reaches a child with no evidence about how she takes it, and the parent carries that risk, with a setting to hide falls of rank. Ordering templates into bands by group and steps is a rough measure of difficulty. A level recomputed from the whole log costs a replay on read, as other projections do. 15 requirements go, and three new text sets arrive in three languages.

## What would reverse it

- The parent hides falls of rank and still sees distress from falls of ability levels in the first month: falls then stop showing to the player and only task candidates follow them.
- A replay of the player's log shows more than 1 change of level per node in 180 days on nodes her states call stable: the lines change.
- The first-month review shows band tasks missing the corridor's success share for two weeks in a row: the bands change.

## Consequences

- ADR-0070: the candidates of a slot come through the level's band. ADR-0140: experience goes and rank is computed. ADR-0320's ceremony plays on a rise of an ability level or rank. CAN-0070, CAN-0030 and CAN-0110 change, because the canon's rank never falls and its counters name experience.
- RES-0010's principle that only the parent sees skill estimates now reads as raw estimates.
- `level_up` stays in old logs and in the schema list, read by nothing, because the log is append-only. The player's existing log gives her levels at once.
- 15 requirements are withdrawn and 7 replace them, listed in each withdrawn file.

## How I will know it was realised

1. A simulation on `content/model.v1.json` with steady recall of 0.9 and a task every two days gives at most 1 change of level per node in 180 days, and a drop from 0.9 to 0.4 gives a fall within 14 days.
2. A simulated steady player has no fall of rank in 365 days.
3. No field, event or screen in `src/` carries experience, which a static check proves.
4. A Playwright test sees the sheet's level numbers, bars and rank, and sees no percentage.
5. A test plays a fall and finds a warning, the story event, no lost item and an entry in the Parent Room.
6. A test raises an ability to a stated level, finds its opening open, drops the level and finds it still open.
7. A test with the setting on hides a fall of rank from the player and keeps it in the Parent Room.

## What this does not settle

- The names of levels and ranks' ceremony texts, which the owner writes in the setting.
- Characteristics, paths and stats, which stay after the MVP.
- Holidays, which the owner left out for now.
- Which places and moves the abilities open, which the design of game situations settles. This record fixes only the mechanism and the rule that an opening stays.
- What a daily quest pays now that it gives no experience; it keeps its other grants.
- The Director's own build, which is ADR-0070.
- Premortem: the player sees a level fall after a bad afternoon and stops playing. The warning, the three observations and the parent's setting all act before that, and none is proven.

## Plan

0. A statistics reset: the event `stats_reset`, a confirmed route and a button in the Parent Room, so the player starts from nothing once testing is over (REQ-8386).
1. Turn the knowledge model on, by naming its version in `content/versions.json`, so the estimates exist. Levels from the log: rule `level.v1`, the simulation and a replay tool over the player's log, in `src/engine/` and `tools/` (REQ-7960, REQ-7962, REQ-7964, REQ-7966, REQ-7968, REQ-7970, REQ-7978).
2. Task candidates by level in `src/server/task-source.ts` through a function the Director can read (REQ-7972, REQ-7974, REQ-7976).
3. Rank from levels with its simulation (REQ-8158, REQ-7986, REQ-7988, REQ-7990). The rank is computed and stored in `rank_state`; the story event that gives it to the player (REQ-8034) comes with the Master.
4. The game holds no experience: the code never built any, so a static check keeps it that way, and the `level_up` event stays in the list because old logs hold it (REQ-7980, REQ-8020, REQ-8024, REQ-8026, REQ-8028, REQ-8018).
5. The character sheet (REQ-8010, REQ-8012, REQ-8014, REQ-8000).
6. Warning, fall event and the end of the row in three languages, with the canon's changes (REQ-7992, REQ-7994, REQ-7996, REQ-7998, REQ-8016, REQ-8022).
7. The openings table, with a first set of openings on existing hatches and portals, and the rule that they stay open (REQ-8030, REQ-8032).
8. The Parent Room's list of falls and the hide setting (REQ-8004, REQ-8006, REQ-8008).
