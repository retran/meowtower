---
id: TSK-0959
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6268, REQ-6270, REQ-6272, REQ-6274, REQ-6276]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# She rereads any chapter, marks favourites and finds hidden details, and rituals follow game events only

After this task, the story log rebuilds any past chapter or scene from `scene_shown` with no model call, a scene can be marked a favourite, a scene order can carry one hidden detail of a checkpoint she has reached, and a ritual names a game event and never a time.

## Acceptance criteria

1. Given a past chapter and a past scene, when she rereads and rewatches them, then the scenes show exactly as shown, `chapter_reread` and `scene_rewatched` are appended, and a gateway stub that fails on any call stays unused; a static check finds no import of the gateway in a story log route (REQ-6268). Closed by: a route test and the static check.
2. Given a scene, when she marks it a favourite and unmarks it, then `scene_favorited` is appended with `favourite` true and false, and the story log and the Parent Room's story book show the mark (REQ-6270). Closed by: a route test and a component test.
3. Given canon sections tagged `hidden_detail` with checkpoints, when a prompt is built for a checkpoint she hasn't reached, then no detail of a later checkpoint enters the prompt, and a scene order carries at most one `hiddenDetailId` (REQ-6272). Closed by: a prompt-builder test over each checkpoint.
4. Given a simulated run in which she finds no hidden detail, when the story is played to its end, then no progression rule, quest template or Director event reads `hidden_detail_found`, and the run completes (REQ-6274). Closed by: a static check on readers of the event and a simulation run.
5. Given a ritual entry with a field for a time or a date, or an `on` value outside `floor_first_scene`, `chest_opened`, `finale` and `familiar_evolved`, when the build runs, then it fails (REQ-6276). Closed by: a static check with a planted entry.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the story log's read routes, the favourite route, the hidden-detail route and the rituals loader, each with the paths SPC-0330's Routes table gives. The hidden-detail spot is drawn by the client on a scene that carries `hiddenDetailId`; one per scene is a limit ADR-0330 chose so a scene never turns into a search. A ritual tied to the calendar would become a reason to play on a given day, a streak by another name, so the schema has no field for one.

## Depends on

Nothing in this epic. The epic realising ADR-0110 supplies the prompt builder and its checkpoint filter, and the epic realising ADR-0150 the scene screen; until they exist the task runs on the stand-in scene layer and a fixture canon. The owner writes the hidden details, the rituals and the `hidden_detail` tags.

## Evidence

Not yet.

## Left alone

The "Show" cards and the printed story book, which TSK-0960 builds, and the Interest section's count of rereading and favourites, which TSK-0962 reads.
