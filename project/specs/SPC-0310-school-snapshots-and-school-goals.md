---
id: SPC-0310
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-5058, REQ-5060, REQ-6000, REQ-6002, REQ-6004, REQ-6006, REQ-6008, REQ-6010, REQ-6012, REQ-6014, REQ-6016, REQ-6018, REQ-6020, REQ-6022, REQ-6024, REQ-6026, REQ-6028, REQ-6030, REQ-6032, REQ-6034, REQ-6036, REQ-6038, REQ-6040, REQ-6042, REQ-6044, REQ-6046, REQ-6048, REQ-6050, REQ-6052, REQ-6054, REQ-6056, REQ-6058, REQ-6060, REQ-6062, REQ-6066, REQ-6068, REQ-6070, REQ-6072, REQ-6074, REQ-6076, REQ-6078, REQ-6080, REQ-6082, REQ-6084, REQ-6086, REQ-6088, REQ-6090, REQ-6092]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# School snapshots and school goals: import, local parse, goal mapping, withdrawal and the two school screens

## Scope

This document covers the school part of the game, which comes after the MVP: the import of a school snapshot on the Mac, the kept file, the local parser and its reparses, the six `school_snapshot_*` event types, the corrections and the withdrawal, the projections `school_values` and `school_snapshot_changes`, the goal catalogue file and the mapping panel, the "home and school" screen, the timeline, the export for the school, the four static checks that fence the part off, and the synthetic fixtures its tests read. A school snapshot is a copy of the pupil overview from the school's learning system, which the parent receives from the school. A school goal is one goal of that overview, or one goal of the list the parent enters by hand.

It is written at the component level: routes, files, event payloads, projections, modules, commands and static checks inside the `meowtower` container. The two screens are described at the level of what each cell and series shows, and their layout belongs to SPC-0150.

It leaves out what other documents state. SPC-0020 states the event log, `appendEvents`, the blob store with its triggers and the export of the whole log. SPC-0290 states the goal list the parent enters, its event `school_goal_mapped`, the Cito result form, the home skill scale and the Director's school-goal term. SPC-0060 states the knowledge model and its node states, SPC-0070 the Director's value, SPC-0100 the model gateway and what leaves the Mac, SPC-0180 the Parent Room, the PIN, report v1 and its nine screens, SPC-0160 the string files, and SPC-0190 the verify command, its groups, the personal-data scan and the scope guard that keeps this part out of the tree until the MVP ends.

## Boundary

### Routes

Every route in this table needs the parent session of SPC-0180. Every route in this table mounts only on the loopback listener `http://localhost:8080` of SPC-0010, so the same path through `https://<mac-name>.local` answers 404.

| Route | Listener | What it does |
| --- | --- | --- |
| `POST /api/parent/school/import` | loopback | Takes the file as the request body, checks its type and size, writes it to `data/tmp/school-import/<importId>`, parses it and returns `SchoolImportPreview`. Writes no event and no kept file. |
| `GET /api/parent/school/import/:importId/file` | loopback | The temporary file, for the preview. |
| `POST /api/parent/school/import/:importId/confirm` | loopback | `SchoolImportConfirm`; keeps the file and appends the import and the first parse. |
| `DELETE /api/parent/school/import/:importId` | loopback | Cancels: deletes the temporary file and writes nothing. |
| `GET /api/parent/school/snapshots` | loopback | Every snapshot that isn't withdrawn, with its rows of `school_values` and its `disagrees` marks. |
| `GET /api/parent/school/snapshots/:sha256/file` | loopback | The kept file, for checking a value against the document. |
| `POST /api/parent/school/snapshots/:sha256/corrections` | loopback | `SchoolCorrectionIn`; appends `school_snapshot_corrected`. |
| `POST /api/parent/school/snapshots/:sha256/withdraw` | loopback | `{ reason, clientSeq }`; appends `school_snapshot_withdrawn`. |
| `GET /api/parent/school/goals` | loopback | The mapping panel: each snapshot goal and each entered goal with no confirmed link, marked with its source, its proposal and the count of vanished linked keys per subdomain. |
| `POST /api/parent/school/goals/:goalKey/link` | loopback | `{ source, nodes, proposedBy, clientSeq }`, with `source` `snapshot` or `entered`; appends `school_snapshot_goal_linked` for a snapshot goal and `school_goal_mapped` of SPC-0290, carrying the `goalKey`, for an entered goal. |
| `POST /api/parent/school/goals/:goalKey/unlink` | loopback | `{ clientSeq }`; appends `school_snapshot_goal_unlinked`. |
| `GET /api/parent/report/home-and-school` | loopback | The "home and school" screen's rows. |
| `GET /api/parent/report/timeline` | loopback | The timeline's three series. |
| `POST /api/parent/school/export` | loopback | Writes the export for the school and returns its directory, or `school_export_empty`. |
| `GET /api/parent/school/export/<dir>/school-data.csv` | loopback | The export's file. |

### Request and reply schemas

The schemas live in `src/shared/api.ts` beside the others, and every reply schema is `.strict()`.

| Schema | What it carries |
| --- | --- |
| `SchoolImportPreview` | `importId`, a ULID; `mediaType`; `bytes`; `pupilNameRead`, the name as read or `null`; `documentDateRead`, a date or `null`; `goalsRead`, a count; `outcome`, `read` or `failed`; `alreadyKept`, `null` or `{ importedOn, withdrawn }`. |
| `SchoolImportConfirm` | `source`, `teacher`, `access_request` or `other`; `sourceNote`, at most 200 characters, or `null`; `documentDate`, required when `documentDateRead` is `null`; `clientSeq`. |
| `SchoolCorrectionIn` | `goalKey` or `null`; `subdomain` or `null`, set for a field of one subdomain; `field`; `value`, typed by the field, or `null`; `parserVersionSeen`; `clientSeq`. A correction that adds a goal also carries `wording` and `subdomain`. |

### Events this part owns

Each type enters the event catalogue of SPC-0020 with its zod schema in `src/shared/events.ts` (REQ-6084). No event name, schema field, module path or string key names the vendor of the school's learning system (REQ-6086).

| Event, v1 | Payload |
| --- | --- |
| `school_snapshot_imported` | `sha256`; `mediaType`, one of `application/pdf`, `image/png`, `image/jpeg` or `image/webp`; `bytes`; `documentDate`; `documentDateSource`, `document` or `parent`; `uploadedOn`, the date of upload in the device's zone; `source`, `teacher`, `access_request` or `other`; `sourceNote` or `null`; `pupilNameRead`, a boolean |
| `school_snapshot_parsed` | `sha256`; `parserVersion`; `reason`, `import` or `reparse`; `outcome`, `read` or `failed`; `failureCause`, `timeout`, `tool_error` or `too_many_goals`, or `null`; `documentDateRead` or `null`; `goals`, at most 400, each with `goalKey`, `code`, `wording`, `subdomain`, `open`, `status`, `level`, `targetLevel`, `taskCount` and `dates`, every field but `goalKey` and `wording` nullable; `subdomains`, each with `name`, `shareMastered` and `level`, the last two nullable; `materialLevel` or `null`; `unreadPages`, a count |
| `school_snapshot_corrected` | `sha256`; `goalKey`, or `null` for a field of a subdomain or of the whole snapshot; `subdomain`, set for a field of one subdomain, or `null`; `field`; `value` or `null`; `parserVersionSeen` |
| `school_snapshot_withdrawn` | `sha256`; `reason`, `not_about_player`, `wrong_document` or `other` |
| `school_snapshot_goal_linked` | `goalKey`; `nodes`, one to five node identifiers of the graph in SPC-0050; `proposedBy`, `catalogue` or `parent`; `catalogueVersion` or `null` |
| `school_snapshot_goal_unlinked` | `goalKey` |

`status` takes `reached`, `developing`, `needs_help` or `null`. `level` and `targetLevel` take an integer from 0 to 5 or `null`.

### Files and tables

| Path or table | What it holds |
| --- | --- |
| `data/tmp/school-import/<importId>` | An upload waiting for the parent's confirmation; no store owns it. |
| `data/blobs/<sha256>.<ext>` | A kept snapshot file, with `<ext>` one of `pdf`, `png`, `jpg` or `webp`, written once and read-only. |
| Table `blobs` | One row per kept file, with its hash, size and `media_type`. |
| Projection `school_values` | One row per snapshot, scope and field, where the scope is a goal key, a subdomain name or the whole snapshot: the latest read parse's value, the latest correction's value, the value in force and the `disagrees` mark. |
| Projection `school_snapshot_changes` | Per pair of consecutive snapshots and per goal: the change of level, status and target, goals that appear or disappear, and the `target_moved` marks. |
| `content/school-goal-catalogue.json` | `version`, `source`, the approving record and `entries`, each from a goal code or goal key to one to five nodes. It ships with `source: null` and no entries. |
| `data/exports/school-<UTC timestamp>/school-data.csv` | One export for the school. |
| `tools/school-fixtures.ts` and `test/fixtures/school/` | The generator of synthetic overviews, and its output with a `manifest.json` of each file's hash. |

### Modules

| Module | What it is |
| --- | --- |
| `src/engine/school/parser/` | The parser: a function of the file's bytes and the parser version alone, which runs `pdftotext -layout`, `pdftoppm` and `tesseract` as child processes. |
| `src/engine/school/keys.ts` | The goal-key function, shared with SPC-0290's entered goals. |
| `src/engine/school/projections/` | The folds behind `school_values` and `school_snapshot_changes`. |
| `src/parent/school/` | The routes, the import sweep, the reparse worker, the mapping panel, the two screens' readers and `export.ts`. |

### Commands, notices and errors

| Name | Audience | Meaning |
| --- | --- | --- |
| `./meowtower export-school` | the parent | Writes the export for the school on the Mac and prints its directory. |
| `snapshot_type_refused` | the parent | The file's first bytes aren't PDF, PNG, JPEG or WebP. |
| `snapshot_too_large` | the parent | The file is over 25 MB, or a PDF is over 20 pages. |
| `snapshot_unreadable` | the parent | The parse timed out, failed, or found more than 400 goals. |
| `snapshot_already_kept` | the parent | The file's hash already has an import event. |
| `snapshot_blob_mismatch` | the parent | At confirmation, a file already under the upload's hash in `data/blobs/` has another hash; the reply is `409`. |
| `snapshot_import_expired` | the parent | The confirmation names an `importId` whose temporary file the sweep deleted. |
| `snapshot_reparse_disagrees` | the parent | A reparse gives a value other than a correction's. |
| `snapshot_reparse_failed` | the owner | A reparse failed on a kept file; shown in `./meowtower status`. |
| `school_files_large` | the parent | Kept snapshot files pass 1 GB together. |
| `school_export_empty` | the parent | Nothing to export for the school. |
| `school_events_in_model`, `school_data_to_gateway`, `school_snapshot_in_director`, `school_export_scope` | the building agent | A static check in group 1 failed, naming the file and the import chain. |

### What this part requires from other parts

- SPC-0010 supplies the loopback listener, the `data/` directory, `./meowtower status` and the `meowtower` image, which installs poppler-utils, tesseract-ocr, tesseract-ocr-nld and tesseract-ocr-eng.
- SPC-0020 supplies `appendEvents`, the blob store with its exclusive create, read-only mode, triggers and the verify check `blob_changed`, the projection registry and the full recompute.
- SPC-0050 supplies the node identifiers, SPC-0060 the node states and their labels, and SPC-0290 the Cito results' projection, the home skill scale and the goals the parent enters.
- SPC-0180 supplies the parent session, the Parent Room's tabs, the report's frame and the Parent Room's notices; SPC-0160 supplies the Russian string file, where every string of this part lives under `parent.school.*`.
- SPC-0190 runs the four static checks, the property test and the personal-data scan in group 1, and holds this part's ceilings in its Baselines table.

The permitted dependencies run one way. `src/parent/school/` imports `src/engine/school/`, `src/shared/`, `appendEvents` and the read side of the node states, the Cito results and the home skill scale. `src/engine/school/` imports only `src/shared/` and the Node built-ins `node:child_process`, `node:crypto` and `node:fs`. Nothing under `src/engine/model/`, `src/engine/states/` or `src/engine/director/`, and nothing in the model gateway, imports `src/engine/school/` or `src/parent/school/`, directly or through any module between. Nothing under `src/engine/school/` or `src/parent/school/` imports the gateway. `src/parent/school/export.ts` reads only `school_values` and the Cito results' projection.

## Behaviour

### The import

The import runs only in the Parent Room open on the Mac, because its routes mount only on the loopback listener, so a snapshot file never crosses the home network. The import takes a PDF, a PNG, a JPEG or a WebP file (REQ-6006). The server tells the type from the file's first bytes and never from its name. It refuses any other type with `snapshot_type_refused`, and a file over 25 MB or a PDF over 20 pages with `snapshot_too_large`.

The server hashes the upload with SHA-256 before the preview. When the hash already has a `school_snapshot_imported` event, the server writes no kept file, no `blobs` row and no event, deletes the temporary file, and the preview shows `snapshot_already_kept` with the earlier import's date and whether that snapshot was withdrawn (REQ-6012). A withdrawn hash stays withdrawn when imported again.

Otherwise the server parses the temporary file, and the Parent Room shows the document beside the pupil's name the parser read, or «Имя ученика в документе не найдено» (No pupil name found in the document) (REQ-6074). The preview also shows the document's date as read, the number of goals read and a field for the source.

When the parser read no document date, the Parent Room asks the parent for one and refuses the confirmation until it has it (REQ-6010). The parent confirms with «Это документ моего ребёнка» (This document is about my child) or cancels. Until the confirmation, the server writes no file in `data/blobs/`, no `blobs` row and no event (REQ-6076). A cancel deletes the temporary file. At start-up and every hour, the server deletes temporary import files older than one hour.

On confirmation, the server keeps the file and logs the import in this order, so no event names a file that isn't on disk:

1. It creates `data/blobs/<sha256>.<ext>` with exclusive create, sets it read-only, and syncs the file and its directory to disk.
2. It inserts the `blobs` row with the hash, the size and the media type, or keeps the row already there under that hash.
3. It appends `school_snapshot_imported` and the first `school_snapshot_parsed` in one call to `appendEvents`, so both land in one transaction.

The game keeps each snapshot file exactly once, under the hash of its content (REQ-6004). The import event carries the document's date, the date of upload, the source the parent named and the hash (REQ-6008). When the parent entered the date, it records `documentDateSource: parent` (REQ-6010).

### The kept file

A kept snapshot file stays byte for byte as it was imported (REQ-6088). The exclusive create, the read-only mode, the `blobs` triggers and the lint rule `blob_write` guard the write, and the verify check `blob_changed` re-hashes every file in `data/blobs/` of every extension and checks each `school_snapshot_imported` event's file as it checks `scratch_snapshot`. No event, route or command deletes or replaces a kept file.

### The parser

The parser runs on the Mac inside the `meowtower` container, for images as well as PDFs (REQ-6028). It reads a PDF with a text layer through `pdftotext -layout`. It renders a PDF without a text layer through `pdftoppm` at 300 dpi and reads it, and any image, through `tesseract` with its Dutch and English data. Each tool runs as a child process of the unprivileged container user, with no shell, a memory limit of 1 GB set by `prlimit`, and a timeout of 120 seconds for the whole parse. No part of the file or its text goes to the model gateway or to any other network service (REQ-6028, REQ-6030).

The parser version is the parser's own version, the `tesseract` version and the first 8 hex digits of a SHA-256 over the language data files, such as `1.0.0+t5.3.0-3fa2c19e`.

Per goal, the parser reads the wording, the subdomain, the status, the level from 0 to 5 and the target level. It also looks for goal codes, whether a goal is open, the number of tasks per goal, dates, the document's date, the share mastered per subdomain and the level of the material. It writes `null` for every field the document doesn't show and infers no value for it (REQ-6024). The import completes when any of those fields is missing, all of them included (REQ-6026). The parser maps the three status boxes to `reached`, `developing` and `needs_help`, and writes `null` for a status it can't place.

A goal's key is `w:` followed by the first 16 hex digits of a SHA-256 over the wording and the subdomain, lower-cased, with runs of spaces collapsed. A code the parser reads stays a field of the goal and never enters the key.

Every parse is a new `school_snapshot_parsed` event that carries the parser version and the hash of the file it read (REQ-6014). A parse that fails writes `outcome: failed` with its `failureCause` and no goals, at import and on a reparse alike.

### Reparses

When the parser version changes, a background worker in `src/parent/school/` rereads each kept file that isn't withdrawn and has no parse under the current version, one file at a time, and appends a new `school_snapshot_parsed` with `reason: reparse` (REQ-6016). It never rereads a withdrawn file, and it leaves every earlier parse event unchanged (REQ-6016). A failed parse counts as that version's parse of that file, so the worker tries the file again only under the next version. The worker starts after start-up and never blocks play or the Parent Room.

### Corrections and disagreements

A correction the parent makes is a new `school_snapshot_corrected` event naming the snapshot's hash, the goal and the field, and never a parse event, so it holds after every reparse (REQ-6018). A correction that names a goal no parse read adds the goal to the snapshot: its key is computed from the wording and subdomain the parent entered, and the server appends one `school_snapshot_corrected` for `wording` and one for `subdomain` under that key, in one call to `appendEvents`. A correction to a parsed goal's `wording` or `subdomain` keeps the goal's key, so its links hold. A correction with `subdomain` set and `goalKey` `null` changes a subdomain's `level` or `shareMastered`.

`school_values` holds, per snapshot, scope and field, the value of the latest parse with `outcome: read`, the value of the latest correction if one exists, and the value in force. The value in force is the correction's whenever a correction exists (REQ-6020). A failed parse leaves the earlier read values in force.

`school_values` marks a row `disagrees` when a parse that follows the correction in log order, under a `parserVersion` other than the correction's `parserVersionSeen`, gives another value. The Parent Room shows both values side by side with «Новое чтение документа расходится с вашей правкой» (A new reading of the document differs from your correction) (REQ-6022), and raises `snapshot_reparse_disagrees` once per parser version. The parent clears the mark by confirming either value, which appends a new correction with the current `parserVersionSeen`.

### Withdrawal

The tab «Данные школы» (School data) shows only when the Parent Room is open on the Mac. The parent withdraws a snapshot in that tab, which appends `school_snapshot_withdrawn` (REQ-6078). A withdrawn snapshot is absent from `school_values`, `school_snapshot_changes`, the mapping panel, both screens and the export for the school, because each reads its snapshots through those projections (REQ-6078). The export of the whole log in SPC-0020 still holds the snapshot's import, parse, correction and withdrawal events. No event restores a withdrawn snapshot, and the kept file stays in `data/blobs/`.

### The two projections

`school_values` and `school_snapshot_changes` read only `school_snapshot_imported`, `school_snapshot_parsed`, `school_snapshot_corrected` and `school_snapshot_withdrawn`. They are registered with the projection registry of SPC-0020, so the full recompute rebuilds them with the same result (REQ-6032). They are pure folds and import neither the knowledge model nor the Director.

`school_snapshot_changes` pairs each snapshot with the one before it by document date, with ties broken by import order. Per goal it lists the change of level, of status and of target, and the goals that appear or disappear. When a pair's target changed, the view marks both the target change and every status change of the same pair `target_moved` (REQ-6034).

### The knowledge model and the Director read no snapshot

The knowledge model folds no `school_snapshot_*` event, so importing, parsing, correcting, withdrawing or linking a snapshot changes no estimate and no node state (REQ-6000). The static check `school_events_in_model` fails when a file under `src/engine/model/` or `src/engine/states/` names `school_snapshot_`, or reaches `src/engine/school/` or `src/parent/school/` through its runtime imports, directly or through any module between, and names the chain (REQ-6002). A property test runs a 30-day simulated log with and without random school snapshot events inserted and finds `node_estimates` and `node_snapshots` byte-identical (REQ-6000).

A confirmed `school_snapshot_goal_linked` adds nothing to the value by which the Director ranks nodes (REQ-6058). The static check `school_snapshot_in_director` fails when a file under `src/engine/director/` names `school_snapshot_`, or reaches `src/engine/school/` or `src/parent/school/` through its runtime imports, directly or through any module between, and names the chain. A unit test of the Director finds that a log holding only snapshot links gives every node the same value as a log with none. SPC-0290 states the Director's term for goals the parent entered, which reads only `school_goal_mapped`.

### School data stays on the Mac and away from every model

No language model reads a snapshot file or any value parsed from one (REQ-6030). The static check `school_data_to_gateway` fails when the model gateway reaches `src/engine/school/` or `src/parent/school/` through its runtime imports, or when a file under those two directories reaches the gateway. No request class of SPC-0100 has a field that can hold a goal's wording, a school value or any part of the school's goal list.

The server sends no school goal's wording to any service outside the home (REQ-6048), and no part of the school's goal list off the Mac (REQ-5058), whether the goal came from a snapshot or from the list the parent entered. Every route that reads or writes the school's goal list or its wording is served only on the loopback listener: every route of this part, the two screens included, and SPC-0290's goal-list routes and the Cito panel's goal list. No snapshot goal, no entered goal and no goal the mapping panel shows reaches another device, even on the home network (REQ-5058, REQ-6048). A test finds that no request-class schema of SPC-0100 imports a type from `src/engine/school/` or `src/parent/school/` or has a field typed as a school goal, a goal list or a school value.

A withdrawn snapshot's file and values leave the Mac by no route (REQ-6080): the file is served only on the loopback listener, the gateway can't reach the school's code, and the export for the school reads `school_values`, from which withdrawal removes the snapshot.

### Goals map to nodes

The game proposes nodes for a school goal only from `content/school-goal-catalogue.json`, which the building agent builds offline from the vendor's public goal catalogue alone and a person approves per version (REQ-6050). The file ships with `source: null` and no entries, because no public catalogue has been found, so the game proposes no node for any goal and leaves every goal to the parent's own mapping (REQ-6092). A proposal is computed on each request to the panel and never logged.

The mapping panel lists each snapshot goal and each goal the parent entered that has no confirmed link, marked with its source, with the catalogue's proposal if one exists and a node picker grouped by domain, so the parent maps any goal by hand, whether or not the catalogue covers it (REQ-6052). The panel heads its list, per subdomain, with the number of linked goal keys read in the previous snapshot by document date and absent from the latest one.

A link takes effect only when the parent confirms it (REQ-5060). For a snapshot goal, the confirmation appends `school_snapshot_goal_linked`, and until then the goal is absent from every report (REQ-6056). An unlink appends `school_snapshot_goal_unlinked`, and the goal returns to the panel. A link belongs to the goal key, so it carries over to every later snapshot that reads the same key.

Goals the parent enters in the Parent Room map through the same catalogue file, the same key function in `src/engine/school/keys.ts` and the same panel, with no model involved (REQ-6054). Their confirmation writes `school_goal_mapped`, which SPC-0290 states, and the event carries the goal's `goalKey`, so a link holds across every new import of the entered list. The Director's term for entered goals reads only that event and never sees a snapshot link.

### The "home and school" screen

After the MVP, the full report has a "home and school" screen, shown only in a Parent Room open on the Mac, that sets the school's per-goal values beside the home node states of the linked nodes (REQ-6060). It reads `school_values` from the latest snapshot by document date, the confirmed snapshot links and the node states of SPC-0060, and shows one row per goal with a confirmed link. Until a snapshot exists, it shows «Нет снимков из школы» (No snapshots from school).

The school's level carries the label «уровень школы: сравнение с учениками по стране» (school level: compared with pupils nationally) (REQ-6036). The school's status carries «относительно цели, которую поставила школа» (relative to the target the school set) (REQ-6038). The home side shows the state labels of SPC-0180 for each linked node.

No cell shows a school value in a home column or a home state in a school column, and no code maps a school level or status to a home state or back (REQ-6040). `src/parent/school/` holds no table, function or constant that takes a school value and returns a node state, or the reverse.

The screen marks a goal «измерения расходятся» (the measures differ) in two cases only: a school status `reached` while every linked node is below «Понимает» (Understands), and a school status `needs_help` while every linked node is «Бегло» (Fluent) or «Устойчиво» (Stable). Beside each mark it shows «Школа и игра меряют разное: школа сравнивает с целью и с учениками по стране, игра считает ответы самой» (The school and the game measure different things: the school compares with a target and with pupils nationally, the game counts her own answers), which words the difference as one between two measures and names no fault in her or in either measure (REQ-6042).

### The timeline

After the MVP, the full report has a timeline screen, shown only in a Parent Room open on the Mac, showing the school's levels, the Cito results and the home skill scale over time (REQ-6062). It draws three series, each on its own axis with its own scale, and draws no line, number or legend that converts one series into another (REQ-6044). The series carry the labels «Школа» (School), «Cito» and «Игра дома» (The game at home) (REQ-6046).

The school series is the subdomain level per snapshot date where the document shows it, with a mark on each point from a `target_moved` pair. The Cito series comes from SPC-0290's result form and the home series from its home skill scale. A series with no data shows its label and «нет данных» (no data). Until a snapshot exists, the screen shows «Нет снимков из школы» (No snapshots from school).

### The export for the school

The game offers the export for the school as its own export, apart from the export of the whole log: `./meowtower export-school` and the button «Выгрузка для школы» (Export for the school) in the tab «Выгрузка данных» (Data export) (REQ-6066). Both write `data/exports/school-<UTC timestamp>/school-data.csv`, one CSV file in UTF-8 with a byte-order mark.

The file holds, per snapshot date, each school value as the parser read it, each correction in a row of its own with `value_source` `parent_correction`, and each Cito result the parent entered (REQ-6068). Its columns are `record`, `snapshot_date`, `date_source`, `goal_code`, `goal_wording`, `subdomain`, `field`, `value`, `value_source` and `parser_version`. `record` is `school_value` or `cito_result`, and a Cito row puts the form's fields in the same columns.

The file holds no home data: no event from play, no estimate, no node state, no free text and no story (REQ-6070). `src/parent/school/export.ts` reads only `school_values` and the Cito results' projection, and the static check `school_export_scope` fails when that file names another event type or projection, or reaches the knowledge model, the Director or any game projection through its imports (REQ-6070).

The game writes the export for the school only on the Mac: its routes mount only on the loopback listener, so a Parent Room on another device offers no export for the school (REQ-6072).

### Parser tests and fixtures

The parser's tests read only the synthetic overviews `tools/school-fixtures.ts` generates into `test/fixtures/school/`: PDF and PNG overviews with invented names, schools and goals in several layouts, with and without a text layer, and with the unconfirmed fields present and absent (REQ-6090). The generator writes `manifest.json` with each file's hash, and a test regenerates the directory and finds every file byte-identical to the manifest, so a file dropped into the directory by hand fails the test.

No real pupil overview, or any part of one, enters a tracked file (REQ-6082). `data/` and `personal/` are outside git, and the personal-data scan of SPC-0190 covers the fixtures. A person judges the rest when reviewing a change that touches the parser or the fixtures, because no check tells a real overview from a synthetic one (REQ-6082, REQ-6090).

## Failure paths

| Condition | What happens |
| --- | --- |
| The file's first bytes aren't PDF, PNG, JPEG or WebP | `snapshot_type_refused`: nothing is written, the temporary file is deleted, and the Parent Room shows «Не удалось открыть файл: подходят PDF, PNG, JPEG и WebP» (Couldn't open the file: PDF, PNG, JPEG and WebP work). |
| The file is over 25 MB, or a PDF has more than 20 pages | `snapshot_too_large`: nothing is written, and the Parent Room names the limit the file met. |
| The parse times out after 120 seconds, a tool fails or passes 1 GB, or the parse finds more than 400 goals | `snapshot_unreadable`: the Parent Room shows «Не удалось прочитать документ» (Couldn't read the document) and offers the import with no goals read, to be filled by corrections, or a cancel. A confirmed import appends a parse with `outcome: failed`. |
| The file's hash already has an import event, withdrawn or not | `snapshot_already_kept`: no file, row or event is written, and the Parent Room shows the earlier import's date and whether it was withdrawn. |
| The parser read no document date | The confirmation is refused until the parent enters one. |
| The parent cancels, or leaves the preview | A cancel deletes the temporary file at once; the hourly sweep deletes one older than one hour. |
| The confirmation arrives after the sweep deleted the temporary file | `snapshot_import_expired`: nothing is written, and the Parent Room asks for the file again. |
| The file already exists under its hash in `data/blobs/` at confirmation | The exclusive create fails, the server compares the existing file's hash with its name, keeps the existing file when they match, keeps an existing `blobs` row or inserts one when none exists, and appends the events; when they differ, the server replies `409` (`snapshot_blob_mismatch`), writes no row and no event, deletes the temporary file, and the Parent Room shows «Файл в хранилище повреждён, импорт остановлен» (The stored file is damaged; the import stopped); the verify check `blob_changed` also names the file. |
| `appendEvents` fails after the file and the row are written | The server replies `503` (`log_write_failed`, SPC-0020); the kept file and row stay, and a new confirmation of the same file appends the events. |
| A reparse fails on a kept file | The earlier read parse stays in force, the worker tries the file again only under the next parser version, and `snapshot_reparse_failed` shows once per parser version in `./meowtower status`. |
| A reparse gives a value other than a correction's | The correction's value stays in force, the row is marked `disagrees`, and `snapshot_reparse_disagrees` shows once per parser version. |
| Kept snapshot files pass 1 GB together | `school_files_large` shows once; no file is removed. |
| The parent asks for the export for the school with no snapshot that isn't withdrawn and no Cito result | `school_export_empty`: no file is written. |
| A request for any route of this part arrives through `https://<mac-name>.local` | 404. |
| A link names no node, more than five nodes, or a node the graph lacks | `422`: nothing is appended. |
| The log holds a `school_snapshot_*` event and the server has no schema for it | The server refuses to start, as SPC-0020 states for every type without a schema. |
| A file under `src/engine/model/`, `src/engine/states/` or `src/engine/director/` reaches the school's code, the gateway and the school's code reach each other, or `export.ts` reads outside its two projections | The matching static check fails verify and names the file and the import chain. |
| The preview takes longer than 30 seconds at the 95th percentile for a document of up to 4 pages on the family Mac | The verify report shows the measure against the Baselines table of SPC-0190. |

## Choices this document makes

ADR-0310 left these to the specification step, and this document chose them:

- The confirmation after the sweep answers with its own state, `snapshot_import_expired`, apart from `snapshot_unreadable`, because the parent's next step is to choose the file again.
- The fixtures live in `test/fixtures/school/`, tracked, with a manifest the generator writes and a test that regenerates them.
- The route names, the request and reply schemas, the `409` `snapshot_blob_mismatch`, the `422` on a link with no node, more than five nodes or an unknown node, and the recovery of a confirmation whose file exists but whose events failed.

## Open review findings

- Rejected, round 1: give a reason beside each limit (25 MB, 20 pages, 400 goals, 120 seconds, 1 GB of memory, 300 dpi, the one-hour sweep, the 1 GB `school_files_large` threshold, the 30-second preview baseline, one to five nodes per link). A specification states what the system does and never why (spec rule S8); the reasons belong in ADR-0310.
- Rejected, round 2: reword REQ-6074's "event or file" as "keeps any file". The wording belongs to the requirement, not to this document, which already states that the preview writes only the temporary file and no kept file.
