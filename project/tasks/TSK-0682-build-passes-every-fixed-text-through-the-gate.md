---
id: TSK-0682
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0160
closes: [REQ-3326, REQ-3308]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The build passes every fixed string and 200 rendered seeds of every template through the gate

After this task, the lint verb runs `textGate` on every string of every per-language content file and on 200 rendered seeds of every task template, and fails with `forbidden_in_content` naming the key or template and the form, and no `system.*` value holds a digit.

## Acceptance criteria

1. Given every per-language file, `ru.json`, `lines.ru.json`, `frames.ru.json`, `science.ru.json`, `lexicon.ru.json`, `recipes.ru.json`, `shop.ru.json`, `branches.ru.json` and `canon.ru.md`, when the check runs, then each string passes the gate with the kind its key group names, and a fixture file holding «ошибкой» in one value fails with `forbidden_in_content`, the file, the key and the form (REQ-3326). Closed by: the lint verb's output and a unit test with the fixture.
2. Given a fixture template whose text holds a forbidden form for some seeds, when the check renders 200 seeds of every registered template, then it fails with the template id, the seed and the form, and a clean template passes (REQ-3326). Closed by: a unit test with both templates.
3. Given a `system.*` value holding a digit, when the check runs, then it fails with the key, and given a System window that shows a number, then the number comes from a placeholder such as `{n}` that code fills and the text of the line holds no digit (REQ-3308). Closed by: a unit test with one failing value and a rendering test of one window with a filled field.
4. Given a language file other than `ru.json`, when the check runs, then a language that isn't in the shipped set is skipped and the key check of TSK-0676 reports it (REQ-3326). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `tools/gate-content.ts` to the lint verb's script. For a `.json` file, walk the values; for `canon.ru.md`, split into paragraphs. Pick the kind from the key group: `system.*` is kind `system`, `ui.*` is `label`, and everything else is `story`, which I chose as the strictest default that doesn't fail a prose key on punctuation. Skip `parent.*` keys, as the gate does. Render the templates through the generator's `generate` with seeds 1 to 200, a sample size ADR-0160 chose.

## Depends on

- TSK-0681 (blocking): the check calls `textGate`.
- TSK-0676 (blocking): the check walks the keys and groups of the typed file.

The epic realising ADR-0040 supplies `generate` and the templates. Until it has real templates, this task's check renders the fixture templates of that epic and passes on an empty list of templates.

## Evidence

Not yet.

## Left alone

The fallbacks a blocked line takes at run time, which TSK-0683 builds, and the content of the files, which other epics write; this task only fails the build when their text breaks the list.
