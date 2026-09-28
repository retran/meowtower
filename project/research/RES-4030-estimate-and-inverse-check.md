---
id: RES-4030
artifact: research
status: approved
revised: 2026-09-28
elaborates: RES-0700
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An estimate before the exact answer and a free inverse check keep the first attempt a fair measure once they also appear on unscored tasks, reveal nothing the task doesn't already show, and keep their time out of fluency

## Summary

The owner's addendum 1 of 2026-09-28 adds two things to calculation tasks: an estimate from four options before the exact answer in about 15 % of scored tasks of named nodes, and a free button that lets the player check her answer by the inverse operation before she submits it. Published studies support measuring the estimate apart, because estimation and exact calculation correlate at only 0.35 in accuracy (Ganor-Stern 2018). The English national curriculum teaches estimating and checking by the inverse together in years 3 and 4. The inverse check can stay out of the "assisted" flag, because the match it shows compares two numbers the player already sees, so it tells her nothing her own calculation doesn't. An answer she corrects after the check is already her first attempt under ADR-0080, so it counts as `clean` with no new rule. The addendum as written conflicts with six approved records. In ADR-0080 and SPC-0030, an estimate only on scored tasks tells her which tasks are scored, and the task window's list of controls is closed. ADR-0040 and ADR-0180 have no place for the three new error classes. In ADR-0060 and ADR-0070, the estimate step and the check add time that the fluency and rapid-guess tests read. The addendum's interval rule contradicts its own acceptance test 4 on a number line, so the estimate offers four shuffled rounded values instead; a check prompt on a one-step word problem names the operation, which is a hint, so the check stays on bare expressions. This record covers section 3 of the addendum and its acceptance test 4; it leaves the hint ladder, the other new task forms and the Cito preparation to other records.

## The question

How does the game add an estimate before the exact answer and a free inverse check so that they teach number sense and self-checking, feed the parent's report, and leave the first attempt a fair measure of what the player does alone?

The addendum assumes that the estimate and the check are additions to the task that the measurement can ignore: the exact answer "goes into «сама» as usual", and the check "isn't a hint". That assumption holds only where each addition gives the player no information about the task she couldn't get alone and costs no time the measurement reads. Both conditions fail in places the addendum doesn't discuss. An estimate shown only on scored tasks tells her the task is scored. A check prompt on a word problem shows her the operation. And both add seconds to an answer whose time decides fluency. So the question is less whether to build the two features, which the owner has decided, than which approved rules each one touches and what must change so the measure stays clean.

## Method

On 2026-09-28 I read section 3 of the owner's addendum 1, its general rules, its list of events and its acceptance test 4. I searched the approved record with `paw find` for "estimate", "self-check" and "clean outcome", and read ADR-0080 in full. I read the relevant parts of ADR-0040 (the checker, the class order, the option builder), ADR-0060 (what counts as an observation, fluency), ADR-0070 (the rapid-guess time), ADR-0140 (outcomes and the streak), ADR-0180 (the report's pages and error types), RES-0400, RES-0700, RES-0800 (nodes N4, A4, A10, A14), RES-0900, RES-1200 (the trap catalogue), RES-2550 (the error class type), SPC-0020 (the event table) and SPC-0030 (the answer route and packets). I read the approved requirements these decisions address on the task window, the correct answer before the first attempt, the class of a wrong answer, marking by result, unassisted attempts, fluency, rapid guesses, error types, the first attempt deciding the outcome, and scored tasks looking like unscored ones. The repository was at commit 47c0a7b.

On the web on the same day I read the abstract and first pages of Siegler and Booth (2004), the first pages of Poloczek, Hammerstein and Büttner (2022), the summaries of two studies by Ganor-Stern (2016, 2018) and of Bellon, Fias and De Smedt (2020), the statutory requirements of the English national curriculum for mathematics, and a Russian grade 3 lesson plan on checking by estimate. I couldn't obtain the full text of Nunes and colleagues (2009) on teaching the inverse relation (HTTP 403), of Star and Rittle-Johnson (2009) on estimation (HTTP 405) or of Sutherland and colleagues (2024), a review of self-monitoring in mathematics interventions (HTTP 403), so I record nothing from them. I found no study that measures whether a prompt to check by the inverse raises children's accuracy, and none on an estimate given as a choice of intervals before the exact answer. The claim in the addendum that the Dutch doorstroomtoets often asks for estimating and rounding stays the owner's; I read only search snippets about it.

## Findings

### The addendum asks for a four-option estimate before the exact answer in about 15 % of scored tasks of named nodes

In multi-digit multiplication and division, decimals, percentages, area and volume, and T2 to T4 word problems with large numbers, the player first answers "by eye" and then exactly. She picks one of four intervals on a number line, such as "under 100 / 100-500 / 500-1000 / over 1000", or one of four rounded values of different orders. The engine builds the options so the correct one doesn't stand out by position, and so the errors of order (times 10, divided by 10) and "added in place of multiplied" fall in different intervals. The estimate appears in about 15 % of scored tasks of those nodes and at most once per room. The engine checks the estimate only after the exact answer, and shows both verdicts together. Acceptance test 4 restates three of these rules: the correct interval is spread evenly over the positions, times 10 and divided by 10 fall in different intervals, and no estimate verdict comes before the exact answer. Source: the owner's addendum 1, section 3 and acceptance test 4, read 2026-09-28.

### The addendum makes the estimate a separate "number sense" observation per node and adds three error classes

The estimate is an observation of a separate "number sense" («чувство числа») stream per node, and the exact answer enters the "on her own" estimate as usual. The new classes are `magnitude` (the exact answer is off by a factor of 10^k and the estimate is right), `magnitude_unaware` (the exact answer is off in order and the estimate is wrong too) and `estimate_off_exact_ok` (the estimate is wrong and the exact answer right). The report shows a matrix of estimate by exact answer per node. Source: the owner's addendum 1, section 3, read 2026-09-28.

### The addendum adds a free inverse-check button that isn't a hint, and counts an answer corrected after it as clean

In a calculation task with one final operation (+, -, multiplication, division), a free button «Проверить нить» (Check the thread) is available before she submits. It opens a small field, "Check by the inverse operation: ... = ?". She types the result of her check, and the engine shows only whether it matches; it never reveals the correct answer. Using the check is optional and doesn't make the attempt assisted, "because it is her own action, not a hint". The log records `self_check_used`, what she typed and whether she changed her answer after it (`self_corrected`). The report shows how often she checks and how often the check saves an answer. The one reward is that an answer corrected after the check counts as clean. The addendum says the engine compares her check result "with her preliminary answer"; for an inverse check the number her result must reproduce is a given of the task, such as the minuend, and I read the comparison that way. Source: the owner's addendum 1, section 3, read 2026-09-28.

### The addendum's general rules keep new observations out of "on her own" until a refit shows they help

"The first attempt measures. New forms write their observations to separate streams. They don't enter the 'on her own' estimate for calculation subtypes until the offline refit of the model shows they improve prediction." No new mechanic rewards speed or shows time. Source: the owner's addendum 1, general rules, read 2026-09-28.

### Estimating a result and calculating it exactly are partly different skills

Ganor-Stern (2018) gave 99 pupils in grades 4 to 6 and 25 students two tasks on two-digit multiplication: exact calculation on paper, and estimation as a forced choice of whether the product is larger or smaller than a reference number. Across age groups the accuracies of the two tasks correlated at 0.35 and their speeds at 0.60, and the author concludes that the two tasks "reflect at least in part different skills". Source: Ganor-Stern 2018, Frontiers in Psychology, read 2026-09-28.

### Children of about ten judge a product against a reference mostly by a coarse sense of magnitude, and above chance

In Ganor-Stern (2016), 28 fourth graders, 28 sixth graders and 28 adults judged whether a two-digit product was larger or smaller than a reference number. Fourth graders used a sense-of-magnitude strategy, with no calculation, on 62 % of trials, sixth graders split evenly, and adults used rounding and multiplying on 70 %. Every group performed above chance. A choice among ranges is therefore within reach of a primary-school child without a written calculation. Source: Ganor-Stern 2016, PLOS ONE, read 2026-09-28.

### Computational estimation is approximation plus mental calculation, and one of its uses is checking an exact result

Poloczek, Hammerstein and Büttner (2022) describe computational estimation as two subtasks, approximating the numbers and calculating with them mentally, and name checking "the reasonableness of complex calculations found through other means" as one of its uses. Their study of fourth graders on 72 addition problems found that most children adapted their rounding to the unit digits. Source: Poloczek, Hammerstein and Büttner 2022, Journal of Numerical Cognition 8(1), read 2026-09-28.

### Number-line placement predicts achievement, but it is a different task from estimating a result

Siegler and Booth (2004) found that kindergarten to second-grade children's placements of numbers on a 0-100 line "correlated strongly with math achievement test scores". The task places a given number on an unmarked line; the same paper lists estimating a multi-digit product as a different kind of estimation. Their result supports number sense as worth measuring, and says nothing directly about the addendum's estimate of a calculation's result. Source: Siegler and Booth 2004, Child Development 75(2), pp. 428-429, read 2026-09-28.

### School curricula teach estimating and checking by the inverse together in primary school

The English national curriculum requires in year 3 to "estimate the answer to a calculation and use inverse operations to check answers", in year 4 to "estimate and use inverse operations to check answers to a calculation", and in years 5 and 6 to use rounding and estimation to check answers. A Russian grade 3 lesson plan for the «Школа России» course sets as its goal «формирование умений выполнять прикидку результата арифметических действий с помощью округления» (learning to estimate the result of an operation by rounding). Sources: gov.uk, national curriculum in England, mathematics programmes of study; uchi.ru, grade 3 lesson 5; both read 2026-09-28.

### Children at 8 to 9 monitor their own wrong answers poorly, and monitoring predicts arithmetic

Bellon, Fias and De Smedt (2020) asked 147 third graders and 77 second graders in Flanders to judge each of their single-digit arithmetic answers as correct, incorrect or unknown. Monitoring accuracy within arithmetic predicted arithmetic performance at both ages. The review in the same paper reports children as confident even when wrong. A tool that makes her test her own answer targets a weakness the research finds in primary-school children. Source: Bellon, Fias and De Smedt 2020, PLOS ONE, read 2026-09-28.

### An answer corrected before submitting is already the first attempt, so it counts as `clean` under the approved record with no new rule

ADR-0080 starts the first attempt's check when the player submits: state `first_answered` begins with the server checking the answer, and ADR-0140 takes a spell's outcome from the unassisted first attempt's verdict alone. ADR-0040's checker marks an answer by its result and never reads the method or the scratchpad. An answer she changes after the check and before «Готово» (Done) is the first attempt, so a right one is `clean` and moves the streak like any other. The addendum's "bonus" therefore needs no rule of its own, and it conflicts with nothing, as long as the build never logs the preliminary answer as an attempt. Sources: ADR-0080, ADR-0140, ADR-0040, read 2026-09-28 at commit 47c0a7b.

### The check's match signal tells the player nothing she can't see, so the attempt can stay unassisted

The check compares her check result with a number already printed in the task: for 345 - 178 with her answer 167, the check 167 + 178 must give 345. Both numbers are on her screen, so the match adds no information about whether 167 is right beyond what her own addition gives. ADR-0080 and SPC-0030 keep the correct answer off the device before the first attempt; the check never computes or sends it. ADR-0080 marks an attempt assisted by a bought hint rung, and ADR-0060 feeds the "on her own" estimate from unassisted first attempts; a check is not a rung. The claim holds only while the comparison target is a given of the task. If the server compared her check with the correct answer, or judged her preliminary answer, the button would become a free verdict before the first attempt. Sources: ADR-0080, ADR-0060, SPC-0030, read 2026-09-28 at commit 47c0a7b; the arithmetic is mine.

### A check prompt on a word problem names the operation, and that is a hint

The addendum allows the check in "tasks with one final operation". A T1 word problem has one operation, and its prompt "Check by the inverse operation: 167 + 178 = ?" names both the operation she should have chosen and its operands. ADR-0040 treats choosing the operation as the modelling step it measures with a model choice, and ADR-0180 counts a wrong model as a modelling error apart from a calculation error. On a bare expression the operation is visible already, so the prompt reveals nothing. Sources: ADR-0040 (model-choice phase), ADR-0180 (word-problem matrix), read 2026-09-28 at commit 47c0a7b.

### A check can also spoil a right answer

If her preliminary answer is right and her check calculation wrong, the field shows no match and she may change a right answer to a wrong one. The addendum logs `self_corrected` and reports how often the check "saves" an answer; a flag that only means "changed" counts a spoiled answer as a save. Source: the addendum's wording, read 2026-09-28; the case is mine.

### ADR-0080 closes the list of the task window's controls, and neither the estimate options nor the check button is on it

ADR-0080: "The window holds only the task, the answer field or options, the keypad, «Не знаю», the thread button and «Готово» (Done), with no sprite, effect or story text", and the approved requirement it addresses says "only" too. The estimate's four options sit before the answer field and the check opens a field of its own. The same decision forbids «верно» (correct), «неверно» (incorrect), «ошибка» (mistake), a tick or a cross in the window, which rules out the usual way of showing a match. Sources: ADR-0080 and the requirements it addresses on the task window, read 2026-09-28 at commit 47c0a7b.

### An estimate shown only on scored tasks tells the player the task is scored

SPC-0030 never sends the client whether a task is scored, and draws a warm-up and a scored task the same way, as the approved requirements it addresses demand. ADR-0080 runs one flow for every task for that reason: "a warm-up or an easy task that skipped the twin after `alt` would tell her it was unscored". The addendum places the estimate in "about 15 % of scored tasks". Built as written, a task with an estimate step is always scored. Sources: SPC-0030, ADR-0080, read 2026-09-28 at commit 47c0a7b.

### The checker's class order leaves no place for classes that read the estimate

ADR-0040's `check(spec, correct, raw)` reads only the answer and gives a wrong answer the first class that fits: a matching trap, else `computational`, else `unclassified`, as the approved requirements it addresses require. The three new classes read a second input, the estimate. `estimate_off_exact_ok` labels a right exact answer, which ADR-0040 never classes. A wrong answer off by 10^k that matches no trap must be `unclassified` under that rule, where the addendum says `magnitude`. Several catalogued traps already produce errors of order: A6a "a zero lost or added (30 · 60 = 180 or 18 000)", D3 "shift the other way", D4 "comma placed as in one factor", D5 "comma not moved (6 : 0,3 = 2)" and P2 "comma shifted the wrong way". On those nodes the trap wins and `magnitude` never fires, unless the order changes. Sources: ADR-0040 and the requirements it addresses on classing a wrong answer, RES-1200's catalogue, read 2026-09-28 at commit 47c0a7b.

### The report's error types have four fixed classes, and the new classes fit none of them without a rule

ADR-0180's error-type limit places every mistake in one of four classes: conceptual, procedural, computational or unclassified. RES-2550 types `errorClass` as `conceptual`, `procedural`, `fact`, `slip` or `unclassified`, and ADR-0180 reports `fact` and `slip` together as computational. The addendum's reading of `magnitude` ("understands the meaning, confuses places or the comma") is procedural and of `magnitude_unaware` ("doesn't feel the size") conceptual, but no approved record says so. Sources: ADR-0180, RES-2550, read 2026-09-28 at commit 47c0a7b.

### The estimate step and the check add time that the fluency and rapid-guess tests read

ADR-0060 counts an attempt `fast` for fluency when it takes no longer than the template's fluency threshold. ADR-0070 marks a rapid guess on the time "from the task's appearance to «Готово» (Done), without pauses". An estimate step before the exact answer and a check before «Готово» both fall inside that span. A player who checks her work would be read as slow, and the report would show «понимает, нужна скорость» (understands, needs speed), which punishes the habit the addendum wants to build and breaks its own rule that no mechanic rewards speed. ADR-0060 already has a pattern for this: an `interrupted` or `crossDevice` attempt "counts for accuracy, but its time counts in no measure". Sources: ADR-0060, ADR-0070, read 2026-09-28 at commit 47c0a7b.

### On a number line, an evenly spread correct interval and separate intervals for the errors of order can't both hold

On a number line the four intervals are in order of value and cover it, from "under 100" to "over 1000". If the correct value is in the lowest interval, its tenth is smaller still and falls in the same interval; if it is in the highest, ten times it does too. So whenever times 10 and divided by 10 must each fall outside the correct interval, the correct interval can only be second or third, and acceptance test 4's even spread over four positions fails. Four rounded values shown as shuffled buttons escape this, because their positions needn't follow their values, and an error of order beyond the list has no option of its own. Source: the addendum's section 3 and acceptance test 4, read 2026-09-28; the argument is mine.

### A four-option estimate is a choice task that a guess gets right one time in four

RES-0700 makes free input the default "because a typed answer can't be guessed" and sets a floor of 4 options for a scored choice. RES-0900 takes 0.25 as the guess rate of a choice of four. The estimate meets the floor, and each estimate observation is weak evidence: one right estimate is right by chance a quarter of the time. At 15 % of the tasks of a node and at most one a room, a node's estimate-by-exact matrix fills slowly. Sources: RES-0700, RES-0900, read 2026-09-28 at commit 47c0a7b.

### The skill graph already holds estimation as nodes of its own

RES-0800 has N4 "Rounding and estimating a result", a prerequisite of A10 and A14, and A14 "Calculator: ... checking by estimate". RES-1200 builds N4 tasks as "estimate a sum or product (choose the nearest)". A per-node "number sense" stream measured on host tasks of A7, D4 or P2 overlaps what N4 measures on its own tasks, and the approved record says nothing about whether one feeds the other. Sources: RES-0800, RES-1200, read 2026-09-28 at commit 47c0a7b.

### The live specifications carry no field for an estimate or a check

SPC-0020's event table records an attempt's input summary, answer, assisted flag and hint level in `attempt_submitted`, and the verdict, trap and error class in `verdict`. SPC-0030's `AnswerIn` carries `raw`, `parsed`, `dontKnow`, timings and `clientSeq`, and `Room` carries the view, the `InputSpec` and the thread stock. The addendum adds `estimate?` and `selfCheck?` to the attempt, and `estimate_submitted` and `self_check_used` as events. Sources: SPC-0020, SPC-0030, read 2026-09-28 at commit 47c0a7b; the owner's addendum 1, section «События», read 2026-09-28.

### The options for the estimate

The owner's instruction settles the estimate as the addendum describes it. The comparison records what each option is better at, so the design step knows what it gives up.

| Option | Better at | Against it |
| --- | --- | --- |
| Do nothing: keep estimation to N4 and A14 tasks | No extra step in any task, no new stream, no new controls; N4 already measures estimating a result | No task pairs an estimate with an exact answer on the same numbers, so the report can't separate "the meaning is there, the calculation fails" from "the calculation works, the meaning doesn't", which the addendum names as the most useful split for lessons |
| The addendum: a four-option estimate before the exact answer on about 15 % of tasks of named nodes | Pairs both answers on the same numbers; forced-choice ranges suit children who estimate by a coarse sense of magnitude (Ganor-Stern 2016); trains the habit the curricula teach | Adds time to 15 % of tasks; one estimate is weak evidence at a guess rate of 1 in 4; conflicts with ADR-0080, ADR-0060 and ADR-0070 until they change |
| Estimate after the exact answer: "does your answer look right?" | Asks for the reasonableness check Poloczek and colleagues name as a use of estimation, and adds no step before the answer | Her own number anchors the judgement, so a wrong estimate after a wrong answer no longer shows she can't feel size |
| Standalone comparison tasks: "is 38 times 47 more or less than 1000?", placed in N4 | The format Ganor-Stern used, with published age norms; no change to the attempt flow | Measures number sense on other numbers than the exact answer, so the per-node matrix is lost |

The case against the addendum's option is its cost in weak evidence: a 1-in-4 guess rate and at most one estimate a room mean a node's matrix needs weeks before a cell holds enough answers to read, and the report must say «мало данных» (too little data) until then.

### The options for the inverse check

| Option | Better at | Against it |
| --- | --- | --- |
| Do nothing | No new control, no new state in the flow | Loses the habit the curricula teach and the monitoring the research finds weak in primary school (Bellon and colleagues 2020) |
| The addendum: a free check, the engine shows a match, the attempt stays unassisted | Builds the habit with no price; the match signal carries no information she can't see, so the measure stays fair | The prompt on a word problem names the operation; the check time inflates the answer time; a flag that only means "changed" counts spoiled answers as saved |
| A free check that makes the attempt assisted | The "on her own" estimate stays exactly as it is today | Teaches her that checking costs her the clean outcome, which works against the habit; and it loses observations for no gain, since the check leaks nothing |
| A check field with no match shown: she compares the numbers herself | The comparison stays her own act, as on paper | The same information reaches her either way, and a child who misreads a four-digit number gets no help; the addendum asks for the match |

## Conclusions

1. The game MUST offer the estimate step on unscored tasks of the named subtypes, warm-ups and easy tasks included, at the same rate as on scored ones, so the presence of an estimate never tells her a task is scored. ADR-0080 and ADR-0070 must be amended to place it.
2. The server MUST send no estimate verdict before the exact answer: one `AnswerIn` carries both, and one `AnswerOut` returns both, which also meets acceptance test 4's third clause by construction.
3. A task's outcome, streak and rewards MUST come from the exact answer alone; the estimate changes none of them. ADR-0140 needs no change for this, only a sentence confirming it.
4. The estimate MUST offer four rounded values of different orders as shuffled buttons, never intervals on a number line, because only that form lets both rules of acceptance test 4 hold. The option builder MUST place the correct option evenly over the four positions and keep times 10, divided by 10 and "added in place of multiplied" off the correct option.
5. Estimate observations MUST feed a separate number-sense stream per node and subtype, with a guess rate of 0.25, and MUST NOT enter the "on her own" estimate, the fluency estimate or N4's estimate until ADR-0060's activation rule admits them; none joins during the MVP. ADR-0060 must be amended to add the stream.
6. The estimate-based labels MUST be computed from the pair of estimate and exact answer and stored beside ADR-0040's class, so a trap keeps its identifier and `magnitude` adds to it, as `alsoSlip` does today. `estimate_off_exact_ok` MUST label a right exact answer without making it a mistake. ADR-0040, ADR-0180 and RES-2550's type must be amended to say how the labels map to the four report classes, and so must the approved requirements on the unclassified answer and the error-type classes. They MUST NOT override a trap or `unclassified`.
7. The time the player spends in the estimate step and in the check field MUST be left out of the answer time that the fluency test and the rapid-guess test read, so checking her work never makes an answer "slow". ADR-0060 and ADR-0070 must be amended, together with the approved requirements on the fluency estimate and the rapid guess, to name the span they measure.
8. The check MUST compare her check result only with the given of the task that her check must reproduce, and never with the correct answer or her preliminary answer's verdict, because only that comparison keeps it free of information. The `Room` packet MUST carry no more of the check than the visible expression already implies.
9. The check MUST be offered only where the operation is already visible, on bare expressions, and never on a word problem, because there the prompt names the operation.
10. An attempt with a check MUST stay unassisted, and the answer submitted after it MUST be the first attempt, so a right corrected answer is `clean` under ADR-0080 and ADR-0140 as they stand. The build MUST NOT log the preliminary answer as an attempt. A checked attempt MUST enter the "on her own" estimate from the first day, like any other first attempt of its subtype.
11. The event log MUST record each use of the check with the preliminary answer, the value she typed and whether it matched. The report MUST count a changed answer as saved when it went from wrong to right, and as spoiled when it went from right to wrong.
12. The task window MUST show the match without a tick, a cross or the words ADR-0080 forbids, and ADR-0080 and its requirement on the window's controls must be amended to list the estimate options and the check button among the window's controls. ADR-0150 draws them and ADR-0160 holds their strings.
13. The report MUST show the estimate-by-exact matrix per node with «мало данных» until a cell holds enough answers, and the check's use, saves and spoils. ADR-0180 must be amended to add both.
14. SPC-0020 and SPC-0030 must be amended to carry the estimate, the check and their events in `attempt_submitted`, `AnswerIn`, `AnswerOut` and `Room`.

### Decided on 2026-09-28

The estimate offers four shuffled rounded values of different orders and no number line, because on a line the correct interval can't sit at an outer position while times 10 and divided by 10 fall outside it, and the rounded values keep both the even spread and the separate errors of order that acceptance test 4 asks for. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The inverse check isn't offered on a word problem, one-step ones included, because its prompt names the operation that the word problem measures, and leaving it off changes no approved record while counting the attempt assisted would amend ADR-0080. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

`magnitude`, `magnitude_unaware` and `estimate_off_exact_ok` are labels stored beside ADR-0040's class and never override a trap or `unclassified`, as conclusion 6 proposes, because a trap's identifier names the cause more precisely and the checker's class order stays as approved. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

A checked attempt enters the "on her own" estimate from the first day, as conclusion 10 reads it, because the check is a control on an existing task rather than a new form, the addendum says the exact answer counts "as usual", and the match leaks nothing; the rule that new streams wait for ADR-0060's activation rule applies to the estimate stream, not to the exact answer. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

## Sources

- The owner's addendum 1 to the specification, 2026-09-28, read 2026-09-28 - section 3, the general rules, the events and acceptance test 4.
- `project/adrs/ADR-0040`, `ADR-0060`, `ADR-0070`, `ADR-0080`, `ADR-0140`, `ADR-0180`, read 2026-09-28 at commit 47c0a7b - the checker and its class order, observations and fluency, the rapid-guess time, the attempt flow, outcomes and the streak, the report's pages and error types.
- `project/research/RES-0400`, `RES-0700`, `RES-0800`, `RES-0900`, `RES-1200`, `RES-2550`, read 2026-09-28 at commit 47c0a7b - the first attempt, the choice floor, nodes N4 and A14, the guess rate, the trap catalogue, the error class type.
- `project/specs/SPC-0020`, `SPC-0030`, read 2026-09-28 at commit 47c0a7b - the event table and the answer route and packets.
- `project/requirements/`, the approved requirements that ADR-0040, ADR-0060, ADR-0070, ADR-0080, ADR-0140, ADR-0180 and SPC-0030 address on the points above, read 2026-09-28 at commit 47c0a7b - the rules each conflict names.
- [Ganor-Stern 2018, Do exact calculation and computation estimation reflect the same skills?](https://pmc.ncbi.nlm.nih.gov/articles/PMC6073251/), read 2026-09-28 - correlation of 0.35 in accuracy between exact calculation and estimation.
- [Ganor-Stern 2016, Solving math problems approximately: a developmental perspective](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0155515), read 2026-09-28 - fourth graders' sense-of-magnitude strategy on 62 % of trials, above chance.
- [Poloczek, Hammerstein and Büttner 2022, Children's mixed-rounding strategy use in computational estimation](https://files.eric.ed.gov/fulltext/EJ1354785.pdf), read 2026-09-28 - estimation as approximation plus mental calculation, and its use for checking reasonableness.
- [Siegler and Booth 2004, Development of numerical estimation in young children](http://www.cs.cmu.edu/afs/cs/Web/People/jlbooth/sieglerbooth-cd04.pdf), read 2026-09-28 - number-line estimation and achievement; estimating a product named as a different kind of estimation.
- [Bellon, Fias and De Smedt 2020, Metacognition across domains](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0229932), read 2026-09-28 - monitoring of arithmetic answers at ages 7 to 9 and its link to arithmetic.
- [Department for Education, National curriculum in England: mathematics programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study), read 2026-09-28 - estimating and checking by the inverse in years 2 to 6.
- [uchi.ru, grade 3 lesson 5: checking calculations, estimating and judging the result](https://uchi.ru/podgotovka-k-uroku/math_eor_topics/3-klass/quarter-545_1-chetvert/lesson-15259_proverka-pravilnosti-vychisleniy-prikidka-i-otsenka-rezultata), read 2026-09-28 - estimating by rounding taught in Russian grade 3.
