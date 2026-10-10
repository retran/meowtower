---
id: TSK-0893
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5858]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A Volley takes the place of the mental arithmetic on 2 floors in 3 before M7 and 1 in 2 after, counted across days

After this task, `planFloor` gives a maths floor a Volley or its 2 mental arithmetic tasks by a deficit rule that counts floors across game days, and the fact stage's daily set holds as many Volley pairs as fit into 12 minutes.

## Acceptance criteria

1. Given blocks 1 and 2 hold a fact that isn't automatic and `cito:M7` is set, has no result and its date hasn't passed, when 30 simulated days of 3 floors and 30 of 4 floors are planned, then Volleys sit on 2 of every 3 counted floors across days, the first six floors run Volley, mental arithmetic, Volley, Volley, mental arithmetic, Volley, and never more than 2 of any 3 consecutive maths floors carry one (REQ-5858). Closed by: a floor test over the 60 simulated days.
2. Given a result for `cito:M7`, or its date passed, when floors are planned from the day it changed, then Volleys sit on 1 of every 2 counted floors; given a `horizon_set` that only moves the active horizon's date, then the count carries on (REQ-5858). Closed by: the same test with the horizon changed and moved.
3. Given every fact of blocks 1 and 2 automatic, when floors are planned, then no floor carries a Volley and each keeps its 2 mental arithmetic tasks (REQ-5858). Closed by: the floor test on a fixture with all facts automatic.
4. Given a maths floor, when it is planned, then it runs the entry scene, the unscored warm-up, either 2 mental arithmetic tasks or one Volley, the Sources track's tasks on a floor that carries them, 1 or 2 rooms, sometimes a Guardian, then the floor chest (ADR-0290). Closed by: a floor-order test.
5. Given the fact stage's day, when its set is sized, then it holds Volleys of 10 facts, each followed by one single fact task from the stage 0.1 templates, as many pairs as fit into 12 minutes at the median pair time of the last 5 game days, at least 1, and 3 before any pair has been timed (ADR-0290). Closed by: a sizing test over fixture pair times.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Count the maths floors on which a Volley could run: floors from the day the Volley opened, while blocks 1 and 2 hold a fact that isn't automatic. The count starts when the active horizon last became another horizon, and at the first such floor for a default horizon. A floor gets a Volley when `volleys_so_far < round_half_up(share * (floors_so_far + 1))`, where both counts leave out the floor being planned and `share` is 2/3 or 1/2. I chose 1/2 for "fewer" after M7, as ADR-0290 did, because it is the smallest step down from 2/3, and the count crosses game days, because a count that restarted each day would round 1/2 up to 2 of 3 floors on a day of 3 floors.

A Volley counts as mental arithmetic, so the day plan never trims it. Volley rows are observations of their node for the estimate and for fluency, and they never enter a full block of 5 observations or a probe; the flow corridor counts a Volley as one entry scored by its share of hits, and it counts as 2 graded first attempts toward the minimum of 28.

## Depends on

- TSK-0891 (blocking): the Volley the floor places.
- TSK-0885 (blocking): the active horizon, its date and its result.

The epic realising ADR-0070 supplies `planDay`, `planFloor` and the trim order. The epic realising ADR-0330 sets the game day on which the Volley first opens; until it exists the Volley opens on the second day of play.

## Evidence

Not yet.

## Left alone

The Sources track's tasks on the floor, which ADR-0300's epic places, and the Dutch probe letters, which come after the MVP with ADR-0430. The corridor, the window and the stretch cap with the Volley in the plan, which TSK-0895 simulates.
