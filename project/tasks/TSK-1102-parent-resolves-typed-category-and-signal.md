---
id: TSK-1102
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0420
closes: [REQ-7064, REQ-7076]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# After the MVP, the parent maps a typed category or an `other` signal and the screen reads the resolution

After this task, a row whose category was typed or whose signal is `other` waits in no quadrant until the parent maps it in the Parent Room, and the resolution is an event keyed by the printout's words.

## Acceptance criteria

1. Given a category entry with a typed category or an `other` signal and no resolution, when the screen is built, then the row is in no quadrant under `category_unmapped` or `signal_other`, and the mapping panel lists it (REQ-7064, REQ-7076). Closed by: a Playwright test.
2. Given the parent maps typed words to one of the eight listed keys or to 1 to 40 node ids, or an `other` signal to one of the five listed signals, when the panel saves, then `cito_category_resolved` is written with the typed words lower-cased and runs of spaces collapsed, at most 80 characters, and the row reads on the next request (REQ-7076). Closed by: a projection test and a Playwright test.
3. Given the same typed words in a later result or a correction, when the screen is built, then they resolve once, with no second entry for the parent; given two resolutions of the same words, then the later by `seq` wins (REQ-7064). Closed by: a projection test, two fixtures.
4. Given a resolution with every field `null`, when it is applied, then it undoes the mapping and the row returns to its reason (REQ-7076). Closed by: a projection test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the event `cito_category_resolved` to ADR-0020's catalogue, owned here and added to ADR-0210's table of owners, with the payload ADR-0420 gives: `kind`, `typed`, and for a category either `category` or `nodes`, for a signal `signal`. Extend ADR-0310's mapping panel to list each typed category and each `other` signal with no resolution. A resolution is keyed by the typed words and never by a result. Forty nodes is the ceiling because the largest domain maps 34. ADR-0210's scope guard keeps the event and the panel out of the tree until the MVP ends.

## Depends on

- TSK-1093 (blocking): a resolution maps to that file's keys.
- TSK-1098 (blocking): the unresolved row's reasons come from that task.

The epic realising ADR-0310 supplies the mapping panel and the epic realising ADR-0020 the event catalogue.

## Evidence

Not yet.

## Left alone

The category mapping of the four LOVS lists, which a person confirms in the file, and the memo's new lines, which TSK-1103 adds.
