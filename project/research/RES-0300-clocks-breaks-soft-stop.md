---
id: RES-0300
artifact: research
status: approved
revised: 2026-09-27
---

# The draft proposes that time stays invisible and every timed event arrives as story: eye exercises, rest stops and a soft stop

## Summary

The draft proposes that the child never sees a timer, countdown, clock or time bar, while the device measures time quietly. Every timed event arrives as a story moment voiced by a familiar or the System. An eye exercise interrupts play every 20 minutes of active time for 30-40 seconds. A soft stop offers to save when an unfinished adventure runs long, and the player can extend it with «Ещё один ряд» (One more row) each time it returns. A rest stop button is always there, and signs of anxiety or avoidance lead to a gentle reaction and never to pressure. The owner decided on 2026-09-26 that the adventure lasts 60 minutes and the soft stop comes at 60 minutes of active time. Research on the same day proposes an extension of 20 minutes. The owner decided on 2026-09-27 that the game has no daily maximum, so the soft stop returns after each extension and nothing caps the day's total time. This record covers the no-clocks rule, eye exercises, the soft stop and extensions, rest stops, leaving and anxiety signals. It leaves resume, the daily structure and the task window to other records.

## The question

How does the game limit screen time and give breaks without ever showing time to the child? The draft assumes that story framing hides time well enough that the child never counts. A challenge to that: a button that turns inactive for 10 minutes and an offer that always arrives near the same point both leak time, so the draft relies on the lack of any number, not on the lack of any pattern.

## Method

Read the owner's draft «Хроники Башни — спецификация», sections «Правило „никаких часов“» (The no-clocks rule), «Гимнастика для глаз» (Eye exercise), «Мягкая остановка и продления» (Soft stop and extensions) and «Привал и выход» (Rest stop and leaving), and for comparison the soft-stop line in «Приключение дня» (Adventure of the day) inside «Текущий объём (MVP)», on 2026-09-26.

The draft gave two answers each for where the soft stop falls and how long an extension lasts; the resolved finding below settles both. It doesn't say what counts as «контрольные факты» (control facts) behind the fatigue signal.

## Findings

### The child never sees time, and the device measures it quietly

The child never sees timers, countdowns, clocks or time bars. The device measures time with `performance.now()` and never shows it to her. Every timed event is presented as a story moment.

| Event | When (quietly) | How it looks |
| --- | --- | --- |
| Eye exercise | every 20 minutes of active play | The familiar looks out of a Tower window at the farthest tree of the forest. The System: «Рекомендуется посмотреть туда же. Дерево не против.» (It is recommended to look there too. The tree doesn't mind.) |
| Fatigue (a signal from control facts) | by the data | The familiar yawns, the Tower dims its lamps, the System: «Рекомендуется привал» (A rest stop is recommended) |
| Offer to finish | at 60 minutes of active time, if the adventure isn't finished yet (the draft's table said about 45 minutes) | The System: «Сегодняшний ряд связан наполовину. Башня подождёт. Рекомендуется сохранить приключение и вернуться завтра.» (Today's row is half knitted. The Tower will wait. It is recommended to save the adventure and come back tomorrow.) |
| Extension | at the player's choice, 20 minutes each | the button «Ещё один ряд» (One more row); the System: «Продление принято. Башня зажгла ещё одну лампу.» (Extension accepted. The Tower has lit one more lamp.) - the story continues with tasks |
| Soft stop again | when an extension's 20 minutes run out, if the adventure isn't finished | the same offer to save returns, with «Ещё один ряд» again (the draft also had a hard end at the parent's daily maximum, which the owner removed on 2026-09-27) |
| Leaving the free mode (deferred until after the MVP by the draft) | the free mode's limit | «Туман пришёл по расписанию. Прогулка откладывается до завтра.» (The fog came on schedule. The walk is put off until tomorrow.) |

The lines come from the canon (section 3, samples 11-14) and from the line pool; none contains minutes, numbers or hints of a countdown.

### An eye exercise pauses play every 20 minutes of active time for 30-40 seconds

Every 20 minutes of active play a System scene pauses the game, and the familiar shows an exercise lasting 30-40 seconds.

- Exercises take turns: look far out of the window, blink, trace a figure eight with the eyes, cover the eyes with the palms.
- The exercise appears at the nearest boundary: straight after an answer or after a scene, never in the middle of a task. In the free mode and in Session 0 it appears at the nearest scene boundary.
- The 20-minute counter measures active time since the last exercise, without the time of the exercise itself or of rest stops. A pause longer than 5 minutes resets it.
- The player can't skip it; the parent can switch on a «Пропустить» (Skip) button in the settings.

### Break time counts towards screen time and never towards task measures

Eye exercises and campfire rest stops count towards the soft stop, because they are screen time (the draft also counted them towards a daily maximum, which the owner removed on 2026-09-27). They don't count towards the 20-minute counter or towards task measures: their time is removed from every answer timing.

### The soft stop offers to stop, and the player can extend each time it returns

- Usually the adventure ends on its own with a finale. If it is still going at the soft-stop point, the story offers to stop at the nearest boundary: «Сегодняшний ряд связан наполовину».
- The player can choose «Ещё один ряд» to add an extension of 20 minutes. When it runs out on an unfinished adventure, the soft stop returns, and she can choose «Ещё один ряд» again.
- The game has no daily maximum: the owner decided on 2026-09-27 to remove it (the draft had a parent setting for it with a default of 60 minutes, which research had raised to 100).
- The soft stop and extensions count the sum of active time in the day, including eye exercises and rest stops. The day ends at 04:00.
- One new adventure a day: after the finale and until 04:00 only screens without tasks are open (the room, the Diary, the forge, the shop, the familiars), and no timer limits them. Their time counts towards the eye exercise counter, so an eye exercise still comes every 20 minutes on them (research decided on 2026-09-27, on the owner's instruction; the draft of this line counted them towards nothing).
- An extension continues the adventure with tasks; it isn't a mode without tasks.
- When she accepts the offer to save, the game stops through the story at the nearest boundary. The open task, the scene and the rewards are saved, and tomorrow the adventure continues from the same place. The draft's forced stop at the daily maximum is gone.

### The draft contradicts itself on the soft-stop point and the extension length

The section «Мягкая остановка и продления» says: «Обычно приключение само заканчивается финалом за 30–45 минут. Если около 45 минут оно ещё идёт…» (Usually the adventure ends with a finale in 30-45 minutes. If it is still going at about 45 minutes…) and «„Ещё один ряд“ — плюс 15 минут» (One more row - plus 15 minutes). The no-clocks table and the eye exercise section also place the offer at «около 45 минут».

The MVP section says: «если приключение ещё не закончено, а активное время дня подошло к 60 минутам, история на ближайшей границе (после ответа с разбором или после сцены) предлагает сохраниться» (if the adventure isn't finished and the day's active time has reached 60 minutes, the story offers to save at the nearest boundary, after an answer with its review or after a scene) and «„Ещё один ряд“ (+20 минут)» (One more row, plus 20 minutes).

The draft's own precedence rule makes the MVP section win. The owner has since settled the adventure's target at 60 minutes of active time, which agrees with the MVP section.

### The draft's default maximum of 60 minutes collided with a soft stop at 60 minutes

The MVP section puts the soft stop at 60 minutes of active time. The draft set the daily maximum default at 60 minutes, counted on the same sum of active time. With both at 60, the hard end arrives with the offer, and no extension can run. The owner's decision of 2026-09-27 removes the daily maximum altogether, so the collision is gone (see the finding «The owner removed the daily maximum» below).

### Resolved: The soft stop comes at 60 minutes of active time, «Ещё один ряд» adds 20 minutes, and the daily maximum defaults to 100 minutes

The owner decided on 2026-09-26: the adventure lasts 60 minutes, and the soft stop comes when the day's active time reaches 60 minutes on an unfinished adventure. This replaces «около 45 минут» (about 45 minutes) in the draft's soft-stop section, its no-clocks table and its settled list.

The extension length had two candidates. 20 minutes is the MVP section's figure, written for the 60-minute adventure, and the draft's precedence rule makes the MVP section win. 15 minutes comes from the soft-stop section and the settled list; finer steps would let the game use the parent's maximum more exactly, but the same sentences put the soft stop at 45 minutes, which the owner's decision has replaced. I chose 20 minutes, because it is the only figure the draft wrote for the adventure the owner settled on.

The default daily maximum had four candidates:

| Default | Extensions that fit after a soft stop at 60 | What it is better at |
| --- | --- | --- |
| 60 minutes (the draft) | none | the shortest day, but the hard end arrives with the offer, so «Ещё один ряд» can never run |
| 80 minutes | one | a short day that still honours one request for more |
| 100 minutes | two | lets the extension repeat, as the soft-stop section says she can, and stays 20 minutes under the 2-hour guideline |
| 120 minutes | three | the most play, but the game alone would use the whole 2-hour guideline |

The Canadian 24-Hour Movement Guidelines for children and youth aged 5 to 17 recommend no more than 2 hours of recreational screen time a day. I chose 100 minutes. The draft describes the extension as repeatable, so the default must fit more than one. Eye exercises, rest stops and the screens without tasks after a finale (the room, the Diary, the forge, the shop) all count within the maximum, so 100 minutes is the whole of the game's screen time, and it leaves room under the guideline for the rest of her day. The parent can lower or raise it in the Parent Room. The extension still runs only until the daily maximum: with a parent's maximum of 90 minutes, the second extension ends at the hard end after 10 minutes.

Proposed by research on 2026-09-26; the owner approves it with this record.

The owner's decision of 2026-09-27 replaced the daily-maximum part of this finding: the game has no daily maximum, see «Resolved: the game has no daily maximum» below. The 60-minute soft stop and the 20-minute extension stand.

### Resolved: the parent chooses the daily maximum from 60, 80, 100 and 120 minutes, and 100 stays the default

Proposed by research on 2026-09-26; the owner approves it with this record.

The owner's decision of 2026-09-27 replaced this finding: the Parent Room offers no daily-maximum setting, see «Resolved: the game has no daily maximum» below.

The owner's prototype (RES-3500, screen 29) offers the daily maximum as 45, 60, 75 or 90 minutes, with 60 selected. That list has no 100-minute choice, its default leaves no room for an extension, and 45 ends the day before the 60-minute adventure. RES-3500 weighs the prototype's list, 15-minute steps from 60 to 120, and 20-minute steps from 60 to 120, and holds the reason for the last: each step is one whole extension, 60 lets the parent allow no extension at all, and 120 is the 2-hour guideline above. The default stays 100 minutes, as the finding above sets. At a maximum of 60 the soft stop and the hard end coincide, so the story goes straight to the night re-knitting and offers no «Ещё один ряд».

### Resolved: the game has no daily maximum, and the soft stop returns after each extension

The owner decided on 2026-09-27: there is no daily maximum. The game has no hard end, no 100-minute default, no choice of 60, 80, 100 or 120 minutes and no parent setting for it. The soft stop still comes at 60 minutes of active time on an unfinished adventure. «Ещё один ряд» still adds 20 minutes, and when those run out on an unfinished adventure the soft stop returns, so she can choose it again each time.

With the maximum gone, these limits on play remain:

- the soft stop, at 60 minutes and again after every extension, so a longer day takes her own choice every 20 minutes;
- the eye exercise every 20 minutes of active time, which she can't skip unless the parent switches on a skip;
- the fatigue signal, the offered rest stop after three «Не знаю» (I don't know) and the gentler tasks after anxiety signals;
- one new adventure a day: after the finale only screens without tasks open, until the day ends at 04:00;
- the three-day rule, which wraps up an adventure that runs over three adventure days.

Nothing in the game now caps the day's total active time, and until the decision below no record gave the parent a way to end a session from the Parent Room. Screens without tasks after the finale have no limit either. After three extensions the day reaches 120 minutes, the 2-hour limit on recreational screen time in the Canadian 24-Hour Movement Guidelines. The draft of this finding left an open question for the owner: whether the parent needs a control to end the day, or the game should log or report long days.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. No daily maximum returns, as the owner decided. Three things are added:

- The Parent Room gets a «Закончить на сегодня» (Finish for today) control. When the parent uses it, the soft stop comes at the next boundary, after an answer with its review or after a scene, and «Ещё один ряд» isn't offered. The adventure saves as it does when she accepts the offer, and continues the next day from the same place.
- When a day's active time passes 120 minutes, the parent's report marks that day (RES-2300), so the parent can see a long day without the game capping it.
- The screens after the finale have no tasks, and their time counts towards the eye exercise counter, so an eye exercise still comes every 20 minutes there.

Two options were weighed for the parent's control. A hard cap set by the parent is what the owner removed, and it ends play at a fixed point whatever the story is doing. A control the parent uses on the day ends play through the story at the next boundary, keeps the no-clocks rule for her, and adds no number she has to meet. The control wins. The 120-minute mark follows the 2-hour limit on recreational screen time in the Canadian 24-Hour Movement Guidelines already cited in this record, and it only informs the parent.

### A rest stop is always available but at most once every 10 minutes

The «Привал» (Rest stop) button is always there. It becomes available again no sooner than 10 minutes after the last rest stop; until then the button is only inactive, with no countdown. A rest stop is a campfire scene with the familiars lasting 2-5 minutes.

### Leaving never brings reproach

The «Сохранить и уйти» (Save and leave) button is always there, including in the middle of a task, and it brings no reproach. The adventure continues from the same place.

### Three «Не знаю» in a row lead to an offered rest stop and an avoidance signal

If the player presses «Не знаю» (I don't know) 3 times in a row, the Director offers a campfire rest stop: «Узелок предлагает передохнуть» (The familiar suggests a rest). The draft wrote «Фамильяр»; RES-3300 settles the player-facing word as «узелок». The log records an «избегание» (avoidance) signal, and no penalty follows.

### Anxiety signals lead to an easy task and a gentle scene, never to pressure

The Director watches for signs of strain:

- a run of 3 `alt` outcomes in a row;
- a rising share of fast guesses towards the end of the session;
- frequent erasing and long hesitation before answering;
- «мне страшно» (I'm scared) or «не хочу» (I don't want to) in free text.

The reaction is always gentle: the next task is easy, then a campfire scene or a funny scene. After the second such run in a session, the Director lowers the share of frontier tasks for the rest of the day. The game applies no pressure, reminds her of no goals and never mentions time. The signals go to the log and show to the parent in the report under «Ограничения» (Limits).

### Resolved: the hourglass that marks the element «Мера» is not a clock, as long as it stays still and away from anything timed

Proposed by research on 2026-09-26; the owner approves it with this record.

The owner's design draws the element «Мера» (Measure) as an hourglass (RES-3400). RES-3400 compares keeping it with replacing it by a tape measure, and holds the reason: the hourglass belongs to the world (the Measuring Dunes, «Минутка», trickles of sand), and it measures nothing on her screen as long as its sand never moves. Because an hourglass also reads as time running out and as a computer's waiting pointer, this rule gets three limits: the symbol's sand never moves or changes level; no hourglass appears in the task window, on the soft stop, the eye exercise or the rest stop; and the game never shows an hourglass while it waits.

## Conclusions

1. The child's screen must show no timer, countdown, clock or time bar, and the game must measure time on the device without displaying it.
2. Every line for a timed event must contain no minutes, numbers or hint of a countdown.
3. An eye exercise of 30-40 seconds must come after every 20 minutes of active time, at the nearest boundary and never mid-task, with the four exercises in turn.
4. The eye counter must exclude eye exercises and rest stops, and a pause longer than 5 minutes must reset it.
5. The eye exercise must have no skip, unless the parent switches one on.
6. Eye exercise and rest stop time must count towards the soft stop, and must be removed from every answer timing (the draft also counted it towards a daily maximum, which the owner removed on 2026-09-27).
7. The soft stop must come when the day's active time reaches 60 minutes on an unfinished adventure, following the owner's 60-minute decision and the MVP section.
8. The game must have no daily maximum, as the owner decided on 2026-09-27; research had proposed a default of 100 minutes over the draft's 60.
9. An extension must continue the adventure with tasks, and she must be able to choose it again each time the soft stop returns.
10. The day must end at 04:00, and after the finale only screens without tasks may open until then.
11. When she accepts the offer to save, the game must stop at the nearest boundary through the story and save the open task, scene and rewards for the next day; the draft's forced stop at the daily maximum is removed.
12. The rest stop button must always be present and must be inactive without a countdown for 10 minutes after a rest stop.
13. Three «Не знаю» in a row must lead to an offered rest stop and a logged avoidance signal, with no penalty.
14. Each anxiety signal must lead to an easy task and then a campfire or funny scene, and a second run in a session must lower the share of frontier tasks until the day ends.
15. Anxiety and avoidance signals must be logged and shown to the parent under limits in the report.
16. Each «Ещё один ряд» must add 20 minutes of active time, and when those run out on an unfinished adventure the soft stop must return.
17. The Parent Room must offer no daily-maximum setting, as the owner decided on 2026-09-27; research had proposed 60, 80, 100 or 120 minutes.
18. The «Мера» hourglass symbol must stay still, and no hourglass may appear in the task window, on a timed event's screen or as a waiting sign.
19. Play must stay limited by the soft stop returning after each extension, the eye exercise every 20 minutes and one new adventure a day, because the game has no daily maximum.
20. The Parent Room must offer a «Закончить на сегодня» (Finish for today) control that brings the soft stop at the next boundary and offers no extension, as research decided on 2026-09-27 on the owner's instruction.
21. When a day's active time passes 120 minutes, the parent's report must mark that day, as research decided on 2026-09-27 on the owner's instruction.
22. The screens after the finale must have no tasks, and their time must count towards the eye exercise counter, as research decided on 2026-09-27 on the owner's instruction.

## Sources

- The owner's draft «Хроники Башни — спецификация», «Правило „никаких часов“», «Гимнастика для глаз», «Мягкая остановка и продления», «Привал и выход» and the soft-stop line of «Приключение дня», read 2026-09-26; not kept in the repository - the no-clocks rule, eye exercises, the soft stop, extensions, the daily maximum the owner later removed, rest stops and anxiety signals.
- The owner's decision that the adventure lasts 60 minutes and the soft stop comes at 60 minutes of active time, relayed 2026-09-26 - conclusion 7 and the resolved finding.
- The owner's decision that the game has no daily maximum, relayed 2026-09-27 - conclusions 8, 17 and 19 and the resolved finding on it.
- Canadian Society for Exercise Physiology, «Children & Youth 5-17 Years - 24-Hour Movement Guidelines», https://csepguidelines.ca/guidelines/children-youth/, read 2026-09-26 - no more than 2 hours of recreational screen time a day, behind the removed default of 100 minutes and the note on long days.
- Wikipedia, "Hourglass", https://en.wikipedia.org/wiki/Hourglass, read 2026-09-26 - the hourglass as a symbol of time running out and as a waiting pointer, the reason for the limits on the «Мера» symbol.
