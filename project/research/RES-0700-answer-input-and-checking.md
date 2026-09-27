---
id: RES-0700
artifact: research
status: approved
revised: 2026-09-26
---

# The draft proposes free input on a custom keypad, per-kind acceptance rules and word problems built as computation graphs

## Summary

The owner's draft proposes free input as the default answer form, because a typed answer can't be guessed. Multiple choice appears only where free input is awkward, and every scored choice task offers at least 4 options, so yes/no and two-number comparisons are recast as a choice from four or an ordering. A custom on-screen keypad handles digits, fractions, mixed numbers, remainders and time, and the engine classifies each wrong answer as a trap, a computational slip or unclassified. A table of acceptance rules per answer kind sets what is accepted, what earns half credit and what is rejected. Word problems are built first as a computation graph of k steps from fluent numbers, and only then given a story frame with strict length and readability limits. Half of the compound problems take step-by-step input, matched against every valid graph, and some problems start by choosing a model of the problem. This record covers answer input, acceptance, error classification, word-problem construction, step input and model choice. It leaves the LLM frame pipeline to RES-0720 and the task catalogue that the answer column refers to to other records.

## The question

How does the game take an answer so that it measures what the player knows and not what she guessed or mistyped? The draft assumes that free typed input on a purpose-built keypad removes guessing, and that exact acceptance rules can tell a real error from a formatting difference. That assumption holds less well for choice forms and for multi-step problems, which is why the draft sets a floor of 4 options and matches intermediate steps against every valid graph.

## Method

Read the owner's draft «Хроники Башни — спецификация» ("Tower Chronicles: specification"), sections «Ввод и проверка ответа» ("Answer input and checking") and «Текстовые задачи и пошаговый ввод» ("Word problems and step-by-step input"), on 2026-09-26.

The draft leaves these points open:

- It gives no thresholds for the readability metric; it says only that frames above the threshold aren't used.
- It doesn't define `maxPlaces` or say where each task sets it.
- It doesn't say which half of the compound problems take step input, or how the half is chosen.
- It doesn't say what share of problems start with a model choice.
- It doesn't define the tier T4 or the node state «бегло» ("fluent") in this range.
- It doesn't say how a half-credit answer (0.5) enters the estimate or the game outcome.
- The catalogue that «Колонка «Ответ» каталога ниже» ("the catalogue's Answer column below") refers to is outside this range.

## Findings

### Free input is the default, and choice appears only where free input is awkward

Free input is the default, because a typed answer can't be guessed. Multiple choice is used only where free input is inconvenient:

- recognising shapes;
- nets;
- symmetry;
- «объясни, почему» ("explain why");
- natural science;
- models of problems.

Wrong options come from traps. Where traps run short, the remaining options are close in form to the right answer.

### Scored choice tasks offer at least 4 options, so yes/no and two-number comparisons are recast

Scored tasks offer at least 4 options. A yes/no question is asked as a choice from 4. The draft's examples:

- «есть ли ось симметрии» ("is there an axis of symmetry") becomes «у какой из четырёх фигур есть ось симметрии» ("which of the four shapes has an axis of symmetry");
- «делится ли на 3» ("is it divisible by 3");
- «квадрат — прямоугольник?» ("is a square a rectangle?").

Comparing two numbers with a sign (<, =, >) lets the player guess 1 in 3. In scored tasks it becomes «выбери наибольшее из четырёх» ("choose the largest of four", `choice`) or «упорядочи 3–4 числа» ("order 3 to 4 numbers", `order`). The sign form stays only in warm-ups, easy tasks and the Session 0 tutorial. The draft says the catalogue's «Ответ» ("Answer") column is to be read with this correction.

### A custom keypad covers every answer form the game needs

The on-screen keypad has these keys: digits, the decimal comma, «дробь» ("fraction"), «целая часть» ("whole part"), «остаток» ("remainder"), «:» for time, minus and erase. «Готово» ("Done") and «Не знаю» ("I don't know") are buttons of the task window, not keys. A fraction is a two-storey field. A mixed number is three fields. The interface labels the units. The draft put «Готово» and «Не знаю» on the keypad; the resolved finding below moves them.

### Resolved: «Не знаю» and «Готово» live in the task window's action row, not on the keypad

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft lists «Не знаю» as a keypad key. The owner's design (RES-3200) has no such key: `MathKeypad` holds digits and the answer-shape keys, and `TaskWindow` puts «Не знаю» and the guiding thread on the left of its action row and «Готово» on the right, with the keypad's own `done` key hidden. Two options were weighed:

- A keypad key. «Не знаю» sits under the thumb with the digits, so it takes the least reach.
- A task-window button. «Не знаю» is present in every task, including choice tasks, model choices and grid tasks that show no keypad, so it has one place the player learns once. It sits away from the digit keys, so a slip of the thumb while typing can't end a first attempt with no answer. That slip would record a false «Не знаю», which scores 0 and counts towards the avoidance signal (RES-0300).

The task-window button wins, because «Не знаю» must exist where no keypad does, and because a stray press ends a first attempt that can't be taken back, which would corrupt the unassisted observation the model depends on (RES-0400, RES-0900). On a computer the «?» key stays a shortcut for «Не знаю» and Enter for «Готово» (RES-2500).

### The engine sorts a wrong answer into one of three classes

| Condition | Class |
| --- | --- |
| The answer matches a trap | The trap's type |
| It differs from the correct answer by one digit, a swap of digits or a neighbouring times-table fact | «вычислительная» ("computational") |
| Anything else | «не классифицирована» ("unclassified") |

### Each answer kind has its own acceptance rule

| Answer kind | Accepted | Partial (0.5) | Not accepted |
| --- | --- | --- | --- |
| integer | a number; spaces between digit groups are ignored | - | extra leading zeros don't matter; other characters are a parse error, and the player is asked to correct them |
| decimal | «,» or «.»; trailing zeros (3,50 = 3,5); an integer without «,0» | - | more than `maxPlaces` places, if that changes the value |
| fraction `equivalent` | any equal fraction, including an improper one | - | decimal notation |
| fraction `simplest` | only the fully reduced fraction | correct but not fully reduced | - |
| mixed `equivalent` | a mixed number or an equal improper fraction | - | - |
| mixed `simplest` | a mixed number with a fully reduced fractional part | an improper fraction, or an unreduced fractional part | - |
| quotientRemainder | quotient and remainder, with the remainder less than the divisor | - | a remainder equal to or greater than the divisor |
| time (analog) | 3:15 and 15:15 for the same position of the hands; 03:15 | - | - |
| time (digital) | 24-hour format; «9:05» and «09:05» | - | - |
| point | (x; y) by clicking a grid node | - | (y; x) is classified as a trap |
| compare, choice | one sign or option | - | - |
| grid | the exact set of cells | - | - |
| order | the exact permutation | - | - |
| steps | the final answer is right and the steps match one of the valid graphs | the final answer is right, the steps aren't recognised | - |
| equation | the value of the unknown (a number, or a fraction under the `equivalent` rule) | - | - |

### The integer row puts an acceptance rule in the column for rejected answers

The draft contradicts itself in the integer row. The «Не принимается» ("Not accepted") column reads «лишние ведущие нули не мешают» ("extra leading zeros don't matter"), which is a rule for accepting an answer. The same cell then says «другие символы — ошибка разбора, просим исправить» ("other characters are a parse error; we ask for a correction"), which is neither accepted nor rejected but returned to the player. Read together, the row accepts leading zeros and sends other characters back without scoring them.

### Unparsed input isn't an answer and costs the player nothing

Input the engine can't parse, such as «3,,5», doesn't count as an answer. The field is highlighted softly, with no words about an error, and the timer keeps running.

### A word problem is built as a computation graph first and gets its story afterwards

A word problem is built as a computation graph of k steps, and only then gets a story.

1. The structure comes from the catalogue: a chain (a∘b)∘c; a fork (a∘b) and (c∘d) followed by a comparison; «части и целое» ("parts and whole"); «на N больше / в N раз» ("N more / N times as many"); «цена · количество → сдача» ("price · quantity → change"); motion; work.
2. Numbers come only from nodes that are currently «бегло» ("fluent"), usually mental arithmetic to 100 and the times tables. So the ladder measures holding the steps together, not the calculations.
3. Tier T4 adds one irrelevant number.
4. The frame fits the structure and carries placeholders, for example «{hero} купила на Ярмарке Весов {a} {item:gen} по {b} монет…» ("{hero} bought {a} {item} at the Fair of Scales (Ярмарка Весов) for {b} coins each…"). Noun forms after numbers (1 зелье, 3 зелья, 5 зелий: "1 potion, 3 potions, 5 potions") come from an item dictionary with three forms per item.
5. Text limits: at most k+1 sentences, at most 14 words a sentence, and the question as a separate last sentence.
6. Each frame gets a readability metric: mean sentence length, the share of words outside a frequency dictionary for the player's age (kept in `personal/player.md`), and the number of risk terms. Frames above the threshold aren't used.

### Half of the compound problems take step-by-step input, matched against every valid graph

Step-by-step input («1) … 2) … Ответ: …», "1) … 2) … Answer: …") is used in half of the compound problems.

- The template stores every valid computation graph for the problem, for example 3 · 5 + 3 · 7 and 3 · (5 + 7).
- The engine matches each intermediate result against every graph and labels it a correct step, the right operation with a calculation error, the wrong operation (matching a structure trap) or «не классифицирован» ("unclassified").
- The Director sees which step went wrong and how. The engine never counts an unknown step as an error automatically: it goes to the report as unclassified, for review by hand.

### Some problems start with choosing a model, logged apart from the answer

Modelling is measured apart from calculation. Some problems start with a choice of a short notation or a bar diagram from four options. The model choice and the answer are logged separately, as `modelChoice`.

## Conclusions

1. Every task must take free input unless it is a shape, net, symmetry, explain-why, natural science or problem-model task.
2. The wrong options of a choice task must come from traps, with any missing options close in form to the correct answer.
3. Every scored choice task must offer at least 4 options, and a scored yes/no question must be asked as a choice from 4.
4. A scored comparison of two numbers must be asked as choosing the largest of four or ordering 3 to 4 numbers, and the sign form may appear only in warm-ups, easy tasks and the Session 0 tutorial.
5. The on-screen keypad must provide digits, a decimal comma, fraction, whole part, remainder, a time colon, minus and erase, with a two-storey fraction field, a three-field mixed number and labelled units; «Готово» and «Не знаю» must be task-window buttons, not keypad keys.
6. The engine must classify each wrong answer as the matching trap type, as computational when it differs by one digit, a digit swap or a neighbouring times-table fact, and otherwise as unclassified.
7. The engine must accept, half-credit and reject answers per answer kind exactly as the acceptance table sets out.
8. The engine must accept an integer with spaces between digit groups or extra leading zeros, and must return an integer with other characters to the player as a parse error.
9. Unparsed input must not count as an answer, must be highlighted softly with no error wording, and must leave the timer running.
10. The engine must build a word problem as a computation graph from a catalogue structure before choosing its story frame.
11. Word problem numbers must come only from nodes the player currently has as fluent.
12. A T4 word problem must contain exactly one irrelevant number.
13. A word problem frame must use placeholders, take noun forms after numbers from a three-form item dictionary, and hold at most k+1 sentences of at most 14 words, with the question as its own last sentence.
14. A frame must pass a readability metric of mean sentence length, share of words outside a frequency dictionary for the player's age and count of risk terms before use.
15. Half of the compound problems must take step-by-step input.
16. The template must store every valid computation graph for a problem, and the engine must label each entered step against all of them.
17. The engine must never mark an unrecognised step as an error, and must send it to the report as unclassified.
18. A problem that starts with a model choice must log the model choice as `modelChoice`, separately from the answer.
19. «Не знаю» must be present in every task, whatever its answer form, in the task window's action row away from the digit keys.

## Sources

- The owner's draft «Хроники Башни — спецификация», sections «Ввод и проверка ответа» and «Текстовые задачи и пошаговый ввод», read 2026-09-26; not kept in the repository - input forms, the keypad, error classes, acceptance rules, word problem construction, step input and model choice.
