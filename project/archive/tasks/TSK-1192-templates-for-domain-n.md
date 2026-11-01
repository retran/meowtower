---
id: TSK-1192
artifact: task
status: done
revised: 2026-10-24
epic: EPC-0480
closes: [REQ-1232]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The 8 nodes of domain N have templates for every subtype and answer kind

After this task, each of the 8 nodes of domain N (1 at stretch) has at least ten templates for every subtype and answer kind the catalogue gives it, with its text in the per-language file and no string in the code (ADR-0490, REQ-1232).

## Acceptance criteria

1. Given the nodes of domain N, when `./meowtower graph check` lists the subtypes without a template or with fewer than ten, then none of them is a subtype of domain N. Closed by: the command's output.
2. Given each template of domain N, when `npm run verify:templates` runs it, then it shows no invalid parameters, no disagreement with the reference solver, no equal traps and no text that breaks the text rules. Closed by: the verification run's report.
3. Given a template of domain N, when its text is read, then every player-facing string comes from the per-language file through the typed function. Closed by: the lint run's `no-literal-string` result.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the templates of domain N in the template catalogue, following RES-1200 for each subtype's answer kinds, and run the verification on them.

## Depends on

- TSK-0676 (blocking): the typed string function that task text and keys go through.

## Evidence

The 172 templates of domain N are in src/templates/n1.ts to n8.ts, with their strings in content/tasks-n.ru.json. Closed by tests/unit/templates-n.test.ts (ten or more templates for each subtype of every node that has one, 200 seeds for each template) and by `npm run verify:templates`, which runs each registry template on 10,000 seeds. `./meowtower graph check` now lists the subtypes with no template and the thin ones, and none of the 15 subtypes of domain N is thin.

The texts are plain blanks for the story writer of ADR-0130, which rewrites them around the same numbers. The `roles` field of the template spec, which carries what each number stands for in that request, is filled in for only three templates so far.

## Left alone

The other domains, and the checks that read the templates, which EPC-0470 owns.
