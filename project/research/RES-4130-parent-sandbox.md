---
id: RES-4130
artifact: research
status: approved
revised: 2026-09-28
elaborates: RES-3500
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent's sandbox fits the engine as a second SQLite file in the database volume, and it leaves the player's game untouched when it spends from the offline key and the approved test mode is amended to match it

## Summary

The parent's sandbox fits the code as it stands at commit 47c0a7b. The engine writes and folds through whatever database handle it is given, so a second SQLite file with the same migrations can hold a whole sandbox game. The file belongs in the Docker volume `meowtower-db` beside the live file `meowtower.sqlite`, because ADR-0010 moved the live database off the `data/` bind mount for WAL safety. The sandbox can't open the main file through `openDatabase`, which migrates and rebuilds projections and so writes. It needs its own read-only connection, and the main file needs a new guarded trigger that refuses a sandbox event. The approved record already holds a narrower version of this feature, the parent's test mode, in RES-3500, ADR-0180, ADR-0150 and two approved requirements drawn from RES-3500. The owner's addendum of 2026-09-28 changes its name, its label, its file and what may cross back into the player's log, so those records need amending. Two conflicts went deeper. A $1 daily sandbox budget inside the $60 monthly limit lets the sandbox exhaust the month and cut the player's live story, and the agent's command-line sandbox would spend from the play key that ADR-0100 and ADR-0190 keep for play. Both are settled on 2026-09-28: the sandbox and its command line spend from the offline key under a monthly cap of their own, and the play key's $60 limit stays. A reset offers both an empty profile and the last snapshot. This record covers section 13 of the addendum and its acceptance test 18. It doesn't cover the other twelve sections, whose events and roles the sandbox only has to run.

## The question

What must be true of the code and the approved record so the parent can try tasks, hints, explanations, puzzles, scenes and a whole adventure without changing anything the player's game reads? The addendum constrains the answer. It asks for a separate database file, the main file opened read-only, sandbox events refused in the main file by code and by a trigger, a snapshot of the player's state on request, and real model calls on a separate log. The sandbox gets a $1 daily budget inside the monthly limit, entry from the Parent Room behind the PIN, a striped frame on every screen and a 30-minute idle expiry. It also gets the engine panel, batches of 10 to 50 tasks, the puzzle widgets, the riddle parser, scenes on a copy of the Master's memory and an adventure played "as the player". It changes the game only through explicit confirmed actions logged with the source `sandbox`, and it has a command-line form for the agent.

The question assumes that isolating storage isolates the game. It doesn't, because three things the sandbox touches are shared outside any database file. The first is money: the play key's $60 monthly limit is one pool, and when it runs out the player's story falls back to the library for the rest of the month. The second is the parent's attention and session, which the sandbox and the Parent Room share. The third is the player's own text, which a snapshot copies and a sandbox scene sends to a model. A storage design alone can pass acceptance test 18, with the `events` hash unchanged, while the sandbox still ends her live story on the 25th of a month. So the findings below look at the budget and the key as closely as at the file.

The question also assumes the feature is new. RES-3500 found the owner's design already drew it as «Проверка игры» (screens 32 and 33), and ADR-0180 placed it with a separate file. The addendum is therefore an amendment of approved scope, and every change it makes has an approved record to amend.

## Method

On 2026-09-28 I read section 13, the event list, the model table and acceptance test 18 of the owner's addendum 1 to the specification. I read the code at commit 47c0a7b: `src/server/database.ts`, `src/engine/events/append.ts` and `read.ts`, `src/engine/projections/registry.ts`, the eight files in `migrations/`, `src/server/parent-room.ts`, `parent-access.ts`, `parent.ts`, `main.ts` and `snapshots.ts`, `src/shared/events.ts`, `tools/static-checks.ts`, `compose.yaml`, the `Dockerfile` and the `meowtower` script. I read `better-sqlite3` 13.0.3's `lib/database.js` and `src/addon.cpp` in `node_modules`, and the SQLite version in its bundled header, 3.53.4.

I searched the record with `paw find` for "sandbox", "parent session expiry", "budget monthly limit", "read-only" and "simulation verify", and searched `project/` for "test mode", "profileId" and "calibration". I read ADR-0010, ADR-0020, ADR-0030's parent session passages, ADR-0100, ADR-0150's screens rule, ADR-0180, ADR-0190's simulation, verify and threat passages, SPC-0010, SPC-0020, SPC-0030's parent session passages, RES-2700's monthly limit finding, RES-3500's screens 32 and 33, TSK-0390, and the approved requirements on the parent session's expiry, on where game data lives and on test mode.

On the web I read SQLite's pages on WAL mode and on `CREATE TRIGGER`, both on 2026-09-28. I ran nothing: I didn't open a WAL database read-only inside the container, and I didn't test a trigger on `events`. The model gateway, `llm_log` and the parent session's expiry aren't in the code yet, so what I say about them comes from ADR-0100, ADR-0030 and TSK-0390, not from code.

## Findings

### The approved record already has this feature as the parent's test mode, with a narrower scope

RES-3500 records the owner's design of «Проверка игры»: play any part of the game "without touching her data", from a clean profile or a copy of her progress, with the answer and template shown, outcomes set by hand, time sped up and Master scenes from the library or live (screen 32). Screen 33 draws a striped frame labelled «Проверка · не идёт в статистику игрока», and its note says only notes and "ambiguous task" marks reach the player. ADR-0180 places the test mode on "a separate database file, `data/test-profile.sqlite`, which starts empty or as a `VACUUM INTO` copy of the player's database", and lets "only the parent's notes and ambiguous-task marks cross back". Its check 12 expects a test session over a whole floor to leave `events` unchanged apart from those two kinds. An approved requirement drawn from RES-3500 states the same exception list, and another requires a frame and a label on every test-mode screen. ADR-0150 draws that frame from a root attribute `data-mode="test"` with the label above. All of these were read on 2026-09-28 and are approved.

### The addendum widens what crosses back beyond ADR-0180 and the approved test-mode requirement

The addendum's confirmed actions are "задание неоднозначное", "отключить шаблон/узелок" with a way back, and "одобрить узелок/вариант", each logged in the main log with `source: "sandbox"`. ADR-0180 and the approved test-mode requirement allow only notes and ambiguous-task marks. Disabling a template or a puzzle and approving one are new crossings, so that requirement's exception list and ADR-0180's sentence and check 12 conflict with the addendum.

### The addendum renames the feature and its label, against ADR-0150 and RES-3500

The addendum calls the feature «Песочница» and its frame label «Песочница — не влияет на игру». ADR-0150 fixes the label «Проверка · не идёт в статистику игрока» and the attribute `data-mode="test"`, and RES-3500 names the screens «Проверка игры». The approved requirement on the frame names no wording, so it holds under either name.

### The engine can run a second game in a second file without change

`appendEvents(db, events)` in `src/engine/events/append.ts` and `applyProjections(db, ...)` in `registry.ts` take the database handle as an argument and hold no module-level connection. `openDatabase(path)` applies every migration, checks the guard triggers and rebuilds missing projections on any path it is given. A sandbox file opened with `openDatabase` therefore gets the same schema, the same append-only triggers and the same projections as the main file. Read on 2026-09-28 at 47c0a7b.

### The main file can't be opened read-only through openDatabase

`openDatabase` creates `schema_migrations` if absent, runs pending migrations, sets `journal_mode = WAL` and calls `rebuildMissing`, which creates and fills any missing projection table. Each of these writes, so a read-only connection through it fails or, worse, succeeds by writing. A read-only connection needs its own opener, which `better-sqlite3` 13.0.3 supports with the options `readonly` and `fileMustExist` (`lib/database.js`). `src/server/snapshots.ts` already opens the live file this way, `new Database(live, { readonly: true })`, in the worker that takes snapshots. Read on 2026-09-28.

### A read-only connection to the live WAL file works while the server runs, and one read transaction sees one point in time

SQLite's WAL page says a WAL database can be read read-only when "the -shm and -wal files already exist and are readable", or when the directory is writable. The server holds the file open in WAL mode, so both files exist whenever the sandbox runs. The same page says a reader's end mark "is unchanged for the duration of the transaction", so "a single read transaction only sees the database content as it existed at a single point in time". A snapshot of the player's state read in one transaction is therefore consistent while she plays. Read on 2026-09-28 at sqlite.org.

### The live file is `meowtower.sqlite` in the volume `meowtower-db`, and `data/` inside the container holds only three mounts

`src/server/main.ts` opens `MEOWTOWER_DB`, default `/var/lib/meowtower/meowtower.sqlite`. `compose.yaml` mounts the named volume `meowtower-db` at `/var/lib/meowtower`, and binds only `data/blobs`, `data/snapshots` and `data/exports` into the container. The service runs with `read_only: true`, so the root file system is read-only and a file can be created only in a mount or `/tmp`. The addendum's `data/sandbox.db` and `data/tower.db` match no path the container can write, and ADR-0010 and ADR-0020 still name the older `tower-db` volume and `./tower` command that ADR-0200 renamed. Read on 2026-09-28 at 47c0a7b.

### ADR-0010 keeps a written SQLite file off the bind mount, and that reason covers a sandbox file

ADR-0010 moved the live database to a named volume because "a bind mount on Docker Desktop is a shared file system between the Mac and a virtual machine, and I have no test showing WAL is safe there". A sandbox file that the server writes in WAL mode meets the same risk on `data/`, and ADR-0180's `data/test-profile.sqlite` meets it too. ADR-0010 also keeps all game data on the Mac, which a file in the volume satisfies. Read on 2026-09-28.

### The event envelope has no profile field, so the addendum's `profileId` needs a new field or an existing one

Migration `0002_events.sql` defines `events` with `seq`, `id`, `ts`, `client_ms`, `device_id`, `session_id`, `adventure_id`, `type`, `v`, `payload` and `idem_key`, and no profile column. ADR-0020 and SPC-0020 fix that envelope. A trigger that refuses a sandbox event in the main file has to test some column: a new `profile_id`, a reserved `device_id` such as the one the server uses for itself, `server`, or a payload field read with `json_extract`. Each changes the envelope ADR-0020 defines. Read on 2026-09-28.

### A new trigger on `events` needs the start-up guard and the migration runner to know it

`GUARDED_TRIGGERS` in `src/server/database.ts` lists the four triggers the server refuses to start without, and `checkGuard` accepts one only if its SQL holds `RAISE(ABORT, 'events are append-only')`. `guardBreach` refuses a migration that drops or replaces a listed trigger. A `BEFORE INSERT` trigger that refuses sandbox events with its own message fails `checkGuard` as written, and if left off the list a later migration can drop it unnoticed. SQLite's trigger page says `RAISE(ABORT, ...)` terminates the statement and returns `SQLITE_CONSTRAINT` with the message, which `appendEvents` turns into `LogWriteFailed` and a 503. Read on 2026-09-28.

### The static check on SQL naming `events` allows exactly the modules the sandbox needs

`tools/static-checks.ts` rejects SQL naming `events` outside `src/engine/events`, `migrations` and `tests`. A sandbox that reads the main file's log through `src/engine/events/read.ts` passes it, and a sandbox module that queries `events` directly fails it. Read on 2026-09-28.

### Entering the sandbox writes to the main file today

`attempt` in `src/server/parent-access.ts` writes the `lockouts` row on every PIN attempt, a correct one included (`save.run(kind, 0, 0)`). Entering the sandbox through the Parent Room PIN therefore changes the main file's `lockouts` table. Acceptance test 18 requires that "всё прочее" in the main file stay unchanged after a scenario, so it holds only if its hash starts after login or leaves the access tables out. Read on 2026-09-28.

### A snapshot copies the access tables along with the player's state

`takeSnapshot` in `snapshots.ts` runs `VACUUM INTO` on the whole live file. The copy holds `parent_pin`, `lockouts` and `devices` with the PIN hash and the device token hashes, and after ADR-0100 lands it also holds `llm_log` and `explain_cache`. A sandbox built from that copy carries the parent's credentials and the player's model history in a second file. Read on 2026-09-28.

### The parent session has no expiry in the code yet, and play routes don't touch it

`ParentSessions` in `parent-access.ts` keeps sessions in memory, bound to a device, with no expiry; TSK-0390, approved, adds the 30-minute expiry on parent requests. ADR-0030 and SPC-0030 define the expiry as "30 minutes after its last request" on `/api/parent/*`. A sandbox adventure played "as the player" runs through play-shaped routes, so under that definition an active sandbox adventure expires after 30 minutes unless its requests count as parent activity. The addendum's 30-minute idle expiry matches the approved one, so the two don't conflict. Read on 2026-09-28.

### ADR-0020 puts `llm_log` and the `llm_call` event in the one database

ADR-0020 lists `llm_log` among the seven service tables and `llm_call` as an event that points to its row, and ADR-0100 has every call write both. A sandbox call logged there would change the main file. The addendum's separate sandbox `llm_log` therefore means a second `llm_log`, and the `llm_call` events of sandbox calls belong in the sandbox log. Read on 2026-09-28.

### The sandbox budget breaks the arithmetic that keeps the monthly limit from binding

ADR-0100 and RES-2700 set the play key's limit at $60 because it "sits above the $55.80 the daily caps allow in a 31-day month", 31 x ($1.5 + $0.3), so the limit fires only when something bypasses the daily caps. The addendum adds `PARSE_BUDGET_USD_PER_DAY = 0.1` in section 2 and `SANDBOX_BUDGET_USD_PER_DAY = 1.0` "в общем месячном лимите". By my arithmetic the daily caps then allow 31 x ($1.5 + $0.3 + $0.1 + $1.0) = $89.90. When the month's count passes $60, ADR-0100 has "every session to the month's end" use the fallbacks and logs `budget_month_spent`. A parent who uses the sandbox budget on 20 days of a month can therefore end the player's live story for the rest of it, which the addendum's "без влияния на игру" rules out. RES-2700 estimates an adventure at about $0.45 to $0.55, so a typical month leaves room; the conflict is with the guarantee, not with the typical month. Read on 2026-09-28.

### The agent's command-line sandbox would spend from the play key, which ADR-0100 keeps for play

ADR-0100 makes offline runs spend from a second key and has the gateway refuse "a play role on the offline key outside verify mode". ADR-0190 counts each agent run's spend as "the offline key's usage", and runs every automated check in `replay` mode with no network. The addendum's `sandbox item`, `sandbox batch` and `sandbox adventure --from-snapshot` make real calls under the sandbox budget inside the play limit. An agent that runs `sandbox batch` in a loop then spends the player's month, and the handoff's spend line doesn't show it. Read on 2026-09-28.

### A sandbox run from a real snapshot puts the player's text in the agent's hands

ADR-0190 ranks first among its threats "the agent committing personal data to the public repository in a fixture or a recording". `sandbox adventure --from-snapshot` prints JSON built from her log, which holds her cleaned free text and the names she gave. The repository is public (the project's CLAUDE.md). Read on 2026-09-28.

### The Mac's commands reach the server through the loopback listener, which needs no PIN

The `meowtower` script runs `recompute`, `db-snapshot` and `export` by `curl` to `http://localhost:$PARENT_PORT`, the listener `compose.yaml` publishes on `127.0.0.1` only, and `parent.ts` mounts those routes with no parent session. A `./meowtower sandbox` command built the same way would work only on the Mac and skip the PIN, as `set-pin` and `pair` do. Read on 2026-09-28.

### The adult calibration writes to the main log on purpose, so it can't move into the sandbox

ADR-0180 derives a device type's fluency threshold, where Session 0 is missing, from "an adult who solves 3 tasks of the node in the Parent Room", logged as `calibration` events that feed the `thresholds` projection. A parent solving tasks in the sandbox looks the same on screen, but its events never reach the main file, so calibration stays a separate Parent Room mode. Read on 2026-09-28.

### Four options answer the question, and each is better at something

| Option | What its advocate would say it is better at | Case against it |
| --- | --- | --- |
| Do nothing beyond the approved test mode: ADR-0180's file, notes and ambiguous marks only, no panel, batches, parser or command line | already approved, least to build, and the narrowest crossing into her log | the parent can't check puzzles, widgets, the parser or a batch before the player meets them, which the addendum asks for; the monthly budget conflict stays, because the test mode already allows live Master scenes |
| One file, with a profile column: sandbox events in the main `events` table, filtered by `profile_id` in every projection | one database, one backup, and "as the player" reads her state with no copy | every projection and the report must filter correctly forever, and one missing filter moves her estimates; the `events` hash changes with every sandbox run, so acceptance test 18 can't pass |
| A second file in the same server process, the main file behind a read-only connection (the addendum) | the engine runs unchanged on a second handle; the snapshot worker already exists; one process, one gateway, one budget count | the process still holds the read-write main handle, so isolation rests on the sandbox code never receiving it, plus the trigger |
| A second file served by a separate sandbox process or container that has no write access to the main volume | isolation by the operating system: the sandbox can't write the main file whatever its code does | a second server to run and start, a second gateway sharing one budget count across processes, and a snapshot handed over as a file |

I lead with the second file in the same process, because it is the only option that meets every clause of section 13 with code that exists. The case against it is the one in its row: a bug that passes the main read-write handle into a sandbox path writes to her log, and the trigger then catches only events that carry the sandbox marker. The separate process removes that bug class and costs a second process on the Mac. The same-process option is chosen, because it builds on code that exists and changes the fewest approved records; conclusions 2 to 5 close its weak point with a read-only connection, a check in `appendEvents` and a guarded trigger.

## Conclusions

1. The sandbox's database must be a second SQLite file in the volume `meowtower-db`, next to `/var/lib/meowtower/meowtower.sqlite`, opened by the same migrations and guards as the main file, and never on the `data/` bind mount.
2. The sandbox must read the main file only through a connection opened with `readonly: true` and `fileMustExist: true`, never through `openDatabase`, and no sandbox code path may receive the server's read-write handle.
3. Every sandbox event must carry a marker in the event envelope, and a `BEFORE INSERT` trigger on the main file's `events` must refuse an event with that marker with its own `RAISE(ABORT, ...)` message.
4. The server must refuse to start when that trigger is missing from the main file, and the migration runner must refuse a migration that drops or replaces it, as it does for the four triggers it guards today.
5. `appendEvents` must refuse a sandbox-marked event on the main file before the insert, so the trigger is the second line and not the only one.
6. A snapshot of the player's state must be taken in one read transaction on the read-only connection, and must leave out or empty `parent_pin`, `lockouts` and `devices`, so the sandbox file holds no credential.
7. Resetting the sandbox must replace the sandbox file and leave the main file unchanged, and the reset must offer both an empty profile and a copy of the last snapshot of the player's state.
8. Every sandbox model call must write its `llm_log` row and its `llm_call` event to the sandbox file, and pass the same egress guard and privacy tier as the same role in play, because a snapshot carries her story material.
9. The sandbox's model calls must spend from the offline key, under a monthly cap of their own that the decision step sets, and never from the play key.
10. The sandbox must not be able to cause `budget_month_spent`. The play key's $60 monthly limit stays, and the play key's daily caps, the parse bucket of $0.1 a day included, must sum below $60 in a 31-day month: 31 x ($1.5 + $0.3 + $0.1) = $58.90.
11. The play key's monthly count must leave out the sandbox file's `llm_log` spend, and the cost report must show the sandbox's spend on its own line against its offline cap.
12. Entering the sandbox must need a parent session opened with the PIN on the calling device. Every sandbox request, play-shaped ones included, must count as parent activity, so the 30-minute idle expiry ends an idle sandbox and never an active one.
13. Every sandbox screen must show the striped frame and the label «Песочница — не влияет на игру», and ADR-0150's label and `data-mode="test"` must be amended to the sandbox's name.
14. The sandbox's only writes to the main file must be the confirmed actions: marking a task ambiguous, disabling a template or a puzzle and restoring it, and approving a puzzle or a variant. Each must happen only after a second confirming press and be logged with `source: "sandbox"`.
15. A disabled template or puzzle must reach the game as an event that a projection folds, because the container's file system and `content/` are read-only.
16. Parent events that gain `source` must do so as a new payload version with an upcaster, and `sandbox_action_applied` must enter ADR-0020's event catalogue with its owning decision.
17. The adult calibration of ADR-0180 must stay a Parent Room mode that writes to the main log, outside the sandbox.
18. The command-line sandbox must run as `./meowtower sandbox item`, `sandbox batch` and `sandbox adventure --from-snapshot` through the loopback listener, print JSON, and hold no route that applies a confirmed action.
19. Output from a sandbox run on a real snapshot must never be written into a tracked file, and the repository scan of ADR-0190 must check that.
20. The agent's command-line sandbox must spend from the offline key under the sandbox's monthly cap, like every other agent run, and never from the play key.
21. Acceptance test 18 must hash the main file's `events` and every other table after the PIN login and before the scenario, and compare after it with no confirmed action taken. A second run with each confirmed action must show exactly one new main-file event per action, carrying `source: "sandbox"`.
22. These approved records must be amended, each by the change named:
    - ADR-0180: the sandbox's file, how it starts, what crosses back and its check 12.
    - The approved requirement drawn from RES-3500 that lists what test mode may change in the player's record: its exception list.
    - ADR-0150: the label and the attribute.
    - ADR-0020 and SPC-0020: the envelope marker, the new guarded trigger, the second `llm_log` and the event catalogue.
    - ADR-0100 and RES-2700, by a new record: the sandbox's monthly cap on the offline key, and the parse bucket in the monthly limit arithmetic.
    - ADR-0190: the command-line sandbox's output and its place among the offline key's runs.

    RES-3500 is approved research and stays as it is; this record supersedes its conclusion 15 on what test mode passes to the player's record.

### Decided on 2026-09-28

The sandbox stops before it can touch the player's month, because its model features spend from the offline key under a monthly cap of their own that the decision step sets, and the play key's $60 limit stays; raising the limit to about $90 would have left the guarantee resting on arithmetic again. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The agent's command-line sandbox spends from the offline key like every other agent run, because ADR-0100 and ADR-0190 already keep the play key for play and the handoff's spend line then shows the cost. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

A reset offers both an empty profile and the last snapshot of the player's state, because the design's «Чистый» profile checks a new player's path and the snapshot checks hers. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The sandbox file is a second SQLite file in the volume `meowtower-db` beside `meowtower.sqlite`, not in the bind-mounted `data/` folder, because ADR-0010's reason against a written WAL file on the bind mount covers it; the addendum's `data/sandbox.db` and `data/tower.db` are read as the idea of a second file. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

## Sources

- The owner's addendum 1 to the specification, 2026-09-28 - section 13, the event list, the model table, the order of work and acceptance test 18.
- `src/server/database.ts`, `src/engine/events/append.ts`, `src/engine/events/read.ts`, `src/engine/projections/registry.ts`, repository at 47c0a7b, read 2026-09-28 - the handle-agnostic engine, `openDatabase` writing at open, `GUARDED_TRIGGERS`, `checkGuard` and `guardBreach`.
- `migrations/0002_events.sql`, `0007_parent_access.sql` and `0008_explain_cache.sql`, repository at 47c0a7b, read 2026-09-28 - the envelope without a profile field and the tables a snapshot copies.
- `src/server/parent-room.ts`, `src/server/parent-access.ts`, `src/server/parent.ts`, repository at 47c0a7b, read 2026-09-28 - the PIN login writing `lockouts`, sessions with no expiry yet and the loopback routes without a PIN.
- `src/server/main.ts`, `src/server/snapshots.ts`, `compose.yaml`, `Dockerfile` and `meowtower`, repository at 47c0a7b, read 2026-09-28 - the live file's path, the volume, the read-only root file system, the read-only snapshot worker and the command's loopback calls.
- `src/shared/events.ts` and `tools/static-checks.ts`, repository at 47c0a7b, read 2026-09-28 - the parent event schemas without `source`, `llm_call` and the `events_sql` check.
- `node_modules/better-sqlite3` 13.0.3, `lib/database.js`, `src/addon.cpp` and `deps/sqlite3/sqlite3.h`, read 2026-09-28 - the `readonly` and `fileMustExist` options and SQLite 3.53.4.
- [SQLite, Write-Ahead Logging](https://sqlite.org/wal.html), read 2026-09-28 - reading a WAL database read-only and one read transaction seeing one point in time.
- [SQLite, CREATE TRIGGER](https://sqlite.org/lang_createtrigger.html), read 2026-09-28 - what `RAISE(ABORT, ...)` does and returns.
- ADR-0010, `project/adrs/ADR-0010-one-typescript-server-on-the-mac.md`, read 2026-09-28 - the volume and the reason against WAL on the bind mount.
- ADR-0020 and SPC-0020, read 2026-09-28 - the log as the only truth, its envelope, its triggers, the service tables and the event catalogue.
- ADR-0030, SPC-0030 and TSK-0390, read 2026-09-28 - the parent session and its 30-minute expiry.
- ADR-0100, read 2026-09-28 - the gateway, the buckets, the $60 limit, the offline key rule and `llm_log`.
- RES-2700, read 2026-09-28 - the $55.80 arithmetic behind the $60 limit and the cost of an adventure.
- ADR-0150, ADR-0180 and RES-3500, read 2026-09-28 - the approved test mode, its file, its frame and label, and what crosses back.
- ADR-0190, read 2026-09-28 - the agent's offline spend, replay mode and the personal data threat.
- ADR-0180's threshold passage, read 2026-09-28 - the adult calibration in the main log.
