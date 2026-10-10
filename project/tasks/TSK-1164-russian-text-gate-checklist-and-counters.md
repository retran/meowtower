---
id: TSK-1164
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-3300, REQ-3304, REQ-3306, REQ-3318, REQ-5812]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The text gate blocks Latin test names, the judge checks four System-line and joke rules, and the gate counts what it checks

After this task, the Russian text gate also matches «Cito», «LVS» and «Leerling in beeld» on the raw text of every generated line, the safety checklist of ADR-0110 holds four more items, and a counter table per source and game day gives the blocked share. This settles entries 29 to 32 of ADR-0460.

## Acceptance criteria

1. Given a generated line with «cito», «LVS» or «Leerling in beeld» in any case as a whole word, when the gate runs, then it blocks the line beside its Cyrillic-token match, and given «citoplasma» or a longer word that holds the letters, then it passes (REQ-5812). Closed by: a unit test over six lines.
2. Given the safety checklist, when the judge's prompt is built, then it holds the four items: a System line that isn't short, formal and in the present tense; a correction the System makes inside the line it corrects; a System line about the heroine's mind or abilities; and a joke aimed at the heroine (REQ-3300, REQ-3304, REQ-3306, REQ-3318). Closed by: a prompt test that finds the four items.
3. Given a sample of generated System lines and jokes from one run, when the parent reads them, then she finds each rule held (REQ-3300, REQ-3306, REQ-3318). Closed by: the parent's judgement, because the three requirements say the parent judges and no test can tell a formal line from a stiff one.
4. Given lines checked and blocked over 100 days, when the counter table is read, then it holds one row per source and game day with the lines checked and the lines blocked, rows older than 90 days are deleted, and the blocked share is blocked over checked for the row. Closed by: a unit test over 100 days.
5. Given a source last reported at a share of 4 %, when the verify summary runs at 6.5 %, 6 % and 1.9 %, then it reports the source again at 6.5 % and 1.9 % and not at 6 %. Closed by: a unit test over the three shares.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Match the three Latin phrases case-insensitively and as whole words on the raw text, and leave ADR-0160's tokenisation as it is. The judge reads every generated reply against the checklist already, so the four items reach generated text with no new call. The 90 days of counters are a value ADR-0460 chose so three monthly readings of `./meowtower status` can compare shares.

## Depends on

Nothing. The epics realising ADR-0110 and ADR-0160 own the judge and the gate; this task runs on their fixtures.

## Evidence

Not yet.

## Left alone

The Cyrillic word lists, which ADR-0160 owns, and the checklist's other items, which ADR-0110 owns.
