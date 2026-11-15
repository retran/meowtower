---
id: ADR-3430
artifact: adr
status: approved
revised: 2026-11-15
addresses: [REQ-8266, REQ-8268, REQ-8272]
supersedes: []
concerns: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3430. The child's game plays approved adventures with the Master, and the log carries every step

## Decision

When a new daily adventure starts, the game picks the oldest adventure in the studio that is approved, has no review mark and holds an encounter. It marks that adventure as playing, appends `scenario_started` and shows the first encounter as a scene. With none to pick, the game plays plain tasks and raises the parent's notice `no_approved_scenario` (REQ-8272). An adventure already open when this ships stays a plain one.

Each later step is read from the log, so a restart or a second device resumes at the same place. A scene closes by a choice, which moves to an exit's encounter with no model call, or by her free text, which the Master answers in one turn. When the Master asks for a check, its scene has one button, "continue", and the Director's task follows it. After her answer the next turn receives the engine's outcome as a fact (REQ-8176). The Master's adaptation of an encounter needs no approval (REQ-8268). `end_scene` at an encounter with no exit ends the adventure, appends `adventure_completed` after she has read the last scene and marks the studio adventure as played.

A turn the Master fails shows the scene "the fog thickens" with a "continue" button, and the same turn runs again when she taps it, so she is never stuck and her words are not lost.

The Master's reply carries up to three starters. The scene event gains a version 2 with `starters`, and the screen puts a starter into the field on a tap, or on the key 1, 2 or 3 where the field is empty, and never sends it (REQ-6210, REQ-6212). Starters are not buttons that send, because that approved rule says a tap that inserts must not send.

Once this is accepted, an approved adventure plays in her game from its first scene to its ending. What still doesn't work: the Master has no memory of facts and events across adventures, no summaries and no retrieval (plan step 9), and `starter_inserted` is not appended yet (REQ-6210 asks for it).

## Why

REQ-8266 asks that she plays only from an approved scenario, and until now only the parent's sandbox played the Master. The log already holds her game, so a scenario that reads its state from the log gets resume, a second device and replay for free (REQ-0208).

## Alternatives

| Option                                          | Better at                          | Why it lost                                                                  |
| ----------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------- |
| Take the turn in `scene/input`                  | The reply arrives with the answer  | The request waits seconds for a model, and a lost reply leaves the scene closed with no turn. |
| Take the turn in `/next` from the log (this)    | Resume and retry cost nothing      | Each `/next` reads the adventure's events.                                   |
| Starters as sending buttons                     | One tap moves the story            | REQ-6210 forbids a starter that sends.                                       |

## What it costs

A turn takes a model call of about 5 seconds, during which the child's screen shows its waiting scene. The Master's failed turn costs her one extra tap.

The strongest objection: the log is read in full for each `/next` of a Master adventure. The answer is that one adventure's log is small, and the resume projection already reads it the same way.

## What would reverse it

- A turn that takes over 15 seconds in play, which would call for narrating in the background.

## Consequences

The event catalogue gains `scenario_started`, and `scene_prepared` gains version 2. The scene packet gains `starters`. `no_approved_scenario` joins the parent's notices. `setCheckTask` and `recordTurn` take the adventure and session the events belong to.

## How I will know it was realised

1. With no approved adventure the game shows a task and starts no scenario, in an integration test.
2. An approved adventure opens at its first encounter, takes a text turn, an exit, a check with its task and outcome, a failed turn and an ending, in an integration test.
3. A tap and the keys 1 to 3 insert a starter and send nothing, in an end-to-end test on the computer and the iPad.

## What this does not settle

- The Master's facts, events, summaries and retrieval (plan step 9).
- The `starter_inserted` event.
- Which adventure the game picks when several are approved, beyond the oldest.

## Plan

1. A scenario starts, reads its state from the log and ends (REQ-8266, REQ-8268, REQ-8272). It touches `src/server/master-game.ts`, `src/server/play.ts`, `src/server/app.ts`, `src/shared/events.ts` and `src/story/turn.ts`.
2. The screen offers the starters (REQ-6210, REQ-6212). It touches `src/client/play.ts`, `src/shared/api.ts` and the three language files.
