---
id: RES-2000
artifact: research
status: draft
revised: 2026-09-27
---

# The draft proposes growth that comes from play and effort, and never shrinks

## Summary

The draft proposes that the player always feels the heroine growing: frequent levels, daily quests and a next goal always on screen. Experience comes from effort, so an unassisted first attempt earns the same 5 points whether it is right, wrong or «Не знаю» ("I don't know"). A level curve makes levels arrive several times an adventure at first and about once an adventure from level 23. The rank rises on a story calendar and never falls, but the MVP (minimum viable product) freezes it at rank E. Three daily quests are met by playing, not by answering correctly, and a missed quest vanishes without a penalty. The game counts total days in the Tower and keeps no streak. Stats and paths are deferred until after the MVP. This record covers experience, levels, stats, paths, rank, daily quests, the day counter and the next goal; rewards and the economy are in RES-2100 and familiars in RES-1900.

## The question

How does the draft propose to give the player a steady sense of growth without tying growth to correct answers? The draft assumes that rewarding effort alone keeps growth honest, because guessing earns no more than an honest answer. That holds only while effort is measured by attempts; if the player learns that fast, careless attempts fill the experience bar as well as careful ones, the flat rate could reward speed, and the draft's guards against quick guessing sit in another section.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles: specification), sections «Текущий объём (MVP)» (Current scope (MVP)) and «Прогрессия и ощущение роста» (Progression and the feeling of growth), on 2026-09-26. The draft is a draft, so every finding below is what the draft proposes, not what was decided. I checked the draft's arithmetic by hand and mark those results as my calculation.

The draft leaves these open:

- Whether `min(150 + 20 · (L − 1), 600)` is the experience to reach level L or to leave it.
- How the per-adventure estimate of 500 to 650 changes for a 60-minute adventure, since the draft does not say which length its estimate of 30 first attempts assumes.
- What a level-up gives in the MVP, where stats don't exist but the level-up grants 3 stat points. Closed on 2026-09-27: research decided, on the owner's instruction, that the MVP level-up is the ceremony alone with no grant (the resolved finding on stats below).
- What the day counter counts: calendar days with any play, or completed adventures.
- Which story milestones trigger the rank ceremony once Ascents, which the ceremony timing mentions, are deferred. RES-1600 now sets the MVP reading: no rank ceremony in the MVP, and one catch-up ceremony when ranks ship.

## Findings

### Growth comes from play and effort, and accuracy only adds collection bonuses

Main growth (experience, levels, rank) comes from play and effort. Accuracy adds collection bonuses: shards, star yarn, "sparkling" rewards and secrets. Nothing is taken away for a mistake.

### A first attempt earns the same experience whether it is right, wrong or «Не знаю»

| Event | Experience |
| --- | --- |
| Unassisted first attempt, right, wrong or «Не знаю» | 5 |
| Second attempt | 3 |
| Scene | 10 |
| Floor, in any floor state | 20 |
| Daily quest | 50 |
| Completed adventure | 60 |

The 5 points for a first attempt are the base experience for effort. So «Не знаю» never loses progress, and guessing earns no more experience than an honest answer.

### The draft estimates 500 to 650 experience an adventure

The draft's estimate: about 30 first attempts × 5 + 7 second attempts × 3 + 8 scenes × 10 + 3 floors × 20 + 3 quests × 50 + 60. By my calculation that sum is 521, inside the 500 to 650 range.

### The draft's adventure length differs from the owner's decision

The draft's opening gives the adventure as about 30 to 45 minutes, and its MVP section as about 60 minutes. The owner has since set the target at one hour, 60 minutes of active time. The draft's estimate of 30 first attempts doesn't say which length it assumes. The owner decided on 2026-09-26 that the session budget and its counts need no recomputing for one hour, so the estimate stands.

### Level L needs min(150 + 20 · (L − 1), 600) experience

At first a level comes several times an adventure. From level 23, about three weeks in, a level comes about once an adventure, and the curve doesn't slow further. By my calculation level 23 needs 590 and level 24 onward needs 600, the cap. By my calculation levels 1 to 22 together need 7,920 experience, which is about 12 to 16 adventures at 500 to 650 each; the draft's "about three weeks" fits that only if the player skips some days.

### A level-up is a short ceremony with light and sound

A level-up is a short ceremony with light and sound and gives +3 stat points, which the player distributes herself. In the MVP the ceremony gives no stat points (see the resolved finding below).

### Stats and paths shape the story, never the tasks

The hunter's sheet in the System window shows level, rank, stats «Сила» (Strength), «Ловкость» (Agility), «Мудрость» (Wisdom), «Обаяние» (Charm) and «Удача» (Luck), path and titles. Stats affect the story, not the tasks: the Master receives them only as low, medium or high relative to each other. At rank C the player chooses one of five paths from the canon, section 7: «Светоплётка» (Light-weaver), «Следопытка» (Tracker), «Заводчица» (Wind-up Maker), «Мастерица» (Craftswoman) or «Хранительница» (Keeper). Later she can learn a second. The path decides animations, sounds, outfits and story options. Deferred until after the MVP by the draft. In the MVP the hunter's sheet shows level, rank E, familiars and titles.

### Resolved: stats and rank changes are not rewards in the MVP, and the MVP level-up is the ceremony without stat points

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft said both: the level-up gives +3 stat points, the section opening promises «видимые характеристики» ("visible stats"), principle 12 names stats as growth (RES-0010), and the rewards section lists ranks among the main rewards (RES-2100). The same section defers stats «Позже, по итогам игры (не в MVP)» ("Later, depending on how the player plays (not in the MVP)"), and the MVP keeps rank E. Three options were weighed:

- Stats and calendar ranks both in the MVP. This keeps principle 12 and the rewards list as written. But stats need a screen to spend points, the `heroStats` field in every scene order (RES-1600) and story effects to tune. Ranks give nothing during MVP acceptance: the first change falls at the end of November, about ten weeks after a September start, and acceptance is two weeks of daily play (RES-3000). The rank table also opens paths and the Underside, which are deferred or need spring content.
- Ranks alone in the MVP, since a rank is a date and a ceremony. This is cheap, but for the reason above no player would see a change during acceptance, and the openings of ranks C and B still wait for deferred parts.
- Both deferred, as the draft's rule that the MVP section wins says. This costs principle 12 one of its four named kinds of growth. But the other three still show growth often: by my calculation from the level curve, a player with about 520 experience in her first adventure climbs from level 1 to level 4 in it, and the draft gives a level about every adventure from level 23, and familiars, quests and the next goal fill the gaps.

The third option wins, because the first two add build and tuning work that the player couldn't see during acceptance. I chose one default the draft doesn't give: in the MVP a level-up is the ceremony of light and sound alone, with no stat points and no grant in their place, so the economy in RES-2100 stays as tuned. The draft of this finding left to the owner whether a level-up should carry a small grant, such as buttons or a guiding thread. In the MVP the scene order sends no `heroStats`. The MVP campaign's handling of season finales and rank openings is in RES-1600.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. A level-up in the MVP carries no grant: the ceremony alone. The economy in RES-2100 is balanced without one, and growth already shows through experience, familiars and quests, so a grant would add a currency flow to tune and no growth she can't already see.

### The rank rises on the story calendar, never falls and ignores answers

The hunter's rank goes E → D → C → B → A → S. It is a story rank: it never falls and doesn't depend on answers, so the player never stalls. It rises on the campaign calendar at the canon's story milestones. Outcomes affect only the "triumph" variants of chapter finales, which carry special titles.

| Rank | Title | When |
| --- | --- | --- |
| E | «Пробуждённая» (the Awakened) | Session 0 |
| D | «Петелька» (Little Loop) | end of autumn (November) |
| C | «Кружевница» (Lacemaker) | mid-winter (January), path choice |
| B | «Спица» (Knitting Needle) | end of winter (February), the entrance to the Underside opens |
| A | «Веретено» (Spindle) | end of spring (May) |
| S | «Смотрительница» (Warden) | end of the year (August) |

The rank ceremony happens in the first daily session after the 24th of the month in the table, or after 15 January for rank C. If that day is an Ascent day, the ceremony comes at its end. If the player starts in a month other than September, the calendar shifts from the start date. Only the parent sees mastery and readiness for VWO (the Dutch pre-university track).

### Resolved: Mirra holds rank D and keeps it through the MVP, and the canon names no month for a rank

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record.

CAN-0080 made the rival «Мирра Шпилька» (Mirra Hairpin) "one rank above" the heroine and asked two things: whether Mirra's rank follows the heroine's calendar, and whether the canon should name the month of each rank. Two readings were weighed for Mirra. A rank that rises with the heroine's calendar keeps "one above" true all year, but in the MVP the heroine's rank never moves, so a moving Mirra would open a gap of two or more ranks by spring. A fixed rank D matches the heroine's rank E through the whole MVP, keeps "one above" true at her first appearance in December (checkpoint 4) and needs no rank logic in the MVP. The fixed rank wins: Mirra holds rank D, one above the heroine's starting E, and keeps it through the MVP.

The canon names no month for a rank. The table in the finding on the story calendar above belongs to the specification, and after the MVP the campaign's season milestones set when ranks come. CAN-0070 and CAN-0080 now say both.

### The MVP freezes the rank at E

Calendar rank changes are deferred until after the MVP by the draft. In the MVP the heroine gets rank E in Session 0 and keeps it.

### Three daily quests are met by playing, so they are always reachable

Each day the System gives 3 quests in the style of a knitting pattern: «Ряд 1… Ряд 2… Ряд 3…» ("Row 1… Row 2… Row 3…"). Play meets them, not correct answers. The code fills in the counters. Examples:

- «Пройди {n} этажей» ("Clear {n} floors"); the code fills in the number and the grammatical agreement.
- «Поговори с узелком у костра» ("Talk to a familiar at the campfire"). The draft wrote «с фамильяром»; RES-3300 settles the player-facing word as «узелок», as the owner's design has it.
- «Назови новое существо» ("Name a new creature").
- «Загляни в Дневник» ("Look into the Journal").
- «Выбери награду из сундука трижды» ("Choose a reward from a chest three times").

The reward is experience, buttons and one guiding thread: 50 experience, 10 buttons and 1 thread a quest, by the resolved finding on amounts below. An unmet quest disappears the next day, with no penalty.

### An optional pattern row appears at most once every three days

Sometimes, at most once every 3 days, a fourth optional «узорный ряд» ("pattern row") comes from success branches, for example «Найди тайник на любом этаже» ("Find a cache on any floor") or «Собери чистый ряд» ("Make a clean row"). It gives only bonus yarn, 2 star yarn by the resolved finding on amounts below, and quietly disappears if unmet.

### The draft chooses a total day count over a streak

The counter shows only the total: «Дней в Башне: 23» ("Days in the Tower: 23"). The draft rejects streaks because a reset streak punishes a missed day. A missed day takes nothing away and brings no reproach. The game sends no notifications and no "come back" reminders.

### The next goal is always on screen

The main screen and the end of every scene always show the nearest goal: the next level (the experience bar), the next evolution, the recipe for the next item, the bestiary percentage or the next Journal page. Shards and yarn for recipes grow from a base for every floor and Guardian plus a bonus for clean untanglings and clean rows (RES-2100). The experience bar shows points, not time.

### Resolved: a daily quest gives 50 experience, 10 buttons and 1 thread, and a pattern row 2 star yarn

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft gave the quest's experience (50) and its thread (1) but no buttons, and no amount of yarn for the pattern row. RES-2100 sizes all currencies together and holds the comparison: buttons come mostly from quests and chests, not from answers, so a faster player earns almost no more. Three quests at 10 buttons give about 30 of a typical day's 100. The pattern row gives 2 yarn, about a quarter of a typical day's yarn, enough to notice and too little for her to chase it.

### Resolved: quest texts call a familiar «узелок»

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's quest says «Поговори с фамильяром у костра», and the owner's prototype says «Поговори с узелком у костра» (screen 06). RES-3300 compares the options and holds the reason for «узелок» in every text the player sees; this record's quest list now follows it.

## Conclusions

1. An unassisted first attempt must earn the same experience whether the answer is right, wrong or «Не знаю».
2. No answer, mistake or missed day must reduce experience, level, rank or any other progress already earned.
3. Experience values and the level curve must be tuned for a 60-minute adventure, the owner's target.
4. Daily quests must be completable by playing alone, and an unmet quest must disappear without a penalty.
5. The game must show a total day count and must not keep or show a streak of days; the clean-row streak inside one adventure (RES-1700) is not a streak of days.
6. The game must send no notifications or "come back" reminders.
7. The main screen and the end of every scene must show the nearest goal, with the experience bar in points.
8. In the MVP the heroine must hold rank E from Session 0 onward.
9. If stats are built, the Master must receive them only as low, medium or high relative to each other, and they must not affect tasks.
10. Mastery and VWO readiness must be visible only to the parent.
11. In the MVP a level-up must be a ceremony of light and sound with no stat points, and the MVP must offer no stats, paths or rank changes.
12. Each daily quest must give 50 experience, 10 buttons and 1 guiding thread, and an optional pattern row must give 2 star yarn and nothing else.
13. Quest texts must call a familiar «узелок», as every text the player sees does (RES-3300).
14. In the MVP a level-up must carry no grant of buttons, threads or any other reward, only the ceremony, as research decided on 2026-09-27 on the owner's instruction, because the economy in RES-2100 is balanced without it.
15. Mirra must hold rank D, one above the heroine's starting E, and keep it through the MVP, and the canon must name no month for a rank, as research decided on 2026-09-27 on the owner's instruction.

## Sources

- The owner's draft «Хроники Башни — спецификация», sections «Текущий объём (MVP)» and «Прогрессия и ощущение роста», read 2026-09-26; not kept in the repository - every finding in this record.
