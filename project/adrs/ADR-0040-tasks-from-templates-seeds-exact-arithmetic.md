---
id: ADR-0040
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-1200, REQ-1202, REQ-1204, REQ-1206, REQ-1208, REQ-1210, REQ-1212, REQ-1214, REQ-1216, REQ-1218, REQ-1220, REQ-1222, REQ-1224, REQ-1226, REQ-1228, REQ-1230, REQ-1232, REQ-1234, REQ-1240, REQ-1242, REQ-0700, REQ-0702, REQ-0703, REQ-0704, REQ-0705, REQ-0706, REQ-0707, REQ-0708, REQ-0709, REQ-0710, REQ-0713, REQ-0726, REQ-0728, REQ-0730, REQ-0732, REQ-0734, REQ-0736, REQ-0740, REQ-0742, REQ-0744, REQ-0746, REQ-0748, REQ-0750, REQ-0752, REQ-0754, REQ-0756, REQ-0758, REQ-0760, REQ-0762, REQ-0766, REQ-0768, REQ-0770, REQ-0772, REQ-0774, REQ-0776, REQ-0778, REQ-0780, REQ-0782, REQ-0784, REQ-0786, REQ-0788, REQ-0701, REQ-0790, REQ-0792, REQ-0794, REQ-0796, REQ-0798, REQ-0830, REQ-0836, REQ-0844, REQ-0848, REQ-3712]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0040. Code generates every task from a versioned template, a seed and exact arithmetic, and one solution graph drives checking, hints and solutions

## Decision

The server builds every maths task in TypeScript from a template module, a seed and exact rational arithmetic, and checks every answer with one pure function per answer kind. Each template also returns a computation graph, and the short solution, the three hints, the per-trap explanations, the step matching and the trap classification all read their numbers from that graph. A language model never touches a number, an answer or a picture. The reader is whoever builds or reviews the engine: this record fixes the template contract, the generation pipeline, the acceptance rules and the checks that make them hold every time.

The template contract follows the draft's model in RES-1200 with four changes, each recorded here as my choice:

- A template carries no `level` and no `weight`. It reads both from the skill graph, which ADR-0050 makes the one source (REQ-0852).
- An `equation` answer produces an `Answer` of kind `number`, or `fraction` under the `equivalent` rule (REQ-0778). RES-1200 left this open.
- A template ships a `fallback` list of at least 5 parameter sets (chosen), each checked at build time by `valid()` and by trap distinctness, so the fallback itself never fails (REQ-1208). The building agent writes the list.
- A template declares an `inputClass`, one of `free`, `shape`, `net`, `symmetry`, `explain_why`, `science` or `model`. A build check fails any template that asks for a `choice` answer outside the last six classes (REQ-0700), and any `choice` spec with fewer than 4 options (REQ-0706).

The server builds one task in this order, which is the ten-step pipeline of RES-1200:

1. The Director (ADR-0070) names a node, a subtype and a purpose. The item builder picks the subtype's template for the wanted answer kind.
2. The base seed is SHA-256 over `sessionId`, `nodeId` and `slot`, and its first 128 bits seed xoshiro128** (RES-1200). A state of all zeros is replaced by a fixed constant. ESLint's `no-restricted-properties` bans `Math.random` in `src/`.
3. The generator draws candidate `k` from `hash(baseSeed, k)`, for `k` from 0 up to 999, and takes the first candidate that passes `valid()`, the distinctness test and the caller's reject predicate. The reject predicate carries the no-repeat window, which ADR-0070 owns (RES-1100). After 1,000 candidates it takes the first fallback entry the predicate accepts, or the first entry if it accepts none.
4. The log stores the effective seed, `base/k` or `base/f<i>`, which rebuilds the task from the template alone. The effective seed makes a rebuild independent of the history that shaped the reject predicate, so the same template, version and seed give the same task (REQ-1202).
5. `solve()` computes the answer in `Q`, a rational type on `bigint`, and every trap's `apply()` computes its wrong answer in `Q` too (REQ-1204, REQ-1234). A decimal is a fraction over 10^n, so 0,1 + 0,2 is exactly 0,3.
6. The distinctness test rejects a candidate where any trap answer equals the correct answer or another trap answer by value (REQ-1210). It compares values, never spellings, because the checker classifies by value: a trap giving 2/4 against a correct 1/2 would make the trap unreachable.
7. `render.ru` produces the view: text, an SVG picture that `src/render` draws from the parameters (REQ-1230), options, term spans and the input description. `formatQ` writes numbers with the decimal sign and group separator of the locale's notation profile in ADR-0160's string file; for `ru` that is a decimal comma, and every number of 4 digits or more is grouped with a no-break space (U+00A0), as the catalogue writes 4 003 and 2 400 (RES-1200). Code writes `·` for multiplication and `:` for division (REQ-1226, REQ-1228).
8. A word problem gets its story frame only now, after its steps, numbers and answer are fixed (REQ-0782). The frame carries placeholders only; ADR-0130 owns the library and its checks.
9. `graph(p)` feeds `solution(p)`, `hints(p)` and `explain(p, trapId)`, and each of them fills numbers only from the graph's values and the task's givens (REQ-1212). A build check calls `explain` for every trap id a template lists (REQ-1214).
10. `sampleParallel(p, rng)` builds the second attempt's task from the stream `hash(baseSeed, "parallel")`. It keeps `difficulty(p)` equal and is accepted only when its set of given numbers and its correct answer both differ from the original's (REQ-1224). I chose that reading of "different numbers". After 1,000 candidates with no acceptable one, the generator returns `twin_unavailable`, the state ADR-0080 handles.

A trap id names a misconception, not a node, so one id such as `frac.add.across` can serve several nodes and the report can count it across them (ADR-0180). Each template also declares `keyPresses(p)`, the key presses its answer needs, which the motor correction of `minMs` reads (RES-1100), and `spaceSize`, the size of each subtype's parameter space, which ADR-0070's repeat window reads.

The server keeps the node, subtype, template, seed, parameters, answer, traps, solution, hints and valid graphs in the `items` row and the `item_shown` event. The client gets only what the `ItemViewOut` and `InputSpec` zod schemas allow. Both schemas are `.strict()`, so an unlisted field fails serialisation (REQ-1220). `itemId` comes from `crypto.randomUUID()` and has no relation to the task (REQ-1218). The renderer strips `frameId`, `anchorId` and every SVG `id` or `class` that names a node or template. The short solution travels only in `AnswerOut`, which the attempt flow sends after the first attempt (REQ-1222, ADR-0080).

A word problem template picks one of the seven structures RES-0700 lists: a chain, a fork followed by a comparison, parts and whole, N more or N times as many, price times quantity to change, motion or work (REQ-0780). It stores every valid computation graph, such as 3 · 5 + 3 · 7 and 3 · (5 + 7), and the structure traps as graphs of their own. Its generator takes the set of nodes the knowledge model (ADR-0060) marks fluent or stable, and draws numbers so every step falls in a subtype of those nodes (REQ-0784). I read "fluent" to include stable, because RES-0900 defines stable as fluent twice. With no such node the generator returns `no_fluent_numbers` and builds nothing. A T4 template adds exactly one given that no valid graph uses, and a property test counts it (REQ-0786). Noun forms after a number come from a three-form item dictionary chosen by `Intl.PluralRules("ru")`, with the `other` category, used for fractional counts, mapped to the few form (REQ-0788).

Each word problem template declares its structure id, the role of each number placeholder and three sample seeds, and fills a frame with a function of its own, which ADR-0130's frame pipeline calls. `frameMetrics(text, k)` in `src/shared/readability.ts` measures a frame filled from the first sample seed, counting a number as one word, and ADR-0130 rejects any frame that fails one of these limits:

| Measure | Limit | Source | Requirement |
| --- | --- | --- | --- |
| sentences in a k-step problem | at most k + 1 | RES-0700 | REQ-0790 |
| words in any sentence | at most 14 | RES-0700 | REQ-0792 |
| the question | its own sentence, the last one | RES-0700 | REQ-0794 |
| mean sentence length | at most 10 words | chosen by the requirements step | REQ-0796 |
| words outside the frequency list for the player's age | at most 10 % | chosen by the requirements step | REQ-0798 |
| risk terms, meaning words with a glossary entry | at most 2 | chosen by the requirements step | REQ-0701 |

The frequency list is `content/frequency.ru.txt`, which the building agent assembles from a corpus of Russian children's texts, with one list for each primary-school age band, and records the corpus in the file's header. `frameMetrics` reads the band that holds the age the parent set in the Parent Room (ADR-0180), so the limit follows her age and no tracked file names it (REQ-3712).

A T template also offers a model-choice phase: four short notes or bar models, one built from the valid graph and three from the structure traps, drawn as SVG by code (REQ-0836). The attempt payload records the chosen model as `modelChoice`, apart from `answer` (REQ-0713), and ADR-0020 adds the field to the event schema. One word problem in four opens with a model choice (chosen, since RES-0700 gives no share).

Among T2 to T4 problems, the item builder alternates step-by-step input and final-answer input strictly, reading the last form from a log projection (REQ-0703). In a strictly alternating sequence any stretch of `n` problems holds at most one more of either form, so every 30-day window with 2, 4 or more problems falls in the 40 % to 60 % band. A window with 1 or 3 problems can't: 1 of 3 is 33 %.

The item builder offers the sign form of comparison only for the purposes `warmup`, `easy` and `tutorial`, and builds "choose the largest of four" or "order 3 to 4 numbers" for every other purpose (REQ-0708, REQ-0710). The option builder fills a choice task's wrong options with the traps' distinct answers first (REQ-0702). It fills the rest with fillers of the same answer kind and the same digit count or denominator as the correct answer (REQ-0704), then shuffles the options with the task's seeded stream. The server maps each option index to its trap.

`check(spec, correct, raw)` in `src/shared/answer.ts` is one pure function that both the client and the server run. The client runs it only to parse. The server runs it for the verdict, and it reads only the final answer and, for step input, the step values, never the method or the scratchpad (REQ-0848). It returns `unparsed` or a verdict with a credit of 1, 0.5 or 0, a class and a trap id. The client never submits an `unparsed` entry, so the timing between `item_shown` and `attempt_submitted` keeps running (REQ-0736, REQ-0740). If the server's parse fails on a submitted entry, it answers `unparsed` and writes no attempt. The acceptance table below restates RES-0700 as the checker's contract, one test fixture per row.

| Answer kind | Credit 1 | Credit 0.5 | Credit 0 | Requirement |
| --- | --- | --- | --- | --- |
| integer | the value, with group spaces or leading zeros (12 500, 007) | none | other value; any character but digits, spaces and a leading minus is `unparsed` | REQ-0732, REQ-0734 |
| decimal | the value with `,` or `.`, trailing zeros, or a whole number without `,0` | none | other value | REQ-0742 |
| fraction, equivalent | any equal fraction, improper included | none | a decimal, even of equal value | REQ-0744, REQ-0746 |
| fraction, simplest | the fully reduced fraction | an equal fraction not fully reduced | other value | REQ-0748, REQ-0750 |
| mixed, equivalent | an equal mixed number or improper fraction | none | other value | REQ-0752 |
| mixed, simplest | a mixed number with a reduced fractional part | an equal improper fraction, or an unreduced fractional part | other value | REQ-0754, REQ-0756 |
| quotientRemainder | the quotient and a remainder below the divisor | none | a remainder equal to or above the divisor, even if the sum checks | REQ-0758 |
| time, analogue | either reading of the hands, with or without a leading zero (3:15, 03:15, 15:15) | none | other time | REQ-0760 |
| time, digital | the 24-hour time, with or without a leading zero (9:05, 09:05) | none | other time | REQ-0762 |
| point | the grid node (x; y) | none | other node; (y; x) is the trap `point.swapped` | REQ-0766 |
| choice, compare | exactly one option or sign | none | any other option; a submission of two fails the schema | REQ-0768 |
| grid | exactly the correct set of cells | none | any other set | REQ-0770 |
| order | exactly the correct permutation | none | any other permutation | REQ-0772 |
| steps | a correct final answer and steps that match one valid graph | a correct final answer with steps it doesn't recognise | a wrong final answer | REQ-0774, REQ-0776 |
| equation | the value of the unknown, as a number or an equal fraction | none | other value | REQ-0778 |

A wrong answer takes the first class that fits (REQ-0726, REQ-0728, REQ-0730). It is the matching trap's type when its value equals a trap's answer. It is `computational` when it is a number that differs from the correct answer in one digit of the same length, by a swap of two adjacent digits, or as a neighbouring fact a · (b ± 1) or (a ± 1) · b of a table step in the graph. Anything else is `unclassified`. A trap match that is also such a slip keeps the trap's type and carries `alsoSlip: true`, because a trap like the forgotten ten differs in one digit by its nature. A decimal given for a fraction task is `unclassified` with `formMismatch: true`. A template for a point task adds the trap `point.swapped` and rejects x = y, so the swap stays distinguishable.

For step input the checker labels each entered value against every valid graph (REQ-0705, REQ-0707). A value equal to a graph step whose arguments are givens or already matched steps is a correct step. A computational slip of such a step, by the rule above, is the right operation with a calculation error. A value equal to a step of a structure-trap graph is the wrong operation, labelled with that trap. Anything else is `unclassified`, and an unrecognised step never counts as an error (REQ-0709). The checker keeps the graph with the most correct steps. Full credit needs a correct final answer and every entered step correct against that one graph. A correct final answer with any other steps gets 0.5, which is my reading of the table's "steps aren't recognised". The generator rejects parameters where a trap graph's step value equals a valid graph's step value, so the labels stay distinguishable.

The two mental arithmetic tasks that open a floor are two items with two slots, so two seeds, and `generate()` takes no previous answer as an argument (REQ-0830). I read "its own template" as an independent instance: the two tasks may use the same template with different seeds.

A template's `riskyTerms` lists each Russian maths term its task text uses, and a reviewing agent judges the list against the text (REQ-1240). The build fails when a listed term has no entry in the glossary file `content/lexicon.ru.json`, which ADR-0160 places (REQ-1242). That one check also makes the glossary hold the union of all MVP templates' terms (REQ-0844).

The template catalogue of RES-1200 becomes `content/catalogue.yaml`: for each node and subtype, its answer kinds and trap ids, and the stage that builds it (0.1 for N, A, F, T1 and T2, 0.2 for the rest, as RES-3000 sets). It holds no level and no weight. The build fails when a node of a built stage lacks a template for a listed subtype and answer kind (REQ-1232), or a template lacks a trap its catalogue row lists (REQ-1234).

Once this is accepted, the server can generate, render, rebuild and check any catalogued task on its own, and the verify command tests every template on 10,000 seeds. It doesn't yet choose what to ask, since the Director comes with ADR-0070. It can't build word problems in play until ADR-0060 supplies fluent nodes, or give them story frames until ADR-0130 supplies the library. Tests pass the fluent set and a fixed frame explicitly.

## Why

Code generation from templates wins because the report needs each wrong answer to name one misconception, and only code can compute every trap's answer for fresh numbers (RES-1200). A seeded generator and exact arithmetic follow from two draft choices RES-1200 records: xoshiro128** over `Math.random`, so the log can rebuild a task, and `Q` on `bigint` over floating-point `number`, so 0,1 + 0,2 is 0,3.

One graph behind the solution, the hints, the explanations and the step matching makes their numbers agree by construction (REQ-1212, RES-1200). The alternative is a test that compares separately written texts, and that test catches only the cases it samples.

Pure checker functions shared by client and server give the player a soft mark on `3,,5` without a round trip, while the server stays the only judge (RES-2400). The table restates RES-0700 row for row. Four choices go past it, each marked in the Decision: equation answers as numbers, step credit when some steps match, the alternation for step input, and value comparison in the distinctness test.

The effective seed exists because the reject predicate reads history (RES-1100): without it, rebuilding a task after the window moved would draw different numbers, and REQ-1202 would fail silently.

The strongest objection is that property tests check each trap's arithmetic against its own code, not against the misconception it claims to model. An unattended agent can write a trap that computes something plausible but wrong, and every test stays green while the report blames the wrong misconception. I keep the decision because each trap in the catalogue comes with the draft's worked example, such as 1/2 + 1/3 giving 2/5, and the build runs each example as a fixed unit test. The first reversal condition watches for what those examples miss.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: no generator, tasks written as each stage needs them | costs nothing now and lets the first screens ship sooner | it breaks REQ-1200 at once, and gives no traps, no parallel tasks and no rebuild from the log |
| A fixed bank of hand-written tasks tagged with wrong answers | a person reviews every task, and no generator bug can reach the player | the 30-day no-repeat window (RES-1100) and a parallel task for every second attempt need thousands of tasks per node, far past what a family can write or review |
| A language model writes tasks and a solver checks them | varied, natural text with no template code | REQ-1216 forbids a model computing any number, and a model can't be made to compute a named misconception's answer reliably (RES-1200) |
| Declarative templates in YAML, read by one engine | the parent could edit a template without code, as with the graph | traps such as "borrowing across a zero without reducing the next place" are small programs, and a data format that expresses them grows into an untyped language; TypeScript gives type checks and unit tests |
| Floating-point `number` with a tolerance, or decimal.js | less code, and a known library | a tolerance makes 3,49 and 3,5 equal or not by an arbitrary epsilon, and fractions need rationals anyway, so `Q` on `bigint` covers both kinds with one type |

## What it costs

The building agent writes about 79 node templates with some 200 subtypes (RES-1200 catalogue). Each needs traps, a fallback list, a graph, three hints, one explanation per trap, `riskyTerms`, a reference solver for the property test and golden seeds. That is the largest content cost in stage 0.1 and 0.2, and it falls on the agent and on whoever reviews its traps.

A template can't become rebuildable forever. The golden test pins the current version only, and when a template's version rises its old code is gone. A task shown under an old version is then reproduced from the view and parameters the `item_shown` event stores (REQ-2204), not by re-running the template.

The ergonomic cost falls on the parent in two queues: unclassified answers and steps wait for review in the report (ADR-0180), and each glossary entry waits for approval before its Dutch word shows (ADR-0180). If nobody attends to either for a month, play goes on unchanged. Unclassified items pile up in the report, and terms show without a Dutch word, which REQ-0846 allows.

I chose a generation budget of 50 ms at the 95th percentile per task on the family Mac, because the task appears while the player waits. I expect 1,000 candidates of arithmetic on `bigint` to fit inside it, and verify measures it. The cap of 1,000 candidates is imposed by RES-1200. Both stand in the Baselines table of ADR-0190.

The security boundary protects the measurement: the answer, traps, node and template must not reach the device. The threats, most likely first:

1. The code leaks by accident, for example an SVG id naming the template or a debug field in a payload. The strict schemas and the payload test guard this.
2. The player reads the network traffic in a desktop browser's developer tools. The opaque `itemId` and the server-only answer guard this.
3. An outside attacker: the server is reachable only on the home network (ADR-0010), so I set no defence here.

## What would reverse it

- If property tests on 10,000 seeds keep passing while the parent finds, in the first month of stage 0.3, more than 5 % of trap-classified answers whose trap label she judges wrong, then code-computed traps don't name misconceptions reliably, and the trap classes should give way to `unclassified` plus parent tagging.
- If any template misses the 50 ms budget at the 95th percentile after its ranges are tuned, then rejection sampling is the wrong generator for that template, and it moves to constructive generation.
- If the owner reads REQ-0703 as binding for a 30-day window of 1 or 3 problems, strict alternation can't meet it, and the rule needs a new requirement.

The premortem, written as though it already happened: two months into stage 0.3 the parent opened the report and saw A2 and A5 full of "forgotten ten" and "forgotten carry". She checked five tasks by hand and found three were plain typing slips that happened to equal the trap's answer for those numbers. These traps differ from the correct answer in one digit by their nature, as 52 - 18 gives 44 for 34, so the distinctness test can't exclude slips without killing those traps. The class order put the trap first, and the report counted a coincidence as a misconception. I have added the guard to the Decision now: an answer that matches a trap and is also a computational slip carries `alsoSlip: true`, and the report (ADR-0180) can weigh it as weaker evidence than a clean trap match.

## Consequences

- `src/math` holds `Q`, xoshiro128**, the seed hash and `formatQ`. `src/templates` holds one file per node, `src/render` the SVG drawers and `src/shared/answer.ts` the checker, as RES-2500 lays out.
- ESLint `no-restricted-imports` forbids `src/math`, `src/templates`, `src/render` and `src/shared/answer.ts` to import the LLM gateway (ADR-0100) or any network module, so a model can't reach a number (REQ-1216).
- The `item_shown` event carries the effective seed, the base seed and `k`; ADR-0020 adds the fields.
- `content/catalogue.yaml` joins the content folder, and ADR-0050's build check makes its subtype ids exist in the graph.
- The item builder reads two projections: the last input form of T2 to T4 problems, and each template's count of fallback uses.
- A template whose fallback share exceeds 1 % of its generations over 30 days (chosen) appears once in the verify report and the agent's handoff, and again only if the share rises further.

The failure states this decision adds, each with one audience and its next step:

| State | Audience | Next step |
| --- | --- | --- |
| `generation_fallback`: 1,000 candidates failed and a fallback entry was used | developer, through the fallback count in the verify report | widen the template's ranges or constraints |
| `twin_unavailable`: no parallel task passed within 1,000 candidates | the attempt flow, in code (ADR-0080) | the server skips the second attempt, as ADR-0080 sets |
| `generation_error`: a template threw on a seed | developer, through the server log and verify | fix the template; in play, the Director picks another subtype of the node |
| `no_fluent_numbers`: no fluent node covers a word problem's steps | the Director, in code; no person | the Director fills the slot with another task |
| `unparsed`: the entry doesn't parse for its kind | the player, through the soft mark (ADR-0150) | she corrects the entry, and the clock keeps running |
| `unclassified`: an answer or step fits no trap and no slip | the parent, in the report (ADR-0180) | she reviews it by hand, or leaves it |
| `template_check_failed`: a catalogue, trap, explanation, glossary or option check failed at build | developer, through verify | fix the template or the content file |

## How I will know it was realised

1. `npm run verify` runs every template on 10,000 seeds and shows, for each, zero failures of `valid()`, zero disagreements with the independent reference solver, zero equal trap answers, and zero numbers in the solution, hints or explanations that aren't a graph value or a given.
2. A golden test holds 20 seeds per template version. The same template, version and effective seed give a byte-identical view and parameters, and a changed output under an unchanged version fails the test.
3. A unit test gives exactly `3/10` for `0,1 + 0,2`, and ESLint reports zero uses of `Math.random` in `src/`.
4. The acceptance test has one fixture per example in the table above, and every fixture passes; the fixtures include `3,,5` returning `unparsed`, `12 500` and `007` accepted, and 6 r 19 for 79 : 10 rejected although 6 · 10 + 19 = 79.
5. A payload test serialises 1,000 client-bound payloads across templates and finds no node code, template id, seed, trap id, correct answer or solution before the first attempt.
6. A mutation test removes one glossary entry, one catalogue trap and one per-trap explanation in turn, and the build fails each time.
7. The 30-day simulation shows the step-input share of T2 to T4 in the 40 % to 60 % band for every window with 2, 4 or more such problems.
8. A property test on 10,000 seeds finds exactly one unused given in every T4 problem, a sign comparison only under `warmup`, `easy` or `tutorial`, and at least 4 options in every scored choice task.
9. A regular expression over 10,000 rendered Russian texts finds no `.` as a decimal point, no `*`, no `/` for division and no ungrouped number of 4 or more digits.
10. `frameMetrics` passes one fixture per row of the readability table, each with a frame just inside and one just outside the limit.
11. Verify times generation over 10,000 seeds per template and reports the 95th percentile against the 50 ms budget.

## What this does not settle

- The no-repeat window and the anchor stop list behind the reject predicate: ADR-0070, from RES-1100.
- When the short solution, a hint and an explanation are released, and what spending a guiding thread does: ADR-0080.
- Which node, subtype and purpose each slot gets, the probe's two subtypes and the block's coverage: ADR-0070.
- Subtype levels and weights, and the check that a template names a subtype the graph holds (REQ-1244): ADR-0050.
- The frame library, the frame pipeline that runs `frameMetrics`, and the science bank, REQ-1236 and REQ-1238: ADR-0130.
- The keypad, the answer fields and the task window, REQ-0712, REQ-0714, REQ-0716, REQ-0718, REQ-0720, REQ-0722, REQ-0724, REQ-0738 and REQ-0764: ADR-0150. The checker here accepts `dont_know` for every answer kind and a point only as a grid node, so those screens have what they need.
- Listing unclassified steps for the parent, REQ-0711: ADR-0180.
- The glossary file's format and the Russian strings of hints and explanations: ADR-0160. ADR-0160 names this record as the owner of the term hints; this record builds the term spans in the view, and ADR-0150 draws the marks and the tap explanation.
- Detailed explanations a model writes from the graph: ADR-0120.
- How a half credit enters the estimate: ADR-0060, which follows RES-0900's rule of 0.5 as right and 0.5 as wrong.

Amended by ADR-0220, ADR-0230, ADR-0240, ADR-0250, ADR-0260, ADR-0270, ADR-0290, ADR-0300 and ADR-0340, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0410, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0460, approved on 2026-09-29, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
