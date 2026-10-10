---
id: TSK-1080
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0410
closes: [REQ-6926, REQ-6928, REQ-6982]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The frame picker keeps one unshown context back until the node is fluent and repeats the oldest frame instead

After this task, the used sets are folded from the log, and the picker chooses a library frame in ADR-0410's four steps, so the last unshown context of a subtype stays unshown until its node is fluent by a tested result.

## Acceptance criteria

1. Given a fixture log of shows, when the used sets are folded, then they hold the used subtypes, the used subtype-and-format pairs and the used subtype-and-context pairs, reading each context from the `frame_accepted` of the show's frame, and they give the same sets under any model version. Closed by: a unit test.
2. Given a subtype with at least 2 contexts that have an accepted frame, exactly one of them unshown and its node not fluent by a tested result, when the picker chooses 20 frames, then none is of the unshown context (REQ-6926); given 2 contexts both unshown, then both are shown until one has been shown, and then the other is held. Closed by: the picker test on a structure with 5 frames in 2 contexts.
3. Given a structure with an unshown frame outside the hold and a frame shown 3 days ago, when the picker chooses, then it takes the unshown frame; given every unshown frame held and every other frame shown in the last 14 days, then it takes the frame shown longest ago among those not held and `item_shown` carries `frameRepeat: true` (REQ-6928, REQ-6982). Closed by: the picker test, two fixtures.
4. Given the node reaches fluent by a probe or a full block, when the picker next chooses, then the held context is allowed; given the node holds only an inferred fluent, then the context stays held; and a hold released once never returns for that subtype (REQ-6926). Closed by: the picker test with fixture states.
5. Given steps 1 and 2 leave no frame for a template, when the item builder asks, then it takes another template of the subtype, then a bare template, then the Director takes another subtype, and the server counts `transfer_hold_no_frame`. Closed by: a test that removes the frames of one context.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the fold of used subtypes, subtype-and-format pairs and subtype-and-context pairs to the server, and replace ADR-0130's picker with ADR-0410's order: the accepted frames of the structure and locale, minus the contexts the hold keeps back, minus (in a side slot) contexts not shown on the subtype unless that leaves none, then a never-shown frame first and the least recently shown after it, ties broken by the task's seed. The hold outranks the repeat rule. A subtype's contexts are the union of the `contexts` of its context templates that have an accepted frame of the template's structure. The hold has no time cap, and `transfer_hold_long` after 120 game days reports once in `./meowtower status`.

Read the node's state through one function, `testedState(node)`. A fixture implements it until the epic realising ADR-0060 supplies the real states. Before the knowledge model exists no node is fluent, so the context hold keeps its context, as ADR-0410 states.

## Depends on

- TSK-1078 (blocking): the picker reads each frame's context from its acceptance.

The epic realising ADR-0060 supplies the tested states and the epic realising ADR-0130 the frame library; this task runs on fixtures of both.

## Evidence

Not yet.

## Left alone

The format hold, which TSK-1081 builds, the side-slot choice of subtype and format, which TSK-1083 builds, and `why`, which TSK-1082 sets. The step 3 of the picker is wired here with the slot flag TSK-1083 sets.
