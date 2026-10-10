---
id: TSK-1113
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0430
closes: [REQ-6656, REQ-7106, REQ-7108, REQ-7156]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A family is one ordinary template shown in up to five presentations from one approved pair

After this task, the engine builds a probe family at the change of game day from one ordinary template and one approved pair, fixes its presentations, order and seeds, and writes `probe_family_created`, and a letter's `item_shown` records which presentation it built.

## Acceptance criteria

1. Given an eligible template, that is one with `probeFamily`, a node that already holds a graded first attempt of hers, an approved pair and no open family, when the game day changes with the switch on, then the engine writes `probe_family_created` with the family's level, the pair's hash and an order that lists each presentation with a seed drawn from the adventure's seeded stream (REQ-7106). Closed by: a unit test over a fixture log.
2. Given a maths template, then its family holds exactly `bare`, `ru`, `nl` and `nl_after_words`, and `nl_source` when the template draws a table or chart; given a Sources track template, then exactly `ru`, `nl` and `nl_after_words`, each drawn as a source through ADR-0300's `SourceView` (REQ-7108). Closed by: a unit test, two fixtures.
3. Given a family, when its presentations are built, then every text presentation tells the one pair's context with one Mainland name, the numbers come from the template's generator under each presentation's own seed at the same level, and the level is the one ADR-0070 would give an ordinary room task on that node that day (REQ-7106). Closed by: a unit test that compares the presentations' difficulty parameters and contexts.
4. Given a template whose subtype is a surplus or unanswerable one, when the builder looks for a family's template, then it never builds a family from it, and a T1 to T4 family always uses an ordinary subtype (REQ-7156). Closed by: a unit test with both subtypes in the fixture.
5. Given a letter shown, then its `item_shown` carries `probe` as `{ familyId, presentation, position }`, where `position` is the count of the family's presentations shown before it plus 1, and the effective seed is logged as `base/k` or `base/f<i>` as for any task (REQ-6656). Closed by: an event schema test and a replay test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/probe/` with the family builder. The family's template is the least recently probed eligible template that holds an approved pair and no open family, ties broken by the adventure's seeded stream. Put no gate on the node's state, because a gate at «Понимает» would keep every maths gap out of the probe, and the falsifiability rule asks the probe to show a maths gap as clearly as a language gap. A family takes the least recently used approved pair of its template, never one used in the last 28 game days while another exists, and among pairs prefers one whose context she has met on the subtype, as ADR-0460 settles. The renderer fills placeholders with one Mainland name from the canon record; until that record exists, a fixture name list stands in.

## Depends on

- TSK-1109 (blocking): the family's template carries `probeFamily`.
- TSK-1112 (blocking): the family takes an approved pair.
- TSK-1120 (not blocking): it supplies the Mainland names, and fixture names stand in until it lands.

The epic realising ADR-0040 supplies the generator and seeds, the epic realising ADR-0070 the level of a room task, and the epic realising ADR-0300 the `SourceView`; the task runs on fixtures of each.

## Evidence

Not yet.

## Left alone

The letters' place on the floor and the order of presentations, which TSK-1114 plans, and the controls inside a letter, which TSK-1115 sets.
