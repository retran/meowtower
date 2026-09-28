---
id: SPC-0160
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-3300, REQ-3302, REQ-3304, REQ-3306, REQ-3308, REQ-3310, REQ-3312, REQ-3314, REQ-3318, REQ-3322, REQ-3324, REQ-3326, REQ-3328, REQ-3810, REQ-5082, REQ-5086, REQ-6416, REQ-5470]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Player-facing strings per language, the forbidden-word list and the text gate

## Scope

This document covers where every player-facing and parent-facing string lives, the function that reads it, the checks that keep strings out of the code, the content test for «узелок» (little knot) and the guilt list over every content and string file, the one forbidden-word list, the text gate that checks every line the heroine sees, the fixed labels the interface must carry, and the Dutch word bridge's keywords: their place in the lexicon, their count, their approval and their share of tasks. It is written at the level of files, keys, functions and checks.

It leaves out the rules for generated text that a word list can't check. The voice of generated System lines, narration and jokes, the phrases of guilt and attachment in generated text, the guilt list itself, the word «узелок» in generated text and the ally's name belong to SPC-0110. How the Explainer's shared check module runs its other steps belongs to SPC-0120, and how a task's text is phrased and rendered to SPC-0040. Which Dutch words the player may see at all, and the bridge's events, belong to ADR-0190. The bridge's two gates, the node state and the parent's switch, belong to ADR-0290, and the term marks and tap explanation in the task window to SPC-0150. The parent's glossary panel belongs to ADR-0180.

## Boundary

### Files

| Path | What it holds |
| --- | --- |
| `content/i18n/ru.json` | Every interface label, accessible name, fixed System line, the canon's names shown on screen, the Parent Room's text, the dictation line, and the notation profile apart from the multiplication sign. |
| `content/lines.ru.json`, `frames.ru.json`, `science.ru.json`, `lexicon.ru.json`, `recipes.ru.json`, `shop.ru.json`, `branches.ru.json`, `plans.ru.json`, `canon.ru.md` and every other `*.ru.*` content file | The other Russian content, one file per kind and language. |
| `content/shaming.ru.json` | The one forbidden-word list and its fixtures. |
| `src/shared/i18n.ts` | `t(key, params)` and the generated key and parameter types. |
| `src/shared/voice/` | `textGate`. |

A language-neutral file, such as `graph.yaml` or `familiars.yaml`, refers to text only by key.

### Keys and values

Keys are English and dotted, grouped by reader: `ui.*`, `system.*`, `canon.*`, `parent.*` and `test.*`. A value takes one of three shapes:

- a string with named placeholders, such as `"ui.task.thread": "Путеводная нить · {n}"`;
- a plural object with the forms `one`, `few`, `many` and `other`, which `Intl.PluralRules("ru")` selects;
- a System message: an array of lines in which `{"pause": "..."}` marks a self-correction.

### Functions

- `t(key, params)` returns the string for a key in the profile's language, filled with its parameters. The client and the server both use it.
- `textGate(text, { lang, kind, source })` returns a pass, or the rule and the match that failed. `kind` is one of `line`, `system` and `label`; `source` names the writer: `master`, `pool`, `explainer`, `template`, `fixed` or `player`.

### Failure states

| State | When | Next step | Audience |
| --- | --- | --- | --- |
| `line_refused` | a line of a timed-event pool holds a digit or a time word | verify fails the content and names the line | developer |
| `forbidden_in_content` | a fixed string, content file or template seed fails the gate at build | rephrase the text; the build stops and names the key or template and the form | developer |
| `string_key_mismatch` | a language file lacks a reference key or placeholder | complete the file; the language stays unshipped | developer |
| `text_blocked` | a generated line fails the gate at run time | the source's fallback replaces it; a row goes to the log table | developer |
| `string_missing` | `t()` meets a key its language lacks at run time | `t()` returns the Russian value and logs the key | developer |
| `lang_unshipped` | a profile or request names a language outside the shipped set | the server uses Russian and rejects the setting with 400 | parent |
| `bridge_below_minimum` | fewer than 30 bridge words are approved | the bridge stays off | parent, as a count in the glossary panel |
| `bridge_share_out_of_band` | the simulation finds the bridge share outside 15 % to 25 % | the build fails and names the window | building agent |
| `text_blocked_high` | one source had more than 5 % of its lines blocked on a game day | `./meowtower status` shows it once for that source and day | owner |

### Permitted dependencies

The client and the server read strings only through `t()`, and no module under `src/` holds a player-facing literal. `src/shared/i18n.ts` imports only the generated types and the language files. `textGate` reads only `content/shaming.<lang>.json` for the `lang` it is given, `content/shaming.ru.json` in the shipped set, and every check of the forbidden list, the Explainer's and the frames' check module among them, calls `textGate` and keeps no list of its own. Every source that writes a line for the heroine, the Master, the line pool, the Explainer and the task templates, hands the line to the server's gate call and never sends it to the client directly. `textGate` imports nothing from `src/server/`, `src/engine/` or `src/ui/`.

## Behaviour

### Strings live in language files

Every string the player or the parent reads comes from a per-language file under `content/`, and none is written in the code (REQ-3810). The build generates a TypeScript union of the keys in `ru.json` and a parameter type for each key's placeholders, so a missing key or a missing parameter is a type error. `ru.json` is the reference: another language file must hold exactly its keys, with the same placeholders, before the language can be offered. A second language adds `content/i18n/<lang>.json` and the matching `*.<lang>.*` files with no change to code, and it needs its own forbidden list.

The profile holds `lang`, and the server accepts only a shipped language. The shipped set is `["ru"]`, and the settings screen shows no language choice until a second language passes the key check. The client renders the interface in the profile's language, and the server renders every story line, System window and task in it, so a line already in the story log stays in the language it was shown in.

The verify command runs these static checks on the strings (REQ-3810):

- `src/` holds no Cyrillic character outside test fixtures;
- the lint rule `no-literal-string` from `eslint-plugin-i18next` rejects literal text in JSX and in `aria-label`, `title`, `placeholder` and `alt`;
- every language file has the reference keys and placeholders;
- a player screen shows a Latin-script word only where ADR-0190 allows one, and the check refuses any other;
- a content test over every `content/*.ru.json` file and every string file fails the build on any form of «узелок» and on any phrase of the guilt list that `content/safety.ru.json` holds and SPC-0110 states;
- no line of the timed-event pools SPC-0090 and ADR-0320 name, the lines announcing an eye exercise, a rest stop, the soft stop or an extension, holds a digit or a form from the time-word section of the forbidden list (`line_refused`);
- `textGate` passes every string in every per-language content file, apart from `parent.*` keys and files only the parent reads, and 200 rendered seeds of every task template. It checks a `ui.*` value as `label`, a `system.*` value as `system` and every other string as `line`.

A render test loads a pseudo-language file directly, outside the shipped set, whose values are the keys themselves, and finds no visible or accessible text on any screen that isn't a key.

### Fixed labels

Tests pin the world's labels to their exact values (REQ-3310): «Схема узла» (the knot scheme) and «Как легла нить» (how the thread lay) for the review, «Твоё заклинание» (your spell) for her answer, «Готово» (Done), «Не знаю» (I don't know) and «Путеводная нить» (guiding thread) for the task buttons, «Распутан начисто» (untangled cleanly), «Почти чисто» (nearly clean), «Узел ослаблен» (the knot is loosened) and «Принято» (accepted) for outcomes, «Привал» (rest stop), «Сохранить и уйти» (Save and leave) and «Ещё один ряд» (One more row) for leaving, and «Дней в Башне» (Days in the Tower) for the day counter.

The key `ui.task.cantKnow` holds «Нельзя узнать» (can't be known), and a test pins it, so the button that claims a word problem can't be answered never reads like «Не знаю» (REQ-5470).

The key `ui.voice.dictation` holds one line that names the Mac's dictation key, and the voice button on a computer whose browser offers no speech recognition shows it, as SPC-0150 states.

The key `ui.task.thread` holds «Путеводная нить · {n}», and code fills `n` with the current thread count (REQ-3322). At zero threads the button reads «Путеводная нить · 0».

No `ui.*` value equals a rejected label, compared after trimming and folding case: «Правильный ответ» (the correct answer), «Решение» (the solution), «Твой ответ» (your answer), «Проверить» (Check), «Подсказка» (Hint), «Сдаться» (Give up), «Верно» (correct), «Выйти» (Exit), «Пауза» (Pause), «Осталось N минут» (N minutes left), «Серия» (Streak) or «Дней подряд» (Days in a row) (REQ-3312). The same check refuses a time phrase, such as «через 5 минут» (in 5 minutes), or a form from the time-word section of the forbidden list in any `ui.*` value.

### Fixed System lines

The `system.*` section of `ru.json` holds every fixed System line. No `system.*` value holds "!" (REQ-3302) or a digit, and a number reaches a System window only through a field the code fills (REQ-3308). A self-correction is a `{"pause": "..."}` element of the message array, and the `SystemWindow` component shows it as a line of its own after a pause (REQ-3304).

The parent reads the whole `system.*` section at the stage 0.3 acceptance and signs it off on three counts. Each fixed line is short, formal and in the present tense (REQ-3300). Each describes an event in the world and never the heroine's mind or abilities (REQ-3306). No joke in it targets the heroine (REQ-3318).

### The forbidden list

`content/shaming.ru.json` is the one forbidden list, and every check against forbidden words reads it, so a word added once is blocked in every kind of text (REQ-3328). It holds:

- the verdict and shame words, school words and praise of intelligence REQ-3314 names, from «неправильно» (wrong) and «ошибка» (mistake) to «ты самая умная» (you're the cleverest), each entry a lemma with every inflected form written out, diminutives such as «задачка» and «ошибочка» included (REQ-3314);
- the test words ADR-0290 states;
- phrases matched as runs of tokens, among them «не получилось» (didn't work), «ты не поняла» (you didn't understand), «это же просто» (it's easy) and the shortage phrases «нити закончились» (the threads have run out), «нитей не осталось» (no threads are left), «нет нитей» (no threads) and their forms (REQ-3324);
- the rejected labels of REQ-3312, in a section of their own that the set of forbidden forms leaves out, each matched only against a whole `label` value after trimming and folding case;
- the forms of «узелок», in a section of their own that the set of forbidden forms leaves out, which the content test reads for every `content/*.ru.json` file and every string file;
- a time-word section, such as «минута», «секунда» and «час», with every inflected form, which the set of forbidden forms leaves out and the verify checks on `ui.*` values and the timed-event pools read;
- fixtures: forms that must match, such as «ошибкой», «задачку», «Урок», «ОЦЕНКА» and the mixed-script «зaдача» with a Latin "a", and words that must pass, such as «примерно», «примерить», «мимоза» and «верно».

A tool script generates the inflected forms once from the OpenCorpora dictionary, the owner reviews them, and the list is committed expanded, so the run-time check needs no morphology library.

### The text gate

`textGate` normalises the text: Unicode normalization form C (NFC), lower case, «ё» to «е», soft hyphens, zero-width characters and stress marks removed, and Latin letters that look like Cyrillic ones folded to Cyrillic. It splits the text into Cyrillic word tokens, looks each token up in the set of forms, and matches the phrases as token runs. Every kind is checked for the forbidden forms, the phrases and emoji; a `system` line is also checked for "!" and digits, and a `label` is also compared as a whole with the rejected labels. The gate doesn't check «узелок»; the content test above does.

The server calls `textGate` on every line before the line leaves for the client, whichever source wrote it: the Master, the line pool, the Explainer, a task template or a fixed string (REQ-3326). For a fixed `system` line, the server passes the value to the gate before `t()` fills its fields, so a number from a field never fails the digit check. Fixed strings and template seeds pass the same gate at build, so the client receives no heroine-facing text the gate hasn't passed. Her own words shown back as she wrote them, `source: "player"`, skip the gate, and so does every key under `parent.*`, since REQ-3314 exempts both. When she types a forbidden word, the Master's reply still passes the gate, so the reply can't repeat the word to her.

A blocked line is never shown. The source's own fallback replaces it: the Master regenerates or takes a pool line, the Explainer falls back to its template, a template draws another seed, and a pool line that fails is retired from the pool. A source with no fallback yet gets the neutral `system.fallback.line` in place of the line. The gate takes under 1 ms per line, the budget ADR-0190's Baselines table holds.

Each blocked line writes a `text_blocked` row to a server log table, outside the event log: the source, kind, rule, matched form and the line. The table holds at most 1,000 rows, oldest out first. At each change of game day the server computes each source's blocked share of the day from `text_blocked`, and `./meowtower status`, which SPC-0010 states, shows `text_blocked_high` once for each source above 5 % that day. The verify summary computes the same share from the rows of its own replayed and live runs, reports once when one source has more than 5 % of its lines blocked in a day, and again only when that rate changes by more than half.

### The Dutch word bridge's keywords

The bridge's keywords are entries in `lexicon.ru.json` with `bridge: true`, each with its Dutch word in the same field a glossary entry uses. No Dutch locale file exists. The bridge holds 30 to 50 keywords, and a group 1 check counts the `bridge: true` entries, passes with 30 to 50 and fails the build with the count at 29 or fewer and at 51 or more (REQ-5082).

The game shows a bridge keyword only after the parent approves that word through the glossary panel, which writes `glossary_entry_approved`, and never before that event for that word (REQ-5086). While fewer than 30 words are approved, the bridge stays off and the glossary panel shows the approved count.

While the bridge is on and at least 30 words are approved, the Director puts bridge keywords into 15 % to 25 % of the T1 to T4 and Sources tasks shown on nodes at «Понимает» (understands) or above, over any 14 game days on which she plays (REQ-6416). Tasks on nodes below «Понимает» and tasks shown while the bridge is off stay out of the count. The simulation group of ADR-0190 checks that share over every 14-game-day window of 60 simulated days, with `bridge.enabled` on and at least 30 words approved from the first day, and counts only the tasks on the nodes the simulation holds at «Понимает» or above. A bridge keyword sits inside a task's content, and the gates ADR-0290 states and the form rule SPC-0040 states decide which tasks may carry one.

## Failure paths

| Condition | What happens |
| --- | --- |
| A component holds a Russian literal | The Cyrillic grep fails verify and names the file. |
| A component holds an English or Dutch literal in JSX or an accessible attribute | `no-literal-string` fails lint. |
| A key is deleted from `ru.json` | `tsc` fails at every call site of that key. |
| A second language file lacks a key or a placeholder | `string_key_mismatch`; the language stays out of the shipped set. |
| `t()` meets a missing key at run time | `string_missing`: it returns the Russian value and logs the key. |
| A request or profile names an unshipped language | `lang_unshipped`: 400, and the server renders Russian. |
| A fixed string, content file or template seed holds a forbidden form | `forbidden_in_content`: the build stops and names the key or template and the form. |
| A line of a timed-event pool holds a digit or a time word | `line_refused`: verify fails the content and names the line. |
| A `system.*` value holds "!" or a digit | Verify fails and names the key. |
| A `content/*.ru.json` file or a string file holds a form of «узелок» or a phrase of the guilt list | The content test fails the build and names the file, the key and the form or phrase. |
| A `ui.*` value equals a rejected label or holds a time phrase | Verify fails and names the key. |
| A pinned label changes its value | The label test fails and names the key and both values. |
| A generated line holds a forbidden form, a shortage phrase or emoji | `text_blocked`: the line is never shown, the source's fallback replaces it, and a row goes to the log table. |
| A generated line hides a forbidden word behind Latin look-alike letters, soft hyphens or stress marks | Normalisation removes them, and the gate blocks the line. |
| One source has more than 5 % of its lines blocked on a game day of play | `text_blocked_high`: `./meowtower status` shows it once for that source and day. |
| One source has more than 5 % of its lines blocked in a day of verify's own runs | The verify summary reports it once. |
| The bridge list holds 29 or fewer, or 51 or more, entries | The group 1 check fails the build with the count. |
| A bridge word has no `glossary_entry_approved` | The game doesn't show it. |
| Fewer than 30 bridge words are approved | `bridge_below_minimum`: the bridge stays off, and the glossary panel shows the count. |
| The simulated bridge share, over tasks on nodes at «Понимает» or above, leaves 15 % to 25 % in a 14-game-day window | `bridge_share_out_of_band`: the build fails and names the window. |

## Open review findings

- Rejected, round 1: give the log table's 1,000-row cap and the "more than half" re-report threshold their reasons. A specification states what the system does and never why (S8), and ADR-0160 holds the reasons.
- Rejected, round 2: give reasons for blocking emoji, keeping the log table outside the event log, its cap and re-report threshold, retiring a failed pool line, and keeping the Dutch word in `lexicon.ru.json` with no Dutch locale file. Rule S8 applies again, and ADR-0160, ADR-0190 and ADR-0210 hold the reasons.
- Rejected, round 2: name the key of each pinned world label. The test pins values, the building step chooses the keys, and the test names whatever key holds each value.
