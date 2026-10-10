---
id: TSK-0826
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0250
closes: [REQ-5434, REQ-5438, REQ-5440, REQ-5446, REQ-5448]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Director draws a surplus or unanswerable subtype per slot from a seeded stream, behind a state gate

After this task, a T1 to T4 slot gets its subtype from `hash(baseSeed, "form")` with `p` at 0.05, the draw reads nothing from her history, and it applies only when the node's ordinary subtypes are at «понимает» or above; the stretch subtypes `G6.blocks` and `S3.missing` wait for «Бегло».

## Acceptance criteria

1. Given 2,000 word-problem slots with the gate open, when the simulation runs, then surplus is 8 % to 12 % of T1 to T3 slots and unanswerable 3.5 % to 6.5 % of T1 to T4 slots (REQ-5434, REQ-5438). Closed by: the simulation's report.
2. Given the same run, when the kind of each slot is correlated with the previous slot's kind at lag 1, then the correlation is within ±0.05 and no function of her history changes the draw (REQ-5440). Closed by: the simulation's report and a unit test that the draw's inputs are the seed and the slot only.
3. Given a node whose ordinary subtypes are below «понимает», when the Director names a T slot on it, then the subtype is ordinary, and given the states understands, understands but needs speed, fluent and stable, inferred states included, the draw applies (REQ-5446). Closed by: a unit test over every state.
4. Given `G6.blocks` and `S3.missing`, when the ordinary subtypes of the node are below «Бегло», then the Director never names them, and at «Бегло» or «Устойчиво» it can (REQ-5448). Closed by: a unit test over every state.
5. Given the two shares set to 0 in `content/thresholds.json`, when the simulation runs, then no surplus or unanswerable slot is drawn and no code changed. Closed by: the simulation's report with a second configuration.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the form draw and the state gate to the Director's slot step, reading `requires` through `src/engine/graph.ts` (TSK-0820). Draw `u` in [0, 1): a T1 to T3 slot is unanswerable when `u < p`, surplus when `u < p + 0.10` and ordinary otherwise, and a T4 slot is unanswerable when `u < p` and ordinary otherwise. The draw applies to every slot that names a T1 to T4 node, a Guardian's or a room's. Put `p`'s 0.05, the 0.10 and the guard's numbers in `content/thresholds.json`.

The draw gives the share while `p` is 0.05. TSK-0827 supplies the halved value.

## Depends on

- TSK-0820 (blocking): the subtype names and the `requires` field.

The epic realising ADR-0070 supplies the Director's slot step and its simulation harness; the epic realising ADR-0060 supplies the node states. Until those epics land, the task runs on a fixture state table and the simulation harness it ships, and it leaves the real states to them.

## Evidence

Not yet.

## Left alone

The refusal guard that halves `p`, which TSK-0827 builds, and the twin, which TSK-0828 builds.
