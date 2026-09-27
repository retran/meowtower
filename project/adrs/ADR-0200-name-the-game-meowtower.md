---
id: ADR-0200
artifact: adr
status: draft
revised: 2026-09-27
addresses: [REQ-3714]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0200. The game is named Meowtower, and every technical name follows it

## Decision

The game is Meowtower, «Мяубашня» in Russian, and the repository is `retran/meowtower`. Every technical name that carried "tower" now carries "meowtower", by this table, which is authoritative wherever an approved record still uses an old name:

| Old name | New name |
| --- | --- |
| Tower Chronicles, «Хроники Башни» | Meowtower, «Мяубашня» |
| repository `retran/tower` | `retran/meowtower` |
| operator command `./tower` | `./meowtower` |
| Compose project and server service `tower` | `meowtower` |
| Docker volume `tower-db` | `meowtower-db` |
| database directory `/var/lib/tower` | `/var/lib/meowtower` |
| database file `tower.sqlite`, `data/tower.sqlite` | `meowtower.sqlite` |
| snapshot files `tower-<UTC timestamp>.sqlite` | `meowtower-<UTC timestamp>.sqlite` |

The proxy service keeps its name, `proxy`. The in-world names, such as the Tower («Башня») the heroine climbs, stay: they name a place in the story, not the game.

Once accepted, the repository, the running stack and the living documents (the specifications, the vision, `CLAUDE.md` and the index pages) use the new names, and `TSK-0010` ships with them. Approved records that still say "tower" keep their text; this table translates them.

## Why

The owner renamed the game and the repository on 2026-09-27 and asked that the technical names follow (REQ-3714). One name everywhere means a person reading a log line, a container list or a record finds the same word, which the owner asked for. Rewriting approved records would invalidate their approval (`paw check frozen`), so a mapping carries the change instead.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing | No work, no churn in approved records | The owner asked for the new name, and REQ-3714 requires it |
| Rename the game and repository only, keep technical names | Leaves ADR-0010, SPC-0010 and the tasks' names true as written | The owner asked for the technical names to follow; two names for one system confuse the operator |
| Rewrite every approved record to the new names | No mapping to remember | Each rewrite breaks that record's approval and hides what it said when approved |

## What it costs

A reader of an approved record must translate old names through the table above, and the old Docker volume names don't carry over: a stack started under the old names keeps its data in `tower_tower-db`, which `./meowtower` never reads. No stack held game data under the old names when this was decided.

## What would reverse it

- The owner chooses another name. A later decision then replaces this table.

## Consequences

- SPC-0010, `CLAUDE.md`, `project/vision.md` and the index pages use the new names.
- Tasks written from now on use the new names; approved tasks read through the table.
- `TSK-0010`'s evidence records the new names.

## How I will know it was realised

1. `gh repo view retran/meowtower` answers, and `retran/tower` redirects to it.
2. `./meowtower up` starts the Compose project `meowtower` with the services `meowtower` and `proxy` and the volume `meowtower-db`.
3. `grep -rn '\./tower\b\|tower-db' project/specs CLAUDE.md` finds nothing.

## What this does not settle

- The name of the Tower inside the story, which the canon keeps.
- Whether «Мяубашня» is the final Russian title: it is the owner's direction to change the title, with this spelling chosen by the implementer and open to the owner's correction.
