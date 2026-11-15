---
id: ADR-3460
artifact: adr
status: approved
revised: 2026-11-15
addresses: [REQ-7384, REQ-7386, REQ-8450, REQ-8452, REQ-7388, REQ-8454]
supersedes: []
concerns: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3460. Battles enter the first version, and a harder check holds more tasks

## Decision

The first version includes battles between familiars, fought as runs of maths checks as ADR-3450 sets, together with the ring of elements. Everything else REQ-5078 deferred stays deferred.

A check is one or more maths tasks the Director chooses. An ordinary obstacle holds 1 task, a hard one 2, and a Guardian or an adventure's final obstacle 3. The scenario declares each check's difficulty, and code refuses a scenario whose check has none. A check of several tasks is `clean` when every task is clean, `alt` when more than half are wrong or «Не знаю», and `partial` otherwise, and each task counts in the knowledge model as its own observation, as every task already does.

Once this is accepted, a battle and a hard obstacle are built in the first version on the same check as every scene. What still doesn't work: nothing of it is built, and ADR-3450's line that battles stay outside the first version no longer holds.

## Why

The owner asked on 2026-11-15 to bring battles back into the first version, and said that a check is a maths task or several by the difficulty of the obstacle. ADR-3450 made a battle a run of checks, so battles need no system of their own beyond the moves and the ring.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Keep battles after the first version | A smaller first version | The owner asked for them now. |
| A check is always one task | The simplest rule | A Guardian would weigh as much as a locked door, which the owner rejected. |
| Several tasks by difficulty (this) | A harder obstacle asks for more solving | A check of three tasks takes longer, so the Director counts tasks, not checks, against an adventure's length. |

## What it costs

The first version grows by the battle module, the moves of the six familiars and the ring's data, and these need the owner's approval as content. A hard check takes two or three tasks, so an adventure with many hard obstacles holds more tasks than its checks suggest.

The strongest objection: three tasks for one obstacle can feel like a test inside the story. The answer is that the Master tells each task as a step of the same action, and only the Guardian and the final obstacle take three.

## What would reverse it

- Adventures whose hard checks crowd out the rest of the scenes, which would call for lowering the numbers in the content file.

## Consequences

The record withdraws REQ-5078, replaced by REQ-7384 and REQ-7386, and REQ-8448, replaced by REQ-8450. The scenario schema's checks gain a difficulty, and SPC-0190's scope list, SPC-0140's outcome section and SPC-0460's scenario section change.

## How I will know it was realised

1. A hard check draws two tasks and a Guardian's three, and their verdicts give the outcome by the rule above, in a unit test.
2. A scenario whose check has no difficulty is refused, in a unit test.
3. A battle runs in the first version, judged by the owner at the stage 0.3 acceptance.

## What this does not settle

- How many moves a battle may take.

## Plan

1. A check holds tasks by its difficulty, and their verdicts make one outcome (REQ-8450, REQ-8452, REQ-7388, REQ-8454). It touches `src/story/scenario.ts`, `src/story/check.ts`, `src/server/master-game.ts` and the Director's directed tasks.
2. Battles in the first version (REQ-7384, REQ-7386), built as ADR-3450's plan says.
