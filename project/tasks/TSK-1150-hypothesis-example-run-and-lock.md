---
id: TSK-1150
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0450
closes: [REQ-7362]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The example hypothesis tells the maths-gap player from the language-gap player, behind a lock

After this task, `verify/check5/example-hypothesis.json` holds the three conditions ADR-0450 fixed, a lock file names its hash and the approved decision that set it, and check 5 runs the example on the maths-gap and the language-gap players and reports how many of 20 seeds of each pass.

## Acceptance criteria

1. Given the example file, when it is read, then it holds confirmation 1 as `probe.ru` minus `probe.nl` above 20, confirmation 2 as `probe.ru` minus `probe.nl_after_words` below 20 and the refutation as `probe.ru` minus `probe.nl` below 20 (REQ-7362). Closed by: a unit test over the file.
2. Given the lock file, when the file's hash has no entry naming an approved record in `project/adrs/`, then `hypothesis_example_lock` fails and names the file; given the lock names ADR-0450 for the current hash, then the check passes. Closed by: two fixture tests of the check.
3. Given the maths-gap player at 55 % on every presentation, when a seed runs 180 play days, then it passes when the shown label is «опровергается» on some day and never «подтверждается»; the mirror holds for the language-gap player (REQ-7362). Closed by: a unit test over one seed of each player.
4. Given 20 seeds of each player at the H the hold tool measured, or at 56 when none passed, when the run ends, then it reports the number of seeds that pass for each player against the bar of 15 of 20 (REQ-7362). Closed by: the run's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the example file and its lock with the hypothesis recorded before the probe's first task. The refutation is ADR-0450's replacement for the addendum's wording, `probe.bare` minus `probe.ru` above 20, which the maths-gap player can never meet because its true difference is 0. Nobody can tune the conditions until the check passes, because a new set needs a new approved decision. The players' rates are REQ-6668's and REQ-7500's and aren't tuned here.

## Depends on

- TSK-1144 (blocking): it judges the example by the rule functions.
- TSK-1145 (blocking): the shown label and the hold decide the pass.
- TSK-1149 (blocking): it runs at the H the tool measured.

The epic realising ADR-0380 supplies check 5's generator and its four players; this task runs the example on a stand-in generator with the same rates until then. At 15 of 20, ADR-0450's sketch gives about a 96 % chance of passing at H = 28 and 71 % at H = 56, and a failing run at a long H is a finding about the bar and not a defect of the rule.

## Evidence

Not yet.

## Left alone

The both-gaps player, which ADR-0450 leaves to the owner and research, and check 5's other three players, which ADR-0380 owns.
