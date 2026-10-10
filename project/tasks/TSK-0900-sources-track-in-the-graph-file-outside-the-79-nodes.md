---
id: TSK-0900
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5900, REQ-5902]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The graph file holds the Sources track as five nodes outside the 79 maths nodes

After this task, `content/graph.yaml` has a fourth part, `tracks`, that holds the track `sources` with the nodes I1 to I5, each with four subtypes and no Cito block, and the validator and `src/engine/graph.ts` keep the track apart from the 79 maths nodes.

## Acceptance criteria

1. Given `content/graph.yaml`, when `./meowtower graph check` runs, then it reports 79 maths nodes in nine domains and a `sources` track of I1 to I5, each with `citoBlock: null`, no domain and no level (REQ-5900, REQ-5902). Closed by: the command's output.
2. Given each of I1 to I5, when the validator reads its subtypes, then it finds exactly `find`, `compare`, `calculate` and `combine`, each at weight 0.25; given a fixture that drops I4, adds an I6, drops a subtype or sets a weight of 0.3, then the file fails to load (REQ-5900). Closed by: the validator's test with the four fixtures.
3. Given a fixture track node that carries a `level`, a `domain` or a prerequisite field, when the schema reads it, then it refuses the field, so the file can't express an edge between a track node and a maths node (REQ-5900). Closed by: a schema test.
4. Given the graph module, when the Director's code asks for the maths nodes, then it gets 79 and no track node, and a separate call returns the five track nodes (REQ-5900). Closed by: a unit test of `src/engine/graph.ts`.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `tracks` to the file's schema, with one track `sources` that holds I1 tables, I2 charts, I3 timetables, I4 maps and I5 two sources together. A track node has an `id`, a name key into the string file, `citoBlock: null` and four subtypes, one for each question level. I chose all four subtypes on every node, I5 included, as ADR-0300 did, because a combine question can join two parts of one table and a find question can point into one of two sources, so no level is empty on any node. I also chose equal weights of 0.25, because RES-4090 gives no reason to weigh one level above another.

The validator keeps its count of 79 maths nodes in nine domains and adds one rule: the `sources` track holds exactly I1 to I5, each with the four subtypes at 0.25. Expose the track nodes in `src/engine/graph.ts` apart from the maths nodes, because the knowledge model and the Director read them only through that module.

## Depends on

Nothing. The epic realising ADR-0050 supplies the loader and the validator this task extends; until it exists the task runs against a fixture graph and adds the part to the schema that epic ships.

## Evidence

Not yet.

## Left alone

The track's rows in the knowledge model, which TSK-0901 adds. The track's templates, which TSK-0914 and TSK-0915 write.
