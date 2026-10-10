---
id: TSK-1126
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0440
closes: [REQ-7214, REQ-7216]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The egress guard refuses an unmasked word, and a masking test generates forms from an independent dictionary

After this task, the gateway refuses a `ParseRequest` whose text still holds a word the masker masks, so a missed form fails closed into a card riddle, and a masking test finds forms the numerals file lacks.

## Acceptance criteria

1. Given a `ParseRequest` whose text holds an unmasked «четверть», «вдвое» or «пятая», when the guard checks it, then it refuses each as `mask_incomplete` before any network call, and the riddle turns into a card riddle for the same target (REQ-7214). Closed by: a gateway test, three fixtures, that counts network calls.
2. Given «пара», «пополам» or a word of a cardinal-plus-ordinal run left in the text, when the guard checks it, then it refuses the same way (REQ-7214). Closed by: a gateway test, three fixtures.
3. Given every case and gender form of the words REQ-7202, REQ-7204 and REQ-7208 add, and the cardinal-plus-ordinal runs such as «двадцать пятых», generated from the OpenCorpora dictionary, when the masker runs over them, then no number word is left in the text (REQ-7216). Closed by: the masking test's report.
4. Given a form the numerals file lacks, when the masking test runs, then it fails and names the form; and given a missed word in a real request, then `./meowtower status` shows one line per missed word form on every run until the file gains it. Closed by: the test's fixture run and the status command's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Extend the guard of ADR-0100's gateway, which already refuses any other unmasked number word, with the words this epic masks. Generate the test's forms from OpenCorpora, which the numerals file wasn't written from, because a test generated from the same list as the masker can't find a form the list lacks. The turn into cards for the same target is ADR-0360's entry 46.

## Depends on

- TSK-1124 (blocking): it guards that task's words.
- TSK-1125 (blocking): it guards that task's words.

The epic realising ADR-0100 supplies the gateway and its egress guard.

## Evidence

Not yet.

## Left alone

The strict `ParseRequest` schema, which already has no field for a token's value or the target, and the live parse run, which TSK-1136 measures.
