---
id: TSK-0635
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3638, REQ-3606, REQ-3608]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The frame library is the set of frames the log accepted, and the build counts them for each structure

After this task, the server serves a frame only when the log holds its acceptance and no later removal, writes the library to `content/frames.ru.json`'s export, and the verify command fails when a structure holds too few accepted frames for the stage.

## Acceptance criteria

1. Given a frame in `content/frames.ru.json` with no `frame_accepted` event, when a task asks for a frame of its structure, then the frame isn't shown, the server reports `frame_unaccepted` once at start, and the same frame shown after an acceptance event is served (REQ-3638). Closed by: an integration test over the log and the file.
2. Given an accepted frame, when a `frame_removed` event follows, then it leaves the library at once and an acceptance after the removal brings it back (REQ-3638). Closed by: an integration test.
3. Given a library change, when it is written, then `data/exports/frames.ru.json` holds the library's frames and their hashes, and the file the owner commits to `content/frames.ru.json` is the same list (REQ-3638). Closed by: an integration test that compares the two files after a change.
4. Given a fixture library with 4 accepted frames for one structure at stage 0.2, when the verify command's frame check runs, then it fails naming the structure and the count; given 5 it passes; given 19 at stage 0.4 it fails and given 20 it passes; and a frame that fails step 3 fails the check with its hash (REQ-3606, REQ-3608). Closed by: a unit test of the check with the four libraries.
5. Given the library at stage 0.2, when the parent reads 20 accepted frames, then each reads as a problem the player can solve (REQ-3606). Closed by: the parent's judgement at the stage 0.2 acceptance, because only a person can say that a story reads as solvable.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Build the library as a projection of `frame_accepted` and `frame_removed`, as `src/engine/projections/` builds its others. I chose the log over a flag inside the file, because the log is the only truth. The check function sits in `src/frames/library-check.ts` and returns findings for the verify command of `tools/` to print; the stage's target numbers are 5 from stage 0.2 and 20 from stage 0.4. The check counts a frame only when the newest snapshot of the log holds its acceptance, as ADR-0370 sets.

## Depends on

- TSK-0634 (blocking): the acceptance event and its shape come from the review routes.

The epic realising ADR-0190 holds the verify command and the stage setting. Until it lands, the check runs from a test.

## Evidence

Not yet.

## Left alone

Which accepted frame a task gets, which TSK-0636 decides, and the content: reaching 140 accepted frames by stage 0.4 is the parent's work and no task writes it.
