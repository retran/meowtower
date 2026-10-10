---
id: TSK-1118
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0430
closes: [REQ-7180, REQ-7182]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The report shows each presentation's share and the two gaps, with «мало данных» under 12 observations

After this task, the post-MVP report section «Язык или математика?» shows each probe presentation's share of right answers without help, overall and for each node, and the gap from `ru` to `nl` and from `nl` to `nl_after_words`, each with its interval and «мало данных» under 12 observations.

## Acceptance criteria

1. Given a fixture stream, when the section is built, then each presentation's share of its graded first attempts that were right and not assisted is shown overall and for each node with its count and ADR-0380's 80 % Wilson interval, less the tasks the parent excluded (REQ-7180). Closed by: a report test.
2. Given a cell with 11 observations, then it reads «мало данных» with the count 11; given 12, then it shows the share (REQ-7180). Closed by: the report test, two fixtures.
3. Given the planned cards of `nl_after_words`, opened or reopened, then they aren't help; given a card tap in `nl` or a hint rung on any letter, then it is help and the attempt leaves the share; and given a rapid guess, then it stays in (REQ-7180). Closed by: a projection test, three fixtures.
4. Given the gaps from `ru` to `nl` and from `nl` to `nl_after_words`, when the section shows them overall and for each node, then each carries the 80 % interval ADR-0380 sets for a difference, and «мало данных» where either side holds fewer than 12 (REQ-7182). Closed by: the report test, two fixtures.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the section to the post-MVP report, at the place ADR-0380 sets, reading only the `nl_probe` projection. Rapid guesses stay in because a fast guess on a Dutch text she can't read is the very gap the probe measures, and dropping it would shrink the gap. The floor of 12 is the one this measure owns, chosen by RES-4250 because at 12 and one half right the 80 % interval spans about 33 % to 67 %; register it in ADR-0380's floor registry. The section adds no line of its own: every reading is ADR-0380's language line and maths line, worded as what to check.

## Depends on

- TSK-1117 (blocking): it reads only the stream `nl_probe`.

The epic realising ADR-0380 supplies the intervals, the floor registry and the two lines; until it exists the task uses a stand-in with the same signatures.

## Evidence

Not yet.

## Left alone

The card counts, the word list, the practice gain, the native-review share and the families closed short, which TSK-1119 adds.
