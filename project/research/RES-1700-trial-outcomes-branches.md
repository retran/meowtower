---
id: RES-1700
artifact: research
status: draft
revised: 2026-09-26
---

# The draft proposes that the Director turns verdicts into story outcomes for each task, room and floor, and that every outcome moves the story on

## Summary

The owner's draft proposes that every task, room and floor gives a story outcome, so the player has a reason to answer correctly and the result shapes the story. The Director computes each outcome deterministically from the verdicts, and the Master only narrates the chosen branch. A task is clean, partial or loosened, judged on the unassisted first attempt alone. A room takes the `success` branch when its share of clean slots reaches 0.6, and a floor is a triumph, a victory or a cunning bypass at 0.8 and 0.5 (the draft had 0.55; research lowered it on 2026-09-26). All three floor states advance the campaign equally, and a missed reward returns within 7 sessions through a queue. The thresholds are starting values that a simulation calibrates at stage 0.1. This record covers the outcome rules, the reward queue, the end-of-day summary and the calibration. It leaves how the Master writes the branches to RES-1600, and the flow limit and the task window to other records.

## The question

How should an answer change the story, so that answering well matters without a wrong answer punishing the player? The draft assumes that visible story rewards for correct answers motivate her without making her anxious. That assumption is untested: a bonus she can miss is also a loss she can notice, which is why the draft hides the streak count, never announces a break and brings every missed reward back.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles: specification), section «Исходы испытаний и ветки сюжета» (Trial outcomes and story branches), on 2026-09-26, with its opening paragraph and «Текущий объём (MVP)» (Current scope, MVP) summary for context.

The draft leaves these points open:

- the calibrated threshold values, which the stage 0.1 simulation sets (starting values proposed below);
- what "mixed-knowledge profiles after a cold start" contain;
- the base experience and button amounts per task (RES-2000 gives the experience, and RES-2100 now proposes the buttons, shards and yarn);
- whether a room of 3-5 slots is chosen by the Director or by a rule.

## Findings

### The draft has the Director compute outcomes deterministically and the Master only narrate them

Each task, room and floor gives a story outcome, so the player has a reason to answer correctly and the result affects the story. The Director computes outcomes deterministically from verdicts; the Master narrates the chosen branch only.

### The draft maps each server verdict to one of three task outcomes

| Verdict | Outcome | What the player sees | Reward |
| --- | --- | --- | --- |
| correct | `clean` - clean untangling | a bright strike, the thread returns to its place; the strike that closes a clean row is a «критическое распутывание» (critical untangling) with a special animation | base experience and buttons + a shard of star steel; +1 to the streak |
| partial (0.5) | `partial` - nearly clean | a strike, the knot comes undone with one loop sticking out | base experience and buttons; the streak neither grows nor resets |
| wrong or «Не знаю» (I don't know) | `alt` - knot loosened, with the badge «Принято» (Accepted) after «Не знаю» | the thread glows softly and loosens, the familiar says a warm neutral line, the Tower sketches another path | base experience and buttons; the streak fades quietly, with no word or "reset" sound |

### Resolved: a spell has three outcomes, clean, almost and loosened, and the room still ends on one of two branches

Proposed by research on 2026-09-26; the owner approves it with this record.

The world bible's laws (CAN-0030) named two spell outcomes: a correct spell untangles the knot cleanly, and «неточное заклинание или честное „не знаю"» (an imprecise spell or an honest "I don't know") loosens it. The System's own rule and its line 21 in CAN-0030 name a third, «почти» (almost), and the draft specification has three: `clean`, `partial` and `alt`. Two options were weighed:

- Two outcomes, clean and loosened. This is simpler to show and to write lines for, and it matches the two room branches. But it has to fold a partial verdict into one side: into clean, which rewards an unfinished answer with a bonus shard and a streak step, or into loosened, which treats an unsimplified fraction the same as «Не знаю».
- Three outcomes, clean, almost and loosened. This keeps the information in a partial verdict. RES-0700 grades some answers partial (0.5), RES-0900 counts them as half right, RES-1000 and this record count them as 0.5 in the success and room shares, and RES-1600, RES-2400 and RES-2550 carry the enum `clean | partial | alt`. The partial credit model (Masters 1982) shows why this matters: an item scored in ordered categories carries more information about the learner than the same item scored right or wrong.

Three outcomes win, because the rest of the design already depends on the partial verdict and a two-outcome canon would force the code and the world to disagree. The canon's "imprecise spell" now means the partial verdict and gives «почти» (almost); a wrong answer or «не знаю» gives «ослаблен» (loosened). The room keeps its two branches, `success` and `alt`, because the room branch is computed from the slot shares and is a separate thing from a single spell's outcome.

### Resolved: the game keeps three outcomes, `clean`, `partial` and `alt`, and the design's five badges are views of them, with «Не знаю» shown as «Принято» inside `alt`

Proposed by research on 2026-09-26; the owner approves it with this record.

The owner's design (RES-3200) gives `OutcomeBadge` five values: `crit` «Критическое распутывание» (Critical untangling), `clean` «Распутан начисто» (Untangled cleanly), `partial` «Почти чисто» (Nearly clean), `soft` «Узел ослаблен» (Knot loosened) and `unknown` «Принято» (Accepted), shown after «Не знаю». Two questions follow: is «Не знаю» its own outcome, and which name does the third outcome take.

For «Не знаю», two options were weighed:

- A fourth game outcome. The Director, the log and the Master would carry a value that means «Не знаю». But its consequences would be the same as a wrong answer's in every place this record lists: 0 in the room and floor shares, the end of the streak, the same base experience and buttons (RES-0010), the short solution and the twin knot (RES-0400). A second value with identical effects invites code that treats the two differently, and any difference in reward would either punish honesty or pay for skipping.
- One outcome, `alt`, with two badges. The verdict already tells them apart: the log records `wrong` or `dont_know` (RES-2550), and the avoidance signal counts runs of «Не знаю» from it (RES-0300). The badge is only the word the player sees.

One outcome wins, because it keeps every rule on streaks, shares and rewards in one place and still lets the player see a different, honest word for «Не знаю». CAN-0030 already gives «Принято» as the System's line after «не знаю», so the badge and the line agree.

For the name, the options were the design's `soft` or the record's `alt`. `alt` is the value in the API, the log, the Director's types and six other records (RES-0100, RES-0300, RES-1100, RES-1300, RES-2300, RES-2400), while `soft` appears only as a badge value and the colour token `outcome-soft`. The game outcome keeps `alt`, and the badge keeps the design's names, because the badge has five values for three outcomes and so is a separate vocabulary: a badge value names a view, not an outcome. The mapping, which the design's `OutcomeBadge/README.md` should state:

| Game outcome | Condition | Badge |
| --- | --- | --- |
| `clean` | `critical` is true (the strike that closes a clean row) | `crit` |
| `clean` | otherwise | `clean` |
| `partial` | - | `partial` |
| `alt` | verdict `wrong` | `soft` |
| `alt` | verdict `dont_know` | `unknown` |

### The draft judges the outcome on the unassisted first attempt alone

The outcome counts only the first attempt. After it the task window shows the correct answer. After `alt` it also shows a free short solution and a second attempt on a parallel task. The second attempt does not affect the outcome, the streak, bonuses or the room branch. After `alt` the familiar says a warm neutral line from the pool, for example «Узел стал мягче. Пойдём тропой вдоль стены» (The knot has gone softer. Let's take the path along the wall), with no word from the shame stop list.

### The draft rewards a clean row with star yarn and shows the streak only as a garland

- 3 clean in a row make a «Чистый ряд» (Clean row): a thread garland over the heroine, +1 star yarn.
- 5 in a row make a «Большой чистый ряд» (Big clean row): a special focus animation and another +1 star yarn; each further 5 gives the bonus again.
- The streak shows only as a glowing garland, with no digits. A broken streak is never announced.
- The streak lives within a session. Warm-ups, check facts and unscored tasks continue it and never break it. The resolved finding below reads "continue" as "pass over without changing it".
- An Ascent has no streaks and no bonuses for correctness.

### Resolved: the streak counts clean scored first attempts within one adventure, a clean row is 3 and a big clean row is every 5

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft names the clean row and the big clean row but leaves three points loose: what grows the streak, what "continue" means for tasks outside scoring, and whether "session" means a sitting or the adventure. The rule:

- The streak counts unassisted first attempts on scored tasks within one adventure. A `clean` outcome that isn't a rapid guess adds 1. A `partial` outcome or a rapid guess leaves it as it is. An `alt` outcome ends it quietly. A second attempt never touches it.
- Warm-ups, check facts and unscored tasks leave it as it is. Two readings of the draft's «продолжают» ("continue") were weighed. If they grew the streak, the easiest tasks of the day, check facts that she answers right almost every time, would pay yarn and threads, so the bonus would reward easy work more than the frontier. If they pass over it, the bonus stays tied to the scored work, and they still never break it, which is all the draft's "never break" asks. The second reading wins.
- A clean row happens when the streak reaches 3: the garland, «критическое распутывание» (critical untangling), 1 star yarn, 1 guiding thread (RES-0500) and the `clean_row` event for the Master. A big clean row happens when the streak reaches 5, 10, 15 and so on: the focus animation, 1 more star yarn and the `big_clean_row` event, with no thread. A streak of 10 therefore gives 3 yarn and 1 thread.
- The streak lives for one adventure. It starts at 0 when an adventure starts and survives «Сохранить и уйти» (Save and leave) and a resume on another day, because leaving must cost nothing (RES-0200).

Base rewards per task come from RES-2000 (experience) and RES-2100 (1 button for every first attempt, 1 shard for a clean scored first attempt that isn't a rapid guess).

### The draft denies bonuses to rapid guesses without showing any difference

An answer faster than the template's `minMs` shows by its verdict as usual, but gives no bonus shard and does not grow the streak. This takes nothing away and looks the same on screen.

### The draft gives a room the `success` branch at a clean share of 0.6 or more

A room's length (3-5) is set before it starts and never changes. At the end of the room, the share of clean slots over all its slots (`clean` = 1, `partial` = 0.5, `alt` = 0) of at least 0.6 gives the `success` branch; anything lower gives `alt`. Both branches finish the room and lead on.

- Every slot of the room counts, including light unscored tasks, which take a slot.
- A rapid guess (`rapidGuess`) counts at most 0.5: correct 0.5, wrong 0. The spell shows by verdict, but a guess never "buys" bonuses, including the sparkling slot of the success branch, and a fast wrong answer is never better than a slow one.
- A warm-up after a pause mid-room takes no slot and is not in the share: it is a separate task before the next slot.

The same 0.5 cap for `rapidGuess` applies to the floor state.

### The draft makes the `success` and `alt` room branches differ in bonuses, never in progress

- `success`: the Tangle is untangled cleanly (a ribbon, a puff of sparks, a sigh of relief). What the Director ordered in `rewardsOnSuccess` opens: a cache, a Diary page, a story shortcut to the Guardian (a secret passage and a bonus scene; the number of tasks does not change, the Director decides the volume), a chance to befriend a rare familiar at a story point, or a special item. A chest with one "sparkling" reward.
- `alt`: the Tangle weakens and gives way in its own manner (shows a side path, falls asleep, bows into the wall), and the heroine takes another, equally interesting road: a new scene, another character, a funny find. A chest with ordinary rewards. Fewer bonuses, but nothing is lost: the Director queues the missed cache or meeting chance, and it returns elsewhere within 7 sessions.

### The draft returns missed rewards through a queue within 7 sessions

The queue is `reward_queue`.

1. The next `lead_in` order first takes `rewardsOnSuccess` from the queue, oldest first, and orders a new reward only when the queue is empty.
2. An entry 6 sessions old is given without a trial in the next floor-entry scene or at the campfire (event `reopened`), so the 7-session limit holds whatever the outcomes.
3. A checkpoint page and legendary rewards never enter the queue: they come by the calendar.
4. A meeting chance returns within the familiar limits (at most one AI-made familiar a week); when the limit is used, a meeting with a roster familiar returns in its place.

### The draft sets three floor states at clean shares of 0.8 and 0.55

The Director combines all scored tasks of the floor's rooms and its Guardian, excluding mental arithmetic, warm-ups and check facts. A clean share of at least 0.8 gives `triumph` («триумф», triumph); at least 0.55 gives `victory` («победа», victory); anything lower gives `cunning` («хитрый обход», cunning bypass). Research on 2026-09-26 lowered the victory threshold to 0.5; the resolved finding on starting thresholds gives the reason.

All three advance the campaign equally: the Guardian lets her pass, the floor counts and quests go on. They differ in the Guardian scene, the System line and the bonuses:

| State | Guardian scene and bonus |
| --- | --- |
| `triumph` | the Guardian's chest with a sparkling and a special reward, a Diary entry, the Guardian's line of recognition |
| `victory` | the ordinary Guardian chest |
| `cunning` | a funny scene where the heroine gets through by cunning, and the ordinary chest |

A floor with no rooms and no Guardian gets no state: the Observatory, or a floor where pacing left only mental arithmetic. It gets an ordinary floor chest, is not mentioned in the day's summary and does not count towards the chapter-finale thresholds.

### The draft computes the floor state after the floor's last scored task

The state is known after the floor's last scored task: the last room, or the Guardian's problem when a Guardian is on the floor that day.

- Floor with a Guardian: the `guardian` order goes to the Master before the Guardian's problem, without the floor state. The Master writes the lead-in and, in advance, three endings `floorEndings` (`triumph`, `victory`, `cunning`, 2-6 lines each); after the problem the Director shows the matching one. If they fail the check or arrive late, an ending of the same state comes from `content/branches.ru.json`.
- Floor without a Guardian that day: the floor result is a System line from the pool by state (categories "floor without a Guardian: triumph / victory / cunning bypass", canon section 3, samples 32-34) and a floor chest of the same quality as the Guardian's chest. No live Master call is needed.
- Floor chest: one at the end of every floor, with or without a Guardian. `triumph` gives a sparkling plus the floor's special reward; `victory` and `cunning` give the ordinary chest.

### The draft summarises the day in words, without numbers or comparison

The end of the row shows floor states in words, for example «На Канале — триумф. На Заводе — хитрый обход, о котором Бригадир ещё долго будет думать» (On the Canal, a triumph. At the Factory, a cunning bypass the Foreman will be thinking about for a long time), with no numbers and no comparison with yesterday. The next day's plan and the chapter-finale variant (triumph or ordinary) use these states.

### The draft expects room clean shares near 0.6-0.7, below the session success rate of 70-80 %

The Director holds the session success rate near 70-80 %, but that rate includes mental arithmetic and check facts with high success, and the room and floor shares do not. So the clean share in rooms is expected lower, near 0.6-0.7: about a third of slots are review with `p >= 0.85`, the rest frontier with `p` near 0.5-0.7. The starting thresholds are only initial values in `content/thresholds.json`: room 0.6, floor 0.5 and 0.8, chapter finale at least half of floor-days in triumph or victory and at least 0.3 in triumph. The draft had floor 0.55 and a chapter third in triumph.

### The draft calibrates the thresholds by simulation at stage 0.1

On mixed-knowledge profiles after a cold start, the thresholds are tuned so that:

| Result | Target |
| --- | --- |
| `success` branch | 55-75 % of rooms |
| cunning bypass | at most 25 % of floor-days |
| triumph | 15-35 % of floor-days |
| triumph variant of the chapter finale | about half of chapters |

The tuned values go into `content/thresholds.json` with a version and into a decision record in `project/adrs/` that the owner approves; the flow test checks these shares. The draft named `docs/decisions.md`; research on 2026-09-26 moved decisions into the project record, and RES-2900 holds the reason. On the "knows nothing" profile cunning bypass may be frequent, which is expected and harmless, because all three states advance the campaign equally.

### The draft makes every outcome a deterministic function of verdicts, seeds and the order

All outcomes are a deterministic function of the verdicts, seeds and the order; the "Outcomes and branches" test checks this.

### The draft records the chapter-finale triumph thresholds in a neighbouring section

The range cites the chapter-finale thresholds without restating them. The draft's campaign section gives them as starting values: at least half of floor-days in triumph or victory, and at least a third in triumph. RES-1600 carries that section. Research on 2026-09-26 lowered the triumph part to 0.3, as the next finding explains.

### Resolved: the starting thresholds are room 0.6, floor 0.8 and 0.5, and chapter finale half in triumph or victory with 0.3 in triumph

Proposed by research on 2026-09-26; the owner approves it with this record.

I ran a small simulation of the draft's own assumptions to check each starting value against the targets above, since the stage 0.1 simulation doesn't exist yet. The assumptions: a third of room slots are review with success 0.85-0.95 and the rest frontier with success 0.45-0.65, so the mean room share is about 0.68, the top of the draft's expected 0.6-0.7. Rooms hold 3 to 5 slots, a floor has 1 or 2 rooms and a Guardian problem on one floor in three, a wrong answer is partial one time in ten, and each day and each floor shifts her success at random (standard deviations of 0.3 and 0.35 on the logit scale). A chapter is 14 days of 3 floors. To see how sensitive each value is, I shifted her success down and up by 0.2 and 0.4 on the logit scale, which moves the mean room share from 0.61 to 0.75.

| Threshold | Draft value | Result at mean room share 0.61 / 0.64 / 0.68 / 0.71 | Target | Proposed |
| --- | --- | --- | --- | --- |
| room `success` | 0.6 | 60 / 66 / 71 / 77 % of rooms | 55-75 % | 0.6, kept |
| floor `triumph` | 0.8 | 18 / 24 / 29 / 36 % of floor-days | 15-35 % | 0.8, kept |
| floor `cunning` below | 0.55 | 38 / 30 / 24 / 19 % of floor-days | at most 25 % | 0.5: 25 / 20 / 15 / 11 % |
| chapter triumph variant, triumph share at least | 1/3 | 2 / 11 / 33 / 68 % of chapters | about half | 0.3: 3 / 16 / 45 / 78 % |

The room and triumph values meet their targets across the draft's expected range, so they stay. At 0.55, cunning bypass passes its 25 % limit whenever the mean room share falls below about 0.68, which is most of the draft's expected range. Lowering it to 0.5 keeps cunning at or under 25 % down to a mean share of 0.61. I compared this with keeping 0.55 and relying on the flow rule to lift the share, but the flow rule targets 70-80 % over all tasks, mental arithmetic included, so the room share stays below that.

The chapter rule is the least stable. A chapter averages about 42 floor-days, so the share of triumphs barely varies between chapters at a given level, and a fixed threshold gives either nearly every chapter or nearly none. With a third, about half of chapters come only at a mean room share near 0.7. A threshold of 0.3 gives about half at 0.68, the draft's expected level. No fixed value holds "about half" across the range, so the owner's first-month review in RES-3000 must check the actual share of triumph chapters and move this value first. The "half in triumph or victory" part always holds once cunning stays under 25 %, so it only guards against a bad chapter.

These are starting values. The stage 0.1 simulation still sets the calibrated values, with the profiles and the flow rule of the real Director.

### Resolved: the canon says what decides a room's branch in words, and the number stays in the game rules

Proposed by research on 2026-09-26; the owner approves it with this record.

CAN-0050 asked whether the canon adopts the room threshold, now a starting value of 0.6 by the finding above. Two options were weighed. Writing 0.6 into the canon is better at giving the Master one exact rule to read. Leaving the number to the game rules is better at keeping one copy: the threshold lives in `content/thresholds.json`, the stage 0.1 simulation and the first-month review can change it, and a canon copy would drift at the first change. The Master never computes a branch anyway, because the Director sends it (RES-1600). So the canon says only that a room ends cleanly when enough of its spells untangled cleanly, with an almost counting for half, and that the game rules hold the exact share.

## Conclusions

1. The Director must compute every task, room and floor outcome as a deterministic function of verdicts, seeds and the order, and the Master must never compute one.
2. A task's outcome must depend on the unassisted first attempt alone; the second attempt must not affect the outcome, the streak, bonuses or the room branch.
3. Every outcome, including a wrong answer or «Не знаю», must give the base experience and buttons and must move the story on.
4. The streak must show only as a garland without digits, and its break must never be announced by word or sound.
5. A rapid guess must never earn a bonus shard or grow the streak, and must count at most 0.5 in the room and floor shares, without looking different on screen.
6. A room's length must be fixed before it starts, and its branch must follow from the clean share over all its slots against the room threshold.
7. Both room branches and all three floor states must advance the campaign equally and differ only in scenes, lines and bonuses.
8. Every reward missed on an `alt` branch must return within 7 sessions, except checkpoint pages and legendary rewards, which follow the calendar.
9. A floor without rooms and without a Guardian must get no state and must stay out of the day's summary and the chapter-finale thresholds.
10. For a floor with a Guardian, all three endings must exist before the Guardian's problem, from the Master or from the fallback library.
11. The end-of-row summary must state floor states in words, with no numbers and no comparison with earlier days.
12. The outcome thresholds must live in a versioned data file and must be calibrated by simulation to the target shares before release, with a test that checks the shares.
13. A single spell must have exactly three outcomes: `clean` for a correct verdict, `partial` («почти», almost) for a partial verdict, and `alt` («ослаблен», loosened) for a wrong answer or «Не знаю»; the canon and the line pool must use the same three.
14. The streak must grow only on a `clean` unassisted first attempt on a scored task that isn't a rapid guess, stay unchanged on `partial`, a rapid guess, a warm-up, a check fact or an unscored task, and end on `alt`.
15. A clean row must fire when the streak reaches 3 and give 1 star yarn and 1 guiding thread; a big clean row must fire when it reaches each multiple of 5 and give 1 more star yarn.
16. The streak must start at 0 with each adventure and must survive leaving and resuming that adventure.
17. The tuned outcome thresholds must be recorded as a decision record in `project/adrs/`, approved by the owner, beside their version in `content/thresholds.json`.
18. The starting outcome thresholds must be room 0.6, floor triumph 0.8 and victory 0.5, and chapter triumph variant at least half of floor-days in triumph or victory with at least 0.3 in triumph, until the stage 0.1 simulation calibrates them.
19. The first-month review must check the actual share of triumph chapters and adjust the chapter triumph share first, because a fixed chapter threshold swings from nearly none to nearly all chapters as her mean room share moves by 0.1.
20. «Не знаю» must give the `alt` outcome with every consequence of a wrong answer, and the game must show it with the badge «Принято», while a wrong answer shows «Узел ослаблен».
21. The outcome badge must follow the mapping in this record: `crit` for a critical `clean`, `clean`, `partial`, `soft` for `alt` after a wrong answer and `unknown` for `alt` after «Не знаю».
22. The canon must describe the room's branch rule in words and leave the threshold's value to `content/thresholds.json`.

## Sources

- The owner's draft «Хроники Башни — спецификация», section «Исходы испытаний и ветки сюжета», with the opening, «Текущий объём (MVP)» and the chapter paragraph of «Кампания, сезоны, сессии» for context, read 2026-09-26; not kept in the repository - every finding above.
- G. N. Masters, "A Rasch model for partial credit scoring", Psychometrika 47 (1982), pages 149-174, https://link.springer.com/article/10.1007/BF02296272, read 2026-09-26 - scoring in ordered categories keeps more information than right or wrong.
- A Monte Carlo simulation of rooms, floors and 14-day chapters under the draft's own assumptions, run by research on 2026-09-26 with 1,500 chapters for each level; not kept in the repository - the table of threshold results in the resolved finding on starting thresholds.
