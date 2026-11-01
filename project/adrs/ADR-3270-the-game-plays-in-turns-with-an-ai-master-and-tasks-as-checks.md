---
id: ADR-3270
artifact: adr
status: approved
revised: 2026-11-01
addresses: [REQ-8168, REQ-8170, REQ-8172, REQ-8174, REQ-8176, REQ-8178, REQ-8180, REQ-8182, REQ-8184, REQ-8186, REQ-8188, REQ-8190, REQ-8192, REQ-8194, REQ-8196, REQ-8198, REQ-8244, REQ-8250, REQ-8204, REQ-8206, REQ-8246, REQ-8248, REQ-8252, REQ-8208, REQ-8242, REQ-8214, REQ-8256, REQ-8218, REQ-8220, REQ-8222, REQ-8224, REQ-8228, REQ-8230, REQ-8234, REQ-8236, REQ-8238, REQ-8240]
supersedes: []
concerns: [privacy, cost]
issue: 75
projected: ecb0c42c716e
tracked: e0af7d26da1c
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3270. The game plays as D&D with an AI Master: a prepared branching scenario, her words as actions, a maths task as the dice, and code deciding the outcome

## Decision

Before each adventure, ADR-3240's pipeline prepares a scenario, as a Dungeon Master prepares a module: a graph of 10 to 20 encounters and at least two endings. An encounter states a place, a situation, a goal, its people and their aims, what presses on her and how many checks it holds. Its exits are consequences of how it went and never her choices. The Master unfolds each encounter into a full scene in play, generating its text, her choices and how its checks arise. Branches rejoin, and an encounter takes about 3 to 6 minutes of an hour's play. Code checks that every path ends and fits the Director's plan.

The Master leads her through it in turns, and she has less freedom than in AI Dungeon. The Master describes a scene and offers three starters. She types, speaks or picks one. The Master plays out what she did inside the encounter, either at once or by calling `request_check`. The Master runs the game as a good Dungeon Master does: it keeps play within the prepared scenario and the setting, and it adapts or changes encounters and their links to what she does. The scenario is a loose skeleton and reaches the Master in its system prompt, so the game runs no graph itself. The Master reports where it is and what it changed through tool calls, for the parent's report and the Director. It can't change a check's outcome or the canon's truths, and what it adds goes through `change_world`. The Parent Room shows every turn. The Director then takes the next task from its queue, preferring a domain whose verb fits. The frame author sets it in what she tried, and the judge scores whether the story follows that action. A task shows whole, its time runs from that moment for statistics only, and she sees no timer, and the task runs the attempt flow of ADR-0080. The engine's verdict is the roll: `clean` succeeds, `partial` succeeds at a cost, `alt` fails forward with a twist. The Master narrates that result and calls `change_world`, which writes the ontology. A reply is plain text that streams to her as it is written, so the game never hangs, and signals and every technical act go through tool calls and never in the prose. Each request caches its stable prefix, and planning and checking agents return structured replies against a schema. A reply passes one code check before it shows, the forbidden-word list, with no model call per turn, because the owner loosened text checks for now. Every other text check only reports to the audit after the reply. No local trigger reads her text. The Master, by its system prompt, tells play inside the story from her real state, and reads real-life signals in its ordinary reply through the tool `report_signal`, naming `none`, `everyday`, `scared` or `serious`, with no separate model call, and a level above `none` notifies the parent without pausing the game. The owner decided on 2026-11-01 that Anthropic's own safeguards in the model, with the prompt's guardrails, are enough, so the Master's role stays on a Claude model. The Master's system prompt states the forbidden-content checklist and the canon's rules as guardrails, so most faults are prevented at the source. A full audit keeps each turn: her words, the full request and reply, every check's result, each change to the world and each cost, and the parent approves a scenario before it plays (ADR-3280), and play from it needs no approval. After each adventure the Parent Room offers a detailed report in play order: every text she saw, her words, every task with its answer and result, and the branch taken. The game asks for a story for every task, and when one can't be written, the task shows its standard template text.

The Master has tools and no authority over rules: `request_check`, `change_world`, `query_world`, `record_fact`, `record_event`, `report_signal`, `at_encounter`, `adapt_scenario` and `end_scene`. It reads no node, estimate or verdict history: it gets `success`, `cost` or `twist`. The Director adds a short note to each turn, and when checks fall behind it, the note makes the next obstacle a check, so the adventure keeps its graded attempts. An ability level lets her act with no check in its domain: at level 3 the verb's ordinary use, at level 4 a shortcut it opens, and at level 5 helping someone else with it, and guiding threads stay her help in a check.

Her decisions can change the plot and its ending. The canon fixes the world's truths, its people and the Tower's secret. CAN-0080's checkpoints become pressures, which happen unless she changes them. Each adventure's ending feeds its arc, and arcs feed the overall plot: after each adventure the showrunner replans from what she did, using ADR-3240's roles. Major decisions stay in the ontology for good.

Once accepted, nothing runs yet. After the plan, an adventure plays as a tabletop game. Until the Master runs, the current flow stays and tasks play as now. ADR-3240's pipeline now produces this branching scenario, and ADR-0110's scene orders become one turn's order.

## Why

The owner chose D&D with an AI Master on 2026-11-01, and RES-4314 records why code keeps the rules and how measurement survives. The Director chooses tasks, because a player who chooses her check could avoid what she can't do.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: a single scripted line | Cheap | Her decisions wouldn't change anything |
| Free play like AI Dungeon | Most freedom | The owner wants D&D, and nothing could be checked before play |
| Her action picks the task's topic | Feels most direct | She avoids weak topics and measurement breaks |
| The Master judges success | Smooth story | Models blur rules and let players win |
| Dice beside tasks | Familiar | Luck would weaken the link between skill and outcome |

## What it costs

More model calls, about $1.7 an adventure by estimate. Much more of her free text goes to a model, within the player tier, and each reply passes checks, which adds wait. The parent reads the scenario before play and the turns afterwards in the report. A mismatch between an action and a task can feel forced. Replay needs the logged replies, because a model isn't deterministic.

## What would reverse it

- A check often feels unrelated to her action in the parent's reading of a month: the Director's queue widens or the frame author changes.
- The parent finds an unsafe reply in the report: the safety check returns as a blocking model call.
- The audit shows style or continuity faults reaching her often: the reported checks block again.
- Graded attempts fall below the Director's floor for a week: the note acts sooner.

## Consequences

- ADR-3240: its pipeline writes the scenario between adventures, and the Master plays it. ADR-0110: a scene order is a turn's order, and the Master gains tools. ADR-0330: starters stay. ADR-0070: `nextTask` serves checks on demand, inside its corridor. ADR-3230: gates stay, and levels add free actions.
- CAN-0080's checkpoints read as pressures. CAN-0110 gains the rules of a check.
- `turn_taken`, `check_requested` and `world_changed` join the events. The existing replay reads logged replies.

## How I will know it was realised

1. A test feeds a model reply that claims success after a failed check, and the turn is refused.
2. A simulation of 100 adventures with a player avoiding one domain still checks that domain at the Director's rate.
3. A scan finds no node, verdict or estimate in a Master request.
4. A test plays an adventure by buttons alone.
5. A verify run reports spend per adventure under $5 and the share of blocked turns.
6. The parent reads 5 adventures and finds her decisions changed what followed.
7. A check refuses a scenario with a path that has no ending.

## What this does not settle

- Combat and parties, which arcs may use within the same loop.

## Plan

1. The scenario format, its checks and the pipeline's output (REQ-8244, REQ-8204, REQ-8198, REQ-8246, REQ-8254).
2. The turn loop with the Master's tools, behind a switch (REQ-8168, REQ-8182, REQ-8196, REQ-8194, REQ-8250, REQ-8256, REQ-8218, REQ-8220, REQ-8222, REQ-8224, REQ-8228, REQ-8230, REQ-8230, REQ-8234, REQ-8236, REQ-8238, REQ-8240, REQ-8248, REQ-8250, REQ-8252, REQ-8256).
3. Checks: request, Director's choice, frame in the action, outcome ladder and engine authority (REQ-8170, REQ-8172, REQ-8174, REQ-8176, REQ-8180, REQ-8214, REQ-8208, REQ-8242).
4. The Director's note and attempts kept (REQ-8178).
5. Plot that turns: pressures, replanning and memory of major decisions (REQ-8184, REQ-8186, REQ-8188, REQ-8190, REQ-8206).
6. Free actions by level (REQ-8192).
