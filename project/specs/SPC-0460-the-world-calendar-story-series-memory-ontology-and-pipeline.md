---
id: SPC-0460
artifact: spec
status: live
revised: 2026-10-31
states: [REQ-8058, REQ-8060, REQ-8062, REQ-8064, REQ-8066, REQ-8070, REQ-8072, REQ-8074, REQ-8076, REQ-8078, REQ-8080, REQ-8082, REQ-8084, REQ-8086, REQ-8088, REQ-8090, REQ-8092, REQ-8094, REQ-8096, REQ-8098, REQ-8100, REQ-8102, REQ-8104, REQ-8106, REQ-8108, REQ-8110, REQ-8112, REQ-8114]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The world calendar, the story series, its memory, ontology and pipeline

## Scope

This document covers the world calendar, the arcs and episodes, story memory, the story ontology and the agents that write through it. SPC-0110 states the Master's scenes, safety and checks. SPC-0070 states the Director. SPC-0140 states gates and rank.

## Boundary

The part lives in `src/story/`. It reads the event log and `canon/`, and it writes events through the log. Its roles are `SHOWRUNNER_MODEL`, `EPISODE_MODEL`, `CRITIC_MODEL` and `STORY_EDITOR_MODEL`, all player tier, through the gateway of SPC-0100. Events: `world_day_passed`, `arc_planned`, `episode_outlined`, `beats_accepted`, `episode_summarised`, `ontology_changed`, `arc_closed`, `generation_failed`, `episode_marked`.

## Behaviour

### The calendar

Each adventure is one day or one night of world time (REQ-8058). Nights are the Tower and days are the town. The calendar advances by played adventures alone (REQ-8060), and a skipped real day passes nothing (REQ-8062). A year has 4 seasons of 3 months of 28 days, with months, seasons and festivals named in the setting (REQ-8064). The Parent Room counts in real dates (REQ-8066).

### Spine, arcs and episodes

The overall plot, its checkpoints and endings stay fixed in the canon (REQ-8070). The game generates arcs as the plot and her actions develop (REQ-8072), of the kinds Guardian, Tangle, rival, training, mystery, tournament, filler and season finale (REQ-8074). Each adventure is one episode (REQ-8076), with a cold open, a recap, its own story and a hook (REQ-8078). A significant choice is echoed within 7 episodes (REQ-8080). An arc never chooses a task, a slot or a floor (REQ-8082).

### Story memory

Memory holds spine, season, arc and episode summaries and the live situation (REQ-8084). Each summary is an event, so memory rebuilds with no model call (REQ-8086). Each request keeps memory within a budget: about 6,000 tokens for planning roles and 3,000 for scenes (REQ-8088). Task requests' `arc`, `adventure` and `situation` slots hold only checked summaries and the Director's typed state (REQ-8090).

### The ontology

Tables hold typed records of characters, relations, places, threads, setups, conflicts, secrets, beats, episodes and arcs (REQ-8092). A record from the canon is read-only (REQ-8094). A story request gets skill state only as a world fact naming no number, node or skill, from a code table (REQ-8096). Generated text never states the Tower's secret (REQ-8098).

### The pipeline

The showrunner picks an arc, the arc writer plans it, the episode writer outlines the episode to the Director's plan, the beat writer writes beats, the script doctor critiques them and the beat writer revises (REQ-8100), at most twice (REQ-8102). Code then checks continuity against the ontology (REQ-8104). Craft rules run as code checks or as the critic's rubric (REQ-8106). The Master writes scenes, and the story editor writes the summary and the ontology diff. The parent can mark an episode, and the critic reads the marks (REQ-8114). Spend is measured against the adventure and month limits (REQ-8112).

### Cost

The pipeline spends through the gateway's adventure and month limits, and each step's cost is in `llm_log`.

## Failure paths

| Failure | What happens |
| --- | --- |
| A pipeline step fails twice | The last accepted plan runs, then an authored library arc for the floor (REQ-8108), and `generation_failed` reports once to the owner |
| Any failure seen by the player | She sees an ordinary episode (REQ-8110) |
| The budget is spent | The library arc runs |
| A summary and ontology diff disagree | The summary is written again once, then the episode keeps its beats as its summary |

## Questions

### What the part is for

It makes one long, generated story that follows the player and a calendar for it.

### What it depends on

The event log, the canon, the Director's plan, the gateway and the Master.

### What depends on it

The Master's scenes and the task prompt's summary slots.

### Where its data lives

In the event log, projected into SQLite tables.

### What crosses a trust boundary

Story requests leave the Mac through the gateway's player tier, after the egress guard, and carry her story material and no skill data.

### How it fails

By library arcs, and the player sees an ordinary episode.

### How it is deployed

Inside the server container.
