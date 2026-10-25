---
id: TSK-1195
artifact: task
status: done
revised: 2026-10-24
epic: EPC-0480
closes: [REQ-1232]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The 7 nodes of domain D have templates for every subtype and answer kind

After this task, each of the 7 nodes of domain D (1 at stretch) has at least ten templates for every subtype and answer kind the catalogue gives it, with its text in the per-language file and no string in the code (ADR-0490, REQ-1232).

## Acceptance criteria

1. Given the nodes of domain D, when `./meowtower graph check` lists the subtypes without a template or with fewer than ten, then none of them is a subtype of domain D. Closed by: the command's output.
2. Given each template of domain D, when `npm run verify:templates` runs it, then it shows no invalid parameters, no disagreement with the reference solver, no equal traps and no text that breaks the text rules. Closed by: the verification run's report.
3. Given a template of domain D, when its text is read, then every player-facing string comes from the per-language file through the typed function. Closed by: the lint run's `no-literal-string` result.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the templates of domain D in the template catalogue, following RES-1200 for each subtype's answer kinds, and run the verification on them.

## Depends on

- TSK-0676 (blocking): the typed string function that task text and keys go through.
- TSK-1192 (not blocking): the first domain settles the template conventions the others copy.

## Evidence

The 107 templates of domain D are in src/templates/d1.ts and d2.ts, written with the short form of src/templates/kitf.ts and its decimal helpers, with their strings in content/tasks-d.ru.json. Closed by tests/unit/templates.test.ts (ten or more templates for each of the 9 subtypes, 200 seeds for each template) and by `npm run verify:templates` on 10,000 seeds for each template. `./meowtower graph check` lists none of the 9 subtypes of domain D as thin.

A task of the integer kind now fails at once when a trap is not a whole number, because the entry of such a trap would have read as the answer.

D7 holds ten templates at stretch, all tagged as extensions: no Dutch goal read names the order of operations with decimals and fractions.

## Left alone

The other domains, and the checks that read the templates, which EPC-0470 owns.
