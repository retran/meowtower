---
id: TSK-0960
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6242, REQ-6284, REQ-6286]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# "Show" cards reach only the Parent Room, the story book prints, and the memo holds a first-week checklist

After this task, a card she makes from a scene or a moment is listed and read only behind the parent's PIN, the story book screen prints to PDF through the browser, and the Parent Room's memo holds a checklist for her first week of play.

## Acceptance criteria

1. Given a card made from a scene and one from a room moment, when a player device asks to list or read cards, then the routes answer that no such route exists for it, while creating a card works and appends `share_card_created`; the parent behind the PIN lists them and `share_card_viewed` is appended on viewing (REQ-6284). Closed by: a route test with a player cookie and a parent session, and a static check that player client code never imports the card panel.
2. Given 50 unviewed cards, when the card panel opens, then it shows one line saying so, and given 49, then it shows none (REQ-6284). Closed by: a component test.
3. Given the story book screen with two favourites, when the print stylesheet applies, then the browser's print renders the favourites and the chapters on pages, and the server's dependencies hold no PDF library (REQ-6286). Closed by: a Playwright test that prints the screen to PDF and reads its text, and a dependency check.
4. Given the memo, when the parent reads it, then it holds a checklist for the player's first week of play beside the rule against tying play to rewards or punishments outside the game, and the checklist helps (REQ-6242). Closed by: judgement, the parent's at the stage 0.3 acceptance, because whether a checklist helps a family is the parent's to say.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `POST /api/cards`, `GET /api/parent/cards` and `POST /api/parent/cards/:cardId/viewed`, the card panel in the Parent Room, a print stylesheet for the story book screen and the memo's checklist text from the string file. A card carries her own text, which stays on the Mac and with the family, so no player route lists or reads one and the PDF is printed by the parent from that screen, which holds nothing the story book doesn't already show on that device.

## Depends on

- TSK-0959 (blocking): the story book shows favourites that task marks, and a card is made from a scene in the story log.

The epic realising ADR-0180 supplies the Parent Room, the memo and the story book screen; until it exists the task runs on a stand-in Parent Room page. The owner writes the checklist.

## Evidence

Not yet.

## Left alone

The report's other screens and its PDF snapshot after the MVP, which ADR-0180, ADR-0300 and ADR-0310 own.
