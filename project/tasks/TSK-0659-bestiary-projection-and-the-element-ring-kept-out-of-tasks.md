---
id: TSK-0659
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-1906, REQ-1940, REQ-1942, REQ-1944, REQ-1946]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The bestiary is a projection of the creatures she met, and the element ring never reaches a task

After this task, the bestiary projection gives a page for each creature met, the share of the shipped roster met, a silhouette for each unmet creature and each habitat by floor, and a dependency check fails the build when outcome, selection or knowledge code imports the element ring.

## Acceptance criteria

1. Given a log in which she met 3 of 6 creatures of the shipped roster, when the bestiary is built, then it holds a page for each of the 3, the share is 50 % as a whole number, and each of the other 3 is a silhouette (REQ-1940, REQ-1942, REQ-1944). Closed by: a unit test over the projection.
2. Given a creature, when its habitat is read, then it is the floor of its element in `familiars.yaml` (REQ-1946). Closed by: a unit test over every roster entry.
3. Given a creature she hasn't met, when its silhouette is drawn, then the code draws it from the alpha channel of its first-stage picture and no separate picture is stored for it (REQ-1944). Closed by: a unit test that renders a fixture picture and compares the silhouette's pixels with its alpha.
4. Given `src/game/` and the selection and knowledge-model code, when the dependency check runs, then it fails when a function in the outcome, selection or knowledge-model code imports the element ring, and the committed code passes; only the scene's strike effect reads it (REQ-1906). Closed by: the check's fixture test and the lint verb's output.
5. Given a player on day 3 and on day 4 of play, when the bestiary is asked, then it is closed on day 3 and open on day 4 (REQ-1940). Closed by: a unit test with both days.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the projection to `src/engine/projections/` like the others and the dependency check to `tools/static-checks.ts`. The bestiary opens on day 4 of play as ADR-0330 amends ADR-0140. The element ring lives in `familiars.yaml` as data, and the strike effect of a scene reads it for how a strike looks.

## Depends on

- TSK-0656 (blocking): the roster, the elements and the first-stage pictures' ids.
- TSK-0651 (not blocking): the day of play it supplies opens the bestiary; tests pass a fixture day number.

The epic realising ADR-0170 supplies the first-stage pictures; tests use a fixture picture.

## Evidence

Not yet.

## Left alone

The bestiary's screen, which the epic realising ADR-0150 owns, and familiar battles, which come after the MVP.
