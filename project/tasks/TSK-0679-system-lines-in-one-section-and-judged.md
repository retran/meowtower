---
id: TSK-0679
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0160
closes: [REQ-3300, REQ-3306, REQ-3318]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every fixed System line sits in one section the parent reads in one sitting

After this task, every fixed System line is a value under `system.*` in `ru.json`, no System line is written anywhere else, and the parent can read the whole section at once and judge its voice.

## Acceptance criteria

1. Given the code of `src/` and the content files, when the static check looks for a System window being opened, then each window takes its lines only from a `system.*` key, and a fixture that opens one with a literal or with a `ui.*` key makes the check fail (REQ-3300). Closed by: the static check's unit test and the lint verb's output.
2. Given the `system.*` section, when the parent reads it at stage acceptance, then each line is short, formal and in the present tense (REQ-3300), describes an event in the world and never the heroine's mind or abilities (REQ-3306), and holds no joke aimed at her (REQ-3318). Closed by: the parent's judgement at the stage 0.3 acceptance, because no automatic check tests a voice; the person who judges it is the parent.
3. Given the section, when the stage acceptance starts, then `npm run strings:system` prints each `system.*` key with its lines in order and nothing else, so the sitting needs no tool beyond a terminal (REQ-3300). Closed by: the command's output on the committed file.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Move the fixed System lines of the stand-in adventure into `system.*` and name each key for the event it announces, such as `system.awakening.closing`. Add the static check to `tools/static-checks.ts`. Add the printing command as a script in `package.json`; I chose a command so the parent doesn't open JSON. The exclamation mark and digit rules for these lines are TSK-0681's and TSK-0682's, and this task adds no check for them.

## Depends on

- TSK-0676 (blocking): the lines are keys of the typed file and the pause form is its System message shape.

## Evidence

Not yet.

## Left alone

The voice of generated System lines, which ADR-0110 and ADR-0120 carry into their prompts, and the line `system.fallback.line` itself, which TSK-0683 uses and this task only lists.
