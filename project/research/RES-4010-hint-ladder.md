---
id: RES-4010
artifact: research
status: approved
revised: 2026-09-28
elaborates: RES-0500
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One guiding thread now opens a task's whole hint ladder, a rung 2 or 3 hint always brings a twin task, and the "with help" estimate splits by the depth of help, which changes five approved decisions, two specifications and six approved requirements

## Summary

The owner's addendum 1 of 2026-09-28 changes the hint ladder in five ways, and each one overrides the approved record where they disagree. One guiding thread opens the ladder on a task, and rungs 2 and 3 on that task cost nothing, where today every rung costs a thread (RES-0500, ADR-0080, SPC-0030 and `src/server/play.ts`). The rungs differ by task form, and a ladder is as long as the template has real steps, so a basic fact gets one strategy rung with numbers in it and a fluent mental-arithmetic fact gets no ladder before the answer; that breaks the approved rules of three rungs on every task and of no numbers in rung 1. The familiar speaks each rung from a portrait in the task window, which the approved rule for the task window's contents forbids. A hint at rung 2 or 3 brings a twin task even after a right or partial answer, which ADR-0080 and RES-0400 forbid today. The "with help" estimate becomes a distribution over the depth of help, and the report gains the label «на пороге» (on the threshold) and a mean depth of help, beside ADR-0060's single beta estimate and ADR-0180's «почти готово» (nearly ready). The strongest case against the new price is that one thread now buys the whole ladder down to rung 3, which is the "click through to the answer" pattern RES-0500 priced hints to prevent; the twin after rung 2 or 3 is what the addendum puts against it. Research decided the six open points on 2026-09-28 on the owner's instruction: a hint on the twin costs its own thread, the familiar's framing shows only after the parent approves it, and «на пороге» sits beside «почти готово» and shows first when both apply. This record covers section 1 of the addendum and its acceptance tests 1 and 2, and leaves the other twelve sections to their own records.

The reader is evaluating the change: the owner, and the requirements and design steps that follow.

## The question

What must now be true of the hint ladder's price, content, voice, follow-up and measurement, and which approved records does that change? The owner has already decided the direction in the addendum, so the question is what the decision obliges and where it collides with the approved record, and not whether to make it.

The addendum assumes that the price per rung is what makes a child stop at rung 1 «как раз когда нужен разбор» (exactly when a walkthrough is needed). Under the approved economy she rarely runs short: RES-0500 gives her about 8 to 10 threads a day, a stock of up to 30 and a pocket thread once a room, and ADR-0080 accepts that she "rarely meets an empty stock". So the saving the addendum fears would come from how a price feels to her, and not from scarcity. That is plausible for a child who counts a ball of yarn, but it is the owner's observation from Soviet method and not a measured fact about this player, and no play data exists yet to test it: the running code is a stand-in that starts each session with 5 threads (`STANDIN_THREADS` in `src/server/standin.ts`). The assumption also hides the opposite risk. If the price was what kept her from pressing through to rung 3, a flat price per ladder removes that brake, and the measurement cost RES-0500 names comes back unless something else stands in for it.

## Method

On 2026-09-28 I read section 1 of the owner's addendum 1 to the specification, its general rules, its events section and its acceptance tests 1 and 2. I searched the approved record with `paw find` for hint, rung, thread, ladder, with help, twin and second attempt. I read RES-0400, RES-0500, RES-0900, RES-1000, RES-1300, RES-1900 and RES-2300, the decisions ADR-0040, ADR-0060, ADR-0080, ADR-0120, ADR-0150 and ADR-0180, and the specifications SPC-0020 and SPC-0030, in full or in the parts that name hints. I read the approved requirements on the task window, resuming, second attempts, thread prices, hint rungs, explanations, the knowledge model's "with help" estimate, the help-share flag, the help limit, second-attempt rewards, the report's with-help figures and the client's ignorance of task design. I read the hint and second-attempt routes in `src/server/play.ts`, the stand-in hints in `src/server/standin.ts` and the event schemas in `src/shared/events.ts` at commit `47c0a7b`.

I read no outside literature. The Aleven and colleagues (2006) figure below comes from RES-0500, which read the paper; I didn't re-read it. The addendum names "Soviet method" as its source for the new price and the twin, without a work or an author, so I record those reasons as the owner's and not as evidence. No play data exists, so every figure about how often she will use rungs 2 and 3 is my arithmetic, marked as such.

## Findings

### The approved record and the code charge one thread for each rung

RES-0500 conclusion 7 makes each hint rung cost exactly one thread, on any task, and an approved requirement states the same. ADR-0080 repeats it and sets a ceiling of 8 threads a task across both attempts: 3 rungs and 1 explanation each. SPC-0030 keys a hint charge "at most once per item and hint level", and `HintIn` names a level from 1 to 3. The code does the same today: the route `POST /api/item/:itemId/hint` in `src/server/play.ts` appends a `hint_shown` and a `thread_spent` with reason `hint` for every new level, and refuses with `409 no_threads` at a stock of 0. The `thread_spent` schema in `src/shared/events.ts` allows only the reasons `hint` and `explanation`, and `hint_shown` carries `itemId`, `attemptNo` and `level`, with no field for how the ladder opened.

### The addendum makes one thread open the ladder on a task, and leaves the explanation at one thread

The addendum says «Одна нить открывает лестницу на этом задании. Ступени 2 и 3 на том же задании бесплатны» (one thread opens the ladder on this task; rungs 2 and 3 on the same task are free). The detailed explanation still costs one thread, with no discount when the ladder is already open, because it is a separate language-model generation. The free short solution after a wrong answer or «Не знаю» (I don't know) doesn't change. The approved rules for the explanation's price, the free short solution and ADR-0120's single debit per explanation therefore stand. The ceiling per task falls from 8 threads to 4, one ladder and one explanation on each of the two attempts, if the twin is a task of its own. The addendum says "on this task" and doesn't say whether the twin shares the first task's open ladder; the decisions below make the twin a task of its own.

### Three prices were open, and the owner chose the one between the two ends

| Option | What its advocate says it is better at | Against it |
| --- | --- | --- |
| Do nothing: one thread a rung (RES-0500, the code today) | Each deeper rung has a cost, so pressing through to rung 3 costs 3 threads, and RES-0500 cites Aleven and colleagues (2006), where 72 % of student actions in a Cognitive Tutor data set were unproductive help seeking | The addendum says a child saves and stops at rung 1, exactly where a walkthrough is needed |
| One thread opens the ladder (the addendum) | The decision to ask for help has a price, and going deeper once she has asked costs nothing, so she isn't punished for needing rung 2 | One thread now buys rung 3, "every step except the last calculation", so the brake on pressing through is gone; the addendum answers with the twin after rung 2 or 3 |
| A free ladder | No currency to explain, and a price never stops her | The addendum rejects it because threads would lose their value and she would press hints without thinking, and RES-0500 rejected unlimited hints for the measurement reason in the first row |

The owner's instruction settles the comparison for the second option. The case against it is the middle cell: under the approved economy of about 10 threads a day and a stock of up to 30, one thread is a small price, so after this change the number of rung 3 hints she sees depends mostly on the twin and on the approved flag to the parent when «Не знаю» and hints pass 30 % of first attempts. ADR-0080's first reversal condition, assisted first attempts above 30 % of first attempts over 7 adventures, watches the right quantity and doesn't need to change.

### The ladder's rungs now depend on the task form, and a ladder is as long as the template's real steps

The addendum keeps the engine building rungs from the template's computation graph, with template strings in `hints` and numbers from code, and no language model in rungs 1 and 2. It gives the three rungs for each form: word problems T1 to T4, column and long division, fractions and percentages, geometry and measures, basic facts and the optional puzzle branch. Two rules follow the table. «Если у шаблона меньше трёх содержательных ступеней, лестница короче. Ступени не придумываются для счёта» (if a template has fewer than three real rungs, the ladder is shorter; rungs aren't invented to make up the count). A basic fact whose fluency threshold is 10 seconds or less, in mental arithmetic, has no ladder at all, and its strategy hint opens only after the answer, with the short solution.

### A shorter ladder conflicts with the three-rung rule and with ADR-0080's rule for short templates

An approved requirement says "The hint ladder of every task MUST have three rungs". ADR-0080 carries it out with a rule for a template of fewer than three steps: the author writes rung 2 as the operation and its operands without the result, and rung 3 as a method, so that the three texts differ. ADR-0080's test 3 asserts "three distinct rung texts" for every template, and ADR-0040's template interface asks `hints(p)` for three texts. The addendum's shorter ladder replaces that rule. Its data section adds `hintMaxLevel` to `AttemptSubmitted`, so the depth of help can be read against the ladder's length.

### The basic-fact rung carries numbers, which the approved rule for rung 1 forbids

The addendum's only rung for a basic fact is a strategy through a known fact: «7 · 8 — это 7 · 7 и ещё 7» (7 × 8 is 7 × 7 and 7 more). An approved requirement says "The first hint rung MUST contain no numbers", and ADR-0080's test 3 asserts no digit in rung 1. The strategy rung doesn't contain the answer, so it passes the addendum's acceptance test 2, which asks that rungs 1 and 2 contain no answer over 1000 seeds. Its numbers have to come from the engine, as the approved record already asks of every rung.

### A task with no ladder before the answer still shows the thread button

The approved record keeps the thread button with its count in every task window, and ADR-0080 already makes it inactive "when the attempt has no action left to buy". A fluent mental-arithmetic fact therefore shows the button inactive before the answer and active after it, for the explanation. The button state tells her the task is a basic fact, which she can see anyway, and not whether it is scored, so the approved rule that the client never learns whether a task is scored holds.

### The familiar's portrait in the task window conflicts with the rule for the task window's contents

The addendum has the familiar present each rung: at rung 1 it hints, at rung 2 it shows, at rung 3 it explains nearly everything, and «В окне задания появляется его мини-портрет с репликой» (its mini portrait with a line appears in the task window). An approved requirement says the task window holds only the task, the answer field or options, the keypad, «Не знаю», the thread button and «Готово» (Done), "with no sprite, effect or story text", and ADR-0080 and ADR-0150's `TaskWindow` carry that rule. A portrait is a sprite and the framing line is story text, so the rule needs an exception for a shown rung.

### The framing is written by a model offline, and the reason hints avoid models limits what it may say

The addendum has `PLANNER_MODEL` write, for each kind of familiar, 3 framing variants of each rung, such as «Пуговка тычет лапкой в первый вопрос…» (Button pokes a paw at the first question…), with placeholders instead of numbers, checked by `SAFETY_MODEL` and sent to the parent's review queue «как кэш объяснений» (like the explanation cache). The rung string itself stays a template string, and «чисел в тексте LLM нет» (no numbers in model text) holds. The approved record forbids a model call to build a rung, because "a hint is shown before the answer, so a model's mistake there would lead the player wrong on the attempt that measures her". The framing is shown beside the rung before the answer, so the same reason applies to it. The framing is written per familiar and per rung, never per template, so it can't know the task, and a framing that names a step, an operation or "the first question" can be wrong for a template whose first step is something else.

With the MVP's six to nine familiars (RES-1900), up to 3 rungs and 3 variants, the set holds at most 81 texts by my arithmetic. ADR-0120 lets explanation variants show before any person reads them and gives the parent only a hide control, because the explanation groups multiply beyond what a parent can read. The framing set is small enough to approve before use, and "the parent's review queue" can mean either rule.

### A rung 2 or 3 hint now brings a twin task after every outcome, which ADR-0080 and RES-0400 forbid today

The addendum says that after an answer given with a rung 2 or rung 3 hint, a second attempt on a parallel task always follows, «даже если ответ был верным» (even if the answer was right), to check that the hint helped and didn't only lead her to the answer. After rung 1 and a right answer no twin follows. Today ADR-0080's state `twin_open` comes "only after `alt`". RES-0400's resolved table and its conclusions 16 and 18 give no twin after `partial`, and two approved requirements carry that: one names only a wrong answer or «Не знаю» as the trigger for a second attempt, and one forbids a second attempt after a partial answer. A partial answer after rung 2 now gets a twin, so the ban holds only for a partial answer with no hint or with rung 1. The approved ban on a third attempt still holds, so a rung 2 hint bought on the twin brings nothing further. The code today allows a second attempt after any answered first attempt, and its outcomes are only `clean` and `alt` (`src/server/play.ts`).

### The twin after a hint adds time and a reward question

RES-1000 counts reviews and second attempts at about a fifth of task time, and RES-0400 prices a twin at about a minute. I have no data on how often she will reach rung 2. If a rung 2 or 3 hint comes on 10 % of 28 to 44 first attempts, and half of those already ended `alt`, the new twins add 1 to 2 minutes a day by my arithmetic; at the help-share flag's 30 % it is 4 to 7 minutes. The approved record gives a right second attempt base experience and no button. A right first attempt with rung 2 now earns its own outcome's rewards and then the twin's base experience, so taking rung 2 on a task she could solve pays a little more than not taking it. ADR-0140 decides whether an assisted first attempt earns the streak and bonuses, and that decision now also decides this incentive.

### The "with help" estimate becomes a distribution over the depth of help

ADR-0060 keeps one beta estimate "over assisted attempts only, counting a right assisted attempt as a success", with a 30-day half-life, as RES-0900 resolved. The addendum replaces the single estimate: «модель хранит для пары "узел + подтип" распределение глубины помощи: доля верных решений после ступени 1, 2, 3 и после разбора (вторая попытка)» (the model keeps, for each node and subtype pair, a distribution over the depth of help: the share of right answers after rung 1, 2 and 3 and after the walkthrough, the second attempt), with the same forgetting. The "on her own" estimate doesn't change. Model v1 uses the rung only in the report, and whether BKT (Bayesian knowledge tracing) reads it, for example as a partial observation, is left to the offline refit, which accepts a variant only if it predicts the next unassisted first attempt better. ADR-0060's `./tower model activate` gate, lower log-loss and calibration error on held-out days, already is that test. The report's «решает с подсказкой» (solves with a hint) and «почти готово» both read the single estimate (ADR-0180), so one pooled figure over all depths has to stay, or both need new definitions.

### The report gains «на пороге», which overlaps «почти готово»

The addendum gives a node «на пороге» when its "on her own" estimate is below the threshold of «понимает» (understands), and at least 60 % of its assisted attempts in the last 14 days are right after rung 1, with at least 3 such attempts. Its meaning for the parent is «почти умеет, хватает намёка — нужно закрепление, а не объяснение с нуля» (nearly can, a nudge is enough; it needs consolidation, not an explanation from scratch). ADR-0180 already marks «почти готово» when the state is below «бегло» (fluent) and the "with help" estimate is at least 0.7 over at least 3 assisted attempts in 30 days. The two overlap, because a node in «Пока не освоено» (not mastered yet) can meet both. The addendum doesn't say whether «на пороге» replaces «почти готово», narrows it or sits beside it.

ADR-0180 says every state, label and flag comes from "an explicit rule over counted attempts", and "That is why «почти готово» uses the state and not `pKnow`". The addendum's "the 'on her own' estimate below the threshold of «понимает»" can be read as a `pKnow` threshold or as the rule state below «понимает», and only the second fits ADR-0180.

### The report also gains a mean depth of help

The addendum adds a mean depth of help per node, 0 for on her own, 1 to 3 for the rung and 4 for the walkthrough, shown beside «решает с подсказкой». It names no time window and doesn't say whether the depth is raw or divided by `hintMaxLevel`; a one-rung basic-fact ladder makes a raw depth of 1 its deepest possible hint. ADR-0180's help row, which RES-1300 defines, already reports hints with their level, so the mean depth fits there.

### The event log gains three fields and one reason

The addendum adds `ladderOpenedBy: "thread" | "free_step"` to `hint_shown`, a `thread_spent` reason `hint_ladder` for the first opening, and `hintMaxLevel` beside `hintLevel` (0 to 3) in `AttemptSubmitted`. The resume record `pendingItem` keeps the open ladder and the rungs shown, so a resume never spends a thread to reopen it, which the approved rules on resuming and repeated requests already ask of charges in general. RES-0200 and RES-2550 define `pendingItem` with a hint level and the threads spent, and SPC-0020's table lists `hint_shown` and `thread_spent` as the record of hints. The value `free_step` can mean a rung shown free after the paid opening, or a ladder opened with no thread at all, as section 7 of the addendum lets the familiar offer once on a puzzle; the addendum doesn't define it.

### Decided on 2026-09-28

«На пороге» sits beside «почти готово» and replaces nothing, and when a node meets both rules the report shows «на пороге» first, because it is the narrower claim and tells the parent what to do, while keeping «почти готово» leaves ADR-0180's rule unchanged. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

"Below the threshold of «понимает»" means the rule state below «понимает», because ADR-0180 derives every label from an explicit rule over counted attempts and not from `pKnow`. «Уточняется» counts as below it, and «не проверено» doesn't, because a node with no unassisted evidence has no "on her own" result for the label to set the hint against. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

A hint on the twin task costs its own thread, because the addendum prices the ladder "on this task" and the twin is a task of its own, and a free ladder on the twin would weaken the check that the hint helped; the ceiling per task falls from 8 threads to 4. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The familiar's framing variants show only after the parent approves each one, because the set holds at most 81 texts, few enough to read, and the framing is shown before the attempt that measures her, where ADR-0120's show-then-hide rule for explanations doesn't fit. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

`ladderOpenedBy` records what paid for the rung shown: `thread` on the rung whose request spent the thread, and `free_step` on every rung shown with no charge, which covers rungs 2 and 3 after the paid opening and a ladder the familiar opens free on a puzzle. This keeps the addendum's two values, and the log still tells the two free cases apart by whether a `thread_spent` with reason `hint_ladder` exists for that item. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The mean depth of help covers the last 30 days and is raw, 0 to 4, because 30 days is ADR-0180's window for assisted attempts under «почти готово», so the figures beside each other count the same attempts, and a node's templates share a form, so a raw depth compares within a node. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The model keeps one pooled "with help" figure over all depths beside the distribution, because «решает с подсказкой» and «почти готово» read it today and keeping it changes neither definition in ADR-0180. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

## Conclusions

1. Opening the hint ladder on a task must cost exactly one guiding thread, written as `thread_spent` with reason `hint_ladder`, and every further rung on that task must cost nothing.
2. A detailed explanation must still cost one thread whether or not the ladder on that task is open, and the short solution must stay free.
3. The approved one-thread-a-rung rule must be superseded by conclusion 1, and RES-0500 conclusion 7, ADR-0080's price and per-task ceiling, SPC-0030's charge key and `HintIn`, and the hint route in `src/server/play.ts` must change to match it.
4. A template must have as many rungs as it has real steps, at most three, and must never gain a rung written only to reach three; the approved three-rung rule, ADR-0080's rule for short templates and its test 3, and ADR-0040's three-text `hints(p)` must change to this.
5. A basic fact must have one strategy rung that may carry engine-computed numbers and must not carry the answer, and the approved rule of no numbers in rung 1 must gain that exception.
6. A basic fact in mental arithmetic whose fluency threshold is 10 seconds or less must have no ladder before the answer, and must offer its strategy hint only after the answer, with the short solution.
7. Rungs 1 and 2 of every template must contain no correct answer over 1000 seeds, and rung 3 must stop before the last calculation, as acceptance test 2 states.
8. The task window must show the familiar's portrait and framing line beside a shown rung, and the approved rule for the task window's contents and ADR-0150's `TaskWindow` must gain that exception for a shown rung alone.
9. A framing variant must carry no number, step, operation or reference to the task's parts, because it is written per familiar and rung and is shown before the attempt that measures her; a check in code must reject a variant with a digit or a number word, and a person must read each variant for task content.
10. After an answer given with a rung 2 or rung 3 hint, the game must give one second attempt on a parallel task, whatever the outcome, and after a rung 1 hint and a right answer it must give none.
11. The approved trigger for a second attempt and the ban on one after a partial answer must be superseded to state conclusion 10, RES-0400 conclusions 16 and 18 must be recorded as replaced for hinted attempts, and ADR-0080's `twin_open` state and its cost estimate must change; the ban on a third attempt must stay.
12. ADR-0140 must decide whether a right first attempt after rung 2 or 3 earns its outcome's rewards, because the twin's base experience now follows it.
13. The "with help" estimate must be kept per node and subtype as right-answer shares after rung 1, rung 2, rung 3 and the second attempt, each with the approved 30-day forgetting, and must never feed the "on her own" estimate.
14. The model must keep one pooled "with help" figure over all depths beside the distribution, because the report's «решает с подсказкой» and «почти готово» both read a single estimate today.
15. Model v1 must use the rung depth only in the report, and a model version that reads it must pass ADR-0060's activation gate before it replaces v1.
16. ADR-0060 must be amended for conclusions 13 to 15.
17. The report must show «на пороге» when the node's rule state is below «понимает» (with «уточняется» counted and «не проверено» not) and at least 60 % of at least 3 assisted attempts in 14 days are right after rung 1; it must show «на пороге» beside «почти готово», first when both apply, and a raw mean depth of help from 0 to 4 over 30 days per node beside «решает с подсказкой»; ADR-0180 must be amended for both.
18. `hint_shown` must carry `ladderOpenedBy`, `attempt_submitted` must carry `hintMaxLevel`, and `pendingItem` must keep the open ladder and the rungs shown, so a resumed task reopens its ladder with no thread spent; SPC-0020, RES-2550 and `src/shared/events.ts` must change to match.
19. A test must show that the first rung spends one thread and rungs 2 and 3 none, that a resume spends none, that `hintLevel` and `hintMaxLevel` are right, and that every answer after rung 2 or 3 brings a twin, as acceptance test 1 states.
20. A hint on the twin task must cost its own thread to open the twin's ladder, so the ceiling per task is 4 threads across both attempts.
21. A framing variant must show to the player only after the parent approves it in the review queue.
22. `ladderOpenedBy` must be `thread` on the rung whose request spent the thread and `free_step` on every rung shown with no charge.

## Sources

- The owner's addendum 1 to the specification, 2026-09-28, read 2026-09-28 - section 1 on the hint ladder, the general rules, the events section and acceptance tests 1 and 2.
- RES-0500, `project/research/RES-0500-guiding-threads.md` at `47c0a7b`, read 2026-09-28 - the price per rung, the thread economy and the Aleven and colleagues (2006) figure.
- RES-0400, `project/research/RES-0400-unified-mode-attempts.md` at `47c0a7b`, read 2026-09-28 - no twin after `partial`, and the twin's cost of about a minute.
- RES-0900 and ADR-0060, `project/research/RES-0900-knowledge-model.md` and `project/adrs/ADR-0060-knowledge-model.md` at `47c0a7b`, read 2026-09-28 - the single "with help" beta estimate and the activation gate.
- RES-1000, `project/research/RES-1000-task-selection.md` at `47c0a7b`, read 2026-09-28 - second attempts at about a fifth of task time.
- RES-1300, `project/research/RES-1300-limits.md` at `47c0a7b`, read 2026-09-28 - the help limit and its hint levels.
- RES-1900, `project/research/RES-1900-familiars.md` at `47c0a7b`, read 2026-09-28 - six to nine familiars in the MVP.
- RES-2300 and ADR-0180, `project/research/RES-2300-parent-report.md` and `project/adrs/ADR-0180-parent-room-report-limits-lessons.md` at `47c0a7b`, read 2026-09-28 - «почти готово», «решает с подсказкой», the help row and the rule that labels come from explicit rules.
- ADR-0040, ADR-0080, ADR-0120 and ADR-0150 in `project/adrs/` at `47c0a7b`, read 2026-09-28 - `hints(p)`, the attempt flow, the rule for short templates, the explanation cache and `TaskWindow`.
- SPC-0020 and SPC-0030 in `project/specs/` at `47c0a7b`, read 2026-09-28 - the hint events, the charge key and `HintIn`.
- The approved requirements in `project/requirements/` at `47c0a7b`, read 2026-09-28 - the rules on thread prices, rungs, the task window, second attempts and the report's with-help figures that this change keeps or overrides.
- `src/server/play.ts`, `src/server/standin.ts` and `src/shared/events.ts` at `47c0a7b`, read 2026-09-28 - the charge per rung, the stand-in stock of 5 threads and the event schemas.
