---
id: TSK-0545
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-1104, REQ-1106, REQ-1108, REQ-1110]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The fatigue signal fires from answer time alone, offers a rest stop and halves the weight of later attempts

After this task, the Director raises the fatigue signal when and only when the median answer time at a control-fact point exceeds 1,5 times the median at the adventure's opening point, whatever the accuracy, offers the story a rest stop, and gives each later first attempt of the session a weight of 0,5 that never makes a block "not mastered".

## Acceptance criteria

1. Given a fixture where the closing pair's median is 1,51 times the opening pair's, when the signal is tested, then it fires; given 1,49, then it doesn't, whatever the accuracy of either pair (REQ-1104). Closed by: a unit test for each ratio and for two accuracies.
2. Given the points, the opening pair, the closing pair and each extension's pair, when their times are read, then background, pause, eye-exercise and rest-stop time are left out of them. Closed by: a unit test.
3. Given a fired signal, when the Director's output is read, then the story gets a rest-stop offer once (REQ-1106). Closed by: a unit test that records the offer; until the epic realising ADR-0090 exists the offer goes to a stub that logs it.
4. Given a fired signal, when later first attempts of that session are read, then each carries weight 0,5 until the session ends and the next session's start at 1 (REQ-1108). Closed by: a unit test over two sessions.
5. Given a full block of 5 holding attempts after the signal that would score "not mastered" with them and a higher state without them, when the state is read, then it isn't "not mastered" and the node stays "being clarified" (REQ-1110). Closed by: a unit test through the rule engine of the epic realising ADR-0060.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the fatigue test to `src/engine/director/guards.ts`, run at each control-fact point. The weight lasts until the session ends, the default the requirements step chose. The model applies the weight and the block guard; this task writes the mark and the rule where the block's state is decided, in `src/engine/states/` as ADR-0070 requires of ADR-0060, and criterion 5 can run only after the rule engine of the epic realising ADR-0060 exists.

## Depends on

- TSK-0539 (blocking): the control facts the points are made of.
- The epic realising ADR-0060 supplies the rule engine criterion 5 runs through.
- The epic realising ADR-0090 supplies the rest stop's scene.

## Evidence

Not yet.

## Left alone

The rest stop's scene and the anxiety signal's cap on the frontier share, which ADR-0090's epic builds, and the fatigue weight of the observation, which the epic realising ADR-0060 reads.
