---
id: TSK-0919
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0310
closes: [REQ-6014, REQ-6024, REQ-6026, REQ-6028]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A local parser reads an overview into goals, names its version, and leaves every field the document doesn't show empty

After this task, `src/engine/school/parser/` turns the bytes of a PDF or an image into a parse result on the Mac with `pdftotext`, `pdftoppm` and `tesseract`, every result names the parser version and the file's hash, and a field the document doesn't show is `null`.

## Acceptance criteria

1. Given generated overviews, one PDF with a text layer, one PDF without and one PNG, when the parser reads each, then it returns for each goal the wording, the subdomain, the status, the level from 0 to 5 and the target level, and the three status boxes map to `reached`, `developing` and `needs_help` (REQ-6028). Closed by: a parser test over the three fixtures.
2. Given a fixture that lacks goal codes, open flags, task counts, dates, subdomain shares and the material level, when the parser reads it, then each such field is `null`, a status the parser can't place is `null` and never the nearest one, and the parse completes (REQ-6024, REQ-6026). Closed by: a parser test with the sparse fixture.
3. Given a parse, when its event is built, then it carries the parser version, made of the parser's version, the `tesseract` version and the first 8 hex digits of a hash over the language data files, and the SHA-256 of the file it read; given a changed language data file, then the version string changes (REQ-6014). Closed by: a unit test that changes one data file.
4. Given the parser running with the network blocked and the model gateway stubbed, when it reads a fixture, then it completes and the gateway received no request, and a lint check finds no network call in `src/engine/school/` (REQ-6028). Closed by: a parser test with the network blocked and the lint verb's output.
5. Given a tool that hangs, a document of more than 400 goals and a parse that passes 1 GB, when the parser runs, then each ends as `outcome: failed` with `timeout`, `too_many_goals` and `tool_error` respectively, with no goals and within 120 s for the whole parse (ADR-0310). Closed by: three parser tests with failing tools.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the parser as a pure function of the file's bytes and the parser version. Run `pdftotext -layout` on a PDF with a text layer, and `pdftoppm` at 300 dpi then `tesseract` with Dutch and English data on a PDF without one and on any image. Each tool runs as a child process of the unprivileged container user with no shell, a memory limit of 1 GB set by `prlimit` and a timeout of 120 s for the whole parse. I chose 1 GB, as ADR-0310 did, as about twice what I estimate `tesseract` needs for a full page at 300 dpi, unmeasured, so a normal page passes and a decompression bomb stops. A PDF over 20 pages or a file over 25 MB is refused before the parser runs.

The parser reads the facts RES-4100 confirms and looks for the unconfirmed ones. It writes `null` for whatever the document doesn't show and infers no value, because a guessed status would reach the parent as the school's word. Add poppler-utils, tesseract-ocr, tesseract-ocr-nld and tesseract-ocr-eng to the `meowtower` image, which I estimate at 40 MB and haven't measured.

## Depends on

- TSK-0916 (blocking): the schema of `school_snapshot_parsed` the result fills.
- TSK-0917 (blocking): the generated overviews the tests read.

## Evidence

Not yet.

## Left alone

The import route that shows the parse, which TSK-0920 builds, and the reparse worker, which TSK-0921 builds. Reading a real overview, which waits for the first one.
