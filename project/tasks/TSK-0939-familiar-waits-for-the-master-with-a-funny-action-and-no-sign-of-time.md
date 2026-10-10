---
id: TSK-0939
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0320
closes: [REQ-6140, REQ-6146, REQ-6148]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# While the player waits for the Master, the familiar does something funny, nothing shows time passing, and voice stays optional

After this task, the familiar plays one of its waiting animations in the scene column from the moment free text is sent until the Master's reply begins, no spinner or progress bar shows, and every story choice can be made by tapping or typing.

## Acceptance criteria

1. Given free text sent in a Playwright test with the Master's reply delayed, when the wait starts, then the familiar plays one of its waiting animations in the scene column, chosen as a shuffled cycle for that familiar, and it stops when the reply begins to show; given a scene that doesn't draw the familiar, then the client draws it for the wait (REQ-6146). Closed by: a Playwright test and a cycle test over 100 waits.
2. Given the same wait, when the page's elements are listed, then there is no spinner, no progress bar, no element with `role="progressbar"`, no hourglass and no line «Система обрабатывает…» (REQ-6148). Closed by: a Playwright test that scans the DOM during the wait.
3. Given `content/familiars.yaml`, when the content check reads each familiar's waiting animations, then none is a filling, counting or circling shape, because those read as a spinner or a progress bar (REQ-6148). Closed by: a content check that reads each animation's declared shape.
4. Given the waiting animations, when the parent watches them at stage acceptance, then each is a funny action, such as chasing its tail or juggling a thread (REQ-6146). Closed by: the parent's judgement, because only a person can tell whether an action is funny.
5. Given a story choice, when a Playwright test makes it by tapping one of the three suggestions, by «Дальше» and by typing, with voice input unavailable, then each succeeds, and the voice control stays beside the text field as an option (REQ-6140). Closed by: a Playwright test for the three ways.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add each familiar's waiting animations to `content/familiars.yaml` with a declared shape for each, the animation cycle in the scene column, and the client's fallback that draws the familiar when the scene doesn't. The familiar replaces the System line as the sign of waiting, because with no sound a still screen feels slower. The free-text field opens only after the player has a familiar, because Session 0 gives the player the starter before its first free text.

## Depends on

Nothing. The epic realising ADR-0110 supplies the free-text path and the Master's reply, and the epic realising ADR-0140 the familiars; until they exist the test runs on a stand-in reply with a delay.

## Evidence

Not yet.

## Left alone

The art of each animation, which ADR-0170's style and the owner's design set. Voice input's own behaviour, which stays as ADR-0150 sets it.
