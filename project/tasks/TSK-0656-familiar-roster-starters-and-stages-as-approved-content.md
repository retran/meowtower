---
id: TSK-0656
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-1912, REQ-1914, REQ-1916, REQ-1918, REQ-1920, REQ-1922, REQ-1924, REQ-1926, REQ-1928, REQ-1932, REQ-1948]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The roster is six approved familiars, up to three more when their pictures are chosen, and Session 0 lets her choose and name a starter

After this task, `content/familiars.yaml` lists the six required familiars with their stages and moves, the loader accepts an extra familiar only with every stage picture chosen, and a Session 0 route takes her starter, its name and one or two traits.

## Acceptance criteria

1. Given the roster file, when the loader reads it, then it holds the six required familiars, two for each of Spark, Stride and Crumb, with element, floor, canon name, moves and stages; every entry carries `ownerApproved: true` or the server refuses the file; and a familiar beyond the six other than the three extras of REQ-1922 fails the load check (REQ-1918, REQ-1922, REQ-1948). Closed by: a unit test with the six, a seventh unknown entry and an entry without approval.
2. Given an extra familiar, when it is listed without a chosen variant for every stage picture, then it doesn't enter the roster, and with every picture chosen it enters, so the roster holds six to nine (REQ-1920, REQ-1922). Closed by: a unit test with each state of the pictures.
3. Given each starter and each other familiar, when its stages are read, then a starter has three and every other familiar has its first two, the canon lists three stage names for every roster familiar, and a content check fails a canon with fewer (REQ-1926, REQ-1928, REQ-1932). Closed by: a unit test of the stage counts and the canon check's fixture test.
4. Given Session 0, when the route receives the choice, then only «Пуговка», «Винтик» and «Безешка» are accepted, it asks her to name the starter with the canon name offered first, and it accepts one or two traits from the list in the string files or her own text through the free-text path of ADR-0110, and the Master's story event carries the traits (REQ-1912, REQ-1914, REQ-1916). Closed by: an integration test over the route with an accepted and a refused choice.
5. Given the stage pictures of a familiar, when the person who chooses each picture compares it with the previous stage, then it reads as the same creature (REQ-1924). Closed by: the judgement of the person who chooses the picture, because recognition across drawings is a judgement of looks, recorded when the picture's variant is chosen.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the roster to `content/familiars.yaml` and its loader checks to `src/game/content.ts`. The owner judges each name, creature and term for originality before `ownerApproved: true` is written, so the file never carries an unapproved familiar. The canon gives each familiar three stages; the MVP file lists three for starters and two for the rest, and a third stage arrives later as content. Add the Session 0 route beside the existing session routes and log the choice, the name and the traits.

## Depends on

- TSK-0644 (blocking): the roster is a versioned content file with a schema.

The epic realising ADR-0170 supplies the stage pictures and their chosen variants, the epic realising ADR-0330 the Session 0 screens and the starters' flow, and the epic realising ADR-0110 the naming window and the free-text path. Until they land, tests set the picture flags by hand and call the route directly.

## Evidence

Not yet.

## Left alone

Friendship and evolution, which TSK-0657 builds, the hatching names, which TSK-0658 filters, and the screens of Session 0.
