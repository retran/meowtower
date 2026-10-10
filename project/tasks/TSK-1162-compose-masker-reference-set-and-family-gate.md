---
id: TSK-1162
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-5278, REQ-7202, REQ-7210, REQ-7264]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The masker and reply check hold from the MVP, the reference set holds every error class and a family's text form waits for its own pass

After this task, a parse request leaves the Mac only with its numbers masked and its reply checked from the MVP, the 200 reference texts hold at least one text of each compose error class, every run of acceptance test 3 writes its record, and the confirmed-riddle count that spreads the Director's offers counts every confirmation. This settles entries 41 to 44 of ADR-0460.

## Acceptance criteria

1. Given a composed text with «2,5», «3/4», «сорок восемь» and «полтора», when it is masked before a parse request, then each is one token `n1` to `n4` in text order, and a word of the set left unmasked fails the test (REQ-7202). Closed by: a unit test over the four numbers and one fixture for each word class of the set.
2. Given a parse whose graph names a number other than an `n` or `d` token of the masked text, when it is checked, then it is rejected as invalid, and given the 100 of a percentage, the sum of a ratio's parts or the numerator 1 of a fraction word with no count, then it is accepted because the operation's definition supplies them (REQ-7210). Closed by: a unit test over one rejected and three accepted graphs.
3. Given the 200 reference texts, when they are counted, then the set holds at least one text of each compose error class, `compose_times_vs_divide`, `compose_percent_as_number` and `compose_ratio_additive` included, and the four subsets hold the rest of the percentage and ratio texts (REQ-5278). Closed by: a test over the set's labels.
4. Given runs of test 3, when each ends, then it writes its record, passing or failing, and a record that would be the sixth pair drops the oldest pair that isn't the configured one; given a family whose subset agrees on fewer than 48 of 50 texts or whose test 3 hasn't passed on the configured parse model, then its riddles play as cards (REQ-7264). Closed by: a unit test over six pairs and a gating test over both failures.
5. Given a source with `compose_confirmed` events followed by a verdict, by «Не знаю» and by the serious path, when the Director spreads its offers, then the count of confirmed riddles of that source over the last 28 game days includes all three. Closed by: a unit test over the three endings.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply entries 41 to 44 as written. REQ-7202 and REQ-7210 superseded REQ-5202 and REQ-5206 with no mark of time, so the masker and reply check are in force from the MVP, and "the same masker" in ADR-0440's post-MVP list names what the extension reuses.

## Depends on

Nothing. The epics realising ADR-0230 and ADR-0440 own the compose path; this task runs on their fixtures and the labelled texts.

## Evidence

Not yet.

## Left alone

The 95 % agreement bar of acceptance test 3, which REQ-5280 sets, and the parse model itself, which ADR-0100 configures.
