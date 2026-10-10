---
id: TSK-0953
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6202, REQ-6216]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server computes the origin of each send, stores it as a story fact, and the planner must answer her own words in a later scene

After this task, the server writes `free_text` at version 2 with `origin` and `ownWords` computed from the scene's stored starters, every send at a free-action point becomes a `player_action` story fact, and a plan that leaves a fact of her own or edited words from an earlier adventure unechoed fails the planner's checks.

## Acceptance criteria

1. Given a scene with three stored starters, when she sends one unchanged, one edited and one replaced by her own text, and the client claims another origin each time, then the server writes `origin` as `starter_unchanged`, `starter_edited` and `own` and `ownWords` as the words sent minus the words of an inserted starter, whatever the client sent (REQ-6216). Closed by: an origin test against the route.
2. Given a plan of 3 floors, when the day plan is read, then it marks the entry of each floor, the campfire when a rest stop comes and the finale's `session_end` as free-action points, which are at least 4 with at least 3 not tied to a trial; and given an unchanged starter sent at the finale's `session_end`, then the story moves on and the send doesn't count as her own action (REQ-6216). Closed by: a day-plan test and a unit test on the finale point.
3. Given an older `player_action` fact with origin `own` or `starter_edited` that the planner's order carried, when the plan leaves it unechoed, then the service rejects the plan, retries, takes the fallback plan and logs `consequence_missed`; given 12 open facts, then the order lists at most 10, those older than the current adventure first and then the newest, and a fact older than 3 adventures closes unechoed (REQ-6202). Closed by: a planner test with a stub Master and a unit test over 12 facts.
4. Given a week of the dialogue book with its sample scenes, when the parent reads it, then each free action of hers that wasn't an unchanged starter shows a consequence in a later scene of the same adventure or the next one (REQ-6202). Closed by: judgement, the parent's at the stage 0.3 acceptance, because whether a scene shows the consequence is a reading and not a count.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Compare the normalised text with the scene's stored starters on the server and ignore any origin the client sends, because a client claim could move the measurement. Register `free_text` version 2 with an upcaster that sets `origin: "own"` and counts `ownWords` for version 1 events. The finale's `session_end` is the own-words point, a choice ADR-0330 records, because every adventure reaches it, a resumed one on a later day included, and no trial ties it.

Store every send at a free-action point as a `player_action` fact with its `origin`, an unchanged starter included, before the Master is called, so a Master failure can't lose it. The echo check covers `own` and `starter_edited` only, as SPC-0330 states after ADR-0360 entries 85 and 86. The change travels only through `remember`, `relation`, `running_joke`, `title` and the planner's beats, so no event schema of the Director gains a field that could change a trial.

## Depends on

- TSK-0952 (blocking): the scene record holds the three stored starters the origin is computed against.

The epic realising ADR-0110 supplies the planner, its checks, retry and fallback, and story memory; until it exists the task runs on a stub planner whose replies the test scripts, and the real planner's prompt stays with that epic.

## Evidence

Not yet.

## Left alone

The Interest section's figures, which TSK-0962 computes from `origin` and `ownWords`, and the interlude, which TSK-0954 adds to the plan.
