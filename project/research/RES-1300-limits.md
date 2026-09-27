---
id: RES-1300
artifact: research
status: approved
revised: 2026-09-27
---

# The draft proposes measuring twelve limits of how the player works from the task log, against fluency thresholds fixed from outside

## Summary

The owner's draft proposes that limits describe how the player works, not single skills, and that every limit comes from the same task log without separate tests. It names twelve limits, from holding steps and endurance to language risk and help, and gives for each how it is measured and what the report shows. Limits are computed per session and smoothed over the last 7 sessions. Fluency thresholds are an external standard of "fluent for the player's age" (kept in `personal/player.md`), adjusted only for the device's input speed, because a threshold fitted to her own times would hide any growth. Thresholds are versioned per device type, and a change of thresholds recomputes the whole history. This record covers limits and fluency thresholds. Task selection is in RES-1000, fatigue and rapid guesses in RES-1100 and dynamics in RES-1400.

## The question

What does the report measure besides node states, and against what standard is speed judged? The draft assumes that one task log carries enough signal to measure working traits such as endurance and anxiety without dedicated tests. That holds only if the log records timings with background time removed and records scratchpad and dictionary use, which the draft asks for but defines in another section.

## Method

Read the owner's draft «Хроники Башни - спецификация» (Tower Chronicles - specification), sections «Ограничения: что измеряем» (Limits: what we measure) and «Пороги беглости» (Fluency thresholds), on 2026-09-26, with the opening lines for context.

The draft leaves these open:

- the catalogue thresholds themselves, which a catalogue in another section holds (RES-1200 carries them; the resolved finding below checks them against published norms);
- how "долгие колебания" (long hesitation) and erasures are measured for anxiety;
- how the phrases «страшно / не хочу» (scary / I don't want to) reach the log;
- how a mistake is classified as conceptual, procedural or computational beyond "by traps and steps";
- what the endurance row's "продление после 45 минут" (extension after 45 minutes) means once the adventure lasts 60 minutes, which the resolved finding below settles.

## Findings

### Limits are traits of the work, measured from the task log

Limits describe how the player works, not separate skills. They all come from the same task log, so no separate tests are needed. In daily play they are computed for each session and smoothed over the last 7 sessions. The data model's event log and `AttemptView` define what is logged per task. Time with the app in the background, paused, in eye exercise or at a rest stop is excluded.

### The draft names twelve limits

| Limit | How it is measured | In the report |
| --- | --- | --- |
| Holding steps | Ladder T1-T4 on numbers from fluent nodes, in daily play through the Guardian and the T nodes' room tasks (the resolved finding below); later, 2 tasks a step in the Ascent | The largest k at which her last 2 unassisted first attempts on k-step problems within 30 days are both correct; the share of answers that are an intermediate step; at which step the mistake happens (step-by-step input) |
| Endurance | Only times-table control facts: 2 at the start and 2 at the end of the adventure (and 2 in each extension). The metric is the median time by point; accuracy is a separate flag | Growth of the median time from start to end by more than 1.5 times; a flag if the last point has mistakes where the first had none; how an extension after 60 minutes looks (the draft said 45) |
| Speed of the basics | Median time of correct answers on A1, A3, A4 and A6a | Seconds a fact; slow and wrong facts (an 8x8 heat map) |
| Mental or written | Tasks with `scratch: allowed` offer a scratchpad (finger, Apple Pencil; on a computer a squared field and a canvas) and paper beside her. The log records whether it was opened and which one (`scratchKind`) | For which nodes accuracy is lower without writing; the scratch work of wrong answers |
| Error type | Classification by traps and steps | Shares: conceptual / procedural / computational / unclassified; triggered misconceptions with their frequency |
| Carelessness | A mistake in a node that is currently «бегло» (fluent), with the answer one digit or one transposition away | Number of cases and in which part of the session |
| Impulsiveness and rapid guesses | Wrong answers faster than 30 % of the fluency threshold; every answer faster than `minMs` (`rapidGuess`) | The share of "too fast" mistakes; the share of rapid guesses by session, in tasks with and without choice, and by part of the session; a flag above 15 % |
| Avoidance | Runs of «Не знаю» (I don't know), 3 in a row, and rest stops offered | Frequency by day and node; an observation, not a grade |
| Anxiety | Runs of `alt` outcomes, rapid guesses growing towards the end of a session, erasures and long hesitation, the phrases «страшно / не хочу» (scary / I don't want to) | Frequency by day; what helped (an easy task, a rest stop); a reason to talk, not a grade |
| Flow | The actual success share by session and by floor against the 70-80 % target; the share of review slots | Whether the corridor held; where the Director lacked fluent nodes for review |
| Language risk | Mistakes in tasks with risk terms where the dictionary wasn't opened | A list of terms and nodes marked «возможна языковая причина» (possibly a language cause) |
| Help | Hints before the answer (level), «Не знаю» on the first attempt, correctness of second attempts, detailed explanations and their reading time | «Решает с подсказкой» (solves with a hint) by node; the share of assisted first attempts; whether reviews help (correctness of the second attempt and of the node's next first attempts) |

### The endurance row assumes a 45-minute adventure, and the owner has set one hour

The endurance row asks the report to show "как выглядит продление после 45 минут" (how an extension after 45 minutes looks). Elsewhere the draft gives the adventure as about 30-45, 40 or 60 minutes. The owner has since decided that the adventure of the day lasts 60 minutes of active time, so an extension starts after 60 minutes.

### Resolved: The endurance row reports the extensions that start after the soft stop at 60 minutes

The owner decided on 2026-09-26 that the adventure lasts 60 minutes and the soft stop comes at 60 minutes of active time. An extension therefore starts after 60 minutes, and research on the same day set each extension at 20 minutes (RES-0300). The owner decided on 2026-09-27 that the game has no daily maximum, so she can choose an extension each time the soft stop returns, and the endurance row reports every extension she takes, however many. The endurance row reports how the control facts of each extension compare with those at the start and the end of the adventure, in place of the draft's "продление после 45 минут". Proposed by research on 2026-09-26; the owner approves it with this record.

### The draft chooses an external fluency threshold over one fitted to the player

The fluency threshold is an external standard of "fluent for the player's age", adjusted only for the device's input speed. It is not fitted to her own times on target nodes. The reason the draft gives: otherwise "fluent" would mean "faster than usual for her", and growth in fluency would not show.

### Thresholds start from the catalogue plus a motor correction

1. **Start.** Thresholds come from the catalogue plus the motor correction from Session 0: the difference between her time for pure input and the reference time, multiplied by the number of key presses in the template's answer.
2. **Fallback: adult calibration.** An adult solves 3 tasks a node in the Parent Room, and the threshold is max(catalogue, 2.5 x the adult's median). This applies if Session 0 has not yet been done on this device type.
3. **Calibration check.** Once a month the player repeats 10 pure-input tasks, as in Session 0, on each device type, and the motor correction is updated as a new version. Only a person changes the catalogue thresholds, for example after the adult session or a clearly wrong threshold, with a new version and a decision record in `project/adrs/` that the owner approves. The draft named an entry in `docs/decisions.md`; RES-2900 holds the reason for the change, resolved by research on 2026-09-26.
4. **Versions.** Thresholds live in the `thresholds` table, versioned and kept separately per device type (iPad / computer). A change of thresholds recomputes the whole history; old states are not lost but get a new version.
5. **The "fast" probe.** Every task must be no longer than `fluencyMs`, not the median.

### Resolved: the T1-T4 ladder runs in daily MVP play, and steps held is the largest k whose last 2 problems within 30 days are both right

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft measures holding steps with "the ladder T1-T4" and reports "the largest k at which both tasks are correct", but the only place it gives 2 problems a step is the Ascent, which it defers. Read that way, the limit would stay empty for the whole MVP. Yet report v1's summary shows a line such as «держит 2 шага» (holds 2 steps) (RES-2300), the data model carries `stepsHeld` (RES-2550), and the day plan gives the Guardian 1 ladder problem on about one floor in three (RES-1000).

Three options were compared:

| Option | Better at | Worse at |
| --- | --- | --- |
| Ladder only in the Ascent | a comparable fixed run of 8 problems | no steps-held value for the whole MVP |
| Daily ladder through the Guardian and the T nodes, 2 problems a step gathered across days | uses problems the day plan already has; no change to the session budget | a step takes 2 or more days to confirm |
| A daily ladder block of 2 problems a step | a fresh value every day | up to 8 problems of 30 to 120 s, about 10 minutes of a 60-minute adventure |

The second option wins, because it fills the limit in the MVP at no cost to the budget the owner has fixed. The rule:

- The ladder runs in daily MVP play. The Guardian gives 1 ladder problem on about one floor in three, with its number of steps set by the ladder-of-the-day rule in RES-1000; T1 to T4 also appear in rooms as ordinary graph nodes, chosen by value.
- Every unassisted first attempt on a k-step word problem counts towards step k, from a Guardian or a room, unless it is a rapid guess or excluded by the parent.
- `stepsHeld` is the largest k at which her last 2 such attempts, both within the last 30 days, are right. A partial answer counts as not right here. `stepsHeld` is null until some k has 2 attempts.
- Stage 0.1 builds only T1 and T2, so the limit can't pass 2 until stage 0.2 adds T3 and T4.

The 2 problems a step keep the draft's measure, and the 30-day window matches the age at which the report calls a node not checked for a long time (RES-2300).

### Resolved: the catalogue's starting fluency thresholds stand, because they agree with published fact-fluency norms for children of 11 to 12

Proposed by research on 2026-09-26; the owner approves it with this record.

The catalogue in RES-1200 gives 3 s for addition to 20 (A1) and table multiplication (A3) and 4 s for table division (A4). Gliksman, Berebbi and Henik (2022) timed 122 Israeli children typing single-digit facts, measured to the first typed digit. Grade 6 averaged 2.7 s for addition, 3.2 s for multiplication and 3.6 s for division; grade 5 averaged 3.7, 4.3 and 4.8 s. The catalogue's times count to «Готово» (Done), so they include one or two more key presses than the study's. A threshold near the grade 6 average is therefore a little stricter than an average child of her age, which is what "fluent" should mean.

I compared this with thresholds fitted to her own times, which RES-1300 already rejects because growth would not show, and with a stricter 2 s, which leaves little room above the input time on an iPad. The catalogue values stand for every node as starting values. The multi-step values (A5 to T4) have no published norm that matches their tasks, so they stay as the draft's expert values, and the adult calibration and the monthly check above are what correct them.

### Resolved: a change to a catalogue threshold is recorded as a decision record in `project/adrs/`, not in `docs/decisions.md`

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft recorded a person's change to a catalogue threshold as an entry in `docs/decisions.md`. The repository keeps its decisions as decision records in `project/adrs/`, which a person approves and the method searches. A separate log beside them was the other option; it is quicker to write but drifts from the record and has no approval step. RES-2900 holds the comparison. The threshold's new version goes into the `thresholds` table as before, and the decision record gives the reason.

### Resolved: the language-risk limit is measured and reported in the MVP, and only the Dutch locale and formats wait for the Dutch layer

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft left unclear whether the language-risk row belongs to the MVP. Its measure needs risk terms, which the template model keys into `lexicon.nl.json` (RES-1200), a file named like the deferred Dutch locale. The options were to measure and report language risk in the MVP, or to defer it with the Dutch layer. Deferring saves writing the glossary and the tap-to-explain hint. The MVP wins, because the player learns maths in Dutch now, so the confusion the limit catches exists from her first adventure. Without the mark, every language error in a Russian task reads as a maths gap. The MVP already runs the Session 0 vocabulary probe (RES-0100) and logs `glossaryOpened` and `termsRisky` (RES-2550), so the limit costs only the glossary content and the hint. The Dutch word in a hint is one line of glossary data beside a Russian task, not a Dutch locale. RES-0800 gives the full comparison. The Dutch task language, formats, curriculum layer and practice test stay deferred.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. The glossary holds every Russian maths term that appears in the task text of an MVP template, which is the union of the templates' `riskyTerms`, not only the four examples. The building agent drafts each Dutch equivalent from SLO terminology, the words the SLO reference framework and its 1F/1S concretisation use, and from common Dutch primary-school maths textbooks, and the parent reviews each entry in the Parent Room before it shows. For this limit that means every term the task text of an MVP template uses can carry the language-risk mark, and no term is left out of the measure. RES-0800 holds the comparison.

### Resolved: report v1 shows all twelve limits as a simplified table, and the anxiety row uses only the signals the log already defines

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft says the limits screen is simplified in the MVP without saying how. RES-2300 compares the options for report v1 and defines the simplified screen: one row for each of the twelve limits, with the current value, the number of sessions behind it and the flag, «мало данных» (too little data) below 3 sessions, and no charts or splits by part of the session. Every limit is measured in the MVP as this record says, so the full screen later adds views, not measures. The one exception is anxiety: erasures, long hesitation and the phrases «страшно / не хочу» have no definition in the log yet (see the method's open points), so the v1 row uses only runs of `alt` outcomes and rapid guesses growing towards the end of a session.

## Conclusions

1. Every limit must be computed from the task log alone, per session, and smoothed over the last 7 sessions.
2. Time spent in the background, paused, in eye exercise or at a rest stop must be excluded from every timing.
3. The full report must show the twelve limits in the table above, each measured and reported as the table states; report v1 shows the simplified rows RES-2300 gives.
4. Avoidance and anxiety must be reported as observations and reasons to talk, never as grades.
5. Endurance must use only times-table control facts, 2 at the start, 2 at the end and 2 in each extension, with median time as the metric and accuracy as a separate flag.
6. The log must record whether a scratchpad was opened and which kind (`scratchKind`), and whether the dictionary was opened on tasks with risk terms.
7. The fluency threshold must be an external age standard adjusted only for device input speed, and must never be fitted to the player's own times on target nodes.
8. The starting threshold must be the catalogue value plus the Session 0 motor correction, and, where Session 0 is missing on a device type, max(catalogue, 2.5 x the adult's median over 3 tasks a node).
9. The game must repeat 10 pure-input tasks once a month on each device type and store the updated motor correction as a new version.
10. Only a person must change catalogue thresholds, with a new version and a recorded decision.
11. Thresholds must be versioned per device type (iPad / computer), and a change must recompute the whole history while keeping the old states under their version.
12. A "fast" probe must require every task to finish within `fluencyMs`, not the median time.
13. The endurance report must describe an extension after 60 minutes, the owner's adventure length, in place of the draft's 45.
14. The T1-T4 ladder must run in daily MVP play through the Guardian's ladder of the day and the T nodes' room tasks, with no ladder block of its own.
15. `stepsHeld` must be the largest k at which her last 2 unassisted first attempts on k-step problems, both within 30 days and neither a rapid guess, are right, and null until some k has 2 attempts.
16. The catalogue's starting fluency thresholds in RES-1200 must stand as the external standard until the adult calibration or the monthly check changes them.
17. Every change a person makes to a catalogue threshold must be recorded as a decision record in `project/adrs/`, approved by the owner, beside the threshold's new version.
18. The language-risk limit must be measured and reported in the MVP, from the Session 0 probe, the term hints and the glossary log, and must not wait for the Dutch layer.
19. Every limit must be measured from the MVP on, and until the log defines erasures, long hesitation and the phrases, the anxiety limit must use only runs of `alt` outcomes and rapid guesses growing towards the end of a session.
20. The language-risk measure must cover every Russian maths term in the task text of an MVP template, through the glossary RES-0800 sets, as research decided on 2026-09-27 on the owner's instruction.

## Sources

- The owner's draft «Хроники Башни - спецификация», sections «Ограничения: что измеряем» and «Пороги беглости», read 2026-09-26; not kept in the repository - every finding in this record.
- The owner's decision that the adventure of the day lasts 60 minutes of active time, relayed 2026-09-26 - conclusion 13.
- Y. Gliksman, S. Berebbi and A. Henik, "Math Fluency during Primary School", Brain Sciences 12(3), 371, 2022, https://pmc.ncbi.nlm.nih.gov/articles/PMC8945962/, read 2026-09-26 - fact response times by grade, typed, to the first digit.
