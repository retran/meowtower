---
id: ADR-0250
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-5400, REQ-5402, REQ-5404, REQ-5406, REQ-5408, REQ-5410, REQ-5412, REQ-5414, REQ-5416, REQ-5418, REQ-5420, REQ-5422, REQ-5424, REQ-5426, REQ-5428, REQ-5430, REQ-5432, REQ-5434, REQ-5436, REQ-5438, REQ-5440, REQ-5442, REQ-5444, REQ-5446, REQ-5448, REQ-5450, REQ-5452, REQ-5454, REQ-5456, REQ-5458, REQ-5460, REQ-5462, REQ-5464, REQ-5466, REQ-5470, REQ-5472, REQ-5028, REQ-5166]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0250. Every T1 to T4 word problem offers «Нельзя узнать» and looks the same whether or not it can be solved, and the Director draws surplus and unanswerable problems at random under a refusal guard of 20 solvable problems

## Decision

Every T1 to T4 word problem carries the button «Нельзя узнать» (can't be known) and four "what's missing" options, and an unanswerable problem is a complete problem with one given withheld, so the packet, the phases and the controls are the same for both kinds until she answers (REQ-5400, REQ-5406, REQ-5414). The owner's addendum 1 of 2026-09-28, item 4, imposes the button and the two new kinds; RES-4040 found that anything that differs between the kinds tells her the answer before she reads the problem. This decision builds on ADR-0210, which owns the cross-cutting rules: new forms write their own streams outside "on her own", the stage order and the Dutch bridge. It cites those rules and doesn't restate them.

The terms, used in one sense throughout: a solvable problem is any T1 to T4 word problem with an answer. A surplus problem is a solvable problem with one given that no valid graph uses; ordinary T4 is always one (REQ-5436), and T1 to T3 have the subtypes `T1.surplus` to `T3.surplus`. An unanswerable problem is one of the subtypes `T1.insufficient` to `T4.insufficient` (REQ-5442). `S3.missing` keeps its meaning, the missing number from a mean, and nothing here touches it (REQ-5444). A node's ordinary subtypes are its subtypes that aren't new forms.

### Building the problems

An unanswerable template extends an ordinary template of the same node and structure. The generator builds the complete problem first, with ADR-0040's pipeline unchanged, then withholds one given: the frame renders the text without the clause that states it (REQ-5408). I chose to draw the withheld given at random among the graph's leaf givens, from the stream `hash(baseSeed, "withhold")`, because a fixed choice, such as always the first given, is a pattern she could learn. The generator rejects a candidate where the withheld value can be computed from the stated givens, because such a problem is solvable. Everything else comes from the complete problem: the step count, which fixes the tier and the Guardian's ladder (REQ-5410), the model choice, the step fields, the three hint rungs and the plan cards (REQ-5408).

The model choice draws a number only for a given the text states, for both kinds. Every other quantity, an intermediate result or a withheld given, is a labelled blank segment, and the asked quantity carries «?». I chose this, because a model that printed the withheld value would show a number the text lacks. The rule leaves one honest route to noticing: a blank leaf segment in the right model is the grade 3 "empty column" rule RES-4040 found in the Russian primary method, and noticing it is the skill being measured. For the same reason I accept that an unanswerable problem states one number fewer than a solvable one with as many step fields: counting the numbers against the steps is reasoning about the problem, which is what the button asks for.

A hint rung of an unanswerable problem comes from the complete graph. Where a rung would print the withheld value, it names the quantity instead, such as «сколько конфет в первой коробке» (how many sweets were in the first box). A bought rung marks the attempt assisted (ADR-0080), and an assisted attempt never enters "on her own" (REQ-0922), so a rung that shows the kind costs no observation.

A surplus template for T1 to T3 adds exactly one given that no valid graph uses, as ADR-0040 already does for T4. Every surplus template, T4 included, declares one to three extra-data graphs: the valid graph with the unused number joined to or swapped into one step. The distinctness test gains one rule: it rejects a candidate where an extra-data graph's answer equals the correct answer or any trap's answer (REQ-5432).

### The four options

Every T1 to T4 problem has exactly 4 "what's missing" options, each naming a quantity of the story that the text doesn't state (REQ-5412). The option builder makes the set the same way for both kinds, so what the options are made of says nothing about the kind. Slot 1 is always the asked quantity, because mistaking the question for missing data is a real confusion. Slot 2 is a given-like quantity: the withheld given on an unanswerable problem (REQ-5472), and a story quantity the frame declares, drawn by the seeded stream, on a solvable one. Slots 3 and 4 come by a seeded draw from one pool on both kinds: the graph's intermediate quantities and the frame's remaining story quantities, each named as a short noun phrase. Every slot then has the same makeup on both kinds, and the withheld given counts as a story quantity. A frame's story quantities must be quantities the story could state as a number, such as «сколько стоит одна тетрадь» (how much one exercise book costs), so a withheld given and a story quantity read alike. ADR-0130 fails a T frame that declares fewer than 3 story quantities, because a one-step solvable problem has no intermediate quantity and needs three from the frame. The seeded stream shuffles the four, and the server maps each position to its quantity.

The options travel in the task packet of every T1 to T4 problem, inside `InputSpec`, beside `allowInsufficient: true`. I chose the packet over a server reply after the press, because a reply adds a round trip that the offline queue of ADR-0030 can't serve, and one rule for both kinds keeps REQ-5414.

### The controls

The task window's action row reads, left to right, «Не знаю» (I don't know), the thread button, «Нельзя узнать» and «Готово» (Done). A fixed gap of at least one button's width separates «Не знаю» from «Нельзя узнать» whether or not the thread button shows, because REQ-6250 sometimes hides it and REQ-5402 needs the gap either way. «Нельзя узнать» never sits on the keypad (REQ-5402). The button shows in every phase of every T1 to T4 problem: the model choice, the plan cards, the step fields and the final answer (REQ-5400). Its label is the string key `ui.task.cantKnow` with the value «Нельзя узнать» (REQ-5470).

Pressing «Нельзя узнать» submits nothing. It opens the four options in the window with «Готово» and «Назад» (Back); «Готово» submits with or without a chosen option (REQ-5420), and «Назад» returns to the problem as it was. I chose this confirming step, because both buttons end a first attempt, and a slip onto «Нельзя узнать» can then be taken back. On the computer interface the shortcut is the key with `KeyboardEvent.code` `KeyY`, which is «Н» on the Russian layout, the first letter of «Нельзя», and the key opens the options exactly as a tap does (REQ-5404). No answer field takes a letter, so `KeyY` enters no answer, and "?" stays with «Не знаю» (ADR-0150).

### Checking and verdicts

`AnswerIn` gains `insufficient: { missing: 0 | 1 | 2 | 3 | null } | null`, the addendum's `Answer` of kind `insufficient`. A request with `insufficient` set must have `dontKnow: false` and an empty `raw`, because one attempt carries one answer and the checker must not choose between two; the server refuses it with `answer_kind_refused` on an item whose `InputSpec` lacks `allowInsufficient`. Entered step values are logged and play no part in the verdict, because the claim that the problem can't be answered is the whole answer, and steps typed before it are work in progress. The checker returns:

| Answer | Problem | Verdict | Credit | Class | Outcome | Badge | Requirement |
| --- | --- | --- | --- | --- | --- | --- | --- |
| «Нельзя узнать», withheld given chosen | unanswerable | `insufficient_correct` | 1 | none | `clean` | `clean` or `crit` | REQ-5416 |
| «Нельзя узнать», another option or none | unanswerable | `insufficient_partial` | 0.5 | none | `partial` | `partial` | REQ-5418 |
| a number | unanswerable | `wrong` | 0 | `answered_insufficient` | `alt` | `soft` | REQ-5428 |
| «Не знаю» | unanswerable | `dont_know` | 0 | none | `alt` | `unknown` | ADR-0080 |
| «Нельзя узнать», any option | solvable | `false_insufficient` | 0 | none | `alt` | `soft` | REQ-5422 |
| a number equal to an extra-data graph's answer | surplus | `wrong` | 0 | `used_extra_data` | `alt` | `soft` | REQ-5430 |

A wrong number on a surplus problem takes the first class that fits, in this order: a trap, `used_extra_data`, `computational`, `unclassified`. The distinctness rule above keeps a trap and `used_extra_data` apart, so the order only matters for a slip that matches both. `used_extra_data` comes before `computational`, because using the unused number is the error a surplus problem exists to measure, and an extra-data answer that is also one digit off the correct answer is more likely the surplus error than a slip. The knowledge model scores `insufficient_correct` 1, `insufficient_partial` 0.5 and `false_insufficient` 0 (REQ-5424). The log keeps all three apart from `dont_know` and from each other (REQ-5426).

### Selection

The Director keeps naming a T node as ADR-0070 does; for that slot a second draw picks the subtype, from `hash(baseSeed, "form")`, a value `u` in [0, 1). With `p` at 0.05, or 0.025 while the refusal guard is raised, a T1 to T3 slot is unanswerable when `u < p`, surplus when `u < p + 0.10`, and ordinary otherwise; a T4 slot is unanswerable when `u < p` and ordinary otherwise (REQ-5434, REQ-5438, REQ-5440). The draw reads nothing from her history, so no cadence exists to predict. It applies to every slot that names a T1 to T4 node, a Guardian's or a room's, so REQ-5248's rooms get the same shares.

The draw applies only when the node's state is «понимает» (understands) or above: understands, understands but needs speed, fluent or stable, inferred states included, as the Guardian's ladder reads them (REQ-5446). Below that the slot is ordinary. The state rules of ADR-0060 read only the observations of a node's ordinary subtypes, so this gate, the Guardian's ladder and every T state stay about holding steps.

The graph expresses both gates as a subtype field, `requires: { atLeast: <state> }`, meaning the node's ordinary subtypes at that state or above. The new T subtypes carry `atLeast: understands`, and `G6.blocks` and `S3.missing` carry `atLeast: fluent` (REQ-5448). The prerequisite points at the node's own ordinary subtypes, which `prereqs` can't express without a cycle, so a field of its own fits where an edge doesn't. The Director reads it through `src/engine/graph.ts`, like every other graph query.

The twin after an unanswerable first attempt is drawn from `hash(baseSeed, "parallel")`: an unanswerable problem of the same template with probability 0.5, and otherwise an ordinary problem of the same node, structure and answer form (REQ-5166). I chose 0.5, because at 0.5 she can do no better than chance on the twin's kind after an unanswerable first attempt. After a solvable first attempt the twin keeps its template (REQ-5166) and is always solvable, so «Нельзя узнать» on that twin is never right; the leak is cheap, because a second attempt writes nothing to any estimate of what she does alone (REQ-0922), the `missing` stream included.

### Estimates and streams

Each new subtype keeps its own estimate as a stream of its own, outside the T node's estimate and "on her own", under ADR-0210's rule for new forms (REQ-5028, REQ-5452). The subtypes carry `form: new` and `weight: 0.1` in the graph from the start (REQ-5450). The subtypes `T1.surplus` to `T3.surplus` write ADR-0210's stream `surplus`, and `T1.insufficient` to `T4.insufficient` its stream `missing`; ordinary T4, with its unused number, writes neither. The estimator ignores a `form: new` subtype until its stream is in the active model version's `admittedForms` (ADR-0210); from then its weight counts, and the ordinary subtypes' weights are scaled by 1 minus the admitted new weights, so the node's weights still sum to 1. The graph file doesn't change at activation, so activation needs no new graph version. A weight of 0.1 stays below the 0.2 a full block must cover, so blocks never need these rare subtypes. For the unanswerable subtypes I set `pGuess` to 0.06, from the expected score of a blind press. A child who pressed «Нельзя узнать» without noticing, at the guard's ceiling of 10 % of problems, and then picked an option at random, would score 1 one time in 4 and 0.5 three times in 4, so 0.10 · (0.25 · 1 + 0.75 · 0.5) = 0.0625. The bounds of ADR-0060 hold with it.

### The refusal guard

The guard reads a window of the last 20 first attempts on solvable T1 to T4 problems, assisted or not, because a press after a bought rung is still a claim that a solvable problem can't be solved, and the rungs of a solvable problem never suggest a missing given; it leaves out second attempts and tasks the parent excluded. I left out second attempts, because a twin after an unanswerable problem is primed to look for missing data. The guard applies once 20 such attempts exist (REQ-5454). When the window holds 3 or more `false_insufficient` verdicts, the server writes `refusal_guard_changed` with `state: "raised"`. The Director halves `p` once, never compounding (REQ-5456), and the report shows «склонна отказываться от задачи» (tends to refuse the problem) (REQ-5454). The guard clears when the 20 solvable first attempts after the raise hold 2 or fewer presses; otherwise the guard stays raised, a new window of 20 starts from that point, and the server writes nothing, so the parent sees no second observation for a pattern already shown. When it clears, the server writes `state: "cleared"`, and `p` returns to 0.05. The events therefore alternate, raised then cleared, and a raise never follows a raise.

This decision owns one new event type:

| Event | Payload | Meaning |
| --- | --- | --- |
| `refusal_guard_changed` | `state: "raised" \| "cleared"`, `itemIds` (the 20 first attempts of the window), `count` (presses in the window), `share` (the value of `p` from now on) | the refusal guard rose or cleared |

It adds these optional fields to the `v: 2` payloads ADR-0210 defines for the addendum: `item_shown` gains `withheldGiven` and `unusedGiven`, kept on the server, and the kind is read from ADR-0210's `forms`, which holds `surplus` or `missing` for the new subtypes, so the log records the kind once; `attempt_submitted` gains `insufficient`; `verdict` gains the three new verdicts and the classes `answered_insufficient` and `used_extra_data`.

### Limits and the report

«Нельзя узнать» doesn't count as «Не знаю» anywhere: not in ADR-0180's avoidance runs, not in ADR-0090's rest-stop offer, not in ADR-0180's help limit, and not in ADR-0070's help share (REQ-5458, REQ-5460). I chose that it ends a run of «Не знаю» like any other answer, because it is a committed answer that she must confirm and that costs her a `soft` outcome on any solvable problem. Pressing it between presses of «Не знаю» to dodge the avoidance count would therefore cost her outcomes, and the refusal guard would see it: 3 such presses in 20 solvable problems raise the guard, so the dodge ends in the report either way. Surplus problems count towards the holding-steps limit and unanswerable problems don't, as REQ-5248 already says.

Beside the word-problem matrix, the report shows four counts for its period: «Не знаю», «Нельзя узнать» on solvable problems, answers of class `used_extra_data` and numbers given for unanswerable problems (REQ-5462). A plan that «Нельзя узнать» ends, on either kind, counts in no planning-error count of ADR-0270, because the verdict already records the claim and counting it twice would show one press as two errors; in the plan phase too the press opens the options first, and only «Готово» there ends the attempt. Unanswerable problems stay out of the matrix, because they have no answer to split into a modelling or a calculation error; surplus problems stay in it. Beside the unanswerable streams, a fixed note from the string file tells the parent that at about one such problem in two to three weeks these estimates stay «не проверено» (unchecked) or near their prior for months (REQ-5464).

The Dutch bridge's item selector, which ADR-0210 owns, skips every item whose `forms` holds `missing`, because a word she can't read looks like a missing given (REQ-5466).

### What works once accepted

Once this is accepted, the work can land in two increments, each working without the next. First, the button, the options, the controls, the verdicts, the unanswerable templates, the refusal guard, the twin draw and the report's counts ship together; this increment includes adding at least 3 story quantities to every existing T frame, because the option builder needs them. I ship the button only together with unanswerable problems, because a button that is always wrong would teach her to ignore it and bias the detection it then measures. Second, `used_extra_data` and the T1 to T3 surplus templates add surplus problems. Setting both shares to 0 in `content/thresholds.json` stops drawing both new kinds without a code change; `used_extra_data` on ordinary T4 stays, because it only classifies an answer and changes no problem she sees. What doesn't work yet: the new streams never join the T estimates during the MVP, because no model version admits them until ADR-0060's held-out comparison passes (ADR-0210). The plan cards of an unanswerable problem wait for the decision on solution plan cards, which builds them; this decision only requires that they come from the complete graph.

## Why

The button must stay on every problem and every phase, because a button, a phase or a field that shows only on one kind tells her the kind before she reads (RES-4040, the owner's addendum 1, item 4). The same finding makes an unanswerable problem a complete problem with a given withheld: without a complete graph it has no model, no steps and no hints, and an empty phase says "this one can't be solved". Four options on every problem follow for the same reason, and REQ-5412 makes them unstated quantities on both kinds.

Children rarely question a word problem: 17 % of reactions to problematic items were realistic among fifth-graders in Flanders, and an irrelevant number cut grade 2 accuracy with an effect size of 0.73 (RES-4040). So both kinds measure something the ordinary subtype doesn't, which is why they get subtypes and streams of their own. The same evidence found a warning that some problems are unsolvable changed little, so I expect low detection at first and rely on the short solution to teach.

The draw is random and per slot, because RES-4040 found that ADR-0040's strict alternation of step input is predictable, and a predictable kind is a leaked kind. The guard reads 20 problems, because at 7 to 9 word problems a week one slip is 11 % to 15 % of a week, above the owner's 10 %, while in a window of 20 it is 5 % (RES-4040, REQ-5454).

The weights stay out of the node until activation, and 0.1 after, because RES-4040 found that ADR-0050's equal default would make each rare subtype a third of its node, beyond what a full block can cover at a 5 % share, and would turn the Guardian's ladder into a measure of noticing.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep T4's one unused number, add no button and no unanswerable problems | costs nothing, and no refusal pattern can appear | contradicts the owner's addendum, and leaves unmeasured a skill that 83 % of pupils' reactions in RES-4040's studies lacked |
| Teach the genre openly: a separate «оборванная нить» (broken thread) room with the button only there, as the Russian textbooks do | explicit teaching, no false refusals elsewhere, and no guard | the room announces the answer, so it measures nothing; the addendum requires the button on every T1 to T4 problem |
| Unanswerable problems as text-only templates, always in final-answer form with no model choice or steps | about half the authoring work per template | the missing phases leak the kind (RES-4040); REQ-5406 and REQ-5408 forbid it |
| Send the four options only after the press, from the server | the packet stays smaller, and no option text reaches a curious client early | a round trip fails offline, and REQ-5414 needs the same behaviour for both kinds, which one packet rule gives with no extra route |
| Pool surplus and unanswerable observations into two streams across T1 to T4 | one estimate that moves within months | loses the per-tier view the owner asked for; RES-4040 chose per-tier subtypes |
| Equal default weights from ADR-0050 | no new rule | each rare subtype becomes a third of its node, and full blocks can't cover them at 5 % (RES-4040) |

## What it costs

The template author pays for each unanswerable template a withholding rule, the check that the withheld value can't be computed, and five fallback entries checked at build time. Each T frame costs at least 3 declared story quantities with short names, and every existing T frame is re-authored with them in the first increment. Each surplus template costs one to three extra-data graphs. The action row gains a button on every T1 to T4 problem, from a Guardian or a room, which the tablet layout of ADR-0150 must fit beside the other three with its gap.

She pays a `soft` outcome for each press on a solvable problem, with the usual free short solution. At about one unanswerable problem in two to three weeks each tier's estimate stays near its prior for months, and the parent pays reading a note that says so.

The parent is never needed in real time. The interruption budget for the parent is one report observation per raise of the guard, at most one per 20 solvable problems, about one in two to three weeks at the worst. The classes `answered_insufficient` and `used_extra_data` never enter the unclassified queue, so this decision adds no queue. Nothing pushes a notification. If the parent reads nothing for two weeks, or a month, the Director halves and restores the share by itself, and nothing waits for approval or is lost.

Ceilings: `refusal_guard_changed` alternates between raised and cleared, so it writes at most one raise and one clear per 20 solvable first attempts, and its window holds exactly 20 item ids. The share halves once and never below 0.025. Every problem holds exactly 4 options, 1 withheld given and at most 3 extra-data graphs. The report's four counts are per period, so they don't grow without bound.

The security boundary protects the measure of whether she notices missing data, against these threats in order of the likelihood of damage:

1. A difference in the packet, a phase or a reply shows the kind. The 1,000-seed comparison below guards it.
2. She reads packets in the desktop browser's developer tools. Both kinds build their options by one rule, the asked quantity plus three drawn unstated quantities, so reading them tells her nothing she wouldn't find by reasoning.
3. A bought rung names the withheld quantity. The attempt is assisted and stays out of "on her own".

Failure states, each with its next step and one audience:

- `insufficient_unbuildable`: a template can't withhold a given that leaves the problem unanswerable, or can't fill 4 options, within 1,000 candidates. The generator takes a fallback entry, which the build has checked, so play never meets it. Audience: the developer, through the build, which fails when a fallback entry fails.
- `answer_kind_refused`: `AnswerIn` carries `insufficient` for an item without `allowInsufficient`, or together with `dontKnow` or a `raw`. The server logs nothing and replies 422; the client drew a control it shouldn't have. Audience: the developer, through ADR-0030's failure log.
- `refusal_guard_raised`: 3 or more presses among 20 solvable first attempts. The Director halves the share, and the report shows the observation. Audience: the parent, in the report.
- `twin_unavailable`: ADR-0080's state, unchanged, when neither kind of twin can be built. Audience: the developer.
- `frame_short_of_quantities`: a T frame declares fewer than 3 story quantities. ADR-0130's frame check fails the build. Audience: the developer.

`insufficient_unbuildable` and `frame_short_of_quantities` look alike to a developer who reads only "no options"; the build names which one fired.

## What would reverse it

- If `false_insufficient` stays above 10 % of solvable T1 to T4 first attempts over 60 such attempts while the share is halved, the always-visible button costs her more outcomes than it measures, and the owner reopens item 4, for example to teach the genre openly first.
- If `insufficient_correct` and `insufficient_partial` together stay at 0 over her first 10 unanswerable problems, the button and the short solution teach nothing, and the owner reopens how the genre is introduced. At about one unanswerable problem in two to three weeks this condition takes 5 to 7 months to decide, and the play rate allows no earlier signal from these problems alone.
- If the 1,000-seed packet comparison finds a difference for a tier and form that no template change can remove, that tier's unanswerable subtype is switched off in the graph until a new decision fixes it.
- If the parent reports that she names the kind before reading, from something on the screen, the kind leaks by a route the tests miss, and the controls are reopened.

The premortem, written as though it had happened: after three months the report showed «склонна отказываться от задачи» every few weeks and the parent turned to the log. She pressed «Нельзя узнать» on four-step problems whenever the numbers grew large, because a long T4 with its unused number looked "wrong" to her. The guard fired, halved the share, and cleared, again and again, while each T4 estimate barely moved. The cause was that T4's unused number, which every T4 problem carries, reads to her as a sign that something is off. A second cause: the model choice drew intermediate results as blank segments, and she took every blank for a missing given. The checks below compare `false_insufficient` on T4 with T1 to T3, and the reversal condition on 60 attempts watches the rate.

## Consequences

- ADR-0040 gains the unanswerable template extension, the withholding stream, the extra-data graphs and their distinctness rule, the option builder, the model-choice rule for numbers, the new answer kind and the two classes.
- ADR-0050's schema gains the subtype fields `form: new` and `requires: { atLeast }`, and its validator a new weight rule.
- ADR-0060's estimator ignores `form: new` subtypes until admitted, and its state rules read ordinary subtypes only.
- ADR-0070's Director gains the form draw, the gate and the guard.
- ADR-0130's T frames declare story quantities and a withholdable clause for each leaf given.
- ADR-0150 draws the action row and the options step; ADR-0160 adds `ui.task.cantKnow`, `ui.task.back`, the option labels' frame keys and the report's note.
- ADR-0180's report adds the four counts, the observation and the note.
- ADR-0020's catalogue gains `refusal_guard_changed`, owned here, and optional fields in ADR-0210's `v: 2` payloads of `item_shown`, `attempt_submitted` and `verdict`.
- `content/thresholds.json` holds the two shares, 0.05 and 0.10, and the guard's 20 and 3, so a change is a content version.

## Amends

- ADR-0040: "A wrong answer takes the first class that fits ... a trap, `computational`, `unclassified`" becomes: a number on an unanswerable problem is `answered_insufficient`; on a surplus problem the order is a trap, `used_extra_data`, `computational`, `unclassified`.
- ADR-0040: "The checker ... accepts `dont_know` for every answer kind" becomes: it also accepts `insufficient` on every T1 to T4 word problem, with the verdicts of this decision's table.
- ADR-0040: "four short notes or bar models, one built from the valid graph and three from the structure traps" becomes: built from the complete graph on an unanswerable problem, with a number drawn only for a given the text states.
- ADR-0040: "The distinctness test rejects a candidate where any trap answer equals the correct answer or another trap answer" becomes: it also rejects a candidate where an extra-data graph's answer equals either.
- ADR-0040: `sampleParallel` "keeps `difficulty(p)` equal" with the same template becomes: for an unanswerable first attempt, the twin is unanswerable with probability 0.5, and otherwise an ordinary problem of the same node, structure and answer form.
- ADR-0050: "`subtypes` ... weights are positive and sum to 1 per node" becomes: the ordinary subtypes' weights sum to 1, and each `form: new` subtype carries weight 0.1.
- ADR-0050: "Weights are equal across a node's subtypes" becomes: equal across a node's ordinary subtypes.
- ADR-0060: "The score is 1 for right, 0,5 for partially right and 0 for wrong or «Не знаю»" becomes: `insufficient_correct` scores 1, `insufficient_partial` 0,5 and `false_insufficient` 0 as well.
- ADR-0060: "A node's estimate is the mean of its subtypes' estimates weighted by the subtype weights" becomes: weighted over ordinary subtypes and admitted new subtypes, with ordinary weights scaled by 1 minus the admitted new weights.
- ADR-0060: "The rule engine gives each node a state ... applied to the node's observations only" becomes: applied to the observations of the node's ordinary subtypes only.
- ADR-0070: "The Director names a node, a subtype and a purpose" becomes: for a T1 to T4 node the subtype comes from this decision's seeded form draw, behind its state gate and refusal guard.
- ADR-0070: "The help-share test compares «Не знаю» and hints before the answer" becomes: it counts no «Нельзя узнать».
- ADR-0090: "When she answers «Не знаю» three times in a row" becomes: three «Не знаю» with no other answer between them, where «Нельзя узнать» is another answer.
- ADR-0140: "`alt` for a wrong answer or 'I don't know'" becomes: `clean` also for `insufficient_correct`, `partial` for `insufficient_partial`, and `alt` with the badge `soft` for `false_insufficient`.
- ADR-0150: "«Готово» and «Не знаю» sit in the action row" becomes: the action row holds «Не знаю», the thread button, «Нельзя узнать» and «Готово» in that order, with a gap of at least one button's width before «Нельзя узнать».
- ADR-0150: "Enter as «Готово» and "?" as «Не знаю»" becomes: also `KeyY` as «Нельзя узнать».
- ADR-0150: "a Playwright test opens one task of every answer kind and finds the button" becomes: it also finds «Нельзя узнать» in every phase of every T1 to T4 problem.
- ADR-0160: "tests pin the exact values of the world's labels in REQ-3310" becomes: they also pin `ui.task.cantKnow` as «Нельзя узнать».
- ADR-0180: the rows "Avoidance: runs of 3 «Не знаю»" and "Help: ... «Не знаю» on first attempts" become: they count no «Нельзя узнать».
- ADR-0180: "The word-problem matrix counts unassisted first attempts on T1 to T4" becomes: it leaves out unanswerable problems, and four separate counts stand beside it.
- ADR-0030: "`AnswerIn` carries `dontKnow`" becomes: it also carries `insufficient`, exclusive with `dontKnow` and a non-empty `raw`.
- SPC-0030: "With `dontKnow: true`, the server logs the verdict `dont_know`" becomes: with `insufficient` set, it logs `insufficient_correct`, `insufficient_partial` or `false_insufficient`, and refuses the field with `answer_kind_refused` on an item without `allowInsufficient`.
- ADR-0020: the event catalogue gains `refusal_guard_changed`, owned by ADR-0250.

## How I will know it was realised

1. A packet test draws 1,000 seeds for each tier and answer form and compares an unanswerable and a solvable problem: the same `ItemViewOut` and `InputSpec` fields, the same phases, 4 options each, `allowInsufficient: true` on both, and the same step count as the complete graph (REQ-5406, REQ-5410, REQ-5414).
2. A composition test over 1,000 seeds per tier counts, per kind of option, intermediate, asked or story quantity, with the withheld given counted as a story quantity, how often it appears on unanswerable and on solvable problems. It passes when every count agrees between the kinds within 5 percentage points and the asked quantity is in every set. A template test over 10,000 seeds asserts that every unanswerable problem's withheld value can't be computed from its stated givens, that its options include the withheld given, and that no option on any problem names a quantity the text states (REQ-5412, REQ-5472).
3. A property test over 10,000 seeds finds no surplus problem, T4 included, where an extra-data graph's answer equals the correct answer or a trap's answer (REQ-5432), and a checker fixture per row of the verdict table gets that row's verdict, credit, class and outcome.
4. A Playwright test on the tablet and desktop viewports finds «Нельзя узнать» in every phase of every T1 to T4 problem, with the gap before it, never on the keypad, and nowhere on any other task; `KeyY` opens the options, and «Назад» returns to the problem with no event written.
5. A simulation of 2,000 word-problem slots with the gate open gives surplus at 8 % to 12 % of T1 to T3 slots and unanswerable at 3.5 % to 6.5 % of T1 to T4 slots. No run of the form draw correlates with the previous kind at lag 1 beyond ±0.05. A second run with the guard raised gives unanswerable at 1.5 % to 3.5 %.
6. A guard test replays logs: 2 presses in 20 never raise it, 3 do, 19 solvable attempts never do, a window of 3 or more presses while the guard is raised writes no event and leaves the share at 0.025, and a clear needs 2 or fewer presses in the 20 attempts after the raise.
7. A twin test over 1,000 unanswerable first attempts gets both kinds of twin, each between 40 % and 60 %.
8. Projection tests assert that «Нельзя узнать» breaks a run of «Не знаю», adds nothing to the help limit or the help share, and never counts towards the holding-steps limit on an unanswerable problem.
9. A model test asserts that a `form: new` subtype moves no T node estimate and no state until the active model version admits it, and that after admission the node's weights sum to 1.
10. A graph test asserts that no `T4.surplus` exists, that `S3.missing` keeps its meaning, that `requires` gates `G6.blocks` and `S3.missing` at fluent, and that the new T subtypes are named `*.surplus` and `*.insufficient`.
11. A bridge test finds no Dutch keyword on any item whose `forms` holds `missing`.
12. The parent reads the report's note beside the unanswerable streams at stage acceptance and judges whether it says the estimates stay unchecked for months (REQ-5464).
13. After four weeks of play the report compares `false_insufficient` on T4 with T1 to T3; a T4 rate twice the others is a finding against the premortem's first cause.
14. After the same four weeks the log compares `false_insufficient` pressed in the model-choice phase with the other phases, and on T1, which has no blank intermediate segment, with T2 to T4; a rate twice the others in the model choice or on T2 to T4 is a finding against the premortem's second cause.

## What this does not settle

- What «ложная нить» (the false thread) and «оборванная нить» (the broken thread) are called in the story, and the Master's lines about them: the canon and ADR-0110.
- The plan cards themselves, and the hint ladder's pricing and framing: the decisions on solution plan cards and on the hint ladder.
- When the new streams join the T estimates: ADR-0060's activation rule, through ADR-0210.
- The Dutch bridge's word list and share: ADR-0210.
- Surplus or unanswerable problems outside T1 to T4, for example in the Sources track.
- A tolerance on "about 10 %" and "about 5 %" for the owner's acceptance; the simulation bands in check 5 are mine, chosen at about ±20 % to ±30 % of each share for 2,000 slots.
