---
id: TSK-0706
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-3414]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An SVG check fails an icon or element symbol with a wrong outline, black or a wrong size

After this task, a check over `design/icons/` and `design/elements/` fails when an SVG uses an outline colour other than `#6B4540`, uses black or isn't 48 by 48, so the owner's drawings stay in the game's flat style.

## Acceptance criteria

1. Given an SVG whose outline colour isn't `#6B4540`, or that uses black in a fill or a stroke, or whose size isn't 48 by 48, when the check runs, then it fails and names the file and the rule (REQ-3414). Closed by: a unit test with one failing fixture for each rule.
2. Given the owner's current drawings in the two folders, when the check runs, then it passes or names each file that breaks a rule (REQ-3414). Closed by: the check's output on the folders.
3. Given an icon or an element symbol, when the parent looks at it, then the parent judges that it is flat, with a warm brown outline, pastel fills and a white highlight (REQ-3414). Closed by: the parent's judgement, because pastel and highlight are looks no program can decide.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add an `svg-check` subcommand to `tools/art-generate.ts` that reads the two folders by path, as CLAUDE.md fixes. The tool generates none of these drawings, which are the owner's. Where `design/` is absent, as on a machine that holds no design folder, the check reports `design_missing` by name and doesn't pass silently. ADR-0190's verify command runs the check.

## Depends on

Nothing.

## Evidence

Not yet.

Criterion 3 rests on the parent's judgement, because REQ-3414 names a look.

## Left alone

The drawings themselves, which the owner makes and which stay under `design/` and out of git, as CLAUDE.md says.
