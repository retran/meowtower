---
id: ADR-0510
artifact: adr
status: done
revised: 2026-10-24
addresses: [REQ-7506, REQ-0984]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0510. `model_activated` records the file version and the held-out figures, and the latest one names the active model

## Decision

I chose these details because the record leaves them open. SPC-0060 names the event `model_activated` and the command `./meowtower model activate`, and gives neither a payload.

The event has schema version 1 and these fields: `modelVersion` (the file version, such as `v2`), `previous` (the version it replaced, or null for the first), `heldOutAttempts` (a count), and `figures` (the active and candidate log-loss and expected calibration error, each null when there was no predecessor). `./meowtower model activate <file>` writes it only when the candidate has lower log-loss and lower calibration error than the active version, or when there is no predecessor. The model version the server uses at start is the `modelVersion` of the latest `model_activated` event, and `content/versions.json` names it only while the log holds none. Works once accepted: the gate decision and the event are one code path, and the next start recomputes under the new version. Doesn't work yet: the refit tool that writes candidate files.

## Why

A version the server reads from a tracked file would change without a trace in the log, so a recompute could not say which version governed which part of it. The latest event gives the log one answer, and the figures in the event let the parent see why a version was accepted months later (REQ-7506).

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| The command edits `content/versions.json` | One place to read the version | A tracked file changes at run time, and the log shows nothing |
| The event carries the version only | Smallest schema | The reason for acceptance is lost with the terminal output |
| Event with figures (this) | The log explains itself | Chosen |

## What it costs

One event type with a schema and a catalogue entry, and a start-up read of the latest `model_activated` event.

## What would reverse it

- An approved record names a different payload or a different place for the active version before a candidate file exists.

## Consequences

- `src/shared/events.ts` gains `model_activated` v1.
- `src/server/main.ts` reads the latest `model_activated` event before it sets the versions.
- `tools/eval-model.ts` and the `model activate` command share the decision in `src/engine/model/evaluate.ts`.

## How I will know it was realised

1. A candidate worse on log-loss or on calibration is refused with both figures printed and no event written, and a candidate lower on both writes the event and the next start recomputes under it.

## What this does not settle

- How the refit tool produces a candidate file, and who may run the command.
