---
id: SPC-0180
artifact: spec
status: live
revised: 2026-09-29
states: [REQ-0105, REQ-0107, REQ-0711, REQ-0824, REQ-0826, REQ-0828, REQ-0834, REQ-0838, REQ-0846, REQ-1300, REQ-1302, REQ-1304, REQ-1306, REQ-1308, REQ-1310, REQ-1312, REQ-1314, REQ-1316, REQ-1318, REQ-1322, REQ-1324, REQ-1326, REQ-1328, REQ-1330, REQ-1332, REQ-1334, REQ-1336, REQ-1338, REQ-1340, REQ-1344, REQ-1346, REQ-1348, REQ-1350, REQ-1352, REQ-1354, REQ-1356, REQ-1358, REQ-1360, REQ-1362, REQ-1364, REQ-1400, REQ-1402, REQ-1404, REQ-1406, REQ-1408, REQ-1410, REQ-1412, REQ-1416, REQ-1418, REQ-1420, REQ-1422, REQ-1424, REQ-1426, REQ-2300, REQ-2302, REQ-2304, REQ-2306, REQ-2310, REQ-2312, REQ-2314, REQ-2316, REQ-2318, REQ-2320, REQ-2322, REQ-2324, REQ-2326, REQ-2328, REQ-2330, REQ-2332, REQ-2334, REQ-2336, REQ-2338, REQ-2340, REQ-2342, REQ-2344, REQ-2346, REQ-2348, REQ-2350, REQ-2352, REQ-2354, REQ-2356, REQ-2358, REQ-2360, REQ-2362, REQ-2364, REQ-2366, REQ-2368, REQ-2370, REQ-2372, REQ-2374, REQ-2376, REQ-2378, REQ-3710, REQ-3814, REQ-5146, REQ-5148, REQ-5150, REQ-5360, REQ-5362, REQ-5364, REQ-5366, REQ-5368, REQ-5458, REQ-5460, REQ-5462, REQ-5464, REQ-6064, REQ-6600, REQ-6602, REQ-6604, REQ-6606, REQ-6608, REQ-6610, REQ-6612, REQ-6614, REQ-6616, REQ-6618, REQ-6620, REQ-6622, REQ-6624, REQ-6626, REQ-6628, REQ-6630, REQ-6632, REQ-6634, REQ-6638, REQ-6640, REQ-6642, REQ-6644, REQ-6648, REQ-6650, REQ-6796, REQ-7170, REQ-7174, REQ-7400]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Parent Room, its report, the limits, the lesson rechecks and the export

## Scope

This document covers the Parent Room behind the PIN: the report's nine screens and how they are computed from the log, the twelve limits, the fluency thresholds per device type, the lesson marks with their two rechecks and four labels, the settings panel for the player's details, the glossary approval, the export tab, and the security boundary around them. It also covers the rules that hold for every report part addendum 2 adds: the count and interval each figure shows, the «мало данных» (too little data) floors, the interpretation lines from a fixed list of contrasts, the exclusion trail and the report that can't be curated. It is written at the level of routes, projections, events and the content of each screen. The layout, colours and theme of the screens are the interface specification's (ADR-0150), and the Russian wording of every label is in the string file of ADR-0160.

It leaves out what other documents state. The PIN check and its lockout are SPC-0010's, and the parent session with its 30-minute expiry is SPC-0030's. The export's formats and field dictionary are SPC-0020's. The node states, estimates, uncertainty and probe rules are ADR-0060's, and the science questions with their misconceptions are ADR-0130's. The contents of the panels this part only places are named under "Panels this part places". The Sources screen's contents are ADR-0300's, the planning-error count and the plan cross ADR-0270's, the Cito sections ADR-0290's, the Interest section ADR-0330's, the «Видит удобные приёмы» (Sees convenient methods) block ADR-0260's, the composing line ADR-0230's, the «Нестандартное мышление» (Non-standard thinking) section ADR-0280's, the sandbox ADR-0340's, and the school screens after the MVP ADR-0310's. The contents of addendum 2's report parts after the MVP belong to their own decisions: the profile to ADR-0390, the weekly breakdown, the trajectory and the retention list to ADR-0400, the transfer section to ADR-0410, the home-and-school quadrants to ADR-0420, the Dutch probe's presentations and section to ADR-0430, and the hypotheses to ADR-0450. Build check 5 and addendum 2's MVP scope are ADR-0380's and ADR-0190's.

## Boundary

### Routes

Every route below needs a paired device. Every route other than `POST /api/parent/login` also needs a parent session, as SPC-0030 states, and answers `401` to a request without one; the login route is guarded by SPC-0010's lockout.

| Route | What it does |
| --- | --- |
| `POST /api/parent/login` | Takes the PIN and opens the parent session. |
| `GET /api/parent/report` | Returns the current `ReportModel` from `report_cache`. |
| `GET /api/parent/report?at=<date>` | Returns the report as of a past date, from the daily snapshots of ADR-0060. |
| `POST /api/parent/tags` | Writes `parent_tag_added` for a lesson mark. |
| `DELETE /api/parent/tags/:tagId` | Writes `parent_tag_removed` for that lesson mark. |
| `POST /api/parent/items/:itemId/exclude` | Writes `item_excluded` in ADR-0340's version 2 with `source: "parent_room"` for that task. |
| `DELETE /api/parent/items/:itemId/exclude` | Writes `item_included` for that task. |
| `POST /api/parent/adventures/prepare` | Triggers advance planning and scene drafting for the next adventure (REQ-0105). |
| `GET /api/parent/adventures/prepared` | Returns preview data for prepared unplayed adventures: route, story scenes, tasks, answers. |
| `POST /api/parent/adventures/:id/approve` | Logs `adventure_approved` and queues the adventure for next game day play (REQ-0107). |
| `GET` and `PUT /api/parent/settings` | Reads and changes the settings, the player's real name, age and school group among them. |

The query schemas of the `/api/parent/report*` routes are strict: they accept only `at=` and a page number, and answer `400` to any other parameter, so no request can hide a node, a dimension or a figure (REQ-6606).

The client's Parent Room is the `/parent` area of the Preact client, and it reads its data only from `/api/parent/*`.

### Code, projections and files

| Surface | What it is |
| --- | --- |
| `src/parent/` | The report functions: pure functions over the projections and the knowledge model's outputs, each returning a part of `ReportModel`. |
| `report_cache` | One `ReportModel` with its `DerivedMeta`: the model, threshold and graph versions and `lastEventSeq`, the sequence number of the last event it read; the threshold version is the one SPC-0020 records in `derived_meta`, the version in `content/versions.json` joined by `+` with the `seq` of the latest `fact_threshold_set`. It keeps the current version set and the one before it. |
| `src/parent/intervals.ts` | The only functions that compute the Wilson, Newcombe and median intervals. |
| `src/parent/measures.ts` | The registry of every measure in addendum 2's report parts, each with its «мало данных» floor. |
| `src/parent/contrasts.ts` | The contrasts that may draw an interpretation line, one for each entry of `verify/contrasts.json`. |
| `verify/contrasts.json` | The fixed list of contrasts, each entry naming the decision that approved it. |
| `excluded_attempts` | After the MVP, each `item_excluded` event that no later `item_included` for its task follows, joined to the attempts it removed, with its `source`. |
| `limits` | One `LimitsResult` per session. |
| `thresholds` | One fluency threshold per template and device type, iPad or computer, with its version. |
| `parent_tags` | The lesson marks and their open recheck windows. |
| `content/thresholds.json` | The catalogue of fluency thresholds, and the VWO readiness thresholds under `vwo`, each section with a `version`. |
| `content/thresholds.lock` | For each content hash of the catalogue and the `vwo` section, the approved decision record in `project/adrs/` that approved it. |

The `meowtower` service mounts `content/` read-only.

### Events this part logs

| Event | Payload |
| --- | --- |
| `parent_tag_added` | the nodes or subtypes, the lesson date and an optional note |
| `calibration` | the adult's attempt on a node's task in the calibration mode, with its device type and time |
| `glossary_entry_approved` | the entry and the text the parent approved |
| `parent_tag_removed` | the lesson mark the parent removed |
| `item_excluded` | the task the parent excluded as ambiguous; version 2 carries `source`, as ADR-0340 states |
| `item_included` | the excluded task the parent restored |
| `settings_changed` | the setting and its new value |

### Failure states

`report_stale`, `report_build_failed`, `too_little_data`, `not_clear_yet`, `threshold_uncalibrated`, `recheck_late`, `thresholds_changed_unversioned`, `measure_floor_missing`, `contrast_not_declared`, `interval_reference_mismatch`, `threshold_label_reused` and `check_text_names_lesson`, set out under Failure paths.

### What this part requires from other parts

- SPC-0020 supplies the log, `appendEvents`, the projections and their rebuild, the full recompute and the export.
- SPC-0010 supplies the PIN check and its lockout, the loopback listener and the read-only mount; SPC-0030 supplies the parent session and the player's route schemas.
- ADR-0060 supplies the node states, the «сама» (on her own) and «с помощью» (with help) estimates with their uncertainty, the state history, the daily snapshots and the probe rules.
- ADR-0040 supplies each trap's misconception identifier, shared across nodes, each attempt's error `class`, each template's classical problem type, number of steps and answer key-press count, and the `shown` view of every `item_shown`.
- SPC-0070 supplies the refusal guard and its event `refusal_guard_changed`.
- ADR-0070 reads the open recheck windows and the due motor check; ADR-0090 places the pure-input tasks in the adventure and counts active time.
- ADR-0160 holds every Parent Room label under `parent.*` in the Russian string file.
- ADR-0290 supplies each template's `format`, whose value `bare` marks a bare task.
- ADR-0430 supplies, after the MVP, the Dutch probe's presentations `bare`, `ru`, `nl` and `nl_after_words`, their graded first attempts and the probe's section in the report, where the two interpretation lines sit; ADR-0390 places the profile screen's miss-rate line.
- ADR-0190's verify runs the checks this part names, and its Baselines table holds this part's budgets.

### Permitted dependencies

- The report functions read projections and the knowledge model's outputs, and write only `report_cache`. They append no event and call no model.
- Every write from the Parent Room goes through `appendEvents`.
- No player route, player projection or player screen reads `report_cache`, `limits`, `parent_tags` or a `calibration` event.
- No module in `src/engine/` imports `src/parent/`.
- Only `src/parent/intervals.ts` computes an interval, and no other module in `src/parent/` imports a statistics library.
- Only `src/parent/contrasts.ts` draws an interpretation line, and only for a contrast `verify/contrasts.json` lists.
- The Director reads `parent_tags` and `thresholds` only for the open recheck windows and the due motor check.

## Behaviour

### Access

The report opens only inside the Parent Room, after the parent enters the PIN, so the child never sees it (REQ-2352). The player's routes carry schemas with no field for a node state, an estimate, a percentage or a topic name, so the player's screens show only game progress and story outcomes (REQ-1426). ADR-0190's end-to-end scan checks the player's screens for node identifiers, state labels, percentages and topic names.

The report offers no setting, filter or mode that hides a node, a dimension or a figure from the parent (REQ-6606). Beside the strict route schemas, the graph map draws every node of the graph, and a Playwright test counts them.

### Panels

The Parent Room hosts the report and, behind the same session and in the tabs of the design's screen 26, these panels.

The settings panel holds the player's real name, age and school group, and the parent can change each at any time (REQ-3710). A change writes `settings_changed` to the log in the local database, and no value enters a tracked file. The first setup asks for all three before Session 0 can start. The panel also holds the music and effects channels, each with a switch and a volume, which ADR-0320 states. SPC-0040 reads the age, SPC-0100 the real name for the egress guard, and SPC-0060 the school group for its prior row.

The glossary panel pairs each Russian term with its drafted Dutch word, and lists the bridge words beside the glossary entries with the count of approved ones. The parent approves, edits or rejects each entry. Approval writes `glossary_entry_approved`, and the term hint shows the Dutch word only for an entry whose latest approval matches its current text (REQ-0846).

The lessons list shows every lesson mark with a remove control beside it, which calls `DELETE /api/parent/tags/:tagId`. The flagged-task list shows each task flagged for the parent with an exclude control beside it, which calls `POST /api/parent/items/:itemId/exclude`, and each excluded task with a «вернуть» (restore) control beside it, which calls `DELETE /api/parent/items/:itemId/exclude`. The `item_included` event it writes starts the full recompute of SPC-0020, and from it every knowledge projection and report figure counts the task's attempts again, as ADR-0060 states.

The calibration mode lets an adult solve 3 tasks of a node on a device type, and writes `calibration` events, as "Fluency thresholds" sets out.

The tab «Выгрузка данных» (Data export) runs the export SPC-0020 states, and shows only when the Parent Room is open on the Mac. The tab «Данные школы» (School data) and the school export are ADR-0310's.

#### Panels this part places

The Parent Room also places panels whose contents other parts define: the switch «Закончить на сегодня» (Finish for today), inside the settings panel above, and the memo on talking with the child, with its first-week checklist (ADR-0090, ADR-0330); the review queues for frames, lines, scenes, art, explanation variants, framings and puzzles (ADR-0110, ADR-0120, ADR-0130, ADR-0170, SPC-0080, ADR-0280); the bake-off screen, the Master pick, the cost line and its notices (ADR-0100); the alarm notice (ADR-0110); the approval screen for reaction candidates, the flag on a reaction line in the dialogue book and the notice `reaction_bank_low` (ADR-0320); the page on what leaves the Mac with its list of judge checks (ADR-0100, ADR-0350); the Cito panel (ADR-0290); the card panel, the day-mark question, the free-pen switch and "open every system" (ADR-0330); the riddle list (ADR-0230); the tab «Гипотезы» (Hypotheses), which after the MVP is the report's line «Гипотезы и их статус» (hypotheses and their status) (ADR-0450); and the entry to the sandbox «Песочница» (Sandbox), which ADR-0340 defines. The sandbox's confirmed actions reach the player's log each as one event with `source: "sandbox"`, as ADR-0340 states.

### How the report is computed

The report is a set of pure functions over the log, and `report_cache` holds their result. The server rebuilds `report_cache` on `adventure_completed`, `adventure_wrapped_up` and `session_ended`, and when the Parent Room opens while `report_cache.lastEventSeq` is behind the log, so the report reflects every event of the adventure that just ended (REQ-2300). The rebuild after an adventure takes at most 5 seconds and a full recompute of a year's log, about 150,000 events, at most 60 seconds, the budgets in ADR-0190's Baselines table.

The skill map, the states and the «сама» estimate come only from unassisted first attempts (REQ-2310). Assisted attempts reach the report only in the «с помощью» figures: the assisted estimate, «решает с подсказкой» (solves with a hint), «почти готово» (nearly ready), «на пороге» (on the threshold), the mean depth of help, assisted groupings and the observation «склонна отказываться от задачи» (tends to refuse the problem) (REQ-2312).

Every label comes from the Russian string file, never from a model. A check run by ADR-0190's verify rejects «плохо» (bad), «отстаёт» (falls behind) and «невнимательная» (careless) in every `parent.*` value, and the parent judges the rest of the wording, which reads in the style of «пока не освоено» (not mastered yet) and «понимает, нужна скорость» (understands, needs speed) (REQ-2306). No screen orders topics or proposes dates or exercises, so the report builds no lesson plan (REQ-2304), and every line the report draws on its own comes from the fixed list of contrasts and reads «что проверить» (what to check), as "Figures and lines in addendum 2's parts" sets out. The report answers what the player has mastered, where her frontier is and what holds her back, which the parent judges (REQ-2302). No figure, label or interpretation is worded as a diagnosis (REQ-6604), and a weak side of her maths shows as clearly as a strong one (REQ-6602); the parent judges both at the acceptance of the stage that builds each part.

After the MVP the full report breaks her maths results into their parts and shows where the boundary of what she does on her own runs (REQ-6600), which the parent judges. The parts are the profile (ADR-0390), the weekly breakdown, the trajectory and the retention list (ADR-0400), transfer (ADR-0410), the home-and-school quadrants (ADR-0420), the Dutch probe (ADR-0430) and the hypotheses (ADR-0450). «Профиль» (Profile) is the first of the report tabs, and the report's other screens follow it.

Every figure reads only the base graph layer, and a report that mixes layers appears only as a choice the parent makes once a second layer exists (REQ-3814). The MVP has one layer.

### Report v1 has nine screens

Report v1 has nine screens, and no dynamics screen, "home and school" screen or timeline (REQ-6064).

| Screen | What it shows |
| --- | --- |
| Summary | the pooled estimate matrix at the top; the last session; sessions and tasks this week; node counts by state for 1F, 1S and stretch; the frontier by domain (REQ-2320); one line per limit; the nodes not checked for more than 30 days (REQ-2322); the nodes marked «на пороге» and then «почти готово» (REQ-2318, REQ-5146, REQ-5148); the nodes whose errors all carry «возможна языковая причина» (possibly a language cause) (REQ-2372); each day's active time for the week (REQ-2376), with «долгий день» (a long day) above 120 minutes (REQ-2378); the weekly check line (REQ-5364); the observation «склонна отказываться от задачи» while it holds (REQ-7174); the sections other parts define: «Видит удобные приёмы» (ADR-0260), «небрежные ошибки на знакомом» (careless errors on familiar material) and the horizon line (ADR-0290), and the Interest section (ADR-0330); and after the MVP, the count of excluded attempts with how many were right and how many wrong (REQ-6610), and the nodes under «ошибки есть и без трудных слов» (errors also without hard words) (REQ-6614) |
| VWO readiness | the three measures, the ladder and the inferred figure; coverage of 1F, of 1S and of stretch as three separate figures (REQ-0828); the gap list with no stretch node (REQ-0824); the mastered stretch nodes listed as the ceiling above 1S (REQ-0826); the disclaimer and the preliminary mark; and the sections other parts define: «Нестандартное мышление» (ADR-0280) and the Cito preparation, careless errors and beyond-school sections (ADR-0290) |
| Graph map | every node with its state label, hatching for inferred states and a ring around each frontier node (REQ-2374); under the word-problem domain, the matrix of problem type by number of steps (REQ-0834) with its error counts (REQ-0838), the four separate counts (REQ-5462), the line «Может составить задачу» (Can compose a problem) of ADR-0230, and the note on the unanswerable streams (REQ-5464); under domain A, the fact report of ADR-0290 |
| Node card | the state with the «сама» estimate and its uncertainty (REQ-2314); «на пороге» and «почти готово»; the share of correct assisted attempts under «решает с подсказкой» (REQ-2316) with the mean depth of help beside it (REQ-5150); the estimate matrix (REQ-5366); every task as shown (REQ-2328); the language-cause mark per attempt (REQ-2368); the state history with lesson marks and labels; the bare and context split of ADR-0290; and after the MVP, each excluded attempt struck through with its source (REQ-6612) |
| Misconceptions | the traps that fired, by frequency, with up to 3 examples a row (REQ-2324), one row per misconception across nodes (REQ-2326); below them, every answer or step the engine didn't recognise, listed as unclassified with its task for the parent to review by hand (REQ-0711) |
| Limits | one row per limit, as "Limits" sets out |
| Science | for each topic, the questions answered, with no score, state or percentage |
| Story book | the scenes and dialogues by session as ADR-0110 provides them, the favourites ADR-0330 names, and a PDF export printed from the browser |
| «Работа с источниками» (Working with sources) | the Sources track, apart from the graph screens, as ADR-0300 states |

#### Summary and node card

A node is «почти готово» when its state is below «бегло» (fluent) and its «с помощью» estimate is at least 0.7 over at least 3 assisted attempts within the last 30 days (REQ-2318). A node counts as not checked for a long time when its last unassisted first attempt is more than 30 days old (REQ-2322). After the MVP, once ADR-0400's retention checks exist, a node held for a retention check shows in that list with «проверка запланирована» (check planned) and its due window.

A node is «на пороге» when its state is «Пока не освоено» (not mastered yet) or «Уточняется» (being clarified), it has at least 3 assisted attempts in the last 14 days, first and second attempts alike, and at least 60 % of them are first attempts answered right with rung 1 as their deepest rung (REQ-5146). A second attempt counts in the denominator and never in the numerator. «Не проверено» (not checked), «Не проверялся, отрезан узлом X» (not tested, cut off by node X) and «Stretch: не проверялся» never get the mark. A node that meets both rules shows «на пороге» first and then «почти готово», in the summary list and on the node card (REQ-5148).

The mean depth of help, shown on the node card and in the help row beside «решает с подсказкой», averages the node's attempts in the last 30 days that ADR-0060 doesn't drop: 0 for a first attempt with no hint, its deepest rung from 1 to 3 for a first attempt with hints, and 4 for a second attempt whatever hint it used (REQ-5150). It shows one decimal and the count of attempts, and «нет данных» (no data) when the node has no attempt in 30 days. For the 30 days after the ladder of ADR-0220 ships, the node card notes under the figure that it mixes attempts on three-rung ladders with attempts on the new ladder lengths.

The estimate matrix on the node card crosses the estimate, right or wrong, with the exact answer, right or wrong, over all the node's first attempts on items with an estimate since the current rules version (REQ-5366). An exact answer counts as right at credit 1 and as wrong otherwise, and a «Не знаю» (I don't know) without an estimate stays out. A cell with fewer than 5 answers shows «мало данных» (too little data) (REQ-5368). The summary's pooled matrix applies the same rules over every node.

The weekly check line shows the share of first attempts on tasks offering the inverse check on which she used it, the number of answers saved and the number spoiled (REQ-5364). The report compares her preliminary answer at the first check of a task with her first attempt, each judged with ADR-0040's checker. A change from wrong to right counts as saved (REQ-5360), a change from right to wrong as spoiled (REQ-5362), and any other change as neither.

The observation «склонна отказываться от задачи» shows while the latest `refusal_guard_changed` has `state: "raised"` (REQ-7174). SPC-0070's refusal guard writes that event when 3 or more of her last 20 solvable T1 to T4 first attempts, assisted ones included and Dutch probe letters left out, are «Нельзя узнать» (can't be known), once 20 such attempts exist.

The summary shows each day's active time for the week as the soft stop of ADR-0090 counts it (REQ-2376), and marks a day above 120 minutes «долгий день»; a day of exactly 120 minutes carries no mark (REQ-2378). The mark changes nothing in play.

The node card draws each task from the `shown` view of its `item_shown` event, and shows her answer, the correct answer, the time, the help she used and the review (REQ-2328). It pages its task log at 50 rows a page. An attempt carries «возможна языковая причина» when it is wrong, its task lists a risk term, and she didn't open that term's explanation (REQ-2368).

#### Misconceptions and science

The misconceptions screen groups traps by the misconception identifier ADR-0040 gives each trap, so «длиннее — больше» (longer means bigger) in D1 and in P1 is one row (REQ-2326). Rows run by frequency, each with up to 3 examples (REQ-2324).

The science screen lists, for each topic, every question she answered, the option she chose first, and for a wrong option the misconception it names (REQ-2362). A misconception she chose twice or more carries a mark as a topic to talk about (REQ-2364). The screen shows no score, state or percentage (REQ-2366).

#### Graph map and the word-problem matrix

The graph map draws every node with its state label from RES-0900, hatches an inferred state and rings each frontier node (REQ-2374). Under the word-problem domain the matrix counts unassisted first attempts on solvable T1 to T4 problems by the classical problem type each template declares, from RES-0800, and by the number of steps (REQ-0834). Unanswerable problems stay out of the matrix, and surplus problems stay in it.

The matrix shows model by answer on problems that opened with a model choice and plan by answer on problems that opened with a plan, sharing the answer axis, which has three values: right, wrong and no answer. A wrong model choice counts as a modelling error, and a wrong answer after a right model or a `correct` plan counts as a calculation error, each counted apart (REQ-0838). An attempt with no answer holds no modelling or calculation error: a `correct` plan followed by «Не знаю» sits in the cell `correct` by no answer and in no error count, and an attempt that ended in `plan` sits in neither cross and counts in the «Не знаю» or «Нельзя узнать» count below. The planning-error count and the plan cross are ADR-0270's.

Beside the matrix the report shows four separate counts for its period: «Не знаю», «Нельзя узнать» on solvable problems, answers of class `used_extra_data`, and numbers given for unanswerable problems (REQ-5462). Beside the streams of the unanswerable subtypes a fixed note from the string file tells the parent that at about one such problem in two to three weeks these estimates stay «не проверено» (unchecked) or near their prior for months (REQ-5464).

### VWO readiness

The block shows three measures: 1F coverage, the share of verified 1F nodes at «понимает» (understands) or above; the 1S margin, the share of 1S nodes in «бегло» or «устойчиво» (stable); and the ceiling, the number of stretch nodes mastered (REQ-2330). No Sources track node enters any of them.

The ladder counts verified states only (REQ-2332), and treats an unverified node and a cut-off node as not covered (REQ-2336). Inferred states appear as a figure of their own beside the ladder and outside every step (REQ-2334). The ladder gives one step:

1. «1S покрыт без запаса» (1S covered with no margin) when at least 90 % of 1F nodes and at least 90 % of 1S nodes are verified at «понимает» or above and no 1F node is in the state "not mastered", labelled «Пока не освоено» (REQ-2338);
2. «1S с запасом» (1S with a margin) when step 1's conditions hold and at least 80 % of 1S nodes are in «бегло» or «устойчиво» (REQ-2340);
3. «1S с запасом и потолком выше» (1S with a margin and a ceiling above) when step 2's conditions hold and at least 3 stretch nodes are in «бегло» or «устойчиво» (REQ-2342);
4. «1S ещё не покрыт» (1S not covered yet) when step 1's conditions don't hold (REQ-2344).

The report shows the highest step whose conditions hold. The block always shows «Ориентировочный домашний инструмент. Не официальный совет школы и не стандартизированный тест» (An approximate home tool. Not official school advice and not a standardised test) (REQ-2348), and in the MVP the mark «предварительно: без контрольных прогонов» (preliminary: no control runs) (REQ-2350).

The thresholds live in `content/thresholds.json` under `vwo`, with a `version` and a content hash in `content/thresholds.lock`. A static check in ADR-0190's verify fails when the section's content changed and its version didn't (REQ-2346).

### Limits

The `limits` projection computes one `LimitsResult` per session, only from tasks the player answered in play, and never asks for a task given only to measure a limit (REQ-1300). All twelve limits are measured from the MVP on, the language-risk limit included (REQ-1346). Every timing is the device-measured answer time, which excludes time in the background or paused, and an attempt marked `interrupted` gives accuracy and no time (REQ-1304).

The report shows each limit smoothed over the last 7 sessions, or over as many as exist (REQ-1302). A share pools its numerators and denominators over those sessions, a median is the median of the pooled times, and a count is the mean per session.

| Limit | Measure |
| --- | --- |
| Holding steps | the largest k at which her last 2 counted attempts on k-step word problems, both within 30 days, are right; empty until some k has 2 (REQ-1318). A counted attempt is an unassisted first attempt that is not a rapid guess and that the parent hasn't excluded, and a partial answer counts as not right; which problems count is ADR-0230's rule |
| Endurance | the median time at each control-fact point, from times-table control facts only: 2 at the start of the adventure, 2 at the end and 2 in each extension (REQ-1310); a time flag when the last point's median exceeds 1.5 times the first point's (REQ-1312); an accuracy flag, apart from the time measure, when the last point has a mistake and the first has none (REQ-1314); each extension, which starts after the soft stop at 60 minutes of active time, compared with the start and the end (REQ-1316) |
| Speed of the basics | the median time of correct answers on A1, A3, A4 and A6a (REQ-1322); in report v1 the row holds no heat map, and the fact report of ADR-0290 on the graph map holds the two 10 x 10 fact maps |
| Mental or written | accuracy per node with a scratchpad opened and without one (REQ-1326), from the `scratchKind` every attempt on a task that offers a scratchpad records: whether she opened one and which kind (REQ-1324) |
| Error type | the shares of conceptual, procedural, computational and unclassified mistakes, read from each attempt's `class` alone (REQ-1328) |
| Carelessness | mistakes on a node that was «бегло» at that moment, with the answer one digit or one transposition away from the correct one (REQ-1330) |
| Impulsiveness and rapid guesses | the share of wrong answers faster than 30 % of the task's fluency threshold (REQ-1332); the share of rapid guesses among each session's answers, with ADR-0070's `rapid_guess_flag` above 15 % (REQ-1334) |
| Avoidance | runs of 3 «Не знаю» in a row, and the rest stops offered (REQ-1336) |
| Anxiety | runs of 3 `alt` outcomes in a row, and a rapid-guess share in the last third of a session higher than in its first two thirds (REQ-1338) |
| Flow | the success share by session and by floor against the 70-80 % target, and the share of review slots (REQ-1340) |
| Language risk | the mistakes on tasks other than Dutch probe letters that hold a risk term whose explanation she didn't open (REQ-7170), listed by term and node (REQ-2370) |
| Help | hints before the answer with their level, «Не знаю» on first attempts, second-attempt correctness, detailed explanations opened with their reading time, and the share of assisted first attempts, with ADR-0070's `help_share_flag` (REQ-1344); the mean depth of help beside «решает с подсказкой» |

The data model classes a mistake as `conceptual`, `procedural`, `fact`, `slip` or `unclassified`, and the error-type row reports `fact` and `slip` together as computational (REQ-1328). A mistake is `unclassified` where the task's traps and steps don't settle its class. The node's state "at that moment" for carelessness is its state computed from the events before that attempt.

An answer of «Нельзя узнать» never counts as «Не знаю». It ends a run of «Не знаю» like any other answer, so it neither extends an avoidance run nor starts a rest-stop offer (REQ-5458), and it counts in neither the help limit nor ADR-0070's help share (REQ-5460).

The v1 limits screen shows one row for each of the twelve limits, with its current value, the number of sessions behind it and its flag where the limit has one (REQ-2356). When fewer than 3 sessions hold data for a limit, its row shows «мало данных» in place of the value (REQ-2358). The screen shows no charts and splits no limit by part of the session or by task kind (REQ-2360). Avoidance and anxiety read as observations with a prompt to talk with the player, never as grades, in wording the parent judges (REQ-1308).

After the MVP the full limits screen shows these views (REQ-1306), and adds to `LimitsResult` the figures its views need, each named by the decision that builds that screen:

- holding steps: the largest number of steps held, the share of answers that stop at an intermediate step, and the step at which mistakes happen;
- endurance: growth of the control-fact median time from start to end, the accuracy flag, and each extension compared with the start and the end;
- speed of the basics: seconds a fact, and slow and wrong facts as an 8x8 heat map of the facts from 2 to 9, drawn from ADR-0290's `fact_states`, the data behind the fact report's two 10 x 10 maps;
- mental or written: the nodes where accuracy is lower without a scratchpad, and the scratch work of wrong answers;
- error type: the four shares, and the misconceptions that fired with their frequency;
- carelessness: the number of cases and the part of the session they fell in;
- impulsiveness and rapid guesses: the share of too-fast mistakes, and the share of rapid guesses by session, with and without choice, and by part of the session, flagged above 15 %;
- avoidance: frequency by day and by node;
- anxiety: frequency by day, and what helped;
- flow: whether the success corridor held, and where the Director lacked fluent nodes for review;
- language risk: the terms and nodes marked «возможна языковая причина»;
- help: «решает с подсказкой» by node, the share of assisted first attempts, and whether reviews help.

### Fluency thresholds

The `thresholds` projection holds one threshold per template and device type, iPad or computer, with a version (REQ-1362). A template starts at its catalogue value plus the Session 0 motor correction: her pure-input time minus the reference time, times the number of key presses in the template's answer (REQ-1350). Where Session 0 is missing on a device type, the threshold is max(catalogue value, 2.5 x the median time of an adult who solves 3 tasks of the node in the calibration mode) (REQ-1352). Where neither exists, the threshold is the catalogue value, and the Parent Room shows that the device type isn't calibrated.

The motor correction is the only input from the player, so no threshold is fitted to her times on target nodes (REQ-1348). Once a device type's last calibration is 30 days old, the projection marks the 10 pure-input tasks of Session 0 as due on it, ADR-0090 places them in that device's next adventure as story, and their result updates the motor correction (REQ-1354). Each update writes a new threshold version, keeps the version it replaces, and starts the full recompute of SPC-0020 (REQ-1356). The fact threshold of ADR-0290 is a threshold version of this projection too.

The running game never changes a catalogue threshold, because `content/` is mounted read-only, and only a person changes one, as a new threshold version (REQ-1358). ADR-0190's verify fails when the catalogue's hash has no entry in `content/thresholds.lock` naming an approved decision record in `project/adrs/` (REQ-1360). A "fast" probe passes only when every task in it finishes within its threshold from this projection, not only the median (REQ-1364).

### Lesson marks, rechecks and labels

The parent marks nodes or subtypes as «занимались на уроке» (we worked on this in the lesson), with a date and an optional note, and `POST /api/parent/tags` writes `parent_tag_added` (REQ-1400). The lesson-mark form can open from a link with its nodes filled in, as ADR-0420's quadrants link to it, and the mark is still written only when the parent submits the form. The `parent_tags` projection opens two recheck windows counted in game days from the day of the mark: recheck 1 from day 1 to day 3 (REQ-1402) and recheck 2 from day 12 to day 16 (REQ-1404). The Director reads the open windows and collects a full block on the node inside each. A recheck is done when a full block forms inside its window.

When the parent removes a mark, `parent_tag_removed` starts the full recompute of SPC-0020, and from it every knowledge projection treats the mark as never set: its open recheck windows close, it gives no label, and SPC-0060's rule that a full block doesn't span a lesson mark stops applying to it (REQ-1400, REQ-1402).

A check is a state computed from a full block; an inferred, unchecked or cut-off state is never a check. States rank in the order «Пока не освоено», «Понимает», «Понимает, нужна скорость», «Бегло», «Устойчиво». The labels are:

- «Улучшилось после урока» (improved after a lesson) when the node or one of its prerequisites in the graph has a lesson mark, and the state at a check after the mark is higher than at the last check before it (REQ-1406);
- «Улучшилось без урока» (improved without a lesson) when the state at a check is higher than at the previous check and neither the node nor any prerequisite has a lesson mark in the 30 days before it (REQ-1408);
- «Сохранилось» (held) when recheck 2 gives a state no lower than recheck 1 (REQ-1410);
- «Не сохранилось» (did not hold) when recheck 2 gives a lower state than recheck 1 (REQ-1412).

A node with no check before the mark gets no improvement label, and its history shows the first checked state.

### Dynamics views

Until the dynamics screen exists, the dynamics views are the node card's state history and the lesson labels. They read only first attempts from blocks, probes, review, lesson rechecks and retention checks, with assisted first attempts only in figures labelled as help and every «сама» share read from unassisted first attempts alone; the profile's dynamics reads the unassisted first attempts its own bars read, and the fact states for basic facts (REQ-6796). They never show inferred states or add them to checked ones (REQ-1416), and carry «без контрольных прогонов: сравнимость ниже» (no control runs: lower comparability) until Ascents exist (REQ-1418). A time comparison uses tasks answered on one device type only (REQ-1420), and an accuracy comparison may span both (REQ-1422). When the template versions behind a node's comparison differ, the comparison carries «контент изменён» (content changed) (REQ-1424).

### Figures and lines in addendum 2's parts

This section is at the level of the figures the report computes and the rules that compute them. It holds for every report part addendum 2 adds, and each part's own decision says which figures it shows.

#### Counts and intervals

Every share in addendum 2's report parts shows its right answers, its attempts and its 80 % Wilson interval over the raw, unweighted counts of the window it names beside it (REQ-6616). The parts are the profile, the trajectories, retention, transfer, the home-and-school quadrants, the probe and the hypotheses. A difference between two shares shows its 80 % Newcombe hybrid score interval, built from the two Wilson limits the screen shows (REQ-6618). A median time shows its distribution-free 80 % interval from order statistics: the values at ranks j and n + 1 - j, with j the largest rank for which a binomial count of n at one half falls below j with chance 0.10 or less (REQ-6620). ADR-0060's entropy uncertainty stays on report v1's node card and in the Director.

`src/parent/intervals.ts` computes every one of these intervals. A group 2 test compares it with `tests/reference/intervals.json`, a table computed once with Python's `scipy.stats`, and fails with `interval_reference_mismatch` on any difference above 0.0005. The table holds the Wilson rows for every count from 0 of 1 to 1,000 of 1,000, and the test compares every row the table holds.

#### «Мало данных» floors

Every measure in addendum 2's parts declares its «мало данных» floor in `src/parent/measures.ts`, and a group 1 check fails a measure registered without one with `measure_floor_missing`. The profile bar's floor is ADR-0390's, the transfer figure's ADR-0410's, the probe cell's ADR-0430's and the hypothesis condition's ADR-0450's. A share or a median time with no floor of its own that rests on fewer than 5 observations shows «мало данных» with its count in place of its value (REQ-6622). The limits keep their floor of 3 sessions, and the interest signal keeps ADR-0330's.

A figure below its floor shows «мало данных» with its count, and enters no interpretation line, quadrant, profile line or hypothesis status (REQ-6624). A difference with either share below its floor shows «мало данных» too (REQ-6618). A property test feeds each registered measure a count one below its floor and finds nothing built from it.

#### Interpretation lines from a fixed list

The report draws an interpretation line of its own only from the contrasts `verify/contrasts.json` lists, a list fixed before any of her data exists (REQ-6630). The list holds the language line and the maths line of ADR-0380 and the profile's change lines of ADR-0390. A group 1 check fails with `contrast_not_declared` when the contrasts in `src/parent/contrasts.ts` and the entries in the file differ. A per-node figure shows its 80 % interval and draws no line (REQ-6640).

Both lines read every graded first attempt on the Dutch probe's presentations since the probe was switched on, and the report treats that whole run as the probe's current phase. The report computes them only at three checkpoints, when the `bare`, `ru`, `nl` and `nl_after_words` cells first all hold 20, 40 and 80 graded first attempts, and shows the last checkpoint's result between them.

- The language line compares Russian with Dutch, and Dutch with Dutch after the words are explained, and never bare with Dutch (REQ-6632). It appears only when the 95 % Newcombe hybrid score interval of at least one of its two differences excludes zero with the Dutch share the lower one: Dutch below Russian, or Dutch below Dutch after the words (REQ-7400).
- The maths line compares with 0.8 the pooled share of right answers on the bare and Russian presentations (REQ-6634). It appears only when the upper limit of that share's 95 % Wilson interval lies below 0.8 (REQ-6644).

When a contrast's 95 % interval still holds zero or its threshold, the report shows «пока не ясно» (not clear yet) in its place (REQ-6638). Every state of the language contrast short of a line reads «пока не ясно», a Dutch share clearly above the Russian one included. A maths share whose 95 % interval lies wholly above 0.8 shows neither a line nor «пока не ясно». The lines sit in the probe's section, which ADR-0430 places. They have no data until the probe exists after the MVP, and no probe text exists until the owner amends the rule in `CLAUDE.md` that player text is Russian only.

Every line reads «что проверить» and names one check the game or the parent can run: a probe phase, a retention check, the sandbox or a question to the teacher (REQ-6626). No line proposes a lesson, a date for one or an exercise, and a line can name the window its figures come from (REQ-6628). The lines' texts live in the Russian string file under `parent.check.*`, and the label check in ADR-0190's verify fails a `parent.check.*` value containing «урок» (lesson), the stem «заняти» (session) in any form, «упражнени» (exercise) or a date, with `check_text_names_lesson`.

The profile screen states in the line `parent.profile.miss_rate` that about 1 in 5 of the 80 % intervals it shows misses its true value (REQ-6642).

#### The four states the school mixes

The report carries the four states addendum 2 names with three node labels and one reading of the profile:

| State | Carrier in the report |
| --- | --- |
| doesn't know | «Пока не освоено» on a node that isn't «на пороге» |
| knows, not automatic | «Понимает, нужна скорость», and for a fact, ADR-0290's fact state |
| knows with a little help | the node label «на пороге» |
| understands beyond the standard format | no node label; the profile's transfer and conceptual-understanding dimensions and the ceiling above 1S |

No node gets a label meaning it understands beyond the standard school format (REQ-6648). «На пороге» names only the node label of REQ-5146 and never a class of attempts (REQ-6650), so the weekly breakdown calls its rung-1 bin «хватило первой ступени» (rung 1 was enough). A group 1 check fails with `threshold_label_reused` when the Russian string file holds «на пороге» under any key other than that node label.

#### The exclusion trail and the counter-list

After the MVP the summary's count of excluded attempts (REQ-6610) and the node card's struck-through list (REQ-6612) read `excluded_attempts`. A sandbox exclusion by template version and parameter hash removes each of her attempts on that task, and each one counts. The node card's list pages at 50 rows.

The list «ошибки есть и без трудных слов» holds each node with an error on a task whose `format` is `bare`, or an error after she opened the term's explanation (REQ-6614). It reads the same attempts as the list of nodes whose errors all carry «возможна языковая причина», and the two lists sit side by side.

### Export and the PDF snapshot

The export tab runs on the Mac only. After the MVP the export adds a PDF snapshot of the report, made through the browser's print from a print stylesheet, with no PDF library on the server (REQ-2354). The snapshot holds every report screen and every node's card, or it prints nothing: the print stylesheet has no per-screen switch, and a test counts the printed sections against the screens and nodes (REQ-6608).

### Security boundary

The boundary protects the report, the lesson marks, the story book with her free text, and the export. Ordered by the likelihood of damage, it defends against:

1. the player on a shared iPad or the family computer, through the PIN, a separate session, and player routes that never carry diagnostics;
2. the player watching or guessing the PIN, through the lockout of SPC-0010 and the idle expiry of SPC-0030;
3. a guest device on the home network, through HTTPS, the PIN and the lockout, with no port open to the outside;
4. report data leaving the Mac, through the Mac-only export of SPC-0020, the Mac-only export for the school of ADR-0310, which holds no home data, and a model gateway that never sends report data.

It doesn't defend against a person with the Mac's user account, who can take a copy with `./meowtower db-snapshot` or `./meowtower export` and read it.

### Ceilings

`report_cache` keeps two version sets and drops older ones on the next rebuild. `limits` grows by one row a session, about 365 a year. A misconception row shows at most 3 examples, and the node card pages its task log at 50 rows.

## Failure paths

| Condition | What happens | Audience |
| --- | --- | --- |
| A `/api/parent/*` request without a parent session | `401`; the client shows the PIN screen. | parent |
| `report_stale`: the Parent Room opens before the rebuild after an adventure | The last report shows with «Обновлено в HH:MM» (Updated at HH:MM), and the server rebuilds. | parent |
| `report_build_failed`: a report function throws | The last good `report_cache` stays, the screen shows «Не удалось обновить отчёт, показан отчёт от …» (The report couldn't be updated; showing the report from …), and the error is logged with the last event sequence number. | owner |
| `too_little_data`: fewer than 3 sessions hold data for a limit | The row shows «мало данных». | parent |
| An estimate-matrix cell holds fewer than 5 answers | The cell shows «мало данных». | parent |
| `too_little_data`: a figure in addendum 2's parts is below its measure's floor | The figure shows «мало данных» with its count and feeds no line, quadrant, profile line or status. | parent |
| `not_clear_yet`: a contrast's 95 % interval still holds zero or its threshold | The line's place shows «пока не ясно». | parent |
| A `/api/parent/report*` request carries a parameter other than `at=` or a page number | `400`. | parent |
| `measure_floor_missing`, `contrast_not_declared`, `interval_reference_mismatch`, `threshold_label_reused` or `check_text_names_lesson` | Verify fails and names the case. | building agent |
| A node has no attempt in 30 days | The mean depth of help shows «нет данных». | parent |
| SPC-0070's refusal guard has not raised, or has cleared | The report shows no refusal observation. | parent |
| `threshold_uncalibrated`: a device type has neither Session 0 nor an adult calibration | The threshold is the catalogue value, and the Parent Room asks for the 3-task adult calibration until someone does it or Session 0 runs on that device. | parent |
| `recheck_late`: a recheck window closes without a full block | The mark shows «перепроверка позже» (recheck later), the recheck keeps its priority, and the label comes from the late block with a note. | parent |
| `thresholds_changed_unversioned`: the `vwo` section or the catalogue changed without a new version or an approved record | Verify fails. | building agent |
| A glossary entry's text changed after its approval | The term hint shows no Dutch word until the parent approves the new text. | parent |
| The rebuild after an adventure takes longer than 5 seconds, or a full recompute longer than 60 seconds | The verify report shows the measure against ADR-0190's Baselines table. | owner |

## Choices made in this document

- The observation «склонна отказываться от задачи» sits on the summary screen, and the note on the unanswerable streams on the graph map beside the word-problem matrix; ADR-0250 names no screen for either.

## Open review findings

- An agent reviewer asked for a reason beside the placements under "Choices made in this document", the 50-row page, the two version sets in `report_cache` and the Director's narrow read of `parent_tags` and `thresholds`. I rejected it, because rule S8 of the spec step keeps reasons in the decision: ADR-0180 gives the reasons for the page size, the version sets and the Director's read, and the placements' reason belongs to the design step that settles them.
- The same reviewer asked again for reasons beside the rules the first finding above names; the rejection under the first finding holds.
- The agent reviews of 2026-09-28 for addendum 2 ran two rounds. I fixed the first round's findings on the language line's direction, the `lastEventSeq` phrase, the missing reversal of `item_excluded`, and the failure names, now stated at the checks that raise them. The first round's request for reasons beside the page size, the version sets and the Director's read gets the rejection above.
- The second round again asked for a reason beside the placement under "Choices made in this document"; the rejection under the first finding above holds.
