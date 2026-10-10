---
id: TSK-1132
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0440
closes: [REQ-7242, REQ-7244]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Director asks for the division meaning with fewer clean riddles, and the target names the meaning in words

After this task, a riddle on the two meanings of division asks for the meaning with fewer riddles that got `match` with no `compose_partition_vs_quotition`, counted per requested meaning, and the target carries a note that says in words which meaning her story is to show.

## Acceptance criteria

1. Given counts of clean `match` riddles of 3 for sharing and 1 for grouping, when the Director offers a division riddle, then it asks for grouping, and given counts of 1 and 3, then it asks for sharing (REQ-7242). Closed by: a Director test, two fixtures.
2. Given equal counts, when the Director offers the riddle, then it asks for grouping by a size (REQ-7242). Closed by: a Director test.
3. Given card riddles and text riddles, when the counts are made, then both count together, because a card story carries its meaning in the roles of its cards as a text story does in its words (REQ-7242). Closed by: a Director test with one of each.
4. Given a riddle that asks for a meaning, when the player sees its target, then the target carries a note from the content files naming the meaning in words, such as «раздели поровну на части» for sharing, and the parent judges the wording (REQ-7244). Closed by: a Playwright test that finds the note for each meaning, and the parent's judgement of the notes' wording, because the words are for a child and a program can't judge them.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the request for a meaning to the Director's choice of a division riddle, reading the stream's counts per requested meaning that TSK-1135 keeps. A story of the other meaning also gets `match`, so without this rule a meaning she never writes stays hidden, and the grouping meaning is the later one to form (Fischbein and colleagues, 1985, in RES-4260). The meaning notes come from the per-language content files, which TSK-1133 covers, and are never written by a model while she plays.

## Depends on

- TSK-1131 (blocking): it chooses among the constructions that task offers.
- TSK-1135 (blocking): it reads the counts per requested meaning.

## Evidence

Not yet.

## Left alone

The reversal that reopens this choice when the parsed division kind agrees with the labelled kind on fewer than 80 % of either meaning's texts in two runs in a row, which the owner reads from the report of TSK-1136.
