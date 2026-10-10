---
id: TSK-0945
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0320
closes: [REQ-6158, REQ-6160, REQ-6162]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A real iPad shows that a new install is silent, that each switch sounds its own channel, and that silent mode wins

After this task, the stage 0 spike has a sound test page with a music switch and an effects switch, both off on a new install, and `docs/ipad-checklist.md` holds three sound rows that the adult runs on a real iPad and records.

## Acceptance criteria

1. Given the spike's sound test page on a new install, when it loads, then both switches are off and each plays one test file through `playSound` and the audio module the game uses (ADR-0320). Closed by: a Playwright test of the page.
2. Given `docs/ipad-checklist.md`, when it is read, then it holds three rows on sound: a new install plays no sound, each switch makes its own channel sound, and with silent mode on neither channel sounds (REQ-6158, REQ-6160, REQ-6162). Closed by: a check that reads the file for the three rows.
3. Given a new install on a real iPad, when the adult opens the page and the game, then no sound plays (REQ-6158). Closed by: the adult's judgement on the device, because the test browser's WebKit isn't Safari on iPadOS and its audio runs muted.
4. Given the two switches, when the adult turns music on and then effects on, then each makes its own channel sound and the other stays silent (REQ-6160). Closed by: the adult's judgement on the device, for the same reason.
5. Given silent mode on and both channels on, when a test file plays, then neither channel sounds (REQ-6162). Closed by: the adult's judgement on the device, because the test browser can't flip the silent switch.
6. Given the three rows run at stage 0 on the page, when stage 0.3 comes, then the checklist runs them again on the game's own settings in the Parent Room, and the stage's acceptance record holds both results (ADR-0320). Closed by: the adult's recorded judgement at each stage.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the test page to the spike with the same audio module and `playSound` call the game uses, so the device run tests the code the game ships. If the iPad plays Web Audio with silent mode on and the session at its default type, ADR-0320's first reversal condition applies: the owner chooses between removing sound from the MVP and accepting the gap, and this task reports the result that decision needs.

## Depends on

- TSK-0933 (blocking): the audio module the page calls.
- TSK-0932 (blocking): the switches and their stream message.

## Evidence

Not yet.

## Left alone

Which sound files the game ships, and whether the MVP ships any, which this decision leaves open. A fix for a device result that fails a row, which is a defect of its own once found.
