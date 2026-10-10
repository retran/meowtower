---
id: TSK-0509
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0050
closes: [REQ-0852, REQ-1244]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The build fails on a template that names a subtype the graph lacks and on a second copy of a level or weight

After this task, a template or a row of `content/catalogue.yaml` that names a node or subtype the graph doesn't hold fails the build, every other content file's schema has no level or weight field for a subtype, and a graph subtype no template generates is marked `not_generatable` and listed.

## Acceptance criteria

1. Given a template that names a subtype the graph lacks, when the build runs, then it fails and the message names the template and the missing id; given a catalogue row that names a missing node, then it fails naming the row (REQ-1244). Closed by: a mutation test with one template and one row.
2. Given a template module that declares a `level` and a catalogue row that carries a subtype `weight`, when the strict schemas load each, then each fails; given a copy of a level in another content file, then that file's schema fails too (REQ-0852). Closed by: a mutation test with three fixtures.
3. Given a valid graph in which one subtype has no template, when the graph loads, then that subtype is marked `not_generatable`, `./meowtower graph check` lists it, and the Parent Room's notices list it once for the graph version. Closed by: a unit test and the command's output.
4. Given a template, when it reads a node's level or a subtype's weight, then it gets them from `src/engine/graph.ts` and holds neither. Closed by: a type test that the template module type has no `level` and no `weight` field.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the subtype-exists rule to the build checks the epic realising ADR-0040 built, so the checks read the graph's query module and fail on a missing node or subtype. Remove `level` and `weight` from the template module type and make the strict zod schema of every other content file reject a subtype level or weight. Add the `not_generatable` mark to the loader and list it in `graph check` and the parent's notices.

The templates written for the stand-in until the real nodes have templates name no real subtype, so until the epic realising ADR-0040 writes templates for real nodes, the check runs on the fixture templates against the small test graph and on the real file with every subtype listed as `not_generatable`.

## Depends on

- TSK-0500 (blocking): the loader and the query module the checks read.
- The epic realising ADR-0040 supplies the template module type and the catalogue; this task changes both and runs against its fixture templates until real ones exist.

## Evidence

Not yet.

## Left alone

What the Director does with a `not_generatable` subtype, which the epic realising ADR-0070 builds, and the templates for the real nodes, which the epic realising ADR-0040 builds.
