---
id: ADR-0290
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-5800, REQ-5802, REQ-5804, REQ-5806, REQ-5808, REQ-5810, REQ-5812, REQ-5814, REQ-5816, REQ-5818, REQ-5820, REQ-5822, REQ-5824, REQ-5826, REQ-5828, REQ-5830, REQ-5832, REQ-5834, REQ-5836, REQ-5838, REQ-5840, REQ-5842, REQ-5844, REQ-5846, REQ-5848, REQ-5850, REQ-5852, REQ-5854, REQ-5856, REQ-5858, REQ-5860, REQ-5862, REQ-5864, REQ-5866, REQ-5868, REQ-5870, REQ-5872, REQ-5874, REQ-5876, REQ-5878, REQ-5880, REQ-5882, REQ-5884, REQ-5886, REQ-5888, REQ-5890, REQ-5892, REQ-5894, REQ-5896, REQ-5898, REQ-6064]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0290. The game builds the skills the Cito M7 and E7 tests measure toward horizons the parent sets, through a Cito block on every node, tracked basic facts with the Volley, a bare-task share and a home scale that changes no estimate, and never shows the player a test

## Decision

The addendum's section 8 enters the game as eight parts: Cito facts kept as checked quotations, horizons, Cito blocks with two new value terms, a fact projection with the Volley, a bare-task share, a home skill scale, the parent's Cito inputs and report sections, and two settings. Each part reads the event log (ADR-0020) and versioned data in `content/`, so a replay of the log gives the same choices and the same report. ADR-0210 owns the cross-cutting rules this decision builds on: the game day, new streams outside "on her own", what leaves the Mac, the owner of each new event type, the MVP scope, the Dutch bridge and the stage order. This decision cites them and doesn't restate them.

### Cito facts are entries with a quotation, and a check only reports

`content/cito.rules.json` holds one entry for each statement about Cito that the game's logic or report text depends on (REQ-5800). An entry has an `id`, the `statement` in English, a `url`, a verbatim `quote` from that page and the date `checkedOn`. It also has a `status` of `confirmed` or `unconfirmed`, and `usedBy`, the list of data keys and `parent.*` string keys that rest on it. A zod schema refuses a `confirmed` entry without a URL, a quotation and a date, so an unchecked claim can't enter as fact. The first twelve entries are the ten claims RES-4080 confirms, with its quotations and the date 2026-09-28, and the two it leaves open, the parent's access to the bare-versus-context split and Cito's multiplication sign, as `unconfirmed` (REQ-5808).

The Parent Room's button «Проверить сведения Cito» (Check the Cito facts) and `./tower cito-check` run one function (REQ-5806). It fetches each distinct URL in the file with a plain GET, reads the page's text, normalises white space and searches for each entry's quotation. It writes one `cito_rule_checked` event with, for each page, whether it was read and a SHA-256 hash of its text, and for each entry, whether its quotation was found. It changes nothing else: it never edits the file, never rewrites a rule and never calls a model. A PDF is read through the same local text reader the school-snapshot parser uses (RES-4100 conclusion 7).

The `cito_rules` projection gives an entry the mark «не подтверждено» (unconfirmed) when the file says `unconfirmed` or the latest check found its page but not its quotation (REQ-5802). A page the check couldn't read leaves the mark as it was, because an unreachable page says nothing about the quotation. Every report text whose key an entry's `usedBy` lists shows the mark beside it (REQ-5804). A person reads a changed page and updates the file with a new quotation and date in a commit, because only a person judges whether a changed page changes a rule. The content folder is read-only to the running game (ADR-0180), so the check can't do it.

### Horizons are parent data the player never reaches

A horizon is a Cito test moment with a date. Its identifier has the form `cito:M7`, matching `^cito:[BME][3-8]$`, and every record, data file and screen names a test moment only through that form or the formatter that prints «Cito M7» (REQ-5818). The bare M7 is the volume node and E1 to E5 are science topics, so an identifier without the prefix would be read as one of them. `content/cito.horizons.json` holds the defaults `cito:M7` on 2027-01-15 and `cito:E7` on 2027-05-15, and the parent changes a date, adds a horizon or removes one in the Parent Room, which writes `horizon_set` (REQ-5814).

The active horizon is the earliest horizon with no entered result. A Cito result entered for a horizon's moment, in any subject, ends that horizon, and the Director works toward the next one (REQ-5816). I chose any subject, because the result is the sign that the test moment has passed, and a parent who enters reading first shouldn't hold back the maths. With no horizon left, block priority takes the weight 0 until the parent sets a new one. A date that passes without a result doesn't end the horizon, because the school picks its own day inside Cito's advised period and the date is only an estimate (RES-4080). Instead, 45 days after the date the Summary shows the parent one line asking for the result or a new date. I chose 45 days because Cito's advised M period runs to about mid-February, about 30 days after the default date, and 15 days more is slack for a late school.

The player's routes carry no horizon, result, goal or Cito field in their schemas, so no player screen can show a test's date (REQ-5812). ADR-0160's forbidden-word list gains «тест» (test), «контрольная» (test paper), «экзамен» (exam), «Cito» and «Цито» for every text the player sees, so the text gate refuses a line that names a test. «проверка» (check) stays allowed, because the game already uses it for other things.

The game shows the player no copy of a Cito item, no task laid out as one and no mock test (REQ-5810). Every task still comes from a template tied to a node (ADR-0040), and no template, string or data file may quote a Cito item. A group 1 check of ADR-0190 fails on the words "Cito", "LVS" or "Leerling in beeld" in `src/templates/` or in any player string. The parent judges the rest, because a program can't tell a layout that imitates a Cito item.

### Every node carries a Cito block, and two terms join the value formula

Every node and every subtype in `content/graph.yaml` carries `citoBlock`, an integer from 1 to 6 or `null` (REQ-5820). The blocks follow the addendum's table: 1 the basic operations, 2 the times tables and division, 3 fractions, decimals, percentages and ratios, 4 measures, 5 geometry and 6 word problems. Every S node, every stretch node and every track node carries `null` (ADR-0300). I chose to require the field on subtypes too, not inherit it, so the validator reads each pair without an inheritance rule. A node's own value must be one of its subtypes' values, and the report groups the node under it. The building agent drafts the values and the parent checks them, as the addendum sets. A graph edit is a new graph version and a full recompute (ADR-0050).

A block's members are the pairs of node and subtype whose subtype carries that block. A block is ready when at least 80 % of its members belong to nodes whose tested state is «Бегло» (fluent) or «Устойчиво» (stable) (REQ-5830). Blocks 1 and 2 also need at least 90 % of their facts in «автоматизм» (automatic). I chose tested states only, because ADR-0060 keeps inferred states out of every count of tested nodes. I chose an unweighted count, because the owner's 80 % counts nodes and subtypes, not weights.

ADR-0070's value formula gains two terms and one rule:

```text
value(v) = 2.0 * uncertainty(v) + 1.5 * staleness(v) + 1.5 * frontier(v)
         + 1.5 * escalation(v) + 1.0 * stretch(v) + 1.5 * spaced_review(v)
         + 1.5 * block_priority(v)
         + max(2.0 * recheck(v), 1.5 * parent_topic(v), 1.0 * school_goal(v))
         - 1.0 * recent_shows(v)
```

`block_priority(v)` is the largest `(7 - b) / 6` among the blocks `b` that carry one of the node's subtypes and aren't ready, and 0 when all are ready, the node carries no block, or no horizon is active (REQ-5822, REQ-5816). `school_goal(v)` is 1 when a school goal the parent entered reaches the node through a link the parent confirmed, and 0 otherwise (REQ-5824). The maximum extends ADR-0070's rule that a lesson-marked node scores the larger of `recheck` and `parent_topic`, so a node reached by a goal and a fresh lesson mark scores the larger term, never both (REQ-5826). Both weights live in `content/director.v2.json`, a new version beside v1.

Priority is not a queue. The flow share still decides only between frontier and review, the three-day window and the stretch cap of 2 tasks a day stay as ADR-0070 sets them, and neither term reads the expected chance of success (REQ-5828). A 60-day simulation in ADR-0190's group 3 runs with both terms on every profile and asserts the corridor, the window, the stretch cap and the honest-difficulty property test. It is the addendum's acceptance test 10.

The school's goal list stays on the Mac, and no model reads it (ADR-0210, RES-4100). The parent pastes the list, which writes `school_goals_imported`, and each goal maps to nodes through the offline catalogue or by the parent's own hand in the mapping panel ADR-0310 sets (REQ-6050, REQ-6052, REQ-6054). The parent's confirmation writes `school_goal_mapped`. A new import replaces the previous parent-entered list, because the school hands out one list per period. A goal from a school snapshot never adds value (REQ-6058), so `school_goal` reads only goals the parent entered.

A 1S node up to the end of group 8 opens for tasks as soon as its prerequisites are ready, whatever the school has reached (REQ-5872). ADR-0070's candidate set already admits frontier nodes by their prerequisites alone, and neither the school-group setting, a school goal nor a school snapshot gates it; the school group moves only the priors of ADR-0060. A property test holds a state fixed and changes the school-group setting, and finds the same candidate set. Stretch nodes keep their gate (REQ-0820), and the game still teaches no lesson, so a player who meets a new topic first in a task gets its short solution.

### The game tracks about 300 basic facts, and the Volley practises them

`content/facts.yaml` lists every basic fact once, with a `factId`, its operands, its node and subtype and so its block (REQ-5832). The set holds the times tables 1 to 10 and their divisions, and the additions of two digits from 2 to 9 across ten with their subtractions. It also holds a digit from 1 to 9 times 10, 100 or 1000 with its division, where the table doesn't already hold it. By that definition it holds 308 facts, 200 in block 2 and 108 in block 1. `factId` reads as `mul:7x8`, `div:56/8`, `add:8+5` or `sub:13-5`. A validator refuses a fact whose node or subtype is missing from the graph or carries a block other than 1 or 2. The file's hash is part of the graph version, so a new fact list is a full recompute.

The generator of ADR-0040 sets `factId` on `item_shown` when the task is bare, has one step and its operands form a fact in the file. That covers Volley facts, mental arithmetic, control facts and room tasks alike. A show of a fact is an unassisted first attempt with a `factId`, not a rapid guess and not excluded. Its time runs from the fact's show to its submission, as ADR-0070 measures it, and a show ADR-0030 flags `interrupted` counts for accuracy with no time.

The projection `fact_states` gives each fact one state over its last 3 shows (REQ-5832, REQ-5834):

- «автоматизм» (automatic): right and no slower than the fact threshold on 2 of the 3, the last show within the past 14 days;
- «вычисляет» (computes): not automatic, but right on at least 2 of the 3;
- «не знает» (doesn't know): everything else, a fact shown fewer than 2 times included.

The fact threshold is 3 s plus the motor correction of the device type in use, for the key presses of the fact's answer and «Готово» (Done) (REQ-5836). The Parent Room's settings let the parent change the 3 s. The change writes `fact_threshold_set`, which the `thresholds` projection of ADR-0180 turns into a new threshold version, so ADR-0060's full recompute replays every fact under the new value (REQ-5838). The fact threshold is a threshold of its own, and node fluency still reads the catalogue thresholds of ADR-0180. I chose a range of 1.5 s to 6 s for the parent's value, because below 1.5 s it nears the fact's minimum time and above 6 s it would call a counted fact automatic.

The minimum time of every fact in the file and of every control fact is the motor correction plus 600 ms (REQ-5840), and the repeat window of ADR-0070 exempts every item with a `factId` and every control fact (REQ-5842). A fact returns on the next game day after a wrong answer or one slower than the threshold. After a right answer within the threshold it returns after the next interval of 1, 3, 7 and 14 days, then every 14 days (REQ-5860). I cap the ladder at 14 days, because an automatic fact loses its state after 14 days without a show, and a longer interval would throw away a state the player holds.

The «Залп» (Volley) is a form of mental arithmetic. It shows 8 to 10 facts in one task window, one row a fact, answered on one keypad without leaving the window (REQ-5844). I chose 10 facts whenever at least 10 are due or waiting, and 8 as the floor, because the Volley is the main supply of fact shows, as the costs below count. The Director picks the facts from blocks 1 and 2 by this order:

1. Three places go to facts that aren't automatic, or to every such fact when fewer than 3 exist (REQ-5846). Due facts come first, then «вычисляет» before «не знает», because a fact she already computes is the nearest to automatic, then the lower block number, as block priority ranks them, with ties broken by the adventure's seed.
2. The other places go to automatic facts that are due by the review schedule below, then to the automatic facts with the oldest last show, because those are closest to losing the state.
3. While fewer automatic facts exist than places, the rest go to facts in «вычисляет», then to facts never shown, in the file's order, which lists the easier facts first.

The third step departs from REQ-5846 during the first weeks, when fewer facts are automatic than places and the requirement can't hold. The requirement needs an amendment for that case, which the section Open review findings records for the owner. The order inside the Volley comes from the seed, with no two facts that aren't automatic side by side where the mix allows it, and as few such pairs as it allows otherwise. I chose the spacing so a miss on a weak fact is followed by a fact she knows, which keeps the Volley safe to try.

A Volley fact runs a short attempt flow. The task window shows the row's fact, the player types the answer and presses «Готово», and the server's reply marks the row and shows the correct answer at once after a wrong answer. The next row then opens. The Volley offers no hint ladder, since ADR-0220 gives a basic fact placed as mental arithmetic `hintMaxLevel: 0`. It also offers no twin and no detailed explanation, because each extra step would put time between the facts that the Volley exists to keep together. «Не знаю» (I don't know) stays on the keypad and counts as a miss. The window shows no time, no timer and no speed anywhere, and a fact's answer time reaches only the server's measure.

A Volley is on target when at most one of its facts misses, where a fact hits when it is right and not a rapid guess (REQ-5848, REQ-5850). A rapid guess therefore counts as a miss, so a Volley of taps can never be on target. An on-target Volley gives 1 star yarn, whatever its times. A Volley with no miss is perfect and adds a spark to the scene's animation, with no extra reward. The Volley as a whole counts as the 2 first attempts it replaces for ADR-0140's buttons, and its facts move neither the streak nor the clean-attempt shards. I chose this so a floor's buttons stay as RES-2100 balanced them, and ten fast facts can't fire two clean rows.

The day's count is the facts on target across all the day's Volleys, and the record is the highest day's count ever. The record never falls, whatever a later day or a wrong answer brings (REQ-5852). The System shows it after a Volley in one dry line from `ru.json`, with no time in it.

The reply to a missed fact comes from a pool of at least 20 fixed lines in `ru.json` under `volley.miss.*`, each a joke about the fact, the Tangle or the System, and never about the player (REQ-5854). No line repeats twice in a row. The text gate refuses the words of RES-3300's forbidden list in them, «ошибка» (mistake), «неправильно» (wrong) and «промах» (miss) included, and the parent judges the rest. I chose fixed lines over a model, because a reply that follows each fact within the answer reply's budget can't wait for a model.

Each maths floor runs in this order: an entry scene, an unscored warm-up, either 2 mental arithmetic tasks or one Volley, the Sources track's tasks on a floor that carries them (ADR-0300), 1 or 2 rooms of trials, sometimes a Guardian, then the floor chest (REQ-5856). A Volley takes the place of the mental arithmetic tasks only while blocks 1 and 2 hold a fact that isn't automatic. Then it does so on 2 floors in 3 while `cito:M7` is the active horizon, and on 1 floor in 2 after it (REQ-5858). I chose 1 in 2 for "fewer", the smallest step down from 2 in 3, because the costs below show that even 1 in 2 falls short of keeping blocks 1 and 2 at 90 % automatic. The Director places Volleys by a deficit rule over every maths floor since the active horizon last changed, carried across game days: a floor gets a Volley when the Volleys so far are fewer than the share times the floors so far plus one, rounded half up. I carry the count across days, because a count that restarted each day would round 1 in 2 up to 2 of 3 floors on every 3-floor day. The Volley opens on the second day of play by the system schedule of REQ-6244, and mental arithmetic runs before it.

Volley facts are observations of their node for the "on her own" estimate and for fluency, like control facts, and like control facts they never enter ADR-0060's full block of 5 observations or a probe. They still count toward the Cito block readiness above. Without that rule ten facts of one subtype would fill the node's last 5 graded observations, and no block covering its subtypes could form. The flow corridor counts a Volley as one entry scored by its share of hits, because ten entries would fill the corridor's window of 10 by themselves.

### Half of a node's scored tasks are bare

Every template declares `format: "bare"` or `format: "context"`, where bare means an expression with no story in the task window (REQ-5862). The template schema refuses a template without it. Mental arithmetic, the Volley and control facts are always bare. In a node with templates of both formats, the item builder takes a bare template whenever the node's bare scored tasks of the last 30 days number no more than its context ones, so at least half of them are bare at every choice (REQ-5864). A node whose chosen subtype has templates of one format only takes that format, and the count still spans the whole node. The 60-day simulation asserts the share on every node with both formats, which is the addendum's acceptance test 12. `item_shown` records `format`, and the report shows accuracy and fluency for bare and context tasks apart (REQ-5866).

### The home skill scale is a view that changes nothing

The home scale is a Rasch model over the log, a projection that feeds no estimate, state, obligation or choice (REQ-5876). It lives in `src/parent/scale/`, beside the report, and no module in `src/engine/` may import it, which a lint rule checks. It gives each template and difficulty feature an item difficulty `b`, from the feature formula in the MVP. It estimates θ for each domain and overall by expected a posteriori over the unassisted first attempts of the last 30 days, with a standard normal prior on 41 quadrature points, enough for a smooth posterior at a cost of microseconds. The 30 days match the window the report uses for its other recent figures. With fewer than 20 such attempts in a domain it shows «мало данных» (too little data), a threshold I chose because fewer answers leave the estimate mostly prior.

The refit of `b` after 4 to 6 weeks runs on the owner's command, `tools/fit-scale.ts`, and writes `content/scale.vN.json`, never by itself. The refit estimates one θ per player-week, tied by a random-walk prior, and shrinks each `b` towards its feature formula. A single θ would absorb her growth into the items and draw a flat line (RES-4080). The owner activates a new scale version only after it passes REQ-5880 on simulated pupils who grow during the simulation: item difficulties within a root mean square error of 0.3 logits and each pupil's ability gain within 25 % (REQ-5880). That is the addendum's acceptance test 13.

The report labels the scale «домашняя шкала — не балл Cito» (home scale, not a Cito score) (REQ-5878). Its reason rests on the entry for Cito's OPLM model, so a change there marks it. It shows the weekly θ with rough ticks at the mean `b` of the templates of each typical group, and lists the entered Cito results beside it with no conversion between the two. The timeline that draws them as series waits until after the MVP (REQ-6062).

### The parent enters Cito results and school goals, and the report adds five sections

The Parent Room gains a Cito panel with the horizons, the results form, the school goals, the Cito facts with their check button, the Dutch memo, the fact threshold and the multiplication sign.

The results form writes `external_test_recorded` with the fields REQ-5882 names. They are the moment, the test taken and its level, the vaardigheidsscore, the functioneringsniveau with "<" and ">" allowed, the referentieniveau, the level with its scale of I to V or A to E, the subject, an optional split between bare and context items, an optional expected test advice and a note. The form saves a result with every field empty except the moment and the subject (REQ-5884). A correction writes a new event that names the result it replaces, since the log is append-only. The Dutch memo is a fixed text under `parent.cito.memo` in `ru.json`, with a Russian gloss. It lists what the parent can ask the school for: the level of the test taken, the expert view of the group report and the split between bare and context items (REQ-5886). It lives in the Russian file, because a Dutch locale file is what ADR-0190's scope guard refuses.

Report v1 keeps the nine screens of REQ-6064, and this decision places its sections inside them:

| Section | Screen | What it shows | Question it answers |
| --- | --- | --- | --- |
| Cito preparation | VWO readiness | the active horizon and its date; for each block and each week, the share of members fluent or stable and, for blocks 1 and 2, the share of facts automatic, beside whether the block is ready (REQ-5890); accuracy and fluency by format (REQ-5866); the home scale and the entered results; the Cito facts with their marks | how far is each tested block from ready, and what did the school's test say? |
| Careless errors | VWO readiness, and the Summary for the observation | by week and by error class, the share of wrong first attempts on nodes fluent or stable and on facts automatic at that moment, with its count (REQ-5868) | does she slip on what she already knows? |
| Beyond school | VWO readiness | the nodes fluent or stable whose typical group is later than the school group the parent set (REQ-5874) | what did working ahead gain? |
| Fact report | Graph map, under domain A | a 10 x 10 heat map of the multiplication facts and one of the division facts, each cell in its fact's state (REQ-5888); a printable list of the facts that aren't automatic, grouped by operation in the file's order, with no topics ordered and no dates (REQ-5892); the parent's mark «тренировали факты» (we trained facts), which REQ-5074 logs | which single facts are slow? |
| Bare and context | Node card | accuracy and fluency of the node's bare and context tasks apart (REQ-5866) | is a gap in the sums or in the stories? |

The Summary raises «небрежные ошибки на знакомом» (careless errors on familiar material) for a week whose share, all error classes together, is above 10 % (REQ-5870). The line shows the count beside the share, such as 1 of 4, so the parent sees how little a small week holds. The error classes are ADR-0180's four. The weekly values come from replaying the projections to each week's end, which a pure function over 308 facts and 79 nodes allows. The list prints through the browser's print with a print stylesheet, which ADR-0180 already plans for its snapshot.

### Two settings: the multiplication sign and the bridge's gates

The multiplication sign is a parent setting, `notation.multiplicationSign`, «×» by default or «·», written by `settings_changed` (REQ-5898). ADR-0040's renderer reads it for task text, short solutions, rungs and explanation placeholders at render time. Division stays «:» and the decimal comma stays. `item_shown` stores the rendered view, so the node card shows what she saw. The answer parser accepts either sign, because she may type the one her school uses.

ADR-0210 places the Dutch bridge in the MVP and owns its words, their approval, their share and their events. This decision adds the two gates RES-4080 asks for. A bridge word shows only in a task of a node whose tested state, computed without the mixed stream, is «Понимает» (understands) or higher (REQ-5894). The parent's switch `bridge.enabled`, when off, removes every bridge word from rendering, every bridge card, every mixed task and the bridge part of the Diary's dictionary (REQ-5896). The switch acts at render time, so a task shown before it keeps its stored view in the log.

### What works once this is accepted, and what doesn't yet

Once built, the parent sets horizons and sees each block's readiness. The Director raises unready blocks and confirmed goals, the game tracks each of the 308 facts, the Volley runs on its share of floors, half of each mixed node's tasks are bare, and the report shows facts, formats, careless errors, the home scale and the Cito results with their marks. The fact measurement and the Volley need only the stage 0.1 templates, the thresholds and ADR-0060, so they can ship in the fact stage 0.15 ADR-0210 orders. ADR-0210 leaves this decision to size that stage's daily set so it ends before 15 minutes of active time. The set is Volleys of 10 facts, each followed by one single fact task from the stage 0.1 templates, which carries item 1's hint ladder. It holds as many of these pairs as fit into 12 minutes at her median pair time over the last 5 game days, at least 1, and 3 before any pair has been timed. I chose 12 minutes to leave 3 minutes of slack inside the 15.

Each part keeps the game working when it is absent. With every `citoBlock` at `null` or no horizon active, both new terms are 0 and ADR-0070 runs as approved. Without `content/facts.yaml` no fact state exists and every floor keeps its 2 mental arithmetic tasks. Without a school goal or a confirmed link, `school_goal` is 0. Without a refit, the scale runs on the feature formula. Without the catalogue mapping of RES-4100, the parent maps goals by hand.

It doesn't yet give the timeline of results and scale, which waits until after the MVP (REQ-6062). It doesn't make the Director offer «Проверить нить» more often after careless errors, which the addendum mentions and no requirement asks for. The Dutch layer stays out of the MVP (ADR-0210).

## Why

RES-4080 checked the addendum's claims against Cito's own pages on 2026-09-28 and confirmed ten of twelve. It found that Cito calls practising for its tests "geen goed idee" but welcomes practice that builds skill, so every part here builds a tested skill and none copies the test (RES-4080 conclusion 3). Storing each claim with its quotation follows from Cito rewriting its pages, and the check stays a report because no approved model role reads Cito's pages (RES-4080, decided on 2026-09-28).

The horizon changes the order of practice and never the tasks, which is why the player never sees it and why a date alone doesn't end it (RES-4080 conclusions 3 and 4). The block weights, the ready rule, the fact states and the Volley's shape are the owner's numbers in the addendum, and RES-4080 checked them against the approved records. It found that ADR-0070's corridor and honest-difficulty rule survive both terms, since neither reads the chance of success.

Facts need their own projection, because a node estimate can't show which fact is slow, and Cito sells a separate bare-sum test to find exactly that (RES-4080). The small-space minimum time must cover multiplying by 10, 100 and 1000. Under the general rule a quick, real answer to 7 x 100 would count as a rapid guess (RES-4080 conclusion 11). Half the tasks are bare because half of Cito's maths items are bare sums and Cito reports the two kinds apart (RES-4080 conclusion 16).

The home scale is a view, not a model, because the approved model has no skill scale, and a scale fitted to one growing player can't separate item difficulty from her growth (RES-4080). The refit's test therefore uses pupils who grow. The goal list stays on the Mac and the sign is a parent setting, because both follow the owner's decisions of 2026-09-28 recorded in RES-4080 and RES-4100.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: the approved graph, model and Director already cover the tested content | Follows Cito's advice and RES-0010's "doesn't drill for a test" exactly, and changes no approved record | It knows no test date and tracks no single fact, so a slow table fact can stay slow past M7 and the parent can't see which one (RES-4080, option A) |
| The skill part only: facts, the Volley, bare tasks and the results form, with no block priority, school goals or bridge | Most of the gain for about a third of the change, since facts and bare sums are what Cito's own analysis splits out | It still ignores the dates, which is the owner's reason for section 8, and it leaves the Dutch keywords out before M7 (RES-4080, option C); it stays the fallback if the owner withdraws block priority |
| A Cito practice mode: timed rounds in Cito's item layout before each moment | Familiarity with the test's form and pace | Cito advises against training on test items, REQ-5810 forbids it, and a timer breaks the no-clock rule of RES-0300 |
| A fact threshold the parent sets freely, outside the threshold versions | The parent adjusts to the player in one tap | RES-1300 makes the threshold an external standard changed only as a new version; REQ-5838 requires a version the log records |
| The home scale as Cito's own OPLM model, or as Elo ratings per item | Closer to Cito's score, or no refit step | OPLM needs Cito's fixed item discriminations, which a home game doesn't have, and Elo needs many learners to settle item ratings, which ADR-0060 already rejected |

## What it costs

The owner and the building agent pay first. They draft `citoBlock` for about 250 pairs of node and subtype, list 308 facts, add `format` to every template, write 20 reply lines, enter the twelve Cito entries and write `tools/fit-scale.ts`. The parent checks the blocks once and the reply lines once. After that the parent's work is optional: a date, a result, a goal list, a threshold or a sign. If nobody attends to any of it for two weeks, or for a month, nothing waits. The defaults hold the horizons, unconfirmed goal links change nothing, the Director keeps aiming at `cito:M7`, and the one overdue line waits in the Summary.

The parent's interruption budget is small and each notice fires once per condition, with a step the parent can take. A horizon 45 days past its date without a result shows one line, once per horizon. Cito facts last checked more than 365 days ago show one line, once per school year, since the addendum asks for a check before each year. The careless-errors observation shows at most once a week. Nothing else in this decision raises a notice, and the player gets no new interruption at all, since the Volley replaces tasks and adds none.

The player pays in variety. Before `cito:M7` two floors in three open with the same kind of drill, and the unready blocks 1 and 2 lift A and N nodes in the ranking. Only the three-day window keeps the other domains in play.

The Volley has to carry the facts, and the numbers are tight. Keeping 90 % of 308 facts automatic under the 14-day rule needs about 277 refreshes of automatic facts every 14 days, about 20 a day. Near 90 %, about 31 facts aren't automatic, so step 1 keeps 3 places of each Volley for them and 7 places refresh automatic facts. On a day of 3 floors before M7, 2 Volleys give 14 refreshes, and 4 control facts and about 3 bare fact tasks bring the day to about 21, a margin of about 1. After M7, 1.5 Volleys a day give about 10.5, and the day reaches about 17.5, short of the need. A player on 2 floors a day gets about 13 before M7. So blocks 1 and 2 will hover near 90 % automatic before M7 and settle nearer 80 % after it, and the report will show it. When they fall below 90 % the blocks turn unready again, and block priority lifts their nodes until they recover. I accept the shortfall after M7, because REQ-5858 asks for fewer Volleys after M7 and 1 in 2 is the smallest step down. A 10-fact Volley is the other lever, and I chose the maximum of 10 for it.

The economy gains about 2 star yarn a day from Volleys before M7, at most 3 on a day of 4 floors, and about 1.5 a day after it. ADR-0140's balance simulation measures the forge's pace with it, and RES-2100's list of yarn sources grows by one row.

The server stays inside budgets the repository already keeps. The fact projection updates within the per-node model update of 50 ms, and each Volley row waits no longer than the answer reply of 300 ms. The report's new sections fit the 5 s report rebuild, all in ADR-0190's Baselines table. Two budgets are new and chosen, not imposed: a Cito check finishes within 60 s for its pages, at a timeout of 10 s each, which keeps the 12 pages inside 60 s with room if a few time out, because the parent waits in front of its progress line. A scale refit finishes within 10 minutes on the family Mac, because the owner runs it by hand and no one waits in play.

Ceilings keep each pile bounded. `fact_states` holds one row per fact, 308. The record is one number. A parent import holds at most 200 goals, and the import refuses a longer list once with a line saying how many it read, since a class's goal overview holds far fewer. The Cito check writes one event per run, and the button stays inactive while a run is in progress and for 10 minutes after it, because Cito's pages don't change by the minute. Cito results grow by a few a year, and scale versions by one a refit, both kept like model files. The log itself never drains, by ADR-0020's design.

The security boundary protects three things, in order of the likelihood of damage:

1. The player's view. A player route that carried a horizon or a result would show her the test. The API schema test finds none of those fields in any player response, and the text gate refuses the test words.
2. The Cito results and the goal list, which are school data about her. They live only in the local database, the parent's routes answer 401 without the PIN session, and no model role reads them (ADR-0100, ADR-0210). What leaves the Mac is ADR-0210's rule, and nothing here adds to it.
3. The Cito check's fetch. It requests only the URLs in the read-only content file, never a URL from a request, with no query, cookie or player data. It never renders or runs a fetched page and never passes its text to a model, so a tampered page can at worst mark an entry unconfirmed.

## What would reverse it

- If the 60-day simulation breaks the three-day window, the corridor or the stretch cap with the two new terms on, after one round of tuning their weights, block priority comes out and option C takes its place, as RES-4080 sets for this case.
- If the simulation of daily play at 3 floors, run at 2 floors in 3 and again at 1 in 2, can't hold blocks 1 and 2 at 90 % automatic after 60 days on a profile that answers facts within the threshold, the 14-day rule of REQ-5834 and the Volley's capacity disagree. The owner then chooses between a longer window, a longer Volley and a higher share.
- If, after her first 8 weeks of play, the real log shows block 1 or block 2 below 80 % automatic for 4 weeks in a row, the Volley's supply fails in practice as well. The owner makes the same choice. I chose 80 %, because the costs above expect about that level after M7, so a lower one means the supply is failing beyond what the design accepted.
- If the parent notes in the Parent Room that the player called the game a test, asked when her test is or asked why the Tower always counts, twice in a month, the preparation shows through. I chose two, because one remark can be passing curiosity, and a second within a month shows a pattern. The owner then lowers the Volley's share or the `block_priority` weight.
- If tasks of A and N nodes pass 45 % of her scored first attempts over 14 adventure days, block priority is crowding out the other domains. The owner then lowers the `block_priority` weight in a new Director version. I chose 45 % because A and N are 2 of the 8 floor domains, and more than about twice their even share makes the days alike.
- If a Cito check marks unconfirmed any entry that a Director rule rests on, that rule is reopened by a new research record, because the owner's numbers were checked against the page as it read on 2026-09-28.
- If a scale refit fails REQ-5880 twice on growing simulated pupils, the refit is dropped and the scale stays on the feature formula, labelled as such.

## Consequences

- ADR-0020's catalogue gains `horizon_set`, `external_test_recorded`, `school_goals_imported`, `school_goal_mapped`, `cito_rule_checked`, `volley_started`, `volley_completed` and `fact_threshold_set`, each owned by this decision as ADR-0210's table of owners assigns them, in the change that adds its schema.
- The payloads are: `horizon_set` with `horizon` and `date`, a date of `null` removing it; `external_test_recorded` with `resultId`, the fields of REQ-5882 and `replaces`; `school_goals_imported` with `importId` and each goal's `goalId` and text; `school_goal_mapped` with `importId`, `goalId`, `nodes`, `source` of `catalogue` or `parent`, and `confirmed`. Then `cito_rule_checked` with `runId`, `startedBy`, each page's URL, `read` and text hash, and each entry's `quoteFound`; `volley_started` with `volleyId`, the floor and the `factId` list; `volley_completed` with `volleyId`, hits, misses, rapid guesses, `onTarget` and `perfect`; and `fact_threshold_set` with the new value in ms and the threshold version.
- `item_shown` gains `factId`, `format` and `volleyId` in a new payload version with an upcaster, as ADR-0210 requires of changed fields.
- New work: `content/cito.rules.json`, `content/cito.horizons.json`, `content/facts.yaml`, `content/director.v2.json`, `citoBlock` in `content/graph.yaml`, `format` in every template, the `fact_states` and `cito_rules` projections, the Volley component and its strings, `src/parent/scale/`, `tools/fit-scale.ts`, the check function behind the button and `./tower cito-check`, and the Parent Room's Cito panel.
- ADR-0190's group 1 gains the `citoBlock`, facts, format and Cito-entry validators, the test-word search, the scale import lint and the moment-identifier check. Group 3 gains the 60-day simulation of REQ-5828 and REQ-5864 and the refit test of REQ-5880. Its Baselines table gains the two new budgets.

Failure states, each with its next step and one audience:

| Failure state | What happens next | Audience |
| --- | --- | --- |
| `cito_page_unreadable` | the check lists the page as not read and leaves its entries' marks as they were; running it later reads it again | the parent, in the check's result |
| `cito_rule_unconfirmed` | the report shows «не подтверждено» beside every text resting on the entry until a person updates the file | the parent |
| `cito_rules_stale` | the Summary shows one line once a school year until a check runs | the parent |
| `horizon_overdue` | the Summary shows one line asking for the result or a new date; the Director keeps the horizon | the parent |
| `goal_import_too_long` | the import refuses the list and says how many goals it read | the parent |
| `fact_threshold_refused` | a value outside 1.5 s to 6 s isn't saved, and the field says which range the game accepts | the parent |
| `graph_block_invalid`, `fact_list_invalid` | the validator fails the build, naming the node, subtype or fact | the owner |
| `scale_refit_rejected` | the refit fails REQ-5880 or doesn't converge; the active scale version stays | the owner |
| `volley_interrupted` | the player leaves mid-Volley; the resume reopens the same Volley at its next row, and the interrupted row counts for accuracy with no time | the player, who sees the Volley resume |

The player sees no other failure state, because every state above leaves her a task or a scene. `cito_page_unreadable` and `cito_rule_unconfirmed` are deliberately different: the first says nothing about the quotation, the second says it is gone.

## How I will know it was realised

1. `./tower graph check` reports a `citoBlock` on every node and subtype, `null` on every S, stretch and track node, and each node's value among its subtypes' values.
2. The facts validator reports 308 facts, each tied to a node and subtype of block 1 or 2, and refuses a fixture fact tied to block 3.
3. A projection test drives fixture logs through `fact_states`: a fact right and fast on 2 of 3 shows within 14 days is automatic, the same fact 15 days later is not, and a fact shown once is «не знает».
4. A threshold test sets the fact threshold through the Parent Room, finds a `fact_threshold_set` event and a new threshold version, and finds the states recomputed. A value of 1.4 s is refused.
5. A rapid-guess test gives `mul:7x100` an answer 1 ms faster than the motor correction plus 600 ms and finds a rapid guess, and 1 ms slower and finds none.
6. A Volley test over 1,000 seeds finds 8 to 10 distinct facts, exactly 3 not automatic whenever at least 3 such facts and at least 7 automatic facts exist, non-automatic facts elsewhere only in the places step 3 fills, no time on the screen, 1 star yarn when misses are at most 1 and none when a rapid guess is the second miss. It finds a record that never falls across a fixture of good and bad days.
7. The text gate refuses every line of the Volley pool that holds a forbidden word, and the pool holds at least 20 lines with no line twice in a row over 1,000 draws.
8. The 60-day simulation holds the corridor, the three-day window, the stretch cap and the honest-difficulty property with both new terms on, gives a ready block no block priority, and holds at least half bare tasks on every node with both formats.
9. A floor test over 30 simulated days of 3 floors and 30 of 4 floors finds Volleys on 2 of every 3 floors, counted across days, while `cito:M7` is active and a fact isn't automatic, and 1 of every 2 after an M7 result. It finds none once every fact of blocks 1 and 2 is automatic.
10. The refit test recovers item difficulties within 0.3 logits and each simulated pupil's gain within 25 % on growing pupils, and a lint rule fails any import of `src/parent/scale/` from `src/engine/`.
11. The API schema test finds no horizon, result, goal or Cito field in any player response, and the end-to-end scan of the player's screens finds no test word and no horizon date.
12. A check test serves one page with a changed quotation and one unreachable page. It finds the first entry marked unconfirmed, the second unchanged, the file untouched and one `cito_rule_checked` event.
13. A report test shows «не подтверждено» beside the text of every `usedBy` key of an unconfirmed entry, the scale labelled as not a Cito score, and the careless-errors line with its count for a week at 11 %.
14. A render test shows «×» by default and «·» after the setting, with «:» and the decimal comma unchanged, and the parser accepts both signs.
15. A bridge test finds no bridge word on a node below «Понимает», and nothing of the bridge anywhere once the switch is off.
16. A horizon test finds `cito:M7` on 2027-01-15 and `cito:E7` on 2027-05-15 with no event, a `horizon_set` after a changed date, `cito:E7` active after a reading result for `cito:M7`, and block priority at 0 after an E7 result with no later horizon.
17. The moment-identifier check finds every horizon and result moment matching `^cito:[BME][3-8]$`, and fails on a fixture that names a moment `M7` alone.
18. A value test finds `school_goal` 0 for an unconfirmed link and for a snapshot goal, 1 for a confirmed parent-entered goal, and a node with a confirmed goal and a fresh lesson mark scoring 1.5 from the larger term and never 2.5.
19. A readiness test on fixture states finds a block ready at 80 % of members fluent or stable and not at 79 %, and blocks 1 and 2 ready only with 90 % of their facts automatic as well.
20. A schedule test finds a fact due the next game day after a wrong or slow answer and after 1, 3, 7, 14 and 14 days after right answers within the threshold, and finds a fact repeated within 30 days with no `repeat_forced`.
21. A floor test finds the order entry scene, warm-up, mental arithmetic or a Volley, track tasks on a host floor, rooms, sometimes a Guardian, then the chest.
22. The template schema refuses a fixture template without `format`.
23. A report test on a fixture log finds the bare and context figures apart on the node card and in the Cito section, the careless share by week and class, the beyond-school list against the school-group setting, both 10 x 10 maps and each block's weekly shares and readiness. It finds a printable list holding only facts that aren't automatic, in file order, with no date or topic order.
24. A form test saves a result with only the moment and the subject, and saves one with every field of REQ-5882, including "<" in the functioneringsniveau and a level on the A to E scale. It finds the Dutch memo, naming the test level and the bare-versus-context split, in the Cito panel.

## Amends

- ADR-0040: "Code writes `·` for multiplication and `:` for division (REQ-1226, REQ-1228)" becomes: code writes the multiplication sign of the parent's setting, «×» by default or «·», and `:` for division (REQ-5898).
- ADR-0040: the template interface gains `format: "bare" | "context"`, and `item_shown` gains `factId`, `format` and `volleyId` in a new payload version.
- ADR-0050: the node fields of REQ-0808 gain `citoBlock`, 1 to 6 or `null`, on every node and every subtype, `null` on S, stretch and track nodes.
- ADR-0060: "Control facts never enter a block or a probe" becomes: control facts and Volley facts never enter a full block of 5 observations or a probe; Volley facts still count toward Cito block readiness.
- ADR-0060: the projections gain `fact_states`, one row per fact of `content/facts.yaml`, recomputed with the others, and the thresholds version covers the fact threshold.
- ADR-0070: the value formula gains `1.5 * block_priority(v)`, and "A node with a lesson mark scores the larger of `recheck` and `parent_topic`, never both" becomes: a node scores the largest of `2.0 * recheck`, `1.5 * parent_topic` and `1.0 * school_goal`, never more than one.
- ADR-0070: "Each floor opens with its scene, an ungraded warm-up and 2 mental arithmetic tasks" becomes: with its scene, an ungraded warm-up and either 2 mental arithmetic tasks or one Volley, by the share this decision sets.
- ADR-0070: "Times-table facts, addition to 20 and control facts are exempt" becomes: every item with a `factId` and every control fact is exempt (REQ-5842).
- ADR-0070: "the motor correction plus 600 ms for a times-table fact, an addition fact to 20 or a control fact (REQ-1116)" becomes: the motor correction plus 600 ms for every fact of `content/facts.yaml` and every control fact (REQ-5840).
- ADR-0070: the success share "over the last 10 graded first attempts" becomes: a Volley counts as one entry, scored by its share of hits.
- ADR-0070: "It never trims mental arithmetic, control facts" becomes: it never trims mental arithmetic, a Volley, control facts.
- ADR-0070: the item builder gains the bare-share rule: in a node with both formats, a bare template whenever the node's bare scored tasks of the last 30 days number no more than its context ones.
- ADR-0080: "Every task the adventure shows, scored or not, runs one attempt flow" becomes: every task runs it, except that a Volley fact runs `open`, `first_answered` and `closed` in the Volley's window with no hint, twin or detailed explanation.
- ADR-0090: "Each floor runs as REQ-0104 fixes: an entry scene, an unscored warm-up, 2 mental arithmetic tasks, 1 or 2 rooms" becomes: each floor runs as REQ-5856 fixes, with either 2 mental arithmetic tasks or one Volley, then the Sources track's tasks on a floor that carries them, then 1 or 2 rooms.
- ADR-0140: the grant table gains the row "Volley on target: 1 yarn", and the streak and the clean-attempt shard ignore Volley facts, while the Volley counts as 2 first attempts for buttons.
- ADR-0160: "the notation profile RES-2550 puts in the locale" becomes: the notation profile, except the multiplication sign, which the parent's setting gives; and the forbidden-word list gains «тест», «контрольная», «экзамен», «Cito» and «Цито» for the player's text and «промах» for the Volley's replies.
- ADR-0180: "the median time of correct answers on A1, A3, A4 and A6a, and the 8x8 heat map as a table" becomes: the median time on those nodes, with the heat maps moved to the fact report's two 10 x 10 maps.
- ADR-0180: the Parent Room's panels gain the Cito panel, and the thresholds projection gains the fact threshold, set by the parent and versioned.
- ADR-0190: group 1 gains the validators and checks listed under Consequences, group 3 the 60-day Cito simulation and the refit test, and the Baselines table the Cito check within 60 s and the scale refit within 10 minutes, both chosen.

## What this does not settle

- The Dutch bridge's words, their approval, their share in tasks, their events and the change to the Russian-only rule: ADR-0210.
- How a school goal maps to nodes through the vendor's catalogue, the snapshots and the "home and school" screen: ADR-0310.
- The timeline of Cito results and the home scale: after the MVP (REQ-6062, REQ-6044).
- The order of the build stages and when the fact stage reaches the player: ADR-0210.
- The mark «тренировали факты»: its event is ADR-0210's under REQ-5074, and this decision only shows it.
- A Director response to careless errors, such as offering «Проверить нить» more often: the addendum mentions it and no requirement asks for it.
- Tests in other subjects: the results form stores reading and Taalverzorging results, and nothing in play reads them.
- The school advice itself: the form stores what the parent enters, and the game predicts no advice.
- The default multiplication sign once a source confirms one: the default follows the source and the entry becomes confirmed, as data, with no change to this decision.

The strongest objection is that this is drilling for a test with the word taken out. Cito's pages say practice that builds skill is welcome and training on its items isn't, and this decision's defence is that it copies no item and shows no date. Yet the Volley before M7 is the heaviest practice in the game, timed by a hidden clock and scheduled by the test date. A child who meets ten times-table facts on two floors in three for fifteen weeks feels the drill whether or not the word appears. I keep it, because automatic facts are a skill in their own right, which Cito itself tests apart, and the owner asked for it. The Volley still pays nothing for speed, and its share falls after M7. The third reversal condition watches for the preparation showing through.

The premortem, written as though it had failed. By February the report showed blocks 1 and 2 stuck at 70 % automatic, and the parent read it as her failing, while the cause was supply. She played 2 floors most days, so two Volleys a day became one, and the 14-day rule expired facts faster than one Volley refreshed them. The Director then lifted A and N nodes every day, which made her days feel alike, and she asked why the Tower always counted. A second cause sat in the Cito facts: a check in November marked the claim about the adaptive second part unconfirmed after a page moved. Nobody updated the file, and the mark sat beside the readiness text for months until the parent stopped reading marks. The capacity numbers under the costs, the second reversal condition and the yearly line exist for these.

## Open review findings

- REQ-5846 can't hold while fewer facts are automatic than a Volley's places, which is every Volley of the first weeks. This decision fills those places with facts in «вычисляет», then facts never shown, and the requirement needs an amendment that names this case. It stays open for the owner, because a decision can't change an approved requirement.
- Agent review, preference: cap the fact review ladder at 12 or 13 days so an automatic fact has slack before its 14-day limit. Rejected: a 13-day cap raises the fresh shows needed from about 20 to about 21 a day and a 12-day cap to about 23, above what the Volley supplies after M7, and the Volley already takes the oldest automatic facts first.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
