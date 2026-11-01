---
id: TSK-1194
artifact: task
status: done
revised: 2026-10-24
epic: EPC-0480
closes: [REQ-1232]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The 8 nodes of domain F have templates for every subtype and answer kind

After this task, each of the 8 nodes of domain F (0 at stretch) has at least ten templates for every subtype and answer kind the catalogue gives it, with its text in the per-language file and no string in the code (ADR-0490, REQ-1232).

## Acceptance criteria

1. Given the nodes of domain F, when `./meowtower graph check` lists the subtypes without a template or with fewer than ten, then none of them is a subtype of domain F. Closed by: the command's output.
2. Given each template of domain F, when `npm run verify:templates` runs it, then it shows no invalid parameters, no disagreement with the reference solver, no equal traps and no text that breaks the text rules. Closed by: the verification run's report.
3. Given a template of domain F, when its text is read, then every player-facing string comes from the per-language file through the typed function. Closed by: the lint run's `no-literal-string` result.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the templates of domain F in the template catalogue, following RES-1200 for each subtype's answer kinds, and run the verification on them.

## Depends on

- TSK-0676 (blocking): the typed string function that task text and keys go through.
- TSK-1192 (not blocking): the first domain settles the template conventions the others copy.

## Evidence

The 144 templates of domain F are in src/templates/f1.ts to f3.ts, written with the short form of src/templates/kitf.ts, with their strings in content/tasks-f.ru.json. Closed by tests/unit/templates.test.ts (ten or more templates for each of the 13 subtypes, 200 seeds for each template) and by `npm run verify:templates` on 10,000 seeds for each template. `./meowtower graph check` lists none of the 13 subtypes of domain F as thin.

Two framework changes came with it. The template spec has the `fraction` and `mixed` answer kinds with a `rule`, and a fraction is written in a text with the fraction slash (U+2044), because the text rules refuse a plain slash between digits. Mixed answers that are whole numbers are never drawn, because the checker of a mixed number refuses a bare whole number.

F7 and F8 reach ten templates by varying context and operand shape; the research record found too few distinct source forms for twenty.

## Left alone

The other domains, and the checks that read the templates, which EPC-0470 owns.
