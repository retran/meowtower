---
id: TSK-0941
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0320
closes: [REQ-6152]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A reaction line enters the bank only after the full checks, and the build fails on a bank that has fewer lines than it needs

After this task, `content/lines.ru.json` has a `reaction` category whose lines enter only through `line_approved` after the Master-reply checks, a content check reruns what needs no model on every line, and the build fails at the stage 0.3 gate below 60 approved lines.

## Acceptance criteria

1. Given a reaction candidate, when the parent approves it, then the server runs the shared check module in full, with schema, length, speaker, numerals, the forbidden-word list and the safety and creepiness checks on the judge route, and stores the result against a hash of the line's text; given a candidate that fails a check, then it isn't approved (REQ-6152). Closed by: an approval test with a judge in `replay` mode and one failing line.
2. Given the bank, when the group 1 content check runs, then it reruns the checks that need no model on every reaction line, and fails a line whose stored judge result is missing or belongs to another hash (REQ-6152). Closed by: the check's test with both fixtures.
3. Given every reaction line, when its creepiness levels are read, then they are 0 to 2, so one bank serves every scene (ADR-0320). Closed by: the content check's output.
4. Given the neutral lines in `content/i18n/ru.json`, when the group 1 content test runs, then there are at least 20, they pass the same checks as the bank, and a fixture with 19 fails the build (ADR-0360). Closed by: the content test with both fixtures.
5. Given the stage 0.3 gate and a bank of 59 approved unflagged lines, when verify runs, then it fails with `reaction_bank_short` and names the count; given 60, then it passes; given a bank that flags take below 60 after the stage, then the check reports and doesn't stop the build (ADR-0320). Closed by: the check's test at 59, at 60 and after the gate.
6. Given each candidate on the approval screen, when the parent reads it, then a checklist item says that a reaction line doesn't judge what the player wrote, doesn't promise an answer and doesn't mention waiting or time, and the parent confirms it for each line (ADR-0320). Closed by: a Parent Room test that finds the item, and the parent's judgement at each approval, because no check can tell whether a line judges what was written.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `reaction` category to `content/lines.ru.json`, the full check at approval through ADR-0110's `line_approved`, the stored judge result keyed by the text's hash, the group 1 check and the checklist item on the approval screen. I chose a bank of 60 lines, as ADR-0320 did, because a heavy session reaches about 15 free-text points, so a heavy session never repeats a line and a line comes back about once every four such sessions.

Write the 20 neutral lines by hand into `content/i18n/ru.json`. The server takes the reaction line from them until the bank first holds 60 approved lines.

## Depends on

Nothing. The epic realising ADR-0110 supplies `line_approved`, the check module and the pool; the epic realising ADR-0350 the judge route; the epic realising ADR-0160 the forbidden-word list.

## Evidence

Not yet.

## Left alone

The texts of the reaction lines, which the parent approves through ADR-0110's pool. The cycle and the flag, which TSK-0943 builds.
