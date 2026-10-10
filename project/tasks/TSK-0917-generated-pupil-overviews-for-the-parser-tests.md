---
id: TSK-0917
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0310
closes: [REQ-6082, REQ-6090]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parser's tests read only generated pupil overviews, and no real overview enters a tracked file

After this task, `tools/school-fixtures.ts` generates synthetic overviews as PDF and PNG files with invented names, schools and goals into `test/fixtures/school/`, a manifest holds each file's hash, and a scan fails on a file the generator didn't write.

## Acceptance criteria

1. Given `tools/school-fixtures.ts`, when it runs, then it writes synthetic overviews in several layouts, with and without a text layer, with the unconfirmed fields present and absent, and a `manifest.json` with each file's hash (REQ-6090). Closed by: the generator's output listing.
2. Given the generated directory, when a test regenerates it, then every file is byte-identical to the manifest; given a fixture file dropped into the directory by hand, then the test fails and names it (REQ-6090). Closed by: the regeneration test with the hand-dropped fixture.
3. Given the tracked files, when the scan of group 1 runs, then it finds no overview outside the generator's output directory, and the personal-data scan finds none of the player's name, age or school in any fixture; given a fixture that holds a value from `personal/player.md`, then the scan fails (REQ-6082). Closed by: the scan's test with a failing fixture.
4. Given a change that touches the parser or the fixtures, when a person reviews it, then no file in it is a real overview or part of one (REQ-6082, REQ-6090). Closed by: a person's judgement at the review of each such change, because no check tells a real overview from a synthetic one.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the generator so a run is deterministic: fixed fonts, fixed timestamps and fixed metadata in the PDF, so a regeneration is byte-identical to the manifest. Give the layouts the facts RES-4100 confirms: per goal a wording, a subdomain, one of three status boxes, a level from 0 to 5 and a target level. Add variants that also show goal codes, an open flag, a task count, dates, a document date, a share mastered per subdomain and a level of the material, because those are unconfirmed and the parser must work with and without them. Use invented names, schools and goals only.

`data/` and `personal/` are already outside git, and a real overview the parent imports for use lives only there. A person judges the rest.

## Depends on

Nothing.

## Evidence

Not yet.

## Left alone

The first real overview, which nobody on the project has seen. It settles the layout the parser reads under a new parser version, outside git.
