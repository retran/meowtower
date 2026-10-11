---
id: TSK-0509
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0470
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

Criteria 1, 2 and 3 are partly closed and criterion 4 is closed. The task stays open.

1. `tests/unit/catalogue-check.test.ts`: a template that names a missing subtype fails and names the template and the id, and a catalogue row that names a missing node fails and names the row.
2. Partly closed. `TemplateRefSchema` and `CatalogueRowSchema` refuse a `level` and a `weight`, tested by two fixtures. There's no third fixture: no other content file has a zod schema yet, so a copy of a level in another file isn't tested.
3. Partly closed. `notGeneratable` lists every subtype with no template: 118 on the real file, and `./meowtower graph check` prints the count. The notice `not_generatable` is raised once per new graph version (`tests/integration/graph-start.test.ts`). The loader doesn't mark each subtype `not_generatable` itself.
4. `tests/unit/template-type.test.ts`: the template type holds no `level` and no `weight` field.

Also fixed on the way: a parent notice that can't be written (for example, the default `/data/snapshots` folder on a Mac) is now logged as `notice_unwritable`, and the start goes on. Before this, a new notice could stop the server during the crash test.

Stages, from `meow-checks evidence`:

- format: passed, record 5501c8c5f1b1, current at tree dbf22498a0d6, revision 522, now 523
- lint: passed, record 3c3e85450688, current at tree dbf22498a0d6, revision 522, now 523
- check: passed, record b54471c13af6, current at tree dbf22498a0d6, revision 522, now 523
- test: passed, record e4134100a313, current at tree dbf22498a0d6, revision 522, now 523
- build: passed, record 53881b17ab73, current at tree dbf22498a0d6, revision 522, now 523

## Left alone

What the Director does with a `not_generatable` subtype, which the epic realising ADR-0070 builds, and the templates for the real nodes, which the epic realising ADR-0040 builds.
