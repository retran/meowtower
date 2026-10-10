---
id: TSK-0683
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0160
closes: [REQ-3326]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server runs the gate on every line before it leaves, and a blocked line is replaced by its source's fallback

After this task, no line that fails `textGate` reaches the event stream, each blocked line leaves one `text_blocked` row, and the source's fallback or `system.fallback.line` takes its place.

## Acceptance criteria

1. Given one line from each source, the Master, the line pool, the Explainer, a task template and a fixed string, each holding a forbidden form, when the server sends them, then none reaches the event stream and each leaves one `text_blocked` row with the source, kind, rule, matched form and the line (REQ-3326). Closed by: a server integration test that reads the stream and the table.
2. Given a blocked line whose source has no fallback built yet, when the server replaces it, then the stream carries `system.fallback.line` and the player sees a normal screen (REQ-3326). Closed by: an integration test.
3. Given the table holds 1,000 rows, when a blocked line arrives, then the oldest row goes first and the count stays 1,000 (REQ-3326). Closed by: a unit test.
4. Given one source with more than 5 % of a day's lines blocked, when `./meowtower status` runs, then it prints `text_blocked_high` for that source once, and prints it again only when the share has changed by more than half of the share last reported; the counts of lines checked and blocked per source and game day sit in a counter table (REQ-3326). Closed by: an integration test over a simulated day with a stubbed clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Call `textGate` in the one function every outgoing line passes before the event stream of `src/server/stream.ts` sends it, so no route can send text around it. Skip `source: "player"`. Give each source its fallback by name: the Master regenerates or takes a pool line, the Explainer falls back to its template, a task template draws another seed, and a pool line that fails is retired. Those fallbacks belong to ADR-0110, ADR-0120 and ADR-0040. Until each epic exists, the function takes `system.fallback.line`.

The `text_blocked` table is an operational table of the server's database, outside the event log of ADR-0020, and holds at most 1,000 rows. The counter table keeps lines checked and lines blocked per source and game day; the share for the report is read from it, and the game day ends at 04:00 as `src/shared/game-day.ts` has it. A line that was blocked is never shown, so the client holds no copy of the check.

## Depends on

- TSK-0681 (blocking): the server calls `textGate`.

The epics realising ADR-0110, ADR-0120 and ADR-0040 supply the fallbacks of the Master, the Explainer and the templates. This task runs without them by using `system.fallback.line` and leaves each source's own fallback to its epic.

## Evidence

Not yet.

## Left alone

What a source does with the rejection beyond the fallback, such as ADR-0110's regeneration limit. The lines the player typed pass unchecked, and the gate protects against drift in our own text, not against a person.
