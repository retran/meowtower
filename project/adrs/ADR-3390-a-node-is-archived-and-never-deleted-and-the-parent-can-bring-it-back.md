---
id: ADR-3390
artifact: adr
status: approved
revised: 2026-11-15
addresses: [REQ-8634, REQ-8636, REQ-8638, REQ-8640]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3390. A node is archived and never deleted, and the parent can bring it back

## Decision

The parent can archive any node of the studio. An archived node leaves the graph of its level, the list of encounters the sandbox offers to start from and the scenario the Master reads, but it stays in the store with every version, because versions are append-only. The studio lists the archived nodes of a level on request, and the parent can bring one back, which puts it in its level again with its current version as it was.

An archived node is not edited: the page and the server refuse an edit of it and say to bring it back first. A node that sits inside an archived node is hidden with it and is not archived itself, so bringing the parent back brings its contents back as they were. A link from a node that is shown to an archived node is not drawn as an edge, and the link stays in the body, so bringing the node back draws it again. The sandbox refuses to start play at an archived encounter.

Once this is accepted, the parent can clear away what a second generation leaves beside the first, and nothing she hides is lost. What still doesn't work: nothing is ever deleted for good, and an archived node still counts in the store's size.

## Why

RES-4320 found that nothing deletes a node, so a repeated generation adds its encounters beside the older ones with no way to clear them. A true delete would break the append-only versions that let the parent restore an earlier text, and would leave exits that point at nothing. Hiding keeps every version and every link, and it is reversible.

## Alternatives

| Option                          | Better at                                  | Why it lost                                                                               |
| ------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Do nothing                      | No new state                               | A second generation piles up beside the first, with no way to clear it.                   |
| Delete the node and its versions | Frees the space and the list              | It breaks append-only versions, loses a draft that was given up too soon, and strands exits. |
| Archive it (this)               | Reversible, keeps versions and links       | A hidden node still takes space, and a parent can forget what she hid.                    |

## What it costs

One column on the node table and a list of archived nodes on the page. A parent who archives and forgets leaves nodes the store keeps for ever, and no ceiling bounds them.

The strongest objection: archiving hides a node whose exits other nodes still hold, so a scene can lead nowhere in play. The answer is that play filters the choices that lead to an archived encounter out of the scene, and the parent sees the dashed unreached edge vanish with the node.

## What would reverse it

- A store that grows by archived nodes enough to slow the studio, which would call for a purge a parent confirms.

## Consequences

The node table gains `archived_at`. The list of a node's children, the encounters the sandbox offers and the scenario the Master reads leave out archived nodes. The checklist page gains the two new routes.

## How I will know it was realised

1. An archived encounter is absent from its adventure's list, keeps every version, and returns with its text as it was after it is brought back, in an integration test.
2. The sandbox refuses to start play at an archived encounter and the Master's prompt leaves it out, in an integration test.
3. The page archives a node, lists the archived nodes and brings one back, in a browser test.

## What this does not settle

- A purge that deletes for good.
- Whether archiving a node also asks about the nodes that lead to it.

## Plan

1. A node is archived and brought back through the store and its routes, and a list of children leaves out an archived node, keeping its versions (REQ-8634, REQ-8636, REQ-8640). It touches `migrations/0016_archive.sql`, `migrations/postgres/0016_archive.sql`, `src/server/studio/store.ts` and `src/server/studio/routes.ts`.
2. Play and the Master leave out an archived node, and an edit of one is refused (REQ-8634). It touches `src/server/sandbox/play.ts` and `src/server/studio/store.ts`.
3. The page archives the selected node and lists the archived nodes of a level with a way to bring each back (REQ-8634, REQ-8638, REQ-8640). It touches `src/client/screens.ts`, `src/client/api.ts` and `content/i18n/ru.json`, `en.json` and `nl.json`.
