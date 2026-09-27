---
id: RES-3300
artifact: research
status: draft
revised: 2026-09-27
---

# The owner's design proposes a dry, formal System voice, interface labels in the world's words and a list of words the heroine never sees

## Summary

The owner's design sets the game's voice in one guideline file. The world is absurd and takes itself completely seriously, and its jokes are dry and never explained. The System speaks briefly, formally and in the present tense, lists things like a knitting pattern and marks events, never the heroine's mind. Every interface label uses the world's words: a review is «Схема узла» (the knot scheme), an answer is «Твоё заклинание» (your spell), and outcomes are named as events in the world. A list of forbidden words covers every text the heroine sees, and the Parent Room speaks in a calm, business-like way without labels. The design calls the familiars «узелки» (little knots), where the canon called them «фамильяры»; research settles on «узелок» and joins the four older forbidden lists into the design's one list. This record covers the voice guideline only. The design system's tokens and components are in RES-3100 and RES-3200, the art in RES-3400 and the screens in RES-3500.

## The question

How should the game's text sound, so that the player reads a lot and never feels graded? The design assumes that renaming every school word into a world word is enough to keep the maths from feeling like a test. That fails when the player sees the same structure she knows from school, a statement, a field and a verdict, whatever the labels say. The design answers part of that by keeping jokes out of the task window and by naming no verdict at all, but it leaves the structure to the screens.

## Method

Read the owner's design file `design-system/guidelines/10-voice.md`, all sections («Система» (the System), «Подписи интерфейса» (interface labels), «Запрещённые слова» (forbidden words) and «Комната родителя» (the Parent Room)), on 2026-09-26. Compared it with RES-1500, RES-0600, CAN-0030, CAN-0060 and CAN-0110 by searching the record for the forbidden words and the word for a familiar.

The design leaves these points open:

- which word forms of the forbidden words count, and whether the check stems them as RES-1500 proposes for the shame stop list (resolved below: every form, matched by lemma);
- whether the forbidden list binds the player's own words echoed back in the story log (resolved below: it doesn't);
- which Russian word names a familiar in player-facing text, «узелок» or «фамильяр» (resolved below: «узелок»);
- the tone of the System in the Underside, which the file doesn't treat separately.

## Findings

### The design makes the world absurd and serious, with dry, unexplained jokes that never target the heroine

«Мир абсурден и относится к себе совершенно серьёзно. Шутка сухая и не объясняется.» (The world is absurd and takes itself completely seriously. The joke is dry and isn't explained.) Jokes target the world, the System, the Tangles and the Guardians, never the heroine.

### The design has the System speak briefly, formally and in the present tense

- It speaks briefly, formally, in the present tense, with no exclamation marks.
- Sometimes it corrects itself after a pause. The correction is a separate line, marked `{pause: true}` in the `SystemWindow` component.
- It lists things like a knitting pattern: «Ряд 1… Ряд 2…» (Row 1… Row 2…). The code fills numbers and counters into the window's fields.
- It marks events, not intelligence: «Нить возвращена на место» (The thread is back in place), «Тропа открылась» (The path has opened). Never «умница» (clever girl) or «гений» (genius).

### The design gives three System samples

> «Вы подобрали ложку. Ложка не является оружием.» / «Статус пересмотрен.» (You picked up a spoon. A spoon is not a weapon. / Status revised.)

> «Узел ослаблен. Башня открыла боковую тропу. Тропа утверждает, что всегда тут была.» (The knot is loosened. The Tower opened a side path. The path claims it was always here.)

> «Рекомендуется привал. Узелок разжёг костёр из искр. Костёр ненастоящий. Тепло настоящее.» (A rest stop is recommended. The little knot lit a fire from sparks. The fire isn't real. The warmth is.)

### The design names every interface label in the world's words

| Place | Write | Don't write |
| --- | --- | --- |
| Review after an answer | «Схема узла» (the knot scheme), «Как легла нить» (how the thread lay) | «Правильный ответ» (the correct answer), «Решение» (the solution) |
| The heroine's answer | «Твоё заклинание» (your spell) | «Твой ответ» (your answer), «Ошибка» (error) |
| Task buttons | «Готово» (Done), «Не знаю» (I don't know), «Путеводная нить» (guiding thread) | «Проверить» (Check), «Подсказка» (Hint), «Сдаться» (Give up) |
| Outcomes | «Распутан начисто» (untangled cleanly), «Почти чисто» (nearly clean), «Узел ослаблен» (the knot is loosened), «Принято» (accepted) | «Верно» (correct), «Неверно» (incorrect), «Мимо» (missed) |
| Leaving | «Привал» (rest stop), «Сохранить и уйти» (Save and leave), «Ещё один ряд» (One more row) | «Выйти» (Exit), «Пауза» (Pause), «Осталось N минут» (N minutes left) |
| Day counter | «Дней в Башне: 23» (Days in the Tower: 23) | «Серия» (Streak), «Дней подряд» (Days in a row) |

### The design forbids a list of words in every text the heroine sees

The list, for any text the heroine sees:

- verdict and shame words: «неправильно», «ошибка», «ошиблась», «промах», «мимо», «провал», «жаль», «не получилось», «не смогла», «плохо», «неудача» (wrong, error, made a mistake, miss, off the mark, failure, pity, didn't work, couldn't, bad, bad luck);
- school words: «задача», «пример», «урок», «школа», «оценка» (problem, sum, lesson, school, grade);
- praise of intelligence: «умница», «гений» (clever girl, genius);
- phrases of guilt and attachment, such as «я скучал, почему ты не приходила» (I missed you, why didn't you come).

### The design's forbidden list is wider than the shame stop list in RES-1500

RES-1500 applies its shame stop list to one place: «Lines for «ослаблен» (loosened) and «другой путь» (other path) never contain a word from the shame stop list». The design applies the same eleven words «в любом тексте, который видит героиня» (in any text the heroine sees). RES-0600 bans «задача», «пример» and «урок» in detailed explanations only, and leaves out «школа» and «оценка». CAN-0060 bans «задача», «пример», «урок» and «школа» for familiar explanations, without «оценка». The design's rule covers every place these records cover, so it adds scope and contradicts none of their words.

### The design calls familiars «узелки», where the canon and the research call them «фамильяры»

The design's sample says «Узелок разжёг костёр из искр» (The little knot lit a fire from sparks). CAN-0030 gives the eye-break line as «Фамильяр смотрит в окно Башни на самое дальнее дерево леса» (The familiar looks out of a Tower window at the farthest tree in the forest), and RES-2000 gives the daily quest «Поговори с фамильяром у костра» (Talk to a familiar at the campfire). RES-3500 records the prototype giving the same two lines with «Узелок» and «с узелком». This record uses "familiar" as the English term for both Russian words. The resolved finding below settles the Russian word as «узелок».

### The design keeps the Parent Room's language calm, business-like and free of labels

The Parent Room writes «пока не освоено» (not mastered yet), «понимает, нужна скорость» (understands, needs speed), «прочно» (solid). It never writes «плохо» (bad), «отстаёт» (falls behind) or «невнимательная» (careless). The VWO readiness block always carries the note: «Ориентировочный домашний инструмент. Не официальный совет школы и не стандартизированный тест.» (An approximate home tool. Not official school advice and not a standardised test.)

### Resolved: the thread button keeps its label «Путеводная нить» with a code-filled count, and no text ever tells her she has run out of threads

Proposed by research on 2026-09-26; the owner approves it with this record.

The design's task-button label is «Путеводная нить» (guiding thread), and `TaskWindow/README.md` says «нитей всегда хватает» (there are always enough threads). RES-0500 compares the options for the thread supply and holds the reason: the pocket yields one thread when she presses the button with an empty stock, once in each room, and after that the button stays visible and inactive at zero. For the voice this means one rule. The button always reads «Путеводная нить · N», with N filled by code, and no line in the task window, the System or the familiar names a shortage, because a warning about running out would be the rationing message the design's sentence exists to avoid. The Session 0 talk's promise that she gets plenty of threads (RES-0100) stays true, because earnings of about 10 a day and the pocket keep her at zero rarely.

### Resolved: every text the heroine sees calls a familiar «узелок» (plural «узелки»), and «фамильяр» stays only as the English project term "familiar"

Proposed by research on 2026-09-26; the owner approves it with this record.

The design writes «узелок» (little knot) on every screen, in the voice guideline and in the art guideline, and `FamiliarCard/README.md` says the component keeps its English name «по историческим причинам; в игре эти существа — узелки» (for historical reasons; in the game these creatures are little knots). The canon (CAN-0030, CAN-0040, CAN-0060) and RES-2000 write «фамильяр». Three options were weighed.

- «фамильяр» everywhere. It is better at precision: it never looks like «узел» (knot), the word for a trial. But it's a borrowed word, and the Russian Wikipedia article «Фамильяр» (read 2026-09-26) defines it as a spirit that serves a witch, «данный им дьяволом» (given to them by the devil), often «демоном низкого ранга» (a low-ranking demon). That pulls against a cosy world for a primary-school girl, and it's a school-register word the design replaced on purpose.
- «узелок» everywhere. It is better at the world's own logic: a familiar is born from a knot untangled with kindness (CAN-0060), so it is a little knot, and the word belongs to the knitting vocabulary the design uses for every label. It is the owner's most recent choice and runs through all 33 prototype screens. Against it: «узелок» sits close to «узел», so a line could blur the creature and the trial.
- Both, with «фамильяр» as the kind and «узелок» as a nickname. It is better at nothing the other two don't cover, and it breaks the rule of one term for one thing.

«узелок» wins, because the owner's design already made the change on purpose and because the word ties the creature to how it is born. The risk of confusion has two guards. No text calls a knot «узелок»: a small knot is «узел» or «петелька» (little loop). And a familiar in a line usually carries its name, so the bare word is rare. The canon's ally «Узелок» (Little Knot) in CAN-0080 would now read as any familiar, so research proposed renaming him «Бантик» (Little Bow), since he unravels into a ribbon. The owner decided on 2026-09-27: the ally keeps the name «Бантик», which closes the question of his name; CAN-0080 carries it. English project text keeps "familiar", and the code keeps names such as `FamiliarCard`. The draft's word «фамильяр» stays only in quotations of the draft.

### Resolved: one forbidden list binds every text the heroine sees, in every word form, and leaves out only her own words and the Parent Room

Proposed by research on 2026-09-26; the owner approves it with this record.

Four records ban overlapping words in different places. RES-1500 applies its shame stop list to «ослаблен» (loosened) and «другой путь» (other path) lines only. RES-0600 bans «задача», «пример» and «урок» in detailed explanations. CAN-0060 bans its own list in familiar explanations, CAN-0030 another in System lines and CAN-0110 a third in the Master's text. The design bans one list «в любом тексте, который видит героиня» (in any text the heroine sees). Three options were weighed.

- Keep each list in its place. It is better at freedom of wording: a narrator may still write «прошла мимо» (walked past) or «плохо видно» (hard to see). But the lists drift apart, and a shame word can still reach her through a label, a Diary page or an item description that no list covers.
- One list for the places at risk: outcomes, explanations and the familiar's lines. It is smaller to check. But it still needs someone to decide, for each new kind of text, whether it's "at risk".
- One list for every text she sees, as the design says. It is better at safety and at one rule the tests can check: a single automatic check on every line, from the Master, the line pool, the Explainer, templates and the interface. It costs some neutral uses of «мимо», «жаль» and «плохо», which writers rephrase, for example «стороной» (to one side) for «мимо».

The third option wins, because it's the owner's most recent rule and because one list checked everywhere can't drift. It also serves the design's ban on praise of intelligence: Mueller and Dweck (1998) found that fifth graders praised for intelligence showed less persistence, less enjoyment and worse performance after failure than children praised for effort. The list joins every word the four records named:

1. Verdict and shame words: «неправильно», «неверно», «ошибка», «ошиблась», «промах», «мимо», «провал», «жаль», «не получилось», «не смогла», «плохо», «неудача», and the phrases «ты не поняла» (you didn't understand) and «это же просто» (it's easy). «неверно» (incorrect) comes from the design's screens rule (RES-3500); «верно» stays allowed, because the Awakening's rules say «Верное заклинание открывает секреты» (A true spell opens secrets).
2. School words: «задача», «пример», «урок», «школа», «оценка».
3. Praise of intelligence: «умница», «гений», «ты умная» (you're clever), «ты самая умная» (you're the cleverest).
4. Phrases of guilt or attachment, such as «я скучал, почему ты не приходила» (I missed you, why didn't you come) and «Ты нас подвела» (You let us down).

The check matches groups 1 to 3 in every inflected form, by lemma, so «ошибкой» and «задачку» count. Group 4 has no fixed wording, so the safety check and the parent's review of pool lines catch it. The list binds the System, the Master's narration and characters, familiar lines and explanations, task statements, hints, knot schemes, interface labels, Diary pages and item descriptions. It doesn't bind the heroine's own words shown back in the story log as she wrote them, because editing them would rewrite her part of the story; the Master still never repeats such a word back at her about herself. It doesn't bind the Parent Room, including its PIN screen, which speaks to the parent and keeps its own rule against labels. The list lives in one file, `content/shaming.ru.json` (RES-1500), and CAN-0010 holds it for the canon.

## Conclusions

1. The game must keep the System's lines short, formal and in the present tense, with no exclamation marks.
2. A System self-correction must show as a separate line after a pause.
3. The System's lines must mark events in the world and must never praise the heroine's intelligence.
4. Every number in a System window must come from a code-filled field, never from the line's text.
5. The game must use the world's labels from the design's table for reviews, answers, task buttons, outcomes, leaving and the day counter, and must never show the labels the table rejects.
6. No text the heroine sees may contain a word from the forbidden list in the resolved finding above, in any form matched by lemma, including the school words and praise of intelligence; only her own words shown back as she wrote them and the Parent Room are outside it.
7. No text the heroine sees may contain a phrase of guilt or attachment.
8. Jokes must target the world, the System, the Tangles and the Guardians, never the heroine.
9. The Parent Room must describe the player's state without judgemental labels.
10. The VWO readiness block must always show the disclaimer that it is an approximate home tool.
11. Every text the heroine sees must call a familiar «узелок» (plural «узелки») and never «фамильяр», and no text may call a knot «узелок». The draft record asked only that one word be settled.
12. The thread button must read «Путеводная нить · N» with a code-filled count, and no text the heroine sees may tell her she has run out of threads.
13. One automatic check must run the forbidden list over every line from the Master, the line pool, the Explainer, task templates and the interface before she sees it, and the list must live in one file.
14. The canon's ally once called «Узелок» must be named «Бантик» (Little Bow) after autumn, as the owner decided on 2026-09-27.

## Sources

- The owner's design file «design-system/guidelines/10-voice.md», read 2026-09-26; not kept in the repository - every finding above.
- The owner's design file «design-system/components/FamiliarCard/README.md», read 2026-09-26; not kept in the repository - that the creatures are «узелки» in the game.
- Wikipedia (Russian), «Фамильяр», https://ru.wikipedia.org/wiki/Фамильяр, read 2026-09-26 - that the word names a witch's helper spirit, given by the devil or a low-ranking demon.
- C. M. Mueller and C. S. Dweck, "Praise for intelligence can undermine children's motivation and performance", Journal of Personality and Social Psychology 75(1), 33-52 (1998), https://psycnet.apa.org/doiLanding?doi=10.1037%2F0022-3514.75.1.33, abstract read 2026-09-26 - that praise for intelligence lowered fifth graders' persistence, enjoyment and performance after failure.
