---
id: TSK-0725
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-2902, REQ-2904, REQ-2906]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Group 2 runs every template on 10,000 fixed seeds against an independent reference solver

After this task, verify's group 2 runs each template on the same 10,000 seeds every time, and fails with the template and the seed named when the engine's answer differs from the reference solver's, a task holds an unfilled placeholder or a noun disagrees in form with its number.

## Acceptance criteria

1. Given every template and the reference solver in `tests/reference/`, when group 2 runs on 10,000 fixed seeds, then the engine's answer equals the solver's on each seed; given one template made wrong on one seed, then group 2 turns red and the report names the template and the seed (REQ-2902). Closed by: an integration test with a template that returns a wrong answer on seed 4,711.
2. Given the files under `tests/reference/`, when the lint verb runs, then none imports from `src/templates/`; given a fixture that does, then the lint fails (REQ-2902). Closed by: the lint rule's fixture test.
3. Given a rendered task with a `{placeholder}` left unfilled on one seed, when group 2 runs, then it fails and names the template and the seed (REQ-2904). Closed by: an integration test with a fixture template.
4. Given a number followed by a noun, when group 2 checks the rendered text, then the noun's form equals the form `Intl.PluralRules` for `ru` selects from the lexicon's forms of that noun, and a fixture that writes "5 яблока" fails (REQ-2906). Closed by: a unit test with the failing fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the seed list, the comparison, the placeholder scan and the plural check to group 2, and `tests/reference/` with one solver for each template, written from the node's description in the graph and importing nothing from the engine's templates. The plural test needs no morphology library and matches how ADR-0160 inflects, which is why ADR-0190 chose it.

The epic realising ADR-0040 supplies the engine, the templates and the 10,000-seed run `npm run verify:templates`, which this group calls, so the two runs can't drift apart. The epic realising ADR-0160 supplies the lexicon. Until they exist the group runs on the fixture templates and a fixture lexicon of this task's own, and the real templates join it as their epics land.

## Depends on

- TSK-0724 (blocking): the group runs inside the runner and writes its results to the report.

## Evidence

Not yet.

## Left alone

The templates' own build checks and the 50 ms generation budget, which ADR-0040's epic owns, and the group's `--fast` run on 1,000 seeds, which TSK-0724 wires.
