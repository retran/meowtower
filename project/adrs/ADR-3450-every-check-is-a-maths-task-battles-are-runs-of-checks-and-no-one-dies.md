---
id: ADR-3450
artifact: adr
status: approved
revised: 2026-11-15
addresses: [REQ-8448, REQ-1972, REQ-1974, REQ-1976, REQ-1978, REQ-7382]
supersedes: []
concerns: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3450. Every check is a maths task, a battle is a run of checks, and no one dies

## Decision

Every check in the game is a maths task the Director chooses, in a scene, a fight, a catch or a Guardian problem, and its outcome comes from the engine's verdict. A battle is a run of such checks. Each move she makes is a task: a clean outcome lands the move in full, a partial one lands it weakened, and a failed one or «Не знаю» misses. The pet, the move and the element she chooses set what a landed move does and never the task, its numbers or its outcome. The same outcomes and choices against the same opponent always give the same result, with no random draw. A pet whose strength runs out leaves the battle tired and recovers at the next camp, and a failed check costs the heroine health as ADR-3440 says. A beaten opponent retreats, yields, calms down or makes friends. No one dies: not the heroine, not a pet and not an opponent.

Once this is accepted, battles can be built on the same check as every other scene, and the question ADR-3440 left to the owner is settled. What still doesn't work: battles stay outside the first version, as the record already schedules, and nothing of them is built.

## Why

The owner decided on 2026-11-15 that any check is a maths task, that a fight is checks too, and that there is no death, the opponents' included. The record held that a battle depends on tactics alone (REQ-1950), which would make a battle the one place where solving doesn't matter, against ADR-3440's rule that results follow how she solves (RES-4321).

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Tactics alone decide a battle, as the record said | A battle is a pure puzzle with no maths | The owner ruled that every check is a maths task. |
| Checks decide whether a move lands, tactics decide what it does (this) | Solving wins the battle, and choices still matter | A battle takes several tasks, so it is long; the Director's slot rules bound how many. |
| Checks decide everything, with no choices | The simplest rule | The team and the element ring would mean nothing. |

## What it costs

A battle spends several checks, so the Director counts its moves against the adventure's checks, and a long fight can crowd out other scenes. The strongest objection is that a child who solves poorly loses every battle. The answer is that a lost battle takes nothing she holds, her pet recovers at the camp, and the story goes on by another way.

## What would reverse it

- Battles that take most of an adventure's checks, which would call for a cap on moves.

## Consequences

The record withdraws REQ-1950, replaced by REQ-1972, REQ-1974 and REQ-1976. SPC-0140's section on the element ring and battles changes, and the Master's prompt and the critic's rubric state that a beaten opponent never dies.

## How I will know it was realised

1. A battle's move lands in full, weakened or not at all by the check's outcome, and the same outcomes and choices give the same result, in a unit test.
2. A tired pet recovers at the camp, in an integration test.
3. No accepted scenario or Master reply shows an opponent's death, in the critic's rubric and the text gate's tests.

## What this does not settle

- The moves of each pet and the strength of the element ring, which are content.
- How many moves a battle may take.

## Plan

1. Every check is a maths task, and an opponent never dies (REQ-8448, REQ-7382). It touches the Master's prompt and the critic's rubric in `content/story/` and the forbidden-content checklist.
2. Battles as runs of checks, with tactics and tired pets (REQ-1972, REQ-1974, REQ-1976, REQ-1978), when battles are built after the first version. It adds the battle module to `src/game/` and the moves to `content/familiars.yaml`.
