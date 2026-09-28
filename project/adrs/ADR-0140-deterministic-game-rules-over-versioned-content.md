---
id: ADR-0140
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-1700, REQ-1702, REQ-1704, REQ-1706, REQ-1708, REQ-1710, REQ-1712, REQ-1714, REQ-1716, REQ-1718, REQ-1720, REQ-1722, REQ-1724, REQ-1726, REQ-1728, REQ-1730, REQ-1732, REQ-1734, REQ-1736, REQ-1738, REQ-1740, REQ-1742, REQ-1744, REQ-1746, REQ-1748, REQ-1750, REQ-1752, REQ-1754, REQ-1756, REQ-1758, REQ-1760, REQ-1762, REQ-1764, REQ-1900, REQ-1902, REQ-1904, REQ-1906, REQ-1908, REQ-1910, REQ-1912, REQ-1914, REQ-1916, REQ-1918, REQ-1920, REQ-1922, REQ-1924, REQ-1926, REQ-1928, REQ-1930, REQ-1932, REQ-1934, REQ-1936, REQ-1938, REQ-1940, REQ-1942, REQ-1944, REQ-1946, REQ-1948, REQ-1950, REQ-1952, REQ-1954, REQ-2000, REQ-2002, REQ-2004, REQ-2006, REQ-2008, REQ-2010, REQ-2012, REQ-2014, REQ-2016, REQ-2018, REQ-2020, REQ-2022, REQ-2024, REQ-2026, REQ-2028, REQ-2030, REQ-2032, REQ-2034, REQ-2036, REQ-2038, REQ-2100, REQ-2102, REQ-2104, REQ-2106, REQ-2108, REQ-2110, REQ-2112, REQ-2114, REQ-2116, REQ-2118, REQ-2120, REQ-2122, REQ-2124, REQ-2126, REQ-2128, REQ-2130, REQ-2132, REQ-2134, REQ-2136, REQ-2138, REQ-2140, REQ-2142, REQ-2144, REQ-2146, REQ-2148, REQ-2150, REQ-2152, REQ-2154, REQ-2156, REQ-2158, REQ-2160, REQ-2162, REQ-2164, REQ-2166, REQ-2168, REQ-2170, REQ-2172, REQ-2174, REQ-2176, REQ-2178, REQ-2180, REQ-2182, REQ-2184, REQ-2186, REQ-3532, REQ-3534]
supersedes: []
---

<!-- Reader: the owner and whoever writes the spec, evaluating the decision. They know the research records RES-1700, RES-1900, RES-2000 and RES-2100. -->

# 0140. Outcomes, progression, rewards and familiars run as deterministic server rules over versioned content data

## Decision

I put every game rule that turns play into a story result or a reward into one server module of pure TypeScript functions, `src/game/`, and every number those rules use into versioned content files. The Director (ADR-0070) calls the module, the event log (ADR-0020) records what it decided, and the client (ADR-0030) only shows what the server sends. Given the same log and content versions, the module gives the same results every time, because it reads no clock, no random source and no model reply. The daily seed is its only source of variety.

The module holds five rule sets, and each takes its numbers from one content file:

| Rule set | Content file | What it decides |
| --- | --- | --- |
| Outcomes | `content/thresholds.json` | a spell's outcome, the badge, the streak, clean rows, the room branch, the floor state, the chapter finale variant, the reward queue |
| Progression | `content/economy.json` | experience, level, rank, daily quests, the pattern row, the day count, the nearest goal |
| Rewards | `content/economy.json` | buttons, shards, yarn, floor materials, chest contents and quality, shop prices and shelf, forge recipes |
| Familiars | `content/familiars.yaml` | the roster, starters, friendship points and levels, evolution stages and thresholds, the bestiary |
| Tricks and items | `content/economy.json` | the catalogue of outfits, accessories, foci, curiosities and tricks, each with a category and no power field |

Each file carries a `version` field and a zod schema. The server validates every file at start-up and refuses a file that fails its schema. Player-facing names in these files are ids only: the words live in the per-language string files of ADR-0160, so `shop.ru.json` and `recipes.ru.json` from the research layout (RES-2500) hold strings and `economy.json` holds numbers. I split them because CLAUDE.md requires every player-facing string in a per-language file, and a price must not change when a language is added.

### Outcomes

A spell has three outcomes, judged on the unassisted first attempt alone (RES-1700): `clean` for a correct verdict, `partial` for a partial verdict, and `alt` for a wrong answer or "I don't know". The badge is a view of the outcome, by the mapping in REQ-1760, and its labels are string keys in the ADR-0160 files with the texts REQ-1762 gives. A second attempt never enters any rule in this section. A rapid guess, which ADR-0070's measurement guard flags, looks the same on screen as any answer with its verdict, because the client receives the same outcome and badge.

ADR-0080 leaves me the assisted first attempt, one answered after a paid hint, which RES-0400 left open. I read REQ-1702 as keeping bonuses for the unassisted attempt. So an assisted first attempt gets its outcome and badge from its verdict and counts at most 0.5 in the room and floor shares, as a rapid guess does. It leaves the streak unchanged and earns no shard. I chose this so a hint can't buy the sparkling slot or a clean row, and a hint also can't turn a room to `alt`, because RES-0500 wants her to spend threads without fear.

The streak counts within one adventure. It starts at 0 when an adventure starts and grows by 1 only on a `clean` unassisted scored first attempt that isn't a rapid guess. It stays as it is on `partial`, a rapid guess, a warm-up, a check fact or an unscored task, and ends on `alt`. It lives in the resume snapshot, so leaving and resuming keeps it. At 3 it fires a clean row, and at every multiple of 5 a big clean row, with the grants REQ-1752 and REQ-1754 name and the yarn RES-2100 gives. The client draws it as a garland with no digits, and the server sends no event, line or sound when it ends.

A room's slot values are `clean` 1, `partial` 0.5 and `alt` 0, with a rapid guess or an assisted first attempt capped at 0.5 when correct and 0 when wrong. The room takes `success` when its clean share over all its slots reaches the room threshold, and `alt` otherwise. A floor's state uses the same values over its rooms' scored tasks and its Guardian's problem, leaving out mental arithmetic, warm-ups and check facts: `triumph` at the triumph threshold, `victory` at the victory threshold, and `cunning` below it. A floor with no rooms and no Guardian gets no state and stays out of the day's summary and the chapter finale. The chapter finale takes its triumph variant when at least the first share of its floor-days are triumph or victory and at least the second share are triumph.

The thresholds in force are version 1, the starting values REQ-1736 and REQ-1738 impose:

| Threshold | Version 1 | Source |
| --- | --- | --- |
| Room `success` at a clean share of at least | 0.6 | RES-1700 |
| Floor `triumph` at least | 0.8 | RES-1700 |
| Floor `victory` at least | 0.5 | RES-1700, lowered from 0.55 |
| Chapter finale: triumph or victory share at least | 0.5 | RES-1700 |
| Chapter finale: triumph share at least | 0.3 | RES-1700, lowered from a third |

The Director logs each room branch and floor state when it decides them, as `room_outcome` and `floor_outcome` events with the thresholds version it used. A projection rebuilt later replays the logged result and never derives it again under a newer version, because the player has already seen the scene. When the stage 0.1 simulation (ADR-0190) calibrates the thresholds, the new version goes into `content/thresholds.json` beside a new decision record that the owner approves and that names the version (REQ-1734). The simulation test fails when the thresholds in force miss the target shares of REQ-1730. The first-month review changes the chapter triumph share before any other threshold (REQ-1740), and I write that order into the file's comment block and into the review's checklist in the spec.

Every branch and state moves the campaign on by the same step: the next scene, the floor count and the quests advance identically, and only the scene, the lines and the bonus differ. Before a Guardian's problem starts, the Director holds all three Guardian endings, from the Master (ADR-0110) or from the fallback library `content/branches.ru.json`. A build check fails when a Guardian lacks a fallback ending for any state, so the fallback always exists. A reward the Director ordered for `success` and missed on `alt` enters `reward_queue`. The next lead-in takes from the queue first, oldest first, and an entry 6 sessions old comes without a trial at the next floor-entry scene, so every entry returns within 7 sessions. Secrets a wrapped-up adventure left unopened (ADR-0030) enter the same queue under the same rule. Checkpoint pages and legendary rewards never enter the queue.

The canon and the line pool name a spell's outcomes clean, almost and loosened, and describe the room's branch rule in words with no threshold value. A content check fails when `canon.ru.md` or `lines.ru.json` names another outcome or states a share as a number beside the words for a room's branch.

### Progression

Experience comes from effort (RES-2000): 5 for any first attempt, whatever its verdict, 3 for a second attempt, 10 for a scene, 20 for a floor in any state, 50 for a daily quest and 60 for a completed adventure. Leaving level L costs `min(150 + 20 * (L - 1), 600)` experience. I read the formula as the cost of leaving L, because that reading gives RES-2000's own figures: 7,920 for levels 1 to 22, and level 4 at about 520. RES-2000 estimates 521 experience an adventure, inside the 500 to 650 REQ-2004 imposes. Experience, level, rank, owned items, currencies, friendship and pages only ever grow, because the module has no rule that subtracts from them except a purchase or a forge the player chose, which spend currency and add an item.

A level-up fires a ceremony of light and sound and grants nothing. The heroine holds rank E from Session 0, and Mirra holds rank D, both as fixed content values in the MVP; the MVP ships no stats, paths or rank changes, and no rank month appears in the canon. If stats arrive later, the module sends the Master each stat only as low, medium or high relative to the others, and no task rule reads a stat.

Each game day the module picks 3 daily quests from a pool of templates by the day's seed. Every template counts an act of play, such as clearing floors or picking from a chest, and none counts a correct answer. A content check rejects a template whose counter reads a verdict. A quest met gives 50 experience, 10 buttons and 1 thread. An unmet quest disappears when the game day ends, with no event the player sees. The optional pattern row comes at most once in 3 days, from a success branch, and gives 2 star yarn and nothing else.

The day count is the number of game days on which the player answered at least one task, computed from the log. The module keeps no streak of days, and the player's side of the client has no notification code: no Web Push subscription, no Notification API call and no service-worker push handler. A static check fails the build if any of these appear outside the Parent Room's code, which keeps room for the parent's alarm that ADR-0110 leaves to a later stage.

The nearest goal is the goal with the smallest remaining share, among the next level, the next evolution, the next forge recipe, the bestiary percentage and the next Diary page, with ties broken in that order. I chose "smallest remaining share" so the goal shown is the one she can reach soonest. The server sends it with the main screen and with the end of every scene. The experience bar shows points toward the next level.

### Rewards

The grants follow RES-2100's table, and every amount is a starting value in `content/economy.json`:

| Source | Buttons | Shards | Yarn | Material | Threads |
| --- | --- | --- | --- | --- | --- |
| First attempt, any outcome | 1 | - | - | - | - |
| Second attempt | 0 | - | - | - | - |
| Clean unassisted scored first attempt, not a rapid guess | - | 1 | - | - | - |
| Floor finished, any state | - | 2 | - | - | - |
| Guardian problem finished, any ending | - | - | 3 | - | - |
| Clean row | - | - | 1 | - | 1 |
| Big clean row, each | - | - | 1 | - | 0 |
| Daily quest | 10 | - | - | - | 1 |
| Pattern row | - | - | 2 | - | - |
| Room chest, beside the pick | - | - | - | 1 of the floor's | - |
| Floor chest, beside the pick | - | - | - | 2 of the floor's | - |
| Success-branch find | - | - | - | 1 of the floor's | - |
| Story or chest find of threads | - | - | - | - | 1 or 2 |
| Familiar hatching or evolving | - | - | - | - | 2 |
| Observatory visit | - | - | - | 1 moon mote | - |
| Chest pick: ordinary, good, sparkling | 15, 25, 40 | 5, 8, 12 | 2, 3, 4 | - | - |

The thread column carries the amounts ADR-0080 sets and asks this module to fire; ADR-0080 owns the stock, the cap and spending. How often a thread find appears is a value in `economy.json`, the one knob ADR-0080 leaves for its daily balance of 8 to 10 threads (REQ-0512).

No grant reads a time field, so speed earns nothing. The Tower has nine floor-worlds: eight in the element ring, each with its own material, and the Observatory outside it, which gives the moon mote.

A chest offers three rewards from three different categories out of cosmetics, shards and yarn, buttons and Diary pages. For each category the module computes the shortfall from the next goal, a share from 0 to 1, as RES-2100 defines it, and takes the three largest. A tie breaks by a hash of the day's seed and the category name, so the same state on the same day gives the same chest and no answer enters the choice. Quality follows the branch, and I chose this split so that `success` always beats `alt` by exactly one step in two slots:

| Chest | Largest shortfall | Second | Third |
| --- | --- | --- | --- |
| Room on `success`, floor on `triumph` | sparkling | good | ordinary |
| Room on `alt`, floor on `victory` or `cunning`, a stateless floor | good | ordinary | ordinary |

A Diary page has no quality tier and always counts as good, so when pages take the largest shortfall in a success chest, the sparkling slot moves to the next category. A cosmetic reward is an item she doesn't own, from the category its quality names: a curiosity when ordinary, an accessory when good and an outfit when sparkling. The floor chest on `triumph` adds the floor's special reward. The server logs the three offered rewards, so a resume before the pick shows the same three.

The shop sells for buttons only, at the fixed prices REQ-2156 sets, shown before she buys. The shelf holds 1 focus, 2 outfits, 2 accessories and 1 curiosity. At the start of each game day the module replaces 2 slots with items of the same category, taking emptied slots first and then the longest-standing. It picks each item by a hash of the day's seed. The candidates are the items she doesn't own that aren't on the shelf and haven't left it unsold in the last 7 days. The catalogue holds at least 20 items outside the forge recipes. The shop opens on day one. The forge opens with the first recipe at the end of the first day on which she holds a floor material. The first room chest guarantees one on her first day, so the forge opens well before the seventh day REQ-2126 allows. Every recipe has three rows, shards, yarn and one floor material, at the tier amounts of REQ-2172, and the MVP ships the six recipes REQ-2176 names.

A trick's catalogue entry names an animation preset and a sound, and its schema has no field any other rule reads. The game offers no purchase with money, has one currency for the shop and shows no leaderboard. The API of ADR-0030 has no payment route and no route that ranks players, and a static check fails the build if a payment SDK or a ranking endpoint appears.

### Familiars

`content/familiars.yaml` holds the roster, one entry per familiar with its element, floor, canon name, moves and stages. Every entry carries `ownerApproved: true` before the server loads it, because the owner judges each name, creature and term for originality (REQ-1948). The MVP roster is the six required familiars and, only when every stage picture of each has a chosen variant (ADR-0170), up to three more from the list REQ-1922 gives; a load check fails on any other familiar. The canon gives each familiar three stages; the MVP file lists three for the starters and two for the rest.

In Session 0 the player chooses one of the three starters and names it, with the canon name offered first and hers allowed in its place. She gives it one or two traits, from the list in the string files or her own through the free-text path of ADR-0110. The same naming rule holds for every familiar that hatches. The naming window of ADR-0110 draws the suggestions, and this module filters them before the hatching screen shows them. It drops a suggestion that equals the name of any move in `familiars.yaml` (REQ-3532) or the current name of anything she has named (REQ-3534). It compares names after trimming, folding case and folding «ё» to «е», and fills a dropped place from ADR-0110's hand-written list under the same filter. A move name is a word she meets in battle scenes, and two creatures with one name would blur which one the story means.

Friendship grows from shared play and never reads a verdict. I chose these starting values, all in `familiars.yaml`: a familiar in the active team gains 1 point for each scene it shares, 2 for each rest stop and 3 for a campfire talk, and each friendship level costs 10 points. A typical day of about 8 scenes and 2 rest stops (RES-2000, RES-0300) then gives about 12 points, so level 5 comes in about 4 days and level 12 in about 10. A starter evolves at friendship levels 5 and 12 and a non-starter at level 5, in its own scene at the next rest stop after the threshold. A familiar past level 12 whose third stage hasn't shipped stays at its second stage, and when a content update adds the stage, it evolves at the next rest stop. A planned friendship with a roster familiar has one scene outcome, success. The familiar state has no value for dead, ill or lost, and no rule removes a familiar from the roster.

The element ring lives in `familiars.yaml` as data. Only the scene's strike effect and, after the MVP, battles read it; no function in the outcome, selection or knowledge-model code imports it, and a dependency check fails the build if one does. If battles are built, a battle is a pure function of the team, the moves chosen and the opponent, with no seed, and a lost battle grants and removes nothing.

The bestiary is a projection. It shows a page for each creature met, the share of the shipped roster met as a whole-number percentage, and the habitat by floor from the element's floor. Each roster creature not yet met shows as a silhouette, drawn in code from its first-stage picture's alpha channel.

### What works once this is accepted

On top of ADR-0010 to ADR-0130, a played adventure ends rooms and floors on logged branches and states and fills chests. It grants currencies, levels up, tracks quests, grows friendship and evolves familiars, all testable through the API with no screen. What doesn't work yet: the screens and ceremonies wait for ADR-0150 and the Russian words for ADR-0160. The pictures wait for ADR-0170, the Parent Room's views for ADR-0180 and the calibration simulation for ADR-0190. Without this decision the game still asks and checks tasks; it shows no results and grants nothing.

## Why

The research fixes the shape of the rules, and the choices left are where they run and where their numbers live. RES-1700 conclusion 1 makes every outcome a deterministic function of verdicts, seeds and order, and forbids the Master to compute one, so the rules can't run in a model. RES-2100 conclusion 4 forbids random draws and hidden odds in chests, so the only variety allowed is the day's seed. REQ-2924 asks the same seeds, times and verdicts to give the same outcomes and awards, which a pure function over the event log gives for free (ADR-0020).

The numbers must change without code (REQ-1728, REQ-1930, REQ-2158, REQ-2174), because every amount in RES-2000 and RES-2100 is a starting value to check against two weeks of stage 0.3 play, and the thresholds wait for the stage 0.1 simulation. Code holds the rule and a data file holds the number, so a tuning pass is a content change the verify command can test.

Logging decided results, where a projection could recompute them, follows from calibration: once the thresholds change, a recompute under the new version would give some past rooms a different branch from the one she saw. RES-2550 already carries `thresholdVersion` in every shown item for this reason.

The friendship amounts, the chest quality split, the nearest-goal rule and the forge's opening day are defaults RES-1900, RES-2100 and RES-2000 leave open. I chose each to be the simplest rule that keeps answers out of it, and each is a content value or a short function that the spec can change.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: let each screen and the Master settle results as they come | nothing to build now, and the Master could write varied results | the Master may not compute an outcome (RES-1700), and results spread across screens can't be replayed from the log (REQ-2924) |
| The Master decides branches and chest contents from the story | richer, less predictable results that fit each scene | a model reply drifts, so the same answers could give different branches, and RES-1700 and RES-2100 forbid it |
| Rules and numbers as TypeScript constants | the simplest code, with every number type-checked at compile time | REQ-1728, REQ-1930, REQ-2158 and REQ-2174 require a change without code, and a calibrated threshold would need a release |
| A general rules engine, such as json-rules-engine, with rules as data | the owner could change a rule's logic, not only its numbers, without code | the requirements fix the rules and leave only the numbers to tune, so the engine adds a second language to test and debug for a freedom nobody asked for |
| Chests from published random odds | surprise at each opening | REQ-2106 forbids random draws and odds, and a missed draw reads as a loss |

## What it costs

The owner pays in content upkeep: five content files, their schemas and the checks that keep them honest, and a decision record for each calibrated thresholds version. The first-month review adds one sitting of about an hour to compare the triumph chapters with the target and edit one number. If nobody holds it for a month, version 1 stays in force and the game plays as designed, only less well tuned.

The build pays in checks that are easy to forget: the static checks for notifications, payments and leaderboards, the dependency check on the element ring, the canon wording check and the fallback-ending check. Each is a test the verify command of ADR-0190 runs.

The player pays with predictability. A chest she could compute from her stock is less surprising than a lottery, and after a few weeks she may learn which category comes next.

The strongest objection is that the accuracy bonuses still pay for being right. Shards, yarn, the sparkling slot and success-branch secrets all come faster with correct answers, so a slow careful guess earns more than an honest "I don't know", and the rapid-guess cap catches only fast guesses. I keep the bonuses because the owner's draft puts them there and RES-2100 bounds them. Clean work speeds the forge by about 40 %, a week at clean share 0.4 still forges an outfit and an accessory, and experience, buttons and friendship are the same for every verdict. The objection is the first reversal condition, measured in stage 0.3.

## What would reverse it

- If the share of "I don't know" answers falls below a third of its week-one value while wrong answers rise during stage 0.3, the bonuses are pushing her to guess. Shards and yarn would then move to a base with no accuracy term.
- If the stage 0.1 simulation finds no thresholds version that meets all four targets of REQ-1730 on the mixed profiles, a fixed threshold is the wrong tool, and the room and floor rules would move to thresholds relative to her own recent shares.
- If her end-of-day thread stock climbs week on week in stage 0.3 while her `alt` answers hold steady, she is saving threads to protect a room's branch. Assisted first attempts would then count at full value.
- If the owner wants a rule, not a number, changed more than twice in the first two months, the rules would move into data after all.

## Consequences

- ADR-0020's catalogue holds `room_outcome` and `floor_outcome`, the room branch and the floor state with `thresholdVersion`, and `reward_granted` carries the amount granted, so a price or amount change never rewrites history.
- ADR-0030's answer reply carries the outcome, the badge, the streak's garland state and the grants (REQ-2416); the client computes none of them.
- ADR-0110 receives the branch, the floor state and friendship events as story events and writes three Guardian endings before each Guardian problem; its line pool uses the three outcome names.
- ADR-0160 gains string keys for badges, quests, items, recipes, traits and ranks.
- ADR-0170 must produce a chosen picture for every stage a familiar entry lists before the entry joins the MVP roster.
- ADR-0190's simulation must report the four target shares of REQ-1730 for every thresholds version, and its verify command runs the content and static checks this record names.
- The reward queue has a ceiling: it can't hold more than one entry a room over 6 sessions, about 30, because entries drain at 6 sessions old. If it passes 40 entries, the Parent Room reports it once, because that count means the drain has stopped; the ceiling stands in the Baselines table of ADR-0190.
- A slot the shelf can't fill, because every item of its category is owned, on the shelf or resting, is the failure state `shelf_slot_empty`. The slot shows the shopkeeper's restocking line, and the Parent Room tells the owner once that the catalogue needs items.
- A content file that fails its schema is the failure state `content_invalid`: the server keeps the last valid version and refuses the new one, and the verify command reports it to the owner, who fixes the file. The player sees nothing.
- A Guardian without three endings at runtime is the failure state `guardian_endings_missing`, which the build check makes unreachable in a released build. If it happens anyway, the Director skips the Guardian problem, the floor ends with the System's state line, and the log tells the owner.

The security boundary is the server: the client holds no rule and no amount. A reload, a double tap or a replayed request can't grant twice or re-roll a chest, because ADR-0030 deduplicates answers and a chest is logged once offered. The likeliest attacker is the player herself, testing whether a refresh changes a chest; the deterministic chest answers her.

Premortem, written as if it happened: by November the player had learned that a success room brings the sparkling slot. On hard rooms she began guessing slowly for the chance of it, so the knowledge model saw more wrong answers and fewer "I don't know". Nobody noticed, because the rapid-guess share stayed under 15 % and nothing else was watched. The thresholds had been calibrated once, in stage 0.1, on synthetic profiles, and version 1 was never revisited because the first-month review slipped. The reversal condition on "I don't know" is the watch that would have caught it.

## How I will know it was realised

1. A replay test feeds a recorded adventure's log twice, with the same content versions, and gets identical outcomes, branches, states, grants, chests, shelf, quests, friendship and evolutions.
2. A test changes `content/thresholds.json` to version 2 and rebuilds the projections: every past room branch and floor state stays as logged.
3. Unit tests cover each row of the badge mapping, each streak rule including resume and a new adventure, the rapid-guess and assisted-attempt caps in both shares, and the stateless floor.
4. The simulation of ADR-0190 on the mixed profiles reports, for version 1, success in 55-75 % of rooms, cunning in at most 25 % of floor-days, triumph in 15-35 % and triumph chapters near half, or fails the build.
5. A test plays one adventure with every answer "I don't know" and gets the same experience, buttons, quest completions and friendship as the same adventure with every answer correct.
6. A test plays the same state on the same day twice and gets the same chest; a test with two categories tied shows the tie broken the same way whatever the answers.
7. Static checks fail the build on a notification API in the player's client, a payment SDK, a leaderboard route or a verdict-reading quest template. They also fail it on a trick field read by any rule, an element-ring import from outcome or selection code, a canon threshold number, or a Guardian with fewer than three fallback endings.
8. A test in a simulated first week shows the forge open by the end of day one and the shop open from the first screen.

## What this does not settle

- How the Director chooses tasks, rooms' lengths and the route; ADR-0070 and ADR-0090 own them, and this record only reads the verdicts and slots they produce.
- How a rapid guess is detected; ADR-0070 flags it and this record only consumes the flag.
- The words the player reads and how Russian plurals agree with the counts; ADR-0160 owns them.
- How the screens draw the garland, the ceremonies, the chest and the bestiary; ADR-0150 owns them.
- The pictures of familiars, stages, items and silhouettes' sources; ADR-0170 owns them.
- Guiding threads, their stock, cap and the conversion of surplus threads into buttons; ADR-0080 owns them, and this record's quest and clean-row rules only call its grant.
- Calibrated thresholds; they arrive in a later decision record, named by version, after the stage 0.1 simulation.
- Familiar battles, stats, paths, rank changes, legendaries and AI-made creatures, which come after the MVP; this record fixes only the rules they must follow when they arrive.

Amended by ADR-0250, ADR-0260, ADR-0280, ADR-0290, ADR-0320 and ADR-0330, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.
