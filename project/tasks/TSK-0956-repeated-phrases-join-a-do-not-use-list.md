---
id: TSK-0956
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6254, REQ-6256, REQ-6264]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A phrase the Master repeats joins a do-not-use list, and the whitelist keeps jokes, catchphrases and her names out of it

After this task, the service counts each sequence of 3 to 5 lemmas in the Master's scene text over the last 14 days, a sequence seen more than 3 times joins the do-not-use list that each later order carries, a scene that repeats one is regenerated once unless it answers her free text, and no whitelisted sequence joins the list.

## Acceptance criteria

1. Given 14 days of scenes in which one sequence appears 4 times in different inflected forms, when the next order is built, then `doNotUse` holds the sequence, holds at most 30 entries, the most frequent first, and a word the lemma table doesn't know counts as its normalised form (REQ-6254). Closed by: a freshness test.
2. Given a running joke from story memory, a canon section tagged `catchphrase` and one of her current names each repeated 4 times, when the list is built, then none joins it (REQ-6264). Closed by: the same freshness test.
3. Given a drafted scene that passed the checks and holds a listed sequence, when the service looks, then a scene that isn't a reply to her free text is regenerated once, a reply to her free text isn't, and a regenerated scene that still repeats shows anyway with `text_freshness_scored` recording `regenerated: true` (REQ-6256). Closed by: a test with a stub Master that repeats on every call.
4. Given the canon's recurring cast and familiar lines, when the do-not-use rule runs over each as though used 4 times in 14 days, then the content test fails on any line it would strike that the canon hasn't tagged `catchphrase`, and a planted untagged greeting fails it (REQ-6264). Closed by: the content test and its fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the projection `phrase_counts`, the do-not-use list in each order's `doNotUse`, the search after ADR-0110's checks and the single regeneration. `content/lemmas.ru.json` is a form-to-lemma table that a tool script builds once from the OpenCorpora dictionary; the owner commits it. ADR-0330 chose 30 entries so the list stays under about 300 tokens of the 3,000 that ADR-0110 budgets for the dynamic part, and chose the threshold of more than 3 so a phrase can recur about once in 4 or 5 days of play before it counts as a habit. A repeat after regeneration shows, because the library scene it would fall back to repeats more. The rule of once a session for each running joke stays as the canon states it.

## Depends on

Nothing in this epic. The epic realising ADR-0110 supplies the checks, the retry path and story memory; until it exists the task runs on a stub Master and fixture memory.

## Evidence

Not yet.

## Left alone

Scoring each opening's similarity, the decks and the weekly sample, which TSK-0957 builds on this task's lemma table, and the repetitiveness figure on the Interest section, which TSK-0962 shows.
