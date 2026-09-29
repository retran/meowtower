---
id: ADR-0180
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-0711, REQ-0824, REQ-0826, REQ-0828, REQ-0834, REQ-0838, REQ-0846, REQ-1300, REQ-1302, REQ-1304, REQ-1306, REQ-1308, REQ-1310, REQ-1312, REQ-1314, REQ-1316, REQ-1318, REQ-1320, REQ-1322, REQ-1324, REQ-1326, REQ-1328, REQ-1330, REQ-1332, REQ-1334, REQ-1336, REQ-1338, REQ-1340, REQ-1342, REQ-1344, REQ-1346, REQ-1348, REQ-1350, REQ-1352, REQ-1354, REQ-1356, REQ-1358, REQ-1360, REQ-1362, REQ-1364, REQ-1400, REQ-1402, REQ-1404, REQ-1406, REQ-1408, REQ-1410, REQ-1412, REQ-1414, REQ-1416, REQ-1418, REQ-1420, REQ-1422, REQ-1424, REQ-1426, REQ-2300, REQ-2302, REQ-2304, REQ-2306, REQ-2308, REQ-2310, REQ-2312, REQ-2314, REQ-2316, REQ-2318, REQ-2320, REQ-2322, REQ-2324, REQ-2326, REQ-2328, REQ-2330, REQ-2332, REQ-2334, REQ-2336, REQ-2338, REQ-2340, REQ-2342, REQ-2344, REQ-2346, REQ-2348, REQ-2350, REQ-2352, REQ-2354, REQ-2356, REQ-2358, REQ-2360, REQ-2362, REQ-2364, REQ-2366, REQ-2368, REQ-2370, REQ-2372, REQ-2374, REQ-2376, REQ-2378, REQ-3518, REQ-3814, REQ-3710, REQ-3712]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0180. The Parent Room and its report are projections of the event log behind a PIN, with twelve limits, lesson rechecks and labels, and an export on the Mac only

## Decision

The parent's report is a set of pure functions over the event log of ADR-0020, cached in `report_cache` and served only to a parent session opened with the PIN. It has the eight screens of report v1, a limits table of twelve rows, lesson marks with two rechecks and four labels, and fluency thresholds kept per device type. The player's screens get none of it.

This record is written for the owner, who evaluates it, and for the building agent, who builds from it. Where I chose a default the research left open, the sentence says "I chose".

### Where the report lives and who can open it

The Parent Room is the `/parent` area of the same Preact client (ADR-0150). Its data comes only from the `/api/parent/*` routes of ADR-0030, and each of them answers 401 to a request without a parent session. `POST /api/parent/login` opens that session from the PIN. ADR-0010 owns the lockout after 5 wrong PINs for 15 minutes (RES-2500), and ADR-0030 owns the session's expiry after 30 minutes without activity (RES-2400). The player's routes carry schemas with no field for a node state, an estimate, a percentage or a topic name, so a player screen can't show them (REQ-2352, REQ-1426). ADR-0190's end-to-end scan checks the player's screens for them.

The Parent Room also hosts the panels other decisions define, behind the same session and in the tabs of the design's screen 26 (RES-3500). They are the settings with «Закончить на сегодня», the memo on talking with the child, the review queues for frames, lines, scenes, art and explanation variants, the bake-off screen, the Master pick, the cost line and its notices, and the alarm notice. This record owns the report, the limits, the lesson marks, the calibration, the glossary approval and the test mode, and places the other panels. What each placed panel holds belongs to the decision that defines it: ADR-0090, ADR-0100, ADR-0110, ADR-0120, ADR-0130 and ADR-0170.

The Parent Room holds the glossary panel: each entry pairs a Russian term with its drafted Dutch word, and the parent approves, edits or rejects it. Approval writes a `glossary_entry_approved` event, and the term hint shows the Dutch word only for an entry whose latest approval matches its current text (REQ-0846).

The settings panel holds the player's real name, age and school group, and the parent can change each at any time (REQ-3710). The owner decided on 2026-09-27 that these live in the Parent Room. A change writes a `settings_changed` event to the log in the local database, so the values never enter the repository or any tracked file, and every rule that needs one reads the latest setting (REQ-3712): ADR-0060 takes the prior row from the school group, ADR-0040 the readability band from the age, ADR-0110 the Master's `readerAge` from the age, and ADR-0100's egress guard the real name to clean it. The real name and the school group never leave the Mac (ADR-0100). I chose that the first setup asks for all three before Session 0 can start, because the priors, the readability limits and the Master's writing level all need them from the first task.

The parent's test mode, «Проверка игры» (RES-3500), plays against a separate database file, `data/test-profile.sqlite`, which starts empty or as a `VACUUM INTO` copy of the player's database. No projection of the player's record reads that file. Only the parent's notes and ambiguous-task marks cross back, as parent events in the player's log (REQ-3518).

### How the report is computed

The functions live in `src/parent/`. They read the projections ADR-0020 rebuilds from the log and the node states and estimates ADR-0060 computes, and write one `ReportModel` into `report_cache` with its `DerivedMeta` (model, threshold and graph versions and the last event sequence number). The server rebuilds `report_cache` on `adventure_completed`, `adventure_wrapped_up` and `session_ended`. It also rebuilds it when the Parent Room opens and `report_cache.lastEventSeq` is behind the log. So the report reflects every event of the adventure that just ended (REQ-2300). `GET /api/parent/report?at=` reads the daily snapshots of ADR-0060.

The skill map, the states and the «сама» (on her own) estimate come only from unassisted first attempts, because ADR-0060 feeds nothing else into them (REQ-2310). Assisted attempts reach the report only in the «с помощью» (with help) figures: the assisted estimate, «решает с подсказкой» (solves with a hint) and «почти готово» (nearly ready) (REQ-2312).

Every label the parent reads comes from the Russian content file of ADR-0160, never from a model. ADR-0160's forbidden-word list exempts the Parent Room, as RES-3300 resolves, so a check of this record's own, run by ADR-0190's verify, rejects «плохо», «отстаёт» and «невнимательная» in every `parent.*` value of the string file, and the parent judges the rest of the wording (REQ-2306). The report builds no lesson plan: no screen orders topics or proposes dates or exercises (REQ-2304). The parent judges whether the report answers what is mastered, where the frontier is and what holds her back (REQ-2302).

### Report v1 has eight screens

The dynamics screen waits until after the MVP (REQ-2308). The eight screens and what each shows:

| Screen | What it shows | Requirements |
| --- | --- | --- |
| Summary | last session; sessions and tasks this week; node counts by state for 1F, 1S and stretch; frontier by domain; one line per limit from the limits table; nodes not checked for more than 30 days; «почти готово» nodes; nodes whose errors all carry «возможна языковая причина» (possibly a language cause); each day's active time for the week, as the soft stop of ADR-0090 counts it, with «долгий день» (a long day) above 120 minutes | REQ-2320, REQ-2322, REQ-2318, REQ-2372, REQ-2376, REQ-2378 |
| VWO readiness | coverage of 1F, of 1S and of stretch as three separate figures; the three measures, the ladder, the inferred figure beside it, the disclaimer, and the MVP mark «предварительно: без контрольных прогонов»; the gap list, which never holds a stretch node; the mastered stretch nodes listed as the ceiling above 1S | REQ-2330 to REQ-2350, REQ-0824, REQ-0826, REQ-0828 |
| Graph map | every node with its state label from RES-0900, hatching for inferred states and a ring around each frontier node; under the word-problem domain, a matrix of problem type by number of steps with modelling errors counted apart from calculation errors | REQ-2314, REQ-2374, REQ-0834, REQ-0838 |
| Node card | the state, the «сама» estimate with its uncertainty, the share of correct assisted attempts under «решает с подсказкой», every task as shown with her answer, the correct answer, time, help and review, the language-cause mark per attempt, and the state history with lesson marks and labels | REQ-2314, REQ-2316, REQ-2328, REQ-2368 |
| Misconceptions | traps that fired, grouped by misconception across nodes, by frequency, with up to 3 examples a row; below them, every answer or step the engine didn't recognise, listed as unclassified with its task for the parent to review | REQ-2324, REQ-2326, REQ-0711 |
| Limits | one row per limit, as the next section sets out | REQ-2356, REQ-2358, REQ-2360, REQ-2370 |
| Science | for each topic, every question she answered, her first option and the misconception a wrong option names; a misconception chosen twice or more is marked as a topic to talk about; no score, state or percentage | REQ-2362, REQ-2364, REQ-2366 |
| Story book | scenes and dialogues by session, as ADR-0110 provides them | REQ-2308 |

The node card draws each task from the `shown` view of its `item_shown` event, so the parent sees exactly what the player saw. A node is «почти готово» when its state is below «бегло» (fluent) and its assisted estimate is at least 0.7 over at least 3 assisted attempts in the last 30 days (RES-2300). A node counts as not checked for a long time when its last unassisted first attempt is more than 30 days old (RES-2300, RES-0900). The misconceptions screen groups by the misconception identifier that ADR-0040 gives each trap, so «длиннее — больше» (longer means bigger) in D1 and P1 is one row. I chose the cap of 3 examples a row so a frequent trap doesn't push the rest off the screen; the node card holds every attempt.

The word-problem matrix counts unassisted first attempts on T1 to T4 by the classical problem type each template declares (RES-0800) and by its number of steps. Where a problem asks her to choose a model before solving, a wrong model choice counts as a modelling error. A wrong answer after a right model counts as a calculation error, so the parent can tell "didn't understand the problem" from "understood it but miscalculated". Every figure in the report reads only the base graph layer, and a report that mixes layers appears only as a choice the parent makes once a second layer exists (REQ-3814); the MVP has one layer.

### The VWO ladder counts verified states against thresholds kept as versioned data

The block shows 1F coverage, the 1S margin and the ceiling (REQ-2330). The ladder counts verified states only and treats an unverified or cut-off node as not covered (REQ-2332, REQ-2336). Inferred states appear as a separate figure beside it (REQ-2334). The steps follow RES-2300: «1S покрыт без запаса» at 90 % of 1F and 90 % of 1S nodes verified at «понимает» or above with no 1F node in «не освоен»; «1S с запасом» adds 80 % of 1S nodes in «бегло» or «устойчиво»; «1S с запасом и потолком выше» adds 3 stretch nodes in «бегло» or «устойчиво»; otherwise «1S ещё не покрыт» (REQ-2338 to REQ-2344). The block always shows the disclaimer of REQ-2348 and, in the MVP, the preliminary mark (REQ-2350).

The thresholds live in `content/thresholds.json` under `vwo`, with a `version` and a content hash recorded in `content/thresholds.lock`. A static check in ADR-0190's verify fails when the section's content changed and its version didn't, so a new value needs a new version (REQ-2346).

### Limits are computed per session from play and smoothed over 7 sessions

The `limits` projection computes one `LimitsResult` (RES-2550) per session, only from tasks the player answered in play, and never asks for a task given only to measure a limit (REQ-1300). All twelve limits are measured from the MVP on, the language-risk limit included (REQ-1346). Every timing is the device-measured answer time, which excludes time in the background or paused (RES-2500), and an attempt marked `interrupted` gives accuracy but no time (REQ-1304). The report shows each limit smoothed over the last 7 sessions, or over as many as exist (REQ-1302). I chose how to smooth: a share pools its numerators and denominators over the 7 sessions, a median is the median of the pooled times, and a count is the mean per session, because pooling keeps a short session from weighing as much as a long one.

| Limit | Measure | Requirements |
| --- | --- | --- |
| Holding steps | `stepsHeld`: the largest k whose last 2 counted attempts on k-step word problems, both within 30 days, are right; empty until some k has 2. Every unassisted first attempt on a k-step problem from a Guardian or a room counts, unless it is a rapid guess or excluded; a partial answer counts as not right | REQ-1318, REQ-1320 |
| Endurance | median time at each control-fact point, from times-table control facts only: 2 at the start, 2 at the end, 2 in each extension; a time flag when the last point's median passes 1.5 times the first; a separate accuracy flag when the last point has a mistake and the first has none; each extension compared with the start and the end | REQ-1310, REQ-1312, REQ-1314, REQ-1316 |
| Speed of the basics | median time of correct answers on A1, A3, A4 and A6a, and the 8x8 heat map as a table | REQ-1322 |
| Mental or written | accuracy per node with a scratchpad opened and without, from the `scratchKind` each attempt records | REQ-1324, REQ-1326 |
| Error type | shares of conceptual, procedural, computational and unclassified mistakes | REQ-1328 |
| Carelessness | mistakes on a node that was «бегло» at that moment, with the answer one digit or one transposition away | REQ-1330 |
| Impulsiveness and rapid guesses | share of wrong answers faster than 30 % of the task's fluency threshold; share of rapid guesses per session, with ADR-0070's `rapid_guess_flag` above 15 % | REQ-1332, REQ-1334 |
| Avoidance | runs of 3 «Не знаю» (I don't know) in a row, and rest stops offered | REQ-1336 |
| Anxiety | runs of 3 `alt` outcomes in a row, and a rapid-guess share in the last third of a session higher than in its first two thirds | REQ-1338 |
| Flow | success share by session and by floor against 70-80 %, and the share of review slots | REQ-1340 |
| Language risk | mistakes on tasks with a risk term whose explanation she didn't open, listed by term and node | REQ-1342, REQ-2370 |
| Help | hints before the answer with their level, «Не знаю» on first attempts, second-attempt correctness, detailed explanations opened with reading time, and the share of assisted first attempts, with ADR-0070's `help_share_flag` | REQ-1344 |

The data model classes a mistake as `conceptual`, `procedural`, `fact`, `slip` or `unclassified` (RES-2550). I chose to report `fact` and `slip` together as computational, because REQ-1328 names four classes and both are errors of calculation. The state "at that moment" for carelessness is the node's state computed from the events before that attempt. An attempt carries «возможна языковая причина» when it is wrong, its task lists a risk term, and she didn't open that term's explanation.

The limits screen shows each row's value, the number of sessions behind it and its flag, and «мало данных» (too little data) in place of the value when fewer than 3 sessions hold data for that limit (REQ-2356, REQ-2358). It shows no charts and no split by part of the session or by task kind (REQ-2360). Avoidance and anxiety read as observations with a prompt to talk, in wording the parent judges (REQ-1308). After the MVP the full limits screen adds the views of REQ-1306 over the same `LimitsResult`, so it adds views and no measures.

### Fluency thresholds are external, per device type and versioned

The `thresholds` projection holds one value per template and device type, iPad or computer, with a version (REQ-1362). A template starts at its catalogue value (RES-1200, RES-1300) plus the Session 0 motor correction: her pure-input time minus the reference time, times the number of key presses in the template's answer (REQ-1350). Where Session 0 is missing on a device type, the value is max(catalogue, 2.5 x the median time of an adult who solves 3 tasks of the node in the Parent Room) (REQ-1352). The adult's tasks write `calibration` events that no player projection reads. Where neither exists, I chose to use the catalogue value alone and show the parent that the device type isn't calibrated, because a missing threshold would stop every time-based limit.

The only input from the player is the motor correction, so no threshold is fitted to her times on target nodes (REQ-1348). Once a device type's last calibration is 30 days old, the projection marks the 10 pure-input tasks of Session 0 as due on it, and ADR-0090 places them in that device's next adventure as story (REQ-1354). I chose 30 days to read "once a month". Each update writes a new threshold version and keeps the old one, and a new version starts the full recompute of ADR-0020 (REQ-1356).

The catalogue lives in `content/`, which the `tower` service mounts read-only, so the running game can't change it (REQ-1358). `content/thresholds.lock` names, for the catalogue's current hash, the decision record that approved it. ADR-0190's verify fails when the catalogue's hash has no entry naming an approved record in `project/adrs/` (REQ-1360). A "fast" probe passes only when every task in it finishes within its threshold; ADR-0060 applies that rule with the thresholds from this projection (REQ-1364).

### Lesson marks start two rechecks and four labels

`POST /api/parent/tags` writes `parent_tag_added` with the nodes or subtypes, the lesson date and an optional note (REQ-1400). The `parent_tags` projection opens two recheck windows, counted in game days from the day of the mark: recheck 1 from day 1 to day 3 and recheck 2 from day 12 to day 16 (REQ-1402, REQ-1404). The Director of ADR-0070 reads the open windows through its recheck term and collects a full block (RES-0900) inside each; ADR-0070 decided that recheck tasks sit outside the cap of 4 parent-topic tasks a day, so a block of 5 tasks fits the window. A recheck is done when a full block forms inside its window.

For the labels I chose to count as a check only a state computed from a full block, because RES-0900 makes a full block the evidence for a state and both rechecks are blocks. An inferred, unchecked or cut-off state is never a check. The labels follow the order «Пока не освоено», «Понимает», «Понимает, нужна скорость», «Бегло», «Устойчиво»:

- «Улучшилось после урока» when the node or one of its prerequisites in the graph of ADR-0050 has a lesson mark, and the state at a check after the mark is higher than at the last check before it (REQ-1406);
- «Улучшилось без урока» when the state at a check is higher than at the previous check and neither the node nor any prerequisite has a mark in the 30 days before it (REQ-1408);
- «Сохранилось» when recheck 2 gives a state no lower than recheck 1 (REQ-1410);
- «Не сохранилось» when recheck 2 gives a lower state than recheck 1 (REQ-1412).

A node with no check before the mark gets no improvement label, and its history shows the first checked state, because the report has nothing to compare it with.

Until the dynamics screen arrives, the dynamics views are the node card's state history and the lesson labels. They use only unassisted first attempts from blocks, probes and review (REQ-1414), never show or add inferred states (REQ-1416), and carry «без контрольных прогонов: сравнимость ниже» until Ascents exist (REQ-1418). A time comparison uses tasks from one device type only (REQ-1420); an accuracy comparison may span both (REQ-1422). When the template versions behind a comparison differ, the comparison carries «контент изменён» (REQ-1424).

### Export and the PDF snapshot

The Parent Room's tab «Выгрузка данных» (Data export) runs the export ADR-0020 defines, and shows it only when the Parent Room is open on the Mac. After the MVP the export adds a PDF snapshot made through the browser's print from a print stylesheet of the report screens, with no PDF library on the server (REQ-2354).

### What works once this is accepted, and what doesn't yet

Once this is built on ADR-0010 to ADR-0170, the parent opens the Parent Room with the PIN after an adventure and reads eight screens that include that adventure. She marks a lesson and sees the rechecks land and the label appear. The twelve limits fill from the first session and show «мало данных» until the third. Thresholds follow each device's calibration.

The dynamics screen, the full limits views, the anxiety signals from erasures, hesitation and phrases, and the PDF snapshot don't work yet. Neither does the web push for alarms, which RES-3000 moves after the MVP. The play loop doesn't depend on this record: without the Parent Room the game still plays and logs, and every screen here can be rebuilt from the log later.

## Why

The research fixes most of the content, so the choice here is where the report is computed and how it stays true. A report computed from the log is the only kind that survives a new model or threshold version, because ADR-0020 and RES-2200 recompute the whole history and keep the old snapshots (RES-0900 conclusions 2 and 3). A report stored as its own truth would keep answers the new version no longer gives.

Rules the parent can check beat probabilities she can't, so every state, label, step and flag comes from an explicit rule over counted attempts (RES-0900 conclusion 15, RES-2300). That is why «почти готово» uses the state and not `pKnow`, and why the ladder counts verified states only.

The simplified limits table and «мало данных» exist because two weeks of daily play is the whole evidence at MVP acceptance (RES-3000), and one day's value would read as a trait (RES-2300). External thresholds keep growth visible, because a threshold fitted to her times would call her fluent whenever she beat her own average (RES-1300). Separate thresholds per device type exist because a touch keypad and a keyboard differ in input speed (RES-2500).

The rechecks and labels follow RES-1400 and the defaults the requirements step chose. Counting only full blocks as checks keeps a two-task probe from flipping a label. The PIN and the route split exist because the child must never see her estimates (RES-0010 conclusion 8, RES-1400 conclusion 10).

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: the parent reads the exports in DuckDB or pandas | no screens to build, and every fact is there | the parent would compute states, ladders and limits by hand after each adventure; nothing answers the three questions of REQ-2302 in a form she reads in minutes |
| Compute the report on each request, with no `report_cache` | never stale, one code path fewer | every Parent Room page would replay the knowledge model over the whole history; `?at=` still needs stored snapshots, so the cache comes back anyway |
| Keep report tables updated in place as events arrive | the cheapest read, the most familiar pattern | a new model or threshold version couldn't rebuild them, which breaks ADR-0020 and REQ-1356; a bug would leave wrong numbers with no way to recompute |
| A business-intelligence tool, such as Metabase or Grafana, over a SQLite snapshot | charts, filters and drill-down for free | one more service in Docker with its own login; its labels and colours aren't the design's; the non-judgemental wording, the ladder rules and the PIN would all need rebuilding inside it |
| Limits from dedicated measurement tasks | cleaner data per limit | REQ-1300 forbids it, and each such task takes a slot from a 60-minute adventure the owner has fixed (RES-1000) |

## What it costs

The building agent writes eight screens, twelve limit functions, a threshold projection with an adult calibration mode, the lesson projection and its labels, and the checks that go with them. That is most of stage 0.2 beside the domains (RES-3000).

Report rebuilds cost server time on the Mac. I chose budgets of 5 seconds to rebuild `report_cache` after an adventure and 60 seconds for a full recompute of a year's log, which I estimate at about 150,000 events: 365 days, about 40 attempts a day and about 10 events per attempt. Both budgets are chosen, not imposed, and stand in the Baselines table of ADR-0190.

The parent pays in attention. Marking a lesson takes about a minute. An adult calibration takes 3 tasks for each node, about 237 tasks for 79 nodes, and is needed only where Session 0 is missing on a device type. Reading the report is optional work that nothing forces.

If nobody opens the Parent Room for a month, nothing piles up that needs a person. The report keeps rebuilding. No recheck happens because no lesson was marked. The monthly motor check runs in play on its own. The one queue is the uncalibrated-device notice, which stays until someone acts on it or Session 0 runs on that device.

Accumulating data has these ceilings. `report_cache` keeps the current version set and the one before it, and drops older sets on the next rebuild, which is safe because the log rebuilds them. The `limits` projection grows by one row a session, about 365 a year. Misconception rows show at most 3 examples. The node card pages its task log at 50 rows a page, which I chose; a node gets about 140 attempts a year at 30 graded tasks a day over 79 nodes.

## What would reverse it

- Rebuilding `report_cache` after an adventure takes longer than 5 seconds on the Mac for a week of play, or a full recompute longer than 60 seconds. Then the report moves to an incremental projection with a periodic full check.
- The parent reads the report at stage 0.3 and can't answer one of the three questions from it (REQ-2302). Then the screens change before the dynamics screen is built.
- At stage 0.3 more than half the limit rows still show «мало данных» after two weeks. Then the 3-session floor or the 7-session window is wrong for her pace.
- Session 0 and the monthly check give motor corrections on one device type that differ by more than 50 % between months. Then the correction is noise, and the adult calibration becomes the default.

## Consequences

- ADR-0030 serves `/api/parent/*` behind the parent session and gives the player's routes schemas without diagnostic fields.
- ADR-0040 gives every trap a misconception identifier shared across nodes and every template its answer's key-press count.
- ADR-0060 supplies states, estimates, uncertainty and the state history, and applies the fast-probe rule with this record's thresholds.
- ADR-0070 reads open recheck windows and the due motor check; ADR-0090 places the monthly pure-input tasks in the adventure as story.
- ADR-0160 holds every Parent Room label in the Russian content file under `parent.*`, which this record's label check reads.
- ADR-0190's verify gains the checks listed below, the static check on `content/thresholds.lock` among them.
- The `tower` service mounts `content/` read-only.

The failure states, each with its audience:

| State | When | What the system does | Audience |
| --- | --- | --- | --- |
| `report_stale` | the parent opens the Parent Room before the rebuild after an adventure ends | shows the last report with «Обновлено в HH:MM» and rebuilds | parent |
| `report_build_failed` | a report function throws | keeps the last good `report_cache`, shows «Не удалось обновить отчёт, показан отчёт от …», and logs the error with the last event sequence number | owner |
| `too_little_data` | fewer than 3 sessions hold data for a limit | shows «мало данных» in the row | parent |
| `threshold_uncalibrated` | a device type has neither Session 0 nor an adult calibration | uses the catalogue value and asks for the 3-task adult calibration | parent |
| `recheck_late` | a recheck window closes without a full block | shows «перепроверка позже» on the mark, keeps the recheck's priority, and labels from the late block with a note | parent |
| `thresholds_changed_unversioned` | the VWO section or the catalogue changed without a new version or an approved record | verify fails, and the server refuses to start on that content | building agent |

`report_stale` and a fresh report differ only in the time shown, on purpose, because the parent needs to act on neither.

The security boundary protects the report, the lesson marks, the story book with her free text, and the export. Ordered by the likelihood of damage, it defends against:

1. the player on a shared iPad or the family computer, through the PIN, a separate session and routes that never carry diagnostics to her screens;
2. the player watching or guessing the PIN, through the lockout of ADR-0010 and the idle timeout of ADR-0030;
3. a guest device on the home network, through HTTPS, the PIN and the lockout, with no port open to the outside (ADR-0010);
4. report data leaving the Mac, through the Mac-only export of ADR-0020 and a model gateway that never sends report data (ADR-0100).

It doesn't defend against a person with the Mac's user account. The live database sits in the Docker volume `tower-db`, which no Mac program opens (ADR-0010), but that person can take a copy with `./tower db-snapshot` or `./tower export` and read it (ADR-0010, ADR-0020).

The strongest objection: the report shows a four-step ladder and twelve limits from a few weeks of one child's play, on thresholds and model values nobody has fitted yet, so it looks more precise than the data is. A parent can take «1S ещё не покрыт» or a raised endurance flag as a verdict and act on noise. The disclaimer, the preliminary mark, «мало данных» and the checkable rules reduce this, and they don't remove it. What removes it is data: the refit after 4 to 6 weeks (RES-3000) and Ascents after the MVP.

Premortem, written from 2027-03 as if it had happened. The parent stopped opening the Parent Room in November. She marked five nodes after each lesson, the five recheck blocks crowded the frontier out of three days of play, and the rest showed «перепроверка позже» for weeks. The computer had no Session 0, so its catalogue thresholds turned every computer session into «понимает, нужна скорость». The ladder read «1S ещё не покрыт» from September to March, and she read it as a school verdict. The first failure is why a late recheck shows as `recheck_late` and never vanishes; the second is why `threshold_uncalibrated` asks for the adult calibration. The third is the objection above.

## How I will know it was realised

1. In ADR-0190's verify, after a simulated adventure ends, `report_cache.lastEventSeq` equals the sequence number of that adventure's last event.
2. The Parent Room shows exactly the eight screens of REQ-2308 and no dynamics screen.
3. A property test on random logs changes the answers of assisted attempts, and the skill map, states and ladder stay equal while the «с помощью» figures change.
4. Unit tests of the ladder at 89 % and 90 % coverage, 79 % and 80 % margin, and 2 and 3 stretch nodes give the steps of REQ-2338 to REQ-2344, and an unverified or cut-off node counts as not covered.
5. A fixture with 2 sessions shows «мало данных» in all twelve rows, and the same fixture with 3 sessions shows values.
6. Every `/api/parent/*` route answers 401 without a parent session, and ADR-0190's scan of the player's screens finds no node identifier, state label, percentage or topic name.
7. A day with 121 minutes of active time shows «долгий день» on the summary, and a day with 120 doesn't.
8. Changing one catalogue value without a new entry in `content/thresholds.lock` fails verify.
9. In the 30-day simulation, a lesson mark on day 5 gets a full block between days 6 and 8 and another between days 17 and 21, and the node's label matches the rule for its simulated states.
10. At the stage 0.2 acceptance an adult reads report v1 without explanation, and at stage 0.3 the parent answers the three questions of REQ-2302 from it.
11. A term hint shows no Dutch word for an entry the parent hasn't approved, and shows it after `glossary_entry_approved`.
12. A test-mode session that plays a whole floor leaves the player's `events` table unchanged apart from the parent's notes and ambiguous-task marks.
13. A fixture where every stretch node is «Пока не освоено» lists none of them among the gaps, and one with 2 stretch nodes in «Бегло» lists both as the ceiling.
14. Changing the school group in the settings panel writes one `settings_changed` event and starts a full recompute under the other prior row; changing the age changes the next Master order's `readerAge`; and a scan of the tracked files finds none of the three values.

## What this does not settle

- The export's formats, the field dictionary and the Mac-only rule (REQ-2234 to REQ-2240) belong to ADR-0020; this record only places the button.
- The PIN lockout (REQ-2522) belongs to ADR-0010, and the parent session's expiry (REQ-2440) to ADR-0030.
- The contents of the Parent Room panels this record only places, from the glossary approval to the bake-off screen, belong to the decisions named where the panels are listed.
- How the Director fits recheck blocks into a day, and whether they count against the cap of 4 parent-topic tasks, belong to ADR-0070. Many marks at once still compete with the frontier for slots, and ADR-0070 sets that balance.
- The state rules, the estimates and the probe rules belong to ADR-0060, and the science questions and their misconceptions to ADR-0130.
- The story book's scenes, the «плохая сцена» (bad scene) mark and the Parent Room's review queues belong to ADR-0110 and ADR-0130.
- The colours of states and the Parent Room's theme belong to ADR-0150.
- The dynamics screen, the node-by-Ascent matrix, the full limits views and the anxiety signals from erasures, hesitation and phrases come after the MVP, and the log defines those signals before a later record measures them.
- The alarm notice and the later web push belong to the safety decision of ADR-0110.

Amended by ADR-0220, ADR-0230, ADR-0240, ADR-0250, ADR-0260, ADR-0270, ADR-0280, ADR-0290, ADR-0300, ADR-0310, ADR-0330 and ADR-0340, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0370, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0380, ADR-0390, ADR-0400, ADR-0410, ADR-0420, ADR-0430 and ADR-0450, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0460, approved on 2026-09-29, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
