---
id: TSK-1111
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0430
closes: [REQ-7112, REQ-7118, REQ-7120, REQ-7128, REQ-7196]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The pipeline passes a candidate pair only after code, the forbidden list, a blind solve and the language check

After this task, each candidate pair of a Russian and a Dutch frame passes five steps in order or is dropped as `probe_text_rejected` with its step, and only a pair that passes all five reaches the candidates file for the parent.

## Acceptance criteria

1. Given a candidate, when step 1 runs, then it is rejected with that step for a missing or repeated placeholder, a digit or numeral word in either frame, a frame over the length limit, a Latin-script token in the Russian frame, a failing `frameMetrics` on the Russian frame, or a pair with 9 marks or a mark that isn't in the Dutch frame (REQ-7196). Closed by: the pipeline test, one fixture for each case.
2. Given a Dutch frame that holds a form from the `nl` section of the forbidden list, when step 2 runs `textGate` with `lang: "nl"`, then it is rejected, and the Russian frame, the cards, the Dutch labels and every marked word pass through the same step with their languages (REQ-7128). Closed by: the pipeline test, two fixtures.
3. Given a candidate, when step 4 fills each frame with three sets of numbers under three seeds and `CHECK_MODEL` solves each filled text blind, then a wrong answer on one of the three sets rejects it, and for a source the model also receives the source's data as a text table (REQ-7118). Closed by: the pipeline test with a stand-in solver that answers wrongly once.
4. Given a candidate, when step 5 runs, then `PROBE_LANGUAGE_MODEL` returns a verdict in a fixed schema on the Dutch frame's grammar and naturalness, the three genre traits (a short everyday context, numbers inside sentences, exactly one question), each mark and any unmarked word a pupil of group 5 to 8 might not know, whether the Russian frame tells the same context, quantities and question, and whether it reads as natural Russian, and the candidate passes only when every item passes (REQ-7112, REQ-7120, REQ-7196). Closed by: the pipeline test, one failing fixture for each item.
5. Given a verdict that fails only on the marks, when the candidate goes back once to `PROBE_TEXT_MODEL` with the notes, then the revised candidate reruns steps 1, 2 and 5, and a second failure drops it (REQ-7196). Closed by: the pipeline test with a stand-in model that fixes the marks on the second try.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the pipeline to `tools/probe/`: each request asks for 5 candidate pairs in a fixed JSON schema, and passing candidates go to `data/probe-candidates.json`, outside the repository, because unreviewed text isn't the project's content. A template at 4 or more approved pairs gets no candidates; otherwise the run fills up to the larger of 5 and one and a half times its shortfall against a target of 4, rounded up, and candidates older than 60 days expire. A pair holds a Russian frame and a Dutch frame with the same context, quantities and question, and up to 8 marks with a card text and a Russian gloss each. The Russian frame stays in the probe's file and never enters the frame library, because a story she had met in a room would make the Russian presentation familiar and the Dutch one new.

The safety check of ADR-0130 step 4 passes both frames, and the Dutch source question passes steps 2, 3 and 5 while its labels pass steps 3 and 5, as ADR-0460 settles.

## Depends on

- TSK-1110 (blocking): it runs under that task's roles and refusals.

The epic realising ADR-0130 supplies the safety check and `frameMetrics` and the epic realising ADR-0040 the generator that fills the frames; the task runs on fixtures of both.

## Evidence

Not yet.

## Left alone

The parent's decision on each candidate, which TSK-1112 builds, and the quality of the model's Dutch beyond what the language check and the parent can see, which only a native reader closes.
