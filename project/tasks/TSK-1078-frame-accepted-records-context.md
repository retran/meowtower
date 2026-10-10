---
id: TSK-1078
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0410
closes: [REQ-6900, REQ-6914, REQ-6916]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every accepted frame records its context, and a frame without one is never served

After this task, every `frame_accepted` event holds exactly one `context` from the list, the picker never serves a library frame whose acceptance lacks one, and `item_shown` carries no context field.

## Acceptance criteria

1. Given a candidate frame and a listed context, when the parent accepts it, then the server writes one `frame_accepted` holding the frame's text, its hash and that context, and never a second acceptance for the same frame (REQ-6900, REQ-6914). Closed by: a server test over a fixture candidate.
2. Given an acceptance with no `context` or with an id the list doesn't hold, when the server validates the event, then it refuses to write it (REQ-6900). Closed by: the event schema test, one fixture each.
3. Given a log with a `frame_accepted` that lacks `context`, when the server starts and the picker lists frames, then that frame is never served and the server reports `frame_untagged` once at start (REQ-6914). Closed by: a start-up test and a picker test.
4. Given the `item_shown` schema, when the schema test runs, then it has no field named `context` and a payload that carries one is refused, because the event names its frame and the frame's acceptance holds the context (REQ-6916). Closed by: the event schema test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `context` to the payload of `frame_accepted` under ADR-0380's rule for addendum 2's fields, and add the field to ADR-0130's frame record so a frame carries its structure, locale, floor, characters, the role of each number placeholder, its content hash and one context. The server writes the context on every acceptance from the first accepted frame, so the log holds no untagged acceptance. A live frame the parent moves to the library records the context its request named, and a live frame never brings a context new to its subtype. Report `frame_untagged` through `./meowtower status` as ADR-0410 sets.

## Depends on

- TSK-1076 (blocking): the event takes an id from the list and the schema refuses one it doesn't hold.

The epic realising ADR-0020 supplies the event catalogue and the schema registry this task adds a field to. The epic realising ADR-0130 supplies the frame record and the review flow; until it exists the task runs on fixture frames.

## Evidence

Not yet.

## Left alone

The frame request and the review screen, which TSK-1079 changes, and the picker's order of choice, which TSK-1080 sets.
