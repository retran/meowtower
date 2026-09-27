---
id: TSK-0230
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0020
closes: [REQ-3808]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A static check keeps every template's parameters language-free

After this task, the lint verb walks every task template's parameter schema and fails on any field that isn't a number, an exact rational as a numerator and a denominator, a boolean or an enum identifier, so a task's parameters can't depend on the display language.

## Acceptance criteria

1. Given the repository, when the lint verb runs, then the check reports how many templates it read and finds a string-typed field in none. Closed by: the lint verb's output.
2. Given a fixture template with a free string parameter, and fixtures with a string nested in an object or an array, when the check runs over them, then it fails and names the template and the field for each. Closed by: `tests/unit/static-checks.test.ts`.
3. Given fixture templates using only numbers, rationals, booleans and enum identifiers, when the check runs, then it passes. Closed by: the same test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the check to `tools/static-checks.ts` beside `checkNoKeyInClient` and `checkNoPush`, as a verify group 1 check. It reads the templates where ADR-0040 places them; before any exist it reads none and says so in its output, and its fixtures prove it fails. An enum identifier is a value from a closed list in the schema, never a free string.

## Depends on

None. It reads template files and fixtures, not the log. The epic realising ADR-0040 writes the templates this check then covers.

## Evidence

Not yet.

## Left alone

The templates and their rendering, which ADR-0040 defines, and the `locale` field of `item_shown`'s view, which TSK-0210 requires.
