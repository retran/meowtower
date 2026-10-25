---
id: TSK-1198
artifact: task
status: done
revised: 2026-10-24
epic: EPC-0480
closes: [REQ-1232]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The 7 nodes of domain G have templates for every subtype and answer kind

After this task, each of the 7 nodes of domain G (1 at stretch) has at least ten templates for every subtype and answer kind the catalogue gives it, with its text in the per-language file and no string in the code (ADR-0490, REQ-1232).

## Acceptance criteria

1. Given the nodes of domain G, when `./meowtower graph check` lists the subtypes without a template or with fewer than ten, then none of them is a subtype of domain G. Closed by: the command's output.
2. Given each template of domain G, when `npm run verify:templates` runs it, then it shows no invalid parameters, no disagreement with the reference solver, no equal traps and no text that breaks the text rules. Closed by: the verification run's report.
3. Given a template of domain G, when its text is read, then every player-facing string comes from the per-language file through the typed function. Closed by: the lint run's `no-literal-string` result.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the templates of domain G in the template catalogue, following RES-1200 for each subtype's answer kinds, and run the verification on them.

## Depends on

- TSK-0676 (blocking): the typed string function that task text and keys go through.
- TSK-1192 (not blocking): the first domain settles the template conventions the others copy.

## Evidence

The 101 templates of domain G are in src/templates/g1.ts to g4.ts, written with the short form of src/templates/kitc.ts, with their strings in content/tasks-g.ru.json. Closed by tests/unit/templates.test.ts (ten or more templates for each of the 9 subtypes, 200 seeds for each template) and by `npm run verify:templates` on 10,000 seeds for each template. `./meowtower graph check` lists none of the 9 subtypes of domain G as thin or without a template.

No template draws a picture: each describes its figure in words, because the template contract has no picture field yet. A coordinate answer is a pair, a set answer names its options by number, and a choice names its option by number, because the option texts stay in the per-language file and no Russian text may sit in the code. The subtypes G2, G4 and G7 had fewer than ten forms in the sources RES-4285 lists, so some of their templates are forms of my own that follow the Dutch goal of the group; the angle measure, the centre symmetry, the coordinate plane and the faces, edges and vertices of solids are extensions, tagged as such.

## Left alone

The other domains, and the checks that read the templates, which EPC-0470 owns.
