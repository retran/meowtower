---
id: ADR-0260
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-5500, REQ-5502, REQ-5504, REQ-5506, REQ-5508, REQ-5510, REQ-5512, REQ-5514, REQ-5516, REQ-5518, REQ-5520, REQ-5522, REQ-5524, REQ-5526, REQ-5528, REQ-5530, REQ-5532, REQ-5534, REQ-5536, REQ-5538, REQ-5540, REQ-5542, REQ-5544, REQ-5546, REQ-5548, REQ-5550, REQ-5552, REQ-5554, REQ-5556, REQ-5558, REQ-5560, REQ-5562, REQ-5564, REQ-5566, REQ-5568, REQ-5570, REQ-5572, REQ-5574, REQ-5576, REQ-5578, REQ-5580, REQ-5582, REQ-5584, REQ-5586, REQ-5588, REQ-5590]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0260. A grouping task takes one room slot a floor, the server scores her links as optimal, valid or none from the template's declared plans, and the score feeds only the short loop and a rational calculation stream outside the knowledge model

## Decision

A grouping task is a room task built from a grouping template: it shows an expression such as `25 · 37 · 4`, lets the player link numbers with taps or mark one number to round, and then takes her answer through the ordinary attempt flow of ADR-0080 (REQ-5500). The server scores the links she submits with her answer as `optimal`, `valid` or `none` in one pure function, and that score reaches three places only: the short loop reward, the rational calculation stream and the report. It never reaches the outcome, the knowledge model or the Director's count of graded first attempts. This decision builds on ADR-0210, which owns the rules every new form of the owner's addendum 1 of 2026-09-28 shares: a stream of its own outside "on her own" (REQ-5024), one record per fact (REQ-5072), the MVP scope that holds rational grouping (REQ-5076) and the build order that puts it last (REQ-5090).

### The template declares everything the score needs

A grouping template is an ADR-0040 template with one more declaration, `grouping`, holding four fields (REQ-5512):

- `hostNode`: the node of RES-0800's node table that holds the plain calculation, such as the node of multi-digit addition for `38 + 47 + 62 + 53`, whose plain steps give 85, 147 and 200 (REQ-5514). A build check finds every step of the plain calculation inside a subtype of the host node, by the same subtype test ADR-0040 already runs for word problems under REQ-0784, so the Director's «Понимает» gate below covers the calculation the task asks for. A template may name A13 only when the same test finds every step inside a subtype of A7 or A11 (REQ-5588).
- `technique`: one of `commutative_associative`, `rounding`, `distributive` or `convenient_pairs` (REQ-5516). A build check fails a product with one factor to round, such as `99 · 6`, that declares anything but `rounding` (REQ-5518), and fails every template that declares `distributive`, because REQ-5518 files every rounded product under rounding and no other item belongs to the distributive law alone; so no template may declare it. A plan whose link joins one of the addendum's convenient pairs, 25 and 4, 125 and 8, or 50 and 2, declares `convenient_pairs`; any other regrouping of an all-addition or all-multiplication expression declares `commutative_associative`; a plan with a mark declares `rounding`. I chose this filing rule, because two authors who filed `25 · 37 · 4` differently would split one skill across two report rows, and the build check fails a template that breaks it.
- `admissible`: every pair of numbers and every single number. A build check fails an expression that mixes operations, so every expression is all additions or all multiplications, and every link or mark on it is mathematically sound (REQ-5524). I chose to make the whole set admissible, because a client that let her link only some pairs or mark only some numbers would show her the shortcut through the controls it disables.
- `optimalPlans`: one or more plans, each either a set of at most 2 links or a single mark, whose computation the build check replays and compares with `solve()` over 1,000 seeds.

A grouping template shows 2 to 5 numbers. I chose 5 as the ceiling, because 5 numbers and 4 operation signs, each in a touch zone of at least 56 px (REQ-5560), make a row of at least 504 px, which fits the task window on the iPad in portrait. `sampleParallel` keeps the technique, the number of numbers and the plan's structure, so a second attempt is a grouping task of the same kind. The MVP ships at least 6 grouping templates, 2 for each of the three techniques a template can declare; I chose 2, because with 1 the repeat window of ADR-0070 would show the same expression shape on every grouping task of a technique.

### The task window draws links and marks and judges none of them

REQ-5120, which ADR-0220 settles, already admits a grouping task's tappable numbers and the loops they draw into the task window. The window draws each number with a touch zone of at least 56 px in both directions around its 24 px glyphs (REQ-5560). A tap on one number and then another draws a knitted loop between them; a long press on a number marks it to round. Each number takes part in at most one link or one mark, because every optimal plan is a set of disjoint pairs or one mark, so a tap on a linked or marked number removes that link or mark. These controls behave the same way on every grouping task, so they reveal nothing about its plans.

She may answer with no link and no mark, at no cost in guiding threads (REQ-5502). The window never colours, ticks, crosses or labels a link as optimal, valid or wrong, before or after the answer (REQ-5564), because RES-0100 conclusion 8 bars verdict marks from the window.

### Links are logged as drawn, each set with its score, and the last set before the answer is the attempt's grouping

Each change to the links sends `POST /api/item/:itemId/grouping` with the whole current set, `{ links, mark, clientSeq }`, and the server scores the set and appends one `grouping_submitted` event (REQ-5566). I chose to send the whole set, because a repeated or reordered request then leaves the same state, and a resume reads only the last event. ADR-0210 names `grouping_submitted` as a type of its own owned by this decision, because she commits the grouping before the answer and a resume must restore it, and it keeps `grouping` off `attempt_submitted`. This decision defines its payload:

| Field | What it holds |
| --- | --- |
| `itemId` | the task |
| `attempt` | 1 or 2 |
| `links` | unordered pairs of positions in the expression, at most 2 |
| `mark` | the position of the number marked to round, or `null` |
| `score` | `optimal`, `valid` or `none`, computed by the server for this set; it never leaves the server before the first answer |
| `change` | the count of changes on this attempt so far, from 1 |
| `capped` | true on the event that reaches the cap of 40 changes, else false |

The reply carries only the accepted set and the `clientSeq`, never a score. The client draws a loop at the tap and sends the request behind it through ADR-0030's queue, which keeps only the newest set per task while the device is offline, so she can draw with no connection. A set still unsent when the app closes is lost, and a resume shows the last logged set, a loss I accept because links cost her nothing to draw again.

`resume_snapshot` restores the current links and mark of an open attempt from the last `grouping_submitted` event (REQ-5568), as ADR-0030's resume point restores the attempt step.

The grouping an attempt submits is the last `grouping_submitted` of that attempt before its `attempt_submitted`, or `none` when she drew nothing, so the links and their score are recorded once, in that event, and no other event repeats them (REQ-5570, REQ-5572). `AnswerIn` gains `lastGroupingSeq`, the `clientSeq` of the last grouping request the client sent. When it differs from the last one the server logged, the server refuses the answer with `grouping_out_of_order`, and the client's queue sends the grouping request first and the answer after it, so an answer never overtakes the links it was given with. `item_shown` carries `forms: ["grouping"]` on every grouping task, as ADR-0210 sets, which is how the model and the stream know the attempt belongs to the `grouping` stream.

### The score is one pure function of the submitted set and the plans

`scoreGrouping(submitted, optimalPlans)` in `src/engine/grouping/` returns `none` for an empty set, `optimal` when the set equals one plan exactly, and `valid` for every other non-empty set (REQ-5504, REQ-5522). In `38 + 47 + 62 + 53`, `38` and `62` linked alone score `valid`, because she still adds the other two numbers the long way. A mark counts as a submitted link. The function calls no language model (REQ-5506) and reads no time, so a replay of the log gives the same score.

The server scores every submission, «Не знаю» (I don't know) included, because the score is apart from the answer. The outcome comes from the verdict alone, as ADR-0140 computes it, and no code path passes the score to the outcome (REQ-5510). No player string or parent string names a score as a mistake (REQ-5508).

`assisted` is true when she bought a hint rung on the task before answering, or when the attempt is the second one (REQ-5574). The hint ladder for a grouping template follows the steps of its first optimal plan, with as many rungs as the plan has real steps (RES-4010 conclusion 4). Any rung marks the grouping assisted, because a rung built from the plan hands her the grouping.

### Before the first attempt ends, the server sends no plan and no score

`ItemViewOut` carries the expression's numbers and signs with their positions and nothing else about the grouping. The plans stay in the `items` row and `item_shown`, and neither the grouping route nor the answer reply carries a score (REQ-5562). The first place the plan reaches the client is `AnswerOut`'s short solution, which shows the first optimal plan beside the direct calculation, whatever she linked (REQ-5578). ADR-0080's packet test gains grouping tasks and asserts both.

### The short loop pays 1 star yarn for an optimal grouping on a clean unassisted first attempt

The short loop, «Короткая петля» (The short loop), grants 1 star yarn through `reward_granted` with source `short_loop` when, and only when, the first attempt is `clean`, unassisted and scored `optimal` (REQ-5526). The rule reads the verdict, `assisted` and the score, and no time field (REQ-5532). The rule therefore ignores ADR-0070's `rapidGuess` mark, which is computed from time; I accept that a guess with optimal links and a right answer earns the yarn, because linking takes taps a rapid guess doesn't make.

The grant plays after the task window closes, in ADR-0080's `closed` state: the scene plays the spell animation `spell.short_loop` in place of the clean spell, and the System window shows the line with key `system.short_loop`, «Обнаружен короткий путь. Длинный путь обиделся» (A short path was found. The long path took offence) (REQ-5528). The engine takes both from content, the animation from the scene's effect data of ADR-0150 and the line from ADR-0160's Russian string file, and sends the Master no part of it (REQ-5530), because RES-1600 conclusion 2 keeps single-task outcomes away from the Master.

The forge recipe amounts stay as REQ-2172 sets them (REQ-5590). `./meowtower yarn-weeks` prints, for each week of 7 game days from Monday, the star yarn granted per source from `reward_granted`, with `short_loop` as its own row (REQ-5534), and below them, per week, the number of floors that logged `no_grouping_candidate` and of attempts that reached `grouping_link_cap`, so the owner can see the two reversal conditions that watch them. The owner reads it at the stage 0.3 review. When a week closes as the second in a row above 60 yarn, about a fifth above RES-2100's typical week of about 50, the server raises the notice `yarn_weeks_high` once, which asks the owner to open a record that resizes the recipes (REQ-5536); it fires again only after a week at or below 60 has closed.

### The game scores the task, and the model never reads it

A grouping task is a scored task in the game: its first attempt gets an outcome, a badge, the streak, the shard and the room and floor shares under ADR-0140's rules. I chose this, because a task that visibly earned less than its neighbours would teach her that grouping tasks don't count, and she could learn to answer them carelessly.

The knowledge model drops every grouping-task attempt from the "on her own" estimate, the fluency estimate, the "with help" estimate, blocks, probes and node states (REQ-5538), through ADR-0210's rule: `item_shown.forms` holds `grouping`, and model v1's `admittedForms` is empty. `grouping` enters `admittedForms` only through ADR-0060's activation rule, and ADR-0210 defers the refit tool until after the MVP, so no model version reads grouping attempts during the MVP (REQ-5540). I extend ADR-0210's drop from "on her own" to the fluency and "with help" estimates for this form, because tap time would read a shortcut as slowness and an assisted grouping attempt shows the plan, not the calculation. The short solution of a grouping task still writes `solution_shown` and marks later tasks of the host node `postFeedback`, because she did see a method, and a later attempt after it is after feedback.

### The rational calculation stream is a projection per technique

The projection `grouping_stream`, ADR-0210's `grouping` stream, holds one row per grouping attempt: technique, host node, template, attempt number, score and `assisted` (REQ-5542). It folds each `attempt_submitted` whose `item_shown.forms` holds `grouping`, takes the score from the last `grouping_submitted` before it, `assisted` from the attempt's own `assisted` flag and attempt number, and the technique and host node from the template version its `item_shown` names. It is an ordinary registered projection of ADR-0020, so a recompute rebuilds it and the check `projection_diverged` compares it with a fresh derivation (REQ-5544). An assisted row stays out of every unassisted figure (REQ-5576).

### The Director offers at most one grouping task a floor, in a room slot

A room slot now has four sources, frontier, review, parent topic and grouping, and `item_shown` records a grouping slot as `flowSlot: grouping` (REQ-5554, REQ-5558). `planFloor` gives a floor a grouping task only when all four gates hold:

1. The floor has no grouping task yet (REQ-5546).
2. A grouping template's host node lies in the floor's domain and has a tested state of at least «Понимает» (understands): understands, understands and needs speed, fluent, fluent by probe or stable, and never an inferred state (REQ-5548). The gate keeps the task on nodes she already calculates correctly, so the grouping shows noticing and not a struggle with the calculation.
3. The volume forecast of ADR-0090, counting no grouping task, still gives the adventure its minimum of graded first attempts of ADR-0070 (REQ-5550).
4. The slot is in a room, never in mental arithmetic (REQ-5556).

Among eligible templates the Director takes the technique with the fewest unassisted first attempts on grouping tasks in the last 30 days, ties broken by the day's seed, because the report's rows count those attempts and a row with fewer than 5 shows no share. The grouping task takes the last slot of the floor's first room, because a floor trimmed to one room keeps it and a grouping task then never opens a room. A grouping-task attempt counts neither towards the minimum of graded first attempts (REQ-5552) nor in the flow corridor's success share, nor as a slot `n` of the review deficit rule, so a grouping task changes no other slot's choice. A second attempt on a grouping task is part of the same task, not a second offer.

### The report shows what she marks when invited, per technique

ADR-0180's Summary screen gains a block «Видит удобные приёмы» (Sees convenient methods) with one row per technique a template declares, which leaves out the distributive law (REQ-5520). Each row shows, over the last 30 days, the share of `optimal` among unassisted first attempts on grouping tasks, with no link counted as `none`, and the number of attempts beside it (REQ-5580). With fewer than 5 such attempts the row shows the count alone, because a share of 1 in 2 reads as a rate it isn't. I chose 30 days, because ADR-0180 reads assisted attempts over 30 days, so the with-help figures beside it count the same period.

Under the block one sentence, `parent.grouping.invited`, tells the parent that the figure counts what she marks when the task invites her to link numbers, and that children use such shortcuts more often when invited than on their own (REQ-5584). The block sets no norm and no colour against `none`, and the string check ADR-0180 runs on `parent.*` values covers its strings (REQ-5586). Assisted groupings appear apart, as a count of assisted attempts and their `optimal` share, among the «с помощью» (with help) figures (REQ-5582).

### Failure states

| Failure state | What happens next | Audience |
| --- | --- | --- |
| `grouping_template_invalid` | A build check fails: mixed operations, an optimal plan whose computation differs from `solve()`, a rounded product not declared `rounding`, a template declaring `distributive`, a technique that breaks the filing rule, a plain step outside the host node's subtypes, an A13 host outside A7 and A11, or more than 5 numbers. The template doesn't ship. | the building agent |
| `grouping_link_rejected` | A link request names a closed attempt or a position outside the expression. The server writes nothing and replies with the current set. | the developer, through test 12 below |
| `grouping_out_of_order` | An answer arrives before the grouping request it names. The server refuses it, and the client's queue resends the grouping and then the answer. | the developer, through test 7 below |
| `grouping_link_cap` | An attempt reaches 40 changes. The server writes one `grouping_submitted` event with `capped: true`, refuses further changes, and the loops stay as they stand; she can still answer. | the owner, through `./meowtower yarn-weeks` |
| `no_grouping_candidate` | No grouping template passes all four gates for the floor. The floor runs without a grouping task, and the `why` field of its first room records it. | the owner, through `./meowtower yarn-weeks` |
| `yarn_weeks_high` | Two weeks in a row closed above 60 star yarn. The notice shows once. | the owner |
| `offline` | Links draw on the device and wait in the queue as one set per task. | the player, who sees only the loops she drew |

I chose 40 changes, because a full plan needs at most 2 links or 1 mark, and 40 is 20 times the largest plan, far past any use but tapping for play.

### What works once this is accepted, and what doesn't yet

Once accepted, a grouping template can be written and checked, the Director can place a grouping task in a room, the player can link, skip and answer, the server scores and logs the grouping, a resume restores the links, the short loop pays and plays, the stream rebuilds from the log, and the report shows the block. It needs ADR-0210's stream rules and ADR-0080's attempt flow beneath it. Without grouping templates the Director finds no candidate and every floor runs as before, so removing the templates removes the increment. The spell animation's art waits for ADR-0170's pipeline and falls back to the clean spell until it ships. The rung texts on a grouping template follow ADR-0220's ladder and wait for its framing. The build order of REQ-5090 puts this item last among the addendum's items.

## Why

The addendum's section 5 sets the form, its three scores, its reward and its stream, and RES-4050 records why each part holds: an answer can't show a shortcut, and a link she draws is the one trace of method the game can collect without written work, speech or an eye tracker (RES-4050, the finding on combining data sources). The same research sets the measure's limit: an invitation raises how often children use shortcuts in addition and multiplication (Hickendorff 2018), so the report names the figure by what it observes.

The score stays apart from the outcome because acceptance test 6 forbids skipping the grouping to lower the outcome, and RES-1700 conclusion 13 allows a spell only three outcomes (RES-4050, the finding on the short loop). It stays out of the model because the addendum keeps every new form out of "on her own" until a refit shows it helps, and because tap time would count a shortcut as slowness in fluency (RES-4050, the findings on ADR-0060 and on fluency).

The server scores and withholds the plans because ADR-0080's first threat, a packet that leaks the answer, has a twin here: a plan in a packet shows her the shortcut (RES-4050, the finding on the server). The whole admissible set follows from the same threat, since a disabled pair is a hint.

The grouping task sits in a room because mental arithmetic is the floor's fluency measure at 2 tasks a floor (RES-3900), and the volley of the addendum's section 8 replaces it on 2 floors of 3 before the M7 test (RES-4050, decided on 2026-09-28). An `optimal` score means one full plan, so the report's figure means she saw the whole shortcut (RES-4050, decided on 2026-09-28).

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep A13's answer-scored templates | no new control, event, reward or report block; no invitation that shifts the measure | the answer can't show a shortcut, so the parent learns nothing about method, and the addendum imposes the form (REQ-5500) |
| Keep links on the client and send them only with the answer | no new route or event type, no cap, fewer requests | a resume after leaving loses the links she drew, which REQ-5566 and REQ-5568 forbid, and the log can't show whether she drew and removed a loop |
| Score the links on the client for an instant response | no round trip, and the client could animate an optimal loop at once | the client would need the plans before the answer, which REQ-5562 forbids, and an instant mark is a verdict in the window (REQ-5564) |
| A `grouping` field on `attempt_submitted`, sent with the answer | one event holds the whole attempt, and the export's `attempts` table gets the grouping with no join | ADR-0210 gives a fact committed before the answer a type of its own, and a field sent only with the answer can't restore links on resume without a second record of the same set |
| The grouping task as an unscored task in the game, with no streak or shard | the game and the model would treat it alike, and a rushed grouping task couldn't raise the streak | she sees a grouping task by its tappable numbers, so a task that earned less would tell her it doesn't count, and REQ-2428 keeps the game from telling her that |
| No short loop: score and report the grouping with no reward | the figure can't become a target, since linking pays nothing | the addendum imposes the short loop (REQ-5526), and a reward that pays for an act and never for time keeps the no-clock rule; the first reversal condition watches the target it risks |
| One grouping task in mental arithmetic, as the addendum also allows | reaches her on every floor whatever its domain, and needs no fourth slot source | it replaces one of the floor's two fluency observations, and the volley removes mental arithmetic on 2 floors of 3 (REQ-5556) |

## What it costs

The player pays up to one room slot a floor that feeds no estimate, and the Director pays it back by planning the minimum without it (REQ-5550). On a day of 3 or 4 floors, grouping tasks can take up to 4 slots, and in practice about 1, because the host node must lie in the floor's domain and most host nodes sit in N and A.

The template author pays a plan list, a host node and a technique per grouping template, and the build check pays 1,000 replays of each plan. The owner pays one more weekly table to read at the stage 0.3 review and one possible notice.

The economy pays up to 1 star yarn a grouping task. RES-4050 gives a ceiling of 21 extra yarn a week at 3 floors a day and 28 at 4 floors, about half that if she finds the full plan half the time; the domain gate lowers it further. The volley's yarn (REQ-5848) and the puzzles' yarn (REQ-5774) land in the same weekly total, so the table per source is what tells which one moved it.

The log pays one `grouping_submitted` event a change, at most 40 an attempt and in practice 1 to 4, about 150 bytes each, or under 1 KB on a typical day beside ADR-0020's estimate of 1 MB. The stream holds one row per grouping attempt, at most 4 a game day. Neither needs a drain: the log never drains by design, and the stream's size follows the attempts.

The interruption budget is zero for the parent: this decision sends the parent no notice, and the parent reads the block when opening the report. The parent judges its wording once, at the stage 0.3 acceptance (REQ-5584, REQ-5586). The owner gets at most one `yarn_weeks_high` notice per run of high weeks, and each asks for one act, opening a record. With nobody attending for two weeks, play goes on, the stream and the yarn table keep folding from the log, and nothing waits for approval.

The security boundary protects the measure of what she notices. In order of likelihood of damage:

1. A packet leaks a plan or a score before the answer. The strict `ItemViewOut`, the empty grouping reply and the packet test defend it.
2. The player reads packets in the desktop browser's developer tools. Only the server's refusal to send plans before the answer defends it.
3. A client that restricts which numbers can be linked shows the shortcut. The whole admissible set defends it.

The strongest objection is that the reward turns the measure into a target. Linking `25` and `4` pays yarn, and convenient pairs repeat, so within weeks she may link the pairs she knows pay whether or not she used them, and «Видит удобные приёмы» then rises while her calculation doesn't change. The tap already records what she marked and not how she calculated (RES-4050), and a reward widens that gap. I keep the reward because the addendum imposes it and it pays for an act and never for time, and I keep the gap visible: the report calls the figure what she marks when invited, the stream stays out of the model, and the reversal conditions below watch for the target.

## What would reverse it

- If, over the first 90 game days with grouping tasks, the `optimal` share on convenient-pairs templates whose pair she has met at least 3 times exceeds the share on templates whose pair is new to her by 0.3 or more, with at least 10 unassisted first attempts of each kind, the figure measures learned pairs, and the short loop's reward or the block's wording reopens. I set 90 days, because stage 0.3's two weeks give convenient pairs only about 5 attempts, and the «Понимает» gate keeps her plain-task accuracy too high to serve as the comparison.
- If a model version that reads grouping attempts passes ADR-0060's held-out comparison after the MVP, the grouping joins the model and REQ-5538's rule changes through a new record.
- If two weeks in a row close above 60 star yarn with `short_loop` as the largest added source, the recipe amounts reopen through REQ-5536's record.
- If `no_grouping_candidate` fires on every floor for 14 game days after cold start, the domain gate or the «Понимает» gate is too strict, and the Director's placement reopens.
- If `grouping_link_cap` fires on more than 1 attempt in 50, she treats the loops as a toy, and the cap or the control reopens.

The premortem, written as though it had happened: at the stage 0.3 review the block still read «0 заданий» (0 tasks). Every host node sat in N and A, the cold start had tested few of them to «Понимает», and the floors of those domains came once in three days, so every floor logged `no_grouping_candidate` and nobody opened the `why` field, which at that time no command counted. When grouping tasks did arrive, the share of `optimal` on `25 · 4` and `125 · 8` reached 0.95 within a week while `38 + 47 + 62 + 53` stayed near 0.3, and the parent read the first figure as a skill she had gained. A template shipped with `99 · 6` declared as `distributive` before the build check covered products, so a distributive row appeared with one attempt. The fourth reversal condition with its count in `yarn-weeks`, the first reversal condition and the second test below exist for these three.

## Consequences

- ADR-0040's template contract gains the optional `grouping` declaration, its build checks and the rule that `sampleParallel` keeps technique, number count and plan structure.
- ADR-0030's API gains `POST /api/item/:itemId/grouping`, `AnswerIn` gains `lastGroupingSeq`, and the resume point restores links and mark.
- `src/engine/grouping/` holds `scoreGrouping`, the admissibility check and the plan replay; `src/shared/events.ts` gains the `grouping_submitted` schema.
- The projection registry gains `grouping_stream`, and `./meowtower` gains `yarn-weeks`.
- ADR-0160's Russian file gains `system.short_loop`, the report block's labels and `parent.grouping.invited`; ADR-0150's scene data gains `spell.short_loop`.
- ADR-0190's verify gains the tests below, and its Baselines table gains the row for 40 link changes an attempt.

## Amends

- ADR-0030: `AnswerIn` gains `lastGroupingSeq`, and the answer route refuses an answer whose grouping request the log doesn't hold yet with `grouping_out_of_order`.
- ADR-0030: the resume point's "attempt step" becomes "attempt step, with a grouping task's current links and mark", and the routes gain `POST /api/item/:itemId/grouping`.
- ADR-0040: the template contract gains the optional `grouping` declaration with `hostNode`, `technique`, `admissible` and `optimalPlans`, checked at build time as ADR-0260 states.
- ADR-0060: the drop ADR-0210 adds for a form outside `admittedForms` becomes, for the `grouping` form, a drop from every estimate, state, probe and block, the fluency and "with help" estimates included.
- ADR-0070: "Every room slot comes from one of three sources, frontier, review or parent topic, recorded in `flowSlot` (REQ-1000)" becomes "Every room slot comes from one of four sources, frontier, review, parent topic or grouping, recorded in `flowSlot` (REQ-5554), and a grouping slot follows ADR-0260's gates".
- ADR-0070: "Mental arithmetic and control facts count" in the success share becomes "Mental arithmetic and control facts count; grouping-task attempts don't, and a grouping slot is not a slot `n` of the deficit rule".
- ADR-0070: "The plan aims at 30 graded first attempts and never plans fewer than 28, or 25 once rooms are trimmed for a slow pace (REQ-1040)" becomes the same sentence ending "counting no grouping-task attempt (REQ-5552)".
- ADR-0080: the packet test's list of task kinds gains the grouping task, asserting no optimal plan and no grouping score before the first answer.
- ADR-0140: the Rewards table gains the row "Short loop: `clean` unassisted first attempt with an `optimal` grouping | - | - | 1 | - | -", a rule that reads no time field and ignores the `rapidGuess` mark.
- ADR-0180: the Summary screen gains the «Видит удобные приёмы» block per technique, and the «с помощью» figures gain assisted groupings.
- ADR-0190: the Baselines table gains "Grouping link changes | at most 40 an attempt | ADR-0260 | chosen | 20 times the largest plan".
- SPC-0020: "What the log records" gains the row "A grouping task's links and mark as drawn, each set with its grouping score; the last before an attempt is the attempt's grouping | `grouping_submitted` | REQ-5566, REQ-5570".

## How I will know it was realised

1. A property test over random submitted sets and every grouping template's plans finds `none` exactly for the empty set, `optimal` exactly for a set equal to one plan, and `valid` for every other set, and the same log replayed gives the same scores.
2. The build check fails a fixture template for each case of `grouping_template_invalid`, and passes every shipped template with every plan replayed over 1,000 seeds.
3. A property test over random logs changes grouping scores and links and finds the outcome, the streak, `node_estimates`, `node_snapshots`, blocks, probes and the graded count unchanged.
4. A replay test finds `reward_granted` with source `short_loop` on exactly the `clean` unassisted `optimal` first attempts, with the same result when every time field in the log is replaced by a random value.
5. The packet test finds no optimal plan and no score in `ItemViewOut`, the grouping reply or any packet before the first answer, and finds the plan in `AnswerOut`'s short solution.
6. A resume test draws links, leaves, resumes on another device and finds the same links and mark with no thread spent.
7. A schema check finds links and grouping scores in `grouping_submitted` only, an answer sent before its grouping request is refused with `grouping_out_of_order` and then accepted after it, and dropping `grouping_stream` and replaying the log gives the same rows.
8. A 90-day simulation finds at most 1 grouping task a floor, none in mental arithmetic, none on a host node below «Понимает» or outside the floor's domain, `flowSlot: grouping` on every one, and no adventure below its graded minimum because of a grouping task.
9. A Playwright test on the tablet viewport measures a touch zone of at least 56 px around every tappable number and finds no mark on any loop before or after the answer.
10. The report test finds no distributive-law row, a count and no share below 5 attempts, and assisted groupings only among the «с помощью» figures.
11. A notice test feeds weekly yarn of 61, 62, 63, 50 and 61, 62 and finds `yarn_weeks_high` raised exactly twice, after the second and the sixth week.
12. An API test sends 41 link changes on one attempt and finds exactly one event with `capped: true` and 40 events in all; it sends a change for a closed attempt and a position outside the expression and finds no event written and the current set in each reply.
13. A diff check finds the recipe amounts in `content/economy.json` equal to REQ-2172's, and fails when they change without a record opened under REQ-5536.
14. At the stage 0.3 acceptance the parent reads the block and its sentence and accepts the wording, and `./meowtower yarn-weeks` prints a figure per source for every week of stage 0.3.

## What this does not settle

- The rules every new form shares, what leaves the Mac, the MVP scope and the build order: ADR-0210.
- The price of the ladder, the framing beside a rung and the twin after rung 2 or 3: ADR-0220.
- The art of `spell.short_loop`: ADR-0170. The Russian wording of the block and its sentence, beyond the strings named here: ADR-0160, with the parent judging.
- Whether a grouping ever joins the knowledge model: a later model version through ADR-0060's activation rule.
- The resized forge recipes, if the yarn rises: the record REQ-5536 opens.
- Expressions that mix operations, and so whether she respects precedence, and a grouping item of the distributive law alone: RES-4050 left both out, and a new research record would bring them in.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
