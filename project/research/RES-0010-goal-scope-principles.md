---
id: RES-0010
artifact: research
status: approved
revised: 2026-09-27
---

# The draft proposes a daily Russian adventure that measures maths to Dutch level 1S and above, ruled by an MVP scope and sixteen principles

## Summary

The owner's draft proposes «Хроники Башни» (Tower Chronicles), a daily adventure game in Russian that helps the player consolidate maths and science and collects statistics on what she knows. After each adventure the parent sees a fresh map of knowledge: what is mastered, where the frontier lies and what blocks progress. The aim is full coverage of Dutch levels 1F and 1S with a margin, plus a probe of the ceiling above 1S, on the way to the VWO track. The game measures and consolidates; the parent teaches new topics outside the game. The draft makes its MVP section outrank the rest of the text, lists what the MVP contains and what comes later, and states sixteen principles that protect either the accuracy of measurement or the player's joy. This record covers the introduction, the MVP summary, the MVP contents, the list of what comes later, the goal and scope, and the principles. It leaves the adventure structure, resume, clocks and breaks, the stages and the open questions, the report, the knowledge model and the world to other records.

## The question

What is the game for, what does its first version contain, and which principles hold every later rule in place? The draft assumes that one daily adventure can both train and measure without the training spoiling the measurement. The draft itself concedes the cost: without the Ascents that come later, comparison over time is weaker, because daily first attempts change form and context.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles - specification), sections: the introduction, «Текущий объём (MVP)» (Current scope (MVP)) with its parts «Коротко» (In short), «Что входит в MVP» (What the MVP includes) and «Что позже» (What comes later), «Цель и рамки» (Goal and scope) and «Принципы» (Principles), on 2026-09-26.

The draft leaves these points open in this range: the order of the later items, which it chooses after watching the player play; the target length of the adventure, which the draft gives two ways (settled since by the owner at 60 minutes); and whether characteristics belong in the MVP, which principle 12 and the list of later items answer differently (resolved below: they don't).

## Findings

### The draft names a daily Russian adventure that measures and consolidates maths and science

«Хроники Башни» is a daily adventure game in Russian. It helps the player consolidate maths and science and continuously collects statistics on her knowledge. Each day brings one small adventure. After each one the parent sees a fresh map of knowledge: what is mastered, where the frontier is, what blocks progress. The goal is full coverage of Dutch levels 1F and 1S with a margin and a check of the ceiling above 1S, on the way to the VWO track. The game measures and helps consolidate; the parent explains new topics in lessons outside the game.

### The draft gives two lengths for the adventure of the day, and the owner has settled on one hour

The introduction says «около 30–45 минут» (about 30-45 minutes). The MVP summary says «около 60 минут» (about 60 minutes). The owner settled on 2026-09-26 that the adventure of the day targets one hour, 60 minutes of active time. This record follows the owner's decision.

### Resolved: The adventure of the day lasts 60 minutes, and the soft stop comes at 60 minutes of active time

The owner decided on 2026-09-26: the adventure lasts 60 minutes, and the soft stop comes when the day's active time reaches 60 minutes on an unfinished adventure. The introduction's 30-45 minutes no longer holds anywhere in the record. Research on the same day set each «Ещё один ряд» (One more row) extension at 20 minutes and proposed a default daily maximum of 100 minutes; RES-0300 holds the comparison. The owner decided on 2026-09-27 that the game has no daily maximum, so she can choose «Ещё один ряд» again each time the soft stop returns (RES-0300). The owner also decided that the session budget and the cost estimates, computed for the shorter adventure, need no recomputing (RES-1000, RES-2700). Proposed by research on 2026-09-26; the owner approves it with this record.

### The MVP section outranks the rest of the draft

The draft states twice that the section «Текущий объём (MVP)» outranks the rest: if another section contradicts it, the MVP section is right. Everything in the draft that the MVP section leaves out is marked «позже, по итогам игры» (later, after seeing how the player plays). The game grows as the player plays it, and the order of the next steps is chosen after watching her play.

### The MVP summary lists six points

- One small adventure a day, about 60 minutes. The player can leave at any moment and return to exactly the same place.
- A single mode: the adventure both trains and collects statistics. The first attempt measures; learning comes after it.
- Record everything, compute later: an immutable event log is the single source of truth, and every estimate and the report are recomputable views.
- Guiding threads are a game resource for hints and detailed explanations. A free short solution after a wrong answer is always available.
- The game shell: levels, daily quests, chests, the forge, the shop, familiars that evolve, the Diary, names, co-authorship, story branches, light dreamcore.
- Report v1: a skill map from unassisted first attempts, «решает с подсказкой» (solves with a hint), the frontier, errors, a task log, a preliminary VWO block, and an export of raw data.

### The MVP contains a fixed set of parts

| Part | In the MVP |
| --- | --- |
| Progression | levels and experience (a curve fitted to a short adventure), daily quests |
| Rewards | chests with a choice of 1 from 3, without a lottery; a forge fed by materials from floors; a shop for buttons only, without money or a lottery |
| Familiars | a small roster of 6-9 familiars with offline art approved by a person (3 of them starters); friendship; evolution in 2-3 stages at friendship levels |
| Story | the Master, success branches and other-path branches, floor states, Diary pages, names given by the player, free text at several points, light dreamcore |
| Diagnostics | the single mode, guiding threads and explanations, the event log, knowledge model v1 |
| Parent | lesson marks, report v1, raw data export |

### The draft chooses chests of 1 from 3 and a buttons-only shop over lotteries and money

The rewards row says «сундуки 1 из 3 без лотереи» (chests 1 of 3 without a lottery) and «лавка только за пуговицы — без денег и лотереи» (the shop for buttons only, without money or a lottery). This range gives no reason beyond the choice itself.

### Experience follows fixed amounts and a capped level curve

A first attempt earns 5 experience, the same for a correct answer, a wrong answer and «Не знаю» (I don't know). A second attempt earns 3, a scene 10, a floor 20, a quest 50 and a finished adventure 60. One adventure yields about 500-650 experience. Level L needs `min(150 + 20 · (L − 1), 600)` experience.

### The MVP familiar roster has six required familiars and up to three more

The six required familiars, by element:

| Element | Familiars |
| --- | --- |
| «Искра» (Spark) | «Пуговка» (Button), «Шуршик» (Rustler) |
| «Ход» (Stride) | «Винтик» (Little Screw), «Бубенец» (Jingle Bell) |
| «Крошка» (Crumb) | «Безешка» (Little Meringue), «Корица» (Cinnamon) |

If their art is ready, up to 3 more join: «Запятый» (Comma) of «Капля» (Drop), «Грошик» (Little Penny) of «Лад» (Harmony) and «Рулетик» (Little Roll) of «Мера» (Measure). The three starters have 3 stages; the others have 2 in the MVP, and every familiar keeps three stages in the canon, with the third added later as content (RES-1900). Evolution happens at friendship levels, with starting thresholds 5 and 12 kept in `content/familiars.yaml`. Stage pictures are prepared offline and chosen by a person. Live art is deferred until after the MVP by the draft.

### The forge and the shop follow the MVP form in the canon

The draft points to section 10 of the canon for the MVP form of the forge and the shop. This range carries no further detail on them.

### Dreamcore in the MVP has a creepiness level and frequency caps

- The creepiness level is 0, 1 or 2, with 1 as the default.
- A dreamcore variant of one floor appears in at most one adventure in six.
- A short slip into «Изнанка» (the Underside), 2-3 scenes, happens at most once a week.
- The MVP has 2 dreamcore locations and 3 creepy-cute Tangles from the canon. The draft didn't name the Tangles; the resolved finding on them below does.

### Resolved: a slip into the Underside happens at most once in any 7 days and lasts 2-3 scenes

Proposed by research on 2026-09-26; the owner approves it with this record.

The MVP section's weekly limit disagreed with the draft's dreamcore section (once per session, 2-4 scenes) and with the world bible, CAN-0130 (once a day, several scenes). RES-1500 compares the options and holds the reason: the weekly limit keeps the eerie layer rare and short while the player's response to it is untested, and the MVP section outranks the rest of the draft. A week counts as any 7 calendar days, so an adventure that spans two days can't hold two slips. CAN-0130 now states the same limit.

### Free text appears at five points

The player writes free text on entering the first floor of the route, before a Guardian, at the campfire, on meeting a new creature, and at the adventure's finale.

### Session 0 follows its own section plus an introduction to guiding threads

The MVP runs Session 0 as its section «Сессия 0: „Пробуждение“» (Session 0: Awakening) describes, plus an introduction to guiding threads.

### The draft defers nine items until after the MVP and orders them by the stages

Deferred until after the MVP by the draft, in an order the stages set after watching the player play:

- Ascents (control runs) and anchor forms. Until they exist, comparison over time is weaker, because the trend is built from daily first attempts whose form and context change. The log keeps everything, so Ascents can be added later and compared with the stored history.
- Story battles between familiars and the ring of elements.
- Items and familiars created by AI, and live pictures.
- Diary ciphers.
- The free mode, «Свободная прогулка» (Free Walk).
- Characteristics, paths (classes) and story ranks by the calendar; the MVP has only rank E after Session 0.
- Room decor.
- The Dutch layer.
- The full roster (24 familiars and 3 legendary ones) and the full set of dreamcore.

### The game answers one question

The game answers: what does the player already hold firmly, where does the frontier of her knowledge lie, and what stops her going further.

### The scope covers maths to the end of Dutch group 8, stretch topics, science and two kinds of result

- Maths to the end of group 8 of the Dutch school (levels 1F and 1S of the referentiekader), checked against SLO: numbers, arithmetic, fractions, decimals, percentages and proportions, quantities, geometry, data, word problems.
- Stretch nodes «к VWO» (towards VWO): topics above 1S, such as equations, successive percentages, median and mode, and speed and work problems at onderbouw level. They show margin, not gaps.
- Science: short conceptual questions on common misconceptions.
- Two kinds of result: gaps (the state of each skill) and limits (how many steps she holds, how she keeps attention, where she needs to write things down).
- Continuity: each adventure refines the estimates, and the report is current after each adventure. Control Ascents for comparable trends are deferred until after the MVP by the draft.

The owner decided the player's current school group on 2026-09-27 (the value is kept in `personal/player.md`), and that she learns the full material including group 8. The scope above stays as it is, to the end of group 8, and the knowledge model starts from the priors for the player's current group that RES-0900 sets.

### The target is the VWO track, so diagnostics check coverage, margin and ceiling

Passing 1S isn't enough; the aim is to lead towards university, which means the VWO track. Diagnostics check three things in order:

1. full coverage of 1F and 1S;
2. margin: 1S nodes in the state «бегло» (fluent) or «устойчиво» (stable), not only «понимает» (understands);
3. ceiling: how far above 1S she can already go (stretch nodes).

The report shows a block «Готовность к уровню VWO» (Readiness for VWO level), marked plainly as an approximate home tool, not an official school advice (schooladvies) and not a standardised test.

### The scope leaves out Dutch, standardised school assessment and teaching new topics

- Dutch language. The whole interface and every task is in Russian. The Dutch layer is a future stage: the `nl` locale, a curriculum layer and an overlay on the graph.
- A standardised assessment for the school.
- Teaching new topics and home study plans. The parent teaches new topics in lessons outside the game. The game measures and helps consolidate: after the first attempt it shows the correct answer and a short solution, and after a wrong answer it gives a second attempt on a similar task. The parent can mark a topic in the game as «занимались на уроке» (covered in a lesson), and the game then gives and rechecks it more often.

### The game runs on a server on the parent's Mac and plays on iPad and computer

The server runs in Docker on the parent's Mac. The player plays on an iPad (Safari, with an icon on the home screen) or in a browser on a computer, and both interfaces are complete. The link is the home Wi-Fi, and the internet is always available. The game has one player. The Parent Room opens from any device with a PIN.

### The canon rules world facts and the specification rules method, time, rewards and safety

The world is described in a separate world bible, `content/canon.ru.md`; the specification keeps only the part mechanics need. The canon is the source of truth for every name and fact of the world: floors, Guardians, elements, familiars, non-player characters and the voice of the System. The specification is the source of truth for method, time, rewards and safety. If the canon contradicts it on those, the specification is right and the canon is corrected.

### Each principle protects accuracy of measurement or the player's joy

The draft gives sixteen principles:

1. «Решать верно — выгодно, ошибаться — не страшно» (Solving correctly pays; getting it wrong is safe). A correct answer is a strong spell: the node is untangled cleanly, a visible strike or critical untangling, bonus fragments («осколки звёздной стали», star-steel shards, and «звёздная пряжа», star yarn), a step towards a «чистый ряд» (clean row) and the success branch of the story. A wrong answer or «Не знаю» weakens the node, the story takes an alternative route, base experience is credited, and the task window at once shows the short solution free and gives a second attempt. No dead ends, no damage to the heroine, none of the words «неправильно» (incorrect), «ошибка» (mistake) or «промах» (miss), and nothing is taken away: rewards for correctness are only bonuses on top. Only the parent sees skill estimates.
2. Results shape the story. Every room and trial has a success branch and an alternative branch, both interesting. A floor and a Guardian turn room outcomes into story states «триумф» (triumph), «победа» (victory) and «хитрый обход» (clever detour); all three move the campaign on. Missed things aren't lost for good: skipped secrets come back later.
3. Flow first. The Director keeps the share of successful answers per session at about 70-80 %, mixing review of fluent nodes (which also checks retention) with frontier tasks, where diagnostics gain information. A run of failures leads to an easy task or a campfire scene, never to pressure.
4. No clocks on screen. The child sees no timers, countdowns, clocks or time bars. Time is measured quietly. Every timed event (rest stop, eye exercise, offer to finish) arrives as story.
5. The Master doesn't see the maths. The AI storyteller writes no task text and knows no numbers, answers, node identifiers or skill states. It gets only summary story events: the room branch («успех» (success) or «другой путь» (other path)), the clean row event and the floor's final state. Outcomes of single tasks (`clean`, `partial`, `alt`) nearly mirror the verdicts, so they stay on the Mac and never reach the Master; reactions to single answers come from a pool chosen by code. A separate role, the Explainer, writes detailed explanations from the engine's steps, and the Master never receives them.
6. The Director decides, the Master tells. Code decides which tasks, how many and when, the outcome of a trial and which story branch opens. The LLM (large language model) decides how it looks in the story.
7. Protect measurement when stakes are high. Because correctness brings bonuses, the child has a motive to guess. So: free input by default; at least 4 options in a multiple-choice task; a probe made only of multiple-choice tasks has 3 tasks; «Не знаю» always gives base experience; answers faster than the template's minimum are logged as fast guesses and left out of estimates, and they earn no bonuses.
8. Only code computes numbers. Exact rational arithmetic, deterministic seeds, every task reproducible. In hints, solutions and LLM explanations code inserts the numbers too.
9. «Не освоен» (not mastered) only from a full block. A short probe can raise an alarm but doesn't diagnose.
10. Inferred and checked results never mix. The report and the trends always keep them apart.
11. The first attempt measures; learning comes after it. The unassisted first attempt is a diagnostic observation. After it the game shows the correct answer and a short solution, and after a wrong answer gives a second attempt on a parallel task, recorded as assisted and never counted as unassisted. The game measures and consolidates but doesn't drill for a test: generated tasks don't repeat (the window depends on the size of the parameter space), the training effect is tracked, and control forms (anchors) come later with Ascents and never appear in daily play. The parent teaches new topics outside the game.
12. «Всегда есть рост» (Growth never stops). Levels, characteristics, familiars, daily quests and a visible next goal, every minute of play; in the MVP, without characteristics (see the resolved finding below). Base growth comes from play and effort; correctness speeds up only the bonus part of the collection.
13. Transparency. The player knows that the game has maths tasks, that correct answers strengthen spells and open secrets, and that her parents see the results and can read the story.
14. Safety before story. Alarm signals from real life take the Master out of role and call the parent. Light childlike creepiness is allowed only within the level the parent sets, and it always resolves kindly.
15. Everything can be checked automatically. An AI agent builds the game unsupervised; every stage has an automatic check and human acceptance.
16. Record everything, compute later. The immutable event log is the single source of truth. Estimates, states, limits and the report are derived views carrying a model version; they can be recomputed from the log at any moment.

### Resolved: characteristics and rank changes give no reward in the MVP, where growth is levels, familiars, daily quests and the next goal, and the heroine keeps rank E

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft said both: principle 12 names «Уровни, характеристики, фамильяры, квесты дня» (levels, characteristics, familiars, daily quests) as growth visible every minute, and the rewards section lists ranks among the main rewards (RES-2100), while the list of later items defers «Характеристики, пути (классы) и сюжетные ранги по календарю» (characteristics, paths and story ranks by the calendar) and keeps rank E. RES-2000 weighs three options: both in the MVP, ranks alone in the MVP, or both deferred. Both are deferred, because the draft's precedence rule already says so and neither earns its cost in the MVP. The first rank change falls at the end of November, about ten weeks after a September start, so a rank would never change during the two weeks of MVP acceptance play (RES-3000). Characteristics need a screen to spend points, a field in every scene order and story effects to tune, and levels, familiars and quests already show growth several times an adventure. In the MVP, principle 12 reads as levels, familiars, daily quests and the next goal; characteristics join it when they ship.

### Resolved: every familiar has three stages in the canon, and the MVP ships two for familiars other than the starters

Proposed by research on 2026-09-26; the owner approves it with this record.

The MVP row "evolution in 2-3 stages" and the canon's three stages for every familiar disagreed. RES-1900 holds the options and the reason: the canon keeps three stages for all 24 familiars, the MVP ships the first two for non-starters, and each third stage arrives later as content.

### Resolved: the MVP runs the whole campaign calendar, with stand-ins for Ascents, rank changes and ciphers

Proposed by research on 2026-09-26; the owner approves it with this record.

The canon's campaign leans on three parts this record's list of later items defers: Ascents close chapters, ranks rise at season finales and open places, and autumn Diary pages are enciphered. RES-1600 holds the options and the reason. In the MVP a chapter ends with a story finale inside a daily adventure, a season finale gives the chapter title and main reward like any chapter finale but no rank, a rank opening that is part of the MVP opens on its rank's calendar date while the badge stays E, and an enciphered page arrives already developed by the Diary.

### Resolved: live art stays out of the MVP, as this record's list of later items says

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's graphics section described live art without marking it as later, while this record's list of later items, the cost table and the data model defer it. RES-2800 holds the options and the reason: live art would have nothing to draw in the MVP, because AI-made items and creatures are deferred too, and every MVP picture is chosen by a person from offline variants.

### Resolved: the MVP's three creepy-cute Tangles are Whisperkin, the Music Box and the Portrait Lady

Proposed by research on 2026-09-26; the owner approves it with this record.

RES-1500 compares the choices and holds the reason: «Шепотун» (Whisperkin), «Шкатулочница» (the Music Box) and «Портретница» (the Portrait Lady) are all creepiness level 1, so she meets them at the default level, and they are the whisper, the music box and the watching portrait the level-1 row allows. They live on the dreamcore variants of the Sorting Office, the Works and the Archive, so they don't depend on which 2 dreamcore locations the MVP ships. CAN-0050 names them.

## Conclusions

1. The adventure of the day must target 60 minutes of active time, as the owner decided, and every rule that assumed 30-45 minutes must be stated against 60; the session budget and cost estimates are exempt by the owner's decision.
2. Where the scope of the first version is in doubt, the MVP contents list must govern, and every item on the list of later items must stay out of the first version.
3. The game must measure and consolidate without teaching new topics, and it must let the parent mark a topic as covered in a lesson.
4. Diagnostics must report coverage of 1F and 1S, margin as 1S nodes in fluent or stable states, and ceiling as stretch nodes, each separately.
5. The VWO readiness block must say that it is an approximate home tool, not a school advice and not a standardised test.
6. Every player-facing text and task in the first version must be in Russian, and the Dutch layer must stay out of it.
7. A wrong answer or «Не знаю» must never take anything away, damage the heroine or use the words «неправильно», «ошибка» or «промах».
8. Only the parent may see skill estimates.
9. The child's screen must show no timer, countdown, clock or time bar, and every timed event must arrive as story.
10. The storyteller must receive only room branches, clean row events and floor states, and never task text, numbers, answers, node identifiers, skill states or single-task outcomes.
11. Code must decide task choice, trial outcomes and story branches, and compute every number shown, including numbers inside hints, solutions and explanations.
12. Free input must be the default, a multiple-choice task must offer at least 4 options, and answers faster than the template's minimum must be excluded from estimates and bonuses.
13. «Не знаю» must always earn the same base experience as an answer.
14. A node must be marked not mastered only from a full block, never from a short probe.
15. Reports and trends must keep inferred results apart from checked ones.
16. Only unassisted first attempts may update the unassisted estimate, and a second attempt must be recorded as assisted.
17. The event log must be immutable and the single source of truth, and every estimate and report must be recomputable from it.
18. Experience must follow the amounts 5, 3, 10, 20, 50 and 60 and the level curve `min(150 + 20 · (L − 1), 600)`, so that one adventure yields about 500-650 experience.
19. The first version must ship the six required familiars, three of them starters with 3 stages and the rest with their first 2 of 3, with art a person has approved.
20. Dreamcore must default to creepiness level 1, and must respect the caps of one dreamcore floor in six adventures and one slip into the Underside a week.
21. Chests and the shop must involve no lottery and no real money.
22. Where the canon contradicts the specification on method, time, rewards or safety, the specification must win and the canon must be corrected.
23. Every stage must have an automatic check and a human acceptance.
24. A slip into the Underside must happen at most once in any 7 calendar days and last 2-3 scenes, and the canon must state the same limit.
25. The MVP must give no characteristics, stat points or rank changes, and must show growth through levels, familiars, daily quests and the next goal.
26. The MVP must ship the three starters with three evolution stages and every other familiar with its first two, and the canon must keep three stages for every familiar.
27. The MVP must run the whole campaign calendar with the stand-ins RES-1600 sets for Ascents, rank changes and ciphers.
28. The MVP must generate no pictures during play; live art must arrive only with AI-made items and creatures.
29. The MVP's creepy-cute Tangles must be «Шепотун», «Шкатулочница» and «Портретница», as RES-1500 sets out.
30. The game must cover maths to the end of group 8 whatever the player's current school group (kept in `personal/player.md`), as the owner decided on 2026-09-27, and the knowledge model must start from the priors for that group.

## Sources

- The owner's draft «Хроники Башни — спецификация», introduction, «Текущий объём (MVP)» («Коротко», «Что входит в MVP», «Что позже»), «Цель и рамки» and «Принципы», read 2026-09-26; not kept in the repository - the goal, the scope, the MVP contents, the deferred items and the sixteen principles.
- The owner's decisions of 2026-09-26, relayed that day: the adventure lasts 60 minutes, the soft stop comes at 60 minutes of active time, and the session budget and cost estimates need no recomputing - conclusion 1 and the resolved finding.
