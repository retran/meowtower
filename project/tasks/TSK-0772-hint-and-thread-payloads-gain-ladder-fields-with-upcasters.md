---
id: TSK-0772
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5156]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `hint_shown`, `thread_spent` and `attempt_submitted` carry the ladder's fields, and two framing events join the log

After this task, `hint_shown` has a new version with `ladderOpenedBy`, `thread_spent` has a new version whose reason is `hint_ladder` or `explanation`, `attempt_submitted` carries `hintMaxLevel` beside `hintLevel`, each upcasts from the version before it, and the log accepts `rung_framing_approved` and `rung_framing_removed`.

## Acceptance criteria

1. Given a stored `hint_shown` of the version now in the registry, when it is replayed through the upcaster, then it reads as `ladderOpenedBy: "thread"`, and the new version validates `thread` and `free_step` and nothing else (REQ-5156). Closed by: a schema test and a replay test.
2. Given a stored `thread_spent` with reason `hint`, when it is replayed, then it reads as `hint_ladder`; given a new event, then the reason is `hint_ladder` or `explanation` and the server never writes `hint` again (REQ-5156). Closed by: a schema test and a replay test.
3. Given a stored `attempt_submitted` from before this task, when it is replayed through the upcaster, then `hintMaxLevel` is 3, because every ladder before this decision had three rungs; given a new one, then `hintMaxLevel` is 0 to 3 and `hintLevel` never exceeds it (REQ-5156). Closed by: a schema test and a replay test.
4. Given a payload of `rung_framing_approved` with `framingId`, `familiarKind`, `rung` from 1 to 3, `textHash` and `edited`, and one of `rung_framing_removed` with `framingId` and `textHash`, when each is appended, then it validates and carries owner ADR-0220 (REQ-5156). Closed by: a schema test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Register the next version of `hint_shown`, `thread_spent` and the one new version of `attempt_submitted` that ADR-0210 asks for the whole addendum, each in `src/shared/events.ts`, with the upcasters above. ADR-0370 words the first two: the upcasters read version 1 `thread_spent` reason `hint` as `hint_ladder` and version 1 `hint_shown` as `ladderOpenedBy: "thread"`. ADR-0360 settles the third: the upcaster sets `hintMaxLevel` to 3, as ADR-0220 decides, over ADR-0210's wording that fills it from `hintLevel`. ADR-0080 stays the owner of the three types.

Add `hintMaxLevel` to that one version and never register a second version for it. Register the two framing types with the payloads of ADR-0220's table.

Add the type names to the catalogue of ADR-0020 in the same change as their schemas, as ADR-0220 asks.

## Depends on

The epic realising ADR-0210 supplies the one new version of `attempt_submitted` that every field of the addendum joins. Until that work lands, this task registers the version with `hintMaxLevel` as its only new field, and the work of ADR-0210 adds its fields to the same version.

## Evidence

Not yet.

## Left alone

What writes the events, which is TSK-0773 and TSK-0776, and the framing screen that approves a line, which is TSK-0782.
