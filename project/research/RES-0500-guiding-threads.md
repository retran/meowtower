---
id: RES-0500
artifact: research
status: approved
revised: 2026-09-26
---

# The draft proposes guiding threads as a generous in-game currency for hints and detailed explanations

## Summary

The owner's draft proposes the guiding thread as the in-game resource the player spends on hints and detailed explanations. She earns about 8 to 10 threads a day: 3 each morning, and more from daily quests, a clean row, story and chest finds, and her familiar hatching or evolving. The balance is generous on purpose, so she never saves threads while stuck: when she reaches for a thread with an empty stock, her backpack pocket yields one, once in each room, and the thread button never leaves the task window. The stock stops at 30 threads, the surplus turns into buttons, and the shop doesn't sell threads. Each action costs one thread: before answering it buys the next rung of a three-rung hint ladder, and after answering it buys a detailed explanation. The engine builds the hint ladder from the template's computation graph with no LLM (large language model), and the free short solution is never locked behind threads. This record covers earning, spending, the hint ladder and the stock display. It leaves the thread lore to the canon, the detailed explanation to RES-0600 and the attempt rules a hint triggers to RES-0400.

## The question

How does the player pay for help without the cost stopping her from asking for it? The draft assumes that an in-game currency can gate hints without making her ration them. That assumption fails if she hoards threads while stuck, so the draft sets earnings well above typical use, adds a pocket top-up and keeps the short solution free.

## Method

Read the owner's draft «Хроники Башни — спецификация» ("Tower Chronicles: specification"), section «Путеводные нити» ("Guiding threads"), on 2026-09-26.

The draft leaves these points open:

- The lore of threads sits in the canon, section 3, which this range points to and doesn't contain.
- The range doesn't say how many daily quests there are, so the 8 to 10 thread figure can't be checked against the listed sources.
- It doesn't define a "clean row" («чистый ряд»). Settled in the findings: RES-1700 defines it.
- It doesn't say whether the backpack pocket top-up counts against the cap of 30 (settled in the findings: it fires only at zero), or how buttons convert from surplus threads (settled in the findings: 2 buttons a thread).
- It doesn't say what a hint costs once all three rungs are spent, or whether a spent rung is shown again free.
- The phrase «поле кода» ("code field") after the stock display is unclear: it can mean a field in the game state or a field on the screen.

## Findings

### The guiding thread pays for hints and detailed explanations

A guiding thread (путеводная нить) is the in-game resource for hints and detailed explanations. Its lore is in the canon, section 3.

### The player earns about 8 to 10 threads a day from six sources

| Source | Threads |
| --- | --- |
| Morning stock: the Tower winds them up overnight («Башня подматывает их за ночь») | 3 |
| Each daily quest | 1 per quest |
| A clean row | 1 |
| Finds in the story and in chests | 1 to 2 |
| The familiar hatching or evolving | 2 |

The draft states that this usually comes to 8 to 10 threads a day.

### The draft makes the balance generous so the player never saves threads while stuck

The player shouldn't have to save threads when she is stuck. The draft said that if she has no threads at the start of a room, she finds one in her backpack pocket, no more than once a day; the last resolved finding in this section moves the top-up to the moment of need, once in each room.

### Resolved, then revised by the next finding: the stock of threads stops at 30, and an empty pocket yields one thread

Proposed by research on 2026-09-26; the owner approves it with this record. The finding after this one revises the top-up to once in each room at the moment of need; the cap and the comparison with the bible's rule below still hold.

The world bible (CAN-0030) said that whenever the pocket is empty one thread turns up by itself, and that no thread is ever "the last". The specification gives the top-up only at the start of a room, at most once a day, and caps the stock at 30. Two options were weighed:

- The bible's rule, a thread whenever the pocket is empty. She could never run out, but threads would stop being a resource: she could spend down to zero and draw one free thread after another, so every hint rung and every detailed explanation would be free in practice. The six earning sources and the cap would then decide nothing.
- The specification's rule, one thread at the start of a room, once a day, with a cap of 30. Earnings of about 8 to 10 threads a day stay the main supply, and the top-up is a safety net for a bad morning. The safety net is enough, because the knot scheme and the correct answer stay free after every first attempt (RES-0400), so an empty pocket never leaves her without help, only without the hint ladder and the familiar's explanation.

The specification's rule wins, because only it keeps the earning table and the cap meaningful, and RES-0010 makes the specification win where the canon disagrees on rewards. The top-up fires only when the stock is zero, so it never meets the cap. The canon keeps the lore that the Tower is generous and nobody needs to save threads, and states the same limit.

### Resolved: the thread button is always in the task window, an empty pocket yields one thread when she presses it, once in each room, and at zero the button stays visible but inactive

Proposed by research on 2026-09-26; the owner approves it with this record.

The owner's design (RES-3200) says the thread button in `TaskWindow` can't be hidden, because «нитей всегда хватает» (there are always enough threads). Under the rule above she can reach zero in the middle of a room, or at the start of a second room on the same day, and then the button would read «Путеводная нить · 0» with nothing behind it. Three options were weighed:

- Unlimited threads, as the design's sentence reads literally. The button always works. But a hint before answering makes the first attempt assisted (RES-0400), and only unassisted first attempts feed the estimate of what she does alone (RES-0900). Aleven, McLaren, Roll and Koedinger (2006) found that 72 % of student actions in a Cognitive Tutor data set were unproductive help seeking, much of it clicking through hints to reach the answer. With free hints on every task, the game could lose most of its unassisted observations, so measurement wins over the literal reading.
- The rule above, one thread at the start of a room, once a day. It keeps the measurement, but she can run out mid-room, which breaks the design's promise and turns the button into a reminder that she is out.
- One thread from the pocket at the moment she presses the button with an empty stock, at most once in each room. This bounds free help at one hint rung in a room of 3 to 5 tasks, even in the worst case, and a day of 3 or 4 floors with 1 or 2 rooms each gives at most about 8. With earnings of about 10 a day and a stock of up to 30, she rarely reaches zero at all.

The third option wins, because it keeps the design's promise in every room while keeping most first attempts unassisted. The button is always rendered with its code-filled count, as the design asks. If the pocket has already given its thread in this room and the stock is zero, the button stays visible and inactive at `disabled-alpha`, like «Привал» (Rest stop) during its cooldown, with no words about running out; the count «· 0» and the free knot scheme after the spell are enough. The next room makes the pocket available again. CAN-0030 states the same rule in the world.

The stock holds at most 30 threads. Threads above the cap turn quietly into buttons (пуговицы). The shop doesn't sell threads.

### Resolved: a clean row is a streak of 3 clean scored first attempts, and a thread above the cap turns into 2 buttons

Proposed by research on 2026-09-26; the owner approves it with this record.

RES-1700 now defines the clean row: the streak of clean, unassisted, scored first attempts that aren't rapid guesses reaches 3 within one adventure. Each clean row gives 1 thread; a big clean row, at 5, 10 and so on, gives yarn but no further thread. By the run lengths of a 28-task day at a clean share near 0.7, that is about 3 threads a day, so a typical day gives 3 in the morning, 3 from quests, about 3 from clean rows and 1 to 2 from finds: about 10 to 11, the top of the draft's 8 to 10.

For the surplus, three rates were weighed. One button a thread is the simplest, but a quest alone gives 10, so the conversion would pass unnoticed. A high rate, 10 or more, would make hoarding threads a way to earn buttons, the opposite of the draft's aim that she spends them freely. 2 buttons a thread sits between: a day of 100 buttons (RES-2100) barely notices it, so it neither punishes a full stock nor rewards filling one. The rate lives with the other amounts in RES-2100.

### One thread buys one action on any task in the adventure

Every action costs one thread, on any task of the adventure:

- Before answering, a thread buys the next rung of the hint ladder, and the attempt becomes assisted.
- After answering, a thread buys a detailed personal explanation from the familiar.

### The engine builds a three-rung hint ladder from the computation graph, with no LLM

| Rung | What it gives |
| --- | --- |
| 1 | What the task asks and where to start, with no numbers |
| 2 | The first step, with the numbers from the task |
| 3 | Every step except the last calculation |

The rung texts are template strings, stored as `hints` in the template. Code substitutes the numbers.

### The free short solution is never locked behind threads

The draft states that the free short solution never hides behind threads («Бесплатное короткое решение никогда не прячется за нитями»).

### The stock shows on screen as a ball of yarn with a number

The screen shows the thread stock as a small ball of yarn (клубочек) with a number on it. The draft adds «поле кода» ("code field") without saying more.

## Conclusions

1. The game must give the player 3 guiding threads each morning.
2. The game must award 1 thread for each daily quest, 1 for a clean row, 1 to 2 for a story or chest find, and 2 when a familiar hatches or evolves.
3. The thread economy must be tuned so a typical day yields about 8 to 10 threads.
4. If the player presses the thread button with no threads, the game must give her one from her backpack pocket, at most once in each room.
5. The thread stock must never exceed 30, and threads above that cap must turn into buttons without interrupting play.
6. The shop must not sell guiding threads.
7. Each hint rung bought before answering and each detailed explanation bought after answering must cost exactly one thread, on any task of the adventure.
8. Buying a hint rung before answering must make the attempt assisted.
9. The engine must build the three hint rungs from the template's computation graph with no LLM, from `hints` template strings with code-substituted numbers.
10. Rung 1 must contain no numbers, rung 2 must give the first step with the task's numbers, and rung 3 must give every step except the last calculation.
11. The short solution must stay free and must never require a thread.
12. The screen must show the thread stock as a ball of yarn with the current number.
13. The game must give no guiding thread for an empty pocket except the one at the moment of need, at most once in each room, and the canon must state the same limit.
14. A clean row, as RES-1700 defines it, must give 1 guiding thread, and a big clean row none.
15. Each thread above the cap of 30 must turn into 2 buttons.
16. The task window must always show the thread button with its code-filled count, and when the stock is zero after the room's pocket thread, the button must stay visible and inactive, with no words about running out.

## Sources

- V. Aleven, B. McLaren, I. Roll and K. Koedinger, "Toward meta-cognitive tutoring: A model of help seeking with a Cognitive Tutor", International Journal of Artificial Intelligence in Education 16 (2006), pages 101-128, https://journals.sagepub.com/doi/10.3233/IRG-2006-16%282%2902, read 2026-09-26 - 72 % of student actions were unproductive help seeking, including hint abuse; the reason free help stays bounded.
- The owner's draft «Хроники Башни — спецификация», section «Путеводные нити», read 2026-09-26; not kept in the repository - thread earning, the cap, spending, the hint ladder and the stock display.
