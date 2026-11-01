---
id: ADR-3270
artifact: adr
status: approved
revised: 2026-11-01
addresses: [REQ-8168, REQ-8170, REQ-8172, REQ-8174, REQ-8176, REQ-8178, REQ-8180, REQ-8182, REQ-8184, REQ-8186, REQ-8188, REQ-8190, REQ-8192, REQ-8194, REQ-8196, REQ-8198, REQ-8200, REQ-8202, REQ-8204, REQ-8206, REQ-8208, REQ-8210, REQ-8212, REQ-8214, REQ-8216, REQ-8218, REQ-8220, REQ-8222, REQ-8224, REQ-8226, REQ-8228, REQ-8230, REQ-8234, REQ-8236, REQ-8238, REQ-8240]
supersedes: []
concerns: [privacy, cost]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3270. The game plays as D&D with an AI Master: a prepared branching scenario, her words as actions, a maths task as the dice, and code deciding the outcome

## Decision

Before each adventure, ADR-3240's pipeline prepares a detailed scenario, as a Dungeon Master prepares a module: a graph of 15 to 30 scenes with read-aloud text, options, checks, what each outcome leads to, people and their aims, variants, and at least two endings. Branches rejoin, because a scene count of 15 to 30 fits an hour with about 3 minutes a scene. Code checks that every path ends and fits the Director's plan.

The Master leads her through it in turns, and she has less freedom than in AI Dungeon. The Master describes a scene and offers three starters. She types, speaks or picks one. The Master maps her text to the scene's options, then answers at once or calls `request_check`. The Master improvises as a good Dungeon Master does: it may add details, minor people and small side moments, and it records them through `change_world`. It can't contradict the canon or the scenario, change a check's outcome or skip the way forward, and when she leaves the scene, the scene's hook leads her back in the end. The Parent Room shows every turn. The Director then takes the next task from its queue, preferring a domain whose verb fits. The frame author sets it in what she tried, the judge scores whether the story follows that action, and on an expression task the story shows first and the clock starts when the numbers appear, so thresholds keep their meaning, and the task runs the attempt flow of ADR-0080. The engine's verdict is the roll: `clean` succeeds, `partial` succeeds at a cost, `alt` fails forward with a twist. The Master narrates that result and calls `change_world`, which writes the ontology. A reply is plain text that streams to her as it is written, so the game never hangs, and signals and every technical act go through tool calls and never in the prose. Each request caches its stable prefix, and planning and checking agents return structured replies against a schema. A reply passes one code check before it shows, the forbidden-word list, with no model call per turn, because the owner loosened text checks for now. Every other text check only reports to the audit after the reply. No local trigger reads her text. The Master, by its system prompt, tells play inside the story from her real state, and reads real-life signals in its ordinary reply through the tool `report_signal`, naming `none`, `everyday`, `scared` or `serious`, with no separate model call, and a level above `none` notifies the parent without pausing the game. The owner decided on 2026-11-01 that Anthropic's own safeguards in the model, with the prompt's guardrails, are enough, so the Master's role stays on a Claude model. The Master's system prompt states the forbidden-content checklist and the canon's rules as guardrails, so most faults are prevented at the source. A full audit keeps each turn: her words, the full request and reply, every check's result, each change to the world and each cost, and nothing waits for the parent before she plays. After each adventure the Parent Room offers a detailed report in play order: every text she saw, her words, every task with its answer and result, and the branch taken. The text of every task is set in the story: the scenario holds a prepared setting for each check, and the task shows it when a live story can't be written, so bare template text never reaches her.

The Master has tools and no authority over rules: `request_check`, `change_world`, `query_world`, `report_signal` and `end_scene`. It reads no node, estimate or verdict history: it gets `success`, `cost` or `twist`. The Director adds a short note to each turn, and when checks fall behind it, the note makes the next obstacle a check, so the adventure keeps its graded attempts. An ability level lets her act with no check in its domain: at level 3 the verb's ordinary use, at level 4 a shortcut it opens, and at level 5 helping someone else with it, and guiding threads stay her help in a check.

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

More model calls, about $1.7 an adventure by estimate. Much more of her free text goes to a model, within the player tier, and each reply passes checks, which adds wait. Nobody reads the text before she does, and the parent reads it afterwards in the report. A mismatch between an action and a task can feel forced. Replay needs the logged replies, because a model isn't deterministic.

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

0. Every task's text in the story now: prepared settings per language replace bare template text in `src/server/play.ts`, and the clock of an expression task starts when its numbers appear (REQ-8208, REQ-8210, REQ-8212).
1. The scenario format, its checks and the pipeline's output (REQ-8200, REQ-8204, REQ-8198).
2. The turn loop with the Master's tools, behind a switch (REQ-8168, REQ-8182, REQ-8196, REQ-8194, REQ-8202, REQ-8216, REQ-8218, REQ-8220, REQ-8222, REQ-8224, REQ-8226, REQ-8228, REQ-8230, REQ-8230, REQ-8234, REQ-8236, REQ-8238, REQ-8240).
3. Checks: request, Director's choice, frame in the action, outcome ladder and engine authority (REQ-8170, REQ-8172, REQ-8174, REQ-8176, REQ-8180, REQ-8214).
4. The Director's note and attempts kept (REQ-8178).
5. Plot that turns: pressures, replanning and memory of major decisions (REQ-8184, REQ-8186, REQ-8188, REQ-8190, REQ-8206).
6. Free actions by level (REQ-8192).
