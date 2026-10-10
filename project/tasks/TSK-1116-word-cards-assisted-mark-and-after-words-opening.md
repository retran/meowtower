---
id: TSK-1116
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0430
closes: [REQ-7138, REQ-7140, REQ-7142, REQ-7150]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A tapped card marks the attempt assisted, and the after-words presentation opens with its cards

After this task, a marked word in a Dutch presentation opens its card on a tap and marks the attempt assisted while it stays in its presentation's count, and the after-words presentation opens with the cards of every marked word as its planned condition.

## Acceptance criteria

1. Given a letter in `nl` or `nl_source`, when it is shown, then each marked word is underlined and a tap opens its card, and an unmarked word opens nothing (REQ-7150). Closed by: a Playwright test.
2. Given a tap on a marked word in `nl`, when the card opens for the first time in the attempt, then `probe_card_opened` is written with `trigger: "tap"` and that word, the attempt is `assisted: true`, and it stays in the `nl` count; given the same word again, then nothing is written, so an attempt writes at most 8 such events (REQ-7138, REQ-7140). Closed by: a card test and a projection test.
3. Given `nl_after_words`, when the letter opens, then the cards of every marked word show first and the task shows only after she closes them, she can close them at once and reopen any card during the task, and the opening writes one `probe_card_opened` with `trigger: "planned"` and every marked word, a reopening one with `trigger: "reopen"` once a word, and neither marks the attempt assisted (REQ-7142). Closed by: a card test with a fixture family.
4. Given an attempt, when the opened words are read, then they are the `probe_card_opened` events of its `itemId`, and `attempt_submitted` carries no copy of them (REQ-7140). Closed by: an event schema test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the card overlay and the underlining to the task window and the event `probe_card_opened` with the payload ADR-0430 gives, owned by ADR-0430. A term hint she opens in a `ru` letter also marks the attempt assisted, because a word explained on request is help in either language, and a bought hint rung marks every letter assisted. A tap is help she asked for, like a hint rung, so the attempt stays in the Dutch presentation's count and the report shows how much help she asked for; moving it to the after-words presentation would leave `nl` with only the texts she read well. Marks can fall on words of the Dutch source question and labels, and `nl_source` underlines them as `nl` does, as ADR-0460 settles.

## Depends on

- TSK-1113 (blocking): the cards belong to the presentations that task builds.
- TSK-1115 (not blocking): both change the task window, and either can land first.

The epic realising ADR-0150 supplies the task window and the epic realising ADR-0160 the card strings' checks; the task runs on fixtures of both.

## Evidence

Not yet.

## Left alone

The report's counts of opened cards and the word list, which TSK-1119 builds from these events.
