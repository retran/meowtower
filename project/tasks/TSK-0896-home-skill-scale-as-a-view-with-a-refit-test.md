---
id: TSK-0896
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5876, REQ-5878, REQ-5880]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The home skill scale is a view that changes no estimate, says it is not a Cito score and refits on pupils who grow

After this task, `src/parent/scale/` computes a weekly ability for each domain and overall from the log, no module of the engine can import it, its reply carries the label «домашняя шкала — не балл Cito», and `tools/fit-scale.ts` writes a new scale version only from a refit that recovers simulated growth.

## Acceptance criteria

1. Given a 30-day random log, when the scale is computed and when it isn't, then every `node_estimates` and `node_snapshots` row and every Director value is byte-identical; given a fixture file in `src/engine/` that imports `src/parent/scale/`, then the lint rule fails and names it (REQ-5876). Closed by: a property test and the lint rule's fixture test.
2. Given the unassisted first attempts of the last 30 days, when θ is estimated for a domain, then it is the expected a posteriori value under a standard normal prior on 41 quadrature points and matches a reference value in the test; given fewer than 20 such attempts in a domain, then the reply says «мало данных» for it (ADR-0290). Closed by: a unit test against a reference posterior.
3. Given the scale's reply, when it is read, then it carries the label «домашняя шкала — не балл Cito», the weekly θ with ticks at the mean `b` of the templates of each typical group, and the entered Cito results beside it with no conversion; given the OPLM entry marked «не подтверждено», then the reply carries that mark beside the label (REQ-5878). Closed by: a reply test with a confirmed and an unconfirmed entry.
4. Given simulated pupils whose ability grows during the simulation, when `tools/fit-scale.ts` refits the item difficulties, then they come back within a root mean square error of 0.3 logits and each pupil's ability gain within 25 % of the true gain; given a fixture refit with one θ for the whole run, then it fails the same test (REQ-5880). Closed by: the refit test in group 3.
5. Given a refit that fails the test or doesn't converge, when the owner runs the tool, then `scale_refit_rejected` is reported, no `content/scale.vN.json` becomes active and the scale keeps the feature formula or the version it had (REQ-5880). Closed by: a tool test with a failing fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/parent/scale/`: a Rasch model over the log that gives each template and difficulty feature an item difficulty `b` from the feature formula in the MVP's records, or from the active `content/scale.vN.json`. It feeds no estimate, state, obligation or choice. Add the lint rule that fails any import of it from `src/engine/`.

Add `tools/fit-scale.ts`. It estimates one θ per player-week tied by a random-walk prior and shrinks each `b` towards its feature formula; a single θ would absorb the player's growth into the items and draw a flat line. It writes `content/scale.vN.json` by the owner's command only, within 10 minutes on the family Mac, and it never runs by itself.

The timeline that draws the scale and the results as series comes after the MVP with ADR-0310.

## Depends on

- TSK-0884 (not blocking): the `cito_rules` marks that criterion 3 reads; the test here writes fixture entries, and the real file arrives with that task.

## Evidence

Not yet.

## Left alone

Activating a refitted version, which the owner does by hand after the test passes. The Cito entry for OPLM, which TSK-0884 supplies; this task reads its mark.
