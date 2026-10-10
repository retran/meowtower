---
id: TSK-0824
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0250
closes: [REQ-5406, REQ-5414, REQ-5472]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every T1 to T4 problem sends four "what's missing" options in its packet, built by one rule for both kinds

After this task, the task packet of every T1 to T4 word problem holds exactly 4 options and `allowInsufficient: true` inside `InputSpec`, built by one option builder, so the server sends nothing before the answer that tells an unanswerable problem from a solvable one.

## Acceptance criteria

1. Given 1,000 seeds for each tier and answer form, when an unanswerable and a solvable problem are compared, then `ItemViewOut` and `InputSpec` have the same fields, the same phases and 4 options each, `allowInsufficient` is true on both, and the step count equals the complete graph's (REQ-5406, REQ-5414). Closed by: the packet test's report.
2. Given 1,000 seeds per tier, when the composition test counts, for each kind of option (intermediate, asked, story quantity, with the withheld given counted as a story quantity), how often it appears on each kind of problem, then every count agrees between the kinds within 5 percentage points and the asked quantity is in every set. Closed by: the composition test's report.
3. Given 10,000 seeds of every unanswerable template, when the template test runs, then one option names the withheld given (REQ-5472), and no option on any problem names a quantity the text states. Closed by: the template test's report.
4. Given a frame that declares fewer than 3 story quantities, when the build's frame check runs, then it fails with `frame_short_of_quantities`; given a frame with 3 or more, the builder's slot 1 is the asked quantity, slot 2 is the withheld given or a declared story quantity, and slots 3 and 4 are drawn from one pool, shuffled by the seeded stream. Closed by: a build test with one failing and one passing frame.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the option builder to the generator and the options to `InputSpec`, as ADR-0250 amends ADR-0040, with the server mapping each position to its quantity. Send the options in the packet and not in a reply after the press, because a reply adds a round trip the offline queue can't serve.

Add the story-quantity declaration to the T frame contract, and re-author the fixture T frames with at least 3 short noun-phrase quantities each. A story quantity must be one the story could state as a number, so a withheld given and a story quantity read alike.

## Depends on

- TSK-0823 (blocking): the builder reads the withheld given and the complete graph this task builds.

The epic realising ADR-0130 owns the frame check; this task adds the check's rule and `frame_short_of_quantities` to it, and the real frames' re-authoring is that epic's work. A fixture frame stands in until then.

## Evidence

Not yet.

## Left alone

The controls that show the options, which TSK-0825 builds; the label strings, which ADR-0160 owns; and the real T frames.
