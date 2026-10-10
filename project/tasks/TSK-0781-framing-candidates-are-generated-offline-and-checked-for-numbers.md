---
id: TSK-0781
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5126]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `npm run framings:generate` writes framing candidates under `FRAMING_MODEL`, and a code check rejects any line with a number before the queue

After this task, `npm run framings:generate` asks `FRAMING_MODEL` on the offline key for 3 variants for each familiar kind and each rung 1 to 3, a code check rejects a line with a digit, a Russian numeral in any inflection, a placeholder brace, a familiar's name or a forbidden word, and only a line that passes enters the parent's queue.

## Acceptance criteria

1. Given candidate lines with a digit, «одна», «третьему», a brace and a familiar's name, when the code checks run, then each fails before the queue, and «раз» (time, once) passes (REQ-5126). Closed by: a unit test with the five fixtures and the one that passes.
2. Given `content/numerals.ru.json` with every inflected form of the numerals, when a line holds any form, then the check rejects it, and the check reads the list and never a stem (REQ-5126). Closed by: a unit test over the file's forms.
3. Given a generator run, when the queue is read, then each familiar kind and rung holds at most 5 candidates, a candidate older than 60 days is expired, and each request is made under `FRAMING_MODEL` on the content tier and offline key (REQ-5126). Closed by: a generator test with a recorded model.
4. Given a candidate that fails the safety check of ADR-0130's module, when it is processed, then it never enters the queue and the generator logs the failing check (REQ-5126). Closed by: the generator test with a fixture candidate.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `npm run framings:generate`, which writes candidates outside any session under the offline role `FRAMING_MODEL`, in Russian and addressing her as «ты» (you) with no name, as ADR-0120 does. With six to nine familiars the approved set holds at most 81 lines, and a candidate older than 60 days expires, as ADR-0130's do.

Put the numerals in `content/numerals.ru.json` as every inflected form, because a stem match would reject «раз», which REQ-5126 lets pass. The check can't tell «одна» (alone) from «одна» (one), so it rejects both; I took this default from REQ-5126, because a false rejection costs one rewritten line and a leaked number reaches the player. Run the safety check of ADR-0130's module after the code checks.

## Depends on

Nothing.

The epic realising ADR-0210 supplies the `FRAMING_MODEL` role and the offline key's rules; until it exists the generator calls a recorded stand-in. The epic realising ADR-0130 supplies the safety check module.

## Evidence

Not yet.

## Left alone

The parent's screen that reviews the candidates, which TSK-0782 holds, and English and Dutch lines, which need `framings.en.json` and `framings.nl.json`.
