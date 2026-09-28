---
id: ADR-0310
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-6000, REQ-6002, REQ-6004, REQ-6006, REQ-6008, REQ-6010, REQ-6012, REQ-6014, REQ-6016, REQ-6018, REQ-6020, REQ-6022, REQ-6024, REQ-6026, REQ-6028, REQ-6030, REQ-6032, REQ-6034, REQ-6036, REQ-6038, REQ-6040, REQ-6042, REQ-6044, REQ-6046, REQ-6048, REQ-6050, REQ-6052, REQ-6054, REQ-6056, REQ-6058, REQ-6060, REQ-6062, REQ-6064, REQ-6066, REQ-6068, REQ-6070, REQ-6072, REQ-6074, REQ-6076, REQ-6078, REQ-6080, REQ-6082, REQ-6084, REQ-6086, REQ-6088, REQ-6090, REQ-6092]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0310. After the MVP, the parent imports school snapshots on the Mac only: each file is kept once in the blob store, parsed locally into versioned events the knowledge model and every model call are barred from reading, and shown beside home states on two post-MVP screens that never convert one measure into the other

## Decision

A school snapshot is a copy of the pupil overview from the school's learning system, which the parent receives from the school (RES-4100). After the MVP the game takes snapshots in through an import on the Mac, keeps each file once under its hash, parses it on the Mac into events, lets the parent correct and withdraw, and shows the values on a "home and school" screen, a timeline and an export for the school. ADR-0210 owns what this builds on: the MVP scope and its scope guard, which keep this whole decision out of stage 0.3 (REQ-6064), the rule that every event type has one owning decision, and what may leave the Mac. This record owns the six event types below, the parser, the goal links and the three surfaces.

This record is written for the owner, who evaluates it, and for the building agent, who builds from it. Where I chose a default that the research and the requirements left open, the sentence says "I chose".

### The import runs only on the Mac and writes nothing until the parent confirms

The import lives in the Parent Room tab «Данные школы» (School data) and in its route `POST /api/parent/school/import`, which mounts only on ADR-0010's loopback listener `http://localhost:8080`, as the export of ADR-0020 does. So a snapshot file never crosses the home network, and a Parent Room opened on the iPad offers no import. I chose this, because REQ-6074 already puts the preview on the Mac and a file that carries her name and school has no reason to travel further.

The import takes a PDF, a PNG, a JPEG or a WebP file (REQ-6006). The server tells the type from the file's first bytes and never from its name, because a renamed file would otherwise reach the wrong tool, and refuses any other type, a file over 25 MB or a PDF of more than 20 pages. It writes the upload to `data/tmp/school-import/<ULID>`, which holds no hash name and belongs to no store, and runs the parser on it. The Parent Room then shows the document beside the pupil's name the parser read, or the notice «Имя ученика в документе не найдено» (No pupil name found in the document) (REQ-6074). It also shows the document's date as read, the number of goals read and a field for the source.

The parent confirms with «Это документ моего ребёнка» (This document is about my child) or cancels. Nothing is written before the confirmation: no file in `data/blobs/`, no `blobs` row and no event (REQ-6076). A cancel deletes the temporary file. At start-up and every hour the server deletes temporary files older than one hour, because an import the parent left open would otherwise leave a copy of the file outside any store.

On confirmation the server does these steps in this order, which is the scratch-pad order of ADR-0020, so no event can name a file that isn't on disk:

1. It hashes the file with SHA-256 and creates `data/blobs/<sha256>.<ext>` with exclusive create, where `<ext>` is `pdf`, `png`, `jpg` or `webp`. It then sets the file read-only and syncs it and its directory to disk, as `storeScratch` does today.
2. It inserts the `blobs` row with the hash, the size and the media type.
3. It appends `school_snapshot_imported` and the first `school_snapshot_parsed` in one call to `appendEvents`, so both land in one transaction.

The server checks the hash before the preview. If the hash already has a `school_snapshot_imported` event, the server writes no file, no row and no event, and shows the date of the earlier import, with the note that the snapshot was withdrawn if it was (REQ-6012). I chose that a withdrawn hash stays withdrawn when imported again, because a withdrawn file is most often a wrong pupil's, and a second import of the same bytes is more likely a mistake than a correction.

The file stays byte for byte as imported (REQ-6004, REQ-6088): the exclusive create, the read-only mode, the `blobs` triggers and the lint rule `blob_write` of `tools/static-checks.ts` already guard it. The verify check `blob_changed` must re-hash every file in `data/blobs/`, of every extension, which needs the change to `verifyBlobs` under Consequences, because today it reads only `.webp` files and a PDF would go unchecked.

### The parser is local, versioned and never guesses

The parser is a pure function in `src/engine/school/parser/` over the file's bytes, with two local tools as child processes in the `meowtower` container: `pdftotext -layout` and `pdftoppm` from poppler-utils, and `tesseract` with the Debian packages for its Dutch and English language data. A PDF with a text layer is read from that layer. A PDF without one, or an image, is read through `tesseract` at 300 dpi (REQ-6028). No part of the file or its text goes to the model gateway or any other network service (REQ-6030).

The parser version is a string made of the parser's own version, the `tesseract` version and the first 8 hex digits of a hash over the language data files, such as `1.0.0+t5.3.0-3fa2c19e`. I chose this, because the same image read under new recognition data gives other text, and a parse event that named only the code's version couldn't be reproduced.

The parser reads what the vendor's pages confirm: per goal the wording, the subdomain, the status, the level from 0 to 5 and the target level (RES-4100). It also looks for the fields nobody has confirmed: goal codes, whether a goal is open, the number of tasks per goal, dates, the document's date, the share mastered per subdomain and the level of the material. Each of them is `null` when the document doesn't show it, and the import completes with any of them missing (REQ-6024, REQ-6026). The parser maps the vendor's three status boxes to `reached`, `developing` and `needs_help`, and writes `null` for a status it can't place, never the nearest one, because a guessed status would reach the parent as the school's word.

Every parse is a new `school_snapshot_parsed` event that carries the parser version and the hash it read (REQ-6014). When the parser version changes, a background worker rereads each kept file that isn't withdrawn and has no parse under the current version, one file at a time, and writes a new parse event with the reason `reparse` (REQ-6016). A parse that fails, at import or on a reparse, still writes `school_snapshot_parsed` with `outcome: failed`, its cause and no goals, so the worker counts that version as done for that file and retries only under the next version. Earlier parse events stay as they are, because the log erases nothing. The worker runs after start-up and never blocks play or the Parent Room.

### Six event types, owned by this record

Each type below enters ADR-0020's event catalogue with its zod schema in the same change (REQ-6084), and no name, schema field or module path names the vendor, because the school's system can change and the repository is public (REQ-6086). The school's code lives under `src/engine/school/` and `src/parent/school/`.

| Event | Payload, version 1 |
| --- | --- |
| `school_snapshot_imported` | `sha256`; `mediaType`, one of `application/pdf`, `image/png`, `image/jpeg` or `image/webp`; `bytes`; `documentDate`, a date; `documentDateSource`, `document` or `parent`; `uploadedOn`, the date of upload in the device's zone; `source`, `teacher`, `access_request` or `other`; `sourceNote`, the parent's words for another route, at most 200 characters, or `null`; `pupilNameRead`, a boolean |
| `school_snapshot_parsed` | `sha256`; `parserVersion`; `reason`, `import` or `reparse`; `outcome`, `read` or `failed`; `failureCause`, `timeout`, `tool_error` or `too_many_goals`, or `null`; `documentDateRead`, a date or `null`; `goals`, at most 400 entries, each with `goalKey`, `code`, `wording`, `subdomain`, `open`, `status`, `level`, `targetLevel`, `taskCount` and `dates`, every field but `goalKey` and `wording` nullable; `subdomains`, each with `name`, `shareMastered` and `level`, nullable; `materialLevel`, nullable; `unreadPages`, a count |
| `school_snapshot_corrected` | `sha256`; `goalKey`, or `null` for a field of the whole snapshot; `field`, one of the fields above; `value`, typed by the field, or `null`; `parserVersionSeen`, the version whose value the parent saw |
| `school_snapshot_withdrawn` | `sha256`; `reason`, `not_about_player`, `wrong_document` or `other` |
| `school_snapshot_goal_linked` | `goalKey`; `nodes`, one to five node identifiers from ADR-0050's graph, five because a goal that needs more nodes is a subdomain and belongs split into goals; `proposedBy`, `catalogue` or `parent`; `catalogueVersion`, or `null` |
| `school_snapshot_goal_unlinked` | `goalKey` |

The import event carries the date the document carries, the date of upload, the source the parent names and the hash (REQ-6008). When the parser reads no document date, the Parent Room asks the parent for it before the confirmation, and the event records `documentDateSource: parent` (REQ-6010).

A goal's key is `w:` followed by the first 16 hex digits of a SHA-256 over the wording and the subdomain, lower-cased with runs of spaces collapsed, and a code the parse reads stays a field of the goal. I chose one basis for every goal, because goal codes are unconfirmed, and a key that switched to the code whenever the parser caught it would give the same goal a new key, and lose its link, each time one snapshot showed the code and the next didn't.

A correction names the snapshot's hash, the goal and the field, and never a parse event, so it still applies after a reparse (REQ-6018). A correction may name a goal the parse didn't read, and that adds the goal to the snapshot. I chose this, because it lets the parent enter by hand what a photograph hid, so a parser that reads badly still leaves a usable snapshot.

### Values come from one projection, and a correction wins

The projection `school_values` folds the four snapshot events into one row per snapshot, goal and field. It holds the value of the latest parse with `outcome: read`, so a failed reparse leaves the earlier values in force, the value of the latest correction if one exists and the value in force. When the two differ, the value in force is the correction's (REQ-6020). The row is marked `disagrees` when a parse that comes after the correction in log order, under a `parserVersion` other than the correction's `parserVersionSeen`, gives another value, and the Parent Room shows both values side by side with «Новое чтение документа расходится с вашей правкой» (A new reading of the document differs from your correction) (REQ-6022). The parent clears the mark by confirming either value, which writes a new correction. A snapshot with a withdrawal event is absent from `school_values` and from every projection, screen and export that reads it (REQ-6078).

The projection `school_snapshot_changes` pairs each snapshot with the one before it by document date, ties broken by import order, and lists per goal the change of level, of status and of target, and goals that appear or disappear. When the target changed between the two snapshots, the view marks the target change and every change of status in the same pair as `target_moved` (REQ-6034). Both projections read only the four snapshot events and are registered with ADR-0020's projection registry, so the full recompute rebuilds them with the same result (REQ-6032). They are pure folds under the existing rule of SPC-0020 and import neither the knowledge model nor the Director.

### The knowledge model and every model call are kept out by checks in the lint verb

The knowledge model ignores every school snapshot event (REQ-6000). ADR-0060's model folds only the event types it names, so an unnamed type changes nothing by construction, and two static checks in the lint verb make the rule hold every time:

- `school_events_in_model` fails when a file under `src/engine/model/` or `src/engine/states/` names `school_snapshot_`, or reaches `src/engine/school/` or `src/parent/school/` through its runtime imports, directly or through any module between, and names the chain (REQ-6002). It follows imports the way SPC-0020's check on game projections does.
- `school_data_to_gateway` fails when the model gateway of ADR-0100 reaches `src/engine/school/` or `src/parent/school/` through its runtime imports, or when a file under those two directories reaches the gateway (REQ-6030, REQ-6048). ADR-0100's strict request classes already give goal wording and school values no field to travel in, and its lint rule on `fetch` already keeps the parser off the network.

A property test backs the first check: a 30-day simulated log gives byte-identical `node_estimates` and `node_snapshots` with and without random school events inserted.

### Goals map to nodes only through the catalogue or the parent, and only a confirmed link counts

The mapping of the vendor's public goal catalogue lives in `content/school-goal-catalogue.json`, with a `version`, the source it was built from and a list of entries from goal code or goal key to nodes. The building agent builds it offline from the public catalogue alone, so it is content made without the player, and a person approves each version, recorded in the file with the approving record, as `content/thresholds.lock` does for ADR-0180. The game proposes nodes for a goal only from this file (REQ-6050). No public catalogue was found (RES-4100), so the file ships with an empty list and `source: null`, and the game proposes nothing (REQ-6092).

The Parent Room's mapping panel lists each goal with no confirmed link. For each one it shows the catalogue's proposal, if any, and a node picker grouped by domain, so the parent can map any goal by hand (REQ-6052). The panel heads its list, per subdomain, with the number of goal keys that had a confirmed link in the previous snapshot by document date and are absent from the latest one, because a reworded goal gets a new key and would otherwise lose its link without a signal. Confirming writes `school_snapshot_goal_linked` (REQ-6056). A proposal is computed and never logged, so an unconfirmed proposal changes nothing in any report. Goals the parent enters in the Parent Room under the owner's addendum 1, item 8, map through the same catalogue file, the same key function and the same panel, with no model involved (REQ-6054). Their confirmation writes ADR-0290's `school_goal_mapped`, which ADR-0210 assigns to that decision. I chose two event types for the two sources, because a snapshot link must never reach the Director (REQ-6058) and an entered goal's link must, and a separate type lets the static check keep snapshot links out by name.

A confirmed snapshot link adds nothing to the Director's value (REQ-6058). REQ-5824's school-goal term reads only `school_goal_mapped`, as ADR-0290 decides, and a static check in the lint verb, `school_snapshot_in_director`, fails when a file under `src/engine/director/` names `school_snapshot_` or reaches `src/engine/school/`. A unit test of the Director checks that a log holding only snapshot links gives the same value for every node as a log with none.

### Two screens after the MVP, each keeping the two measures apart

The full report after the MVP adds two screens to the report of ADR-0180 (REQ-6060, REQ-6062), and report v1 keeps its screens until the MVP ends (REQ-6064). Both screens read `school_values`, the goal links and the node states of ADR-0060. Until a snapshot exists, both show «Нет снимков из школы» (No snapshots from school).

The "home and school" screen answers the parent's question "what does the school report for each goal, and what does the game see on the same topic?". One row per goal with a confirmed link sets the school's values beside the home states of the linked nodes. The school's level carries the label «уровень школы: сравнение с учениками по стране» (school level: compared with pupils nationally) (REQ-6036). The status carries «относительно цели, которую поставила школа» (relative to the target the school set) (REQ-6038). The home side shows ADR-0180's state labels. No cell shows a school value in a home column or a home state in a school column, and no code maps a school level or status to a home state or back (REQ-6040).

The screen marks a goal «измерения расходятся» (the measures differ) in two cases only, which I chose because they are the plain contradictions a parent would look for and neither converts a scale. The first is a school status `reached` while every linked node is below «Понимает» (Understands). The second is a school status `needs_help` while every linked node is «Бегло» (Fluent) or «Устойчиво» (Stable). Beside each mark the screen shows the line «Школа и игра меряют разное: школа сравнивает с целью и с учениками по стране, игра считает ответы самой» (The school and the game measure different things: the school compares with a target and with pupils nationally, the game counts her own answers) (REQ-6042). The line names no fault in her or in either measure, and the parent judges the wording. All strings live under `parent.school.*` in ADR-0160's content file, where ADR-0180's label check already runs.

The timeline answers "how did the school's levels, her Cito results and the home skill scale move over the same months?". It draws three series, each on its own axis with its own scale, and draws no line or number that converts one into another (REQ-6044). Each series is labelled with its source: «Школа», «Cito» or «Игра дома» (School, Cito, The game at home) (REQ-6046). The school series is the subdomain level per snapshot date, where the document shows it, with a mark on each point from a `target_moved` pair. The Cito series comes from the result form of REQ-5882, and the home series from the home skill scale of REQ-5876. A series with no data shows its label and «нет данных» (no data), so the screen works before either of the other two sources exists.

### The export for the school holds only school data and is written only on the Mac

`./meowtower export-school`, and the button «Выгрузка для школы» (Export for the school) in the tab «Выгрузка данных» (Data export), write one file, `data/exports/school-<UTC timestamp>/school-data.csv`. It is a second export, apart from the export of the whole log (REQ-6066). I chose one CSV file in UTF-8 with a byte-order mark, because a teacher opens it in a spreadsheet with no tool of ours, and the research decided on one file. It holds, per snapshot date, each school value as the parser read it, each correction in a row of its own marked `parent_correction`, and each Cito result the parent entered (REQ-6068). The columns are `record`, `snapshot_date`, `date_source`, `goal_code`, `goal_wording`, `subdomain`, `field`, `value`, `value_source` and `parser_version`. The Cito rows use the form's fields in the same columns.

The export's code in `src/parent/school/export.ts` reads only `school_values` and the Cito results' projection. A static check in the lint verb, `school_export_scope`, fails when that file names another event type or projection, or reaches the knowledge model, the Director or any game projection through its imports (REQ-6070). So no event from play, estimate, node state, free text or story can reach the file. A withdrawn snapshot is absent from `school_values`, so its values never reach the file (REQ-6080). The route serving the file mounts only on the loopback listener, so the same path through `https://<mac-name>.local` gets 404, and a Parent Room on another device offers no school export (REQ-6072).

No route of the game sends a snapshot file or a parsed value off the Mac: the files are served only on the loopback listener, the gateway can't reach the school's code, and the export for the school is a file the parent carries (REQ-6080).

### Parser tests use generated overviews only

The parser's tests read fixtures that `tools/school-fixtures.ts` generates: synthetic PDF and PNG overviews with invented names, schools and goals in several layouts, with and without a text layer, and with the unconfirmed fields present and absent. No real overview or any part of one enters a tracked file (REQ-6082, REQ-6090). `data/` and `personal/` are already outside git, and ADR-0190's personal-data scan in group 1 covers the fixtures. A person judges the rest, because no check tells a real overview from a synthetic one.

### What works once this is accepted, and what doesn't yet

Once built after the MVP, the parent imports a PDF or a photograph on the Mac, checks the name, confirms, and sees the goals read with every unread field empty. The parent corrects, withdraws, maps goals to nodes, reads the two screens and writes the export for the school. A new parser version rereads the old files on its own. The game plays exactly as before, because nothing in play reads a school event.

It doesn't work yet on a real overview, because nobody on the project has seen one. The first real file settles the layout the parser reads, and until then every unconfirmed field stays empty. The catalogue proposes nothing until a public catalogue exists. A withdrawal can't be undone: no event restores a snapshot, and importing the same bytes again restores nothing, so a withdrawn document comes back only as a new file with other bytes, such as a fresh scan or a new copy from the school, imported and corrected like any other. I chose this, because a restore would reopen the path for a wrong pupil's record that the withdrawal closed. The timeline's Cito and home series stay empty until the decisions behind REQ-5882 and REQ-5876 are built. Removing this increment leaves play, the model and report v1 unchanged. Only the six schemas must stay, because the server refuses to start on a log that holds a type with no schema (ADR-0020).

## Why

The research fixes the shape: a file kept once, a local parser with a version, corrections as events and a withdrawal in place of erasure, because ADR-0020's log erases nothing and the addendum asks for every value to trace to a file and a parser (RES-4100 conclusions 2 to 5 and 15, decided points 1 and 5). This record fixes the mechanics the research left to the design step: the size ceiling, the store's layout, the payloads, the key for a goal, the checks and the screens' wording.

The parser runs on the Mac with local text recognition, because a snapshot carries her levels and usually her name and school, and ADR-0100 lets none of it leave (RES-4100 conclusion 7). Poppler and Tesseract are packaged in Debian, which the `node:24-slim` image is built on. They read a text layer and recognise Dutch print with no network, so they need no new service.

The school's level is a national percentile turned into levels 0 to 5, and its status is relative to a target the vendor can move each month (RES-4100 findings on levels and the streefniveau). That is why the model never reads the school's events, why a snapshot link adds nothing to the Director, why a target change marks its status changes, and why the screens show the two measures side by side and convert neither.

The difference marks cover only the two contradictions because any finer rule needs an exchange rate between a percentile band and a mastery state, which nobody measured (REQ-6040). The two cases need none: a status of `reached` with no linked node understood, and `needs_help` with every linked node fluent, differ whatever exchange rate one assumes.

The imports, previews and exports stay on the loopback listener because a document about a child is safest where the parent sits at the Mac. ADR-0020 and ADR-0180 already defend the whole-log export this way.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: the parent reads the school's report beside the home report | Nothing to build or keep; no third-party record about her, or another child, on the Mac; no screen can suggest a percentile is mastery | No history across snapshots unless the parent files them, no link from a goal to a node, and the owner's addendum asks for the feature (RES-4100) |
| Manual entry only: a Parent Room form per goal, like the Cito form | Works with any format; nothing to parse, so no parser version and no disagreement to show | Tens of goals per snapshot are slow to type, a typo becomes a fact with no original to check it against, and REQ-6004 and REQ-6014 ask for a kept file and a parser version. The correction that adds a goal keeps this option as the fallback |
| A model reads the file | Reads any layout, photographs included, with the least parser code | Sends her school record off the Mac, which RES-2600 conclusion 12 and REQ-6030 forbid, and a model's reading can't be reproduced by version |
| A separate store for school files, outside `blobs` and its triggers | Keeps the draft-pad store exactly as SPC-0020 describes it, and could be encrypted or emptied on its own | A second write-once store with its own triggers, verify check and backup rule; ADR-0010's backup copy and REQ-2532 already cover `data/blobs/`, and an erasable store breaks REQ-6088 |
| Parse in the browser on the Mac, with PDF.js and Tesseract compiled to WebAssembly | No new packages in the server image | The parse would depend on the browser's version, and the server couldn't reread old files when the parser changes, which REQ-6016 requires. The library also fetches its recognition data from a content delivery network by default, so it would need vendoring to keep the file's text on the Mac |

## What it costs

The building agent writes the import route and its preview, the parser with two child-process tools, the fixture generator, six schemas, two projections, the mapping panel, two screens, the export and four static checks. The image gains poppler-utils, tesseract-ocr and its Dutch and English data, which I estimate at 40 MB and haven't measured.

The parent pays in attention. An import takes a few minutes of checking the name and the date, and correcting fields the parser missed. That is 10 minutes or more for a photograph, and the parent does it a few times a year. Mapping goals by hand takes about half a minute a goal, and with no catalogue that is every goal: 20 to 40 minutes for the first snapshot and a few minutes for later ones, since links persist by goal key.

Interruption budget: the design fires at most one Parent Room notice per condition, with no push. `snapshot_reparse_disagrees` fires once per parser version, `school_files_large` once, and `snapshot_reparse_failed` once per parser version to the owner. Nothing waits for the parent in real time. If nobody opens the Parent Room for a month, or for the two weeks that rule D22 of the method's design step asks about, nothing is lost and no queue grows: no import happens without the parent, reparses run on their own, a disagreement waits while the correction stays in force, and an unmapped goal only stays off the "home and school" screen.

Ceilings on what accumulates:

- A snapshot file is at most 25 MB and a PDF at most 20 pages, both chosen: a phone photograph is 2 to 8 MB, a scanned page at 300 dpi about 1 MB, and 20 pages bound a parse at the timeout below.
- Snapshot files in `data/blobs/` raise `school_files_large` once when they pass 1 GB, chosen as about 40 files at the ceiling, or years of snapshots at a few a year. They never drain, because REQ-6088 keeps them.
- A parse holds at most 400 goals, chosen as about three times the goals a year's arithmetic overview can list. A parse that finds more is refused as `snapshot_unreadable`.
- A parse times out after 120 seconds, chosen as four times the preview budget, so a slow document still finishes and a hung tool stops. The parent waits for the preview, with a budget of p95 30 seconds for a document of up to 4 pages on the family Mac, chosen because the parent waits once per import and a longer wait reads as a hang.
- Temporary import files drain after one hour.
- Reparses are one per kept file per parser version.

These numbers join ADR-0190's Baselines table, listed under Amends.

The security boundary protects her school record and, first, another child's. Ordered by the likelihood of damage, it defends against:

1. The school sending a wrong pupil's overview and the parent importing it. The name check before any write defends it, and a withdrawal hides what gets past the check. The file stays on the Mac for good, which this record accepts under ADR-0020's rule that nothing is erased.
2. A later change in the code feeding school data to the knowledge model or to a model call. The four static checks and the property test defend it.
3. A family device or a guest on the home network reaching a school file. The loopback-only import, file and export routes and ADR-0180's PIN defend it.
4. The building agent committing a real overview to the public repository. Generated fixtures, the personal-data scan and a person's review defend it.
5. A crafted file exploiting the PDF or image tools. The tools run as child processes of the unprivileged container user with the timeout, a memory limit of 1 GB set by `prlimit` and no shell. I chose 1 GB as about twice what I estimate, unmeasured, `tesseract` needs for a full page at 300 dpi, so a normal page passes and a decompression bomb stops. The file comes from the school, so I rank this last.

It doesn't defend against a person with the Mac's user account, as ADR-0180 says, or against a Time Machine copy of `data/`, which holds withdrawn files too.

The strongest objection is that the parser rests on a format nobody on the project has seen. If the school hands out a photograph of a screen, or the vendor changes the layout, the parser fills few fields. The parent then corrects each goal by hand, and the feature costs what manual entry costs plus a parser, a fixture generator and two tools in the image. Goal keys add a second weakness: if the vendor rewords a goal, or the parser reads its wording differently, its key changes and its link is lost; the mapping panel's count of vanished linked keys is the only signal. I accept both. The kept file is what lets a better parser recover every old snapshot, which manual entry can never do, and the correction that adds a goal keeps manual entry as the fallback. The reversal conditions below catch the case where the parser never earns its cost.

## What would reverse it

- After the first 3 real snapshots, the parent corrected or added more than half of the goal fields. Then the parser costs more than it saves, and the import becomes manual entry beside the kept file.
- In the first school year after the feature ships, the parent receives fewer than 2 overviews. Then the timeline has no trend to show, and it is removed from the report while the import, the corrections and the "home and school" screen stay.
- The vendor or the school offers a structured export, such as CSV or JSON. Then the parser reads that format first, and text recognition becomes the fallback.
- The owner widens RES-2600 conclusion 12 to let school data leave the Mac. Then the model option is reopened.
- The preview's p95 exceeds 30 seconds on the family Mac for documents of up to 4 pages. That is a finding against the baseline, and the parser moves to page-by-page previews.

Premortem, written as though it had happened: a year after the feature shipped, the "home and school" screen showed half its goals as unlinked. The vendor had reworded its goals between two school years, every key built from wording changed, and the links the parent made in autumn silently stopped matching. The parent stopped opening the screen. The second failure sat in the timeline: the school's line rose every month because the vendor's automatic target kept pace with her percentile, and the parent read the rising status as learning. The `target_moved` mark was on the changes view but not on the timeline, until this record put it there. The first failure is why the mapping panel counts goals unlinked since the last snapshot, and why the reversal on correction rates exists.

## Amends

- ADR-0020: "A draft-pad image arrives with the answer as WebP ... The server refuses an image over 512 KB" becomes: the blob store keeps draft-pad WebP images of at most 512 KB and school snapshot files in PDF, PNG, JPEG or WebP of at most 25 MB, each as `data/blobs/<sha256>.<ext>`, with the media type in its `blobs` row.
- ADR-0020: the Event catalogue gains `school_snapshot_imported`, `school_snapshot_parsed`, `school_snapshot_corrected`, `school_snapshot_withdrawn`, `school_snapshot_goal_linked` and `school_snapshot_goal_unlinked`, each owned by ADR-0310. ADR-0210's table of owners gains the last two, which it doesn't list.
- ADR-0020: "`./tower export` runs the export" becomes: the Mac runs two exports, the export of the whole log and ADR-0310's export for the school, each with its own content rule and each only on the loopback listener.
- SPC-0020: the Boundary row "Table `blobs` ... One row per stored image" becomes "One row per stored file, keyed by its SHA-256 hash, with its size and media type", and the row "`data/blobs/<sha256>.webp`, Draft-pad images" becomes "`data/blobs/<sha256>.<ext>`, draft-pad images and school snapshot files, one file per hash, written once".
- SPC-0020: the failure path "A draft-pad image is larger than 512 KB" gains the school ceilings: a snapshot file over 25 MB, a PDF over 20 pages or a type other than PDF, PNG, JPEG or WebP is refused, and no file, row or event is written.
- ADR-0060: "It takes the event log (ADR-0020)" becomes "It takes the event log (ADR-0020) except the `school_snapshot_*` events, which the lint check `school_events_in_model` keeps out of `src/engine/model/` and `src/engine/states/`".
- ADR-0180: the list of what doesn't work yet gains the "home and school" screen and the timeline, which come after the MVP as ADR-0310 defines them.
- ADR-0180: the security boundary's item 4, "report data leaving the Mac, through the Mac-only export of ADR-0020", becomes "through the Mac-only export of ADR-0020 and the Mac-only export for the school of ADR-0310, which holds no home data".
- ADR-0190: the Baselines table gains the rows of this record: a snapshot file of at most 25 MB and 20 pages; a parse of at most 400 goals and 120 seconds; the preview at p95 30 seconds for 4 pages; the parser tools' memory limit of 1 GB; snapshot files with a notice at 1 GB; temporary import files draining after one hour.
- ADR-0190: group 1 gains the static checks `school_events_in_model`, `school_data_to_gateway`, `school_snapshot_in_director` and `school_export_scope`.

## Consequences

- A migration adds a `media_type` column to `blobs`, defaulting to `image/webp` for the existing draft-pad rows. `storeScratch` keeps its behaviour, and `verifyBlobs` re-hashes files of every extension and checks each `school_snapshot_imported` event's file as it checks `scratch_snapshot`.
- The `meowtower` image installs poppler-utils, tesseract-ocr, tesseract-ocr-nld and tesseract-ocr-eng.
- `content/school-goal-catalogue.json` ships empty, with its version and approval entry.
- ADR-0160's Russian content file gains the `parent.school.*` strings, which ADR-0180's label check reads.
- RES-2550's description of `blobs` as "scratchpad snapshots" no longer matches the store. The research record stays as approved, and SPC-0020 carries the new description.
- ADR-0210's scope guard names this record's traces: `src/engine/school/`, the six schemas and the import route. They stay out of the tree until the MVP ends.

Failure states, each with its next step and one audience:

| State | When | What the system does | Audience |
| --- | --- | --- | --- |
| `snapshot_type_refused` | the file's first bytes aren't PDF, PNG, JPEG or WebP | writes nothing and shows «Не удалось открыть файл: подходят PDF, PNG, JPEG и WebP» (Couldn't open the file: PDF, PNG, JPEG and WebP work) | parent |
| `snapshot_too_large` | over 25 MB or over 20 pages | writes nothing and names the limit it met | parent |
| `snapshot_unreadable` | the parser times out, fails, or finds more than 400 goals | shows «Не удалось прочитать документ» (Couldn't read the document) and offers the import with no goals read, to be filled by corrections, or a cancel | parent |
| `snapshot_already_kept` | the hash has an import event | writes nothing and shows the earlier import's date and whether it was withdrawn | parent |
| `snapshot_reparse_disagrees` | a reparse gives a value that differs from a correction | marks the rows and raises one notice per parser version | parent |
| `snapshot_reparse_failed` | a reparse fails on a kept file | keeps the earlier parse in force, retries on the next parser version, and raises one notice per parser version in `./meowtower status` | owner |
| `school_files_large` | snapshot files pass 1 GB | raises one notice | parent |
| `school_export_empty` | no snapshot that isn't withdrawn and no Cito result | writes no file and says there is nothing to export | parent |
| `school_events_in_model`, `school_data_to_gateway`, `school_snapshot_in_director`, `school_export_scope` | a static check fails | verify fails and names the file and the import chain | building agent |

A timed-out parse and a document with no readable text both reach `snapshot_unreadable`, deliberately, because the parent's next step is the same.

## How I will know it was realised

1. A test imports each of the four types from generated fixtures and finds one file `data/blobs/<sha256>.<ext>` whose hash matches its name, one `blobs` row with the media type, and one import and one parse event in the same transaction. A GIF, a 26 MB file and a 21-page PDF write nothing.
2. A test cancels an import after the preview and finds no new file in `data/blobs/`, no `blobs` row, no event and no temporary file.
3. A test imports the same file twice and finds one file, one row and one import event. It withdraws the file, imports it a third time, and again finds nothing new written.
4. A fixture with no document date can't be confirmed until a date is entered, and its import event records `documentDateSource: parent`.
5. A fixture lacking codes, open flags, task counts, dates, subdomain shares and the material level imports, and every such field is `null` in the parse event.
6. Changing the parser version in a test run writes one new parse event per kept file that isn't withdrawn, none for a withdrawn file, and leaves the earlier parse events unchanged.
7. A correction followed by a reparse with another value keeps the correction's value in `school_values`, marks the row `disagrees`, and raises one notice. A second reparse under the same version raises none.
8. A failed parse writes a parse event with `outcome: failed`, a restart under the same parser version writes no second parse of that file, and after a failed reparse `school_values` keeps the earlier parse's values. A withdrawal removes the snapshot from `school_values`, `school_snapshot_changes`, both screens and the export for the school, while the export of the whole log still holds its four kinds of events.
9. A fixture pair with a changed target marks the target change and the status change of that pair `target_moved`. After a full recompute, both projections equal their stored rows.
10. The property test finds `node_estimates` and `node_snapshots` byte-identical with and without school events over a 30-day simulated log. A deliberate import of `src/engine/school/` into `src/engine/states/` fails `school_events_in_model`, and one into the gateway fails `school_data_to_gateway`.
11. With an empty catalogue, the mapping panel proposes no node for any goal, and the "home and school" screen shows no goal until the parent confirms a link. A fixture pair where one linked goal is reworded shows a count of 1 for its subdomain at the head of the panel.
12. A log holding only snapshot links gives the Director the same value for every node as a log with no links.
13. The export for the school, over a fixture with play events, estimates and free text, holds only rows whose `record` is a school value or a Cito result, and every correction row carries `parent_correction`. The same route through `https://<mac-name>.local` gets 404.
14. A scan of the tracked files finds no fixture outside `tools/school-fixtures.ts`'s output directory, and the personal-data scan of group 1 passes over them.
15. The parent judges the labels of level and status, the difference line and the timeline's source labels on a synthetic snapshot before the feature's acceptance.

## What this does not settle

- The MVP scope, the scope guard's entries and the order in which post-MVP items are built belong to ADR-0210 and ADR-0190.
- The Cito result form, the goals the parent enters under item 8 and their Director term (REQ-5824) and the home skill scale belong to the decisions built on RES-4080. Entered goals share this record's catalogue file, key function and panel, and log their links as ADR-0290's `school_goal_mapped`; this record reads the Cito results and the home skill scale on the timeline.
- Erasing a snapshot. The family can withdraw but can't erase, as ADR-0020 decides, and a redaction design would amend both records.
- Copies of `data/` outside the game, such as Time Machine, which hold withdrawn files too.
- The layout the parser reads. The first real overview settles it, under a new parser version.
- Whether a school reads the CSV without help, and a Dutch version of its column names. The strongest signal is the first time the parent hands it over.
- Reading the vendor's teacher dashboard or any service that needs a school login.

## Open review findings

Two agent reviews ran on this record, and I fixed every finding they marked as a fix. These preferences stay open:

- `sourceNote` has a 200-character bound with no stated reason. I keep it that way, because the bound changes nobody's work and only keeps a pasted document out of the field.
- No failure state covers a confirmation that arrives after the hourly sweep deleted the temporary file. The route answers as for `snapshot_unreadable` and asks for the file again, and the specification step names the state.
- The payload table, the CSV columns and the fixture directory's name and tracking are specification-level detail. I keep the payloads here, because this record owns the six types under ADR-0020's rule, and leave the fixture directory and the final columns to the specification step.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0420 and ADR-0450, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.
