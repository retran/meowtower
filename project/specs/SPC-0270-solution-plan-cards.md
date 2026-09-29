---
id: SPC-0270
artifact: spec
status: live
revised: 2026-09-29
checked-at:
states: [REQ-5600, REQ-5602, REQ-5604, REQ-6422, REQ-5608, REQ-5610, REQ-5612, REQ-5614, REQ-5616, REQ-5618, REQ-5620, REQ-5622, REQ-5624, REQ-5626, REQ-5628, REQ-5630, REQ-5632, REQ-5634, REQ-7508, REQ-5638, REQ-5640, REQ-5642, REQ-5644, REQ-5646, REQ-5648, REQ-5650, REQ-5652, REQ-5654, REQ-5656, REQ-5658, REQ-5660, REQ-5662, REQ-5664, REQ-5666, REQ-5668, REQ-5670, REQ-5672]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The opening phase of a word problem and its solution-plan cards

## Scope

This document covers how a word problem opens and what the plan does: the cycle that gives each first-shown word problem its opening phase and its input form, the plan's cards and how code builds them from one graph, `PlanSpec` and `gradePlan`, the `plan` and `solve` phases of the task window, the `plan_submitted` and `plan_draft` events, the resume after a plan, the step rows that carry her cards, the two columns of the knot's scheme, and the report's planning errors and plan cross. It is written at the component level: modules, the view, events, projections and the rules each applies. ADR-0270, as ADR-0360, ADR-0370 and ADR-0460 amend it, holds the reason for each rule here.

It leaves out what other documents state. SPC-0040 states the template contract, the generator and the model choice's four models, SPC-0080 the attempt flow and the hint ladder, SPC-0030 the play API, the queue and the resume point, SPC-0020 the event log and its catalogue, SPC-0180 the rest of the report, and SPC-0060 the rule that keeps a new form's stream out of the estimate. What «Нельзя узнать» (Can't know) does to an attempt belongs to ADR-0250, the input of a Dutch probe letter to ADR-0430, and the profile's model building bar and the plan check that lets it read labels to ADR-0390.

## Boundary

### Modules

| Module | What it holds |
| --- | --- |
| `src/templates/plan.ts` | the plan builder and `gradePlan` |
| `word_problem_cycle` | the `game` projection that counts first-shown T2 to T4 word problems, rebuilt from `item_shown.openingPhase` |
| `word_problem_cycle_t1` | the `game` projection that counts first-shown T1 problems, rebuilt from `item_shown` |
| `src/shared/api.ts` | `PlanView` and the requests and replies of the plan route and the draft route, each under a `.strict()` zod schema |
| `content/plans.ru.json` | the Russian card wordings, keyed `<templateId>.<quantityId>` |

### What a word problem template declares

A word problem template declares a quantity id for every node of every valid graph and every structure-trap graph, the quantity ids of the givens its text states, and a card wording key per quantity. One quantity keeps one id across graphs, so the total in 3 · 5 + 3 · 7 and in 3 · (5 + 7) is one id.

### The view

`PlanView` carries each card's opaque id and text, in display order, and nothing else. The needed set, the kinds, the dependencies, the graph and the engine's order stay on the server until the answer.

### The plan routes

`POST /api/item/:itemId/plan` takes the laid sequence of card ids, `endedBy` and `clientSeq`, logs `plan_submitted` and moves the attempt to `solve`. It is idempotent by `clientSeq`, as SPC-0030's routes are, and its reply carries no label and no fault.

`POST /api/item/:itemId/plan/draft` takes `{ laid, clientSeq }`, the card ids of a partly laid plan in her order, and logs `plan_draft`. It is idempotent by `clientSeq`.

### Events

`plan_submitted`, owned by this part:

| Field | What it holds |
| --- | --- |
| `itemId` | the task, which names the attempt the plan belongs to |
| `laid` | the quantity ids she laid, in her order |
| `shown` | the quantity ids shown, in display order, each with its kind or `needed` |
| `graphId` | the valid graph the needed cards come from |
| `planChoice` | the label, absent when «Нельзя узнать» ended the plan |
| `faults` | every fault that applied, empty when «Нельзя узнать» ended the plan |
| `assisted`, `hintLevel` | whether a hint rung was shown during `plan`, and the deepest one |
| `endedBy` | `ready`, `dont_know` or `cant_know` |

`plan_draft`, owned by this part, carries `itemId` and `laid`, the quantity ids of a partly laid plan in her order.

`item_shown` and `attempt_submitted` carry `openingPhase`, `none`, `model` or `plan`, on every word problem. `attempt_submitted` carries no `planChoice`: the label lives in `plan_submitted` alone. Each new field joins the one version 2 of its payload that SPC-0020 holds, and the version 1 to 2 upcaster reads an older event as `openingPhase: "none"` with no plan.

### Statuses and error names

| Name | Audience | Meaning |
| --- | --- | --- |
| `plan_unavailable` | the developer, through the log and the verify report | no candidate yields a plan that passes the two plan rules |
| `plan_template_incomplete` | the developer, through verify | a template lacks a quantity id, a stated quantity, an eligible decoy for its tier or a card wording |
| `400 plan_rejected` | the developer, through the server log | a sequence names an unknown card or a card twice, or no card with `endedBy: ready` |

### What this part requires from other parts

- SPC-0040 supplies the valid graphs, the structure traps, the surplus datum, `solution(p)`, `hints(p)`, the distinctness test, the filler and the generation fallbacks.
- SPC-0080 supplies the `open`, `review` and `closed` states, the hint ladder and the rule that a rung marks the attempt assisted.
- SPC-0030 supplies `clientSeq` idempotence, the event queue and its waiting scene, and the resume point, which holds the newest `plan_draft` per item.
- SPC-0020 supplies `appendEvents`, the projection registry with each projection's class, and upcasting.
- SPC-0180 supplies the word-problem matrix and its period.

The permitted dependencies run one way. `src/templates/plan.ts` imports only template code and `src/shared/`, and never the model gateway; the existing `no-restricted-imports` rule on `src/templates` enforces it. `gradePlan` is pure: it reads no clock, no database and no randomness. The client imports only `src/shared/`. Route code writes to the log only through `appendEvents`.

## Behaviour

### The opening phase and the input form

The item builder gives every first-shown word problem one opening phase, a model choice, a plan or none, whoever sets it, a Guardian or a room, and whether or not a number is missing (REQ-5604). An unanswerable problem gets the plan built from its complete problem. A Dutch probe letter, whose `item_shown.purpose` is `nl_probe`, opens with no phase and takes the final answer only, as ADR-0430 sets, so its `openingPhase` is `none`.

`word_problem_cycle` counts first-shown T2 to T4 problems; a second attempt, a riddle she composes and an `item_shown` whose `forms` holds `nl_probe` don't advance it, since ADR-0430 keeps a Dutch probe letter out of every projection but its own. For the compound problem at position `n`, counting from 0:

- the phase is slot `n mod 8` of the cycle: plan, none, model, none, none, plan, none, model;
- the input is step-by-step when `n` is even and final-answer when `n` is odd.

In every run of consecutive compound problems, model choices are 20 % to 30 % of them within one problem (REQ-5610). In any 30 days, the compound problems chosen to open with a plan are 20 % to 30 % of the compound problems she gets, or within one problem of that range, whether or not their template could build the plan (REQ-6422). The compound problems that open with a plan in any 30 days split between step and final-answer input within 40 % to 60 %, or within one problem of that range (REQ-5608). No problem gets both a model choice and a plan (REQ-5602).

A T1 problem never opens with a plan (REQ-5600). `word_problem_cycle_t1` counts the `item_shown` events of first-shown T1 problems, leaving out a second attempt, a riddle she composes and an `item_shown` whose `forms` holds `nl_probe`, and gives a model choice at T1 position `t mod 4 = 0`, which holds the T1 share at 20 % to 30 % within one problem (REQ-5670).

When the template can't build a plan for any candidate the generator draws, the item builder logs `plan_unavailable` for the problem, and the problem opens with no phase. The plan moves to no other problem, and the slot still counts as chosen for a plan.

### The cards

The plan builder takes the valid graph that `solution(p)` and `hints(p)` read and makes one needed card per step, with the last step's card worded as the problem's question, so all needed cards come from exactly one valid solution path (REQ-5616). The plan asks her to lay the needed cards in the order of solving, from the first quantity to find to the question (REQ-5612).

Each decoy comes from the template's other quantities and has one kind: `stated` for a given the text states, `trap` for a quantity only a structure-trap graph computes, and `surplus` for a quantity only the surplus datum of a T4 problem computes (REQ-5622). A T2 or T4 plan shows exactly 1 decoy, and a T3 plan 1 or 2, chosen by the task's seeded stream with equal odds when the template offers two eligible decoys and 1 otherwise (REQ-5614). A plan shows 3 to 5 cards.

The generator's distinctness test rejects a candidate when either plan rule fails:

1. A decoy's quantity id is a step of some valid graph (REQ-5618). A given the computation uses is a leaf, not a step, so it stays eligible as a `stated` decoy.
2. Two cards render to the same text.

With both rules, exactly one set of the shown cards makes a correct plan (REQ-5620); the two orders of a fork use that one set.

### Card wordings

`content/plans.ru.json` holds one wording per step of each valid graph and per decoy quantity the template can offer, with placeholders for numbers, counted nouns and characters, and the filler of the problem's frame fills them when the problem is built (REQ-5662). A `stated` decoy's wording names its quantity without the given's number. The file follows the rules for content files and passes `textGate`, the key parity check and the Cyrillic grep. The template author writes the wordings, and no language-model call at build or play time writes or picks a card (REQ-5660).

### Grading

`gradePlan(plan, laid)` computes every fault that applies:

- `used_distractor`: she laid a `trap` or `surplus` decoy (REQ-5626);
- `missing_step`: she left out a needed card (REQ-5628);
- `extra_step`: she laid a `stated` decoy (REQ-5624);
- `wrong_order`: a laid needed card stands before a laid needed card whose quantity it needs, directly or through other steps, with decoys ignored (REQ-5630).

The label is the first fault in the order `used_distractor`, `missing_step`, `extra_step`, `wrong_order` (REQ-5634), or `correct` when she laid every needed card, no decoy, and each card after every card whose quantity it needs (REQ-5632). The question card needs every other step, so a question card laid early is `wrong_order`, and both orders of a fork's independent steps are `correct`.

`PlanSpec` is a spec of its own, graded only by `gradePlan` into these five labels and never by the exact-permutation rule of `order` answers, which SPC-0040 states (REQ-5672).

### The `plan` phase

A problem with a plan runs the `open` state in two phases, `plan` then `solve`. In `plan` the task window shows the problem text, the cards in an order the task's seeded stream shuffles, and a row where she lays them. The action row holds, in this order, «Не знаю» (I don't know), «Нельзя узнать», the thread button and «Готово» (Done), and «Готово» stays inactive while the row is empty. She can move and take back any card until she presses «Готово». The client sends the partly laid plan through the draft route and SPC-0030's event queue, at most once every 10 seconds while the row changes and at once when she leaves the task window or the page turns hidden, and the server logs it as `plan_draft`.

«Готово» sends the laid sequence. The server logs `plan_submitted` with the full sequence she laid, before she answers the problem (REQ-5638, REQ-5640), and the window moves to `solve` with no word, mark or colour about the plan (REQ-5650). When she submits the plan, the log records its `planChoice` with the attempt as one of the five labels, apart from the answer (REQ-7508). A plan that «Нельзя узнать» ends before she submits it carries no label.

«Не знаю» in `plan` ends the whole first attempt, and the server logs `plan_submitted` with the cards she had laid, possibly none, `endedBy: dont_know`, and the label `gradePlan` gives them. «Нельзя узнать» in `plan` opens its options, as it does in every phase, and the «Готово» inside those options ends the whole first attempt; the server logs `plan_submitted` with the cards she had laid, `endedBy: cant_know`, and no label. A plan she submitted with «Готово» keeps its label whatever ends the attempt in `solve`.

A hint rung is shown from the one ladder of the attempt, in either phase. A rung shown in `plan` marks `plan_submitted` assisted and the attempt assisted (REQ-5658), and it stays visible in `solve` at no further cost.

### The resume

A resume after `plan_submitted` and before the answer restores `solve` with her plan in place (REQ-5642). A resume in `plan` shows the cards in the same seeded order and restores the row from the newest `plan_draft` of the item, or shows it empty when she laid nothing.

### The `solve` phase

When the problem takes step input, the step rows carry her laid cards as labels, in her order, decoys included (REQ-5654). She can add a row, which carries only its number «N)», and remove any row, up to 6 rows (REQ-5656). The checker reads only the values, so a label never changes credit.

The answer after a plan counts towards credit, the room or floor outcome, the success share, the holding-steps value and the estimate exactly as the answer after no phase does (REQ-5646). The label feeds none of them (REQ-5644). After the MVP, the profile's model building bar also reads the label, but only while ADR-0390's plan check holds. The stream `plan` holds `plan_submitted` alone and stays out of the "on her own" estimate by SPC-0060's rule for new forms; `item_shown.forms` never holds `plan`. `attempt_submitted` records `openingPhase` on every word problem, so the log tells the three kinds of problem apart (REQ-5648).

### After the answer

In `review` the knot's scheme of a plan problem shows two columns: her cards in her order and the engine's cards in the graph's order (REQ-5652). Neither column carries a tick, a cross or a verdict word, and a decoy she laid is drawn in the muted card style.

### The report

The word-problem matrix shows two crosses sharing the answer axis: model choice by answer on problems that opened with a model choice, and plan by answer on problems that opened with a plan (REQ-5666). The answer axis of both crosses has three values: right, wrong and no answer. The plan cross is split by the problem's number of steps. The report reads unassisted first attempts. An attempt that ended in `plan` sits in neither cross and counts in the report's «Не знаю» or «Нельзя узнать» count.

A planning error is a plan labelled anything but `correct`, counted apart from modelling errors and calculation errors (REQ-5664). A plan that «Нельзя узнать» ends in `plan` has no label and counts in no planning-error count, and an empty plan ended by «Не знаю» is `missing_step` and counts as a planning error. A wrong answer after a `correct` plan counts as a calculation error (REQ-5668). A wrong answer after a faulty plan counts in its cell of the plan cross and in no error count. A `correct` plan followed by «Не знаю» in `solve` sits in the cell `correct` by no answer and in no error count, and an attempt with no answer holds no modelling or calculation error.

## Failure paths

| Condition | What happens |
| --- | --- |
| No candidate among the generator's 1,000 and its fallbacks yields a plan that passes the two plan rules | `plan_unavailable` is logged, the problem opens with no phase, and the plan moves to no other problem. The verify report names the template when its `plan_unavailable` share passes 1 % over 30 days, and again only when its share over 30 days is higher than the share at the template's last report. |
| A template lacks a quantity id, a stated quantity, an eligible decoy for its tier or a card wording | `plan_template_incomplete`: the build fails and names the template and the quantity. |
| A sequence names an unknown card or a card twice, or no card with `endedBy: ready` | `400 plan_rejected`: the server writes nothing, and the phase stays open and unchanged. |
| The same plan request arrives twice with one `clientSeq` | The server appends nothing and returns the state the first request left. |
| The client has no connection when she presses «Готово» | SPC-0030's event queue holds the plan, and the waiting scene shows. |
| The client has no connection while she lays cards | SPC-0030's event queue holds each `plan_draft` in order and sends it when the connection returns. |
| The app closes while she lays cards | The resume shows the cards in the same order with the row as the newest `plan_draft` left it. |
| She misses a step in her plan and then needs a row for it | She adds a row, up to 6. |

## Open review findings

- Rejected: give each rule its reason, for example why a `stated` decoy leaves out the given's number, why «Готово» stays inactive on an empty row, and why step rows stop at 6. A specification states what the system does, and ADR-0270 holds the reasons.
- Rejected: upcast an older Guardian `item_shown` or `attempt_submitted` as `openingPhase: "model"`. ADR-0270 sets the upcaster to read every older event as `none`, and the repository holds no code, so no older event exists; changing the rule is a decision for ADR-0270.
- Rejected: say "bought" for a rung, as ADR-0270 does, in place of "shown". SPC-0080 marks an attempt assisted when a rung is shown, whether the tap spent a thread or was free, and this document uses its term.
- Rejected in part: drop the writing-standard comment at the top, which promises a reason with each rule. Every record carries that comment, so this document keeps it, and Scope now names ADR-0270 as the holder of the reasons.
- Rejected: cite the ADR-0360 or ADR-0370 entry beside each rule they changed. Scope names both as amending ADR-0270, and a specification cites requirements, not the entries of a decision.
