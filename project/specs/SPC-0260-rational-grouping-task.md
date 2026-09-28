---
id: SPC-0260
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-5500, REQ-5502, REQ-5504, REQ-5506, REQ-5508, REQ-5510, REQ-5512, REQ-5514, REQ-5516, REQ-5518, REQ-5520, REQ-5522, REQ-5524, REQ-5526, REQ-5528, REQ-5530, REQ-5532, REQ-5534, REQ-5536, REQ-5538, REQ-5540, REQ-5542, REQ-5544, REQ-5546, REQ-5548, REQ-5550, REQ-5552, REQ-5554, REQ-5556, REQ-5558, REQ-5560, REQ-5562, REQ-5564, REQ-5566, REQ-5568, REQ-5570, REQ-5572, REQ-5574, REQ-5576, REQ-5578, REQ-5580, REQ-5582, REQ-5584, REQ-5586, REQ-5588, REQ-5590]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The rational grouping task: its template, links, score, short loop, stream and report block

## Scope

This document covers the rational grouping task from end to end: the `grouping` declaration on a template and its build checks, the task window's links and marks, the grouping route and the `grouping_submitted` event, the pure function `scoreGrouping`, the short loop reward, the `grouping_stream` projection, the Director's placement of a grouping task, the «Видит удобные приёмы» (Sees convenient methods) block of the report, and the weekly yarn table `./meowtower yarn-weeks`. It is written at the component level: modules, routes, packets, events, projections and the rules each applies. ADR-0260 holds the reason for every rule and number stated here.

It leaves out what other documents state. SPC-0030 states the play API's shared contract, the lease, the resume point and the answer queue, and SPC-0020 states the event log, `appendEvents` and the projection registry. SPC-0040 states the template contract a grouping template extends, SPC-0070 the Director's other slot sources, SPC-0080 the attempt flow and the hint ladder, SPC-0140 the other rewards and the forge recipes, SPC-0060 the knowledge model and the rule for new forms, and SPC-0180 the rest of the report.

## Boundary

### Modules

| Module | What it holds |
| --- | --- |
| `src/engine/grouping/` | `scoreGrouping`, the admissibility check and the plan replay |
| `src/shared/api.ts` | the grouping route's request and reply, `AnswerIn.lastGroupingSeq`, and the grouping part of the room view |
| `src/shared/events.ts` | the `grouping_submitted` schema |
| the projection registry | `grouping_stream` |
| `./meowtower yarn-weeks` | the weekly yarn table |
| `content/` | `system.short_loop`, `parent.grouping.invited` and the block's labels in the Russian string file; `spell.short_loop` in the scene effect data |

### Template declaration

A grouping template is a template of SPC-0040 with a `grouping` declaration of four fields (REQ-5512):

| Field | What it holds |
| --- | --- |
| `hostNode` | the node of RES-0800's node table that holds the plain calculation, or A13 (REQ-5514) |
| `technique` | `commutative_associative`, `rounding`, `distributive` or `convenient_pairs` (REQ-5516) |
| `admissible` | every pair of numbers and every single number of the expression |
| `optimalPlans` | one or more plans, each a set of at most 2 disjoint links or a single mark |

### Routes

| Route | What it does |
| --- | --- |
| `POST /api/item/:itemId/grouping` | `{ links, mark, clientSeq }`, the whole current set. The server scores the set and logs one `grouping_submitted`. The reply carries the current logged set, the `clientSeq` of the request that logged it, and `capped`, and no score. |
| `POST /api/session/:id/answer` | `AnswerIn` gains `lastGroupingSeq`: the `clientSeq` of the last grouping request the client sent on this attempt, or, once a grouping reply has named a different request, the `clientSeq` that reply names; `null` when the client sent no grouping request on this attempt. |

The room view of a grouping task carries the expression's numbers and signs with their positions and nothing else about the grouping.

### Event

`grouping_submitted`, v1, owned by this part:

| Field | What it holds |
| --- | --- |
| `itemId` | the task |
| `attempt` | 1 or 2 |
| `links` | unordered pairs of positions in the expression, at most 2 |
| `mark` | the position of the number marked to round, or `null` |
| `score` | `optimal`, `valid` or `none` |
| `change` | the count of changes on this attempt so far, from 1, or 0 on the event the server appends for an attempt with nothing drawn |
| `capped` | true on the event that reaches the 40th change, else false |

`item_shown` carries `forms: ["grouping"]` and `flowSlot: grouping` on every grouping task. `reward_granted` carries the source `short_loop` for the short loop.

### Projection

`grouping_stream`, the projection of the `grouping` stream SPC-0060 lists, holds one row per grouping attempt: technique, host node, template, attempt number, score and `assisted`.

### Statuses and error names

| Name | Audience | Meaning |
| --- | --- | --- |
| `grouping_template_invalid` | the building agent | a grouping template fails a build check and doesn't ship |
| `grouping_link_rejected` | the developer | a grouping request names a closed attempt or a position outside the expression |
| `grouping_out_of_order` | the developer | an answer's `lastGroupingSeq` differs from the `clientSeq` of the attempt's last `grouping_submitted` |
| `grouping_link_cap` | the owner | an attempt reached 40 changes |
| `no_grouping_candidate` | the owner | no grouping template passes the Director's four gates for a floor |
| `yarn_weeks_high` | the owner | two weeks in a row closed above 60 star yarn |

### What this part requires from other parts

- SPC-0040 supplies the template contract, `solve()`, `sampleParallel`, the subtype test and the repeat window.
- SPC-0020 supplies `appendEvents`, the projection registry, the recompute and the check `projection_diverged`.
- SPC-0030 supplies the answer route, `clientSeq` idempotence, the device queue and the resume point.
- SPC-0080 supplies the attempt flow, the `closed` state, the hint ladder and the packet test.
- SPC-0070 supplies `planFloor`, the volume forecast and the graded minimum.
- SPC-0060 supplies the drop rule for a form outside `admittedForms`.
- SPC-0140 supplies `reward_granted` and the forge recipes, and SPC-0180 the Summary screen and the string check on `parent.*` values.

The permitted dependencies run one way. `src/engine/grouping/` imports only `src/shared/` and the template types, and never the model gateway, a clock or the database. Route code writes to the log only through `appendEvents`. The client imports only `src/shared/`. `grouping_stream` reads only the log.

## Behaviour

### The task

A grouping task is a room task built from a grouping template. The task window shows an expression such as `25 · 37 · 4`, lets the player link two numbers with taps or mark one number to round, and then takes her answer through the ordinary attempt flow (REQ-5500). She can answer with no link and no mark, at no cost in guiding threads (REQ-5502).

A grouping template shows 2 to 5 numbers, and every expression is all additions or all multiplications, so every link and every mark on it is sound (REQ-5524). `admissible` holds every pair and every single number, and the client lets her link any pair and mark any number. `sampleParallel` keeps the technique, the number of numbers and the plan's structure, so a second attempt is a grouping task of the same kind. The MVP ships at least 6 grouping templates, 2 for each of `commutative_associative`, `rounding` and `convenient_pairs`.

### The template's build checks

The build runs these checks on every grouping template, and a template that fails one gets `grouping_template_invalid` and doesn't ship:

1. Every step of the plain calculation lies inside a subtype of `hostNode`, by SPC-0040's subtype test (REQ-5514).
2. A template whose `hostNode` is A13 has every step inside a subtype of A7 or A11 (REQ-5588).
3. A product with one factor to round, such as `99 · 6`, declares `rounding` (REQ-5518).
4. No template declares `distributive` (REQ-5516).
5. A plan whose link joins 25 and 4, 125 and 8, or 50 and 2 belongs to a template declaring `convenient_pairs`; any other regrouping of an all-addition or all-multiplication expression to `commutative_associative`; a plan with a mark to `rounding`.
6. The expression mixes no operations (REQ-5524) and shows at most 5 numbers.
7. Each optimal plan's computation, replayed over 1,000 seeds, equals `solve()`.

### Links and marks in the task window

The window draws each number with a touch zone of at least 56 px in both directions around its 24 px glyphs (REQ-5560). A tap on one number and then another draws a knitted loop between them, and a long press marks a number to round. Each number takes part in at most one link or one mark, and a tap on a linked or marked number removes its link or mark. At most one number carries a mark: a long press on another number moves the mark to it, and a long press on a linked number does nothing. After a grouping reply with `capped: true`, the window takes no more taps or long presses on the numbers of that attempt and keeps the loops as they stand. The controls behave the same way on every grouping task.

The window never colours, ticks, crosses or labels a link or a mark as optimal, valid or wrong, before or after the answer (REQ-5564).

### Logging the links

Each change to the links or the mark sends `POST /api/item/:itemId/grouping` with the whole current set, and the server scores the set and logs one `grouping_submitted` (REQ-5566). The client draws the loop at the tap and sends the request through SPC-0030's persisted answer queue, which keeps every set in order and drops none of them, up to the 40 changes of `grouping_link_cap` (REQ-5566). A set still unsent when the app closes stays in the queue and goes out when the app opens again.

The resume point restores the links and the mark of an open attempt from the last `grouping_submitted` whose `attempt` is that attempt's number (REQ-5568). A second attempt shows the parallel expression `sampleParallel` gives, and its window opens with no loops and no mark.

The grouping an attempt submits is the last `grouping_submitted` of that attempt before its `attempt_submitted`. When she submits an attempt with nothing drawn, the server appends a `grouping_submitted` with no links, no mark and the score `none` in the attempt's transaction, before its `attempt_submitted`. That event records the links and their score, and no other event repeats them: `attempt_submitted` carries no grouping field (REQ-5570, REQ-5572). `lastGroupingSeq` is `null` when an attempt opens, and the server accepts `null` when the attempt has no `grouping_submitted` and appends the empty one. When `AnswerIn.lastGroupingSeq` differs from the `clientSeq` of the attempt's last `grouping_submitted`, or is `null` while the attempt has one, the server refuses the answer with `grouping_out_of_order`, and the client's queue sends the grouping request first and the answer after it. A refused grouping request logs nothing, and its reply names the request that logged the current set, so the client's next `lastGroupingSeq` matches the log and the answer goes through.

### The score

`scoreGrouping(submitted, optimalPlans)` returns `none` for an empty set, `optimal` when the set equals one optimal plan exactly, and `valid` for every other non-empty set; a mark counts as a submitted link (REQ-5504, REQ-5522). In `38 + 47 + 62 + 53`, `38` and `62` linked alone score `valid`. The function calls no language model (REQ-5506) and reads no time, so a replay of the log gives the same score.

The server scores every submission, «Не знаю» (I don't know) included. The outcome comes from the verdict alone, and no code path passes the score to the outcome (REQ-5510). No player string or parent string presents a score as an error (REQ-5508).

A grouping is `assisted` when the player bought a hint rung on the task before the answer, or when the attempt is the second one (REQ-5574). The log records it in the `assisted` flag of the attempt's `attempt_submitted`, which SPC-0080 sets on a shown rung and on every second attempt, and `grouping_stream` copies that flag. The hint ladder of a grouping template follows the template's computation graph, the long way in written order, one rung per real step: rung k gives real step k without its result, and no rung gives the result of the last calculation. No rung carries an optimal plan.

### What the client gets before the first answer

Before the first attempt ends, no packet and no reply carries an optimal plan or a score: the room view carries only the numbers, signs and positions, the grouping reply carries only the accepted set, and a hint rung carries only the long way's step (REQ-5562). The first place a plan reaches the client is `AnswerOut`'s short solution, which shows the first optimal plan beside the direct calculation, whatever she linked (REQ-5578). The packet test runs on grouping tasks and asserts both: no optimal plan and no score in the room view, the grouping reply, a hint rung, the answer reply or any other packet before the first attempt ends, and the first optimal plan in `AnswerOut`'s short solution.

### The short loop

The short loop, «Короткая петля» (The short loop), grants 1 star yarn through `reward_granted` with source `short_loop` when, and only when, the first attempt is `clean`, unassisted and scored `optimal` (REQ-5526). The rule reads the verdict, `assisted` and the score, and no time field, so it ignores the `rapidGuess` mark (REQ-5532).

The grant plays after the task window closes, in the `closed` state: the scene plays the spell animation `spell.short_loop` in place of the clean spell, and the System window shows the line with key `system.short_loop`, «Обнаружен короткий путь. Длинный путь обиделся» (A short path was found. The long path took offence) (REQ-5528). The engine takes the animation from the scene's effect data and the line from the Russian string file, and sends the Master no part of it (REQ-5530). Until the art of `spell.short_loop` ships, the scene plays a placeholder `spell.short_loop` drawn in code from the design tokens, and never the clean spell.

### The game scores the task, and the model doesn't read it

A grouping task is a scored task in the game: its first attempt gets an outcome, a badge, the streak, the shard and the room and floor shares as any room task does.

The knowledge model drops every grouping-task attempt from the "on her own" estimate, the fluency estimate, the "with help" estimate, blocks, probes and node states, because `item_shown.forms` holds `grouping` and the active model version's `admittedForms` doesn't (REQ-5538). `grouping` enters `admittedForms` only through SPC-0060's activation rule, and no model version that reads grouping attempts is activated during the MVP (REQ-5540). The short solution still writes `solution_shown` and marks later tasks of the host node `postFeedback`.

### The rational calculation stream

`grouping_stream` is the «рациональный счёт» (rational calculation) stream: one row per grouping attempt, with technique, host node, template, attempt number, score and `assisted` (REQ-5542). It folds each `attempt_submitted` whose `item_shown.forms` holds `grouping`, takes the score from the last `grouping_submitted` before it, `assisted` from the attempt's `assisted` flag, and the technique and host node from the template version `item_shown` names. It is a registered projection, so a recompute rebuilds it from the log alone and `projection_diverged` compares it with a fresh derivation (REQ-5544). Every unassisted figure the stream gives leaves out assisted rows (REQ-5576).

### Placement by the Director

A room slot has four sources, frontier, review, parent topic and grouping (REQ-5554). `planFloor` gives a floor a grouping task only when all four gates hold:

1. The floor has no grouping task yet (REQ-5546).
2. A grouping template's host node lies in the floor's domain and has a tested state of at least «Понимает» (understands): understands, understands and needs speed, fluent, fluent by probe or stable, and never an inferred state (REQ-5548).
3. The volume forecast, counting no grouping task, still gives the adventure its minimum of graded first attempts (REQ-5550).
4. The slot is in a room, never in mental arithmetic (REQ-5556).

`item_shown` records the slot as `flowSlot: grouping`, apart from the other three sources (REQ-5558). Among eligible templates the Director takes the technique with the fewest unassisted first attempts on grouping tasks in the last 30 days, ties broken by the day's seed, and puts the task in the last slot of the floor's first room. A grouping-task attempt counts neither towards the minimum of graded first attempts (REQ-5552), nor in the flow corridor's success share, nor as a slot `n` of the review deficit rule. A second attempt on a grouping task is part of the same task.

### The report block

SPC-0180's Summary screen holds the block «Видит удобные приёмы» with one row per technique a template can declare, `commutative_associative`, `rounding` and `convenient_pairs`, and no row for the distributive law (REQ-5520). Each row shows, over the last 30 days, the share of `optimal` among unassisted first attempts on grouping tasks, with an attempt without links counted as `none`, and the number of attempts beside it (REQ-5580). With fewer than 5 such attempts the row shows the count alone.

Under the block the sentence `parent.grouping.invited` tells the parent that the figure counts what she marks when the task invites her to link numbers, and that children use such shortcuts more often when invited than on their own (REQ-5584). The block sets no norm and no colour against `none`, and the string check on `parent.*` values covers its strings (REQ-5586). Assisted groupings appear apart, as a count of assisted attempts and their `optimal` share, among the «с помощью» (with help) figures (REQ-5582).

### The weekly yarn table and the recipes

`./meowtower yarn-weeks` prints, for each week of 7 game days from Monday, the star yarn granted per source from `reward_granted`, with `short_loop` as a row of its own, and per week the number of floors that logged `no_grouping_candidate` and of attempts that reached `grouping_link_cap` (REQ-5534). The owner reads it at the stage 0.3 review.

When a week closes as the second in a row above 60 star yarn, the server raises `yarn_weeks_high` once, asking the owner to open a record that resizes the forge recipes; it fires again only after a week at or below 60 has closed (REQ-5536). The forge recipe amounts in `content/economy.json` stay as SPC-0140 states them until a record opened under REQ-5536 resizes them, and a diff check fails a change to them without that record (REQ-5590).

## Failure paths

| Condition | What happens |
| --- | --- |
| A grouping template mixes operations, has a plan that differs from `solve()`, files a rounded product outside `rounding`, declares `distributive`, breaks the filing rule, has a plain step outside the host node's subtypes, an A13 host outside A7 and A11, or more than 5 numbers | `grouping_template_invalid`: the build fails and the template doesn't ship. |
| A grouping request names a closed attempt or a position outside the expression | `grouping_link_rejected`: the server writes nothing and replies with the current logged set and the `clientSeq` that logged it. |
| An answer arrives before the grouping request it names | `grouping_out_of_order`: the server refuses it, and the queue sends the grouping and then the answer. |
| An attempt reaches 40 changes | `grouping_link_cap`: the server logs one `grouping_submitted` with `capped: true`, refuses further changes with a reply naming that event's `clientSeq`, and keeps the loops as they stand; the window takes no more taps on that attempt, and she can still answer. |
| The same grouping request arrives twice with one `clientSeq` | The server appends nothing and returns the set the first request logged. |
| No grouping template passes the four gates for a floor | `no_grouping_candidate`: the floor runs without a grouping task, and the `why` field of its first room records it. |
| Two weeks in a row close above 60 star yarn | `yarn_weeks_high` shows once to the owner. |
| The device has no connection | Loops draw on the device, and the persisted queue holds every set in order. |
| An answer carries a `lastGroupingSeq` that names no `grouping_submitted` of its attempt, or `null` while the attempt has one | `grouping_out_of_order`: the server refuses it, the queue sends the attempt's held sets in order, and the answer follows with the `clientSeq` the reply names. |
| The app closes with a set unsent | The set stays in the persisted queue and goes out when the app opens again. |
| `spell.short_loop` has no art yet | The scene plays a placeholder animation drawn in code from the design tokens. |

## Open review findings

- Round 1, the reasons for the cap of 40 changes, the 6 templates, the 1,000 seeds, the room slot and the technique the Director picks, the exclusion from the success share, the threshold of 5 attempts and weeks from Monday: rejected, because a specification states what the system does and never why (S8); ADR-0260 holds the reasons.
- Round 1, `admissible` as a declared field that is always every pair and every number: rejected, because REQ-5512 names the field and ADR-0260 fixes its value.
- Round 1, the build check shutting out a rounding expression with mixed operations such as `503 − 198`, which REQ-5524 would allow: rejected, because ADR-0260 fails every mixed expression, and a template that meets the narrower check still meets REQ-5524.
- Round 1, the channel through which `yarn_weeks_high` reaches the owner: ADR-0260 names no channel; unresolved.
- Round 2, the comment on line 10 promising a reason beside each rule: rejected as a change, because the comment is the spec template's standard line; the Scope now names ADR-0260 as the holder of the reasons.
- Round 2, which template the Director takes when several of the chosen technique are eligible: rejected, because ADR-0260 settles only the technique, and stating a template rule here would add a decision no record made; unresolved.
