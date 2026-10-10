---
id: TSK-1143
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0450
closes: [REQ-7320, REQ-7322, REQ-7324]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Version 2 of the events and the fixed list of home measures

After this task, both hypothesis events have a version 2 with an upcaster from version 1, a hypothesis can hold 1 to 3 numeric conditions on each side, and every measure a condition names comes from `content/hypothesis-measures.json`, which a static check ties to `RULES_VERSION`.

## Acceptance criteria

1. Given a version 1 event in the log, when it is read, then the upcaster lifts it to version 2 with empty `conditions`, and a version 2 save carries `criteria.conditions` and `links.dimensions` and `links.presentations` (REQ-7320). Closed by: an upcast test over a version 1 event and a version 2 route test.
2. Given a save with a side that holds 0 conditions or 4, when it is sent, then nothing is written and the reply names the side; given 1, 2 and 3 on a side, then each is accepted (REQ-7320). Closed by: a route test over the five counts.
3. Given a condition, when it is saved, then it names one measure or the difference of two, a number of percentage points and `above` or `below`, and a condition that names a measure absent from the list is refused (REQ-7322, REQ-7324). Closed by: a schema test over valid conditions and two invalid ones.
4. Given a fixture whose measure list changed while `RULES_VERSION` did not, whose `content/profile.dimensions.json` changed while it did not, or from which an identifier disappeared, when group 1 runs, then `hypothesis_measures_versioned` fails and names the file (REQ-7324). Closed by: three fixture tests of the check.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add version 2 as ADR-0450's table lists it, as a new payload version with an upcaster, so the scope guard finds a post-MVP trace by the schema's version alone. Write `content/hypothesis-measures.json` with the four kinds, `dimension.<id>`, `node.<id>`, `subtype.<id>` and `probe.bare`, `probe.ru`, `probe.nl`, `probe.nl_after_words`, `probe.nl_source`, each with its observation rule, and register each measure's floor of 20 observations in `src/parent/measures.ts`, the registry ADR-0380 owns. The list only grows: a kind or a presentation name is never removed or reused. Add `hypothesis_measures_versioned` to `tools/static-checks.ts`. The change of the form (a condition editor on each side) is part of this task and reads the list.

This is the first task of the post-MVP part, so it removes the scope guard's traces for the list and the version 2 schema, and the `hypothesis_days` trace waits for TSK-1145.

## Depends on

- TSK-1140 (blocking): it adds version 2 to the schemas that task defines.

The epic realising ADR-0390 supplies the profile's mapping file and the observation rule of each dimension; the check reads a fixture mapping until then. The epic realising ADR-0430 supplies the probe's observation rule; the five probe names are on the list from the start and read `measure_not_collected` until it exists.

## Evidence

Not yet.

## Left alone

The condition states and the label, which TSK-1144 builds, and the rules version itself, which ADR-0060's epic owns.
