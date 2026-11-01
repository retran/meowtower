---
id: ADR-3300
artifact: adr
status: approved
revised: 2026-11-01
addresses: [REQ-8394, REQ-8396, REQ-8398, REQ-8400, REQ-8402, REQ-8404, REQ-8406, REQ-8408, REQ-8410, REQ-8412, REQ-8414]
supersedes: []
concerns: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3300. The player has nine skills in game terms, each with five steps that open something new, and a score that shows a level and the percentage to the next

## Decision

The nine domains of the skill graph are nine skills for the player: Marks, Mechanics, Sharing, Precision, Trade, Wayfinding, Shaping, Scouting and Interpreting, with Russian and Dutch names as RES-4318 lists. A skill's score is the mean over its answered nodes of the node's level plus the fraction of the way from its own line to the next. The sheet shows the whole part as the level and the rest as the percentage to the next level, and never a node, an estimate or the chance of knowing. Everyone starts on level 1 at 0 %. A skill with no answered node shows as not yet shown until its first answer.

Each level from 1 to 5 opens a step: try through a check, notice, act freely, take a short way, help others. RES-4318 lists the 45 steps. No step pays an item or a currency. An encounter lists the skills that fit its obstacle in `accepts`, the Master maps her words to one of them, and where several fit, the Director picks the check's domain among them by need. The Master and the scenario writer receive the opened steps as things she can do and what she is still learning, and never a level, a node or an estimate.

The first adventure is a tutorial scenario, written once, approved by the parent and fixed. For each skill it holds a scene that explains it and one check on a task of its domain, and the sheet shows a skill from the moment the tutorial introduces it.

Once accepted, nothing runs yet. After the plan, the sheet shows the skills, scenarios list what each obstacle accepts, and the Master uses the opened steps.

## Why

The owner asked on 2026-11-01 for skills that work in scenes and not only in tasks, with progress and something new at every level. RES-4318 records the set and the formula.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: levels by node | Already built | Nodes are for the parent, and the player sees nothing she can use |
| Level 0 at the start | Marks an empty start | Step 1 is open to everyone, so a start with no skill misleads |
| The player picks the domain of a check | Feels direct | She would avoid weak skills |

## What it costs

Nine names in three languages to write and judge, 45 steps to put in the Master's prompt, and a score the sheet must explain to a child.

## What would reverse it

- The nine names read as school subjects in the player's eyes: they change before anything else.

## Consequences

- REQ-8392, REQ-8014 and REQ-8096 are withdrawn and replaced.
- The scenario schema gains `accepts`, and the writer and the Master get the skills.
- SPC-0140 states the sheet.

## How I will know it was realised

1. A test finds a skill's score rise through a level and its percentage fill and wrap.
2. A test finds the sheet show a level and a percentage and no node name.
3. A test finds a scenario with an encounter that accepts no skill refused.
4. A scan of Master requests finds no level, node or estimate.

## What this does not settle

- The nine names, which the owner judges.
- The wording of the 45 steps in the Master's prompt, which the build writes.

## Plan

1. The skill score and its percentage, with tests (REQ-8394, REQ-8398).
2. The sheet in three languages (REQ-8396, REQ-8400).
3. `accepts` in the scenario schema and prompts (REQ-8404, REQ-8408).
4. The Director's pick among accepted skills (REQ-8406).
5. The Master's opened steps (REQ-8402).
6. The tutorial scenario (REQ-8410, REQ-8412, REQ-8414).
