---
id: ADR-0420
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-7000, REQ-7002, REQ-7004, REQ-7006, REQ-7008, REQ-7010, REQ-7012, REQ-7014, REQ-7016, REQ-7018, REQ-7020, REQ-7022, REQ-7024, REQ-7026, REQ-7028, REQ-7030, REQ-7032, REQ-7034, REQ-7036, REQ-7038, REQ-7040, REQ-7042, REQ-7044, REQ-7046, REQ-7048, REQ-7050, REQ-7052, REQ-7054, REQ-7056, REQ-7058, REQ-7060, REQ-7062, REQ-7064, REQ-7066, REQ-7068, REQ-7070, REQ-7072, REQ-7074, REQ-7076]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0420. After the MVP, the "home and school" screen sorts each linked goal and each entered Cito category into one of four quadrants or none, cutting each side on its own measure, computing every row on the Mac at request time and wording every quadrant as a check; in the MVP only the Cito form gains its optional category list

## Decision

The "home and school" screen of ADR-0310 replaces its two «измерения расходятся» (the measures differ) marks with four quadrants: high or low at home crossed with high or low at school (REQ-7000). Each row is a goal with a confirmed snapshot link or a category entry of a Cito result. A row lands in one quadrant only when both sides support a cut on their own scale, and otherwise in no quadrant with its reason on screen, because a wrong cell costs the parent more than an empty one (RES-4240, decided point 1). ADR-0380 owns what this builds on: the report's counts and 80 % Wilson intervals, the rule that each measure owns its «мало данных» (too little data) floor, the wording of interpretations as checks, the owner of each new event type and addendum 2's MVP scope. This record owns the quadrant rules, the Cito category floor, the category field of the Cito form, the category mapping file and the event type `cito_category_resolved`.

This record is written for the owner, who evaluates it, and for the building agent, who builds from it. Where I chose a default that the research and the requirements left open, the sentence says "I chose".

### The home side reads block scores of tested states only

A node's home reading comes from its row in ADR-0060's `node_snapshots` and the rule that produced it (SPC-0060), and from no inferred state, probe-only state or other stream (REQ-7002). A node counts as high when its rule is `block-slow`, `block-fast` or `stable`, which all rest on a block score of 4 or more, and as low when its rule is `block-low` or `block-mid`, a score of 3.5 or less (REQ-7004). A node under `probe-fast`, `open`, `none` or an inference rule has no home reading, so its row lands in no quadrant under «нет проверки блоком» (no block check). I chose this, because `probe-fast` rests on 2 tasks and REQ-7002 excludes a probe alone.

The owner records whether the school learning system times its goal tasks in `content/school-goal-catalogue.json`, as the field `goalTasksTimed`, which ships `false` (REQ-7006). I chose that file, because it already describes the vendor, carries a person's approval per version and holds nothing about the player. While the field is `true`, a goal row counts `block-slow` as neither high nor low, and Cito rows keep the cut above, because the Cito tests stay untimed (RES-4080).

A goal is high at home when every linked node is high, low when every linked node is low, and neither otherwise (REQ-7008), because "every linked node" is ADR-0310's own rule for the screen and a goal half high and half low has no single home reading. The goal row reads each node's state from the `node_snapshots` row of the last play day on or before the snapshot's document date (REQ-7010), and shows the node's current state beside it (REQ-7012). A goal whose linked node has no unassisted first attempt on or before that date, or whose last one lies more than 30 days before it, lands in no quadrant under «давно не проверялось дома» (not checked at home for a long time) (REQ-7014). Thirty days is ADR-0180's threshold for a node not checked for a long time.

### The school side of a goal row reads the status against its target

The goal row reads `school_values` of the latest snapshot by document date, as SPC-0310's screen already does. `reached` counts as high only on a target level of 3 or above (REQ-7016), and `needs_help` counts as low only on a target level of 3 or below (REQ-7018), because the vendor sets the target at or just above her own percentile and level 3 is the national 40th to 59th percentile (RES-4100). A `developing` status, an empty target level, a goal level of 0 and a status the parser couldn't place each put the goal in no quadrant (REQ-7020). A row whose status comes from a pair `school_snapshot_changes` marks `target_moved` keeps its quadrant and carries ADR-0310's target mark beside it (REQ-7022).

### A Cito row compares relative strength with relative strength

A Cito row is one category entry of the latest `external_test_recorded` for its moment that no later result replaces. Its school side reads the entry's signal: `below_notable` and `below_very_notable` count as low, a relative weakness, `above_notable` and `above_very_notable` as high, a relative strength, and `not_notable` as neither (REQ-7024). Cito compares each category with pupils of the same overall ability, so the category has no level of its own to cut (RES-4240, the finding on Cito's category analysis).

The home side of a Cito row is relative too. Its date is the Cito result's test moment, which the form records as a moment identifier such as `cito:M7` and no day. I chose to read the moment as the date of its horizon in force when the result was recorded, and as the date the result was recorded when no horizon names that moment, because the school picks its own day inside Cito's advised period and the horizon's date is the parent's best estimate of it (ADR-0290). The row reads each node's state at that date (REQ-7026).

A node counts as tested for a Cito row when its last unassisted first attempt lies within the 30 days before that date (REQ-7032) and its state then rests on a block rule, as above. The category's nodes are its mapped nodes, and the nodes outside it are the tested nodes of RES-0800's four domains that the category doesn't map, so M8 and G4, which RES-0800 puts in two domains each, count inside each category that maps them and outside the others, so T1 to T4 and the Sources track stay on neither side. I chose the four domains as the outside, because Cito compares the category with her whole maths score and T1 to T4 draw on several domains at once. The category is a relative strength at home when its share of tested nodes at a block score of 4 or more exceeds the outside share by at least the margin, and a relative weakness when it falls short by at least the margin (REQ-7030). The margin in percentage points is 100 times the square root of q(1 - q)(1/n_in + 1/n_out), with q the share over all tested nodes of both sides. With no tested node outside, the home side is neither under `home_no_outside`, and with q at 0 or 1 it is neither under `home_even`, because the difference there is 0.

Each Cito row shows the category's share at the test moment and its share over the nodes tested in the 30 days before today (REQ-7028). Each share carries its counts and ADR-0380's 80 % Wilson interval, and the difference carries ADR-0380's 80 % Newcombe interval, because RES-4200's requirements bind every share and difference the report adds.

### Small categories read on a floor scaled to their size

A Cito row lands in no quadrant when its category has fewer tested nodes than its floor. The floor is the smaller of 10 and the larger of 5 and three quarters of the category's mapped nodes, rounded up. This replaces REQ-7034's flat floor of 10, which Verhoudingen (8 mapped nodes) and Verbanden (7) can never reach, so two of Leerling in beeld's four domains would show no reading for as long as the game runs (REQ-7066). Getallen (34 nodes) and Meten en meetkunde (18) keep the floor of 10. Verhoudingen and Verbanden each need 6 tested nodes. A category that maps fewer than 5 nodes, which a typed category or an unconfirmed LOVS draft could do, never gets a reading, and its row says so under «в разделе меньше 5 узлов: сравнить нельзя» (the domain has fewer than 5 nodes: no comparison possible).

A category read on fewer than 10 tested nodes must also pass a one-node guard: the difference must stay at or past the margin, recomputed, after one inside node moves one class toward the outside share. A category with 10 or more tested nodes follows REQ-7030 alone, so this record changes no reading REQ-7030 already gives.

Each part carries a reason. RES-4240 set the flat 10 because at 5 inside nodes the margin is about 22 points, so a small category "could show a difference only when it is extreme" (decided point 4). That makes a small category's reading rarer, not less reliable: the margin already grows as n_in falls, from 16.2 points at 10 tested nodes to 20.1 at 6 (40 outside, q = 0.7), so a reading past it is as unlikely by chance as one at 10. What the margin doesn't cover is one block that flips class with no change in her, which happens about one block in four (RES-4240, the finding on block size). At 6 nodes one node moves the share by 16.7 points, and near q = 0.85 the margin falls below that: 5 of 6 inside against 33 of 40 outside is even, and one inside node rising to 6 of 6 gives 17.5 points against a margin of 15.7. A player who does well has a high q, so the guard covers that case at any q: moved back to 5 of 6, the pair is even again, and the row shows «разница держится на одном узле» (the difference rests on one node). Five is ADR-0380's default floor for a share with no floor of its own (REQ-6622). Three quarters keeps the reading about most of the domain, because Cito's category covers the whole domain and in a small category each node is a large part of it. I chose three quarters as a preference: half would let 4 of 8 Verhoudingen nodes stand for the domain, and all 8 would almost never fall inside one 30-day window. The row under its floor shows how many nodes were tested of how many mapped, such as «проверено 4 из 7 узлов за 30 дней до теста» (4 of 7 nodes checked in the 30 days before the test).

The floor and the guard register in ADR-0380's floor registry, `src/parent/measures.ts`, as the Cito category measure. This changes RES-4240's decided point 4 and REQ-7034. The requirements step must write a requirement that supersedes REQ-7034 with this text: "The screen MUST place a Cito row in no quadrant when its category has fewer tested nodes than its floor, the smaller of 10 and the larger of 5 and three quarters of the category's mapped nodes rounded up, and MUST show the tested and mapped counts in its reason. Below 10 tested nodes, the row MUST also be placed in no quadrant when the difference of REQ-7030 falls short of its margin, recomputed, once one of the category's nodes moves one class toward the share outside it."

### Every row in no quadrant says why

The screen shows one reason per row in no quadrant (REQ-7036), and the first reason in this order wins. Mapping and school reasons come first, because no amount of play changes them, so a home reason under them would send the parent to play for nothing; home reasons follow, because play or time can change them:

| Code | Row | String under `parent.school.quadrant.none.*` |
| --- | --- | --- |
| `category_unmapped` | Cito | «раздел не сопоставлен с узлами» (the domain isn't mapped to nodes) |
| `signal_other` | Cito | «сигнал Cito записан своими словами: выберите его значение» (Cito's signal is in its own words: choose its meaning) |
| `category_small` | Cito | «в разделе меньше 5 узлов: сравнить нельзя» |
| `school_unplaced` | goal | «школа не отметила статус, который можно сравнить» (the school gave no status that can be compared), with the case: `developing`, no target level, level 0 or unread |
| `school_target_low`, `school_target_high` | goal | «цель ниже середины: достигнутая цель не говорит о владении» (the target is below the middle: a reached target says nothing about mastery), and its mirror for a missed high target |
| `cito_not_notable` | Cito | «Cito: не отличается от ожидания» (Cito: no different from expectation) |
| `home_stale` | goal | «давно не проверялось дома» |
| `home_untested` | both | «нет проверки блоком» |
| `home_too_few` | Cito | «проверено k из m узлов за 30 дней до теста» |
| `home_split` | goal | «узлы цели дома по разные стороны» (the goal's nodes sit on both sides at home) |
| `home_speed_only` | goal | «дома не хватает только скорости, а школа её меряет» (at home only speed is missing, and the school measures it), while `goalTasksTimed` is `true` |
| `home_no_outside` | Cito | «вне раздела нет проверенных узлов: сравнивать не с чем» (no checked nodes outside the domain: nothing to compare with) |
| `home_even` | Cito | «дома разница с остальными узлами меньше порога» (at home the difference from her other nodes is below the margin) |
| `home_one_node` | Cito | «разница держится на одном узле» (the difference rests on one node) |

The Cito section shows, whenever a Cito result exists and whether or not it holds a row, «Cito не строит профиль по разделам для 10 % самых сильных и 10 % самых слабых учеников: если строк нет, это правило Cito» (Cito builds no domain profile for the strongest and the weakest 10 % of pupils: if there are no rows, that is Cito's rule) (REQ-7038).

### Each quadrant reads as a check with causes on both sides

Each quadrant shows its checks as links or sentences, and a link changes nothing in play by itself (REQ-7040, REQ-7048):

| Quadrant | Heading | Checks |
| --- | --- | --- |
| high at home, high at school | «Дома и в школе высоко» (High at home and at school) | confirm by the retention check, shown once RES-4220's decision exists |
| low at home, low at school | «Дома и в школе низко» (Low at home and at school) | a link to ADR-0180's lesson-mark form with the row's nodes filled in, then the nodes' trajectory once RES-4220's decision exists |
| high at home, low at school | «Дома высоко, в школе низко» (High at home, low at school) | the Dutch probe on the row's nodes, shown once RES-4250's decision exists; a link to ADR-0300's Sources track; the Dutch memo's question on test conditions |
| low at home, high at school | «Дома низко, в школе высоко» (Low at home, high at school) | a link opening ADR-0340's sandbox on the row's nodes (REQ-7050); the goal's or the category's wording beside the nodes' names; recalibration of the home tasks, as a sentence naming the nodes |

The two disagreeing quadrants name their possible causes on both sides, each as something to check (REQ-7042, REQ-7046). High at home and low at school reads «Что проверить. Дома: состояние может держаться на одном блоке из 5 ответов. В школе: формат заданий, язык, волнение, условия теста» (What to check. At home: the state may rest on one block of 5 answers. At school: the task format, the language, nerves, the test conditions). Low at home and high at school reads «Что проверить. Дома: задания игры могут быть сложнее или плохо откалиброваны, состояние может держаться на одном блоке. В школе: цель может проверяться в узком формате» (What to check. At home: the game's tasks may be harder or badly calibrated, the state may rest on one block. At school: the goal may be tested in a narrow format).

Every goal row carries ADR-0310's line «Школа и игра меряют разное: школа сравнивает с целью и с учениками по стране, игра считает ответы самой». Every Cito row carries «Cito и игра меряют разное: Cito сравнивает раздел с её общим баллом, игра сравнивает её ответы по узлам раздела с остальными узлами» (Cito and the game measure different things: Cito compares a domain with her overall score, the game compares her answers on the domain's nodes with her other nodes) (REQ-7044). I chose a line of its own for Cito rows, because ADR-0310's line names a target and national pupils, which a Cito category has neither of.

Each row lists its nodes with the basis of each state, «один блок» (one block) or «две проверки» (two checks) for `stable` (REQ-7054). A row where any node rests on one block carries «одна проверка» (one check) (REQ-7056). Every string lives under `parent.school.*` in ADR-0160's `ru.json`, where ADR-0180's label check and ADR-0160's forbidden-word list already run.

### Rows are computed at request time and feed nothing

`src/parent/school/quadrants.ts` is a pure function of an as-of date, today by default, over `school_values`, `school_snapshot_changes`, the confirmed snapshot links, `node_snapshots`, the Cito category projection and the two content files. `GET /api/parent/report/home-and-school` calls it on each request, on the loopback listener SPC-0310 already gives the route. No quadrant is written to the log or to `report_cache`, so a full recompute gives the same screen (REQ-7072). I chose no cache, because a snapshot holds at most 400 goals (ADR-0310) and a result a few categories, and a cached quadrant would outlive a correction.

No quadrant reaches the Director, the knowledge model or a model call (REQ-7052), and neither does a category entry (REQ-7074). ADR-0290's projection of Cito results, which the Director reads for horizons, folds named fields and never `categories`. The categories fold lives in `src/parent/school/cito-categories.ts`, which ADR-0310's checks `school_events_in_model` and `school_data_to_gateway` already fence off. A new lint check, `cito_categories_scope`, fails when a file outside `src/parent/school/`, the event's schema module and ADR-0290's results form module reads the `categories` field of `external_test_recorded`. The form module is allowed, because a correction shows the earlier result's list for editing, and the check still fails on any read from the Director, the model or the gateway, which import no form module. ADR-0310's check `school_snapshot_in_director` also fails on an import of `src/parent/school/` from `src/engine/director/`.

### The Cito form gains an optional category list in the MVP

The MVP's Cito form gains the optional field `categories`, a list of at most 16 entries (REQ-7058). I chose 16 as twice the 8 categories the list offers, because a printout can hold a second analysis such as «context en kaal». Each entry holds:

- `category`: one of `lib:getallen`, `lib:verhoudingen`, `lib:meten-en-meetkunde`, `lib:verbanden`, `lovs:getallen`, `lovs:optellen-aftrekken`, `lovs:vermenigvuldigen-delen`, `lovs:meten-tijd-geld`, or `typed` with `typedCategory`, the printout's words, at most 80 characters. The form labels each listed choice with its system, «Leerling in beeld» or «LOVS» (REQ-7060).
- `signal`: one of `below_notable`, `below_very_notable`, `not_notable`, `above_notable`, `above_very_notable` or `other` with `typedSignal`, at most 80 characters (REQ-7062).
- `deviationPercent`: an integer from -100 to 100, or `null` where the printout shows none. I chose the range, because the category's weighted score can't fall more than all of the expected score below it, and a value past 100 above it is a typing slip.

The field is optional, so an `external_test_recorded` written before it parses unchanged under the same schema version. A correction of a result replaces its whole list, as ADR-0290's `replaces` already does for every field. In the MVP nothing reads the list except the whole-log export, so it waits in the log for the post-MVP screen. After the MVP, the Dutch memo under `parent.cito.memo` gains the category analysis and the test conditions, such as reading aloud or extra time, among what the parent can ask the school for (REQ-7070). The memo is parent-facing Dutch with a Russian gloss in `ru.json`, so it needs no change to the Russian-only rule in `CLAUDE.md`. In the MVP the form's category list is itself the prompt: a parent who sees the field at the M7 entry knows the value exists and can ask for it.

### Categories map to nodes through one content file and the parent

`content/cito-categories.json` holds a `version`, its source and approval entry, and one list of nodes per listed category. The four Leerling in beeld domains carry RES-0800's table as REQ-7066 lists it, and a unit test fails when the file differs from those lists. The four LOVS categories ship drafted by the building agent from Cito's published descriptions and marked `confirmed: false`. A person confirms them in the file with the approving record, as ADR-0310's goal catalogue is approved (REQ-7068). Until then a LOVS row lands in no quadrant under `category_unmapped`.

After the MVP, the Parent Room's mapping panel of ADR-0310 lists each typed category and each `other` signal with no resolution, and the parent maps them (REQ-7064, REQ-7076). A resolution writes `cito_category_resolved`, owned by this record:

| Event | Payload, version 1 |
| --- | --- |
| `cito_category_resolved` | `kind`, `category` or `signal`; `typed`, the printout's words lower-cased with runs of spaces collapsed, at most 80 characters; for `category`, either `category`, one of the eight listed keys, or `nodes`, 1 to 40 node identifiers from ADR-0050's graph; for `signal`, `signal`, one of the five listed values; any of these `null` to undo |

A resolution is keyed by the typed words and never by a result, so the same words in a later result or a correction resolve once. I chose 40 nodes as the ceiling, because the largest domain maps 34. The latest resolution by `seq` wins, because the parent's latest choice is the one the parent meant, and two tabs resolving the same words leave the later one in force.

### What works once this is accepted, and what doesn't yet

In the MVP, the parent enters a Cito result with its category list, and nothing in play changes. After the MVP, the "home and school" screen shows each linked goal and each entered category in a quadrant with its checks, or in none with its reason, and the parent resolves typed entries. It works before a school snapshot exists, because Cito rows need only the form, and before any Cito result exists, because goal rows need only the snapshots.

The retention check, the trajectory link and the Dutch probe link stay hidden until the decisions from RES-4220 and RES-4250 exist. A LOVS row reads nothing until a person confirms the mapping. The quadrants aren't validated on real data: nobody has seen a Leerling in beeld category report, so whether its analysis keeps the LOVS signals is unconfirmed (RES-4240). Removing the post-MVP increment restores ADR-0310's screen without marks and leaves the form's field in place.

## Why

The addendum's cells assume one kind of "high" on each side, and RES-4240 found that none of the three sources supplies it. The status is relative to a target near her own level, a Cito category is relative to her own overall score, and the home state is a cut on 5 answers (RES-4240 findings on the status, the category analysis and the block). So each side is cut where its own measure supports a cut, and a pair the measures can't place goes in no quadrant. ADR-0310's reason for two marks only, that a finer rule needs an exchange rate nobody measured, still holds: every cut here stays on one scale, and no code maps a school value to a home state (REQ-6040).

The home cut is by accuracy, because the Cito tests are untimed (RES-4080) and a speed gap read as a knowledge gap sends the parent to the wrong check (RES-4240, decided point 2). The target guard at level 3 keeps a reached low target from reading as high (decided point 3). Cito rows compare relative with relative, inside nodes against outside nodes, with a margin of one standard deviation of the difference by chance (decided point 4).

The floor changes because the flat 10 turned out to exclude two whole domains, a gap REQ-7034's review recorded. Verhoudingen holds ratios, percentages and fractions, mostly set in context, and RES-4240 found that language load lowers context items more than bare ones (Hickendorff 2013). A screen that can never read Verhoudingen misses a row the language check could use.

Every check is a link or a sentence, because ADR-0310 keeps school data out of play and a quadrant is built from it (decided point 7). The causes are worded as checks on both sides, because item 1 of the owner's addendum 2 makes every interpretation a hypothesis, and a cause named on one side reads as a verdict (REQ-7046, which supersedes REQ-6042).

The category field enters the MVP, because the teacher's printout is the only copy of the value and the M7 result arrives before the post-MVP report (decided point 5).

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep ADR-0310's two marks | No new rule, no named cause, and the marks hold whatever exchange rate one assumes | The two agreeing cells, which the parent reads most, get no line and no check, and the owner's addendum 2 asks for four quadrants |
| The addendum as written: «бегло» or above against «понимает» or below, reached or needs help, a Cito level per domain | The owner's wording; every row fills a cell | A reached low target reads as high, a Cito level per domain doesn't exist, and a speed gap reads as a knowledge gap (RES-4240) |
| Goal rows only, Cito on the timeline | No form change and no teacher document to chase | Loses the one school measure that separates domains, which the language check needs |
| Quadrants on each side's own measure, with checks (chosen) | Each cell rests on a cut its measure supports; every cell is a check | Three kinds of "high" to learn; many rows in no quadrant |

For the small-category floor I compared four rules:

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep 10, and the row says why | No requirement changes; the strictest guard | Verhoudingen and Verbanden never read, two of four domains, for the life of the game |
| Drop the floor and let the margin alone decide | One rule; every category can read | At 3 tested nodes one flipped block moves the share by 33 points, past any margin, so a single chance block could make a reading |
| Count answers in place of node states, pooling 5 per node | Seven nodes give 35 observations, so the interval narrows | Changes the home measure REQ-7030 fixed, and the answers of one block aren't independent of the block that set the state |
| A floor scaled to the category, with a one-node guard below 10 (chosen) | Small domains read; one flipped block can't make a reading by itself at any q; large domains keep REQ-7030 unchanged | One more rule for the parent, and a preference in its three quarters |

## What it costs

The building agent writes the quadrant function, the reason order, 30 or so strings, the Cito category projection, the mapping file and its test, one event schema, the resolution panel, the form's list and the lint check `cito_categories_scope`. The form's list is the only part in the MVP.

The parent pays in attention. An M7 entry with categories takes 2 or 3 minutes more, and asking the teacher for the analysis is one more question, which the memo lists only after the MVP. Reading the screen means learning three kinds of "high", which the row's own line names. Resolving a typed entry takes under a minute and happens a few times a year at most.

The owner does two jobs once. The owner confirms the four LOVS node lists in `content/cito-categories.json`, about 30 minutes of reading the drafts against Cito's category descriptions, and until then every LOVS row sits under `category_unmapped`. The owner also finds out whether the vendor times its goal tasks, one question to the teacher or the vendor's help pages, and records it as `goalTasksTimed`; until then goal rows assume untimed tasks, as RES-4240 decided.

Interruption budget: none. The screen raises no notice, and the rows in no quadrant and the unresolved typed entries are a list the parent opens, never an alert. Nothing waits for the parent in real time. If nobody opens the Parent Room for two weeks or a month, nothing is lost and no queue grows: an unresolved typed entry stays one row in no quadrant, and the next request computes the screen from the log as it stands.

Ceilings on what accumulates: 16 category entries per result and 80 characters per typed field, as above; `cito_category_resolved` grows by the typed entries, a few a year, and the fold keeps one row per typed words and kind. The screen holds at most 400 goal rows from ADR-0310's ceiling plus 16 per result. The screen's build is a new baseline: p95 at most 1 s with a year of log on the family Mac, chosen because the parent waits on each open, and 1 s is a fifth of ADR-0180's 5 s report rebuild, which covers every report screen at once.

The security boundary protects her school data and her home states on one screen. Ordered by the likelihood of damage, it defends against:

1. A later change that feeds a category or a quadrant to the Director, the model or a model call. The lint checks and the property test below defend it.
2. A family device on the home network reading the screen. The loopback route of SPC-0310 defends it; the Cito form stays on ADR-0290's PIN session, as its other fields do.
3. The building agent committing a real printout. `content/cito-categories.json` holds node lists and category names only, and test fixtures are generated, as ADR-0310's are.

The strongest objection is that the classification margin and the interval shown beside it disagree. REQ-7030's margin is one standard deviation, while ADR-0380's 80 % Newcombe interval spans about 1.28 on each side, so a Cito row can sit in a disagreeing quadrant while the interval on its own row crosses zero. The parent then reads a cell the row's own figures don't support at 80 %. I accept this for now, because REQ-7030 is approved and the owner already revisits the one-deviation rule once a year of real home data exists, and the row's interval is on screen for the parent to read. The first reversal condition below watches for it. A second objection is that the floor still reads rarely in practice: 6 of 7 Verbanden nodes inside one 30-day window before a test needs play the Director may not schedule. The row then says «проверено 4 из 7», which tells the parent exactly what is missing.

## What would reverse it

- If, once at least 6 Cito rows have landed in a disagreeing quadrant, more than a third of them show a Newcombe interval that crosses zero, the margin moves to the interval's own bound, and REQ-7030 is superseded.
- If, over two school terms with at least 2 snapshots, at the owner's yearly review, more than half of the goal rows sit in no quadrant, the quadrants tell the parent less than ADR-0310's marks did, and the screen goes back to ADR-0310's two marks with the checks kept beside them.
- If a Leerling in beeld category report reaches the parent and holds no LOVS-style signal, the signal list and REQ-7062 are reopened.
- If RES-0800's table changes a domain's nodes, `content/cito-categories.json` changes with it, and the floor recomputes from the new count.
- If, once at least 4 small-category rows have landed in a disagreeing quadrant, the next test moment reverses more than half of them, the three-quarter rule is too loose and the floor goes back to 10.

Premortem, written as though it had happened: a year after the screen shipped, the parent had stopped reading it. Most goal rows sat in no quadrant under `school_unplaced`, because the vendor showed `developing` for most goals most months, and the Cito section held two rows. The one Verhoudingen row that did read, low at school and high at home, flipped at the next test with no lesson, because four of its six nodes rested on one block each. The parent had run the Dutch probe on it and found nothing. The first failure is why every row in no quadrant names its reason in the order of what would fix it. The second is why every row carries «одна проверка», why a small category must pass the one-node guard, and why the last reversal condition exists.

The owner checks the conditions above at the yearly review REQ-7030 names. The quadrant function takes an as-of date, so the owner recomputes the screen at each past snapshot's document date and each past test moment from the log with `./meowtower report home-and-school --as-of <date>`, and no quadrant has to be stored for it.

## Amends

- RES-4240, decided point 4: "at least 10 tested nodes in the category" becomes the scaled floor of ADR-0420, the smaller of 10 and the larger of 5 and three quarters of the mapped nodes, with the one-node guard below 10; REQ-7034 is superseded by the requirement named under Consequences.
- ADR-0310: "The screen marks a goal «измерения расходятся» (the measures differ) in two cases only ..." becomes: the screen sorts each linked goal and each Cito category entry into one of four quadrants or none, by ADR-0420's rules, and every goal row carries the line «Школа и игра меряют разное ...».
- ADR-0310: "One row per goal with a confirmed link" becomes: one row per goal with a confirmed link and one row per category entry of each current Cito result, in a Cito section of its own.
- ADR-0310: the mapping panel also lists typed Cito categories and `other` signals with no resolution, and its confirmation writes ADR-0420's `cito_category_resolved`.
- ADR-0310: `content/school-goal-catalogue.json` gains the field `goalTasksTimed`, shipped `false`, and the check `school_snapshot_in_director` also fails on an import of `src/parent/school/` from `src/engine/director/`.
- SPC-0310: the section on the "home and school" screen, from "The screen marks a goal «измерения расходятся»" to the end of that paragraph, becomes the quadrants, reasons, checks and lines of ADR-0420.
- ADR-0290: the results form's fields gain, after the expected test advice, an optional list `categories` of at most 16 entries, each with `category` or `typedCategory`, `signal` or `typedSignal`, and `deviationPercent`.
- ADR-0290: `external_test_recorded`'s payload gains the optional `categories`, and the projection of Cito results that the Director reads never carries it.
- ADR-0290, after the MVP: the Dutch memo's list "the level of the test taken, the expert view of the group report and the split between bare and context items" gains the category analysis and the test conditions, such as reading aloud or extra time.
- SPC-0290: the form's field list, the `external_test_recorded` payload row and the memo's list change as the three ADR-0290 lines above say.
- ADR-0020: the Event catalogue gains `cito_category_resolved`, owned by ADR-0420, and ADR-0210's table of owners gains it.
- ADR-0180: the lesson-mark form opens with nodes filled in from a link, and the mark is still written only when the parent submits it.
- ADR-0340: the sandbox's entry link takes a list of nodes and lists them at the head of the sandbox, each linking to that node's templates.
- ADR-0190: the Baselines table gains the "home and school" screen's build at p95 at most 1 s with a year of log on the family Mac, owned by ADR-0420, chosen, and group 1 gains the lint check `cito_categories_scope` and the test of `content/cito-categories.json` against RES-0800's table.

## Consequences

- If the owner records that the vendor times its goal tasks, `goalTasksTimed` turns `true` in a new approved version of the catalogue, and goal rows follow REQ-7006's cut with no change to this record.
- `./meowtower report home-and-school --as-of <date>` prints the screen's rows for a past date on the Mac, for the owner's yearly review.
- The requirements step writes a requirement that supersedes REQ-7034 with the text under "Small categories read on a floor scaled to their size".
- `content/cito-categories.json` ships with the four domains confirmed and the four LOVS categories drafted and unconfirmed.
- ADR-0160's `ru.json` gains the quadrant headings, the checks, the cause lines, the Cito line, the Cito section note and the reasons under `parent.school.*`, and, after the MVP, the memo's two new lines under `parent.cito.memo`.
- ADR-0210's scope guard keeps `src/parent/school/quadrants.ts`, `cito_category_resolved` and the resolution panel out of the tree until the MVP ends, while the form's `categories` field ships in the MVP.

Failure states, each with its next step and one audience:

| State | When | What the system does | Audience |
| --- | --- | --- | --- |
| each reason code above | a row supports no cut | shows the row in no quadrant with its reason | parent |
| `category_list_too_long` | the form sends more than 16 entries, or a typed field over 80 characters | refuses the save and names the limit it met, keeping what was typed | parent |
| `category_map_unconfirmed` | `content/cito-categories.json` holds LOVS categories with `confirmed: false` | LOVS rows show `category_unmapped`; `./meowtower status` lists the file once per version | owner |
| `category_map_drift` | the file's domain lists differ from RES-0800's table | verify fails and names the domain and the nodes | building agent |
| `cito_categories_scope` | a file outside `src/parent/school/`, the schema module and the results form module reads `categories` | verify fails and names the file | building agent |
| `quadrant_build_slow` | the screen's p95 passes 1 s in verify's measurement | recorded as a finding against the baseline, which doesn't move | building agent |

A `developing` status and a missing target level both reach `school_unplaced`, deliberately, because the parent's next step is the same: wait for the next snapshot.

## How I will know it was realised

1. A fixture of a snapshot and a 60-day log gives one quadrant per row that matches a table written by hand, for each quadrant and for each reason code.
2. A node at `block-slow` makes a goal high while `goalTasksTimed` is `false` and puts it under `home_speed_only` while it is `true`; a Cito row keeps it high both ways.
3. A goal whose linked node was last checked 31 days before the document date shows `home_stale`, and a node at `probe-fast` shows `home_untested`.
4. `reached` on target level 2 shows `school_target_low`, and `needs_help` on target level 4 shows `school_target_high`; a `target_moved` pair keeps its quadrant and shows the mark.
5. A Verbanden category with 6 of 7 nodes tested and a difference past the margin reads; with 5 tested it shows «проверено 5 из 7 узлов за 30 дней до теста». Getallen with 9 tested shows `home_too_few`. A typed category mapped to 4 nodes shows `category_small`.
6. At 10 nodes inside, 40 outside and q = 0.7, the margin the function computes is 16.2 points; with no outside node the row gives `home_no_outside`, and with q = 1 it gives `home_even`.
7. A category with 5 of 6 tested nodes high against 33 of 40 outside is even, and with 6 of 6 it shows `home_one_node`; the same case at 10 tested inside follows REQ-7030 alone.
8. A full recompute leaves the screen's JSON byte-identical, and the log holds no event written by the screen's route.
9. A property test over a 30-day simulated log finds `node_estimates`, `node_snapshots`, the Director's values and every gateway request body byte-identical with and without `categories` on the Cito events. A deliberate read of `categories` in `src/engine/director/` fails `cito_categories_scope`.
10. In the MVP, the form saves a result with 16 entries, refuses 17, saves a typed category and an `other` signal, and an earlier result with no `categories` still parses.
11. A resolution of typed words applies to the same words in a later result, and the later of two resolutions of the same words wins.
12. Following each check link writes no event and changes no Director input; the lesson-mark link writes `parent_tag_added` only after the parent submits.
13. The screen's build on the family Mac with a year of simulated log stays at p95 1 s or less.
14. The parent judges the quadrant headings, the cause lines and the two "measure different things" lines on a synthetic snapshot and Cito result before the feature's acceptance.

## What this does not settle

- The report's counts, intervals, the general «мало данных» floor, the four states and addendum 2's MVP scope belong to ADR-0380.
- The retention check, the trajectory and the Dutch probe belong to the decisions from RES-4220 and RES-4250; this record only links to them once they exist.
- Whether Leerling in beeld's category analysis keeps the LOVS form. The first real printout settles it.
- The LOVS categories' node lists. The building agent drafts them and a person confirms them.
- Any Dutch text shown to the player. The probe's Dutch waits on the owner amending the Russian-only rule in `CLAUDE.md`, and nothing here adds player-facing Dutch.
- The one-deviation margin of REQ-7030, which the owner revisits after a year of real data.
