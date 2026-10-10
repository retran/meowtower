---
id: TSK-0677
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0160
closes: [REQ-3810]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A string written into the code fails the build

After this task, the lint verb fails on a Cyrillic character in `src/` outside test fixtures and on a literal text in JSX or in `aria-label`, `title`, `placeholder` and `alt`, and a pseudo-language render finds no screen text that isn't a key.

## Acceptance criteria

1. Given `src/` as it is committed, when `grep -rP '[\x{0400}-\x{04FF}]' src --exclude-dir=__fixtures__` runs, then it prints nothing, and a fixture component with a Russian label makes the static check report it with the file and the match (REQ-3810). Closed by: the command's output and the static check's fixture test.
2. Given the lint configuration with `no-literal-string` from `eslint-plugin-i18next`, when a fixture holds an English or Dutch literal in JSX text and in each of `aria-label`, `title`, `placeholder` and `alt`, then the rule reports each one and reports nothing on the committed `src/` (REQ-3810). Closed by: the rule's fixture test and the lint verb's output.
3. Given a pseudo-language file whose values are the keys themselves, when every screen the client renders is opened with it, then no visible or accessible text on any screen differs from a key (REQ-3810). Closed by: a Playwright test that walks the screens and reads the text and the accessible names.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the Cyrillic scan to `tools/static-checks.ts`, which the lint verb already runs, and add the rule `no-literal-string` to the ESLint configuration for `src/`, with its version pinned as the other development packages are. Move every Russian or other literal string the scan finds in `src/` into `content/i18n/ru.json` under the right group and call `t`. Add the pseudo-language file to the Playwright fixtures, served as a second language for the test only, and have the walk list every route the client renders.

## Depends on

- TSK-0676 (blocking): the pseudo-language run needs the typed `t` and the language files it loads.

## Evidence

Not yet.

## Left alone

Text under `parent.*`, which the forbidden list doesn't cover but this check does, because the Parent Room's text is also a per-language string. The screens that don't exist yet are checked by the same walk when their epics add them to the route list.
