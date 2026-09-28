---
id: ADR-0050
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-0800, REQ-0802, REQ-0804, REQ-0806, REQ-0808, REQ-0810, REQ-0812, REQ-0814, REQ-0816, REQ-0818, REQ-0850, REQ-0852, REQ-0854, REQ-1244, REQ-3812]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0050. The skill graph is one versioned data file, the single source of nodes, levels, prerequisites, subtypes and weights

## Decision

The skill graph lives in one YAML file, `content/graph.yaml`, and nothing else in the repository holds a node's level, a subtype's level or a subtype's weight (REQ-0852). The server and the build load it through one zod schema and one validator. Its version is a hash of its content, so every change to the graph is a new version without anyone bumping a number (REQ-0804). The reader is whoever builds the engine or edits the graph: this record fixes the file's contents, the checks it must pass, and how a change reaches play.

The file holds three parts:

- `nodes`: the 79 maths nodes of RES-0800 in nine domains, 69 at level 1F or 1S and 10 at stretch, with the codes, levels and prerequisites of the RES-0800 node tables (REQ-0800).
- `topics`: the science topics E1 to E5, each with an id and a name and no prerequisite field, so the schema can't express an edge to or from a maths node (REQ-0802).
- `sloGoals`: the goals of the SLO «Concretisering referentieniveaus rekenen 1F/1S», each with an id, a level and a short text. The building agent drafts the list from the SLO document RES-0800 cites.

Each node records the fields REQ-0808 names:

| Field | Holds | Check |
| --- | --- | --- |
| `id` | the code, such as `M4` | unique, and matches the domain's letter |
| `domain` | one of N, A, F, D, P, M, G, S, T | nine domains in all |
| `level` | `1F`, `1S`, `1F/1S` or `stretch` | agrees with the subtypes, as described after this table |
| `typicalGroup` | the school group that usually teaches it | an integer from 1 to 8 |
| `prereqs` | node ids, each optionally tagged with the one subtype it serves, such as `{ node: N3, subtype: whole }` | every id exists, and the prerequisite graph has no cycle |
| `subtypes` | ids, each with its own `level`, a `weight` and `slo` goal ids | weights are positive and sum to 1 per node |
| `ruOnly` | true for a topic only the Russian programme holds | a boolean, false by default |
| `stretchGate` | on a stretch node only, the gate nodes RES-0800 lists, such as N6 and N7 for N8 | present and non-empty exactly on stretch nodes |

A node's `level` must agree with its subtypes. A `1F/1S` node has at least one subtype at each of 1F and 1S (REQ-0850). A `stretch` node has only stretch subtypes. A `1F` or `1S` node has subtypes at its own level, and may also hold stretch subtypes, as G6 holds `blocks` and S3 holds `missing`.

`graphVersion` is `g-` followed by the first 12 hex digits of SHA-256 over the parsed file serialised with sorted keys. A change to any node, prerequisite, level, weight or goal changes the version, while a change to a YAML comment doesn't, because a comment changes no data. Every derived snapshot already records `graphVersion` (RES-2200). On start-up the server stores each new version's canonical content in a `graph_versions` table, so any snapshot's graph can be read back without git.

The parent or a developer changes the graph by editing the file, with no code change (REQ-0806). The change takes effect when the server restarts, which reads the file from `content/`, the folder the `tower` container mounts read-only (ADR-0110, ADR-0180). A new version starts a full recompute of the projections, which ADR-0020 runs. The file's `changes` list takes one line per deliberate change, naming the node, the field and the reason. The Parent Room shows those lines beside the version, so a changed level doesn't read as a change in the player.

The graph exposes one read-only query module, `src/engine/graph.ts`. It answers a node's level, a subtype's level and weight, the stretch gate and the descent targets. `descentTargets(node, subtype)` returns the prerequisites tagged with that subtype when any exist, and otherwise the node's untagged prerequisites (REQ-0810). A failed `M1.decimal` therefore descends to D3 only, and a failed `M5.grid` to A3 only. The Director (ADR-0070) and the knowledge model (ADR-0060) must go through this module for prerequisites, and ESLint `no-restricted-imports` bars every other module from reading `graph.yaml` directly.

The template module type of ADR-0040 has no `level` and no `weight` field, and a template reads both from this module. The build fails when a template or a row of `content/catalogue.yaml` names a node or subtype the graph lacks (REQ-1244). Every other content file's zod schema is strict and has no level or weight field for a subtype, so a second copy fails validation (REQ-0852).

The validator runs in `npm run verify` and at every server start, and checks these rules:

1. The schema, the field checks in the table above, and an acyclic prerequisite graph by topological sort.
2. The counts: 79 maths nodes, nine domains with the per-domain counts of RES-0800, 69 nodes at 1F, 1S or 1F/1S and 10 at stretch (REQ-0800).
3. The research fixture `tests/fixtures/res-0800.yaml` holds each node's domain, level and prerequisites as RES-0800 gives them after its 17 corrections. N3, N6, N7, A11, A13, A14, F3, F4, F5, F6, F7, D4, D6, P5, P6, M4 and S5 must be 1F/1S (REQ-0814). A difference from the fixture fails, unless a `changes` line names that node and field. The graph thus starts equal to the research and later departs from it only on the record.
4. Measurement subtypes: a subtype of M4, M5 or M7 marked `method: formula` must be 1S, and 1F subtypes of those nodes must be marked `squares`, `sides` or `cubes` (REQ-0816). M4 must hold a 1F rectangle perimeter, and 1S subtypes for a figure that isn't a rectangle, a side from the perimeter and "one area, different perimeters" (REQ-0818).
5. Every `sloGoals` entry is named by at least one subtype, and every `slo` reference names an existing goal. A reviewing agent judges the goal list and the mapping against the SLO document when it's first written and whenever `sloGoals` changes (REQ-0812).
6. Every node up to 1S stays, whatever the player's school group (REQ-0854). The validator has no filter by `typicalGroup`, and a test fails any engine module that drops a node by group. RES-0900 still uses the group for priors.
7. A curriculum overlay file, such as the deferred `graph.nl.yaml` (RES-2550), may only add nodes, subtypes and prerequisite links. The validator fails an overlay entry that reuses a base node id or subtype id, or removes or changes a base field (REQ-3812). The overlay's content hash joins the base hash in `graphVersion`, so turning a layer on is a new version too.

The building agent writes the first version, naming the subtypes of each node from the RES-1200 catalogue and splitting the 17 1F/1S nodes by the SLO table in RES-0800. RES-0800 left three things open, so I chose defaults. Weights are equal across a node's subtypes. `typicalGroup` comes from the Utrecht learning line and the SLO concretisation. `ruOnly` stays false unless the SLO check finds no Dutch goal for a subtype. The parent reviews the first version as a diff before stage 0.1 ends.

Once this is accepted, the graph loads, validates, versions itself and answers level, weight, gate and descent queries, and ADR-0040's templates read their level and weight from it. `./tower graph check` prints the validator's report. Nothing chooses nodes yet, since the Director comes with ADR-0070. States come with ADR-0060, and the stretch gate, the descent in play and the report's coverage figures wait for them.

## Why

One file wins because RES-0800 records the graph as versioned data the parent or a developer changes without code, and its resolved finding makes the graph the one home of subtype levels and weights. Levels and weights are judgements about the curriculum, like the 17 levels the SLO check corrected. The draft's second copy in the template model could change while the first stayed (RES-0800, RES-1200, RES-0900).

A content hash as the version turns REQ-0804 into a property of the loader, so no person has to remember a bump. A hand-kept version number fails the moment somebody edits the file and forgets it, and the snapshots then claim two different graphs are one.

The research fixture makes REQ-0800 and REQ-0814 checkable every time. The `changes` escape keeps REQ-0806 true: a later level change is a data edit with a stated reason, and the build doesn't need a test edited.

Keeping the last valid version when the file is broken follows from the player's daily game. A typo in a hand-edited file must not stop the game on the day she sits down to play.

The strongest objection is that a hand-edited YAML file is a poor editor for a parent: indentation errors, a weight that no longer sums to 1, and no preview of what a change does to the report. An editor screen in the Parent Room would catch these as she types. I keep the file because the owner is the parent and edits the repository's files already, git gives the graph a free history and diff, and the validator plus the last-valid fallback turns every mistake into a message rather than an outage. If a parent who doesn't edit files ever needs to change the graph, the second reversal condition applies.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: nodes implied by the template files, with levels and weights beside the code | no second file and no loader; the type checker sees everything | REQ-0806 needs a change without code, and RES-0800 moved levels and weights out of the templates so one change can't miss its copy |
| The graph in TypeScript constants in `src/engine/graph.ts` | type-checked at compile time, and no parser | a level change is then a code change, which REQ-0806 forbids, and the parent would need a build to change a weight |
| The graph in SQLite tables, edited from a Parent Room screen | the parent edits in a form, with validation as she types and no restart | the history and diff move out of git and into a table only this server holds; the editor costs a screen before any node has a task |
| The graph in JSON in place of YAML | stricter, with no parser dependency and no indentation traps | JSON has no comments, and the graph needs a reason beside a level; RES-2500 already names `graph.yaml` |

## What it costs

The building agent writes the first file: 79 nodes, some 200 subtypes with levels, weights and SLO references, the goal list, and the fixture. The parent reviews that diff once, which is about an hour of reading.

A later edit costs the parent the edit, one `changes` line and a restart. A restart ends any open request, and ADR-0030's client queue resends the answer.

A graph change recomputes every projection, and the report's figures can move at once, and the Parent Room notice exists so the parent can tell a changed graph from a changed child.

Versions accumulate in `graph_versions`, each some 30 KB. At 1,000 versions the server reports once in the Parent Room, since that many edits suggest a script is rewriting the file. It keeps them all, because a snapshot may still name any of them.

I chose a load budget of 1 second at start-up for parsing and validation, as the file is small; it stands with the 1,000-version notice in the Baselines table of ADR-0190. The `yaml` package's default cap of 100 aliases guards the parse against an alias bomb.

The security boundary is thin. The file is protected against a mistaken edit, the only likely damage, by the validator and the last-valid fallback. Anyone with access to the family Mac could change it, and I set no defence there, because that person could change anything else too (ADR-0010).

## What would reverse it

- If the parent edits the graph and a validation failure reaches the Parent Room more than twice in one month, a file is the wrong editor, and a Parent Room editor over the same schema should replace hand edits.
- If someone who doesn't edit repository files has to change the graph, the same editor is needed.
- If the Dutch overlay `graph.nl.yaml` (RES-2550) must change a base node's level and not only add nodes and links, one file stops being the single source, and the overlay rules need a decision of their own.

The premortem, written as though it already happened: three months into play the parent moved F4 to 1S only in `graph.yaml`, restarted, and the next morning the report's 1F coverage fell from 80 % to 72 %. She read it as the player forgetting fractions and planned extra lessons. The recompute had been correct, and the `changes` line she wrote said why, but the report had shown the graph version in small print only. The Parent Room notice in this decision exists because of this failure: the first report after a new version opens with the `changes` lines.

## Consequences

- `content/graph.yaml`, `tests/fixtures/res-0800.yaml` and `src/engine/graph.ts` exist, and `./tower graph check` runs the validator.
- ADR-0020's recompute runs on a new `graphVersion`, and the `graph_versions` table joins the schema.
- ADR-0040's template type drops `level` and `weight`, and its catalogue check gains the subtype-exists rule.
- A node with more than 5 subtypes at equal weights has none at 0.2 or more, so the full-block coverage rule of RES-0900 requires none of them. The validator warns once per such node, and the parent or the agent can raise the weights of the subtypes a block must cover.
- A subtype the graph holds but no template generates is marked `not_generatable` at load. The Director leaves it out of block coverage, and the verify report and the Parent Room each list it once until a template exists.

The failure states this decision adds, each with one audience and its next step:

| State | Audience | Next step |
| --- | --- | --- |
| `graph_invalid`: the file fails validation at start-up and a valid version exists | the parent, through a one-time Parent Room notice with the validator's message | fix the file and restart; play goes on with the last valid version |
| `graph_unloadable`: the file fails validation and no valid version was ever stored | developer, through the server's start-up error | fix the file; the server doesn't start |
| `graph_changed`: a new version loaded | the parent, through the `changes` lines at the head of the next report | none, unless the change was a mistake |
| `graph_drift`: the graph differs from the research fixture with no `changes` line | developer or parent, through verify | add the line with a reason, or revert the edit |
| `not_generatable`: a graph subtype has no template | developer, through verify; the parent sees the same list once | write the template, or remove the subtype |

## How I will know it was realised

1. `npm run verify` loads `content/graph.yaml` and reports 79 maths nodes in nine domains, 69 at 1F, 1S or 1F/1S and 10 at stretch, no cycle, and zero differences from `tests/fixtures/res-0800.yaml`.
2. A test changes one weight in a copy of the file and gets a new `graphVersion`; a test changing only a comment gets the same one.
3. `descentTargets("M1", "decimal")` returns D3 only, and `descentTargets("M5", "grid")` returns A3 only.
4. A mutation test adds `level` to one template, a subtype weight to `catalogue.yaml`, an E1 prerequisite to a maths node, and a template naming a missing subtype, and each fails the build.
5. Each of the 17 split nodes has at least one 1F and one 1S subtype, and every M4, M5 and M7 subtype marked `formula` is 1S.
6. Starting the server with a broken file after one valid start serves play from the last valid version and shows the notice once in the Parent Room.
7. The reviewing agent's report on the SLO mapping names every goal and at least one subtype for each.

## What this does not settle

- The stretch gate's admission by tested results, REQ-0820, the block within 7 days, REQ-0822, and the weekly limit on stable nodes in mental arithmetic, REQ-0832: ADR-0070 applies them with this module's `stretchGate`.
- The report's gap and ceiling lists, REQ-0824 and REQ-0826, the coverage by level, REQ-0828, the word problem matrix, REQ-0834, and modelling errors apart from calculation, REQ-0838: ADR-0180.
- Marking terms in the task window and the tap explanation, REQ-0840 and REQ-0842: ADR-0150.
- The parent's approval of a Dutch word, REQ-0846: ADR-0180, in the Parent Room.
- The independent mental arithmetic tasks, REQ-0830, model-choice problems, REQ-0836, glossary coverage, REQ-0844, and answers by result, REQ-0848: ADR-0040.
- Node states and how subtype weights enter the node estimate: ADR-0060.
- The content of the Dutch overlay `graph.nl.yaml` and the `nl` curriculum layer, which RES-2550 defers until after the MVP; this record settles only the rule every overlay must pass.

Amended by ADR-0250, ADR-0290 and ADR-0300, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.
