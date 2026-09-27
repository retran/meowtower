---
id: RES-0400
artifact: research
status: approved
revised: 2026-09-27
---

# The draft proposes one mode in which the unassisted first attempt measures and everything after it teaches

## Summary

The owner's draft proposes that the adventure of the day both trains and measures, with no separate measurement mode in the MVP (minimum viable product). Only an unassisted first attempt updates the estimate of what the player does alone. After a correct answer the task window marks it accepted and offers the short solution free and the detailed explanation for one guiding thread. After a wrong answer or «Не знаю» ("I don't know") the window shows the short solution at once, free, and then gives a second attempt on a parallel task. That second attempt is assisted, never counts as unassisted, and has no third attempt after it. Game outcomes are computed from first attempts only, and later tasks of the same node that day are flagged as after feedback. This record covers the attempt sequence, its effect on the game and on measurement, and when answers are shown. It leaves the guiding thread economy to RES-0500, the detailed explanation to RES-0600 and the knowledge model's learning transition to the record that holds «Модель знаний v1» ("Knowledge model v1").

## The question

How can one daily adventure train the player and still produce a clean measure of what she knows? The draft assumes that the first attempt of each task is a fair diagnostic observation, and that feedback within the session changes only what comes after it. That assumption fails if the player learns from one task's short solution before the next task of the same node, which is why the draft adds the `postFeedback` flag and keeps accuracy before and after feedback apart.

## Method

Read the owner's draft «Хроники Башни — спецификация» ("Tower Chronicles: specification"), sections «Текущий объём (MVP)» ("Current scope (MVP)") and its subsection «Единый режим: тренировка и измерение» ("One mode: training and measurement"), on 2026-09-26.

The draft leaves these points open:

- It doesn't define "fast guessing" (быстрое угадывание), the attempt kind excluded from the unassisted estimate, in this range.
- It doesn't say whether an assisted first attempt (one after a paid hint) counts towards the spell outcome, the streak and the room's share of clean answers, which it computes "only from first attempts".
- It doesn't say what happens when the engine can't build a parallel task with the same difficulty features.
- It doesn't say whether «Не знаю» on the second attempt shows the short solution again, as a wrong second answer does.
- It doesn't say how long the `postFeedback` flag lasts beyond "that day", for example across a resumed adventure.

## Findings

### The draft has one mode that both trains and measures

The adventure of the day trains and collects statistics at once. The MVP has no separate mode of "pure measurement" («чистого измерения»). The draft's principle is: "the first attempt measures, after it comes learning" («первая попытка измеряет, после неё — обучение»). The MVP section also says this mode outranks every other section of the draft where they disagree.

### Only an unassisted first attempt updates the estimate of what the player does alone

The unassisted first attempt is the diagnostic observation. Only attempts that meet all three conditions update the estimate «сама» ("on her own"):

- no hint was used;
- it isn't fast guessing;
- the parent hasn't excluded it.

### After a correct answer the window marks it accepted and offers the solution on request

The task window shows her answer as accepted and a dry outcome line. The short solution opens free under the button «Как легла нить» ("How the thread lay"). The detailed explanation costs one guiding thread.

### After a wrong answer or «Не знаю» the short solution appears at once and free

After a wrong answer or «Не знаю», the window always shows the short solution, free and with no extra taps. The short solution holds the steps the engine built from the task's computation graph, and the correct answer. Code substitutes the numbers in it. Below the solution sits a button for the detailed explanation, at one guiding thread.

### A second attempt follows on a parallel task and is always assisted

The second attempt uses a parallel task: the same template and subtype, with new parameters that keep the same difficulty features. The draft names four such features: the number of carries, zeros, the number of digits and the type of fraction. The second attempt is a learning step. The event log records it as `assisted: true`, and it never counts as an unassisted attempt. The correct answer appears after it. If the second attempt is wrong, the window shows the short solution for that task again. No third attempt follows, and the story moves on.

### Resolved: a spell has three outcomes, and each maps to one review sequence

Proposed by research on 2026-09-26; the owner approves it with this record.

The world bible (CAN-0030) named two spell outcomes, clean and loosened; the specification names three, `clean`, `partial` and `alt`. RES-1700 compares the options and holds the reason for three: the partial verdict already feeds the knowledge model and the room share. For this record the choice means each outcome needs its own review sequence. A correct answer gives `clean`, a partial answer gives `partial` («почти», almost), and a wrong answer or «Не знаю» gives `alt` («ослаблен», loosened). The next finding sets what the window shows after each.

### Resolved: the window shows the correct answer after every first attempt, the knot scheme at once after almost or loosened, and the twin knot only after loosened

Proposed by research on 2026-09-26; the owner approves it with this record.

The world bible (CAN-0030) showed the knot scheme only when a knot loosened, or on request after a clean spell, and said nothing of the correct answer after a clean one. The specification shows the correct answer after every first attempt, the short solution at once after a wrong answer or «Не знаю», and a second attempt after that. Neither said what a partial answer gets. Two options were weighed:

- The bible's rule: the answer and the scheme appear only when the knot loosened. This keeps the window short after a correct answer. But a correct answer given with low confidence stays shaky: Butler, Karpicke and Roediger (2008) found that feedback after a correct answer raises later retention of answers the learner was unsure of.
- The specification's rule: the correct answer after every first attempt, and a fuller review when the answer was not correct. Shute (2008) finds elaborated feedback (the reasoning, not only right or wrong) works better than a bare verdict, and the MVP section, which outranks the rest of the specification, uses this rule. RES-0010 also makes the specification win where the canon disagrees on method.

The specification's rule wins, and a partial answer is placed between the two others:

| Outcome | Correct answer | Knot scheme (the short solution) | Twin knot (second attempt) |
| --- | --- | --- | --- |
| `clean` | shown | free, on request under «Как легла нить» (How the thread lay) | none |
| `partial` («почти») | shown | free, shown at once | none |
| `alt` («ослаблен») | shown | free, shown at once | one, on a parallel task |

A partial answer gets the scheme at once, because it usually has the right method and one unfinished step, such as an unsimplified fraction, and the scheme shows that step. It gets no twin knot, because the twin costs about a minute of a 60-minute adventure and retrains a method she already used. The detailed explanation costs one guiding thread after any outcome.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. After «почти» the knot scheme shows at once and no twin knot follows. An almost answer is nearly right, and a twin would add one more assisted attempt, which the knowledge model reads only as help and which tells it little about what she does alone. Leaving the twin out also keeps the room short.

The bible's draft said the scheme appeared only «если узел ослаб» (if the knot loosened) or on request.


A hint before answering costs one guiding thread and makes the first attempt assisted. The event log records `assisted: true` and the hint level. That attempt feeds the estimate «с помощью» ("with help"), not «сама». Steps 2 to 4 of the sequence, from the correct-answer screen to the second attempt, apply after it.

### Game outcomes count first attempts only, so «Не знаю» earns nothing

The spell outcome, the streak, bonuses, the room's branch and the floor's state are computed only from first attempts. The second attempt doesn't change the share of clean answers in the room. The draft gives the reason: otherwise pressing «Не знаю» to get the walkthrough would pay. A correct second attempt gives the dry line «Нить закреплена» ("The thread is secured") and base experience, with no bonuses.

### The walkthrough and the second attempt stay inside the task window

The walkthrough and the second attempt run in the same task window, with no sprites and no story text.

### Resolved: «Не знаю» is a task-window button on both attempts, and it ends the attempt as the `alt` outcome shown with the word «Принято»

Proposed by research on 2026-09-26; the owner approves it with this record.

Two design questions touch the attempt sequence. Where «Не знаю» lives: RES-0700 compares a keypad key with a task-window button and holds the reason for the button, which is present in every answer form, both attempts included, and sits away from the digit keys so a slip can't end a first attempt. What it shows: RES-1700 compares a separate outcome for «Не знаю» with the one `alt` outcome and holds the reason for keeping one outcome. For this record the choice changes nothing in the sequence: «Не знаю» on a first attempt gives `alt`, the short solution at once and one second attempt, as a wrong answer does. Only the badge differs: `OutcomeBadge` shows «Принято» (Accepted) after «Не знаю» and «Узел ослаблен» (Knot loosened) after a wrong answer.

### Later tasks of the same node that day are flagged as after feedback

The player can learn from a walkthrough within the session. So the next tasks of the same node on that day carry `postFeedback: true`. The knowledge model accounts for this with a learning transition, which the draft places in «Модель знаний v1». The parent's report shows accuracy «до разбора» ("before the walkthrough") and «после разбора» ("after the walkthrough") separately.

### The correct answer appears after every attempt and never before the first

In daily play the correct answer appears after each attempt. Before and during the first attempt the screens show neither the answer nor the solution steps, unless the player spent a guiding thread on a hint.

### Resolved: the server sends the correct answer in the reply to each attempt, and never before the first attempt

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's API section contradicts itself: a comment in `AnswerOut` says the correct answer is not sent, while the same schema and the endpoint table send it (RES-2400). This record's sequence settles it. The answer shows after every attempt, so it must reach the client in the reply to that attempt, as `feedback.correctAnswer`. Fetching it by a separate request was the other option; it keeps the answer off the client a little longer but adds a call that fails offline, and daily play shows the answer anyway. RES-2400 holds the comparison.

### Tasks that hide the answer come later, only in Ascent control forms

Deferred until after the MVP by the draft: tasks that don't show the answer. They will appear only in the control forms of Ascents (Восхождения).

## Conclusions

1. The game must run one mode in the MVP that both trains and measures, with no separate measurement mode.
2. Only a first attempt that used no hint, isn't fast guessing and isn't excluded by the parent may update the estimate of what the player does alone.
3. After a correct first answer, the task window must show the answer as accepted with a dry outcome line, offer the short solution free under «Как легла нить» and offer the detailed explanation for one guiding thread.
4. After a wrong answer or «Не знаю», the task window must show the short solution at once, free and with no extra tap, with engine-built steps, code-substituted numbers and the correct answer.
5. After a wrong first answer or «Не знаю», the game must give exactly one second attempt on a parallel task with the same template, subtype and difficulty features, and no third attempt.
6. The event log must record every second attempt, and every first attempt made after a paid hint, as `assisted: true`, with the hint level where a hint was bought.
7. An assisted attempt must feed the estimate with help and must never feed the estimate of what she does alone.
8. The spell outcome, streak, bonuses, room branch, floor state and room share of clean answers must be computed from first attempts only.
9. A correct second attempt must give only the line «Нить закреплена» and base experience, with no bonus.
10. The walkthrough and the second attempt must stay in the task window, with no sprites and no story text.
11. After a walkthrough, every later task of the same node on the same day must carry `postFeedback: true`.
12. The parent's report must show accuracy before and after the walkthrough separately.
13. The game must show the correct answer after every attempt in daily play, and must show neither the answer nor solution steps before or during the first attempt unless the player paid for a hint.
14. The server must send the correct answer in its reply to each attempt, and must never send it to the client before the first attempt.
15. A first attempt must give one of three outcomes: `clean` for a correct answer, `partial` («почти») for a partial answer and `alt` («ослаблен») for a wrong answer or «Не знаю».
16. After a `partial` outcome, the task window must show the correct answer and the short solution at once, free, and must give no second attempt.
17. «Не знаю» on a first attempt must follow the `alt` sequence exactly, and the task window must show it with the badge «Принято» in place of «Узел ослаблен».
18. After a `partial` («почти») outcome, the task window must show the knot scheme at once and must give no twin knot, as research decided on 2026-09-27 on the owner's instruction, because a twin adds an assisted attempt that tells the model little and lengthens the room.

## Sources

- The owner's draft «Хроники Башни — спецификация», sections «Текущий объём (MVP)» and «Единый режим: тренировка и измерение», read 2026-09-26; not kept in the repository - the attempt sequence, its effect on game outcomes and measurement, and when answers are shown.
- A. C. Butler, J. D. Karpicke and H. L. Roediger III, "Correcting a metacognitive error: feedback increases retention of low-confidence correct responses", Journal of Experimental Psychology: Learning, Memory, and Cognition 34 (2008), pages 918-928, https://pubmed.ncbi.nlm.nih.gov/18605878/, read 2026-09-26 - feedback after a correct answer helps when the learner was unsure.
- V. J. Shute, "Focus on formative feedback", Review of Educational Research 78 (2008), pages 153-189, https://journals.sagepub.com/doi/10.3102/0034654307313795, read 2026-09-26 - elaborated feedback works better than a bare verdict.
