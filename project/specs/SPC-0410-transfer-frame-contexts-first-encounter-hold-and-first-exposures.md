---
id: SPC-0410
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-6900, REQ-6902, REQ-6904, REQ-6906, REQ-6908, REQ-6910, REQ-6912, REQ-6914, REQ-6916, REQ-6918, REQ-6920, REQ-6922, REQ-6924, REQ-6926, REQ-6930, REQ-6932, REQ-6934, REQ-6936, REQ-6938, REQ-6940, REQ-6942, REQ-6944, REQ-6946, REQ-6948, REQ-6950, REQ-6952, REQ-6954, REQ-6956, REQ-6958, REQ-6960, REQ-6962, REQ-6964, REQ-6966, REQ-6968, REQ-6970, REQ-6972, REQ-6974, REQ-6976, REQ-6978, REQ-6980, REQ-6982]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Transfer: frame context tags, the first-encounter hold and the `first_exposures` projection

## Scope

This document covers how the game measures transfer: the closed list of contexts, the context every accepted frame carries, the `contexts` a context template lists, the format hold and the context hold on each subtype, the rule that keeps side slots on subtypes, formats and contexts the player has already met, the projection `first_exposures` with its eligibility rules, and the transfer section of the report after the MVP. It is written at the level of content files, event fields, projection rows, selection rules and report figures. ADR-0410 holds the reason for every rule stated here.

It leaves out what other documents state. The frame pipeline, the frame library, the live queue and the frame picker's base order belong to SPC-0130, which also states REQ-6928's rule on repeated frames. The template schema and the item builder belong to SPC-0040, the Director's slot choice and its `why` field to SPC-0070, the half-bare rule to SPC-0290, tested and inferred states, full blocks, lesson marks and the fatigue weight to SPC-0060, the event catalogue and the projection registry to SPC-0020, the verify groups and the Baselines table to SPC-0190, and the report's pages to SPC-0180. Addendum 2's intervals, «мало данных» (too little data) floors, interpretation lines and MVP scope belong to ADR-0380, the weekly breakdown's depth-of-help categories and the retention check to ADR-0400, the profile's transfer bar to ADR-0390, and the Dutch probe letters to ADR-0430.

## Boundary

### Files and fields

| Surface | What this part puts there |
| --- | --- |
| `content/contexts.yaml` | The closed list of contexts. Each entry has an `id` matching `^[a-z][a-z0-9_]*$`, such as `motion_boat` or `motion_walk`, a one-line English `describe` that a frame request passes to the author model, and `since`, the list version that added it. |
| `ru.json`, `parent.contexts.<id>` | The Russian label of each context, which the parent reads. |
| `ru.json`, `parent.transfer.*` | The strings of the report's transfer section. |
| A template with `format: "context"` | `contexts`: a non-empty list of ids from `content/contexts.yaml` that the template's structure admits. |
| A frame | `context`: exactly one id from `content/contexts.yaml`. |
| `frame_accepted` | the field `context`, added under ADR-0380's rule for addendum 2's fields. |
| `item_shown` | `why` includes `transfer_hold` while a hold is active on the task's subtype. `item_shown` carries no context field and no `firstExposure`. |
| The frame review screen | Each candidate's context by its Russian label, a control to change it to another context the structure's context templates list, and «нет подходящего сюжета» (no fitting setting). |

A context id carries no language, so a frame in English or Dutch can carry the same tags as a Russian one.

### The projection `first_exposures`

`first_exposures` is a projection of the `knowledge` class in the registry SPC-0020 states. It holds at most one row for each subtype, each subtype-and-format pair and each subtype-and-context pair, and the sets of used subtypes, used subtype-and-format pairs and used subtype-and-context pairs. Each row is one `firstExposure`:

| Field | Value |
| --- | --- |
| `kind` | `subtype`, `format` or `context` (REQ-6938) |
| `distance` | `far` when `kind` is `subtype`, `near` when `kind` is `format` or `context` (REQ-6940) |
| `eligible` | whether the encounter counts as a transfer observation (REQ-6938) |
| `reason` | when `eligible` is false, the first failing condition of the eligibility list (REQ-6938) |
| `expected` | the knowledge model's chance of success for the subtype at the show, by ADR-0070's formula, under the model, threshold and graph versions active at that show (REQ-6938, REQ-6942) |
| `category` | the depth-of-help category of the first attempt, or `null` when the show has none |
| `transferred` | true only when `category` is «сама» (on her own) |

### Checks

| Check | Group | What it does |
| --- | --- | --- |
| `contexts_append_only` | verify group 1 | reads the committed list with `git show HEAD:content/contexts.yaml` and fails when an `id` of that version is missing from the working tree or its `since` changed (REQ-6902) |
| template schema, `formats` | verify group 1 | refuses a template with a field named `formats` and a `format` other than `bare` or `context` (REQ-6918) |
| template schema, `contexts` | verify group 1 | refuses a context template without `contexts`, with an empty list or with an id missing from `content/contexts.yaml` (REQ-6910) |
| frame schema, `context` | verify group 1 | refuses a frame without `context` (REQ-6900) |
| `template_one_context` | verify group 1 | warns, without failing the build, when a context template lists fewer than 2 contexts (REQ-6912) |
| `source_in_track` | verify group 1 | fails a template with `inputClass: "source"` whose subtype belongs to a maths node (REQ-6922) |
| `model_files_kept` | verify group 1 | fails a build that lacks `content/model.vN.json` for any version below the current one (REQ-6942) |
| `model_reads_no_transfer` | lint | fails when code under `src/engine/model/` or `src/engine/states/` imports `first_exposures` (REQ-6966) |
| acceptance test 2 | verify group 3 | the 60-day simulation this document's last behaviour section states (REQ-6980) |

`./meowtower status` shows the count of templates that `template_one_context` warns on.

### Permitted dependencies

`first_exposures` reads the event log and the versioned content files and nothing else. The format hold, the context hold and the side-slot rule read the used sets of `first_exposures` and the node's tested state as the knowledge model recorded it. The report's transfer section reads only eligible rows of `first_exposures`. The knowledge model, the state rules, probes and full blocks read nothing of `first_exposures`, and `model_reads_no_transfer` fails an import that crosses this boundary. No API response carries `why`, a hold or a `first_exposures` row.

## Behaviour

"Fluent by a tested result" in this document means the node's `testedState` is «бегло» (fluent) or «устойчиво» (stable), set by a tested result, a probe or a full block, as SPC-0060 computes it. An inferred state never counts as fluent by a tested result.

### The list of contexts

Every story frame the game accepts carries exactly one context from `content/contexts.yaml` (REQ-6900). The list changes only by gaining an entry, and `contexts_append_only` fails a build that removes a tag, renames one or changes its `since` (REQ-6902). The parent adds a context by adding an entry and committing the file.

Adding a context retags no accepted frame (REQ-6904). A frame's context lives in its `frame_accepted` event, and the game never writes a second acceptance for a frame it has already accepted.

### Templates and formats

A template declares its format as the single value `bare` or `context`, never as a list (REQ-6918). A template of the context format lists in `contexts` the contexts its structure admits (REQ-6910). When a context template lists fewer than 2, `template_one_context` warns and the build passes (REQ-6912), and that template gives its subtype no context to hold.

An inverse problem, such as finding a side from the perimeter, is a subtype or a node of its own in `content/graph.yaml`, never a format of the direct problem's subtype (REQ-6920). The schema admits no third format. A task built on a table, chart, timetable or map belongs to a node of the Sources track that SPC-0300 states, never to a format of a maths subtype (REQ-6922). A maths word problem that quotes one number from a small table keeps its maths node, because its `inputClass` isn't `source`.

### Frames carry their context

Every frame request names the context the frame is to be set in (REQ-6908). `npm run frames:generate` asks, for each structure, for the context with the fewest accepted frames of that structure among those its context templates list in `contexts`, with ties broken by the order of `content/contexts.yaml`.

The frame review screen shows each candidate's context by its Russian label. The parent keeps the context, changes it to another context the structure's context templates list, or marks the candidate «нет подходящего сюжета». A candidate marked so stays unaccepted with `frame_context_missing` until a new list version holds a context it fits (REQ-6906). The screen then offers it again, and the 60-day candidate expiry of SPC-0130 removes it if nobody accepts it.

`frame_accepted` records the context of the frame it accepts (REQ-6914). The server writes `context` on every acceptance from the first accepted frame, so the log holds no untagged acceptance. `item_shown` records no context (REQ-6916): the context of a show is the context of the `frame_accepted` of its `frameId`.

A live frame request names a context already shown on the slot's subtype. When the subtype has no shown context, the block top-up task takes a library frame. A live frame therefore never brings a new context. When the parent moves a live frame to the library, its `frame_accepted` records the context its request named.

### The holds

Both holds apply from the player's first adventure (REQ-6932).

The format hold applies to a subtype with templates in both formats. From the subtype's first show, the first show included, the item builder takes only the subtype's bare templates. The hold ends when the node is fluent by a tested result or when the 14th game day after the first show's game day begins, whichever comes first (REQ-6924). The format hold runs before the half-bare rule of SPC-0290: a held subtype takes a bare template whatever the node's counts.

The context hold applies to a subtype with at least 2 contexts that have an accepted frame of its structure. A subtype's contexts are the union of the `contexts` of its context templates, and a context counts only where an accepted frame of that template's structure carries it. While exactly one of those contexts hasn't been shown on the subtype, the game never shows a frame of that context on the subtype, until the node is fluent by a tested result (REQ-6926). The context hold has no time cap. Each hold ends on the subtype the first time its node is fluent by a tested result and doesn't return. While the context hold is active and the list or the library grows so that a second context becomes unshown on the subtype, neither is held until one of them is shown, so the active hold keeps exactly one unshown context while at least 2 exist.

While the format hold or the context hold is active on a subtype, the `why` field of every `item_shown` of that subtype includes `transfer_hold` (REQ-6930).

Before the knowledge model exists, no node is fluent by a tested result, so the format hold ends at its 14th game day and the context hold keeps its context.

### Side slots take what she has met

A warm-up, a second attempt, a retention check, a Dutch probe presentation, a task with a non-empty `forms` and a task on a live frame are side slots. For a side slot, the Director chooses a subtype already shown to the player, and the item builder a format already shown on that subtype, whenever one fits the slot (REQ-6954). The frame picker then chooses a frame whose context has been shown on that subtype whenever one exists (REQ-6956). When nothing shown fits, as in the first warm-up of her first adventure, the slot takes a new one, and `first_exposures` marks it used and, when the show has a first attempt, ineligible with the reason `side_slot`. A context the context hold keeps back is never shown in a side slot.

### Choosing a frame under the holds

The frame picker of SPC-0130 leaves out, from the accepted frames of the task's structure and locale, every frame of a context the context hold keeps back for the task's subtype. In a side slot it also leaves out every frame whose context hasn't been shown on the subtype, unless that leaves none. It then applies its base order to what remains.

When every frame of a structure the player hasn't met is left out by the context hold or by the side-slot rule, and every other frame was shown in the last 14 game days, the picker takes the frame it showed longest ago among those not left out by the context hold or the side-slot rule (REQ-6982), and `item_shown` carries `frameRepeat: true`. When the context hold leaves no frame for a template, the item builder takes another template of the subtype, then a bare template, and then the Director takes another subtype, and the server counts `transfer_hold_no_frame`.

### The projection `first_exposures`

`first_exposures` is computed from the event log and the versioned content files alone (REQ-6936). It reads the shows in `seq` order. For each show it takes the subtype and `format` from `item_shown`, and, for a library frame, the context from the `frame_accepted` of the show's `frameId`. A bare task and a live frame add no context. Pairs are keyed by the subtype id of the graph version active at the show, so a subtype id that a new graph version introduces counts as a new subtype.

The projection gives a `firstExposure` on the first show of each subtype, of each subtype in each format and of each subtype in each context, at most once for each (REQ-6934). When a show is new on several counts, it gets one `firstExposure` of the highest kind, subtype before format before context, and the other pairs become used with no row of their own (REQ-6944). Every show marks its subtype, its subtype-and-format pair and, when it has a context, its subtype-and-context pair used, a side-slot show included.

### Which first encounters are eligible

A first encounter is eligible only when every condition below holds, and `reason` names the first that fails, in this order (REQ-6946, REQ-6948, REQ-6950):

1. `no_attempt`: the show has a first attempt.
2. `side_slot`: the show fills none of the side slots, so its `forms` is empty too.
3. `not_graded`: the first attempt is graded.
4. `excluded`: the parent hasn't excluded the attempt through `item_excluded`.
5. `rapid_guess`: the attempt's `verdict` carries no `rapidGuess: true`.
6. `fatigue`: the attempt doesn't carry the fatigue weight of SPC-0060.
7. `lesson_mark`: no lesson mark on the node falls in the 21 game days before the show.
8. For `kind: subtype`, `no_prerequisites`: the node has at least one prerequisite, so a node with none, such as a Sources track node, gives no far observation. Then `prerequisites_not_fluent`: each prerequisite of the node is fluent by a tested result at the show (REQ-6948).
9. For `kind: format` and `kind: context`, `node_not_fluent`: the node is fluent by a tested result at the show (REQ-6950).
10. `version_missing`: the model file of the version active at the show loads.

A walkthrough shown to the player before the encounter keeps it eligible (REQ-6952).

### The observation

A transfer observation is the first attempt alone (REQ-6958). `category` sorts it into one of the four depth-of-help categories ADR-0400 defines for the weekly breakdown: «сама» (on her own), «хватило первой ступени» (rung 1 was enough), «с опорой» (with support, rungs 2 to 3) and «требует обучения» (needs teaching). An eligible first encounter counts as transferred only when its category is «сама», a right answer with no hint before it, and counts as not transferred in every other category (REQ-6960). A later attempt on a subtype, format or context the player has already met, a second attempt included, gives no transfer observation (REQ-6962).

A first-encounter attempt counts in the "on her own" estimate as an ordinary task of its node (REQ-6964). The used sets and the transfer observations feed no estimate, state, probe or block, only the holds and the report (REQ-6966).

### Versions and recompute

`expected` and the tested states that conditions 8 and 9 read are taken under the model, threshold and graph versions active at the show (REQ-6942). The log records each version change as `model_activated`, `settings_changed` or `fact_threshold_set`, and `content/model.vN.json` holds each model version's parameters. A full recompute keeps the model-derived fields of every row whose show fell under an earlier version set and recomputes the rest from the log, as SPC-0020 does for `node_snapshots`. A rebuild after the table is lost replays each version set over the part of the log it governed. A show with no active model version, as before the knowledge model exists, gets `expected: null`, and, unless an earlier condition fails, it fails condition 8 or 9, since no node is fluent by a tested result; a recompute keeps these rows as they are. When a rebuild can't load a model file, every row whose show fell under that version reads, whatever conditions 1 to 9 give, `eligible: false`, `reason: version_missing` and `expected: null`.

The holds read the used sets, which depend on no version, and the node's tested state as the knowledge model recorded it at the time, so a replay releases a hold on the same show as play did.

The holds add a lookup of the subtype's used sets and its node's tested state to `nextTask` and the frame picker within the p95 budgets of SPC-0190's Baselines table, 100 ms for `nextTask` and 50 ms for task generation, and the projection's pass over `item_shown` fits the 60 s budget of a full recompute over a year of log.

### Growth

`first_exposures` drains nothing, since each row is a one-time observation. At 20,000 rows it reports `first_exposures_ceiling` once. A context hold that has lasted 120 game days on a subtype reports `transfer_hold_long` for that subtype once, and the hold continues. Parked candidates count towards the per-structure candidate cap of SPC-0130 and expire at 60 days.

### The report's transfer section, after the MVP

After the MVP, the report's transfer section reads only eligible `first_exposures` rows. It shows near and far transfer apart, each pooled across the graph and by domain (REQ-6968), and never a figure for a single node (REQ-6970). Each figure shows the share «сама», the count of eligible observations and its 80 % interval under ADR-0380's rules, with the mean `expected` of the observations it counts beside the share (REQ-6972). A figure that rests on fewer than 10 eligible observations reads «мало данных» with its count (REQ-6974), and this floor is registered for the transfer measure in `src/parent/measures.ts` under ADR-0380.

The section defines near transfer as «новый формат или сюжет знакомого подтипа» (a new format or setting of a known subtype) and far transfer as «новый подтип, пререквизиты которого освоены» (a new subtype whose prerequisites she has mastered) (REQ-6976). It states «Игра не видит, что прошли в школе» (the game can't see what school has taught) (REQ-6978). Its strings live under `parent.transfer.*` in `ru.json`. The section carries no interpretation line.

### Acceptance test 2

Verify group 3's 60-day simulation checks four things (REQ-6980). It finds at most one `firstExposure` per subtype, per subtype-and-format pair and per subtype-and-context pair, and exactly one for each such pair shown in the simulation and not used up by a higher kind at the same show. It finds no subtype with templates in both formats showing its context format before its node is fluent by a tested result or 14 game days have passed. It finds no subtype with at least 2 contexts with an accepted frame showing its last unshown context before its node is fluent by a tested result. And it finds the half-bare rule of SPC-0290 holding on every node.

### What the MVP holds

The MVP holds the context list, the context on every accepted frame, `contexts` on templates, both holds, the side-slot rule and `first_exposures`, as ADR-0380 sets addendum 2's MVP scope. The report's transfer section and the profile's transfer bar come after the MVP, the bar as ADR-0390 builds it. The Dutch probe slot exists only once ADR-0430 builds it, after the MVP. Frames in English or Dutch carry tags from the same list, and a context first met in Dutch counts as met. Any Dutch text shown to the player beyond addendum 1's bridge keywords, the probe's text included, waits on the owner amending the Russian-only rule in `CLAUDE.md`.

## Failure paths

| State | What happens | Audience |
| --- | --- | --- |
| `context_unknown`: a `frame_accepted` event names a tag missing from `content/contexts.yaml` | the server refuses to start until the list holds the tag again | the owner, at start-up |
| `contexts_append_only` fails | the build fails until the removed or renamed tag is back with its `since` | the owner, in verify |
| `template_one_context` | the build passes with a warning, and the template gives no context hold | the owner, in verify and as a count in `./meowtower status` |
| A template holds `formats`, a context template has no `contexts`, an empty list or an unknown id, or a frame has no `context` | the schema refuses it and the build fails | the owner, in verify |
| `source_in_track` fails | the build fails until the template's subtype belongs to a Sources track node | the owner, in verify |
| `frame_untagged`: a library frame whose acceptance lacks `context` | the frame isn't served; reported once at start | the owner |
| `frame_context_missing`: the parent marks a candidate «нет подходящего сюжета» | the candidate waits for a list version with a fitting context, or expires at 60 days | the parent, as a count on the frame review screen |
| `transfer_hold_no_frame`: the context hold leaves no frame for a template | the item builder takes another template of the subtype, then a bare template, then the Director another subtype | the owner, as a count in `./meowtower status` |
| A structure's every unmet frame is held or left out and every other frame was shown in the last 14 game days | the frame shown longest ago among those not left out by the context hold or the side-slot rule is used, with `frameRepeat: true` (REQ-6982) | nobody; the log marks it |
| `transfer_hold_long`: a context hold has lasted 120 game days | the hold continues | the owner, once per subtype in `./meowtower status` |
| `first_exposure_version_missing`: a rebuild can't load a model file | the rows under that version read `eligible: false`, `reason: version_missing`, `expected: null`; reported once at start | the owner |
| `model_files_kept` fails | the build fails until the missing `content/model.vN.json` is back | the owner, in verify |
| `model_reads_no_transfer` fails | lint fails until the import is removed | the owner, in verify |
| `first_exposures_ceiling`: the projection passes 20,000 rows | nothing is deleted; reported once | the owner, in `./meowtower status` |

The player sees none of these states, and every one ends in an ordinary task.

## Open findings

- REQ-6956 asks a Dutch probe presentation to take a frame whose context has been shown on the subtype. ADR-0430 gives a probe letter its frame from an approved probe pair, which is no library frame and which neither ADR-0410 nor ADR-0430 gives a context tag. This document states that a letter's show adds no context to `first_exposures`, as it does for any frame without a `frame_accepted`, and leaves open how a letter meets REQ-6956. Both parts come after the MVP.
- ADR-0430 says every projection other than `nl_probe` skips an attempt whose `forms` holds `nl_probe`, and that transfer takes no observation from a letter. ADR-0410 marks every side-slot show used, a Dutch probe presentation included. This document reads the two together: the letter's show marks its subtype and format used, and its attempt gives no observation. If ADR-0430's rule means the projection skips the show as well, the two decisions disagree on whether a letter spends a first encounter, and I don't choose.
- ADR-0410 names the operator command `./tower status`. SPC-0010 names the command `./meowtower`, and this document uses that name.

## Open review findings

- The first agent review found that SPC-0130, SPC-0040, SPC-0070 and SPC-0290 don't yet hold REQ-6928, the frame picker's new steps, the format hold or `transfer_hold`, so this document's cross-references point at text not there yet, and asked me to amend them or state REQ-6928 here. I rejected it: those documents take ADR-0410's amendments in the same change of addendum 2, SPC-0130 takes REQ-6928 in place of REQ-3610, and stating REQ-6928 here would state one rule in two documents.
- The first agent review asked what a show with no active model version holds. Neither ADR-0410 nor REQ-6942 says. I chose `expected: null` with condition 8 or 9 as its reason, because with no model no node is fluent by a tested result, and `version_missing` names a file a rebuild can't load.
- The second agent review found that `version_missing` comes last in the eligibility order, while ADR-0410 also says a row whose model file can't load reads `version_missing`. I stated that such a row reads `version_missing` whatever conditions 1 to 9 give, because conditions 8 and 9 can't be read without the model file and ADR-0410's realisation test 7 expects `version_missing`. The eligibility order in ADR-0410 itself is unchanged.
- The second agent review asked whether a hold ends for good. ADR-0410 says each hold "ends" when the node is fluent by a tested result. I read that as a one-time release, so a node that later drops below fluent, or a context added after the release, brings no hold back. A decision should confirm this reading.
- The second agent review asked whether a block top-up that falls back to a library frame, because its subtype has no shown context, still counts as a side slot. Neither ADR-0410 nor REQ-6946 says, and the answer decides whether its new context can be an eligible near observation. I left it open for a decision.
- The second agent review noted that REQ-6936 says `first_exposures` is computed from "the event log alone", while this document also reads the versioned content files, as ADR-0410 does for `expected` and the graph version. I kept ADR-0410's reading, and a check of REQ-6936 has to allow the content files.
- The first agent review asked for the reasons behind the hold's rank above the side-slot fallback and the repeat rule, the 20,000-row ceiling and the 120-game-day report. I kept them without reasons, because a specification states what the system does and never why (S8), and ADR-0410 holds each reason.
