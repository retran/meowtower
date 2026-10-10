---
id: TSK-1083
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0410
closes: [REQ-6954, REQ-6956]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A side slot takes the subtype, format and context she has already met

After this task, a warm-up, a twin, a retention check, a Dutch probe presentation, a task with a non-empty `forms` and a task on a live frame take a subtype, a format and a context already shown to her whenever one fits, so none of them spends a first encounter.

## Acceptance criteria

1. Given a log where subtypes S1 is shown and S2 is not, when the Director fills a warm-up, then it chooses S1 whenever S1 fits the slot (REQ-6954). Closed by: a Director test with fixture logs.
2. Given a subtype shown only in its bare format, when a side slot is filled, then the item builder takes the bare template; given both formats shown, then either (REQ-6954). Closed by: an item builder test.
3. Given a subtype with one shown and one unshown context, when a side slot is filled, then the frame carries the shown context, and never a context the hold keeps back (REQ-6956). Closed by: a picker test.
4. Given an empty log, when the first warm-up of her first adventure is filled, then it takes a new subtype, format and context, because nothing shown fits (REQ-6954, REQ-6956). Closed by: a Director test on a fresh fixture log.
5. Given a block top-up on a subtype that has no shown context, when the Director fills it, then it takes a library frame, which the log can tag, and a live frame request for a top-up names a context already shown on the subtype. Closed by: a live queue test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Mark the side slots in the Director's plan: a warm-up, a twin, a retention check, a Dutch probe presentation, a task with a non-empty `forms` and a task on a live frame. For a side slot the Director chooses a subtype already shown whenever one fits, the item builder a format already shown on it, and the picker's step 3 a context already shown. The hold ranks above this fallback, so a held context is never shown in a side slot. Live frames serve only ADR-0130's block top-up slots, and a block top-up that takes a library frame is no side slot, which keeps its first encounter eligible, as ADR-0460 settles.

## Depends on

- TSK-1080 (blocking): step 3 of the picker is this rule, and the used sets come from that task.

The epic realising ADR-0400 supplies the retention check and the epic realising ADR-0430 the Dutch probe presentation; each marks its slot with the flag this task adds. Until they exist the tests use the slots that exist: warm-up, twin, `forms` and live frame.

## Evidence

Not yet.

## Left alone

The projection's marking of these shows as used with the reason `side_slot`, which TSK-1085 sets.
