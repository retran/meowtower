---
id: TSK-0675
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-3118, REQ-3122, REQ-3232, REQ-3500, REQ-3516]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent looks at every screen in both themes and all four presets and signs off the five rules a person must judge

After this task, a command renders every screen in 2 themes and 4 presets into one folder, and the parent, who reads it at stage 0.3 acceptance, signs off no red for a poor result, text on solid surfaces, six distinct log looks, a story-first centre and a light on every Underside screen.

## Acceptance criteria

1. Given every screen the client renders, when `npm run screens:review` runs, then it writes one image for each screen, theme and preset, 8 for each screen, to a folder, and prints the count and the folder (REQ-3500). Closed by: the command's output.
2. Given the images, when the parent looks at them at the stage 0.3 acceptance, then no screen uses red to mark a wrong answer or a poor result (REQ-3118). Closed by: the parent's judgement, because red as a grade is a reading of a colour in context that no contrast number gives.
3. Given the images, when the parent looks at them, then every long text sits on a solid, opaque surface and none sits over a picture or on a translucent panel (REQ-3122), and the narrator, characters, familiars, the heroine, the Diary and System windows each have a look of their own in the story log (REQ-3232). Closed by: the parent's judgement.
4. Given the images, when the parent looks at them, then the story log and the input line are the centre of every story screen with the scene picture beside them (REQ-3500), and every Underside screen shows a light (REQ-3516). Closed by: the parent's judgement.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `screens:review` script to `package.json` as a Playwright run that visits each route the client renders with each theme and preset set through the profile. The screens with no owner component, the scratchpad, the rest stop scene, the eye exercises and the hunter's sheet, are built on the same tokens by their own epics and join the list of routes when they land. The parent's sign-off is written into the stage acceptance record of the epic realising ADR-0190; this task writes no record of its own.

## Depends on

- TSK-0663 (blocking): the looks can be set through the profile.
- TSK-0671 (blocking): the story screen the images show.
- TSK-0672 (blocking): the Underside screens and their light.
- TSK-0673 (blocking): the displays the images show.

## Evidence

Not yet.

## Left alone

Everything that has a number: contrast, sizes and motion have their own checks, and the judgement here concerns only what a person reads on the picture. The test mode's frame is ADR-0340's sandbox frame and its epic draws it.
