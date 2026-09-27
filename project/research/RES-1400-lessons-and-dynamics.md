---
id: RES-1400
artifact: research
status: approved
revised: 2026-09-26
---

# The draft proposes rechecking lesson topics twice and building dynamics only from checked, unassisted first attempts

## Summary

The owner's draft proposes that the parent marks nodes or subtypes after a lesson, and the Director rechecks them twice: a full block 1-3 days later and another block about 14 days later. The report tells apart improvement after a lesson, improvement without a lesson, and whether the result held two weeks on. Dynamics use only unassisted first attempts from blocks, probes and review, never inferred states. Times compare only on one device type, and a changed template marks the node's comparison as changed. The player sees only game progress, never node states, estimates, percentages or topic names. This record covers lesson marks, how the report tells improvements apart, the dynamics rules and progress for the player. Task selection is in RES-1000, Ascents and anchor forms in RES-1100 and limits in RES-1300.

## The question

How does the parent learn whether a lesson worked, and how does the report show growth without counting drilled or assisted answers? The draft assumes that two rechecks and a 30-day lookback are enough to credit a change to a lesson. A change in a node can also come from practice on its prerequisites or from format familiarity, which the draft can only flag once Ascents exist.

## Method

Read the owner's draft «Хроники Башни - спецификация» (Tower Chronicles - specification), section «Прогресс, повторные проверки и уроки родителя» (Progress, rechecks and the parent's lessons) with its subsections «Метки уроков» (Lesson marks), «Как отчёт различает улучшения» (How the report tells improvements apart), «Правила динамики» (Dynamics rules) and «Прогресс для игрока» (Progress for the player), on 2026-09-26, with the opening lines for context.

The draft leaves these open:

- how a full block for recheck 1 fits the MVP cap of up to 4 parent-topic tasks a day;
- the order of states used to judge "higher" and "worse";
- how wide "about 14 days" is for recheck 2;
- which report label applies when a node improves with a lesson mark on a prerequisite only.

## Findings

### The parent marks lesson topics in the Parent Room

After a lesson the parent marks nodes or subtypes in the Parent Room as «занимались на уроке» (we worked on this in the lesson), with a date and an optional note.

### Each lesson mark triggers two rechecks

- **Recheck 1:** 1-3 days after the mark, the Director raises the node's priority and collects a full block.
- **Recheck 2 (retention):** about 14 days after the mark, another block.
- In the MVP, marked topics also get up to 4 tasks a day in the first 1-3 days after the mark; RES-1000 carries the selection rule.
- Deferred until after the MVP by the draft: if the node falls into the next Ascent, its anchor form goes there too.

### The draft does not say how a full block fits the MVP cap of 4 tasks a day

Recheck 1 asks for "полный блок" (a full block) within 1-3 days. The MVP gives marked topics "до 4 заданий в день" (up to 4 tasks a day) in the same 1-3 days. The draft's budget section notes that filling a block often stretches over 2-3 days inside a block window of 7 days.

### The report tells five kinds of change apart

| Label | Condition |
| --- | --- |
| «Улучшилось после урока» (improved after a lesson) | a lesson mark exists, and the state after it is higher than at the last check before it |
| «Улучшилось без урока» (improved without a lesson) | the state rose with no lesson marks on this node or its prerequisites for 30 days |
| «Сохранилось» (held) | recheck 2 at about 14 days is no worse than recheck 1 |
| «Не сохранилось» (did not hold) | recheck 2 is worse than recheck 1 |
| «Возможно, привыкание к формату» (possibly used to the format), deferred until after the MVP by the draft, with Ascents | the daily estimate rose and the Ascent anchor form did not |

### Dynamics use only checked, unassisted first attempts

- Dynamics use only unassisted first attempts from a block, a probe or review, and later also from Ascents.
- Inferred states never appear in dynamics and are never summed with checked ones.
- Until Ascents exist, dynamics carry the label «без контрольных прогонов: сравнимость ниже» (no control runs: lower comparability).
- Times compare only between tasks on one device type; accuracy compares across any.
- If a template changed, the node's comparison is labelled «контент изменён» (content changed); anchors stay comparable.
- Deferred until after the MVP by the draft: each Ascent is a comparable point on anchor forms. No form difficulty correction is introduced, so Ascent dynamics are aggregates by domain and level; RES-1100 carries the reason.

### The player sees game progress only

The player sees only game progress: levels, characteristics, familiars, the bestiary, story chapters, rank and titles. Trial outcomes appear as story: spell strength, clean rows, branches and floor triumphs. She never sees node states, estimates, percentages or topic names.

## Conclusions

1. The Parent Room must let the parent mark nodes or subtypes as «занимались на уроке» with a date and an optional note.
2. After a lesson mark, the Director must collect a full block on the node within 1-3 days and another block about 14 days after the mark.
3. In the MVP, a marked topic must get no more than 4 tasks a day during the first 1-3 days after the mark.
4. The report must label a node «Улучшилось после урока», «Улучшилось без урока», «Сохранилось» or «Не сохранилось» by the conditions in the table above.
5. «Улучшилось без урока» must require no lesson marks on the node or its prerequisites in the preceding 30 days.
6. Dynamics must use only unassisted first attempts from blocks, probes and review, and must never show or add inferred states.
7. Until Ascents exist, every dynamics view must carry the label «без контрольных прогонов: сравнимость ниже».
8. The report must compare times only between tasks on the same device type, and may compare accuracy across device types.
9. A node whose template changed must have its comparison labelled «контент изменён».
10. The player must see only game progress and story outcomes, never node states, estimates, percentages or topic names.

## Sources

- The owner's draft «Хроники Башни - спецификация», section «Прогресс, повторные проверки и уроки родителя» with its four subsections and the sections «Выбор заданий в MVP» and «Бюджет ежедневной сессии», read 2026-09-26; not kept in the repository - every finding in this record.
