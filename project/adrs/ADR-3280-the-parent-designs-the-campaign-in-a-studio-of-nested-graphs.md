---
id: ADR-3280
artifact: adr
status: approved
revised: 2026-11-01
addresses: [REQ-8258, REQ-8260, REQ-8262, REQ-8264, REQ-8266, REQ-8268, REQ-8270, REQ-8272, REQ-8274, REQ-8276, REQ-8278, REQ-8280, REQ-8282, REQ-8284, REQ-8286, REQ-8288, REQ-8290, REQ-8292, REQ-8294, REQ-8296, REQ-8298, REQ-8300, REQ-8302, REQ-8304, REQ-8306, REQ-8308, REQ-8310, REQ-8312, REQ-8314, REQ-8316, REQ-8318, REQ-8320, REQ-8322, REQ-8324, REQ-8326]
supersedes: []
concerns: [privacy, cost]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3280. The parent designs, approves and tests the whole game in a studio of nested graphs and a sandbox, and the Master plays approved scenarios freely

## Decision

The Parent Room gains a studio. It draws three levels as graphs, in SVG from a small layered layout with no new dependency: a campaign of arcs, an arc of adventures, an adventure of encounters. Opening a node opens the graph inside it.

At each level a generator writes that level through the loop of ADR-3270. The parent selects a node and writes a prompt, and an agent reworks that whole level, under the same code check and critic. Every edit makes a new version in `story_versions`, and older versions stay readable. A change above approved work marks it for review.

An adventure plays only from a scenario version the parent approved. Inside that scenario the Master plays and adapts with no approval, as ADR-3270 states, and the parent reads the report afterwards. With no approved scenario, the game plays tasks with no scenario and notifies the parent.

Each arc and adventure shows `draft`, `approved`, `playing` or `played`. A played adventure has its log, beside the general log. Libraries of characters, places, factions, items, facts, events and adventure summaries are editors over the ontology of ADR-3240, so every agent reads the parent's edits. The Master records facts and events as play goes, through `record_fact` and `record_event`, with no action from the parent, and each played adventure leaves a summary. Each turn's request carries the entries that touch the scene, the Master searches the rest with `query_world`, and the parent can correct or remove any entry. A campaign-wide profile of the child and her interests reaches every story agent, on the player tier, through the egress guard, and holds no real name or school. The owner's budget limits hold.

The studio has screens for design, world, review, test and logs, and RES-4315's Design section states them. A prompt reworks a node's level by default and everything inside it when asked, shows beside the old version with changes marked, and the parent keeps or discards it. A plain edit passes code's check. Generators and edits run as background jobs, and each spending action shows an estimate first.

The next test stage runs through this page, so test comes first. The sandbox of ADR-0340, not yet built, is built first, and nothing in test reaches her game. There the parent plays any adventure, drafts included, from any encounter, sets any state, forces outcomes, reads each turn in an inspector, runs a simulated player under a persona and sees coverage on the graph. A task lab, a screen lab and a prompt lab open any task, any child's screen and any prompt. A checklist names where each feature is tested, and a test fails when a feature has no place. Testing has its own monthly limit, proposed at $50.

Once accepted, nothing runs yet. After the plan, the parent designs, approves, reads and tests the whole game from this page.

## Why

The owner asked for this on 2026-11-01, and RES-4315 records the shape. Approval sits on the prepared scenario because that is the part a person can read, and play isn't.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: scenarios only as files | No interface to build | The owner can't see or steer the campaign |
| Lists with no graphs | Simple | The shape of branches can't be seen |
| Approve every turn | Most control | Play would stop |
| An external graph library | Richer drawing | A dependency for 20 nodes |

## What it costs

A large interface. The parent's time: a scenario can't play until it is read. Spend on generation and edits, each loop about $0.4 by the one run so far, which the budget counts. The profile's personal material on the player tier needs a route that tier allows: attested zero data retention on the direct route, or a player-tier provider.

## What would reverse it

- She plays with no scenario for two weeks because approval lags: arcs may approve whole.
- The parent never opens a level: that level's generator runs by default.

## Consequences

- REQ-8226 goes. ADR-3250's front page gains a line for scenarios waiting, and a notice when none is approved.
- `SHOWRUNNER_MODEL` moves to the player tier when the profile enters it.
- Migrations add `story_versions` and the library tables.

## How I will know it was realised

1. A Playwright test opens a campaign, an arc and an adventure by clicking nodes, and sees each graph.
1a. A test does every kind of sandbox action and finds no new row in the player's file.
1b. The checklist's test fails when a game feature has no test place.
2. A test edits a node by prompt with a fake model, and finds a new version and the old one readable.
3. A test refuses to play an unapproved scenario and plays tasks with a notice.
4. A test approves a scenario, plays turns with no approval step and finds the log.
5. A test edits a character in the library and finds the edit in the next agent request.
6. A scan finds no real name in a request after the egress guard, with a profile that holds one.

## What this does not settle

- Whether arcs approve whole.
- Pictures of people and places.
- Premortem: the parent generates far more than they read. The queue shows what waits, and nothing plays unread.

## Plan

1. The sandbox of ADR-0340, its budget and the checklist page (REQ-8284, REQ-8304, REQ-8314).
2. Storage: versions, statuses, libraries, with background jobs (REQ-8264, REQ-8274, REQ-8278, REQ-8316, REQ-8318).
3. The graph page with nested levels, reads and logs (REQ-8258, REQ-8276).
4. Levers, task lab and screen lab (REQ-8288, REQ-8290, REQ-8298, REQ-8300).
5. Play from any encounter and the turn inspector, with ADR-3270's turn loop (REQ-8286, REQ-8292, REQ-8296).
6. Generators, prompts, plain edits, comparison and scope (REQ-8260, REQ-8262, REQ-8306, REQ-8308, REQ-8310, REQ-8312).
7. Approval, review marks and the fallback (REQ-8266, REQ-8268, REQ-8270, REQ-8272).
8. Simulated player and prompt lab (REQ-8294, REQ-8302).
9. The Master's facts, events, summaries and retrieval, with the parent's corrections (REQ-8320, REQ-8322, REQ-8324, REQ-8326).
10. The child's profile on the player tier (REQ-8280, REQ-8282).
