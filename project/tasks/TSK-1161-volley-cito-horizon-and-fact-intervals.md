---
id: TSK-1161
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-5858, REQ-5864, REQ-6424, REQ-7510, REQ-5824]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Volley's share, fact mix and intervals, the bare count and the school goal follow the settled rules

After this task, the Volley takes its share of floors by the `cito:M7` horizon, a bare scored task counts only when the item builder chose it by format, a Volley's facts keep the settled order, a fact's interval grows from its last restart and `school_goal(v)` is 0 in the MVP. This settles entries 52 and 54 to 59 of ADR-0460.

## Acceptance criteria

1. Given a `cito:M7` horizon that is set, has no entered result and whose date hasn't passed, when floors are planned, then a Volley takes 2 floors in 3, and otherwise 1 floor in 2 whichever horizon is active; given a `horizon_set` that only moves the active horizon's date, then the Volley count isn't restarted, and given another horizon becoming active, then it restarts (REQ-5858). Closed by: a planner test over the four cases.
2. Given a node with templates of both formats, when its bare scored tasks in 30 days are counted, then Volley rows, mental arithmetic and control facts don't count and only a task the item builder chose by format does (REQ-5864). Closed by: a unit test over a log with all four kinds.
3. Given a Volley pick, when it is built, then step 1 gives 3 facts that aren't automatic or all of them when fewer exist, step 3 fills with «вычисляет» facts and then facts never shown, and a shown «не знает» fact gets a place only in step 1 or step 4 (REQ-6424). Closed by: a unit test over a pool with 2, 3 and 6 non-automatic facts.
4. Given a fact answered wrong or slower than its threshold, when it returns, then it returns the next game day with its ladder restarted at 1 day, and each right answer within the threshold after that returns it at a longer interval than the one before, up to 14 days and then every 14 days (REQ-7510). Closed by: a unit test over a sequence of wrong, right, right, right and wrong.
5. Given the MVP build, when the Director's value of a node is computed, then the `school_goal(v)` term is 0 and the Cito panel shows no goal list, and the goal routes are `GET /api/parent/school/goals` and `POST /api/parent/school/goals/import` (REQ-5824). Closed by: a unit test of the value and a route-table test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply entries 52 and 54 to 59 as written. Goals the parent enters, their import and `src/engine/school/keys.ts` wait for ADR-0310's part after the MVP, so this task writes only the term at 0 and the route names, and adds nothing else of the goal list.

## Depends on

Nothing. The epics realising ADR-0290 and ADR-0310 own the Volley and the goals; this task runs on their fixtures.

## Evidence

Not yet.

## Left alone

The goal list, its import and its mapping, which ADR-0310's part builds, and the Volley's own step 1 and step 4 rules, which ADR-0290 owns.
