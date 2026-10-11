---
id: ADR-0500
artifact: adr
status: draft
revised: 2026-10-11
addresses: [REQ-0916]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0500. A task the parent excluded returns to the estimates by an `item_included` event

## Decision

The log gets a new event type, `item_included`, with one field, `itemId`. The parent's action that reverses `item_excluded` writes it. A task whose last exclusion event is `item_excluded` is in no observation, probe or block; a task whose last one is `item_included`, or that has none, is in them as usual (REQ-0916). Works once accepted: the knowledge model reads the pair. Doesn't work yet: no screen sends the event; the parent's screen comes with ADR-0180's epic.

## Why

SPC-0060 says a task is out when the parent excluded it and "no later event re-included it", but the record names no event for the re-inclusion, and the catalogue has none. Reusing `item_excluded` with a reason would make one type mean two actions.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Reuse `item_excluded` with reason `reincluded` | No new type | One type means two actions, and the projection gets harder to read |
| Add `item_included` (this) | Each action is one event type | Chosen |

## What it costs

One more event type in the catalogue and its schema test.

## What would reverse it

- The record names a different event for the re-inclusion before the model is built.

## Consequences

- `src/shared/events.ts` gains `item_included` v1 and its catalogue entry.
- The knowledge model reads the last exclusion event per item.

## How I will know it was realised

1. A log with `item_excluded` then `item_included` puts the task back in the estimates, and a log with only `item_excluded` keeps it out.

## What this does not settle

- Whether the parent may re-include a task with a different reason than the one given at exclusion.
