---
id: TSK-0914
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5930]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Templates for I1 to I4 ask at four levels, each in a story scene with a frame the parent accepted

After this task, `src/templates/sources/` holds templates for tables, charts, timetables and maps at the four question levels, every question text comes from an accepted frame under `source.<node>.<level>`, and the build refuses a template with no such frame.

## Acceptance criteria

1. Given each of I1 to I4, when the build lists its templates, then each node has a template for each of the four levels, and a fixture template that asks a level with no accepted frame fails the build (REQ-5930). Closed by: the build check's test and its output.
2. Given a fixture frame that sets no story scene, when the parent reviews it, then it stays out of the frame library, and no track task is built from the live queue (REQ-5930). Closed by: a library test, and the parent's judgement that each frame sets its question in a story scene, because a program can't tell a scene from a bare question.
3. Given each template and 10,000 seeds, when the property test of the source rules runs, then it finds zero tasks with two correct answers or regions, zero question texts that hold the answer or an intermediate step result, zero `solve()` results with an empty reader, zero sources without unused data and zero neighbours closer than the gap (ADR-0300). Closed by: the property test's report.
4. Given each template, when generation is timed over 10,000 seeds with the source's parameters included, then the 95th percentile is at most 50 ms (ADR-0300). Closed by: the verification run's output.
5. Given a template that asks for a choice, when its answer is read, then the answer is a label of the source in a compare or combine question, and a duration is a whole number of minutes beside its unit (ADR-0300). Closed by: the answer-kind check's test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the templates for I1 tables and I2 charts, which sit in S, I3 timetables, which sit in M, and I4 maps, which sit in G, each with a generator that meets the unused-data and neighbour rules, a reference solver and its traps from the seven. Write the frames offline into `frames.ru.json` under `source.<node>.<level>` and the labels under `source.label.*` in `content/i18n/ru.json`. I estimate about 60 frames at 3 for each level; the parent accepts them once into the frame library of ADR-0130, which is not a recurring queue.

A track frame never comes from the live queue, because ADR-0130's blind solve reads only text and can't see a drawn source.

## Depends on

- TSK-0905 (blocking): the contract the templates follow.
- TSK-0906 (blocking): the rules and the property test they must pass.
- TSK-0907 (blocking): the renderer that draws each kind.
- TSK-0908 (blocking): the answer kinds a template asks for.
- TSK-0909 (blocking): the traps a template names.

The epic realising ADR-0130 supplies the frame library and its acceptance by the parent.

## Evidence

Not yet.

## Left alone

The templates for I5, which TSK-0915 writes on top of these. The Dutch bridge's keywords in about a fifth of track tasks, which ADR-0210 adds through the label keys.
