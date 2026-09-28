---
id: ADR-0220
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-5100, REQ-5102, REQ-5104, REQ-5106, REQ-5108, REQ-5110, REQ-5112, REQ-5114, REQ-5116, REQ-5118, REQ-5120, REQ-5122, REQ-5124, REQ-5126, REQ-5128, REQ-5130, REQ-5132, REQ-5134, REQ-5136, REQ-5138, REQ-5140, REQ-5142, REQ-5144, REQ-5146, REQ-5148, REQ-5150, REQ-5152, REQ-5154, REQ-5156, REQ-5158, REQ-5160, REQ-5162, REQ-5164, REQ-5166, REQ-5168]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0220. One thread opens a task's hint ladder, the ladder has one rung per real step, the familiar frames each rung with a line the parent approved, a rung 2 or 3 hint always brings a twin, and the "with help" estimate keeps a share per depth beside the pooled one

## Decision

The hint ladder changes in five parts, all inside ADR-0080's attempt flow on the server. The price and the twin are one decision, because the twin after a deep hint is what stands against a flat price (RES-4010), and the other three parts share the ladder they describe. ADR-0210 owns the cross-cutting rules this decision builds on: the game day, the separate streams for new forms, what leaves the Mac, the offline key, the owner of each new event type and the stage order. The hint ladder ships in its first build stage, with the fact measurement.

### Price

The first tap on the thread button before an answer opens the task's ladder, spends 1 guiding thread and shows rung 1 (REQ-5100). The server logs `thread_spent` with reason `hint_ladder` (REQ-5154) and `hint_shown` with `ladderOpenedBy: "thread"`. Each later tap on the same attempt shows the next rung, spends nothing and logs `hint_shown` with `ladderOpenedBy: "free_step"` (REQ-5102, REQ-5152). A ladder the familiar opens free on a puzzle logs `free_step` on every rung, and RES-4070's decision owns when that happens. The detailed explanation still costs 1 thread whether or not the ladder is open, and the short solution stays free (ADR-0080, ADR-0120).

The parallel task of a second attempt is a task of its own, so opening its ladder costs 1 thread of its own (REQ-5104). An attempt therefore spends at most 1 ladder opening and 1 explanation, and a task at most 4 threads across both attempts, down from ADR-0080's 8.

The charge key becomes "a ladder opening at most once per item", in place of SPC-0030's "at most once per item and hint level", so a repeated request or a resume never charges again (REQ-5160). The pocket rule of ADR-0080 applies to the opening unchanged: at a stock of 0 the pocket's thread pays for the opening. While the ladder is open the button stays active up to `hintMaxLevel` whatever the stock, because the next rung is free and an inactive button would withhold a rung she paid for. The thread button keeps its label and count while the ladder is open, and the count stays the same on a free rung; I chose this, because a second label for "free" is a string and a state the design doesn't draw, and the familiar's line already frames the rung.

### The ladder's length and contents

A template's `hints(p)` returns one rung for each real step of its computation graph, from 1 to 3 rungs, and never a rung written to make up the count (REQ-5106). A real step is a node of the graph that ADR-0040 already builds. A template with more than three real steps groups them into three rungs, and the author chooses the grouping (REQ-5164). Each rung gives its step without that step's result, so the last rung stops before the last calculation on every ladder (REQ-0542, REQ-5106). ADR-0080's rule that writes rung 2 as an operation and rung 3 as a method on a short template goes, because it is the invented rung REQ-5106 forbids.

A basic fact has a ladder of exactly one rung: a strategy through a known fact, such as «7 · 8 — это 7 · 7 и ещё 7» (7 x 8 is 7 x 7 and 7 more) (REQ-5110). The strategy rung may carry numbers the engine computed and is the only first rung that may (REQ-5112). A template declares `kind: "basic_fact"` in its module, so code tells the strategy rung apart.

The ladder length offered before the answer, `hintMaxLevel`, is fixed when the server shows the task, stored in the `items` row and read from there on every later request. It is 0 when the task is a basic fact placed as mental arithmetic and its fluency threshold for the device that shows it is 10 seconds or less in the active threshold version (REQ-5114). Otherwise it is the length of `hints(p)`. I chose the showing device's threshold, because it is the threshold the attempt is measured against, and fixing the length at show time keeps a cross-device resume from changing it. With `hintMaxLevel` 0 the thread button stays visible and inactive before the answer, as ADR-0080 already does for an attempt with nothing left to buy, and after the answer the short solution carries the strategy line at no charge (REQ-5116, REQ-5162).

The short solution, every rung and every per-trap template explanation fill their numbers from the same graph, so they use the same steps and numbers (REQ-5108, ADR-0040).

Rungs 1 and 2 never state the correct answer as a result (REQ-5118), and no rung on any ladder refers to the graph's answer node. A program checks both. The structural check reads each rung's placeholders and fails a template whose rung names the answer node's value. The seeded check renders every template over 1000 seeds and fails a rung 1 or 2 whose text holds the answer as a number, unless that number is one of the task's givens, as REQ-5118 allows.

### The familiar's framing

The task window shows beside each rung shown before the answer the portrait of the familiar accompanying her and one approved framing line for that familiar's kind and that rung (REQ-5120, REQ-5122). A rung restored on resume shows the same way. The server picks the variant among the approved lines by a hash of `itemId` and rung when it first shows the rung, and stores the picked `framingId` with the rung in `resume_snapshot`, so a resume shows the same line even after the parent approves another. When the stored line has been removed since, the resumed rung shows with the portrait and no line, because a removed line must not show and a new pick would look like a different familiar's voice. When no approved line exists for the kind and rung, the rung shows with the portrait and no line (REQ-5122). A basic fact's strategy rung takes the rung 1 lines. The strategy line after the answer takes no framing, because REQ-5122 covers only rungs before the answer.

`npm run framings:generate` writes the candidates outside any session under the offline role `FRAMING_MODEL`, on the offline key and the content tier, with the planner's model as its default (RES-4000 conclusion 10). It asks for 3 variants for each familiar kind and each rung 1 to 3, in Russian, addressing her as «ты» (you) with no name, as ADR-0120 does. With RES-1900's six to nine familiars the approved set holds at most 81 lines. A candidate enters the parent's review queue only after the code checks and the safety check pass. The code checks reject a line that holds a digit, a Russian cardinal or ordinal numeral in any inflection, «один» and «одна» included (REQ-5126), a placeholder brace, a familiar's name or a word on ADR-0160's forbidden list for the task window. The numeral list sits in `content/numerals.ru.json` as every inflected form, because a stem match would reject «раз» (time, once), which REQ-5126 lets pass. The safety check is ADR-0130's module.

The Parent Room's framing screen shows each candidate with its familiar kind and rung and offers «принять / отклонить / поправить» (accept / reject / edit), as ADR-0130's frame screen does. The parent reads each line for a number, a step, an operation or a reference to a part of the task (REQ-5124), which code can't judge. An edit reruns the code checks at once. Acceptance writes `rung_framing_approved`, and the server shows a line only when the log holds its approval and no later `rung_framing_removed` (REQ-5128). The server writes the approved set to `data/exports/framings.ru.json` after each change, and the owner commits it to `content/framings.ru.json`, the per-language file ADR-0160 asks for player-facing strings. The server serves lines only from the committed `content/framings.ru.json`, as ADR-0130 serves frames, so an approved line reaches play after the owner's commit. A line in the file with no approval event never shows.

### The twin after a deep hint

A first attempt brings one second attempt on a parallel task when it ends `alt`, or when she saw rung 2 or rung 3 on it, whatever its outcome (REQ-5130). A `clean` or `partial` first attempt with no hint or with rung 1 alone brings none (REQ-5132, REQ-5134). An `alt` after rung 3 meets both triggers and still brings one twin. The ban on a third attempt holds, so a rung 2 on the twin brings nothing further.

The twin keeps the first task's template, subtype and difficulty features with new numbers, except that the twin of a problem with a missing number draws at random between a missing-number and a solvable problem of the same tier (REQ-5166). RES-4040's decision owns that draw's share.

The review after a hinted `clean` or `partial` runs as ADR-0080 already runs it for that outcome, and the twin follows the review. ADR-0140 already caps an assisted first attempt at 0.5 in the room and floor shares, with no streak and no shard, and gives a second attempt 3 experience and no buttons. So a right answer after rung 2 earns 3 experience more than one after rung 1 and less than one with no hint, and I keep ADR-0140's rules, which settles RES-4010 conclusion 12 with no amendment.

### Measurement and the report

For each node and subtype the knowledge model keeps four shares of right answers beside the pooled "with help" estimate (REQ-5136, REQ-5140): after rung 1, after rung 2, after rung 3, and on the second attempt. A first attempt counts at its deepest rung, `hintLevel`. A second attempt counts in the fourth share whatever hint it used. Each share is a beta estimate from `α = β = 1` with the pooled estimate's score and weight and the weight `2^(-age in days / 30)` (REQ-5138). I chose the pooled estimate's score and weight, so the four shares' observations add up to the pooled estimate's. The shares sit in the `node_estimates` projection. The pooled estimate stays as ADR-0060 defines it, so «решает с подсказкой» (solves with a hint) and «почти готово» (nearly ready) keep ADR-0180's definitions. Model v1 reads the depth only in these shares (REQ-5142), and a version that reads it elsewhere replaces v1 only through ADR-0060's activation gate (REQ-5144).

The report marks a node «на пороге» (on the threshold) when its state is «Пока не освоено» (not mastered yet) or «Уточняется» (being clarified), it has at least 3 assisted attempts in the last 14 days, first and second attempts alike, and at least 60 % of them were first attempts answered right with rung 1 as their deepest rung (REQ-5146). A second attempt counts in the denominator and never in the numerator, even when it was right with rung 1 on the twin, because it follows a review and a twin's success says less about a nudge than a first attempt's does; I chose this reading of REQ-5146. Every assisted attempt counts in the denominator, as REQ-5146 says, so a node where she mostly needs rung 3 or a twin can't pass on its few rung 1 successes. When a node meets both rules, the report shows «на пороге» and then «почти готово» (REQ-5148), in the Summary list and on the node card.

The node card and the help row show beside «решает с подсказкой» the mean depth of help over the node's attempts in the last 30 days: 0 for a first attempt with no hint, 1 to 3 for its deepest rung, and 4 for a second attempt (REQ-5150). It counts the attempts ADR-0060 doesn't drop and shows one decimal and the count of attempts, because the count tells the parent how much evidence the figure rests on. With no attempt in 30 days it shows «нет данных» (no data), because a 0 would read as "needs no help". The figure answers the parent's question "how much help does she need on this node", from `attempt_submitted` alone. For 30 days after this decision ships, the figure mixes attempts upcast from version 1, whose ladders had three rungs, with attempts on the new ladder lengths, and the node card says so under the figure for that window.

### The log and the resume

`hint_shown` gains payload version 2 with `ladderOpenedBy: "thread" | "free_step"`, and its meaning becomes "a hint rung was shown". `thread_spent` gains version 2, whose reason is `hint_ladder` or `explanation`; version 1's `hint` stays readable and the server never writes it again. `attempt_submitted` gains version 2 with `hintMaxLevel`, 0 to 3, beside `hintLevel`, 0 to 3 (REQ-5156). The upcaster from version 1 sets `hintMaxLevel` to 3, because every ladder before this decision had three rungs. ADR-0080 stays the owner of all three types.

This decision owns two new types:

| Type | Payload | Meaning |
| --- | --- | --- |
| `rung_framing_approved` | `framingId`, `familiarKind`, `rung` (1 to 3), `textHash`, `edited` (boolean) | the parent approved one framing line in the text the hash names |
| `rung_framing_removed` | `framingId`, `textHash` | the parent removed an approved line from play |

The `resume_snapshot` projection keeps, for the task in progress, whether its ladder is open and which rungs she saw. A resume shows them again with their portrait and lines, spends no thread (REQ-5158, REQ-5160) and logs no `hint_shown` (REQ-5168), so the depth of help counts each rung once.

### What works once this is accepted

Once accepted, a task opens its ladder for 1 thread, shows as many rungs as its template has real steps, and sends a hinted attempt at rung 2 or 3 to a twin, with the ledger correct across resume. The report shows «на пороге» and the mean depth, and the model keeps the shares by depth. Everything works with no approved framing line, because the portrait then shows with no line, and with `FRAMING_MODEL` unavailable, because only the generator needs it. What doesn't work yet: framing lines in English and Dutch, which need `framings.en.json` and `framings.nl.json`; a model version that reads the depth, which waits for play data; puzzles' free ladder, which RES-4070's decision adds; and a brake on a ladder of one rung, a one-step template or a basic fact, whose only rung is rung 1 and so never brings a twin under REQ-5130.

## Why

The owner's addendum 1 of 2026-09-28 imposes the price, the twin, the length by real steps, the basic-fact strategy, the fluent-fact rule, the framing and the shares by depth, and research decided the open points on the owner's instruction (RES-4010). What remained for this decision is how to carry them out on the approved record without breaking it.

The price and the twin go together, because one thread now buys rung 3, "every step except the last calculation", which is the "click through to the answer" pattern RES-0500 priced hints to prevent, citing 72 % unproductive help seeking in Aleven and colleagues (2006). The twin checks whether a deep hint taught the step, and the `assisted` flag keeps every hinted attempt out of the "on her own" estimate (REQ-0922), so a cheap ladder costs observations and never corrupts one.

The ladder length is fixed at show time and stored with the task, because the length decides the price's worth, the twin's trigger and `hintMaxLevel`, and a length recomputed later could disagree with what she saw. The answer check is structural first, because placeholders show which graph node a rung names on every seed, where a string search over 1000 seeds catches only what it samples; the string search stays, because REQ-5118 names it.

The framing follows ADR-0130's library pattern and not ADR-0120's show-then-hide, because the line shows before the attempt that measures her and the set is small enough to read (RES-4010, REQ-5128). Approval lives in the log as an event with a hash, for ADR-0130's reason: code checks an event at load, and anyone can edit a line in a file. The framing is written per familiar kind and rung and never per template, so it can't know the task, and a line naming "the first question" is wrong for a template whose first step is something else (RES-4010); code catches numbers, and only a person catches task content.

The pooled estimate stays beside the shares, because two report figures read it and changing their definitions was nobody's request (RES-4010). «На пороге» reads the rule state, because ADR-0180 derives every label from an explicit rule over counted attempts.

The strongest objection is that under the approved economy of about 8 to 10 threads a day and a stock of up to 30, one thread is almost no price at all, so she can open a ladder on a third of the day's tasks and walk to rung 3 on each. The twin then carries the whole brake, and a twin costs her a minute she may learn to accept, and on a right answer after rung 3 the twin can be answered by copying the method she just read. I accept this, because the measure of what she does alone stays clean whatever she spends, ADR-0080's reversal on assisted first attempts above 30 % already watches the quantity that matters, and the first two reversals below watch rung 3 directly, the second against her next unassisted attempts, which a copied method can't pass.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep ADR-0080, one thread a rung, three rungs everywhere, no framing, a twin only after `alt` | Each deeper rung has a price, so pressing through to rung 3 costs 3 threads; no new review queue for the parent | The owner's addendum overrides it, and the owner's reason is that a child saves threads and stops at rung 1 exactly where a walkthrough is needed (RES-4010) |
| Keep one thread a rung and add the twin after rung 2 or 3 | Two brakes on pressing through, the price and the twin | It keeps the saving the addendum removes, and the approved requirements REQ-5100 and REQ-5102 forbid it |
| A free ladder with the twin | No currency to explain, and she never hesitates to ask | The addendum rejects it, because threads would lose their worth and she would press hints without thinking (RES-4010) |
| Frame each rung live per task, with the template's step named | A line that fits the task, such as pointing at the right question | A model call before the measuring attempt is what REQ-0534 forbids for rungs, and a live line can't be approved before it shows (REQ-5128) |
| Replace the pooled "with help" estimate by the shares | One estimate per depth and nothing redundant | «решает с подсказкой» and «почти готово» read the pooled figure, and both would need new definitions (REQ-5140) |

## What it costs

The player pays time for the new twins: about 1 to 2 minutes a day if rung 2 or 3 comes on 10 % of 28 to 44 first attempts, and 4 to 7 minutes at the help-share flag's 30 %, by RES-4010's arithmetic. RES-1000's session budget counts reviews and second attempts at about a fifth of task time, and this decision cites that budget and doesn't change it.

The measure pays observations: a cheaper ladder means more assisted first attempts, each lost to the "on her own" estimate. The thread ledger spends less, so the stock sits at 30 more often and more threads turn into buttons, which ADR-0080's balance check in ADR-0190's simulation reports.

The measure pays again on ladders of one rung, a one-step template or a basic fact: rung 1 is the whole ladder, so no twin follows a hinted right answer there (REQ-5130), and the "with help" estimate on those templates rests on answers the twin never checks. REQ-5130 fixes the trigger, so this decision records the gap and a reversal for it.

The template author pays a ladder per template sized to its real steps, the `kind` declaration, a grouping for templates over three steps, and placeholders that the structural check can read. The code pays a new payload version and an upcaster for each of `hint_shown`, `thread_spent` and `attempt_submitted`, the framing generator and screen, two event types, four shares per subtype in `node_estimates` and two report figures.

The parent pays reading the framing candidates: at least 81 for the first set, at about 15 seconds each by my estimate, so about 20 minutes, and at least 9 for each new familiar kind. Each rejection brings a new candidate to read, and the queue never holds more than 5 candidates for a kind and rung at once. The owner pays a commit of `data/exports/framings.ru.json` after each batch of approvals, because the server serves only the committed file; until the commit, approved lines wait and rungs show without them. The parent also judges at each stage acceptance whether each rung is a real step (REQ-5106), inside ADR-0190's acceptance. The parent is never needed in real time: the design sends no notification, the framing screen shows its count when the parent opens the Parent Room, and its interruption budget is zero. If nobody opens the screen for two weeks or a month, every rung shows with the portrait and no line, play loses nothing, and the candidates wait.

Ceilings and drains:

- threads: at most 1 ladder opening and 1 explanation an attempt, 4 a task;
- approved lines: 3 for each familiar kind and rung, so 9 a kind;
- candidates: the queue holds at most 5 candidates for a kind and rung at once, so at most 135 at 9 kinds, and a candidate older than 60 days expires from the candidates file, as ADR-0130's do, because a candidate costs cents to write again;
- shares by depth: four beta pairs per subtype, a fixed size;
- the log grows by one `hint_shown` a rung, which ADR-0020's log already bounds.

The security boundary protects the measure of what she does alone, and these threats come in order of the likelihood of damage:

1. A rung holds the answer, most likely on a one-step template. The structural and seeded checks defend it.
2. A framing line carries a number or task content that misleads her before the answer. The code checks catch numbers, and the parent's reading catches content.
3. A replayed request opens a ladder twice. The charge key per item defends it.
4. The inactive button tells her a task is a fluent fact, which she can see from the task, and nothing about whether it is scored, so REQ-2428 holds.

Failure states, each with its next step and one audience:

| State | Next step | Audience |
| --- | --- | --- |
| `hint_level_beyond_ladder` (`400`) | a request names a rung past `hintMaxLevel`, a rung on a ladder of length 0 included; the server shows and charges nothing | the developer, in the error log |
| `hint_level_skipped` (`400`, SPC-0030) | unchanged | the developer |
| `no_threads` (`409`, SPC-0030) | now only for a ladder opening or an explanation; the button turns inactive | the player, who sees only the inactive button |
| `framing_missing` | the rung shows with the portrait and no line | the parent, as the count of kinds and rungs with no approved line on the framing screen |
| `framing_check_failed` | the candidate never enters the queue, and the generator logs the failing check | the owner, in the generator's output |
| `framing_uncommitted` | an approved line isn't yet in the committed `content/framings.ru.json`; the rung shows without it | the owner, as the count of approved lines awaiting a commit on the framing screen |
| `framing_unapproved` | the server skips a line in the file with no approval event | the owner, reported once at start |
| `framing_generation_failed` | the generator stops, the queue keeps what it holds, play is unaffected | the owner, in the generator's output |
| `twin_unavailable` (ADR-0080) | now also after a hinted `clean` or `partial`; the review closes with no twin | the developer |

## What would reverse it

- If, over 14 game days with at least 20 hinted first attempts, more than half the hinted first attempts reach rung 3 and the twins after them are right less than half the time, the flat price lets her press through without learning, and the price per rung goes back to research.
- If, over 14 game days, on nodes where more than half the hinted first attempts reach rung 3, with at least 10 twins after rung 3 across those nodes, the twins after rung 3 are right at least 30 percentage points more often than her next unassisted first attempts on the same nodes, the twin is answered by copying the method she just read and brakes nothing, and the price per rung goes back to research.
- If, over 14 game days with at least 20 hinted first attempts, more than a third of them fall on ladders of one rung, where no twin follows, the flat price has no brake on the templates most likely to leak the answer, and the twin trigger for one-rung ladders goes back to research.
- If ADR-0080's condition of assisted first attempts above 30 % over 7 adventures fires within a month of this decision's code shipping, where it hadn't before, the flat price moved the help share, and the price goes back to research.
- If second attempts brought only by a hint, after a `clean` or `partial` answer, pass 7 minutes a day averaged over 7 adventures, RES-4010's upper estimate is wrong, and the twin after a hinted right answer is reopened.
- If the parent removes more than 1 in 5 approved framing lines within 30 days of approving them, the checks and the reading let task content through, and the framing goes back to research, to be dropped to a portrait alone or written per template.
- If, over a month, more than half the nodes marked «на пороге» are basic facts, whose one rung is the whole strategy, the mark tells the parent a nudge is enough where the full hint was needed, and research narrows it to ladders of two rungs or more.

The premortem, written as though it had happened: three months in, the report showed her fractions nodes «на пороге» while she couldn't start a fraction problem alone. She had learnt that one thread bought the whole ladder, opened it on most fraction tasks, read rung 3 and answered right, and the twin after it reused the method on the next screen, so the twins came back right too. The help share rose past 30 %, the parent's flag fired, and the parent read it as a hard week. The first reversal condition never fired, because it waits for twins that are right less than half the time and these twins were right, so nothing reopened the price for a month. Separately, a framing line «Смотри на первый вопрос» (Look at the first question) passed the parent's quick reading and showed on one-question templates for weeks. The reversal that compares twins with her next unassisted attempts and the removal count exist for these.

## Amends

- ADR-0080: state 1, "Each tap on the thread button buys the next hint rung", becomes: the first tap opens the ladder for 1 thread and shows rung 1, and each later tap shows the next rung free, up to `hintMaxLevel`.
- ADR-0080: state 4, "`twin_open`, only after `alt`" and "After `partial` no twin follows (REQ-0418)", become: `twin_open` after `alt`, or after any outcome when she saw rung 2 or 3; no twin after `clean` or `partial` with no hint or rung 1 alone (REQ-5130, REQ-5132, REQ-5134).
- ADR-0080: "The ladder has three rungs (REQ-0532)", the rule for templates of fewer than three steps and "rung 1 says what the task asks and where to start with no numbers (REQ-0538)" become: one rung per real step up to three, grouped above three, a basic fact's single strategy rung with engine numbers, and no ladder before the answer on a fluent mental-arithmetic fact (REQ-5106, REQ-5110, REQ-5112, REQ-5114, REQ-5164).
- ADR-0080: the task window's contents, "with no sprite, effect or story text (REQ-0108)", become REQ-5120's list, with the familiar's portrait and approved framing line beside a shown rung.
- ADR-0080: "Each hint rung bought before answering and each detailed explanation bought after answering costs exactly 1 thread" becomes: opening the ladder costs 1 thread, further rungs nothing, the explanation 1 thread, the twin's ladder 1 thread of its own.
- ADR-0080: "When the stock is 0 and the pocket has given its thread, or when the attempt has no action left to buy, the button stays visible and inactive" gains: while the ladder is open and a rung remains, the button stays active whatever the stock.
- ADR-0080: the ceiling "An attempt holds at most 3 rungs and 1 explanation, so a task spends at most 8 threads" becomes: at most 1 ladder opening and 1 explanation an attempt, 4 threads a task.
- ADR-0080: test 1's "no twin after `clean` or `partial`" becomes: no twin after `clean` or `partial` with at most rung 1, and one twin after any outcome with rung 2 or 3.
- ADR-0080: test 3's "three distinct rung texts, no digit in rung 1 and no rung containing the correct answer" becomes this decision's test 3.
- ADR-0080: Consequences' `hints(p)` "with three texts" becomes "with 1 to 3 texts, one per real step", and the event list gains `ladderOpenedBy`, the reason `hint_ladder` and `hintMaxLevel`.
- ADR-0040: "the three hints" and `hints(p)` become a ladder of 1 to 3 rungs, one per real step of the graph, and a template gains the `kind` declaration.
- ADR-0060: "'With help' does the same over assisted attempts only" gains four shares by depth beside it, each a beta estimate with the same score, weight and 30-day half-life, read only by the report in model v1.
- ADR-0150: `TaskWindow` gains an optional portrait and framing line beside a shown rung, and nothing else from the scene.
- ADR-0180: the Summary list and the node card gain «на пороге», shown before «почти готово»; the node card and the help row gain the mean depth of help over 30 days; "Assisted attempts reach the report only in the «с помощью» figures" gains both.
- ADR-0020: the catalogue's `hint_shown` becomes "a hint rung was shown", `thread_spent` becomes "a thread was spent on opening a hint ladder or an explanation", and the catalogue gains `rung_framing_approved` and `rung_framing_removed`, owned by ADR-0220.
- ADR-0100: the role list gains `FRAMING_MODEL`, an offline role on the offline key and content tier with the planner's model as default, called only by `npm run framings:generate`.
- ADR-0190: the Baselines table gains the framing candidate ceiling of 5 per familiar kind and rung and its 60-day expiry.
- SPC-0030: the charge key "a hint is charged at most once per item and hint level" becomes "a ladder opening is charged at most once per item"; `409 no_threads` covers "a ladder opening or an explanation"; the error table gains `400 hint_level_beyond_ladder`; `HintOut` gains the framing line and the familiar kind; `Room` and `ResumeOut` carry the shown rungs with their lines in place of "the hint levels already shown".
- SPC-0020: the attempt row's "the assisted flag and the hint level" becomes "the assisted flag, the hint level and the ladder length".

## Consequences

- ADR-0020's catalogue gains two types and three payload versions with upcasters, in the same change as their schemas in `src/shared/events.ts`.
- `src/server/play.ts`'s hint route changes its charge from one a rung to one a ladder, and the stand-in hints in `src/server/standin.ts` shrink to each stand-in template's real steps.
- Every template in `src/templates/` declares its `kind` and returns a ladder of its real steps; the building agent reworks the stage 0.1 templates first, since the ladder ships with the fact measurement (ADR-0210).
- ADR-0190's verify group 2 gains the structural and seeded rung checks and the ladder-length check; its simulation keeps the balance check and gains a count of twins brought by hints alone.
- The Parent Room gains the framing screen, and `content/framings.ru.json` and `content/numerals.ru.json` join the content files.
- ADR-0160's files gain the framing lines' file for each language and the string «нет данных» for the mean depth.

## How I will know it was realised

1. A ledger test opens a ladder and shows rungs 1 to 3: exactly one `thread_spent` with reason `hint_ladder` and three `hint_shown`, the first `thread` and the others `free_step`. After a resume and a repeated request with a new `clientSeq`, the count of `thread_spent` and `hint_shown` is unchanged, and `attempt_submitted` carries the right `hintLevel` and `hintMaxLevel`. With the stock at 0 and the pocket used after the opening, the button stays active and rungs 2 and 3 still show.
2. A state-machine test drives `clean`, `partial` and `alt` at hint levels 0, 1, 2 and 3: a twin follows every `alt` and every outcome at levels 2 and 3, none follows `clean` or `partial` at levels 0 and 1, and no twin brings a third attempt. Opening the twin's ladder spends 1 thread, and no task spends more than 4.
3. A template test runs every template over 1000 seeds: the ladder has 1 to 3 rungs and no two identical, rung 1 has no digit unless the template is a basic fact, a basic fact has exactly one rung, no rung's placeholders name the answer node, and no rung 1 or 2 holds the answer outside the givens.
4. A test shows a fluent mental-arithmetic basic fact with `hintMaxLevel` 0, the button inactive before the answer, `hint_level_beyond_ladder` on a forced request, and the strategy line in the short solution after the answer with no thread spent.
5. A framing test feeds lines with a digit, «одна», «третьему», a brace and a familiar's name, and each fails before the queue; «раз» passes. A line in `content/framings.ru.json` with no `rung_framing_approved` never shows, and one removed by `rung_framing_removed` stops showing.
6. A Playwright test on the tablet viewport shows each rung with the portrait and an approved line, the same line after a resume even when the parent approved another line for that kind and rung in between, and the portrait alone when no line is approved or the stored line was removed.
7. A model test feeds assisted attempts at each depth: the four shares move and the pooled estimate, `pKnow` and fluency move as ADR-0060 says; with every weight at age 30 days each share gives each attempt half its weight.
8. A report test builds logs that meet «на пороге» alone, «почти готово» alone and both, a log with 3 rung 1 successes among 6 assisted attempts, which doesn't meet it, a log with 3 rung 1 successes and 2 second attempts among 5 assisted attempts, which does, and a log with 2 rung 1 first-attempt successes and 1 right second attempt with rung 1 among 3 assisted attempts, which doesn't; the mean depth shows 4 for a second attempt and «нет данных» with no attempt.

## What this does not settle

- When the thread button first appears: RES-4120's decision (REQ-6250).
- When the familiar opens a ladder free on a puzzle: RES-4070's decision.
- The share of missing-number twins: RES-4040's decision.
- The offline key's budget and what leaves the Mac for `FRAMING_MODEL`: ADR-0210 and ADR-0100.
- The framing lines in English and Dutch.
- Whether a knowledge model version reads the depth: the refit and ADR-0060's gate decide, with play data.
- The look of the portrait and line in `TaskWindow`: ADR-0150 and the design system.
- The thread economy's grants: ADR-0080 keeps them, and the first reversal condition above reopens only the price.

## Open review findings

A reviewer found that a ladder of one rung never brings a twin, because REQ-5130 triggers the twin on rung 2 or 3, so the flat price has no brake on one-step templates and basic facts. I kept the trigger, because REQ-5130 is approved and only RES-4010 can change it; the decision records the gap under What works and What it costs and gives it a reversal condition.

A second reviewer suggested moving the payload fields and the event table out of this decision into ADR-0020's catalogue and SPC-0030. I kept them, because the brief for the addendum's decisions makes the decision that needs a new event type name it and its payload fields and own it, and ADR-0020 gives each type one owning decision that defines its payload.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0370, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
