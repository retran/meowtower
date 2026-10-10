---
id: TSK-0777
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5106, REQ-5108, REQ-5164]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A template's ladder has one rung for each real step of its graph, grouped into three above three steps

After this task, a template's `hints(p)` returns one rung for each real step of its computation graph, from 1 to 3, a template with more than three real steps groups them into three rungs the author chooses, each rung gives its step without that step's result, and the short solution, every rung and every per-trap explanation take their numbers from the same graph.

## Acceptance criteria

1. Given every template over 1,000 seeds, when `hints(p)` is read, then it returns 1 to 3 rungs, no two identical, and the count equals the graph's real steps up to 3 (REQ-5106). Closed by: the template test over 1,000 seeds.
2. Given a template with more than three real steps, when it is built, then it declares a grouping into three rungs and the build fails without one; given one with three, the last rung stops before the last calculation (REQ-5164, REQ-5106). Closed by: a build check and a fixture template.
3. Given a template whose rung names a number its graph doesn't hold, or whose rung's step differs from the short solution's, when the structural check runs, then it fails (REQ-5108). Closed by: the structural check's test with two fixture templates.
4. Given the stand-in hints in `src/server/standin.ts`, when they are replaced, then each stand-in template has the rungs of its real steps and every existing route test passes (REQ-5106). Closed by: the test verb's report.
5. Given the stage 0.1 templates, when the parent reads each template's rungs at the stage acceptance, then the parent judges each rung to be a real step and none to be written to make up the count (REQ-5106). Closed by: the parent's judgement, because whether a rung teaches a step is a reading of the text and no program decides it.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the template contract of ADR-0040 so `hints(p)` returns 1 to 3 rungs, one for each node of the graph that ADR-0040 already builds, with each rung giving its step without that step's result. ADR-0080's rule that writes rung 2 as an operation and rung 3 as a method on a short template goes, because it is the invented rung REQ-5106 forbids. ADR-0360 words the rung rule: rung k gives real step k without its result, and no rung gives the result of the last calculation.

Add the build check for the grouping above three steps. Have the short solution, each rung and each trap's explanation fill their numbers from one graph, so a rung can't carry a step or number the solution doesn't.

## Depends on

- TSK-0772 (not blocking): the payload fields the ladder length is logged in; this task's tests read the template alone.

The epic realising ADR-0040 supplies the template contract and the computation graph; this task changes the contract and the stage 0.1 templates in place.

## Evidence

Not yet.

Criterion 5 rests on judgement: whether a rung is a real step is a reading of its text.

## Left alone

The basic fact's strategy rung, which TSK-0778 holds, and the check that rungs 1 and 2 never state the answer, which TSK-0780 holds.
