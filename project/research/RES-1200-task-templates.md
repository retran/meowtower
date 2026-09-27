---
id: RES-1200
artifact: research
status: draft
revised: 2026-09-27
---

# Code generates every task from a template and a seed, and the language model writes only words

## Summary

The draft proposes that code generates each task during play from a template and a seed. The code builds the numbers first, then the answer and the traps, then the text. From the same computation graph it builds the short solution, a ladder of three hints and a template explanation for each trap. Each template yields thousands of variants and generates instantly. A language model supplies only words, such as the Master's lead-ins, story frames and the familiar's detailed explanations, and never computes a number or an answer. Procedural SVG draws every picture in a task, because the picture's accuracy is part of the task. The draft gives a catalogue of templates for every node, with subtypes, answer kinds, starting fluency thresholds and traps. This record carries the ten-step pipeline of one task, the TypeScript model of a template, pictures in tasks, anchor tasks and the whole catalogue. It leaves answer input and checking, text problems and step-by-step input, story frames, detailed explanations, fluency calibration, Ascents and anchor forms to other records.

## The question

How does the game produce a task that measures one skill exactly, can be rebuilt later, and reveals which misconception caused a wrong answer? The draft assumes that code-generated tasks from parameterised templates beat a fixed hand-written bank and beat tasks a language model writes. That assumption holds for arithmetic, where code can compute every trap. It is weaker for geometry recognition, reading plans and science, where the draft itself falls back on choice answers or a hand-written bank.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Chronicles of the Tower - specification), sections «Задания и генераторы» (Tasks and generators) with «Конвейер одного задания» (The pipeline of one task) and «Модель шаблона (TypeScript)» (The template model), «Картинки в заданиях» (Pictures in tasks), «Якорные задания» (Anchor tasks) and «Каталог шаблонов по узлам» (The template catalogue by node), and its opening lines for context, on 2026-09-26. I also read the first rule of «Ввод и проверка ответа» (Answer input and checking), because the catalogue says its answer column is read with that rule's correction. I translated the Russian comments in the TypeScript model into English and kept every identifier and type as the draft gives it.

The draft leaves these points open:

- What the default plausible-answer threshold `minMs` is: the model points to a section on protecting the measurement, outside this range. Resolved below: RES-1100 now sets it.
- What `ItemViewOut` holds: the pipeline sends `ItemViewOut` to the client, but the model defines only `ItemView`, which carries `frameId` and `anchorId`. The draft doesn't say whether the server strips these before sending.
- Which `Answer` kind an `equation` answer produces: `AnswerSpec` has `equation` ("the value of the unknown"), and `Answer` has no matching kind, presumably `number`.
- What the fallback parameter list holds for each template, and who writes it.
- How the fluency thresholds are calibrated after the start: the catalogue points to a section on fluency thresholds, outside this range.
- How the lexicon `lexicon.nl.json` that `riskyTerms` keys into is built. The finding on `riskyTerms` below settles that it ships in the MVP, and research decided its list of terms on 2026-09-27, on the owner's instruction (the same finding).

## Findings

### Code generates tasks during play, and the language model never computes numbers or answers

Code generates a task from a template and a seed: numbers first, then the answer and the traps, then the text. From the same computation graph the code builds the short solution, the hint ladder and the template explanation. Each template has thousands of variants, and generation is instant. A language model is needed only for words: the Master's lead-ins, the frames of text problems and the familiar's detailed explanations, all with placeholders. The draft states: "Числа и ответы LLM никогда не считает" (the language model never computes numbers or answers).

### One task passes through a ten-step pipeline

1. Seed. `seed = hash(sessionId, nodeId, slot)`. The seed and the template version rebuild any task exactly.
2. Subtype. Each node has a set of subtypes with weights. A probe takes two different subtypes. A full block covers every subtype with a weight of 0.2 or more.
3. Parameters. The generator samples from the subtype's ranges and rejects samples that break constraints (the number of carries, zeros, divisibility, irreducibility) or repeat a task from the last 30 days. It makes up to 1,000 attempts, then uses a fallback parameter list.
4. Solution. Arithmetic is exact, on rational numbers: a class `Q` built on `bigint`. Decimals are fractions with the denominator 10^n.
5. Traps. For each known misconception the template computes the answer that misconception gives. The draft's example: «сложила числители и знаменатели» (added the numerators and the denominators) gives 2/5 for 1/2 + 1/3.
6. Distinguishability. The generator rejects parameters where a trap's answer equals the correct answer or another trap's answer. So each wrong answer points to exactly one kind of error.
7. Rendering for the current locale, now `ru`: text, a formula or a procedural SVG picture. Russian notation applies: a decimal comma, «·» for multiplication, «:» for division, and a space between digit groups (12 500).
8. Story frame, only for text problems and context subtypes: a frame from the library or the live queue, with numbers, names and objects substituted.
9. Solution, hints, explanation. The template builds from the computation graph the short solution (`solution`: steps with numbers and the answer), a three-step hint ladder (`hints`) and a template explanation for each trap (`explain`). The server keeps all of these. The client gets the solution only after an attempt, and a hint or explanation only after the player spends a guiding thread.
10. Parallel task for the second attempt. `sampleParallel(p, rng)` keeps the subtype and the difficulty features (`difficulty(p)`: the number of carries, zeros, the number of digits, the kind of fraction) and changes the numbers. The generator checks repetition and trap distinguishability the same way.

### The draft chooses its own deterministic generator over `Math.random`

The generator is xoshiro128\*\*, seeded as above, "не `Math.random`" (not `Math.random`). The reason the draft gives: the seed and the template version rebuild any task exactly.

### The draft chooses exact rational arithmetic over floating-point `number`

Solutions use the class `Q` on `bigint`, "без `number` с плавающей точкой" (without floating-point `number`). Decimals are fractions with a denominator of 10^n, so a decimal answer is exact.

### The server generates, renders and judges; the client sees only an opaque identifier and the view

The server generates the whole task. It rejects parameters by the player's history, by the no-repeat window and by a stop list of anchors the client doesn't know. The server calls `render` itself. It sends the client only:

- an opaque `itemId`, a random string with no meaning;
- the finished view of the task, `ItemViewOut`: text, SVG, options, terms;
- the input description, `InputSpec`: the keypad kind, the number of fields, the decimal places, the grid size, the number of elements, and whether scratch work is allowed.

The node, subtype, template, seed, parameters, `purpose` and `scored` stay on the server in the `items` row. Only the server knows which task an `itemId` stands for. The correct answer, the traps, the solution, the hints and the allowed step graphs never go into `InputSpec`. The server gives the verdict. After an attempt the server sends the correct answer and the short solution in `AnswerOut`. A hint arrives only in reply to a `hint` request that spends a guiding thread.

### The template model is a TypeScript interface that owns generation, solving, traps, rendering and help

The draft gives this model. I translated its comments into English:

```typescript
type NodeId = string;                     // "A5"
type Locale = "ru" | "nl";               // nl is a future stage
type Level = "1F" | "1S" | "stretch";

interface Template<P> {
  id: string;                             // "A5.borrow_zero"
  node: NodeId;
  subtype: string;
  level: Level;
  version: number;                        // changes on any change to generation
  weight: number;
  curriculum: "core" | "nl";              // Dutch formats are a separate layer
  steps: number;                          // number of computational steps
  fluencyMs: number;                      // starting fluency threshold (median)
  minMs?: number;                         // plausible-answer threshold; default in "Protecting the measurement"
  scratch: "none" | "allowed";            // in the head or with scratch work
  riskyTerms: string[];                   // keys of lexicon.nl.json
  sample(rng: Rng): P;
  valid(p: P): boolean;
  solve(p: P): Answer;
  traps: Trap<P>[];
  answer: AnswerSpec;
  render: Partial<Record<Locale, (p: P, ctx: RenderCtx) => ItemView>>;
  graph(p: P): StepGraph;                 // main computation graph: source of the solution, hints and explanations
  solution(p: P): SolutionView;           // short solution: steps with numbers and the answer (numbers from graph)
  hints(p: P): [HintStep, HintStep, HintStep]; // 1: where to start, no numbers; 2: the first step; 3: everything but the last
  explain(p: P, trapId?: string): string; // template explanation (fallback for the language model)
  difficulty(p: P): Record<string, number | string>; // difficulty features for parallel tasks
  sampleParallel(p: P, rng: Rng): P;      // second-attempt parameters with the same difficulty features
}

interface SolutionView { steps: { text: string; value: string }[]; answer: string } // code has already substituted the numbers
interface HintStep { level: 1 | 2 | 3; text: string }                           // code has already substituted the numbers

interface Trap<P> {
  id: string;                             // "frac.add.across"
  kind: "conceptual" | "procedural" | "fact";
  apply(p: P): Answer | null;             // null: does not apply to these numbers
}

type AnswerSpec =
  | { kind: "integer" }
  | { kind: "decimal"; maxPlaces: number }
  | { kind: "fraction"; accept: "equivalent" | "simplest" }
  | { kind: "mixed"; accept: "equivalent" | "simplest" }
  | { kind: "quotientRemainder" }
  | { kind: "time"; clock: "analog" | "digital" }      // hh:mm
  | { kind: "point" }                                  // (x; y)
  | { kind: "compare" }                                // < = >
  | { kind: "choice"; options: 4 | 5 }                  // scored tasks have at least 4 options
  | { kind: "grid"; width: number; height: number }    // marked cells
  | { kind: "order"; count: number }                   // permutation of elements
  | { kind: "steps"; graphs: StepGraph[] }             // step-by-step solution
  | { kind: "equation" };                              // value of the unknown

type Answer =
  | { kind: "number"; value: Q }                       // integer, decimal
  | { kind: "fraction"; whole?: bigint; num: bigint; den: bigint }
  | { kind: "qr"; quotient: bigint; remainder: bigint }
  | { kind: "time"; h: number; m: number }
  | { kind: "point"; x: Q; y: Q }
  | { kind: "compare"; sign: "<" | "=" | ">" }
  | { kind: "choice"; index: number }
  | { kind: "grid"; cells: [number, number][] }
  | { kind: "order"; perm: number[] }
  | { kind: "steps"; values: Q[]; final: Q }
  | { kind: "dont_know" };

interface ItemView {                                   // exactly what the child saw
  locale: Locale;
  leadIn?: string;                                     // the Master's lead-in (outside the task window)
  text: string;                                        // the problem with numbers substituted
  svg?: string;                                        // procedural picture
  options?: string[];
  terms: { key: string; start: number; end: number }[]; // hint terms
  frameId?: string; anchorId?: string;
}

interface StepGraph {                                  // one allowed way to solve
  steps: { op: "+" | "-" | "*" | ":"; args: StepArg[]; value: Q }[];
}
type StepArg = { given: string } | { step: number };   // a number from the problem or the result of a step
```

### The hint ladder has three fixed steps

Hint 1 says where to start, without numbers. Hint 2 gives the first step. Hint 3 gives everything except the last step. Code substitutes every number in the solution and the hints from the computation graph.

### Each trap has one of three kinds and can decline to apply

A trap has an identifier such as `frac.add.across` and a kind: `conceptual`, `procedural` or `fact`. Its `apply` returns the wrong answer the misconception gives, or `null` where the trap doesn't apply to these numbers.

### The Dutch locale and the Dutch curriculum layer are later stages

`Locale` includes `nl`, marked as a future stage. `curriculum` separates `core` from `nl`, and Dutch formats form a separate layer. `riskyTerms` lists keys of `lexicon.nl.json`. Deferred until after the MVP by the draft: the `nl` locale, "будущий этап" (a future stage).

### Resolved: `riskyTerms` and the glossary ship in the MVP, and only the `nl` locale and the `nl` curriculum wait for the Dutch layer

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft keys `riskyTerms` into `lexicon.nl.json`, which reads like part of the deferred Dutch stage. The options were to fill `riskyTerms` and the glossary in the MVP, or to leave both empty until the Dutch layer. Leaving them empty saves the glossary content. Filling them wins, because the language-risk limit ships in the MVP (RES-0800 gives the comparison, RES-1300 the limit). The player learns maths in Dutch now, so a language error in a Russian task would otherwise read as a maths gap. The glossary holds, for each maths term, the Russian explanation, the picture and the Dutch equivalent the term hint shows. It is content data for a task rendered in `ru`, not a Dutch rendering, so `Locale` stays `ru` in the MVP and `curriculum: "nl"` stays deferred. The draft of this finding left open which terms the glossary holds, beyond «знаменатель», «периметр», «делимое» and «масштаб», and who writes the Dutch equivalents.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. The glossary holds every Russian maths term that appears in the task text of an MVP template, which is the union of the templates' `riskyTerms`, not only the four examples. The building agent drafts each Dutch equivalent from SLO terminology, the words the SLO reference framework and its 1F/1S concretisation use, and from common Dutch primary-school maths textbooks, and the parent reviews each entry in the Parent Room before it shows. So every MVP template must list in `riskyTerms` each Russian maths term its task text uses, and the build fails a template whose term has no glossary entry. RES-0800 holds the comparison.

### Resolved: a template reads its subtype's `level` and `weight` from the skill graph and keeps no copy of its own

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's template model carries `level` and `weight`, and the skill graph (RES-0800) also carries a level and a weight for each subtype. The options were to keep both copies or to make one source. Two copies can disagree, and the SLO check has just changed the levels of 17 nodes in the graph. The graph wins as the one source, because it is versioned data the parent changes without code, while a template is code. So the model's `level` and `weight` fields become values the template reads from the graph, and a build check fails when a template names a subtype the graph lacks. RES-0800 gives the full reason.

### The draft chooses pictures drawn by code over pictures from a neural network

Code draws mathematical illustrations as SVG from the task's parameters: the number line, parts of a circle and of a strip, figures on a square grid, angles, symmetry axes, the coordinate plane, charts, analogue clocks, nets, and instrument scales. The reason the draft gives: the picture's accuracy is part of the task, so it comes only from code, "никогда от нейросети" (never from a neural network).

### Anchor tasks come later, with Ascents

Deferred until after the MVP by the draft, "вместе с Восхождениями" (together with Ascents). Anchors are fixed tasks in four forms, A to D, for each node. Only Ascents use them. Anchors never get live story frames and never change between runs.

### Fluency thresholds are starting medians for a child of the player's age

The catalogue's threshold is the starting value of the median answer time for a child of the player's age (kept in `personal/player.md`). Calibration adjusts it later. The traps column lists the misconceptions for which the template computes a wrong answer.

### The catalogue covers numbers (N1 to N8)

| ID | Subtypes and ranges | Answer | Threshold, s | Traps |
| --- | --- | --- | --- | --- |
| N1 | compare two numbers up to 100; the number before or after | compare, integer | 3 | the number after 29 written as 20 or 210 (no crossing of the ten); comparing by the last digit |
| N2 | composing a three-digit number (3 hundreds 5 tens = ?), with a zero in a place | integer | 6 | 305 -> 35 |
| N3 | words -> digits up to 999 999; comparing six-digit numbers; "how many tens of thousands" | integer, compare | 10 | missing zero; comparing by the first digit when the lengths differ |
| N4 | round to 10/100/1000; estimate a sum or product (choose the nearest) | integer, choice | 8 | truncating instead of rounding; the wrong place |
| N5 | the number at a point on the number line (scale step 1, 2, 5, 10, 25, 100) | integer | 12 | counting tick marks instead of intervals; scale step taken as 1 |
| N6 | "2,5 million = ?", writing a number with 9 to 10 digits, rounding to millions | integer, decimal | 15 | 2,5 million = 2 500 000 000 or 250 000 |
| N7 | temperature on a thermometer; it was -3°, became +5°: by how much; order signed numbers | integer, order | 15 | difference = 5 - 3 = 2; -7 > -2 |
| N8 | -3 + 5, 2 - 7, -4 - 6; with a scale and without | integer | 12 | sign lost (2 - 7 = 5); -4 - 6 = -2 |

### The catalogue covers arithmetic (A1 to A16)

| ID | Subtypes and ranges | Answer | Threshold, s | Traps |
| --- | --- | --- | --- | --- |
| A1 | a ± b up to 20, with and without crossing the ten | integer | 3 | ±1 (counting on fingers) |
| A2 | two-digit ± two-digit mentally, crossing the ten | integer | 6 | forgotten ten; "smaller from larger" by digits (52 - 18 = 46) |
| A3 | a · b, a, b ∈ 2..9; all 36 facts | integer | 3 | neighbouring fact (a·(b±1)); addition instead of multiplication |
| A4 | c : a for table values of c | integer | 4 | neighbouring fact |
| A5 | three- to five-digit ±; no carry, 1 to 2 carries, borrowing across a zero (4 003 - 1 257) | integer | 25 | forgotten carry; "smaller from larger"; borrowing across a zero without reducing the next place |
| A6 | three- to four-digit · one-digit, with zeros inside | integer | 25 | forgotten carry; carry multiplied instead of added |
| A6a | 40 · 7, 30 · 60, 2 400 : 60, 5 600 : 700 | integer | 8 | a zero lost or added (30 · 60 = 180 or 18 000) |
| A7 | two-digit · two-digit, three-digit · two-digit | integer | 60 | partial product not shifted; only units·units + tens·tens |
| A8 | a : b with remainder, a ≤ 100 | quotientRemainder | 8 | remainder ≥ divisor; quotient 1 too small |
| A9 | three- to four-digit : one-digit, exact and with remainder, zero in the quotient (824 : 4 = 206) | integer, quotientRemainder | 45 | zero lost in the quotient (26); digits swapped |
| A10 | three- to four-digit : two-digit, exact | integer | 90 | zero lost; quotient ±1 in a place |
| A11 | expressions of 3 to 4 operations with and without brackets, numbers up to 100; unknown component | integer, equation | 20 | left to right without precedence; brackets ignored; x + 15 = 42 -> 57 |
| A12 | divisible by 2, 3, 5, 9, 10?; all divisors of a number up to 60; LCM (least common multiple) of two numbers up to 12 | choice, integer | 15 | test for 3 by the last digit; LCM = product |
| A13 | a convenient mental method: 99 · 7, 25 · 36, 398 + 256, 5 · 48 · 2; subtype "properties of operations" (which equation is true) | integer, choice | 15 | compensation the wrong way (99 · 7 = 700 + 7); a · (b + c) = a · b + c |
| A14 | the plausible one of 4 "calculator screens"; 12,333... -> "13 buses" | choice, integer | 20 | comma shifted; remainder dropped when one more bus is needed |
| A15 | x + 3,5 = 10; x · 0,5 = 3; x : 4 = 2,5; 120 - x = 47 | equation | 20 | the wrong inverse operation (x · 0,5 = 3 -> 1,5); 120 - x = 47 -> 167 |
| A16 | 3x + 5 = 26; (x - 4) : 3 = 7; 2x - 7 = 15 | equation | 40 | order of inverse operations swapped (3x + 5 = 26 -> 26 : 3 - 5); subtracted instead of added |

### The catalogue covers fractions (F1 to F8)

| ID | Subtypes and ranges | Answer | Threshold, s | Traps |
| --- | --- | --- | --- | --- |
| F1 | what fraction is shaded (circle, strip, set), including unequal parts | fraction | 8 | shaded over unshaded; counting unequal parts |
| F2 | (m/n) of N; N from a known fraction | integer | 20 | N : m · n; only N : n |
| F3 | `same_den`: compare with the same denominator; `same_num`: with the same numerator; with 1/2; `line`: the fraction at a point on the line | compare, fraction | 10 | "the larger denominator, the larger fraction" |
| F4 | missing term (2/3 = ?/12); reduce to lowest terms | integer, fraction (simplest) | 15 | added one number to the numerator and the denominator; not fully reduced |
| F5 | a/n ± b/n; mixed numbers with the same denominator; improper <-> mixed | fraction, mixed | 15 | added the denominators |
| F6 | a/b ± c/d, denominators up to 12; multiples and coprime | fraction (equivalent) | 40 | numerator+numerator / denominator+denominator; denominator converted, numerator not |
| F7 | (a/b) · n, (a/b) · (c/d) | fraction (equivalent) | 25 | multiplied both numerator and denominator by n; converted to a common denominator |
| F8 | n : (a/b), (a/b) : (c/d) | fraction (equivalent) | 30 | divided numerator by numerator; inverted the wrong fraction |

### The catalogue covers decimals (D1 to D7)

| ID | Subtypes and ranges | Answer | Threshold, s | Traps |
| --- | --- | --- | --- | --- |
| D1 | compare decimals of different length (0,4 and 0,35); the digit in a place; a point on the line | compare, integer, decimal | 10 | "longer is larger"; "shorter is larger" |
| D2 | ± with different numbers of places (3,5 + 1,25; 7 - 2,4) | decimal | 25 | aligned on the right (4,75 -> 1,60); whole number without ",0" |
| D3 | · and : by 10, 100, 1000 | decimal | 8 | appended a zero (3,4 · 10 = 3,40); shift the other way |
| D4 | decimal · natural; decimal · decimal (0,3 · 0,2) | decimal | 35 | comma placed as in one factor (0,6) |
| D5 | decimal : natural; number : decimal (6 : 0,3) | decimal | 50 | comma not moved (6 : 0,3 = 2); "division always makes smaller" |
| D6 | 3/4 -> 0,75; 0,6 -> fraction; 7/20 -> decimal | decimal, fraction (simplest) | 15 | 3/4 = 3,4; 0,6 = 1/6 |
| D7 | 1/2 + 0,3 · 4; (0,5 + 1/4) · 8; 2 - 3/4 : 3 | decimal, fraction (equivalent) | 45 | left to right without precedence; fraction and decimal added "by digits" |

### The catalogue covers percentages and proportion (P1 to P7)

| ID | Subtypes and ranges | Answer | Threshold, s | Traps |
| --- | --- | --- | --- | --- |
| P1 | `half_tenth`: 50% and 10% as a fraction; `decimal`: 25%, 1%, 5% as a decimal; percentage shaded (10×10 grid) | fraction, decimal, integer | 10 | 25% = 1/25; 5% = 0,5 |
| P2 | p% of N; p ∈ {10, 20, 25, 50, 75, 5, 1, 15} | integer, decimal | 20 | N : p; comma shifted the wrong way |
| P3 | what percentage a is of b; price after a discount or a markup; VAT (value added tax); more than 100% | integer, decimal | 40 | the discount instead of the new price; b/a instead of a/b; +10% - 10% = the original |
| P4 | "3 notebooks cost 45, how much are 7?"; a gap in a proportion table; dividing in the ratio 2 : 3 | integer | 30 | additive reasoning ("4 more" instead of "... times") |
| P5 | scale 1 : 100 / 1 : 10 000 / 1 : 50 000, segment -> distance and back | integer, decimal | 35 | units lost (cm <-> m <-> km); division instead of multiplication |
| P6 | which of two packs is the better buy; a deposit and annual interest; bought for a, sold for b: profit in % | choice, decimal | 45 | choosing by price without weight; percentage of the new price |
| P7 | +20%, then -20% of N; after a 25% discount it costs 60: what was it; two rises in a row | decimal, integer | 50 | back to the original; original = 60 + 25% of 60 = 75; percentages added (+10% and +10% = +20%) |

### The catalogue covers measurement (M1 to M14)

| ID | Subtypes and ranges | Answer | Threshold, s | Traps |
| --- | --- | --- | --- | --- |
| M1 | `whole`: mm/cm/dm/m/km, g/kg/t whole numbers; `decimal`: 2,5 km = ? m | integer, decimal | 15 | wrong factor (100 instead of 1000); the opposite direction |
| M2 | time on an analogue clock (3:15 and 15:15 both accepted); in N minutes; an interval across the hour; calendar, timetable | time, integer | 15 | an hour = 100 minutes; hands swapped |
| M3 | `whole`: cost and change in whole euros; `cents`: euros and cents, change from 20 and 50; without change; prices with 3 digits | decimal, integer | 25 | cents as tenths (1,5 = 1 euro 5 cents) |
| M4 | perimeter of a rectangle; a polygon on a grid; a side from the perimeter; one area, different perimeters | integer | 20 | sum of two sides; confused with area |
| M5 | `grid`: area by counting cells; `formula`: l × b; a side from the area; sides ×2 -> area ×4 | integer | 20 | perimeter instead of area; sides ×2 -> area ×2 |
| M6 | right triangle on a grid; an L-shape of 2 to 3 rectangles | integer | 40 | not divided by 2; parts counted twice |
| M7 | `grid`: volume from cubes; `formula`: l × b × h; dm³ = l | integer, decimal | 30 | sum of edges; only the visible cubes |
| M8 | s = v · t in three directions, km/h and h, half an hour | integer, decimal | 40 | multiplication instead of division; 30 min = 0,3 h |
| M9 | m² <-> dm² <-> cm², ha <-> m², are; area of a field in hectares | integer, decimal | 20 | linear factor (1 m² = 100 cm²) |
| M10 | cm³ <-> dm³ <-> m³, l <-> ml, dl, cl; litres in an aquarium a × b × c cm | integer, decimal | 30 | factor 100 or 10 instead of 1000 |
| M11 | circumference from the diameter or radius; area of a circle; π = 3,14, calculator allowed | decimal | 45 | radius instead of diameter; area instead of circumference |
| M12 | choose the plausible measure: height of a door, mass of an apple, volume of a bucket; how many steps in 100 m; a field is about ? ha | choice, integer | 12 | unit off by an order of magnitude (door 2 cm or 20 m); mass as volume |
| M13 | reading a ruler that doesn't start at zero, a measuring jug with a 50 ml scale step, scales, a thermometer below zero, a meter | integer, decimal | 12 | reading from the ruler's edge instead of zero; scale step taken as 1 |
| M14 | average speed over two stretches; 36 km/h = ? m/s; two people together do a job in ... | decimal, fraction | 60 | average speed = average of the speeds; working times added |

### The catalogue covers geometry (G1 to G7)

| ID | Subtypes and ranges | Answer | Threshold, s | Traps |
| --- | --- | --- | --- | --- |
| G1 | name the figure; a property (is a square a rectangle?); rotated figures | choice | 10 | a rotated square = "a rhombus, not a square" |
| G2 | kind of angle; measure with an on-screen protractor ±2°; angles on a line | choice, integer | 20 | size depends on the length of the arms; the wrong scale (180 - x) |
| G3 | is there an axis of symmetry; reflect a figure on a grid (by touching cells) | choice, grid | 25 | translation instead of reflection; a rectangle's diagonal taken as an axis |
| G4 | coordinates of a point; place a point by touch | point | 10 | (y; x) instead of (x; y) |
| G5 | which net folds into a cube; number of faces, edges, vertices | choice, integer | 20 | counting only the visible faces |
| G6 | from which side the photo was taken; front view; `blocks` (stretch): a cube building -> top view, number of cubes from three views | choice, integer | 30 | only the visible cubes; mirrored view |
| G7 | on a plan: direction (4 and 8 compass points); distance by a linear scale; a route along grid cells | choice, integer | 25 | west <-> east; straight line instead of along the road |

### The catalogue covers statistics and patterns (S1 to S7)

| ID | Subtypes and ranges | Answer | Threshold, s | Traps |
| --- | --- | --- | --- | --- |
| S1 | a value in a 4×4 table; the difference of two cells; a timetable | integer | 15 | neighbouring row or column |
| S2 | the value of a bar with a scale step of 2, 5, 10; when growth was greater | integer, choice | 20 | counting cells instead of values; the highest point instead of the steepest stretch |
| S3 | mean of 3 to 6 numbers; the missing number from the mean | integer, decimal | 35 | sum without dividing; middle of the list |
| S4 | fraction or percentage of a sector; which chart fits | integer, choice | 20 | a 90° sector = 90% |
| S5 | which of 4 stories fits the graph and the reverse; a value from a formula in words | choice, integer | 35 | graph read as a picture ("a hill = rode uphill"); the constant part multiplied |
| S6 | the next element of a number pattern (1, 2, 4, 7, ...) and of a figure pattern; the n-th element (1S) | integer | 20 | the same difference instead of a growing one; n-th = n · step without the start |
| S7 | median of an odd and an even set; mode; what changes when a number is added | integer, decimal | 30 | median without ordering; mode = the largest number |

### The catalogue covers text problems (T1 to T4) and science (E1 to E5)

| ID | Subtypes and ranges | Answer | Threshold, s | Traps |
| --- | --- | --- | --- | --- |
| T1-T4 | see the draft's section on text problems and step-by-step input; the ladder has 2 problems per step, gathered across days in daily play (resolved below) | integer, decimal, steps | 30 / 60 / 90 / 120 | the answer of an intermediate step; adding all the numbers; an extra number used |
| E1-E5 | a hand-written bank of 40 questions per topic, choice of 4 | choice | none | each wrong option is a known misconception: «тяжёлое падает быстрее» (heavy things fall faster), «летом Земля ближе к Солнцу» (the Earth is closer to the Sun in summer) |

### The draft contradicts itself on the three-way comparison answer

The model allows `{ kind: "compare" }`, a choice among "< = >", and its comment on `choice` says "в оцениваемых заданиях не меньше 4 вариантов" (scored tasks have at least 4 options). The catalogue lists `compare` as an answer for N1, N3, F3 and D1. It also lists yes/no questions as `choice`: G1 "is a square a rectangle?", G3 "is there an axis of symmetry" and A12 "divisible by 2, 3, 5, 9, 10?". A three-way sign guesses right one time in three and a yes/no question one time in two. The draft's adjacent section on answer input resolves this. That section replaces the sign form in scored tasks with "choose the largest of four" (`choice`) or "order 3 to 4 numbers" (`order`), and asks yes/no questions as a choice of 4. It keeps the sign form only in warm-ups, easy tasks and the teaching in Session 0. It says the catalogue's answer column is read with that correction, so the catalogue alone is misleading.

### Resolved: a template's default minMs is max(1500 ms, min(0.15 * fluencyMs, 10 000 ms)) plus the motor correction, and its fluencyMs is its node's catalogue value

Proposed by research on 2026-09-26; the owner approves it with this record.

The model's `minMs?` comment points to the measurement-protection rules. RES-1100 now sets the default there: `max(1500 ms, min(0.15 * fluencyMs, 10 000 ms))` plus her measured time per key press, or the motor correction plus 600 ms in small spaces. It follows the normative threshold of Wise and Ma (2012), 10 % of the mean time capped at 10 s; the draft's `0.3 * fluencyMs` flagged real answers in long templates, for example 18 s in A7. A template sets its own `minMs` only where the default is known to be wrong for it. Each template's starting `fluencyMs` is its node's value in the catalogue above (RES-0900), and RES-1300 checks the fact thresholds against published norms.

### Resolved: the T1-T4 word problems run in daily MVP play, 2 problems a step gathered across days

Proposed by research on 2026-09-26; the owner approves it with this record.

The catalogue's "2 problems per step" is the measure of the steps-held limit, not a daily block. In daily MVP play the Guardian gives 1 ladder problem on about one floor in three, and T1 to T4 also appear in rooms by value; the limit takes the last 2 unassisted first attempts at each step within 30 days. The Ascent's fixed run of 2 a step stays deferred. RES-1300 holds the options and the reason. Stage 0.1 builds T1 and T2 and stage 0.2 adds T3 and T4 (RES-3000).

## Conclusions

1. Code must generate every task during play from a template, a seed and the template version, and the same seed and version must rebuild the same task exactly.
2. The generator must be a deterministic seeded generator such as xoshiro128\*\*, with the seed `hash(sessionId, nodeId, slot)`, and must never use `Math.random`.
3. Every solution, trap answer and check must use exact rational arithmetic on `bigint`, with decimals held as fractions over 10^n, and never floating-point `number`.
4. The generator must reject parameters that break a subtype's constraints or repeat a task from the last 30 days, try up to 1,000 times, and then fall back to a parameter list.
5. The generator must reject parameters where any trap answer equals the correct answer or another trap's answer, so each wrong answer names one misconception.
6. Each template must build its short solution, its three-step hint ladder and its per-trap explanation from one computation graph, with every number substituted by code.
7. A language model must never compute a number, an answer or a picture; it may supply only words through placeholders.
8. The server must generate and render the task, keep the node, subtype, template, seed, parameters, answer, traps, solution and hints, and send the client only an opaque `itemId`, the view and the input description.
9. The server must release the short solution only after an attempt, and a hint or explanation only after the player spends a guiding thread.
10. A second attempt must use a parallel task with the same subtype and difficulty features and new numbers, checked for repetition and trap distinguishability.
11. Rendering for `ru` must use a decimal comma, «·» for multiplication, «:» for division and a space between digit groups.
12. Code must draw every mathematical picture as SVG from the task's parameters.
13. A probe must take two different subtypes of a node, and a full block must cover every subtype with a weight of 0.2 or more.
14. Every node in the catalogue must have templates with the subtypes, answer kinds, starting fluency thresholds and traps the catalogue gives, until calibration changes the thresholds.
15. A scored task must never offer fewer than four options, so the catalogue's `compare` and yes/no entries must become a choice of four or an ordering task in scored use.
16. Science questions must come only from a hand-written bank of 40 questions per topic, as a choice of four in which each wrong option is a known misconception.
17. A template without its own `minMs` must use `max(1500 ms, min(0.15 * fluencyMs, 10 000 ms))` plus the motor correction, or the motor correction plus 600 ms in small spaces, as RES-1100 sets.
18. T1-T4 word problems must run in daily MVP play through the Guardian and the rooms, and the ladder's 2 problems a step must be gathered across days, with no daily ladder block.
19. Templates must fill `riskyTerms` in the MVP, and the glossary must give each risky term its Russian explanation, picture and Dutch equivalent, while tasks still render only in `ru`.
20. A template must read its subtype's level and weight from the skill graph, and a build check must fail when a template names a subtype the graph lacks.
21. Every MVP template must list in `riskyTerms` each Russian maths term its task text uses, and each of those terms must have a glossary entry whose Dutch equivalent the building agent drafts from SLO terminology and common Dutch primary-school maths textbooks and the parent approves in the Parent Room, as research decided on 2026-09-27 on the owner's instruction.

## Sources

- The owner's draft «Хроники Башни — спецификация» (Chronicles of the Tower - specification), opening lines and sections «Задания и генераторы», «Конвейер одного задания», «Модель шаблона (TypeScript)», «Картинки в заданиях», «Якорные задания», «Каталог шаблонов по узлам» and the guessing rule in «Ввод и проверка ответа», read 2026-09-26; not kept in the repository - the task pipeline, the template model, pictures, anchor tasks and the template catalogue.
- S. L. Wise and L. Ma, "Setting response time thresholds for a CAT item pool: The normative threshold method", 2012, read through https://link.springer.com/article/10.1186/s40536-021-00100-w on 2026-09-26 - the NT10 rule behind the default `minMs`.
