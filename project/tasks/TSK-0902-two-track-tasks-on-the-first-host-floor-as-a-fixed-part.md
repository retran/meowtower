---
id: TSK-0902
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5912, REQ-5918, REQ-5922]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A host floor carries 2 track tasks as a fixed part of the floor and never as a room slot

After this task, `planDay` puts 2 track tasks on the first S, M, G or P floor of a route, after the warm-up and the mental arithmetic or the Volley and before the rooms, and a floor outside those four domains carries none.

## Acceptance criteria

1. Given a route that holds at least one host floor, when `planDay` builds it, then the first host floor carries exactly 2 track tasks, and a route with no host floor carries none (REQ-5912). Closed by: a day-plan test.
2. Given floors of all nine domains, when the plan is built, then track tasks sit only on S, M, G and P floors, the host domains `content/director.v1.json` lists as data (REQ-5918). Closed by: a day-plan test over the nine domains.
3. Given a host floor, when its parts are listed, then the track tasks come after the warm-up and the 2 mental arithmetic tasks or the Volley and before the rooms, and the number of room slots and their three sources are the same with and without the track tasks (REQ-5922). Closed by: a floor-order test.
4. Given a first host floor that ends before both track tasks are shown, when the game day goes on, then the next host floor of the same game day carries the ones not yet shown; given no host floor left that day, then they lapse; and no game day shows more than 2 track tasks across sessions (ADR-0300). Closed by: a day-plan test with an abandoned floor.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the placement to the Director's `planDay` and `planFloor`, and the host domains to `content/director.v1.json` as data. I chose the first host floor of the route, as ADR-0300 did, because the ceiling counts tasks shown, and a floor the player left after the warm-up gave the player no source to read. When an adventure runs into a new game day and the rest of its plan is recomputed, the recompute plans 2 track tasks on the first remaining host floor.

The trim order never trims a track task, as it never trims mental arithmetic, because a trimmed track task breaks the track window on a short day.

## Depends on

- TSK-0900 (blocking): the track nodes the plan names.
- TSK-0905 (not blocking): the template contract that builds the task; the test here uses a fixture track template until that task lands.

The epic realising ADR-0070 supplies `planDay`, `planFloor`, the slot sources and the trim order. The epic realising ADR-0290 places the Volley before the track tasks.

## Evidence

Not yet.

## Left alone

Which node and subtype the 2 tasks take, and the track window, which TSK-0903 builds. The Dutch probe letters, which come after the MVP with ADR-0430 and follow the track tasks.
