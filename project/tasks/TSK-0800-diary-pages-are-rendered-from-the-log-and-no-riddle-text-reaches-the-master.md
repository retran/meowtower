---
id: TSK-0800
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0230
closes: [REQ-5270, REQ-5272]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# «Загадки героини» pages are rendered by the server from the log, and no composed text reaches a `StoryRequest` or the Master's memory

After this task, the Diary's pages «Загадки героини» (The heroine's riddles) show each riddle's text as the log holds it with no model writing any part, leave out any riddle with a trigger or signal above none, and no path carries a composed text into a request to the Master or its story memory.

## Acceptance criteria

1. Given a log with riddles of `match` and `match_other_structure`, when the pages are rendered, then each shows its text as the log holds it and the server's render has no model call (REQ-5270). Closed by: a render test with the gateway log read.
2. Given a riddle with a trigger or signal above none, when the pages are rendered, then it is left out (REQ-5270). Closed by: the render test with a fixture riddle.
3. Given the code, when a search runs for a path from `compose_submitted`'s text to a `StoryRequest` or the Master's story memory, then it finds none (REQ-5272). Closed by: a static code search test.
4. Given a request to the Master built after a day of riddles, when its body is read, then it holds no composed text and no number from one (REQ-5272). Closed by: a gateway test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the server-side render of the pages from `compose_submitted` and `compose_confirmed`. The Master can't read a composed riddle, so its story memory can't supply these pages; the page is built from the log on demand and stores nothing, so it doesn't pile up. Show a riddle with `match` or `match_other_structure` as the log holds it.

Add the static search to the group 1 checks: no module that builds a `StoryRequest` or writes story memory imports or reads the compose events' text fields. A riddle is an answer and carries her numbers, which the Master's requests must never hold.

## Depends on

- TSK-0791 (blocking): the events the pages are rendered from.

The epic realising ADR-0150 supplies the Diary's screens and the epic realising ADR-0110 the Master's request builder.

## Evidence

Not yet.

## Left alone

The look of the pages, which ADR-0150 owns, and the Parent Room's list of the same riddles, which TSK-0799 holds.
