---
id: TSK-0790
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0230
closes: [REQ-5236, REQ-5238, REQ-5260, REQ-5262]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every riddle runs one compose flow on the server, with one correction, an unassisted attempt and no twin

After this task, the server runs a state machine for each riddle, the same for both forms and whether or not it is scored, with the states `compose_open`, `compose_checking`, `compose_paraphrase`, `compose_correcting`, `compose_review` and `compose_closed`, at most one correction, a correction that counts as unassisted, `unparsed` for a rejected or failed correction, and no twin riddle.

## Acceptance criteria

1. Given a text riddle driven through yes, through no then yes, through no then no and through a failed correction parse, when the states are logged, then they follow the six states with at most one correction, and the last two end `unparsed` with base experience and no observation (REQ-5236). Closed by: a state-machine test.
2. Given a corrected riddle, when its attempt is read, then it is unassisted, because the paraphrase says what the parser read and nothing about the target (REQ-5238). Closed by: the state-machine test.
3. Given a card riddle driven through each verdict, when the states are logged, then it goes from `compose_open` to `compose_review` with no paraphrase and the same states as a text riddle's from review on (REQ-5260). Closed by: the state-machine test.
4. Given a riddle that gets `wrong_structure`, when its review ends, then no twin riddle follows and the day's cap isn't spent twice (REQ-5262). Closed by: the state-machine test.
5. Given a riddle whose purpose is scored and one whose purpose isn't, when the packets are read, then the flow's states and replies are identical (REQ-5260). Closed by: a packet test that compares the two logs.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the state machine to the server's play routes as its own flow, because ADR-0080's attempt flow has a correct answer to reveal, hint rungs and a twin, and a riddle has none of the three. One flow for every riddle keeps REQ-2428's reason: the client can't tell a counted riddle from another.

«Не знаю» (I don't know) in either form closes the riddle with the short review, an empty verdict and no count in the stream; I chose this in ADR-0230 because it is her answer and not a parser's failure. The short review is one example riddle the engine builds from the target's template frame and numbers, in the familiar's voice, with no word of error. For `match` the review opens on a tap, as after `clean` in ADR-0080.

## Depends on

- TSK-0788 (blocking): the verdicts the review shows.
- TSK-0789 (blocking): the card form's inputs.

The parser's reply and the paraphrase come from the reply-check task; until it lands, a stand-in parse returns a fixed graph so the states can be driven.

## Evidence

Not yet.

## Left alone

The rewards for each verdict, which ADR-0140 owns, and the thread button, which stays visible and inactive because a riddle has no rung to buy.
