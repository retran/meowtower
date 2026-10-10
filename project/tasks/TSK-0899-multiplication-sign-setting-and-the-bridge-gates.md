---
id: TSK-0899
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5894, REQ-5896, REQ-5898]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent sets the multiplication sign, and a bridge word shows only at «Понимает» and while the bridge is on

After this task, task text is rendered with the multiplication sign the parent chose, «×» by default, the answer parser accepts either sign, a bridge word appears only in a task of a node at «Понимает» or higher without Dutch, and switching the bridge off removes every bridge element at render time.

## Acceptance criteria

1. Given the default setting, when a task, a short solution, a hint rung and an explanation placeholder are rendered in Russian, then they write «×» for multiplication, «:» for division and the decimal comma; given `notation.multiplicationSign` set to «·», then they write «·» and nothing else changes (REQ-5898). Closed by: a render test with both settings.
2. Given a task shown before the setting changed, when the node card reads it, then it shows the sign the player saw, from the stored view in `item_shown` (REQ-5898). Closed by: a test that reads a view across a setting change.
3. Given an entry that writes a product with «×» and one that writes it with «·», when the parser reads each, then both are accepted under either setting (REQ-5898). Closed by: a parser test with both signs.
4. Given a node whose tested state, computed without the `bridge` stream, is below «Понимает», when a task of it is built, then it holds no bridge word; given «Понимает» or higher, then a bridge word may show (REQ-5894). Closed by: a bridge test over states on either side of the line.
5. Given `bridge.enabled` off, when a task, a card, a mixed task or the Diary's dictionary renders, then none shows a bridge element; given a task shown before the switch and resumed after it, then it renders again from its seed with the same numbers and no bridge word, and its `item_shown.forms` keeps `bridge` (REQ-5896). Closed by: a bridge test that switches the setting mid-task.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the two settings `notation.multiplicationSign` and `bridge.enabled` to `PUT /api/parent/settings`, logged as `settings_changed`. The renderer reads the sign at render time. The parser accepts both signs, because the player may type the one the school uses; the school's sign is unconfirmed on Cito's pages, which is why the setting exists.

The bridge's gate reads the node's tested state without the `bridge` stream, and the switch acts at render time, so a stored view stays in the log. ADR-0210 owns the bridge's words, their approval, their share and their events, and this task adds only the two gates.

## Depends on

Nothing. The epic realising ADR-0040 supplies the renderer and parser, and the epic realising ADR-0160 the notation profile and the bridge's keywords; until they exist the task runs on the fixture renderer and a fixture bridge word.

## Evidence

Not yet.

## Left alone

The bridge's words, the parent's approval of each, their events and the change to the Russian-only rule, which ADR-0210 owns. Division's sign and the decimal comma, which stay as they are.
