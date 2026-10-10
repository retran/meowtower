---
id: TSK-0770
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5082, REQ-5086]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Dutch word bridge holds 30 to 50 keywords, and a word shows only after the parent approves it

After this task, `lexicon.ru.json` holds the bridge's keywords as entries with `bridge: true`, a check fails below 30 and above 50, the Director turns the bridge on only once 30 words are approved, no word shows before its `glossary_entry_approved`, and the three bridge event types are written with their payloads.

## Acceptance criteria

1. Given `lexicon.ru.json` with 30 to 50 entries marked `bridge: true`, when the group 1 check counts them, then it passes; given 51, then it fails (REQ-5082). Closed by: the check's test with fixtures at 29, 30, 50 and 51.
2. Given a bridge word with no `glossary_entry_approved` event, when any task or screen is built, then the word appears nowhere; given the event, then it may appear (REQ-5086). Closed by: a Playwright test.
3. Given 29 approved words, when the Director plans, then the bridge stays off, and at 30 it turns on (REQ-5086). Closed by: a Director test.
4. Given a task shown with bridge keywords, a word's card opened and a short check answered, when the log is read, then it holds `bridge_word_seen` with `itemId` and `wordIds`, `bridge_card_opened` with `wordId` and `from` as `task` or `dictionary`, and `bridge_check_answered` with `wordId`, `checkId`, `answer` and `right`, each with owner ADR-0210 (REQ-5086). Closed by: an integration test.
5. Given the bridge's events, when the `bridge` stream is read, then `bridge_check_answered` feeds it and no other estimate (REQ-5086). Closed by: a model test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `bridge: true` flag to lexicon entries. The Dutch word sits in the same field a glossary entry uses for its Dutch equivalent, and no Dutch locale file is added. Add the group 1 check that counts the flagged entries. Make ADR-0180's glossary panel list the bridge words beside the glossary entries with the count of approved ones; the approval writes the existing `glossary_entry_approved`. Make the renderer's and the Director's bridge lookup read approved words only.

The Director turns the bridge on at 30 approved words, so a half-approved list never runs the bridge thin. The bridge joins the stage table at stage 0.3, as ADR-0370 amends ADR-0210, so no earlier stage turns it on. The share of tasks that carry keywords is REQ-6416's, which ADR-0360 addresses, so this task leaves it out.

Register the three bridge event types with owner ADR-0210 and the payloads of ADR-0210's table. `facts_trained_marked` is in TSK-0763. A short check on a word feeds the `bridge` stream only, through `forms`.

## Depends on

- TSK-0762 (blocking): the `bridge` stream the check answers feed.
- TSK-0763 (blocking): the owner field every new schema declares.

The epic realising ADR-0160 supplies the lexicon, the epic realising ADR-0180 the glossary panel, and the epic realising ADR-0360 the bridge's share and the words' content; this task runs on fixture words and leaves the real 30 to 50 and their approval to the parent.

## Evidence

Not yet.

## Left alone

The words themselves, which the parent approves one by one, and the Tower's Dictionary screen's look, which ADR-0150 owns.
