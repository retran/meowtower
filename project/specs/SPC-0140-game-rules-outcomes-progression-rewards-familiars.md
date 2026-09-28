---
id: SPC-0140
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-1700, REQ-1702, REQ-1704, REQ-1706, REQ-1708, REQ-1710, REQ-1712, REQ-1714, REQ-1716, REQ-1718, REQ-1720, REQ-1722, REQ-1724, REQ-1726, REQ-1728, REQ-1730, REQ-1732, REQ-1734, REQ-1736, REQ-1738, REQ-1740, REQ-1742, REQ-1744, REQ-1746, REQ-1748, REQ-1750, REQ-1752, REQ-1754, REQ-1756, REQ-1758, REQ-1760, REQ-1762, REQ-1764, REQ-1900, REQ-1902, REQ-1904, REQ-1906, REQ-1908, REQ-1910, REQ-1912, REQ-1914, REQ-1916, REQ-1918, REQ-1920, REQ-1922, REQ-1924, REQ-1926, REQ-1928, REQ-1930, REQ-1932, REQ-1934, REQ-1936, REQ-1938, REQ-1940, REQ-1942, REQ-1944, REQ-1946, REQ-1948, REQ-1950, REQ-1952, REQ-1954, REQ-2000, REQ-2002, REQ-2004, REQ-2006, REQ-2008, REQ-2010, REQ-2012, REQ-2014, REQ-2016, REQ-2018, REQ-2020, REQ-2022, REQ-2024, REQ-2028, REQ-2030, REQ-2032, REQ-2034, REQ-2036, REQ-2038, REQ-2100, REQ-2102, REQ-2104, REQ-2106, REQ-2108, REQ-2110, REQ-2112, REQ-2114, REQ-2118, REQ-2120, REQ-2122, REQ-2126, REQ-2130, REQ-2132, REQ-2134, REQ-2136, REQ-2138, REQ-2140, REQ-2142, REQ-2144, REQ-2146, REQ-2148, REQ-2150, REQ-2152, REQ-2154, REQ-2156, REQ-2158, REQ-2160, REQ-2162, REQ-2164, REQ-2166, REQ-2168, REQ-2170, REQ-2172, REQ-2174, REQ-2176, REQ-2178, REQ-2182, REQ-2184, REQ-2186, REQ-3532, REQ-3534, REQ-5018, REQ-5020, REQ-5416, REQ-5418, REQ-5422, REQ-6414]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The game rules: outcomes, progression, daily quests, rewards, chests, forge, shop and familiars

## Scope

This document covers the server module `src/game/`, which turns play into story results and rewards: a spell's outcome and badge, the streak and clean rows, the room branch, the floor state and the chapter finale's variant, the reward queue, experience, level and rank, the daily quests and their rewards, the day count and the nearest goal, every grant of buttons, shards, yarn and floor materials, chests, the shop, the Thread Forge, the familiars and the bestiary. It is written at the level of game rules: the content files the rules read, the events they log, the routes that reach them and the values they compute. It holds no diagram.

It leaves out what other specifications state. SPC-0030 states the routes' shared contract, the answer reply, repeated requests, the resume point and the three-day wrap-up. SPC-0080 states the attempt flow, second attempts and the guiding threads' stock, cap, spending and the amounts of each thread grant. ADR-0330 states the schedule that opens each system by days of play, the route choice and which categories a chest draws from before and after the Diary opens. ADR-0320 states the level-up ceremony and what a trick changes. ADR-0260, ADR-0280 and ADR-0290 state the grants of the short loop, of Diary puzzles and of the Volley, and how a Volley counts for the streak. ADR-0230 states the verdicts of a composed riddle. The words the player reads, the screens that draw the garland, chests and bestiary, and the pictures belong to the specifications of strings, the interface and the art.

## Boundary

### The module and its content files

`src/game/` is a set of pure TypeScript functions. Given the same event log and the same content versions, it returns the same results, because it reads no clock, no random source and no model reply; the day's seed is its only source of variety (REQ-1700). The Director calls it, the event log records what it decided, and the client shows only what the server sends.

| Rule set | Content file | What it decides |
| --- | --- | --- |
| Outcomes | `content/thresholds.json` | a spell's outcome, the badge, the streak, clean rows, the room branch, the floor state, the chapter finale's variant, the reward queue |
| Progression | `content/economy.json` | experience, level, rank, daily quests, the pattern row, the day count, the nearest goal |
| Rewards | `content/economy.json` | buttons, shards, yarn, floor materials, chest contents and quality, shop prices and shelf, forge recipes |
| Familiars | `content/familiars.yaml` | the roster, starters, friendship points and levels, evolution stages and thresholds, the element ring, the bestiary |
| Items | `content/economy.json` | the catalogue of outfits, accessories, foci, curiosities and tricks, each with a category and no power field |

Each file carries a `version` field and a zod schema, and the server validates every file at start-up (REQ-1728, REQ-1930, REQ-2158, REQ-2174). A player-facing name in these files is an id; its words live in the per-language string files.

### Routes

| Route | What it does |
| --- | --- |
| `POST /api/session/:id/chest` | `{ chestId, rewardId, clientSeq }`: her pick of one of the chest's three offered rewards. |
| `POST /api/game/shop/buy` | Names a shelf item and carries `clientSeq`; spends its price in buttons and adds the item. |
| `POST /api/game/forge` | Names a recipe and carries `clientSeq`; spends the recipe's shards, yarn and material and adds the item. |

The API has no payment route and no route that ranks players (REQ-2118, REQ-2122). The answer reply of SPC-0030 carries the outcome, the badge, the garland's state and the grants, and the main screen and the end of every scene carry the nearest goal.

### Events this part logs

All go through `appendEvents`.

| Event | Payload |
| --- | --- |
| `verdict` | this module adds the spell's `outcome` to the checker's verdict |
| `room_outcome` | the room's branch, `success` or `alt`, and `thresholdVersion` |
| `floor_outcome` | the floor's state, `triumph`, `victory` or `cunning`, and `thresholdVersion`; it marks the floor completed |
| `combo` | a clean row or a big clean row fired |
| `reward_granted` | the currency or item, the amount granted and the source |
| `reward_reopened` | a queued reward came back |
| `chest_offered` | the chest's three offered rewards with their categories and qualities |
| `chest_chosen` | her pick |
| `level_up` | the level reached |
| `quest_progress` | a daily quest counted an act, or was met |
| `shop_purchase` | the item bought and the price paid |
| `forge_crafted` | the recipe and the item forged |
| `familiar_hatched` | the familiar, the name she gave and her traits |
| `familiar_friendship` | the familiar and the points gained |
| `familiar_evolved` | the familiar and the stage reached |

### Failure states

| Name | Audience | Meaning |
| --- | --- | --- |
| `content_invalid` | the owner, through the verify command or the start-up log | a content file fails its schema |
| `guardian_endings_missing` | the owner, through the log | a Guardian reached its problem without three endings |
| `shelf_slot_empty` | the owner, through the Parent Room | a shelf slot has no candidate |
| `409 not_enough_buttons` | the developer | a shop purchase the button stock can't pay |
| `409 not_enough_materials` | the developer | a forge request a row of the recipe can't pay |
| `404 system_closed` | the developer | the forge or shop route before its system has opened, as ADR-0330 states |

### What this part requires from other parts

- The event log supplies `appendEvents` and the projections `resume_snapshot`, `reward_queue` and `systems_open`.
- The checker supplies each attempt's verdict and credit, the Director the slot, the scored flag and the `rapidGuess` mark, and the attempt flow the `assisted` flag and the attempt number.
- The game-day module supplies the game-day index and the day's seed.
- The Master supplies Guardian endings, and `content/branches.ru.json` the fallback endings. The naming window supplies name suggestions.
- The art pipeline supplies a chosen picture for every stage a familiar entry lists.

### Permitted dependencies

The dependencies run one way. `src/game/` imports only `src/shared/` and its content schemas, and nothing from the client, the gateway or the model code. The Director and the route code call `src/game/`, and `src/game/` never calls them. No function in the outcome rules, the Director's selection or the knowledge model imports the element ring; only the scene's strike effect and, after the MVP, battles read it (REQ-1906). No rule reads a trick's fields. The player's client imports no rule and holds no amount: it draws what the server sends.

## Behaviour

### A spell's outcome and badge

A spell has exactly three outcomes, judged on the first attempt's verdict: `clean` for a correct verdict, `partial` («почти», almost) for a partial verdict, and `alt` («ослаблен», loosened) for a wrong answer or «Не знаю» (I don't know) (REQ-1742). On a word problem answered «Нельзя узнать» (can't be known), the verdict `insufficient_correct`, with the withheld given chosen, gets credit 1 and the outcome `clean` (REQ-5416). The verdict `insufficient_partial`, with a wrong given or none, gets credit 0.5 and the outcome `partial` (REQ-5418). The verdict `false_insufficient`, on a solvable problem, counts as a wrong answer with credit 0 and the outcome `alt` (REQ-5422).

A task's outcome and every bonus depend on the unassisted first attempt alone (REQ-1702). A second attempt never enters the outcome, the streak, a bonus or the room branch (REQ-1704). An assisted first attempt, one answered after a thread opened its hint ladder, gets its outcome and badge from its verdict, counts the smaller of its slot value and 0.5 in the room and floor shares, leaves the streak unchanged and earns no shard, as ADR-0140 sets.

The badge is a view of the outcome (REQ-1760):

| Outcome | Badge |
| --- | --- |
| `clean` that brings the streak to 3 or to any multiple of 5, closing a clean row | `crit` |
| any other `clean` | `clean` |
| `partial` | `partial` |
| `alt` after a wrong answer, `false_insufficient` included | `soft`, «Узел ослаблен» (Knot loosened) |
| `alt` after «Не знаю» | `unknown`, «Принято» (Accepted) |

The badge labels are string keys whose Russian values are the two texts above (REQ-1762). A rapid guess gets the same outcome and badge as any answer with its verdict, so the screen draws it the same way (REQ-1714). Every outcome, `alt` included, moves the story on to the next step, and no outcome ends the adventure (REQ-1706).

The canon and the line pool name the outcomes clean, almost and loosened, and nothing else (REQ-1744). The canon describes the room's branch rule in words and states no threshold value (REQ-1764). A content check fails when `canon.ru.md` or `lines.ru.json` names another outcome, or states a share as a number beside the words for a room's branch.

### The streak and clean rows

The streak counts within one adventure. It starts at 0 when an adventure starts (REQ-1756) and lives in the resume snapshot, so leaving and resuming the same adventure keeps it (REQ-1758). It grows by 1 only on a `clean` unassisted first attempt on a scored task that isn't a rapid guess (REQ-1746). It stays as it is on a `partial` outcome, a rapid guess, a warm-up, a check fact and an unscored task (REQ-1748), and any other `alt` outcome ends it (REQ-1750). An assisted first attempt also leaves it unchanged, whatever its outcome, so a wrong rapid guess, a wrong assisted attempt or a wrong warm-up leaves the garland as it was.

When the streak reaches 3, the module logs `combo` and fires a clean row, which grants 1 star yarn and 1 guiding thread (REQ-1752). Before guiding threads open on day 2 of play, that thread goes into her stock and stays undrawn until they open. At every multiple of 5 it fires a big clean row, which grants 1 star yarn (REQ-1754) and closes a clean row for the badge. The client draws the streak as a garland with no digits (REQ-1708). When the streak ends, the server sends no event, line or sound about it (REQ-1710).

### Room branch, floor state and chapter finale

A room's slot values are `clean` 1, `partial` 0.5 and `alt` 0. A rapid guess counts 0.5 when correct and 0 when wrong (REQ-1712). An assisted first attempt counts the smaller of its slot value and 0.5, so an assisted `clean` or `partial` counts 0.5 and an assisted `alt` 0. A room takes `success` when its clean share over all its slots reaches the room threshold, and `alt` otherwise (REQ-1716).

A floor's share uses the same values over its rooms' scored tasks and its Guardian's problem, leaving out mental arithmetic, warm-ups and check facts. The floor is `triumph` at the triumph threshold, `victory` at the victory threshold and `cunning` below it. A floor with no rooms and no Guardian gets no state (REQ-1722), and it stays out of the day's summary and out of the chapter finale's shares (REQ-1724). The chapter finale takes its triumph variant when at least the first share of its floor-days are `triumph` or `victory` and at least the second share are `triumph`.

`content/thresholds.json` version 1 holds these values:

| Threshold | Version 1 |
| --- | --- |
| Room `success` at a clean share of at least | 0.6 (REQ-1736) |
| Floor `triumph` at least | 0.8 (REQ-1736) |
| Floor `victory` at least | 0.5 (REQ-1736) |
| Chapter finale: `triumph` or `victory` share at least | 0.5 (REQ-1738) |
| Chapter finale: `triumph` share at least | 0.3 (REQ-1738) |

The Director logs each branch and state when it decides them, as `room_outcome` and `floor_outcome` with the `thresholdVersion` it used, so a replay of the log gives the same outcomes (REQ-1700). A projection rebuilt later replays the logged result and never derives it again under a newer version. A calibrated version enters `content/thresholds.json` only beside a decision record the owner approves that names the version (REQ-1734).

Both room branches and all three floor states move the campaign on by the same step: the next scene, the floor count and the quests advance alike, and only the scene, the lines and the bonus differ (REQ-1718). Before a Guardian's problem starts, the Director holds all three Guardian endings, from the Master or from `content/branches.ru.json` (REQ-1726). A build check fails when a Guardian lacks a fallback ending for any state.

### The reward queue

A reward the Director ordered for `success` and missed on `alt` enters `reward_queue`. The next lead-in takes from the queue first, oldest first, and an entry 6 sessions old comes without a trial at the first scene of the next session, whether that scene is a floor entry or any other, logged as `reward_reopened`. So every missed reward returns within 7 sessions (REQ-1720). Checkpoint pages and legendary rewards never enter the queue, because they come by the calendar. The secrets a wrapped-up adventure left unopened enter the same queue, as SPC-0030 states, and return under the same rule.

### The simulation and the first-month review

Before release, the simulation of the verify command runs version 1 on mixed-knowledge profiles after a cold start, and reports the four target shares: `success` in 55 to 75 % of rooms, `cunning` in at most 25 % of floor-days, `triumph` in 15 to 35 % of floor-days and the chapter finale's triumph variant in about half of chapters (REQ-1730), which the test holds to 40 to 60 % of simulated chapters. An automatic test fails the build when the thresholds in force miss any of the four (REQ-1732).

The first-month review follows this checklist, which the comment block of `content/thresholds.json` repeats (REQ-1740):

1. Count the chapters that took the triumph variant, against the band of 40 to 60 %.
2. Change the chapter `triumph` share first, before any other threshold.
3. Write the new version and its decision record, which the owner approves (REQ-1734).

### Experience, level and rank

Experience comes from effort, from these starting values in `content/economy.json`: 5 for any first attempt, whatever its verdict, 3 for a second attempt, 10 for a scene, 20 for a floor in any state, 50 for a met daily quest (REQ-2034) and 60 for a completed adventure. An unassisted first attempt earns the same experience whether the answer is right, wrong or «Не знаю» (REQ-2000). By RES-2000's estimate of one adventure's first attempts, scenes, floors and quests, these amounts give about 521 experience for one 60-minute adventure, inside 500 to 650 (REQ-2004). Leaving level L costs `min(150 + 20 * (L - 1), 600)` experience. The experience bar shows the points toward the next level (REQ-2018).

A level-up logs `level_up` and grants no stat points, buttons, guiding threads or other reward (REQ-2028); ADR-0320 states its ceremony. Experience, level, rank, owned items, currencies, friendship and pages only grow: no rule subtracts from them after an answer, a mistake or a missed day (REQ-2002), and only a purchase or a forge she chose spends currency, and each adds an item. A mistake or «Не знаю» takes away no currency, item or other reward (REQ-2100).

The heroine holds rank E from Session 0 through the MVP (REQ-2020), and «Мирра Шпилька» (Mirra Hairpin), her rival, holds rank D (REQ-2036), both as fixed content values. The MVP shows and offers no stats (REQ-2030) and no paths (REQ-2032), and the canon names no month for any rank (REQ-2038). If stats arrive later, the module sends the Master each stat only as low, medium or high relative to the others (REQ-2022), and no task rule reads a stat (REQ-2024).

### Daily quests and daily rewards

Daily quests and daily rewards come every game day once their system has opened, as ADR-0330 states, and no setting or rule switches them off (REQ-5018). The module picks the day's 3 daily quests by the day's seed. They show beside «В прошлый раз…» (Last time…), the opening scene ADR-0110 orders from the planner's latest session summary, or beside the library opening that replaces it when that order fails. The daily rewards are the grants of a met quest: 50 experience, 10 buttons (REQ-2132) and the guiding thread SPC-0080 states. The choice of two routes of the day comes beside the 3 quests and never takes a quest's place (REQ-5020).

Every quest template counts an act of play, such as clearing floors or picking from a chest, and none counts a correct answer, so every quest can be met without answering any task correctly (REQ-2006). A content check rejects a template whose counter reads a verdict. The module logs `quest_progress` as a quest counts an act and when it is met. A quest unmet when the game day ends disappears with no penalty and no event she sees (REQ-2008).

The optional pattern row comes at most once in 3 days, from a `success` branch, and gives 2 star yarn and nothing else (REQ-2144).

### The day count, the nearest goal and no reminders

The day count is the number of game days on which she answered at least one task, computed from the log and shown as her days in the Tower (REQ-2010). The module keeps no streak of consecutive days and the client shows none (REQ-2012).

The player's side of the client sends no notification or reminder to come back (REQ-2014). It holds no Web Push subscription, no Notification API call and no service-worker push handler, and a static check fails the build if any of these appear outside the Parent Room's code.

The nearest goal is the goal with the smallest remaining share among the next level, the next evolution, the next forge recipe, the bestiary percentage and the next Diary page, with ties broken in that order. The module picks only among goals whose system is already open, as `systems_open` shows. The server sends it with the main screen and with the end of every scene (REQ-2016).

### Grants

Every amount is a starting value in `content/economy.json`, and `reward_granted` records the amount granted, so a changed amount never rewrites history.

| Source | Buttons | Shards | Yarn | Material |
| --- | --- | --- | --- | --- |
| First attempt, any outcome; a Volley counts as the 2 first attempts it replaces | 1 (REQ-6414) | - | - | - |
| Second attempt | 0 (REQ-2130) | - | - | - |
| Clean unassisted scored first attempt, not a rapid guess | - | 1 (REQ-2136) | - | - |
| Floor finished, any state | - | 2 (REQ-2138) | - | - |
| Guardian problem finished, any ending | - | - | 3 (REQ-2142) | - |
| Clean row | - | - | 1 | - |
| Big clean row, each | - | - | 1 | - |
| Daily quest met | 10 (REQ-2132) | - | - | - |
| Pattern row | - | - | 2 (REQ-2144) | - |
| Room chest, beside the pick | - | - | - | 1 of the floor's (REQ-2148) |
| Floor chest, beside the pick | - | - | - | 2 of the floor's (REQ-2150) |
| Success-branch find | - | - | - | 1 of the floor's (REQ-2152) |
| Observatory visit | - | - | - | 1 moon mote (REQ-2154) |
| Chest pick: ordinary, good, sparkling | 15, 25, 40 (REQ-2134) | 5, 8, 12 (REQ-2140) | 2, 3, 4 (REQ-2146) | - |

The module also fires the guiding-thread grants whose amounts SPC-0080 states: a clean row, a met quest, a story or chest find of threads, and a familiar hatching or evolving. How often a thread find appears is a value in `economy.json`.

No grant reads a time field, so every reward is independent of how fast she answers (REQ-2102). The Tower has nine floor-worlds: eight in the element ring, each with its own material, and the Observatory as the ninth, outside the ring, which gives the moon mote (REQ-2182).

### Chests

A chest offers three rewards from three different categories, and shows all three before she picks one (REQ-2104). For each category the module computes the shortfall from the category's next goal, a share from 0 to 1 as RES-2100 defines it, and fills the chest from the three categories that fall furthest short (REQ-2184). A tie breaks by a hash of the day's seed and the category name, so the same state on the same day breaks it the same way, and no answer enters the choice (REQ-2186). The chest therefore follows visible rules alone: the same state on the same day gives the same chest, with no random draw, hidden odds or pity counter (REQ-2106). ADR-0330 states which categories a chest draws from before and after the Diary opens.

Quality follows the branch:

| Chest | Largest shortfall | Second | Third |
| --- | --- | --- | --- |
| Room on `success`, floor on `triumph` | sparkling | good | ordinary |
| Room on `alt`, floor on `victory` or `cunning`, a stateless floor | good | ordinary | ordinary |

So a room on `success` offers one sparkling reward (REQ-2108), and a room on `alt` offers only ordinary or good ones (REQ-2110). A Diary page has no quality tier and counts as good. When pages take the largest shortfall in a success chest, the pages fill the first slot as good, the category with the second shortfall takes the sparkling quality, and the third slot stays ordinary, so the chest still offers one sparkling reward. A cosmetic reward is an item she doesn't own: a curiosity when ordinary, an accessory when good and an outfit when sparkling. The floor chest grants the floor's special reward beside her pick the first time that floor reaches `triumph`, and a later `triumph` on the same floor adds nothing. Each floor's entry in `content/economy.json` names its special reward, a sparkling cosmetic, and a content test fails a floor without one. The module logs `chest_offered` with the three rewards, so a resume before the pick shows the same three, and a reload or a replayed request can't re-roll a chest.

### The shop

The shop sells for buttons only, and the game has no premium currency (REQ-2112, REQ-2120). Every price is fixed in `economy.json` and shown before she buys (REQ-2114), starting at 80 buttons for a curiosity, 200 for an accessory, 450 for an outfit and 800 for a focus (REQ-2156). A price changes with the content file alone (REQ-2158). The game offers no purchase with real money (REQ-2118) and shows no leaderboard (REQ-2122); a static check fails the build if a payment SDK or a ranking endpoint appears.

The shelf holds six items: 1 focus, 2 outfits, 2 accessories and 1 curiosity (REQ-2160). At the start of each game day the module replaces 2 slots with items of the same category, taking the slots she emptied by buying first and then the slots that have stood longest (REQ-2162). It picks each item by a hash of the day's seed, so the same day and shelf give the same items (REQ-2164). The candidates are the items she doesn't own (REQ-2166) that aren't on the shelf and haven't left it unsold in the last 7 days (REQ-2168). The MVP catalogue holds at least 20 items outside the forge recipes (REQ-2178). ADR-0330 states the day the shop opens.

### The Thread Forge

Every recipe has three rows: star-steel shards, star yarn and one floor material (REQ-2170). The recipe amounts are starting values in `economy.json`, and a recipe changes with the content file alone (REQ-2174):

| Recipe | Shards | Yarn | Floor material |
| --- | --- | --- | --- |
| The first recipe | 5 | 2 | 2 |
| Accessory | 25 | 6 | 3 |
| Outfit | 80 | 20 | 5 |
| Focus | 160 | 40 | 6 |

The amounts are those REQ-2172 sets. The MVP ships six recipes: «Шарф Туманной Погоды» (Scarf of Foggy Weather), «Очки Второго Взгляда» (Glasses of the Second Look), «Капюшон с Ушками Путаницы» (Hood with Tangle Ears), «Сапожки Точного Шага» (Boots of the Exact Step), «Фонарь Терпеливого Света» (Lantern of Patient Light) and «Гримуар Чистых Страниц» (Grimoire of Clean Pages) (REQ-2176). The forge opens with the first recipe on the day ADR-0330's schedule gives it, which is no later than her seventh day of play (REQ-2126).

### The roster

`content/familiars.yaml` holds one entry per familiar, with its element, floor, canon name, moves and stages. The MVP roster holds the six required familiars: «Пуговка» (Pugovka, Little Button) and «Шуршик» (Shurshik, Rustler) for Spark, «Винтик» (Vintik, Little Screw) and «Бубенец» (Bubenets, Sleigh Bell) for Stride, and «Безешка» (Bezeshka, Little Meringue) and «Корица» (Koritsa, Cinnamon) for Crumb (REQ-1918). Beyond them it holds only «Запятый» (Zapyaty, Comma-ish), «Грошик» (Groshik, Little Penny) and «Рулетик» (Ruletik, Little Roll) (REQ-1922), and each of these three joins only when a person has chosen every stage picture of it (REQ-1920). A load check fails on any other familiar.

The server loads an entry only with `ownerApproved: true`, set when the owner has judged its name, creature and terms original, with nothing taken from a known franchise (REQ-1948). The canon gives every roster familiar three stages (REQ-1932). In the MVP file each starter lists three stages (REQ-1926) and every other familiar its first two (REQ-1928). A stage picture joins an entry only as a chosen variant, and the person who chooses it judges it recognisable as the same creature as the previous stage (REQ-1924).

### Starters and names

In Session 0 she chooses her first familiar from «Пуговка», «Винтик» and «Безешка» (REQ-1912). The game asks her to name it (REQ-1914) and to give it one or two traits, from the list in the string files or her own words through the free-text path (REQ-1916); `familiar_hatched` records both.

The same naming rule holds for every familiar that hatches. The hatching screen offers the familiar's canon name as the first suggestion (REQ-1952), and she can replace it with a name of her own (REQ-1954). The module filters the naming window's suggestions before the screen shows them. It drops a suggestion equal to the name of any move in `familiars.yaml` (REQ-3532) or to any name in use in her game (REQ-3534): the current names she gave and the canon names of everything the game has shown her. It compares names after trimming, folding case and folding «ё» to «е», and fills a dropped place from the hand-written list under the same filter.

### Friendship and evolution

Friendship grows from shared play and reads no verdict, so it grows by the same amount whether her answers are right, wrong or «Не знаю» (REQ-1902). A familiar in the active team gains 1 point for each scene it shares, 2 for each rest stop and 3 for a campfire talk, and each friendship level costs 10 points; all are starting values in `familiars.yaml`, and a stage or threshold changes with the file alone (REQ-1930). A planned friendship with a roster familiar has one scene outcome, success, whatever she answered (REQ-1900); ADR-0330 states the day the second familiar's friendship comes.

A starter evolves at friendship levels 5 and 12, and any other familiar evolves to its second stage at level 5 (REQ-1934). The evolution plays in its own scene at the next rest stop after the threshold, and its moment reads no verdict (REQ-1904). A familiar past level 12 whose third stage hasn't shipped stays at its second stage (REQ-1938). When a content update adds that stage, the familiar evolves in its own scene at the next rest stop, keeping all the friendship it earned (REQ-1936).

The familiar state has no value for dead, ill or lost, and no rule removes a familiar from the roster (REQ-1908).

### The element ring and battles

The element ring lives in `familiars.yaml` as data, and affects no task, outcome or measurement (REQ-1906); a dependency check fails the build on an import that breaks the permitted dependencies above. If battles are built, a battle is a pure function of the team, the moves chosen and the opponent, with no seed, so the same choices against the same opponent give the same result (REQ-1950). A lost battle grants nothing and takes away no familiar, item, currency or progress (REQ-1910).

### The bestiary

The bestiary is a projection. It shows a page for each creature she has met (REQ-1940) and the share of the shipped roster she has met as a whole-number percentage (REQ-1942). Each roster creature not yet met shows as a silhouette, drawn in code from its first-stage picture's alpha channel (REQ-1944). Each page shows the creature's habitat by floor, from its element's floor (REQ-1946). ADR-0330 states the day the bestiary opens.

## Failure paths

| Condition | What happens |
| --- | --- |
| A content file fails its schema at start-up | `content_invalid`: the server keeps the last valid version, refuses the new one, and the verify command reports it to the owner; the player sees nothing. |
| A content file has no valid version at the first start-up | `content_invalid`, naming the file: the server refuses to start and tells the owner. |
| A floor's entry in `content/economy.json` names no special reward | The content test fails the build. |
| A familiar entry lacks `ownerApproved: true`, lacks a chosen picture for a listed stage, or isn't one of the nine allowed | The load check fails and the entry never joins the roster. |
| A Guardian lacks a fallback ending for a state | The build check fails. At runtime, `guardian_endings_missing`: the Director skips the Guardian problem, the floor ends with the System's state line, and the log tells the owner. |
| `canon.ru.md` or `lines.ru.json` names a fourth outcome or a share beside the room's branch words | The content check fails the build. |
| A quest template's counter reads a verdict | The content check rejects the template. |
| The player's client holds a notification API, a payment SDK or a ranking endpoint appears | The static check fails the build. |
| A rule reads a trick's field, or outcome, selection or knowledge-model code imports the element ring | The static or dependency check fails the build. |
| The thresholds in force miss a target share of the simulation | The simulation test fails the build. |
| `content/thresholds.json` changes version | Past room branches and floor states stay as logged; only new decisions use the new version. |
| Every item of a shelf slot's category is owned, on the shelf or resting | `shelf_slot_empty`: the slot shows the shopkeeper's restocking line, and the Parent Room tells the owner once that the catalogue needs items. |
| The reward queue passes 40 entries | The Parent Room reports it once, against the ceiling in ADR-0190's Baselines table. |
| A shop purchase costs more buttons than she holds | `409 not_enough_buttons`; nothing is logged. |
| A forge request lacks shards, yarn or material for a row | `409 not_enough_materials`; nothing is logged. |
| The forge or shop route is called before its system opens | `404 system_closed`, as ADR-0330 states. |
| A chest pick, purchase or forge request is sent twice | SPC-0030's deduplication returns the first reply, and nothing is granted or spent twice. |
| She reloads before picking from a chest | The chest reopens with the three rewards `chest_offered` holds. |
| Two suggested names collide with a move or a name in use | The filter drops them and fills their places from the hand-written list. |

## Choices this document makes

- Where REQ-1748 or the assisted-attempt rule and REQ-1750 both meet one `alt` first attempt, the streak stays unchanged: the listed cases name that attempt and REQ-1750 names every `alt`.
- The daily rewards REQ-5018 names are read as the grants of a met daily quest; the morning's guiding threads belong to SPC-0080.
- The shop and forge refusals are named `409 not_enough_buttons` and `409 not_enough_materials`, and log nothing; no decision names them.

## Open review findings

- The agent reviewer asked for the reason of the assisted-attempt rule beside it. Rejected: the method's rule S8 keeps a decision's reasons in the decision, and the sentence now names ADR-0140, which holds this one.
- The second agent review read the name-folding rule as this document's choice. Rejected: ADR-0140 sets it.
