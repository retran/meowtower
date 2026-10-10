---
id: SPC-0050
artifact: spec
status: live
revised: 2026-09-28
states: [REQ-0800, REQ-0802, REQ-0804, REQ-0806, REQ-0808, REQ-0810, REQ-0812, REQ-0814, REQ-0816, REQ-0818, REQ-0850, REQ-0852, REQ-0854, REQ-1244, REQ-3812]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The skill graph data file, its validator and its query module

## Scope

This document covers the skill graph: the file `content/graph.yaml` that holds it, the schema and validator that check it, the version the loader computes, how an edit reaches play, the overlay rule, and the read-only query module `src/engine/graph.ts`. It is written at the level of data files and module interfaces: fields, checks, queries and failure states, with no algorithm inside a consumer.

It leaves out what reads the graph. How the Director picks a node, applies the stretch gate and runs the descent in play belongs to ADR-0070, and how the knowledge model turns subtype weights into a node estimate and a state to ADR-0060. The report's coverage and gap lists belong to ADR-0180. Three parts of the file are stated elsewhere. ADR-0290 states the `citoBlock` field and ADR-0300 the `tracks` part with the Sources track. SPC-0040 and ADR-0070 state the subtype fields `form: new` and `requires`, with the new forms' weight. The recompute that a new version starts belongs to SPC-0020.

## Boundary

### Files

| Path | What it holds |
| --- | --- |
| `content/graph.yaml` | The skill graph, in four parts: `nodes`, `topics`, `sloGoals` and `tracks`, plus the `changes` list. |
| `tests/fixtures/res-0800.yaml` | Each maths node's domain, level and prerequisites as RES-0800 gives them after its 17 corrections. |
| `src/engine/graph.ts` | The one read-only query module over the loaded graph. |
| `graph_versions` table | The canonical content of every graph version the server has loaded, keyed by `graphVersion`. |

The server reads `content/graph.yaml` from `content/`, which the `tower` container mounts read-only.

### Commands

- `./tower graph check` prints the validator's report on the file.
- `npm run verify` runs the same validator, and the server runs it at every start.

### Query module

`src/engine/graph.ts` answers these queries and changes nothing:

| Query | Returns |
| --- | --- |
| `graphVersion()` | the served graph's version |
| `nodes()` | every maths node id, in file order |
| `node(id)` | the node's `domain`, `level`, `ruOnly` and `stretchGate` |
| `subtypes(node)` | each subtype's id, `level`, `weight`, `slo`, `method`, `form` and `requires` |
| `prereqs(node)` | every prerequisite of the node, each with its optional subtype tag |
| `stretchGate(node)` | the gate node ids of a stretch node |
| `descentTargets(node, subtype)` | the prerequisite node ids a failed subtype descends to |
| `typicalGroup(node)` | the node's `typicalGroup` |
| `topics()` | the science topics E1 to E5, each with its id and name |
| `sloGoals()` | every SLO goal, each with its id, level and text |
| `changes()` | every `changes` line of the served version, each marked new when the previous stored version lacked it |
| `trackNodes()` | the track nodes of `tracks`, apart from the maths nodes, as ADR-0300 states |

`form` and `requires` hold what SPC-0040 and ADR-0070 state for them. Only modules under `src/parent/` import `typicalGroup`; ESLint `no-restricted-imports` with `importNames` fails any other module that imports it.

### Failure states

| State | Audience | Next step |
| --- | --- | --- |
| `graph_invalid` | the parent, through a one-time Parent Room notice with the validator's message | fix the file and restart; play goes on with the last valid version |
| `graph_unloadable` | the developer, through the server's start-up error | fix the file; the server doesn't start |
| `graph_changed` | the parent, through the `changes` lines at the head of the next report | none, unless the change was a mistake |
| `graph_drift` | the developer or the parent, through verify and `./tower graph check`; at start-up it makes the file invalid and shows as `graph_invalid` with the drift message | add a `changes` line with a reason, or revert the edit |
| `graph_versions_many` | the parent, through a one-time Parent Room notice when `graph_versions` holds 1,000 versions | none; every version stays stored |
| `not_generatable` | the developer, through verify; the parent sees the same list once | write the template, or remove the subtype |

### Permitted dependencies

Only the loader in `src/engine/graph.ts` reads `content/graph.yaml` and the overlay files; ESLint `no-restricted-syntax` fails any other module holding a string literal that matches `graph(\.[a-z]+)?\.yaml`. The Director, the knowledge model and the template code read levels, weights, gates and prerequisites through the query module and through nothing else. The query module imports only the zod schema, the `yaml` package and `src/shared/`. It doesn't import the Director, the knowledge model or any route.

## Data

### The file's parts

- `nodes` holds the 79 maths nodes of RES-0800 in nine domains, with the codes, levels and prerequisites of RES-0800's node tables (REQ-0800).
- `topics` holds the science topics E1 to E5, each with an id and a name and no prerequisite field, so the schema can't express an edge between a topic and a maths node (REQ-0802).
- `sloGoals` holds the goals of the SLO «Concretisering referentieniveaus rekenen 1F/1S», each with an id, a level and a short text (REQ-0812).
- `tracks` holds the Sources track, which ADR-0300 states.
- `changes` holds one line for each deliberate change: the node, the field and the reason. The list is cumulative: a line stays for every later version, and its node and field stay excused from the fixture comparison.

The nine domains hold these counts of maths nodes (REQ-0800):

| Domain | Nodes | Of them stretch |
| --- | --- | --- |
| N, numbers | 8 | 1 |
| A, arithmetic | 17 | 3 |
| F, fractions | 8 | 0 |
| D, decimals | 7 | 1 |
| P, percentages and proportions | 7 | 1 |
| M, measures | 14 | 2 |
| G, geometry | 7 | 1 |
| S, data | 7 | 1 |
| T, word problems | 4 | 0 |

That makes 69 nodes at 1F, 1S or 1F/1S and 10 at stretch.

### A node's fields

Each maths node records these fields (REQ-0808):

| Field | Holds | Check |
| --- | --- | --- |
| `id` | the code, such as `M4` | unique, and starts with its domain's letter |
| `domain` | one of N, A, F, D, P, M, G, S, T | nine domains in all |
| `level` | `1F`, `1S`, `1F/1S` or `stretch` | agrees with the subtypes' levels |
| `typicalGroup` | the school group that usually teaches the node | an integer from 1 to 8 |
| `prereqs` | node ids, each optionally tagged with the one subtype it serves, such as `{ node: N3, subtype: whole }` | every id exists, and the prerequisite graph has no cycle |
| `subtypes` | ids, each with its own `level`, a `weight`, `slo` goal ids and, on M4, M5 and M7 only, a `method` | every weight is positive, and the ordinary subtypes' weights sum to 1 per node |
| `subtypes[].method` | `formula`, `squares` or `sides` on M4 and M5; `formula` or `cubes` on M7 | present on every subtype of M4, M5 and M7, absent on every other node |
| `ruOnly` | true for a topic only the Russian programme holds | a boolean, false by default |
| `stretchGate` | on a stretch node, the gate nodes RES-0800 lists, such as N6 and N7 for N8 | present and non-empty on stretch nodes, absent on every other node |

A node's `level` agrees with its subtypes in three ways. A `1F/1S` node has at least one subtype at 1F and at least one at 1S (REQ-0850). A `stretch` node has only stretch subtypes. A `1F` or `1S` node has subtypes at its own level and may also hold stretch subtypes, as G6 holds `blocks` and S3 holds `missing`.

An ordinary subtype is one without `form: new`, at any level, so the stretch subtype `G6.blocks` counts toward G6's sum of 1.

In the first version, weights are equal across a node's ordinary subtypes, `typicalGroup` comes from the Utrecht learning line and the SLO concretisation, and `ruOnly` is false unless the SLO check finds no Dutch goal for a subtype.

## Behaviour

### One source of levels and weights

`content/graph.yaml` is the only file that holds a node's level, a subtype's level and a subtype's weight (REQ-0852). The template module type has no `level` and no `weight` field, and a template reads both from the query module. Every other content file's zod schema is strict and has no level or weight field for a subtype, so a copy of a level or weight in another file fails validation.

### The version

`graphVersion` is `g-` followed by the first 12 hex digits of SHA-256 over the parsed file serialised with sorted keys. A change to any node, prerequisite, level, weight or goal changes the version, and a change to a YAML comment alone doesn't (REQ-0804). When overlays are on, the hash runs over the base file and each overlay, parsed and serialised with sorted keys, joined in the order of their file names after the base. On start-up the server stores each new version's canonical content in `graph_versions`, so the graph a snapshot names can be read back without git. At 1,000 stored versions the server shows `graph_versions_many` once in the Parent Room, and it keeps every version.

### Changing the graph

The parent or a developer changes a node, a prerequisite, a level or a weight by editing `content/graph.yaml`, with no code change, and adds one line to `changes` (REQ-0806). A `changes` line excuses only the fixture comparison of rule 3. The counts of rule 2 and the 17 split-level nodes of rule 3 hold whatever `changes` says, so an edit that adds or removes a node, moves a node into or out of stretch, or takes one of the 17 off 1F/1S fails validation until REQ-0800 or REQ-0814 changes. REQ-0806 reaches every other edit of the file. The edit takes effect when the server restarts. A new version starts a full recompute of the projections, and the first report after it opens with the `changes` lines the previous stored version in `graph_versions` lacked.

### The validator

The validator runs in `npm run verify`, in `./tower graph check` and at every server start. It parses the file with the `yaml` package, whose cap of 100 aliases stays on, and checks seven rules:

1. The schema, the field checks in the node table, and an acyclic prerequisite graph by topological sort (REQ-0808).
2. The counts: 79 maths nodes, the nine domains with the per-domain counts above, 69 nodes at 1F, 1S or 1F/1S and 10 at stretch (REQ-0800). The `tracks` part and overlay nodes stay out of these counts.
3. The fixture: each base maths node's domain, level and prerequisites equal `tests/fixtures/res-0800.yaml`, unless a `changes` line names that node and field. N3, N6, N7, A11, A13, A14, F3, F4, F5, F6, F7, D4, D6, P5, P6, M4 and S5 are 1F/1S (REQ-0814), and each holds at least one 1F and one 1S subtype (REQ-0850).
4. Measurement: every subtype of M4, M5 and M7 carries a `method` its node allows, a subtype marked `method: formula` is 1S, and a 1F subtype is marked `squares` or `sides` on M4 and M5 and `cubes` on M7 (REQ-0816). The limit of 1F to rectangular figures with simple numbers is held by the review of each template's parameter ranges, not by the validator. M4 holds the 1F subtypes `rect-squares` and `rect-sides` for the perimeter of a rectangle, and the 1S subtypes `not-rect` for the perimeter of a figure that isn't a rectangle, `side-from-perimeter` and `same-area` for "one area, different perimeters" (REQ-0818). This spec chose these five ids, since no record names them.
5. SLO goals: every `sloGoals` entry is named by at least one subtype, and every `slo` reference names an existing goal (REQ-0812). A reviewing agent judges the goal list and the mapping against the SLO document when `sloGoals` is first written and whenever `sloGoals` or any subtype's `slo` field changes, and its report names every goal with at least one subtype.
6. Scope: every node up to the end of group 8, level 1S, stays in the graph, whatever the player's current school group, which `personal/player.md` holds (REQ-0854). The validator has no filter by `typicalGroup`, and no module outside `src/parent/` can read `typicalGroup`, since the lint rule under Query module fails the import.
7. Overlays: a curriculum overlay file `content/graph.<curriculum>.yaml`, such as `content/graph.nl.yaml`, is on when it exists, and the loader reads every such file beside `content/graph.yaml`. The first version ships none. An overlay adds nodes of its own, with their subtypes and prerequisites, and those prerequisites may name base nodes. The validator fails an overlay entry that reuses a base node id, adds a subtype or a prerequisite to a base node, or removes or changes a base field, so the weights, prerequisites and descent targets of base nodes stay as the base file gives them (REQ-3812). Rules 1, 4, 5 and 6 run on the base and the overlays together, and rules 2 and 3 on the base file alone.

The validator also warns once for each node with more than 5 subtypes at equal weights, since none of them reaches the weight of 0.2 a full block must cover.

### Templates and the catalogue

The build fails when a template or a row of `content/catalogue.yaml` names a node or subtype the graph lacks, and the failure names the template or row and the missing id (REQ-1244). A subtype the graph holds and no template generates is marked `not_generatable` at load. Every verify report lists it until a template exists, and the Parent Room lists it once per graph version.

### Descent targets

`descentTargets(node, subtype)` returns the prerequisites tagged with that subtype when any exist, and otherwise the node's untagged prerequisites, so a failed subtype with a prerequisite of its own descends only to that prerequisite (REQ-0810). `descentTargets("M1", "decimal")` returns D3 alone and leaves N3 out, and `descentTargets("M5", "grid")` returns A3 alone.

### Loading

The loader parses and validates the file within 1 second at start-up, the budget ADR-0190's Baselines table holds. A file that passes becomes the served graph. When the file fails and a valid version is stored, the server serves the last valid version and shows `graph_invalid` once in the Parent Room.

## Failure paths

| Condition | What happens |
| --- | --- |
| The file fails validation at start-up and a valid version is stored | The server serves the last valid version and shows `graph_invalid` once, with the validator's message, in the Parent Room. |
| The file fails validation and no valid version was ever stored | The server doesn't start and reports `graph_unloadable` with the validator's message. |
| A prerequisite edit creates a cycle | Rule 1 fails, naming the nodes on the cycle. |
| A node's domain, level or prerequisites differ from the fixture with no `changes` line | Rule 3 fails with `graph_drift`, naming the node and the field; at start-up the file is invalid and the server serves the last valid version. |
| An edit breaks the counts of rule 2 or takes one of the 17 split-level nodes off 1F/1S | The rule fails even with a `changes` line. |
| A `1F/1S` node loses its last 1F or 1S subtype | Rule 3 fails, naming the node. |
| A formula subtype of M4, M5 or M7 is set to 1F, or a subtype of those nodes lacks `method` or carries one its node doesn't allow | Rule 4 fails, naming the subtype. |
| A goal in `sloGoals` has no subtype | Rule 5 fails, naming the goal. |
| A topic E1 to E5 gains a prerequisite, or a maths node lists one as a prerequisite | Schema validation fails, since `topics` has no prerequisite field and `prereqs` accepts only maths node ids. |
| A template, the catalogue or another content file carries a subtype's level or weight | Its strict schema fails the build. |
| A template or catalogue row names a subtype the graph lacks | The build fails, naming the template or row and the id. |
| A graph subtype has no template | The subtype is `not_generatable`, and verify and the Parent Room list it; what the Director does with it is ADR-0070's. |
| An overlay reuses a base id or changes a base field | Rule 7 fails, naming the overlay entry. |
| A module outside `src/engine/graph.ts` names `graph.yaml` or an overlay file | Lint fails the build. |
| A module outside `src/parent/` imports `typicalGroup` | Lint fails the build. |
| The file holds an alias bomb | The `yaml` parser stops at 100 aliases and the file fails as invalid. |
| Loading and validation take longer than 1 second | The verify report prints the measure beside ADR-0190's baseline and records a defect, as ADR-0190 states; the load goes on. |
