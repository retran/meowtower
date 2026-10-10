---
id: TSK-0500
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0050
closes: [REQ-0804, REQ-0808]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server loads the skill graph from one file, versions it by its content and serves it through one query module

After this task, `content/graph.yaml` is parsed through one zod schema, takes a version that is a hash of its content, is stored in `graph_versions`, and is read only through `src/engine/graph.ts`, so every later task adds nodes to the file and no module needs to know where the file lives.

## Acceptance criteria

1. Given a graph file and a copy with one subtype weight changed, when each is loaded, then `graphVersion()` returns `g-` and 12 hexadecimal digits for each and the two differ; given a copy that differs only in a YAML comment, then it returns the original's version (REQ-0804). Closed by: a unit test.
2. Given a node record that lacks `typicalGroup`, one whose `level` is `2F`, and one that carries `stretchGate` without being a stretch node, when the file is loaded, then each fails the schema and the message names the node and the field; given a complete record, then `node(id)` returns its `domain`, `level`, `ruOnly` and `stretchGate`, and `subtypes(id)` and `prereqs(id)` return its subtypes with their levels and weights and its prerequisites with their optional subtype tags (REQ-0808). Closed by: unit tests on the schema and the query module.
3. Given a start on a file whose version the server hasn't stored, when the server starts, then `graph_versions` holds that version's canonical content, reading it back gives a graph equal to the parsed file, the version the projections are computed with (`VERSIONS.graph`) equals `graphVersion()`, and a second start on the same file adds no row. Closed by: an integration test over two starts.
4. Given one valid start, when the file is then broken, then the server starts, serves the last valid version and raises `graph_invalid` once with the validator's message into the parent's notices; given a database with no stored version and a broken file, then the server exits with a non-zero status and the message `graph_unloadable`. Closed by: an integration test for each case.
5. Given a file with 101 aliases, when it is loaded, then the parser stops and the file is invalid; given 1,000 stored versions, when the server starts on a new one, then `graph_versions_many` is raised once and no version is deleted. Closed by: a unit test and an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/graph.ts` with the loader and the read-only queries SPC-0050 lists: `graphVersion`, `nodes`, `node`, `subtypes`, `prereqs`, `stretchGate`, `topics`, `sloGoals` and `changes`. `descentTargets` and `typicalGroup` come with TSK-0508 and TSK-0501. Parse with the `yaml` package at its default cap of 100 aliases and validate with one zod schema that is strict, so a field the schema doesn't name fails the load.

The version is `g-` followed by the first 12 hex digits of SHA-256 over the parsed file serialised with sorted keys, so a comment changes nothing. Store the canonical content as that serialisation in a new `graph_versions` table through the migration runner, keyed by version. Replace the stand-in `graph` value in `content/versions.json` and `src/engine/projections/versions.ts` with the loaded version, so the version-change recompute that ADR-0020's epic built starts on a graph edit.

Create `content/graph.yaml` holding the four keys `nodes`, `topics`, `sloGoals` and `changes`, each empty, so the server has a file to load until TSK-0503 fills it. Put a small complete graph of 3 nodes in `tests/fixtures/graph-small.yaml` for the tests. Raise `graph_invalid`, `graph_unloadable` and `graph_versions_many` through `raise()` in `src/server/failures.ts` and, for the two the parent sees, into the notices the Parent Room reads; the screen that draws them is ADR-0180's.

The `tracks` part, `citoBlock`, `form` and `requires` are stated by ADR-0300, ADR-0290 and ADR-0250, and their epics extend this schema; leave them out here.

## Depends on

Nothing. The version-change recompute and the migration runner already exist from the epic realising ADR-0020.

## Evidence

Not yet.

## Left alone

The validator's rules beyond the schema, which TSK-0501 and the tasks after it add, and the Parent Room's drawing of the notices, which the epic realising ADR-0180 builds.
