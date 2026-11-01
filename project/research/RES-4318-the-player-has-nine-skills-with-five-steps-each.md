---
id: RES-4318
artifact: research
status: approved
revised: 2026-11-01
elaborates: RES-4312
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The player has nine skills in game terms, each with five steps that open something new, and a score that shows a whole level and the percentage to the next

## Summary

The owner asked on 2026-11-01 for a coherent set of skills that work in game scenes and not only in tasks, with five levels, progress at every level and something new opening at every level. The nine domains of the skill graph become nine skills, named for what a hunter does with them. A skill's score is continuous and shows as a whole level and the percentage to the next. Each level opens a step: the first lets her try through a check, the second lets her notice, the third act freely, the fourth take a short way and the fifth help others. An encounter lists the skills that fit its obstacle, the Master maps her words to one of them, and the Director picks the task inside the accepted domains, so she cannot avoid a weak skill by choosing her approach. The nodes stay in the Parent Room. The names and the 45 steps are proposals the owner judges; nothing here has been played.

## The question

How does a skill reach a scene? A skill that only labels a task domain adds nothing, so each must offer something to do. Two earlier rules constrain the answer: the Director, and not the player, picks the topic of a check, and a story request names no skill level.

## Method

Read on 2026-11-01: RES-4312, ADR-3220, ADR-3230, ADR-3270 and the requirements REQ-8014, REQ-8096, REQ-8192 and REQ-8392. The canon was not reread; reconciling it is for later, as the owner said. No test ran with a player.

## Findings

### Nine domains are nine skills

| Skill | Russian | Dutch | Domain | Holds |
| --- | --- | --- | --- | --- |
| Marks | «Метки» | Merktekens | N | numbers, place value, order |
| Mechanics | «Механика» | Mechaniek | A | the four operations |
| Sharing | «Дележ» | Verdelen | F | fractions |
| Precision | «Точность» | Precisie | D | decimals, rounding |
| Trade | «Торг» | Handel | P | percentages, ratios, proportion |
| Wayfinding | «Путь» | Pad vinden | M | measures, time, distance |
| Shaping | «Форма» | Vormen | G | shapes, angles, symmetry, area |
| Scouting | «Разведка» | Speuren | S | data, patterns, chance |
| Interpreting | «Толкование» | Duiden | T | word problems |

### The score is continuous and the sheet shows a level and a percentage

[Proposal] For each node with answers, the score is its level plus the fraction of the way from its own line to the next: with the lines at 0.35, 0.6, 0.8 and 0.92, a node on level 2 whose estimate is 0.475 scores 2.5. Level 1 runs from 0 to 0.35, and level 5 from 0.92 to 1.0. A fraction below zero counts as zero. The skill's score is the mean over its answered nodes. The sheet shows the floor of the score as the level and the rest as the percentage to the next, and a skill with no answered node shows as not yet shown. A level in force still comes from the node rules: a node falls only after three answers in a row below its line.

[Inference] The percentage is progress and not the chance of knowing, so it can be shown, and the probability behind it stays hidden.

### Each level opens a step

The ladder is the same for every skill: 1, try through a check; 2, notice; 3, act freely; 4, take a short way or open a gate; 5, help others. A step is a possibility and not a prize: nothing pays an item or a currency for rising.


### Marks, «Метки»

| Level | What opens |
| --- | --- |
| 1 | Reads a label or a number, through a check. |
| 2 | Notices a number that is wrong or swapped. |
| 3 | Reads codes and catalogues freely and finds the right drawer. |
| 4 | Opens code locks and number puzzles with no check. |
| 5 | Teaches others to read marks and spots a forgery at a glance. |

### Mechanics, «Механика»

| Level | What opens |
| --- | --- |
| 1 | Runs a mechanism, through a check. |
| 2 | Notices which part is stuck. |
| 3 | Runs and mends ordinary machines freely. |
| 4 | Bypasses a broken machine with a plan of her own. |
| 5 | Mends a machine for someone else and builds a new device from parts. |

### Sharing, «Дележ»

| Level | What opens |
| --- | --- |
| 1 | Divides a thing, through a check. |
| 2 | Notices that a share is unequal. |
| 3 | Divides fairly among familiars and townsfolk. |
| 4 | Finds a division that leaves nobody aggrieved and settles a dispute. |
| 5 | Mediates other people's quarrels over shares. |

### Precision, «Точность»

| Level | What opens |
| --- | --- |
| 1 | Measures finely, through a check. |
| 2 | Notices a drop too much or too little. |
| 3 | Sets locks, doses and levels freely. |
| 4 | Finds the fine spot in a dam or a recipe. |
| 5 | Teaches others to measure and makes exact things. |

### Trade, «Торг»

| Level | What opens |
| --- | --- |
| 1 | Judges a deal, through a check. |
| 2 | Notices a deal tilted towards the other side. |
| 3 | Trades and swaps fairly, freely. |
| 4 | Finds the favourable swap at the Fair. |
| 5 | Shields the unwary from a bad deal. |

### Wayfinding, «Путь»

| Level | What opens |
| --- | --- |
| 1 | Plans a route, through a check. |
| 2 | Notices a clock or a distance that does not add up. |
| 3 | Plans routes and arrival times freely. |
| 4 | Knows a short way between floors. |
| 5 | Leads a group along a route. |

### Shaping, «Форма»

| Level | What opens |
| --- | --- |
| 1 | Fits shapes together, through a check. |
| 2 | Notices a piece that does not fit. |
| 3 | Builds, folds and fits freely, bridges and doors included. |
| 4 | Unfolds a hidden room from its net. |
| 5 | Helps others build and designs a new structure. |

### Scouting, «Разведка»

| Level | What opens |
| --- | --- |
| 1 | Reads tracks, through a check. |
| 2 | Notices a pattern or an odd one out. |
| 3 | Reads tracks and patterns freely and spots what does not fit. |
| 4 | Foretells where a Tangle will appear. |
| 5 | Teaches others to see patterns and reads a bluff. |

### Interpreting, «Толкование»

| Level | What opens |
| --- | --- |
| 1 | Understands a note, through a check. |
| 2 | Notices what a text leaves out. |
| 3 | Understands rumours, notes and contracts freely and speaks with Guardians. |
| 4 | Finds in a text what others missed, a hidden clause or a missing number. |
| 5 | Explains meanings to others and negotiates for them. |

### A skill meets a scene through the encounter

[Proposal] An encounter lists `accepts`, the skills that fit its obstacle. The Master maps her words to one of them, and where two fit, the Director chooses the domain of the check by need. The Master receives the steps she has opened as things she can do, such as "she reads codes freely", and never a level, a node or an estimate. The scenario writer receives the same kind of fact about what she can do and what she is still learning, so it writes obstacles where her strong skills shine and her weak ones get a gentle reason to grow. A rank scene, a gate and a free action all read the same steps.

### Obstacles follow the plan and the graph

The owner asked that obstacles be chosen with the knowledge graph and the skills in mind. [Proposal] The Director already plans each adventure by what is due: the skills to practise, and whether each is new ground, a review or a parent's topic. The scenario writer receives that plan, told in skills and purposes without nodes, levels or estimates, and writes obstacles whose `accepts` cover it. Code checks that every skill the plan asks for is accepted by some encounter, with at least the planned number of checks, so the Director finds a place for each task it has planned. What she can already do shapes the obstacles too, as in the first finding.

### The first adventure teaches the skills

The owner asked that the first scenario be a tutorial, in which each skill is explained and opened in turn. [Proposal] It is written once by a person, approved by the parent and fixed, because it is the first impression. For each skill it holds a short scene that shows what the skill does, one check on a task of that domain, and the moment the sheet shows the skill. The checks also give each domain its first answers. It is written in general terms here and left to the build to detail.

## Conclusions

1. The player has nine skills, one for each domain, in the names above.
2. A skill's score is the mean over its answered nodes of the node's level plus the fraction to its next line.
3. The sheet shows a skill as a whole level and the percentage to the next, and never a node, an estimate or the chance of knowing.
4. A skill with no answered node shows as not yet shown.
5. Each level from 1 to 5 opens a step, and no step pays an item or a currency.
6. An encounter lists the skills that fit its obstacle.
7. The Director picks the check's domain among the accepted skills by need.
8. The Master receives the opened steps as things she can do, and no level, node or estimate.
9. The scenario writer receives what she can do and what she is learning, as facts.
10. The scenario writer receives the Director's plan in skills and purposes, and code refuses a scenario that leaves a planned skill unaccepted.
11. The first adventure is a fixed tutorial scenario that explains and opens the skills one by one.

## Sources

Read: the repository records under Method. Read 2026-11-01.

### Could not obtain

Evidence that a nine-skill set suits a child of this age, which only play can give. Tried 2026-11-01.
