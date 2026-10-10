---
id: TSK-0538
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-1024, REQ-1054]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each maths domain gets its floor in any three consecutive adventure days, counting only floors the player completed

After this task, `planDay` builds a route of 3 maths floors, or 4 when the forecast leaves time, that takes first each domain with no completed floor for 2 adventure days in a row, counts only floors read from `floor_outcome`, and gives the Observatory a visit at least once in any 3 adventure days.

## Acceptance criteria

1. Given a 90-day simulation in which every adventure day completes 3 floors, when any 3 consecutive adventure days are read, then each of the 8 domains N, A, F, D, P, M, G and S has had its floor at least once (REQ-1024). Closed by: a unit test over 90 seeded days.
2. Given a domain with no completed floor for 2 adventure days in a row, when the next route is planned, then that domain's floor is in it first; given a domain that went 3 adventure days, then the server logs `domain_window_missed` (REQ-1024). Closed by: a unit test for each case.
3. Given a day on which the player started a floor and stopped, when the window is read, then that floor doesn't count; given a day with no adventure, then it isn't an adventure day (REQ-1054). Closed by: a unit test over `floor_outcome` events and game days.
4. Given the route's remaining places, when they are filled, then they take the domains whose last completed floor is oldest, a domain never completed counting as oldest, and the total value of the domain's nodes breaks ties. Closed by: a unit test.
5. Given heavy domains A, F, D and P and light domains N, M, G and S, when a route is read over 10 days, then heavy and light alternate and the order changes from day to day; the lists are data in `content/director.v1.json`. Closed by: a unit test.
6. Given any 3 consecutive adventure days, when the route is read, then the Observatory holds a visit of a scene and 2 to 3 science questions at least once, each science slot taking the topic from E1 to E5 asked longest ago. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `planDay` to `src/engine/director/`, reading `floor_outcome` events from the epic realising ADR-0140 and the game day from the epic realising ADR-0090. The word problems T have no floor and reach play through the Guardian. ADR-0330 adds routes A and B and ADR-0300 brings a host floor first when the Sources track's window is due; both extend the route this task builds.

Until ADR-0140's epic writes `floor_outcome` for real play, the task runs on fixture events; the schema exists from the epic realising ADR-0020. Which science question fills a slot is ADR-0130's.

## Depends on

- TSK-0534 (blocking): the node values that break ties between domains.
- The epic realising ADR-0140 supplies the `floor_outcome` events and the epic realising ADR-0090 the game day.

## Evidence

Not yet.

## Left alone

The floor's inside, which TSK-0539 builds, the two routes of ADR-0330 and the track window of ADR-0300, and the scene and questions of the Observatory visit, which ADR-0110 and ADR-0130 build.
