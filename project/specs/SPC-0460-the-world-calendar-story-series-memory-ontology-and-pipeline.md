---
id: SPC-0460
artifact: spec
status: live
revised: 2026-11-01
states: [REQ-8058, REQ-8060, REQ-8062, REQ-8064, REQ-8066, REQ-8072, REQ-8074, REQ-8076, REQ-8078, REQ-8082, REQ-8084, REQ-8086, REQ-8088, REQ-8090, REQ-8092, REQ-8094, REQ-8096, REQ-8098, REQ-8254, REQ-8104, REQ-8106, REQ-8108, REQ-8110, REQ-8112, REQ-8114, REQ-8168, REQ-8170, REQ-8172, REQ-8174, REQ-8176, REQ-8178, REQ-8180, REQ-8182, REQ-8184, REQ-8186, REQ-8188, REQ-8190, REQ-8192, REQ-8194, REQ-8196, REQ-8198, REQ-8244, REQ-8250, REQ-8204, REQ-8206, REQ-8246, REQ-8248, REQ-8214, REQ-8256, REQ-8218, REQ-8220, REQ-8222, REQ-8224, REQ-8228, REQ-8234, REQ-8236, REQ-8238, REQ-8240, REQ-8252, REQ-8258, REQ-8260, REQ-8262, REQ-8264, REQ-8266, REQ-8268, REQ-8270, REQ-8272, REQ-8274, REQ-8276, REQ-8278, REQ-8280, REQ-8282, REQ-8284, REQ-8286, REQ-8288, REQ-8290, REQ-8292, REQ-8294, REQ-8296, REQ-8298, REQ-8300, REQ-8302, REQ-8304, REQ-8306, REQ-8308, REQ-8310, REQ-8312, REQ-8314, REQ-8316, REQ-8318, REQ-8320, REQ-8322, REQ-8324, REQ-8326, REQ-8328, REQ-8330, REQ-8332, REQ-8334, REQ-8336, REQ-8338, REQ-8340, REQ-8342, REQ-8344, REQ-8346, REQ-8348, REQ-8350, REQ-8352, REQ-8354, REQ-8356, REQ-8358, REQ-8360, REQ-8362, REQ-8364, REQ-8366, REQ-8368, REQ-8370, REQ-8372, REQ-8374, REQ-8376, REQ-8378, REQ-8380, REQ-8382]
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

Each adventure's scenario is prepared before she plays it, as a graph of 10 to 20 encounters (REQ-8244). An encounter's exits are consequences of how it went (REQ-8246), and the Master unfolds it into a full scene in play, with its text, her choices and how its checks arise (REQ-8248), and code checks that every path reaches an ending (REQ-8204). The scenario is a loose skeleton that reaches the Master in its system prompt, and the game runs no graph itself (REQ-8252). Like a good Dungeon Master, the Master keeps play within it and the setting, and adapts or changes encounters and links to what she does (REQ-8250). An adventure is a run of turns: the Master describes a scene, she acts in her own words, and the world answers at once (REQ-8168). She can act without typing, by starters or speech (REQ-8196). When an action can fail and failing matters, the Master calls `request_check` and a maths task resolves it (REQ-8170). The Director chooses the task, whatever the action (REQ-8176), and the frame author sets it in what she tried (REQ-8174). The engine's verdict is the outcome, and the Master can't change it (REQ-8172): `clean` succeeds, `partial` succeeds at a cost, and `alt` moves on with a twist (REQ-8180). The Master changes the world only through `change_world` (REQ-8182). The Director's note makes the next obstacle a check when checks fall behind, so an adventure keeps its graded attempts (REQ-8178). A level lets her act with no check in its domain: at level 3 the verb's ordinary use, at level 4 a shortcut, at level 5 helping someone else (REQ-8192). The judge scores whether a check's story follows what she tried (REQ-8214). The Master can't change a check's outcome or the canon's truths, and what it adds goes through `change_world` (REQ-8256). It reports where it is and what it changed through tool calls. The Parent Room shows every turn (REQ-8218). The Master's system prompt states the forbidden-content checklist and the canon's rules as guardrails (REQ-8222). A full audit keeps her words, the full request and reply, every check's result, each change to the world and each cost for each turn, and the Parent Room shows it (REQ-8224). An adventure plays only from a scenario the parent approved, and the Master's play from it needs no approval (REQ-8266, REQ-8268). After each adventure the Parent Room offers a detailed report in play order: every text she saw, her words, every task with its answer and result, and the branch taken (REQ-8228). Every reply passes the code's forbidden-word check, and a blocked turn reads as story (REQ-8194).

### Spine, arcs and episodes

The world's truths, its people and the Tower's secret stay fixed in the canon (REQ-8186). Her decisions can change the plot and its ending (REQ-8184). Each adventure's ending feeds its arc, and arcs feed the overall plot (REQ-8206). An arc is replanned from what she did (REQ-8188), and a major decision stays in the ontology (REQ-8190). The game generates arcs as the plot and her actions develop (REQ-8072), of the kinds Guardian, Tangle, rival, training, mystery, tournament, filler and season finale (REQ-8074). Each adventure is one episode (REQ-8076), with a cold open, a recap, its own story and a hook (REQ-8078). A significant choice is echoed within 7 episodes (REQ-8168). An arc never chooses a task, a slot or a floor (REQ-8082).

### Story memory

Memory holds spine, season, arc and episode summaries and the live situation (REQ-8084). Each summary is an event, so memory rebuilds with no model call (REQ-8086). Each request keeps memory within a budget: about 6,000 tokens for planning roles and 3,000 for scenes (REQ-8088). Task requests' `arc`, `adventure` and `situation` slots hold only checked summaries and the Director's typed state (REQ-8090).

### The ontology

Tables hold typed records of characters, relations, places, threads, setups, conflicts, secrets, beats, episodes and arcs (REQ-8092). A record from the canon is read-only (REQ-8094). A story request gets skill state only as a world fact naming no number, node or skill, from a code table (REQ-8096). Generated text never states the Tower's secret (REQ-8098).

### The pipeline

Between adventures and at major events, the showrunner picks an arc, the arc writer plans it, the episode writer sets its situations, the beat writer suggests beats, the script doctor critiques them and the beat writer revises until no major fault is left, within 6 revisions and the budget (REQ-8254), so the scenario is ready before she plays (REQ-8198). Code then checks continuity against the ontology before she plays (REQ-8104), and in play a continuity fault only reports (REQ-8220). Craft rules run as code checks or as the critic's rubric (REQ-8106). The Master writes scenes, and the story editor writes the summary and the ontology diff. The parent can mark an episode, and the critic reads the marks (REQ-8114). Spend is measured against the adventure and month limits (REQ-8112).

### The studio

The Parent Room shows the campaign as a graph of arcs, each arc as a graph of adventures and each adventure as a graph of encounters, and opening a node opens the graph inside it (REQ-8258). The parent can generate each level (REQ-8260). A prompt on a selected node makes an agent rework that level under the same checks (REQ-8262). Every edit makes a new version, and older ones stay readable (REQ-8264). A change above approved work marks it for review (REQ-8270). With no approved scenario, the game plays tasks with no scenario and notifies the parent (REQ-8272). Each arc and adventure shows `draft`, `approved`, `playing` or `played` (REQ-8274), and a played adventure has its log beside the general log (REQ-8276). The parent reads and edits libraries of characters, places and facts, which every story agent reads (REQ-8278). A campaign-wide profile of the child and her interests reaches every story agent (REQ-8280), through the egress guard on the player tier, and holds no real name or school (REQ-8282).

### Structure

A scenario states its central conflict and dramatic question (REQ-8328). Each encounter holds an act, a beat, a tension and a value that turns (REQ-8330). Code checks the three acts, the turning points, that acts never go backwards, that values turn, that the climax is the peak and that every path passes it (REQ-8332). An arc holds the same structure across its adventures (REQ-8334).

### Serial structure

The levels are a series, a season, an episode and a scene. Campaign, arc and adventure each hold a logline by the formula, with no names (REQ-8338). The campaign holds a theme, the heroine's arc, a mythology and a plan of reveals (REQ-8340). An arc holds its anchors and a closing question (REQ-8342). Each adventure has a kind: mythology, case, character or filler (REQ-8344). It holds lines A, B and C, and A closes in it (REQ-8346). Its encounters follow the 15 beats, and several may share one (REQ-8348). It holds a clock that events can shorten, except a filler (REQ-8350). A setup is planted before it pays, and the ledger crosses levels (REQ-8352). It ends on a cliffhanger prepared earlier, with an honest way out (REQ-8354). An opposing force has its own logic and believes it is right (REQ-8356). An encounter holds a tactical goal, opposed intentions, a turn of polarity and readable subtext (REQ-8358). The Master shows and doesn't tell, gives rules when she hits them, and may reach a beat another way (REQ-8360). Code checks what a field proves, and the critic judges the rest (REQ-8362). All is lost never means a death, a dark night stays short, and a cliffhanger stays within the creepiness level and leaves no fright at the end of a day (REQ-8364). A campaign opens from a bible that every generator reads (REQ-8378). The pipeline runs as a writers' room: an arc lead, a story editor, a staff writer, a script doctor and a keeper, with the parent as showrunner (REQ-8380). The Master's prompt states the rules of dialogue rhythm (REQ-8382). The studio shows a mythology map (REQ-8366). A character's library entry holds a want, a need, a wound, a false belief, a voice, skills, weak spots, relations and an arc (REQ-8376). A twist is prepared by setups she could have seen, and an adventure may hold a false trail (REQ-8368). A major twist of an arc strikes the heroine's false belief (REQ-8370). An arc's ending states whether it closes its question, and the campaign's final ending closes her change (REQ-8372). The pipeline writes logline, synopsis, treatment and beat sheet before encounters, and the critic reads the treatment first (REQ-8374).

### What the Master remembers

The Master records facts and events by `record_fact` and `record_event` as play goes (REQ-8320). Each played adventure leaves a summary linked to them (REQ-8322). The parent can attach library entries to a scenario or an encounter, and those reach the Master by default (REQ-8336). Each turn's request carries them and the other entries that touch the scene, and `query_world` searches the rest (REQ-8324). The parent can read, correct or remove any of them (REQ-8326).

### Testing from the Parent Room

The parent's sandbox exists before any test feature, and nothing done in test reaches her game (REQ-8284). There the parent plays any adventure, drafts included, from any encounter, as the child sees it (REQ-8286), sets any game state (REQ-8288), and forces the next outcome, a fall, a rise or an open gate (REQ-8290). An inspector shows each turn's request, reply, tools, the Director's note, cost and time (REQ-8292). A simulated player runs a scenario under a persona and reports its paths (REQ-8294), and the graph marks what tests reached (REQ-8296). The task lab opens any template, node or level (REQ-8298), the screen lab any child's screen in any language (REQ-8300), and the prompt lab each prompt's version with a comparison of two runs (REQ-8302). A page names where each feature is tested, and a test fails when one has no place (REQ-8304). Testing has its own monthly limit (REQ-8314).

A field can be edited by hand, and the edit passes code's check (REQ-8306). A prompted edit shows beside the old version with changes marked, until the parent keeps or discards it (REQ-8308). A prompt reworks a node's level by default, and everything inside it when asked (REQ-8310). Each spending action shows an estimate first (REQ-8312). A library entry shows where it is used (REQ-8316). Generators and edits run as background jobs with progress on the page (REQ-8318).

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
