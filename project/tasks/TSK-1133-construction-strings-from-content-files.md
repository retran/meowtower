---
id: TSK-1133
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0440
closes: [REQ-7276, REQ-7278, REQ-7280, REQ-7282]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Card frames, paraphrase templates and meaning notes come from content files, pass the frame checks and are written offline

After this task, every construction has its card frames, paraphrase templates and meaning note in the per-language content files, in Russian, checked like every frame file, and no model writes one while the player plays.

## Acceptance criteria

1. Given the seven constructions, when the content test runs, then each has card frames, paraphrase templates and a meaning note in the per-language files under `content/i18n/ru.json` and the frame files, and a string hard-coded in a component fails the string check of ADR-0160 (REQ-7276). Closed by: the content test and the string check's output.
2. Given a card frame or paraphrase template that holds a digit, a number word or the name of the operation, when the frame checks of ADR-0130 and ADR-0230 run, then the build fails, and a frame that passes them ships (REQ-7278). Closed by: the check's fixture tests.
3. Given every player-facing string this epic adds, when the language check runs, then each is in Russian and the repository adds no English or Dutch string for a construction (REQ-7280). Closed by: the string check's output.
4. Given the server's code paths, when a group 1 check scans for gateway calls that write a card frame, a paraphrase template or a meaning note, then it finds none outside the offline tools (REQ-7282). Closed by: the check's fixture test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write, for each of the seven constructions, the card frames, the paraphrase templates with one set per problem type or construction and per operation, named operations included, and a meaning note for each division meaning, each as offline content that passes ADR-0230's frame checks. Add the report's «ещё не предлагалась» string under the report's strings. A Dutch string for a construction, beyond addendum 1's bridge keywords, waits on the owner amending the Russian-only rule in `CLAUDE.md`, and this task adds none.

## Depends on

- TSK-1130 (not blocking): the seven construction names are fixed by REQ-7200, so the strings can be written before the templates land; the content test that ties a template to its strings runs once both exist.

The epic realising ADR-0160 supplies the language files and the string check and the epic realising ADR-0230 the frame checks.

## Evidence

Not yet.

## Left alone

The card builder that uses these frames, which TSK-1137 builds, and the English and Dutch versions, which ADR-0160's rule for a second language covers when they come.
