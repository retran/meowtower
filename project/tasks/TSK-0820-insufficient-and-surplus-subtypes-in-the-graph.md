---
id: TSK-0820
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0250
closes: [REQ-5436, REQ-5442, REQ-5444]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The skill graph names the surplus and unanswerable subtypes and gates them by the node's own state

After this task, the skill graph data file holds `T1.surplus` to `T3.surplus` and `T1.insufficient` to `T4.insufficient`, each marked `form: new` with weight 0.1, and a `requires: { atLeast: <state> }` field that the graph reader exposes, so no later task hard-codes a subtype name or a state gate.

## Acceptance criteria

1. Given the graph file, when the graph test lists the subtypes of T1 to T4, then `T1.surplus`, `T2.surplus` and `T3.surplus` exist, no `T4.surplus` exists, and `T1.insufficient` to `T4.insufficient` exist (REQ-5436, REQ-5442). Closed by: the graph test's report.
2. Given the subtype `S3.missing`, when the graph test reads it, then its meaning, the missing number from a mean, is unchanged, no new subtype ends in `.missing`, and every new T subtype is named `*.surplus` or `*.insufficient` (REQ-5444). Closed by: the graph test's report.
3. Given the new T subtypes and the stretch subtypes `G6.blocks` and `S3.missing`, when `src/engine/graph.ts` is queried for their `requires` field, then the new T subtypes return `atLeast: understands` and the two stretch subtypes return `atLeast: fluent`. Closed by: a unit test on the graph reader.
4. Given a node whose ordinary subtypes' weights sum to 1, when the validator runs on a graph whose node also holds `form: new` subtypes of weight 0.1, then the validator accepts it, and it rejects a node where an ordinary subtype's weight is changed so the ordinary weights no longer sum to 1. Closed by: the validator's fixture tests.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the five new subtype entries to the graph file and the two fields to the graph schema, with the validator rule that ordinary subtypes' weights sum to 1 and each `form: new` subtype carries weight 0.1, as ADR-0250 amends ADR-0050. Expose `requires` through `src/engine/graph.ts` so the Director reads it as it reads every other graph query.

The subtype names are fixed by REQ-5442 and ADR-0250. The estimator's treatment of `form: new` subtypes is not part of this task.

## Depends on

The epic realising ADR-0050 supplies the graph file, its schema, its validator and `src/engine/graph.ts`. This task can start on a copy of the file's current shape and merges when that epic's graph lands; it leaves the node table and the ordinary subtypes to that epic.

## Evidence

Not yet.

## Left alone

The estimator's admission rule, which TSK-0829 builds, and the Director's reading of `requires`, which TSK-0826 builds.
