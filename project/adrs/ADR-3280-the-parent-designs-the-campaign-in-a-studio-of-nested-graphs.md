---
id: ADR-3280
artifact: adr
status: approved
revised: 2026-11-01
addresses: [REQ-8258, REQ-8260, REQ-8262, REQ-8264, REQ-8266, REQ-8268, REQ-8270, REQ-8272, REQ-8274, REQ-8276, REQ-8278, REQ-8280, REQ-8282]
supersedes: []
concerns: [privacy, cost]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3280. The parent designs the campaign in a studio of nested graphs, approves each scenario, and the Master plays approved scenarios freely

## Decision

The Parent Room gains a studio. It draws three levels as graphs, in SVG from a small layered layout with no new dependency: a campaign of arcs, an arc of adventures, an adventure of encounters. Opening a node opens the graph inside it.

At each level a generator writes that level through the loop of ADR-3270. The parent selects a node and writes a prompt, and an agent reworks that whole level, under the same code check and critic. Every edit makes a new version in `story_versions`, and older versions stay readable. A change above approved work marks it for review.

An adventure plays only from a scenario version the parent approved. Inside that scenario the Master plays and adapts with no approval, as ADR-3270 states, and the parent reads the report afterwards. With no approved scenario, the game plays tasks with no scenario and notifies the parent.

Each arc and adventure shows `draft`, `approved`, `playing` or `played`. A played adventure has its log, beside the general log. Libraries of characters, places and facts are editors over the ontology of ADR-3240, so every agent reads the parent's edits. A campaign-wide profile of the child and her interests reaches every story agent, on the player tier, through the egress guard, and holds no real name or school. The owner's budget limits hold.

Once accepted, nothing runs yet. After the plan, the parent designs, approves and reads a campaign.

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

1. Storage: versions, statuses and libraries in the event log and tables (REQ-8264, REQ-8274, REQ-8278).
2. The graph page with nested levels (REQ-8258).
3. Generators at each level (REQ-8260).
4. Prompt on a node (REQ-8262).
5. Approval, review marks and the fallback (REQ-8266, REQ-8268, REQ-8270, REQ-8272).
6. Logs (REQ-8276).
7. The child's profile on the player tier (REQ-8280, REQ-8282).
