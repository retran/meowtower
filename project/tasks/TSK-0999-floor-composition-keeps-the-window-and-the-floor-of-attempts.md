---
id: TSK-0999
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-0800, REQ-0806, REQ-0814, REQ-0830, REQ-1024, REQ-1040, REQ-1050, REQ-5914, REQ-6400]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Director visits every domain in 3 days, takes a host floor first when the Sources window falls due and never trims an adventure below 25 graded attempts

After this task, the route puts an overdue domain first except for a host floor the Sources window brings forward, fills the other places with the domains whose last completed floor is oldest, opens each floor with two mental arithmetic tasks from two different templates, and never trims an adventure below 25 planned graded first attempts.

## Acceptance criteria

1. Given a 90-day simulation of 3 completed floors a day, when every 3 consecutive adventure days are read, then each of the 8 floor domains has a floor in them (REQ-1024). Closed by: the simulation's window test.
2. Given a day on which the Sources track's window is due and no due domain is a host domain, when the route is built, then a host floor comes first, the due domains follow, and a domain that missed its place comes first on the next route (REQ-6400, REQ-5914). Closed by: a planner test on a fixture day and the simulation's Sources-window test.
3. Given a forecast that doesn't fit before the soft stop, when the Director trims, then it cuts rooms to one, then new rooms to 3 tasks, then moves the fourth floor, and never leaves fewer than 25 planned graded first attempts; an adventure that still doesn't fit plays to the soft stop and resumes (REQ-1040, REQ-1050). Closed by: a trim test and a simulation check that no completed adventure holds fewer than 25 graded first attempts.
4. Given a floor's two opening mental arithmetic tasks, when a node offers two or more mental templates, then they come from two different templates with their own seeds, and when it offers one, the second task takes the next node by value (REQ-0830). Closed by: a generator test over fixture nodes with one and with two templates.
5. Given the graph file, when an edit keeps the 79 nodes of the counts in REQ-0800, the 17 levels of REQ-0814 and the stated levels of the correction table, then the validator passes with no code change, and any edit that breaks them fails the validator (REQ-0800, REQ-0806, REQ-0814). Closed by: a validator test over one passing and three failing edits.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the route builder as the amended ADR-0070 lines say: the fill order by oldest completed floor with total value breaking ties, a domain never completed counting as oldest, the host-floor exception for the Sources window and the trim floor of 25. Change the floor's opening tasks as the amended ADR-0040 says. Leave the graph validator's counts and levels as they are and add the failing-edit fixtures, because entry 10 only confirms that REQ-0806 reaches edits which keep REQ-0800 and REQ-0814.

## Depends on

Nothing in this epic. The epics realising ADR-0050, ADR-0070, ADR-0040 and ADR-0300 supply the graph file, the route builder, the templates and the host-floor rule; until they exist, the tests run on a fixture graph of 8 domains and a fixture Sources window, and the real nodes are left to those epics.

## Evidence

Not yet.

## Left alone

Raised mode, the review share and the stretch blocks, which TSK-1000 changes in the same planner.
