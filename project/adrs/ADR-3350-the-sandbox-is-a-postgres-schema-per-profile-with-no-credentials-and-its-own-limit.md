---
id: ADR-3350
artifact: adr
status: approved
revised: 2026-11-11
addresses: [REQ-8284, REQ-8314]
supersedes: []
concerns: [privacy, cost]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3350. The parent's sandbox is a Postgres schema beside each profile, copied with no credential, and testing has its own monthly limit

## Decision

The parent's sandbox of ADR-0340 is a schema of the game's Postgres database, `s_<profile schema>`, beside the schema of the profile it tests. ADR-0340 was written when the game lived in one SQLite file and the sandbox needed files of its own, a `profile` mark on every event and a read-only connection to keep it out of her game. Since ADR-3310 every profile is a schema, and a schema is already a database of its own that a request reaches only through its search path. Where ADR-0340 names a file, this record names a schema, and ADR-0340 stays as it is for everything else.

- A sandbox is made by `createSandbox`, which opens the schema `s_<name>` through `openProfile`, so it gets the same migrations, append-only triggers and projections as a profile (REQ-6304). Nothing in it is her game: the code that runs it opens the sandbox's database and never hers, and a test proves that a write in the sandbox changes none of her rows (REQ-8284).
- A reset starts the sandbox from nothing or from a copy of her game. The copy carries her log, her blobs and her graph versions and rebuilds the projections, through the same `transfer` that moves a game. It leaves out every credential: the PIN, its lockouts and the device tokens (REQ-6322), and also her model call log, so the sandbox's spend is its own. A reset drops the sandbox schema and makes it again; her schema is not touched.
- The sandbox's model calls pass through a gateway of its own, whose month limit is $50, the proposal of ADR-3280, and whose log is in the sandbox's schema. The limit is the owner's setting, `MEOWTOWER_SANDBOX_MONTH_USD`, and it never counts against an account's budget (REQ-8314).
- The studio gets two routes: one reads the sandbox's state (whether it exists, how many events it holds, what it spent this month and its limit), and one resets it.

What works once this is accepted: the parent makes a sandbox from nothing or from a copy of her game, resets it, and sees its spend against its limit, with her game untouched. What doesn't: a screen to play in it, which comes with the turn loop of ADR-3270, and the page that names where each feature is tested (REQ-8304).

## Why

A schema gives the isolation that ADR-0340 builds from three mechanisms, with the one that Postgres already enforces. The copy reuses the move of ADR-3310, which compares the copy with its source, so a sandbox that differs from her game says so.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: build ADR-0340 as written | Its design is complete | It builds a read-only file connection, a column and a nightly job to guard against what a schema forbids |
| Test on the player's own profile | No copy | A test would write into her game |
| A second Postgres database | Isolation by the server | A second connection and set of migrations for no isolation a schema lacks |

## What it costs

A copy of a long game is a copy of its whole log, which takes seconds to minutes as the log grows. ADR-0340's `profile` mark and its nightly leak count are not built, and REQ-6310 and the leak report therefore stay unmet until a later record replaces them by the schema's isolation.

## What would reverse it

- A sandbox write is found in her schema: the isolation fails, and ADR-0340's marks come back.

## Consequences

- The schema `s_<name>` joins the names the test run cleans up. The accounts' ledger does not count a sandbox schema, because it lists profiles from the accounts' table.

## How I will know it was realised

1. A test makes a sandbox from a copy, finds her events in it and no PIN, lockout or device row, and changes the sandbox and finds her schema's rows unchanged.
2. A test resets the sandbox from nothing and finds it empty with its tables built.
3. A test runs a gateway on the sandbox with the limit and finds a call refused once the limit is spent, whatever the account's budget.

## What this does not settle

- The play screen of the sandbox, its inspector and its simulated player.
- The page that names where each feature is tested.
- The withdrawal of REQ-6310 and the leak report.

## Plan

1. The sandbox schema, its reset from nothing or from a copy without credentials, and the proof that her game is untouched (REQ-8284).
2. The gateway of the sandbox with its own limit (REQ-8314).
3. The two studio routes.
