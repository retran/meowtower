---
id: ADR-3420
artifact: adr
status: approved
revised: 2026-11-15
addresses: [REQ-8280, REQ-8282]
supersedes: []
concerns: [privacy]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3420. The showrunner and the Master read the child's profile, and both run in the player tier

## Decision

The parent writes one campaign-wide profile of the child and her interests in the Parent Room settings, up to 2,000 characters. The scenario writer and the Master read it: the writer adds it to the brief of each run, and the Master adds it to its system prompt. A profile that holds a name the parent listed for the egress guard, in `MEOWTOWER_EGRESS_NAMES`, is refused when it is saved, so it holds no real name or school; the gateway cleans those names from every request again before it leaves.

The showrunner's role `SHOWRUNNER_MODEL` moves from the content tier to the player tier, because it now reads the child's profile, which is player material. The code's comment on that role already said it would move once story material entered. On the direct route a player-tier role needs the zero-retention attestation, which the owner gave on 2026-11-15, and on OpenRouter it takes the zero-retention providers.

Once this is accepted, a generated adventure and a turn of the Master can follow what the child likes. What still doesn't work: the frame author does not read the profile, because its role is content tier and moving it is a decision of its own.

## Why

REQ-8280 asks every story agent to read the profile and REQ-8282 asks it to travel in the player tier through the egress guard. The writer is a story agent that makes the scenario, so it must read the profile, and then it holds player material.

## Alternatives

| Option                                   | Better at                          | Why it lost                                                                  |
| ---------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------- |
| Do nothing                               | No change of tier                  | The scenario ignores the child's interests, which REQ-8280 requires.         |
| The Master alone reads the profile       | Smaller change                     | The scenario is written before the Master plays, so its interests come late. |
| The writer and the Master read it (this) | The story follows her from the plan on | The showrunner moves to the player tier, with its stricter routes.         |

## What it costs

The showrunner can run only on a route that keeps no data, which the owner's attestation covers on the direct route. A profile the parent writes can still hold a detail the list of names does not catch.

The strongest objection: a free-text profile cannot be proved free of a real name or a school. The answer is the check at save time against the parent's own list and the guard that cleans every request again.

## What would reverse it

- A profile found in a log with a name the list did not hold, which would call for a stricter check or for dropping the free text.

## Consequences

The settings gain `profile`. `SHOWRUNNER_MODEL` is a player-tier role, so a configuration that sets it on the direct route needs `ANTHROPIC_ZDR_ATTESTED`. The writer's prompt files gain a line for the profile.

## How I will know it was realised

1. The profile is saved, read back and refused with a listed name, in an integration test.
2. A generation's brief and a Master turn's system prompt hold the profile, in tests.
3. `SHOWRUNNER_MODEL` is a player-tier role, in a test.

## What this does not settle

- The frame author reading the profile.
- A structured profile instead of free text.

## Plan

1. The profile is a setting the parent writes, and the writer and the Master read it (REQ-8280, REQ-8282). It touches `src/server/parent-room.ts`, `src/story/writer.ts`, `src/story/turn.ts`, `src/server/gateway/config.ts` and the parent settings screen.
