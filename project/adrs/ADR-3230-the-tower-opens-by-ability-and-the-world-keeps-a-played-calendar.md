---
id: ADR-3230
artifact: adr
status: approved
revised: 2026-10-31
addresses: [REQ-8036, REQ-8038, REQ-8040, REQ-8042, REQ-8044, REQ-8046, REQ-8048, REQ-8050, REQ-8052, REQ-8054, REQ-8056, REQ-8058, REQ-8060, REQ-8062, REQ-8064, REQ-8066, REQ-8068]
supersedes: []
concerns: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3230. Abilities are keys to gates inside an open Tower, a rank counts every group below it, and the world keeps a calendar of played days

## Decision

The Tower stays open, and 36 gates of seven kinds sit on hatches, passages, secrets, shortcuts and trials. `content/gates.json` lists each gate's kind, place, key and what it opens. A key is an ability level, two abilities of two floors, a graph `stretchGate`, a word-problem level or a rank. Each domain gives a verb in the setting, so a key is a thing she does. What a gate opens she can use again. The map shows closed gates she has seen and each floor's mastery.

The graph's 11 broken subtype edges are repaired. A rank now counts all groups up to its own, so rank D counts 12 nodes in place of 2. A node with no evidence of its own takes a level from nodes that build on it, one level below their lowest, and a tested level replaces it.

A world calendar counts played adventures. Each adventure is a day or a night: nights in the Tower and days in the town. A year has 4 seasons of 3 months of 28 days, 336 world days in all, with the canon's festivals on fixed dates. A skipped real day passes nothing. The parent keeps real dates. A rank scene plays within 3 adventures of qualifying.

Once accepted, the record says this and nothing runs yet. After the plan, she walks a Tower with gates and a calendar on the existing Master. Generated arcs come from ADR-3240. The names of months and verbs in play are the owner's.

## Why

RES-4312 found that CAN-0030 opens every floor, so a gate can only lock what is inside one, and that a key should be a thing she does. It counted rank D at 2 nodes and 11 broken edges, and found that levels ignore inference. The world counts played days because an arc must not move without her. The figures are proposals from RES-4312.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing | No new content | The owner wants levels to open things, and rank D stays broken |
| Lock floors behind abilities, a true metroidvania | Stronger pull | A weak ability would stop the story, which the owner forbids, and the canon opens every floor |
| Seasons on real months | Matches the weather outside | Skipped days would pass plot she never lived |
| Levels with no inference | Simple | A capable child sees level 1 on what she knew years ago |

## What it costs

Someone writes 36 gates and what they open, and verbs in three languages. A calendar in played days drifts from real seasons. Rank D to B becomes harder for a child in a high group, until probes cover old nodes.

## What would reverse it

- She ignores closed gates for a month: the arcs must put wants behind them, or gates move onto stronger rewards.
- A simulated player never reaches rank D in a term of daily play: the shares change.

## Consequences

- ADR-3220's rank rule and `rank.v1` change to cumulative groups, and its story event gains the limit of 3 adventures.
- CAN-0030, CAN-0040, CAN-0070 and CAN-0080 change. CAN-0080's month names become world months.
- ADR-0110 and SPC-0110's calendar counts played days. A chapter runs about 14 played adventures.

## How I will know it was realised

1. A test walks every checkpoint with every gate closed and finds none blocked.
2. A graph check finds no broken edge.
3. A simulation finds a steady player holds rank D for a school year.
4. A test skips 5 real days and finds the world date unchanged.
5. A Playwright test sees a closed gate on the map, opens it by level and finds it open after a fall.

## What this does not settle

- Generated arcs, memory and the ontology: ADR-3240.
- The exact 36 gates, which the content step writes.
- Whether characteristics return; for now none exists.

## Plan

1. Repair the graph's edges and add the check (REQ-8052).
2. Cumulative rank and inferred levels, with their simulation (REQ-8054, REQ-8056, REQ-8068).
3. Gates: content, rule, checks and the walk test (REQ-8036, REQ-8038, REQ-8040, REQ-8042, REQ-8044, REQ-8046).
4. The map (REQ-8048, REQ-8050).
5. The calendar, day and night (REQ-8058, REQ-8060, REQ-8062, REQ-8064, REQ-8066).
