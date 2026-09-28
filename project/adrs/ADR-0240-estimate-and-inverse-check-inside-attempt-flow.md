---
id: ADR-0240
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-5300, REQ-5302, REQ-5304, REQ-5306, REQ-5308, REQ-5310, REQ-5312, REQ-5314, REQ-5316, REQ-5318, REQ-5320, REQ-5322, REQ-5324, REQ-5326, REQ-5328, REQ-5330, REQ-5332, REQ-5334, REQ-5336, REQ-5338, REQ-5340, REQ-5342, REQ-5344, REQ-5346, REQ-5348, REQ-5350, REQ-5352, REQ-5354, REQ-5356, REQ-5358, REQ-5360, REQ-5362, REQ-5364, REQ-5366, REQ-5368, REQ-5370, REQ-5072]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0240. The estimate and the inverse check run inside ADR-0080's one attempt flow: the estimate is picked from four shuffled rounded values and locked before the answer field opens, the check compares her result only with a number printed in the task, neither changes the outcome, and neither adds time to any speed measure

## Decision

The estimate and the inverse check of the owner's addendum 1 of 2026-09-28 are two optional steps inside the `open` state of ADR-0080's attempt flow, and every rule below holds for scored and unscored tasks alike, because a step that appeared only on scored tasks would tell the player which tasks are scored (REQ-5304, REQ-2428). ADR-0210 owns the cross-cutting rules this decision builds on: new forms write separate streams, the owning decision of each new event type, the MVP scope and the build order.

### Where an estimate appears

A subtype carries an estimate when its row in `content/catalogue.yaml` has `estimate: true`. The build sets that flag on the subtypes of multi-digit multiplication and division, decimals, percentages, and area and volume, and on T2 to T4 word problems, where an item carries an estimate only when its correct result is 1000 or more (REQ-5300). The bound covers the word problems alone, as I read REQ-5300, because a word problem's size depends on its story and a small one lets her find the order by calculating; the other named subtypes carry an estimate at any size, because their errors of order come from places and the decimal comma, which the estimate exists to catch. An estimate needs a nonzero numeric result, so a build check fails any flagged subtype whose answer kind isn't a number.

ADR-0070's `nextTask` decides whether an eligible item carries an estimate, by a draw from the adventure's seeded stream that reads neither `purpose` nor the scored flag. It draws with probability `q = min(0.5, 0.15 / (1 - b))`, where `b` is the share of the subtype's last 200 eligible items that couldn't carry one because their room already had an estimate or the option builder refused them. The cap of 0.5 is an unmeasured default that stops a subtype the builder mostly refuses from drawing on every item; the refused-share reversal condition below decides such a subtype. I chose this rule, because a flat 15 % draw under a cap of one estimate a room (REQ-5302) would fall towards 10 % in rooms with many eligible tasks, and `b` puts the lost share back. The room's estimate stays open until an item carries one. Tasks outside any room, the warm-up, mental arithmetic and the Guardian, share one estimate per floor, the same reading ADR-0080 gives the backpack pocket.

### How the options are built

ADR-0040's item builder builds four options when an item carries an estimate. The correct option is the correct result rounded to one significant figure, `r · 10^e`. The other three sit one order apart around it, at orders `e + j` for `j` in `{-1, 1, 2}` or `{-2, -1, 1}`, chosen by a seeded coin. The correct order is never the lowest or the highest of the four, because REQ-5316 needs an option above it for ten times the result and one below it for a tenth; the cost is that by value the correct option is always the second or the third, which the strongest objection and the rank condition below deal with. Each distractor is `d · 10^(e + j)` with a leading digit `d` drawn from 1 to 9. I chose varied leading digits, because four options with the same leading digit would show her the first digit of the exact answer before she calculates. A draw is accepted when every two options are at least 0.6 apart in `log10`, a factor of 4, so no two options read as the same order, and the three rules of REQ-5316 hold. The builder refuses the estimate outright when the correct option equals the exact answer, because the option would then hand her the answer, and after 20 refused draws, an unmeasured default that keeps the builder inside ADR-0190's 50 ms budget for task generation.

An option is right when it is the option nearest to the correct result in `log10`. A value falls on the option nearest to it in `log10`, so REQ-5316 reads: ten times the correct result, a tenth of it and, when the final operation is multiplication, the sum of its operands each fall on a wrong option. When the sum of operands falls on the correct option, as it does for 105 · 2 = 210 against a sum of 107, no draw can help, and the builder refuses the estimate, the item goes out without one, and the room's estimate stays open.

For 38 · 47 = 1786 the correct option is 2000, and one accepted draw gives 300, 2000, 10,000 and 400,000. Ten times the result, 17,860, falls on 10,000, a tenth, 178.6, falls on 300, and the sum 85 falls on 300. The builder shuffles the four options with the item's seeded stream, so the correct option lands on each of the four positions equally often (REQ-5314), and the buttons never follow the order of their values, because a number line can't hold both acceptance rules (REQ-5312). The item row and `item_shown` keep the four values and the index of the correct one, and the client gets only the four formatted values.

### The estimate step

On an item with an estimate, `open` begins with the estimate step: the window shows the task and the four options, and the answer field, the keypad and «Готово» (Done) stay hidden. The guiding thread button stays inactive during the step, because a hint ladder opened before the estimate (ADR-0220) would make the estimate an assisted one. «Не знаю» (I don't know) works in the step and gives `alt` as usual, with no estimate recorded.

When she taps an option, the client locks the pick and opens the answer field; nothing goes to the server until «Готово». `AnswerIn` then carries the pick as `estimate` beside the exact answer, and the server judges both at once, so no estimate verdict can leave it before the exact answer (REQ-5306, REQ-5370). ADR-0210 settles where the fact is logged: a fact that arrives in the same request as the answer is the field `estimate` of `attempt_submitted`, and no `estimate_submitted` type exists. A resume before «Готово» shows the estimate step again, because the server never held the pick; the re-pick comes after she has seen the answer field, and the attempt's time already counts in no measure under Time below. The answer route refuses an `AnswerIn` for an item that carries an estimate with no `estimate` and no «Не знаю», and the client shows the estimate step again.

`AnswerOut` for the first attempt carries the estimate's verdict next to `feedback.correctAnswer`: her pick and the correct option. The review draws them together (REQ-5308), her pick outlined and the correct option marked by ADR-0150's selected state, with no word or sign ADR-0080 forbids in the window.

### What the estimate changes

The outcome, the streak change and the rewards come from the exact answer alone (REQ-5310), so ADR-0140 needs no change: its rules read the first attempt's verdict and never read its `estimate` field. An item with an estimate still feeds the "on her own" estimate from its exact answer, as the addendum says, so the item's `forms`, ADR-0210's list of new forms a task uses, stays empty for the estimate: listing it would drop the exact answer from "on her own" under ADR-0210's observation rule. The `estimate` stream reads the `estimate` field instead.

After the first attempt the server computes one label from the pair of estimate and exact answer, and writes it as `estimateLabel` on the `verdict` event:

| Exact answer | Estimate | Label | Requirement |
| --- | --- | --- | --- |
| wrong, and its value equals the correct result times `10^k` for a whole `k` other than 0, compared in `Q` | right | `magnitude` | REQ-5324 |
| the same | wrong | `magnitude_unaware` | REQ-5326 |
| credit 1 | wrong | `estimate_off_exact_ok` | REQ-5328 |
| anything else | any | none | |

The label sits beside ADR-0040's class and trap and never replaces either (REQ-5330). A wrong answer that matches trap A6a and is off by a factor of 10 keeps the trap and gains `magnitude`, as `alsoSlip` sits beside a trap today. A right answer labelled `estimate_off_exact_ok` keeps credit 1 in every measure (REQ-5332). The labels map to none of ADR-0180's four error classes, so the error-type screen counts `class` alone and its shares don't change. I chose that mapping over the addendum's readings of `magnitude` as procedural and `magnitude_unaware` as conceptual, because a label already sits beside a class that says the same or more, and counting it twice would inflate one class. RES-2550's `errorClass` type therefore stays as it is, and so do the approved requirements on the unclassified answer and on the four classes.

### The `estimate` stream

ADR-0060 gains the `estimate` stream that ADR-0210 names, the number-sense stream of REQ-5318, per pair of node and subtype. It's a BKT estimate with ADR-0060's forgetting and priors, `pGuess` 0.25 as for any choice of four (REQ-5320) and `pSlip` 0.10, the floor of ADR-0060's `max(0.10, 1 - 0.95^steps)` for a one-step answer, and each `attempt_submitted` with an `estimate` field is one observation. I chose BKT with the existing parameters, because the stream then needs no new code path, only a new projection. During the MVP the stream feeds nothing else: not the "on her own" estimate, not fluency and not node N4 (REQ-5322), because ADR-0210's rule for new forms admits a stream only through ADR-0060's activation rule, and the refit waits until after the MVP. The stream exists for the export and for that refit.

### The inverse check

A template offers the check when its catalogue row has `inverseCheck: true`. The build allows the flag only on a bare expression of one operation, +, -, · or :, between two numbers printed in the task, with an integer or decimal answer (REQ-5336). A build check fails the flag on any T template, one-step ones included, on a task whose final operation has an operand the task doesn't print, on a division with a remainder, on a multiplication whose generator can draw a zero operand, because its inverse check would divide by 0, and on a basic fact, `kind: "basic_fact"` in ADR-0220. I chose to leave out basic facts, because a fact measures recall within its fluency threshold, and a check on every 7 · 8 would double the task while the subtracted time kept the fact looking fast. I chose to leave out a longer expression such as 3 · 5 + 7, because its check, answer - 7, must reproduce 15, a value the task doesn't print, so a match would judge her step (REQ-5342). I chose to leave out fractions for the MVP, because the check field would need the fraction keypad, and the addendum's examples are all whole numbers.

The check's target is the printed operand her check must reproduce, and the inverse follows from the visible operation:

| Task | Check prompt | Target |
| --- | --- | --- |
| `a + b` | her answer - `b` | `a` |
| `a - b` | her answer + `b` | `a` |
| `a · b` | her answer : `b` | `a` |
| `a : b` | her answer · `b` | `a` |

The `Room` packet carries `check: { op, operand }`, both printed in the task, and nothing else about the check (REQ-5344). The button «Проверить нить» (Check the thread) shows in `open` once her answer field holds a parseable entry, and never after the first attempt (REQ-5338). It costs nothing, no thread and no other currency (REQ-5340), and no rule of ADR-0080 or ADR-0140 reads it.

The button opens a field under the prompt, for 345 - 178 with her entry 167: «Проверь обратным действием: 167 + 178 = ?» (Check by the inverse operation: 167 + 178 = ?). She types a value, and the client sends `POST /api/item/:itemId/check` with `{ preliminaryRaw, checkRaw, clientSeq }`. The server parses `checkRaw`, compares it in `Q` with the target, 345, and nothing else, logs `self_check_used`, and replies `{ match, checksLeft }`. It never computes the correct answer on this route, never computes her answer plus 178, and never judges her preliminary answer (REQ-5342, REQ-5344). The field shows «Сходится» (It matches) or «Не сходится» (It doesn't match) and never the correct answer (REQ-5346), and no tick, cross, «верно», «неверно» or «ошибка» (REQ-5348); ADR-0160's forbidden-word list checks both strings.

A check makes no attempt assisted (REQ-5350), because the match compares two numbers already on her screen, and a player who types 345 without adding gets a match that tells her nothing. The server logs the preliminary answer only inside `self_check_used`, never as `attempt_submitted` (REQ-5352), so the answer she sends with «Готово» after a check is her first attempt, and a right one is `clean` under ADR-0080 and ADR-0140 as they stand. That first attempt feeds the "on her own" estimate from the first day (REQ-5354). A task allows at most 3 checks, an unmeasured default that covers a first check, a recheck after a correction and one spare, and a `checkRaw` the server can't parse uses none of them, because a typo tells her nothing about her answer. The button then stays visible and inactive at `disabled-alpha`, with no words, as ADR-0080 draws an empty thread button.

### Time

Speed measures read an answer time without the estimate or the check (REQ-5334). An attempt on an item with an estimate counts for accuracy and its time counts in no measure, the rule ADR-0060 already applies to `interrupted` and `crossDevice`: it can't make an attempt `fast`, can't enter a block's median time, and ADR-0070 doesn't test it for a rapid guess or for impulsiveness. I chose to drop the whole time, because she may start calculating while she estimates, so subtracting the estimate step would make her exact answer look faster than it was, and she could fall under the minimum time and be marked a rapid guess. The estimate appears on about 15 % of eligible tasks, so the loss is small.

The check's time is subtracted, not dropped, because a player who checks every answer would otherwise lose all her fluency evidence. The client measures `checkMs`, the time the check field is open, and sends it in `AnswerIn`'s timings. The fluency test and the rapid-guess test read the time from the task's appearance to «Готово», without pauses and without `checkMs`. Time spent correcting her answer after a check stays in, because that is calculation.

### The event log

Each fact is logged in one place (REQ-5072), by ADR-0210's rule: the estimate arrives with the answer, so it is a field, and each check comes before the answer, so it is a type of its own, which ADR-0240 owns:

| Fact | Where | Payload | Requirement |
| --- | --- | --- | --- |
| The estimate | field `estimate` of `attempt_submitted` | `option` (its position, 0 to 3), `value` (the option as a rational) | REQ-5358 |
| Whether the estimate was right | field `estimateRight` of `verdict`, beside `estimateLabel` | a boolean the server judges with the exact answer | REQ-5358 |
| A use of the check | type `self_check_used` | `itemId`, `preliminaryRaw`, `checkRaw`, `checkParsed`, `target`, `match` | REQ-5356 |

The addendum's `self_corrected` is no field: the report derives it from the preliminary answer and the first attempt. `item_shown` gains the estimate's four values and the correct index, `attempt_submitted` gains `estimate` and `timings.checkMs`, and `verdict` gains `estimateRight` and `estimateLabel`, each as a new version of its payload schema under REQ-5066.

### The report

The node card of ADR-0180 gains an estimate matrix for each node with estimates: four cells, estimate right or wrong by exact answer right or wrong, over all the node's first attempts on items with an estimate since the current rules version (REQ-5366), with one more matrix pooled over every node at the top of the summary screen. I chose no time window and a pooled matrix, because at about one estimate per node a week a 60-day window holds 8 or 9 answers, too few to fill even two cells of 5, while the pooled matrix gets about 10 answers a week. An exact answer counts as right at credit 1 and as wrong otherwise, because the matrix asks whether she reached the result and a partial answer didn't, the reading ADR-0060 gives a partial answer in its review ladder; and a «Не знаю» without an estimate stays out. A cell with fewer than 5 answers shows «мало данных» (too little data) (REQ-5368).

The summary screen gains one line per week for the check: the share of first attempts on tasks offering the check on which she used it, the number of answers saved and the number spoiled (REQ-5364). The report compares her preliminary answer at the first check of a task with her first attempt, judged with ADR-0040's checker after that attempt. A change from wrong to right counts as saved (REQ-5360), a change from right to wrong as spoiled (REQ-5362), and any other change as neither.

### What works once it is accepted

Once this decision is accepted, the spec step can write the check route, the packet fields and the three schema versions, and once built, an eligible task asks for an estimate before its answer field, logs the pick with the answer, and shows both verdicts in the review. A bare expression offers a free check that logs each use and reveals only a match. Checking never makes an answer slow, and the parent reads the matrix and the weekly check line. Removing the increment is two catalogue flags set to false, and ADR-0080's flow runs as before. What still doesn't work: the `estimate` stream feeds nothing until a refit after the MVP, the check isn't offered on fractions, longer expressions or word problems, and the Director reads neither the stream nor the labels to choose tasks.

## Why

The owner's addendum 1 decided to build both features, so the question was where they sit in the approved flow without spoiling the first attempt as a measure (RES-4030). Estimating and calculating exactly correlate at only 0.35 in accuracy (Ganor-Stern 2018, in RES-4030), so the pair on the same numbers tells the parent something neither gives alone. The English national curriculum teaches estimating and checking by the inverse together in years 3 and 4, and children aged 8 to 9 monitor their own wrong answers poorly (Bellon, Fias and De Smedt 2020, in RES-4030), so a free check trains a habit primary school asks for.

Every rule that departs from the addendum's wording answers a conflict RES-4030 found. An estimate only on scored tasks tells her the task is scored, which ADR-0080 and SPC-0030 forbid, so the draw reads no purpose. Intervals on a number line can't keep both acceptance rules, so the options are shuffled rounded values. A check prompt on a word problem names the operation the task measures, so the check stays on bare expressions. A flag that only means "changed" counts a spoiled answer as saved, so the report splits the two. The estimate step and the check add time that ADR-0060 and ADR-0070 read, so both leave the speed measures.

The check's comparison target is a printed number, because only that keeps the match free of information: if the server compared her check with the correct answer, the button would be a free verdict before the first attempt (RES-4030 conclusion 8). The estimate travels in `AnswerIn`, because ADR-0210 logs a fact that arrives with the answer as a field of the attempt, and one request makes an early estimate verdict impossible by construction (RES-4030 conclusion 2).

The strongest objection is that the estimate's options still hint at the exact answer. The correct option is the result rounded to one significant figure, so a player who picks the right option knows the order and the first digit of her answer before she calculates it, and ADR-0060 still counts that exact attempt as unassisted. Varied leading digits leave her four candidates for the first digit, and the builder refuses an estimate whose correct option equals the exact answer, but the hint is real: on 38 · 47 the right option still tells her the result is near 2000. I accept this, because the addendum says the exact answer counts "as usual", the estimate appears on about 15 % of eligible tasks, and the first reversal condition below measures the leak directly: if the options helped, her exact accuracy on items with an estimate would stand above her accuracy on the same subtypes without one.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: build neither feature | No new step, control, route or stream; the flow and every measure stay as approved | The owner's addendum 1 imposes both, and REQ-5076 puts them in the first version; the report would never separate "feels the size but miscalculates" from "calculates but doesn't feel the size" |
| The addendum as written: an estimate on scored tasks only, intervals on a number line, the check on one-step word problems, time counted as usual, the labels as error classes | Fewest rules to explain, and the words the owner wrote | Each part breaks an approved rule RES-4030 names: it reveals scored tasks, fails acceptance test 4, gives a hint on word problems, reads a checking player as slow, and overrides traps |
| The estimate sent in a request of its own when she picks, logged as `estimate_submitted` | The pick survives a lost connection or a switch of device, so she never re-picks after seeing the answer field | ADR-0210 logs a fact that arrives with the answer as a field and names no `estimate_submitted` type; the route adds a reply that must look the same for a right and a wrong pick; and a re-pick on resume costs little, because the attempt's time already counts in no measure |
| The client compares the check itself, since both numbers are on screen | No route and no wait, and the check works offline | ADR-0030 makes the server decide everything, and the log still needs each use (REQ-5356), so the client would have to queue an event the server can't verify |
| The estimate's time subtracted like the check's | Keeps the exact answer's time as a fluency observation | Calculation begun during the estimate step leaves the step, so the exact time looks faster than it was and can fall under the rapid-guess minimum |
| Options that are powers of ten only, for 1786: 100, 1000, 10,000 and 100,000 | Show nothing but the order, so no digit of the answer leaks | The nearest power of ten in `log10` isn't the order a child rounds to: for 40 · 90 = 3600 she estimates "thousands" and picks 1000, and the rule marks 10,000 right, so a sound estimate reads as wrong; a rule by digit count would make it a question about the number of digits, not an estimate of the result |
| The estimate after the exact answer: "does your answer look right?" | Leaks nothing to the exact attempt, and asks for the reasonableness check Poloczek and colleagues name (RES-4030) | Her own number anchors the judgement, so a wrong estimate after a wrong answer no longer shows she can't feel the size, and `magnitude_unaware` loses its meaning; it stays the fallback in the first reversal condition |
| The labels mapped into the four error classes, `magnitude` as procedural and `magnitude_unaware` as conceptual | One error-type screen shows everything | A label beside a trap would count one mistake twice, and it would override `unclassified`, which REQ-5330 forbids |

## What it costs

The player pays one extra tap and a few seconds on about 15 % of eligible tasks, and the seconds a check takes when she chooses one. RES-1000's session budget doesn't count either. The simulation check below keeps REQ-2912's floor of 28 scored first attempts in 60 minutes, with estimate and check times added to the profiles' answer times.

The parent pays in weaker evidence, in four places. An item with an estimate gives no time evidence, so fluency and the rapid-guess guard see about 15 % fewer times on eligible subtypes. The exact answer after an estimate carries the hint the strongest objection names. A player who learns that the correct option is never the smallest or the largest by value guesses right one time in two, above the 0.25 REQ-5320 sets. And the matrix fills slowly, because the estimate is rare: at about one estimate per node a week, a node's matrix holds about 26 answers after half a year, and its rarer cells, such as a wrong estimate with a right exact answer, may show «мало данных» for good, which is why the pooled matrix exists.

The template author pays two catalogue flags per subtype, and the building agent pays the option builder, the label function, the check route and three schema versions. A template that fails the option checks ships without an estimate, and the verify report shows the refused share per subtype.

The parent reads one matrix per node and one weekly line, and waits for neither. The design sends the parent no notification: its interruption budget is zero, and nothing in it waits for her. Two weeks without the parent lose no event and leave no queue, because the matrix and the line are projections the log rebuilds.

The security boundary protects the measure of what she does alone before the first attempt. These threats come in order of the likelihood of damage:

1. A packet or reply leaks the correct option: an options list in value order, the correct index, or a check reply derived from the correct answer. The `.strict()` schemas of SPC-0030, the seeded shuffle and the packet test below defend it.
2. The player learns the value rank: the correct option is never the smallest or the largest. The rank condition under What would reverse it watches for it, since no packet rule can hide it.
3. A template flagged for the check whose target isn't printed, so the match judges a hidden step. The build check on `inverseCheck` defends it.
4. The player reads packets in the desktop browser's developer tools. The server sends no correct index and computes nothing from her preliminary answer, so the tools show nothing to read.

Ceilings: one estimate per room and one per floor outside rooms, 3 checks per task, and at most 132 `self_check_used` events on a day of 44 tasks. The matrix grows by at most one answer a room and restarts with each rules version, and the log keeps every answer.

Failure states, each with its next step and one audience:

- `estimate_missing`: an `AnswerIn` arrives for an item that carries an estimate, with no pick and no «Не знаю». The server logs nothing and replies with the estimate step. Audience: the player, who sees the four options again.
- `estimate_refused`: the option builder finds no four options that keep the three errors off the correct one. The item goes out without an estimate, and the room's estimate stays open. Audience: the developer, through the refused share per subtype in the verify report.
- `check_limit_reached`: a fourth check on a task. The button is inactive and the server refuses the request with no event. Audience: the player, who sees only the inactive button.
- `check_late`: a check arrives after the first attempt. The server refuses it and logs nothing (REQ-5338). Audience: the developer, through the route's error count.
- `offline`: the check route needs the server, so with no connection the check button stays inactive, and the pick waits in ADR-0030's answer queue with its answer. Audience: the player.

A request sent twice with one `clientSeq` gets the reply rebuilt from the first request's events, so a check or an answer with its pick is logged once. Two devices can't check or answer at once, because ADR-0030 gives one device the lease.

## What would reverse it

- If, over at least 60 first attempts on items with an estimate, her exact accuracy on them stands more than 15 percentage points above her accuracy on eligible items of the same subtypes that carried none, having lost the draw or been refused, and the difference falls outside a 95 % interval, the options leak the answer. Exact attempts after an estimate then move to a stream of their own, or the estimate moves after the exact answer.
- If, over 8 weeks with at least 20 changed answers, spoiled answers outnumber saved ones, the check teaches her to doubt right answers, and the check's prompt or its place in the flow is reopened.
- If, over at least 20 wrong estimates, fewer than a third of her wrong picks fall on the smallest or the largest option, where a player who ignores rank puts two thirds, she is picking by rank. Then REQ-5320's guess rate of 0.25 is reopened at 0.5 through a new requirement, or the options change.
- If, on a subtype where she opens the check on more than half the tasks over 2 weeks, her median time with the check exceeds twice the fluency threshold while her median time without it is under the threshold, the subtracted time hides a slow habit, and the check's time on that subtype is dropped from every measure, as the estimate's is.
- If the verify report shows the option builder refusing more than 20 % of a subtype's items, that subtype loses `estimate: true` or the rule on the sum of operands is reopened for it.
- If the log shows the share of estimates on scored and unscored items of a subtype differing beyond chance, at the 5 % level over at least 200 eligible items, the draw leaks the scored flag and is reopened.

The premortem, written as though it had happened: three months in, the node card showed her multiplication by round tens as fluent while her written work at school kept losing zeros. The estimate's correct option for 40 · 30 was 1000 rounded from 1200, and on 60 · 50 it was 3000, the exact answer itself, so she learned to copy the digits of the option she picked. The builder rounded to one significant figure and let an option equal the answer. A second cause sat in the check: on two-digit additions she opened the check on every task, the game subtracted its time, and the additions looked fast although she took twice as long to finish them. The builder now refuses such an estimate, the leak condition watches the first cause, the check-time condition the second, and basic facts never offer the check.

## Consequences

- ADR-0020's event catalogue gains `self_check_used`, owned by this decision as ADR-0210's table assigns it, and REQ-5062 holds the server from writing it before its schema exists.
- SPC-0030 gains one route, `POST /api/item/:itemId/check`, idempotent by `clientSeq`. `Room` gains `estimate?: { options }` and `check?: { op, operand, checksLeft }`, `AnswerIn` gains `estimate?: { option }` and its timings `checkMs`, and `AnswerOut` gains `estimate?: { picked, correct }`.
- SPC-0020 gains the new versions of `item_shown`, `attempt_submitted` and `verdict`, and the projections `estimate_stream` and `check_week`.
- ADR-0040's item builder gains the option builder and `estimateLabel(correct, answer, estimateRight)`, both pure functions in `src/shared/` or `src/engine/` with property tests.
- The catalogue gains `estimate` and `inverseCheck` flags per subtype, with the build checks above.
- ADR-0150 draws the four options, the locked pick, the check field and the two match states, and ADR-0160's `ru.json` holds their strings.
- ADR-0190's group 2 gains the option checks and group 3 the rate and session checks below, and the check route joins the answer reply's baseline.

## Amends

- ADR-0080: the window's list of controls becomes REQ-5120's list through ADR-0220's amendment, and ADR-0240 adds no second amendment of it; the estimate's four options and «Проверить нить» with its check field and match signal are on that list.
- ADR-0080: state `open` "shows the task and its controls" becomes "shows the task and its controls, and on an item with an estimate first shows the estimate step, with the answer field hidden and the thread button inactive until she picks; the inverse check runs inside `open` and never after the first attempt".
- ADR-0040: "A wrong answer takes the first class that fits" gains "and after the class, the server writes `estimateLabel` from the estimate and the exact answer, beside the class and the trap and never in their place".
- ADR-0040: the option builder that "fills a choice task's wrong options with the traps' distinct answers first" becomes "does so for a choice task, and builds an estimate's four options by ADR-0240's rule, which the build check on choice classes and the 4-option floor don't cover since the estimate isn't the task's answer".
- ADR-0060: "An attempt with `interrupted: true` or `crossDevice: true` counts for accuracy, but its time counts in no measure" becomes "An attempt with `interrupted: true` or `crossDevice: true`, or on an item that carries an estimate, counts for accuracy, but its time counts in no measure; every other attempt's time excludes `checkMs`".
- ADR-0060: the model's "three parts" become four, with the `estimate` stream as a BKT estimate per node and subtype, `pGuess` 0.25 and `pSlip` 0.10, fed only by the `estimate` field of `attempt_submitted` and feeding no other estimate until the activation rule admits it.
- ADR-0070: "measured on the client from the task's appearance to «Готово» (Done), without pauses" becomes "measured on the client from the task's appearance to «Готово» (Done), without pauses and without `checkMs`; an attempt on an item with an estimate is never a rapid guess".
- ADR-0070: `nextTask` gains the estimate draw `q = min(0.5, 0.15 / (1 - b))`, one estimate per room and one per floor outside rooms, reading no `purpose`.
- ADR-0180: the node card gains the estimate matrix since the current rules version with «мало данных» under 5 answers a cell, and the summary gains the pooled matrix and the weekly check line of use, saves and spoils; the error-type row reads `class` alone.
- ADR-0020: the event catalogue gains `self_check_used`, owner ADR-0240.
- ADR-0190: the answer reply's baseline, p95 at most 300 ms, covers the check route too, because she waits on it on the same path with no model call.
- SPC-0020: `item_shown`, `attempt_submitted` and `verdict` gain the fields under The event log above, each as a new schema version.
- SPC-0030: the routes table, `Room`, `AnswerIn` and `AnswerOut` gain the fields under Consequences above.

## How I will know it was realised

1. A property test on 10,000 seeds per estimate subtype finds four distinct options at least 0.6 apart in `log10`, the correct one second or third by value, each about half the time, ten times, a tenth and, for multiplication, the sum of operands each nearest to a wrong option, and a chi-square test that doesn't reject an even spread of the correct option over the four positions at the 1 % level. The same run finds no accepted estimate whose correct option equals the exact answer, and reports the refused share per subtype.
2. The simulation group plays 30 days on each profile and finds, per estimate subtype over at least 200 scored items, an estimate share between 10 % and 20 %, the same bounds on unscored items, a difference between the two that a two-proportion test doesn't find at the 5 % level, and never two estimates in one room. The 60-minute adventure still yields at least 28 scored first attempts at 1.0 times the fluency threshold with estimate and check times added.
3. A packet test sends every task kind with and without an estimate and a check, and finds no correct index, no option in value order across seeds, no target beyond the printed operand, and no estimate verdict in any reply before `AnswerOut`.
4. A state-machine test finds the answer field hidden and the thread button inactive until she picks, `estimate_missing` on an answer without a pick, `check_late` after the first attempt, and `check_limit_reached` on the fourth check.
5. A label test on fixtures finds `magnitude` on 1800 for 180 with a right estimate, `magnitude_unaware` with a wrong one, `estimate_off_exact_ok` on a right answer with a wrong estimate at credit 1, and on a trap match off by 10 both the trap and the label.
6. A measure test finds that an item with an estimate never makes an attempt `fast` or a rapid guess, and that an attempt with 20 s of `checkMs` is `fast` when its time without the check is under the threshold.
7. A build check fails `inverseCheck: true` on a T template, on 3 · 5 + 7, on a division with a remainder, on a multiplication that can draw a zero operand and on a basic fact.
8. A report fixture shows «мало данных» in a matrix cell of 4 answers and a count in one of 5, and on a week of checks counts a wrong-to-right change as saved, a right-to-wrong change as spoiled and a wrong-to-wrong change as neither.
9. A search of the log schemas finds `estimate` on `attempt_submitted`, no `estimate_submitted` type and no `selfCheck` field, an item with an estimate carrying an empty `forms`, and a search of `ru.json` finds the check's match strings passing ADR-0160's forbidden-word list.

## What this does not settle

- The pixel layout of the four options, the check field and the two match states: ADR-0150 and its specification.
- Whether the `estimate` stream ever feeds the "on her own" estimate or node N4: ADR-0060's activation rule after the MVP refit, under ADR-0210.
- Whether the Director uses the `estimate` stream or the labels to choose tasks: not decided, and nothing reads them for selection in the MVP.
- The check on fractions, on longer expressions and on word problems.
- How the report words the matrix and the check line for the parent: the spec of ADR-0180's screens and ADR-0160's strings.
- The other forms of the owner's addendum 1 and the rules every form shares: their own decisions and ADR-0210.

## Open review findings

- The first review asked to move the route bodies, reply shapes and payload fields into SPC-0020 and SPC-0030 and keep only the facts here. I kept them, because ADR-0080 and ADR-0220 name their events and routes at the same level, and ADR-0020 makes the owning decision of each event type define its payload.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
