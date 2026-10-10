---
id: TSK-0892
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5848, REQ-5850, REQ-5852, REQ-5854]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A Volley with at most one miss gives 1 star yarn, a guess earns nothing, the record never falls and a miss gets a line about the fact

After this task, a finished Volley is marked on target or not, an on-target Volley grants 1 star yarn, the day's count and the record are kept, and every missed row gets a fixed line that names the fact.

## Acceptance criteria

1. Given a Volley with 0 or 1 misses and any answer times, when it completes, then `volley_completed` has `onTarget` true and the grant table holds 1 star yarn for it; given 2 misses, then none; and the Volley moves neither the streak nor the clean-attempt shards and counts as 2 first attempts for the buttons (REQ-5848). Closed by: a grant test over four fixture Volleys.
2. Given a Volley in which the second miss is an answer faster than the fact's minimum time, when it completes, then the rapid guess counts as a miss, the Volley isn't on target, and the guess adds nothing to the day's count; given a Volley of taps, then it is never on target (REQ-5850). Closed by: a test with a fixture of rapid answers.
3. Given a fixture of good and bad days and a wrong answer after a record day, when `volley_record` is read after each day, then the record never falls, and a fact hit in two Volleys on one day counts once toward the day's count (REQ-5852). Closed by: a projection test.
4. Given the pool under `volley.miss.*`, when the content check runs, then it holds at least 20 lines, each with the fact placeholder, none holds «ошибка», «неправильно» or «промах», and over 1,000 draws no line comes twice in a row (REQ-5854). Closed by: a content check and a draw test.
5. Given the 20 or more lines, when the parent reads them, then each speaks about the fact, the Tangle or the System and none about the player (REQ-5854). Closed by: the parent's judgement, because a program can't tell a joke about the player from one about the fact.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `volley_completed` with `volleyId`, hits, misses, rapid guesses, `onTarget` and `perfect`, the `volley_record` projection, the grant row «Volley on target: 1 yarn» in the grant table of ADR-0140, and the reply to each row: the mark, the correct answer after a miss, the miss line, and after the last row the on-target result and the record line. A row hits when it is right and not a rapid guess. A Volley with no miss is perfect and adds a spark to the scene's animation, with no extra reward.

The day's count is the distinct facts hit across the day's Volleys, and the record is the highest count of any day. The record line comes from `ru.json`, one dry line with no time in it.

Write the miss pool in `content/i18n/ru.json` with at least 20 lines. Every line names the fact through its placeholder, and a joke about the Tangle or the System may follow. I chose fixed lines over a model, because a reply that follows each fact inside the answer reply's budget can't wait for a model.

## Depends on

- TSK-0891 (blocking): the Volley's rows and its packet.
- TSK-0890 (blocking): the minimum time that separates a rapid guess from a quick answer.

The epic realising ADR-0140 supplies the grant table, the streak and the shards; until it exists the task adds the row to a stand-in grant function and that epic adopts it.

## Evidence

Not yet.

## Left alone

The forbidden-word list itself, which the epic realising ADR-0160 owns, with the three words this pool adds. The yarn's place in the economy simulation, which the epic realising ADR-0140 measures.
