---
id: TSK-0868
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0280
closes: [REQ-5712, REQ-5714, REQ-5738, REQ-5762, REQ-5764, REQ-5766, REQ-5768, REQ-5792]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A puzzle is a language-free data file and a Russian text file, and the build fails one that breaks a static rule

After this task, `content/puzzles/<id>.json` and `content/puzzles/<id>.ru.json` hold a puzzle's data and its Russian text, and the build's group 1 fails a puzzle for a numeral outside a placeholder, a rung 1 with a placeholder, a forbidden form, a banned name, a hand-written signature, a rebus with a letter or a missing source, and never for a count of puzzles in a theme.

## Acceptance criteria

1. Given a text file with a digit or a numeral from ADR-0120's lexicon outside a placeholder, a placeholder the data file doesn't define, or a placeholder in rung 1, when group 1 runs, then the build fails naming the puzzle and the rule (REQ-5738). Closed by: one fixture each in the group 1 check's test.
2. Given a text with a form of «задача» or «неправильно» in any word form, including a familiar's line, when `textGate` runs, then the build fails (REQ-5762). Closed by: a fixture over the forbidden list.
3. Given a data file that holds a letter in a rebus, or names no source of the idea as author, title and edition, when group 1 runs, then the build fails (REQ-5766, REQ-5768). Closed by: two fixtures.
4. Given a title or the branch's name with any form of «узелок» or «узел», «Ирма» or «Муфта», or a word for a cat from `content/puzzles/name-guard.ru.json`, or a text that writes the signature «И.» or «С.» by hand, when group 1 runs, then the build fails; a data file's clue field makes the page's signature «И.» or «С.» (REQ-5712, REQ-5714). Closed by: fixtures for each name and the signature.
5. Given a data file, when its numbers, rules and check are read, then none depends on the display language, and a theme with 0 or 3 puzzles passes (REQ-5764, REQ-5792). Closed by: a fixture that renders one data file with two text files, and a build run on a bank with an empty theme.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Define the data and text schemas in `src/shared/puzzles/`, with the fields ADR-0280 lists: kind, theme (one of the addendum's 11), difficulty 1 to 4, `week`, parameters, rules, reference solution, widget and starting state, an optional running clue with its earliest checkpoint, and the source. The text file holds the statement, three rungs, the full solution and the title, each number a placeholder. Add the checks to ADR-0190's group 1. The limits are 90 words for a statement, 30 for a rung and 150 for the solution, which ADR-0280 chose so a statement and its figure fit one Diary page on the iPad.

The player-facing strings, such as the name of the branch and the dry lines after an answer, live in the per-language file as CLAUDE.md requires.

## Depends on

The epic realising ADR-0190 supplies the verify command's group 1 harness, and the epic realising ADR-0160 supplies `textGate` and its forbidden list. The epic realising ADR-0120 supplies the numeral lexicon; a fixture lexicon stands in until then.

## Evidence

Not yet.

## Left alone

The check functions, which TSK-0869 and TSK-0870 build, and the real puzzles, which the preparation run and the parent's approval produce.
