---
id: RES-2300
artifact: research
status: approved
revised: 2026-09-27
---

# The draft proposes a parent report, refreshed after each adventure, that shows what is mastered, where the frontier is and what holds the player back

## Summary

The owner's draft specification proposes a report in the Parent Room that is current after every adventure. The report answers three questions: what is mastered, where the frontier is, and what holds the player back. The game builds no lesson plan. For the MVP the draft proposes report v1 with seven parts: a skill map from unassisted first attempts, «решает с подсказкой» (solves with a hint), the frontier, errors and misconceptions, a task log, a preliminary VWO readiness block and a raw data export. The full report has nine screens. Research proposes that report v1 is eight of them, with the limits and science screens in a simplified form, and that only the dynamics screen comes later. The VWO readiness block uses a four-step ladder with stated percentages, counted only over verified states, and always carries a disclaimer. Labels in the report are non-judgemental, and the child never sees the report, which sits behind a PIN. This record covers the content of the report; the event log it is computed from is in RES-2200, and the parent endpoints are in RES-2400.

## The question

What must the parent see after each adventure, and how does the report state readiness for the VWO track? The draft assumes that a readiness ladder built from node states helps the parent more than it misleads. A four-step label over a home tool can read as a verdict, which is why the draft adds a permanent disclaimer and, in the MVP, a "preliminary" mark; whether a label is better than showing the three percentages alone is not argued.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles: specification), sections «Текущий объём (MVP)» (Current scope, the MVP) introduction, «Отчёт v1» (Report v1) and «Отчёт для родителя» (Report for the parent), on 2026-09-26. The draft is a draft, so every finding below is what the draft proposes, not what was decided.

The draft leaves these points open:

- how long "long unchecked" is for a node shown as «давно не проверявшиеся» (not checked for a long time) (resolved below: more than 30 days);
- how the flags for fast guessing, anxiety and flow are computed, and what a "safety alarm" is, in this range;
- what "simplified" means for the limits and science screens in the MVP (the resolved finding on report v1 below defines it);
- the node states themselves («не освоен», «понимает», «бегло», «устойчиво», «отрезанный») and how an inferred state differs from a verified one, which other records define;
- the values in `content/thresholds.json` apart from the VWO percentages given here, and how a threshold change is versioned.

## Findings

### The report answers three questions and plans no lessons

The report in the Parent Room is current after each adventure and answers three questions: what is mastered, where the frontier is, and what holds the player back. The game builds no plan of lessons. The context section of the draft adds that the game measures and helps consolidate, while the parent explains new topics in lessons outside the game.

### Report labels are non-judgemental

Labels read «пока не освоено» (not mastered yet), «понимает, нужна скорость» (understands, needs speed) and «прочно» (solid), and never «плохо» (bad) or «отстаёт» (falls behind).

### Report v1 for the MVP has seven parts

1. Skill map from unassisted first attempts: node states, the «сама» (on her own) estimate and its uncertainty, coverage of 1F, 1S and stretch.
2. «Решает с подсказкой» (solves with a hint): for each node, the share of correct assisted attempts (second attempts after the review and attempts after a hint) beside the «сама» estimate. Nodes where «сама» is low and «с помощью» (with help) is high are marked «почти готово» (nearly ready).
3. Frontier: frontier nodes by domain, and nodes not checked for a long time.
4. Errors and misconceptions: traps that fired, with frequency and examples, and error classes.
5. Task log: every attempt as it was shown, with text, answer, correct answer, time, help, review, explanation and draft.
6. Preliminary VWO readiness block, by the rules of the full report, marked «предварительно: без контрольных прогонов» (preliminary: no control runs).
7. Raw data export: the event log and flat tables (CSV, Parquet).

The draft adds that the limits and science screens are simplified in the MVP, and the full report comes later.

### The draft is unclear whether v1 includes the limits and science screens

The v1 list names seven parts and neither a limits screen nor a science screen. The line after it says «Экраны ограничений и естествознания в MVP упрощённые» (the limits and science screens are simplified in the MVP), which implies both screens exist in the MVP in some form. The resolved finding on report v1 below settles it: both screens are in v1, simplified.

### The full report has nine screens

1. Summary: the date of the last session; the number of sessions and tasks this week; the number of nodes in each state, separately for 1F, 1S and stretch; the frontier by domain; the main limits in one line each, for example «держит 2 шага» (holds 2 steps) or «время на фактах растёт к концу сессии» (time on facts grows towards the end of the session); nodes not checked for a long time; flags for fast guessing, anxiety and flow; safety alarms, if there were any.
2. Readiness for the VWO level: see the ladder below.
3. Graph map: every node with its links. Colour shows the state, fill shows confidence and hatching shows an inferred state. Stretch nodes sit in a separate zone «потолок» (ceiling), and the frontier is outlined. Tapping a node opens its card.
4. Node card: the «сама» estimate and its uncertainty, the «с помощью» estimate, the state and its basis (which block, which probe), and every task as it was shown: text, the player's answer, the correct answer, time, help (hint and level), the solution and explanation shown, the second attempt, the error class, the steps, the draft and glossary opens. Accuracy «до разбора» (before review) and «после разбора» (after review). Accuracy and time by subtype. The history of states, lesson tags and, later, anchor forms by Ascent. A button «задание неоднозначное» (the task is ambiguous).
5. Misconceptions: traps that fired, by frequency, with examples. One misconception across several nodes, for example «длиннее — больше» (longer means bigger) in D1 and P1, collapses into one row.
6. Limits: the step ladder, endurance on control facts, a heat map of the times table, «в уме / с черновиком» (in the head / with a draft), language risk, avoidance, fast guesses, anxiety, and flow (the actual success rate against the target of 70-80 %).
7. Dynamics: later, a matrix of node by Ascent; a daily chart of the number of nodes in «бегло» (fluent) or «устойчиво» (stable), verified only; lesson tags on the chart; improvement with and without a lesson; retention.
8. Science: the misconceptions chosen for each topic. The draft frames these as a prompt for a talk or an experiment, not as a grade.
9. Story book: every scene and dialogue by session, with branches marked (success or another path) and floor states; a «плохая сцена» (bad scene) mark; items and creatures the AI created; the queue of missed secrets that will come back.

Deferred until after the MVP by the draft: every screen outside v1, the node-by-Ascent matrix, and anchor forms by Ascent on the node card. The draft didn't say which screens are outside v1; the resolved finding below names only the dynamics screen.

### The VWO readiness block uses a four-step ladder over verified states only

The block shows three measures:

| Measure | Definition |
| --- | --- |
| 1F coverage | share of verified nodes at «понимает» (understands) or above |
| 1S margin | share of 1S nodes in «бегло» or «устойчиво» |
| Ceiling | stretch nodes mastered |

The ladder counts only verified states. Inferred states appear beside it as a separate figure and never count towards a step.

| Step | Condition |
| --- | --- |
| «1S покрыт без запаса» (1S covered with no margin) | at least 90 % of 1F nodes and at least 90 % of 1S nodes are verified at «понимает» or above, and no 1F node is in «не освоен» (not mastered) |
| «1S с запасом» (1S with a margin) | the step above, plus at least 80 % of 1S nodes in «бегло» or «устойчиво» |
| «1S с запасом и потолком выше» (1S with a margin and a ceiling above) | the step above, plus at least 3 stretch nodes in «бегло» or «устойчиво» |
| «1S ещё не покрыт» (1S not covered yet) | otherwise |

An unverified node and an «отрезанный» (cut-off) node count as not covered. The thresholds live in `content/thresholds.json` and change only with a new version. In the MVP the block carries the mark «предварительно: без контрольных прогонов». The block always carries the note «Ориентировочный домашний инструмент. Не официальный совет школы и не стандартизированный тест» (An approximate home tool. Not official school advice and not a standardised test).

### The report exports raw data and a PDF snapshot

The full report's export holds the raw event log (JSONL, Parquet), flat tables of attempts and tasks shown (CSV, Parquet), a field dictionary, and a snapshot of the report as PDF through the browser's print.

### The child never sees the report

The Parent Room is behind a PIN, and its icon in the game is inconspicuous.

### Resolved: report v1 is eight of the nine screens, with simplified limits and science screens, and only the dynamics screen waits

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft lists seven parts for report v1, says the limits and science screens are simplified in the MVP, and defers "every screen outside v1" without naming them. Three options were weighed:

| Option | Better at | Worse at |
| --- | --- | --- |
| Only the seven listed parts, with no limits, science or story book screen | the smallest build | drops the fast-guess share that MVP acceptance checks (below 15 %, RES-3000), the story book the parent must read in stage 0.3 (RES-3000) and the «плохая сцена» (bad scene) mark (RES-1600), and ignores the draft's own "simplified" line |
| Eight screens: all but dynamics, with limits and science simplified | gives the parent everything stage 0.3 asks her to read, at the size two weeks of data can fill | two simplified screens to define, which this finding does |
| All nine screens in full | nothing left for later | dynamics needs Ascents for its matrix and weeks of history for its chart, so in two weeks of play it would stay nearly empty |

The second option wins, because it is the smallest report that still lets the parent accept the MVP. The seven v1 parts sit on these screens: the skill map on the summary (1) and the graph map (3); «решает с подсказкой» on the node card (4), with the «почти готово» nodes listed on the summary; the frontier on the summary and the map; errors and misconceptions on the misconceptions screen (5); the task log on the node card; the preliminary VWO block on screen 2; and the export as a button, not a screen. Lesson tags, which the MVP records, show in the node card's history until the dynamics screen arrives.

The simplified limits screen is one table with a row for each of the twelve limits in RES-1300. Each row shows the current value, smoothed over the last 7 sessions or over as many as exist, the number of sessions behind it, and the draft's flag where it has one. It has no charts and no split by part of the session or by task kind. Where a row has fewer than 3 sessions of data it shows «мало данных» (too little data), a default I chose so a single day's value doesn't read as a trait. The rows:

| Limit | What the simplified row shows |
| --- | --- |
| Holding steps | `stepsHeld` (RES-1300) and the step where mistakes happen most |
| Endurance | the median time of the control facts at the start and at the end of each adventure, the 1.5 times flag, the accuracy flag, and each extension's points if there were any |
| Speed of the basics | the median seconds a fact on A1, A3, A4 and A6a, and the 8x8 heat map as a table |
| Mental or written | for each node, accuracy with and without a scratchpad; no scratch-work images |
| Error type | the shares of conceptual, procedural, computational and unclassified mistakes |
| Carelessness | the number of cases |
| Impulsiveness and rapid guesses | the share of rapid guesses a session, with the flag above 15 %, and the share of too-fast mistakes |
| Avoidance | runs of 3 «Не знаю» a day, and rest stops offered |
| Anxiety | runs of `alt` outcomes and rapid guesses growing towards the end of a session only; erasures, long hesitation and the phrases wait until the log defines them (RES-1300) |
| Flow | the success share a session against the 70-80 % target |
| Language risk | the terms and nodes marked «возможна языковая причина» (possibly a language cause) |
| Help | the share of assisted first attempts, with the flag above 30 % (RES-3000), and the correctness of second attempts |

The summary screen's one-line limits come from the same rows.

The simplified science screen lists, for each of the five topics, every question she answered, the option she chose (only the first answer to each question, RES-0720) and, for a wrong option, the misconception it names. A misconception she chose twice or more is marked as a topic to talk about. The screen shows no score, state or percentage, because the Observatory asks 2-3 questions once every three days (RES-0100), which gives about 2 or 3 answers a topic in two weeks, too few for a share. The full screen later groups the chosen misconceptions by topic over the whole year.

### Resolved: the report names every rule state in words on the design's five chip fills, and adds «Не проверено»

Proposed by research on 2026-09-26; the owner approves it with this record.

The owner's design draws skill states with `SkillState`, which has five states and labels (RES-3200); the rules in RES-0900 produce more. RES-0900 compares the options and holds the reason: the rule states stay, because the VWO ladder must count a cut-off node as not covered and «почти готово» must accept "being clarified", and the design's chip fills, hatching and frontier ring draw them. For this report it means the skill map, the node card and the summary name states with the labels in RES-0900: «Не проверено», «Уточняется», «Не проверялся, отрезан узлом X», «Stretch: не проверялся», «Пока не освоено», «Понимает», «Понимает, нужна скорость», «Бегло», «Бегло» hatched as inferred, and «Устойчиво». The rule «не освоен» in the ladder above is the state the parent sees as «Пока не освоено».

### Resolved: a node is not checked for a long time after more than 30 days, and «почти готово» needs a state below fluent and 0.7 with help over at least 3 assisted attempts

Proposed by research on 2026-09-26; the owner approves it with this record.

Not checked for a long time. The draft names the mark in two places and gives the number in only one. RES-0900 marks a node «давно не проверялся» (not tested for a long time) after more than 30 days without an unassisted first attempt, and drops its confidence to low at the same age; RES-1000 ends its spaced-review ladder at 30 days. The report uses the same 30 days, so the parent sees one age, not two. I compared this with 14 days, the age at which confidence falls from high, but with 79 nodes and about 30 graded tasks a day, most nodes wait longer than 14 days between checks, so the list would hold most of the graph and stop pointing at anything.

«Почти готово» (nearly ready). The draft says only "«сама» low and «с помощью» high". A node gets the mark when:

- its state is «не освоен», «понимает» or «уточняется», that is below «бегло» (fluent);
- its «с помощью» estimate `assistedMean` is at least 0.7;
- that estimate rests on at least 3 assisted attempts within the last 30 days.

The rule uses the node's state for «сама», not `pKnow`, because the report states come from explicit rules the parent can check (RES-0900), while `pKnow` rests on v1 values nobody has fitted yet. The 0.7 is the bottom of the flow corridor of 70-80 % (RES-1000), the success the Director treats as one she can sustain. The 3 attempts keep one lucky hint from marking a node: `assistedMean` starts from one and one, so 3 right out of 3 gives 0.8 and 2 out of 3 gives 0.6. I compared this with a gap rule, «с помощью» at least 0.3 above «сама», which needs `pKnow` and so fails the checkability test.

### Resolved: the language-risk mark «возможна языковая причина» is MVP work in report v1

Proposed by research on 2026-09-26; the owner approves it with this record.

This record listed the language-risk row on the simplified limits screen without saying whether the mark behind it ships in the MVP. RES-0800 and RES-1300 compare building the language-risk limit in the MVP with deferring it to the Dutch layer, and hold the reason for the MVP: the player learns maths in Dutch now, so without the mark every language error in a Russian task reads as a maths gap in the report the parent uses to accept the MVP. For the report this means three places in v1. The node card marks each attempt that went wrong on a task with a risk term she didn't open as «возможна языковая причина» (possibly a language cause). The limits screen's language-risk row lists the marked terms and nodes. The summary highlights a node whose errors all carry the mark, as RES-0800 says. The Dutch locale, formats and curriculum layer stay deferred.

### Resolved: the report marks each day whose active time passed 120 minutes

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record.

The owner removed the daily maximum on 2026-09-27, so nothing caps a day's play (RES-0300). Research then decided that the parent sees long days instead. The summary screen shows each day's active time for the week, counted as the soft stop counts it, and marks a day whose active time passed 120 minutes with the label «долгий день» (a long day). The mark only informs the parent: the child never sees it, and it changes nothing in play. The 120 minutes follow the 2-hour limit on recreational screen time in the Canadian 24-Hour Movement Guidelines, which RES-0300 cites. Two options were weighed. A warning pushed to the parent's phone reaches the parent sooner, but the MVP has no push (RES-1800). A mark in the report needs no new channel and sits beside the other limits the parent reads. The mark wins. If the parent wants to end a day, the Parent Room's «Закончить на сегодня» (Finish for today) control does it (RES-0300).

## Conclusions

1. The report must be current after every adventure and must answer what is mastered, where the frontier is and what holds the player back.
2. The game must not produce a lesson plan.
3. Report labels must be non-judgemental, in the style of «пока не освоено», «понимает, нужна скорость» and «прочно».
4. The MVP report must contain the skill map from unassisted first attempts, «решает с подсказкой» with «почти готово» marks, the frontier, errors and misconceptions, the task log, the preliminary VWO block and the raw data export.
5. The skill map must be computed from unassisted first attempts only, and assisted attempts must appear only in the «с помощью» figures.
6. The VWO ladder must count verified states only, show inferred states as a separate figure, and treat unverified and cut-off nodes as not covered.
7. The VWO ladder must use the thresholds of 90 % for 1F and 1S coverage, 80 % for the 1S margin and 3 stretch nodes for the ceiling, read from a versioned thresholds file.
8. The VWO block must always show the disclaimer that the tool is an approximate home tool, and in the MVP must also carry the "preliminary: no control runs" mark.
9. The node card must show every task exactly as it was shown to the player, with her answer, the correct answer, time, help and review.
10. One misconception that fires in several nodes must appear as one row.
11. The report must be reachable only through the PIN-protected Parent Room, and the child must never see it.
12. The export must include the raw log and flat tables of attempts and tasks shown; the full report must add a field dictionary and a PDF snapshot of the report.
13. Report v1 must have eight screens, the summary, VWO readiness, graph map, node card, misconceptions, limits, science and story book, and the dynamics screen must wait until after the MVP.
14. The v1 limits screen must show one row for each of the twelve limits, with the current value, the number of sessions behind it and the draft's flag, and «мало данных» where fewer than 3 sessions hold data; it must have no charts.
15. The v1 anxiety row must use only runs of `alt` outcomes and rapid guesses growing towards the end of a session.
16. The v1 science screen must list, by topic, each question's first answer and the misconception a wrong option names, mark a misconception chosen twice or more, and show no score, state or percentage.
17. The report must list a node as not checked for a long time when its last unassisted first attempt is more than 30 days old.
18. The report must mark a node «почти готово» when its state is below «бегло» and its `assistedMean` is at least 0.7 over at least 3 assisted attempts within the last 30 days.
19. Report v1 must mark an error on a task with an unopened risk term «возможна языковая причина» on the node card, list the marked terms and nodes in the limits screen's language-risk row, and highlight on the summary a node whose errors all carry the mark.
20. The report must name each node's state with the labels in RES-0900, including «Не проверено», «Уточняется» and the cut-off label, drawn with the design's chip fills, hatching for inferred states and a ring for the frontier.
21. The summary screen must show each day's active time for the week and mark a day whose active time passed 120 minutes as «долгий день», and the child must never see the mark, as research decided on 2026-09-27 on the owner's instruction.

## Sources

- The owner's draft «Хроники Башни — спецификация», sections «Текущий объём (MVP)», «Отчёт v1» and «Отчёт для родителя», read 2026-09-26; not kept in the repository - every finding and conclusion above.
