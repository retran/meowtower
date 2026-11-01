---
id: RES-4315
artifact: research
status: approved
revised: 2026-11-01
elaborates: RES-4314
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent can design, approve and test the whole game in one studio of nested graphs, with a sandbox that plays anything without touching her game

## Summary

This record is the design document of the Parent Room's studio. It has four parts. The Design part draws three nested graphs, campaign of arcs, arc of adventures, adventure of encounters, with a generator at each level and a prompt on any node that makes an agent rework that level. The World part holds libraries of characters, places, factions, items and facts, a calendar and a campaign-wide profile of the child. The Review part holds versions, statuses, the approval a scenario needs before it plays, and logs of each playthrough and of everything. The Test part lets the parent run any of it in a sandbox: start any adventure at any encounter, force an outcome, set levels and rank, watch each turn's prompt, reply, tools and cost, and send a simulated player through a scenario. The owner asked that the next test stage run entirely through this admin page, so the test part is built first and every game feature gets a way to be reached from it. The parent's sandbox of ADR-0340 is designed and isn't built, so it comes first. Narrative tools confirm the nested shape, and Dramatron's users valued editing at any level while reporting extra work. No source tests a studio like this with a parent, so layouts and limits below are proposals.

## The question

What must the parent see and do, in what screens, on what data, so that the owner can design a campaign, read and approve it, and test every part of the game from the admin page before the next test stage?

The assumption to challenge is that design and testing are separate tools. A designer tests constantly, and a scenario read but never played hides what a Master does with it. So every design screen has a way to play what it shows.

A second assumption is that editing everything is cheap. Every generated level costs money and reading time, so nothing regenerates below a node without a request.

## Method

Read on 2026-11-01: ADR-0340, SPC-0340 by scope, ADR-3240, ADR-3250, ADR-3270, SPC-0180, SPC-0460, and `src/server/parent.ts`, `parent-room.ts` and `admin.ts` by route. A search of `src/` for `sandbox` found nothing, so the sandbox isn't built. One real scenario run on 2026-11-01 cost $0.361 and took two revisions under the older loop.

External sources are labelled Read for pages or papers I read, and Snippet for search summaries. No test ran with a parent.

## Findings

### Nesting moves from macro to micro

[Read] articy:draft opens a layer by submerging into a node with a toolbar button or Enter, goes up by an icon, a key or a navigator tree where inner content shows indented, marks a node with inner content by an icon, and moves inner content with its parent. It advises going from macro to micro, with no fixed rules. [Read] Shneiderman's list of tasks runs overview, zoom, filter, details on demand, relate, history and extract. [Inference] Each level is one graph, a side panel holds the selected node, and a breadcrumb and tree give the way up.

### A hierarchy helps only if it can be edited at any level

[Read] Dramatron builds log line, then characters, plot and locations, then dialogue. Writers can regenerate, continue or edit by hand at each step, and move up and down. One professional liked being able to do "as much human-ing as you want at any level". Others said many generations need "more massaging", and that the interaction seemed simpler with the whole script generated up front. Eight of them mostly removed material and four mostly added, the plot outline was edited least, and more than half felt no ownership. [Inference] The studio generates a whole level at once and doesn't force a person through steps, and it keeps a plain text edit beside the prompt, because people curate.

### A world database is entities with links

[Read] Kanka holds characters, locations, families, organisations, events and quests, links them by @mentions and by relations such as friendships and rivalries, and holds several calendars. [Snippet] World Anvil's breadth brings a learning curve. [Inference] The library is one screen with one shape: a list, a card with fields, and relations.

### Tools check branches by code and test by playing

[Snippet] Yarn Spinner's compiler flags unreached branches, a solver project checks reachability under conditions, and writers want non-linear navigation, variable tracking and a preview of flow. [Inference] The studio needs the same three: code's check, a play from anywhere and a view of the state.

### Prompt tools keep versions and review queues

[Snippet] Langfuse versions prompts and datasets, and holds annotation queues of items for human review with scores and comments, and corrected outputs can feed test sets. [Inference] Each scenario and prompt has a version, the review queue is a page, and each generated thing records the prompt version that wrote it.

### A small layered drawing is enough

[Snippet] Sugiyama's method assigns layers, orders nodes within them and places them, and a small implementation serves graphs under 50 nodes. [Inference] A level has at most about 30 nodes and no cycles, so a small own layout in SVG suffices.

### The sandbox is the base of testing, and it isn't built

[Read] ADR-0340 designs a second game on `sandbox.sqlite`, with the unchanged engine, marked events and a guard that refuses them in her file, confirmed actions that cross over, and $20 a month on the offline key. Nothing of it exists in `src/`. [Inference] Everything under Test depends on it. Its budget is smaller than one month of heavy testing could use, and the owner set $200 for play, so testing needs its own stated limit.

### Approval needs a queue that can't starve play

[Inference] If the parent is away, she must still play. With no approved scenario the game plays tasks with no scenario, and the page says so.

### The profile is personal material

[Read] The direct Anthropic route on the player tier needs attested zero data retention. [Inference] A profile of interests belongs on the player tier and holds no real name or school.

## Design

[Proposal, all of this section]

### Screens

| Screen | Holds |
| --- | --- |
| Front page | ADR-3250's page, with scenarios waiting |
| Studio | The graph of the current level, breadcrumb, side panel, generator |
| World | Libraries, calendar, profile |
| Review | Queue of what waits, versions, comparison |
| Test | Sandbox runs, simulated players, levers, turn inspector |
| Logs | Playthroughs, general log, spend |
| Service | ADR-3250's tab, with prompts and role settings |

### The studio screen

The top row is a breadcrumb: Campaign > Arc > Adventure. The middle is the graph. A node shows its title, status and a mark when it has inner content or needs review. Double click or Enter opens a node. A click selects it, and the side panel shows its fields, its links to the library, its versions and three actions: open, play from here, change.

The bottom of the panel is the prompt box: the parent writes what to change, picks the scope, and sees the cost estimate. Scope is this node's level, which is the default, or this node and everything inside it. The agent returns a new version, which the page shows beside the old as a comparison, with the nodes that changed marked. The parent keeps or discards it. A plain edit of any field works too, and it passes code's check.

### Levels

| Level | Node | Node holds | Edge |
| --- | --- | --- | --- |
| Campaign | Arc | Kind, premise, want, pressure, season, cast | A way the story can go |
| Arc | Adventure | Premise, world date, people, cast, day or night | A consequence of how it ended |
| Adventure | Encounter | Place, situation, goal, people, pressure, checks | A consequence of how it went |

Campaign and arc graphs are checked as adventures are: no loops, every path ends, nothing unknown is named. A level's node may be `empty` until generated, so a campaign can exist before its arcs hold adventures.

### Generators

Each level has one form: a brief, a size and a choice of libraries to draw on. Output goes to `draft`. Generating the campaign writes arcs only. Generating an arc writes its adventures as premises. Generating an adventure writes encounters by the loop of ADR-3270. So cost grows only where the parent asks. A button fills everything below a node, with its cost shown first.

### Versions and statuses

Every save writes a version with who made it, the prompt, the prompt template's version, the cost and the critic's report. A version never changes. Statuses:

| Status | Meaning | Next |
| --- | --- | --- |
| `empty` | Named, not written | `draft` |
| `draft` | Written, unread | `approved`, `draft` |
| `approved` | The parent approved this version | `playing`, `review` |
| `review` | A change above it needs a new reading | `approved`, `draft` |
| `playing` | The current adventure | `played` |
| `played` | Done, with its log | none |

An approved adventure in `review` still can't play until approved again.

### World

Libraries: characters, places, factions, items, facts, events and adventure summaries. Each entry has a name per language, fields, a `source` of `canon`, `parent` or `generated`, and relations, and a canon entry shows as read-only unless the owner changes the canon. A fact has a text, who knows it and whether it can be told. A search finds where an entry is used, so a parent sees what a change touches. The calendar shows the world's months, festivals and arcs. The profile is a free text box, with a note on what leaves the Mac. A prompt box works here too: "add a character who...", and the agent writes a `draft` entry.

### What the Master remembers

The Master writes to the library as play goes, by the tools `record_fact` and `record_event`, with no action from the parent. After an adventure, the story editor leaves a summary linked to its facts and events. Each turn's request carries the entries that touch the current scene, and the tool `query_world` searches the rest, so the Master keeps what happened without holding the whole history in its context. The parent can read, correct or remove any of it, and a correction reaches the next request.

### Review

The queue lists what waits, oldest first, with a cost and the critic's report. A reader sees the graph, reads each encounter, and may approve, comment or ask for a change. An arc can be read whole. A comment stays on the version and feeds the critic.

### Test

Test runs in the sandbox, and nothing there reaches her game.

- Play: start any adventure, including a draft, at any encounter, as the child sees it, with the same Master and the same tools.
- Levers: set a node's level, rank, world date, day or night, items, friendship, language, gender and creepiness; force the next outcome to clean, partial or alt; force a fall or a rise; open a gate.
- Turn inspector: beside the play window, each turn's full request, reply, tool calls, the Director's note, cost and time.
- Simulated player: a model plays a scenario under a stated persona, such as a shy child, a joker, or one who leaves the story, and a report shows paths taken, turns, checks and spend. It finds what a read can't, at the cost of tokens.
- Coverage: a graph marks encounters and exits a test has reached.
- Task lab: pick any template, node or level and see it as a task, with its story, its judge's score and its cost.
- Screen lab: open any child's screen in any language: the sheet, the map, a rank scene, a fall, a chest.
- Prompt lab: read each prompt's version, try a change in the sandbox and compare two runs.

Each feature in the game gets a line in a checklist page, which says where to test it, and an item with no test place fails the page's own test.

### Logs

A playthrough log shows one adventure in order: scenes, her words, tasks with answers and results, exits, adaptations and cost, with the graph marked by the path taken. The general log shows all events, filtered by kind, and the model audit.

### Data

The event log holds every write. Tables are projections: `story_nodes`, `story_edges`, `story_versions`, `library_entries`, `library_relations`, `test_runs`. Routes sit under `/api/parent/studio`, `/api/parent/world`, `/api/parent/review` and `/api/parent/test`, all behind the parent session. Agents run as background jobs with progress streamed to the page, because a loop takes minutes.

### Budget

Generation by the parent counts against the month, and each action shows its estimate before it runs. The sandbox's $20 is too small for simulated players, so testing gets a stated monthly limit, proposed at $50, on the same key the owner sets.

### Order of building

The sandbox first, then the graph page with reads, then the levers, inspector and play, then generators and prompts, then world, review and simulated players. The Master has to exist before play can be tested, so ADR-3270's turn loop comes with the third step.

## Conclusions

1. The Parent Room holds a studio with screens for design, world, review, test and logs.
2. The studio shows three nested graphs, opened by entering a node, with a breadcrumb and a side panel.
3. A generator at each level writes only that level unless the parent asks for more, and shows its cost first.
4. A prompt on a node makes an agent rework its level or everything inside it, and the parent keeps or discards the result beside a comparison.
5. A plain edit of any field sits beside the prompt and passes code's check.
6. Every save makes a version that names who made it, the prompt, the template version, the cost and the critic's report.
7. Items have the statuses `empty`, `draft`, `approved`, `review`, `playing` and `played`.
8. A scenario plays only once the parent has approved that version, and the Master's play from it needs no approval.
9. With no approved scenario, the game plays tasks with no scenario and notifies the parent.
10. Libraries of characters, places, factions, items and facts sit over the ontology, and every agent reads them.
11. A search shows where a library entry is used.
12. A campaign-wide profile of the child reaches every story agent on the player tier and holds no real name or school.
13. The sandbox of ADR-0340 is built first, and nothing in test reaches her game.
14. The parent can play any adventure from any encounter in the sandbox.
15. The parent can set any game state in the sandbox and force an outcome.
16. An inspector shows each turn's request, reply, tools, cost and time.
17. A simulated player plays a scenario under a persona and reports its paths.
18. A page tests any task, any child's screen and any prompt.
19. A checklist names where each game feature is tested, and a test fails when a feature has no place.
20. A playthrough log and a general log sit beside each other.
21. Each action that spends shows an estimate first, and testing has its own stated limit.
22. The Master records facts and events by tool calls in play, each played adventure leaves a summary, and the parent can correct them.
23. The Master gets the entries that touch the scene and can search the rest.

## Sources

Read:

- [articy:draft on nesting](https://www.articy.com/en/improve-project-structure-with-nesting/) - nested flows. Read 2026-11-01.
- [Kanka overview](https://docs.kanka.io/en/latest/overview.html) - entities and relations. Read 2026-11-01.
- [Mirowski and colleagues 2022, Dramatron](https://ar5iv.labs.arxiv.org/html/2209.14958) - levels, editing and what professionals said, first 100,000 characters. Read 2026-11-01.
- [Coenen and colleagues 2021, Wordcraft](https://arxiv.org/abs/2107.07430) - abstract. Read 2026-11-01.
- Repository files under Method. Read 2026-11-01.

Snippet:

- [Shneiderman 1996](https://webspace.science.uu.nl/~telea001/uploads/VACourse/Shneiderman96.pdf) - tasks. Read 2026-11-01.
- [World Anvil against LegendKeeper](https://www.legendkeeper.com/world-anvil-alternative) - campaign tools. Read 2026-11-01.
- [Story solver for Yarn Spinner](https://intfiction.org/t/story-solver-sat-solvers-to-check-reachability-etc/74911) and [branching dialogue tools](https://devtalk.com/t/good-and-bad-tools-for-creating-branching-dialogues/192943) - reachability and testing. Read 2026-11-01.
- [Langfuse annotation queues](https://langfuse.com/changelog/2024-10-10-annotation-queues.md) - review queues. Read 2026-11-01.
- [Sugiyama package](https://feed.nuget.org/packages/Sugiyama) - small layered layout. Read 2026-11-01.

### Could not obtain

Studies of nested-graph usability, of a parent as designer, of simulated players for scenario testing, and of consistency after a prompted edit were searched and not found. Tried 2026-11-01.
