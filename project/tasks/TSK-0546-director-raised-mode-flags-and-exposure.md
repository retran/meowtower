---
id: TSK-0546
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-1102, REQ-1124, REQ-1126, REQ-1128, REQ-1130]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Too many rapid guesses or too much help raises a flag for the parent and puts the next session in raised mode

After this task, a session with rapid guesses above 15 % of its answers gets `rapid_guess_flag` and raised mode for the rest of it and the next, an adventure whose help share passes its test gets `help_share_flag` and a raised next adventure, and `subtype_exposure` counts the shows and accuracy of each subtype for the report.

## Acceptance criteria

1. Given a session in which 16 of 100 answers are rapid guesses, when the session is read, then it has `rapid_guess_flag` and the Director enters raised mode for the rest of that session and for the next; given 15 of 100, then neither (REQ-1124, REQ-1126). Closed by: a unit test for each count.
2. Given an adventure whose «Не знаю» and hints before the answer are 31 % of its first attempts and whose mean share over the 7 earlier adventures is 20 %, when it is read, then it has `help_share_flag` and the next adventure runs in raised mode; given 31 % and an earlier mean of 22 %, then it has none (REQ-1128, REQ-1130). Closed by: a unit test for each pair.
3. Given the player's first adventure at 31 %, when it is read, then the 30 % test alone applies and the flag is set (REQ-1128). Closed by: a unit test.
4. Given raised mode and an in-corridor slot, when the slot type is asked, then review is given when the review count is below the larger of `0.30 * (n + 1)` rounded up and `0.40 * (n + 1)` rounded down, and the item builder chooses a free-input template wherever a subtype has one (REQ-1124, REQ-1130). Closed by: a unit test at `n` of 9, 10, 20 and 30.
5. Given raised mode below the corridor and above it, when slots are read, then every slot below is review and every slot above is frontier, so raised mode changes neither. Closed by: a unit test.
6. Given a log, when `subtype_exposure` is read, then each subtype row holds the count of tasks shown and the accuracy of unassisted first attempts before and after the player first saw a walkthrough on that subtype (REQ-1102). Closed by: a unit test over a fixture log.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the two flags and raised mode to `src/engine/director/guards.ts` and `subtype_exposure` as a `knowledge` projection through the registry. The help-share test counts «Не знаю» and hints before the answer, and not «Нельзя узнать», against the adventure's first attempts, as SPC-0070 states after ADR-0250.

The report draws the flags and the exposure beside accuracy; that is ADR-0180's. ADR-0070 notes that raised mode can add at most 5 points of review inside the corridor, because REQ-1010 caps the share at 40 %; a stronger response needs an exception in REQ-1010, which is the owner's call.

## Depends on

- TSK-0532 (blocking): the corridor whose review rule raised mode changes.
- TSK-0544 (blocking): the rapid-guess mark the 15 % test counts.

## Evidence

Not yet.

## Left alone

How the Parent Room draws `rapid_guess_flag`, `help_share_flag` and the exposure counts, which ADR-0180's epic builds.
