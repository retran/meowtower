---
id: TSK-0676
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0160
closes: [REQ-3810, REQ-3304]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One typed function reads every string from the language file, and a language is shipped only when its keys match

After this task, `t(key, params)` in `src/shared/i18n.ts` takes its key and its parameters from types generated from `content/i18n/ru.json`, a missing key or parameter fails `npx tsc --noEmit`, and the server renders every line in the profile's language from the shipped set.

## Acceptance criteria

1. Given `content/i18n/ru.json`, when one key is deleted or a call passes no value for a placeholder, then `npx tsc --noEmit` fails at every call site of that key or call (REQ-3810). Closed by: a type test that compiles a fixture file and expects those errors, and the command's output on the repository.
2. Given a value written as a plural object with `one`, `few`, `many` and `other`, when `t` is called with `n` of 1, 2, 5 and 21, then it returns the `one`, `few`, `many` and `one` forms that `Intl.PluralRules("ru")` selects (REQ-3810). Closed by: a unit test.
3. Given a System message written as an array with `{"pause": "..."}`, when the server renders it, then the self-correction is its own line marked as a pause and no other line carries that mark (REQ-3304). Closed by: a unit test on the rendered lines.
4. Given a second language file that lacks a reference key or a placeholder, when the key check runs, then it fails with the language, the key and the placeholder, and the profile can't select that language; given a request for a language outside the shipped set `["ru"]`, then the server uses Russian and answers 400 (REQ-3810). Closed by: a unit test of the check and an integration test of the route.
5. Given the notation keys of `formatQ` (decimal sign, thousands separator, time format), when `src/math/format.ts` reads them, then it reads them through `t` from `ru.json` under `notation.` and the existing `formatQ` tests pass unchanged (REQ-3810). Closed by: the unit tests of the epic realising ADR-0040 that already cover `formatQ`.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Replace the string map in `src/shared/i18n.ts` and `src/client/strings.ts` with the typed `t`. Add `tools/gen-keys.ts`, which writes `src/shared/i18n-keys.ts` from `ru.json`: a union of the keys and a parameter type for each key's placeholders. Commit the generated file and let the lint verb fail when it is out of date. I chose to commit it so that a clone type-checks without a generation step; change it if the build already generates files.

A value has one of three shapes: a string with named placeholders, a plural object, or a System message as an array of lines. Keys are English and dotted, grouped as `ui.*`, `system.*`, `canon.*`, `parent.*` and `test.*`. Rename the keys the stand-in adventure uses only where they don't fit the groups, and keep every value.

The shipped set is a constant, `["ru"]`, and the profile's `lang` is checked against it when it is written. When `t` meets a key its language lacks at run time, it returns the Russian value and logs `string_missing` with the key, because the type and parity checks should have prevented it. The server renders story lines, System windows and tasks in the profile's language, and the log keeps each line as it was shown, so a later switch leaves earlier lines in their language.

## Depends on

Nothing in this epic. The notation keys exist in `content/i18n/ru.json` from the epic realising ADR-0040, and this task keeps them where they are.

## Evidence

Not yet.

## Left alone

The pause itself. The window that shows the correction after a delay is `SystemWindow` of the epic realising ADR-0150, which reads the marked line this task produces. The language choice on the settings screen stays hidden until a second language passes the key check, and no second language is written here.
