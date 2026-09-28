---
id: RES-4060
artifact: research
status: approved
revised: 2026-09-28
elaborates: RES-0700
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The solution plan fits the word problems as a second modelling phase beside the model choice, but only after the Guardian's word problem may open without a model and the engine builds each plan from one valid graph

## Summary

The owner's addendum 1 adds «Выкройка» (the pattern), a solution plan the player lays out from question cards before she solves a compound word problem. The plan fits the approved engine: code builds the cards from the template's computation graph with no language model, and the plan is scored apart from the model choice and the answer. Three approved records stand in its way. The approved screens requirement drawn from RES-3500 conclusion 6 makes every Guardian word problem open with a model choice, and word problems reach play only through the Guardians (RES-3900, ADR-0070), so no problem could carry a plan while the addendum forbids both in one task. Second, templates store every valid solution graph and the step check accepts each of them (RES-0700, ADR-0040), so a card set drawn from more than one graph has more than one right answer, and acceptance test 7 asks for exactly one. Third, ADR-0180's word-problem matrix counts only modelling and calculation errors, and the addendum's matrix «схема × план × ответ» can't be a cross of one task, because no task has both a model and a plan. The Soviet sources I read confirm the method: the analysis runs from the question to the data and ends in a plan written in the order of solving. The schema-based instruction studies I read show that structure-first instruction raises solving scores. I found no study that uses card ordering as a measurement. The four questions this record left open are decided: the plan runs forwards, "3 to 5 cards" counts the decoys, the model choice and the plan each take one compound problem in four, and each decoy kind has its own label under a fixed precedence. I cover section 6 of the addendum and its acceptance test 7, and leave the hint ladder, the surplus and missing data subtypes and the other forms to their own records.

## The question

The owner asked on 2026-09-28 for a plan phase in about 25 % of compound word problems (tiers T2 to T4). The player orders 3 to 5 question cards, such as «Сколько стоит одна тетрадь?», «Сколько стоят 5 тетрадей?» and «Сколько сдачи?», and sets aside 1 or 2 decoy cards. The plan is logged as `planChoice` with one of `correct`, `extra_step`, `missing_step`, `wrong_order` or `used_distractor`. A task never has both a model choice and a plan, and when a task has both a plan and step-by-step input, the plan's cards label the steps. The question is what must now be true in the engine, the item builder, the log and the report for the plan to work, and which approved records it changes.

The addendum assumes that ordering cards shows the analytic method, reasoning "from the question to the data". The sources below show that the analytic analysis ends in a plan written forwards, from the first thing to find to the question. So a correct forward order shows that she has a plan. It doesn't show which way she reasoned to get it, and a child reasoning forwards from the data reaches the same order. The addendum also assumes the plan measures something the model choice and step input don't already measure. A short note such as "3 · 12 + 2 · 15" encodes the whole plan in symbols, and matched steps reveal the path she took. The plan adds two things the others lack: the cards name quantities without naming operations, so it separates "knows what to find" from "knows which operation", and a random arrangement of cards is right far less often than a random pick from four models.

## Method

On 2026-09-28 I read section 6 of the owner's addendum, its general rules, its list of new events and its acceptance test 7. I also read sections 1 and 4, where they touch word problems.

In the repository at revision 47c0a7b I searched the record with `paw find` for "modelChoice", "modelling", "model choice", "scheme", "step input", "solution graph", "word problem", "compound", "order answer", "matrix", "share" and "plan". I read RES-0700 whole and the relevant sections of RES-0800, RES-3500, RES-3900, RES-0500, RES-0200 and RES-1200. I read ADR-0040, ADR-0070 and ADR-0180 whole, and the parts of ADR-0020 and ADR-0160 that name the attempt event and the language files. I read the fifteen approved requirements these records trace to on the task window's verdict words, resuming, step input, model choice, order answers, surplus data, the report's matrix, the Guardian's ladder, holding steps and the Guardian's model choice. A research record cites no requirement, so the findings below name each by the research or decision it comes from and quote its words.

On the web on the same day I read a Russian methods text on the search for a solution plan (metodmat.narod.ru, §3), a page of M. V. Ovchinnikova's 2001 methods manual on ways of analysing a problem, pages 55 and 56 of Mayer's 1998 paper on problem solving, the full text of Jitendra, Harwell, Dupuis and Karl's randomized trial of schema-based instruction, and the ERIC abstract of Peltier and Vannest's 2017 meta-analysis. I couldn't open the 2022 meta-analysis by Myers and others (the publisher returned HTTP 403), so it supports nothing here. The methods text names no author, only a reference numbered (72). I found no study that uses ordering question cards to assess planning. Every finding on how the plan measures her is therefore inference from the instruction studies and from the approved engine, and I mark it so.

## Findings

### The addendum sets the plan's form, scoring, share and exclusions

Section 6 of the addendum shows 3 to 5 question cards and 1 or 2 decoy cards in some T2 to T4 problems before she solves them. A decoy asks for something the text already states, such as «Сколько всего было денег у Коли?», or asks about the surplus datum. She lays the needed cards in order and leaves the decoys aside, which the addendum calls `AnswerSpec.order` with a partial choice. Then she solves the problem as usual, by final answer or by steps. The plan is scored apart, as `planChoice` beside `modelChoice`, with the five labels above. The report gets a matrix «схема × план × ответ» (model by plan by answer). The share is about 25 % of compound problems, and the rest get a model choice or plain solving as now. A task holds at most one modelling phase. When a task also takes step input, the plan comes first and its cards label the steps «1) … 2) …». Acceptance test 7 reads: the correct set is unambiguous, and no task has both a model and a plan. The addendum's general rules add that a new form writes its observations to its own stream and stays out of the unassisted estimate until an offline refit shows it improves prediction. Its build order puts item 6 among the items built with no new language-model role, and its event list adds `plan_submitted` and `AttemptSubmitted.planChoice?`.

### The Soviet analysis runs from the question to the data and ends in a plan written forwards

The methods text on metodmat.narod.ru defines the analysis of a problem as finding the dependencies between quantities, splitting the problem into simpler ones and fixing the order in which to solve them, "составление плана решения" (drawing up the solution plan). It says the analysis of a compound problem "заканчивается составлением плана решения" (ends by drawing up the solution plan). In the analytic way the question "мысленно расчленяется на другие вопросы" (is split in the mind into other questions) until the reasoning reaches the given data. Its worked example is two trains meeting at 50 and 60 km/h after 4 hours. After the backward reasoning, the plan is asked forwards: «Что мы найдём первым?» (What do we find first?), then the distance of each train, then their sum. So the plan she lays out is in the order of solving, and the question card comes last.

### The same text says reasoning from the data can pick a step the problem doesn't need

The methods text calls reasoning from the data to the question less effective, "т.к. он направлен на выбор действия, который может оказаться и ненужный" (because it aims at choosing an operation that may turn out unnecessary). Its example is subtracting 60 - 50 = 10 km/h, which the train problem doesn't need. It says developmental teaching prefers the analytic way, because the pupil sees the whole chain of reasoning. A decoy card that asks for such a quantity is the game's form of this unneeded step.

### In practice teachers mix both ways, so the plan is the product the method leaves to observe

Ovchinnikova's manual (2001, page 55) names two ways of analysing a problem, analytic and synthetic, and says practice more often uses the analytic-synthetic way. It adds that reasoning from the data can't be purely synthetic, because the data first has to be picked out of the text by analysis. So the game can't tell from a finished plan which way she reasoned; only the plan is observable.

### Mayer separates representing a problem, devising a plan and executing it

Mayer (1998, Instructional Science 26, pages 55 and 56) says that solving a story problem "requires representing the problem, devising a solution plan, and executing the plan". His example pupil knows the four operations and every word of the problem, yet computes a wrong answer because he misunderstood the problem. This three-part split matches the game's three observations: the model choice for the representation, the plan, and the answer for the execution.

### Schema-based instruction raises solving scores, and it teaches problem structure before calculation

Peltier and Vannest's 2017 meta-analysis of 21 studies with 3,408 elementary pupils reports an overall Hedges' g of 1.57 for immediate problem solving and 1.09 for transfer. Jitendra, Harwell, Dupuis and Karl's randomized trial with 806 seventh-grade pupils with problem-solving difficulties found pupils in schema-based classrooms about a third of a standard deviation higher at posttest and about a quarter nine weeks later. Their instruction had pupils identify the problem type, represent it in a diagram, estimate, select a strategy and check the solution. Both studies measure instruction, not a test item. By my inference, a plan phase before solving acts as a structure prompt, so her answers on plan tasks might be more often right than on plain tasks of the same template. That would bias the unassisted estimate and the holding-steps value upwards if the two kinds of task are counted as one.

### The approved record already schedules model choice for one word problem in four and logs it with the attempt

RES-0700 conclusion 18 has a problem that starts with a model choice log it as `modelChoice`, apart from the answer, and the approved requirements from RES-0700 and RES-0800 carry this. ADR-0040 builds four short notes or bar models, one from the valid graph and three from the structure traps, and sets "One word problem in four opens with a model choice (chosen, since RES-0700 gives no share)". It records `modelChoice` in the attempt payload, and it alternates step input and final-answer input strictly among T2 to T4 problems to keep the approved band of 40 % to 60 % step input over any 30 days.

### The approved rule that a Guardian problem opens with a model leaves no word problem free for a plan

The approved screens requirement drawn from RES-3500 conclusion 6 says: "When a Guardian sets a word problem, the problem MUST open with a choice of one short model from four before the step-by-step input." RES-3900 conclusion 3 and ADR-0070 send every word problem into play through the Guardians. Read together, every word problem opens with a model choice, and the addendum's rule of one modelling phase per task leaves the plan no task at all. That rule also disagrees with the approved record in two ways the addendum didn't cause: every Guardian problem gets a model where ADR-0040 gives one in four, and every Guardian problem gets step input where ADR-0040 keeps step input to 40 % to 60 %. The addendum makes the conflict impossible to leave open, because the plan's share has to come from somewhere.

### A problem with two valid graphs has two right card sets, so test 7 fails unless cards come from one graph

The approved step-input requirement drawn from RES-0700 has the engine match steps against every valid solution path, "so both 3 · 5 + 3 · 7 and 3 · (5 + 7) count", and ADR-0040 has each template store every valid graph. The two paths need different questions: "How much do the 3 cost? How much do the 7 cost? How much in all?" against "How many are there in all? How much do they cost?". The methods text's own train example has the same two paths, (50 + 60) · 4 and 50 · 4 + 60 · 4. If the cards mix both paths, two plans are right and acceptance test 7 fails. If the cards come from one graph and a decoy happens to be a step of another valid graph, a right plan by the other path gets scored `used_distractor`. ADR-0040's generator already rejects parameters where a trap graph's step value equals a valid graph's step value. It has no rule yet about questions, only values.

### A fork admits two right orders, so `wrong_order` has to follow the graph's dependencies

The catalogue's fork structure, "(a∘b) and (c∘d) followed by a comparison" (RES-0700, ADR-0040), has two first steps that don't depend on each other. Either order is right. A check that compares her sequence with one stored sequence would score the other right order as `wrong_order`. So an order is wrong only where a card comes before a card whose answer it needs.

### "3 to 5 cards" works for T2 only if the count includes the decoys

RES-0800 sets T2 at two steps, T3 at three and T4 at four, and ADR-0070 caps the Guardian's problems at 4 steps. One card per step, with the last card the problem's question, gives 2 to 4 needed cards. Adding 1 or 2 decoys gives 3 to 6 cards. Read as needed cards alone, "3 to 5" excludes every T2 problem and asks for a fifth step that no problem has. Read as all cards shown, with 1 decoy for T2 and T4 and 1 or 2 for T3, it fits every tier.

### `extra_step` and `used_distractor` coincide when every card outside the plan is a decoy, and the five labels aren't exclusive

If the cards come from one valid graph plus decoys, every card she adds beyond the plan is a decoy, so `extra_step` and `used_distractor` name the same event. The addendum's two kinds of decoy separate them: a card asking for a quantity the text states adds a harmless step, and a card asking for a quantity only a structure trap or the surplus datum computes shows a wrong structure. The labels also overlap: one plan can miss a step, use a decoy and put the rest out of order. A single label then needs a precedence, and the raw card sequence is what lets a later rule relabel old plans.

### The approved order answer accepts only the exact permutation

The approved requirement drawn from RES-0700's acceptance table says: "The engine MUST accept an order answer only when it is exactly the correct permutation." ADR-0040's acceptance table has the same row, and RES-1200 defines the kind as `{ kind: "order"; count: number }`, a permutation of every element. A plan leaves cards out, admits more than one right order in a fork, and grades into five labels. If the plan reuses `AnswerSpec.order`, as the addendum words it, the order kind needs a partial-selection variant and that requirement needs an exception. A plan phase with its own spec, as the model choice has, leaves it as it is.

### ADR-0180's matrix has no place for a plan, and the addendum's three-way matrix can't be a cross of one task

ADR-0180 draws a matrix of problem type by number of steps and counts "a wrong model choice" as a modelling error and "a wrong answer after a right model" as a calculation error, following RES-0800. It says nothing about a plan. The addendum's matrix «схема × план × ответ» crosses three observations, but no task holds both a model and a plan, so no task has all three. The matrix can only be two crosses that share the answer: model by answer on model tasks, and plan by answer on plan tasks.

### The Director's shares and the holding-steps value read answers, and the plan changes neither

ADR-0070 computes the success share from graded first attempts and fills the Guardian's step ladder from outcomes. ADR-0180 counts every unassisted first attempt on a k-step problem towards the holding-steps value. The Director doesn't choose the input form: ADR-0040's item builder picks the model choice and the step input. The addendum says the problem is solved "как обычно" (as usual) after the plan, and its general rule keeps a new form's observations out of the unassisted estimate. So the plan's label feeds none of these, and the answer after a plan still counts, which is where the structure-prompt effect above could bias them.

### The task window shows no verdict, so the plan's result waits for the answer, and a wrong plan labels her steps

The approved task-window requirement forbids «верно», «неверно», «ошибка», a tick or a cross in the task window, and RES-3500 conclusion 3 forbids a verdict word on any player screen. So the plan's result can't show before she answers. When the task also takes step input, her own cards become the step labels. By my inference, if the rows are fixed to her cards, a plan that misses a step leaves her no row for it, and the answer then fails for a planning reason the report would count as calculation.

### The first hint rung for a word problem gives the first card away

Section 1 of the addendum sets rung 1 for a word problem as "что спрашивают и что нужно узнать сначала" (what is asked and what to find first). That is the plan's first card. RES-0500 conclusion 8 makes an attempt assisted once a rung is bought before answering. A rung bought during the plan phase therefore helps the plan as much as the answer.

### The plan needs its own event to survive a break, which the model choice doesn't have

The approved resume requirements drawn from RES-0200 restore "the same ... task and its representation, attempt step" on resume and make every item of the resume point recoverable from the log. ADR-0040 records `modelChoice` only in the attempt payload, which is written when she submits the answer. The addendum adds `plan_submitted` as its own event. With that event, a break between the plan and the answer restores her plan and her place in the solving phase, where the attempt payload alone would lose the plan.

### Card texts are player strings, and the addendum builds the plan with no model

ADR-0160 keeps every player-facing string in a per-language file under `content/` and none in code, and the repository's CLAUDE.md asks for this so English and Dutch can follow. The addendum builds item 6 with no new language-model role. So each card's text is a template string with placeholders, keyed per graph node, and code substitutes the numbers, as ADR-0040 does for hints.

### Four ways to realise the plan, each better at something

| Option | What it is genuinely better at | The case against it |
| --- | --- | --- |
| Do nothing: keep the model choice as the only modelling phase | No new phase, no new scoring and no change to the Guardian's model choice; the model choice already separates modelling from calculation (RES-0800, ADR-0180) | A model is a choice from four, so a guess is right one time in four, and a short note names the operations along with the plan, so "doesn't know what to find" and "knows what to find but not how" look alike. The owner has asked for the plan, which rules this out unless the owner withdraws it |
| Forward plan as the addendum words it: all cards loose, she lays them in order of solving | Matches the Soviet plan exactly and the step labels «1) … 2) …» that follow; a random arrangement of T2's 3 cards is right about 1 time in 15 by my count, where a model is right 1 in 4 | Shows the plan and not the analytic reasoning behind it, since forward reasoning from the data reaches the same order |
| Backward plan: the question card sits fixed in the last slot and she fills the slots from the question towards the data | Enacts the analytic method in the interface, one question at a time, as the methods text's dialogue does, and removes one way to fail that tells nothing (misplacing the question) | Reorders the task away from the solving order she then follows, adds an interface she has to learn, and, like the other options, is untested on children as a measurement |
| Plan folded into step input: she picks a card as the label of each step row while she enters it | One phase fewer and less time per problem | Only works on step-input problems, about half the compound ones (ADR-0040); a label chosen with its value can't be scored before the calculation, so it no longer separates plan from calculation |

The owner's instruction settles that a plan phase exists, and the forward plan is chosen over the backward plan, because it is what the addendum describes and what the step labels need. The case against it is the backward plan's: a forward order proves a plan and doesn't prove analytic reasoning, and the addendum's heading names the analytic reasoning. Since no finding shows the game can observe that reasoning from any plan, forward or backward, the backward plan's interface buys nothing the log can measure.

## Conclusions

1. A compound word problem (T2 to T4) may open with a plan phase, and a T1 problem never does, because one step leaves nothing to order.
2. A task must open with at most one modelling phase, a model choice or a plan, and the approved record must say so: RES-3500 conclusion 6 and the approved screens requirement drawn from it must be amended so a Guardian word problem opens with a model choice, a plan or neither, and ADR-0040's "one word problem in four" must name how the item builder keeps the two phases apart.
3. The plan's share must be about 25 % of compound problems, measured over a window as ADR-0040 measures step input, and it must be independent of the choice between step input and final-answer input. The model choice must keep ADR-0040's one word problem in four, drawn from the problems without a plan, so compound problems split about 25 % plan, 25 % model and 50 % neither.
4. The plan must run forwards: she lays the needed cards in the order of solving, with the problem's question card last.
5. A plan must show 3 to 5 cards counting the decoys: 1 decoy for T2 and T4, and 1 or 2 for T3, so every tier from T2 to T4 can carry a plan.
6. The engine must build a plan's cards from exactly one valid graph of the template, one card per step with the problem's question as the last, so the right set of cards is unique among the cards shown.
7. No decoy card may ask for a quantity that is a step of any valid graph of the template, so a right plan by another path is never scored as a decoy.
8. Each decoy must be one of two kinds, a quantity the text already states or a quantity only a structure trap or the surplus datum computes, and the kind must be stored with the card: laying a stated-quantity decoy is scored `extra_step`, and laying a trap or surplus decoy is scored `used_distractor`.
9. The engine must judge order by the graph's dependencies: a plan is in the wrong order only where a card comes before a card whose answer it needs, so both orders of a fork's independent steps are right.
10. The attempt must log `planChoice` as one of `correct`, `extra_step`, `missing_step`, `wrong_order` and `used_distractor`, derived by one fixed precedence when several apply, `used_distractor` over `missing_step` over `extra_step` over `wrong_order`, and must log the full card sequence she laid, so the label can be re-derived from the log.
11. The plan must be logged at submission as `plan_submitted`, so a break between the plan and the answer restores her plan and her place in the solving phase.
12. The plan must be a phase with its own spec, graded by the five labels, and every other order answer must still be accepted only as the exact permutation; if the design reuses `AnswerSpec.order` for the plan, the approved order-answer requirement from RES-0700 and ADR-0040's order row must be amended to except it.
13. `planChoice` must feed no answer credit, no room or floor outcome, no success share, no holding-steps value and no unassisted estimate, and the answer after a plan must count as it does after a model choice.
14. Every attempt on a word problem must log which modelling phase it opened with, none, model or plan, so an offline refit can test whether answers after a plan differ from answers after no phase.
15. The task window must show no result for the plan before the answer, and the knot scheme after the answer may show her plan beside the engine's.
16. When a task has both a plan and step input, her cards must label the step rows, and she must be able to add or remove rows, so a planning error doesn't force a calculation error.
17. A hint rung bought during the plan phase must mark both the plan and the answer as assisted.
18. Every card text must be a template string with placeholders in the per-language content files, keyed by graph node, with numbers substituted by code and no language model involved.
19. ADR-0180 must be amended: its word-problem matrix must count planning errors apart from modelling and calculation errors, show model by answer and plan by answer as two crosses sharing the answer axis, and count a wrong answer after a right plan as a calculation error.

### Decided on 2026-09-28

The plan runs forwards, in the order of solving with the question card last, and not backwards from a fixed question card. The addendum describes the forward plan and the step labels «1) … 2) …» need it, while no plan of either kind lets the game observe which way she reasoned. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

"3 to 5 cards" counts the decoys: 1 decoy for T2 and T4, and 1 or 2 for T3. Read as needed cards alone it would exclude every two-step T2 problem and ask for a fifth step no problem has. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

`extra_step` means she laid a stated-quantity decoy and `used_distractor` means she laid a trap or surplus decoy, as conclusion 8 reads them, and when one plan has several faults the label follows the precedence `used_distractor`, `missing_step`, `extra_step`, `wrong_order`. A wrong structure says the most about her model of the problem, a missing step the next most, a harmless extra step less, and order alone least, and the logged card sequence lets a later rule relabel old plans. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The model choice stays at one word problem in four, as ADR-0040 set it, drawn from the problems without a plan, so compound problems split about 25 % plan, 25 % model and 50 % neither. This keeps ADR-0040's share unchanged and leaves the step-input band as it is, so it changes the fewest approved records. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

## Sources

- The owner's addendum 1 to the specification, 2026-09-28 - section 6 «Выкройка», acceptance test 7, the general rules, section 1 rung 1 for word problems, the event list and the build order.
- `project/research/RES-0700-answer-input-and-checking.md` at 47c0a7b, read 2026-09-28 - model choice logged as `modelChoice`, step input, the order row, the word problem structures.
- `project/research/RES-0800-skill-graph.md` at 47c0a7b, read 2026-09-28 - T1 to T4 step counts, modelling apart from calculation.
- `project/research/RES-3500-design-screens-and-prototype.md` at 47c0a7b, read 2026-09-28 - screen 10 and conclusions 3 and 6.
- `project/research/RES-3900-reconciling-approved-research.md` at 47c0a7b, read 2026-09-28 - conclusion 3, word problems through the Guardians.
- `project/research/RES-0500-guiding-threads.md` at 47c0a7b, read 2026-09-28 - conclusion 8, a rung makes the attempt assisted.
- `project/research/RES-1200-task-templates.md` at 47c0a7b, read 2026-09-28 - the `order` answer kind.
- `project/adrs/ADR-0040-tasks-from-templates-seeds-exact-arithmetic.md` at 47c0a7b, read 2026-09-28 - model choice share, `modelChoice` in the attempt payload, step-input alternation, the order row, the distinctness rule.
- `project/adrs/ADR-0070-director-selection-and-measurement.md` at 47c0a7b, read 2026-09-28 - word problems through the Guardian, the success share, the Guardian's ladder.
- `project/adrs/ADR-0180-parent-room-report-limits-lessons.md` at 47c0a7b, read 2026-09-28 - the word-problem matrix and `stepsHeld`.
- `project/adrs/ADR-0160-strings-per-language-files.md` at 47c0a7b, read 2026-09-28 - player strings in per-language files.
- `project/research/RES-0200-leave-and-resume.md` at 47c0a7b, read 2026-09-28 - resuming at the exact point from the log.
- [§ 3. Поиск плана решения задачи](http://metodmat.narod.ru/Metod/C/G7/3.htm), read 2026-09-28 - the analytic and synthetic ways, the plan written forwards, the unneeded step 60 - 50, the preference for the analytic way.
- [Овчинникова М. В. Методика работы над текстовыми задачами в начальных классах, с. 55](https://pedlib.ru/Books/2/0384/2_0384-55.shtml), read 2026-09-28 - practice mixes analytic and synthetic analysis.
- [Mayer, R. E. (1998). Cognitive, metacognitive, and motivational aspects of problem solving. Instructional Science 26, 49-63](http://rhartshorne.com/fall-2012/eme6507-rh/cdisturco/eme6507-eportfolio/documents/Mayer%201998.pdf), read 2026-09-28 - representing, planning and executing as separate parts of solving a story problem.
- [Jitendra, Harwell, Dupuis and Karl. A randomized trial of the effects of schema-based instruction on proportional problem solving, Journal of Learning Disabilities, author's manuscript](https://files.eric.ed.gov/fulltext/ED572879.pdf), read 2026-09-28 - the components of schema-based instruction and its effects.
- [Peltier and Vannest (2017). A meta-analysis of schema instruction on the problem-solving performance of elementary school students, Review of Educational Research 87(5), ERIC EJ1153429](https://eric.ed.gov/?id=EJ1153429), read 2026-09-28 - the abstract's effect sizes, 21 studies and 3,408 pupils.
