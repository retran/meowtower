---
id: RES-4000
artifact: research
status: approved
revised: 2026-09-28
elaborates: [RES-0300, RES-2700, RES-3000]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Addendum 1 keeps the no-clock, first-attempt and Master rules, and its day, model and scope rules change five approved decisions and seven requirements

## Summary

The owner's addendum 1 of 2026-09-28 keeps three approved rules as they stand: her screens show no clock, only unassisted first attempts measure, and the Master sees no maths. It changes the rest. Nothing may open or close by the time of day, so the window after the finale «until 04:00» goes. The game day stays at 04:00 as an unseen service boundary and keeps every daily job, the daily quests and daily rewards included. The new forms must write separate streams, which ADR-0060's rule on observations doesn't yet allow. A composed riddle may leave the Mac only with its numbers masked, and the school's goal list stays on the Mac. The sandbox spends from the offline key, so the play key's daily caps stay under its $60 monthly limit. The 42 new event types have no owning decision. The MVP grows by eleven items and a Dutch word bridge, and the player plays a fact-measurement stage before stage 0.3, so measurement starts well before the M7 horizon of 2027-01-15. The open questions are decided on 2026-09-28 below. This record covers the addendum's rules for every item, its event list, its model table and its build order; the thirteen items themselves belong to other records.

## The question

What must the approved record now say so that it carries the addendum's six rules for every item, its event list, its model table and its build order? The owner's addendum overrides the approved record where they disagree, so the question is where they disagree and what each disagreement changes.

The addendum assumes that the game day can become a service boundary that "closes nothing", as if the day were used only for the one-adventure rule and the soft stop. That assumption doesn't hold on the approved record. The day also resets the threads, the quests, the shop and two budgets, counts the three-day rule, and ends two parent and safety measures, and two of those uses close something. The addendum also assumes that a separate model role keeps the Master rule and the privacy rule intact. A separate role keeps the Master blind, but it still sends data off the Mac, so the privacy rule needs its own answer. Last, the addendum assumes that a larger MVP still lets fact automaticity be measured "from the first day" before M7, while the approved stage order lets the player play only once the whole MVP is built.

## Method

On 2026-09-28 I read the addendum in full, and closely its rules for every item, «События», «Модели и бюджет», «Приёмочные тесты» and «Порядок внедрения». I read items 1 to 13 only for the facts those four parts depend on.

I searched the record with `paw find` for taskless, Dutch and refit, and with `grep` over `project/` for 04:00, game day, day boundary and time of day. I read in full ADR-0090 and ADR-0100, the event catalogue and envelope of ADR-0020, the observation and activation rules of ADR-0060, and the stages, MVP scope and baselines of ADR-0190. I read SPC-0030's parts on days and the end of the day, and the approved requirements those decisions address on time, measurement, privacy, budgets and scope. A research record cites no requirement, so the findings name each requirement by what it says and by the decision line that carries it. I read the conclusions of RES-0300, RES-2700 and RES-3000, and the lines of ADR-0110, ADR-0130, ADR-0140 and ADR-0180 that `grep` found. All reads are at revision 47c0a7b.

I didn't read the untracked `design/` prototype, the canon or Cito's documentation, and I ran only `paw status` and the searches above. Line numbers refer to revision 47c0a7b.

## Findings

### The addendum keeps the no-clock rule as the record states it

The addendum says no new mechanic rewards speed or shows time, and its acceptance test 9 checks exactly that. ADR-0090 line 106 forbids a timer, countdown, clock or time bar on her screens, as the approved requirement on her screens does. The two agree. Item 8 keeps to the rule: «Залп» (Volley) shows no time and grants rewards by accuracy, and fact automaticity uses a hidden 3-second threshold only for measurement and review. Source: the addendum, read 2026-09-28; ADR-0090, read 2026-09-28.

### Timetable tasks put clock times on her screen, which ADR-0090's screen check would flag

Item 9's track I3 asks about timetables and durations across the hour and midnight, and the Dutch bridge includes «hoe laat», «vertrektijd» and «aankomsttijd». Those tasks print times of day inside a task. ADR-0090 line 183 has a Playwright check that walks every player screen and "finds no text matching a clock". The check can't tell a time printed in a task from a clock that shows her own time, so it fails on the first I3 task. The rule survives, because it's about her own time; the check needs to exclude the task's own content. Source: the addendum, item 9 and the bridge, read 2026-09-28; ADR-0090 line 183, read 2026-09-28.

### The new forms must write separate streams, but ADR-0060 takes every graded unassisted first attempt into "on her own"

The addendum says new forms write their observations as separate streams and stay out of the "on her own" estimate of the computational subtypes. ADR-0060 line 45 takes an attempt as an observation whenever it's a graded, unassisted first attempt, and excludes only rapid guesses, excluded tasks and ungraded tasks. A composed riddle, a plan, an estimate or a task with mixed Dutch wording is a graded unassisted first attempt, so under ADR-0060 as written it would enter the node's estimate. The approved requirement behind that line only restricts evidence to unassisted first attempts, so it permits the new exclusion and needs no change. Source: the addendum, read 2026-09-28; ADR-0060 line 45, read 2026-09-28.

### The gate the addendum names for letting a stream in already exists, and it can't open during the MVP

The addendum lets a stream into "on her own" only when an offline refit shows it improves prediction. ADR-0060 line 145 already activates a model version only when it predicts held-out unassisted first attempts with lower log-loss and lower calibration error than the active one. The same line defers the refit tool, `tools/fit-model.ts`, until after the MVP. So the two rules fit together, and in the MVP no new stream enters the estimate. Source: the addendum, read 2026-09-28; ADR-0060 line 145, read 2026-09-28.

### Item 4 adds subtypes to the word-problem nodes, and the rule on streams doesn't say whether they count

Item 4 adds `*.surplus` and `*.missing` subtypes to T1 to T4. ADR-0060 line 77 computes a node's estimate as the weighted mean of its subtypes, so a new subtype with a weight enters "on her own" at once. The rule for every item keeps new forms out of the estimate of the computational subtypes. Whether a subtype with an extra or a missing number counts as a computational subtype or as a new form isn't stated. Source: the addendum, item 4 and the rules for every item, read 2026-09-28; ADR-0060 line 77, read 2026-09-28.

### The addendum keeps the Master blind to maths, as the record does

The addendum says the Master receives only outcomes and that every new use of a model is a separate role checked by the engine. ADR-0110 lines 44 to 46 give the Master's request no field for a number, an answer, a verdict or a node's state. ADR-0100 lines 70 to 72 refuse a digit, a node id or a topic name in a request to the Master or the planner. The two agree, and «Свободное перо» (Free Pen) stays within them, because it holds no tasks. Source: the addendum, read 2026-09-28; ADR-0100 and ADR-0110, read 2026-09-28.

### The model table gives default models, not roles, for two offline jobs, and the planner's role can't do them

The addendum's table names `PLANNER_MODEL` as the default model for framing the hint rungs in the familiar's voice and for retelling puzzles, both offline. The column holds the default model, so these two jobs have no role of their own. The planner's role can't take them for three reasons. It's a play role on the player tier (ADR-0100 lines 25 to 28 and 77 to 79), and the gateway refuses a play role on the offline key (ADR-0100 lines 132 to 135). A retold puzzle carries numbers and names an idea such as parity, which ADR-0100 lines 70 to 72 refuse in a planner request. The record's offline path for content is `GEN_MODEL` with `CHECK_MODEL` on the offline key (ADR-0130 line 30). The blind check of puzzles by `CHECK_MODEL` already fits that path. Source: the addendum, «Модели и бюджет» and items 1 and 7, read 2026-09-28; ADR-0100 and ADR-0130, read 2026-09-28.

### The riddle parser sends her scored answer, with her numbers, off the Mac

The parser, `PARSE_MODEL`, receives the text of the riddle she composed, with her own numbers, and returns a graph that the engine scores into verdicts and error classes. ADR-0100 lines 55 to 62 let out her story material, the age and the one-task explanation request, and give answers no field to travel in, as the approved requirement on data leaving the Mac does. The single answer an explanation request carries is the one exception. The riddle is her answer to a scored task, so it falls on the forbidden side. ADR-0100 lines 38 to 53 allow five request classes and none fits a parse request. Lines 70 to 76 turn digit runs in her free text into «[число]», which would leave the parser nothing to parse. The addendum's own safeguards stand: the privacy filter runs first, and the parser never sees the target expression. Source: the addendum, item 2, read 2026-09-28; ADR-0100, read 2026-09-28.

### The school's goal list can carry her school group off the Mac

`GOALS_MODEL` receives the goal list the parent pastes from the school, and the addendum says only the goals' text goes to it. ADR-0100 lines 60 to 62 give her school group no field to travel in. The egress guard cleans the family names, school, street and city the parent set (ADR-0100 lines 63 to 69), and it has no rule for a school group. When the pasted list names her group, as a school's goal overview can, the request carries it. Source: the addendum, item 8, read 2026-09-28; ADR-0100, read 2026-09-28.

### The two new daily budgets pass the monthly limit that was set above the daily ones

The daily caps today are $1.5 an adventure and $0.3 for explanations, $1.8 a day. ADR-0100 lines 263 to 265 set the $60 monthly limit above the $55.80 they allow in 31 days, so that it catches only a runaway bug. The addendum adds `PARSE_BUDGET_USD_PER_DAY = 0.1` and `SANDBOX_BUDGET_USD_PER_DAY = 1.0` and puts the sandbox inside the common monthly limit. The daily caps then sum to $2.9, or $89.90 in 31 days. With the sandbox used in full every day, the limit runs out around day 21, and ADR-0100 line 127 then sends every session to fallbacks until the month ends, the player's included. Without the sandbox the caps sum to $58.90, still under $60. Source: the addendum, «Модели и бюджет» and item 13, read 2026-09-28; ADR-0100 lines 123 to 127 and 263 to 265, read 2026-09-28.

### The sandbox's own model log hides its spend from the game's monthly count

The addendum gives the sandbox a separate `llm_log`, while its calls count in the common monthly limit. ADR-0100 line 127 stops play at $60 "by the game's own count and by the play key's" limit. ADR-0100 lines 376 to 377 expect each day's `llm_log` sum within 5 % of the key's reported usage. A count that reads only the main `llm_log` misses the sandbox, so the key's limit ends the month before the game's count does, and that check fails on any day the parent uses the sandbox. Source: the addendum, item 13, read 2026-09-28; ADR-0100, read 2026-09-28.

### The approved record opens screens by the time of day in ADR-0090, its requirements and approved research

The addendum ends every window by the time of day, and names the two lines "after the finale until 04:00" and "the day ends at 04:00". The record states them here:

- ADR-0090 line 60: a game day ends at 04:00 in the time zone of the device she plays on, as the approved requirement on the game day's end says.
- ADR-0090 line 85: after the finale and until 04:00 the server sends no task and opens only screens without tasks, as the approved requirement on screens after the finale says.
- ADR-0090 line 48: after Session 0 only screens without tasks open until 04:00.
- RES-0300 conclusions 10 and 22, lines 167 and 179, and RES-0100 line 53: the same window, in approved research.
- RES-3500 line 69: the screen flow «Башня без заданий» (the Tower without tasks) opens after the finale until 04:00.

ADR-0090 lines 57 and 75, and the requirement they carry, count the eye exercise on the screens without tasks "after the finale". Once those screens are open at any time, that rule must hold at any time. Source: the addendum, read 2026-09-28; the records named, read 2026-09-28.

### The record uses the game day for more than the two jobs the addendum names

The addendum keeps the day boundary for one adventure a day and for the soft stop's daily count. The record uses it for more. It grants the morning's threads (ADR-0080 line 35) and picks the daily quests and the shop's new slots (ADR-0140 lines 62 and 104). It resets the explanation budget (ADR-0100 line 126) and ends a pause of live frames (ADR-0130 line 42). It counts adventure days for the three-day rule (SPC-0030 line 160). It ends the frontier cap after a second anxiety signal (ADR-0090 line 102) and the lowered creepiness level (ADR-0110 line 195). It ends «Закончить на сегодня» (Finish for today) (ADR-0090 line 83, SPC-0030 lines 174 and 195).

None of these shows her a time. Two close something at the boundary. «Закончить на сегодня» keeps the adventure closed and refuses «Ещё один ряд» (One more row) until the next day, and the three-day rule wraps up an adventure at the first session of a new day. Both close by a count of days or by the parent's act, not by an hour. Source: the addendum, read 2026-09-28; the records named, read 2026-09-28.

### Screens open "always" is new during an adventure, and the addendum words the puzzles two ways

The addendum makes the heroine's room, the Diary, the forge, the shop, the familiars, the puzzles and «Свободное перо» available always. ADR-0090 line 85 opens those screens only after the finale. Item 7 gives the one rule of access the addendum spells out. Puzzles open at any time except with the task window open: during an adventure at a rest stop, and after the finale for as long as she likes. Acceptance test 8 says puzzles come "not before the adventure's finale". The two agree only if test 8 means that a new puzzle appears after the finale, as item 7 says under «Где в игре». Source: the addendum, the rules for every item, item 7 and test 8, read 2026-09-28; ADR-0090, read 2026-09-28.

### The soft stop, extensions and eye exercises already count play time, and the day keeps no maximum

The addendum says the soft stop, extensions and eye exercises work as before, by play time. ADR-0090 lines 54 to 58 count all three from active intervals in the log. The addendum's phrase "the daily maximum of the soft stop" has no match in the record, which has no daily maximum (ADR-0090 line 81). The record does reset the soft-stop point and the day's active time at the day boundary. I read the phrase as that daily reset. The rest-stop button's 10-minute wait uses wall-clock time (ADR-0090 line 89), which is a length of time and not a time of day. Source: the addendum, read 2026-09-28; ADR-0090, read 2026-09-28.

### The Dutch bridge puts Dutch words into tasks of a first version that must be Russian only

The addendum defers the Dutch layer until after the MVP and play tests in Russian, as ADR-0190 line 115 already does. It keeps one exception in the MVP: 30 to 50 Dutch keywords, mixed into about 20 % of the T1 to T4 and Sources tasks, with a «Словарь Башни» (Tower Dictionary) and short checks. ADR-0190 line 117 requires every text and task she sees in the first version to be in Russian. Lines 115 to 117 enforce it with a scope guard that allows only the `ru` locale and fails on a Dutch locale string file. A file named `content/bridge.nl.json` reads as one. The repository's `CLAUDE.md` also says the text the player sees is in Russian only for now, and only the owner changes that file. Item 8's Dutch memo for the parent is parent-facing, so the Russian-only rule doesn't cover it, but the scope guard does. Source: the addendum, the rules for every item and item 8, read 2026-09-28; ADR-0190 and `CLAUDE.md`, read 2026-09-28.

### The 42 new event types have no owning decision

The addendum lists 42 new types, from `compose_submitted` to `sandbox_action_applied`, three of them for Snappet after the MVP. ADR-0020 line 94 gives each type one owning decision that defines its payload, and a type enters the catalogue in the same change as its schema. None of the 42 has an owner yet. Source: the addendum, «События», read 2026-09-28; ADR-0020 line 94, read 2026-09-28.

### The field changes need new payload versions, and two existing types change meaning

The addendum names types by their TypeScript names, `AttemptSubmitted`, `ItemShown`, `Answer` and `Verdict`, where the catalogue says `attempt_submitted`, `item_shown` and `verdict`. ADR-0020 line 23 adds a field only through a new schema version with an upcaster, because stored events are never rewritten. Two meanings change. The catalogue defines `hint_shown` as "a hint rung was bought and shown", and `thread_spent` as a thread spent "on a hint rung or an explanation". Under item 1 rungs 2 and 3 are free and one thread opens the whole ladder. Source: the addendum, «События» and item 1, read 2026-09-28; ADR-0020 lines 23 and 96 to 181, read 2026-09-28.

### The addendum records four facts twice

The estimate, the grouping, the plan and the self-check each appear as a type of their own (`estimate_submitted`, `grouping_submitted`, `plan_submitted`, `self_check_used`) and as a field of `attempt_submitted` (`estimate?`, `grouping?`, `planChoice?`, `selfCheck?`). With the log as the only truth (ADR-0020), two records of one fact can disagree after a bug or a retry, and each projection must pick one. Source: the addendum, «События», read 2026-09-28; ADR-0020, read 2026-09-28.

### Some facts the addendum logs have no type or field to go in

The addendum writes these facts to the log, but its list gives them no type:

- `self_corrected` from item 3, which may be meant as a field;
- the parent's approval of a puzzle, and of a framing of a hint rung, both from a review queue like the explanation cache;
- turning a template or a puzzle off from the sandbox, unless `sandbox_action_applied` carries it;
- the parent's mark «тренировали факты» (we trained facts). `parent_tag_added` carries nodes or subtypes (ADR-0180 line 98), and a fact is neither.

The sandbox's guard refuses events with `profileId: "sandbox"` in the main log, and its actions carry `source: "sandbox"`. The envelope of ADR-0020 line 20 has neither field. Source: the addendum, items 3, 7, 8, 13 and «События», read 2026-09-28; ADR-0020 and ADR-0180, read 2026-09-28.

### The MVP grows by eleven items, and a post-MVP item joins the backlog

ADR-0190 lines 16 and 113 hold the MVP to exactly the approved contents list, and RES-3000 conclusion 7 sets that rule. The addendum puts items 1 to 9 and 11 to 13 into the MVP. It defers Snappet, which ADR-0190's list of deferred items on line 115 doesn't name and ADR-0190's scope guard doesn't watch. The addendum's later steps, more puzzles by her interest and then Snappet and the Dutch layer, fit ADR-0190's rule of one backlog item at a time. Source: the addendum, «Что добавляется» and «Порядок внедрения», read 2026-09-28; ADR-0190 and RES-3000, read 2026-09-28.

### The player's first day comes only at stage 0.3, after the whole enlarged MVP

The addendum builds item 8 first, with item 1, so that fact automaticity is measured from the first day, with M7 about three and a half months away. Its default horizon for M7 is 2027-01-15. ADR-0190 lines 79 to 82 let the player play first at stage 0.3, which holds the whole MVP, and gate each stage on a person's acceptance. On 2026-09-28 `paw status` shows stage 0 and core work in progress: EPC-0010 has 10 of 13 tasks done and EPC-0030 4 of 12. No record estimates when stage 0.3 starts. Unless the player plays earlier than stage 0.3, the first day of measurement comes after all eleven items are built, and whether that falls before 2027-01-15 is unknown. Source: the addendum, «Порядок внедрения» and item 8, read 2026-09-28; ADR-0190, read 2026-09-28; `paw status`, run 2026-09-28.

### The two build orders in the addendum leave item 8 out of the second

Step 1 of «Порядок внедрения» puts item 8 first, with item 1. Step 2 builds 1, 3, 4, 6 and 9 first, then 2 and 5, with the puzzle bank and widgets alongside, and doesn't mention item 8. I read the two together as 8 and 1, then 3, 4, 6 and 9, then 2 and 5, with 7, 11, 12 and 13 fitted around them. Step 1 also puts the sandbox early, with the first templates. ADR-0190 line 80 builds the first templates at stage 0.1, while the gateway, the Master and the Parent Room's PIN, which the sandbox's model features and entry need, come later. Source: the addendum, read 2026-09-28; ADR-0190 line 80, read 2026-09-28.

### The parser's accuracy test needs live calls, which the automated checks don't make

Acceptance test 3 needs verdicts matching the labels on at least 95 % of 200 reference riddles. The automated checks answer every model request from recordings (ADR-0100 lines 148 to 151), so they replay a past accuracy and can't measure a new one. Only `verify --live` or `verify --record` measures it, on the offline key. The addendum's fallback is a flag that turns «Сплети загадку» (Weave a riddle) off while the parser fails its test. Source: the addendum, test 3 and «Порядок внедрения», read 2026-09-28; ADR-0100 and ADR-0190 line 65, read 2026-09-28.

### Four options for the day boundary, compared

The one-adventure rule needs some boundary. These are the ways to keep one:

| Option | Better at | Case against |
| --- | --- | --- |
| Do nothing: keep the approved windows | no rework; the record stays as approved | the owner removed the windows on 2026-09-28, so this option is closed |
| Keep 04:00 in the device's time zone as a service value that no screen or line names | keeps ADR-0090's defence against a changed zone (lines 60 and 144) and every reset listed above; the least rework | the addendum strikes the sentence "the day ends at 04:00"; if the owner meant the hour as well as the window, this keeps what the owner removed |
| Move the boundary to midnight | matches the calendar days some rules already use, such as the dreamcore slip at most once in 7 calendar days | an evening session past midnight crosses into a new day during play, with a new morning's threads and a new adventure after its finale |
| Turn the day at the first session after a set rest, such as 8 hours after the day's last play | ties nothing to the clock at all, closest to the addendum's wording | a long afternoon break opens a second adventure in one calendar day; every daily budget and count needs a new reference point |

The second row is chosen: 04:00 in the device's time zone stays as a service value that no screen or line names. It keeps ADR-0090's defence against a changed zone and every daily job listed above, and it needs the least rework, while the addendum's aim holds because nothing she sees opens or closes by the hour. Source: the addendum, read 2026-09-28; ADR-0090, read 2026-09-28.

### Decided on 2026-09-28

The service boundary stays at 04:00 in the device's time zone, and no screen, line or number names it. It keeps every job the record gives the game day: one new adventure a day, the morning's threads, the daily quests, the daily rewards and the shop's new slots, the explanation budget, the end of a pause of live frames, the three-day rule, «Закончить на сегодня», the frontier cap after a second anxiety signal, the lowered creepiness level and the soft stop's daily reset. The option compared above needs the least rework and none of these jobs shows her a time. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

Daily quests and daily rewards remain and come every game day, because they keep the player coming back each day. The addendum's rule of no day streaks and no penalty for a skipped day still holds, so nothing counts consecutive days or punishes a gap. Its choice of two routes of the day adds to the daily quests and never replaces them, and the schedule of one new system a day may delay when quests first appear but not stop them afterwards. The owner decided on 2026-09-28.

Puzzles open at a rest stop during an adventure and after the finale, as item 7 says, and a new puzzle appears only after the finale. Test 8 is read that way, because that reading makes the addendum's two wordings agree. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The `*.surplus` and `*.missing` subtypes write a stream of their own and stay out of "on her own" until ADR-0060's activation rule admits them, so they don't join during the MVP. A subtype with an extra or a missing number is a new form, and treating it as one keeps an untested form from moving the node's estimate. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

A composed riddle may leave the Mac only masked, with every number replaced by a token that the engine maps back, on the player tier with zero retention and never with the target expression. If the masked parse fails acceptance test 3, «Сплети загадку» falls back to sentence cards, and her digits never leave. The school's goal list doesn't leave the Mac: goals map to nodes through an offline catalogue on the Mac, the parent confirms each link, and no `GOALS_MODEL` role is added. Both keep the approved rule that her answers and her school group have no field to travel in. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The play key's $60 monthly limit stays. The sandbox's model features and the agent's command-line sandbox spend from the offline key, under a monthly cap of their own that the decision step sets, and never from the play key. «Свободное перо» gets no budget of its own: it spends what the day's adventure budget left and closes through a story scene when that runs out. The parse budget of $0.1 a day stays on the play key, so the play key's daily caps sum to $1.9, or $58.90 in 31 days, below $60. This keeps the limit a guard against a runaway bug, and the parent's sandbox can never stop the player's play. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The player may play a fact-measurement stage, item 8's facts and item 1's hint ladder on the stage 0.1 templates, as soon as a person accepts it and before stage 0.3. Measurement then starts well before the M7 horizon of 2027-01-15, which the whole enlarged MVP can't promise. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The Dutch bridge of 30 to 50 keywords enters the MVP as data beside Russian text, and the parent approves each word through the glossary's queue and file. The owner's addendum is the owner's instruction that amends the Russian-only rule for this one exception, and the owner amends the Russian-only rule in `CLAUDE.md` to match, since only the owner changes that file. The Dutch layer stays out of the MVP, and the parent's Dutch memo is allowed. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

Event names and code stay vendor-neutral, so the school-system types are named `school_snapshot_*`, not `snappet_*`. The school's system can change and the repository is public. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

## Conclusions

1. No part of the game may open or close by the time of day. The heroine's room, the Diary, the forge, the shop, the familiars, the puzzles and «Свободное перо» must be reachable at any moment when the task window isn't open, during an adventure included. Puzzles must open at a rest stop during an adventure and after the finale, and a new puzzle must appear only after the finale.
2. A new adventure must still start at most once a day, by a service boundary at 04:00 in the device's time zone that no screen, line or number shows. In the story, the day's turn must read as «Башня перевязалась за ночь» (The Tower re-knitted itself overnight). The boundary must keep every daily job listed in the findings, including the three-day rule, «Закончить на сегодня», the frontier cap and the lowered creepiness level.
3. Daily quests and daily rewards must come every game day once they first appear, because they keep the player coming back each day. Nothing may count consecutive days or punish a skipped day, and the choice of two routes of the day must add to the daily quests, never replace them.
4. The requirement that the game day ends at 04:00 must be superseded by one that sets 04:00 as an unseen service boundary. The requirement that only screens without tasks open after the finale must be superseded by conclusions 1 and 2. The requirement on eye-exercise time on screens without tasks must count those screens at any time.
5. ADR-0090 must be amended where it opens screens after the finale and after Session 0 until 04:00, and where it counts eye time on screens "after the finale". SPC-0030 must keep its adventure days and end of the day on the 04:00 service boundary. The conclusions of RES-0300 on the window after the finale are replaced by conclusions 1 and 2 of this record.
6. The soft stop, extensions and eye exercises must keep counting active play time from the log, and the game must still have no daily maximum.
7. The screen check that looks for clock text must skip the content of a task, so a timetable or a time-reading task passes while any display of her own time still fails.
8. Every new form must write its observations as a stream of its own, and the `*.surplus` and `*.missing` subtypes count as new forms. ADR-0060's rule on observations must exclude those streams from the "on her own" estimate. A stream may join the estimate only through ADR-0060's activation rule, a lower log-loss and calibration error on held-out days, so none joins during the MVP.
9. The Master and the planner must keep receiving no numbers, answers, verdicts, node ids, states, topics or times. Every new model job must be a role of its own whose output the engine checks.
10. The offline framing of hint rungs and the retelling of puzzles must run under an offline role on the offline key and the content tier, with the planner's model as its default model. They must not run under the planner's play role.
11. ADR-0100 must gain the parser role, its request class, its privacy tier and a daily parse budget of $0.1 on the play key. It must gain no goals role, and it must state that the sandbox's calls spend from the offline key under a monthly cap of their own.
12. The parser must run on the player tier with zero retention and must never receive the target expression. A parse request must carry the composed riddle with every number replaced by a token that the engine maps back, and the data-leaving-the-Mac requirement must be amended to allow that masked riddle and nothing more of her answer.
13. The school's goal list must stay on the Mac. Goals must map to nodes through an offline catalogue on the Mac, and the parent must confirm each link.
14. The play key's $60 monthly limit must stay, and its daily caps must sum below it in a 31-day month. The sandbox's model features and the agent's command-line sandbox must spend from the offline key under their own monthly cap, which the decision step sets. «Свободное перо» must spend what the day's adventure budget left and close through a story scene when that runs out.
15. Every one of the 42 new event types must have one owning decision and a schema before any code writes it. The three school-system types must be named `school_snapshot_*` and must wait for their item.
16. Each changed field of `attempt_submitted`, `item_shown` and `verdict` must arrive as a new payload version with an upcaster. The catalogue must redefine `hint_shown` as a rung shown and `thread_spent` as a thread spent on opening the ladder or on an explanation.
17. Each of the estimate, grouping, plan and self-check facts must be recorded in one place only, as its own type or as a field, and the design step picks which.
18. The log must have a type or field for the parent's approval of a puzzle and of a rung framing, for turning a template or puzzle off, and for the fact-training mark. ADR-0020 must name the field that the sandbox guard reads and the field that marks an action taken from the sandbox.
19. ADR-0190 and the MVP contents requirement must be amended to hold items 1 to 9 and 11 to 13. The deferred-items requirement and the scope guard must add the school-snapshot item.
20. The Dutch bridge of 30 to 50 keywords must enter the MVP as data beside Russian text, with the parent approving each word through the glossary's queue and file. The Russian-only requirement, the scope guard and `CLAUDE.md` must be amended to allow this one exception, on the owner's addendum. The Dutch layer itself must stay out of the MVP, and the parent's Dutch memo is allowed.
21. The build must start with item 8's measurement of facts together with the hint ladder, then items 3, 4, 6 and 9, then 2 and 5. The player must be able to play a fact-measurement stage, item 8's facts and the hint ladder on the stage 0.1 templates, as soon as a person accepts it and before stage 0.3. The sandbox must start at stage 0.1 with the first templates and gain its model features when the gateway and the Parent Room exist.
22. «Сплети загадку» must stay off by a flag until the masked parser passes its accuracy test in a live run on the offline key. If it fails that test, the form must fall back to sentence cards.

## Sources

- The owner's addendum 1 to the specification, 2026-09-28, read 2026-09-28 - the rules for every item, «События», «Модели и бюджет», «Приёмочные тесты», «Порядок внедрения», and the parts of items 1 to 13 those rest on.
- `project/adrs/ADR-0020-append-only-event-log-is-the-only-truth.md` at 47c0a7b, read 2026-09-28 - the envelope, payload versions, the catalogue and its ownership rule.
- `project/adrs/ADR-0060-knowledge-model.md` at 47c0a7b, read 2026-09-28 - what counts as an observation, the node estimate and the activation rule.
- `project/adrs/ADR-0090-day-planned-from-pace-with-invisible-time.md` at 47c0a7b, read 2026-09-28 - the game day, the window after the finale, the time projections and the screen check.
- `project/adrs/ADR-0100-model-gateway-tiers-budgets.md` at 47c0a7b, read 2026-09-28 - roles, request classes, tiers, the egress guard, keys and budgets.
- `project/adrs/ADR-0110-master-narrates-director-events.md`, `ADR-0130-task-text-from-checked-frames-and-science-bank.md`, `ADR-0140-deterministic-game-rules-over-versioned-content.md` and `ADR-0180-parent-room-report-limits-lessons.md` at 47c0a7b, read 2026-09-28 - the Master's schema, the offline content path and the uses of the game day.
- `project/adrs/ADR-0190-verify-command-stages-and-mvp-scope.md` at 47c0a7b, read 2026-09-28 - stages, the MVP scope, the scope guard and the baselines.
- `project/specs/SPC-0030-play-api-lifecycle-lease-and-answer-queue.md` at 47c0a7b, read 2026-09-28 - adventure days and the end of the day.
- `project/requirements/` at 47c0a7b, read 2026-09-28 - the approved requirements on her screens, the end of the game day, the screens open after the finale, eye-exercise time, the absence of a daily maximum, first attempts, the Master's requests, data leaving the Mac, the monthly limit, the offline key and the MVP scope, each named in the findings by what it says.
- `project/research/` RES-0100, RES-0300, RES-2700, RES-3000 and RES-3500 at 47c0a7b, read 2026-09-28 - the approved research behind the window, the budgets and the stages.
- `CLAUDE.md` at 47c0a7b, read 2026-09-28 - the rule that the player sees Russian only for now.
- `paw status`, run 2026-09-28 - the progress of the stage 0 and core epics.
