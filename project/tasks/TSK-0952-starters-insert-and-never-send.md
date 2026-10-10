---
id: TSK-0952
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6210, REQ-6212, REQ-6214, REQ-6218]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Starters insert into the field and never send, and options that send exist only where the plot offers a choice

After this task, every scene with the free-text field open offers three starters of 3 to 5 words that a tap or the keys 1 to 3 insert without sending, the reply schema carries them as `starters`, and the schema admits `choices`, the options that send on a tap, only on the order kinds `route_choice` and `name_suggest`.

## Acceptance criteria

1. Given a scene with the field open, when she taps a starter on an empty field and on a field that holds text, then its words appear at the cursor with a space before them when the field holds text, nothing is sent, and `starter_inserted` is appended with `via: "tap"` (REQ-6210). Closed by: a component test and a route test.
2. Given an empty field, when she presses 1, 2 or 3 on a physical keyboard, then the matching starter is inserted and not sent; given a field that holds text, then the key types its digit (REQ-6212). Closed by: a component test over the three keys in both states.
3. Given the reply schemas, when a schema admits `choices` on any kind other than `route_choice` and `name_suggest`, then the build fails, and a fixture that does it makes the check fail (REQ-6218). Closed by: a static check with its fixture test. Whether the plot itself offers the choice where `choices` appears is judgement, made by the parent at the stage 0.3 reading of sample scenes, because only a reader can say whether a route, a name or a place to go is a real choice.
4. Given a week of scenes, when the parent reads them, then each scene has a third starter that is strange and funny (REQ-6214). Closed by: judgement, the parent's at the stage 0.3 acceptance, because strange and funny can't be measured by a program; a content test also finds three starters of 3 to 5 words on every library scene with the field open.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the reply's `options` to `starters`, a tuple of three strings present only on a scene with the field open. A library scene carries its own three. «Дальше» stays on every scene and moves the story on while the field is empty. Insertion happens in the client's `StoryInput`, and `starter_inserted` goes through the client's write queue.

The words of the starters are the owner's content, which the parent judges. The scene's stored starters are what TSK-0953 compares a send against, so the scene record keeps all three.

## Depends on

Nothing in this epic. The epic realising ADR-0230 lists the points where the free-text field opens (REQ-5268); until it exists the task opens the field on a stand-in list of scene kinds, and the real list stays with that epic. The epic realising ADR-0150 supplies `StoryInput`.

## Evidence

Not yet.

## Left alone

Which scenes open the field, the name refusal's line, which TSK-0958 builds, and the origin of a send, which TSK-0953 computes.
