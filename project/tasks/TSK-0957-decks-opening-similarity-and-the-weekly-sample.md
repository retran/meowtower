---
id: TSK-0957
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6258, REQ-6260, REQ-6262]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Openings, finales and temperaments come from dealt decks, each opening is scored with no model call, and the parent reads a weekly sample

After this task, three decks are dealt without replacement by the adventure seed, each opening's similarity to the last 14 is scored on the Mac, and each week 5 Master scenes enter the parent's review queue.

## Acceptance criteria

1. Given a deck of N cards and an adventure seed, when N adventures deal from it, then no card repeats before the deck is spent, the deck reshuffles when spent, and the same seed deals the same cards (REQ-6258). Closed by: a unit test for each of the three decks.
2. Given the last 14 openings, when a new opening is scored, then its similarity is the largest Jaccard overlap of their lemma pairs, no gateway call happens (a stub that fails on any call stays unused), and `text_freshness_scored` is appended for every Master scene (REQ-6260). Closed by: a unit test with the failing gateway stub.
3. Given a queue that holds 10 unread sample scenes, when the week's draw runs, then 5 scenes of the last 7 days enter by the week's seed, the oldest drop from the queue and stay in the dialogue book (REQ-6262). Closed by: a queue test over 3 simulated weeks.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Read `content/decks.ru.json`, with a card as an instruction to the Master that travels in `deckCards`. Deal by the adventure seed and reshuffle when a deck is spent. Score on the Mac with the lemma table of TSK-0956. Nothing gates on the score; the Interest section shows its week's median beside the repetitiveness figure. Draw the weekly sample by the week's seed into the review queue of ADR-0110 part 8. ADR-0330 chose 5 scenes because it is about one scene a day of play, which the parent reads in a few minutes.

## Depends on

- TSK-0956 (blocking): it supplies the lemma table and the lemma counting the similarity score reads.

The epic realising ADR-0110 supplies the review queue and the dialogue book; until it exists the task runs on a stand-in queue. The owner writes the three decks.

## Evidence

Not yet.

## Left alone

How the Interest section shows the median, which TSK-0962 builds, and the cards' wording, which is the owner's content.
