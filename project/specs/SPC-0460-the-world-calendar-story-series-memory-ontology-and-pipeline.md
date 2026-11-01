---
id: SPC-0460
artifact: spec
status: live
revised: 2026-11-01
states: [REQ-8058, REQ-8060, REQ-8062, REQ-8064, REQ-8066, REQ-8072, REQ-8074, REQ-8076, REQ-8078, REQ-8082, REQ-8084, REQ-8086, REQ-8088, REQ-8090, REQ-8092, REQ-8094, REQ-8096, REQ-8098, REQ-8102, REQ-8104, REQ-8106, REQ-8108, REQ-8110, REQ-8112, REQ-8114, REQ-8168, REQ-8170, REQ-8172, REQ-8174, REQ-8176, REQ-8178, REQ-8180, REQ-8182, REQ-8184, REQ-8186, REQ-8188, REQ-8190, REQ-8192, REQ-8194, REQ-8196, REQ-8198, REQ-8244, REQ-8202, REQ-8204, REQ-8206, REQ-8246, REQ-8248, REQ-8214, REQ-8216, REQ-8218, REQ-8220, REQ-8222, REQ-8224, REQ-8226, REQ-8228, REQ-8234, REQ-8236, REQ-8238, REQ-8240]
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

### Turns

Each adventure's scenario is prepared before she plays it, as a graph of 10 to 20 encounters (REQ-8244). An encounter's exits are consequences of how it went (REQ-8246), and the Master unfolds it into a full scene in play, with its text, her choices and how its checks arise (REQ-8248), and code checks that every path reaches an ending (REQ-8204). The Master leads her through it and keeps her inside it (REQ-8202). An adventure is a run of turns: the Master describes a scene, she acts in her own words, and the world answers at once (REQ-8168). She can act without typing, by starters or speech (REQ-8196). When an action can fail and failing matters, the Master calls `request_check` and a maths task resolves it (REQ-8170). The Director chooses the task, whatever the action (REQ-8176), and the frame author sets it in what she tried (REQ-8174). The engine's verdict is the outcome, and the Master can't change it (REQ-8172): `clean` succeeds, `partial` succeeds at a cost, and `alt` moves on with a twist (REQ-8180). The Master changes the world only through `change_world` (REQ-8182). The Director's note makes the next obstacle a check when checks fall behind, so an adventure keeps its graded attempts (REQ-8178). A level lets her act with no check in its domain: at level 3 the verb's ordinary use, at level 4 a shortcut, at level 5 helping someone else (REQ-8192). The judge scores whether a check's story follows what she tried (REQ-8214). The Master may improvise details, minor people and small side moments, recorded through `change_world`, and can't contradict the canon or the scenario, change a check's outcome or skip the way forward (REQ-8216). The Parent Room shows every turn (REQ-8218). The Master's system prompt states the forbidden-content checklist and the canon's rules as guardrails (REQ-8222). A full audit keeps her words, the full request and reply, every check's result, each change to the world and each cost for each turn, and the Parent Room shows it (REQ-8224). Nothing waits for the parent before she plays (REQ-8226). After each adventure the Parent Room offers a detailed report in play order: every text she saw, her words, every task with its answer and result, and the branch taken (REQ-8228). Every reply passes the code's forbidden-word check, and a blocked turn reads as story (REQ-8194).

### Spine, arcs and episodes

The world's truths, its people and the Tower's secret stay fixed in the canon (REQ-8186). Her decisions can change the plot and its ending (REQ-8184). Each adventure's ending feeds its arc, and arcs feed the overall plot (REQ-8206). An arc is replanned from what she did (REQ-8188), and a major decision stays in the ontology (REQ-8190). The game generates arcs as the plot and her actions develop (REQ-8072), of the kinds Guardian, Tangle, rival, training, mystery, tournament, filler and season finale (REQ-8074). Each adventure is one episode (REQ-8076), with a cold open, a recap, its own story and a hook (REQ-8078). A significant choice is echoed within 7 episodes (REQ-8168). An arc never chooses a task, a slot or a floor (REQ-8082).

### Story memory

Memory holds spine, season, arc and episode summaries and the live situation (REQ-8084). Each summary is an event, so memory rebuilds with no model call (REQ-8086). Each request keeps memory within a budget: about 6,000 tokens for planning roles and 3,000 for scenes (REQ-8088). Task requests' `arc`, `adventure` and `situation` slots hold only checked summaries and the Director's typed state (REQ-8090).

### The ontology

Tables hold typed records of characters, relations, places, threads, setups, conflicts, secrets, beats, episodes and arcs (REQ-8092). A record from the canon is read-only (REQ-8094). A story request gets skill state only as a world fact naming no number, node or skill, from a code table (REQ-8096). Generated text never states the Tower's secret (REQ-8098).

### The pipeline

Between adventures and at major events, the showrunner picks an arc, the arc writer plans it, the episode writer sets its situations, the beat writer suggests beats, the script doctor critiques them and the beat writer revises, at most twice (REQ-8102), so the scenario is ready before she plays (REQ-8198). Code then checks continuity against the ontology before she plays (REQ-8104), and in play a continuity fault only reports (REQ-8220). Craft rules run as code checks or as the critic's rubric (REQ-8106). The Master writes scenes, and the story editor writes the summary and the ontology diff. The parent can mark an episode, and the critic reads the marks (REQ-8114). Spend is measured against the adventure and month limits (REQ-8112).

### Efficiency

Every request with a stable prefix uses prompt caching (REQ-8234). Planning and checking agents return structured replies against a schema, and the Master's prose stays plain text (REQ-8236). Story text streams to her as it is written (REQ-8238). The Master sends signals and every technical act through tool calls and never in its prose (REQ-8240).

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
