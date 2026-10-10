---
id: TSK-0648
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-1720, REQ-1726, REQ-1744, REQ-1764]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A Guardian always has its three endings, a missed reward always comes back within 7 sessions, and the canon names no threshold

After this task, the build fails a Guardian with fewer than three fallback endings, the reward queue returns every entry within 7 sessions, and a content check fails a canon or line pool that names another outcome or states a share as a number.

## Acceptance criteria

1. Given every Guardian in `content/branches.ru.json`, when the build check runs, then it fails naming the Guardian and the missing state if any of `triumph`, `victory` or `cunning` has no fallback ending; and given a Guardian whose endings are missing at run time, then the Director skips the Guardian's problem, the floor ends with the System's state line and the log holds `guardian_endings_missing` (REQ-1726). Closed by: a unit test of the check and an integration test of the run-time case.
2. Given a reward ordered for `success` and missed on `alt`, when the next lead-in is built, then it takes from `reward_queue` first, oldest first, and an entry 6 sessions old comes without a trial at the next session's first scene, so every entry returns within 7 sessions; secrets a wrapped-up adventure left unopened enter the same queue (REQ-1720). Closed by: a simulation of 30 sessions that reads the age of every returned entry.
3. Given a checkpoint page or a legendary reward missed on `alt`, when the queue is read, then neither is in it and each comes by the calendar (REQ-1720). Closed by: a unit test.
4. Given `canon.ru.md` and `lines.ru.json`, when the content check runs, then it fails on an outcome name other than clean, almost and loosened and on a share written as a number beside the words for a room's branch, and the committed files pass (REQ-1744, REQ-1764). Closed by: the check's fixture test and the lint verb's output.
5. Given the queue holds more than 40 entries, when the day's report runs, then the Parent Room's report tells the owner once, and the ceiling stands in the Baselines table of ADR-0190 (REQ-1720). Closed by: a unit test with 41 entries.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `reward_queue` as a projection of the log and the two checks to `tools/static-checks.ts`. The queue's drain rule is "oldest first, and an entry 6 sessions old comes at the next session's first scene", as ADR-0370 amends it. The outcome names the check accepts are the three of REQ-1744 in the Russian words, read from the language file.

## Depends on

- TSK-0647 (blocking): the branch and state the endings and the queue key on.

The epic realising ADR-0110 supplies the Master's endings and `lines.ru.json`; this task runs on the fallback library alone and on fixture lines.

## Evidence

Not yet.

## Left alone

The text of the endings, which ADR-0110 writes, and the wrapped-up adventure's secrets themselves, which the epic realising ADR-0030 holds.
