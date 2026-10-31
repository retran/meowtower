---
id: RES-4300
artifact: research
status: approved
revised: 2026-10-31
elaborates: RES-4290
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every template can take a live frame when its buttons stay with the template, and $5 an adventure fits under $200 a month

## Summary

A frame can carry all 1851 templates, because the text a frame replaces and the buttons a task shows can come apart. Budgets of $5 an adventure and $200 a month hold the rule that daily buckets over 31 days stay under the month. This record covers those two questions and the English and Dutch forbidden lists. It updates RES-4290 and doesn't change the model choice.

## The question

The owner asked on 2026-10-31 for frames on every template, forbidden lists in English and Dutch, and budgets of $5 and $200. The assumption behind RES-4290's exclusion was that a frame replaces the whole text a task's buttons are read from. This record challenges it: only the question has to change.

## Method

I read `src/server/task-source.ts`, `src/templates/spec.ts`, `src/shared/voice/gate.ts`, `content/shaming.ru.json`, `content/i18n/` and `canon/CAN-0010-logline-and-tone.md`, and ran each English and Dutch string through the new lists. I read no external source, and no real model call ran.

## Findings

### Buttons can come from the template while the words come from the frame

`present` reads options from the template's text. Computing them from the unframed task and taking only the text from the frame leaves options, input and answer unchanged. A test over all 1851 templates in three languages holds this.

### A task with options states them to the player, so a solver must read them

A choice task can't be solved from its question alone, because the options are part of the task. Listing them unmarked shows the solver what the player sees and no more.

### A picture reaches the solver as its source

Pictures are SVG drawn by code from the drawn numbers. The solver reads the source as text. I didn't measure how well a model reads geometry that way, and a failed solve leaves the task on its template text.

### Templates write numbers of their own

Some template text states a number outside any placeholder, so a frame must keep those and add none. A fixed limit of 22 words also fails a template whose own sentence is longer.

### The budgets add up

($5 + $0.3 + $0.1) x 31 = $167.40, below $200.

### The new lists collide with fixed strings

Run through the lists, 17 English and Dutch strings matched: for example "toets" as a keyboard key and "sum". Those strings were reworded, so the lists stay strict for frames.

## Conclusions

1. A frame must replace only a task's question, and a task's buttons, input and answer must come from the template.
2. A blind solve must show the options a player sees, with none marked.
3. Each language must have its own forbidden list, and the gate must read the list of the game's language.
4. The adventure budget must be $5 and the month's $200.

## Sources

- `src/server/task-source.ts`, `src/templates/spec.ts`, `src/shared/voice/gate.ts`, read 2026-10-31 at commit ff90d3e - how text, buttons and the gate work.
- `canon/CAN-0010-logline-and-tone.md`, read 2026-10-31 - the words the player never sees.
