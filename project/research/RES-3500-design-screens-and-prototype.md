---
id: RES-3500
artifact: research
status: draft
revised: 2026-09-27
---

# The owner's design proposes 33 screens around a text-first story column, with no clocks or verdicts, drawn as 45 sheets and a clickable prototype

## Summary

The owner's design draws every screen of the game and of the Parent Room for an iPad in landscape, 1180 by 820. The design has three forms: a screens guideline, 45 annotated screen sheets and a clickable prototype of 33 screens with a scenario map. Every story screen follows one layout: the scene picture in a 380 px column on the left, the story log and the input line on the right as the centre, and a HUD on top. No screen shows a timer, a clock, a percentage for the child or a verdict word, and «Привал» (rest stop), «Сохранить и уйти» (Save and leave) and the settings paw are always visible. The screens group into scenarios: the Awakening, the adventure of the day, the trial, time without clocks, growth, the Tower without tasks, the player's settings, the Parent Room and the parent's test mode. The design gives the adventure as 30-45 minutes in one file and about an hour in another, and puts the soft stop at about 45 minutes, where the owner has decided on 60. This record covers the screens guideline, the sheets and the prototype, one finding per screen. The voice is in RES-3300, the art in RES-3400, and tokens and components in RES-3100 and RES-3200.

## The question

Which screens does the game need, and what does each show, so that a player who reads a lot gets text first and never sees a clock or a verdict? The design assumes that one layout, picture left and text right, suits every story moment. That fails where a moment needs the whole screen, and the design itself breaks the layout for ceremonies, the task window and the soft stop, which it draws as layers over a scrim or full-screen scenes. The design also assumes the iPad in landscape is the main device, while RES-2500 treats the iPad and the computer as equal clients; the design only says the scene scales on a computer.

## Method

Read the owner's design files `design-system/guidelines/30-screens.md` and `screens/README.md` on 2026-09-26. Listed the 45 screen sheets in `screens/` and looked at three of them with an image reader: `00-anatomy.png`, `09b-trial-task.png` and `16a-soft-stop.png`. Read the prototype's scenario map `prototype/Main.dc.html` and the markup and logic of all 33 screen files in `prototype/`, extracting the visible text and the example data. Compared the result with RES-0100, RES-0200, RES-0300, RES-1500, RES-2000, RES-2300, RES-2400, CAN-0030, CAN-0040, CAN-0060 and CAN-0130.

The design leaves these points open:

- the heroine's poses for screens other than the reference, and the sprites of Guardians and familiars and the floor backgrounds, which are placeholders with a caption;
- the first chest, the training on simple numbers and the input calibration of Session 0, which repeat screens 11 and 09 and aren't drawn separately;
- the layout on a computer, beyond "the scene scales with its proportions kept";
- where the soft stop falls, given the owner's 60-minute decision.

Forty-two of the 45 sheets were not opened one by one; their content was taken from the guideline's card table and the prototype screen of the same number.

## Findings

### The design sets one layout for every story screen, with text and input at the centre

«Игрок читает много, поэтому центр каждого экрана истории — текст и строка ввода.» (The player reads a lot, so the centre of every story screen is the text and the input line.) The sheet "00-anatomy" gives the scheme:

1. The HUD, 24 px from the edges, 44 px high: threads, buttons and the clean-row garland on the left; «Привал», «Сохранить и уйти» and the paw on the right. It shows on every story screen.
2. The scene picture, 380 by 712 px on the left: floor background, sprites, Tangle, familiar. Sprites and the Tangle are drawn in PixiJS. It is an illustration only, with no buttons.
3. The story column, 20 px from the picture, padding 22 and 26 px: everything read and written.
4. The story log (`StoryLog`): narrator with no frame, the System on a boiled-sweet plate with a tag, a character on a card with the name on top, the heroine on the right in `accent-2`. Text 20/32 px, large 24/36 px, a line of up to about 70 characters; the top fades under a mask as old lines scroll up.
5. Three ready actions, keys 1 to 3; one is always strange. Writing is optional.
6. The input line (`StoryInput`): typing, dictation and «Дальше» (Next), Enter sends. Under it the note «Эту историю могут читать мама и папа» (Mum and Dad can read this story).

Margins are 24 px from the edges, 20 px between the picture and the column and 14 px between blocks. The task window, System windows and ceremonies are a layer over a scrim, and the story under them stays. Cat ears over the column are decoration, not a button.

### The design sets rules that hold on every screen

- Story text 20/32 px, large 24/36 px; a line no wider than about 70 characters; text contrast at least 4.5:1 in every theme and palette.
- The task window has no animation and no story text inside it.
- «Привал», «Сохранить и уйти» and the paw are visible on every story screen.
- No timers, clocks, percentages or the words «верно / неверно / ошибка» (correct / incorrect / error) anywhere; the outcome is named in the world's words.
- Cat ears over the story column, the paw and the bell are motifs of the style and never get in the way of the text.
- Numbers in texts are filled in by code.
- Theme, palette and text size are the player's choice.

Every sheet is 1228 px wide: the iPad screen with purple numbered marks, a legend of the marks and a block «Когда / Откуда / Дальше / Правила» (When / From / Next / Rules). Marks and dashed frames are for reading the sheet; names, numbers and texts are examples.

### The design groups the screens into eight scenarios in the guideline and eleven in the prototype

The guideline's scenarios and the sheets that draw them:

| Scenario | Who, how often | Path | Sheets |
| --- | --- | --- | --- |
| 1 «Пробуждение» (Awakening) | the player with a parent, once, 20-25 minutes, no knowledge check | 01, 02, 03, first chest, training, 04, first scene, 17 | 01a, 01b, 02, 03, 04 |
| 2 «Приключение дня» (the adventure of the day) | the player alone, daily, about 30-45 minutes | 05, 06, 07, 08, trials, 11, 12, 17 | 05, 06, 07, 08 |
| 3 «Испытание» (the trial) | the core, 25-35 first attempts per adventure | 09 lead-in, task window, knot scheme, similar knot, spell, 11 | 09a, 09b, 09c, 09d, 10a, 10b, 11, 12 |
| 4 «Время без часов» (time without clocks) | measured quietly, arrives as story | 14 every 20 minutes, 15 by button, 16 at about 45 minutes, 21 on return | 14, 15, 16a, 16b, 17, 21 |
| 5 «Рост и особые моменты» (growth and special moments) | levels, new familiars, the Underside, safety | 13, 18 egg and name, 19, 20 | 13, 18a, 18b, 19, 20 |
| 6 «Башня без заданий» (the Tower without tasks) | after the finale, until the day ends at 04:00 (the draft said within the daily maximum, which the owner removed on 2026-09-27) | 05, then 22, 23, 24 or 25, then 05 | 22, 23, 24, 25 |
| 7 «Своя Башня: настройки» (your own Tower: settings) | the player herself, the paw on any screen | paw, 31, the same screen | 31a, 31b, 31c, 31d, 31e |
| 8 «Комната родителя» (the Parent Room) | a parent, without the player, behind a PIN | 26, 27, 28, 29, 30; test: 32, 33 | 26, 27, 28, 29, 30, 32, 33 |

The prototype's map «Сценарии игры» (Game scenarios) says «Одиннадцать сценариев: десять для игрока и один для родителя» (Eleven scenarios: ten for the player and one for the parent): Awakening; an ordinary day; the trial; the Guardian's word problem; time without clocks; left and came back; growth and collection; the Underside and «мне страшно» (I'm scared); a worrying text; the parent after play; your own Tower. The two files cut the same screens differently and don't contradict each other on any screen.

### The design gives the adventure of the day three lengths

The guideline says «около 30–45 минут» (about 30-45 minutes) for the adventure and places the soft stop «около 45 минут» (at about 45 minutes); the sheet "16a-soft-stop" says «Около 45 минут активного времени» (about 45 minutes of active time). The prototype's map says «около часа» (about an hour). The owner decided on 2026-09-26 that the adventure's target length is one hour, 60 minutes of active time, and RES-0300 concludes that "The soft stop must come when the day's active time reaches 60 minutes on an unfinished adventure". The conclusions below follow the owner's decision.

### The prototype's daily-maximum choices include 45 and 60 minutes, at or below the soft stop

Screen 29 offers the daily maximum as 45, 60, 75 or 90 minutes, with 60 selected. RES-0300 first concluded that the daily maximum must default to 100 minutes, above the 60-minute soft stop, so that two extensions fit. With the soft stop at 60 minutes, the choices 45 and 60 leave no room for «Ещё один ряд» (One more row), and the prototype offers no 100-minute choice. The owner decided on 2026-09-27 that the game has no daily maximum, so screen 29 loses this setting altogether (see «Resolved: screen 29 has no daily-maximum setting» below).

### The prototype names creepiness level 1 «Слегка», where the canon names it «Чуть жутковато»

Screen 29 offers «Уютно», «Слегка», «Загадочно» (Cosy, Slightly, Mysterious). CAN-0130 and RES-1500 name the levels «Уютно», «Чуть жутковато», «Загадочно» (Cosy, A little creepy, Mysterious).

### The prototype calls familiars «узелки» and renames the moth familiar, where the canon says «фамильяры» and «Шуршик»

The prototype's team screen is «Узелки», its quest is «Поговори с узелком у костра» (Talk to the little knot at the campfire) and its eye break says «Узелок смотрит в окно Башни». RES-2000 gives the quest «Поговори с фамильяром у костра», CAN-0030 gives «Фамильяр смотрит в окно Башни», and CAN-0040 gives the Archive Guardian's line «„Люди с фамильярами"» where the prototype's story book has «Люди с узелками». The prototype's paper-moth familiar from the Archive is «Шелестун»; CAN-0060 names it «Шуршик» (Rustler). The canon marks familiar names as placeholders until the player names them, and the resolved finding below shows that «Шелестун» is such a name, not a rename.

### The prototype drops the rank from the Awakening's closing line

CAN-0030 closes the Awakening with «Пробуждение завершено. Ранг: E. Добро пожаловать в Башню.» (Awakening complete. Rank: E. Welcome to the Tower.) The prototype's screen 01 shows «Пробуждение завершено.» and «Добро пожаловать в Башню.» with no rank.

### Screen 01 «Пробуждение» opens the game with two System windows

Step 1 of 3, with a parent beside the player. The first window, «Внимание» (Attention): «Обнаружен человек, который считает ступеньки просто так.» (Detected: a person who counts steps for no reason.) «В лесу за мельницей выросла Башня.» (A Tower has grown in the forest beyond the mill.) «Башня связана из нитей. Нити спутались.» (The Tower is knitted from threads. The threads have tangled.) The second window, «Правила Башни» (the Tower's rules), states the rules honestly:

- «В Башне живут узлы. Узлы распутывают счётом, мерой, долей и формой.» (Knots live in the Tower. They are untangled by counting, measure, parts and shape.)
- «Иногда узлы будут трудными. Так Башня узнаёт, что ты уже умеешь.» (Sometimes knots will be hard. That's how the Tower learns what you can already do.)
- «Верное заклинание открывает секреты. «Не знаю» открывает другую дорогу. Опыт начисляется всегда.» (A true spell opens secrets. "I don't know" opens another road. Experience is always given.)
- «Мама и папа видят результаты и могут читать историю.» (Mum and Dad see the results and can read the story.)
- «Рассказчик — компьютерная программа. Историю мы пишем вместе.» (The narrator is a computer program. We write the story together.)

The button «Создать героиню» (Create the heroine) leads to screen 02. Sheets: 01a and 01b.

### Screen 02 «Создание героини» lets the player name the heroine and pick a cloak colour and a focus

Session 0, step «героиня». The heading asks «Какая она, охотница на узлы?» (What is she like, the knot hunter?). Fields: the name, with «Подскажи» (Suggest) giving three options from a list («Ступенька», «Искорка», «Петля», «Туманка», «Считалочка», «Клубника»), with the note that she can dictate it and rename at any time; the cloak colour from six («Клубничный», «Мятный», «Мшистый», «Леденцовый», «Сливовый», «Медовый»: strawberry, mint, mossy, boiled-sweet, plum, honey); the focus from four: «Спица-посох» (needle staff, long, with a glowing tip), «Фонарь-клубок» (yarn-ball lantern, glows when a thread spins inside), «Блокнот-гримуар» (notebook grimoire, its pages draw patterns themselves), «Крючок-жезл» (crochet-hook wand, hooks threads from afar). The picture is «Эскиз по эталону стиля. Лист героини выбираем вместе из четырёх вариантов.» (A sketch from the style reference. We choose the heroine's sheet together from four variants.) Buttons «Назад» (Back) and «Готово» (Done). Sheet: 02.

### Screen 03 «Первый узелок» lets the player choose, name and shape her first familiar

«Из распутанного узла выкатились три вязаных яйца» (Three knitted eggs rolled out of the untangled knot). The three cards:

| Familiar | Look | Line | For a girl who loves |
| --- | --- | --- | --- |
| «Пуговка» | a honey-coloured button-mouse; sparks spill from the holes on her belly | «Я пересчитала звёзды в этом коридоре. Их меньше, чем вчера.» (I counted the stars in this corridor. There are fewer than yesterday.) | order, mysteries and thoroughness |
| «Винтик» | a clockwork hedgehog; its spines are little screws, a winding key on its back | «Давай быстрее. Нет, ещё быстрее. Всё, вспомнил. Быстрее.» (Faster. No, faster still. Right, remembered. Faster.) | speed, adventure and noise |
| «Безешка» | a pink meringue bunny with curled ears and a cherry on her forehead | «Я пойду первой. Если я растаю, передай всем, что я была прекрасна.» (I'll go first. If I melt, tell everyone I was beautiful.) | drama, beauty and grand gestures |

Then «Существо ждёт имени» (The creature awaits a name), with «Подскажи» and the System's advice «выберите такое, которое приятно кричать через весь этаж» (choose one that's nice to shout across a whole floor). Traits, one or two: «ворчун», «драматичный», «тайно пишет стихи», «боится голубей», «всё считает», «любит спать» (grumpy, dramatic, secretly writes poems, afraid of pigeons, counts everything, loves to sleep) or «своя черта…» (her own trait). Sheet: 03.

### Screen 04 «Проба словаря» checks the maths words at risk

The player taps a word, then the picture that fits it: «знаменатель», «периметр», «делимое», «прямой угол» (denominator, perimeter, dividend, right angle). A button «Не знаю это слово» (I don't know this word) sits beside them. Notes: «Незнакомые слова — это нормально. Башня их потом объяснит.» (Unknown words are normal. The Tower will explain them later.) «Это не испытание. Опыт за пробу начисляется как обычно.» (This isn't a trial. Experience for the probe is given as usual.) Sheet: 04.

### Screen 05 «Комната героини» is the main screen between adventures

The heroine's room, named after her («Комната Ступеньки» in the example), with her familiar, a shelf of Guardian trophies that grows after each floor, and links to «Дневник» (Diary), «Узелки» (familiars), «Кузница» (Forge) and «Лавка» (Shop). «Ближайшие цели» (Next goals): «Фонарь Терпеливого Света» (the Lantern of Patient Light) with «рецепт готов» (recipe ready); «Искорка скоро эволюционирует» (the familiar will evolve soon), with friendship; «Страница Дневника спрятана на Заводе» (a Diary page is hidden in the Works). The example level is 7 with 180 of 270 experience. Two states: new, «За ночь Башня перевязала несколько рядов. Новые узлы ждут. Лестницы уже переплелись по-новому.» (Overnight the Tower re-knitted some rows. New knots are waiting. The staircases have braided anew.) with the button «Приключение дня» (Adventure of the day); and resume, «Продолжаем с того же места: вторая комната, открытый узел.» (We continue from the same place: the second room, an open knot.) with «Продолжить приключение» (Continue the adventure). Sheet: 05.

### Screen 06 «Утро в Башне» opens the adventure with a recap, the morning threads and the daily quests

The log shows «В прошлый раз…» (Last time…) from the narrator; the System window «Утро» (Morning): «За ночь Башня перевязала несколько рядов. Изменения: в Кондитерской появилось озеро. Озеро из заварного крема. Купаться не рекомендуется. Рекомендуется всё равно.» (Overnight the Tower re-knitted some rows. Changes: a lake has appeared in the Bakery. A lake of custard. Swimming is not recommended. It is recommended anyway.), with the fields «Нити +3» (Threads +3) and «Дней в Башне 23» (Days in the Tower 23); and a familiar line. The daily quests, in rows: «Пройди этажи маршрута» (Pass the route's floors), «Поговори с узелком у костра» (Talk to the familiar at the campfire), «Загляни в Дневник» (Look into the Diary), and a pattern quest «Собери чистый ряд» (Make a clean row). Three suggested actions, one strange: «Попробовать озеро из крема» (Try the cream lake). The button is «Маршрут дня» (Route of the day). Sheet: 06.

### Screen 07 «Маршрут дня» shows the Tower map with today's floors in order, with no time

The map lists all nine floors as open: «Обсерватория», «Сортировочная Шёпотов», «Сад Граней», «Мерные Дюны», «Ярмарка Весов», «Канал Капель», «Кондитерская Облачных Долей», «Завод Тикающих Чайников», «Шуршащий Архив». Today's floors are marked «сначала» (first), «потом» (then) and «под конец» (at the end): the Canal, the Works and the Bakery. The System: «Лестницы-косы переплелись за ночь. Сегодня они ведут через Канал, Завод и Кондитерскую. Порядок этажей не изменился. Изменилось всё остальное.» (The braid staircases re-braided overnight. Today they lead through the Canal, the Works and the Bakery. The order of the floors hasn't changed. Everything else has.) The note: «Если останется время, коса поведёт ещё на один этаж.» (If time is left, the braid will lead to one more floor.) The button is «Подняться на Канал» (Go up to the Canal). No duration is shown. Sheet: 07.

### Screen 08 «Сцена» is the main story screen, where the player types, dictates or picks an action

The picture column is a placeholder: «Фон: вечерние каналы, шлюзы, горбатые мостики, фонари с каплями света» (Background: evening canals, locks, humpback bridges, lanterns with drops of light), with sprites for the Guardian «Шлюзмейстер Кап» and the familiar. The log gives the narrator's floor entry, a line from Кап about his lost monocle, and a familiar line. Each of the three actions has its own story reply, for example «Измерить море линейкой» (Measure the sea with a ruler): «Линейка доходит до середины моря и вежливо заканчивается.» (The ruler reaches the middle of the sea and politely ends.) After a free action the System says «Башня внимательно выслушала и повернула историю так, чтобы твоя идея пригодилась.» (The Tower listened carefully and turned the story so your idea would be useful.) Then the System window «Узел»: «Обнаружен узел. Нить: Доля.» (A knot is detected. Thread: Part.) and the button «Распутать узел» (Untangle the knot). Sheets: 08 and 31d (the same scene in the dark theme).

### Screen 09 «Испытание» runs one trial: lead-in, task window, knot scheme, similar knot and the spell in the scene

The screen has four states, drawn as sheets 09a to 09d, plus the hint and the similar knot.

- Lead-in (09a): the Master describes the knot, «Ворота шлюза заперты узлом. Маленькая запятая с рюкзачком прыгает по замку…» (The lock gates are shut by a knot. A little comma with a rucksack hops about the lock…); the Tangle is «Запятушка-Бродяга»; the System marks it, «Путаница готова к распутыванию» (The Tangle is ready to be untangled); one button, «Распутать» (Untangle), with the note «Любой ответ — заклинание. «Не знаю» тоже.» (Any answer is a spell. "I don't know" too.)
- Task window (09b), over the scene: the statement «Лодочница Грета везёт 2,5 кг груза. На причале ей дали ещё 1,75 кг. Сколько груза в лодке теперь?» (Greta the boatwoman carries 2.5 kg of cargo. At the pier she was given 1.75 kg more. How much cargo is in the boat now?), at most k+1 sentences of up to 14 words each, in large calm text; the answer field with the unit beside it; a term word («десятичная дробь», decimal fraction) that shows a picture when tapped; the keypad on the right with keys of at least 56 pt; «Не знаю» and «Путеводная нить · 7» (guiding thread, 7 in stock) always beside «Готово». A hint costs one thread and makes the attempt assisted; the sheet shows hint level 1 of 3. Inside the window nothing moves or flickers, with no story text and no tick or cross marks. On a physical keyboard Enter is «Готово» and "?" is «Не знаю».
- The three hint steps: «Узел спрашивает, сколько груза всего. Значит, груз складывается.» (The knot asks how much cargo in all. So the cargo adds up.); «Подпиши числа так, чтобы запятая стояла под запятой: 2,50 и 1,75.» (Write the numbers comma under comma: 2.50 and 1.75.); «Сложи: 2,50 + 1,75. Осталось посчитать.» (Add: 2.50 + 1.75. What's left is to count.)
- Knot scheme (09c), after the first attempt: the outcome in the world's words («Распутан начисто», «Узел ослаблен», «Принято»), «Твоё заклинание: …» (your spell), «Как легла нить» (how the thread lay) with the short solution «2,5 = 2,50 — подписываем запятую под запятой.» and «В лодке 4,25 кг.», the familiar's explanation, and «Подробнее · 1 нить» (More, 1 thread). After «ослаблен» the scheme is free and a similar knot follows: «У Мелочи в ведёрке 3,5 л воды. Он добавил ещё 1,25 л. Сколько воды в ведёрке?» (Small Change has 3.5 l of water in his bucket. He added 1.25 l more. How much water is in the bucket?), with outcomes «Нить закреплена» (thread secured) or «Узел пока держится» (the knot holds for now).
- Spell in the scene (09d), after a clean answer: «Нить возвращена на место. Узел развязался целиком. Путаница выглядит так, будто её только что погладили.» (The thread is back in place. The knot came undone completely. The Tangle looks as if someone just stroked it.) The narrator: «Спица вспыхивает. Запятая в замке щёлкает и встаёт на место.» (The staff flashes. The comma in the lock clicks into place.) After «ослаблен»: «Узел ослаблен. Башня открыла боковую тропу. Тропа утверждает, что всегда тут была.»

The familiar's explanation for the first task: «Узел хотел знать, сколько груза всего. Сначала я подписала запятую под запятой: 2,50 и 1,75. Потом сложила сотые, десятые и целые. Пересчитала ещё раз. Всего 4,25 кг. Теперь я верю в этот узел.» (The knot wanted to know how much cargo in all. First I wrote comma under comma: 2.50 and 1.75. Then I added hundredths, tenths and wholes. I recounted. 4.25 kg in all. Now I believe in this knot.)

### Screen 10 «Текстовая задача по шагам» starts the Guardian's word problem with a choice of model, then steps

The Guardian's trial by «Шлюзмейстер Кап»: «Кап купил 3 фонаря по 12 капель и 2 фонаря по 15 капель. Сколько капель он отдал за все фонари?» (Drip bought 3 lanterns at 12 drops and 2 lanterns at 15 drops. How many drops did he pay for all the lanterns?) First (10a) the player picks a short model from four: "3 · 12 + 2 · 15", "3 + 12 + 2 + 15", "(3 + 2) · 12", "3 · 15 + 2 · 12", which shows whether she understood the problem. Then (10b) «Распутай по шагам: действие и что получилось» (Untangle step by step: the action and what came out): row 1 "3 · 12 = 36", row 2 "2 · 15 = …", row 3, and «Ответ … капель» (Answer … drops) with units. «Не знаю» and «Путеводная нить · 6» sit beside «Готово». A squared scratchpad sits beside: «Пальцем или Apple Pencil. Черновик сохраняется вместе с ответом.» (With a finger or Apple Pencil. The scratchpad is saved with the answer.) Term words are tappable. The prototype's map places the Guardian's word problem «примерно на одном этаже из трёх» (on about one floor in three). Sheets: 10a and 10b.

### Screen 11 «Конец комнаты и сундук» ends a room with a story branch and a chest of three visible rewards

The branch depends on the share of clean answers. Success: «Путаница распутана начисто. В стене открылся тайник. Тайник смущён, что его нашли так быстро.» (The Tangle is untangled cleanly. A cache opened in the wall. The cache is embarrassed to be found so quickly.) The other road: «Путаница ослабла и уступила дорогу. Дорога ведёт в обход. В обходе, по данным Системы, пекут печенье.» (The Tangle weakened and gave way. The road leads round. On the way round, the System reports, they bake biscuits.) The chest: «Выбери одну награду — все три видны сразу» (Pick one reward; all three are visible at once). Example rewards: «Горсть пуговиц» (a handful of buttons, for the Shop), «Осколки звёздной стали» (star-steel shards, for the Forge), «Страница Дневника» (a Diary page, in the Keeper's hand), «Капля с бликом» (a drop with a glint, Canal material), «Путеводная нить» (a guiding thread, into the side pocket). The button is «Забрать и идти дальше» (Take it and go on). Sheet: 11.

### Screen 12 «Страж и итог этажа» shows the floor's ending by its state and the Guardian's chest

The Guardian card: «Шлюзмейстер Кап», «жаба в жёлтом дождевике, монокль из капли» (a toad in a yellow raincoat, a monocle made of a drop). Three states:

| State | Guardian | Кап says | System |
| --- | --- | --- | --- |
| triumph | «впечатлён» (impressed) | «Я измерил вашу запятую трижды. Она стоит точно. Я доверяю вашей запятой.» (I measured your comma three times. It stands exactly. I trust your comma.) | «Этаж распутан начисто. Страж впечатлён и старается этого не показывать. Старание зафиксировано.» (The floor is untangled cleanly. The Guardian is impressed and trying not to show it. The effort is recorded.) |
| victory | «доволен» (pleased) | «Достаточно точно. Проходите, пока вода не передумала.» (Exact enough. Go through before the water changes its mind.) | «Этаж распутан. Страж пропускает дальше и одобрительно кивает. Кивок засчитан.» (The floor is untangled. The Guardian lets you pass and nods. The nod is counted.) |
| cunning bypass | «в недоумении» (puzzled) | «Это было неточно. Но очень ловко.» (That wasn't exact. But very deft.) | «Этаж пройден хитрым обходом. Страж не уверен, как это произошло. Пропуск выдан. Недоумение прилагается.» (The floor is passed by a cunning bypass. The Guardian isn't sure how it happened. A pass is issued. Puzzlement attached.) |

On triumph the chest holds «Сверкающая награда и находка этажа. В Дневнике новая запись.» (A sparkling reward and the floor's find. A new Diary entry.); otherwise «Сундук Стража: три награды на выбор» (the Guardian's chest: three rewards to choose from). Actions: «Поблагодарить и поклониться» (Thank and bow), «Спросить, где найти монокль» (Ask where to find the monocle), «Подарить Капу носок левый» (Give Drip the left sock). The button is «Лестница наверх» (Stairs up). Sheet: 12.

### Screen 13 «Новый уровень» is the level ceremony, with loop rings round the number and a dry System line

Level: «Уровень повышен. Вы чувствуете, что стали немного больше собой.» (Level raised. You feel a little more yourself.) After a pause: «Искорка делает вид, что не заметила. Искорка заметила.» (The familiar pretends not to notice. The familiar noticed.) Fields: «Новый уровень 8» (new level 8), «До следующего 290 опыта» (290 experience to the next). A second variant is the clean row: «Чистый ряд. Петли легли одна к одной. Звёздная пряжа собирается сама. Она любит порядок.», with fields «Звёздная пряжа +1» and «Нити +1». Sheet: 13.

### Screen 14 «Гимнастика для глаз» shows four eye exercises through the familiar

Every 20 minutes of active play, after an answer or a scene and never mid-task, for 30-40 seconds. The System: «Узелок смотрит в окно Башни на самое дальнее дерево леса. Рекомендуется посмотреть туда же. Дерево не против.» The four exercises, in turn with progress dots: «Посмотри вдаль» (Look into the distance: find the farthest tree and look at it while the familiar counts leaves), «Поморгай» (Blink: fast like a firefly's wings, then slowly), «Восьмёрка» (Figure eight: draw a big sideways eight with your eyes, one way, then the other), «Ладошки» (Palms: rub them warm and cover your eyes). Buttons «Сделала» (Done) and «Вернуться к узлам» (Back to the knots). A «Пропустить» (Skip) button appears only if the parent turns it on. Sheet: 14.

### Screen 15 «Привал» is a campfire scene where the player can simply talk

«Рекомендуется привал. Узелок разжёг костёр из искр. Костёр ненастоящий. Тепло настоящее.» The narrator: sparks rise and settle on the knitted loops like little lanterns. The familiar: «Я посчитала искры. Они всё время улетают, поэтому я считаю заново. Это успокаивает. Хочешь, посчитаем вместе?» (I counted the sparks. They keep flying away, so I count again. It's calming. Shall we count together?) Actions: «Спросить, что снится узелкам» (Ask what familiars dream of), «Рассказать про свой день» (Tell about your day), «Пожарить на костре носок» (Roast a sock on the fire). The button is «В путь» (On we go). Sheets: 15 and 31e (large text in the «Мятный чай», mint tea, palette).

### Screen 16 «Мягкая остановка» offers to save, and the design draws a night re-knitting for the daily maximum

Three states. Evening: «Сегодняшний ряд связан наполовину. Башня подождёт. Рекомендуется сохранить приключение и вернуться завтра.» (Today's row is half knitted. The Tower will wait. It is recommended to save and come back tomorrow.), with «Искорка зевает» (the familiar yawns), dimmed lamps, and the buttons «Ещё один ряд» and the main «Сохранить и вернуться завтра» (Save and come back tomorrow). The System's line has no minutes, numbers or hints of a countdown. Extension: «Продление принято. Башня зажгла ещё одну лампу. Лампа горит ровно столько, сколько вам разрешили.» (Extension accepted. The Tower lit one more lamp. It burns exactly as long as you were allowed.) Night re-knitting at the daily maximum: «Башня гасит лампы. Начинается ночная перевязка. Открытый узел сохранён. Завтра он будет ждать на том же месте.» and, after a pause, «Узлы терпеливые, хоть и спутанные.» (Knots are patient, if tangled.), with «До завтра» (Until tomorrow). Sheets: 16a and 16b. The owner removed the daily maximum on 2026-09-27, so this third state has no trigger in the game; the soft stop returns after each extension instead. The extension line «Лампа горит ровно столько, сколько вам разрешили» (It burns exactly as long as you were allowed) still fits, because each extension lasts 20 minutes.

### Screen 17 «Конец ряда» closes the adventure of the day with growth, floor states and a cliffhanger

The left column shows «Сегодня ты» (Today you) with the gains «Осколки +6», «Пряжа +2», «Страница», «Капля» (shards, yarn, a page, a drop), level 8 with 40 of 290 experience, and the quests with two done. The log: «На Канале — триумф: Шлюзмейстер Кап отдал запасной ключ… На Заводе — хитрый обход, о котором Бригадир Шпиндель ещё долго будет думать за чаем.»; the System «Итог» (Result): «Сегодняшний ряд связан. Башня готовится к ночной перевязке. Узлы подождут. Они терпеливые, хоть и спутанные.»; and the cliffhanger: a paper bird knocks on the window with a stamp from the past and one word, «Скоро» (Soon). Three choices of «куда завтра» (where tomorrow): follow the bird, ask «бабушка Ирма» (Granny Irma) about the stamp, write back to the bird. Buttons «Открыть Дневник» and «Сохранить и уйти». Sheet: 17.

### Screen 18 «Вылупление и имя» hatches a Tangle's egg into a new familiar and asks for its name

In the «Шуршащий Архив» (Rustling Archive): «Путаница, которую ты распутала так бережно, оставила на полке маленькое вязаное яйцо.» (The Tangle you untangled so gently left a small knitted egg on the shelf.) The System: «Яйцо тёплое. Яйцо шуршит. Рекомендуется погладить. Осторожно.» (The egg is warm. The egg rustles. Stroking is recommended. Carefully.) The player taps «Погладить яйцо» (Stroke the egg), and a paper moth from an old library card flutters out. Then «Существо ждёт имени. Имя будет записано в Основу.» (The creature awaits a name. The name will be written into the Warp.), typed in the input line like any line, with suggestions «Шелестун», «Закладка», «Штампик». The new familiar: «Я читал о своём имени. Там было много страниц…»; the old one: «Нас теперь больше. Я пересчитала.» (There are more of us now. I counted.) A Diary page is added. Sheets: 18a and 18b.

### Screen 19 «Изнанка» is the dreamcore layer, with light creepiness and an exit always in view

«Изнанка · Площадка Сумерек» (the Underside, the Dusk Playground), in the `dream` theme. The System: «Обнаружен слой Изнанки. Освещение: мягкое. Звуки: далёкие. Опасность: не обнаружена. Узелок рядом.» (An Underside layer is detected. Light: soft. Sounds: distant. Danger: none detected. The familiar is near.) The scene: a children's playground inside the Tower, a dusty-rose sky, lemon lights over the carousel, a swing creaking with no wind, a glowing door on the right. The swing «Пустокачель» opens sleepy eyes; it is lonely and wants someone to count how high it can fly. The kind resolution: the swing flies, counts with the familiar and falls asleep happy. The button «Мне страшно» (I'm scared) always shows and gives an instant kind ending: «Я зажгла свет. Вот дверь домой, она совсем рядом. Пойдём вместе.» (I lit the light. Here's the door home, very close. Let's go together.) An exit «Через дверь — домой» (Through the door, home) is always visible. The prototype's map says the Underside comes no more than once a week, and the parent sets the creepiness level. Sheet: 19.

### Screen 20 «Пауза вне истории» stops the story when the player writes about real trouble

«История на паузе» (The story is paused). A fixed text outside the story: «Это звучит серьёзно. Об этом лучше рассказать маме или папе — они помогут. Хорошо, что ты об этом написала. Твоя история никуда не денется: она сохранена и подождёт.» (This sounds serious. It's better to tell Mum or Dad about it; they'll help. It's good that you wrote about it. Your story isn't going anywhere: it's saved and will wait.) Buttons «Сохранить и уйти» and «Вернуться в историю» (Back to the story). The prototype's map separates everyday worries such as «устала» (tired), answered warmly inside the story, from serious ones, which get the fixed line, the pause and a visible flag in the Parent Room. Sheet: 20.

### Screen 21 «Продолжение с того же места» returns the player to exactly where she left

Three cases. Resume: «Приключение сохранено. Продолжаем с того же места. Узел за это время не развязался сам. Узел старался.» (The adventure is saved. We continue from the same place. The knot didn't untie itself meanwhile. The knot tried.), with «Ты остановилась здесь: Канал Капель · вторая комната · открытый узел», «Невыбранный сундук ждёт с теми же тремя наградами» (the unchosen chest waits with the same three rewards) and «Сначала одна разминка: Башня всегда даёт размяться после перерыва.» (First one warm-up: the Tower always gives a warm-up after a break.) Elsewhere: «Приключение продолжено в другом месте. Здесь пока можно только смотреть. Башня одна, а окон у неё много.» (The adventure continued elsewhere. Here you can only look for now. There is one Tower, but it has many windows.), with «Продолжить здесь» (Continue here). Long night, the three-day rule: «Башня перевязала оставшиеся этажи за несколько ночей. Всё, что ты заработала, осталось с тобой. Неоткрытые тайники перепрятаны и найдутся позже. Новое приключение начинается сразу после этого.», with «Закрыть главу» (Close the chapter). The prototype's map: the same task, review step, scene line and chest; after a pause over 5 minutes, a warm-up without scoring. Sheet: 21.

### Screen 22 «Дневник Смотрителя» holds the bestiary, found pages and floor maps

Three tabs: «Бестиарий», «Страницы», «Карты» (Bestiary, Pages, Maps). The bestiary of familiars and Tangles shows «5 из 15» filled, with silhouettes for those not yet met. Example entries: «Искорка» (familiar, Spark, «Пересчитывает всё вполголоса. Проверяет дважды.», always near); «Шелестун» (familiar, Spark, the Archive); «Лишнюшка» (Tangle, Count, a fluffy ball with one extra ear that doesn't know which ear is extra, the Archive); «Недоделитель» (the Underdivider, Tangle, Part, the Bakery: «Не кормить. Покормила. Зря.»); «Запятушка» (Tangle, Part, the Canal: «Утверждает, что она путешественница, а не беглянка.», she claims to be a traveller, not a runaway); and not yet met «Винтик», «Безешка», «Нулёк», «Корица», «Бубенец». Found pages include «Узел — это просто нитка, которая забыла, куда шла. Не ругай её. Напомни.» and «Страница спрятана на Заводе. Не ищи за котлом. (Ищи за котлом.)». Maps include a drawing of the Works in the Keeper's hand. An entry can be renamed. Sheet: 22.

### Screen 23 «Кузница Ниток» shows recipes in advance, with what each needs and how much the player has

A cushion anvil and a yarn-ball hammer. Recipes: «Фонарь Терпеливого Света» (the Lantern of Patient Light, «Светит тем ярче, чем дольше в него смотришь.», with archive pollen), «Сапожки Точного Шага» (the Boots of the Exact Step, with sand in a thimble), «Шарф Туманной Погоды» (the Scarf of Foggy Weather, with a paper feather). The System gives a recipe as a knitting pattern: «Ряд 1: осколки звёздной стали. Ряд 2: звёздная пряжа. Ряд 3: материал этажа.» (Row 1: star-steel shards. Row 2: star yarn. Row 3: floor material.) and «Торопиться не рекомендуется.» (Hurrying is not recommended.) Forging: «Наковальня мурлычет. Молот стучит. Узелки подносят нитки.» then «Готово. Предмет ждёт имени.» (Done. The item awaits a name.) «Большие рецепты откроются по ходу истории» (big recipes open as the story goes on). Sheet: 23.

### Screen 24 «Лавка» sells items at honest prices in buttons, with two items changing each morning

«Лавка на Ярмарке Весов» (the shop at the Scales Fair), kept by «Барон фон Наценка» (Baron von Markup). Items: «Капюшон с Ушками Путаницы» (outfit), «Очки Второго Взгляда» (accessory), «Значок «Я Считаю Ступеньки»» (accessory), «Крючок-жезл» (focus), «Ложка Статус Пересмотрен» (curio: «Ложка не является оружием. Статус пересмотрен. Ложка является ложкой, но с достоинством.»), «Плащ цвета тумана» (outfit), tagged «твоё» (yours) or «новое утром» (new this morning). The Baron's line: «Могу предложить вам небо. Почти новое. Вчерашний вторник отдам в придачу.» (I can offer you the sky. Nearly new. I'll throw in last Tuesday.) The System: «Товар не зарегистрирован. Цена не изменена.» The rule: «Цены честные и не меняются. Две вещи на полке меняются каждое утро. Путеводные нити не продаются: их даёт Башня.» (Prices are honest and don't change. Two items on the shelf change each morning. Guiding threads aren't sold: the Tower gives them.) Sheet: 24.

### Screen 25 «Узелки» manages the team of familiars: who goes on adventures, friendship, evolution and moves

Two areas: «В команде — ходят в приключения» (in the team, going on adventures), with a free slot, and «В комнате» (in the room), where resting familiars live and can be called into the team. A familiar's card shows its traits, «Переименовать» (rename), its line, «Дружба» (friendship) that «растёт от приключений, привалов и разговоров» (grows from adventures, rest stops and talks), its evolution chain and its moves. Example: «Искорка» evolves to «Застёжка» and «Пуговица Великая», with the moves «Пересчёт» (lights up hidden objects) and «Искра-маяк» (lights a dark room); «Шелестун» evolves to «Страничник», with «Закладка» (remembers a place and returns there) and «Шелест» (distracts a Tangle with a rustle). Sheet: 25.

### Screen 26 «Вход в Комнату родителя» lets a parent in by PIN

«Только для взрослых» (Adults only). «Отчёт, карта навыков, метки уроков и настройки. Игрок сюда не заходит; отчёт — для нас, игра — для игрока.» (The report, skill map, lesson marks and settings. The player doesn't come here; the report is for us, the game is for the player.) The rule: «После пяти неверных попыток вход закрывается на 15 минут. Сессия закрывается сама через 30 минут без действий.» (After five wrong attempts, entry closes for 15 minutes. The session closes itself after 30 minutes without action.) The icon in the game is inconspicuous. The Parent Room uses its own light theme, with tabs «Сводка и карта», «Навык и лог», «Уроки и настройки», «Книга истории», «Проверка игры», «Выгрузка данных», «Выйти в игру» (Summary and map, Skill and log, Lessons and settings, Story book, Game check, Data export, Back to the game). Sheet: 26.

### Screen 27 «Сводка и карта навыков» shows the week's figures, the skill map and a preliminary VWO block

An optional alert «Нужно внимание.» (Attention needed.): the player wrote about something serious at the campfire, with «Открыть сцену» (Open the scene). The summary: last play and update time, «Приключений за неделю 5» (adventures this week), «Первых попыток за неделю 148» (first attempts this week), «Доля успеха (цель 70–80 %) 74 %» (success share, target 70-80 %), «Держит шагов в задаче 2» (holds 2 steps in a problem). The skill map, «первые попытки без помощи» (unassisted first attempts), groups nodes by domain: N numbers, A arithmetic, F fractions, D decimals, P percentages, M quantities, G geometry, S data. The states are «не проверено», «пока не освоено», «понимает, нужна скорость», «бегло», «устойчиво» (not checked, not mastered yet, understands and needs speed, fluent, stable). An outline marks the frontier («с неё логично начинать занятия», the natural place to start lessons); hatching marks a state inferred from neighbours. The VWO readiness block is marked «предварительно: без контрольных прогонов» (preliminary: no control runs), shows «1S ещё не покрыт», «Покрытие 1F», «Запас 1S», the label «Почти готово» (nearly ready), «Сама — редко, с подсказкой — уверенно: F5, D2, A9» (alone rarely, with a hint confidently), «Что мешает» (what gets in the way) and «Давно не проверялись: M3, G2 — больше 14 дней» (not checked for over 14 days), with the permanent disclaimer. Sheet: 27.

### Screen 28 «Карточка навыка» shows one skill's estimates, misconceptions and task log as shown

Example: «F5 · Сложение и вычитание дробей с одинаковыми знаменателями» (adding and subtracting fractions with like denominators), level 1F, relying on F3 and needed for F6 and F7, with «Отметить урок» (Mark a lesson). Estimates: «Сама 0,36», «С подсказкой 0,74» (alone 0.36, with a hint 0.74), based on a block of 6 tasks on 22-24 September, with no probe after the lesson yet. Misconceptions: «Сложила числители и знаменатели» (added numerators and denominators) 4 times; «Целую часть потеряла при переходе» (lost the whole part when converting) once; accuracy before review 2 of 6, after review the same day 4 of 5. The log has the columns «Когда», «Задание», «Ответ», «Верно», «Время», «Помощь», «Дальше» (When, Task, Answer, Correct, Time, Help, Next), with rows such as «3/8 + 2/8 пирога», 41 s, «схема → двойник: верно». Note: «Время сравнивается только внутри iPad или внутри компьютера.» (Time is compared only within the iPad or within the computer.) A task can be marked «Задание неоднозначное» (ambiguous task). Sheet: 28.

### Screen 29 «Уроки и настройки» holds the parent's lesson marks and the game settings

Lesson marks: pick a skill (F5, A9, D2 in the example), when the lesson was, an optional note («Разбирали на пирогах, потом на отрезках.»), and «Занимались на уроке» (We had a lesson). The rule: «Игра проверит навык через 1–3 дня и ещё раз примерно через две недели. В первые дни — до четырёх заданий в день.» (The game checks the skill after 1-3 days and again after about two weeks, with up to four tasks a day in the first days.) Mark statuses: «Улучшилось после урока» (improved after the lesson), «Перепроверка 2 ≈ 29.09» (recheck 2 around 29 September), «Сохранилось» (retained), «Перепроверка 1 через 1–3 дня». Settings: the daily maximum in minutes (45, 60, 75, 90), after which the Tower puts out its lamps and the task is saved, which the owner removed on 2026-09-27; the creepiness level for the Underside and dreamcore floors; «Пропустить» in eye exercises, off by default; the three-day rule, closing an unfinished adventure with a short ending, on or off; the default device for future Ascents, iPad or computer; raw data export as the event log (JSONL), attempts (CSV) or everything in Parquet, «Файлы собираются только на нашем Mac» (files are built only on our Mac). Sheet: 29.

### Screen 30 «Книга истории» shows every scene by day with branches and floor states

Chapters by day, for example «Глава 3 · Запятая в замке» (25 September: the Canal, the Works, the Bakery; Canal triumph, Works cunning bypass), «Глава 3 · Привал» (24 September, marked «нужно внимание»), «Глава 2 · Шуршащий Архив» (22 September: Archive victory) and «Пробуждение» (15 September, with Mum, Session 0). Items that «Вернётся позже» (will come back later): a cache on the Canal, a Diary page in the Works. A serious scene shows the player's text in full and what the game did. Actions: «Пометить сцену как неудачную» (mark the scene as failed) and «Скрыть предмет от ИИ» (hide an item from the AI). Sheet: 30.

### Screen 31 «Настройки игры» lets the player choose theme, palette, text size and sound, with a live preview

Theme «Светлая» or «Тёмная» («Тёмная удобна вечером», dark suits the evening); palette, ready-made («Клубничный крем», «Ванильное облако», «Мятный чай», «Лавандовый сироп») or «Своя» (her own) with four colours: main, second, magic and warmth; text size «Обычный» or «Крупный» (normal, large); music and sound «Тихо», «Средне», «Громче» (quiet, medium, louder), «Без резких громких звуков» (no sharp loud sounds). The rule: «Любой цвет подойдёт: слишком тёмный Башня сама сделает светлее, чтобы буквы читались.» (Any colour will do: the Tower lightens one that's too dark so the letters stay readable.) A preview shows a story log in the chosen colours. The paw opens it from any screen and returns to the same screen. Sheets: 31a (ready palettes), 31b (own palette), 31c (dark theme), 31d (the scene in the dark theme), 31e (the rest stop with large text and «Мятный чай»).

### Screen 32 «Проверка игры» lets the parent play any part of the game without touching the player's data

«Играйте за игрока, не трогая его данные.» (Play as the player without touching her data.) Everything goes to a separate test profile and doesn't enter the report and skill map, the story book, rewards, the save, the plot or «Дни в Башне». Start from: «Пробуждение» (Session 0 whole), «Приключение дня» (from the morning, by the route), «Этаж» (entry, rooms, Guardian), «Узел и шаблон» (one task in a row, for example D2 and template D2-T3 «груз») or «Любой экран». Profile: «Чистый» (clean, a new hero) or «Копия игрока» (a copy of her progress today; changes stay in the copy). Tools: show the answer and template (node, template, seed, correct answer); set the outcome by hand (clean, loosened, I don't know, without input); speed up time (eye exercise and soft stop after a minute); Master scenes from the library or live; sound, off by default in the check. The test profile's log lists runs such as «Канал Капель · 12 заданий · 2 заметки», with «Сбросить тестовый профиль» and «Журнал проверки (JSONL)». Sheet: 32.

### Screen 33 «Проверка · Испытание» runs a trial in test mode with a tool panel and a striped frame

The trial of screen 09 inside a striped frame with the permanent label «Проверка · не идёт в статистику игрока» (Check: not in the player's statistics). The side panel, in the Parent Room's light theme: profile «Копия игрока · 26.09», node «D2 · сложение десятичных», template «D2-T3 «груз в лодке» · зерно 4172» (seed 4172), the answer, the attempt («первая · без помощи», «первая · с подсказкой», «вторая · двойник»), manual outcome «Начисто», «Ослаблен», «Не знаю», quick jumps («Сначала», «Конец комнаты», «К Стражу», «Гимнастика», «Другой узел…»), a task note and «Закончить проверку» (End the check). «Заметки и «неоднозначное задание» уходят в список правок. Больше ничего из проверки не сохраняется у игрока.» (Notes and "ambiguous task" go to the list of fixes. Nothing else from the check is saved for the player.) Sheet: 33.

### Resolved: the design's pastel patisserie anime style holds for every screen, and the cat motifs stay

Proposed by research on 2026-09-26; the owner approves it with this record. RES-3400 compares the options for gap 31 and gives the reason: the player chose the style, and the owner built the tokens, components, sheets and prototype on it. For the screens this means the cat ears over the story column, the settings paw and the bell stay as motifs of the style, and no screen text names the style's reference.

### Resolved: the screens call familiars «узелки», and «Шелестун» and «Искорка» are names the player gave, beside the canon's placeholders

Proposed by research on 2026-09-26; the owner approves it with this record.

RES-3300 compares the options for the word and holds the reason: every text the heroine sees says «узелок», as the prototype does, so the canon's lines now read «Узелок смотрит в окно Башни», «Поговори с узелком у костра» and «Люди с узелками». The names are not a contradiction. The prototype's data for screens 22 and 25 mark «Искорка» and «Шелестун» as `named: true`, and screen 18 offers «Шелестун», «Закладка» and «Штампик» as suggestions when the moth hatches. So «Искорка» is the name the player gave «Пуговка», and «Шелестун» the name she gave the moth whose canon placeholder is «Шуршик» (CAN-0060). Every other name the prototype uses matches CAN-0060 and RES-1900: the starters «Пуговка», «Винтик» and «Безешка» with the same looks and lines, «Корица» and «Бубенец» not yet met, the stages «Застёжка», «Пуговица Великая» and «Страничник», and the moves «Пересчёт», «Искра-маяк», «Закладка» and «Шелест». The stage counts match RES-1900 too: three for the starter, two for the moth.

Two small clashes follow from the suggestion lists, and research proposes a rule for each. «Закладка» is also the moth's move, and «Искорка» is also one of the heroine's name suggestions on screen 02. So the hatching screen offers the canon placeholder first, then others, and never suggests a move's name or a name the heroine or another familiar already has; the player can still type any name.

### Resolved: the parent's creepiness levels are «Уютно», «Чуть жутковато» and «Загадочно» under the heading «Уровень жуткости»

Proposed by research on 2026-09-26; the owner approves it with this record.

Screen 29 labels level 1 «Слегка» (Slightly) under the heading «Уровень жуткости» (creepiness level); CAN-0130 and RES-1500 name it «Чуть жутковато» (A little creepy). Two options were weighed. «Слегка» is better at fitting a short segmented control. «Чуть жутковато» is better at meaning: it says what the level adds, and it reads the same in the canon, in the Master's order and in the parent's settings. The sheets say their names and texts are examples. «Чуть жутковато» has 14 characters against 9 in «Загадочно»; I haven't checked it on sheet 29, so the layout might need a wider segment. So «Чуть жутковато» wins, and the prototype's heading «Уровень жуткости» stays. Only the parent sees these labels.

### Resolved: the Awakening's closing line drops «Ранг: E», and a rank badge beside the window shows the rank

Proposed by research on 2026-09-26; the owner approves it with this record.

CAN-0030 closed the Awakening with «Пробуждение завершено. Ранг: E. Добро пожаловать в Башню.» The prototype's screen 01 shows «Пробуждение завершено.» and «Добро пожаловать в Башню.», and on the same step shows the `RankBadge` component with rank E and «Видит узлы и Путаниц» (Sees knots and Tangles). So the prototype moved the rank out of the line, not out of the screen. Keeping the rank in the line as well is better at matching the draft's quotation, but says it twice. The badge is better at the design's rule that the code fills values into fields (RES-3300), and the same badge shows the rank in the heroine's room and the settings. The prototype's version wins, and CAN-0030 now gives the line without the rank, with the badge beside it.

### Resolved: screen 02 picks name, cloak colour and focus, and the heroine's look is one of four character sheets chosen with the family before art is made

Proposed by research on 2026-09-26; the owner approves it with this record.

RES-3400 compares the options and holds the reason. Screen 02's note «Лист героини выбираем вместе из четырёх вариантов» (We choose the heroine's sheet together from four variants) is a step outside the game: the family picks one of four character sheets drawn from keyart-heroine, and that sheet then fixes her look in every frame. The screen itself has no sheet picker, only the sketch with «Плащ: …» and the focus on it, which shows that the chosen cloak colour tints the cardigan in the picture.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. The four sheets vary only hair colour and style, eye colour and the cardigan's colour; the catgirl ears and tail, the cardigan and the dress silhouette stay fixed. The family shows the player the key art and the four sheets before any art is generated in volume, and her choice is recorded. RES-3400 holds the reason.

### Resolved: the daily maximum offers 60, 80, 100 or 120 minutes, with 100 as the default

Proposed by research on 2026-09-26; the owner approves it with this record.

Screen 29 offers 45, 60, 75 or 90 minutes with 60 selected; RES-0300 sets a default of 100 minutes above the 60-minute soft stop, so that two 20-minute extensions of «Ещё один ряд» fit. Three option sets were weighed:

| Choices | Better at | Worse at |
| --- | --- | --- |
| 45, 60, 75, 90, default 60 (the prototype) | short days | the default puts the hard end on the soft stop, so «Ещё один ряд» never runs; 45 ends the day before the 60-minute adventure the owner decided on, so most adventures would spill into the next day; 75 and 90 end the second extension part-way |
| 60, 75, 90, 105, 120 | finer steps for the parent | every choice above 60 except 120 cuts an extension short, because an extension is 20 minutes |
| 60, 80, 100, 120, default 100 | each step is one whole extension; 60 is the parent's way to allow no extension; 120 stays within the 2-hour guideline RES-0300 cites | no choice below the adventure's own length |

The third set wins, because it keeps the owner's 60-minute adventure whole at every choice and lets each «Ещё один ряд» run its full 20 minutes. A choice below 60 isn't offered: the Director sizes the adventure for 60 minutes (RES-0100), so a lower maximum would stop almost every adventure part-way. At 60 the soft stop and the hard end coincide, the server sends `stop_offer` with `canExtend` false (RES-2400), and screen 16 shows the night re-knitting without «Ещё один ряд». The draft's prototype values stay as a record of what screen 29 showed.

The owner's decision of 2026-09-27 replaced this finding: the game has no daily maximum, see «Resolved: screen 29 has no daily-maximum setting» below.

### Resolved: screen 29 has no daily-maximum setting, and screen 16 has no hard-end state

The owner decided on 2026-09-27: there is no daily maximum, so screen 29 drops the choice of 45, 60, 75 or 90 minutes and research's 60, 80, 100 or 120. Screen 16 keeps the evening offer and the extension. After each 20-minute extension the evening offer returns on an unfinished adventure, with «Ещё один ряд» every time, and the night re-knitting state at the daily maximum has no trigger. RES-0300 lists what still limits play.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. No daily maximum returns, and three things are added. Screen 29 gains a «Закончить на сегодня» (Finish for today) control. After the parent uses it, screen 16 shows the evening offer at the next boundary with only «Сохранить и вернуться завтра», and no «Ещё один ряд». Screen 27, the parent's summary, marks each day whose active time passed 120 minutes (RES-2300). Flow 6 «Башня без заданий» (the Tower without tasks) keeps its screens free of tasks, and their time counts towards the eye exercise counter, so screen 14 still comes every 20 minutes there. RES-0300 holds the reason.

### Resolved: the task window is its own flat layer over the scene, not a System window

Proposed by research on 2026-09-26; the owner approves it with this record. RES-0100 compares the draft's System window with the design's separate task window and holds the reason: a solid, still frame keeps long task text readable and every task timed in the same frame. Screen 09b already follows this; the System window «Узел» on screen 08 announces the knot before it, and the outcome shows after it in the knot scheme and the scene.

### Resolved: screen 27 names every rule state, adding «Уточняется» and the cut-off label to the design's five

Proposed by research on 2026-09-26; the owner approves it with this record. RES-0900 compares the design's five skill states with the rule states and holds the reason for keeping the rule states on the design's chip fills. Screen 27's legend of five states becomes the labels in RES-0900: «Не проверено», «Уточняется», «Не проверялся, отрезан узлом X», «Stretch: не проверялся», «Пока не освоено», «Понимает», «Понимает, нужна скорость», «Бегло» and «Устойчиво», with hatching for inferred states and the outline for the frontier.

## Conclusions

1. Every story screen must put the story log and the input line at the centre, with the scene picture in a side column that holds no buttons.
2. «Привал», «Сохранить и уйти» and the settings paw must be visible on every story screen.
3. No screen for the player may show a timer, a clock, a duration, a percentage or a verdict word.
4. The task window must hold no animation and no story text, and «Не знаю» and the guiding thread must always sit beside «Готово».
5. Every trial outcome must show in the world's words, followed by the knot scheme, and after «Узел ослаблен» the scheme must be free and a similar knot must follow.
6. The Guardian's word problem must start with a choice of short model from four before step-by-step input.
7. A chest must show all three rewards at once and let the player choose one, with no chance involved.
8. The soft stop must come at 60 minutes of active time on an unfinished adventure, following the owner's decision, and not at the design's 45 minutes.
9. Screen 29 must offer no daily-maximum choice, because the owner decided on 2026-09-27 that the game has none; research had proposed 60, 80, 100 and 120 minutes.
10. An eye exercise must come after 20 minutes of active play at a boundary, never mid-task.
11. The Underside screen must always show the familiar, a light, a visible exit and the «Мне страшно» button.
12. A serious text from the player must pause the story with the fixed line and flag the scene in the Parent Room.
13. Resuming must return the player to the same task, review step, scene line and chest.
14. The Parent Room must sit behind a PIN, close entry for 15 minutes after five wrong attempts and close the session after 30 minutes without action.
15. Test mode must write to a separate profile, show its striped frame and label at all times, and pass only notes and ambiguous-task marks to the player's record.
16. The player must be able to choose theme, palette, text size and sound at any time, and the game must keep any chosen palette readable at 4.5:1.
17. The parent's creepiness choices must read «Уютно», «Чуть жутковато» and «Загадочно» under the heading «Уровень жуткости»; the draft record left «Слегка» against «Чуть жутковато» open.
18. The Awakening's closing System line must read «Пробуждение завершено. Добро пожаловать в Башню.» with the rank E shown by the rank badge beside the window; the draft record asked the line to carry «Ранг: E».
19. Every screen must call a familiar «узелок», and the hatching screen must offer the canon placeholder first and never suggest a move's name or a name already in use.
20. Screen 02 must let the player choose the name, the cloak colour and the focus, and must not offer a choice of look, which the family makes once from four character sheets before art is made.
21. The task window must be a flat layer of its own over the scene, never a System window.
22. The Parent Room's skill map must name every rule state from RES-0900, including «Уточняется» and the cut-off label, not only the design's five.
23. Screen 16 must show the evening offer again after each extension on an unfinished adventure, and must have no hard-end state, because the game has no daily maximum.
24. Screen 29 must offer «Закончить на сегодня», after which screen 16 must show the evening offer at the next boundary with no «Ещё один ряд»; the parent's summary must mark each day whose active time passed 120 minutes; and the screens after the finale must count towards the eye exercise counter, as research decided on 2026-09-27 on the owner's instruction.
25. The four heroine sheets must vary only hair colour and style, eye colour and the cardigan's colour, with the catgirl ears and tail, the cardigan and the dress silhouette fixed, and the family must show them and the key art to the player before any art is generated in volume, as research decided on 2026-09-27 on the owner's instruction.

## Sources

- The owner's design file «design-system/guidelines/30-screens.md», read 2026-09-26; not kept in the repository - the layout rule, the scenarios, the card table, test mode, separate states and what the mock-ups lack.
- The owner's design file «screens/README.md», read 2026-09-26; not kept in the repository - the order of the sheets and the sheet format.
- The owner's design folder «screens/», its list of 45 sheets, read 2026-09-26; not kept in the repository - the sheet names in the scenario table and in each screen finding.
- The owner's design file «screens/00-anatomy.png», read 2026-09-26; not kept in the repository - the story-screen scheme, sizes and margins.
- The owner's design file «screens/09b-trial-task.png», read 2026-09-26; not kept in the repository - the task-window rules, the key size and the keyboard shortcuts.
- The owner's design file «screens/16a-soft-stop.png», read 2026-09-26; not kept in the repository - the soft stop at about 45 minutes and its rules.
- The owner's design file «prototype/Main.dc.html», read 2026-09-26; not kept in the repository - the eleven scenarios, their paths and cross-cutting rules, and the adventure of about an hour.
- The owner's design file «prototype/01-Awakening.dc.html», read 2026-09-26; not kept in the repository - screen 01.
- The owner's design file «prototype/02-Hero.dc.html», read 2026-09-26; not kept in the repository - screen 02.
- The owner's design file «prototype/03-Familiar.dc.html», read 2026-09-26; not kept in the repository - screen 03.
- The owner's design file «prototype/04-Vocab.dc.html», read 2026-09-26; not kept in the repository - screen 04.
- The owner's design file «prototype/05-Room.dc.html», read 2026-09-26; not kept in the repository - screen 05.
- The owner's design file «prototype/06-Morning.dc.html», read 2026-09-26; not kept in the repository - screen 06.
- The owner's design file «prototype/07-Route.dc.html», read 2026-09-26; not kept in the repository - screen 07.
- The owner's design file «prototype/08-Scene.dc.html», read 2026-09-26; not kept in the repository - screen 08.
- The owner's design file «prototype/09-Trial.dc.html», read 2026-09-26; not kept in the repository - screen 09.
- The owner's design file «prototype/10-Steps.dc.html», read 2026-09-26; not kept in the repository - screen 10.
- The owner's design file «prototype/11-RoomEnd.dc.html», read 2026-09-26; not kept in the repository - screen 11.
- The owner's design file «prototype/12-Guardian.dc.html», read 2026-09-26; not kept in the repository - screen 12.
- The owner's design file «prototype/13-LevelUp.dc.html», read 2026-09-26; not kept in the repository - screen 13.
- The owner's design file «prototype/14-Eyes.dc.html», read 2026-09-26; not kept in the repository - screen 14.
- The owner's design file «prototype/15-Camp.dc.html», read 2026-09-26; not kept in the repository - screen 15.
- The owner's design file «prototype/16-SoftStop.dc.html», read 2026-09-26; not kept in the repository - screen 16.
- The owner's design file «prototype/17-DayEnd.dc.html», read 2026-09-26; not kept in the repository - screen 17.
- The owner's design file «prototype/18-Hatch.dc.html», read 2026-09-26; not kept in the repository - screen 18.
- The owner's design file «prototype/19-Dream.dc.html», read 2026-09-26; not kept in the repository - screen 19.
- The owner's design file «prototype/20-Safety.dc.html», read 2026-09-26; not kept in the repository - screen 20.
- The owner's design file «prototype/21-Resume.dc.html», read 2026-09-26; not kept in the repository - screen 21.
- The owner's design file «prototype/22-Diary.dc.html», read 2026-09-26; not kept in the repository - screen 22.
- The owner's design file «prototype/23-Forge.dc.html», read 2026-09-26; not kept in the repository - screen 23.
- The owner's design file «prototype/24-Shop.dc.html», read 2026-09-26; not kept in the repository - screen 24.
- The owner's design file «prototype/25-Familiars.dc.html», read 2026-09-26; not kept in the repository - screen 25.
- The owner's design file «prototype/26-Pin.dc.html», read 2026-09-26; not kept in the repository - screen 26.
- The owner's design file «prototype/27-Report.dc.html», read 2026-09-26; not kept in the repository - screen 27.
- The owner's design file «prototype/28-Node.dc.html», read 2026-09-26; not kept in the repository - screen 28.
- The owner's design file «prototype/29-Lessons.dc.html», read 2026-09-26; not kept in the repository - screen 29 and the daily-maximum and creepiness choices.
- The owner's decision that the game has no daily maximum, relayed 2026-09-27 - conclusions 9 and 23 and the resolved finding on screen 29.
- The owner's design file «prototype/30-StoryBook.dc.html», read 2026-09-26; not kept in the repository - screen 30.
- The owner's design file «prototype/31-Settings.dc.html», read 2026-09-26; not kept in the repository - screen 31.
- The owner's design file «prototype/32-TestMode.dc.html», read 2026-09-26; not kept in the repository - screen 32.
- The owner's design file «prototype/33-TestPlay.dc.html», read 2026-09-26; not kept in the repository - screen 33.
