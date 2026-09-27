---
id: RES-0800
artifact: research
status: approved
revised: 2026-09-27
---

# The draft proposes a skill graph of 79 maths nodes in nine domains, checked against Dutch levels 1F and 1S

## Summary

The owner's draft proposes a skill graph of 79 mathematical nodes in nine domains, plus five science topics outside the prerequisite graph. Of the 79 nodes, 69 sit at Dutch levels 1F or 1S and 10 at the stretch level, which looks past 1S towards the VWO track. Each node carries a code, a level and its prerequisites, and some prerequisites apply to one subtype only. The draft checks the graph against the full text of the SLO document «Concretisering referentieniveaus rekenen 1F/1S» and draws five consequences from that check. I re-checked the levels against the SLO documents themselves, and 17 nodes move to "1F/1S", with subtypes at both levels. The draft admits a stretch node to testing only when the top nodes of its domain are fluent, and never reports an unmastered stretch node as a gap. The draft takes its method from the classical Soviet school first and Dutch test formats later. It also names a risk: the player learns maths in Dutch, so an error in a Russian task might be a language error. This record carries the whole node list, the subtype prerequisites, the SLO check, the stretch rules, the method and the language risk. The knowledge model, node states, probes, blocks and inference rules are in RES-0900, and the rest of task selection belongs to other records.

## The question

What skills does the game measure, in what order do they depend on each other, and how far above the school target does it look? The draft assumes that one fixed graph of nodes and prerequisites can describe what the player knows. A child can know a later skill while missing an earlier one, which is why the draft adds island checks (RES-0900) and lets the player solve by her own method. The assumption also ties content to the Dutch curriculum while the tasks are in Russian, and the language risk below is the draft's answer to that tension.

## Method

I read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles, specification), the opening context and the sections «Граф навыков» (skill graph), «Узлы» (nodes), «Пререквизиты на уровне подтипов» (subtype prerequisites), «Сверка с голландской программой» (check against the Dutch curriculum), «Stretch (к VWO)» (stretch, towards VWO), «Методика: классическая советская школа, затем голландские тесты» (method: classical Soviet school, then Dutch tests) and «Риск русских терминов» (risk of Russian terms), on 2026-09-26. On the same day I downloaded and read the SLO documents themselves: the «Referentiekader taal en rekenen» (reference framework for language and arithmetic) with its 1F and 1S tables, the SLO «Concretisering referentieniveaus rekenen 1F/1S» the draft cites, and the SLO 2025 core goals for primary school. The finding "Resolved: the SLO text moves 17 nodes to 1F/1S" gives what they say, node by node. The draft's first version of this paragraph said the SLO check was reported unverified.

The draft leaves these open:

- the value of `typicalGroup` for every node, which the draft names as a field but never fills in;
- the subtype weights for every node, and the full list of subtype names beyond those the draft mentions;
- which nodes carry the `ruOnly` flag;
- the list of Russian terms at risk beyond the four examples, and the content of `content/lexicon.nl.json` (closed on 2026-09-27: research decided, on the owner's instruction, that the glossary holds every maths term in an MVP template's task text; see the resolved finding on the language-risk limit);
- the content and nodes of the five science topics;
- the order of the Dutch stage and what "readiness by language and format" is measured with.

## Findings

### The draft proposes 79 maths nodes in nine domains and five science topics

The graph holds 79 mathematical nodes in 9 domains: 69 nodes at levels 1F or 1S and 10 stretch nodes. It also holds 5 science topics. The upper bound of the required part is the end of Dutch group 8, level 1S of the Dutch «referentiekader» (reference framework). The draft says this is close in meaning to the Russian 5th class with part of the 6th. The graph is versioned data in `content/graph.yaml`, and it changes without code.

The owner decided the player's current school group on 2026-09-27 (the value is kept in `personal/player.md`), and that she learns the full material including group 8. The graph therefore keeps its upper bound at the end of group 8, level 1S, and doesn't cut the group 8 nodes. RES-0900 starts every node from the prior of its level for the player's current group.

The draft explains the count: 56 nodes of the first version, plus 15 nodes added after the SLO check, plus node A6a, plus 7 new stretch nodes (N8, A15, A16, D7, P7, S7, M14). S3 (the mean) moved from stretch to 1S after a second SLO check, because "gemiddelde berekenen" appears in the level examples.

| Domain | Code | Nodes | Of which stretch | Floor |
| --- | --- | --- | --- | --- |
| Numbers | N | 8 | 1 (N8) | «Шуршащий Архив» (the Rustling Archive) |
| Arithmetic | A | 17 | 3 (A12, A15, A16) | «Завод Тикающих Чайников» (the Ticking Kettle Factory) |
| Fractions | F | 8 | 0 | «Кондитерская Облачных Долей» (the Cloud Slice Patisserie) |
| Decimals | D | 7 | 1 (D7) | «Канал Капель» (the Canal of Drops) |
| Percentages and proportions | P | 7 | 1 (P7) | «Ярмарка Весов» (the Fair of Scales) |
| Measures | M | 14 | 2 (M11, M14) | «Мерные Дюны» (the Measuring Dunes) |
| Geometry | G | 7 | 1 (G2) | «Сад Граней» (the Garden of Facets) |
| Data | S | 7 | 1 (S7) | «Сортировочная Шёпотов» (the Sorting House of Whispers) |
| Word problems | T | 4 | 0 | «Стражи математических этажей» (the Guardians of the maths floors) |
| Total | | 79 | 10 | |

The science topics live in «Обсерватория» (the Observatory), outside the prerequisite graph:

- E1 forces and motion;
- E2 substances and their states;
- E3 simple electric circuits;
- E4 living organisms and plants;
- E5 the Earth, the Sun and the Moon.

### Each node in `graph.yaml` carries eight fields

The draft lists these fields:

- `id`;
- `domain`;
- `level: 1F | 1S | stretch`, and each subtype has its own `level`;
- `typicalGroup`;
- `prereqs`, naming the subtype where a prerequisite applies to one subtype only;
- `stretchGate`, on stretch nodes only;
- `subtypes`, with weights;
- `ruOnly`, for a topic of the Russian programme that the Dutch one lacks.

### Resolved: the graph holds each subtype's level and weight, and templates read them from it

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft names two homes for subtype weights: `subtypes` with weights in `graph.yaml` here, and «с весами шаблонов» (with the weights of the templates) in the knowledge model (RES-0900), whose template model has its own `weight` and `level` fields (RES-1200). The options were the graph or the templates. Templates would keep a weight next to the code that generates the subtype. The graph wins, because conclusion 3 makes the graph versioned data that the parent or a developer changes without code, while a template is TypeScript. A weight and a level are judgements about the curriculum, like the levels the SLO check corrected, so they belong in that data. One home also means a change can't update one copy and leave the other. A template therefore reads its subtype's level and weight from the graph and carries no copy, and a build check fails when a template names a subtype the graph lacks.

### The domains depend on each other in eleven directed edges

The draft gives this domain graph:

| From | To |
| --- | --- |
| Numbers (N) | Arithmetic (A) |
| Arithmetic (A) | Fractions (F) |
| Fractions (F) | Decimals (D) |
| Decimals (D) | Percentages and proportions (P) |
| Fractions (F) | Percentages and proportions (P) |
| Arithmetic (A) | Measures (M) |
| Decimals (D) | Measures (M) |
| Numbers (N) | Geometry (G) |
| Arithmetic (A) | Data (S) |
| Arithmetic (A) | Word problems (T) |
| Percentages and proportions (P) | Measures (M) |

### The draft lists every node with its level and prerequisites

A level of "1F/1S" means the node has subtypes at both levels. A prerequisite written `N3 (whole)` applies to the subtype `whole` only. The Russian names are the draft's own wording. The levels include the corrections from the SLO text: 17 nodes differ from the draft, and the finding "Resolved: the SLO text moves 17 nodes to 1F/1S" gives each draft level and the reason.

Numbers (N):

| ID | Skill | Russian name | Level | Prerequisites |
| --- | --- | --- | --- | --- |
| N1 | Counting and numbers to 100, comparison | «Счёт и числа до 100, сравнение» | 1F | none |
| N2 | Place value to 1000 | «Разряды до 1000» | 1F | N1 |
| N3 | Multi-digit numbers to a million: writing, place value, comparison | «Многозначные числа до миллиона: запись, разряды, сравнение» | 1F/1S | N2 |
| N4 | Rounding and estimating a result | «Округление и прикидка результата» | 1F | N3 |
| N5 | Number line: position, scale interval | «Числовая прямая: положение, цена деления» | 1F | N3 |
| N6 | Large numbers: millions and billions in context (2,5 million) | «Большие числа: миллионы и миллиарды в контексте (2,5 млн)» | 1F/1S | N3 |
| N7 | Negative numbers on a scale: temperature, comparing, ordering | «Отрицательные числа на шкале: температура, сравнение, упорядочивание» | 1F/1S | N5 |
| N8 | Operations with negative numbers (`-3 + 5`, `2 - 7`) | «Действия с отрицательными числами» | stretch | N7, A2 |

Arithmetic (A):

| ID | Skill | Russian name | Level | Prerequisites |
| --- | --- | --- | --- | --- |
| A1 | Addition and subtraction within 20 | «Сложение и вычитание в пределах 20» | 1F | N1 |
| A2 | Mental addition and subtraction to 100, crossing the ten | «Устное сложение и вычитание до 100 с переходом через десяток» | 1F | A1, N2 |
| A3 | Multiplication table | «Таблица умножения» | 1F | A2 |
| A4 | Division as the inverse of multiplication (table facts) | «Деление как обратное умножению (табличное)» | 1F | A3 |
| A5 | Column addition and subtraction | «Сложение и вычитание столбиком» | 1F | A2, N3 |
| A6 | Multi-digit by one-digit multiplication | «Умножение многозначного на однозначное» | 1F | A3, A5 |
| A6a | Multiplying and dividing round numbers: `40 * 7`, `30 * 60`, `2400 : 60` | «Умножение и деление круглых чисел» | 1F | A3, A4, N2 |
| A7 | Multiplying by two- and three-digit numbers | «Умножение на двузначное и трёхзначное» | 1F | A6, A6a |
| A8 | Division with remainder | «Деление с остатком» | 1F | A4 |
| A9 | Long division by a one-digit number | «Деление уголком на однозначное» | 1F | A8, A6 |
| A10 | Division by a two-digit number | «Деление на двузначное» | 1F | A9, A6a, N4 |
| A11 | Order of operations and brackets; unknown component (`x + 15 = 42`, `72 : x = 8`) | «Порядок действий и скобки; неизвестный компонент» | 1F/1S | A4, A5 |
| A12 | Divisors, multiples, divisibility rules, least common multiple | «Делители, кратные, признаки делимости, НОК» | stretch | A4 |
| A13 | Efficient calculation: compensation, doubling and halving, grouping; properties of operations | «Рациональный счёт: компенсация, удвоение и деление пополам, группировка; свойства действий» | 1F/1S | A7, A11 |
| A14 | Calculator: ratio to rounded decimal, checking by estimate, remainder on the screen | «Калькулятор: отношение → округлённая десятичная, проверка прикидкой, остаток на экране» | 1F/1S | N4, D6 |
| A15 | One-step equations with a letter, all four operations, including decimals (`x * 0,5 = 3`) | «Уравнения в один шаг с буквой, все четыре действия, в том числе с десятичными» | stretch | A11, D4 |
| A16 | Two-step equations (`3x + 5 = 26`, `(x - 4) : 3 = 7`) | «Уравнения в два шага» | stretch | A15 |

Fractions (F):

| ID | Skill | Russian name | Level | Prerequisites |
| --- | --- | --- | --- | --- |
| F1 | Share and fraction as part of a whole | «Доля и дробь как часть целого» | 1F | A4 |
| F2 | Fraction of a number, and a number from its fraction | «Дробь от числа и число по его дроби» | 1F | F1, A9 |
| F3 | Comparing fractions, fractions on the number line | «Сравнение дробей, дроби на числовой прямой» | 1F/1S | F1 (same_den), N5 (line) |
| F4 | Equivalent fractions, simplifying | «Равные дроби, сокращение» | 1F/1S | F1, A4 |
| F5 | Addition and subtraction with equal denominators, mixed numbers | «Сложение и вычитание с одинаковыми знаменателями, смешанные числа» | 1F/1S | F3 |
| F6 | Addition and subtraction with different denominators | «Сложение и вычитание с разными знаменателями» | 1F/1S | F4, F5 |
| F7 | Multiplying a fraction by a number and by a fraction | «Умножение дроби на число и на дробь» | 1F/1S | F2, F5 |
| F8 | Dividing by a fraction | «Деление на дробь» | 1S | F7 |

Decimals (D):

| ID | Skill | Russian name | Level | Prerequisites |
| --- | --- | --- | --- | --- |
| D1 | Decimals: writing, place value, comparison | «Десятичные: запись, разряды, сравнение» | 1F | F3, N3 |
| D2 | Adding and subtracting decimals | «Сложение и вычитание десятичных» | 1F | D1, A5 |
| D3 | Multiplying and dividing by 10, 100, 1000 | «Умножение и деление на 10, 100, 1000» | 1F | D1 |
| D4 | Multiplying decimals | «Умножение десятичных» | 1F/1S | D2, D3, A7 |
| D5 | Dividing decimals | «Деление десятичных» | 1S | D4, A10 |
| D6 | Converting between fractions and decimals | «Перевод между дробями и десятичными» | 1F/1S | F4, D1 |
| D7 | Order of operations with fractions and decimals (`1/2 + 0,3 * 4`) | «Порядок действий с дробями и десятичными» | stretch | A11, F7, D4 |

Percentages and proportions (P):

| ID | Skill | Russian name | Level | Prerequisites |
| --- | --- | --- | --- | --- |
| P1 | Percentage as a hundredth: 1%, 10%, 25%, 50% | «Процент как сотая» | 1F | F1 (half_tenth), D6 (decimal) |
| P2 | Percentage of a number | «Процент от числа» | 1F | P1, F2 |
| P3 | What percentage one number is of another; discount, mark-up, VAT, more than 100% | «Какой процент составляет; скидка, наценка, НДС, больше 100%» | 1S | P2 |
| P4 | Ratio, "per one", direct proportion, proportion table | «Отношение, «на одного», прямая пропорциональность, таблица пропорции» | 1F | A9, F2 |
| P5 | Map and drawing scale | «Масштаб карты и чертежа» | 1F/1S | P4, M1 |
| P6 | Comparing ratios: better value, unit price; relative and absolute comparison | «Сравнение отношений: что выгоднее, цена за единицу; относительное и абсолютное сравнение» | 1F/1S | P3, P4, D5 |
| P7 | Successive and reverse percentages (+20% then -20%; price after a 25% discount is 60, find the original) | «Последовательные и обратные проценты» | stretch | P3, D4 |

Measures (M):

| ID | Skill | Russian name | Level | Prerequisites |
| --- | --- | --- | --- | --- |
| M1 | Length and mass, converting units | «Длина и масса, перевод единиц» | 1F | N3 (whole), D3 (decimal) |
| M2 | Time: clocks, intervals, calendar, timetable | «Время: часы, промежутки, календарь, расписание» | 1F | A2 |
| M3 | Money and change | «Деньги и сдача» | 1F | A5 (whole), D2 (cents) |
| M4 | Perimeter | «Периметр» | 1F/1S | A5, M1 |
| M5 | Area of a rectangle, units of area | «Площадь прямоугольника, единицы площади» | 1F/1S | A3 (grid), A7 (formula), M1 |
| M6 | Area of a triangle and of composite shapes (by splitting) | «Площадь треугольника и составных фигур (разбиением)» | 1S | M5, F2 |
| M7 | Volume of a cuboid, litres | «Объём параллелепипеда, литры» | 1F/1S | M5 |
| M8 | Speed, time, distance | «Скорость, время, расстояние» | 1S | P4, M2 |
| M9 | Units of area: square centimetres, square decimetres, square metres, square kilometres, are, hectare | «Единицы площади: см², дм², м², км², ар, гектар» | 1S | M5, D3 |
| M10 | Volume and capacity: cubic centimetres, 1 cubic decimetre = 1 litre, 1 cubic metre = 1000 litres; litre, decilitre, centilitre, millilitre | «Объём и ёмкость: см³, дм³ = л, м³ = 1000 л; л–дл–сл–мл» | 1F/1S | M7, D3 |
| M11 | Circumference and circle with pi about 3,14 | «Окружность и круг с π ≈ 3,14» | stretch | M6, D4 |
| M12 | Benchmark measures and estimating quantities: a step is about 1 m, a milk carton is 1 litre, 1 hectare is about 2 football pitches (1S subtype) | «Опорные меры и прикидка величин» | 1F/1S | M1, M9 (ha) |
| M13 | Instrument scales: ruler, measuring jug, scales, thermometer, meter | «Шкалы приборов: линейка, мерный стакан, весы, термометр, счётчик» | 1F | N5, D1 |
| M14 | Speed and work at onderbouw level: average speed, km/h to m/s and back, joint work | «Скорость и работа уровня onderbouw: средняя скорость, км/ч ↔ м/с, совместная работа» | stretch | M8, P6 |

Geometry (G):

| ID | Skill | Russian name | Level | Prerequisites |
| --- | --- | --- | --- | --- |
| G1 | Shapes and their properties | «Фигуры и их свойства» | 1F | none |
| G2 | Angles: kinds, measuring in degrees | «Углы: виды, измерение в градусах» | stretch | G1 |
| G3 | Symmetry and reflection | «Симметрия и отражение» | 1S | G1 |
| G4 | Coordinates in the first quadrant | «Координаты в первой четверти» | 1S | N5 |
| G5 | Solid shapes and nets | «Объёмные фигуры и развёртки» | 1F | G1 |
| G6 | Views and viewpoint; buildings of cubes (stretch subtype) | «Виды и точка обзора; постройки из кубиков» | 1F | G5 |
| G7 | Plan and map: legend, grid squares, compass points (4, and 8 at 1S), route, linear scale | «План и карта: легенда, клетки, стороны света, маршрут, линейный масштаб» | 1F/1S | G4, P5 |

Data (S):

| ID | Skill | Russian name | Level | Prerequisites |
| --- | --- | --- | --- | --- |
| S1 | Reading tables | «Чтение таблиц» | 1F | N3 |
| S2 | Bar charts and line charts | «Столбчатые и линейные диаграммы» | 1F | S1, N5 |
| S3 | Arithmetic mean; the missing number from a mean (stretch subtype) | «Среднее арифметическое; недостающее число по среднему» | 1S | S1, A9 |
| S4 | Pie charts; choosing a suitable kind of chart | «Круговые диаграммы; выбор подходящего вида диаграммы» | 1S | S2, P1 |
| S5 | Global graphs: trend, graph from a story and back, comparison, forecast | «Глобальные графики: тренд, график по истории и наоборот, сравнение, прогноз» | 1F/1S | S2, G4 |
| S6 | Patterns: number, shape and dot patterns; the next and the nth element | «Закономерности: числовые, фигурные, точечные; следующий и n-й элемент» | 1F/1S | A2, A3 |
| S7 | Median and mode | «Медиана и мода» | stretch | S3 |

Word problems (T), the Guardians:

| ID | Skill | Russian name | Level | Prerequisites |
| --- | --- | --- | --- | --- |
| T1 | One-step | «Одношаговые» | 1F | A2 |
| T2 | Two-step | «Двухшаговые» | 1F | T1 |
| T3 | Three-step | «Трёхшаговые» | 1S | T2 |
| T4 | Four-step and with surplus data | «Четырёхшаговые и с лишними данными» | 1S | T3 |

### Some nodes take a different prerequisite in each subtype

Where a subtype has its own prerequisite, a failed subtype sends the descent to that prerequisite only, not to all of the node's prerequisites.

| Node.subtype | Prerequisite | Example |
| --- | --- | --- |
| M1.whole | N3 | 3 km = ? m |
| M1.decimal | D3 | 2,5 km = ? m |
| M3.whole | A5 | change from 50 euros for a 37-euro purchase |
| M3.cents | D2 | change from 20 euros for a 13,45-euro purchase |
| M5.grid | A3 | area by counting squares |
| M5.formula | A7 | area of 24 x 15 m |
| P1.half_tenth | F1 | 50% = a half, 10% = 1/10 |
| P1.decimal | D6 | 25% = 0,25 |
| F3.same_den | F1 | 3/8 and 5/8 |
| F3.line | N5 | a fraction at a point of the number line |

### The draft chooses A4 over A12 as the prerequisite of F4

F4 no longer rests on A12, as it did in the first version. Simplifying fractions rests on table division (A4), and A12 moves wholly into stretch and drops out of the descent.

### The draft checks the graph against all four domains of the SLO document

The draft says it checked the graph against the full text of SLO «Concretisering referentieniveaus rekenen 1F/1S» in all four domains. 1F is the minimum. 1S is the target level that schools bring most pupils to by the end of group 8. At 1S the same goals come with harder numbers, bare sums and harder contexts, plus a separate list of goals for 1S only.

| Domain (Dutch) | 1F, the minimum | 1S, the target | Nodes |
| --- | --- | --- | --- |
| Getallen | whole numbers to about 100 000, place value; tenths, hundredths, thousandths; table to 10 x 10; addition and subtraction to about 1000; multi-digit by one-digit; three-digit by two-digit division; simple fractions, adding and subtracting fractions | millions and billions; harder decimals; remainder as a decimal; mixed numbers; multiplying and dividing fractions in context; efficient calculation | N1 to N7, A1 to A11, A6a, A13, F1 to F8, D1 to D6 |
| Verhoudingen | "so many out of so many"; 50% = a half, 10% = 1/10; fractions with denominator 2, 4, 10 to and from percentages; proportion table; discount with round numbers; linear scale; comparing simple ratios | percentages above 100%; percentage to and from decimal; denominators 2, 4, 5, 10, 100 to percentages by heart; by what percentage something grew; VAT (btw); scale 1 : 50 000; speed and consumption; calculator and rounding; "+10% and -10% is not the original" | P1 to P6, M8, A14 |
| Meten en meetkunde | units and converting "from larger to smaller"; 1 cubic decimetre = 1 litre; time, money, change; instruments; benchmark measures; perimeter and area of rectangular figures with simple numbers, on a grid or from the sides, without formulas (the draft said "on a grid"); plan with legend; nets, front view; 4 compass points | square kilometres, are, hectare; 1 cubic metre = 1000 litres; converting both ways; formulas l x b and l x b x h; area by splitting (including the triangle); one area with different perimeters; sides x 2 gives area x 4; symmetry; 8 compass points | M1 to M10, M12, M13, G1, G3 to G7 |
| Verbanden | tables (timetables, prices); simple global graphs and bar charts; simple chart; patterns | x and y axes; pie charts; trends; graph from a story; comparing graphs; forecast; nth element; choosing a representation | S1 to S6, G4 |
| (cross-cutting) | problems in context | multi-step problems; "explain why" | T1 to T4 |
| Stretch (towards VWO) | none | none | A12, A15, A16, D7, G2, M11, M14, N8, P7, S7; subtypes G6.blocks, S3.missing |

The draft cites three sources for this check: SLO «Concretisering referentieniveaus rekenen 1F/1S» (https://www.slo.nl/publish/pages/2834/concretisering-referentieniveaus-rekenen-1f-1s.pdf); Utrecht University, the learning line "measures, geometry, relations" by group (https://nrcd.sites.uu.nl/wp-content/uploads/sites/244/2017/07/zuijlekom-leerlijn-mt-mk-verb.pdf); and SLO, the 2025 concept core goals for maths (https://www.slo.nl/@24175/definitieve-conceptkerndoelen-rekenen/).

### Resolved: the SLO text moves 17 nodes to 1F/1S and confirms the levels of the rest

Proposed by research on 2026-09-26; the owner approves it with this record.

On 2026-09-26 I downloaded and read four documents; the Sources section lists each with its address:

- the «Referentiekader taal en rekenen: de referentieniveaus» (reference framework for language and arithmetic: the reference levels), the short legal text of 1F and 1S, in SLO's copy from 2010;
- the SLO «Concretisering referentieniveaus rekenen 1F/1S» of October 2011, 222 pages, which gives each goal with 1F and 1S examples side by side;
- the SLO definitive concept core goals for maths of April 2025 with their explanatory document, 120 pages;
- the Utrecht learning line by group, which the draft also cites.

All four downloaded. The core goals don't split 1F from 1S, so they served only to confirm what primary school covers and what it leaves to secondary school.

The options were to keep the draft's levels, which have no citation for each node, or to correct each node the text contradicts. Correcting wins, because a wrong level makes the report call a 1F skill a 1S margin, or the reverse, and the VWO readiness block (RES-2300) counts nodes by level.

| Node | Draft | Now | What the SLO text says |
| --- | --- | --- | --- |
| N3 | 1F | 1F/1S | 1F counts and knows place value to about 100 000; 1S goes to a billion. Numbers to a million are a 1S subtype. |
| N6 | 1S | 1F/1S | 1F already asks for «begrip hebben van 'miljoen' en 'miljard'» (understanding million and billion) in context; 1S reads, writes and rounds numbers to a billion. |
| N7 | 1S | 1F/1S | 1F reads below-zero temperatures («Kies uit: -20°C, 0°C ...» among the 1F benchmark measures). The 1S text doesn't name comparing and ordering negative numbers; the framework names them at 2F, which it treats as the level of 1S. I kept ordering at 1S as a choice, because the text neither names nor excludes it. |
| A11 | 1F | 1F/1S | «Volgorde van bewerkingen» (order of operations), with and without brackets, is in the 1S list only. The unknown component stays 1F: the 2025 core goals name the fill-in sum «23 + ... = 48» as primary-school content. |
| A13 | 1S | 1F/1S | 1F: «efficiënt rekenen ... met eenvoudige getallen» (efficient calculation with simple numbers); 1S: «ook met grotere getallen» (also with larger numbers). |
| A14 | 1S | 1F/1S | 1F: estimating as a check on the calculator and interpreting a remainder on the screen; 1S: converting ratios and fractions to a rounded decimal with the calculator. |
| F3 | 1F | 1F/1S | 1F compares simple fractions; 1S compares fractions «ook via standaardprocedures» (also by standard procedures). |
| F4 | 1F | 1F/1S | 1F uses equal common fractions in context (how many half-litre packs make one and a half litres); «vereenvoudigen en compliceren van breuken» (simplifying and expanding fractions) is in the 1S list. |
| F5 | 1F | 1F/1S | Adding fractions with the same denominator is 1F; mixed numbers are a 1S goal («gemengd getal»). |
| F6 | 1S | 1F/1S | 1F adds and subtracts «veelvoorkomende gelijknamige en ongelijknamige breuken binnen een betekenisvolle situatie» (common like and unlike fractions in a meaningful situation); 1S adds harder fractions by standard procedures. |
| F7 | 1S | 1F/1S | 1F: «in een betekenisvolle situatie een breuk vermenigvuldigen met een geheel getal» (a fraction times a whole number in a meaningful situation); 1S: a fraction times a fraction. |
| D4 | 1S | 1F/1S | 1F multiplies a whole number by a simple decimal (5 hours at 5,75 euros, 4 x 0,5, 0,25 x 100); 1S uses «complexere decimale getallen» (more complex decimals). |
| D6 | 1F | 1F/1S | 1F converts simple fractions by heart (1/2 = 0,5); 1S converts harder ones, «eventueel met de rekenmachine» (with a calculator if needed). |
| P5 | 1F | 1F/1S | 1F reads a scale bar on a map; 1S calculates with a ratio scale such as 1 : 400 000. The draft's own table already said this. |
| P6 | 1S | 1F/1S | 1F compares simple offers («Welke aanbieding is voordeliger?», which offer is the better buy); 1S makes and explains relative comparisons. |
| M4 | 1F | 1F/1S | See the finding on M4. |
| S5 | 1S | 1F/1S | 1F reads «eenvoudige globale grafieken» (simple global graphs); 1S finds trends, draws a graph from a story, compares graphs and forecasts. |

The same text confirms these levels: S3, the mean, at 1S (the 2025 core goals also name «berekenen en interpreteren van een gemiddelde» for primary school); S4, pie charts, and G4, coordinates in the first quadrant, at 1S; G3, symmetry, at 1S; G5 and G6, nets and front views, at 1F, which the concretisation lists among 1F 2D representations of 3D objects; M8 and M9 at 1S; F8 at 1S; and P3 at 1S. It also supports the stretch nodes. The 2025 core goals leave median and mode (S7), equations (A15, A16) and negative numbers as operations (N8) to secondary school. Neither level text names angles in degrees (G2), divisibility rules (A12) or the circumference of a circle (M11), although the Utrecht learning line teaches the circumference in group 8.

The 17 corrections leave the counts unchanged: 69 nodes at 1F or 1S and 10 at stretch. They change subtype levels only. A node that moves to 1F/1S needs a `level` for each subtype, and the template catalogue (RES-1200) doesn't yet split every node's templates by level, so N3, N6, N7, A11, A13, A14, F3 to F7, D4, D6, P5, P6, M4 and S5 need their subtypes named by level before the graph is built. That naming is content work; it isn't settled here.

### The SLO check has five consequences for nodes and the report

- Area and volume formulas are 1S only. At 1F the player finds the perimeter and area of rectangular figures with simple numbers, by counting squares or from the sides, without a formula; volume at 1F is counting unit cubes. At 1S she uses the formulas l x b and l x b x h, works with figures that aren't rectangles, and meets "one area, different perimeters" and "sides x 2 gives area x 4". So M4 and M5 have 1F subtypes "by squares" and "by sides" and 1S subtypes "by formula" and "not a rectangle", and M7 has "by cubes" (1F) and "by formula" (1S). The area of a triangle (M6) uses splitting and completing only. The draft put "by dimensions" at 1S for M4, M5 and M7; the SLO text puts calculation from the sides of a rectangle at 1F.
- Percentages: P3 gets subtypes for VAT and for "more than 100%". Its traps are known misconceptions: "+10% then -10% returns to the original" and "she added the percentages of two classes". The calculator node A14 has 1F subtypes (checking a screen by estimate, reading a remainder on the screen) and a 1S subtype (a ratio or fraction to a rounded decimal); the draft said A14 is 1S only.
- Time and money: M2 gets the calendar, week numbers, timetables and summer and winter time. M3 gets "pay without change" and prices with three decimal places (petrol).
- "Explain why" items from 1S (why 1/3 is not 0,33; why 1 square metre need not be a square) come as a choice of 4 explanations, and the wrong options are typical misconceptions.
- The report shows coverage of 1F, 1S and stretch separately.

### Resolved: M4 is a 1F/1S node, with the perimeter of a rectangle at 1F and other figures and "one area, different perimeters" at 1S

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft contradicted itself. Its node table gave M4 (perimeter) the level «1F», which means no 1S subtype. Its SLO consequences said: «у M4, M5, M7 есть подтипы «по клеткам» (1F) и «по размерам» (1S)» (M4, M5 and M7 have subtypes "by squares" (1F) and "by dimensions" (1S)).

The options were M4 at 1F only, as the table said, or M4 at 1F/1S, as the consequences said. 1F only is simpler: one level and no subtype split. 1F/1S matches the SLO text, which settles it. The SLO «Concretisering» (read 2026-09-26) puts «omtrek en oppervlakte berekenen van rechthoekige figuren» (calculating the perimeter and area of rectangular figures) at 1F, «met eenvoudige getallen» (with simple numbers) and «geen gebruik ... van formules» (no use of formulas). It puts «omtrek en oppervlakte bepalen/berekenen van figuren (ook niet rechthoekige)» (the perimeter and area of figures, including ones that aren't rectangles) at 1S, and «verschillende omtrek mogelijk bij gelijkblijvende oppervlakte» (different perimeters for the same area) among the 1S "know why" goals. The «Referentiekader» tables say the same.

So M4 is 1F/1S. Its 1F subtypes are the perimeter of a rectangle by squares or from its sides with simple numbers. Its 1S subtypes are the perimeter of a figure that isn't a rectangle, a side from the perimeter with a formula, and "one area, different perimeters". The same source corrects the draft's split for M5: calculating the area of a rectangle from its sides with simple numbers is 1F, and only the formula l x b is 1S. M5 keeps `grid` (1F) and `formula` (1S) and gains a 1F subtype for the area from the sides without a formula.

### Stretch nodes show headroom above 1S and never count as gaps

Stretch nodes show the headroom above 1S that a confident start at VWO needs. The game tests them only when the player is fluent in the top nodes of their domain. The report lists them as the "ceiling", not as gaps.

A stretch node is admitted when both conditions hold:

1. Every prerequisite of the stretch node is "fluent" or "stable", including stretch prerequisites such as S3.missing for S7.
2. The top nodes of the domain, named in `stretchGate`, are "fluent" or "stable" by a tested result: a probe or a full block. An inferred state doesn't admit. The draft said "by a check" here; the finding "Resolved: the stretch gate admits a tested result" gives the reason for the change.

For the stretch subtypes G6.blocks and S3.missing, the condition is "fluent" or "stable" on the ordinary subtypes of the same node.

| Stretch node | `stretchGate` (top nodes of the domain) |
| --- | --- |
| N8 | N6, N7 |
| A12 | A11, A13 |
| A15 | A11, A13, D4 |
| A16 | A11, A13 (plus A15 as a prerequisite) |
| D7 | D4, D5, F7 |
| P7 | P3, P6 |
| M11 | M6, M9 |
| M14 | M8, M10, P6 |
| G2 | G3, G4 |
| S7 | S3, S4 |

- If admission is lost because a top node fell below "fluent", the Director stops choosing the stretch node, and its earlier results stay in the report.
- Budget: up to 4 stretch tasks a day. A probe comes first. If the probe is ambiguous, the tasks that complete a block come on later days within the same daily budget, and the block fits within 7 days.
- Report: "ceiling above 1S" lists the mastered stretch nodes. An unmastered stretch node never enters the list of gaps.
- Content: the first-version topics marked "beyond" (A12, G2, M11, the subtype S3.missing, operations with negatives, now node N8, and buildings of cubes, now subtype G6.blocks), and new topics from the start of onderbouw: one- and two-step equations (A15, A16), order of operations with fractions and decimals (D7), successive and reverse percentages (P7), median and mode (S7) and speed and work problems (M14).

### Resolved: the stretch gate admits a tested result, so a probe counts, and "check" keeps its RES-0900 meaning of a full block

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft used "check" for two sets of evidence. The stretch gate requires the top nodes to be "fluent" or "stable" «по проверке (выведенное не допускает)» (by a check; an inferred state doesn't admit), where "check" stands against "inferred". The node states section (RES-0900) defines «Проверка» (check) for "stable" as a full block or, later, an anchor form of the Ascent, which leaves the probe out.

The options were a probe counts for the gate, or only a full block counts. Full blocks only is stricter: a gate node always rests on 5 tasks. A probe counting fits the rest of the design better, for two reasons. First, a probe that gives "fluent (probe)" never escalates to a block (RES-0900), so a gate that demanded a block would wait for a block the Director has no rule to schedule. Second, the sentence's own contrast is tested against inferred, and a probe is tested. So the gate admits "fluent" from a probe or a block, or "stable", and never an inferred state. To keep one term for one thing, this record now calls gate evidence a "tested result", and "check" means only what RES-0900 defines for "stable".

### The draft chooses the classical Soviet method first and Dutch test formats later

The draft checks the graph's content against the Dutch levels but takes the task form and the diagnostic logic from the classical Soviet school. The reason it gives: first make sure the foundation is solid, and only then learn the format of Dutch tests.

- Systematic order, "from simple to complex", is the graph with prerequisites.
- Solid calculation skills. Each floor opens with mental arithmetic: a chain of 3 quick sums (table facts, addition and subtraction crossing the ten, multiplying by 10 and 100, efficient methods, mental fractions and percentages). The chain is a ritual and a fluency measurement. The Director picks the chain's nodes by the same value among mental subtypes (threshold 10 s or less) close to the floor's domain. Nodes in the "stable" state enter mental arithmetic at most once a week, so the budget doesn't go on what she already knows. The three tasks are independent: each comes from its own template and seed and doesn't use the previous answer, so one error doesn't drag the others down. They look like a chain only in the interface, because they come in a row in one window.
- Word problem types. T1 to T4 follow the classical types, and the report shows a matrix of type by number of steps. The types are:
  - simple: the meaning of operations, comparison by difference and by ratio ("how many more" and "how many times"), finding an unknown component;
  - price, quantity and cost; speed, time and distance; rate, time and work;
  - finding the fourth proportional (reduction to one), proportional division, finding unknowns from two differences;
  - motion towards each other, in opposite directions and in pursuit;
  - problems on parts, on fractions, on percentages, and on joint work (the top level).
- Modelling apart from calculating. In some problems the player first picks the right short note or bar model out of four, then solves. The wrong options are typical modelling errors: confusing "by how many" with "how many times", the wrong whole, a surplus datum. This lets the report tell "didn't understand the problem" from "understood but miscalculated".
- Solving step by step. In compound problems (T2 to T4), half the tasks use step-by-step input "1) ... 2) ... Answer: ...", and the other half ask for the answer only. The input itself is in the draft's section on word problems and step input, which another record carries.
- Soviet written methods: column arithmetic, long division, numbered order of operations, equations for an unknown component.
- Geometry on squared paper: constructing and measuring on the grid in place of guessing from a picture.

### The Dutch stage adds layers on the same graph and engine

The Dutch stage keeps the same graph and engine and adds layers: Dutch task language, Dutch formats (contextsommen with a picture, verhoudingstabel, happend delen, the calculator, choice in the style of the doorstroomtoets) and a "practice test" mode. The 1F and 1S labels already show readiness by content, and the Dutch stage adds readiness by language and format. Deferred until after the MVP by the draft.

### The draft separates language errors from maths errors in Russian terms

The player learns at a Dutch school and might not know the Russian terms, so an error might be a language error and not a maths error. The draft separates the two:

- Term hints. Maths terms in a task, such as «знаменатель» (denominator), «периметр» (perimeter), «делимое» (dividend) and «масштаб» (scale), are underlined. A tap shows a Russian explanation, a picture and the Dutch equivalent from `content/lexicon.nl.json`: noemer, omtrek, deeltal, schaal.
- Log: whether the glossary was opened (`glossaryOpened`), and whether the task held terms from the risk list (`termsRisky`).
- Report: an error in a task with a risky term that wasn't opened gets the mark «возможна языковая причина» (possible language cause). If such errors exist and errors without the term don't, the report highlights it.
- The algorithm's form isn't checked. If the player calculates the Dutch way, for example happend delen in her working, the answer counts by its result.
- A glossary probe in Session 0 (about 5 minutes) sets the starting list of risky terms, and the logs of glossary openings update it.

### Resolved: the language-risk limit is MVP work, and the Dutch word in a term hint is glossary data, not the deferred Dutch layer

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft left unclear whether separating language errors from maths errors ships in the MVP or waits for the Dutch layer. Its term hints read the Dutch equivalent from `content/lexicon.nl.json`, and `riskyTerms` in the template model keys into that file (RES-1200), while the `nl` locale, `frames.nl.json` and the Dutch layer are deferred until after the MVP.

The options were to build the language-risk limit in the MVP, or to defer it with the Dutch layer. Deferring keeps the MVP smaller by one hand-written glossary and the tap-to-explain hint. Building it now wins, for three reasons:

- The risk exists from the first day. The player learns maths in Dutch now, so without the mark every language error in a Russian task reads as a maths gap in the report the parent uses to judge the MVP.
- The MVP already pays for most of it. Session 0 in the MVP runs the vocabulary probe (RES-0100), and the event log already records `glossaryOpened` and `termsRisky` (RES-2550). Deferring the hints would throw the probe's result away.
- A Dutch word in a hint isn't the Dutch layer. The layer means Dutch task text, Dutch formats, templates with `curriculum: "nl"`, a graph overlay and a practice test (RES-0010, RES-3000). A hint that shows «знаменатель» with "noemer" beside it is a Russian task with one line of glossary data, and the task is still rendered in the `ru` locale.

So the MVP ships the term hints, the glossary, the Session 0 probe, the two log fields and the report mark «возможна языковая причина». The deferred Dutch layer keeps everything else Dutch. The draft of this finding left the glossary's content open: which terms it holds beyond the four examples, and who writes the Dutch equivalents.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. The glossary holds every Russian maths term that appears in the task text of an MVP template, which is the union of the templates' `riskyTerms`, not only the four examples. The building agent drafts each Dutch equivalent from SLO terminology, the words the SLO reference framework and its 1F/1S concretisation use, and from common Dutch primary-school maths textbooks, and the parent reviews each entry in the Parent Room before it shows. Two options were weighed for the list. A hand-picked list of the terms the Session 0 probe tests is shorter, but a term missing from it can never get the mark «возможна языковая причина», so an error on it reads as a maths gap. Every term in an MVP template's task text covers each task she can meet, and `riskyTerms` already names those terms per template, so the list comes from data. It wins. Two options were weighed for the Dutch words. A translation model is faster, but it may give a general Dutch word where her school uses a maths term, such as "deler" beside "noemer". The SLO words and the textbook words are the ones her Dutch lessons use, so the agent drafts from them, and the parent, who knows her school's words, approves each entry. An entry the parent hasn't approved shows the Russian explanation and the picture without a Dutch word.

## Conclusions

1. The skill graph holds 79 mathematical nodes in nine domains, 69 at levels 1F or 1S and 10 at stretch, with the codes, levels and prerequisites the node tables in this record give.
2. The five science topics E1 to E5 sit outside the prerequisite graph.
3. The skill graph is versioned data in one file, and the parent or a developer changes it without changing code.
4. Each node records its identifier, domain, level, typical group, prerequisites, weighted subtypes with their own levels and a Russian-only flag, and a stretch node also records its gate.
5. A prerequisite that applies to one subtype sends a failed subtype's descent to that prerequisite only.
6. Every goal of the SLO levels 1F and 1S maps to at least one node or subtype, and each node's level follows the SLO text as the table of 17 corrections in this record gives it.
7. Area and volume by formula are 1S subtypes; at 1F the player finds the perimeter and area of rectangular figures with simple numbers, by squares or from the sides without a formula, and volume by counting cubes.
8. M4 is a 1F/1S node: the perimeter of a rectangle is 1F, and figures that aren't rectangles and "one area, different perimeters" are 1S.
9. A stretch node is admitted to testing only when all its prerequisites and all the nodes in its gate are "fluent" or "stable" by a tested result, a probe or a full block, never by inference.
10. In the stretch gate a probe counts as a tested result, and "check" means only the evidence RES-0900 defines for "stable".
11. The game gives stretch nodes at most 4 tasks a day and completes a stretch block within 7 days.
12. An unmastered stretch node never appears in the list of gaps, and the report lists mastered stretch nodes as the ceiling above 1S.
13. The report shows coverage of 1F, 1S and stretch separately.
14. Each floor opens with a chain of 3 independent mental arithmetic tasks, each from its own template and seed.
15. A node in the "stable" state enters mental arithmetic at most once a week.
16. The report shows word problems as a matrix of problem type by number of steps.
17. Some word problems ask the player to choose a model out of four before solving, so the report can separate a modelling error from a calculation error.
18. Half the compound word problems (T2 to T4) use step-by-step input, and the other half ask for the answer only.
19. The game marks maths terms in a task and, on a tap, shows a Russian explanation, a picture and the Dutch equivalent.
20. The event log records whether the glossary was opened and whether the task held a risky term.
21. The report marks an error on a task with an unopened risky term as a possible language cause.
22. The game marks an answer by its result, whatever method the player used.
23. N3, N6, N7, A11, A13, A14, F3, F4, F5, F6, F7, D4, D6, P5, P6, M4 and S5 are 1F/1S nodes, and each needs its subtypes named by level before the graph is built.
24. The language-risk limit ships in the MVP: term hints with the Dutch equivalent, the glossary, the Session 0 probe, the log fields and the report mark; the Dutch locale, formats and curriculum layer stay deferred.
25. The graph is the one source of each subtype's level and weight, and a template reads them from the graph.
26. The graph keeps every node up to the end of group 8, level 1S, whatever the player's current school group (kept in `personal/player.md`), as the owner decided on 2026-09-27.
27. The glossary holds every Russian maths term in the task text of an MVP template, the union of the templates' `riskyTerms`; the building agent drafts each Dutch equivalent from SLO terminology and common Dutch primary-school maths textbooks, and a Dutch word shows only after the parent approves it in the Parent Room, as research decided on 2026-09-27 on the owner's instruction.

## Sources

- The owner's draft «Хроники Башни — спецификация», opening and sections «Граф навыков», «Узлы», «Пререквизиты на уровне подтипов», «Сверка с голландской программой», «Stretch (к VWO)», «Методика: классическая советская школа, затем голландские тесты» and «Риск русских терминов», read 2026-09-26; not kept in the repository - the node list, the domains and floors, the subtype prerequisites, the SLO check, the stretch rules, the method and the language risk.
- Expertgroep Doorlopende Leerlijnen Taal en Rekenen, «Referentiekader taal en rekenen: de referentieniveaus», SLO copy of 2010, https://www.slo.nl/publish/pages/5901/referentiekader_taal_en_rekenen_referentieniveaus.pdf, downloaded and read 2026-09-26 - the 1F and 1S goals in all four domains, and the statement that 1S is at the level of 2F.
- SLO, «Concretisering referentieniveaus rekenen 1F/1S», October 2011, https://www.slo.nl/publish/pages/2834/concretisering-referentieniveaus-rekenen-1f-1s.pdf, downloaded and read 2026-09-26 - the 1F and 1S examples behind the 17 level corrections and the M4 resolution.
- SLO, «Definitieve conceptkerndoelen rekenen en wiskunde, herziene versie 2025», page of 2025-04-28, https://www.slo.nl/@24175/definitieve-conceptkerndoelen-rekenen/, and its explanatory document of April 2025, https://www.slo.nl/publish/pages/22237/definitieve-conceptkerndoelen-rekenen-wiskunde-toelichtingsdocument.pdf, both read 2026-09-26 - what primary school covers (the mean, rectangular perimeter, area and volume, fill-in sums) and what it leaves to secondary school (equations, median and mode, negative numbers).
- Utrecht University, Zuijlekom, learning line "meten, meetkunde, verbanden" by group, https://nrcd.sites.uu.nl/wp-content/uploads/sites/244/2017/07/zuijlekom-leerlijn-mt-mk-verb.pdf, downloaded and read 2026-09-26 - the circumference of a circle taught in group 8, noted beside M11.
