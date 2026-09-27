---
id: RES-1500
artifact: research
status: draft
revised: 2026-09-27
---

# The draft proposes a bright, cute knitted world with a rare dreamcore layer, a parent-set creepiness level and dry humour that never touches the heroine or the maths

## Summary

The owner's draft proposes a Tower, knitted from threads, in a forest beyond a small town, where the heroine untangles living knots by solving trials. The draft sets nine floors, eight for maths and one Observatory for science, each with its own domain and Guardian. It proposed a bright, cute candy style in the spirit of Cookie Run; research on 2026-09-26 resolves the style in favour of the owner's newer design, a soft pastel patisserie anime style with a catgirl heroine (RES-3400). A second, rare dreamcore layer adds very light child-level creepiness. The parent sets a creepiness level from 0 to 2, and a fixed list of content stays forbidden at every level. Humour follows five canon rules: the world is absurd and serious, jokes are dry, and nobody jokes about the heroine, her answers or the maths. The Master's text and the approved line pool carry no digits or numerals, because the code alone puts numbers on screen. This record covers the world summary, the visual style, the dreamcore layer and the humour rules. It leaves the world bible itself to the canon records, the Master and the Director to RES-1600, trial outcomes to RES-1700 and the safety rules outside dreamcore to RES-1800.

## The question

What should the game's world look and sound like, so that the player, a primary-school girl, enjoys it while her maths is measured? The draft assumes that a mysterious, slightly creepy layer adds to her enjoyment. That assumption is untested for this player: the draft itself adds a creepiness level, a safety net and a way to lower the level mid-session, which shows the risk is real. The draft also assumes one style fits all nine floors, and gives no way to check that she likes it before the art is made.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles: specification), sections «Мир, стиль и тон» (World, style and tone), «Визуальный стиль» (Visual style), «Дримкор и лёгкая жуть» (Dreamcore and light creepiness) and «Юмор» (Humour), on 2026-09-26, with its opening paragraph and «Текущий объём (MVP)» (Current scope, MVP) summary for context.

The draft leaves these points open:

- the canon sections it cites (1, 3, 5, 8, 11, 12 and 13) are summarised, not reproduced, in this range;
- how many skips in a row count as "several times in a row" for the safety net;
- how the art is checked against the player's taste before it is generated in volume. Closed on 2026-09-27: research decided, on the owner's instruction, that the family shows her the key art and the four heroine sheets first (the resolved finding on the style check below);
- who approves the reference pictures attached to every generation request.

## Findings

### The draft sets the world in a knitted Tower in a forest beyond the town of Misty Ford

The world is the Tower, knitted from threads of the Base («Основа», the Base), in the forest beyond the town «Туманный Брод» (Misty Ford). The heroine is a knot hunter: she rises through the System's ranks and gathers a team of familiars. The range says it is a compressed retelling of the canon file `content/canon.ru.md`.

### The draft opens the story with the Tower growing overnight and the System waking the heroine

The Tower grew in one night. The heroine finds «Дневник Смотрителя» (the Keeper's Diary), and the System writes «Пробуждение завершено. Ранг: E» (Awakening complete. Rank: E). RES-3500 later moves the rank out of the line into a rank badge beside the window. Tangles («Путаницы»), living knots that confuse counting, measure, parts and the shape of things, have spread across the floors. The heroine untangles them with trials.

- Each night the Tower re-knits itself, so every day is a new adventure.
- A correct spell returns the thread and untangles the knot cleanly; an imprecise one loosens the knot, and the Tower shows another road.
- The running mystery is who knitted the Tower. The answer and 10 checkpoints are set in canon section 8.
- The knitting has a reverse side, the Underside («Изнанка»), a soft dream layer of the Tower in dreamcore style. The heroine sometimes "slips" into it at story moments (canon section 13).

### The draft sets nine floors in a fixed order, joined differently each night

The Tower has nine floors: eight maths floors and the Observatory (science). The floors stand in a fixed order, but braid staircases join them differently each night, so the route of the day can take them in any order. In the MVP an adventure passes 3-4 floors, and over any three adventure days each domain gets its own floor. All floors are open from the first day. Word problems (domain T) are not a floor: they are the Guardian's trial.

| No. | Floor (canon) | Thread / element | Domain | Guardian |
| --- | --- | --- | --- | --- |
| 1 | «Шуршащий Архив» (the Rustling Archive) | Count / Spark («Счёт / Искра») | N - numbers | «Шкаф Аркадий» (Arkady the Cupboard) |
| 2 | «Завод Тикающих Чайников» (the Ticking Teapot Factory) | Count / Stride («Счёт / Ход») | A - arithmetic | «Бригадир Шпиндель» (Foreman Spindle) |
| 3 | «Кондитерская Облачных Долей» (the Cloud Fractions Bakery) | Part / Crumb («Доля / Крошка») | F - fractions | «Мадам Корж» (Madame Sponge) |
| 4 | «Канал Капель» (the Canal of Drops) | Part / Drop («Доля / Капля») | D - decimals | «Шлюзмейстер Кап» (Lockmaster Drip) |
| 5 | «Ярмарка Весов» (the Scales Fair) | Part / Harmony («Доля / Лад») | P - percentages and proportions | «Барон фон Наценка» (Baron von Markup) |
| 6 | «Мерные Дюны» (the Measuring Dunes) | Measure / Measure («Мера / Мера») | M - quantities | «Великий Эталон» (the Great Standard) |
| 7 | «Сад Граней» (the Garden of Facets) | Facet / Facet («Грань / Грань») | G - geometry | «Графиня Циркуль» (Countess Compass) |
| 8 | «Сортировочная Шёпотов» (the Whisper Sorting Office) | Count / Echo («Счёт / Эхо») | S - data | «Опросник» (the Questionnaire) |
| 9 | «Обсерватория» (the Observatory) | outside the threads / - | E - science | no Guardian (the Keeper's empty chair) |

### The draft has Guardians agree to let the heroine pass, never defeated

Guardians are not defeated: they agree to let the heroine pass, and each changes along its own arc during the year. A Guardian does not appear on every floor every day. The player can rename floors and her creatures. The code keeps stable identifiers (`floor.archive` and so on), and names are data.

### The draft lets the player create her heroine in Session 0

The player chooses the heroine's name, cloak colour and focus in Session 0, and her look comes from one of four character sheets the family picks before art is made (RES-3400); the draft had her choose her looks in Session 0 too. The four focuses are a knitting-needle staff («спица-посох»), a ball-of-yarn lantern («фонарь-клубок»), a notebook grimoire («блокнот-гримуар») and a crochet-hook wand («крючок-жезл»). The focus is a tool, not a weapon. Forging and the story unlock new focuses and outfits.

### The draft makes the Keeper's Diary a bestiary with optional ciphers outside measurement

The Keeper's Diary holds the bestiary of familiars and Tangles, floor maps and lore pages. Some pages are enciphered with the six canon ciphers: mirror writing, numbers for letters, shift, loop writing, "every other step" («через ступеньку») and blinking. Deciphering is a voluntary puzzle outside diagnostics: it is never scored and never logged as maths.

Ciphers: deferred until after the MVP by the draft («позже, по итогам игры», later, after seeing the player play).

### The game's style is original, soft and cute, with knitted details as the world's motif

The draft proposed a bright, cute style in the spirit of Cookie Run, with round chibi characters, a saturated "candy" palette and soft outlines. The resolution below replaces that look with the design's soft pastel patisserie anime style. The rest of this finding still holds: springy animation, soft shapes and knitted details as the world's motif. Everything is original: no one else's characters, assets, logos or recognisable silhouettes, and prompts carry only a description of the game's own style. The exact art direction, floor palettes in hex, and the style and negative prompt blocks live in canon section 12; `content/art-style.md` is their machine-readable copy.

- Animation: squash and stretch, bouncing, swaying, blinking. In the task window characters stay still.
- System windows: translucent "lollipop" panels with rounded corners and a soft "pop" («чпок») on appearing.
- Mood: creepy-cute, never frightening; the mystery tickles, it does not scare.
- Sound: calm music with no ticking sounds.
- Dreamcore layer: pastel surreal rooms and liminal places.

Reference pictures go with every generation request.

### The draft adds a rare dreamcore layer with very light child-level creepiness

Besides the main style, the world has a second, rare layer: dreamcore. Its list is empty liminal spaces, pastel surreal rooms, familiar but slightly "wrong" places, an empty playground at dusk, endless soft corridors, floating objects, light fog, humming lamps, a sky of television static and soft nostalgia. It adds very light child-level creepiness at the level of "Gravity Falls". That name is a reference for the adult developer only and never enters the canon, prompts or game text. The creepiness means creepy-cute creatures, whispers, strange music boxes, portraits whose eyes follow you and turn out friendly, and mysterious notes. The lore, 5 dreamcore locations, dreamcore variants of the floors and 8 creepy-cute Tangles live in canon sections 5 and 13; the art direction and prompt blocks live in canon section 12.

### The draft shows dreamcore in two places: the Underside and a floor's dreamcore variant

1. The Underside: the heroine slips into it at story moments the Director orders, at most once in any 7 days, for 2-3 scenes, always with a return (resolved below; this section of the draft said at most once per session, for 2-4 scenes). Full entry through the Garden's pond opens from rank B and in the spring season.
2. The dreamcore variant of a floor: by the seed of the day, with probability 1/4, one floor of the route that day shows its dreamcore variant (canon section 13). Never in an Ascent or in Session 0. The trials, their order, the budget and the task window stay the same in the dreamcore variant: only the background, music, lines and scenes change.

### Resolved: a slip into the Underside happens at most once in any 7 days and lasts 2-3 scenes

Proposed by research on 2026-09-26; the owner approves it with this record.

Three limits disagreed. The world bible (CAN-0130) allowed a slip at most once a day, for several scenes. This dreamcore section of the draft allowed one at most once per session, for 2-4 scenes. The draft's MVP section (RES-0010) allows one at most once a week, for 2-3 scenes. Two options were weighed:

- Once a day or once a session, for up to 4 scenes. This gives the mystery more room and more chances to plant clues about young Irma. But with a daily adventure it makes the eerie layer part of almost every day, and the draft calls dreamcore a "rare" layer.
- At most once in any 7 days, for 2-3 scenes. This keeps the layer rare, so it stays strange and does not wear into routine, and it keeps mild creepiness short for a player whose response to it is untested. Cantor (2004) found that fright from fiction and fantasy often lingers in children's sleep and waking life, which argues for a small, known dose while the creepiness level is being tried out.

The weekly limit wins, because the MVP section outranks the rest of the draft and RES-0010 makes the specification win where the canon disagrees on safety. A week is counted as any 7 calendar days, so an adventure that spans two days can't hold two slips. The owner can raise the limit after the stage reviews show how the player takes the layer.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. The cap stays at one slip in any 7 days, for 2 to 3 scenes, and no raise is planned. How the player takes the layer is still untested, and the reasons above for a small, known dose still hold. The stage reviews may revisit the cap.

### The draft makes the creepiness level a parent setting from 0 to 2, default 1

The parent setting is `spookiness: 0 | 1 | 2`, default 1. The Master gets the level in every order, and the line pool and art prompts are filtered by it.

| Level | Name | What is allowed |
| --- | --- | --- |
| 0 | «Уютно» (Cosy) | dreamcore only as soft pastel dreams: floating objects, fog, nostalgia; no whispers, music boxes, following portraits or creepy-cute Tangles |
| 1 | «Чуть жутковато» (A little creepy), the default | adds whispers, the strange music box, following portraits, notes, creepy-cute Tangles; tension resolves kindly in the same scene |
| 2 | «Загадочно» (Mysterious) | adds longer intrigue (resolved within the same floor), a sky of static, humming lamps, empty halls for longer; the same prohibitions |

- Allowed at any level of 1 or more: atmosphere, quiet tension that resolves kindly, soft strangeness.
- Always forbidden: jump scares and sudden loud sounds, blood and injury, death, body horror, faces that melt or distort, "stuck forever" and no way out, threats to family and loved ones, realistic dangers (fire, drowning, kidnapping, strangers), the heroine being chased, darkness with no light source, possession, people being replaced.
- Always cosy: eye exercises, rest stops, the end of the row, the heroine's room, the task window. No dreamcore or creepiness there at any level.

### Resolved: the MVP's three eerie-cute Tangles are Whisperkin, the Music Box and the Portrait Lady

Proposed by research on 2026-09-26; the owner approves it with this record.

The MVP section plans 3 of the 8 eerie-cute Tangles in CAN-0050 without naming them (RES-0010). Four of the eight are level 1 and four level 2. Three choices were weighed:

| Option | Better at | Worse at |
| --- | --- | --- |
| A mix of levels, such as two of level 1 and the Corridor Worm | the parent who picks level 2 sees something new | at the default level 1 she meets only two, and a level-2 Tangle needs the longer intrigue the MVP's weekly slip barely allows |
| Level 1, with the Empty Swing: for example Whisperkin, the Music Box and the Empty Swing | the Empty Swing carries the swing clue to young Irma (CAN-0130) | it lives in the Twilight Playground, a dreamcore place that needs its own background and scenes |
| Level 1, all on ordinary floors' dreamcore variants: «Шепотун» (Whisperkin, the Sorting Office), «Шкатулочница» (the Music Box, the Works) and «Портретница» (the Portrait Lady, the Archive) | all three appear at the default level; they are exactly the whisper, the strange music box and the watching portrait that the level table above and CAN-0130 list for level 1, so what the parent approves in the level table is what she meets; they need only the dreamcore variants of three floors, not a separate place | the swing clue waits for the Empty Swing |

The third choice wins, because every Tangle the MVP ships then appears at the level most parents keep, and the MVP's dreamcore art stays within the floors' variants. At level 0 none of them appears, as the table says. Each can also appear at the edge of the Underside during a slip, so she can meet one even in a week with no dreamcore variant of their floors. The Empty Swing comes first after the MVP, with the Twilight Playground and its clue.

### The draft keeps a safety net beside the heroine in every dreamcore scene

In a dreamcore scene a familiar and a visible exit (a door, a light, a stair home) are always beside the heroine. If the player writes «мне страшно» (I'm scared), or skips a creepy scene without finishing it several times in a row, the Master resolves the intrigue kindly at once, the familiar lights a lamp, and the scene is flagged for the parent. The level drops by one for the rest of the day. The draft gives no number for "several times in a row".

### Resolved: the Reverse One stays within the ban on doubles who want the heroine's place, and the canon gives the Master explicit rules for showing her

Proposed by research on 2026-09-26; the owner approves it with this record.

The canon's spring figure «Обратная» (the Reverse One) looks like the heroine with reversed colours, wants to swap the Tower's sides and ends as «двойник-союзница» (double and ally) (CAN-0080). The canon's dreamcore list bans, at every level, «двойники, которые хотят занять её место» (doubles who want to take her place) (CAN-0130), and this section's own list bans possession and people being replaced. CAN-0080 already says nobody is replaced. Three options were weighed:

- Name her as an exception in the ban. This is the smallest edit, but an exception inside a safety ban tells the Master the ban bends, and the Master applies it to scenes nobody foresaw.
- Redraw her so she doesn't look like the heroine. This removes the risk at its root, but it cuts the season's theme, «каждого нужно увидеть» (everyone needs to be seen): the reverse side mirrors the right side, and she mirrors the heroine.
- Keep her look, state that she stays within the ban because she never wants the heroine's place, and write down the conditions that keep her there. This keeps the theme and the ban whole.

The third option wins. A look-alike's default reading is a threat: the doppelgänger of folklore is "a supernatural double of a living person, especially one who haunts the doubled person", and meeting one was an omen of misfortune (Wikipedia, "Doppelgänger", read 2026-09-26). So the sentence "nobody is replaced" isn't enough on its own, and the Master needs the conditions spelt out. The canon now drops the word «двойник» (double) for her and calls her the heroine's counterpart and ally from the reverse side. She has her own name and life, wants nothing of the heroine's, always shows her reversed colours and back-to-front speech so the girls are never confused, never pretends to be the heroine, and never appears in the heroine's room or the town. The first meeting follows the eerie-scene pattern, with the familiar, light and the way back in sight. The Master invents no other look-alike of the heroine (CAN-0080, CAN-0130).

### The draft sets humour by five canon rules

The tone follows the five rules of canon section 1:

1. The world is absurd and serious.
2. A joke is dry and never explained.
3. Jokes target the world, the System, Tangles and Guardians, never the heroine or her answers.
4. Creepy-cute, never frightening.
5. Maths is the physics of the world; nobody jokes about it.

### Resolved: Tangle names may grow from an everyday word for what they tangle, but never from a school term or a joke about the maths

Proposed by research on 2026-09-26; the owner approves it with this record.

The world bible's rule for new Tangles (CAN-0050, rule 1, which CAN-0110 makes binding on the Master) said a name «не содержит математических терминов в виде каламбура» (contains no mathematical term as a pun). Eight of its own twenty names break it: «Нулёк» (Zerolet, from «ноль», zero), «Запятушка-Бродяга» (Comma the Wanderer, from «запятая», comma), «Мокрый Округлёныш» (Wet Roundling, from «округление», rounding), «Асимметрыш» (Asymmetrix), «Кривоуголка» (Crookangle, from «угол», angle), «Недоделитель» (the Underdivider), «Скидкожор» (Discount-Muncher, from «скидка», discount) and «Столбикус» (Columnus, from «столбик», a chart column). Two options were weighed:

- Keep the rule and rename the eight. The rule then reads plainly, but the names already carry Diary pages (CAN-0090) and tone samples in this record, and the same rule asks that a name "hints at what it does". For a creature that tangles zero or the comma, the plainest hint is the word itself. The familiars follow the same pattern: «Запятый» (Commy), «Гирька» (Little Weight), «Минутка» (Little Minute).
- Keep the names and narrow the rule to what it protects. Humour rule 5 says nobody jokes about the maths, and the vocabulary probe in Session 0 (RES-0100) exists because school terms such as «знаменатель» (denominator) and «делимое» (dividend) can be unknown to her. A name built on such a term reads as a lesson, and a name that mocks a concept breaks rule 5. A nickname built on an everyday word does neither.

The second option wins, because it keeps the rule's purpose and the canon's names, and renaming would touch the Diary and the samples for no gain. Rule 1 now allows a diminutive or compound of an everyday word for the thing the Tangle tangles and forbids names resting on a school term or joking about the maths. All eight names pass: «ноль», «запятая», «угол», «скидка» and «столбик» are everyday words, «Округлёныш» and «Асимметрыш» read as a round and a lopsided creature, and «Недоделитель» reads first as «недоделать» (to leave unfinished). The Master applies the same test to every name it invents.

### The draft keeps jokes out of task statements

A joke comes before the task or after the answer, never in the statement, because otherwise nobody can tell whether the player erred in the maths or in reading.

### The draft lets only the code put numbers on screen

The Master's text and the pool lines carry no digits and no numerals. The code fills the System's counters into separate window fields: experience, level, characteristic points, quest progress, row numbers («Ряд 1…», Row 1) and «Дней в Башне» (Days in the Tower). Those fields skip the numeral check; the digits in canon samples («Ряд 1», «Доступно очков характеристик: 3», Characteristic points available: 3) mean exactly such fields. Names are the exception: names from the canon and the entity list («Поварята Пополам» (the Half-and-Half Cooks), «Дюжин» (Dozen), «Кошка Первой Петли» (the Cat of the First Loop)) and names the player gives are cut out by an allow list before the numeral check.

### The draft defines a numeral by one list shared by the Master, the pool and the frames

The list lives in `content/numerals.ru.json`. It counts as a numeral:

- any digit;
- cardinal numerals from «два» (two) upwards, in every case;
- collective numerals («двое», «оба», «трое» and so on);
- ordinals from «второй» (second) upwards;
- fraction and counting words: «половина», «пол-», «полтора», «треть», «четверть», «пара», «дюжина», «десяток», «сотня», «тысяча», «миллион» (half, half-, one and a half, third, quarter, pair, dozen, ten, hundred, thousand, million);
- multiplicative adverbs («дважды», «вдвое», «втрое» and so on).

«один / одна / одно» (one), «первый» (first) and «последний» (last) are allowed in the Master's text and the pool, because Russian speech needs them and they carry no maths. Word-problem frames forbid them too, except inside placeholders. The check works on word forms through stemming, with a test for each item.

### The draft draws System and familiar lines from an approved pool, rotated without repeats

The pool is `content/lines.ru.json`. Its categories include morning, rest stop, eyes, level, battle, name, clean untangling, critical, partial, clean row, other path, "I don't know", hint, knot scheme, explanation, second attempt, «нить закреплена» (thread secured), floor result, returned secret and dreamcore. Each line carries a minimum and maximum creepiness level.

- Start: the System voice and familiar lines from the canon plus hand-written lines, at least 150 by stage 0.3.
- Growth: an LLM expands the pool from samples, and only lines the parent approves enter the game; about 400 by stage 0.4.
- Rotation: a line never repeats within a session, and within a category lines show in a shuffled cycle, so a line repeats only after the whole category has shown.
- Battle lines, about 70 spells a day, are assembled from parts: the familiar's move x the Tangle's reaction to the outcome («чисто», «частично», «ослаблен»: clean, partial, loosened) x a floor detail. Each part is an approved line.

### The draft keeps shame words and blame out of "loosened" and "other path" lines

Lines for «ослаблен» (loosened) and «другой путь» (other path) never contain a word from the shame stop list and never hint at the heroine's fault: the world changes, not a verdict on her. The draft applied the list to these lines only; RES-3300 widens it to every text the heroine sees, as the owner's design does, and joins the other records' words into it. The stop list is `content/shaming.ru.json`: «неправильно», «ошибка», «ошиблась», «промах», «мимо», «провал», «жаль», «не получилось», «не смогла», «плохо», «неудача» (wrong, error, made a mistake, miss, off the mark, failure, pity, didn't work, couldn't, bad, bad luck) and their forms.

### The draft holds the Master's tone with few-shot samples and parent-flagged counter-examples

The Master keeps the tone through few-shot samples from the canon. The parent can flag any scene as a failure, and it becomes a "how not to" example.

### The draft gives these canon samples of the tone

- SYSTEM: «Вы подобрали ложку. Ложка не является оружием.» Pause. «Статус пересмотрен.» (You picked up a spoon. A spoon is not a weapon. Status revised.)
- SYSTEM: «Ежедневное задание. Ряд 1: распутать узлы. Ряд 2: найти потайной люк. Ряд 3: не упасть с лестницы. Награда за ряд 3: вы не упали с лестницы.» (Daily quest. Row 1: untangle the knots. Row 2: find the secret hatch. Row 3: don't fall down the stairs. Reward for row 3: you didn't fall down the stairs.)
- «Путаница увернулась. По её лицу видно, что она сама не поняла как.» (The Tangle dodged. Her face shows she doesn't know how either.) Only as a scripted line between spells, never as a reaction to an answer.
- SYSTEM: «Узел ослаблен. Башня открыла боковую тропу. Тропа утверждает, что всегда тут была.» (The knot is loosened. The Tower opened a side path. The path claims it was always here.) For the other path.
- SYSTEM: «Чистый ряд. Петли легли одна к одной. Звёздная пряжа собирается сама. Она любит порядок.» (Clean row. The loops lay one by one. The star yarn gathers itself. It likes order.) For a streak.
- «Запятый» (Commy): «Я всего лишь маленькая запятая. Но если меня сдвинуть, мир изменится очень сильно. Не двигай меня.» (I'm only a little comma. But move me and the world changes a lot. Don't move me.)
- Diary: «Существо: Недоделитель. Делит всё на части, но никогда не до конца. Из-за него в Башне нет ни одного целого пирога. Не кормить. Покормила. Зря.» (Creature: the Underdivider. Divides everything into parts, never completely. Because of it the Tower has not one whole pie. Do not feed. Fed it. Shouldn't have.)
- Item: «Носок левый. Правый ушёл искать себя и не вернулся. Защита не повышена. Загадочность повышена.» (Left sock. The right one went to find itself and never came back. Defence not raised. Mystery raised.)
- Baron von Markup offers a bargain on a thing that isn't his: the sky, the heroine's boots, last Tuesday.

### Resolved: the owner's pastel patisserie anime style with a catgirl heroine holds, and no prompt or game text names Nekopara or Cookie Run

Proposed by research on 2026-09-26; the owner approves it with this record.

This record proposed a style in the spirit of Cookie Run, CAN-0120's negative block bans "cookie character, gingerbread man", and the owner's newer design file `design-system/README.md` asks for «как в Некопаре» (like in Nekopara), a pastel patisserie with catgirls, at the player's request. RES-3400 compares four options: doing nothing, the candy chibi style, the design's pastel anime style and a mix. The candy chibi style is better at small, readable silhouettes and is already written out in the canon. The design's style wins, because the player asked for it, and the owner built every later design file on it: tokens, components, 45 screen sheets and the prototype. Its risk, a reference series that the Wikipedia article "Nekopara" (read 2026-09-26) describes as "eroge visual novels" with adult and all-ages versions, has a written guard: child proportions, covered clothes and a negative block against maid uniforms and mature content. Familiars, Tangles and Guardians stay round and plush, which keeps what the chibi style did well. Cookie Run's own risk is low: the App Store page of "CookieRun: Kingdom" (read 2026-09-26) rates it 13+. Both names stay with the adult developer, as "Gravity Falls" does, and never enter the canon's prompts or the game's text; RES-3400 holds the resolved style and negative blocks.

The owner decided on 2026-09-27: removing "Nekopara characters" from the negative block is approved, so the negative block RES-3400 resolves is approved by the owner.

### Resolved: the style check is a step before any art is generated in volume: the family shows the player the key art and the four heroine sheets, and her choice is recorded

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record.

The draft gave no way to check the style against the player's taste before the art is made, and this record held it as an open point. Two options were weighed. An open question left for later costs nothing now, but the offline queue (RES-2800) could then generate most of the about 40 MVP assets before she has seen the style, and a late "no" throws them away. A fixed step before volume generation costs one short family session. It catches a mismatch while only the key art and four sheets exist, and it turns the design's «выбираем вместе» (we choose together) into a recorded choice. The step wins.

Before any art is generated in volume, the family shows the player the key-art pictures and the four heroine sheets (RES-3400), and the parent records which sheet she chose and whether the style suits her. The step is a prerequisite of stage 0.3 (RES-3000). If she rejects the style, the art waits until the family and the owner settle a new one.

### Resolved: the shame stop list becomes one forbidden list for every text the heroine sees

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft applied the stop list to «ослаблен» and «другой путь» lines; the owner's design bans the same words and more in any text the heroine sees. RES-3300 compares keeping each record's list in its place, one list for the places at risk, and one list everywhere, and holds the reason for one list everywhere: one check can't drift, and a shame word can reach her through any label or page. The list in `content/shaming.ru.json` gains «неверно», «ты не поняла», «это же просто», the school words «задача», «пример», «урок», «школа», «оценка», and praise of intelligence, matched in every form by lemma. Her own words shown back as she wrote them and the Parent Room stay outside it.

### Resolved: the creepiness levels keep the names «Уютно», «Чуть жутковато» and «Загадочно»

Proposed by research on 2026-09-26; the owner approves it with this record.

The owner's prototype labels level 1 «Слегка» (Slightly) in the parent's settings. RES-3500 compares the two names and holds the reason: «Чуть жутковато» says what the level adds, and the canon, the Master's order and the settings then use one name. The prototype's heading «Уровень жуткости» (creepiness level) stays above the three choices.

## Conclusions

1. The game must present every trial as a spell that untangles or loosens a knot, so that a wrong answer changes the road and never ends the story.
2. The game must keep floor, creature and focus names as data behind stable identifiers, so the player can rename them.
3. Guardians must agree to let the heroine pass and must never be shown as defeated.
4. Cipher puzzles in the Keeper's Diary must never be scored or logged as maths.
5. All art and prompts must be original and must never reuse another work's characters, assets, logos or recognisable silhouettes, or name that work.
6. Characters in the task window must stay still, and the game's music must contain no ticking sounds.
7. The game must offer the parent a creepiness level of 0, 1 or 2, default 1, and must pass it to the Master in every order and filter the line pool and art prompts by it.
8. The game must never show any content on the "always forbidden" list, at any creepiness level.
9. Eye exercises, rest stops, the end of the row, the heroine's room and the task window must carry no dreamcore or creepiness at any level.
10. A slip into the Underside must happen at most once in any 7 days, last 2-3 scenes and always return the heroine.
11. A floor's dreamcore variant must change only the background, music, lines and scenes, never the trials, their order, the budget or the task window, and must never appear in an Ascent or Session 0.
12. Every dreamcore scene must show a familiar and a visible exit beside the heroine.
13. When the player writes that she is scared, or skips creepy scenes repeatedly, the game must resolve the intrigue kindly at once, flag the scene for the parent and lower the level by one for the day.
14. Task statements must carry no jokes.
15. The Master's text and pool lines must carry no digits or numerals by the shared numeral list, and only code-filled fields may show numbers.
16. Pool lines must be approved by the parent before they enter the game, and must not repeat within a session or before their category has cycled.
17. No text the heroine sees may contain a word from the forbidden list RES-3300 sets, in any form, and "loosened" and "other path" lines must not hint at the heroine's fault. The draft record applied the list to those two kinds of line only.
18. The parent must be able to flag any Master scene as a failure, and the flagged scene must become a counter-example for the Master.
19. A Tangle's name, from the canon or invented by the Master, may grow from an everyday word for what it tangles, and must never rest on a school term or joke about the maths.
20. The Reverse One must never want the heroine's place, name, home, family, room, familiars or friends, must always be shown in her reversed colours and back-to-front speech, must never pretend to be the heroine, and must be the only look-alike of the heroine in the story.
21. The game's art must follow the owner's soft pastel patisserie anime style with a catgirl heroine, as RES-3400 sets it, and no prompt, canon text or game text may name Nekopara or Cookie Run.
22. The MVP's eerie-cute Tangles must be «Шепотун», «Шкатулочница» and «Портретница», all of creepiness level 1, and none of them may appear at level 0.
23. The parent's creepiness choices must be named «Уютно», «Чуть жутковато» and «Загадочно», the same names the canon and the Master's order use.
24. One automatic check must run the forbidden list over every line the heroine sees, matching every form of each word by lemma.
25. Before any art is generated in volume, the family must show the player the key-art pictures and the four heroine sheets and record her choice, as a prerequisite of stage 0.3, as research decided on 2026-09-27 on the owner's instruction.
26. The Underside cap must stay at one slip in any 7 days, for 2 to 3 scenes, with no raise planned, as research decided on 2026-09-27 on the owner's instruction; the stage reviews may revisit it.

## Sources

- The owner's draft «Хроники Башни — спецификация», sections «Мир, стиль и тон», «Визуальный стиль», «Дримкор и лёгкая жуть» and «Юмор», with the opening and «Текущий объём (MVP)» for context, read 2026-09-26; not kept in the repository - every finding above.
- J. Cantor, "'I'll never have a clown in my house' - why movie horror lives on", Poetics Today 25 (2004), https://read.dukeupress.edu/poetics-today/article/25/2/283/20819/, read 2026-09-26 - fright from fiction and fantasy often lingers in children's sleep and waking life.
- Wikipedia, "Doppelgänger", https://en.wikipedia.org/wiki/Doppelg%C3%A4nger, read 2026-09-26 - that the traditional doppelgänger is a double who haunts the person it copies and an omen of misfortune, so a look-alike reads as a threat unless the story says otherwise.
- The owner's design file «design-system/README.md», read 2026-09-26; not kept in the repository - the Nekopara-like pastel style the player asked for.
- Wikipedia, "Nekopara", https://en.wikipedia.org/wiki/Nekopara, read 2026-09-26 - the series' genre and its adult and all-ages versions.
- Apple App Store, "CookieRun: Kingdom", https://apps.apple.com/us/app/cookierun-kingdom/id1509450845, read 2026-09-26 - the 13+ age rating.
