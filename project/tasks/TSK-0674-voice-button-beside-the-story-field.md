---
id: TSK-0674
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-3234]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The story field has a voice button, and where Safari offers no speech recognition it opens the keyboard's dictation

After this task, `StoryInput` shows a voice button beside its text field that starts speech recognition in `ru-RU` where Safari offers it and focuses the field where it doesn't.

## Acceptance criteria

1. Given a browser that offers speech recognition, when she presses the button, then recognition starts with the language `ru-RU` and its result is written into the field and never sent by itself (REQ-3234). Closed by: a Playwright test with a fake `SpeechRecognition`.
2. Given a browser with no speech recognition, when she presses the button, then the field takes focus so the system keyboard opens with its own dictation key, and on a computer with none the field shows the dictation line from the language file (REQ-3234). Closed by: a Playwright test with the object removed.
3. Given the button on the iPad viewport, when it is measured, then its hit area is at least 56 px and it sits beside the field (REQ-3234). Closed by: a Playwright test.
4. Given a browser with no speech recognition, when the button is pressed, then the client reports `voice_unavailable` once to the developer and the player sees nothing but the focused field (REQ-3234). Closed by: a unit test of the report.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the button to the ported `StoryInput` and the feature test for recognition at the moment of the press. The owner decided on 2026-09-27 that voice input may use Safari's speech recognition, which sends her voice to Apple; the epic realising ADR-0100 records that at its privacy boundary and this task adds nothing to it. The result goes through the same field as typed text, so the text path of ADR-0110 and the gate of ADR-0160 apply as they do to typing.

## Depends on

- TSK-0660 (blocking): `StoryInput` is a ported component.

## Evidence

Not yet.

## Left alone

Reading the story aloud and every other use of speech, which no requirement of this decision asks for.
