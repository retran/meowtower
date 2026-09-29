---
id: SPC-0080
artifact: spec
status: live
revised: 2026-09-29
checked-at:
states: [REQ-0106, REQ-0110, REQ-0112, REQ-0400, REQ-0402, REQ-0404, REQ-0406, REQ-0408, REQ-0410, REQ-0412, REQ-0420, REQ-0422, REQ-0424, REQ-0426, REQ-0428, REQ-0430, REQ-0432, REQ-0502, REQ-0504, REQ-0506, REQ-0508, REQ-0510, REQ-0512, REQ-0514, REQ-0516, REQ-0518, REQ-0520, REQ-0522, REQ-0524, REQ-0528, REQ-0530, REQ-0536, REQ-0544, REQ-0546, REQ-0550, REQ-0552, REQ-5100, REQ-5102, REQ-5104, REQ-5106, REQ-5108, REQ-5110, REQ-5112, REQ-5114, REQ-5116, REQ-5118, REQ-5120, REQ-5122, REQ-5124, REQ-5126, REQ-5128, REQ-5132, REQ-5134, REQ-5158, REQ-5160, REQ-5162, REQ-5164, REQ-5166, REQ-5300, REQ-5302, REQ-5306, REQ-5308, REQ-5310, REQ-5312, REQ-5314, REQ-5316, REQ-5324, REQ-5326, REQ-5328, REQ-5330, REQ-5332, REQ-5334, REQ-5336, REQ-5338, REQ-5340, REQ-5342, REQ-5344, REQ-5346, REQ-5348, REQ-5350, REQ-5352, REQ-5370, REQ-6408, REQ-6410, REQ-7164]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The attempt flow, the hint ladder and guiding threads, with the estimate and the inverse check

## Scope

This document covers what happens to one adventure task from the moment the task window shows it until the player leaves the window: the attempt flow's states, the review, the second attempt, the hint ladder and its framing lines, the guiding-thread ledger, the estimate step and the inverse check. It is written at the level of the flow's states, the rules the server applies in each, and the packet fields, routes and events those rules touch.

It leaves out what other parts define. The routes' shared contract, idempotency by `clientSeq`, the lease, the resume point and the answer queue belong to SPC-0030, and the event log, its schemas and its projections to SPC-0020. How a task is generated and its answer checked belongs to ADR-0040. Which task comes next, and the draw that gives an item its estimate, belong to ADR-0070. How the knowledge model reads attempts, the shares by depth of help and the `estimate` stream belong to ADR-0060. The outcome's spell, the streak, experience and chests belong to ADR-0140, the detailed explanation's text to ADR-0120, and the report's figures, the estimate matrix and the weekly check line to ADR-0180. When guiding threads and the thread button first appear, and the morning grant, belong to ADR-0330. A riddle runs ADR-0230's compose flow, a Diary puzzle ADR-0280's flow, a Volley fact the shortened flow of ADR-0290, and a Dutch probe letter, after the MVP, this flow with ADR-0430's changes; the plan phase is ADR-0270's, the «Нельзя узнать» (Can't be known) options ADR-0250's, and a drawn source's regions ADR-0300's. The window's look belongs to ADR-0150 and its strings to ADR-0160.

## Boundary

### Parts and where they live

| Part | Where | What it offers |
| --- | --- | --- |
| The attempt flow | `src/engine/attempt/` | the state of one task's flow as a pure function of that task's events, and the next state for a request |
| The thread ledger | `src/engine/attempt/threads.ts` | the stock and the pocket's state as a projection of `thread_granted`, `thread_spent` and `pocket_thread_given` |
| A template's ladder and solution | `src/templates/` | `hints(p)` with 1 to 3 rungs, `solution(p)`, `sampleParallel(p, rng)` and `kind`, all from one solution graph |
| The estimate's option builder and label | `src/engine/` | the four options for an item and `estimateLabel(correct, answer, estimateRight)`, both pure |
| The routes | `src/server/play.ts` | the answer, hint, explanation, second-attempt and check routes |
| The framing lines | `content/framings.ru.json`, `content/numerals.ru.json` | the approved lines per familiar kind and rung, and every inflected Russian numeral |
| The framing generator | `npm run framings:generate` | candidate lines, written outside any session |
| The catalogue flags | `content/catalogue.yaml` | `estimate` and `inverseCheck` per subtype |

### Routes and packet fields

The routes follow SPC-0030's contract, and this part adds the fields below.

| Route or schema | What this part puts in it |
| --- | --- |
| `Room` | the thread stock, whether the thread button is active, the rungs already shown with their familiar kind and framing line, `estimate?: { options }` with the four formatted values, and `check?: { op, operand, checksLeft }` |
| `POST /api/session/:id/answer`, `AnswerIn` | `estimate?: { option }`, the picked position 0 to 3, and `timings.checkMs` |
| `AnswerOut` | after a first attempt, `estimate?: { picked, correct }` beside `feedback.correctAnswer` |
| `POST /api/item/:itemId/hint`, `HintIn` | `level`, 1 to the item's `hintMaxLevel` |
| `HintOut` | the rung's level and text, the familiar kind, the framing line or none, and the thread stock |
| `POST /api/item/:itemId/explain` | the detailed explanation, as SPC-0030 states it |
| `POST /api/item/:itemId/second-attempt` | the parallel task as a `room` packet |
| `POST /api/item/:itemId/check` | `{ preliminaryRaw, checkRaw, clientSeq }`; replies `{ match, checksLeft }` |

### Events this part logs

This part logs `item_shown`, `attempt_submitted`, `verdict`, `hint_shown`, `thread_granted`, `thread_spent`, `pocket_thread_given`, `solution_shown`, `explanation_bought`, `twin_unavailable`, `self_check_used`, `rung_framing_approved` and `rung_framing_removed`, all through `appendEvents`. SPC-0020 states the payloads and versions of all but three. SPC-0030 states `explanation_bought`'s payload. ADR-0020's event catalogue lists `pocket_thread_given` and `twin_unavailable` with ADR-0080 as their owner: `pocket_thread_given` carries `itemId`, `roomId` and `floorId`, with `roomId` null for a task outside any room, and `twin_unavailable` carries the `itemId` of the original task. The `items` row holds each item's `hintMaxLevel`, and for an item with an estimate its four values and the index of the correct one.

### Errors

| Status or name | Audience | Meaning |
| --- | --- | --- |
| `400 hint_level_beyond_ladder` | the developer | a hint request names a rung past `hintMaxLevel`, a ladder of length 0 included |
| `400 hint_level_skipped` | the developer | a hint request names a rung beyond the next one |
| `409 no_threads` | the player | a ladder opening or an explanation with a stock of 0 and the pocket used |
| `409 attempt_open` | the developer | a second attempt asked for before the first attempt's verdict |
| `409 not_a_first_attempt` | the developer | a second attempt asked for on a second attempt |
| `409 no_twin` | the developer | a second attempt asked for on a first attempt that doesn't bring one |
| `422 estimate_missing` | the player | an answer on an item with an estimate carries no pick, no «Не знаю» (I don't know) and no `insufficient` |
| `409 check_late` | the developer | a check after the first attempt |
| `409 check_limit_reached` | the player | a fourth check on one task |
| `422 check_unparsed` | the player | a check whose `checkRaw` doesn't parse |
| `400 check_not_offered` | the developer | a check on a task whose `Room` carried no `check` |

### What this part requires from other parts

- SPC-0030 supplies the routes' contract, idempotency by `clientSeq`, the charge keys, the lease, the resume point and the answer queue.
- SPC-0020 supplies `appendEvents`, the event schemas and the projections `items`, `node_estimates` and `resume_snapshot`.
- ADR-0040 supplies the answer check, the outcome, the trap and the class, the solution graph and the parallel-task sampler.
- ADR-0070 supplies the estimate draw and the task placement; ADR-0090 the game day and the room; ADR-0140 the grants' triggers and what an outcome earns; ADR-0120 the detailed explanation's text; ADR-0130 the safety check the framing generator runs.

### Permitted dependencies

The dependencies run one way. `src/engine/` imports only `src/shared/` and does no input or output, so the flow and the ledger are computed from events alone. `src/templates/` imports only `src/shared/` and `src/engine/`. `src/server/play.ts` calls the engine and writes to the log only through `appendEvents`. The client imports only `src/shared/`, and nothing in `src/engine/`, `src/templates/` or `src/server/`, so no rule that decides an outcome, a rung or a match runs on the client. The framing generator imports no play code and is never called during a session.

## Behaviour

### One flow for every task

Every adventure task, scored or not, runs one attempt flow, which the server owns as a state machine per task, and the game has no measurement mode apart from it: the API has no route or flag for one (REQ-0400). The flow runs inside the task window, a flat panel separate from System windows (REQ-0106), and the short solution and the second attempt stay inside that window (REQ-0426).

The window holds only the task, the answer field or options, the keypad, «Не знаю», the guiding thread button and «Готово» (Done), with no sprite, effect or story text. A task's form adds its own texts and controls: a shown rung with the familiar's portrait and framing line, the short solution and a fluent fact's strategy line after the answer, the estimate's four options, and «Проверить нить» (Check the thread) with its check field and match signal. The other forms' controls, which REQ-5120 lists, belong to their own decisions (REQ-5120). The window never shows «верно» (correct), «неверно» (incorrect), «ошибка» (mistake), a tick or a cross (REQ-0110), and ADR-0160's forbidden-word list checks its strings.

### The states

The diagram is at the level of the flow's states for one adventure task.

```text
open --answer--> first_answered --> review --+--> twin_open --answer--> twin_review --> closed
  |                                          |
  +-- estimate step, ladder, check           +--> closed   (no twin, or twin_unavailable)
```

| State | What the window shows | What the server does |
| --- | --- | --- |
| `open` | the task and its controls; on an item with an estimate, first the estimate step | sends no correct answer, solution step or rung text beyond the rungs she opened; sells the ladder; answers checks |
| `first_answered` | nothing new until the reply | checks the answer, gives the outcome `clean`, `partial` or `alt`, judges the estimate, writes the label |
| `review` | the correct answer, the review for the outcome, the offer of the detailed explanation | logs `solution_shown` when the short solution shows |
| `twin_open` | the parallel task, with its own ladder | runs `open`'s rules on the parallel task, with no estimate step and no check |
| `twin_review` | the correct answer and the second attempt's review | ends the flow |
| `closed` | nothing; the scene plays the first attempt's outcome | nothing further for this task |

A wrong answer and «Не знаю» give `alt`. A right answer gives `clean`, and a partial answer gives `partial`.

### The first attempt and the review

Before and during a first attempt, the server sends no correct answer and no solution step, apart from the rungs of a ladder she opened (REQ-0432). The first attempt's reply carries the correct answer, and the window shows it after every attempt, the second one included (REQ-0430).

The window titles the review «Схема узла» (The knot's scheme) (REQ-0112). After `clean`, it shows the answer as accepted with a dry outcome line (REQ-0402) and offers the short solution under «Как легла нить» (How the thread lay) (REQ-0404). After `partial` or `alt`, it shows the short solution at once, with no extra tap (REQ-0408). After every outcome it offers the detailed explanation (REQ-0406), on every task other than a Dutch probe letter, whose review shows the short solution only (ADR-0430).

The short solution shows the task's solution steps and the correct answer (REQ-0410), and every number in it is the number the engine computed from the template's solution graph (REQ-0412). The short solution, every rung and every per-trap template explanation fill their steps and numbers from that one graph, so they agree (REQ-5108).

When the player sees a task's short solution, whether it opened by itself or on request, the server logs `solution_shown`. Every later task of the same node on the same game day then carries `postFeedback: true` on its `attempt_submitted` (REQ-0428). A shown rung or a bought explanation on the node sets the same mark (ADR-0060). The mark ends at the game day's change at 04:00, so it survives «Сохранить и уйти» (Save and leave) and a resume on the same day.

### The second attempt

A first attempt on any task other than a Dutch probe letter brings one second attempt on a parallel task when it ends `alt`, from a wrong answer or «Не знаю», or when she saw rung 2 or rung 3 on it, whatever its outcome (REQ-7164). An `alt` after rung 3 meets both triggers and brings one twin. A `partial` first attempt with no rung beyond rung 1 brings none (REQ-5132), and so does a `clean` one with no rung beyond rung 1 (REQ-5134). The twin follows the review of the first attempt. The second attempt brings no further attempt, whatever rung she sees on it. A Dutch probe letter brings no second attempt after any outcome or rung (REQ-7164); after the MVP, and only once the owner amends the Russian-only rule in `CLAUDE.md`, ADR-0430 adds the letter and its review.

The parallel task keeps the first task's template, subtype and difficulty features with new numbers, drawn by `sampleParallel(p, rng)`. The twin of a problem with a missing number is drawn at random as a missing-number or a solvable problem of the same tier, so that over 1000 seeds both kinds occur (REQ-5166).

The event log records every second attempt as `attempt: 2` with `assisted: true` and the link to the original task (REQ-0420). A right second answer shows «Нить закреплена» (The thread is secured) (REQ-0422) and earns base experience, 3 as ADR-0140 sets it, and no bonus (REQ-0424). A wrong second answer or «Не знаю» shows the parallel task's short solution at once. The first attempt's outcome, its streak and its rewards come from the first attempt alone.

### The hint ladder

#### Price

The first tap on the thread button before the answer opens the task's ladder, spends 1 guiding thread and shows rung 1 (REQ-5100). The server logs `thread_spent` with the reason `hint_ladder` and `hint_shown` with `ladderOpenedBy: "thread"`. Each later tap on the same attempt shows the next rung, spends nothing and logs `hint_shown` with `ladderOpenedBy: "free_step"` (REQ-5102). SPC-0020's upcaster reads a version 1 `thread_spent` with the reason `hint` as `hint_ladder` and a version 1 `hint_shown` as `ladderOpenedBy: "thread"`, so every version 1 rung reads as paid. A shown rung marks the attempt `assisted: true`, and `hintLevel` records the deepest rung she saw (REQ-0530).

The parallel task's ladder costs 1 thread of its own, whether or not she opened the first task's ladder (REQ-5104). An attempt spends at most 1 ladder opening and 1 explanation, so a task spends at most 4 threads across both attempts. A ladder opening is charged at most once per item, as ADR-0220 sets SPC-0030's charge key, so a repeated request, or a request with a new `clientSeq` after a resume, never charges again.

#### Length and contents

`hints(p)` returns one rung for each real step of the template's computation graph, from 1 to 3 rungs, and never a rung written to make up the count (REQ-5106). A real step is a node of the graph ADR-0040 builds. A template with more than three real steps groups them into three rungs, in the grouping its author chooses (REQ-5164).

Rung k gives the k-th group of real steps without its result, which is real step k when the graph has three real steps or fewer, so rung 2 of a two-step template gives the second real step (REQ-6408), and no rung gives the result of the task's last calculation (REQ-6410). Every number in a rung is a number the engine computed for the task (REQ-0536). Rung 1 contains no number unless it is the strategy rung of a basic fact (REQ-5112), so the single rung of a one-step template that isn't a basic fact names the operation to use, with no number.

On every T1 to T4 word problem, solvable or not, a rung names each given by its quantity, such as «сколько конфет в первой коробке» (how many sweets are in the first box), and prints no given's value, so a rung reads the same whether or not the problem can be answered. A grouping template's ladder follows its computation graph, the long way in written order, and ADR-0260's optimal plans reach the client only in the short solution, after the first attempt ends.

A template that declares `kind: "basic_fact"` has a ladder of exactly one rung, a strategy through a known fact, such as «7 · 8 — это 7 · 7 и ещё 7» (7 x 8 is 7 x 7 and 7 more) (REQ-5110). Its numbers come from the engine.

Rungs 1 and 2 never state the task's correct answer as a result, and no rung's placeholders name the graph's answer node (REQ-5118). A structural check reads each rung's placeholders and fails a template whose rung names the answer node. A seeded check renders every template over 1000 seeds and fails a rung 1 or 2 whose text holds the answer as a number, unless that number is one of the task's givens.

#### The fluent fact

The server fixes an item's `hintMaxLevel` when it shows the task and stores it in the `items` row, and every later request reads it from there. `hintMaxLevel` is 0 when the task is a basic fact placed as mental arithmetic whose fluency threshold, for the showing device in the active threshold version, is 10 seconds or less. The game then offers no ladder before the answer (REQ-5114). Otherwise it is the length of `hints(p)`. With `hintMaxLevel` 0, the thread button stays visible and inactive before the answer. After the answer, the short solution carries the strategy line, whether it shows at once after a miss or on request after a right answer (REQ-5116), and the strategy line costs no thread (REQ-5162).

#### The familiar's framing

Beside each rung shown before the answer, including a rung restored on resume, the window shows the portrait of the familiar accompanying the player and one approved framing line for that familiar's kind and that rung (REQ-5122). The server picks the line among the approved ones by a hash of `itemId` and rung when it first shows the rung, and stores the `framingId` with the rung in `resume_snapshot`. A resume shows the stored line. A rung shows with the portrait and no line when no approved line exists for the kind and rung, or when its stored line has been removed since. A basic fact's strategy rung takes the rung 1 lines, and the strategy line after the answer takes no framing.

`npm run framings:generate` writes 3 candidates for each familiar kind and each rung 1 to 3, in Russian, addressing her as «ты» (you) with no name, under the offline role `FRAMING_MODEL`. A candidate enters the parent's review queue only after the code checks and ADR-0130's safety check pass. The code checks reject a line that holds a digit or a Russian cardinal or ordinal numeral in any inflection from `content/numerals.ru.json`, «один» and «одна» (one) included (REQ-5126). They also reject a placeholder brace, a familiar's name and a word on ADR-0160's forbidden list for the task window. «Раз» (time, once) passes.

The Parent Room's framing screen shows each candidate with its familiar kind and rung and offers «принять / отклонить / поправить» (accept / reject / edit). The parent reads each line for a number, a step, an operation or a reference to a part of a task, and a line carries none of these (REQ-5124). An edit reruns the code checks at once. Acceptance logs `rung_framing_approved`, and removal logs `rung_framing_removed`. The server writes the approved set to `data/exports/framings.ru.json` after each approval or removal, and the owner commits that file as `content/framings.ru.json`. The server serves lines only from the committed `content/framings.ru.json`, so an approved line reaches play after the owner's commit. It shows a line only when the log holds its approval and no later removal, so no line reaches the player before the parent approves it (REQ-5128). The queue holds at most 5 candidates for a kind and rung, and a candidate expires after 60 days (ADR-0220).

#### Resume

When she resumes a task whose ladder she opened, the window shows the ladder open with the rungs she already saw, each with its portrait and stored line (REQ-5158). The resume spends no thread (REQ-5160) and logs no `hint_shown`.

### Guiding threads

#### The ledger

The stock is a projection of `thread_granted`, `thread_spent` and `pocket_thread_given`, and only the server writes it. Every packet carries the current stock. The game screen shows the stock as a ball of yarn with its number (REQ-0546), and the window draws the thread button with the same number once ADR-0330 has opened guiding threads.

#### Grants

| Source | Threads | Requirement |
| --- | --- | --- |
| A completed daily quest | 1 | REQ-0502 |
| A clean row, the streak of clean, unassisted, scored first attempts that aren't rapid guesses reaching 3 in one adventure | 1 | REQ-0504 |
| A big clean row, each multiple of 5 in the streak | 0 | REQ-0506 |
| A story find or a chest find of threads | 1 or 2, from content data | REQ-0508 |
| The familiar hatching or evolving | 2 | REQ-0510 |
| The backpack pocket | 1, at the moment of need | REQ-0514 |

The morning grant is ADR-0330's. A clean row before guiding threads open grants its thread into the stock, which the window draws once they open. ADR-0140 decides when a quest, a row, a find or a familiar's growth fires, and this part logs the grant. A typical day of 28 tasks at a clean share near 0.7 yields 8 to 10 threads, which the balance check in ADR-0190's simulation group measures (REQ-0512).

Each grant fills the stock up to 30, and the stock never exceeds 30 (REQ-0518). Each thread above 30 turns into 2 buttons in the same `thread_granted` event (REQ-0520). The conversion shows no window, sound or line, and the buttons appear in the next packet's count (REQ-0522). The shop has no item that grants threads (REQ-0524).

#### Spending

The detailed explanation costs exactly 1 thread on any task of the adventure, the second attempt included, whether or not the ladder is open, and it is sold once per attempt (REQ-0528). The short solution costs nothing (REQ-0544). The inverse check costs nothing, as stated under The inverse check.

She may press the thread button for a ladder opening or an explanation with a stock of 0. If the backpack pocket hasn't given a thread in this room, the server then logs `pocket_thread_given` with 1 thread and spends it on the action she pressed for (REQ-0514). Tasks outside any room, the warm-up, mental arithmetic and the Guardian, share one pocket per floor. The canon, CAN-0030, states that the pocket gives at most one thread in each room, and only when she reaches for a thread with none left (REQ-0516). A change to the rule changes CAN-0030 in the same commit (ADR-0080).

#### The button's state

The thread button stays visible and inactive at `disabled-alpha` when the stock is 0 and the pocket has given its thread (REQ-0550). It is also inactive when the attempt has nothing left to buy, when `hintMaxLevel` is 0 before the answer, during the estimate step and with no connection. While the ladder is open and a rung remains, the button stays active whatever the stock, and it keeps its label and count. No string the game shows speaks of running out of threads (REQ-0552), and ADR-0160's forbidden-word list checks it.

### The estimate

#### Where it appears

A subtype carries an estimate when its catalogue row has `estimate: true`. The build sets the flag on multi-digit multiplication and division, decimals, percentages, area and volume, and T2 to T4 word problems. A word problem carries an estimate only when the result of its complete problem is 1000 or more; the other subtypes carry one at any size. An unanswerable T2 to T4 problem follows the same rule, applied to the result of its complete problem, which the task hides, so the estimate step shows on solvable and unanswerable problems alike (ADR-0240, ADR-0250). A Dutch probe letter shows neither the estimate nor the inverse check, whatever its subtype's flags (ADR-0430). A build check fails a flagged subtype whose answer isn't a nonzero number.

ADR-0070's draw gives an eligible item an estimate with probability `q = min(0.5, 0.15 / (1 - b))`, where `b` is the share of the subtype's last 200 eligible items that couldn't carry one. The draw reads neither `purpose` nor the scored flag, and the estimate appears on between 10 % and 20 % of the eligible scored tasks, counted over at least 200 (REQ-5300). A room asks for at most one estimate, and its estimate stays open until an item carries one (REQ-5302). Tasks outside any room share one estimate per floor.

#### The options

The option builder builds four options, each a rounded value of a different order, shown as separate buttons and never as intervals on a number line (REQ-5312). The correct option is the correct result rounded to one significant figure, `r · 10^e`; on an unanswerable problem the builder reads the hidden result of its complete problem as the correct result. The other three sit at orders `e + j` for `j` in `{-1, 1, 2}` or `{-2, -1, 1}`, picked by a seeded coin, each with a leading digit drawn from 1 to 9. A draw is accepted when every two options are at least 0.6 apart in `log10` and the three errors of REQ-5316, stated below, each fall on an option other than the correct one.

An option is right when it is the option nearest to the correct result in `log10`, and a value falls on the option nearest to it. Ten times the correct result, a tenth of it and, when the final operation is multiplication, the sum of its operands each fall on an option other than the correct one (REQ-5316). For 38 · 47 = 1786 the correct option is 2000, and one accepted draw gives 300, 2000, 10,000 and 400,000: 17,860 falls on 10,000, and both 178.6 and the sum 85 fall on 300.

The builder refuses the estimate at once, with no redraw, when the correct option equals the exact answer, or when the final operation is multiplication and the sum of its operands falls on the correct option. Otherwise it refuses the estimate after 20 rejected draws. The item then goes out without an estimate, and the room's estimate stays open.

The builder shuffles the four options with the item's seeded stream, so over each subtype's estimates the correct option falls on each of the four positions equally often, within what chance allows (REQ-5314). The `items` row and `item_shown` keep the four values and the correct index. `Room` carries only the four formatted values in their shuffled order, and no packet before the exact answer carries the correct index or any value the estimate's verdict could be worked out from (REQ-5370).

#### The estimate step

On an item with an estimate, `open` begins with the estimate step. The window shows the task and the four options, and hides the answer field, the keypad and «Готово». The thread button is inactive during the step. «Не знаю» works in the step and gives `alt`, with no estimate recorded. On a T2 to T4 word problem «Нельзя узнать» stays in the action row and works in the step, as in every phase (ADR-0250). An `AnswerIn` that carries `insufficient`, from «Нельзя узнать», needs no pick either, and the server records no estimate for it.

When she taps an option, the client locks the pick and opens the answer field, and nothing goes to the server until «Готово». `AnswerIn` then carries the pick as `estimate` beside the exact answer, and the server judges both in one request, so no verdict on the estimate leaves the server before the exact answer (REQ-5306). A resume before «Готово» shows the estimate step again. An `AnswerIn` for an item with an estimate, with no pick, no «Не знаю» and no `insufficient`, gets `422 estimate_missing`, logs nothing, and the client shows the estimate step again.

`AnswerOut` for the first attempt carries `estimate: { picked, correct }` beside `feedback.correctAnswer`, and the review shows the estimate's verdict together with the exact answer's (REQ-5308). Her pick is outlined and the correct option carries ADR-0150's selected state, with no word or sign REQ-0110 forbids. The second attempt has no estimate step.

#### What the estimate changes

The outcome, the streak change and the rewards come from the exact answer alone and never read the estimate (REQ-5310). After the first attempt the server computes one label from the estimate and the exact answer, and writes it as `estimateLabel` on the `verdict` event beside `estimateRight`:

| Exact answer | Estimate | Label | Requirement |
| --- | --- | --- | --- |
| wrong, and equal in `Q` to the correct result times `10^k` for a whole `k` other than 0 | right | `magnitude` | REQ-5324 |
| the same | wrong | `magnitude_unaware` | REQ-5326 |
| right, at credit 1 | wrong | `estimate_off_exact_ok` | REQ-5328 |
| anything else | any | none | |

The label sits beside ADR-0040's class and trap and never replaces a trap or the class «не классифицирована» (unclassified) (REQ-5330). A wrong answer that matches a trap and is off by a factor of 10 keeps the trap and gains `magnitude`. A right answer labelled `estimate_off_exact_ok` counts as right in every measure and never as a mistake (REQ-5332). The estimate adds nothing to the item's `forms`, the list of new forms a task uses that SPC-0040 fills and SPC-0020 logs on `item_shown`.

### The inverse check

#### Where it appears

A template offers the check when its catalogue row has `inverseCheck: true`. The build allows the flag only on a bare expression of one operation, +, -, · or :, between two numbers printed in the task, with an integer or decimal answer, and never on a word problem, one-step ones included (REQ-5336). The build check also fails the flag on a task whose final operation has an operand the task doesn't print, on a division with a remainder, on a multiplication whose generator can draw a zero operand, on a fraction and on a basic fact.

The check's target is the printed operand her check must reproduce:

| Task | Check prompt | Target |
| --- | --- | --- |
| `a + b` | her answer - `b` | `a` |
| `a - b` | her answer + `b` | `a` |
| `a · b` | her answer : `b` | `a` |
| `a : b` | her answer · `b` | `a` |

#### The check

«Проверить нить» shows in `open` once her answer field holds a parseable entry, and the game offers it only before she submits the first attempt (REQ-5338). The check costs nothing: no thread and no other currency (REQ-5340).

The button opens a field under the prompt. For 345 - 178 with her entry 167 the prompt reads «Проверь обратным действием: 167 + 178 = ?» (Check by the inverse operation: 167 + 178 = ?). She types a value, and the client sends `POST /api/item/:itemId/check`. The server parses `checkRaw` and compares it in `Q` with the target, 345, and with nothing else (REQ-5342). It logs `self_check_used` and replies `{ match, checksLeft }`.

Before the first attempt, the server sends no correct answer, no result her check should give for her preliminary answer and no verdict on that preliminary answer (REQ-5344). `Room` carries `check: { op, operand, checksLeft }`, both printed in the task, and nothing else about the check. The field shows only «Сходится» (It matches) or «Не сходится» (It doesn't match), and never the correct answer (REQ-5346). It shows no tick, cross, «верно», «неверно» or «ошибка» (REQ-5348).

A check never makes an attempt assisted (REQ-5350). The server logs the preliminary answer only inside `self_check_used` and never as `attempt_submitted`, so the answer she sends with «Готово» after a check is her first attempt, and a right one is `clean` (REQ-5352). A task allows at most 3 checks. The server counts the item's `self_check_used` events in the log, so a resume never resets the count (ADR-0370). A `checkRaw` the server can't parse gets `422 check_unparsed`, logs nothing and uses none of the 3 checks, and the client shows the check field again. After the third, the button stays visible and inactive at `disabled-alpha`, with no words (ADR-0240). The second attempt has no check.

### Time

The fluency test and the rapid-guess test read no time spent in the estimate step or the check field (REQ-5334). An attempt on an item with an estimate counts for accuracy, and its whole time counts in no measure, so nothing subtracts the estimate step. Such an attempt is never `fast`, never enters a block's median time or the fluency estimate, and is never tested for a rapid guess (ADR-0370). On every attempt on an item without an estimate the client measures `checkMs`, the time the check field is open, and sends it in `AnswerIn`'s timings. The measures read the time from the task's appearance to «Готово», without pauses and without `checkMs`. Time spent correcting her answer after a check stays in (ADR-0240).

## Failure paths

| Condition | What happens |
| --- | --- |
| A hint request names a rung past `hintMaxLevel` | `400 hint_level_beyond_ladder`; the server shows and charges nothing. |
| A hint request skips a rung | `400 hint_level_skipped`; nothing is shown or charged. |
| A ladder opening or an explanation arrives with a stock of 0 and the pocket used, from a client that drew the button before the stock changed (`thread_refused`) | `409 no_threads`; the server charges and reveals nothing and returns the current stock, and the button turns inactive. |
| A hint, explanation or second attempt is requested again, or again after a resume with a new `clientSeq` | The charge key finds the earlier charge; no thread is spent and the same result returns, and the same parallel task. |
| The generator can't build a parallel task with the same difficulty features within its retry limit (`twin_unavailable`) | The server logs `twin_unavailable` and closes the review with no twin, after `alt`, or after a `clean` or `partial` on which she saw rung 2 or rung 3. |
| A second attempt is asked for on a first attempt that brings none | `409 no_twin`; nothing is logged. |
| The explanation model fails or passes 10 seconds (`explanation_fallback`) | ADR-0120's template explanation arrives, and the thread is spent once. |
| No approved framing line exists for a kind and rung (`framing_missing`) | The rung shows with the portrait and no line; the framing screen counts the kinds and rungs with no line. |
| A resumed rung's stored line was removed | The rung shows with the portrait and no line. |
| A candidate fails a code check or the safety check (`framing_check_failed`) | The candidate never enters the queue; the generator's output names the failing check. |
| An approved line isn't yet in the committed `content/framings.ru.json` (`framing_uncommitted`) | The rung shows without it; the framing screen counts approved lines awaiting a commit. |
| A line in `content/framings.ru.json` has no approval event (`framing_unapproved`) | The server never shows it and reports it once at start. |
| The framing generator fails (`framing_generation_failed`) | The generator stops, the queue keeps what it holds, and play is unaffected. |
| An answer on an item with an estimate carries no pick, no «Не знаю» and no `insufficient` (`estimate_missing`) | `422 estimate_missing`; nothing is logged and the client shows the estimate step again. |
| The option builder finds no four options that keep the three errors off the correct one (`estimate_refused`) | The item goes out without an estimate, the room's estimate stays open, and the verify report shows the refused share per subtype. |
| A check arrives after the first attempt (`check_late`) | `409 check_late`; nothing is logged. |
| A fourth check arrives on one task (`check_limit_reached`) | `409 check_limit_reached`; nothing is logged, and the button is inactive. |
| A check arrives on a task that offers none | `400 check_not_offered`; nothing is logged. |
| `checkRaw` doesn't parse (`check_unparsed`) | `422 check_unparsed`; nothing is logged, the check uses none of the task's 3 checks, and the client shows the check field again. |
| The client has no connection (`offline`) | The hint, explanation, second-attempt and check controls stay inactive, the pick waits with its answer in SPC-0030's answer queue, and the waiting scene shows. |
| A resume comes before «Готово» on an item with an estimate | The estimate step shows again, and the attempt's time already counts in no measure. |

## Choices made in writing this document

The decisions leave two details open, and this document fixes them. The flow and the ledger live in `src/engine/attempt/`, since the decisions name the engine's pure functions and not their folder. The error names `no_twin` and `check_not_offered` and their statuses follow SPC-0030's split of `400` for a malformed request and `409` for one the state refuses; ADR-0240 as ADR-0370 amends it sets the statuses of `estimate_missing`, `check_unparsed`, `check_late` and `check_limit_reached`.

## Open review findings

- The second agent review asked to move the Dutch probe letter's MVP and `CLAUDE.md` condition from "The second attempt" to Scope. I keep it beside the twin rule, because the rule's exception for a letter holds only under that condition, and a reader of the rule alone would otherwise take the exception as live today.
- The agent review asked for a reason beside the candidate queue's cap of 5 and its 60-day expiry, the rule that a change to the pocket changes CAN-0030 in the same commit, and the limit of 3 checks a task. I keep them without reasons, because a specification states what the system does and the reasons live in ADR-0220, ADR-0080 and ADR-0240.
- The agent review asked for the parts this document requires to be named by their specifications, SPC-0040, SPC-0060, SPC-0070, ADR-0120, ADR-0140 and others, in place of their decisions. I keep the decisions, because each decision owns its rule and its `## Amends` sections hold the current text, while a pointer to a section of a specification goes stale whenever that specification is revised, as SPC-0040, SPC-0060 and SPC-0070 are in each addendum's pass. The `forms` sentence points to SPC-0040 and SPC-0020 because no decision this document cites defines that field.
- A second agent review asked for the decision holding each reason to be cited beside several more rules, among them the framing hash, the pocket per floor, the inactive button during the estimate step, the bound of 1000, the formula for `q`, the 0.6 gap and the 20 draws. I cited the decision beside the charge key, the queue limits, the canon commit, the check limit and the check time, and left the rest, because each of the others sits in a section whose rules all come from one decision: the framing and the ladder from ADR-0220, the pocket from ADR-0080, and the estimate step, the bound, `q`, the gap and the draws from ADR-0240.
