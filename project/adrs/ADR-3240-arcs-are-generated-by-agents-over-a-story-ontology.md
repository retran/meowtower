---
id: ADR-3240
artifact: adr
status: approved
revised: 2026-10-31
addresses: [REQ-8072, REQ-8074, REQ-8076, REQ-8078, REQ-8082, REQ-8084, REQ-8086, REQ-8088, REQ-8090, REQ-8092, REQ-8094, REQ-8096, REQ-8098, REQ-8102, REQ-8104, REQ-8106, REQ-8108, REQ-8110, REQ-8112, REQ-8114]
supersedes: []
concerns: [privacy, cost]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3240. The story is a series of generated arcs over a fixed spine, written by agents through a typed story ontology with craft rules as checks

## Decision

The spine stays fixed in the canon: the overall plot, the checkpoints and the endings. Arcs of eight kinds are generated inside it, and each episode is one adventure, shaped as a series episode.

Story memory has five levels: spine, season, arc, episode and situation. Each summary is an event, so memory rebuilds with no model call. Beside it, a story ontology holds typed records in SQLite projected from the log. Canon records load read-only.

The pipeline is: showrunner picks the arc; arc writer plans it; episode writer outlines it to fit the Director's plan; beat writer writes beats; script doctor critiques them; beat writer revises, at most twice; code checks continuity, canon and secrets; the Master writes scenes as now; story editor writes the summary and the ontology diff. New roles are `SHOWRUNNER_MODEL`, `EPISODE_MODEL`, `CRITIC_MODEL` and `STORY_EDITOR_MODEL`, in the player tier, each with its own route. Craft rules from RES-4312 run as code checks where a field proves them, and otherwise as the critic's rubric. Levels reach requests only as world facts, through a code table, such as "the boiler belt slips". The Director still owns every task, slot and floor. `TASK_TEXT_MODEL` and `FRAME_JUDGE_MODEL` move to the player tier, so the task prompt's `arc`, `adventure` and `situation` slots fill.

When a step fails twice, the last accepted plan runs, then an authored library arc. Authored arcs exist for each floor.

Once accepted, nothing runs yet. After the plan, a generated series plays. The Master's checks stay as they are.

## Why

RES-4312 found that planning in levels raises coherence, that continuity needs state beyond summaries, and that an ontology makes continuity a query. The owner asked for the anime structure, dynamic arcs, memory and an ontology, and said an overbuilt design is fine because the project is experimental.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: one planner a session | Cheap and running in the design | No arc holds across weeks |
| Authored arcs only | Quality the owner controls | Can't follow her actions, and the owner asked for dynamic arcs |
| One big prompt | Few parts | Long text loses its plot, as the research shows |
| Free agents with no ontology | Fast to build | Continuity rests on summaries that drift |

## What it costs

About $0.56 an adventure by estimate, near $17 a month, within ADR-3200's limits. It adds many prompts in three languages, and the story grows too large for a person to read in full. A generated series may repeat itself in ways no check sees. Moving the task author to the player tier sends story memory with each task request.

## What would reverse it

- The parent marks more than a third of a month's episodes as dull: the showrunner and rubric change first, and authored arcs carry the story meanwhile.
- Spend passes $2 an adventure for a week: the models change.

## Consequences

- ADR-0110's planner becomes these roles; its rule that the Master writes only inside checked scene orders stays, and its Director events gain the arc plan's id and typed floor requests, and the plan's text stays in the ontology.
- ADR-0330's floors stay with `planDay`; an arc asks and the Director decides.
- `.env.example` gains four roles.
- SPC-0460 states this part.

## How I will know it was realised

1. A replay rebuilds memory and the ontology with zero model calls.
2. A test feeds a beat where a character tells a secret they don't know and sees it refused.
3. A test fails a pipeline step twice and sees the library arc play, with no error shown.
4. A scan of every story request, apart from `readerAge` and each task request's task block, finds no number, and none finds a node id or estimate.
5. A verify run over a 30-episode series reports each craft rule and a spend under $5 an adventure.
6. The parent reads 10 episodes and judges them worth playing.

## What this does not settle

- Pictures and voices.
- How long a series runs before it needs new spine.
- Premortem: the arcs read alike after a month. The variety rule and parent marks act on it, and neither is proven.

Amended by ADR-3270, approved on 2026-11-01: the pipeline writes a branching scenario for each adventure, and the Master leads her through it turn by turn.

## Plan

1. Canon's spine and library arcs (REQ-8186, REQ-8108).
2. Memory levels and rebuild (REQ-8084, REQ-8086, REQ-8088).
3. The ontology, read-only canon, world facts and the secret (REQ-8092, REQ-8094, REQ-8096, REQ-8098).
4. Arcs and episodes on the pipeline, inside the Director's boundary (REQ-8072, REQ-8074, REQ-8076, REQ-8078, REQ-8168, REQ-8082, REQ-8198).
5. The critic, continuity checks and the revise limit (REQ-8102, REQ-8104, REQ-8106).
6. Fallbacks, task slots and spend (REQ-8090, REQ-8110, REQ-8112).
7. The parent's marks (REQ-8114).
