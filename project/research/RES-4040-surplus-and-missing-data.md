---
id: RES-4040
artifact: research
status: approved
revised: 2026-09-28
elaborates: RES-0700
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Word problems with a surplus or a missing number fit the approved game only if every T problem looks the same until she answers, and at about one word problem a day the 10 % refusal guard needs a window of 20 solvable problems

## Summary

The owner's addendum 1 of 2026-09-28 adds word problems with a number the answer doesn't need («ложная нить», the false thread) and problems that can't be answered because a number is missing («оборванная нить», the broken thread). It puts a «Нельзя узнать» (can't be known) button beside «Не знаю» (I don't know) in every T1 to T4 problem. It adds two verdicts and the subtypes `*.surplus` and `*.missing`, at shares of about 10 % and 5 %. The published evidence supports the idea: children aged 10 and 11 reacted realistically to only 17 % of problematic word problems, and an irrelevant number cut grade 2 accuracy with an effect size of 0.73. The same evidence warns that a standing hint such as an always-visible button changes little at first. The approved record conflicts with the addendum in eight places. T4 already holds exactly one unused number in every problem. `S3.missing` means something else. The graph can't express the new subtypes' prerequisite, and its default weights would make a rare subtype a third of a node. The Guardian's model choice, step input and twin would give the answer away. The checker has no verdict for three of the new answers, and the task window, the limits and the report count only «Не знаю». Word problems reach play only through the Guardian, about one a day, so a missing problem comes about once in two to three weeks and a single refusal already breaks the 10 % weekly guard. Research decided the six open questions on 2026-09-28: T4 keeps its unused number with no separate surplus subtype, the unanswerable subtype is named `*.insufficient`, a wrong or absent missing given earns 0.5, the refusal guard reads the last 20 solvable problems, the twin of an unanswerable problem is drawn at random, and the new subtypes stay out of the T estimates during the MVP. I cover addendum item 4 and its acceptance test 5, and leave the hint ladder, the plan cards and the Dutch bridge to the records on items 1, 6 and 8.

## The question

What must now be true of the game, its data and the approved record so that surplus and missing-data problems measure what the owner wants and give nothing away? The owner's addendum is the instruction, dated 2026-09-28, and it outranks the approved record where they disagree.

The addendum assumes that one always-present button, plus a small share of missing problems, both hides the answer and measures whether she notices missing data. The button hides the answer only if nothing else on the screen differs between a solvable and a missing problem, and several approved phases of a word problem do differ, as the findings below show. The small share keeps «Нельзя узнать» from becoming a safe guess, but it also means few observations. The addendum sets the share as a percentage of word problems without saying how many she meets, and the approved record gives her about one a day. So the question has two parts: what leaks, and whether the counts support the estimates and the guard.

## Method

On 2026-09-28 I read the owner's addendum 1 in Russian: its list of items, its general rules, item 4 in full, the list of events and the acceptance tests. I also read item 1 (the hint ladder), item 6 (the plan cards) and item 8 (bare and context tasks, the Dutch bridge) where they meet word problems.

At commit 47c0a7b I ran `paw find` for "missing", "surplus", "don't know", "verdict", "subtype", "word problem", "share", "Director", "S3", "T1", "AnswerSpec" and "error class". I searched `project/` for "insufficient", "irrelevant", "S3", "лишн" and "недостающ". I read RES-0700, RES-0800 (the node tables, the subtype prerequisites and the stretch rules), RES-1000 (the Guardian and the session budget), RES-3900 (how T reaches play) and the parts of RES-3200 on `TaskWindow` and `OutcomeBadge`. I read ADR-0050 whole and ADR-0040's decision on generation and checking. I read the parts of ADR-0070 on the day plan, the Guardian and rapid guesses, of ADR-0080 on the attempt flow, and of ADR-0030, ADR-0060, ADR-0090, ADR-0140, ADR-0150 and ADR-0180 on «Не знаю», scores, outcomes, the task window and the word-problem matrix. I read SPC-0030 on `AnswerIn`, `AnswerOut` and the `dont_know` verdict. The approved requirements I name below by what they say, with the decision that carries them, because a research record cites no requirement.

On the web, on 2026-09-28, I searched for research on word problems with irrelevant, extraneous, missing and insufficient information and on unsolvable problems, and for the Russian primary-school method «задачи с недостающими и лишними данными». I read the ERIC copy of De Corte, Verschaffel and Lasure's 1995 conference paper and the chapter by De Corte, Verschaffel and Greer that reviews the replications and the warning studies. I also read Wang, Fuchs and Fuchs (2016) in full on PubMed Central, and two Russian lesson pages. The ScienceDirect pages of Verschaffel, De Corte and Lasure (1994) and of the 2017 paper "Irrelevant information in math problems need not be inhibited" returned 403. So did ResearchGate's page for Low and Over (1989) on detecting missing and irrelevant information, and Springer redirected "Generating multiple answers for a word problem with insufficient information" to a login. I record nothing from those four. I found no study of how often a missing-data problem should appear so that "can't be known" doesn't become a guess, so the 5 % share rests on the owner's judgement alone.

## Findings

### The addendum fixes the form, the button, the verdicts, the subtypes, the shares and the data changes

The owner's addendum, item 4, read 2026-09-28, sets these rules. A surplus problem has a number the answer doesn't need; its answer is an ordinary number, and using the surplus number gets the error class `used_extra_data`. A missing problem can't be answered; the correct answer is «Нельзя узнать» plus a choice of what is missing, from 4 options the engine builds from the problem's graph. Every T1 to T4 word problem shows «Нельзя узнать» beside «Не знаю», because a button shown only on missing problems would give the answer away. «Нельзя узнать» on a solvable problem is a wrong answer, `false_insufficient`, with the usual free short solution. The log and the report keep «Не знаю» ("I can't solve it") apart from «Нельзя узнать» (a claim about the problem).

The subtypes `*.surplus` and `*.missing` join nodes T1 to T4, and "for S3 the subtype `S3.missing` already exists and doesn't change". Their prerequisite is the ordinary subtype of the same node at «понимает» (understands) or above. About 10 % of word problems carry a surplus number and about 5 % a missing one. If «Нельзя узнать» on solvable problems exceeds 10 % in a week, the report shows a separate observation, «склонна отказываться от задачи» (tends to refuse the problem). The Director then lowers the share of missing problems for a while. `AnswerSpec` for word problems gets `allowInsufficient: true`, `Answer` gets `{ kind: "insufficient"; missing?: number }`, and the verdict gets `false_insufficient` and `insufficient_correct`, the second counting as correct. Acceptance test 5 reads: the button in every T1 to T4 problem, and `false_insufficient` for solvable ones.

### She meets about one word problem a day, so a missing problem comes once in two to three weeks

Word problems reach play only through the Guardian, on about one floor in three, and a day has 3 maths floors, or 4 when time allows (RES-1000, RES-3900, ADR-0070, read 2026-09-28). That is about 1 to 1.3 word problems an adventure day, or 7 to 9 a week if she plays every day. At the addendum's shares she meets a missing problem about 0.35 to 0.47 times a week, one every two to three weeks, and a surplus problem 0.7 to 0.9 times a week. The Guardian's ladder sets most problems at k or k + 1 steps (ADR-0070), so each tier's `missing` subtype gets an observation about once in four to six weeks. That figure is my estimate from the ladder, not a measurement.

The refusal guard counts refusals among solvable problems, about 6.5 to 9 a week. One «Нельзя узнать» on a solvable problem is 11 % to 15 % of such a week, so a single press already crosses 10 % and shows the parent «склонна отказываться от задачи». Addendum items 2 and 8 add forms around word problems but don't add Guardian problems, so these counts hold for the addendum too.

### T4 already has exactly one unused number in every problem, so `T4.surplus` duplicates T4 and the surplus share exceeds 10 %

RES-0800 names T4 «Четырёхшаговые и с лишними данными» (four-step and with surplus data). RES-0700 concludes that a T4 problem must contain exactly one irrelevant number, and an approved requirement carries that into the record. ADR-0040 builds it: a T4 template adds exactly one given that no valid graph uses, and a property test on 10,000 seeds counts it (all read 2026-09-28). The addendum's `T4.surplus` then differs from ordinary T4 in nothing, and every T4 problem is a surplus problem, so the surplus share across T1 to T4 is 10 % plus the whole share of T4. The addendum names none of these records. ADR-0040 also has no error class for using the unused number, so today a T4 answer that uses it is a structure trap only if a template happens to list it, or `unclassified`.

### `S3.missing` means "the missing number from a mean", a computation, not missing data

RES-0800 defines S3 as «Среднее арифметическое; недостающее число по среднему» (arithmetic mean; the missing number from a mean), with `S3.missing` a stretch subtype that S7 requires. ADR-0050 gives S3's `missing` as its example of a stretch subtype on a 1S node (read 2026-09-28). A task of `S3.missing` gives the mean and all numbers but one and asks for that one, so it always has an answer. The addendum's `T1.missing` to `T4.missing` have none. The two suffixes would name two different things, and a report or a query that groups subtypes by suffix would put a stretch computation beside a failure to notice missing data.

### The graph can't express the new subtypes' prerequisite, and its default weights would make each new subtype a third of its node

ADR-0050 gives a node's `prereqs` as node ids, each optionally tagged with the one subtype it serves, and its validator rejects any cycle (read 2026-09-28). A prerequisite from `T2.missing` to the ordinary subtype of T2 points at the node itself, which the schema has no field for. RES-0800 states the similar rule for the stretch subtypes `G6.blocks` and `S3.missing` only in prose, and no approved decision implements it.

ADR-0050 sets equal weights across a node's subtypes by default. T1 with an ordinary, a surplus and a missing subtype gives each 1/3, and the node estimate aggregates subtypes by weight (ADR-0060). A full block must cover every subtype of weight 0.2 or more within its last 5 graded tasks in 7 days (RES-0900, ADR-0050 consequences). At one missing problem in two to three weeks the Director can't meet that coverage without raising the share far above 5 %. The Guardian's ladder reads k from the T nodes' states (ADR-0070), so a third of each state would come from noticing missing data, and the ladder would stop measuring how many steps she holds.

### The Guardian's model choice and step input need a complete graph, so a missing problem that skips either gives the answer away

An approved requirement from RES-3500, which ADR-0150 carries, makes every Guardian problem open with a choice of one short model from four before the step-by-step input. ADR-0040 builds the four models from the valid graph and three structure traps, and alternates step input and final-answer input strictly across T2 to T4, reading the last form from the log (read 2026-09-28). A missing problem has no complete valid graph. If it skips the model choice or the step fields, she learns before answering that this is the missing kind. If it shows them, the engine needs a model and steps for a problem that can't be solved. The same holds for the plan cards of addendum item 6, built from what must be found first. It holds for the numeric rungs of addendum item 1 too, which show "the first step with numbers from the problem". The Dutch bridge of addendum item 8 puts Dutch keywords into about 20 % of T1 to T4 problems, and a word she can't read looks exactly like a missing given.

### The twin after a missing problem is another missing problem

After a wrong answer or «Не знаю», ADR-0080 gives one second attempt on a parallel task with the same template, subtype and difficulty, as an approved requirement fixes (read 2026-09-28). After a missing problem she has just read a short solution saying the answer can't be known, and the twin is again a missing problem, so she can press «Нельзя узнать» without reading it. Addendum item 1 widens the twin to every answer after hint rung 2 or 3, so the same leak follows a hinted missing problem.

### The packet leaks nothing only if the "what's missing" step exists on every T problem

ADR-0040 sends the client only what the strict `ItemViewOut` and `InputSpec` schemas allow, and the item identifier reveals nothing about node or subtype. SPC-0030's `Room` packet carries the view and the `InputSpec` (read 2026-09-28). `allowInsufficient: true` on every T1 to T4 problem reveals nothing. The 4 options of "what's missing" can leak. If the engine builds them only for missing problems, then their presence in the packet, or a server reply that returns them, tells a curious client which kind it holds. The addendum says the engine builds the options "from the problem's graph", which works for a missing problem; a solvable problem needs four plausible options too.

### The checker, the outcomes and the addendum leave three answers without a verdict

ADR-0040's checker returns a credit of 1, 0.5 or 0, a class and a trap for each answer kind, and accepts `dont_know` for every kind. ADR-0030 and SPC-0030 carry `dontKnow` in `AnswerIn`, and the server logs the verdict `dont_know` apart from `wrong` (read 2026-09-28). ADR-0140 maps verdicts to three outcomes, `clean`, `partial` and `alt`, and its badge mapping, drawn by RES-3200's `OutcomeBadge`, shows `soft` after a wrong answer and `unknown` («Принято», accepted) after «Не знаю». ADR-0060 scores an observation 1, 0.5 or 0.

The addendum gives `insufficient_correct` credit 1 and `false_insufficient` the status of a wrong answer, so ADR-0140 maps them to `clean` and to `alt` with the `soft` badge. It says nothing about three other answers. One is «Нельзя узнать» on a missing problem with the wrong missing number chosen, and another is the same with none chosen, which `missing?` allows. The third is a number typed for a missing problem, which fits no class in ADR-0040's order of trap, `computational` and `unclassified`.

### The task window, its labels and its shortcut name only «Не знаю»

ADR-0080 and ADR-0150 hold the task window to the task, the answer field or options, the keypad, «Не знаю», the thread button and «Готово» (Done), with nothing else. ADR-0150 maps "?" on a keyboard to «Не знаю», and its Playwright test finds «Не знаю» in every answer kind. An approved requirement from RES-3300, which ADR-0160 carries, lists the world's labels for the task buttons (read 2026-09-28). «Нельзя узнать» is a new element in that list and needs its own label and shortcut. It must sit apart from «Не знаю», because a slip between two buttons that both end a first attempt corrupts the observation RES-0700 protects.

### The limits and the report count «Не знаю» and know nothing of «Нельзя узнать»

ADR-0180's avoidance limit counts runs of 3 «Не знаю» in a row, and its help limit counts «Не знаю» on first attempts with hints. ADR-0070 raises review after a high share of «Не знаю» and hints in an adventure, and ADR-0090 offers a rest stop after 3 «Не знаю» in a row (read 2026-09-28). The addendum keeps the two buttons apart, so none of these counts «Нельзя узнать», and the refusal guard is the only place that watches it. ADR-0180's word-problem matrix splits a wrong model choice (a modelling error) from a wrong answer after a right model (a calculation error); `false_insufficient`, `used_extra_data` and a number typed for a missing problem are neither. ADR-0180's holding-steps limit counts every unassisted first attempt on a k-step problem towards step k, so a missing problem would count noticing as holding steps.

### Pupils of 10 and 11 answer problematic word problems realistically only 17 % of the time

De Corte, Verschaffel and Lasure gave 75 fifth-graders in Flanders a test in which half the problems were standard and half problematic, with a model "less obvious and indisputable". 128 of 750 reactions to the problematic items (17 %) were realistic, and a second study with 64 pupils found 16 % (ERIC ED387345, 1995, read 2026-09-28). The review chapter by De Corte, Verschaffel and Greer reports the same 17 % for the 1994 study, with 0 % to 17 % on eight of ten items. It lists replications in Belgium, Germany, Japan, Northern Ireland, Switzerland and Venezuela (read 2026-09-28). The chapter lists beliefs pupils seem to hold, among them "every problem presented by the teacher or in a textbook is solvable" and "the problem contains all the information needed". It calls them a hypothetical construct with little direct evidence. Most problematic items were about realistic modelling, such as distances between two homes, and few were missing-data problems. So the 17 % shows the belief is strong; it doesn't measure how often she will press «Нельзя узнать».

### A warning that some problems are unsolvable changed little; a realistic setting changed more

In three studies pupils were told before the test that some problems would be difficult or unsolvable, and were asked to mark and explain them. The chapter reports these interventions produced "at best, only weak effects" (De Corte, Verschaffel and Greer, read 2026-09-28). The 1995 paper adds that two scaffolds in interviews raised realistic reactions from 23 % to 40 % and then to 57 % (ED387345). A buses problem set inside a realistic phone call drew appropriate answers from 16 of 20 pupils, against 2 of 20 on a paper test. An always-visible «Нельзя узнать» is a standing version of the weak warning, so I expect low detection early, and I expect the short solution and the story frame to teach more than the button does.

### An irrelevant number lowers accuracy and draws on reasoning an ordinary problem doesn't

Wang, Fuchs and Fuchs tested 701 second-graders on 7 word problems without and 7 with irrelevant information: means 5.58 and 4.03, t(700) = 19.41, effect size 0.73 (Learning and Individual Differences, 2016, read 2026-09-28 on PubMed Central). Nonverbal reasoning predicted the problems with irrelevant information and not the others. A surplus problem therefore measures something the ordinary subtype doesn't, which supports keeping it as its own subtype, and a drop on surplus problems says little about her ordinary word-problem skill.

### The Russian primary method teaches missing and surplus data from grade 1, and the pupil names and supplies what is missing

A grade 1 lesson on InternetUrok, citing grade 1 textbooks, teaches that a problem has a condition and a question. The pupil removes surplus data, and adds the missing data to a problem that lacks it (read 2026-09-28). A grade 3 lesson on nsportal.ru, built on Chekin's grade 3 textbook (part 2, exercises 217 to 221), gives the example «Во второй коробке лежало в 2 раза больше конфет, чем в первой. Сколько конфет лежало во второй коробке?» (the second box held twice as many sweets as the first; how many were in the second box?). Its rule reads: if a column of the table short note stays empty, the problem has missing data (read 2026-09-28). Both treat recognising and naming the missing given as the skill, which the addendum's "choose what's missing" matches. Both also teach the genre openly, where the addendum mixes it unannounced into ordinary problems.

### Four ways to let the new observations reach the model, and each wins at something

The owner fixed the subtypes; ADR-0050 left how much they weigh in the T nodes' estimates to defaults and the parent's review, so research chose among these four.

| Option | Better at | Case against |
| --- | --- | --- |
| Do nothing: keep T4's one unused number, add no missing problems and no button | costs nothing, and no refusal pattern can appear | contradicts the owner's instruction, and leaves unmeasured a skill the evidence shows most pupils lack |
| Subtypes at ADR-0050's equal default weights | one model and one report, with no new rule | each rare subtype is a third of its node, full blocks can't cover them at 5 %, and the Guardian's ladder starts to measure noticing |
| Subtypes with small fixed weights, below the 0.2 that full blocks must cover | keeps the owner's subtypes, fits the schema and the block rule, and keeps T states about steps | a weight of about 0.1 is a judgement no data supports, and each tier's `missing` estimate stays near its prior for months |
| Subtypes as tags only, with surplus and missing observations pooled into two streams across T1 to T4, kept out of the T estimates as the addendum's general rule keeps new forms | pools one observation a week or two into one estimate that can move within months | loses the per-tier view the owner asked for, and adds a stream the report has to explain |

Research chose small fixed weights of about 0.1, applied only once ADR-0060's activation rule admits the new streams, because it keeps the owner's per-tier subtypes and every approved rule at once. Until then, and for the whole MVP, each new subtype writes a stream of its own kept out of the T estimates and out of "on her own", as the cross-cutting rule for new forms requires. The case against it: at the counts above, a per-tier estimate of the unanswerable subtype will read «не проверено» (unchecked) or near its prior for months, and a parent may read that as a gap. The report must say so beside those streams. The evidence gives no reason to abandon the idea: the 17 % and the effect size of 0.73 both say the skill is real and often missing.

## Conclusions

1. The game must show «Нельзя узнать» beside «Не знаю» in every T1 to T4 problem and in every phase of it: the model choice, the step fields and the plan cards. A phase without the button marks the problem as solvable.
2. A missing problem must show the same phases, fields and packet fields as a solvable problem of its tier and form. The engine must build it from a complete graph with one given withheld, so the model choice, the step fields, the hint rungs and the plan cards have content. The step count of a missing problem is that of its complete graph.
3. The engine must build 4 "what's missing" options for every T1 to T4 problem, plausible givens for a solvable one. It must send or withhold them the same way for both kinds, so neither the packet nor a server reply tells the kinds apart.
4. The server must record `insufficient_correct` with credit 1 and outcome `clean`, and `false_insufficient` as a wrong answer with credit 0, outcome `alt` and the `soft` badge, and the knowledge model must score them 1 and 0.
5. The checker must give a number typed for a missing problem the error class `answered_insufficient`, with credit 0, and `used_extra_data` to an answer that equals a graph using the surplus number. The generator must reject parameters where such a graph gives the correct answer or another trap's answer.
6. The share of missing problems must stay low enough that «Нельзя узнать» is a poor guess. The item builder must draw surplus and missing problems from the seed at random, because a fixed cadence, like the strict alternation of step input, lets her predict the next one.
7. The refusal guard must read the last 20 solvable T1 to T4 problems, apply only once 20 exist, and fire at 3 presses of «Нельзя узнать» among them, the first count above 10 %. At 7 to 9 word problems a week one refusal is 11 % to 15 % of a week, so a weekly window would fire on one slip. When it fires, the Director must halve the unanswerable share to about 2.5 % until the next 20 solvable problems show 2 presses or fewer.
8. «Нельзя узнать» must not count in the avoidance runs of «Не знаю», the rest-stop offer or the help share. The report must show «Не знаю», «Нельзя узнать» on solvable problems, `used_extra_data` and numbers typed for missing problems as separate counts beside the word-problem matrix.
9. Only surplus problems may count towards the holding-steps limit; a missing problem must not, because it measures noticing and not holding steps.
10. The twin after a missing problem must not reveal the kind. The parallel task for a missing first attempt must be drawn at random as a missing or a solvable problem of the same tier, which departs from "same subtype".
11. The graph must express the new subtypes' prerequisite, the ordinary subtype of the same node at «понимает» or above, as a schema field for a sibling-subtype prerequisite or as a Director rule. The same field or rule must carry RES-0800's rule for `G6.blocks` and `S3.missing`.
12. During the MVP the new subtypes must write streams of their own and stay out of the T nodes' estimates and "on her own". Once ADR-0060's activation rule admits them, each must carry a fixed weight of about 0.1, below the 0.2 a full block has to cover, so each T node's state stays about holding steps.
13. A missing problem must carry none of the Dutch bridge's keywords, because a word she can't read looks like a missing given and the two errors can't be told apart.
14. The task window must place «Нельзя узнать» in its action row, apart from «Не знаю» and from the digit keys, with its own label and keyboard shortcut. The check that finds «Не знаю» in every answer kind must find «Нельзя узнать» in every T1 to T4 problem.
15. Acceptance test 5 must also check on 1,000 seeds that a missing and a solvable problem of one tier and form send packets with the same fields and phases. It must also check that the twin of a missing problem is sometimes solvable.
16. Each approved record below must be corrected by a new record that names what it replaces, because approved records are frozen:
    - ADR-0040, on the checker, the new answer kind, the classes, and the model-choice and step-input phases of a missing problem;
    - ADR-0050, on the sibling-subtype prerequisite and the new subtypes' weights;
    - ADR-0060, on scoring the new verdicts; ADR-0140, on their outcomes and badges;
    - ADR-0070, on the shares, the random draw, the refusal guard and the Guardian's ladder; ADR-0090, on the rest stop counting «Не знаю» only;
    - ADR-0080, on the twin and the window's contents; ADR-0150 and ADR-0160, on the button, its place, label and shortcut, and the Guardian's model choice;
    - ADR-0180, on the limits, the holding-steps count and the report; ADR-0030 and SPC-0030, on `AnswerIn` and the logged verdicts.

17. Every T4 problem must keep its one unused number, and T4 must get no separate surplus subtype: ordinary T4 is the surplus form. The 10 % surplus share must apply to T1 to T3.
18. The new unanswerable subtypes must be named `T1.insufficient` to `T4.insufficient`, and `S3.missing` must keep its meaning.
19. «Нельзя узнать» on a missing problem with a wrong missing given, or with none, must earn credit 0.5, outcome `partial` and the verdict `insufficient_partial`; the choice stays optional.

### Decided on 2026-09-28

T4 keeps its one unused number, and `T4.surplus` is not added as a separate subtype; ordinary T4 is the surplus form and the 10 % share applies to T1 to T3. This changes no approved record, since RES-0700, RES-0800 and ADR-0040 already build and test T4's unused number. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The new unanswerable subtypes are named `*.insufficient`, and `S3.missing` keeps its meaning. The record proposed this name, and it keeps a suffix from naming both a computation and a failure to notice missing data without changing RES-0800 or ADR-0050. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

«Нельзя узнать» with a wrong missing given, or none, earns 0.5 and outcome `partial`, and the choice stays optional. Noticing that a problem can't be answered is the skill the addendum measures and naming the given is the second step, and the credit of 0.5 and the outcome `partial` already exist in ADR-0040 and ADR-0140. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The refusal guard reads the last 20 solvable T1 to T4 problems, applies once 20 exist and fires at 3 presses; the Director then halves the unanswerable share until the next 20 solvable problems show 2 presses or fewer. A window of 20 is the smallest in which one slip stays at 5 %, well under the 10 % the owner set, and it counts problems rather than days, so no clock is involved. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The twin after a missing problem is drawn at random as a missing or a solvable problem of the same tier. The record led with this, because a twin of the same kind lets her press «Нельзя узнать» without reading. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The new subtypes write streams of their own and stay out of the T estimates and "on her own" during the MVP, and take fixed weights of about 0.1 once ADR-0060's activation rule admits them. The record led with small fixed weights, and the cross-cutting rule of 2026-09-28 keeps every new stream out until activation. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

## Sources

- The owner's addendum 1 to the specification, 2026-09-28, read 2026-09-28 - item 4 in full, items 1, 6 and 8 where they meet word problems, the event list and acceptance test 5.
- `project/research/RES-0700-answer-input-and-checking.md`, `RES-0800-skill-graph.md`, `RES-0900-knowledge-model.md`, `RES-1000-task-selection.md`, `RES-3200-design-components.md`, `RES-3900-reconciling-approved-research.md`, read 2026-09-28 at commit 47c0a7b - T4's unused number, the T node table, `S3.missing`, the stretch-subtype rule, full-block coverage, the Guardian's frequency and ladder, `OutcomeBadge`, and T reaching play only through the Guardian.
- `project/adrs/ADR-0030`, `ADR-0040`, `ADR-0050`, `ADR-0060`, `ADR-0070`, `ADR-0080`, `ADR-0090`, `ADR-0140`, `ADR-0150`, `ADR-0160`, `ADR-0180`, read 2026-09-28 at commit 47c0a7b - the `dont_know` verdict, the checker and classes, model choice and step alternation, the graph schema and weights, scores, the ladder and help share, the attempt flow and twin, the rest stop, outcomes and badges, the task window and labels, and the limits and word-problem matrix.
- `project/specs/SPC-0030-play-api-lifecycle-lease-and-answer-queue.md`, read 2026-09-28 at commit 47c0a7b - `Room`, `AnswerIn`, `AnswerOut` and the `dont_know` verdict.
- [De Corte, Verschaffel and Lasure, "Word Problems: Game or Reality?", AERA 1995, ERIC ED387345](https://files.eric.ed.gov/fulltext/ED387345.pdf), read 2026-09-28 - 17 % and 16 % realistic reactions, and the rise to 40 % and 57 % under scaffolds.
- [De Corte, Verschaffel and Greer, "Connecting mathematics problem solving to the real world"](https://sites.unipa.it/grim/Jdecorte.PDF), read 2026-09-28 - the 1994 study's figures, the replications, the weak effect of warnings, the realistic-setting studies and the hypothesised beliefs.
- [Wang, Fuchs and Fuchs, "Cognitive and Linguistic Predictors of Mathematical Word Problems With and Without Irrelevant Information", Learning and Individual Differences, 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5300308/), read 2026-09-28 - the accuracy drop with an irrelevant number and the role of nonverbal reasoning.
- [InternetUrok, «Задачи с недостающими и лишними данными», grade 1](https://interneturok.ru/lesson/matematika/1-klass/znakomstvo-s-osnovnymi-ponyatiyami-v-matematike/zadachi-s-nedostayuschimi-i-lishnimi-dannymi-otlichie-zadachi-ot-zadaniya), read 2026-09-28 - the grade 1 treatment: remove surplus data, add missing data.
- [nsportal.ru, «Урок математики в 3 классе: задачи с недостающими данными»](https://nsportal.ru/nachalnaya-shkola/matematika/2017/10/23/urok-matematiki-v-3-klasse-zadachi-s-nedostayushchimi), read 2026-09-28 - the grade 3 example and the empty-column rule, on Chekin's textbook.
