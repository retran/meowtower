---
id: ADR-0160
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-3810, REQ-3704, REQ-3300, REQ-3302, REQ-3304, REQ-3306, REQ-3308, REQ-3310, REQ-3312, REQ-3314, REQ-3318, REQ-3320, REQ-3322, REQ-3324, REQ-3326, REQ-3328]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0160. Every player-facing string lives in a per-language content file read through one typed function, and one forbidden-word list in one text gate checks every line before the player sees it

## Decision

Every string the player or the parent reads comes from a per-language file under `content/`, and no string is written in the code. One function, `textGate`, checks every line the heroine sees against one forbidden-word list, at build time for fixed text and on the server at run time for generated text.

1. The string file. `content/i18n/ru.json` holds every interface label, accessible name, fixed System line, the canon's names shown on screen (elements, floors, ranks, resources) and the Parent Room's text. It also holds the notation profile RES-2550 puts in the locale: the decimal sign, the thousands separator and the time format, which ADR-0040's renderer reads. Keys are English and dotted, grouped by who reads them (`ui.*`, `system.*`, `canon.*`, `parent.*`, `test.*`). A value is one of three shapes:
   - a string with named placeholders, as in `"ui.task.thread": "Путеводная нить · {n}"`;
   - a plural object with the `one`, `few`, `many` and `other` forms that `Intl.PluralRules("ru")` selects;
   - a System message, an array of lines in which `{"pause": "..."}` marks a self-correction that the `SystemWindow` of ADR-0150 shows as a line of its own after a pause (REQ-3304).
2. The other content files. The per-language files RES-2500 already names keep their names and follow the same rule: `lines.ru.json`, `frames.ru.json`, `science.ru.json`, `lexicon.ru.json`, `recipes.ru.json`, `shop.ru.json`, `branches.ru.json` and `canon.ru.md`. A language-neutral file such as `graph.yaml` or `familiars.yaml` refers to text only by key. A second language adds `content/i18n/nl.json` or `en.json` and the matching `*.nl.*` or `*.en.*` files, with no change to code.
3. One function. `src/shared/i18n.ts` exports `t(key, params)`, used by the client and the server alike. The build generates a TypeScript union of the keys in `ru.json` and a parameter type for each key's placeholders, so a missing key or a missing parameter is a type error. `ru.json` is the reference: a language file must hold exactly its keys, with the same placeholders, before the language can be offered.
4. The language. The profile holds `lang`, and the server accepts only a shipped language. The shipped set in the MVP is `["ru"]`, so every text and task is Russian (REQ-3704) and the settings screen shows no language choice. The choice appears on its own once a second language passes the key check. The client renders the interface in the profile's language. The server renders every story line, System window and task in it too, because the log records each line as shown (RES-2550), so a line already in the story log stays in the language it was shown in after a switch.
5. The static checks, run by the verify command of ADR-0190:
   - `src/` holds no Cyrillic character outside test fixtures, a one-line grep that catches a Russian string written into a component;
   - the lint rule `no-literal-string` from `eslint-plugin-i18next` (6.1.5 on npm, checked 2026-09-27) rejects literal text in JSX and in `aria-label`, `title`, `placeholder` and `alt`, which catches an English or Dutch string the grep can't see;
   - every language file has the reference keys and placeholders;
   - tests pin the exact values of the world's labels in REQ-3310 and of `ui.task.thread` in REQ-3322;
   - no `ui.*` value equals a rejected label from REQ-3312, compared after trimming and folding case;
   - no `system.*` value holds "!" or a digit, because numbers reach System windows only as code-filled fields (REQ-3302, REQ-3308);
   - `textGate` passes every string in every per-language content file, and 200 rendered seeds of every task template, a sample size I chose.
6. The forbidden list. `content/shaming.ru.json` is the one list, as RES-3300 and RES-1500 name it, and every check reads it (REQ-3328). It holds:
   - verdict and shame words, school words and praise of intelligence (REQ-3314), each entry a lemma with every inflected form written out, diminutives such as «задачка» and «ошибочка» included, generated once from the OpenCorpora dictionary by a tool script, reviewed by the owner and committed expanded, so the run-time check needs no morphology library;
   - phrases matched as runs of tokens, among them «не получилось», «ты не поняла», «это же просто» and the shortage phrases «нити закончились», «нитей не осталось», «нет нитей» and their forms (REQ-3324);
   - the rejected labels of REQ-3312;
   - the forms of «узелок», which the check rejects in the knot's own keys (`ui.task.*`, `ui.outcome.*`, `ui.scheme.*`, `system.knot.*`), because there a knot is meant (REQ-3320);
   - fixtures: forms that must match, such as «ошибкой» and «задачку», and words that must not, such as «примерно», «примерить» and «мимоза».
   The guilt and attachment phrases of RES-3300's group 4 have no fixed wording, so they aren't in the matched list; ADR-0110's safety check measures them.
7. The gate. `textGate(text, { lang, kind, source })` in `src/shared/voice/` normalises the text: NFC, lower case, «ё» to «е», soft hyphens, zero-width characters and stress marks removed. It splits the text into Cyrillic word tokens and returns a pass, or the rule and the match that failed. Every kind is checked for the forbidden forms, the phrases and emoji. A `system` line is also checked for "!" and digits, and a `label` for the rejected labels. The server calls it on every line before the line leaves for the client, whichever source wrote it: the Master, the line pool, the Explainer, a task template or a fixed string (REQ-3326). The client receives no heroine-facing text the gate hasn't passed, since the interface strings passed at build. The heroine's own words, `source: "player"`, skip the gate, and so does any key under `parent.*`, as RES-3300 exempts both. A blocked line is never shown. The source's own fallback replaces it: ADR-0110 regenerates or takes a pool line, ADR-0120 falls back to its template, ADR-0040 draws another seed, and a pool line that fails is retired from the pool.
8. The voice of fixed text. The `system.*` section of `ru.json` holds every fixed System line in one place, so the parent reads it in one sitting at stage acceptance and judges it short, formal, present-tense, about events and never about the heroine's mind, with no joke at her (REQ-3300, REQ-3306, REQ-3318). ADR-0110 carries the same rules into the Master's prompts for generated lines.

What works once this is accepted and built: every screen of ADR-0150 renders its text from `ru.json`, a string hard-coded in `src/` fails the build, every fixed and template text has passed the forbidden list, and every generated line passes it on the server before the heroine sees it. What doesn't work yet: no second language exists, and adding one needs its string file, its content files and its own forbidden list, written by a person; the gate's fallbacks depend on ADR-0040, ADR-0110 and ADR-0120 being built, and until they are, a blocked line from their source is replaced by the neutral `system.fallback.line` string.

## Why

CLAUDE.md asks for every player-facing string in a per-language file, so that English and Dutch can be added and the player can switch, because a string in a component has to be found and moved before a second language ships (REQ-3810). RES-2550 asks that "every player-facing string must go through i18n keys". A generated key type makes the rule hold on every compile, and the Cyrillic grep plus the lint rule make it hold on every verify run, so nobody has to remember it (D2).

I chose a JSON file over the `src/i18n/ru.ts` that RES-2500's layout sketches, because a `.ts` file is code. The forbidden-list check and a translator both have to read the strings without running TypeScript. Keeping the file under `content/` also puts it beside the other `*.ru.*` files, so "one file per language" means one naming rule for all content.

One list checked everywhere is RES-3300's resolved finding: separate lists drift apart, and a shame word can reach her through a label, a Diary page or an item description that no list covers. Writing out every form, where a stemmer would guess, follows RES-3300's "matched by lemma". Snowball's Russian stemmer reduces «задачку» to «задачк» and misses it, while a prefix match on «пример» blocks «примерно». The written-out forms, with fixtures on both sides, catch the first and let the second through.

The gate runs on the server because the server already holds every generated line before sending it over SSE (ADR-0030), and the client can't be trusted to check what it will render once the line is on screen.

The strongest objection is that a word list can't see meaning. It blocks «прошла мимо» (walked past) in an innocent narration, so the Master's lines get regenerated for nothing. And it passes a sentence of shame that uses no listed word, such as «Ну вот, опять не то» (Well, wrong again), so a green gate gives more confidence than it earned. I accept both halves. The false positives cost regenerations, and the ceiling under Consequences reports them. The meaning-level check belongs to ADR-0110's safety pipeline and the parent's review, and the gate is the cheap first filter under them, not their replacement.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: strings in components, lists wherever each author keeps them | fastest to write now; nothing to look up | breaks CLAUDE.md and REQ-3810; the second language would start with a search through every component; the lists drift, which RES-3300 rejects |
| i18next | mature; plurals, interpolation, loaders and a large translator ecosystem | its runtime, loaders and namespaces do work the game doesn't need, and typed keys need extra configuration where a generated union gives them free; it stays the first choice if the Dutch stage needs its tooling |
| FormatJS with ICU MessageFormat | the standard syntax translators know, with `select` and `plural` in one string | its parser adds weight on the iPad, and ICU strings are harder for the parent to read at acceptance; plural objects cover what Russian needs now |
| Lingui, compiled at build time | extraction from source and compiled catalogues | macros and an extraction step add build machinery for one language; the Cyrillic grep does the extraction job in reverse |
| A stemmer (Snowball Russian) in place of written-out forms | no forms to generate or review | misses diminutives and changed stems such as «задачку», and a prefix variant blocks «примерно» and «примерить» |
| One list only for places at risk: outcomes, explanations, familiar lines | a smaller check | someone has to decide for each new kind of text whether it's at risk, and RES-3300 records that the owner's rule covers every text |

## What it costs

Every new label costs a key and a `t()` call where a literal would have been one token, and the developer pays that on every screen. The owner reviews the generated forms of the forbidden list once, about 25 entries by my estimate from REQ-3314, and again whenever a word is added. Writers of pool lines and canon text lose some neutral words, «мимо», «жаль» and «плохо», and rephrase, as RES-3300 accepts. The gate adds under 1 ms per line on the server, a budget I chose and list in the Baselines table of ADR-0190; the list holds about a thousand forms by my estimate, so a token lookup in a set costs nothing a player could notice. Regenerating a line the gate blocked costs a model call, which ADR-0100's daily budget counts. If nobody attends to the blocked-lines log for a month, nothing reaches the heroine that shouldn't; the only loss is regenerations that a better prompt would have saved.

## What would reverse it

- The Dutch stage needs gender or `select` forms that plural objects can't express, or a translator's tool reads only ICU or i18next formats. The file then converts mechanically to that format, and `t()` wraps the library.
- The gate blocks more than 5 % of a generated source's lines over a week (the ceiling below), and ADR-0110 can't bring it down with prompts. A lemma-aware model check would then replace the word list for that source, and the list would stay for fixed text.
- The owner decides that some neutral uses, such as «плохо видно» (hard to see), must be allowed. The list would then need context rules, and a written-out form list could no longer express them.

## Consequences

The gate writes a `text_blocked` row for each blocked line to a server log table: the source, kind, rule, matched form and the line. This table is operational, not part of ADR-0020's event log, and holds at most 1,000 rows, oldest first out, a ceiling I chose. It reports once, in the verify summary of ADR-0190, when one source has more than 5 % of its lines blocked in a day, and again only when the rate changes by more than half.

Failure states, each with its next step and one audience:

| State | When | Next step | Audience |
| --- | --- | --- | --- |
| `forbidden_in_content` | a fixed string, content file or template seed fails the gate at build | rephrase the text; the build stops and names the key or template and the form | developer |
| `string_key_mismatch` | a language file lacks a reference key or placeholder | complete the file; the language stays unshipped | developer |
| `text_blocked` | a generated line fails the gate at run time | the source's fallback replaces it; the row goes to the log | developer |
| `string_missing` | `t()` meets a key its language lacks at run time, which the type and parity checks should prevent | `t()` returns the Russian value and logs the key | developer |
| `lang_unshipped` | a profile or request names a language outside the shipped set | the server uses Russian and rejects the setting with 400 | parent, since only the parent can reach the profile outside the game's settings |

The gate isn't a security boundary against a person. What it protects is the heroine from words that turn play into a verdict, and the adversary is drift in our own text. Ordered by likelihood: the Master's narration and characters (ADR-0110), explanations (ADR-0120), task templates rendered with new parameters (ADR-0040), pool lines and fixed strings, which pass at build. Her own words bypass the gate. If she types a forbidden word, the Master's reply passes the gate like any line, so the Master can't repeat the word back at her.

The premortem, written as though it already happened. The gate shipped and passed every test, and then the Master started writing «задачу» inside quoted speech with a Latin "а" in place of the Cyrillic one, copied from a frame. The token split on script and the word slipped through. The fix was to fold look-alike Latin letters to Cyrillic in normalisation, and the fixtures now carry a mixed-script case. A second failure: a writer added `ui.camp.cooldown` with «Привал через 5 минут», which the digit check allowed, because it runs only on `system.*` keys. REQ-3312 bans «Осталось N минут» and the clock ban in RES-3100 covers the rest, so the rejected-label check was widened to time phrases in every `ui.*` key.

## How I will know it was realised

1. `grep -rP '[\x{0400}-\x{04FF}]' src --exclude-dir=__fixtures__` returns nothing, and the lint run reports no `no-literal-string` finding.
2. Deleting one key from `ru.json` makes `tsc` fail at every call site of that key.
3. A test renders every screen of ADR-0150 with a pseudo-language file whose values are the keys themselves and finds no visible or accessible text that isn't a key, so no string escaped the file.
4. The fixtures pass: «ошибкой», «задачку», «Урок», «ОЦЕНКА» and the Latin look-alike «зaдача» are blocked, and «примерно», «примерить», «мимоза» and «верно» pass.
5. A server test sends one line per source, the Master, pool, Explainer, template and a fixed string, each holding a forbidden form, and none reaches the SSE stream; each leaves one `text_blocked` row.
6. The tests for REQ-3310 and REQ-3322 find the exact labels, and the thread button reads «Путеводная нить · 0» at zero threads with no shortage phrase anywhere on the screen.
7. The parent reads the `system.*` section at the stage 0.3 acceptance and signs off REQ-3300, REQ-3306 and REQ-3318 for fixed text.

## What this does not settle

- REQ-3316, phrases of guilt and attachment: they have no fixed wording, so ADR-0110's safety check measures them on its test set.
- REQ-3330, the ally's name «Бантик» from the autumn finale on: ADR-0110's canon memory names characters, and CAN-0080 carries the name. The string file holds the name under `canon.ally.name`, but the rule is about when the story uses it.
- The voice rules for generated System lines, narration and jokes: ADR-0110 carries them into prompts and its safety pipeline. This decision covers fixed text and the word-level gate for all text.
- REQ-3320 in generated text: the gate can reject «узелок» only where the key says the subject is a knot. In the Master's and Explainer's text the word can mean a familiar, so ADR-0110 and ADR-0120 hold the rule there.
- How task text is phrased and rendered per locale: ADR-0040, which reads the notation profile from `ru.json`.
- The Dutch glossary word a term hint shows: it lives in `lexicon.ru.json` beside the Russian term, as REQ-3704 describes. ADR-0040 builds the term spans in the task view, ADR-0150 draws the marks and the tap explanation, and ADR-0180 holds the parent's approval of the Dutch word.
- Who writes and reviews a second language's strings and forbidden list. That is a person's work at the Dutch stage, outside the MVP scope ADR-0190 fixes.

Amended by ADR-0210, ADR-0250 and ADR-0290, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0430, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.
