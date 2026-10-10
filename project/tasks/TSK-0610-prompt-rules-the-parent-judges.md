---
id: TSK-0610
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1500, REQ-1504, REQ-1506, REQ-1554, REQ-1560, REQ-1566, REQ-1802, REQ-1804, REQ-1806, REQ-1810, REQ-2610]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The prompt tells every trial as a spell and every outcome as an event, and the parent judges a week of dialogues against the rules

After this task, the system prompt holds the canon's rules for the Master as rules the parent judges, the bans on asking for personal data, on schoolwork and grades, on claiming to be human and on discussing her abilities, and the checks and the dialogue book let the parent read a week and find no line that breaks them.

## Acceptance criteria

1. Given the prompt built for any order, when its text is read, then it holds the rules: every trial told as a spell that loosens a knot, Guardians who agree to let the heroine pass and are never shown defeated, a Tangle's name free of school terms, the Reverse One's back-to-front speech, no hint of fault in a loosened-knot or other-path line, every outcome told as an event in the world, and no talk of her abilities, schoolwork or grades, no request for personal data and no claim to be human (REQ-1500, REQ-1504, REQ-1506, REQ-1554, REQ-1560, REQ-1566, REQ-1806, REQ-1802, REQ-1804, REQ-1810, REQ-2610). Closed by: a unit test over each rule's presence in the prompt.
2. Given the labelled test set, when the safety check runs over the lines for each of these rules, then each rule has positive lines in the set and the check flags them, and the `alt` branch and the `cunning` ending pass the stricter checks (REQ-1554, REQ-1802, REQ-1804, REQ-1810). Closed by: the test set's report.
3. Given a week of the dialogue book, when the parent reads it, then the parent finds no line that tells a trial as anything but a spell, shows a Guardian defeated or not agreeing to let her pass, hints at her fault in an `alt` line, names a Tangle by a school term, tells an outcome as a verdict on her, or discusses her abilities (REQ-1500, REQ-1504, REQ-1506, REQ-1554, REQ-1560, REQ-1806, REQ-2610). Closed by: the parent's judgement of the book's week, because each rule is about how a line reads and no word list can find it.
4. Given the canon's Guardian endings, when they are read, then each Guardian agrees to let the heroine pass (REQ-1504). Closed by: the owner's judgement, because the canon's text is written by hand.
5. Given the Reverse One's lines in a week of the dialogue book, when the parent reads them, then each speaks back to front (REQ-1566). Closed by: the parent's judgement, because the rule is about how a line reads and the prompt's rule is tested in criterion 1.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the rules to the canon's «rules for the Master» section, which a person writes, and the prompt builder's fixed part; add the labelled lines to the test set; and add the week's reading to the stage acceptance checklist of ADR-0190. Four of the rules live in the prompt as canon rules the parent judges: her back-to-front speech, trials told as spells, Guardians who agree to let the heroine pass, and Tangle names free of school terms.

## Depends on

- TSK-0597 (blocking): the rules sit in that task's order and prompt.
- TSK-0598 (blocking): the rules are canon sections the builder serves.

The epic realising ADR-0180 draws the dialogue book the parent reads; until it exists the parent reads the events through `./tower` commands.

## Evidence

Not yet.

## Left alone

The wording of the canon, which the owner writes, and the Reverse One's visual rules, which TSK-0611 covers.
