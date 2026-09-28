---
id: ADR-0270
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-5600, REQ-5602, REQ-5604, REQ-5606, REQ-5608, REQ-5610, REQ-5612, REQ-5614, REQ-5616, REQ-5618, REQ-5620, REQ-5622, REQ-5624, REQ-5626, REQ-5628, REQ-5630, REQ-5632, REQ-5634, REQ-5636, REQ-5638, REQ-5640, REQ-5642, REQ-5644, REQ-5646, REQ-5648, REQ-5650, REQ-5652, REQ-5654, REQ-5656, REQ-5658, REQ-5660, REQ-5662, REQ-5664, REQ-5666, REQ-5668, REQ-5670, REQ-5672]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0270. A compound word problem opens with a plan, a model choice or neither on a fixed eight-slot cycle, and the plan's cards come from one valid graph and are graded by five labels that feed no measure

## Decision

The item builder gives every first-shown word problem one opening phase, a model choice, a plan or none, from a fixed cycle read off the event log. The plan is a phase of its own with its own spec, `PlanSpec`: code builds its cards from one valid computation graph of the template, the server grades it into one of five labels, and the label reaches the log and the report but no credit, outcome or estimate. The reader is whoever builds the item builder, the checker, the task window and the report. This record builds on ADR-0210, which owns the game day, the separate streams of new forms, what leaves the Mac, MVP scope and the stage order, and doesn't restate them.

### The opening phase and the input form come from one counter

The item builder counts first-shown T2 to T4 word problems in a projection, `word_problem_cycle`, rebuilt from the `openingPhase` field of `item_shown`. A second attempt of ADR-0080 and a riddle the player composes don't advance the counter, because a twin exists only after `alt` and would tie the shares to her error rate, and REQ-5250 counts a riddle in neither input form. For the compound problem at position `n`, counting from 0:

- the phase is slot `n mod 8` of the cycle plan, none, model, none, none, plan, none, model;
- the input is step-by-step when `n` is even and final-answer when `n` is odd.

The plans fall at positions 0 and 5 of every eight, one even and one odd, so plan problems alternate between the two input forms (REQ-5608). The model choices fall at 2 and 7, which does the same for them. In any run of consecutive compound problems the plans and the model choices each stay within one problem of a quarter, which meets the 20 % to 30 % bands with their one-problem tolerance (REQ-5606, REQ-5610), and no problem gets both (REQ-5602). The input rule is ADR-0040's strict alternation written as a counter over first-shown problems, so the step-input share stays in REQ-5250's band, which counts no riddle. I chose a fixed cycle because the bands must hold in every 30-day window, and the reason a seeded random draw lost is in the Alternatives table.

A T1 problem never opens with a plan (REQ-5600). A second counter over first-shown T1 problems gives a model choice to every fourth one, at `t mod 4 = 0`, which holds REQ-5670's band exactly.

Every word problem follows the same cycle, whoever sets it, the Guardian or a room, and whether or not a number is missing (REQ-5604). An unanswerable problem gets the plan built from its complete problem, as REQ-5408 asks, so its phases don't give it away. When the template can't build a plan for any candidate the generator draws, the problem opens with no phase and the plan moves to the next compound problem of the same parity whose slot is none, so no model choice is displaced and plan problems keep their split between the input forms. A moved plan that fails again is dropped, and its slot opens with no phase. A moved plan can land beside a cycle plan, so a run of 2 to 7 compound problems can hold one plan more than the bare cycle gives; I claim the bands for runs of 8 or more, as ADR-0040 names the window sizes its alternation can't meet. That state is `plan_unavailable` below.

### The cards come from one graph

A word problem template declares a quantity id for every node of every valid graph and every structure-trap graph, and the quantity ids of the givens its text states. One quantity keeps one id across graphs, so the total in 3 · 5 + 3 · 7 and in 3 · (5 + 7) is one id. The plan builder in `src/templates/plan.ts` takes the graph that `solution(p)` and `hints(p)` already read, one card per step, with the problem's question as the last card (REQ-5612, REQ-5616). I chose that graph because the knot's scheme then shows the same plan as the short solution beside it.

The decoys come from the template's other quantities, and each one carries a kind: `stated` for a given the text states, `trap` for a quantity only a structure-trap graph computes, `surplus` for a quantity only the surplus datum of a T4 problem computes (REQ-5622). A T2 or T4 problem shows 1 decoy. A T3 problem shows 1 or 2, picked by its seeded stream with equal odds when the template offers two eligible decoys, and 1 otherwise (REQ-5614). A plan therefore shows 3 to 5 cards.

The generator's distinctness test, ADR-0040's step 6, gains two plan rules and rejects the candidate when either fails:

1. No decoy's quantity id is a computed node, a step, of any valid graph (REQ-5618). A given the computation uses is a leaf, not a step, so it stays eligible as a `stated` decoy.
2. No two cards render to the same text.

With both rules the needed cards are the only set that makes a correct plan (REQ-5620), because every decoy lies outside every valid graph and no two cards read alike. The two orders of a fork use one set, so they don't break it.

Card wordings live in a new per-language file, `content/plans.ru.json`, keyed `<templateId>.<quantityId>`. It holds one wording per step of each valid graph and per decoy quantity the template can offer, with placeholders for numbers, counted nouns and characters (REQ-5662). The same filler that fills the problem's frame (ADR-0130) fills the card, so a card names the item and the character the problem text names. A `stated` decoy's wording names its quantity without the given's number, because a card that printed a number from the text would mark itself as a decoy. The file follows ADR-0160's rule for content files and passes `textGate`. The template author writes the wordings, as that author writes the hint rungs (ADR-0080), and no model call at build or play time writes or picks a card (REQ-5660). I read REQ-5660's "language model" as a model call from the game or its tools, because the building agent writes every template string and a reading that barred it would bar all template text. The existing `no-restricted-imports` rule already forbids `src/templates` to import the model gateway (ADR-0040), and it covers `plan.ts`.

### The server grades the plan by five labels

`gradePlan(plan, laid)` is a pure function on the server. It computes every fault that applies:

- `used_distractor`: she laid a `trap` or `surplus` decoy (REQ-5626);
- `missing_step`: she left out a needed card (REQ-5628);
- `extra_step`: she laid a `stated` decoy (REQ-5624);
- `wrong_order`: a laid needed card stands before a laid needed card whose quantity it needs, directly or through other steps, with decoys ignored (REQ-5630).

The label is the first fault in that order, or `correct` when none applies. The order puts the fault that says most about her model of the problem first: a wrong structure, then a missing step, then a harmless extra step, then order alone, as RES-4060 decided (REQ-5632, REQ-5634). The question card needs every step, so a question card laid early is `wrong_order`, and both orders of a fork's independent steps are right. The plan is never an `order` answer: `PlanSpec` is a separate spec, graded only by `gradePlan`, so ADR-0040's acceptance row for `order` and REQ-0772 stay as they are (REQ-5672). I chose a separate spec over the addendum's wording `AnswerSpec.order` with a partial choice, because the checker's `order` kind returns credit 1, 0.5 or 0 and the plan returns a label and no credit.

### The flow, the log and the resume

A problem with a plan runs ADR-0080's `open` state in two phases, `plan` then `solve`. In `plan` the task window shows the problem text, the cards in an order the task's seeded stream shuffles, and a row where she lays them. The action row holds «Не знаю», the thread button and «Готово» as ever, and «Готово» stays inactive while the row is empty, because an empty plan is ended by «Не знаю» or «Нельзя узнать», which record why it is empty, and never by «Готово». She can move and take back any card before she presses «Готово». The client's `PlanView` carries each card's opaque id and text and nothing else. The needed set, the kinds, the dependencies and the engine's order stay on the server until the answer, under a `.strict()` zod schema as ADR-0040's views are, because a leaked kind would give the plan away before she lays it.

«Готово» in `plan` sends the laid sequence. The server writes `plan_submitted`, and the window moves to `solve` with no word, mark or colour about the plan (REQ-5650). This record owns `plan_submitted` and its payload:

| Field | Meaning |
| --- | --- |
| `itemId` | the task |
| `laid` | the quantity ids she laid, in her order (REQ-5638, REQ-5640) |
| `shown` | the quantity ids shown, in display order, each with its kind or `needed` |
| `graphId` | the valid graph the needed cards come from |
| `planChoice` | the label |
| `faults` | every fault that applied, so the report can split them later (REQ-5664) |
| `assisted`, `hintLevel` | whether she bought a rung during `plan`, and the deepest one (REQ-5658) |
| `endedBy` | `ready`, `dont_know` or `cant_know` |

`attempt_submitted` gains `openingPhase` (`none`, `model` or `plan`) on every word problem (REQ-5648), and `planChoice` when the phase was `plan` (REQ-5636). `item_shown` gains `openingPhase` too, because the cycle projection and the resume read it before any attempt exists.

A resume after `plan_submitted` restores `solve` with her plan in place, because the resume point's attempt step reads the log (REQ-5642, REQ-0204). A partly laid plan isn't sent to the server, so a resume in `plan` shows the cards again in the same seeded order with the row empty. I chose this over an event per card moved, because laying 3 to 5 cards takes seconds and REQ-0208 covers the drafts the resume point holds, which a partly laid plan isn't under this choice. A resent `plan_submitted` with the same `clientSeq` returns the same state (ADR-0030).

A hint rung is bought from the one ladder of the attempt, in either phase. A rung bought in `plan` marks `plan_submitted` assisted and, by ADR-0080's rule, the attempt too (REQ-5658), and it stays visible in `solve` at no further cost.

«Не знаю» or «Нельзя узнать» pressed in `plan` ends the whole first attempt, as the same button does in the model choice. The server writes `plan_submitted` with the cards she had laid, possibly none, `endedBy` naming the button, and the label `gradePlan` gives them. I chose this because a button that skipped only the plan would let her leave the phase at no cost. What «Нельзя узнать» does to the attempt belongs to ADR-0250; this record decides only that the plan is logged.

### Solving after the plan

When the problem takes step input, the step rows carry her laid cards as labels, in her order, decoys included (REQ-5654). She can add a row, which carries only its number «N)», and remove any row (REQ-5656), up to 6 rows: T4 has 4 steps and a plan shows at most 5 cards, so 6 leaves room for one step more than any plan. The checker reads only the values, as ADR-0040 and REQ-0848 set, so a label never changes credit.

The answer after a plan counts towards credit, the room or floor outcome, the success share, the holding-steps value and the estimate exactly as the answer after no phase does (REQ-5646). The label feeds none of them (REQ-5644). The plan's observations, `plan_submitted` and the `planChoice` on the attempt, form the stream `plan`, which stays out of the "on her own" estimate under ADR-0210's rule for new forms. The `openingPhase` on every attempt lets an offline refit test whether answers after a plan are more often right than answers after no phase.

### After the answer

ADR-0080's `review` shows the knot's scheme, and on a plan problem the scheme shows two columns: her cards in her order and the engine's cards in the graph's order (REQ-5652). Neither column carries a tick, a cross or a verdict word (REQ-0110); a decoy she laid is drawn in the muted card style ADR-0150 supplies, so the difference shows without a verdict.

### The report

ADR-0180's word-problem matrix becomes three counts and two crosses sharing the answer axis (REQ-5664, REQ-5666). Model by answer covers problems that opened with a model choice, and plan by answer covers problems that opened with a plan. A planning error is a plan labelled anything but `correct`, counted apart from modelling and calculation errors. A wrong answer after a `correct` plan counts as a calculation error (REQ-5668). A wrong answer after a faulty plan counts in its cell of the plan cross and in no error count, because RES-4060 decided only the case after a `correct` plan. The plan cross is split by the problem's number of steps, as the matrix already splits problem type by steps, so plans at one tier can't hide failures at another. The report reads unassisted first attempts, as ADR-0180's matrix does.

### What works once this is accepted, and what doesn't yet

Once this is accepted and built, a compound word problem can open with a plan, the plan is built, shown, graded, logged, resumed, labelled into step rows and shown back in the knot's scheme, and the report shows the two crosses. The plan is the second group of the addendum's build order (REQ-5090), after the hint ladder. It works before the hint ladder's new rung texts, the «Нельзя узнать» button and the stream admission of ADR-0210 exist: without the ladder a rung is ADR-0080's rung, without the button the plan phase lacks one control, and the stream waits for a refit that no MVP stage runs. What doesn't work yet: the report can't split the four faults, only count them, and no refit has tested whether the plan predicts anything. Removing this increment turns every plan slot of the cycle into none, and the rest of play runs unchanged.

## Why

The plan exists because the owner asked for it in the owner's addendum 1 of 2026-09-28 and REQ-5076 puts solution plan cards in the MVP. RES-4060 records why it earns its place beside the model choice: the cards name quantities without naming operations, so they separate "knows what to find" from "knows which operation", and a random arrangement of three cards is right about 1 time in 15 where a random model is right 1 in 4.

The cycle exists because the approved rule opened every Guardian problem with a model and step input (RES-4060, "The approved rule that a Guardian problem opens with a model"). REQ-5604 replaces it with shared phases, and the phases need a rule that keeps three shares and one independence in a band over every 30 days. A counter does that by construction, and ADR-0040 already uses one for step input.

One graph per plan follows from RES-4060's finding that a problem with two valid graphs has two right card sets. The decoy rule follows from its finding that a decoy on another valid path would score a right plan as `used_distractor`. Grading by dependencies follows from its finding that a fork admits two right orders.

The label feeds no measure because no study RES-4060 found uses card ordering as a measurement, and the plan might act as a structure prompt that raises her answers on plan problems (RES-4060, citing Peltier and Vannest 2017 and Jitendra and others). `openingPhase` exists so a refit can measure that bias before anyone trusts the label.

The strongest objection is that the cards may be laid right by reading, not by planning. A card such as «Сколько стоят 5 тетрадей?» (How much do 5 notebooks cost?) repeats the problem's own words, the question card repeats its last sentence, and a card that says "one notebook" reads as coming before "5 notebooks". A child can reach `correct` by matching text to text, and then the label measures reading, costs her time on one compound problem in four, and a parent reads it as planning. I accept the objection's cost and keep the plan, for three reasons. The label moves nothing she or her estimate depends on (REQ-5644). The report shows it as a count the parent can weigh, not as a state. The log keeps every sequence, so a refit or a later rule can relabel or drop it. The fourth reversal condition watches for this case.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep the model choice as the only modelling phase | No new spec, event, screen or report cell, and ADR-0150's Guardian screen stays as it is | The owner asked for the plan and REQ-5076 puts it in the MVP, and the model choice can't tell "doesn't know what to find" from "doesn't know how" (RES-4060) |
| Reuse `AnswerSpec.order` with a partial-selection variant, as the addendum words it | One answer kind fewer, and the addendum's own words | The `order` checker returns credit and accepts only the exact permutation (REQ-0772); a plan leaves cards out, has two right orders in a fork and returns a label, so the variant would need its own grader anyway and an exception in an approved requirement |
| A seeded random draw per problem: plan with odds 1 in 4, then model with odds 1 in 3 of the rest | Simpler code, and she can't learn a pattern | Over 40 compound problems in 30 days a draw at 1 in 4 has a standard deviation of about 2.7 problems, so a noticeable share of windows falls outside 7 to 13 plans, and nothing makes plan problems split between the two input forms |
| The same eight slots shuffled within each block of eight by the seeded stream | Keeps each block's shares and removes the fixed pattern she might learn | A shuffle breaks the parity pairing, so plan problems in a block can both land on one input form and REQ-5608 then holds only across blocks; she would have to count compound problems across days to learn the fixed cycle, and knowing a plan is next changes nothing the plan measures |
| A plan only on step-input problems, its cards chosen as row labels while she solves | One phase fewer and less time per problem | REQ-5608 needs plan problems in both input forms, and a label chosen with its value can't be graded before the calculation (RES-4060) |
| A plan on Guardian problems only, where step counts are known | Fewer plan problems, all at her step ceiling | Rooms set word problems too, and REQ-5606 counts all compound problems; a Guardian comes on about one floor in three (ADR-0070), which gives too few plans to fill the band |

## What it costs

The player pays the plan's time on about one compound problem in four. I estimate 20 to 40 seconds for 3 to 5 cards, an assumption until stage 0.3 play times `item_shown` to `plan_submitted`. RES-1000's session budget has no line for it, and the second reversal condition watches it.

The template author pays a quantity id for every graph node, the stated quantities, and one wording per quantity in `content/plans.ru.json` for every word problem template. A template that can't offer an eligible decoy for its tier fails the build check below, and a template whose decoys collide often raises its generation fallback count (ADR-0040).

The parent pays one more count and one more cross to read in the report. The parent is never needed in real time: nothing in this record waits for the parent, notifies the parent or queues work for the parent, so two weeks without the parent lose nothing and leave no queue. The interruption budget for the parent is zero.

The item builder, the grader and the plan view run inside ADR-0040's generation budget and ADR-0030's answer route, whose numbers stand in the Baselines table of ADR-0190. I add no baseline: building a plan is one graph walk and a few candidate rejections on top of the task's own generation.

The security boundary protects the plan's measure: the needed set, the decoy kinds and the engine's order must not reach the client before the answer. The threats, most likely first:

1. A client or schema bug sends a card's kind or a `needed` flag in `PlanView`. The strict schema and the payload test below guard it.
2. The player reads packets in a desktop browser's developer tools. Only the server's refusal to send those fields defends it.
3. A card's display order leaks the plan, for example needed cards first. The seeded shuffle and a test over seeds guard it.

Ceilings, each on something that grows:

- A plan shows at most 5 cards, and step rows stop at 6.
- A plan problem writes one `plan_submitted`, and a resent one is idempotent, so the log grows by at most one event per plan problem.
- A `plan_unavailable` plan moves to the next same-parity slot that is none, and only there, so at most one moved plan is pending at a time. The verify report names the template once when its share of `plan_unavailable` passes 1 % over 30 days, and again only if the share rises; I chose 1 % to match ADR-0040's threshold for generation fallbacks, since both mean the template's ranges are too tight.

Failure states, each with its next step and one audience:

| State | When | Next step | Audience |
| --- | --- | --- | --- |
| `plan_unavailable` | no candidate among ADR-0040's 1,000 and the fallbacks yields a plan that passes the two plan rules | the problem opens with no phase, and the next compound problem takes the plan | developer, through the verify report's count |
| `plan_template_incomplete` | a template lacks a quantity id, a stated quantity, an eligible decoy for its tier or a card wording | the build fails and names the template and quantity | developer, through verify |
| `plan_rejected` | a submitted sequence names an unknown card or a card twice, or names no card with `endedBy: ready` | the server replies 400, writes nothing and keeps the phase open | developer, through the server log; the player sees the phase unchanged |
| `offline` | the client has no connection when she presses «Готово» | ADR-0030's queue holds the plan and its waiting scene shows | the player |

## What would reverse it

- If a 30-day simulation of the cycle, with twins, riddles and at most one forced `plan_unavailable` slot in every 8 compound problems mixed in, shows any run of 8 or more consecutive compound problems outside the bands of REQ-5606, REQ-5608, REQ-5610 or REQ-5670, the counter doesn't hold the shares, and the item builder's rule is reopened.
- If the median time from `item_shown` to `plan_submitted` in stage 0.3 play passes 60 seconds, the share or the card count is reopened with the owner. The 60 seconds is a default I chose: it is about the time ADR-0080 gives a twin, and RES-1000's session budget has no line for the plan, so a plan that costs more than a whole second attempt needs the owner to make room for it.
- If `correct` plans are followed by wrong answers no more often than faulty plans are, once each group holds at least 10 plans, the label doesn't separate planning from calculation, and the report's plan cross is reopened. I chose 10 per group because a wrong-answer share over fewer plans moves by 10 points or more on a single answer, and the comparison would decide on noise.
- If, at one step count, at least 20 plans are more than 90 % `correct`, she may be laying them by matching text, and the card wordings and the decoys of that tier are reopened. I chose 20 plans and 90 % because the brute-force count of RES-4060 makes a guessed `correct` rare, so a share that high over 20 plans means the cards themselves give the order away.
- If the owner reads REQ-5660 as barring the building agent from writing card wordings, the wordings need a person as author, and this record's authorship rule changes.

The premortem, written as though it had already happened: three months in, the plan cross showed nearly every plan `correct` and the parent stopped reading it. The cause was the `stated` decoys. Each asked for a given the text printed, so its wording held the given's number, «Сколько было 50 рублей?» (How much money was there, 50 roubles?), and she learned to leave aside any card with a number she could see in the text. `extra_step` never fired, and the trap decoys were rare on T2, where only one decoy shows. The fix was a card wording rule: a `stated` decoy names its quantity without its number, and the template test checks that no decoy's text holds a given's number. That rule is in the checks below. A second cause sat in the cycle: a Guardian ladder that rose to T4 on good days put most plans at 4 steps, where her plans were right, and the few T2 plans were where she failed. The report now splits the plan cross by step count, as the Decision sets.

## Consequences

- ADR-0040's word problem templates gain quantity ids, stated quantities and card wording keys; `src/templates/plan.ts` holds the builder and `gradePlan`; the distinctness test gains the two plan rules.
- `content/plans.ru.json` joins the content folder, and ADR-0160's key parity check, `textGate` and the Cyrillic grep read it like the other content files.
- ADR-0020's catalogue gains `plan_submitted`, owned here; `attempt_submitted` gains `openingPhase` and `planChoice`, and `item_shown` gains `openingPhase`. Each change adds a schema version and an upcaster that reads an older event as `openingPhase: "none"` or with no plan.
- ADR-0030's API gains a plan route, idempotent by `clientSeq`, and the resume point gains the phase and her laid plan.
- ADR-0150 gains a card board for `plan`, the editable step rows with their card labels, and the two-column scheme.
- ADR-0180's report gains the planning-error count and the plan cross.
- ADR-0190's simulation group gains the cycle's band check below.

## Amends

- ADR-0040: "One word problem in four opens with a model choice (chosen, since RES-0700 gives no share)." becomes "A first-shown T1 word problem opens with a model choice at every fourth position of its counter, and a first-shown T2 to T4 word problem takes its phase from ADR-0270's cycle plan, none, model, none, none, plan, none, model."
- ADR-0040: "Among T2 to T4 problems, the item builder alternates step-by-step input and final-answer input strictly, reading the last form from a log projection (REQ-0703)." becomes "The item builder gives the first-shown T2 to T4 problem at counter position n, counting from 0 and skipping second attempts and composed riddles, step input when n is even and final-answer input when n is odd."
- ADR-0040: "It stores every valid computation graph, such as 3 · 5 + 3 · 7 and 3 · (5 + 7), and the structure traps as graphs of their own." becomes "It stores every valid computation graph and the structure traps as graphs of their own, with one quantity id per node shared across graphs, the quantity ids of the givens its text states, and a card wording key per quantity."
- ADR-0080: "`open`: the task window shows the task and its controls." becomes "`open`: the task window shows the task and its controls, and on a problem that opens with a plan it runs the phase `plan` and then, after `plan_submitted`, the phase `solve`; a rung bought in either phase marks the attempt assisted."
- ADR-0150: "A Guardian's word problem opens a `ChoiceGrid` of the four short models that ADR-0040 supplies, and only then the step rows (REQ-3512)." becomes "A word problem opens with the `ChoiceGrid` of four short models, the plan's card board or neither, as ADR-0270's cycle sets, and then its step rows or answer field (REQ-5604)."
- ADR-0180: "Where a problem asks her to choose a model before solving, a wrong model choice counts as a modelling error. A wrong answer after a right model counts as a calculation error" becomes "The matrix shows model by answer on problems that opened with a model choice and plan by answer on problems that opened with a plan, sharing the answer axis; a wrong model choice counts as a modelling error, a plan labelled anything but `correct` as a planning error, and a wrong answer after a right model or a `correct` plan as a calculation error."
- ADR-0020: the event catalogue gains the row "`plan_submitted` | ADR-0270 | a plan was submitted, with the cards she laid in order, the cards shown, its graph, its label and faults, its help and the control that ended it".

## How I will know it was realised

1. A simulation of 30-day play with the ten profiles of ADR-0190, twins, riddles and at most one forced `plan_unavailable` slot in every 8 compound problems included, finds, in every run of 8 or more consecutive compound problems, the plan share, model share, plan step-input share and T1 model share inside its band with its tolerance, and no problem with both a model choice and a plan.
2. A property test over 10,000 seeds of every word problem template finds, in every plan: 3 to 5 cards; 1 decoy on T2 and T4 and 1 or 2 on T3; the needed cards equal to one valid graph's steps with the question last; no decoy that is a step of any valid graph; no two card texts alike; and no given's number in a `stated` decoy's text.
3. A brute-force test lays every ordered subset of every generated plan's cards for 1,000 seeds and finds exactly one card set graded `correct`, both orders of every fork graded `correct`, and each label matching an independent reference grader's fault list and the precedence.
4. A payload test serialises 1,000 `PlanView`s and finds no kind, `needed` flag, dependency or graph id; a test over seeds finds needed cards in every display position.
5. A log test submits a plan, stops, resumes on the other device and finds `solve` with the same laid cards, and a resent submission writes one event.
6. A Playwright test on the tablet viewport lays a plan, finds no mark or verdict word before the answer, finds the step rows labelled with her cards, adds and removes rows up to 6, and finds the two columns in the knot's scheme with no tick or cross.
7. A measurement test runs the same answers through a plan problem and a no-phase problem and finds equal credit, outcome, success share, holding-steps value and estimate for every label.
8. A report fixture with one plan of each label and a model problem of each result finds the planning-error count, the two crosses, the plan cross split by step count, and a wrong answer after a `correct` plan counted as a calculation error.
9. A mutation test removes one card wording and one quantity id in turn, and the build fails each time with `plan_template_incomplete`.

## What this does not settle

- What «Нельзя узнать» does to an attempt and how the report counts it: ADR-0250. Whether a plan ended by that button on an unanswerable problem belongs in the planning-error count is open too, because counting it there calls a right response a planning error, and REQ-5664 as written counts it. An empty plan ended by «Не знаю» is labelled `missing_step` and counted as a planning error; I weighed the two cases together and count that one, because not knowing what to find is what a planning error records.
- The rung texts of the hint ladder, rung 1 for a word problem included: ADR-0220.
- How and when a new form's stream enters the estimate, and the game day: ADR-0210.
- How a wrong answer after an `extra_step`, `missing_step`, `wrong_order` or `used_distractor` plan counts in the error counts: RES-4060 decided only the case after a `correct` plan, and this record counts it in no error count until a requirement says otherwise.
- The report's split of the four faults: the log keeps them, and REQ-5664 counts them together.
- The card board's look, the muted style and the row label for a row she adds: ADR-0150's screens, inside the rules above.
- REQ-5120 lists what the task window may hold and names no plan cards. I read the cards as the task's options, as the model choice's four models are; if the owner reads it otherwise, a requirement has to add them.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0370, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0390, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.
