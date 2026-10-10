---
id: TSK-1040
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6664, REQ-6682, REQ-6684]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The scope guard fails on every deferred part of addendum 2, and a probe template names its family

After this task, ADR-0190's scope guard passes on the MVP tree and fails on each of five traces of addendum 2's deferred parts, the template schema refuses a probe template with no family, and no Dutch probe text can enter before the owner amends the Russian-only rule.

## Acceptance criteria

1. Given the MVP tree, when the scope guard runs, then it passes; given a fixture with a schema for `retention_check_planned`, one with a schema for `probe_family_created`, a template with `probeFamily`, the string `retention_check` in `src/engine/` and the string `nl_probe` in `src/engine/`, when it runs on each, then it fails on each with `scope_guard_hit` (REQ-6682). Closed by: the guard's test with the five fixtures.
2. Given a template with `probe: true` and no `probeFamily`, when the template schema validates it, then it refuses it (REQ-6664). Closed by: a schema test.
3. Given a file `content/i18n/nl.json` or a `*.nl.*` file, when the guard runs, then it fails, and the guard's Dutch trace is in `verify/scope-guard.json` (REQ-6684). Closed by: the guard's test.
4. Given the owner's wish to build the probe, when the Dutch trace leaves `verify/scope-guard.json`, then it happens only in the change that follows the owner's amendment to `CLAUDE.md` (REQ-6684). Closed by: judgement, the owner reviews that change, because only the owner changes `CLAUDE.md` and a test can't tell an amendment from a copy of its words.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the five traces to `verify/scope-guard.json`, the refinement to the template schema, and the fixtures. The guard's list and the deferred list of ADR-0190 gain the traces ADR-0380 names. Each item decision adds its own traces in its record, such as ADR-0390's `/api/parent/profile` routes, ADR-0420's home-and-school route and ADR-0450's store of hypothesis labels, because only the item's decision names them.

## Depends on

Nothing in this epic.

The epic realising ADR-0190 supplies the guard and `verify/scope-guard.json`; where the file doesn't exist when this task starts, add it in the shape the specification SPC-0190 states.

## Evidence

Not yet.

## Left alone

The probe's own code, which waits for the owner's amendment and for the epic realising ADR-0430.
