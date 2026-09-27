---
id: RES-1000
artifact: research
status: approved
revised: 2026-09-26
---

# The draft proposes that the Director fills room slots by information value, inside a flow corridor and a three-day domain window

## Summary

The owner's draft proposes that the Director fills every room slot from three sources: the frontier, spaced review and the parent's lesson topics. A weighted value formula ranks frontier candidates, and a flow rule keeps the share of successful first attempts near 70-80 % by switching slots between frontier and review. The adventure visits three floors a day, four when time allows, and every one of the 8 maths domains gets its floor at least once in any 3 adventure days. A cold start of 7-10 adventures probes each domain's prerequisite chain from the top down. The draft sizes the day at about 25-35 graded first attempts, but it computes that budget for a 40-minute adventure, and the owner has since set the adventure at 60 minutes of active time and decided that the budget needs no recomputing. The Director plans the volume in advance from the last 5 days' pace and trims rooms in a fixed order when the pace is slow. This record covers task selection and the session budget. Ascents, anchor forms, fatigue and measurement protection are in RES-1100, limits in RES-1300 and lesson marks and dynamics in RES-1400.

## The question

How does the Director choose each task of the adventure of the day so that one short session both measures the frontier and keeps the player succeeding? The draft assumes that one session can serve both aims, with the flow rule changing only the proportion of review and never the choice of a frontier task. That assumption costs measurement: the draft itself says only 9-14 frontier tasks a day remain, so cold start and block collection stretch over several days.

## Method

Read the owner's draft «Хроники Башни - спецификация» (Tower Chronicles - specification), sections «Текущий объём (MVP)» (Current scope, MVP) opening lines, «Выбор заданий в MVP» (Task selection in the MVP), «Выбор заданий в ежедневной сессии» (Task selection in the daily session) and «Бюджет ежедневной сессии» (The daily session budget), on 2026-09-26.

The draft leaves these open:

- how `p(v)`, the expected chance of success, gets its correction for the subtype;
- the recency divisor N for nodes that are neither on the frontier nor fluent;
- whether a node with a lesson mark scores both the recheck term and the parent-topic term of the value formula at once;
- which domains count as heavy and which as light for the floor order;
- the names of the 8 maths domains and of the science topics, which other sections give;
- how many rooms a floor has before trimming, which the section on fighting Tangles gives;
- the session budget for a 60-minute adventure, since every figure in the range assumes 40 minutes; the owner decided on 2026-09-26 that it needs no recomputing (see the resolved finding).

## Findings

### The MVP section outranks the rest of the draft

The draft states that its MVP section wins over any section that contradicts it. Everything outside the MVP is marked «позже, по итогам игры» (later, after seeing the player's play). The draft describes itself as a daily adventure of "about 30-45 minutes" in its opening paragraph and of "about 60 minutes" in the MVP summary.

### The draft gives three lengths for the adventure, and the owner has settled on one hour

The opening paragraph says about 30-45 minutes. The MVP summary says «Одно небольшое приключение в день, около 60 минут» (one small adventure a day, about 60 minutes). The session budget is computed "for an adventure of about 40 minutes". The owner decided after the draft that the adventure of the day lasts one hour, 60 minutes of active time.

### Each room slot comes from one of three sources

| Source | What it is | Share |
| --- | --- | --- |
| Frontier | nodes on the frontier and uncertain nodes, ranked by the value formula | the main part of the slots |
| Spaced review | nodes the player already solved unassisted, repeated about 1, 3, 7, 14 and 30 days after the last unassisted success; after a failure the intervals restart at 1 day | 30-40 % of slots |
| Parent's topics | nodes and subtypes the parent marked after a lesson, «занимались на уроке» (we worked on this in the lesson) | up to 4 tasks a day, in the first 1-3 days after the mark and again about 14 days later |

Spaced review is the main source of slots with a high chance of success.

### The value formula ranks candidate nodes

The Director picks nodes by information value. Translated from the draft:

```text
value(v) =
    2.0 * uncertainty(v)        # normalised to 0..1
  + 1.5 * staleness(v)          # days since lastSeen / N, at most 1;
                                #   N = 7 for the frontier, 14 for "fluent"
  + 1.5 * frontier(v)           # 1 if v is on the frontier
  + 2.0 * recheck(v)            # 1 if a lesson mark's recheck is due
  + 1.5 * escalation(v)         # 1 if a probe is open and a block is needed
  + 1.0 * stretch(v)            # 1 if admitted; at most 2 tasks a day
  + 1.5 * spaced_review(v)      # 1 if the 1/3/7/14/30-day interval is due
  + 1.5 * parent_topic(v)       # 1 if a fresh lesson mark exists (up to 4 tasks a day)
  - 1.0 * recent_shows(v)       # tasks on v in the last 3 days / 5
```

### The draft gives a day plan for the MVP

```text
day_plan (MVP):
    route: 3 floors (4 when time allows) by the three-day window rule
    for each floor on the route: scene -> ungraded warm-up -> mental arithmetic (2)
    rooms: room length of 3-5 tasks is set before the room starts;
           each slot is either "frontier" (greedy by value, 2-5 tasks a node)
           or "review" (a fluent node, see the flow rule), as the flow rule says
    after each first attempt: the correct answer; after alt, a short solution
           and a second attempt
    control facts: 2 at the start, 2 at the end
    Guardian: 1 task of ladder T on about one floor in three; the number of
           steps follows the ladder-of-the-day rule
    Observatory: 2-3 science questions once every three days
    extension (+20 minutes): rooms by value only, no new floors
```

The draft's plan said +15 minutes for the extension; the resolved finding below sets 20.

Mental arithmetic gives 2 tasks a floor in the MVP, and the Guardian appears on about one floor in three.

### A node is on the frontier when its prerequisites are secure

The frontier holds nodes in the state «понимает» (understands), «уточняется» (being refined) or not yet checked. None of their prerequisites may be «не освоен» (not mastered), «понимает» or «отрезан» (cut off). Checked prerequisites must be «бегло» (fluent) or «устойчиво» (stable), inferred states included.

### The flow rule keeps the share of successes at 70-80 %

The target is a session success share of about 70-80 %, counting `clean` as 1 and `partial` as 0.5. For each candidate the Director knows `p(v) = mean(v)`, corrected for the subtype. Before each room slot it computes the running success share over the last 10 graded tasks and the expected share for the rest of the room's plan:

- below 0.70, the slot gets a review task: a node that is «бегло» or «устойчиво» with `p >= 0.85`, the longest-unchecked first, so review also measures retention and counts towards «устойчиво»;
- above 0.80, the slot gets a frontier task (frontier, uncertain, escalations, islands, stretch), where diagnosis gains most;
- inside 0.70-0.80, the slots alternate with about 30-40 % review.

Review tasks are ordinary graded tasks with `purpose: "review"` and carry no mark the player can see. Frontier tasks are still chosen by value, because the flow rule changes only the proportion. Mental arithmetic and control facts usually succeed and count in the running share. The flow rule applies to first attempts.

### The draft chooses honest difficulty over engineered failure

The Director never picks a task to cause a failure. It never keeps a task it knows is too hard for the sake of "balance".

### Every maths domain gets its floor within any three adventure days

The adventure is too short for every domain each day. The window rule: in any 3 consecutive adventure days, each of the 8 maths domains gets its floor at least once, and the Observatory gets at least one short visit. The route comes first from domains missing for 2 adventure days in a row, then from the rest by the total value of the domain's nodes, including due reviews and parent topics. A review whose domain is off the route waits for the next visit to its floor, which the window rule keeps to 2 days at most. The model uses the actual interval.

### The draft contradicts itself on visiting every floor each day

The daily-session section says the Director selects nodes "соблюдая правило «каждый этаж хотя бы коротко»" (keeping the rule "every floor at least briefly"). The MVP section says "все домены в один день не помещаются" (not all domains fit in one day) and replaces that rule with the three-day window. The MVP section outranks the other by the draft's own rule.

### The ladder of the day sets the Guardian's number of steps

The Director takes the estimates for nodes T1-T4. The start is the largest k for which T_k is «бегло» or «устойчиво», inferred included. The first task of the day has k + 1 steps, as a ceiling probe. After a `clean` outcome the next Guardian task that day has k + 2 steps, at most 4; otherwise it has k steps, so the Guardian ends in success more often. If no T node is fluent, the ladder starts at T1. The Ascent ladder is fixed at T1-T4 with 2 tasks each.

### Cold start probes each domain chain from the top down

Cold start lasts the first 7-10 adventures, while at least half of the mandatory nodes are unchecked. The room budget goes to probes down each domain's prerequisite chain: first a typical node of group 7-8, with inference to its ancestors on success, and on escalation a probe to the middle of the chain below, a binary search. In the MVP the probes run inside the three-day window. The flow rule still applies: while estimates are few, the bottom nodes of the chains (N1-N3, A1-A4, F1) serve as review tasks and get checked at the same time. The Guardian ladder starts at T1 during cold start. The ordinary value formula takes over afterwards.

### Floor order, transitions and interleaving spread the load

The floor order alternates heavy and light domains and changes from day to day. Transitions between nodes and domains follow one shared shuffled cycle, so a move to a prerequisite looks like any other move; the section on transitions not revealing direction holds the detail. Tasks of one block may alternate with tasks of a neighbouring node, so fatigue does not fall on one node.

### The draft sizes the day at about 25-35 graded first attempts for a 40-minute adventure

The MVP budget is about 25-35 first attempts an adventure, depending on the player's pace, with a target near 30, plus second attempts after reviews of mistakes. The draft's arithmetic for a 40-minute adventure:

- time for tasks: 40 minutes minus 8 minutes of story, 1 minute of eye exercise and 2 minutes of finale, about 29 minutes;
- of that, reviews, explanations and second attempts: at a first-attempt success share near 75 %, about 7-8 reviews of 40-60 seconds each, about 5-7 minutes;
- that leaves about 22-24 minutes, about 1,350 seconds, for first attempts; a task takes about 1.0-1.5 times the fluency threshold plus 4 seconds of transition, about 26-37 seconds;
- in total about 36-52 tasks with a first attempt, about 8 of them ungraded, so about 28-44 graded; at a slow pace the Director cuts rooms to about 25.

The simulation with timings (stage 0.1) and an adult's session (stage 0.2) are to confirm the estimate.

| Part | Tasks |
| --- | --- |
| Mental arithmetic: 2 x 3 floors | 6 |
| Rooms, frontier: uncertain, stale, frontier, escalations, islands | 9-14 |
| Rooms, spaced review (flow and retention) | 6-10 |
| Parent's topics (rechecks after lessons) | 0-4 |
| Stretch | 0-2 |
| Guardian ladder (T) | 1 |
| Control facts: 2 at the start and 2 at the end | 4 |
| Science (once every three days) | 0-3 |
| **Graded first attempts** | **26-44** (at a slow pace rooms shrink to about 25, keeping the frontier to review proportion) |
| Second attempts after reviews (assisted, outside the unassisted grade) | 5-9 |
| Ungraded: warm-ups after entering a floor and after pauses, easy tasks | 5-8 |

Story takes at most 8-10 minutes an adventure. An extension adds rooms chosen by value; the draft's 15-minute extension held one or two, and the 20-minute one holds at least as many.

### The draft gives three ranges for the number of graded first attempts

The budget opens with "примерно 25-35 первых попыток" (about 25-35 first attempts), target about 30. The arithmetic ends with "≈ 28-44 оцениваемых" (about 28-44 graded). The table totals "26-44". All three assume a 40-minute adventure.

### Resolved: The session budget stays as the draft computed it, and an extension adds 20 minutes

The owner decided on 2026-09-26: the session budget, the minimums of 28 and 25 scored first attempts and the cost estimates don't need recomputing for the one-hour adventure. The 40-minute figures above stay as the draft's estimate. The Director still plans volume from her real pace, and the simulation (stage 0.1) and the adult session (stage 0.2) check the minimums on a 60-minute adventure, which a longer adventure makes easier to meet.

The owner also decided that the soft stop comes at 60 minutes of active time. Research on the same day set each extension at 20 minutes, the MVP section's figure, over the 15 minutes this range gives; RES-0300 holds the comparison. Proposed by research on 2026-09-26; the owner approves it with this record.

### The Director keeps the adventure inside its planned volume

The Director plans the adventure's volume in advance from the pace of the last 5 days and recomputes the forecast before each floor from the actual pace:

- it trims in this order: first the number of rooms on a floor, down to one; then the length of new rooms, down to 3; then it moves the route's fourth floor, if any, to the next day;
- it never trims mental arithmetic, control facts or at least one room on floors with an open probe or escalation;
- if the adventure still does not fit before the soft stop, the game saves it and continues tomorrow from the same place, and the domain window is recomputed from the floors actually completed.

### The draft accepts a smaller frontier budget as the price of reviews and flow

Reviews and second attempts take about a fifth of task time, and the flow rule gives about a third of room slots to review. The draft counts neither as a loss: a review of a mistake is part of consolidation, and spaced review measures retention and moves nodes towards «устойчиво». The information budget for the frontier is about 9-14 tasks a day, so cold start takes 7-10 adventures, and filling a block often stretches over 2-3 days, inside the block window of 7 days. The simulation (stage 0.1) checks that the accuracy of node classification over 30 days does not fall below the thresholds.

## Conclusions

1. The Director must fill every room slot from the frontier, spaced review or the parent's lesson topics, with spaced review at 30-40 % of slots and parent topics at no more than 4 tasks a day.
2. The Director must rank frontier candidates by the weighted value formula, with the weights and terms stated in this record, and give stretch nodes no more than 2 tasks a day.
3. Spaced review must repeat a node about 1, 3, 7, 14 and 30 days after its last unassisted success, and restart at 1 day after a failure.
4. Before each room slot, the Director must compute the running success share over the last 10 graded tasks, counting `clean` as 1 and `partial` as 0.5, and choose review below 0.70, frontier above 0.80 and about 30-40 % review in between.
5. Review tasks must be ordinary graded tasks marked `purpose: "review"`, drawn from «бегло» or «устойчиво» nodes with `p >= 0.85`, longest-unchecked first, and invisible to the player as review.
6. The Director must never choose a task to cause a failure or hold a task it knows is too hard for balance.
7. The route must give each of the 8 maths domains its floor at least once in any 3 consecutive adventure days and the Observatory at least one short visit, taking first the domains missing for 2 days.
8. The route must hold 3 floors a day, or 4 when time allows, and each floor must open with a scene, an ungraded warm-up and 2 mental arithmetic tasks.
9. The Guardian must set its task's number of steps by the ladder-of-the-day rule, starting at T1 when no T node is fluent and during cold start.
10. During cold start, the first 7-10 adventures or while half of the mandatory nodes are unchecked, the Director must probe each domain's prerequisite chain from the top down by binary search, using N1-N3, A1-A4 and F1 as review tasks.
11. The adventure must include 2 control facts at the start and 2 at the end, and science questions (2-3) once every three days.
12. The Director must plan the session budget for an adventure of 60 minutes of active time, the owner's decision, and must meet at least the draft's minimums of scored first attempts; the owner doesn't need the draft's 40-minute figures recomputed.
13. Story must take no more than 8-10 minutes an adventure, and the 20-minute extension must add only rooms chosen by value, never a new floor.
14. The Director must plan volume from the last 5 days' pace, recompute before each floor and trim rooms in the order stated in this record, never trimming mental arithmetic, control facts or the last room on a floor with an open probe or escalation.
15. An adventure that does not fit before the soft stop must resume the next day from the same place, and the domain window must count only floors actually completed.
16. The simulation must show that node classification accuracy over 30 days stays above the thresholds under the reduced frontier budget.

## Sources

- The owner's draft «Хроники Башни - спецификация», opening paragraph and sections «Текущий объём (MVP)», «Выбор заданий в MVP», «Выбор заданий в ежедневной сессии» and «Бюджет ежедневной сессии», read 2026-09-26; not kept in the repository - every finding in this record.
- The owner's decision that the adventure of the day lasts 60 minutes of active time, relayed 2026-09-26 - the adventure length in conclusion 12.
- The owner's decision that the session budget, the scored-attempt minimums and the cost estimates need no recomputing for one hour, and that the soft stop comes at 60 minutes of active time, relayed 2026-09-26 - conclusions 12 and 13 and the resolved finding.
