---
id: SPC-0470
artifact: spec
status: live
revised: 2026-11-08
states: [REQ-8506, REQ-8520, REQ-8522, REQ-8524, REQ-8526, REQ-8528]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Game data in Postgres on the Mac, one schema a profile

## Scope

This document covers where the game keeps its data: a Postgres database that runs as a service of the compose stack, one schema for each profile, the move of the existing log, and the backups, restore and export. SPC-0020 states the event log and its projections and still holds wherever it does not name SQLite. The accounts that own the profiles are stated in their own document.

## Boundary

The compose stack runs a service `postgres` on its internal network only, with its data in the named volume `meowtower-pg` (REQ-8520). The database `meowtower` holds the schema `public` for accounts and one schema `p_<profile id>` for each profile. Backups are `pg_dump` files for one schema in `data/snapshots/`. The export writes the same five files as before into `data/exports/`.

## Behaviour

All game data, meaning the event log, the derived tables, the settings and the accounts, lives in that database on the parent's Mac (REQ-8520). A profile's events, devices, settings, lockouts, budget and derived tables sit in its schema, and a request sees only the schema its profile names (REQ-8506).

The migrations for Postgres live in `migrations/postgres/` under the numbers of the SQLite ones. An event's payload stays text that Postgres checks as JSON, and the guard triggers of `events` and `blobs` also refuse a `TRUNCATE` of `events`.

The tool `tools/move-to-postgres.ts` moves the existing player's log into the schema of profile 1 with every event, the same event count and the same derived tables (REQ-8522). It opens the SQLite file read-only and leaves it unchanged until the parent deletes it (REQ-8526).

A restore loads a dump into a new schema and swaps it in only when its derived tables match the log it holds (REQ-8524). The backups and the export read Postgres (REQ-8528).

## Failure paths

If the append-only trigger of `events` is missing at start-up, the server refuses to start. If the move finds a different event count or a derived table that differs from the rebuilt one, it stops, reports the table and leaves the target schema marked incomplete. If a restore finds a mismatch, it drops the new schema and keeps the live one.

## Questions

### What the part is for

It keeps every profile's log, projections and settings in one database that survives restarts and lets a second profile exist without a second file.

### What it depends on

The compose stack, the volume `meowtower-pg`, and the event rules of SPC-0020.

### What depends on it

The accounts and the sandbox of SPC-0340.
