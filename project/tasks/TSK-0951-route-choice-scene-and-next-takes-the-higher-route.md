---
id: TSK-0951
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6234, REQ-6240]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A story scene offers the two routes, and «Дальше» takes the route of higher total value

After this task, each new adventure plays a `route_choice` scene straight after «В прошлый раз…» (Last time…) and its daily quests, the Master writes one teaser for each route, the doors appear in an order drawn from the adventure seed, «Дальше» (Next) takes the route of higher total value, and the log holds `route_offered` and `route_chosen`.

## Acceptance criteria

1. Given 100 adventure seeds, when the choice scene is drawn for each, then the display order of the doors varies with the seed and route A stands on each side on between 40 % and 60 % of the 100 days (REQ-6234). Closed by: a replay test.
2. Given the adventure of a day on which daily quests haven't opened and one on which they have, when the plan is read, then the order is «В прошлый раз…», the quests only once open, the choice, 3 floors or 4, and a finale that ends on a cliffhanger (REQ-6234). Closed by: a day-plan order test for day 2 and day 3 of play.
3. Given the choice scene, when she presses «Дальше», then the game takes whichever of A and B has the higher total value by the Director's ranking and A on a tie, and logs `route_chosen` with `via: "next"`; when she taps a door, then it logs `via: "choice"` (REQ-6240). Closed by: a unit test with three fixture totals, a tie included, and a route test.
4. Given a teaser reply that fails twice, or the gateway off, when the scene is drawn, then each door shows the library teaser of its route's first floor (`route_teaser_fallback`), and given a resumed adventure, then it keeps the chosen route and only that route's floors count in the three-day window. Closed by: a test with a gateway stub, and a resume test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the order kind `route_choice` and its scene. The choice is a plot choice, so its options send on a tap and the scene holds its `choices` and no free-text field. The Master's teaser comes from the route's floor keys and opening beat. The route's teasers reach the Director only as the chosen `routeId`, which a lint rule enforces. Each floor needs a hand-written library teaser; the owner writes the content, and until it exists the fallback shows a placeholder line from the string file.

The display order is drawn from the adventure seed, because a route A that always stood on the left would teach her that the left door holds the maths the Director wants (a choice ADR-0330 records). Append `route_offered` with `displayOrder` and `route_chosen`.

## Depends on

- TSK-0950 (blocking): it returns the two routes this scene offers.
- TSK-0952 (blocking): it fixes the reply schema so that `choices` is admitted on `route_choice` and `name_suggest` only, which this scene's reply uses.

The epic realising ADR-0110 supplies the scene order, the Master's reply path and the library; until it exists the task runs on the stand-in scene layer, and the real Master's wording of a teaser stays with that epic and the owner's content.

## Evidence

Not yet.

## Left alone

The strange starter, the schedule of quests, which ADR-0140 owns, and the Interest section's count of `via: "next"`, which TSK-0962 reads.
