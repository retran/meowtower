---
id: TSK-0955
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6232, REQ-6233]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# No line of an adventure's first scene misses her, waits for her or asks where she was

After this task, every line of the first scene of every adventure, from the Master, the pool or the library, passes a check against `content/return-phrases.ru.json`, and the scene order has no field through which the Master could learn that she was away.

## Acceptance criteria

1. Given a Master reply for a first scene that holds a phrase from the list in any written-out form, when the checks run, then the reply is refused, takes the retry and then the library path, and `return_line_refused` is logged (REQ-6233). Closed by: a test with scripted Master replies.
2. Given a pool or library line of a first scene that holds a listed phrase, when the build runs, then it fails (REQ-6232, REQ-6233). Closed by: a content test with a planted line.
3. Given a scene order, when its schema is read, then it has no field for a date, a gap or a count of days, and given first scenes after gaps of 0, 1, 3 and 14 game days, then none holds a listed phrase (REQ-6232). Closed by: a schema test and a simulation test over the four gaps.
4. Given the list, when the parent reads it at the stage 0.3 acceptance, then the parent approves each phrase (REQ-6233). Closed by: judgement, the parent's, because which phrases miss a child is the parent's call and no program can say it.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the loader for `content/return-phrases.ru.json` with every inflected form written out, as ADR-0160 requires of a content file, and run the check on every adventure's first scene. Applying it to every first scene covers each scene after a gap and needs no rule to find the gap (a choice ADR-0330 records). The canon gains the rule that no character misses her, waits for her or asks about her absence; the garland of ADR-0140 stays as it is, because it never counts days.

The owner writes the list; the family adds a phrase through a commit the parent approves. A content file, not a Parent Room editor, because the list changes a few times a year.

## Depends on

Nothing in this epic. The epic realising ADR-0110 supplies the retry and library path and the scene pool; until it exists the task runs on a stub that scripts a reply and a library of fixture lines. The epic realising ADR-0160 supplies the content file loader and the rule on written-out forms.

## Evidence

Not yet.

## Left alone

The wording of the phrase list, which the owner writes, and every scene after the first, which the check doesn't read.
