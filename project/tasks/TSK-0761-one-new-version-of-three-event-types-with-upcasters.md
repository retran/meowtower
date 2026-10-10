---
id: TSK-0761
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5066, REQ-5072]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `item_shown`, `attempt_submitted` and `verdict` each get one new version for the whole addendum, and each fact has one record

After this task, `src/shared/events.ts` holds one new payload version of `item_shown`, `attempt_submitted` and `verdict`, each with an upcaster from the version before it and every new field optional, and the log has no `estimate_submitted` type and no `grouping`, `planChoice` or `selfCheck` field on `attempt_submitted`.

## Acceptance criteria

1. Given stored events of the three types at their current versions, when they are replayed through the new upcasters, then every projection gives the same result as before the change (REQ-5066). Closed by: a replay test over the 30-day simulation's log.
2. Given an `item_shown` stored at its current version, when the upcaster runs, then the new version carries `forms` as an empty list; given a new `item_shown`, then it validates with `forms` present or absent (REQ-5066). Closed by: the schema test.
3. Given the registry, when it is searched for an `estimate_submitted` type and for fields named `grouping`, `planChoice` or `selfCheck` on `attempt_submitted`, then it finds none, and a fixture schema that adds one makes the test fail (REQ-5072). Closed by: the schema test.
4. Given an approved item decision that writes a field of the addendum, when its field is added, then it joins this version and doesn't create another (REQ-5066). Closed by: a registry test that fails when a second version of the same type is registered for the addendum.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Register the next version of each type: `item_shown` v2, `verdict` v2 and `attempt_submitted` v3, because the registry already holds v2 of `attempt_submitted` for the two flags `interrupted` and `crossDevice`. ADR-0210 and ADR-0220 write "version 2" for all three; the number the registry needs for `attempt_submitted` is the one after its latest.

The new `item_shown` carries `forms`, the list of new forms the shown task uses, with an empty list for an ordinary task. The engine fills it from the template and the Director's choices when it shows the task. The estimate is the one exception: an item with an estimate keeps `forms` empty. Every other field the item decisions add (ADR-0220's `hintMaxLevel`, ADR-0240's `estimate`, `estimateRight`, `estimateLabel` and the item's option values) is added by that decision's own task to this version, and each is optional so a stage that hasn't built an item leaves it absent. The upcaster from the version before sets `forms` to an empty list and leaves the other new fields absent.

Apply ADR-0210's rule for one record per fact: a fact that arrives in the same request as the answer is a field of `attempt_submitted`, and a fact she commits before the answer is a type of its own, which its item decision owns. `self_corrected` is no type; the report derives a saved or spoiled answer from `self_check_used` and the attempt that follows.

ADR-0360 settles the one open value: the upcaster sets `hintMaxLevel` to 3, as ADR-0220 decides, because every ladder before ADR-0220 had three rungs. The task of the epic realising ADR-0220 that changes the hint and thread payloads adds that field and its upcast to the version this task registers.

## Depends on

Nothing.

## Evidence

Not yet.

## Left alone

The meaning of `hint_shown` and `thread_spent`, whose new versions ADR-0220 defines, and the fields each item decision adds.
