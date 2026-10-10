---
id: TSK-0615
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0120
closes: [REQ-0602, REQ-0604, REQ-0606, REQ-0636]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Explainer writes as her familiar about her answer and its trap, and the Explainer never appears in the world

After this task, the explainer hook of the play routes asks `EXPLAIN_MODEL` through the checks of TSK-0612 to TSK-0614, the request holds her familiar's kind, name, traits and sample lines with her answer and any matched trap, every line shows under the familiar's portrait with no speaker field, and nothing a player sees names the Explainer.

## Acceptance criteria

1. Given a task, a wrong answer and a matched trap, when the request is built, then it holds the task text as shown, the solution graph and answer, her answer, the trap with the engine's calculation, the error class, and the familiar's kind, name, traits and sample lines, and no node id, estimate, history, time or name of the player (REQ-2604's content for this caller). Closed by: a unit test over the request.
2. Given a passing reply, when it is shown, then it is a familiar's lines with no speaker field and no second voice, and the text names nobody, so the familiar says «ты» (REQ-0602). Closed by: a schema test and a unit test with a reply that adds a speaker.
3. Given a static search of the content strings, the stored variants and the player's screens, when it runs, then none holds «Объяснитель» or "Explainer" (REQ-0636). Closed by: a static check and its failing fixture.
4. Given 50 visible variants at stage 0.2 acceptance, when the parent reads them, then the parent judges that each is in the familiar's voice against its traits and sample lines (REQ-0602), addresses the answer she gave (REQ-0604) and, where a trap matched, that trap (REQ-0606), and that none names a wrong operation. Closed by: the parent's judgement of the sample, because voice and aim are readings that no check measures.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `ExplainRequest` builder and the model's prompt, with a prompt version, under `src/server/explainer/`, and plug it into the `explainer` option of `mountPlay`. The prompt tells the model to write the explanation with placeholders for every number and to name nobody, because a cached text holding a name breaks when she renames her familiar. Choice made in ADR-0120: the group key gains the kind of answer, and `{given}` is empty after `dont_know` and `insufficient`.

## Depends on

- TSK-0612 (blocking): the reply passes its checks.
- TSK-0613 (blocking): the reply passes its forbidden-word and safety checks.
- TSK-0614 (blocking): the reply passes the blind solve.

The epic realising ADR-0100 supplies the request class and the thread-spent lookup; the epic realising ADR-0150 renders the lines under the familiar's portrait. Until then the route returns the lines in the existing `ExplainOut` shape.

## Evidence

Not yet.

## Left alone

The cache and the rotation, which TSK-0616 builds, and the choice of model, which the bake-off record of ADR-0100 settles.
