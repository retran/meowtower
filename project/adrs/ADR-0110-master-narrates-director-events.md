---
id: ADR-0110
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-1500, REQ-1502, REQ-1504, REQ-1506, REQ-1508, REQ-1512, REQ-1514, REQ-1516, REQ-1518, REQ-1520, REQ-1522, REQ-1524, REQ-1526, REQ-1528, REQ-1530, REQ-1532, REQ-1534, REQ-1536, REQ-1538, REQ-1540, REQ-1542, REQ-1544, REQ-1548, REQ-1550, REQ-1552, REQ-1554, REQ-1556, REQ-1558, REQ-1560, REQ-1562, REQ-1564, REQ-1566, REQ-1568, REQ-1570, REQ-1572, REQ-1574, REQ-1600, REQ-1602, REQ-1604, REQ-1606, REQ-1608, REQ-1610, REQ-1612, REQ-1614, REQ-1616, REQ-1618, REQ-1620, REQ-1622, REQ-1624, REQ-1626, REQ-1628, REQ-1630, REQ-1632, REQ-1634, REQ-1636, REQ-1638, REQ-1640, REQ-1658, REQ-1660, REQ-1662, REQ-1664, REQ-1666, REQ-1668, REQ-1670, REQ-1672, REQ-1674, REQ-1676, REQ-1678, REQ-1680, REQ-1682, REQ-1684, REQ-1840, REQ-1802, REQ-1804, REQ-1806, REQ-1808, REQ-1810, REQ-1812, REQ-1814, REQ-1816, REQ-1818, REQ-1820, REQ-1822, REQ-1824, REQ-1826, REQ-1828, REQ-1830, REQ-1832, REQ-1834, REQ-1836, REQ-1838, REQ-2610, REQ-2714, REQ-2726, REQ-3316, REQ-3320, REQ-3330, REQ-3712]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0110. The Master narrates only from the Director's story events, inside checked scene orders, a hand-written canon with story memory and a safety pipeline that runs before any text shows

## Decision

The Director, which is code, decides every event of the game. The Master, a
language model reached only through the gateway of ADR-0100, writes the story
around those events and nothing else. Each Master reply passes a fixed set of
checks before it shows. Every place where the Master can fail has a
hand-written or offline-checked text to fall back on, so the story never
waits and never shows unchecked text.

1. The split. The Director (ADR-0070, ADR-0080, ADR-0090, ADR-0140) emits
   typed story events whose only string fields are ids and enum values, so it
   can't write a line of story (REQ-1600, REQ-1602). The Master service turns
   those events into scene orders and applies the effects of each reply. An
   import rule in the lint step keeps `src/server/master/` from importing the
   knowledge model, the selection code or the task engine. The same rule keeps
   the Director from importing the Master's text. So the component that knows
   the maths can't shape a line, and the Master can't read a node.
2. The order and the reply. Both are the zod schemas RES-1600 gives in
   `src/shared/master.ts`, made strict, with four changes:
   - the MVP order carries no `heroStats`, because the MVP has no stats
     (RES-1600);
   - the order names the creepiness level by its name, «Уютно», «Чуть
     жутковато» or «Загадочно», and the checkpoint by its canon key, so the
     egress guard of ADR-0100 finds no digit in it;
   - the order carries her current names for the things she named;
   - the order carries `readerAge`, the one number the egress guard lets
     through.

   The order holds the kind of situation, the floor, the scene's characters,
   the plan beat, the current checkpoint, her cleaned text, the rewards the
   success branch opens and the summary outcome events (`room_outcome`,
   `combo`, `floor_outcome`, `reward_reopened`). Its schema has no field for a
   number, an answer, a verdict, a single-task outcome, a node id or state, an
   estimate, a response time or a lesson tag (REQ-1604). The service discards
   a whole reply that names an unknown speaker, carries an extra field, holds
   an effect outside the closed set or lacks a branch or ending its kind
   requires (REQ-1606, REQ-1610). The Director applies only these effects
   (REQ-1608): `remember`, `relation`, `running_joke`, `diary_page` from the
   predefined list, `reward_hint`, which it can ignore, and `title`. I chose a
   limit of one title a session, because the draft gave no number. The reply
   has no field a task statement could travel in, and task text comes only
   from the frames of ADR-0130 (REQ-1612).
3. The prompt, the canon and memory. People write the canon,
   `content/canon.ru.md`, by hand, and no tool in the repository writes to it
   (REQ-1634). The server mounts `content/` read-only, so the game can't
   change the canon (REQ-1636). Each canon section carries the checkpoint that
   reveals it, and the prompt builder takes only the sections up to the
   current checkpoint, so a later secret never enters the cached block
   (REQ-1638). The system prompt holds these parts:
   - the canon's rules for the Master (CAN-0110);
   - the reader's age as a number, the age the parent set in the Parent
     Room (ADR-0180), sent in the order's `readerAge` field and never with
     her name or school (REQ-1840, REQ-3712);
   - the bans on asking for personal data, on talk of schoolwork or grades
     and on discussing the heroine's abilities;
   - the rule to tell every outcome as an event in the world (REQ-1802, REQ-1804, REQ-1806, REQ-2610).

   Story memory sends the last 7 session summaries, one summary for each
   earlier chapter and at most 200 facts. The prompt drops the facts used
   least recently, and every fact stays stored. I chose these caps to keep the
   dynamic part of a request under about 3,000 tokens, the size RES-2700
   costed. The entity list names characters by the campaign calendar, so from
   the autumn chapter's finale every order calls the ally «Бантик»
   (REQ-3330).
4. The scene cycle. Every scene offers three options, the third one strange
   and funny, and the client always draws «Дальше», so she never has to type
   (REQ-1626, REQ-1628). The free-text field opens only on the order kinds
   `floor_enter`, `guardian`, `camp`, `session_end` and `new_creature`, with
   the note «Эту историю могут читать мама и папа» under it (REQ-1630,
   REQ-1632). The Master drafts 2 to 3 scenes ahead and both room branches
   while she solves tasks. The consequence of an answer comes from the pool
   and the ready branch, and nothing on that path awaits a model (REQ-1614).
   After free text, the wait has a p95 of at most 6 seconds, a limit REQ-1622
   imposes. I split it as 100 ms for the local steps, 4,400 ms for the Master,
   1,000 ms for the reply checks, run in parallel, and 500 ms of slack; the
   split stands in the Baselines table of ADR-0190. When
   12 seconds pass without a checked reply, a line from the fallback pool
   shows, the scene goes on, and the late reply is dropped (REQ-1624). Each
   order carries the duration budget ADR-0070 gives it. Every library scene
   also has a shortest form, which plays once the 10 minutes of story ADR-0070
   allows are spent. The library also holds the short ending ADR-0030 plays
   on a wrap-up.
5. The reply checks. They run in order, cheapest first:
   1. the schema;
   2. length: 1 to 12 lines of at most 280 characters each, a limit I chose,
      branches of 2 to 8 lines and endings of 2 to 6;
   3. speakers, from the canon's entity list or her names;
   4. numerals, by word form against `content/numerals.ru.json`, with canon
      names and her names allowed (REQ-1548);
   5. the one forbidden-word list of ADR-0160, by lemma, which holds the
      shame words, the school words and praise of intelligence;
   6. in parallel, the safety check by `JUDGE_MODEL`, or `SAFETY_MODEL` as its
      fallback, against the forbidden-content checklist, and the creepiness
      Score, which must not pass the order's level (REQ-1616).

   Steps 1, 4, 5 and the safety check run in the shared check module of
   ADR-0120, and a reply reaches the screen only as its `CheckedText` type,
   which only a passing run can build.

   The checklist joins RES-1800's list and RES-1500's always-forbidden list.
   It adds the items that turn on meaning, which ADR-0160's word gate can't
   see: the reply asks for personal data, claims to be human, discusses the
   heroine's abilities, judges or shames her, or shows a Guardian defeated
   (REQ-1804, REQ-1806, REQ-1810, REQ-1812, REQ-1506). It also brings in a
   look-alike of the heroine, has the Reverse One want anything of hers or
   pose as her, or uses a phrase of guilt or attachment (REQ-1562, REQ-1568,
   REQ-1570, REQ-3316). The last items are a knot called «узелок», and the
   ally called «Узелок» from the autumn chapter's finale on (REQ-3320,
   REQ-3330).

   The `alt` branch and the `cunning` ending pass stricter checks. They must
   not end in a dead end, harm the heroine, make a familiar sad because of her
   or hint at her fault (REQ-1554). A reply that fails gets one retry of the
   same order, whose request already names the fallback model (ADR-0100). A
   second failure takes a scene from the library (REQ-1618). The library is
   `content/scenes.ru.json` and `content/branches.ru.json`. For every floor it
   holds at least 3 branch pairs and 3 Guardian ending triples before stage
   0.4, and 20 pairs and 10 triples from stage 0.4. A content test fails the
   build when a floor falls short (REQ-1620). When a budget runs out, the
   scene queue takes every scene from the library, at the same length and
   pace and with no live frames. It drops any reply not yet checked, because
   the checks can't be paid for (REQ-2714, REQ-2726).
6. Her text, before a model reads it. The hand-written triggers in
   `content/safety.ru.json` run first, on her raw text on the Mac (REQ-1816,
   REQ-1834). They're phrase patterns. A content test runs them over the
   canon, the pool and 200 ordinary story phrases, and the test fails if any fires, because
   the Tower is full of secrets that a word list would read as a request to
   keep one. What follows depends on the level:
   - A serious trigger ends the path at once, and nothing is sent. The
     Master's line becomes the fixed «Это звучит серьёзно. Об этом лучше
     рассказать маме или папе — они помогут». The game pauses with
     «Вернуться в историю». A `safety_event` puts a notice at the top of the
     Parent Room until the parent opens it (REQ-1822, REQ-1824, REQ-1826).
   - A narrator trigger answers a direct «ты человек?» or «ты ИИ?» with the
     fixed System line of REQ-1808, and no model is called.
   - Otherwise the gateway cleans the text. The judge's signal Choice among
     none, everyday and serious runs beside the Master's order. The final
     level is the higher of the trigger's and the judge's, so a model never
     lowers what a trigger found (REQ-1836). A judge probability for serious
     at or above the threshold the stage 0 test set sets counts as serious,
     and that's how doubt becomes serious (REQ-1832). A serious result drops
     the Master's reply and takes the serious path.
   - An everyday level makes the order ask for a warm answer inside the
     story, and marks the scene quietly in the dialogue book (REQ-1818,
     REQ-1820).
   - When neither the judge nor `SAFETY_MODEL` answers, the trigger's level
     stands and her text doesn't go to the Master. The scene goes on from the
     pool and is marked unchecked in the book. I chose this over a pause,
     because a network fault isn't doubt about her.

   After the MVP, a serious signal also sends a web push with a fixed line and
   no details to each phone the parent subscribed. A failed push is logged,
   and the notice stays (REQ-1828, REQ-1830).
7. Creepiness and dreamcore. The parent sets a level of 0, 1 or 2, default 1,
   named «Уютно», «Чуть жутковато» and «Загадочно» (REQ-1514, REQ-1516).
   Every order carries the level in force, and every pool line carries a
   minimum and a maximum level, so a line above the level never shows
   (REQ-1518, REQ-1520). Orders for eye exercises, rest stops, the end of the
   row, the heroine's room and the task window force «Уютно» and no
   dreamcore. A content test holds their pool categories to level 0
   (REQ-1524). The always-forbidden list is part of the checklist for every
   reply, and a test counts the positive lines of the labelled test set for
   each item (REQ-1522, REQ-1814).

   The Director draws a floor's dreamcore variant from the day's seed with
   probability 1/4, after the route and the trials are set. The selection
   code's types have no field for the variant, so it changes only the
   background, the music, the lines and the scenes (REQ-1532). The Director
   never draws one in an Ascent or in Session 0 (REQ-1534). It opens a slip
   into the Underside at most once in any 7 calendar days, for 2 to 3 scenes
   (REQ-1526, REQ-1528). The last scene of a slip always returns her to where
   she slipped from, and it comes from the library when the Master fails
   (REQ-1530). A dreamcore reply's schema requires a familiar among its
   speakers and an `exit` of `door`, `light` or `stair`, which the client
   draws beside the heroine (REQ-1536, REQ-1538).

   She can write that she's scared, which a `fear` trigger or the judge
   finds, or skip a creepy scene before its last line twice in a row in one
   game day. Then the game shows a library line in which the familiar lights
   a lamp and the intrigue resolves kindly (REQ-1540). It marks the scene for
   the parent (REQ-1542) and lowers the level by one, not below 0, until the
   game day ends at 04:00 (REQ-1544). The `fear` trigger and a `stop` trigger
   for «не хочу» also reach the Director as the anxiety signal ADR-0090
   counts.

   The MVP's eerie Tangles are «Шепотун», «Шкатулочница» and «Портретница»,
   each at level 1 in the canon data (REQ-1572, REQ-1574). The Reverse One's
   sprite is drawn once in the heroine's colours reversed, and the Master
   can't choose a sprite (REQ-1564). Four rules live in the prompt as canon
   rules that the parent judges: her back-to-front speech, trials told as
   spells, Guardians who agree to let the heroine pass, and Tangle names free
   of school terms (REQ-1566, REQ-1500, REQ-1504, REQ-1560). The game's music
   is a hand-picked set, and the parent listens to each track for ticking
   before it ships (REQ-1512).
8. Pool lines and the parent's loop. System and familiar lines come from
   `content/lines.ru.json` and from candidates `GEN_MODEL` writes offline. A
   line enters the pool only after a `line_approved` event, which the Parent
   Room appends, or the command `./tower lines approve` before the Parent
   Room exists (REQ-1550). A line never shows twice in a session, and each
   category plays as a shuffled cycle (REQ-1552). The parent can flag any
   Master scene as a failure, and a cached «как не надо» block in later
   orders carries every flagged scene (REQ-1556, REQ-1558). Every scene,
   choice and free text is an event, so the dialogue book in the Parent Room
   holds the whole story (REQ-1838).
9. Names. Every nameable thing has a stable id, and the client and the order
   look up its current name at use. A rename then changes the name everywhere
   and nothing else (REQ-1502). She names the heroine, familiars, forged
   items, opened floors, every Tangle she meets and her room (REQ-1660). A
   floor or a Tangle shows its canon name as a placeholder until she first
   meets it. The naming window then offers three suggestions: the canon name
   and two from the Master's `name_suggest` order, or from a hand-written list
   when that order fails (REQ-1666). Guardian names and every other canon
   name stay fixed (REQ-1668, REQ-1670). A name is at most 24 characters, and
   it passes the forbidden-word list, the triggers and the safety check before
   use (REQ-1662, REQ-1664). A refused name gets «Система не смогла принять
   это имя» and the suggestions again. A name with a digit or a word from the
   numeral list carries a flag that the frame filler of ADR-0130 honours, so
   it never reaches a task statement (REQ-1672).
10. The campaign. The calendar in `content/campaign.ru.json` runs from the
    start date the parent sets. `campaignId` lives only in the story tables,
    so a change of campaign leaves every diagnostic record as it was
    (REQ-1658). The MVP's stand-ins follow RES-1600 (REQ-1678, REQ-1680,
    REQ-1682, REQ-1684):
    - each chapter ends with a story finale in its last daily adventure;
    - a season finale awards its chapter title and main reward, and the rank
      doesn't change;
    - a rank opening opens on its calendar date while the badge stays E;
    - an enciphered Diary page arrives already developed.

    ADR-0140 grants the rewards. When ciphers ship, a cipher answer is a
    `diary_cipher` event, which the input filter of the knowledge model
    (ADR-0060) excludes, so it's never scored as maths (REQ-1508).
11. The planner. After each session, `PLANNER_MODEL` receives the filtered
    canon, story memory, the session's summary outcome events, her cleaned
    text and choices, the checkpoint and the level's name. It returns a
    summary and a plan of 5 to 7 beats, which pass the same checks as a reply
    (REQ-1640). After a second failure, the next session plays the unused
    beats of the last accepted plan and a library opening, and the owner gets
    one report.
12. After the MVP. Items and creatures the game invents arrive only through a
    `reward_hint`. The Director sets each one's type, rarity and limits
    (REQ-1674), and the Parent Room lets the parent hide or redraw each one
    (REQ-1676).

Each failure state has one audience; `provider_failed` and the budget states
are ADR-0100's names. The player never sees a model failure, because each one
ends in a library or pool text that reads like any other scene. She sees only
a refused name and the serious pause, and both say what the game did.

| State | Next step | Audience |
| --- | --- | --- |
| `reply_rejected` | one retry, then the library | the owner, in `llm_log` |
| `reply_late`: 12 s without a checked reply | a pool line; the late reply is dropped | the owner, in `llm_log` |
| `fallback_rate_high`: over 25% of an adventure's scenes from the library, a threshold I chose | one report for the adventure | the owner |
| `plan_failed` | the last plan's unused beats and a library opening | the owner |
| `signal_serious` | the fixed line, the pause and the notice | the parent |
| `signal_everyday`, `fear_flag`, `scene_unchecked` | a quiet mark in the dialogue book | the parent |
| `name_refused` | «Система не смогла принять это имя» and the suggestions again | the player |
| `push_failed`, after the MVP | logged; the notice stays | the owner |

The interruption budget: the parent gets one notice for each serious signal
and none for anything else, because the quiet marks wait in the book. The
owner gets one report for each `fallback_rate_high` adventure and each
`plan_failed`.

The security boundary is the text that reaches the child. It protects her
from harmful, frightening or judging text, and it protects the measurement
from the story. The threats, most likely first:

1. The model writes something on the checklist. The checks stop it before it
   shows.
2. Her free text steers the model, such as «забудь правила». The checks stop
   it the same way, because they read the reply and never trust the prompt.
3. The judge reads her words wrong and misses a signal. The local triggers
   limit the damage, because a model can't lower what they found.
4. A code change lets a maths field into an order. The strict schemas and the
   egress guard of ADR-0100 stop it.

Once this is accepted, a whole adventure plays with a live Master. It also
plays end to end with the gateway off, on the library, the pools and the
triggers, so the Master can be removed and the game still runs. The dialogue
book, the notice and the flag button need ADR-0180's Parent Room. Until it
exists, the events are recorded, the owner approves lines with
`./tower lines approve`, and the parent can't yet read the book.

## Why

RES-1600 settles the split: the Director knows everything and writes nothing,
and the Master writes everything and knows nothing of the maths. The design
question is how to keep the split true every time. Each part of the decision
turns a rule into something a program checks, as the design step asks:

- the Director can't write, because its events have no free strings;
- the Master can't see maths, because the order has no field for it;
- a secret can't leak, because the builder filters the canon by checkpoint;
- unchecked text can't show, because the checks sit between the reply and
  the screen.

The checks come before the typewriter animation because a child can't unread
a line (RES-1600, RES-1800). Drafting scenes and both branches ahead, with
pool reactions to answers, keeps the checks off the answer path. RES-2700
records that live reactions would take about 70 calls a session, each with a
wait. The triggers run first on raw text for two reasons (RES-1800): the
clean-up removes names that might matter to a signal, and a serious signal
found on the Mac never has to leave it.

The prompt states her age as a number, because RES-1800 conclusion 1 asks
for it and the owner decided on 2026-09-27 that the Master writes for the age
the parent sets (REQ-1840) and that the age may leave the Mac (REQ-2646). The
age comes from the Parent Room setting at each order, so a birthday changes
the writing level without a code change, and no tracked file, the canon
included, holds it (REQ-3712, CLAUDE.md).

The strongest objection is that the checks can make the live Master
invisible. Eight checks, stricter checks on `alt` and `cunning`, a retry and
a library could reject so many Russian replies that she reads mostly library
scenes. Every fallback is designed to look normal, so neither she nor the
parent would notice. Several checks are blunt in Russian. «пара» and
«половина» are numerals by the shared list. «пример» and «урок» are on the
school-word list, although they also mean "example" and "lesson" in plain
speech. I keep the checks, because each stands on an approved requirement.
`fallback_rate_high` answers the objection by reporting the rate to the
owner. The bake-off also measures each candidate's rejection rate on these
checks before it plays.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: no Master, a hand-written branching story from the library alone | no model risk, no cost, a person checks every line | a year of daily adventures can't be written by hand, and free text at the five points of REQ-1630 needs an answer; the library stays as the fallback |
| The model as game master, with tools that choose tasks and grant rewards | the most reactive and surprising story | the model would decide what happens, which REQ-1600 forbids, and each tool call is a path from the story into the measurement |
| A live Master for every beat, reactions to answers included | reactions made for each answer | about 70 calls a session, each with a wait (RES-2700), and REQ-1614 forbids waiting for the consequence |
| Stream the text as it's generated and check it afterwards | the typewriter starts at once, the best latency | REQ-1616 requires the checks before a reply shows, and a child can't unread a line |
| Write the whole adventure overnight and check it in a batch | every text checked at leisure, the cheapest calls | nothing could react to her free text; the scenes between trials keep this idea, because the Master drafts them ahead |

## What it costs

The design needs much hand-written content before the Master adds anything:

- the canon with checkpoint tags;
- the library of scenes and branches;
- 150 pool lines by stage 0.3;
- the trigger lists and the fixed lines;
- the name suggestions;
- the labelled Russian test set for every check and every forbidden item;
- the campaign calendar.

The owner writes most of it, and each item is a precondition of a stage.

The parent does recurring work: approving pool candidates, reading the
dialogue book and its marks, flagging failed scenes and answering serious
notices. If nobody attends for a month, play goes on and nothing is lost. The
notice for a serious signal then waits unread for that month, which is the
cost of the owner's decision of 2026-09-27 to defer web push.

The candidate queue could grow into a pile approved unread. So `GEN_MODEL`
stops writing candidates at 100 pending, and each candidate expires after 30
days; I chose both limits. The «как не надо» block grows with every flag.
Past 30 scenes it still carries them all and reports once to the owner, who
can fold several into one canon rule. Dropping the oldest would break
REQ-1558.

Each Master reply pays for its checks: about 40 judge checks an adventure at
about $0.005 (RES-2700), and more when a check falls back to `SAFETY_MODEL`.

## What would reverse it

- After the checks are tuned, `fallback_rate_high` fires on more than a third
  of the first month's adventures. The checks then move from blocking to a
  scored review, which needs the owner to amend REQ-1616.
- No approved candidate meets the 6-second p95 of REQ-1622 with the checks.
  Free-text replies then come from the drafted queue, and the live call feeds
  only the next scene.
- In play, the triggers pause the game on more than 1 in 200 of her free
  texts that the parent marks as ordinary. The triggers then only raise the
  judge's level and never pause on their own, which needs the owner's
  decision, because RES-1800 makes them fire on their own.

## Consequences

- `content/` gains `canon.ru.md` with checkpoint tags, `scenes.ru.json`,
  `branches.ru.json`, `lines.ru.json` with levels, `safety.ru.json`,
  `numerals.ru.json`, `campaign.ru.json` and the name suggestions, each a
  per-language file as ADR-0160 requires.
- The lint step gains the import rule between the Director and the Master,
  and a rule that the Director's event schemas hold no free strings.
- The event log carries `scene_shown`, `choice_made`, `free_text`,
  `name_given`, `plan_written` and `safety_event` from RES-2550, and gains
  `line_approved` and `diary_cipher`.
- ADR-0130's frame filler reads the numeral flag on names. ADR-0170 draws the
  Reverse One and the dreamcore exits. ADR-0180 shows the dialogue book, the
  flags, the notice, the pool approvals and the creepiness setting.
- The bake-off of ADR-0100 adds each candidate's rejection rate on these
  checks to its report.

## How I will know it was realised

1. A test plays a simulated adventure with a gateway stub that never
   answers. Every consequence of an answer shows without a wait, every scene
   comes from the library or the pools, and no unchecked text shows.
2. A test builds the prompt at each checkpoint and finds no text from a later
   checkpoint's sections.
3. A test feeds replies with an unknown speaker, an extra field, an effect
   outside the set, a missing branch, a digit, a forbidden word and a
   creepiness Score above the level. The service discards each, retries once
   and takes the library scene.
4. A test runs the fixed trigger phrases and the labelled serious lines
   through the text path. Each pauses the game with the fixed line and writes
   one notice, and none of their text reaches a mocked model.
5. A test gives the judge a lower level than the triggers found, and the
   trigger's level holds.
6. A test runs one day's seed with the dreamcore variant on and off. The
   trials, their order, the floor budget and the task window are identical.
7. A test replays 30 days and finds at most one Underside slip in any 7
   calendar days, each of 2 to 3 scenes that ends where it began.
8. In the first two weeks of play, `llm_log` shows a p95 wait after free text
   of 6 seconds or less, and `fallback_rate_high` fires on fewer than a third
   of adventures.
9. The parent reads a week of the dialogue book and finds no line that breaks
   the judged rules: trials told as spells, Guardians who agree to let her
   pass, no fault in `alt` lines, the Reverse One's rules and text that fits
   the age the parent set.

## What this does not settle

- How calls are routed, charged and logged, and which models play: ADR-0100.
- REQ-1510, that art and art prompts reuse no other work: ADR-0170.
- REQ-1546, that task statements carry no jokes: ADR-0130, which owns task
  text.
- The words on the forbidden list and the gate that checks every text source
  against it: ADR-0160.
- Which rewards a finale or a title grants, and ranks: ADR-0140.
- The Parent Room's screens: ADR-0180.
- The rules for trial outcomes and room branches: ADR-0080 and ADR-0140.

For the owner: in the MVP the parent is the only audience for a serious signal, and the notice can wait days unread. That's
the owner's decision of 2026-09-27, and it stays the largest risk this
decision can't close.

A premortem, written as though it had already happened. On the first day of
play the game paused three times with the serious line. The trigger list held
the word «секрет» for a request to keep a secret from her parents, and the
Tower is full of secrets the story itself offers. She learned that writing
about secrets stops the game, and she stopped writing. The parent found three
serious notices about a treasure hunt. A run of every trigger over the canon,
the pool and 200 ordinary story phrases before stage acceptance would have
caught it, and part 6 of the decision now requires that test.

Amended by ADR-0230, ADR-0280, ADR-0320, ADR-0330 and ADR-0350, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0370, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
