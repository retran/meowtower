---
id: SPC-0340
artifact: spec
status: live
revised: 2026-09-29
checked-at:
states: [REQ-6300, REQ-6302, REQ-6304, REQ-6306, REQ-6308, REQ-6310, REQ-6312, REQ-6314, REQ-6316, REQ-6318, REQ-6320, REQ-6322, REQ-6324, REQ-6326, REQ-6328, REQ-6330, REQ-6336, REQ-6340, REQ-6342, REQ-6344, REQ-6346, REQ-6348, REQ-6350, REQ-6352, REQ-6354, REQ-6356, REQ-6358, REQ-6360, REQ-6362, REQ-6364, REQ-6366, REQ-6368, REQ-6370, REQ-6372, REQ-6374, REQ-6376, REQ-6378]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent's sandbox: its database file, the guard on the player's file, snapshots and resets, confirmed actions and the command-line sandbox

## Scope

This document covers the parent's sandbox «Песочница» (Sandbox): a second game that the `meowtower` server runs with the unchanged engine on a database file of its own. It states the sandbox's files, the read-only connection to the player's file, the `profile` mark and the guards that refuse a sandbox event in her file, the snapshot and the reset, where sandbox model calls are recorded and counted, the parent session that guards the sandbox routes, the entry link with its list of nodes, the sandbox frame, the confirmed actions that cross into her game, and the command-line sandbox the agent runs on the Mac. It is written at the level of files, routes, events, commands and the modules that may hold each database handle.

It leaves out what other documents state. SPC-0020 states the event log, `appendEvents`, the projections and the migration runner, which this part extends. SPC-0010 states the listeners, pairing, the PIN and its lockout, and SPC-0030 states the play routes and the parent session with its 30-minute idle expiry. SPC-0100 states the model gateway, its keys and the sandbox's $20 monthly bucket on the offline key. SPC-0190 states the stage at which the sandbox is built, the loopback interim before the PIN guards it, and `409 sandbox_models_unavailable`. The features the parent runs inside the sandbox, such as the engine panel, batches, puzzles, widgets, «Сплети загадку» (Weave a riddle) with the parser, scenes and the Master, belong to the documents that own each of them; this part only runs them on the sandbox's file. SPC-0150 states the striped frame as a component, SPC-0160 the string files, SPC-0180 the Parent Room and its entry to the sandbox, SPC-0280 the puzzle bank and `puzzle_approved`, and SPC-0310 the "home and school" screen, whose check for low at home and high at school opens the sandbox on a list of nodes.

## Boundary

### Files

The volume `meowtower-db` holds three sandbox files beside `/var/lib/meowtower/meowtower.sqlite`, and none of them is on the `data/` bind mount shared between the Mac and the container (REQ-6300, REQ-6302).

| File | What it holds | Who writes it |
| --- | --- | --- |
| `sandbox.sqlite` | the sandbox's game: its events, projections, `llm_log` and service tables | the sandbox's engine |
| `sandbox-snapshot.sqlite` | the last sandbox snapshot of the player's state, already scrubbed | the snapshot builder only |
| `sandbox-spend.sqlite` | one row per settled sandbox model call, from the Parent Room or the command line | the gateway only |
| `sandbox-cli-<ULID>.sqlite` | one command-line run's game | the command-line sandbox, which deletes it when the command ends |

### Routes and commands

| Surface | Listener | What it does |
| --- | --- | --- |
| `/api/parent/sandbox/*` | the game listener | the sandbox's own routes: a task, a batch, the engine panel, puzzles, widgets, the parser, scenes, the state override, the snapshot and the reset |
| `/api/parent/sandbox/play/*` | the game listener | the play handlers of SPC-0030 mounted on the sandbox's engine context, for an adventure played as the player |
| `POST /api/parent/sandbox-actions/prepare` | the game listener | takes a confirmed action and its target; returns a single-use token and the echo of what the server inferred; writes nothing |
| `POST /api/parent/sandbox-actions/confirm` | the game listener | takes the token; appends the action's one event to the player's file |
| `/sandbox/*` | the loopback listener `127.0.0.1` | the command-line sandbox's three routes |
| `./meowtower sandbox item` | the Mac | runs one task item and prints JSON |
| `./meowtower sandbox batch --count N` | the Mac | runs a batch of 10 to 50 task items and prints JSON |
| `./meowtower sandbox adventure --from-snapshot` | the Mac | plays an adventure as the player from the last sandbox snapshot and prints JSON |

The loopback listener mounts neither `sandbox-actions` route. No route under `/api/parent/sandbox/` runs a calibration.

### The mark and the file's role

| Element | Definition |
| --- | --- |
| `events.profile` | `TEXT NOT NULL DEFAULT 'main' CHECK (profile IN ('main', 'sandbox'))`, added by `ALTER TABLE events ADD COLUMN` |
| `db_role` | `(id INTEGER PRIMARY KEY CHECK (id = 1), role TEXT NOT NULL CHECK (role IN ('main', 'sandbox')))`, created empty, with triggers that refuse an `UPDATE` or `DELETE` |
| `events_profile_guard` | a `BEFORE INSERT` trigger on `events` that raises `event profile does not match database` when `NEW.profile IS NOT` the file's `db_role.role` |
| engine context | `{ db, profile }`, built by the caller and passed to `appendEvents` and `applyProjections` |
| sandbox route trees | `/api/parent/sandbox/*`, `/api/parent/sandbox/play/*` included, on the game listener, and `/sandbox/*` on the loopback listener; `/api/parent/sandbox-actions/*` is not one |
| device identifier `sandbox` | written by `appendEvents` on every event appended inside a request on a sandbox route tree, beside SPC-0020's `server` |

### Events this part owns

| Event | Written to | Payload |
| --- | --- | --- |
| `content_disabled` v1 | the player's file | `kind` (`template` or `puzzle`), `id`, `source` (`parent_room` or `sandbox`), `echo` |
| `content_restored` v1 | the player's file | the same fields as `content_disabled` |
| `sandbox_action_applied` v1 | a sandbox file only | `mainEventId`, `mainEventType`, `echo` |
| `item_excluded` v2 | the player's file | v1's fields and `source` (`parent_room` or `sandbox`); for a task generated in the sandbox, `templateId`, `templateVersion` and `paramsHash` in place of `itemId` |

The projection `disabled_content` folds `content_disabled` and `content_restored`.

### Statuses and error names

| Status or name | Audience | Meaning |
| --- | --- | --- |
| `500 sandbox_event_refused` | the owner | `appendEvents` or `events_profile_guard` refused an event whose profile differs from the file's role |
| `log_guard_missing` | the developer | a guarded trigger is missing at start-up; the server exits naming it |
| `database_role_mismatch` | the developer | a file's stored role differs from the role its opener asked for |
| `sandbox_leak_found` | the owner | the nightly count found an event with the device identifier `sandbox` in the player's file |
| `sandbox_snapshot_failed` | the parent | a snapshot failed; the old snapshot and sandbox stay |
| `409 sandbox_resetting` | the parent | a sandbox request or a confirm arrived during a reset |
| `410 sandbox_action_expired` | the parent | a confirm arrived with an unknown or expired token |
| `node_all_disabled` | the parent | a confirmed disable left a node with no enabled template |
| `sandbox_large` | the parent | `sandbox.sqlite` passed 2 GB |
| `sandbox_batch_size` | the building agent | `batch --count` outside 10 to 50; exit status 2 |
| `sandbox_snapshot_missing` | the building agent | `adventure --from-snapshot` with no snapshot; exit status 2 |
| `503 log_write_failed` | the parent | the confirmed action's append failed (SPC-0020's state) |

SPC-0100 states the money states the sandbox reaches: `sandbox_budget_spent`, `offline_key_refused` and `sandbox_models_unavailable`.

### What this part requires from other parts

- SPC-0020 supplies `appendEvents(ctx, events)`, `applyProjections`, `openDatabase`, `GUARDED_TRIGGERS`, `checkGuard`, the migration runner, `idem_key` and the upcasters.
- SPC-0010 supplies the two listeners, the loopback listener's refusal of every connection that doesn't come from the Mac, and the PIN check.
- SPC-0030 supplies the parent session and the play handlers, which take an engine context.
- SPC-0100 supplies the gateway, which takes a database handle and a sandbox mark on each call, and the sandbox bucket.
- SPC-0150 supplies the striped frame, and SPC-0160 the string file every label here comes from.
- SPC-0190 runs the static checks and the repository scan this part adds to group 1, and holds this part's budgets in its Baselines table.

### Permitted dependencies

The dependencies run one way. Only `main.ts` and the Parent Room's confirmed-action module import the player's read-write handle or call `openDatabase` on her file's path. `main.ts` constructs the sandbox module in `src/server/sandbox/` with the read-only handle to her file and the sandbox's own handles, and never with her read-write handle. The play handlers and the engine modules reach a database only through the engine context they are given, and hold no module-level handle. The play handlers keep SPC-0030's lease holder, heartbeat timers, event streams and answer queue per engine context, so the sandbox's play mount shares none of them with the player's. `main.ts` gives the confirmed-action module a function that returns the sandbox module's current handle to `sandbox.sqlite`, and the module calls it on each confirm and holds no sandbox handle between confirms. The sandbox module never calls the confirmed-action module; the client reaches it through the `sandbox-actions` routes. The client imports only `src/shared/`. A static check in group 1 fails on any other import of the read-write handle, in `src/server/sandbox/`, in a play handler or elsewhere. A lint in group 1 fails a timer, an interval, `setImmediate` or a call to the job queue's API in `src/server/sandbox/`, and any import there of the module that holds the sandbox flag's storage.

## Behaviour

### A second file

The sandbox keeps its game in `sandbox.sqlite`, apart from the player's file, so no sandbox run adds a row to the log her estimates and report are computed from (REQ-6300). The file sits in the volume `meowtower-db`, where her live file sits, and never on the `data/` bind mount (REQ-6302). The server opens each sandbox file with `openDatabase(path, { role: "sandbox" })`, which applies the same migrations, append-only triggers and projections as her file, so the sandbox's log refuses to change or delete an event as hers does (REQ-6304).

`openDatabase(path, { role })` inserts the role into `db_role` on the first open of a file and refuses with `database_role_mismatch` when the stored role differs from the one asked for; `main.ts` opens her file with `main`.

### Reading the player's file

The sandbox reads the player's file only through `openReadOnly(path)`, which calls `new Database(path, { readonly: true, fileMustExist: true })` (REQ-6306). `openReadOnly` runs no migration, no `journal_mode` pragma and no projection rebuild, so opening her file for the sandbox changes no table and no row, and her file's size, `mtime` and `schema_migrations` stay as they were (REQ-6308). A write attempted on that handle throws.

### The mark and the guards

Every event the sandbox writes carries `profile = 'sandbox'` in its envelope (REQ-6310). `appendEvents` takes the profile from the engine context the caller built, never from the handle. A confirmed action's event is written to her file with `profile = 'main'` and the parent's device.

These checks guard her file, in the order an event meets them:

1. `appendEvents` compares each event's profile with the role cached on the handle at open, and throws `SandboxEventRefused` before the `INSERT` (REQ-6318).
2. `events_profile_guard` makes the player's file refuse a `sandbox` event whatever code sends it, over any connection, and makes a sandbox file refuse a `main` event (REQ-6312). A file with no `db_role` row refuses every insert.
3. A nightly job on her file counts the events with the device identifier `sandbox` and reports any it finds once to the owner as `sandbox_leak_found`, with the event types and sequence numbers.

The middleware `main.ts` mounts on the sandbox route trees sets a flag in Node's `AsyncLocalStorage`, and `appendEvents` writes the device identifier `sandbox` on every event appended while the flag is set, whatever context the caller built. Sandbox code can't clear the flag, because the router sets it outside the sandbox module, and it starts no timer or job, so every append from sandbox code happens inside a sandbox request, where the flag marks it. The router matches the game listener's tree on the prefix `/api/parent/sandbox/` with its trailing slash, so no request to `/api/parent/sandbox-actions/*` sets the flag. The confirmed actions carry the parent's device, so the nightly count is zero while the sandbox writes only its own file, and it finds an event written through a context `{ mainDb, profile: 'main' }` built inside sandbox code (REQ-6310).

`GUARDED_TRIGGERS` holds `events_profile_guard` and the two `db_role` triggers beside SPC-0020's guarded triggers on `events` and `blobs`, and `checkGuard` matches each trigger against its own expected message. When any of them is missing from her file, the server refuses to start with `log_guard_missing` naming it (REQ-6314). The migration runner refuses, before it applies anything, a migration that drops or replaces any guarded trigger (REQ-6316).

### Snapshots

A sandbox snapshot runs in a worker thread, which opens its own read-only connection to her file with `openReadOnly`. It first checks with `fs.statfs` that the volume has at least 3 x (her live file plus its `-wal` file) free. The builder then runs `VACUUM INTO` a temporary file, one statement and so one read transaction, so the copy shows her state at one point in time while she plays, with no answer missing its task and no projection ahead of its events (REQ-6320).

The builder creates a fresh file with role `sandbox` and attaches the temporary copy. It copies `events` with `profile` set to `'sandbox'`, and `blobs`, `explain_cache` and `frames` as they are. It leaves `parent_pin`, `lockouts`, `devices`, `llm_log`, `art_jobs`, `bakeoff` and `local_judge_files` empty, so the snapshot holds no PIN hash, no lockout record and no device token or its hash (REQ-6322). A copied `llm_call` event points at an `llm_log` row the snapshot leaves empty, and it changes no projection, because no projection reads `llm_log` and SPC-0020's lint check fails projection code that names it. The builder rebuilds the projections, renames the result over `sandbox-snapshot.sqlite` and deletes the temporary copy.

The builder keeps three table lists: the copy list (`events`, `blobs`, `explain_cache`, `frames`), the empty list (the seven tables above) and the rebuilt list (`db_role` and `schema_migrations`, which the fresh file's open writes, and every table in the projection registry). A group 1 check fails, naming the table, when a table in the schema is on none of the three lists, so a table a later migration adds fails group 1 until someone lists it. When the builder meets a table on none of the three lists, one a migration added after the last group 1 run, it creates the table in the snapshot and leaves it empty.

While a snapshot runs, the sandbox shows «Снимаю снимок…» (Taking the snapshot) with the stage it has reached: copy, scrub or rebuild. A snapshot of a 1 GB file takes at most 180 seconds, the budget in SPC-0190's Baselines table. The full verify on the family Mac records a snapshot over 180 seconds as a baseline finding in the verify report and still passes.

### Resets

The reset offers two starts: «Пустой профиль» (Empty profile) and «Копия игрока» (Copy of the player), a copy of `sandbox-snapshot.sqlite` (REQ-6326). When the parent chooses the copy and no sandbox snapshot exists yet, the reset takes one and starts from it (REQ-6378). A separate button, «Снять снимок заново» (Take the snapshot again), replaces the snapshot.

A reset closes the sandbox handle, answers every sandbox request in flight with `409 sandbox_resetting`, builds the new file under a temporary name and renames it over `sandbox.sqlite`. A reset and a snapshot write only sandbox files and read her file only through `openReadOnly`, so neither changes her file: a hash of each table's rows in her file is the same before and after each when she doesn't play meanwhile (REQ-6324). Every check of REQ-6324 compares these per-table hashes and never a hash of the file's bytes. While a reset runs, a confirm answers `409 sandbox_resetting` and appends nothing to either file.

### Model calls and money

A sandbox model call goes through the gateway with the sandbox mark and the sandbox's handle. The gateway writes the call's `llm_log` row and its `llm_call` event to that handle, so both land in the sandbox's file and never in hers (REQ-6328). The call uses its role's own privacy tier, egress guard and schemas, the same as a call by that role in play, whether the sandbox started from an empty profile or from a copy (REQ-6330).

The gateway reserves each sandbox call against the sandbox bucket by reading the month's sum from `sandbox-spend.sqlite` plus the reservations in flight, and settles the call there. A reset never touches `sandbox-spend.sqlite`, so the month's spend and its count against the cap survive every reset (REQ-6374). The play key's monthly count reads only her file's `llm_log`, so no sandbox call, from the Parent Room or from the command line, enters it (REQ-6336). The Parent Room's cost line shows «Песочница» (Sandbox) on a line of its own, with the month's spend from `sandbox-spend.sqlite`, the command line's calls included, against the $20 cap (REQ-6340). The riddle parser run in the sandbox spends from the sandbox bucket too.

### Access, the entry link and the parent session

Every sandbox route on the game listener sits under `/api/parent/`, so each request needs a parent session opened with the PIN on a paired device, and the same device on every request of that session (REQ-6342). A request from another paired device, or with no parent session, gets SPC-0030's `401 parent_session_expired`. No player screen links to the sandbox.

The sandbox's entry link takes an optional list of nodes. When the link carries nodes, the sandbox lists them at its head, each linking to that node's templates in the sandbox; without nodes it opens as the Parent Room's entry opens it. Opening the sandbox from the link writes no event to either file. The check for low at home and high at school on SPC-0310's "home and school" screen opens the link with the row's nodes.

Every sandbox request renews the parent session's 30-minute idle expiry, `/api/parent/sandbox/play/*` included, so an adventure the parent plays as the player keeps its session while requests keep coming (REQ-6344). Parent sessions live in the server's memory, as `ParentSessions` keeps them, so neither a session nor its renewals write to her file (REQ-6376). The PIN login itself can write one row: a correct PIN resets the PIN's count in her file's `lockouts`, as SPC-0010 states.

### Screens

The client renders every sandbox screen under the root attribute `data-mode="sandbox"`, which draws the striped frame and the label «Песочница — не влияет на игру» (Sandbox: does not affect the game), taken from the Russian string file (REQ-6346). The adult calibration of a device type's fluency threshold runs as a Parent Room mode, and the sandbox has no calibration route and no control that opens one (REQ-6358).

### No effect on the player's game

The sandbox changes the player's record only through the confirmed actions: marking a task ambiguous, disabling a template or a puzzle, restoring one, and approving a puzzle or one of its statement variants (REQ-6348). The parent's notes aren't among them. The state override, the Master on the copy of the Master's memory, puzzles and widgets write their ordinary event types into the sandbox's file.

A sandbox scenario with no confirmed action leaves every table of her file unchanged from just after the parent's PIN login to the scenario's end, when the player doesn't play and the parent doesn't log in again meanwhile (REQ-6370). The acceptance test hashes every table after the login, plays a sandbox floor, a batch of 50, a puzzle and a scene, and hashes again; the hashes match.

### Confirmed actions

The Parent Room's confirmed-action module serves the confirmed actions, and the sandbox module holds no handle that could apply one. Each action takes two presses (REQ-6350):

1. The first press sends `POST /api/parent/sandbox-actions/prepare` with the action and its target. The server returns a single-use token and an echo of what it inferred, such as «Шаблон "сдача с покупки" v3 перестанет выпадать игроку» (The template "change from a purchase" v3 will stop appearing for the player), and writes nothing. When a disable would leave a node with no enabled template, the echo warns of `node_all_disabled`.
2. The confirming press sends `POST /api/parent/sandbox-actions/confirm` with the token. The server appends exactly one event to her file, of the action's own type, with `source: "sandbox"` in its payload, `profile = 'main'` and `idem_key = 'sandbox-action:<token>'` (REQ-6352). The module then appends `sandbox_action_applied` with `profile = 'sandbox'` to the sandbox's file, pointing to that event.

| Action | Event in the player's file |
| --- | --- |
| mark a task ambiguous | `item_excluded` v2 |
| disable a template or a puzzle | `content_disabled` |
| restore one | `content_restored` |
| approve a puzzle, or one of its statement variants | `puzzle_approved` for the hash of the variant approved, with the `source` SPC-0280 lists |

One confirmation is one token. A repeated press or a retried request with the same token returns the original event with 200 and appends nothing to her file; it appends `sandbox_action_applied` to the sandbox's file only when that pointer is missing. A later confirmation of the same change, such as disabling a template again after restoring it, uses a new token and adds its own event (REQ-6352). At start-up the server appends `sandbox_action_applied` to the sandbox's file for every event in her file with `source: "sandbox"` that no pointer names. A token is used only once its append commits, so a confirm that failed with `log_write_failed` can retry with the same token. Tokens live in memory, expire after 5 minutes and end with the parent session. A session holds at most 20 tokens, and a 21st prepare drops the oldest, which then confirms as `410 sandbox_action_expired`.

`item_excluded` v2 carries `source`, and its upcaster fills `source: "parent_room"` for every v1 event, so every parent event written before `source` existed is read with the same meaning on every fold and rebuild (REQ-6356). For a task generated in the sandbox, v2 carries `templateId`, `templateVersion` and `paramsHash` in place of `itemId`, and the exclusion also applies to her attempts on that template version and parameter hash.

The projection `disabled_content` folds `content_disabled` and `content_restored` from her log, so a template or puzzle disabled or restored from the sandbox stays as the parent left it after a restart and after a full recompute (REQ-6354). The task generator's fallback list and the Director's reject predicate skip every template it lists, and SPC-0280 serves no puzzle it lists. The Parent Room's first screen shows «Отключено: N» (Disabled: N) whenever `disabled_content` lists anything, linking to the list with a restore button on each item. After a confirmed disable leaves a node with no enabled template, the generator treats the node as having no task, and the Parent Room lists the node once as `node_all_disabled`.

### The command-line sandbox

The Mac offers `./meowtower sandbox item`, `./meowtower sandbox batch --count N` and `./meowtower sandbox adventure --from-snapshot`, each printing its result as JSON to standard output (REQ-6360). Each command calls its route under `/sandbox/` on the loopback listener, which `compose.yaml` publishes on `127.0.0.1` only, so the command-line sandbox answers only requests made on the Mac itself and asks no PIN (REQ-6362). The loopback listener mounts no route that prepares or confirms an action, so the command line can't apply a confirmed action (REQ-6364).

Each run works on its own temporary file `sandbox-cli-<ULID>.sqlite` in the volume, deleted when the command ends and swept at server start, so a run never shares the parent's sandbox state. `item` runs one task item and `batch` a batch of 10 to 50 task items, both from an empty profile. `adventure --from-snapshot` copies `sandbox-snapshot.sqlite` into its temporary file and plays an adventure as the player. Its model calls spend from the sandbox bucket and settle in `sandbox-spend.sqlite`, as the Parent Room's do.

The commands print their output and write it to no file; a copy in a file exists only where the caller redirected it (REQ-6366). Every output carries a top-level `sandboxRun`: `snap-<ULID>` for a run on a snapshot and `empty-<ULID>` otherwise (REQ-6372). The repository's scan for personal data in group 1 fails when a tracked file matches `snap-[0-9A-HJKMNP-TV-Z]{26}` or holds a value from `personal/player.md`, and passes on a file holding only an `empty-` identifier (REQ-6368).

### Ceilings

- `sandbox.sqlite` over 2 GB: the sandbox header shows the marker `sandbox_large` until a reset brings the file under 2 GB, and the marker shows nowhere else.
- Temporary files: a `sandbox-cli-*` file is deleted when its command ends, and the snapshot builder's temporary copy and the reset's file under a temporary name are deleted when the snapshot or the reset ends; the server sweeps all three kinds at start.
- `sandbox-spend.sqlite`: a nightly job deletes rows older than 13 months, keeping the current month and the same month a year earlier (REQ-6374).
- The sandbox's `llm_log` bodies: SPC-0100's nightly deletion after 90 days runs on `sandbox.sqlite` as on her file (REQ-6328).
- Tokens: 20 a parent session and 5 minutes each (REQ-6350).

## Failure paths

| Condition | What happens |
| --- | --- |
| Sandbox code appends an event through the player's handle with `profile: 'sandbox'` | `appendEvents` throws `SandboxEventRefused` before the `INSERT`; the request fails with `500 sandbox_event_refused`; the owner gets one Parent Room notice a day naming the route and event type; the parent sees an ordinary sandbox server error. |
| A `sandbox` event reaches her file over any connection, or a `main` event reaches a sandbox file | `events_profile_guard` aborts the insert with `event profile does not match database`, and the transaction rolls back; the request fails with `500 sandbox_event_refused`, and the owner gets the same daily notice as in the row above. |
| The parent starts or resumes an adventure under `/api/parent/sandbox/play/*` while the player holds the lease | The player's lease, heartbeat timer, event stream and answer queue stay as they were; no `lease_moved` reaches her device. |
| A file has no `db_role` row | `events_profile_guard` refuses every insert into it. |
| Sandbox code builds `{ mainDb, profile: 'main' }` and appends | The event carries the device identifier `sandbox`; the next nightly run reports `sandbox_leak_found` once to the owner with its type and sequence number. |
| `events_profile_guard` or a `db_role` trigger is missing at start-up | The server exits with `log_guard_missing` naming the trigger. |
| A migration drops or replaces a guarded trigger | The migration runner refuses it before it applies. |
| A file's stored role differs from the role its opener asked for | The opener refuses with `database_role_mismatch`; at start-up the server exits. |
| A write is attempted on the read-only handle | The handle throws, and her file is unchanged. |
| Free space is below 3 x (her live file plus its `-wal` file), or `VACUUM INTO` or the copy fails | `sandbox_snapshot_failed`: the old snapshot and sandbox stay, and the sandbox shows «Снимок не получился, песочница осталась прежней» (The snapshot didn't work, the sandbox stayed as it was). |
| A sandbox request arrives during a reset | `409 sandbox_resetting`; the client waits and retries once the reset ends. |
| A sandbox request comes without a parent session, after 30 idle minutes, or from another device than the session's | `401 parent_session_expired`; the client shows the PIN screen. |
| A confirm arrives with an unknown or expired token, or with one a 21st prepare dropped | `410 sandbox_action_expired`; the sandbox shows «Подтверждение устарело, выберите действие ещё раз» (The confirmation has lapsed, choose the action again). |
| A confirm arrives twice with one token | The second returns the original event with 200; the log holds one event. |
| The confirmed action's append to her file fails | `503 log_write_failed`; the token stays unused, and the parent retries with it. |
| The append to her file succeeds and the `sandbox_action_applied` append fails | The confirm answers `503 log_write_failed`; the main event stands and the token is used. The client retries with the same token, and the retry finds the main event by its `idem_key`, writes the pointer and returns the main event with 200. |
| The server restarts between the append to her file and the `sandbox_action_applied` append | A retry with the token gets `410 sandbox_action_expired`; at start-up the server writes the missing pointer for that event. |
| Sandbox code starts a timer, an interval, `setImmediate` or a job, or imports the sandbox flag's storage module | The group 1 lint fails and names the file. |
| A confirm arrives while a reset runs | `409 sandbox_resetting`; nothing is appended to either file, the token stays unused, and the client retries once the reset ends. |
| A prepare or confirm request reaches the loopback listener | `404`. |
| A confirmed disable leaves a node with no enabled template | The echo warned before the press; the generator treats the node as having no task, and the Parent Room lists the node once as `node_all_disabled`. |
| `sandbox.sqlite` passes 2 GB | The sandbox header shows the marker `sandbox_large` until a reset brings the file under 2 GB; no other screen and no notice shows it. |
| `./meowtower sandbox batch --count N` with N outside 10 to 50 | The command prints `sandbox_batch_size` as JSON and exits 2; it clamps nothing. |
| `./meowtower sandbox adventure --from-snapshot` with no snapshot | The command prints `sandbox_snapshot_missing` as JSON, exits 2 and takes no snapshot. |
| A tracked file holds a `snap-` identifier or a value from `personal/player.md` | The group 1 scan fails and names the file. |
| The sandbox bucket is spent, the offline key answers 402, or the gateway or the PIN is missing | SPC-0100's `sandbox_budget_spent` and `offline_key_refused`, and SPC-0190's `409 sandbox_models_unavailable`. |
| A snapshot of a 1 GB file takes more than 180 seconds | The full verify on the family Mac records a baseline finding against SPC-0190's Baselines table in the verify report and passes. |

## Open review findings

- The first agent review asked for the reason beside the 5-minute token expiry, the 20-token cap, the 3 x free-space factor, the 2 GB `sandbox_large` threshold and the rule that no player screen links to the sandbox. Rejected: the method's rule S8 keeps reasons in the decision, and ADR-0340 holds each of them.
- The second agent review, first round, asked for the reasons behind the 5-minute token expiry and the 20-token cap, saying ADR-0340 gives none. Rejected: ADR-0340's section on confirmed actions gives both reasons beside the numbers, and rule S8 keeps them there.
- The same round asked this document to state which routes the loopback listener serves before the PIN guards the sandbox. Rejected: SPC-0190 states that interim, and this document cites it in its scope.
