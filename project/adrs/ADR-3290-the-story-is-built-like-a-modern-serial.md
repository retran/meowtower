---
id: ADR-3290
artifact: adr
status: approved
revised: 2026-11-01
addresses: [REQ-8338, REQ-8340, REQ-8342, REQ-8344, REQ-8346, REQ-8348, REQ-8350, REQ-8352, REQ-8354, REQ-8356, REQ-8358, REQ-8360, REQ-8362, REQ-8364, REQ-8366, REQ-8368, REQ-8370, REQ-8372, REQ-8374, REQ-8376, REQ-8378, REQ-8380, REQ-8382]
supersedes: []
concerns: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3290. The story is built like a modern serial, from mythology to scene, and code checks what a field can prove

## Decision

The campaign is a series, an arc a season, an adventure an episode and an encounter a scene. RES-4317's Design section states each level's fields. A campaign opens from a bible with its setting, engine, cast dynamics, pilot synopsis and roadmap, which every generator reads. In short: a campaign holds a logline, theme, heroine's arc, mythology and reveals. An arc holds anchors, a closing question, and adventures of the kinds `mythology`, `case`, `character` and `filler`. An adventure holds lines A, B and C, the 15 beats, a clock, a setup ledger and a fair cliffhanger. An encounter holds a tactical goal, opposition, a turn, subtext and its plants and payoffs.

The loop writes logline, synopsis, treatment and beat sheet in turn, and the critic reads the treatment before encounters are written. A twist is prepared by setups she could have seen, and a major one strikes the heroine's false belief. An arc's ending states whether it closes its question.

A character's library card holds a want, a need, a wound, a false belief, a voice, skills, weak spots, relations and an arc, and the Master reads it when that person is in the scene.

The pipeline runs as a writers' room: an arc lead, a story editor, a staff writer, a script doctor and a keeper of continuity, all on Sonnet, with the parent as showrunner.

The Master's system prompt carries the rules of scene craft, and it may reach a beat another way. Code checks what a field proves, and the critic judges the rest. The world's limits win over craft: nobody dies, a dark night stays short, and a day doesn't end on a fright.

Once accepted, nothing runs yet. After the plan, generators write by this structure and the critic reviews by it.

## Why

The owner asked for modern serial structure on 2026-11-01. RES-4317 records the notes it comes from and what changes for a child.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: three acts only | Simple | No cliffhangers, mythology or lines across episodes |
| Episodes with no links | Easy to skip | The owner wants a long story |
| Strict beats in every encounter | Precise | Her actions must be able to move them |

## What it costs

Larger prompts and schemas, more critic faults and more revisions, so each scenario may cost more than the $0.36 of the first run. A formula can read alike across adventures.

## What would reverse it

- Adventures read as one template in the parent's report for a month: beats become optional.

## Consequences

- ADR-3270's scenario schema and the critic change. `src/story/scenario.ts` renames its beats to the sheet's.
- ADR-3280's studio gains the mythology map and fields at each level.

## How I will know it was realised

1. A scenario missing a cliffhanger's preparation, a clock or a planted setup fails code's check.
2. A test finds a logline with a canon name refused.
3. A verify run of 5 scenarios reports faults by rule and spend.
4. The parent reads a season's outline and finds its reveals build.

## What this does not settle

- The mythology's answers, which the canon holds.
- Premortem: stories become well-built and dull. The critic and parent marks are the only guards.

## Plan

1. Scenario schema, writers' room (REQ-8380), writing stages, checks, prompts and critic (REQ-8368, REQ-8370, REQ-8372, REQ-8374, REQ-8340, REQ-8344, REQ-8346, REQ-8348, REQ-8350, REQ-8352, REQ-8354, REQ-8356, REQ-8358, REQ-8362, REQ-8364).
2. The Master's prompt (REQ-8360, REQ-8382).
3. Arc and campaign levels with generators, the character card and the bible (REQ-8376, REQ-8378, REQ-8338, REQ-8342).
4. Mythology map (REQ-8366).
