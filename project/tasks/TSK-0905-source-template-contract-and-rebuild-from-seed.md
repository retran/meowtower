---
id: TSK-0905
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5932, REQ-5936, REQ-5992]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A source template keeps its whole source in its parameters, holds no text and asks at one of four levels

After this task, the template contract has an input class `source` whose parameters split into `question` and `source`, `solve()` reads the source only through a `SourceReader`, the same template, version and seed rebuild the same source, and each template names one of the four question levels.

## Acceptance criteria

1. Given 1,000 logged track tasks, when each is regenerated from its template, version and seed, then every source value equals the logged one (REQ-5932). Closed by: a rebuild test over the log.
2. Given a track template's parameter schema, when the static check reads it, then it holds no string field, and a fixture field of type string fails the check; given a source label, then the parameters hold an enum identifier and the label comes through `t()` from a key under `source.label.*` (REQ-5936). Closed by: a static check with a failing fixture and a render test.
3. Given a `solve()` that reads a raw parameter instead of the `SourceReader`, when the lint step runs, then it fails and names the function (ADR-0300). Closed by: the lint verb's output on a fixture.
4. Given a template whose level is missing or isn't `find`, `compare`, `calculate` or `combine`, when the schema loads it, then it refuses it (REQ-5992). Closed by: a schema test with both fixtures.
5. Given a track task shown, when `item_shown` is written, then it carries `track: "sources"` and `questionLevel` in a new payload version, and an old event upcasts without them (ADR-0300). Closed by: an item builder test and an upcaster test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the input class `source` to the template contract, in which a template may ask for `choice` of at least 4 options or for `region`. Split the parameters into `question` and `source`, and put the source's whole data set into `source`, because the source is part of the parameters `item_shown` stores and the node card rebuilds it from the log. Add the `SourceReader` interface to `src/shared/`, with a stand-in implementation over the `source` part.

Add one fixture template for each of the four source kinds, so the tasks after this one run before the real templates exist. Choosing a suitable source and reading a schema or a flow chart are left out, because they would change more approved records for a skill Cito's current tests don't report.

## Depends on

Nothing. The epic realising ADR-0040 supplies the contract, `item_shown` and the static check on language-free parameters, which this task extends for the new class. The graph's track nodes aren't needed, because the fixture templates name their level and node by identifier.

## Evidence

Not yet.

## Left alone

The generator's rules for unused data and neighbours, which TSK-0906 adds. The drawing of the source, which TSK-0907 builds.
