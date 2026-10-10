---
id: TSK-0681
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0160
closes: [REQ-3328, REQ-3302]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `textGate` checks a line against the one list and returns a pass or the rule that failed

After this task, `textGate(text, { lang, kind, source })` in `src/shared/voice/` normalises a text, matches it against `content/shaming.ru.json` and nothing else, and returns a pass or the rule and the match that failed, and it rejects an exclamation mark in a System line.

## Acceptance criteria

1. Given «ОЦЕНКА», «Урок», «ошибкой», «задачку» and the mixed-script «зaдача» with a Latin "a", when each passes through the gate as kind `story`, then each is blocked with the matched form, and «примерно», «примерить», «мимоза» and «верно» pass (REQ-3328). Closed by: a unit test with the fixtures of ADR-0160.
2. Given a text with a soft hyphen, a zero-width character, a stress mark or «ё», when it is normalised, then the soft hyphen, the zero-width character and the stress mark are removed and «ё» reads as «е» before matching, so «задачу́» and «зад​ачу» are blocked (REQ-3328). Closed by: a unit test.
3. Given a line of kind `system` holding "!" or a digit, when the gate runs, then it fails with the rule `system_punctuation` or `system_digit`; given kind `label` equal to a rejected label, it fails with `rejected_label`; given any kind holding an emoji, it fails with `emoji` (REQ-3302). Closed by: a unit test with one fixture for each rule.
4. Given `source: "player"` or a key under `parent.*`, when the gate runs, then it passes the text unchecked, and given any other source it checks (REQ-3328). Closed by: a unit test, and a static check that only `src/shared/voice/` opens `content/shaming.ru.json`, so every check reads the same list.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Normalise to NFC and lower case, fold «ё» to «е», remove soft hyphens, zero-width characters and stress marks, and fold the Latin look-alikes of Cyrillic letters to Cyrillic, because a Master that copies a Latin "a" into «задачу» would otherwise slip past a split on script. Split into Cyrillic word tokens and look each token up in a set built from the list's forms, then match the phrases as runs of tokens. Load the list once at start. A blocked text returns the rule and the match and never the list.

A line of kind `system` is also checked for "!" and for digits, because numbers reach a System window only as fields code fills. Put the static check for the single reader of the list in `tools/static-checks.ts`.

## Depends on

- TSK-0680 (blocking): the gate reads the list and the fixtures of both groups from it.

## Evidence

Not yet.

## Left alone

Where the gate is called: TSK-0682 calls it for fixed text at build time and TSK-0683 calls it for generated text on the server. The Latin phrases of ADR-0290 and the Dutch section of ADR-0430 are matched by those decisions' epics through the same function.
