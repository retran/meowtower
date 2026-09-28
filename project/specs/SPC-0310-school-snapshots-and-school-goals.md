---
id: SPC-0310
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-5058, REQ-5060, REQ-6000, REQ-6002, REQ-6004, REQ-6006, REQ-6008, REQ-6010, REQ-6012, REQ-6014, REQ-6016, REQ-6018, REQ-6020, REQ-6022, REQ-6024, REQ-6026, REQ-6028, REQ-6030, REQ-6032, REQ-6034, REQ-6036, REQ-6038, REQ-6040, REQ-6044, REQ-6046, REQ-6048, REQ-6050, REQ-6052, REQ-6054, REQ-6056, REQ-6058, REQ-6060, REQ-6062, REQ-6066, REQ-6068, REQ-6070, REQ-6072, REQ-6074, REQ-6076, REQ-6078, REQ-6080, REQ-6082, REQ-6084, REQ-6086, REQ-6088, REQ-6090, REQ-6092, REQ-7000, REQ-7002, REQ-7004, REQ-7006, REQ-7008, REQ-7010, REQ-7012, REQ-7014, REQ-7016, REQ-7018, REQ-7020, REQ-7022, REQ-7024, REQ-7026, REQ-7028, REQ-7030, REQ-7032, REQ-7036, REQ-7038, REQ-7040, REQ-7042, REQ-7044, REQ-7046, REQ-7048, REQ-7050, REQ-7052, REQ-7054, REQ-7056, REQ-7060, REQ-7062, REQ-7064, REQ-7066, REQ-7068, REQ-7070, REQ-7072, REQ-7074, REQ-7076, REQ-7404]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# School snapshots and school goals: import, local parse, goal mapping, withdrawal, the quadrants and the two school screens

## Scope

This document covers the school part of the game, which comes after the MVP: the import of a school snapshot on the Mac, the kept file, the local parser and its reparses, the six `school_snapshot_*` event types, the corrections and the withdrawal, the projections `school_values` and `school_snapshot_changes`, the goal catalogue file and the mapping panel, the "home and school" screen with its four quadrants for goal rows and Cito rows, the Cito category entries with their mapping file and the event `cito_category_resolved`, the timeline, the export for the school, the static checks that fence the part off, and the synthetic fixtures its tests read. A school snapshot is a copy of the pupil overview from the school's learning system, which the parent receives from the school. A school goal is one goal of that overview, or one goal of the list the parent enters by hand. A Cito category entry is one line of the teacher's category analysis of a Cito result: a domain or category, its signal and its deviation. One part ships in the MVP: the schema of a Cito category entry, which the Cito result form of SPC-0290 carries.

It is written at the component level: routes, files, event payloads, projections, modules, commands and static checks inside the `meowtower` container. The two screens are described at the level of what each row, cell and series shows, and their layout belongs to SPC-0150.

It leaves out what other documents state. SPC-0020 states the event log, `appendEvents`, the blob store with its triggers and the export of the whole log. SPC-0290 states the goal list the parent enters, its event `school_goal_mapped`, the Cito result form with its field `categories`, the event `external_test_recorded`, the horizons, the Dutch memo, the home skill scale and the Director's school-goal term. SPC-0060 states the knowledge model, its node states and the rules behind them, SPC-0070 the Director's value, SPC-0100 the model gateway and what leaves the Mac, SPC-0180 the Parent Room, the PIN, the report and its screens, the lesson-mark form, and the counts and 80 % intervals every share and difference of the report carries, SPC-0160 the string files, SPC-0190 the verify command, its groups, the personal-data scan and the scope guard that keeps this part out of the tree until the MVP ends, and SPC-0300 the Sources track and its screen. ADR-0340 states the parent's sandbox, ADR-0400 the trajectory and the retention list of the dynamics screen, ADR-0430 the Dutch probe, and ADR-0450 the hypotheses and their links to school goals.

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
| `GET /api/parent/school/goals` | loopback | The mapping panel: each snapshot goal and each entered goal with no confirmed link, marked with its source, its proposal and the count of vanished linked keys per subdomain, and each typed Cito category and `other` Cito signal with no resolution. |
| `POST /api/parent/school/goals/:goalKey/link` | loopback | `{ source, nodes, proposedBy, clientSeq }`, with `source` `snapshot` or `entered`; appends `school_snapshot_goal_linked` for a snapshot goal and `school_goal_mapped` of SPC-0290, carrying the `goalKey`, for an entered goal. |
| `POST /api/parent/school/goals/:goalKey/unlink` | loopback | `{ clientSeq }`; appends `school_snapshot_goal_unlinked`. |
| `POST /api/parent/school/cito-categories/resolve` | loopback | `CitoResolveIn`; appends `cito_category_resolved`. |
| `GET /api/parent/report/home-and-school` | loopback | The "home and school" screen's rows, each a `HomeAndSchoolRow`, computed on the request as of today. |
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
| `CitoCategoryEntry` | `category`, one of `lib:getallen`, `lib:verhoudingen`, `lib:meten-en-meetkunde`, `lib:verbanden`, `lovs:getallen`, `lovs:optellen-aftrekken`, `lovs:vermenigvuldigen-delen`, `lovs:meten-tijd-geld` or `typed`; `typedCategory`, at most 80 characters, set only with `typed`; `signal`, one of `below_notable`, `below_very_notable`, `not_notable`, `above_notable`, `above_very_notable` or `other`; `typedSignal`, at most 80 characters, set only with `other`; `deviationPercent`, an integer from -100 to 100, or `null`. It lives in `src/shared/events.ts`, and SPC-0290's field `categories` is a list of these. |
| `CitoResolveIn` | `kind`, `category` or `signal`; `typed`, the printout's words; for `category`, `category` or `nodes`; for `signal`, `signal`; `clientSeq`. |
| `HomeAndSchoolRow` | `kind`, `goal` or `cito`; `goalKey`, or the `resultId` and the entry's index; `quadrant`, one of `high_high`, `low_low`, `high_home_low_school` and `low_home_high_school`, or `null`; `reason`, a code of the reasons table, or `null`; `nodes`, each with its state and basis at the row's date and its current state; `oneCheck`; `targetMoved`; for a goal row, `snapshotDate` and `hypotheses`, the hypotheses of ADR-0450 that link to the goal; for a Cito row, the counts and shares at the test moment and today. |

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
| `cito_category_resolved` | `kind`, `category` or `signal`; `typed`, the printout's words lower-cased with runs of spaces collapsed, at most 80 characters; for `category`, either `category`, one of the eight listed keys, or `nodes`, 1 to 40 node identifiers of the graph in SPC-0050; for `signal`, `signal`, one of the five listed values; any of these `null` to undo |

`status` takes `reached`, `developing`, `needs_help` or `null`. `level` and `targetLevel` take an integer from 0 to 5 or `null`.

### Files and tables

| Path or table | What it holds |
| --- | --- |
| `data/tmp/school-import/<importId>` | An upload waiting for the parent's confirmation; no store owns it. |
| `data/blobs/<sha256>.<ext>` | A kept snapshot file, with `<ext>` one of `pdf`, `png`, `jpg` or `webp`, written once and read-only. |
| Table `blobs` | One row per kept file, with its hash, size and `media_type`. |
| Projection `school_values` | One row per snapshot, scope and field, where the scope is a goal key, a subdomain name or the whole snapshot: the latest read parse's value, the latest correction's value, the value in force and the `disagrees` mark. |
| Projection `school_snapshot_changes` | Per pair of consecutive snapshots and per goal: the change of level, status and target, goals that appear or disappear, and the `target_moved` marks. |
| `content/school-goal-catalogue.json` | `version`, `source`, the approving record, `goalTasksTimed` and `entries`, each from a goal code or goal key to one to five nodes. It ships with `source: null`, `goalTasksTimed: false` and no entries. |
| `content/cito-categories.json` | `version`, its source and approving record, and one list of nodes per listed category, each LOVS list with `confirmed`. |
| `data/exports/school-<UTC timestamp>/school-data.csv` | One export for the school. |
| `tools/school-fixtures.ts` and `test/fixtures/school/` | The generator of synthetic overviews, and its output with a `manifest.json` of each file's hash. |

### Modules

| Module | What it is |
| --- | --- |
| `src/engine/school/parser/` | The parser: a function of the file's bytes and the parser version alone, which runs `pdftotext -layout`, `pdftoppm` and `tesseract` as child processes. |
| `src/engine/school/keys.ts` | The goal-key function, shared with SPC-0290's entered goals. |
| `src/engine/school/projections/` | The folds behind `school_values` and `school_snapshot_changes`. |
| `src/parent/school/` | The routes, the import sweep, the reparse worker, the mapping panel, the two screens' readers and `export.ts`. |
| `src/parent/school/quadrants.ts` | The quadrant function: a pure function of an as-of date, today by default, over `school_values`, `school_snapshot_changes`, the confirmed snapshot links, `node_snapshots`, the Cito category fold, the `horizon_set` events of SPC-0290 up to each Cito result's `seq`, and the two content files. The screen's reader in `src/parent/school/` attaches ADR-0450's hypotheses to each goal row. |
| `src/parent/school/cito-categories.ts` | The Cito category fold: each current Cito result's `categories` and the resolutions in force. |

### Commands, notices and errors

| Name | Audience | Meaning |
| --- | --- | --- |
| `./meowtower export-school` | the parent | Writes the export for the school on the Mac and prints its directory. |
| `./meowtower report home-and-school --as-of <date>` | the owner | Prints the "home and school" screen's rows as of a past date, on the Mac. |
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
| `category_list_too_long` | the parent | A Cito result sends more than 16 category entries, or a typed field over 80 characters. |
| `category_map_unconfirmed` | the owner | `content/cito-categories.json` holds LOVS lists with `confirmed: false`; shown once per version in `./meowtower status`. |
| `category_map_drift` | the building agent | A domain list in `content/cito-categories.json` differs from the table of REQ-7066; verify fails, naming the domain and the nodes. |
| `quadrant_build_slow` | the building agent | The screen's build passes 1 s at the 95th percentile in verify's measurement. |
| `school_events_in_model`, `school_data_to_gateway`, `school_snapshot_in_director`, `school_export_scope`, `cito_categories_scope` | the building agent | A static check in group 1 failed, naming the file and the import chain. |

### What this part requires from other parts

- SPC-0010 supplies the loopback listener, the `data/` directory, `./meowtower status` and the `meowtower` image, which installs poppler-utils, tesseract-ocr, tesseract-ocr-nld and tesseract-ocr-eng.
- SPC-0020 supplies `appendEvents`, the blob store with its exclusive create, read-only mode, triggers and the verify check `blob_changed`, the projection registry and the full recompute.
- SPC-0050 supplies the node identifiers, SPC-0060 the node states, their labels, the rule behind each state and the daily rows of `node_snapshots`, and SPC-0290 the Cito results' projection, the results form, `external_test_recorded` with its `categories`, the horizons, the home skill scale and the goals the parent enters.
- SPC-0180 supplies the parent session, the Parent Room's tabs, the report's frame, the Parent Room's notices, the lesson-mark form and the counts and 80 % intervals of each share and difference; SPC-0160 supplies the Russian string file, where every string of this part lives under `parent.school.*`.
- SPC-0300 supplies the Sources track's screen, ADR-0450 the read side of the hypotheses with their school-goal links, ADR-0340 the sandbox's entry link that takes a list of nodes, ADR-0400 the trajectory and the retention list, and ADR-0430 the Dutch probe.
- SPC-0190 runs the five static checks, the test of `content/cito-categories.json`, the property tests and the personal-data scan in group 1, and holds this part's ceilings in its Baselines table.

The permitted dependencies run one way. `src/parent/school/` imports `src/engine/school/`, `src/shared/`, `appendEvents` and the read side of the node states, `node_snapshots`, the Cito results, the `horizon_set` events, the home skill scale and ADR-0450's hypotheses. `src/engine/school/` imports only `src/shared/` and the Node built-ins `node:child_process`, `node:crypto` and `node:fs`. Nothing under `src/engine/model/`, `src/engine/states/` or `src/engine/director/`, and nothing in the model gateway, imports `src/engine/school/` or `src/parent/school/`, directly or through any module between. Nothing under `src/engine/school/` or `src/parent/school/` imports the gateway. `src/parent/school/export.ts` reads only `school_values` and the Cito results' projection. Only files under `src/parent/school/`, `src/shared/events.ts` and SPC-0290's results form module read the field `categories` of `external_test_recorded`; SPC-0020's export of the whole log copies every event whole and is exempt.

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

### The knowledge model and the Director read no school data

The knowledge model folds no `school_snapshot_*` event, so importing, parsing, correcting, withdrawing or linking a snapshot changes no estimate and no node state (REQ-6000). The static check `school_events_in_model` fails when a file under `src/engine/model/` or `src/engine/states/` names `school_snapshot_`, or reaches `src/engine/school/` or `src/parent/school/` through its runtime imports, directly or through any module between, and names the chain (REQ-6002). A property test runs a 30-day simulated log with and without random school snapshot events inserted and finds `node_estimates` and `node_snapshots` byte-identical (REQ-6000).

No quadrant and no Cito category entry reaches the Director, the knowledge model or a model call (REQ-7052, REQ-7074). SPC-0290's projection of Cito results, which the Director reads for horizons, never carries `categories`, and the category fold lives in `src/parent/school/cito-categories.ts`, inside the fence of the checks below. The static check `cito_categories_scope` fails when a file outside `src/parent/school/`, `src/shared/events.ts` and SPC-0290's results form module reads `categories`. A property test over a 30-day simulated log finds `node_estimates`, `node_snapshots`, the Director's values and every gateway request body byte-identical with and without `categories` on the Cito events.

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

### Cito categories map to nodes

A Cito category entry follows `CitoCategoryEntry`. The results form of SPC-0290 lets the parent choose its category from the four Leerling in beeld domains, «Getallen», «Verhoudingen», «Meten en meetkunde» and «Verbanden», and the four LOVS standard categories, «getallen», «optellen & aftrekken», «vermenigvuldigen & delen» and «meten, tijd en geld», each labelled in the list with its system, «Leerling in beeld» or «LOVS», or type the category as the printout writes it (REQ-7060). The parent enters the signal as one of the five listed values, or as `other` with the printout's own words (REQ-7062). The entry schema ships in the MVP, and in the MVP nothing reads the entries except the export of the whole log.

`content/cito-categories.json` maps each listed category to nodes. The four Leerling in beeld domains map as the skill graph's research table maps them (REQ-7066):

| Domain | Nodes |
| --- | --- |
| Getallen | N1 to N7, A1 to A11, A6a, A13, F1 to F8, D1 to D6 |
| Verhoudingen | P1 to P6, M8, A14 |
| Meten en meetkunde | M1 to M10, M12, M13, G1, G3 to G7 |
| Verbanden | S1 to S6, G4 |

The word problems T1 to T4 map to no domain. A test in group 1 fails verify with `category_map_drift` when the file's domain lists differ from this table. The four LOVS categories ship drafted by the building agent and marked `confirmed: false`, and map to nodes only once a person confirms them in the file with the approving record (REQ-7068). Until then, a LOVS row sits in no quadrant under `category_unmapped`, and `./meowtower status` shows `category_map_unconfirmed` once per version of the file.

After the MVP, the mapping panel lists each typed category and each `other` signal with no resolution, and the parent maps a typed category to one of the eight listed categories or to 1 to 40 nodes, and an `other` signal to one of the five listed signals (REQ-7076). The resolution appends `cito_category_resolved`, keyed by the typed words after lower-casing and collapsing runs of spaces, and never by a result, so the same words in a later result or a correction resolve once. The latest resolution by `seq` for the same words and kind is in force, and a resolution with its target `null` undoes the earlier one. A row whose category is typed or whose signal is `other` stays in no quadrant until a resolution in force maps it (REQ-7064).

After the MVP, SPC-0290's Dutch memo under `parent.cito.memo` also lists the category analysis of a Cito result and the conditions of the test, such as reading aloud or extra time, among what the parent can ask the school for (REQ-7070). The memo is parent-facing Dutch with a Russian gloss in `ru.json`, so it needs no change to the Russian-only rule in `CLAUDE.md`.

### The "home and school" screen

After the MVP, the full report has a "home and school" screen, shown only in a Parent Room open on the Mac, that sets the school's values beside the home node states of the same nodes (REQ-6060). It has a goal section, with one row per goal with a `school_snapshot_goal_linked` in force, and a Cito section, with one row per category entry of each current Cito result: the latest `external_test_recorded` for its moment that no later result replaces. Each row lands in one of four quadrants, high or low at home crossed with high or low at school, or in no quadrant with its reason (REQ-7000). Until a snapshot exists, the goal section shows «Нет снимков из школы» (No snapshots from school), and without a Cito result the screen shows no Cito section, so the screen works with either source alone.

The school's level carries the label «уровень школы: сравнение с учениками по стране» (school level: compared with pupils nationally) (REQ-6036). The school's status carries «относительно цели, которую поставила школа» (relative to the target the school set) (REQ-6038). The home side shows the state labels of SPC-0180 for each node of the row.

No cell shows a school value in a home column or a home state in a school column, and no code maps a school level or status to a home state or back (REQ-6040). `src/parent/school/` holds no table, function or constant that takes a school value and returns a node state, or the reverse. Each side of a row is cut on its own scale.

#### The home side of a row

The home side reads only tested states: a node's row in `node_snapshots` and the rule that produced it, from the ordinary unassisted first attempts SPC-0060's rules read, and never an inferred state, a state from a probe alone or another stream (REQ-7002). A node is high when its rule is `block-slow`, `block-fast` or `stable`, which rest on a block score of 4 or more, and low when its rule is `block-low` or `block-mid`, a block score of 3.5 or less (REQ-7004). A node under `probe-fast`, `open`, `none` or an inference rule has no home reading.

While `goalTasksTimed` in `content/school-goal-catalogue.json` is `true`, a goal row counts a node at `block-slow` as neither high nor low, and a Cito row still counts it high (REQ-7006).

A goal is high at home when every linked node is high, low when every linked node is low, and neither otherwise (REQ-7008). A goal row reads the latest snapshot by document date that holds the goal's key and isn't withdrawn, and shows that snapshot's document date, so a goal the latest snapshot no longer reads keeps the values of its last snapshot. The goal row reads each linked node's state from the `node_snapshots` row of the last play day on or before that snapshot's document date (REQ-7010), and shows the node's current state beside it (REQ-7012). When a linked node has no unassisted first attempt on or before that date, or its last one lies more than 30 days before it, the goal lands in no quadrant under `home_stale` (REQ-7014).

A Cito row's date is the date of the horizon in force when the result was recorded that names the result's moment, or the date the result was recorded when no horizon names it. The row reads each node's state from the `node_snapshots` row of the last play day on or before that date (REQ-7026). A node is tested for a Cito row when its last unassisted first attempt lies within the 30 days before that date and its state then rests on a block rule (REQ-7032). The inside nodes are the category's mapped nodes. The outside nodes are the tested nodes of the four Leerling in beeld domains that the category doesn't map, so M8 and G4 count inside each category that maps them and outside the others, and T1 to T4 and the Sources track count on neither side.

The home side of a Cito row is a relative strength when the share of tested inside nodes at a block score of 4 or more exceeds the share of tested outside nodes by at least the margin, a relative weakness when it falls short by at least the margin, and neither otherwise (REQ-7030). The margin in percentage points is 100 times the square root of q(1 - q)(1/n_in + 1/n_out), where q is the share over all tested nodes on both sides, and n_in and n_out count the tested nodes inside and outside. At 10 inside, 40 outside and q = 0.7 the margin is 16.2 points. With no tested node outside, the row is neither under `home_no_outside`; with q at 0 or 1 it is neither under `home_even`.

A Cito row lands in no quadrant when its category has fewer tested nodes than its floor, the smaller of 10 and the larger of 5 and three quarters of the category's mapped nodes, rounded up (REQ-7404). The floor is 10 for Getallen and Meten en meetkunde and 6 for Verhoudingen and Verbanden. A row whose category has fewer than 10 tested inside nodes also passes the one-node guard: after one inside node moves one class toward the outside share, crossing the block score of 4, the difference recomputed with its margin must still stand, or the row lands under `home_one_node` (REQ-7404). A row whose category has 10 or more tested inside nodes follows the margin alone. The floor and the guard register in SPC-0180's floor registry, `src/parent/measures.ts`, as the Cito category measure.

Each Cito row shows the category's share at the test moment and its share over the inside nodes tested in the 30 days before today (REQ-7028), each with its counts and SPC-0180's 80 % Wilson interval, and the difference with SPC-0180's 80 % Newcombe interval.

#### The school side of a row

A goal row reads `school_values` of its snapshot. The status `reached` is high when the goal's target level is 3 or above (REQ-7016), and `needs_help` is low when the target level is 3 or below (REQ-7018). A `reached` status on a target below 3 lands in no quadrant under `school_target_low`, and a `needs_help` status on a target above 3 under `school_target_high`. A `developing` status, an empty target level, a goal level of 0 and a status the parser couldn't place each put the goal in no quadrant under `school_unplaced` (REQ-7020). A row whose status comes from a pair `school_snapshot_changes` marks `target_moved` keeps its quadrant and carries the target mark (REQ-7022).

A Cito row reads its entry's signal. `below_notable` and `below_very_notable` are low, a relative weakness, `above_notable` and `above_very_notable` are high, a relative strength, and `not_notable` is neither, which puts the row in no quadrant under `cito_not_notable` (REQ-7024).

#### Every row in no quadrant says why

The screen shows one reason per row in no quadrant, the first in this order that applies (REQ-7036). Each string lives under `parent.school.quadrant.none.*`.

| Code | Row | When | String |
| --- | --- | --- | --- |
| `category_unmapped` | Cito | a typed category with no resolution in force, or an unconfirmed LOVS category | «раздел не сопоставлен с узлами» (the domain isn't mapped to nodes) |
| `signal_other` | Cito | an `other` signal with no resolution in force | «сигнал Cito записан своими словами: выберите его значение» (Cito's signal is in its own words: choose its meaning) |
| `category_small` | Cito | the category maps fewer than 5 nodes | «в разделе меньше 5 узлов: сравнить нельзя» (the domain has fewer than 5 nodes: no comparison possible) |
| `school_unplaced` | goal | `developing`, no target level, level 0 or a status not read, with the case named | «школа не отметила статус, который можно сравнить» (the school gave no status that can be compared) |
| `school_target_low` | goal | `reached` on a target below 3 | «цель ниже середины: достигнутая цель не говорит о владении» (the target is below the middle: a reached target says nothing about mastery) |
| `school_target_high` | goal | `needs_help` on a target above 3 | «цель выше середины: недостигнутая цель не говорит о пробеле» (the target is above the middle: a missed target says nothing about a gap) |
| `cito_not_notable` | Cito | `not_notable` | «Cito: не отличается от ожидания» (Cito: no different from expectation) |
| `home_stale` | goal | a linked node never checked on or before the document date, or not checked in the 30 days up to it | «давно не проверялось дома» (not checked at home for a long time) |
| `home_untested` | both | a linked node with no home reading, or no tested inside node | «нет проверки блоком» (no block check) |
| `home_too_few` | Cito | fewer tested inside nodes than the floor | «проверено k из m узлов за 30 дней до теста» (k of m nodes checked in the 30 days before the test), with the tested and mapped counts |
| `home_split` | goal | linked nodes on both sides at home | «узлы цели дома по разные стороны» (the goal's nodes sit on both sides at home) |
| `home_speed_only` | goal | while `goalTasksTimed` is `true`, every linked node high or at `block-slow`, at least one at `block-slow` | «дома не хватает только скорости, а школа её меряет» (at home only speed is missing, and the school measures it) |
| `home_no_outside` | Cito | no tested outside node | «вне раздела нет проверенных узлов: сравнивать не с чем» (no checked nodes outside the domain: nothing to compare with) |
| `home_even` | Cito | the difference below the margin, or q at 0 or 1 | «дома разница с остальными узлами меньше порога» (at home the difference from her other nodes is below the margin) |
| `home_one_node` | Cito | the one-node guard fails | «разница держится на одном узле» (the difference rests on one node) |

Whenever a Cito result exists, the Cito section shows «Cito не строит профиль по разделам для 10 % самых сильных и 10 % самых слабых учеников: если строк нет, это правило Cito» (Cito builds no domain profile for the strongest and the weakest 10 % of pupils: if there are no rows, that is Cito's rule), whether or not the section holds a row (REQ-7038).

#### Each quadrant shows its checks

Each quadrant shows its heading and the checks it suggests, as links or sentences, on the row's nodes: a goal's linked nodes or a Cito category's tested nodes (REQ-7040).

| Quadrant | Heading | Checks |
| --- | --- | --- |
| high at home, high at school | «Дома и в школе высоко» (High at home and at school) | a link to ADR-0400's retention list for the row's nodes |
| low at home, low at school | «Дома и в школе низко» (Low at home and at school) | a link to SPC-0180's lesson-mark form with the row's nodes filled in, then a link to the nodes' trajectory of ADR-0400 |
| high at home, low at school | «Дома высоко, в школе низко» (High at home, low at school) | the Dutch probe of ADR-0430 on the row's nodes; a link to SPC-0300's Sources track screen; the Dutch memo's question on the test conditions |
| low at home, high at school | «Дома низко, в школе высоко» (Low at home, high at school) | a link opening ADR-0340's sandbox on the row's nodes (REQ-7050); the goal's or the category's wording beside the nodes' names; recalibration of the home tasks, as a sentence naming the nodes |

The Dutch probe's check shows only once the probe exists, and ADR-0430 builds no probe text until the owner amends the Russian-only rule in `CLAUDE.md`. Following a check changes nothing in play by itself: a link writes no event and changes no input of the Director, and the lesson-mark form writes `parent_tag_added` only when the parent submits it (REQ-7048).

The two disagreeing quadrants name their possible causes on both sides, each as something to check (REQ-7042). High at home and low at school reads «Что проверить. Дома: состояние может держаться на одном блоке из 5 ответов. В школе: формат заданий, язык, волнение, условия теста» (What to check. At home: the state may rest on one block of 5 answers. At school: the task format, the language, nerves, the test conditions). Low at home and high at school reads «Что проверить. Дома: задания игры могут быть сложнее или плохо откалиброваны, состояние может держаться на одном блоке. В школе: цель может проверяться в узком формате» (What to check. At home: the game's tasks may be harder or badly calibrated, the state may rest on one block. At school: the goal may be tested in a narrow format). The screen words every difference between the school's value and the home state as a difference between two measures, names a cause only as something to check, and names no fault in her or in either measure (REQ-7046).

Every goal row carries «Школа и игра меряют разное: школа сравнивает с целью и с учениками по стране, игра считает ответы самой» (The school and the game measure different things: the school compares with a target and with pupils nationally, the game counts her own answers). Every Cito row carries «Cito и игра меряют разное: Cito сравнивает раздел с её общим баллом, игра сравнивает её ответы по узлам раздела с остальными узлами» (Cito and the game measure different things: Cito compares a domain with her overall score, the game compares her answers on the domain's nodes with her other nodes) (REQ-7044).

Each goal row shows beside its values the hypotheses that ADR-0450 links to its goal, and the link never enters a hypothesis label. Each row lists its nodes, each with the basis of the state the row compared: «один блок» (one block) for a state resting on its last full block alone, or «две проверки» (two checks) for `stable` (REQ-7054). A row where any node rests on one block carries «одна проверка» (one check) (REQ-7056).

#### Rows are computed at request time

`GET /api/parent/report/home-and-school` calls `src/parent/school/quadrants.ts` on each request with today as the as-of date, and `./meowtower report home-and-school --as-of <date>` calls it with a past date. No quadrant is written to the log or to `report_cache`, so a full recompute gives the same screen, byte for byte (REQ-7072). The screen's build stays at or under 1 s at the 95th percentile with a year of log on the family Mac, the baseline SPC-0190 holds.

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
| A Cito result sends more than 16 category entries, or a typed category or signal over 80 characters | `category_list_too_long`: the form refuses the save, names the limit it met and keeps what was typed. |
| A resolution names no node, more than 40 nodes, a node the graph lacks, or a category or signal outside the listed values | `422`: nothing is appended. |
| `content/cito-categories.json` holds a LOVS list with `confirmed: false` | Rows of that category sit under `category_unmapped`, and `./meowtower status` shows `category_map_unconfirmed` once per version of the file. |
| A domain list in `content/cito-categories.json` differs from the table of REQ-7066 | `category_map_drift`: verify fails, naming the domain and the nodes. |
| A file outside `src/parent/school/`, `src/shared/events.ts` and SPC-0290's results form module reads `categories` | `cito_categories_scope`: verify fails and names the file. |
| The screen's build passes 1 s at the 95th percentile in verify's measurement | `quadrant_build_slow`: recorded as a finding against the baseline, which doesn't move. |
| A row supports no cut on one of its sides | The row shows in no quadrant with the first reason of the reasons table. |

## Choices this document makes

ADR-0310 left these to the specification step, and this document chose them:

- The confirmation after the sweep answers with its own state, `snapshot_import_expired`, apart from `snapshot_unreadable`, because the parent's next step is to choose the file again.
- The fixtures live in `test/fixtures/school/`, tracked, with a manifest the generator writes and a test that regenerates them.
- The route names, the request and reply schemas, the `409` `snapshot_blob_mismatch`, the `422` on a link with no node, more than five nodes or an unknown node, and the recovery of a confirmation whose file exists but whose events failed.

ADR-0420 left these to the specification step, and this document chose them:

- The resolution route `POST /api/parent/school/cito-categories/resolve`, the schemas `CitoResolveIn` and `HomeAndSchoolRow`, and the `422` on a resolution outside its limits.
- A Cito row with no tested inside node shows `home_untested`, and one with some but fewer than its floor shows `home_too_few`.
- `home_speed_only` applies when every linked node is high or at `block-slow`, with at least one at `block-slow`; any other mix under a timed catalogue shows `home_split`.
- The string of `school_target_high`, «цель выше середины: недостигнутая цель не говорит о пробеле», which ADR-0420 names only as the mirror of `school_target_low`.
- Without a Cito result, the screen shows no Cito section.
- A Cito row's horizon date comes from folding `horizon_set` up to the result's `seq`, because SPC-0290's `horizons` projection holds only the horizons as they stand now.
- A goal row reads the latest snapshot that holds its key and isn't withdrawn, so a goal missing from the latest snapshot keeps its last values and shows their date.

## Open review findings

- Rejected, round 1: give a reason beside each limit (25 MB, 20 pages, 400 goals, 120 seconds, 1 GB of memory, 300 dpi, the one-hour sweep, the 1 GB `school_files_large` threshold, the 30-second preview baseline, one to five nodes per link). A specification states what the system does and never why (spec rule S8); the reasons belong in ADR-0310.
- Rejected, round 2: reword REQ-6074's "event or file" as "keeps any file". The wording belongs to the requirement, not to this document, which already states that the preview writes only the temporary file and no kept file.
- Rejected, round 1 of 2026-09-28: cite ADR-0340, ADR-0400, ADR-0430 and ADR-0450 in place of their decisions. This document cites only lower-numbered specifications and names a higher-numbered subject by its decision.
- Rejected, round 1 of 2026-09-28: give a reason, or a pointer to where it lives, beside each limit. As in the earlier round, the reasons live in ADR-0310 and ADR-0420, and a specification states no reason (spec rule S8).
