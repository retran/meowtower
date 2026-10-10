---
id: ADR-0410
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-6900, REQ-6902, REQ-6904, REQ-6906, REQ-6908, REQ-6910, REQ-6912, REQ-6914, REQ-6916, REQ-6918, REQ-6920, REQ-6922, REQ-6924, REQ-6926, REQ-6928, REQ-6930, REQ-6932, REQ-6934, REQ-6936, REQ-6938, REQ-6940, REQ-6942, REQ-6944, REQ-6946, REQ-6948, REQ-6950, REQ-6952, REQ-6954, REQ-6956, REQ-6958, REQ-6960, REQ-6962, REQ-6964, REQ-6966, REQ-6968, REQ-6970, REQ-6972, REQ-6974, REQ-6976, REQ-6978, REQ-6980, REQ-6982]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0410. Every accepted frame carries one context tag from a list that only grows, the Director holds each subtype's context format until its node is fluent or 14 game days pass and its last unshown context until its node is fluent, and the projection `first_exposures` computes every first encounter from the log

## Decision

The game measures transfer from first encounters it keeps for that purpose. Every frame names the situation its problem is set in, so the log can tell a first context. The Director keeps one context format and one context of each subtype back until the subtype's node is fluent, so a first encounter still exists after mastery. A projection reads the log and marks each first encounter, eligible or not, for the report after the MVP. This record builds on ADR-0380, which owns addendum 2's cross-cutting rules: the report's counts, 80 % Wilson intervals and «мало данных» (too little data) floors, interpretations worded as checks, the four states, the owner of each new event type and field, the rule for adding fields to `item_shown` and other events, and the MVP scope. I cite ADR-0380 for those and don't restate them. The owner's addendum 2 of 2026-09-28, item 4, is the instruction, and RES-4230 is the research.

### The list of contexts

`content/contexts.yaml` holds the closed list of contexts (REQ-6900). An entry has an `id` matching `^[a-z][a-z0-9_]*$`, because the id becomes a key under `parent.contexts.<id>` in `ru.json`, such as `motion_boat` or `motion_walk`, a one-line English `describe` that the frame request passes to the author model, and `since`, the list version that added it. The parent reads each context by a Russian label under `parent.contexts.<id>` in `ru.json`, as ADR-0160 keeps every string. A tag carries no language, so frames in English or Dutch can later carry the same tags.

The list changes only by gaining an entry (REQ-6902). ADR-0190's group 1 gains the check `contexts_append_only`: it reads the committed file with `git show HEAD:content/contexts.yaml`, and fails when an `id` of that version is missing from the working tree or its `since` changed, because a removed or renamed tag would change which past shows count as first. A tag added later never retags an accepted frame (REQ-6904), because the log holds each frame's context in its `frame_accepted` event and the game never writes a second acceptance for a frame it already accepted. At start-up the server refuses to start with `context_unknown` when a `frame_accepted` event names a tag missing from the list, which can happen only when somebody deleted a tag and skipped the check.

I chose a committed file over a Parent Room form that writes new tags as events, because the list is content that the author model's request and the template schema both read. The parent adds a context by adding an entry and committing the file, the way the owner already commits `content/frames.ru.json` (ADR-0130). The first list holds the settings of RES-0700's seven word-problem structures and ADR-0130's floors, drafted by the building agent and read once by the owner.

### Templates and formats

A template's format stays ADR-0290's single `format`, `bare` or `context` (REQ-6918). The template schema refuses a field named `formats`, so the addendum's list can't creep in as a second declaration of one fact. A template of the context format gains `contexts`, a non-empty list of ids from `content/contexts.yaml` that its structure admits (REQ-6910). The schema refuses an empty list or an unknown id, and group 1's check `template_one_context` warns, without failing the build, when a context template lists fewer than 2 (REQ-6912). It warns because some structures admit only one honest setting, and a template that admits one still teaches; `./tower status` shows the count of such templates to the owner.

The addendum's two other formats keep the homes the approved record gives them. An inverse problem, such as a side from the perimeter, is a subtype or node of its own in `content/graph.yaml` (REQ-6920). The schema allows no third format, so an inverse problem can't enter as a format of the direct subtype. A task built on a table, chart, timetable or map belongs to a node of ADR-0300's Sources track (REQ-6922). Group 1's check `source_in_track` fails a template with `inputClass: "source"` whose subtype belongs to a maths node. A maths word problem that quotes one number from a small table keeps its maths node, because its `inputClass` isn't `source`.

### Frames carry their context

Every frame carries exactly one `context` from the list (REQ-6900). ADR-0130's frame request gains the context it asks for (REQ-6908). `npm run frames:generate` asks, for each structure, for the listed context with the fewest accepted frames of that structure, ties broken by list order, so the library spreads each structure's frames across the contexts its templates list. The frame review screen shows each candidate's context by its Russian label. The parent keeps it, changes it to another listed context, or marks it «нет подходящего сюжета» (no fitting setting). A candidate marked so stays unaccepted with `frame_context_missing` until a new list version holds a context it fits (REQ-6906). The screen then offers it again, and the ordinary 60-day expiry of candidates drains it if nobody does. The requirements step chose the parent as the judge of fit, because the parent already accepts every library frame.

`frame_accepted` gains the field `context` under ADR-0380's rule for addendum 2's fields (REQ-6914). The server writes it on every acceptance from the first accepted frame, so the log holds no untagged acceptance (REQ-6932). `item_shown` gains no context field (REQ-6916), because it already names the frame by `frameId` and a second record of one fact could disagree with the first. A library frame whose acceptance lacks `context` is never served, and the server reports `frame_untagged` once at start.

### The holds

Both holds run from the player's first adventure (REQ-6932), because a first encounter spent in training can't be recovered. Each hold ends when the subtype's node is «бегло» (fluent) or «устойчиво» (stable) by a tested result, a probe or a full block, and never by an inferred state. An inferred state doesn't end a hold, because it is the model's prediction from her prerequisites, and a first encounter after a prediction would test the prediction and not her mastery. I call this "fluent by a tested result" below, and ADR-0060 computes it.

The format hold applies to a subtype with templates in both formats. From the subtype's first show, the first show included, the item builder takes only its bare templates. The hold ends when the node is fluent by a tested result or when the 14th game day after the first show's game day begins, whichever comes first (REQ-6924). The owner's "first 2 weeks" is read per subtype, as RES-4230 decided, so a subtype first met in month three is held too. The format hold has a cap and the context hold has none, because the format hold keeps every word problem of the subtype from her, and word problems are half of Cito's items (RES-4080), while the context hold keeps one setting out of several. The format hold runs before ADR-0290's half-bare rule. A held subtype takes bare whatever the node's count, so the node's bare share only rises, and REQ-5864's half-bare rule still holds. Holding bare back instead could break that rule on a node whose other subtypes have no bare template (RES-4230).

The context hold applies to a subtype whose contexts with an accepted frame number at least 2. A subtype's contexts are the union of the `contexts` of its context templates, and a context counts only where a frame of that template's structure carries it. While exactly one of those contexts hasn't been shown on the subtype, the frame picker never shows a frame of that context on the subtype, until the node is fluent by a tested result (REQ-6926). The context hold has no time cap, so a subtype that never becomes fluent never meets its last context. When the list or the library grows and a second context becomes unshown, neither is held until one of them is shown. So the hold always keeps exactly one unshown context while at least 2 exist, whichever one comes last.

While either hold is active on a subtype, the `why` field of every `item_shown` of that subtype includes `transfer_hold` (REQ-6930), because the owner audits the Director's choices through `why`. The API never sends `why` to the client (ADR-0070).

### Side slots take what she has met

A warm-up, a twin, a retention check, a Dutch probe presentation, a task with a non-empty `forms` and a task on a live frame are side slots. None of them gives a clean first encounter: a warm-up isn't graded, a twin follows feedback, and the others measure something else. For a side slot, the Director chooses a subtype that has been shown, and the item builder a format that has been shown on it, whenever one fits the slot (REQ-6954). The frame picker then chooses a frame whose context has been shown on that subtype whenever one exists (REQ-6956). When nothing shown fits, as in the first warm-up of her first adventure, the slot takes a new one, and the projection marks it used and ineligible. A held context is never shown in a side slot, because the hold ranks above this fallback.

Live frames serve only ADR-0130's block top-up slots. A live frame request names a context already shown on the slot's subtype. When the subtype has no shown context, the top-up task takes a library frame, which the log can tag. A live frame therefore never brings a new context, and the projection never needs a context for a live show. When the parent moves a live frame to the library, its `frame_accepted` records the context its request named.

### The frame picker

The frame for a library task is chosen in this order, replacing ADR-0130's rule:

1. Take the accepted frames of the task's structure and locale.
2. Leave out every frame of a context the context hold keeps back for the task's subtype.
3. In a side slot, leave out every frame whose context hasn't been shown on the subtype, unless that leaves none.
4. Among what remains, take a never-shown frame first, then the least recently shown frame, with ties broken by the task's seed.

The game never shows a frame it showed in the last 14 game days while the structure has a frame it hasn't shown, unless every unshown frame was left out in step 2 or 3 (REQ-6928). In that case it takes the frame shown longest ago among those not left out (REQ-6982), and `item_shown` carries `frameRepeat: true` as before. The hold outranks the repeat rule, because a repeat costs one familiar text that the log marks, while a released context costs the subtype's only near observation after mastery. When steps 1 and 2 leave no frame for a template, the item builder takes another template of the subtype, then a bare template, then the Director takes another subtype, and the server counts `transfer_hold_no_frame`.

### The projection `first_exposures`

`first_exposures` is a `knowledge` projection in ADR-0020's registry, computed from the log and the versioned content files alone (REQ-6936). It reads, show by show in `seq` order, the subtype and `format` from `item_shown`, and the context from the `frame_accepted` of the show's `frameId`, for a library frame. A bare task and a live frame add no context. The projection holds the set of used subtypes, used subtype-and-format pairs and used subtype-and-context pairs. It gives a `firstExposure` on the first show of a subtype, of a subtype in a format and of a subtype in a context, at most once for each (REQ-6934). When a show is new on several counts, it gets one `firstExposure` of the highest kind, subtype before format before context, and the other pairs become used with no observation of their own (REQ-6944). The owner fixed `firstExposure` as a value on the show. I keep it off `item_shown`, as ADR-0380 keeps derivable facts out of payloads, so the projection can be corrected when the list of contexts grows.

Each `firstExposure` carries:

| Field | Value |
| --- | --- |
| `kind` | `subtype`, `format` or `context` (REQ-6938) |
| `distance` | `far` for `subtype`, `near` for `format` and `context`, fixed to `kind` (REQ-6940) |
| `eligible` | whether the encounter counts as a transfer observation |
| `reason` | the first failing condition when not eligible, from the list below |
| `expected` | the model's chance of success for the subtype at the show, by ADR-0070's formula, under the model, threshold and graph versions active at that show (REQ-6942) |
| `category` | for the first attempt, the depth-of-help category of item 3's weekly breakdown |
| `transferred` | true only when `category` is «сама» (on her own) |

An encounter is eligible only when every condition below holds, and `reason` names the first that fails, in this order (REQ-6946, REQ-6948, REQ-6950):

1. `no_attempt`: the show has a first attempt.
2. `side_slot`: the show fills none of the side slots, so its `forms` is empty too, since a task with a non-empty `forms` is a side slot.
3. `not_graded`: the first attempt is graded.
4. `excluded`: the parent hasn't excluded the attempt through `item_excluded`, because ADR-0180 drops an excluded attempt from every measure. I chose this, since REQ-6946 doesn't name exclusion and a measure that kept excluded attempts would contradict ADR-0180.
5. `rapid_guess`: the `verdict` carries no `rapidGuess: true`.
6. `fatigue`: the attempt doesn't carry ADR-0070's fatigue weight.
7. `lesson_mark`: no lesson mark on the node falls in the 21 game days before the show. The 21 days match addendum 2's rule for retention.
8. For `subtype`, `no_prerequisites`: the node has at least one prerequisite, so a Sources track node gives no far observation. `prerequisites_not_fluent`: each prerequisite is fluent by a tested result at the show.
9. For `format` and `context`, `node_not_fluent`: the node is fluent by a tested result at the show.
10. `version_missing`: the model file of the version active at the show loads.

A walkthrough before the encounter keeps it eligible (REQ-6952). A near observation follows training on its own subtype by design, and a far one's earlier walkthroughs are of prerequisites, whose mastery is the condition far transfer tests.

The observation is the first attempt alone (REQ-6958). A later attempt on a met subtype, format or context never counts (REQ-6962), because it follows the first attempt's feedback. `category` sorts the first attempt into the four categories of item 3's weekly breakdown. The decision from RES-4220 defines them: «сама» (on her own), «хватило первой ступени» (rung 1 was enough), «с опорой» (with support, rungs 2 to 3) and «требует обучения» (needs teaching). Only «сама», a right answer with no hint before it, counts as transferred, and every other category counts as not transferred (REQ-6960). A hinted first attempt stays an observation of failed transfer, because she opens the ladder exactly when she can't transfer, and dropping those attempts would push the share up.

`expected` and the tested states in conditions 8 and 9 are read under the versions active at the show, because the report compares each share with the chance the model gave at the time. The log records every version change as `model_activated`, `settings_changed` or `fact_threshold_set`, and ADR-0060 keeps each model's parameters in `content/model.vN.json`. A full recompute therefore keeps the model-derived fields of every row whose show fell under an earlier version set, and recomputes the rest from the log. This is the rule SPC-0020 already applies to `node_snapshots`. A rebuild after the table is lost replays each version set over the part of the log it governed. Group 1's check `model_files_kept` fails a build that lacks `content/model.vN.json` for any version below the current one. When a rebuild still can't load one, the row reads `eligible: false` with `reason: version_missing` and `expected: null`, and the server reports `first_exposure_version_missing` once at start.

The first-encounter attempts keep counting in "on her own" as ordinary tasks of their node (REQ-6964). `first_exposures` feeds no estimate, state, probe or block, only the holds and the report (REQ-6966). The lint check `model_reads_no_transfer` fails when code under `src/engine/model/` or `src/engine/states/` imports `first_exposures`. The holds read the used sets, which depend on no version, and the node's tested state as the knowledge model recorded it under the versions active at the time, the rule SPC-0020 applies to `node_snapshots`, so a replay releases a hold on the same show as play did, whatever the current version.

### The report after the MVP

The report's transfer section answers one question the owner asked in addendum 2: does what she has mastered carry to a new setting or format, and to a new subtype built on mastered prerequisites? It reads only eligible `first_exposures` rows. It shows near and far apart, each pooled across the graph and by domain (REQ-6968), never for a single node (REQ-6970), because a node's figure would rest on one or two encounters. Each figure shows the share «сама», the count of eligible observations and its 80 % interval under ADR-0380's rules, with the mean `expected` of the observations it counts beside it (REQ-6972). A figure on fewer than 10 eligible observations reads «мало данных» with its count (REQ-6974), the floor this measure owns under ADR-0380. The section defines near as «новый формат или сюжет знакомого подтипа» (a new format or setting of a known subtype) and far as «новый подтип, пререквизиты которого освоены» (a new subtype whose prerequisites she has mastered) (REQ-6976). It states «Игра не видит, что прошли в школе» (the game can't see what school has taught) (REQ-6978), because a first encounter in the game may be a subtype her class practised the day before. The strings live under `parent.transfer.*` in `ru.json`. The section adds no interpretation line: a line comparing the share with the mean `expected` joins ADR-0380's fixed list only through a record of its own.

### What works once accepted, and what doesn't yet

Once accepted, every accepted frame names its context, templates list theirs, both holds run from the first adventure, side slots spend no new subtype, format or context while a met one fits, and `first_exposures` marks each first encounter with its eligibility, category and `expected` from the log. The MVP holds these parts, as ADR-0380 sets its scope. The holds need only the tested states of ADR-0060. Before the knowledge model exists, no node is fluent by a tested result, so the format hold releases at 14 game days and the context hold keeps its context. A stage without the holds still plays, because a hold only narrows a choice the item builder and the frame picker already make. What doesn't work yet: the report's transfer section and the profile's transfer bar, which come after the MVP, the bar as ADR-0390 builds it; frames in English and Dutch, which reuse the tags; and the Dutch probe slot, which exists only once ADR-0430 builds it. Any Dutch text shown to the player beyond addendum 1's bridge keywords waits on the owner amending the Russian-only rule in `CLAUDE.md`.

## Why

A first encounter measures transfer only while it is still unspent and she has mastered what it builds on. The frame rule shows never-shown frames first, so without a hold every context of a subtype is spent in the 5 to 10 tasks before its node is fluent (RES-4230, "The frame rule spends never-shown frames first"). The owner's calendar reserve of two weeks doesn't follow mastery: a node she meets about once a week isn't fluent in two weeks, so most held variants would release while she is still learning (RES-4230). The mastery-gated hold is the only option that keeps one near observation per subtype for after mastery while every approved rule still holds.

Only the context format can be held. Holding bare could break ADR-0290's half-bare rule on a node whose other subtypes have no bare template, while holding context only raises the bare share (RES-4230, "Holding back the context format never breaks the half-bare rule"). The context lives on the frame, because a word problem's text comes from a frame chosen apart from the template. Only the frame's own acceptance can record where the problem is set (RES-4230, "The record has no notion of a task's context"). A tag added later would mean classifying every accepted frame again, and the hold couldn't run at all, so the tags come from the first frame (RES-4230, "The reserve and the frames' context tags can't be added later").

The variability evidence says the holds cost little learning. More experienced learners gain from high variability and novices from low (Likourezos, Kalyuga and Sweller 2019, in RES-4230), so holding variety back until a subtype is fluent follows the evidence, though the sample was adults. A hint before the answer removes the recognition part of a transfer test (Barnett and Ceci 2002, in RES-4230), which is why a hinted first attempt counts as not transferred. Near and far have no agreed meaning in that literature, so the report defines both words in the parent's language.

Far transfer as the addendum defines it is an event the approved model already produces: the first probe of a node she has never met, after her prerequisites are tested (RES-4230, "Far transfer ... is the event the approved model already tests by inference"). So far observations need no hold, only the eligibility rule that drops cold start's placement probes through `prerequisites_not_fluent`.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: drop item 4 and keep frames and formats as they are | No change, no field, no hold on variety, and no figure that invites over-reading | The profile's transfer dimension stays empty, so a node that fails in a new setting looks like one that doesn't, which ADR-0380's falsifiability rule forbids |
| Record only: tag contexts and compute `first_exposures`, with no hold | The smallest change that makes the log complete, and training variety stays as it is | The frame rule spends new contexts first and the half-bare rule brings the context format within a few tasks, so almost every near observation falls before mastery and is ineligible |
| The addendum's time rule: hold formats and contexts for the game's first 2 weeks | A rule a test checks in one line, in the owner's words | Two weeks doesn't track mastery, most held variants release while she is still learning, and a subtype first met in month three gets no hold at all |
| A format hold until fluent with no cap, like the context hold | Every format observation of a subtype falls after mastery, where the 14-day cap loses those of slow nodes | A slow subtype would show no word problem for months, and word problems are half of Cito's items (RES-4080); the owner's own reserve was two weeks |
| A mastery-gated hold: the context format until fluent or 14 game days, the last unshown context until fluent | One near observation per subtype after mastery by construction, with every approved rule intact | Chosen; its costs follow |
| Dedicated transfer checks: a purpose of their own, planned after mastery, with frames written only for them | Clean tests at a fixed distance, like the measures of Fuchs and Fuchs (2005), independent of training | More frames for the parent to accept, more slots in a full day, and a second system beside the hold for a figure that stays pooled |

Two smaller choices had alternatives too. A `context` field on `item_shown` would make the projection simpler, but REQ-6916 forbids it, since the frame already names the context. A context list kept in the log through a Parent Room form would let the parent add a tag without a commit. It lost, because the template schema and the frame request read the list at build time, and two sources of one list would drift apart.

## What it costs

The player pays in variety. For up to 14 game days after a subtype's first show she meets it only as bare sums, while word problems are half of Cito's items (RES-4080). Each subtype introduced through the year pays this again. A slow subtype keeps one context unseen for months, so her training misses that setting until the node is fluent. While a structure has only 5 frames, as at stage 0.2, the context hold makes some frames repeat within 14 game days, each flagged `frameRepeat`.

The observations are few. RES-4230 estimates a few eligible observations a week and at most one or two per subtype over a school year, fewer for nodes cold start reaches. The format observation of a node slower than 14 game days falls before mastery and is ineligible. The report's transfer figures will read «мало данных» for most of the first months. The holds are built into the MVP for a figure the parent reads only later, and that is the price of an encounter that can't be recovered once spent.

The building agent and the owner pay once. They draft `content/contexts.yaml` and its labels, add `contexts` to every context template, and tag every candidate still waiting when the list arrives, which the review screen does on acceptance. The game accepts no frame before this record is built, so no untagged acceptance has to be repaired. From then on, each frame request names its context at no extra model cost.

The parent pays a few seconds a frame: reading one more line on the review screen and, rarely, changing a context or marking «нет подходящего сюжета». The parent is never needed in real time, and the design sends the parent no notification, so its interruption budget is zero. If nobody opens the Parent Room for two weeks, or a month, play goes on: the holds run on tested states, the projection counts, and parked candidates wait and expire after 60 days like every candidate (ADR-0130). No data is lost and no queue grows past the candidate cap.

The server pays in lookups. The hold adds a lookup of the subtype's used sets and its node's tested state to `nextTask` and the frame picker, inside the p95 budgets of 100 ms for `nextTask` and 50 ms for task generation in ADR-0190's Baselines table. The projection adds a pass over `item_shown` to the full recompute. It keeps earlier versions' fields, so it replays no old version on an ordinary recompute and stays inside the 60 s budget for a year of log.

Accumulation has ceilings. `first_exposures` holds at most one row per subtype, subtype-and-format pair and subtype-and-context pair, so it is bounded by about 200 subtypes times 2 formats and the length of the context list: about 8,600 rows at 40 contexts. It reports `first_exposures_ceiling` once to the owner in `./tower status` at 20,000 rows, a ceiling I chose because only a much larger graph or list reaches it. It drains nothing, because each row is a one-time observation. Parked candidates count towards ADR-0130's per-structure candidate cap and drain by its 60-day expiry. A context hold that outlasts 120 game days reports `transfer_hold_long` for that subtype once to the owner. I chose 120, because a node met about once a week has then had some 17 meetings, far past the 5 to 10 tasks RES-4230 expects before fluency.

The security boundary protects the measurement from being seen, most likely damage first. A packet that exposed `why` or the hold would tell the player why she met no word problems; ADR-0070 already keeps `why`, `purpose` and `flowSlot` off the API. A context tag, a template's `contexts` and a frame request carry no data of hers, so nothing this decision adds leaves the Mac.

Failure states, each with its next step and one audience:

| State | Next step | Audience |
| --- | --- | --- |
| `context_unknown` | the server refuses to start until the list holds the tag again | the owner, at start-up |
| `contexts_append_only` fails | the build fails until the removed or renamed tag is back | the owner, in verify |
| `template_one_context` | the build passes with a warning; the template gives no context hold | the owner, in verify and as a count in `./tower status` |
| `frame_untagged` | the frame isn't served | the owner, reported once at start |
| `frame_context_missing` | the candidate waits for a list version with a fitting context, or expires at 60 days | the parent, as a count on the frame review screen |
| `transfer_hold_no_frame` | the item builder takes another template, then bare, then the Director another subtype | the owner, as a count in `./tower status` |
| `transfer_hold_long` | the hold continues | the owner, once per subtype in `./tower status` |
| `first_exposure_version_missing` | the row stays ineligible with no `expected` | the owner, once at start |
| `first_exposures_ceiling` | nothing is deleted | the owner, once in `./tower status` |

The player sees none of these states, and every one ends in an ordinary task.

The strongest objection: the owner asked for a two-week reserve and a `formats` list, and I replace both with rules the owner didn't ask for, a per-subtype cap and a context hold with no cap. I then build them into the MVP for a figure that will read «мало данных» for months and may never pass its floor for far transfer at all. If the parent never looks at the transfer section, the player has paid in word-problem practice for nothing. I accept it for two reasons. An encounter spent in training can't be recovered, so a hold added later measures only the subtypes she hasn't met yet. And the reversal conditions below release the format hold, cap the context hold or reopen both once the counts show they yield too little.

## What would reverse it

- If, among the subtypes with both formats first shown in the 90 game days after ADR-0060's tested states exist, fewer than 1 in 3 reach fluent by a tested result before their 14-day cap, the format hold yields almost no eligible format observation and costs word problems for nothing, and the format hold goes back to recording only. I chose 1 in 3 and 90 game days, because below that share the format hold costs every held subtype practice to give a third of them an observation, and 90 game days give about 30 such subtypes, enough to read the share.
- If after 180 game days the pooled eligible near observations number fewer than 10, the holds cost practice without producing a figure above its floor, and the owner chooses between dedicated transfer checks and dropping the holds. The 10 is the floor this measure owns, and 180 game days are about two school terms, RES-4230's estimate for a domain to reach 10.
- If, at stage 0.4 with 20 frames a structure, `frameRepeat` marks more than 1 in 4 shows of a structure with a context hold over any 14 game days, the hold costs more variety than RES-4230 expected. The context hold then goes off on that structure, and `frames:generate` asks for frames of its other contexts until each has at least 5 accepted frames, when the hold comes back on. I chose 1 in 4, because at 20 frames a structure a quarter of repeats means the hold, not the library, is limiting variety.
- If far observations stay below 10 eligible ones after 180 game days, cold start and island checks have spent the far encounters, and the owner reopens whether far transfer is reported at all.
- If more than 1 in 4 subtypes under a context hold reach `transfer_hold_long`, the uncapped hold keeps settings from her longer than the observations are worth, and the context hold gets a cap of 120 game days. The 1 in 4 matches the other thresholds here, a share I chose as the point where a cost falls on a noticeable part of the graph.
- If more than 1 in 4 context templates list one context by `./tower status`'s count of `template_one_context`, the list is too coarse to leave anything to hold, and the list's granularity is reopened.
- If the parent marks more than 1 in 5 candidates «нет подходящего сюжета» over 50 candidates, the list is too narrow for the model's settings, and the list is widened. I chose 1 in 5 over 50 candidates, because ADR-0130's automatic checks already reject off-request text, so a fifth left without a fitting tag points at the list.

The premortem, written as though it had happened: a year in, the transfer section still read «мало данных» for far transfer and showed near transfer at 11 of 14. The contexts had been drafted too coarse. `shopping` covered every price structure, so most subtypes had one context, the warning `template_one_context` had fired on 40 templates and was ignored, and the context hold ran on almost nothing. The format hold had released most subtypes at 14 game days before they were fluent, so the near figure rested almost entirely on the few subtypes she learned fast, and its mean `expected` of 0.9 said so. Meanwhile far observations were ineligible, because cold start and island checks probed most nodes before their prerequisites were tested. The first reversal condition, the one on the count of `template_one_context` and the one on far observations exist for these failures.

## Consequences

- ADR-0020's event catalogue: `frame_accepted` gains `context`, and the projection registry gains `first_exposures` in the `knowledge` class with earlier versions' model-derived fields kept.
- ADR-0040's template schema gains `contexts` on context templates, refuses `formats`, and the item builder applies the format hold and the side-slot rule.
- ADR-0070's `nextTask` prefers a shown subtype for a side slot, and `why` gains `transfer_hold`.
- ADR-0130's frame record, request, review screen, live queue and picker change as the Decision states.
- ADR-0180's report gains the transfer section after the MVP, and the frame review screen gains the context line and «нет подходящего сюжета».
- ADR-0190's group 1 gains `contexts_append_only`, the `contexts` and `formats` schema rules, `template_one_context`, `source_in_track`, `model_files_kept` and `model_reads_no_transfer`. Group 3's 60-day simulation gains acceptance test 2 of REQ-6980. The Baselines table gains the rows for the `first_exposures` ceiling of 20,000 rows and the 120-game-day hold report, both chosen here, and the 10-observation floor, owned by this measure under ADR-0380.
- New work: `content/contexts.yaml`, `parent.contexts.*` and `parent.transfer.*` strings, `contexts` on every context template, the context in every frame request, the hold in the item builder and the frame picker, and the `first_exposures` projection.

## How I will know it was realised

1. The 60-day simulation of acceptance test 2 finds at most one `firstExposure` per subtype, per subtype-and-format pair and per subtype-and-context pair, and exactly one for each pair shown and not used up by a higher kind at the same show. It finds no subtype with both formats showing its context format before its node is fluent by a tested result or 14 game days have passed. It finds no subtype with at least 2 contexts with an accepted frame showing its last unshown context before its node is fluent by a tested result, and the half-bare rule holding on every node (REQ-6980).
2. A schema test refuses a template with `formats`, a context template without `contexts`, one with an unknown id, and a frame without `context`; `template_one_context` warns on a template with one context and the build passes.
3. A verify test deletes a tag from `content/contexts.yaml` in a commit and `contexts_append_only` fails; a start-up test with a `frame_accepted` naming a missing tag refuses to start with `context_unknown`.
4. A picker test on a structure with 5 frames in 2 contexts, one held, never shows the held context, repeats the frame shown longest ago among the others with `frameRepeat: true`, and shows the held context once the node's tested state reaches fluent.
5. A side-slot test fills a warm-up, a twin, a retention check, a bridge task and a live top-up on a subtype with one shown context and one unshown context, and every frame carries the shown context. The first warm-up of an empty log takes a new one, which the projection marks used with the reason `side_slot`.
6. A projection test on a fixture log gives each of the eleven reasons once, the highest kind on a show new on three counts, `transferred` only for «сама», and no observation for a second attempt.
7. A recompute test activates a second model version and finds the `expected` of shows before the activation unchanged; a rebuild with `content/model.v1.json` removed gives `version_missing` on those rows.
8. The `why` of every `item_shown` of a held subtype in the simulation includes `transfer_hold`, and no API response holds `why`.
9. After the MVP, a report test on a fixture log finds near and far apart, by the graph and by domain, no node figure, «мало данных» with its count below 10, the mean `expected` beside each share, both definitions and the note on school.

## Amends

- ADR-0130: "Each frame records its structure, locale, floor, characters and the role of each number placeholder, and has a content hash" becomes the same list with "and one context from `content/contexts.yaml`".
- ADR-0130: step 1's request "carries a structural specification" becomes that specification plus the context it asks for, chosen as the listed context with the fewest accepted frames of the structure.
- ADR-0130: "Acceptance writes a `frame_accepted` event holding the frame's text and hash" becomes an event holding the frame's text, hash and `context`, and the review screen offers the context with a change control and «нет подходящего сюжета».
- ADR-0130: "The frame for a task is the least recently shown frame of its structure and locale in the library, with never-shown frames first and ties broken by the task's seed ... (REQ-3610) ... (REQ-3612)" becomes this record's four-step picker with REQ-6928 and REQ-6982.
- ADR-0130: a live frame request names a context already shown on the slot's subtype, and a top-up slot on a subtype with no shown context takes a library frame.
- SPC-0130: the frame row, the `frame_accepted` row, the picker paragraph, the live queue paragraph and the failure table change as the ADR-0130 lines above, and the failure table gains `frame_untagged`, `frame_context_missing` and `transfer_hold_no_frame`.
- ADR-0040 and SPC-0040: the template interface gains `contexts` on a template with `format: "context"`, and "The item builder picks the template of the named subtype for the wanted answer kind" becomes that pick under the format hold and, for a side slot, a format already shown on the subtype when one fits.
- ADR-0290 and SPC-0290: the half-bare rule "a bare template whenever the node's bare scored tasks of the last 30 days number no more than its context ones" gains a first step: a subtype under the format hold takes a bare template whatever the count.
- ADR-0070 and SPC-0070: `why` gains the value `transfer_hold`, and "The Director names a node, a subtype and a purpose" becomes, for a side slot, a subtype already shown whenever one fits the slot.
- ADR-0020 and SPC-0020: `frame_accepted` gains `context` under ADR-0380's rule, and the projection list gains `first_exposures`, whose model-derived fields a recompute keeps for shows under earlier version sets.
- ADR-0180 and SPC-0180: the post-MVP report gains the transfer section as this record sets it.
- ADR-0190: group 1, group 3 and the Baselines table gain the checks and rows under Consequences.

## What this does not settle

- The report's intervals, floors across measures, the wording of interpretations and addendum 2's MVP scope. ADR-0380 owns them.
- The profile's transfer bar and how it pools transfer with other dimensions. ADR-0390 owns them.
- The weekly breakdown's categories and the retention check's slot and hold. The decision from RES-4220 owns them; this record only reads the categories.
- Frames in Dutch. When they arrive, each carries a tag from the same list, and a context first met in Dutch counts as met.
- The Dutch probe's presentations. ADR-0430 owns them, and any Dutch text beyond addendum 1's bridge keywords waits on the owner amending the Russian-only rule in `CLAUDE.md`.
- What school has taught her. The game can't see it, and ADR-0310's school snapshots, after the MVP, don't feed `first_exposures`.
- A subtype split or renamed by a new graph version. The projection keys pairs by the subtype id of the graph version active at the show, so a new id counts as a new subtype; a mapping from old ids to new ones waits for the first graph change that needs it.
- Which contexts the first list holds, and how fine they are. The building agent drafts the list and the owner reads it once; one reversal condition watches for a list too coarse, through the count of `template_one_context`, and another for a list too narrow, through «нет подходящего сюжета».
- A comparison of the transferred share with the mean `expected` as an interpretation line. It needs its own record under ADR-0380's fixed list.
