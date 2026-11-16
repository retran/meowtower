---
id: BUG-0040
artifact: bug
status: done
severity: minor
violates: REQ-2530
enters: implement
found: 2026-11-16
revised: 2026-11-16
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The test database runs out of connections, so the Postgres pass of the tests fails at random

`compose.yaml` starts `postgres-test` with Postgres's default limit of 100 connections, and the test files that run in parallel each open pools of up to 8, so a run reaches the limit and some tests fail with `sorry, too many clients already`.

## Reproduction

Seen at revisions `3f5d5f1` and `21ba49e` of `main` and the branches built on them, on 2026-11-15 and 2026-11-16:

1. Run `meow-checks run test`, whose command is `npm test`.
2. The SQLite pass passes; the Postgres pass fails in some tests with `error: sorry, too many clients already`.

It happens in most runs and hits different tests each time: 19 tests of `scene-resume` and `three-day-rule` in one run, 2 of `master-game` in the next, and 7 in a third, each of which passes on SQLite and alone.

## What the system does

The test stage fails on a change that breaks nothing, and the gate passes only on a lucky run.

## What it should do, and why

The test stage must report the change and not the load, because a gate that fails at random gets run until it passes, and then a real failure looks like noise. The test database holds data in memory only and serves nothing else, so a limit of 400 connections costs a few megabytes and holds every parallel file.

## Triage

It enters at implement, because the cause is known and the fix is one setting of the test database. Severity minor: no player sees it, but every pull request pays for it. I chose 400, four times the default, because the three failing runs reached the default of 100 and not much more.

## Closed by

The test stage, which runs the Postgres pass against `postgres-test` started with `max_connections=400`; `SHOW max_connections` in that container answers 400.
