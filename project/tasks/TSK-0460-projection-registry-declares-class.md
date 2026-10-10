---
id: TSK-0460
artifact: task
status: done
revised: 2026-09-29
epic: EPC-0020
closes: []
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every projection declares its class, and the import check reads it

After this task, every entry in the projection registry declares its class, `game` or `knowledge`, and the lint check of REQ-2224 takes its `game` projections from the registry instead of a list of file names beside it. As SPC-0020 states the rule, the check follows the runtime imports of each `game` projection, directly or through any module between, and fails one that reaches `src/engine/model/`, `src/engine/states/`, `src/engine/director/`, `src/shared/answer.ts` or a module that reads the model, threshold or graph version, naming the chain. The same check fails any projection's code that names `llm_log`. ADR-0370 entry 2 amended ADR-0020 this way after TSK-0250 and TSK-0270 were done, because a list kept beside the registry drifts from it when a projection is added. It closes no requirement of its own: REQ-2224 stays closed by TSK-0270, and this task realises the amendment's form of its check.

## Acceptance criteria

1. Given the registry, when a test reads every entry, then each has a class. `adventures`, `sessions`, `items_view`, `attempts_view` and `parent_settings` are `game`, and `node_snapshots` is `knowledge`, as SPC-0020's lists give them. Closed by: a unit test over `PROJECTIONS`.
2. Given each entry, when the check runs, then it finds the entry's module through the entry's `module` field, the file's `import.meta.url`. A module holding entries of both classes fails as `projection_class_mixed`, because the import rule works per module, and a mixed one would either exempt its `game` entry or put its `knowledge` entry under the rule. A module whose entries share one class, or a helper module with no entries, doesn't fall under it. Every registered entry's `module` equals the URL of the file that defines it, because an entry marked with another file's URL would send the import rule down the wrong file and exempt a `game` projection. Closed by: the static check's test with a mixed fixture module, and a test that imports each projection module's own export and compares each entry's `module` with that module's URL.
3. Given a fixture `game` projection that imports a helper which imports `src/engine/model/`, when the check runs over the fixture, then `game_projection_imports` fails, naming the entry and the chain through the helper. The same holds for a fixture that imports `src/engine/projections/versions.ts` and for one that imports `src/server/versions.ts`, the two modules that read the versions. Declared `knowledge`, all three fixtures pass. Closed by: the static check's test with these fixtures.
4. Given a fixture projection of either class whose code names `llm_log` in an identifier or a string, when the check runs over the fixture, then `projection_reads_llm_log` fails, naming the file; a comment that names it doesn't count. The rule follows the runtime imports of the entry's module, as the import rule does, because a query kept in a shared helper such as `statements.ts` would otherwise pass while SPC-0020 says no projection reads `llm_log`; a fixture whose helper names it fails, naming the helper and the chain. Closed by: the same test.
5. Given the check's source, when the test reads it, then it names no file under `src/engine/projections/` apart from the forbidden target `versions.ts`, so no list of projection modules like today's `NOT_GAME` remains. `FORBIDDEN_FOR_GAME` stays, with both `versions.ts` modules added, because it names what a `game` projection mustn't reach, not which projections are `game`. Closed by: the same test.

## What to do

In `src/engine/projections/registry.ts`, add `class: "game" | "knowledge"` and `module: string` to the `Projection` interface, and set both on every entry. In `tools/static-checks.ts`, give `checkGameProjectionImports` a projection list as a parameter that defaults to `PROJECTIONS`, so the test passes fixture entries whose `module` points under the fixture root. Group the entries by module, and follow the imports of each module with a `game` entry. Add both `versions.ts` modules to the forbidden targets, add the `llm_log` rule and `projection_class_mixed`, and drop `NOT_GAME`. SPC-0020 lists each projection's class and states these checks.

## Depends on

TSK-0250, because it built the registry. TSK-0270, because it built the import check.

## Evidence

Collected on 2026-09-29 on the Mac. Every criterion is met.

- Verbs: `meow-verbs run format lint check test build` exited 0 at tree b66cc28d4ed8, records format 3d41ebd9d638, lint 324b876fed6f, check 593473c56e0e, test 770367ba68cb and build 98a85cd26cf3, kept as project/evidence/<record>.txt. Vitest 379 tests and Playwright 27 tests passed.
- Criteria 1 to 5, REQ-2224: `tests/unit/projection-class.test.ts` reads the classes, each entry's `module` against its defining file, the mixed-module, versions and `llm_log` fixtures, and the source of `tools/static-checks.ts`; `tests/unit/static-checks.test.ts` keeps the older import fixtures, now passed as registry entries.

## Left alone

The classes of projections that don't exist yet, which their own epics give when they register them.
