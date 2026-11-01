---
id: ADR-3250
artifact: adr
status: approved
revised: 2026-11-01
addresses: [REQ-8116, REQ-8118, REQ-8120, REQ-8122, REQ-8124, REQ-8126, REQ-8128, REQ-8130, REQ-8132, REQ-8134, REQ-8136, REQ-8138, REQ-8140, REQ-8142, REQ-8144, REQ-8146, REQ-8148, REQ-8150]
supersedes: []
concerns: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3250. The Parent Room opens on a front page of what changed and what to do, built from rules, with the report behind it

## Decision

The Parent Room opens on a page in seven blocks: this week; since you last looked; do this week; against the goals; abilities by floor; in the story; the owner's line. A pure function `src/report/front.ts` builds each line from a named rule over the log and projections, in the parent's language from per-language files, with no model. Each line links to the screen that proves it. The page reads levels, rank and falls of ADR-3220, gates of ADR-3230 and the story of ADR-3240, and a block with no data yet shows what it waits for.

A change stays until seen: `front_page_seen` records the last change seen. A rule table gives actions of a fixed list, at most 3 a week, none a drill. It compares her only with her own past and the Dutch goals. Certainty appears in words, and the exact intervals stay on the node card. Figures of play, spend and both audits move to a tab «Служебное» (Service).

Once accepted, nothing runs yet. After the plan, the parent opens the page and acts from it, and blocks fill as the other decisions land. The report stays as it is.

## Why

RES-4313 found that the data exists and that nothing states what changed or what to do, that information helps when it leads to an action, and that a parent's manner matters more than the amount. Rules keep every claim checkable, which a model's summary wouldn't.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing | No work | A parent must read nine screens to learn one change |
| Enlarge the report's Summary | One place | It is a measured screen with its own rules, and it carries no actions |
| A model writes a weekly letter | Warm prose | A claim can't be traced to a rule, and pupil data would need to leave the Mac |
| Weekly email | Reaches the parent | Sends her data off the Mac, which the privacy rules limit |

## What it costs

A rule table and three languages of lines to write and keep true. The parent sees less at a glance than exists, though each detail is one click below. An action rule can be wrong for a given week.

## What would reverse it

- In the first month the parent takes no proposed action: the actions change first.
- The parent keeps opening the report first: the page's order changes.

## Consequences

- SPC-0180 gains the page, and the audits move.
- The Parent Room's tabs gain «Служебное».
- `front_page_seen` joins the events.

## How I will know it was realised

1. A Playwright test finds all seven blocks with an empty log and with a full one.
2. A test seeds a fall, finds it on the page calmly, marks it seen and finds it gone from the list.
3. A static check finds every line's rule named and no model call in the module.
4. A test finds at most 3 actions in any week across simulated logs and none outside the list.
5. A scan finds no error bar on the page and no comparison with other children.

## What this does not settle

- Sending anything off the Mac.
- Parent mark storage, which ADR-3240 owns.
- Premortem: the parent reads a fall and presses her anyway. Words help, and nothing prevents it.

Amended by ADR-3280, approved on 2026-11-01: the owner's line also counts scenarios waiting, and the page notifies when none is approved.

## Plan

1. The page's frame, tab move and seen marker (REQ-8116, REQ-8122, REQ-8148, REQ-8146).
2. Blocks of the week, changes and goals (REQ-8118, REQ-8120, REQ-8128, REQ-8130, REQ-8136, REQ-8138).
3. Actions (REQ-8124, REQ-8126, REQ-8150).
4. Abilities, story and owner's line, with rule and link checks (REQ-8132, REQ-8134, REQ-8140, REQ-8142, REQ-8144).
