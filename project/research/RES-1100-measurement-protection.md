---
id: RES-1100
artifact: research
status: approved
revised: 2026-09-26
---

# The draft proposes guarding the measurement against drilling, fatigue and guessing, and defers comparable Ascent runs until after the MVP

## Summary

The owner's draft proposes four guards on what the first attempts measure. Generated tasks don't repeat within a window, so daily play doesn't drill the test. A fatigue signal from control-fact timings halves the weight of later tasks. Answers faster than a per-template minimum time count as rapid guesses and earn nothing, while «Не знаю» (I don't know) always earns the same base experience. The draft also designs the Ascent, a fortnightly chapter finale on fixed anchor forms that gives comparable points for dynamics, and defers the Ascent and its anchor forms until after the MVP. This record carries over the Ascent, anchor forms, the training effect, fatigue and measurement protection. Task selection is in RES-1000, limits in RES-1300 and lesson marks and dynamics in RES-1400.

## The question

How does the game keep a first attempt an honest measurement when the same game rewards correct answers and shows solutions? The draft assumes that guards inside daily play are enough for the MVP, with comparable anchor runs added later from the event log. The assumption leaves the MVP's dynamics weaker: the draft itself says that without Ascents, comparability over time is lower.

## Method

Read the owner's draft «Хроники Башни - спецификация» (Tower Chronicles - specification), sections «Восхождение: контрольный прогон» (Ascent: the control run), «Якорные формы» (Anchor forms), «Эффект тренировки» (The training effect), «Усталость» (Fatigue) and «Защита измерения» (Protecting the measurement), on 2026-09-26, with the opening lines for context.

The draft leaves these open:

- which nodes fall into the three rotation groups, which a content file `content/anchors.json` is to hold;
- the device motor correction per key press used in `minMs` (proposed below, in the resolved finding on `minMs`);
- what "заметно выше, чем в прошлые дни" (noticeably higher than on past days) means as a number for the «Не знаю» and hint flag;
- how much the Director raises the share of free input and review after a flag;
- the rewards the draft names (shards, star yarn, garland, sparkling slots), which other sections define.

## Findings

### The Ascent is deferred until after the MVP by the draft

The draft marks the Ascent «Позже, по итогам игры (не в MVP)» (later, after seeing the player's play; not in the MVP). Without Ascents, the comparability of dynamics over time is weaker. The event log keeps everything, so Ascents can be added later and matched against the history.

### The Ascent is a fortnightly chapter finale on anchor forms

Deferred until after the MVP by the draft. The Ascent closes a chapter once every two weeks and gives a comparable point of dynamics on anchor forms. In the story the whole Tower is re-tied and the heroine climbs through every floor.

| Part | Tasks |
| --- | --- |
| Anchor forms, 2 tasks a node, about 30 nodes | about 60 |
| Ladder T1-T4, 2 tasks a step, library only | 8 |
| Control facts | 6 |
| Island check | about 8 |
| Science, 2 questions x 5 topics | 10 |
| **Total** | **about 92** |

### The Ascent takes at most 30 nodes, with a fixed rotation group each time

Deferred until after the MVP by the draft. The anchor budget is about 60 tasks, so an Ascent holds at most 30 nodes. The mandatory nodes (levels 1F and 1S) are split in advance into three fixed rotation groups of 23 nodes, even across domains, in `content/anchors.json`. Ascent number k always includes group k mod 3, so every mandatory node gets an anchor once in 3 Ascents. The remaining places go by priority:

1. nodes with lesson marks since the last Ascent;
2. nodes whose state changed since the last Ascent;
3. frontier nodes by falling value;
4. admitted stretch nodes.

Inside one priority level, the node whose last anchor is oldest goes first. Nodes «отрезан» (cut off) and «stretch: не проверялся» (stretch: not checked) are skipped, their place in the rotation group passes to the next priority, and they get an anchor at the first Ascent after the cut is lifted.

### The Ascent runs over one or two days and replaces the adventure

Deferred until after the MVP by the draft. If the hour ends, the Ascent continues the next day, inside a 48-hour window. Eye exercise, rest stops and the soft stop work as usual. An Ascent day replaces the ordinary adventure; in the story it is the chapter finale.

### The draft chooses rewards for completion over rewards for correctness in the Ascent

Deferred until after the MVP by the draft. Spells show outcomes as usual, «чисто / частично / ослаблен» (clean / partial / weakened), but no Ascent task earns a correctness bonus: not anchors, the ladder, control facts, islands or science. Each answer earns only base experience and buttons, as «Не знаю» does. Shards for clean untanglings, star yarn, streaks (the garland doesn't grow) and «сверкающие» (sparkling) slots are not awarded. Each Ascent room ends in one neutral climbing scene, branch `ascent`, where the Tangle gives way and the heroine climbs higher, with no `success` or `alt` branch and no missed rewards. The chest after a room holds three "good" rewards and the player picks 1 of 3; floors have no states. Rewards come for completion: a chest for each floor completed, and after the last task the chapter title, the chapter's main reward and the chapter-finale chest. The daily sessions of the chapter have already decided the finale variant, «триумф» (triumph) or ordinary. The reason the draft gives: anchor tasks must not become "an exam with a prize", and the absent flow rule must not affect the story or the rewards. Easy ungraded tasks after a run of `alt` outcomes and every anxiety signal still work in the Ascent; the easy tasks sit outside the anchor budget.

### Each node has four parallel anchor forms

Deferred until after the MVP by the draft, together with Ascents.

- Each node has four anchor forms A-D of 2 tasks each, in `content/anchors.json`. An anchor stores the template, its version, the parameters and the finished text, so editing the template doesn't change it.
- The forms are parallel by construction: the same subtype and the same difficulty features of the parameters (number of carries, zeros, number of digits, fraction type), checked by a test.
- Anchors appear only in Ascents, and a node's forms cycle A, B, C, D. With rotation at least once in 3 Ascents, the same task returns after 8 weeks at the earliest, usually later.
- The generator's stop list holds every anchor's parameters, so daily play never produces the same numbers. Small spaces (times-table facts, addition to 20, control facts) are the exception: the stop list doesn't apply there, and repeats measure automaticity.
- A typo in an anchor is fixed under a new anchor id, and the old one is marked obsolete.
- After an anchor task the correct answer is not shown.

### Ascent dynamics are aggregates, because two tasks a node are too few

Deferred until after the MVP by the draft. The main Ascent dynamics are the share correct and the median time by domain and by level 1F / 1S / stretch. For one node an anchor is only a flag, a change of two tasks in one direction, and a contribution to «устойчиво» (stable). The engine does not estimate a form difficulty correction from one child. If the forms diverge by more than 25 % in aggregate on two Ascents in a row, the anchors are flagged for checking.

### Generated tasks don't repeat inside a window

Daily play must not drill the player for the test. A generated task (template plus parameters) doesn't repeat within `min(30 days, 20 % of the subtype's parameter space in shows)`; the parameter hash is stored in `items`. Small spaces (times-table facts, addition to 20, control facts) allow and need repeats, because they measure automaticity, not problem solving. The number of shows of each subtype is stored, and the report shows how many times the player saw similar tasks. Anchors, later, appear only in Ascents and never match daily tasks.

### Showing solutions inflates first attempts on familiar subtypes

Daily play shows the correct answer and the solution after an attempt, so part of the growth in first attempts on familiar subtypes is consolidation of the format. The report shows the subtype's number of shows beside the accuracy «до разбора» (before the review) and «после разбора» (after the review). Ascents are to bring comparable points later. Once Ascents exist, if a node's daily estimate rises and its anchor form doesn't, the report flags «возможно, привыкание к формату» (possibly used to the format). The report tells apart «улучшилось после урока» (improved after a lesson), «улучшилось без урока» (improved without a lesson) and «сохранилось через 2 недели» (kept after 2 weeks); RES-1400 carries those rules.

### The draft chooses a fatigue signal from time alone over one from accuracy

The fatigue signal uses only control-fact timings: it fires when a point's median time exceeds 1.5 times the median of the opening point. Accuracy stays out of the signal, so fatigue is not confused with task difficulty or with a run of `alt` outcomes, which the anxiety signal watches. On the signal the story offers a rest stop. Tasks after the signal carry weight 0.5 and cannot produce «не освоен» (not mastered).

### Answer formats limit guessing

The motive to answer correctly helps engagement but brings a risk of guessing and anxiety. Free input is the default. Graded multiple-choice tasks have at least 4 options. A probe made only of multiple-choice tasks has 3 tasks. Graded tasks never use yes / no or comparison by sign. The section on answer input and checking holds the detail.

### «Не знаю» is always available and costs nothing

«Не знаю» is always on offer and earns the same base experience. Session 0 tells the player plainly that an honest «Не знаю» is better than a guess.

### Answers faster than `minMs` count as rapid guesses

A template's minimum time `minMs` is the threshold for a plausible answer. By default it is `max(1500 ms, min(0.15 * fluencyMs, 10 000 ms))` plus the device motor correction for the number of key presses, as the resolved finding below sets out; the draft had `max(1500 ms, 0.3 * fluencyMs)` with no cap. For small spaces (times-table facts, addition to 20, control facts) it is only the motor correction plus 600 ms. An answer faster than `minMs` is marked `rapidGuess`: the outcome shows by the verdict, but no bonus is paid, the streak doesn't grow, the answer stays out of estimates and blocks, and the report counts it under the limit «Быстрые угадывания» (fast guesses). If such answers exceed 15 % of a session, the Director raises the share of free input and review tasks, and the parent sees a flag.

### Anxiety leads to easier tasks, never to pressure

Runs of `alt` outcomes lead to an easy task and a campfire scene, never to pressure. The section on rest stops and exit holds the detail.

### Help doesn't buy a grade

A hint before the answer costs a guiding thread and makes the attempt assisted. A second attempt after the review changes neither the outcome, the streak, the bonuses nor the branch. So «Не знаю» taken to reach the review gains nothing in the game. The Director tracks the share of «Не знаю» and hints on first attempts. If it exceeds 30 % in an adventure and is noticeably higher than on past days, the parent sees a flag and the Director raises the share of review.

### Bonuses only add

Nothing is ever taken away. A mistake therefore costs no more than «Не знаю», and an honest «Не знаю» costs no more than a guess.

### A simulation checks the guards against guessing profiles

The simulation runs a "guesses" profile and a "rushes for bonuses" profile, the second answering faster than `minMs` in 30 % of tasks. Node estimates must not rise by more than 5 percentage points over the same profile without guessing.

### Resolved: minMs is max(1500 ms, min(0.15 * fluencyMs, 10 000 ms)) plus her measured time per key press, and motor correction plus 600 ms in small spaces

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's `0.3 * fluencyMs` flags too much in long templates. `fluencyMs` is the median time of a fluent child, so 30 % of it is 7.5 s for A5, 18 s for A7 and 36 s for a T4 word problem. A fluent child can answer an A5 subtraction in under 7.5 s, and every such answer would lose its bonus and drop out of the estimate. The two errors cost different things: a real answer marked as a guess loses one measurement and a reward, while a guess that slips through adds one noisy observation that `pGuess` already allows for. The rapid-guessing literature therefore sets thresholds low.

Two published rules were compared. Wise and Kong (2005) used fixed thresholds by the length of the item: 3 s under 200 characters, 10 s over 1,000 characters and 5 s between. Wise and Ma (2012) set the threshold at 10 % of the item's mean response time, capped at 10 s (NT10), and showed that answers under it were right at about chance rate. The length rule needs no timing data but ignores that a four-step word problem needs more thought than its text length shows. NT10 fits each item, which suits a catalogue whose thresholds run from 3 s to 120 s, so it wins. RES-1000 expects her to take 1.0 to 1.5 times `fluencyMs` a task, so 10 % of her mean time is 0.10 to 0.15 of `fluencyMs`; the rule takes 0.15, the end that catches more guesses, keeps the NT10 cap of 10 s and keeps the draft's floor of 1500 ms for reading the task. The new rule gives 1.5 s for N1, 3.75 s for A5, 9 s for A7 and 10 s for A10 and T4, each plus the motor correction.

The motor correction in `minMs` is the median time per key press she showed in the pure-input tasks of Session 0 on this device type, times the number of key presses in the correct answer, «Готово» (Done) included. Until Session 0 exists on a device type, the correction is 0, which lowers `minMs` and so errs towards counting an answer, the cheaper error. Small spaces keep the draft's rule, the motor correction plus 600 ms, because a fact retrieved from memory is fast by design; RES-1300 compares those thresholds with published fact norms.

### Resolved: the T1-T4 ladder runs in daily MVP play through the Guardian, and the steps-held limit needs 2 problems a step gathered across days

Proposed by research on 2026-09-26; the owner approves it with this record.

The Ascent ladder of 2 tasks a step (8 tasks) stays deferred with the Ascent. Daily MVP play gives the limit its data through the Guardian's ladder of the day and the T nodes' ordinary room tasks; RES-1300 holds the reasons and the rule.

## Conclusions

1. A generated task must not repeat within `min(30 days, 20 % of the subtype's parameter space in shows)`, except in times-table facts, addition to 20 and control facts, and each task must store its parameter hash.
2. The game must store the number of shows of each subtype and report it beside the accuracy before and after the review.
3. The fatigue signal must fire only when a control-fact point's median time exceeds 1.5 times the opening point's median, and must ignore accuracy.
4. After the fatigue signal, the story must offer a rest stop, and later tasks must carry weight 0.5 and must not produce «не освоен».
5. Free input must be the default; graded multiple-choice tasks must offer at least 4 options, a probe of multiple-choice tasks only must hold 3 tasks, and graded tasks must never use yes / no or comparison by sign.
6. «Не знаю» must always be available and must earn the same base experience as an answer.
7. An answer faster than `minMs`, `max(1500 ms, min(0.15 * fluencyMs, 10 000 ms))` plus the motor correction, or the motor correction plus 600 ms in small spaces, must be marked `rapidGuess`, earn no bonus, not extend the streak and stay out of estimates and blocks.
8. If rapid guesses exceed 15 % of a session, the Director must raise the share of free input and review, and the parent must see a flag.
9. A hint before the answer must cost a guiding thread and make the attempt assisted, and a second attempt must not change the outcome, streak, bonuses or branch.
10. If «Не знаю» and hints exceed 30 % of first attempts in an adventure and clearly exceed past days, the parent must see a flag and the Director must raise the share of review.
11. The game must never take away a reward, so that a mistake costs no more than «Не знаю».
12. A run of `alt` outcomes must lead to an easy task and a campfire scene, never to pressure.
13. The simulation must show that the guessing and bonus-rushing profiles inflate node estimates by no more than 5 percentage points.
14. The event log must keep enough to add Ascents after the MVP and compare them with the history, and until then the MVP's dynamics must carry the lower comparability the draft admits.
15. The motor correction in `minMs` must be her Session 0 median time per key press on the device type times the key presses of the correct answer, and 0 until Session 0 exists on that device type.
16. The Ascent's ladder of 2 tasks a step stays deferred with the Ascent, and the steps-held limit must take its data from daily play as RES-1300 sets out.

## Sources

- The owner's draft «Хроники Башни - спецификация», sections «Восхождение: контрольный прогон», «Якорные формы», «Эффект тренировки», «Усталость» and «Защита измерения», read 2026-09-26; not kept in the repository - every finding in this record.
- S. L. Wise and X. Kong, "Response time effort: A new measure of examinee motivation in computer-based tests", Applied Measurement in Education 18(2), 2005, 163-183, read through its summary in the PISA study at https://www.psychologie-aktuell.com/fileadmin/Redaktion/Journale/ptam_2022-3/PTAM__3-2022_5_kor.pdf and search results on 2026-09-26 - thresholds of 3, 5 and 10 s by item length.
- S. L. Wise and L. Ma, "Setting response time thresholds for a CAT item pool: The normative threshold method", 2012, read through https://link.springer.com/article/10.1186/s40536-021-00100-w on 2026-09-26 - NT10, 10 % of the mean item time capped at 10 s, with flagged answers right at about chance rate.

