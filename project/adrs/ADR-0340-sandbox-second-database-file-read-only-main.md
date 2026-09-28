---
id: ADR-0340
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-6300, REQ-6302, REQ-6304, REQ-6306, REQ-6308, REQ-6310, REQ-6312, REQ-6314, REQ-6316, REQ-6318, REQ-6320, REQ-6322, REQ-6324, REQ-6326, REQ-6328, REQ-6330, REQ-6336, REQ-6340, REQ-6342, REQ-6344, REQ-6346, REQ-6348, REQ-6350, REQ-6352, REQ-6354, REQ-6356, REQ-6358, REQ-6360, REQ-6362, REQ-6364, REQ-6366, REQ-6368, REQ-6370, REQ-6372, REQ-6374, REQ-6376, REQ-6378]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0340. The parent's sandbox runs the unchanged engine on a second SQLite file in the database volume, reads the player's file only read-only, marks its events in the envelope where a guarded trigger refuses them, and changes her game only through confirmed actions, each logged once as its own event from the sandbox

## Decision

The parent's sandbox is a second game that the same server process runs on a database file of its own, with the engine unchanged, because `appendEvents` and `applyProjections` already take the database handle as an argument (RES-4130). It builds on ADR-0210, which keeps the game day, puts the sandbox's model spend on the offline key under a $20 monthly bucket, serves the sandbox on the loopback listener until the PIN guards it, owns the MVP scope and the stage order, and assigns each new event type its owning decision. ADR-0210 assigns `content_disabled`, `content_restored` and `sandbox_action_applied` to this record, which defines their payloads, and this record also owns the envelope field `profile`.

### Files

The volume `meowtower-db` holds three sandbox files beside `/var/lib/meowtower/meowtower.sqlite` (REQ-6300, REQ-6302), and none of them sits on the `data/` bind mount, because ADR-0010's reason against a written WAL file on that mount covers them:

| File | What it holds | Who writes it |
| --- | --- | --- |
| `sandbox.sqlite` | the sandbox's game: its events, projections, `llm_log` and service tables | the sandbox's engine |
| `sandbox-snapshot.sqlite` | the last sandbox snapshot of the player's state, already scrubbed | the snapshot builder only |
| `sandbox-spend.sqlite` | one row per settled sandbox model call, from the Parent Room or the command line | the gateway only |

Each sandbox file is opened by `openDatabase(path, { role: "sandbox" })`, so it gets the same migrations, append-only triggers and projections as the main file (REQ-6304). The command-line sandbox works on a temporary file `sandbox-cli-<ULID>.sqlite` in the same volume, deleted when the command ends and swept at server start, so the agent never shares the parent's sandbox state.

### The read-only connection

The sandbox reads the player's file only through `openReadOnly(path)`, which calls `new Database(path, { readonly: true, fileMustExist: true })` and runs no migration, no `journal_mode` pragma and no projection rebuild (REQ-6306, REQ-6308). `src/server/snapshots.ts` already opens the live file this way. The sandbox module is constructed in `main.ts` with the read-only handle and its own handles, never the server's read-write handle. A static check in ADR-0190's group 1 fails when any module other than `main.ts` and the Parent Room's confirmed-action module imports the main handle or calls `openDatabase` on the main path. The play handlers and the engine modules therefore reach a database only through the context they are given, because the sandbox mounts those same handlers and one that still reached a module-level main handle would write sandbox play into her file with `profile = 'main'`.

### The mark and the refusal

The event envelope of ADR-0020 gains `profile TEXT NOT NULL DEFAULT 'main' CHECK (profile IN ('main', 'sandbox'))`, added by `ALTER TABLE events ADD COLUMN`, which rewrites no stored row and fires no `UPDATE` trigger. Every event the sandbox writes carries `profile = 'sandbox'` (REQ-6310). The profile comes from the engine context the caller builds, `{ db, profile }`, and never from the handle, because a profile read from the handle would stamp a sandbox event `main` exactly when a bug hands sandbox code the main handle. The middleware that `main.ts` mounts on the sandbox's route trees sets a flag in Node's `AsyncLocalStorage`, and `appendEvents` writes the device identifier `sandbox`, beside ADR-0020's `server`, on every event appended while that flag is set, whatever context the caller built. Sandbox code can't clear the flag, because the router sets it outside the sandbox module. A nightly job on the main file counts events with that identifier and reports any it finds once to the owner as `sandbox_leak_found`. The confirmed actions carry the parent's device, so the count is zero while isolation holds, and it catches the one bug the profile can't: sandbox code that builds `{ mainDb, profile: 'main' }`.

A one-row table `db_role (id INTEGER PRIMARY KEY CHECK (id = 1), role TEXT NOT NULL CHECK (role IN ('main', 'sandbox')))` names what each file is. The migration creates it empty, with triggers that refuse an `UPDATE` or `DELETE` on it. `openDatabase(path, { role })` inserts the role on the first open and exits with `database_role_mismatch` when the stored role differs; `main.ts` passes `main`. The migration adds one trigger on `events`:

```sql
CREATE TRIGGER events_profile_guard BEFORE INSERT ON events
WHEN NEW.profile IS NOT (SELECT role FROM db_role WHERE id = 1)
BEGIN SELECT RAISE(ABORT, 'event profile does not match database'); END;
```

The same migration therefore makes the main file refuse sandbox events and a sandbox file refuse main events, and a file with no role row refuses every insert, so the guard fails closed (REQ-6312). `GUARDED_TRIGGERS` gains `events_profile_guard` and the two `db_role` triggers, and `checkGuard` matches each trigger against its own expected message, so the server exits with `log_guard_missing` when any of them is absent (REQ-6314) and the migration runner refuses a migration that drops or replaces one (REQ-6316). `appendEvents(ctx, events)` compares each event's profile with the role cached on the handle at open and throws `SandboxEventRefused` before the `INSERT`, so the trigger is the second line (REQ-6318).

### Snapshot and reset

A sandbox snapshot runs in a worker thread on the read-only connection. It first checks with `fs.statfs` that the volume has free space of at least 3 x (the live file plus its `-wal` file). Two of those multiples are the `VACUUM INTO` copy and the rebuilt file, which exist at once before the rename, and the third covers the WAL growing while she plays and the reset's copy of the snapshot. The builder then runs `VACUUM INTO` a temporary file, which is one statement and so one read transaction that sees one point in time while she plays (REQ-6320). The builder creates a fresh file with role `sandbox`, attaches the temporary copy and copies `events` with `profile` set to `'sandbox'`, and `blobs`, `explain_cache` and `frames` as they are. It leaves `parent_pin`, `lockouts`, `devices`, `llm_log`, `art_jobs` and `bakeoff` empty (REQ-6322), rebuilds the projections, renames the result over `sandbox-snapshot.sqlite` and deletes the temporary copy. A group 1 check fails when a table in the schema is on neither the copy list nor the empty list, so a table a later migration adds is empty in the snapshot until someone lists it. While a snapshot runs, the sandbox shows «Снимаю снимок…» (Taking the snapshot) with the stage it has reached, copy, scrub or rebuild, because at 180 seconds for a 1 GB file the parent otherwise can't tell a slow snapshot from a stuck one.

A reset closes the sandbox handle, answers any sandbox request in flight with `409 sandbox_resetting`, builds the new file under a temporary name and renames it over `sandbox.sqlite`. The reset offers «Пустой профиль» (empty profile) and «Копия игрока» (copy of the player) (REQ-6326). The copy starts from `sandbox-snapshot.sqlite` and, when that file doesn't exist yet, takes a snapshot first (REQ-6378). A separate button, «Снять снимок заново» (take the snapshot again), replaces the snapshot. A reset writes only the sandbox files, so the player's file is unchanged (REQ-6324).

### Model calls and money

A sandbox model call goes through ADR-0100's gateway marked as a sandbox call, as ADR-0210 names the mark, and with the sandbox's handle. The gateway uses the role's own privacy tier, egress guard and schemas, exactly as in play (REQ-6330), spends from the offline key under ADR-0210's sandbox bucket of $20 a month, and writes its `llm_log` row and its `llm_call` event to the handle it was given, so they land in the sandbox's file (REQ-6328). The gateway reserves each call against that bucket by reading the month's sum from `sandbox-spend.sqlite` plus the reservations in flight, and settles each call there. A reset never touches that file, so the month's count survives every reset (REQ-6374). The play key's monthly count reads only the main file's `llm_log`, so no sandbox call enters it (REQ-6336). The Parent Room's cost line shows «Песочница» (Sandbox) on a line of its own with the month's spend against the $20, the command line's calls included (REQ-6340).

The riddle parser run in the sandbox spends from the sandbox bucket as well, never from the play key's $0.1 parse bucket, because that bucket is part of the play key's $58.90 month (ADR-0210).

Until the gateway and the PIN both exist, the sandbox's model routes answer ADR-0210's `409 sandbox_models_unavailable`, and on 2026-09-28 the gateway doesn't exist yet.

### Entry, session and screens

Until the PIN guards the sandbox, ADR-0210 serves it only on the loopback listener, and there it offers no confirmed action, because REQ-6364 keeps them off that listener. The PIN already exists on 2026-09-28 in `src/server/parent-access.ts`, so this interim lasts only until the Parent Room's sandbox tab is built. Every sandbox route on the network listener sits under `/api/parent/sandbox/`, so ADR-0030's parent session guards it: a session opened with the PIN on a paired device, and the same device on every request (REQ-6342). The play-shaped routes the sandbox needs, such as an adventure played as the player, are mounted as `/api/parent/sandbox/play/*` on the play handlers with the sandbox's engine context, so each request is a parent request and renews the 30-minute idle expiry (REQ-6344). Parent sessions stay in memory, as `ParentSessions` keeps them today, so no sandbox request writes the player's file (REQ-6376). No player screen links to the sandbox.

The client renders every sandbox screen under the root attribute `data-mode="sandbox"`, which draws ADR-0150's striped frame and the label «Песочница — не влияет на игру» (Sandbox: does not affect the game) from the Russian string file of ADR-0160 (REQ-6346). The adult calibration of ADR-0180 stays a Parent Room mode, and the sandbox has no calibration route (REQ-6358).

The sandbox's features are the addendum's: any task viewed as on the iPad or the computer, the engine panel, batches of 10 to 50 tasks, puzzles and widgets including unapproved ones, «Сплети загадку» (Weave a riddle) with the parser, scenes and the Master on the copy of the Master's memory, an adventure as the player, and a state override that writes the ordinary event types into the sandbox's log. Each runs on the sandbox's handle, so none needs a rule of its own here.

### Confirmed actions

The sandbox changes the player's game only through the confirmed actions (REQ-6348): marking a task ambiguous, disabling a template or a puzzle, restoring one, and approving a puzzle or a variant. The Parent Room's module serves them, never the sandbox module, because only that module holds the main handle:

1. `POST /api/parent/sandbox-actions/prepare` takes the action and its target and returns a single-use token and an echo of what the server inferred, such as «Шаблон "сдача с покупки" v3 перестанет выпадать игроку» (The template "change from a purchase" v3 will stop appearing for the player). It writes nothing.
2. `POST /api/parent/sandbox-actions/confirm` with the token appends exactly one event to the main file, of the action's own type as ADR-0210 lists them, with `source: "sandbox"` in its payload, `profile = 'main'` and `idem_key = 'sandbox-action:<token>'`, so a repeated press or a retried request returns the same event and adds none (REQ-6350, REQ-6352). The module then appends `sandbox_action_applied` to the sandbox's file, pointing to that event.

Tokens live in memory, expire after 5 minutes and die with the parent session. I chose 5 minutes, because it is long enough to read the echo and short enough that a token left on a screen the parent walked away from lapses. A session holds at most 20 tokens, and a 21st prepare drops the oldest, which then confirms as `sandbox_action_expired`. I chose 20 as a guard against a client loop that prepares without end, since a parent preparing by hand rarely holds more than one or two open. A token is used only once its append commits, so a confirm after `log_write_failed` can retry with the same token. A confirm with a used token returns the original event with 200, and only an unknown or expired token gets `410 sandbox_action_expired`. Neither route is mounted on the loopback listener (REQ-6364). The Parent Room's first screen shows «Отключено: N» (Disabled: N) whenever `disabled_content` lists anything, linking to the list with a restore button on each item, because a list the parent has to go looking for is a list nobody opens.

Each action maps to one main-log type:

| Action | Main-log event | Owner of its payload |
| --- | --- | --- |
| mark a task ambiguous | `item_excluded` v2, with `templateId`, `templateVersion` and `paramsHash` in place of an `itemId` when the task was generated in the sandbox | ADR-0180, amended below |
| disable a template or a puzzle | `content_disabled` | this record |
| restore one | `content_restored` | this record |
| approve a puzzle, or one of its statement variants | `puzzle_approved` for the hash of the variant approved | RES-4070's decision |

I read the addendum's «одобрить узелок/вариант» (approve a puzzle or a variant) as a puzzle and its statement variants, because ADR-0210 lists `puzzle_approved` as the only approval a sandbox action writes, and a puzzle's variants are what its review queue holds.

`content_disabled` and `content_restored`, version 1, carry `kind` (`template` or `puzzle`), `id`, `source` (`parent_room` or `sandbox`) and `echo`, the confirmation text the parent saw. `sandbox_action_applied`, version 1, is written only to a sandbox file and carries `mainEventId`, `mainEventType` and `echo`, so the parent's sandbox history shows what crossed without a second record of the fact in the player's log.

`item_excluded` gains `source` in a version 2 whose upcaster fills `source: "parent_room"` for every version 1 event, so every parent event written before is read with the same meaning (REQ-6356). A projection `disabled_content`, which this record owns, folds `content_disabled` and `content_restored`, so a disabled template or puzzle stays as the parent left it after a restart and after a full recompute (REQ-6354).

If the main append succeeds and the sandbox append fails, the main event stands and the pointer is missing; a retry with the same token finds the main event by its `idem_key` and writes the pointer then.

### The command-line sandbox

`./meowtower sandbox item`, `./meowtower sandbox batch --count N` and `./meowtower sandbox adventure --from-snapshot` call routes under `/sandbox/` on the loopback listener, which `compose.yaml` publishes on `127.0.0.1` only, and print JSON to standard output (REQ-6360, REQ-6362). The script writes no file (REQ-6366). `item` and `batch` start from an empty profile, because a task or a batch needs no history and a profile built from her data would put it in the agent's output for no gain. `batch` refuses a count outside 10 to 50 with `sandbox_batch_size` and exit status 2, and clamps nothing, because a silently shortened batch reads as a complete one. `adventure --from-snapshot` copies `sandbox-snapshot.sqlite` into its temporary file, and when no snapshot exists it exits with `sandbox_snapshot_missing` and takes none, because a snapshot copies her data and the parent, not the agent, decides when one is taken. Every output carries a top-level `sandboxRun`: `snap-<ULID>` for a run on a snapshot and `empty-<ULID>` otherwise (REQ-6372). ADR-0190's group 1 scan fails when a tracked file matches `snap-[0-9A-HJKMNP-TV-Z]{26}` or holds a value from `personal/player.md` (REQ-6368).

### What works once this is accepted, and what doesn't yet

Once this is accepted and built, the parent opens the sandbox from the Parent Room with the PIN, plays any task, batch or adventure from an empty profile or a copy of the player, and her file stays byte for byte as it was apart from the confirmed actions. The command line runs the same engine for the agent. What doesn't work yet: live model calls wait for ADR-0100's gateway, the puzzles and the parser wait for their own decisions, and approving a puzzle needs `puzzle_approved` to exist with its `source` field. The parent's notes no longer reach her file from the sandbox; where they are written instead is ADR-0180's. Removing this increment removes three files, one migration and one route tree; the `profile` column and its trigger stay harmless with every event marked `main`.

## Why

Isolating storage is the only way to keep the `events` hash of acceptance test 18 unchanged, and a second file is the only storage option that meets every clause of the addendum's section 13 with code that exists (RES-4130). The engine takes its handle as an argument, the snapshot worker already opens the live file read-only, and `VACUUM INTO` already takes consistent copies (RES-4130, reading `append.ts`, `registry.ts` and `snapshots.ts` on 2026-09-28).

The read-only opener exists because `openDatabase` migrates, sets WAL and rebuilds projections, and each of those writes (RES-4130). The live file is in WAL mode while the server runs, so its `-wal` and `-shm` files exist and a read-only connection works, as SQLite's WAL page says.

I chose an envelope column for the mark over a reserved `device_id` or a payload field read with `json_extract`. A reserved device identifier overloads a field ADR-0020 already uses for `server`, and a payload field puts the guard on JSON that every type shapes differently. A column is one `CHECK` and one comparison in the trigger. The `db_role` table exists because both files run the same migrations: a trigger hard-coded to refuse `sandbox` would also refuse the sandbox's own events in its own file.

Snapshots are rebuilt rather than taken as a whole `VACUUM INTO` copy, because that copy holds the PIN hash, the lockouts and the device tokens (RES-4130), and because its events would carry `profile = 'main'` into a file whose trigger refuses them.

The money rules follow RES-4130's finding that a sandbox budget inside the $60 limit lets the sandbox end the player's live story for the rest of a month, and the owner's decision of 2026-09-28 that moved the sandbox to the offline key. The spend ledger is a third file, because REQ-6374 needs the count where a reset doesn't reach and REQ-6370 keeps it out of her file.

The confirmed actions write their own event types with `source: "sandbox"`, as ADR-0210 decides, so each fact has one record in her log and the projections that already fold `item_excluded` and `puzzle_approved` need no second input. Acceptance test 18's second run can still count them, because every one carries `source: "sandbox"` and the `sandbox-action:` idempotency key. Serving them from the Parent Room's module keeps the main handle out of the sandbox module entirely.

The strongest objection is that isolation in one process still rests on code discipline. The server holds the main read-write handle in the same address space, and a bug that builds an engine context `{ mainDb, profile: 'main' }` inside sandbox code writes sandbox play into her log with a correct mark, which neither the trigger nor `appendEvents` can catch; the nightly `sandbox_leak_found` count finds it only after the events are in her log. A separate sandbox container with no write access to the volume's main file removes that whole class. I accept the objection's risk for now: the import check makes that bug hard to write, the nightly count shows it within a day, acceptance test 18 hashes her whole file after each scenario, and the reversal condition below moves the sandbox out of process the first time a sandbox event reaches her log by any path.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing beyond ADR-0180's test mode: `data/test-profile.sqlite`, notes and ambiguous marks only, no panel, batches, parser or command line | Already approved, least to build, the narrowest crossing into her log | The parent can't check puzzles, widgets, the parser or a batch before she meets them; the file sits on the bind mount ADR-0010 moved the database off; live Master scenes would still spend inside the play key's month (RES-4130) |
| One file with a profile column: sandbox events in her `events` table, filtered in every projection | One database and one backup, and play as the player needs no copy | One missed filter moves her estimates, and the `events` hash changes with every sandbox run, so acceptance test 18 can't pass |
| A second file in the same process, the main file read-only (chosen) | The engine runs unchanged; the snapshot worker exists; one gateway and one budget count | Isolation from the main handle rests on the import check and review, as the strongest objection says |
| A second file served by a separate sandbox container with no write access to the main file | The operating system enforces isolation whatever the sandbox's code does | A second server to build, start and keep in step; a gateway budget shared across processes; snapshots handed over as files; about twice the start-up and deployment work of ADR-0010 for a feature one person uses |

## What it costs

The building agent writes the read-only opener, the `db_role` table and its triggers, the `profile` column and its guard, the change to `checkGuard`, the snapshot builder with its table lists, the reset, the `/api/parent/sandbox/*` tree mirroring the play routes, the confirmed-action module, `item_excluded` v2 and its upcaster, the `disabled_content` projection, the spend ledger, the gateway's handle argument, three loopback routes and their script commands, and two static checks. The play routes must accept an engine context, which is a refactor of every play handler.

At its peak, during a snapshot, the volume holds the live file plus four sandbox-side copies of about its size: `sandbox.sqlite`, the old `sandbox-snapshot.sqlite`, the `VACUUM INTO` copy and the rebuilt file. With ADR-0020's estimate of 400 MB of log a year, that is about 2 GB at the end of the first year, on the Docker virtual machine's disk on the family Mac, which Docker Desktop provisions and the owner sizes.

The offline key carries the sandbox's $20 beside its runs, and the owner raises and lowers its limit around each run, as ADR-0210 decides and costs.

The parent pays nothing in real time. The sandbox never notifies on its own. The parent sees exactly two kinds of message from this record, each once per condition, beside ADR-0210's `sandbox_budget_spent`: `sandbox_large` once when the sandbox file passes its ceiling, and `node_all_disabled` once per node. If nobody opens the sandbox for two weeks or a month, nothing queues and nothing is lost: the sandbox file sits still, the ledger holds the month's rows, and a disabled template stays disabled because the parent chose that. The Parent Room lists disabled items with a restore button, which is a list and not an alert.

Ceilings, each reported once when exceeded:

- `sandbox.sqlite` over 2 GB, about five years of the player's log: `sandbox_large` in the sandbox header, drained by a reset. I chose 2 GB, because only a snapshot of her whole history or a runaway batch loop gets there.
- Temporary files: `sandbox-cli-*` and snapshot copies are deleted when their command ends and swept at server start, so they never accumulate.
- `sandbox-spend.sqlite`: rows older than 13 months are deleted nightly, which keeps the current month and the same month a year earlier for the cost line.
- The sandbox's `llm_log` bodies: ADR-0100's nightly deletion after 90 days runs on `sandbox.sqlite` as on the main file.
- Tokens: 20 a session and 5 minutes each.

The security boundary protects the player's file and the parent's credentials. By the likelihood of damage, it defends against:

1. a sandbox code path writing to her file: the read-only opener, the import check, `appendEvents` and `events_profile_guard`, in that order;
2. the agent committing output of a snapshot run: the `snap-` mark and the personal-values scan;
3. a second copy of the parent's credentials: the snapshot's empty list;
4. a player's device reaching the sandbox: the PIN session on every `/api/parent/sandbox/*` route, and the loopback listener for the command line;
5. sandbox spend ending her month: the offline key and a play count that reads only her file.

Root inside the Docker virtual machine can still write any file in the volume; this record doesn't defend against that, as ADR-0020 doesn't.

Failure states, each with its next step and one audience:

| State | When | What happens next | Audience |
| --- | --- | --- | --- |
| `sandbox_event_refused` | `appendEvents` or `events_profile_guard` refuses an event whose profile doesn't match the file | the request fails with 500, and the owner gets one Parent Room notice a day naming the route and event type, because each refusal is the bug class the first reversal condition watches, caught before it reached her file; the parent sees it as any sandbox server error, deliberately, because her file is intact and the parent can do nothing about it | owner |
| `log_guard_missing` | `events_profile_guard` or a `db_role` trigger is missing at start-up | the server exits naming the trigger (ADR-0020's state) | developer |
| `sandbox_leak_found` | the nightly count finds a main-file event with the device identifier `sandbox` | reported once to the owner with the event types and sequence numbers; the first reversal condition below applies | owner |
| `database_role_mismatch` | a file's stored role differs from the role its opener asked for | the opener refuses; at start-up the server exits | developer |
| `sandbox_snapshot_failed` | free space is short, or `VACUUM INTO` or the copy fails | the old snapshot and sandbox stay; the sandbox says «Снимок не получился, песочница осталась прежней» (The snapshot didn't work, the sandbox stayed as it was) | parent |
| `sandbox_resetting` | a sandbox request arrives during a reset | `409`; the client waits and retries once the reset ends | parent |
| `sandbox_action_expired` | a confirm arrives with an unknown or expired token | `410`; the sandbox says «Подтверждение устарело, выберите действие ещё раз» (The confirmation has lapsed, choose the action again) | parent |
| `node_all_disabled` | a confirmed disable leaves a node with no enabled template | the prepare echo warns before the press; after it, the generator treats the node as having no task and the Parent Room lists the node once | parent |
| `sandbox_batch_size`, `sandbox_snapshot_missing` | the command line's input is out of range, or no snapshot exists | the command prints the state as JSON and exits 2 | building agent |
| `log_write_failed` | the confirmed action's append fails | ADR-0020's state: 503, and the parent retries with the same token | parent |

ADR-0210 names the money states the sandbox reaches, `sandbox_budget_spent`, `offline_key_refused` and `sandbox_models_unavailable`, with their audiences, and this record reuses those names.

## What would reverse it

- If any event from the sandbox reaches the player's file by any path, found by acceptance test 18 or by the nightly `sandbox_leak_found` count of events with the device identifier `sandbox`, then same-process isolation has failed in practice and the sandbox moves to a separate container with no write access to the main file.
- If a snapshot of a 1 GB file takes more than 180 seconds on the family Mac, three times ADR-0010's 60-second snapshot baseline, then rebuilding is too slow and the snapshot copies only a window of her log, which reopens what "a copy of the player" means.
- If the group 1 scan ever finds output of a snapshot run in a tracked file, or in a commit it caught before push, then the mark isn't enough, and `adventure --from-snapshot` replaces her free text and the names she gave with placeholders in its output.
- If the sandbox's month count in `sandbox-spend.sqlite` differs from the offline key's reported usage outside runs by more than 5 % in a month, the 5 % ADR-0100 allows for the play key, then the ledger misses calls and the count moves to the gateway's own reservation log.

The premortem, written as though it had happened: in February the parent found that «сдача с покупки» (change from a purchase) hadn't appeared for the player since November. The parent had disabled it in the sandbox to test a neighbour, confirmed the echo without reading it, and never opened the list of disabled items, because nothing pointed there. The same month the Docker virtual machine's disk filled during a snapshot, her next answer failed with `log_write_failed`, and she met the waiting scene; the free-space check had used the live file's size before the WAL was counted. The first failure is why the Parent Room lists disabled items beside the report and `node_all_disabled` exists; the second is why the free-space check must count the `-wal` file too, which check 9 below tests.

## Consequences

- ADR-0020's envelope gains `profile`, its guarded triggers gain `events_profile_guard` and the two `db_role` triggers, and its catalogue gains `content_disabled`, `content_restored` and `sandbox_action_applied` with this record's payloads.
- ADR-0100's gateway writes to the handle it is given, and its month count reads only the main file.
- ADR-0070's reject predicate and ADR-0040's fallback list skip every template `disabled_content` lists, and ADR-0180's exclusion also matches `item_excluded` v2 by template version and parameter hash.
- RES-4070's decision serves a puzzle only when `disabled_content` doesn't list it, which it already requires (REQ-5752), and its `puzzle_approved` carries the `source` this record writes.
- ADR-0190's group 1 gains the import check, the table-list check and the `snap-` pattern, and its Baselines table gains the rows under Amends.
- The `meowtower` script gains `sandbox item`, `sandbox batch` and `sandbox adventure`.
- The string file gains the sandbox's label, buttons, echoes and failure lines.

## Amends

- ADR-0180: "The parent's test mode, «Проверка игры» (RES-3500), plays against a separate database file, `data/test-profile.sqlite` ... Only the parent's notes and ambiguous-task marks cross back" becomes "The parent's sandbox, «Песочница», runs as ADR-0340 decides, and only the confirmed actions cross back, each as one event of its own type with `source: "sandbox"`; the parent's notes no longer cross".
- ADR-0180: check 12 becomes "A sandbox scenario over a whole floor leaves every table of the player's file unchanged from after the PIN login, and a second run adds exactly one main-file event with `source: "sandbox"` per confirmed action".
- ADR-0180: `item_excluded` gains a version 2 with `source` (`parent_room` or `sandbox`) and, for a task generated in the sandbox, `templateId`, `templateVersion` and `paramsHash` in place of `itemId`; the upcaster fills `source: "parent_room"`, and the exclusion also applies to her attempts on that template version and parameter hash.
- ADR-0180: "This record owns ... the test mode" becomes "This record places the sandbox's entry in the Parent Room, and ADR-0340 owns the sandbox".
- ADR-0150: "A root attribute `data-mode="test"` draws the striped frame and the label «Проверка · не идёт в статистику игрока» on every screen of the parent's test mode (REQ-3520)" becomes "A root attribute `data-mode="sandbox"` draws the striped frame and the label «Песочница — не влияет на игру» on every sandbox screen (REQ-6346)".
- ADR-0020: the envelope list gains "`profile`, `main` or `sandbox`, which must match the file's `db_role`".
- ADR-0020: "Two triggers reject every change ... if either trigger is missing it refuses to start" becomes "the triggers `events_no_update`, `events_no_delete`, `events_profile_guard` and the two `db_role` triggers are guarded, each checked against its own message, and the server refuses to start without any of them".
- ADR-0020: "Seven tables stand outside that rule" gains "`db_role`, which names the file's role, and in a sandbox file the same service tables hold the sandbox's own rows".
- SPC-0020: the triggers table and the envelope section change as the two ADR-0020 lines above.
- ADR-0100: "Month of play ... counts every call on the play key" becomes "every call on the play key, read from the main file's `llm_log` only".
- ADR-0100: "Every call, the judge's included, writes a row to `llm_log` ... and appends an `llm_call` event that points to it" becomes "... writes a row to `llm_log` and appends an `llm_call` event in the database whose handle the caller passes, the main file for play and the sandbox's file for a sandbox call".
- ADR-0040: the fallback list gains "and skips every template that `disabled_content` lists".
- ADR-0190: group 1's static checks gain "the import check that keeps the main handle out of `src/server/sandbox/`, and the check that every table is on the snapshot's copy list or its empty list".
- ADR-0070: "The predicate refuses a template and parameter hash shown within the window" becomes "The predicate refuses a template and parameter hash shown within the window, and every template that `disabled_content` lists".
- ADR-0190: the Baselines table gains "Sandbox snapshot of a 1 GB file | at most 180 s | ADR-0340 | chosen | three times ADR-0010's snapshot, for the copy and the projection rebuild; the parent waits with a progress line" and "Sandbox file | 2 GB, then `sandbox_large` once | ADR-0340 | chosen | only a runaway loop gets there".
- ADR-0190: threat 1's scan gains "and fails on a tracked file matching `snap-[0-9A-HJKMNP-TV-Z]{26}`".

## How I will know it was realised

1. Acceptance test 18: after the PIN login, a script hashes every table of the player's file, plays a sandbox floor, a batch of 50, a puzzle and a scene with no confirmed action, and hashes again; the hashes match. A second run confirms each action once, ambiguous, disable and restore of a template, disable and restore of a puzzle, and approval of a puzzle variant, and finds exactly six new main-file events, each of its action's type with `source: "sandbox"` and `profile = 'main'`, and six `sandbox_action_applied` in the sandbox file pointing to them.
2. A test hands the main handle to the sandbox's engine context with `profile: 'sandbox'` and gets `SandboxEventRefused` with no row written; a raw `INSERT` of a `sandbox` event through a second connection gets `event profile does not match database`; the same insert of a `main` event into a sandbox file fails the same way.
3. A test drops `events_profile_guard` in a copy and starts the server, which exits with `log_guard_missing` naming it; a test migration that drops it is refused before it applies.
4. A test opens the live file with `openReadOnly` while a writer appends, and the file's size, `mtime` and hash of `schema_migrations` are unchanged afterwards; an attempted write on that handle throws.
5. A test takes a snapshot while a writer appends 1,000 events and finds a prefix of the log with every projection consistent with it; `parent_pin`, `lockouts` and `devices` in the snapshot hold no row, and every event in it has `profile = 'sandbox'`.
6. A test resets to each start, including the copy with no snapshot, and the player's file hash is unchanged; after the reset the month's sandbox spend on the cost line is the same as before it.
7. A test replays sandbox calls past the cap and play calls in the same month in `replay` mode: no `budget_month_spent` appears, the play count equals the main file's `llm_log` sum, and every sandbox call's `llm_log` row and `llm_call` event are in the sandbox file with the role's own tier.
8. A test with an expired parent session gets `401 parent_session_expired` on a sandbox route, a sandbox adventure of 40 minutes with a request every 5 minutes never expires, and no sandbox route answers on another paired device's cookie.
9. A test fills the volume until free space is below 3 x (the live file plus its `-wal` file) and asks for a snapshot, which fails as `sandbox_snapshot_failed` with the old files untouched.
10. A test posts confirm twice with one token and gets the same event with 200 both times and one event in the log; makes the first append fail and retries with the same token, which then succeeds; posts to the prepare and confirm routes on the loopback listener and gets 404.
11. A test disables a template, restarts the server and runs a full recompute, and the generator still never offers it; a restore brings it back.
12. Playwright finds `data-mode="sandbox"`, the frame and the label on every sandbox screen on the iPad and computer viewports.
13. `./meowtower sandbox batch --count 9` exits 2 with `sandbox_batch_size`; `adventure --from-snapshot` with no snapshot exits 2 with `sandbox_snapshot_missing`; every output has `sandboxRun`; no command leaves a file in the repository or the volume.
14. The group 1 scan fails on a fixture holding a `snap-` identifier and on one holding a value from `personal/player.md`, and passes on an `empty-` fixture.
15. A search of the routes finds no calibration route under `/api/parent/sandbox/`, and the import check fails on a planted import of the main handle in `src/server/sandbox/` and in a play handler.
16. A test builds a context `{ mainDb, profile: 'main' }` inside a sandbox route and appends an event; the event carries the device identifier `sandbox`, and the next nightly run reports exactly one `sandbox_leak_found`.
17. The full verify on the family Mac snapshots a synthetic 1 GB file and fails when the snapshot takes more than 180 seconds.
18. Playwright finds «Отключено: 1» on the Parent Room's first screen after one confirmed disable, and no such line after the restore.

## What this does not settle

- The sandbox's $20 bucket, the offline key's limit around runs, the loopback interim before the PIN, and the money failure states: ADR-0210.
- The stage at which the sandbox is built and what the MVP holds: ADR-0210 and ADR-0190.
- What the engine panel shows, how a batch is chosen, how puzzles, widgets and the parser behave, and what the Master's memory copy includes: the decisions that own those features. This record only runs them on the sandbox's file.
- Approving a rung framing or an explanation variant from the sandbox: ADR-0210 lists no such crossing, so those approvals stay in their Parent Room queues.
- The design of the sandbox's screens beyond the frame and the label: the specification step and ADR-0150.
- Whether the parent's notes, which no longer cross from the sandbox, should be written in the Parent Room instead: ADR-0180.
- Defending the volume against root inside the Docker virtual machine.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0370, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
