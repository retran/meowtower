---
id: TSK-1119
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0430
closes: [REQ-7184, REQ-7186, REQ-7188, REQ-7190, REQ-7198]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The report shows the card counts, the word list, the practice gain, the native-review share and the families closed short

After this task, the section «Язык или математика?» also shows how much help she asked for in each language, the words that came before a right answer she had missed, the practice gain by position, how much of each gap rests on native-reviewed texts, and how many families closed short.

## Acceptance criteria

1. Given a family whose `nl` was wrong and whose `nl_after_words` was right, when the section is built, then it lists the words shown in that family's `nl_after_words`, and the word list and the Dutch-to-after-words gap carry «в том числе практика и разбор решения» (REQ-7184, REQ-7186). Closed by: a report test.
2. Given attempts at positions 1 to 5 of the families, when the section is built, then it shows the pooled share of the `bare`, `ru` and `nl_source` presentations at each position, with «мало данных» in any cell under 12 observations (REQ-7186). Closed by: a report test, two fixtures.
3. Given the `nl` share, then beside it stand how many of its attempts opened a card and how many of those were right, and beside the `ru` share the same pair of counts for term hints (REQ-7188). Closed by: a report test.
4. Given a gap, when the section shows it, then beside it stands the share of its Dutch observations from pairs with `nativeReviewed`, read from the latest approval of each pair, and the mark «тексты не проверены носителем» appears at a share of 0.4 and not at 0.5 (REQ-7190). Closed by: a report test, two fixtures.
5. Given a family whose 14 days ended before all its presentations were shown, when the section is built, then it counts the family as closed short and counts its shown presentations; given a family still inside its window, then it feeds the section with what it has shown (REQ-7198). Closed by: a report test with a fixed clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add these parts to the section of TSK-1118, reading the `probe_card_opened` events of each attempt's `itemId` and the latest `probe_text_approved` of each pair. Pool the three balanced presentations by position, because a cell for each presentation at each position would hold about 4 observations in the first phase and read «мало данных» everywhere. The practice gain keeps the language fixed: the balanced presentations before and after the Dutch pair measure what practice alone adds, so the parent can read the after-words gap beside it.

## Depends on

- TSK-1118 (blocking): it adds to that task's section.
- TSK-1116 (blocking): the card counts and the word list read the events that task writes.

## Evidence

Not yet.

## Left alone

The shares and gaps, which TSK-1118 shows, and any line comparing the gaps with a maths gap, which ADR-0380's fixed list owns.
