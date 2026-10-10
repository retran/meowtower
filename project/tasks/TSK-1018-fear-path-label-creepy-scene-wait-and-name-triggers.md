---
id: TSK-1018
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-1540, REQ-1544, REQ-1622, REQ-1662, REQ-1836]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A judge's `scared` label starts the fear path, a creepy scene has one definition, and the wait is measured on every path

After this task, the judge's `signal` has a fourth label `scared`, a skipped creepy scene is defined by its level and order kind, the wait for the Master's reply is measured from `free_text` to `scene_shown` on every path, and a name that hits a serious trigger takes the serious path.

## Acceptance criteria

1. Given free text with no hand-written trigger that the judge labels `scared`, when the signal is resolved, then the fear path starts, the scene resolves kindly and the creepiness level falls by one for the rest of the day; given a text where a trigger found `serious` and the judge says `everyday`, then the level stays `serious` (REQ-1540, REQ-1544, REQ-1836). Closed by: two safety tests with recorded judge replies.
2. Given a scene shown at level 1 or 2 whose order kind isn't one of the kinds forced to «Уютно», and a scene at level 0, when she skips each before its last line twice in a row on one day, then the first counts towards the fear path and the second doesn't (REQ-1540, REQ-1544). Closed by: a safety test.
3. Given 200 sends spread over a first-try reply, a retried reply, a library scene and the pool line at 12 seconds, when verify runs, then it measures each wait from `free_text` to `scene_shown` in the log and reports the 95th percentile over all paths against 6 seconds (REQ-1622). Closed by: verify's output on the recorded run.
4. Given a name that hits a `serious` trigger and one that hits a `narrator` or `fear` trigger, when each is checked, then the first is refused and takes the serious path, as her free text would, and the second is only refused (REQ-1662). Closed by: a content-check test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `scared` to the `signal` Choice of SPC-0110's judge, ranked above `everyday` and below `serious`; the final level stays the higher of the trigger's and the judge's, so a model's judgement never lowers a level the hand-written triggers found. A check's label map holds up to 8 answers (SPC-0350), so a fourth fits and no extra judge call is needed. A scene at level 0 has nothing in it to fear, so its skip doesn't count. She waits on every path, so a measure of first-try replies alone would hide the slow ones. A serious phrase is a signal about her in whatever field it arrives, while a playfully scary name for a Tangle isn't fear.

## Depends on

- TSK-1026 (not blocking): the bake-off's test set gains `scared` items there, which a local judge needs before it can pass; this task runs on recorded judge replies and can land first.

## Evidence

Not yet.

## Left alone

The hand-written trigger lists and the Master's resolution wording, which ADR-0110 and the content step own.
