---
id: TSK-0967
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0340
closes: [REQ-6306, REQ-6308]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The sandbox reaches the player's file only through a connection that can't write, and no handler holds a module-level handle

After this task, `openReadOnly(path)` opens her file with `new Database(path, { readonly: true, fileMustExist: true })` and runs no migration, no `journal_mode` pragma and no projection rebuild, and a group 1 check fails any module other than `main.ts` and the confirmed-action module that holds the read-write handle.

## Acceptance criteria

1. Given her live file in WAL mode with a writer appending, when `openReadOnly` opens it and reads, then the file's size, `mtime` and the hash of `schema_migrations` are the same afterwards (REQ-6308). Closed by: an integration test.
2. Given a handle from `openReadOnly`, when a test attempts an `INSERT`, then the handle throws and her file's per-table row hashes are unchanged (REQ-6306). Closed by: an integration test.
3. Given a planted import of the main handle in `src/server/sandbox/` and a second one in a play handler, when group 1 runs, then the import check fails and names each file; given a planted timer, interval, `setImmediate` or job-queue call in `src/server/sandbox/`, or an import of the sandbox flag's storage module there, then a lint fails and names the file (REQ-6306). Closed by: three planted-fixture tests of the checks.
4. Given the play handlers mounted on a sandbox engine context, when a handler appends an event, then it reaches a database only through the context it was given (REQ-6306). Closed by: the import check passing over `src/server/` with no module-level handle left in a handler.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `openReadOnly` beside `openDatabase`. Construct the sandbox module in `main.ts` with the read-only handle and its own handles, never with the read-write handle. Add the two group 1 checks of ADR-0340: no module outside `main.ts` and the Parent Room's confirmed-action module imports the main handle or calls `openDatabase` on her file's path, and nothing in `src/server/sandbox/` starts a timer, an interval, `setImmediate` or a job or imports the flag's storage module, which keeps every append from sandbox code inside a sandbox request. The import check will find play handlers that still reach a module-level handle; change each to take the engine context, because the sandbox mounts the same handlers and one that kept a module-level handle would write sandbox play into her file marked `main`. Keep the lease holder, heartbeat timers, event streams and answer queue per engine context.

## Depends on

- TSK-0964 (blocking): the check names the paths and the role-bearing opener that task adds.

The epic realising ADR-0030 owns the play handlers; this task changes only how they obtain a handle, and leaves the play rules as they are.

## Evidence

Not yet.

## Left alone

The snapshot worker's own use of `openReadOnly`, which TSK-0968 builds, and the sandbox's routes, which TSK-0971 mounts.
