---
id: TSK-0599
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1616, REQ-1548, REQ-1812, REQ-1814, REQ-3316, REQ-3320, REQ-3330]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A Master reply reaches the screen only as `CheckedText`, after the schema, length, speaker, numeral, word and safety checks

After this task, the checks run in order, cheapest first, a reply shows only as the `CheckedText` type that only a passing run can build, and the checklist's items, among them guilt phrases, the word «узелок» and «Бантик» for the ally, are measured on a labelled test set.

## Acceptance criteria

1. Given a reply with a digit, a numeral word from `content/numerals.ru.json`, a word on the forbidden list, a line of 281 characters, a 13th line, or a speaker outside the canon's entity list and her names, when the checks run, then each is rejected at its own step, and canon names and her names pass the numeral step (REQ-1616, REQ-1548). Closed by: a unit test with one reply for each fault.
2. Given a reply whose creepiness Score is above the order's level, when the safety check runs, then it is rejected (REQ-1616). Closed by: a unit test with a mocked judge.
3. Given the type system, when code outside the check module builds a `CheckedText`, then `tsc` refuses it (REQ-1616). Closed by: `npx tsc --noEmit` on a fixture file that must fail.
4. Given the labelled Russian test set, when the safety check runs over every item of the forbidden-content list, then each item has positive lines in the set and the check flags them, among them a request for personal data, a claim to be human, the heroine judged or shamed, a Guardian defeated, a look-alike of the heroine, a phrase of guilt or attachment, «узелок» for a knot and «Узелок» for the ally from the autumn finale on (REQ-1812, REQ-1814, REQ-3316, REQ-3320, REQ-3330). Closed by: the test set's report with the count of positives for each item.
5. Given the `alt` branch and the `cunning` ending, when the checks run, then they also refuse a dead end, harm to the heroine, a sad familiar because of her and a hint at her fault. Closed by: a unit test with one reply for each.
6. Given every content and string file, when the content test runs, then none holds a phrase of guilt, «узелок» for a knot or «Узелок» for the ally after the autumn finale (REQ-3316, REQ-3320, REQ-3330). Closed by: the content test, per ADR-0370.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the six checks in the stated order, with the length limits ADR-0110 chose (1 to 12 lines of at most 280 characters, branches of 2 to 8, endings of 2 to 6) and the schema, numeral and word steps and the safety check inside the shared check module that ADR-0120 defines, with its `CheckedText` type. The meaning-based checklist items run in the safety check, on the judge the epic realising ADR-0350 routes the check to, or on `SAFETY_MODEL` as its fallback. The epic realising ADR-0120 also builds that module for explanations; if this task lands first, it adds the module's type and runner under `src/engine/checks/` and that epic adds its steps beside these.

## Depends on

- TSK-0597 (blocking): the schema is the first check.

The epic realising ADR-0160 supplies the one forbidden-word list, by lemma; until it exists the word step reads a fixture list this task writes. The epic realising ADR-0100 supplies the judge route.

## Evidence

Not yet.

## Left alone

What happens when a check fails, which TSK-0600 builds, and her own text, which TSK-0601 checks before a model reads it.
