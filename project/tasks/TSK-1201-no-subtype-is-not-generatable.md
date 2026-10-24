---
id: TSK-1201
artifact: task
status: approved
revised: 2026-10-24
epic: EPC-0480
closes: [REQ-1232]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# No subtype of the graph is listed as not_generatable

After this task, every subtype and answer kind of the 79 maths nodes has at least ten templates, so the not_generatable notice lists none and EPC-0470's checks can run (ADR-0490, REQ-1232).

## Acceptance criteria

1. Given the finished templates, when `./meowtower graph check` runs, then it lists no subtype as not_generatable or as having fewer than ten templates and exits 0. Closed by: the command's output.
2. Given a new graph version, when the server starts, then the parent's notices hold no not_generatable notice. Closed by: the unit test of the start-up notice.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Run the check over the whole graph and fix any subtype a domain task missed.

## Depends on

- TSK-1192 (blocking): domain N's templates.
- TSK-1193 (blocking): domain A's templates.
- TSK-1194 (blocking): domain F's templates.
- TSK-1195 (blocking): domain D's templates.
- TSK-1196 (blocking): domain P's templates.
- TSK-1197 (blocking): domain M's templates.
- TSK-1198 (blocking): domain G's templates.
- TSK-1199 (blocking): domain S's templates.
- TSK-1200 (blocking): domain T's templates.

## Evidence

Not yet.

## Left alone

The checks that read the templates, which EPC-0470 owns.
