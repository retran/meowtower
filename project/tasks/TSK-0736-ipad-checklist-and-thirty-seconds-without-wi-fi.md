---
id: TSK-0736
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-2936, REQ-3002, REQ-3004, REQ-3010]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An adult runs a checklist on a real iPad at every stage, and 30 seconds without Wi-Fi lose no answer

After this task, `docs/ipad-checklist.md` lists what an adult checks on a real iPad at each stage, a Playwright test in group 4 loses the connection for 30 seconds during play and finds no answer lost, and the stage 0.2 section asks for an adventure of about 60 minutes.

## Acceptance criteria

1. Given `docs/ipad-checklist.md`, when a test reads it, then it has a section for each of stages 0, 0.1, 0.15, 0.2 and 0.3, and the stage 0 section holds a row for the certificate, the icon, the keyboard, a fraction, the three sound rows, dictation, a Mac restart and 30 seconds without Wi-Fi losing 0 answers (REQ-2936, REQ-3002). Closed by: a unit test that lists the rows.
2. Given the three sound rows, when an adult runs them, then a new install plays nothing, each switch sounds its own channel, and silent mode silences both. Closed by: the adult's judgement on a real iPad, because the browser engine in the automated checks isn't Safari on an iPad.
3. Given WebKit emulating an iPad in landscape and a player answering tasks, when the connection is cut for 30 seconds, then every answer given in that time is in the log exactly once after it returns (REQ-3004). Closed by: a Playwright test in group 4.
4. Given a real iPad, when an adult cuts Wi-Fi for 30 seconds during the spike's play, then 0 of the answers given in that time are lost (REQ-3004). Closed by: the adult's judgement against the log, because a real iPad is the only place the platform's behaviour shows.
5. Given the stage 0.2 section, when an adult follows it, then it asks for an adventure of about 60 minutes played through (REQ-3010). Closed by: the adult's judgement that the section asks for it and that the play took about 60 minutes.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write `docs/ipad-checklist.md` with the stage 0 rows above and an empty section for each later stage that the stage's epic fills, because the checklist grows with each stage. Add the Playwright test to group 4, which uses the same loss of connection the answer queue of ADR-0030 already handles. A real iPad judges the keyboard, sound, dictation and the home-screen icon (REQ-3002), because a test runner's browser engine can't.

The spike's sound test page with a music switch and an effects switch, both off on a new install, belongs to the epic that builds stage 0's sound. The three sound rows run on that page at stage 0 and on the game's own settings at stage 0.3.

## Depends on

- TSK-0724 (blocking): the Playwright test is a check of group 4 in the runner.

## Evidence

Not yet.

Criteria 2, 4 and 5 rest on an adult's judgement on a real iPad, because the building agent has no iPad and a test runner's engine isn't Safari.

## Left alone

The queue that holds the answers, which ADR-0030 built, and the spike's keyboard, sound and dictation themselves, which ADR-0150's epic builds.
