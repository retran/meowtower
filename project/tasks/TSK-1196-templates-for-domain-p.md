---
id: TSK-1196
artifact: task
status: approved
revised: 2026-10-24
epic: EPC-0480
closes: [REQ-1232]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The 7 nodes of domain P have templates for every subtype and answer kind

After this task, each of the 7 nodes of domain P (1 at stretch) has at least ten templates for every subtype and answer kind the catalogue gives it, with its text in the per-language file and no string in the code (ADR-0490, REQ-1232).

## Acceptance criteria

1. Given the nodes of domain P, when `./meowtower graph check` lists the subtypes without a template or with fewer than ten, then none of them is a subtype of domain P. Closed by: the command's output.
2. Given each template of domain P, when `npm run verify:templates` runs it, then it shows no invalid parameters, no disagreement with the reference solver, no equal traps and no text that breaks the text rules. Closed by: the verification run's report.
3. Given a template of domain P, when its text is read, then every player-facing string comes from the per-language file through the typed function. Closed by: the lint run's `no-literal-string` result.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the templates of domain P in the template catalogue, following RES-1200 for each subtype's answer kinds, and run the verification on them.

## Depends on

- TSK-0676 (blocking): the typed string function that task text and keys go through.
- TSK-1192 (not blocking): the first domain settles the template conventions the others copy.

## Evidence

Not yet.

## Left alone

The other domains, and the checks that read the templates, which EPC-0470 owns.
