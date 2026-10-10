---
id: TSK-0629
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3620, REQ-3622, REQ-3624]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The author request carries the problem's structure and asks for five variants, and a reply outside the schema is discarded whole

After this task, `buildFrameRequest` makes the request for a frame from a structural specification, with no player text in it, and `parseFrameReply` accepts only an array of five frame objects.

## Acceptance criteria

1. Given a problem of k = 3 steps with the roles of its number placeholders, a floor and two characters, when the request is built, then it holds the solution graph's steps, the role of each placeholder, the floor, the characters, and the limits of at most 4 sentences of at most 14 words with the question as its own last sentence (REQ-3620). Closed by: a golden test of the built request.
2. Given a scene whose familiar carries a name the player chose, when the request is built, then the request holds the placeholder `{familiar}` or the canon name and none of the player's text (REQ-3620). Closed by: a unit test that searches the built request for the chosen name.
3. Given any request, when it is built, then it asks for 5 variants and for plain text with no joke (REQ-3622). Closed by: the same golden test.
4. Given replies with 4 objects, with 6, with a string, and with an object that lacks `text`, when `parseFrameReply` reads each, then each is rejected as a whole with the step number 2 and none yields a frame, and a reply of 5 well-formed objects yields 5 candidates (REQ-3624). Closed by: a unit test with the four failing replies and one passing.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write `src/frames/request.ts` and the fixed reply schema as a zod object. The vocabulary limits are the readability measures of the epic realising ADR-0040, passed in as numbers. The request holds the structure id and the context the caller names, and nothing from the player's profile. The call itself goes through the gateway in TSK-0633; this task builds the request and reads the reply and calls nothing.

## Depends on

- TSK-0628 (blocking): the roles of the number placeholders and the frame record come from the frame module.

The epic realising ADR-0040 supplies the solution graph and the readability numbers; until it lands, the specification is built from fixture graphs.

## Evidence

Not yet.

## Left alone

Which model answers, which belongs to the gateway of the epic realising ADR-0100, and the safety question, which TSK-0631 asks.
