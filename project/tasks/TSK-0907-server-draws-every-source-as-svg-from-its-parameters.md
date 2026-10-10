---
id: TSK-0907
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5934]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server draws every table, chart, timetable and map as SVG from the task's parameters, and the payload names no correct region

After this task, `src/render/source/` draws the four kinds of source from a track task's parameters alone, labels come from the string file, and the payload sent before the first attempt holds no `id` or `class` that names the correct region, a trap or the template.

## Acceptance criteria

1. Given the parameters of a table, a chart, a timetable and a map, when the renderer runs on each twice, then it returns an SVG each time and the two outputs of one input are byte-identical (REQ-5934). Closed by: a snapshot test over the four kinds.
2. Given one set of parameters and two string files, when the source is drawn with each, then the shapes and positions are the same and only the labels differ (REQ-5934). Closed by: a render test with the Russian file and a fixture file.
3. Given 1,000 track tasks, when each payload is built before the first attempt, then no SVG `id` or `class` names the correct region, a trap or the template, no correct region is sent, and regions are indices in reading order, left to right and top to bottom (ADR-0300). Closed by: a payload test.
4. Given parameters that make the renderer throw, when the server builds the next task, then it draws the next seed, logs `source_render_failed` and the verify run counts it (ADR-0300). Closed by: a route test with a failing fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/render/source/` with one drawing function for each kind, run only on the server, and import only the template's parameter types and `src/shared/`. Draw at a scale of 1, so a CSS pixel in the SVG is a CSS pixel on screen at zoom 1. The renderer strips every SVG `id` and `class` that names the correct region, a trap or the template, as ADR-0040 already requires for nodes and templates, and it reads each label through `t()` from `source.label.*`.

The client receives the finished SVG in the view and imports nothing from `src/render/source/`. The map's squares and the table's cells are regions, a bar of a chart is a region, and a point of a line chart isn't, because a point isn't one tap on a drawn source.

## Depends on

- TSK-0905 (blocking): the parameter types the renderer reads.

## Evidence

Not yet.

## Left alone

The component that shows the SVG and handles taps and gestures, which TSK-0910 and TSK-0911 build. The rule that SVG text takes its size from a class, which TSK-0910 checks.
