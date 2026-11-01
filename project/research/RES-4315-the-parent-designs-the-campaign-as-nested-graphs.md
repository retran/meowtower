---
id: RES-4315
artifact: research
status: approved
revised: 2026-11-01
elaborates: RES-4314
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent can design the whole campaign as graphs inside graphs, with a prompt on any node and a world library behind them

## Summary

The owner asked on 2026-11-01 for a studio in the Parent Room: three nested graphs, campaign of arcs, arc of adventures, adventure of encounters; a generator at each level; a prompt on any node that makes an agent rework what it touches; libraries of characters, places and facts; a campaign-wide profile of the child and her interests; statuses and logs. A scenario must be approved by the parent before it plays, while the Master's play from an approved scenario needs no approval. Narrative tools confirm the shape: articy:draft nests flows by submerging into a node, and campaign tools hold linked entities. Co-writing research favours a hierarchy a person can intervene in at each level. No source tests these tools with a parent, and no study found measures how well a prompted edit keeps a whole story consistent, so the loop's code check and critic stand in for that.

## The question

What must the studio do, and how does it fit the records in force? Mandatory approval reverses the rule that nothing waits for the parent. The child's profile adds personal material to story requests. The owner's assumption that a designer wants everything editable is taken as a constraint; the risk is that the queue of unapproved work can leave her with nothing to play.

## Method

Read on 2026-11-01: ADR-3240, ADR-3250, ADR-3270, SPC-0180, SPC-0460, `src/server/admin.ts` by outline. External sources are search summaries unless marked. Nothing was run.

## Findings

### Nesting by entering a node is an established pattern

[Snippet] articy:draft opens a new layer of flow by submerging into a node, and a sample hierarchy runs from a chapter-like level to single lines. [Inference] Campaign, arc and adventure fit the same move: a node's click opens the graph inside it.

### A world library is a set of linked entities

[Snippet] Kanka is praised for cross-links among characters, locations and events, and World Anvil's breadth brings a learning curve. [Inference] The ontology of ADR-3240 already holds these records, so the library is an editor over it, with links between entries.

### People should intervene at each level

[Read, RES-4312] Dramatron builds in layers, and 15 professionals co-wrote with it. [Snippet] Its documentation warns that top-down structure doesn't suit every writing process. [Snippet] Wordcraft lets a writer ask for rewrites inside an editor. No study found measures whether a local request stays consistent across a story. [Inference] An edit rewrites the node's whole level, then passes the same code check and critic as a new scenario.

### A small layered drawing is enough

[Snippet] Sugiyama's method layers a graph, reduces crossings and assigns coordinates, and a small implementation serves graphs under 50 nodes. [Inference] Each level holds at most about 20 nodes and has no cycles, so a small own layout in SVG suits, with no new dependency.

### Approval needs a queue that can't starve play

[Inference] If play waits for approval and the parent is away, she has nothing new. The game falls back to tasks with no scenario, and the parent gets a notice, so a day is never lost.

### The child's profile is personal material

[Read] Player-tier roles carry story material, and the direct Anthropic route on that tier needs zero data retention attested. [Inference] A profile of interests belongs in the player tier, which ADR-3240 already plans, and it must hold no real name or school. The egress guard cleans names, and the page says what leaves the Mac.

## Conclusions

1. The Parent Room holds a studio of three nested graphs: campaign, arc, adventure.
2. A generator at each level writes that level's graph.
3. A prompt on a node makes an agent rework its whole level, under the same code check and critic.
4. Every edit makes a new version, and the older stays readable.
5. A scenario plays only once the parent has approved that version, and the Master's play from it needs no approval.
6. An edit or a change above a node marks approved work below it for review.
7. With no approved scenario, the game plays tasks with no scenario and notifies the parent.
8. Each item shows a status: draft, approved, playing or played.
9. A played scenario has a log of its play, beside the general log.
10. Libraries of characters, places and facts are editors over the ontology, and every agent reads them.
11. A campaign-wide profile of the child and her interests reaches every story agent, holds no real name or school, and goes on the player tier.
12. Graphs draw in the page with no new dependency.

## Sources

Read: the repository files under Method. Read 2026-11-01.

Snippet:

- [articy:draft on nesting](https://www.articy.com/en/improve-project-structure-with-nesting/) - nested flows. Read 2026-11-01.
- [Kanka overview](https://docs.kanka.io/en/latest/overview.html) and [LegendKeeper on World Anvil](https://www.legendkeeper.com/world-anvil-alternative) - campaign tools. Read 2026-11-01.
- [Wordcraft](https://arxiv.org/abs/2107.07430) - a co-writing editor. Read 2026-11-01.
- [Dramatron's project page](https://www.sourcepulse.org/projects/817837) - limits of top-down writing. Read 2026-11-01.
- [Sugiyama package](https://feed.nuget.org/packages/Sugiyama) - small layered layout. Read 2026-11-01.

### Could not obtain

Studies of nested-graph usability, of a parent as designer, and of consistency after a prompted edit were searched and not found. Tried 2026-11-01.
