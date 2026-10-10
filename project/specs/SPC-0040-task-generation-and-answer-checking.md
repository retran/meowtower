---
id: SPC-0040
artifact: spec
status: live
revised: 2026-09-29
states: [REQ-0701, REQ-0702, REQ-0704, REQ-0705, REQ-0706, REQ-0707, REQ-0708, REQ-0709, REQ-0710, REQ-0713, REQ-0726, REQ-0728, REQ-0730, REQ-0732, REQ-0734, REQ-0736, REQ-0740, REQ-0742, REQ-0744, REQ-0746, REQ-0748, REQ-0750, REQ-0752, REQ-0754, REQ-0756, REQ-0758, REQ-0760, REQ-0762, REQ-0766, REQ-0768, REQ-0770, REQ-0772, REQ-0774, REQ-0776, REQ-0778, REQ-0780, REQ-0782, REQ-0784, REQ-0786, REQ-0788, REQ-0790, REQ-0792, REQ-0794, REQ-0796, REQ-0798, REQ-0830, REQ-0836, REQ-0844, REQ-0848, REQ-1200, REQ-1202, REQ-1204, REQ-1206, REQ-1208, REQ-1210, REQ-1214, REQ-1216, REQ-1218, REQ-1220, REQ-1222, REQ-1224, REQ-1226, REQ-1230, REQ-1232, REQ-1234, REQ-1240, REQ-1242, REQ-3712, REQ-5096, REQ-5402, REQ-5404, REQ-5406, REQ-5408, REQ-5410, REQ-5420, REQ-5428, REQ-5430, REQ-5432, REQ-5436, REQ-5442, REQ-5444, REQ-5450, REQ-5466, REQ-5472, REQ-7158, REQ-7160]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Task generation from templates, seeds and exact arithmetic, the solution graph and answer checking

## Scope

This document covers how the server makes a maths task and how it checks an answer to it: the template contract, the generation pipeline from a seed to a rendered view, exact arithmetic, the parallel task of a second attempt, the computation graph behind the short solution and the explanations, the option builder, word problems with their surplus and unanswerable forms, the checker with its acceptance rules and error classes, step matching, the glossary check on templates, the template catalogue, and the verdict function of a composed riddle. It is written at the module and function level: modules, functions, types, build checks and the fields they fill. The one exception is the section on the «Нельзя узнать» (can't be known) control, which states what the task window shows.

It leaves out what other documents state. The routes, the `Room` packet and `AnswerOut` are in SPC-0030, and the event schemas and their versions in SPC-0020. Which node, subtype and purpose a slot gets, are in ADR-0070, and the surplus and unanswerable form draw and the refusal guard in ADR-0250. The hint ladder and its length are in ADR-0220, and when help is released, the attempt flow, the twin rules and the estimate step in ADR-0080. How a credit or a stream enters the estimate is in ADR-0060, and the subtype levels and the graph's weight rules in ADR-0050. The frame library and its pipeline are in ADR-0130, the keypad and the answer fields in ADR-0150, the string files and the Dutch bridge's word list in ADR-0160, and the report and its queues in ADR-0180. The compose flow of «Сплети загадку» (Weave a riddle) is in ADR-0230, the plan cards and the phase cycle in ADR-0270, the multiplication sign and the fact format in ADR-0290, the Sources track's answer kinds in ADR-0300, and disabled content in ADR-0340. The retention hold in the Director's reject predicate is in ADR-0400, the context list, the format hold and the side-slot rule in ADR-0410, the Dutch probe letters in ADR-0430, and the construction templates of a composed riddle in ADR-0440.

## Boundary

### Modules and permitted dependencies

| Module | What it holds |
| --- | --- |
| `src/math` | `Q`, a rational type on `bigint`; xoshiro128**; the seed hash; `formatQ` |
| `src/templates` | one file per node, each exporting that node's templates |
| `src/render` | the SVG drawers, which draw from a task's parameters |
| `src/shared/answer.ts` | `check(spec, correct, raw)`, the checker the client and the server both run |
| `src/shared/compose.ts` | `judgeCompose(target, graph)` and the card builder of a composed riddle |
| `src/shared/readability.ts` | `frameMetrics(text, k)` |
| `content/catalogue.yaml` | for each node and subtype: its answer kinds, its trap ids and the stage that builds it |
| `content/lexicon.ru.json` | the glossary |
| `content/frequency.ru.txt` | the frequency lists, one per primary-school age band |

The permitted dependencies run one way. `src/math`, `src/templates`, `src/render`, `src/shared/answer.ts` and `src/shared/compose.ts` never import the model gateway or any network module, and ESLint's `no-restricted-imports` fails the build on such an import (REQ-1216). ESLint's `no-restricted-properties` bans `Math.random` anywhere in `src/` (REQ-1202). The client imports the checker, `judgeCompose` and `frameMetrics` only through `src/shared/`, and never imports `src/templates` or `src/math` directly. The Director reads the skill graph through `src/engine/graph.ts`.

### The template contract

A template is a TypeScript module that exports one `Template<P>` object:

| Member | What it is |
| --- | --- |
| `id`, `node`, `subtype`, `version` | the template's identity; `version` rises on any change to generation |
| `inputClass` | `free`, `shape`, `net`, `symmetry`, `explain_why`, `science` or `model`, and the class ADR-0300 adds for the Sources track |
| `answer` | the `AnswerSpec`: the answer kind and its acceptance rule, such as `fraction` with `accept: "equivalent"` |
| `sample(rng)`, `valid(p)` | draw parameters, and test them against the subtype's constraints |
| `solve(p)` | the correct `Answer`, computed in `Q` |
| `traps` | each trap's `id`, `kind` (`conceptual`, `procedural` or `fact`) and `apply(p)`, which returns the wrong `Answer` the misconception gives or `null` where it doesn't apply |
| `graph(p)` | the main computation graph |
| `solution(p)`, `hints(p)`, `explain(p, trapId)` | the short solution, the hint rungs and the template explanation of each trap, all filled from the graph |
| `render.ru(p, ctx)` | the view |
| `difficulty(p)`, `sampleParallel(p, rng)` | the difficulty features, and the parallel task's parameters |
| `fallback` | at least 5 parameter sets |
| `contexts` | on a template with `format: "context"` only, the non-empty list of ids from `content/contexts.yaml` that its structure admits, as ADR-0410 states |
| `riskyTerms` | each Russian maths term the task text uses |
| `keyPresses(p)`, `spaceSize` | the key presses the answer needs, and the size of each subtype's parameter space |

A template carries no level and no weight; it reads both from the skill graph. A trap id names a misconception, not a node, so one id such as `frac.add.across` serves several nodes. ADR-0080 states the `kind` declaration and the length of the rung list `hints(p)` returns, ADR-0260 the optional `grouping` declaration, and ADR-0290 the `format` declaration.

A word problem template adds its structure id, the role of each number placeholder, three sample seeds, every valid computation graph, each structure trap as a graph of its own, one quantity id per graph node shared across graphs, the quantity ids of the givens its text states, a card wording key per quantity, and its own function that fills a frame. A surplus template adds one to three extra-data graphs. An unanswerable template extends an ordinary template of the same node and structure and adds its withholding rule.

### The answer contract

`AnswerSpec` has the kinds `integer`, `decimal`, `fraction`, `mixed`, `quotientRemainder`, `time`, `point`, `compare`, `choice`, `grid`, `order`, `steps` and `equation`, and ADR-0300 adds `region`. An `equation` answer produces an `Answer` of kind `number`, or `fraction` under the `equivalent` rule. `Answer` also has the kinds `dont_know` and `insufficient`, the second with `missing: 0 | 1 | 2 | 3 | null`, the position of the chosen option or none.

`check(spec, correct, raw)` returns either `unparsed` or a verdict with a credit of 1, 0.5 or 0, a class and a trap id. Besides the verdicts of an ordinary answer and `dont_know`, it returns `insufficient_correct`, `insufficient_partial` and `false_insufficient` for an answer of kind `insufficient`. The classes of a wrong answer are a trap's type, `computational`, `unclassified`, `used_extra_data` and `answered_insufficient`, and a verdict can also carry `alsoSlip: true` or `formMismatch: true`. A composed riddle has no `AnswerSpec` kind and takes its verdict from `judgeCompose(target, graph)`.

### What the client receives

The client receives a task only as the `Room` packet of SPC-0030: an `itemId`, the view as `ItemViewOut` and the `InputSpec`. `ItemViewOut` holds the text, the SVG picture, the options, the term spans and the input description. The term spans mark each term the template's `riskyTerms` lists and each glossary word the story frame adds. `InputSpec` holds the answer kind and its input constraints, and on a T1 to T4 word problem other than a Dutch probe letter `allowInsufficient: true` and the four "what's missing" options. Both schemas are zod `.strict()`, so a field outside them fails serialisation.

### Data this part keeps and fills

The `items` row and the `item_shown` event keep, on the server, the node, subtype, template, template version, base seed, `k`, effective seed, parameters, answer, traps, solution, hints and valid graphs. On a surplus or unanswerable problem they also keep `unusedGiven` or `withheldGiven`. `forms` holds `surplus` on the subtypes `T1.surplus` to `T3.surplus`, `missing` on `T1.insufficient` to `T4.insufficient`, and neither on an ordinary T4 problem. The engine fills `forms` from the template and the Director's choices when it shows the task. `attempt_submitted` carries `modelChoice` and `insufficient`, and `verdict` carries the verdict, the credit, the class, the trap id and the flags. SPC-0020 states the schemas and their versions.

### Names this part reports

| Name | Audience | Meaning |
| --- | --- | --- |
| `unparsed` | the player, through the soft mark | the entry doesn't parse for its answer kind |
| `unclassified` | the parent, in the report | an answer or a step fits no trap and no slip |
| `generation_fallback` | the developer, through the fallback count in the verify report | 1,000 candidates failed and a fallback entry was used |
| `twin_unavailable` | the attempt flow, in code | no parallel task passed within 1,000 candidates |
| `generation_error` | the developer, through the server log and verify | a template threw on a seed |
| `no_fluent_numbers` | the Director, in code | no fluent node covers a word problem's steps |
| `insufficient_unbuildable` | the developer, through the build | a fallback entry of a T1 to T4 template fails the withholding rule or the four-option fill at build |
| `answer_kind_refused` | the developer, through the failure log | `AnswerIn` carries `insufficient` on an item without `allowInsufficient`, or beside `dontKnow` or a non-empty `raw` |
| `template_check_failed` | the developer, through verify | a catalogue, trap, explanation, glossary or option check failed at build |
| `held_node_refused` | the developer, through the refusal count in the verify simulation | after the MVP, the reject predicate refused a task of a node held for a retention check |
| `compose_flag_off` | the owner, in `./meowtower status` | no passing live parser run is recorded for the configured parse model and prompt hash |

### What this part requires from other parts

- The Director (ADR-0070) names the node, the subtype and the purpose, and passes the reject predicate that carries the no-repeat window and the retention hold of ADR-0400. For a side slot it names a subtype already shown whenever one fits, as ADR-0410 states.
- The knowledge model (ADR-0060) supplies the set of fluent and stable nodes.
- The skill graph (ADR-0050) supplies each subtype's level and weight, and its fields `form` and `requires`.
- The frame library (ADR-0130) supplies the story frames, each with its story quantities and a clause per leaf given that the frame can leave out.
- The string file (ADR-0160) supplies the locale's notation profile, the noun dictionary and the strings of the controls.
- The Parent Room supplies the player's age, which the parent sets and the local database keeps.

## Behaviour

### Generating a task

The server generates every maths task in daily play during play, from a template and a seed (REQ-1200), in this order:

1. The item builder picks the template of the named subtype for the wanted answer kind, under the format hold, and for a side slot in a format already shown on the subtype when one fits. The item builder takes only a template whose structure has a frame the frame picker admits, and when the context hold leaves none, it takes another template of the subtype, then a bare template, and then the Director takes another subtype. ADR-0410 states the holds and the side slots, and ADR-0130 the frame picker and `transfer_hold_no_frame`.
2. The base seed is SHA-256 over `sessionId`, `nodeId` and `slot`, except for a Dutch probe letter, whose base seed is the seed ADR-0430 draws for that presentation when the letter's family is created and logs in `probe_family_created`. Steps 3 to 5 run on a letter's base seed as on any other. The base seed's first 128 bits seed xoshiro128**, and a state of all zeros is replaced by a fixed constant.
3. The generator draws candidate `k` from `hash(baseSeed, k)`, for `k` from 0 to 999, and takes the first candidate that passes `valid()`, the distinctness test and the caller's reject predicate. `valid()` holds every constraint the subtype sets, such as the number of carries, zeros, divisibility and irreducibility (REQ-1206).
4. After 1,000 candidates, the generator takes the first entry of the template's `fallback` list that the predicate accepts, or the first entry when it accepts none (REQ-1208). The build checks every fallback entry with `valid()` and the distinctness test, and on a T1 to T4 template also with the four-option fill and, on an unanswerable template, the withholding rule, so a fallback entry never fails. After the MVP, the generator asks the predicate about the task's nodes before it draws candidate 0, and when it refuses a node held for a retention check, as ADR-0400 states, the generator draws no candidate and takes no fallback entry: it returns `held_node_refused`, and the caller takes its next candidate.
5. `item_shown` logs the effective seed, `base/k` or `base/f<i>`, for every task, a Dutch probe letter included. The same template, version and effective seed rebuild the same parameters, answer, traps and graphs byte for byte, whatever history shaped the predicate (REQ-1202). The view is the same too when the multiplication sign setting of ADR-0290 and the story frame of ADR-0130 are the same, because the seed fixes neither.
6. `solve()` computes the answer and every trap's `apply()` its wrong answer, all in `Q`. A decimal is a fraction over 10^n, so 0,1 + 0,2 is exactly 0,3, and every solution, trap answer and answer check is exact (REQ-1204).
7. The distinctness test compares values, never spellings: it rejects a candidate where a trap answer equals the correct answer or another trap answer (REQ-1210). A trap giving 2/4 against a correct 1/2 is therefore rejected.
8. `render.ru` produces the view.
9. A word problem gets its story frame only after its steps, numbers and answer are fixed (REQ-0782).
10. `graph(p)` feeds `solution(p)`, `hints(p)` and `explain(p, trapId)`, which fill numbers only from the graph's values and the task's givens; on a T1 to T4 word problem `hints(p)` fills no given's value, as the section on surplus and unanswerable problems states.

No language model supplies a number, an answer, a verdict or a picture of a task (REQ-1216). The parse model of ADR-0230 reads a composed riddle only with its numbers masked, and returns a graph over tokens that `judgeCompose` judges.

The two mental arithmetic tasks that open a floor are two items with two slots, and so two seeds, and the item builder gives them two different templates (REQ-0830). When the chosen node offers one mental arithmetic template only, the second task takes the next node by value, as ADR-0360 decides. `generate()` takes no previous answer as an argument, so neither task uses the answer of the one before it (REQ-0830).

### The parallel task

`sampleParallel(p, rng)` draws from the stream `hash(baseSeed, "parallel")` and keeps `difficulty(p)` equal. It accepts a candidate only when its set of given numbers and its correct answer both differ from the original's (REQ-1224), and checks trap distinctness as step 7 does. After 1,000 candidates with none accepted, it returns `twin_unavailable`. After an unanswerable first attempt, the same stream picks an unanswerable twin of the same template or an ordinary problem of the same node, structure and answer form, and ADR-0080 states the shares; the numbers rule holds for either.

### What the client gets and when

`itemId` comes from `crypto.randomUUID()` and has no relation to the task, so it reveals nothing of its node, subtype, template, seed or parameters (REQ-1218). The renderer strips `frameId`, `anchorId` and every SVG `id` or `class` that names a node or a template. `ItemViewOut` and `InputSpec` carry no trap and no valid graph (REQ-1220). The short solution travels only in `AnswerOut`, after the first attempt (REQ-1222).

### Rendering

`formatQ` writes a number with the decimal sign and the group separator of the locale's notation profile. For `ru` that is a decimal comma, and every number of 4 digits or more is grouped with a no-break space (U+00A0), such as 3,5 and 12 500 (REQ-1226). Division is written `:`, and ADR-0290 states the multiplication sign.

`src/render` draws every picture in a task as SVG, by code, from the task's own parameters (REQ-1230).

### Choice tasks and comparisons

Every scored choice task offers at least 4 options, and a build check fails a `choice` spec with fewer (REQ-0706). The item builder offers the sign form of comparison, <, = or >, only for the purposes `warmup`, `easy` and `tutorial` (REQ-0710). For every other purpose a comparison asks for the largest of four numbers or for an order of 3 to 4 numbers (REQ-0708).

The option builder fills a choice task's wrong options with the traps' distinct answers first (REQ-0702). It fills the rest with fillers of the same answer kind and the same digit count or denominator as the correct answer (REQ-0704). It shuffles the options with the task's seeded stream, and the server maps each option index to its trap. ADR-0080 states the four options of the estimate step, which this rule doesn't cover.

### Word problems

Every word problem takes its structure from the catalogue of seven: a chain, a fork followed by a comparison, «части и целое» (parts and whole), «на N больше / в N раз» (N more / N times as many), «цена · количество → сдача» (price times quantity to change), motion, or work (REQ-0780).

The generator takes the set of nodes the knowledge model marks fluent or stable, leaves out every node held for a retention check as ADR-0400 states, and draws numbers so every step falls in a subtype of those nodes (REQ-0784). With no such node it returns `no_fluent_numbers` and builds nothing.

A T4 problem, `T4.insufficient` included, holds exactly one given that no valid graph uses (REQ-0786). Every ordinary T4 problem is a surplus problem, and the skill graph holds no subtype `T4.surplus` (REQ-5436).

A noun after a number takes the form `Intl.PluralRules("ru")` picks from the noun's three forms in the item dictionary, such as «1 зелье, 3 зелья, 5 зелий» (1 potion, 3 potions, 5 potions). The category `other`, used for fractional counts, maps to the few form (REQ-0788).

`frameMetrics(text, k)` measures a frame filled from the template's first sample seed, counting a number as one word, and the frame pipeline of ADR-0130 rejects a frame that breaks any limit:

| Measure | Limit | Requirement |
| --- | --- | --- |
| sentences in a k-step problem | at most k + 1 | REQ-0790 |
| words in any sentence | at most 14 | REQ-0792 |
| the question | a sentence of its own, the last one | REQ-0794 |
| mean sentence length | at most 10 words | REQ-0796 |
| words outside the frequency list for the player's age | at most 10 % | REQ-0798 |
| risk terms, meaning words with a glossary entry | at most 2 | REQ-0701 |

`frameMetrics` reads the list of the age band that holds the age the parent set in the Parent Room, never a value fixed in the code, the content or a tracked file (REQ-3712).

### The model choice

A T1 to T4 template offers a model-choice phase: four short notes or bar models, drawn as SVG by code, one built from the valid graph and three from the structure traps (REQ-0836). A model draws a number only for a given the text states; every other quantity, an intermediate result or a withheld given, is a labelled blank segment, and the asked quantity carries «?». The attempt payload records the chosen model as `modelChoice`, apart from the answer (REQ-0713). ADR-0270 states which problem opens with a model choice or a plan, and which T2 to T4 problem takes step input.

### Surplus and unanswerable problems

The skill graph names the unanswerable subtypes `T1.insufficient` to `T4.insufficient` (REQ-5442), and the surplus subtypes `T1.surplus` to `T3.surplus`. `S3.missing` keeps its meaning, the missing number from a mean (REQ-5444). Each of these subtypes carries `form: new` and `weight: 0.1` in its node, and that weight counts once a model version that admits its stream passes the held-out comparison and is activated (REQ-5450); ADR-0060 states the activation.

A surplus template for T1 to T3 adds exactly one given that no valid graph uses, as T4 does. Every surplus template, T4 included, declares one to three extra-data graphs: the valid graph with the unused number joined to or swapped into one step. The distinctness test also rejects a candidate where an extra-data graph's answer equals the correct answer or any trap's answer (REQ-5432).

The generator builds an unanswerable problem as a complete problem first, with the pipeline above, and then withholds one leaf given that every valid graph uses, drawn from the stream `hash(baseSeed, "withhold")`. It never withholds a T4 problem's unused given. The frame renders the text without the clause that states that given. The generator rejects a candidate where the withheld value can be computed from the stated givens. The model choice, the step fields, the hint rungs, the plan cards and, on a T2 to T4 problem, the estimate step and its four options come from the complete problem (REQ-5408); ADR-0240 states the estimate step. The step count is the complete problem's (REQ-5410), and the problem shows the same phases and fields as a solvable problem of its tier and answer form (REQ-5406).

On every T1 to T4 word problem, solvable or unanswerable, `hints(p)` names each given by its quantity, such as «сколько конфет в первой коробке» (how many sweets were in the first box), and prints no given's value in any rung, as ADR-0360 decides.

Every T1 to T4 problem other than a Dutch probe letter has exactly 4 "what's missing" options, each naming a quantity of the story that the text doesn't state (REQ-7160). The option builder fills them the same way on both kinds:

1. Slot 1 is the asked quantity.
2. Slot 2 is the withheld given on an unanswerable problem (REQ-5472), and on a solvable one a story quantity the frame declares that the text doesn't state, other than the asked quantity, drawn by the seeded stream.
3. Slots 3 and 4 are a seeded draw from one pool: the graph's intermediate quantities and the frame's remaining story quantities.

The seeded stream shuffles the four, and the server maps each position to its quantity.

The Dutch bridge's item selector skips every item whose `forms` holds `missing`, so no unanswerable problem carries a Dutch keyword (REQ-5466).

### The «Нельзя узнать» control

Every T1 to T4 word problem other than a Dutch probe letter shows «Нельзя узнать» (can't be known) beside «Не знаю» (I don't know) in every phase: the model choice, the plan cards, the step fields and the final answer (REQ-7158). The task window's action row reads, left to right, «Не знаю», «Нельзя узнать», the thread button and «Готово» (Done), on solvable and unanswerable problems alike. A gap of at least one button's width separates «Не знаю» from «Нельзя узнать», and «Нельзя узнать» never sits on the keypad or next to a digit key (REQ-5402). On the computer interface the key with `KeyboardEvent.code` `KeyY` opens the options as a tap does; it differs from the shortcut of «Не знаю», and no answer field takes a letter (REQ-5404).

A Dutch probe letter shows neither «Нельзя узнать» nor the four options, and ADR-0430 states its controls. The letters come after the MVP, and only once the owner amends the Russian-only rule in `CLAUDE.md`; until then no item is a letter.

Pressing «Нельзя узнать» submits nothing: it opens the four options with «Готово» and «Назад» (Back). «Готово» submits with or without a chosen option (REQ-5420), and «Назад» returns to the problem as it was.

### Checking an answer

The client runs `check` only to parse, and never submits an `unparsed` entry. Such an entry isn't an answer (REQ-0736), and the timing between `item_shown` and `attempt_submitted` keeps running without a reset or a pause (REQ-0740). The server parses `raw` again and runs `check` for the verdict. When its parse fails, it answers `unparsed` and writes no attempt. The checker reads only the final answer and, for step input, the step values, never the method or the scratchpad, so an answer is marked by its result (REQ-0848). It accepts `dont_know` for every answer kind.

| Answer kind | Credit 1 | Credit 0.5 | Credit 0 | Requirement |
| --- | --- | --- | --- | --- |
| integer | the value, with spaces between digit groups or leading zeros («12 500», «007») | none | another value; an entry with any character but digits, spaces and a leading minus is `unparsed` | REQ-0732, REQ-0734 |
| decimal | the value with «,» or «.», with or without trailing zeros, or a whole number without «,0» | none | another value | REQ-0742 |
| fraction, equivalent | any equal fraction, improper included | none | a decimal, even of equal value | REQ-0744, REQ-0746 |
| fraction, simplest | the fully reduced fraction | an equal fraction not fully reduced | another value | REQ-0748, REQ-0750 |
| mixed, equivalent | an equal mixed number or improper fraction | none | another value | REQ-0752 |
| mixed, simplest | a mixed number with a fully reduced fractional part | an equal improper fraction, or an unreduced fractional part | another value | REQ-0754, REQ-0756 |
| quotientRemainder | the quotient and a remainder below the divisor | none | a remainder equal to or above the divisor, even when the quotient times the divisor plus the remainder gives the dividend | REQ-0758 |
| time, analogue | either reading of the hands, with or without a leading zero (3:15, 03:15, 15:15) | none | another time | REQ-0760 |
| time, digital | the 24-hour time, with or without a leading zero in the hour («9:05», «09:05») | none | another time | REQ-0762 |
| point | the grid node (x; y) | none | another node; (y; x) is the trap `point.swapped` | REQ-0766 |
| choice, compare | exactly one option or one sign | none | another option; a submission of two fails the schema | REQ-0768 |
| grid | exactly the correct set of cells | none | another set | REQ-0770 |
| order | exactly the correct permutation | none | another permutation | REQ-0772 |
| steps | a correct final answer with steps that match one valid graph | a correct final answer with steps it doesn't recognise | a wrong final answer | REQ-0774, REQ-0776 |
| equation | the value of the unknown, as a number or an equal fraction | none | another value | REQ-0778 |

A template for a point task adds the trap `point.swapped` and rejects x = y, so the swap stays apart from the correct answer.

On a T1 to T4 word problem other than a Dutch probe letter the checker also takes `insufficient`, and then ignores the entered step values:

| Answer | Problem | Verdict | Credit | Class | Stated by |
| --- | --- | --- | --- | --- | --- |
| «Нельзя узнать», withheld given chosen | unanswerable | `insufficient_correct` | 1 | none | ADR-0140 |
| «Нельзя узнать», another option or none | unanswerable | `insufficient_partial` | 0.5 | none | ADR-0140 |
| a number | unanswerable | `wrong` | 0 | `answered_insufficient` | REQ-5428 |
| «Не знаю» | unanswerable | `dont_know` | 0 | none | ADR-0080 |
| «Нельзя узнать», any option | solvable | `false_insufficient` | 0 | none | ADR-0140 |
| a number equal to an extra-data graph's answer | surplus | `wrong` | 0 | `used_extra_data` | REQ-5430 |

ADR-0140 states the game outcome and badge of each verdict, and SPC-0030 the refusal `answer_kind_refused`.

### Classifying a wrong answer

A wrong number takes the first class that fits (REQ-0726, REQ-0728, REQ-0730):

1. On an unanswerable problem it is `answered_insufficient` (REQ-5428).
2. It is the trap's type when its value equals a trap's answer.
3. On a surplus problem, T4 included, it is `used_extra_data` when it equals an extra-data graph's answer (REQ-5430).
4. It is `computational`, shown to the parent as «вычислительная» (computational), when it differs from the correct answer in one digit of the same length, by a swap of two adjacent digits, or as a neighbouring fact a · (b ± 1) or (a ± 1) · b of a table step in the graph.
5. Anything else is `unclassified`, shown as «не классифицирована» (unclassified).

A trap match that is also a slip by rule 4 keeps the trap's type and carries `alsoSlip: true`. A decimal given for a fraction task is `unclassified` with `formMismatch: true`. After the class, the server writes `estimateLabel` beside the class and the trap on an item with an estimate, as ADR-0080 states.

### Step input

The checker labels each entered step value against every valid graph of the problem, so both 3 · 5 + 3 · 7 and 3 · (5 + 7) count (REQ-0705). It gives each step one of four labels (REQ-0707):

- A correct step: a value equal to a graph step whose arguments are givens or steps already matched.
- The right operation with a calculation error: a computational slip of such a step, by rule 4 above.
- The wrong operation: a value equal to a step of a structure-trap graph, labelled with that trap.
- «не классифицирован» (unclassified): anything else, which never counts as an error (REQ-0709).

The checker keeps the graph with the most correct steps. Full credit needs a correct final answer and every entered step correct against that one graph (REQ-0774); a correct final answer with any other steps gets 0.5 (REQ-0776). The generator rejects parameters where a trap graph's step value equals a valid graph's step value, so the labels stay apart.

### Explanations, risky terms and the glossary

Every template provides a template explanation for each of its traps, and a build check calls `explain` for every trap id the template lists (REQ-1214). ADR-0080 states the rungs and how the solution, the rungs and the explanations agree.

A template's `riskyTerms` lists each Russian maths term its task text uses, and a reviewing agent judges the list against the text (REQ-1240). The build fails when a listed term has no entry in `content/lexicon.ru.json` (REQ-1242). That check makes the glossary hold an entry for every Russian maths term in the task text of every MVP template (REQ-0844).

### The template catalogue

`content/catalogue.yaml` holds, for each node and subtype, its answer kinds and trap ids and the stage that builds it: 0.1 for N, A, F, T1 and T2, and 0.2 for the rest. It holds no level and no weight. The build fails when a node of a built stage lacks a template for a listed subtype and answer kind (REQ-1232), or when a template lacks the `apply()` of a trap its catalogue row lists (REQ-1234).

### Composed riddles

The generator builds a riddle's target with the purpose `compose`, and `judgeCompose(target, graph)` gives a riddle its verdict, from sentence cards or from a parsed text alike. «Сплети загадку» offers sentence cards in place of free composition until the masked parser has matched the labelled verdicts on at least 95 % of 200 reference riddles in a live run on the offline key, and whenever the game day's parse budget has run out (REQ-5096). The setting `COMPOSE_FREE` turns free composition on. While `verify/parser-eval.json` records no passing live run for the configured `PARSE_MODEL` and prompt hash, the server starts with free composition off and offers card riddles only, so a changed parse model or prompt turns free composition off until it passes again; ADR-0230 states the flag. When the parse bucket can't reserve two parses, the Director offers a card riddle.

## Failure paths

| Condition | What happens |
| --- | --- |
| No candidate passes within 1,000 draws | The generator takes a fallback entry and counts `generation_fallback`; a template whose fallback share exceeds 1 % of its generations over 30 days appears once in the verify report. |
| A template throws on a seed | `generation_error` goes to the server log, and the Director picks another subtype of the node. |
| No parallel task passes within 1,000 candidates | `sampleParallel` returns `twin_unavailable`, and the server skips the second attempt, as ADR-0080 states. |
| After the MVP, the reject predicate refuses a task of a node held for a retention check | The generator returns `held_node_refused`, and the caller takes its next candidate, as ADR-0400 states. |
| The context hold leaves no frame for a template | The item builder takes another template of the subtype, then a bare template, then the Director another subtype, and ADR-0130 counts `transfer_hold_no_frame`. |
| No fluent node covers a word problem's steps | The generator returns `no_fluent_numbers`, and the Director fills the slot with another task. |
| A template can't withhold a given or fill 4 options within 1,000 candidates | The generator takes a fallback entry the build has checked; the build fails with `insufficient_unbuildable` when a fallback entry fails. |
| The entry doesn't parse for its kind, such as «3,,5» | The client shows `unparsed` as the soft mark, submits nothing and keeps the clock running. |
| The server's parse fails on a submitted entry | The server answers `unparsed` and writes no attempt. |
| `AnswerIn` carries `insufficient` on an item without `allowInsufficient`, or beside `dontKnow` or a non-empty `raw` | The server logs nothing and replies 422 `answer_kind_refused`. |
| An answer or a step fits no trap and no slip | It is `unclassified` and waits in the parent's review queue; it counts as no error. |
| A catalogue row lacks a template, a template lacks a catalogue trap or an explanation, a risky term lacks a glossary entry, or a scored choice has fewer than 4 options | The build fails with `template_check_failed`. |
| A frame breaks a readability limit | The frame pipeline rejects the frame. |
| A module in `src/math`, `src/templates`, `src/render`, the checker or `src/shared/compose.ts` imports the model gateway or a network module, or code in `src/` calls `Math.random` | ESLint fails the build. |
| An outgoing `ItemViewOut` or `InputSpec` carries an unlisted field | Serialisation fails, and the body never reaches the client. |
| `COMPOSE_FREE` is on with no passing record for the configured `PARSE_MODEL` and prompt hash | Text riddles turn off, card riddles play, and `./meowtower status` shows `compose_flag_off`. |
| The game day's parse bucket can't reserve two parses | The Director offers a card riddle. |
