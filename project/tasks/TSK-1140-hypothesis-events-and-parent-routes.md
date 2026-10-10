---
id: TSK-1140
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0450
closes: [REQ-7300, REQ-7302, REQ-7306]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Two parent events record a hypothesis whole, behind the parent session

After this task, `src/shared/events.ts` holds `hypothesis_recorded` and `hypothesis_updated` at version 1, and the three routes `GET /api/parent/hypotheses`, `POST /api/parent/hypotheses` and `POST /api/parent/hypotheses/:id` log them, so a hypothesis written from a parent session exists in the log with its whole text, criteria and links, and a request without that session reaches nothing.

## Acceptance criteria

1. Given a parent session, when the parent saves a new hypothesis with a text, a `confirmText`, a `refuteText` and two node links, then exactly one `hypothesis_recorded` is logged that holds a server-assigned ULID `hypothesisId` and all four values (REQ-7300). Closed by: a route test that reads the log.
2. Given a recorded hypothesis, when one save changes both the text and `confirmText`, then exactly one `hypothesis_updated` is logged with `change: "criteria"` and the whole new text, criteria and links; given a save that changes only the text, `change` is `wording`, and only the links, `links`; and given a save with no difference, no event is written (REQ-7302). Closed by: a route test over the four saves.
3. Given a save that carries a `clientSeq` already used, when it is sent again, then the reply repeats and the log holds one event, and given a `text` of 2,001 characters, a `confirmText` or `refuteText` of 1,001, a `reason` of 501 or 11 node links, then nothing is written and the reply names the field. Closed by: a route test over a repeated save and four over-limit saves.
4. Given any of the three routes, when a request comes with no parent session, an expired one or a player's device alone, then the reply is 401 and no hypothesis is read or written (REQ-7306). Closed by: a route test over the three routes and three kinds of session.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Define both payloads at version 1 as ADR-0450's table lists them: `hypothesisId`, `text`, `criteria` with `confirmText` and `refuteText`, `links.nodes` of 0 to 10 node identifiers, and on the update `change` and an optional `reason`. The server derives `change` from the difference to the previous version, in the order `criteria`, then `wording`, then `links`, and treats `closed` and `reopened` as separate actions that change nothing else. Put the routes beside the other `/api/parent/*` routes in `src/server/parent-room.ts`, use the parent session check that file already applies, and write each event through `appendEvents` with an `idemKey` built from the route, the device and `clientSeq`, as `src/server/play.ts` does. The ceilings are ADR-0450's chosen defaults: 2,000, 1,000, 1,000 and 500 characters, and 10 links. A node link the graph of ADR-0050 doesn't hold is refused when that graph exists; until then the route checks only the identifier's shape.

The first version has no field for a condition, a dimension, a presentation or a label, so the version 1 schemas are strict and refuse one.

## Depends on

Nothing. The epic realising ADR-0050 supplies the graph's node identifiers; the route checks the shape until then.

## Evidence

Not yet.

## Left alone

The tab, the form and the history, which TSK-1141 builds on these routes, and version 2 of both events, which TSK-1143 adds.
