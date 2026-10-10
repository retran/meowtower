---
id: TSK-0944
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0320
closes: [REQ-6156]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The silent acceptance test plays the Awakening and one adventure and counts every audio act

After this task, a group 4 test plays the Awakening and one adventure of the day on WebKit at the iPad viewport with default settings and passes only when both reach their end and no audio context, no media element play and no sound request occurred.

## Acceptance criteria

1. Given default settings, the gateway in `replay` mode and a script that only taps, when the test plays the Awakening and one adventure of the day, then both flows reach their end and an init script counts zero `AudioContext` and `webkitAudioContext` constructions, zero `Audio` constructions and zero `HTMLMediaElement.prototype.play` calls, and the network log counts zero requests under `/sound/` and zero responses with an `audio/` type (REQ-6156). Closed by: the group 4 test's report.
2. Given a test build that constructs an `Audio` element on a tap outside the audio module's channel gate, when the test runs, then it fails (REQ-6156). Closed by: the test run against that build.
3. Given the parent turns effects on, a sound plays and the parent turns effects off, when the test runs once more, then every count is zero again and the service worker's cache holds no `/sound/` entry (ADR-0320). Closed by: the second run's report.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the test to group 4 of ADR-0190. Playwright mutes its browsers by default, so a muted run alone proves nothing: the test counts the acts and not the sound. The init script wraps the three constructors and the `play` method before any page script runs. The test serves one test file per channel under `/sound/` in the test build, so a played sound is counted as a request.

## Depends on

- TSK-0933 (blocking): the module whose silence the test proves and the service worker's rule.

The epics realising ADR-0030 (done), ADR-0110, ADR-0140 and ADR-0150 supply the Awakening and the adventure; until they exist the test plays the stand-in adventure and that epic extends it.

## Evidence

Not yet.

## Left alone

The real iPad's silent mode, which TSK-0945 checks on the device.
