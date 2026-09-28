---
id: RES-4100
artifact: research
status: approved
revised: 2026-09-28
elaborates: [RES-2300, RES-2200, RES-2600]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Snapshots of the school's pupil overview fit the event log as immutable files and parsed events, once the blob store, the event catalogue and the report's screen list are amended, goals map to nodes through an offline catalogue on the Mac and the school's percentile levels are kept apart from home mastery

## Summary

The owner's addendum of 2026-09-28 adds, after the MVP, snapshots of the pupil overview from the school's learning system: each file is kept by its hash and never changed, parsed into events that carry the parser's version, and corrected only by new events. Those events feed a derived view of changes between snapshots, a "home and school" report, a timeline beside the Cito results and the home skill scale, and an export for the school. That design fits ADR-0020's log, but three approved records say otherwise today, and a fourth rules out the addendum's model for goal wording. The blob store takes only draft-pad WebP images up to 512 KB (ADR-0020, SPC-0020). The rule on what may leave the Mac names four kinds of data, and school goal wording isn't one of them (RES-2600 conclusion 12, ADR-0100), so goals map to nodes through an offline catalogue on the Mac and no `GOALS_MODEL` role is added. Report v1 and ADR-0180 fix eight screens and one export of the whole log. ADR-0060 reads the whole log with no rule that keeps school events out of the model. The vendor's own documents show that the per-goal "vaardigheid" is a national percentile turned into levels 0 to 5, and that the streefniveau can follow that level automatically each month. So a school status of "target reached" isn't evidence of mastery in the home sense, and the report must never put the two on one scale. A parent gets the data through the school, which is the controller; a GDPR access request under Article 15 yields a copy in "a commonly used electronic form", but not a structured export, so the parser must expect a PDF, a print or a screenshot. The six questions this record raised for the owner were decided on 2026-09-28: the events are named `school_snapshot_*`, the parser takes PDFs and images on the Mac, school links don't feed the Director, the school export holds only school data, and a wrong snapshot is withdrawn, not erased. This record doesn't cover the addendum's MVP items, including the Cito result form and the school goals of item 8, except where section 10 reuses them.

The reader is evaluating the design: the owner and the decision step that follows.

## The question

How should the game take in what the school's learning system (Snappet in the owner's case) reports about the player, keep it, compare it with what the game measures at home, and show it to the parent, without letting it change the knowledge model? The owner's addendum answers most of this and places it after the MVP. Research has to find which approved records it contradicts and what the vendor's reports really contain.

The addendum assumes that the school's per-goal status and skill level measure the same thing as the home node states, so that a "home and school" report can list discrepancies between them. That assumption is weaker than it looks. The school's level compares the pupil with other pupils nationally, and its status compares her with a personal target that the system may move each month. The home states are rules over her own counted answers (ADR-0060, ADR-0180). A goal can be "target reached" at school and "not mastered" at home with neither being wrong, so a discrepancy is a difference between two measures before it is a signal about her. The findings on the school's scale test this.

The addendum also assumes a parent can obtain the overview as a file a parser can read. The findings on access test that too.

## Method

On 2026-09-28 I read section 10 of the owner's addendum 1 to the specification, with its general rules, its event list, its model table and its order of work, and item 8 where section 10 reuses it (`GOALS_MODEL`, the Cito result form, the home skill scale). I searched the approved record with `paw find` for the vendor's name, "school goals", "blob store", "leave the Mac", "import", "external" and "cito". The vendor's name, "import" and "cito" match nothing. I read ADR-0020, SPC-0020, ADR-0100's roles, request classes and tiers, ADR-0180, RES-2600, the approved requirements on what leaves the Mac, the report's screens, the PDF snapshot, the Mac-only export, the recompute and the draft-pad image, the conclusions of RES-2200 and RES-2300, the table rows on `blobs` in RES-2550, the inputs of ADR-0060, the value formula in ADR-0070 and the backlog list in RES-3000.

On the web on 2026-09-28 I read the vendor's information letter to parents about its report (a PDF), two of its solution pages on the pupil overview and on levels, its help article on the streefniveau, its privacy statement, a Dutch parents' knowledge base on access to the pupil file, and Articles 15 and 20 of the GDPR.

I couldn't obtain a real pupil overview or any sample of one. So I couldn't confirm the file format a school hands out, whether the document carries a date, or whether it shows the share of material mastered per subdomain, the number of tasks per goal or whether a goal is open. The vendor's pages I read don't describe them, and the findings mark each as unconfirmed. I didn't read the vendor's teacher dashboard, which needs a school login, or the student manual, which the fetch tool returned only as binary.

## Findings

### The vendor's report to parents shows a national comparison, a personal target, growth and subdomain averages

The vendor's information letter to parents about its report, read 2026-09-28, lists these parts. The current skill compares the child with other pupils: «De vaardigheid van uw kind geeft aan hoe hij of zij scoort op het vak, vergeleken met andere kinderen in Nederland [...]» Levels run from 1 to 5 in bands of 20 %, from «Niveau 1 (0-19%) Ver onder gemiddeld» to «Niveau 5 (80-100%) Ver boven gemiddeld», and level 0 means «Niet gestart of niet genoeg opgaven gemaakt». The target level is the expected level at the end of the school year: «Het streefniveau toont het verwachte niveau van uw kind aan het einde van het schooljaar.» Growth is compared with the national average. A growth chart draws her past development, her current skill, her expected development, her target, and a 1F line and a 1S line. Per subdomain the parent sees «de gemiddelde vaardigheid van alle leerdoelen die bij dat subdomein horen».

### The per-goal level is a percentile score turned into a level from 0 to 5

The vendor's page on levels, read 2026-09-28, says: «De huidige vaardigheid van een leerdoel van de leerling wordt nu weergegeven in niveaus (0 t/m 5)», and «De vaardigheid is een percentielscore die is vertaald naar een niveau.» So a per-goal level places her among other pupils. It doesn't say which tasks of the goal she can do, which is what a home node state says (ADR-0060).

### Each goal carries one of three statuses relative to her target, grouped under subdomains

The vendor's page on the pupil overview, read 2026-09-28, names the three statuses: «De drie leerdoelstatusbakjes (Groei richting streefniveau, Streefniveau behaald en Hulp nodig)». It says «De leerdoelen zijn onderverdeeld in subdomeinen» and that «Elk subdomein kan opengeklapt worden om de onderliggende leerdoelen met hun niveau en status» be seen, with a choice between «Niveau» and «Status». These match the addendum's three statuses (reached, developing, needs help), and the words show that "reached" means reaching the streefniveau, not mastering the goal.

### The target level can move each month by the vendor's rule

The vendor's help article on the streefniveau, read 2026-09-28, offers a switch «Streefniveau automatisch bijwerken», under which the system sets «het streefniveau elke maand automatisch aan op basis van de huidige vaardigheid van de leerling». It advises setting the target «op of net boven (maximaal 5%) de huidige vaardigheid». A change of target or status between two snapshots can therefore come from this rule or from a teacher's setting, and not from anything she learned.

### Several fields the addendum extracts are unconfirmed

The addendum extracts, per goal, a code, the wording, the subdomain, whether it is open, the status, the skill, the target, the number of tasks and dates, and per snapshot the share mastered per subdomain and the level of the material. The pages I read confirm the wording's grouping under subdomains, the status, the skill level and the target. Goal codes, whether a goal is open, the number of tasks, dates on the document, the share mastered per subdomain and the level of the material are unconfirmed on 2026-09-28. The addendum already says a missing field stays empty.

### The school is the controller, and the vendor sends rights requests to the school

The vendor's privacy statement, read 2026-09-28, says «De Onderwijsinstelling is de Verwerkingsverantwoordelijke» and that a person who wants to use a right such as access «dient u zich rechtstreeks te richten tot de Onderwijsinstelling». The vendor, as processor, «is niet toegestaan om zelfstandig dergelijke verzoeken of klachten af te handelen». So the parent gets the overview from the school, as the addendum says, and never from the vendor.

### Parents act for a child under 16 and may get a copy of the whole file, within a month and in principle free

The Dutch knowledge base Ouders & Onderwijs, read 2026-09-28, says «Voor kinderen onder de 16 jaar treden ouders op als wettelijk vertegenwoordiger», «Ouders hebben naast inzage ook recht op een kopie van het gehele dossier», and that a school in principle charges nothing for a copy. The deadline is a month, extendable once for a complicated request. The page doesn't say whether data held in a digital learning system counts as part of the pupil file; it speaks of «alle persoonsgegevens die door de school worden verwerkt». Whether a request reaches the learning system's data is unconfirmed.

### An access request yields a copy in a common electronic form, not a structured export

Article 15(3) of the GDPR, read 2026-09-28, says: "The controller shall provide a copy of the personal data undergoing processing", and where the request is made electronically, "the information shall be provided in a commonly used electronic form". A PDF meets that. Article 20, the right to data portability in a machine-readable format, applies only where processing rests on consent or a contract, and "shall not apply to processing necessary for the performance of a task carried out in the public interest". Whether a given school rests its processing of pupil data on a public task is unconfirmed, but if it does, the parent has no right to a structured file. The parser has to expect a PDF, a print photographed or scanned, or a screenshot, in a layout the vendor can change.

### ADR-0020 and SPC-0020 fix the blob store to draft-pad WebP images up to 512 KB

ADR-0020 writes each draft-pad image to `data/blobs/<sha256>.webp` with exclusive create and refuses an image over 512 KB. SPC-0020's boundary describes `blobs` as "One row per stored image" and the file path as "Draft-pad images, one file per hash, written once". RES-2550's table lists `blobs` as "file metadata by hash (scratchpad snapshots)". A snapshot is a PDF or a photo of unknown size, so the store as approved refuses it. The store's guarantees are the ones the addendum wants: exclusive create, a hash for a name, and triggers on the `sha256` column that reject change and removal.

### ADR-0020's catalogue and scope don't hold school events, and the log can't erase anything

ADR-0020 calls `events` "the only record of what happened in play", and its event catalogue, which it says is "the one list of type names", has no `snappet_snapshot_imported`, `snappet_snapshot_parsed` or `snappet_record_corrected`. A new type joins the catalogue "in the same change as its schema". ADR-0020 also records that "nothing can be erased" and lists erasing a fact as a decision it doesn't make. A snapshot holds personal data about the player that her school sent. If the school sends the wrong pupil's overview and the parent imports it, the append-only log and the write-once blob store keep another child's school record for good, with no path to remove it.

### A model that reads the snapshot would send her school record off the Mac, which the approved rule on what leaves the Mac forbids

The approved record lets only four kinds of data leave the Mac, as ADR-0100's request classes carry them: content made without the player, her cleaned story material, the age the parent set and the one-task explanation request. A parser that hands the file to a vision or text model sends her levels, statuses and, on most documents, her name and school, which none of the four kinds covers. RES-2600 conclusion 1 and ADR-0100's request classes say the same for reports. So the parser has to run on the Mac, which fits the addendum's "parser version": a versioned, local program.

### `GOALS_MODEL` sends goal wording, a fifth kind that RES-2600 and ADR-0100 don't allow

The addendum sends "only the wording of goals" to `GOALS_MODEL`, whose default is `PLANNER_MODEL`. Goal wording is written by the vendor, not by the player, so it resembles content made without her. But the list of goals her overview holds, and the order they came in, tell the model which goals her class has opened. RES-2600 conclusion 12 and the approved requirement built from it name the kinds that may leave and nothing else, and the Parent Room tells the parent about three of them. ADR-0100 has no `GOALS_MODEL` role, no request class that would carry goal wording, and no tier for it, and its gateway accepts only its five strict request classes. Item 8's school goals from the doelenoverzicht need the same amendment.

### ADR-0060 reads the whole event log, and no rule keeps school events out of the model

ADR-0060's knowledge model "takes the event log (ADR-0020), the skill graph (ADR-0050), the model parameters" and the versions. It names no event types it ignores. Once school events enter the log, nothing in the approved record stops a model version from reading them, though the addendum says school data never enters the knowledge model. SPC-0020 already enforces a similar rule by import checks for game projections, which can't reach the model, so the same kind of check can enforce this one.

### ADR-0180 and RES-2300 fix report v1 at eight screens and one export of the whole log

RES-2300 conclusion 13 gives report v1 eight screens, and ADR-0180 builds exactly those, with the dynamics screen, the PDF snapshot and the full limits views after the MVP. A "home and school" screen and a timeline are new screens that no approved record lists. ADR-0020 and SPC-0020 define one export, the whole log and two flat tables, on the Mac only (RES-2200 conclusion 11). An export for the school that holds only school data is a second export with its own content rule, and it is the first file meant to leave the house on purpose. ADR-0180's security boundary lists "report data leaving the Mac" only through the Mac-only export, which is a file the parent keeps.

### The repository is public, so parser tests can't use a real overview

CLAUDE.md, read 2026-09-28, keeps the player's name, age, school and family out of every tracked file because the repository is public. A real overview carries at least her name and her school, so a parser fixture copied from one breaks that rule.

### Options for taking the overview in

The owner's addendum chooses the third option below. I compared four, each in the terms its advocate would use.

| Option | Better at | Worse at |
| --- | --- | --- |
| Do nothing: the parent reads the school's own report and the home report side by side | nothing to build after the MVP; no third-party record about her on the Mac; no risk of reading a percentile as mastery, because nothing puts them on one screen | no history across snapshots unless the parent files them; no link from a school goal to a home node; the parent does the comparison in her head every time |
| Manual entry: a Parent Room form per goal, like item 8's Cito form | works with any format, even a teacher's spoken summary; the parent reads each value as she types it, so a parse error can't happen | tens of goals per snapshot make it slow; no original file to go back to, so a typo is a fact; the parent decides which fields exist |
| Immutable file, local parser, parsed events (the addendum) | keeps the original, so a better parser can reread every old snapshot; every value traces to a file and a parser version; corrections are events, as ADR-0020 wants | the format is unconfirmed and can change without notice; a parser for PDFs and photos is the most code of the four; the log and blob store keep whatever is imported, a wrong pupil's file included |
| Immutable file, parsed by a model | reads any layout, photos included, with the least parser code | sends her school record off the Mac, which RES-2600 conclusion 12 forbids; a model's reading can't be reproduced by version the way a parser's can |

The case against the addendum's option is that its parser rests on a format nobody on the project has seen. If the school hands out a photo of a screen, or the vendor changes the layout, the parser yields empty fields and the feature does no more than manual entry, at much higher cost. The model option would solve the format problem and is ruled out only by RES-2600 conclusion 12, so it returns if the owner ever widens that rule. Doing nothing stays the right answer if the parent receives an overview less than a few times a year, because the report then has too few points for a timeline to show a trend. The third option is chosen, because the owner's addendum fixes it and it is the only one that keeps the original file, runs on the Mac and traces every value to a parser version. The parser takes PDFs and images, as the decision on file types below says, and a real overview settles only the layout it reads, not whether the feature is built.

### Options for linking school goals to graph nodes

| Option | Better at | Worse at |
| --- | --- | --- |
| No link: the "home and school" report groups by the school's subdomains and the home domains side by side | no model call and no mapping to maintain | no per-node discrepancy, which is the report's reason to exist |
| The parent maps each goal to nodes by hand | nothing leaves the Mac; the parent learns the graph | about 79 nodes to choose from per goal; slow and error-prone at tens of goals |
| `GOALS_MODEL` proposes, the parent confirms (the addendum) | fast; the parent's confirmation makes it a checked fact | sends goal wording off the Mac, which the approved rule on what leaves the Mac doesn't allow today |
| A mapping of the vendor's whole goal catalogue, built offline by the building agent and approved by the parent | the request carries no data from her overview, so it is content made without her; one mapping serves every snapshot | depends on a public goal catalogue, which I didn't find and record as unconfirmed; goals her overview holds but the catalogue lacks still need the third option |

The fourth option is chosen, with the second for any goal the catalogue lacks, because it is the only one that needs no amendment to the rule on what leaves the Mac. The addendum's third option is dropped, since it would make goal wording a fifth kind of data allowed to leave. Where no public catalogue exists, the parent maps every goal by hand.

## Conclusions

1. School learning-system data must stay out of the knowledge model: the model's code must ignore the snapshot events, and a check in the lint verb must fail model code that reads them, as SPC-0020 already fails a game projection that reaches the model. This amends ADR-0060, which today reads the whole log.
2. Every snapshot file must be stored once under its SHA-256 hash with exclusive create and the `blobs` triggers, and must never change. This amends ADR-0020 and SPC-0020 to let the blob store take a snapshot's file types and sizes, and RES-2550's description of `blobs`. The allowed types must be PDF, PNG, JPEG and WebP, because the parser has to expect a PDF, a photographed print or a screenshot, and the design step must set the size ceiling.
3. Importing a file must write one import event with the date the document carries, the date of upload, the source (the teacher, an access request or another route the parent names) and the hash. Where the document carries no date, the parent must enter it and the event must record that the parent did. Importing the same hash again must write no second copy of the file.
4. Every parse must be a new event carrying the parser version and the hash it read, and a new parser version must reread old files into new events, leaving the earlier parse events as they were.
5. A correction must be a new event naming the snapshot's hash, the goal and the field, so it still applies after a reparse. Where a reparse and a correction disagree, the correction must win, because the parent made it by reading the document, and the parent must be shown that they disagree.
6. A field the document doesn't show must stay empty, and the parser must never infer it. Goal codes, whether a goal is open, the number of tasks, document dates, the share mastered per subdomain and the level of the material must each be treated as possibly absent, because none is confirmed.
7. The parser must run on the Mac, reading a PDF's text layer and an image through local text recognition, and no model may read a snapshot file or its parsed values, because the approved rule on what leaves the Mac (RES-2600 conclusion 12, ADR-0100) lets neither leave.
8. The changes between snapshots must be a projection of the parse and correction events, rebuilt by the full recompute of ADR-0020, and must mark a change of target or status that follows a change of target as a change in the target, since the vendor can move the target monthly by its own rule.
9. The "home and school" report must show the school's per-goal level as the school's national comparison and its status as relative to her target, and must never state a school level or status as a home state or convert one into the other. A difference between them must read as a difference between two measures, in wording the parent judges, because the two measure different things.
10. The timeline must draw the school's levels, the Cito results and the home skill scale as separate series, each on its own scale and labelled with its source, with no conversion between them.
11. Goal wording and the school's goal list must not leave the Mac, and ADR-0100 must gain no `GOALS_MODEL` role. Goals must map to nodes through a mapping of the vendor's public goal catalogue, built offline and kept on the Mac, and the parent must map by hand any goal the catalogue lacks. Item 8's school goals must follow the same rule. This needs no amendment to RES-2600 conclusion 12, the approved requirements built from it or ADR-0100.
12. A goal's link to a node must take effect only after the parent confirms it, and an unconfirmed link must change nothing in the report. A confirmed link from a snapshot must not add to the Director's value formula (ADR-0070), because the snapshot's status is relative to a target the vendor can move monthly.
13. Report v1's list of screens (RES-2300 conclusion 13, ADR-0180 and the approved requirement built from them) must be amended to add the "home and school" screen and the timeline after the MVP, and ADR-0020, SPC-0020 and ADR-0180 must define the export for the school as its own export with its own content rule, beside the export of the whole log.
14. The export for the school must hold the parsed school values with their corrections, per snapshot date, and the Cito results the parent entered, and no home data: no event from play, no estimate, no state, no free text and no story. It must still be written only on the Mac, as RES-2200 conclusion 11 and ADR-0020 require of every export.
15. Before an import writes any event or file, the Mac must show the parent the document and the name the parser read, and the parent must confirm the document is about the player, because once imported, nothing removes it from the log or the blob store. A wrong snapshot that still gets in must be withdrawn by a new event that hides it from every projection, report and export, and it must never leave the Mac.
16. Parser tests must use synthetic overviews only, and no real overview may enter a tracked file.
17. The event catalogue of ADR-0020 must gain `school_snapshot_imported`, `school_snapshot_parsed`, `school_snapshot_corrected` and `school_snapshot_withdrawn` in the same change as their schemas, with an owning decision. Event names and code must stay vendor-neutral, in place of the addendum's `snappet_*`, because the school's system can change and the repository is public.

### Decided on 2026-09-28

1. The parser takes a PDF, a PNG, a JPEG or a WebP file, reading a PDF's text layer and an image through local text recognition on the Mac, because the school may hand out any of them and an access request only promises a common electronic form. A real overview settles the layout the parser reads, and a field it can't find stays empty for the parent to correct. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.
2. A confirmed link from a school goal in a snapshot doesn't add to the Director's value formula, because the snapshot's status is relative to a target the vendor can move monthly, and adding it would let that rule steer play. Item 8's confirmed school goals keep their own term. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.
3. Goal wording doesn't leave the Mac and no `GOALS_MODEL` role is added: goals map to nodes through an offline catalogue on the Mac, and the parent confirms each link, because this needs no amendment to the rule on what leaves the Mac. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.
4. The export for the school holds the school's own data back in one file: the parsed values with their corrections, per snapshot date, and the Cito results the parent entered. It holds nothing the school doesn't already have, so it exposes no home data. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.
5. The family can't erase a snapshot. The import shows the document and the name the parser read before it writes anything, and a wrong snapshot that still gets in is withdrawn by a new event that hides it everywhere and never lets it leave the Mac. This keeps ADR-0020's rule that nothing is erased while closing the usual path for a wrong file. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.
6. Event names and code stay vendor-neutral, `school_snapshot_*` in place of `snappet_*`, because the school's system can change and the repository is public. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

## Sources

- The owner's addendum 1 to the specification, 2026-09-28 - section 10, the general rules, the event list, the model table and the order of work; item 8 for `GOALS_MODEL`, the Cito result form and the home skill scale.
- Snappet, «Informatiebrief voor ouders rapport», https://info.snappet.org/wp-content/uploads/2024/12/Informatiebrief-voor-ouders-rapport.pdf, read 2026-09-28 - the report's national comparison, levels 0 to 5 with their bands, the streefniveau, growth, the growth chart with 1F and 1S lines, and subdomain averages.
- Snappet, «Wat is het niveau van jouw leerlingen?», https://snappet.be/oplossingen/wat-is-het-niveau-van-jouw-leerlingen/, read 2026-09-28 - per-goal levels 0 to 5 and the percentile behind them.
- Snappet, «Beter inzicht voor je leerlingen», https://snappet.be/oplossingen/beter-inzicht-voor-je-leerlingen/, read 2026-09-28 - the three goal statuses, subdomains and the level or status view.
- Stichting Snappet, «Hoe kan ik het streefniveau aanpassen?», https://service.snappet.org/hc/nl/articles/115001323989-Hoe-kan-ik-het-streefniveau-aanpassen, read 2026-09-28 - the monthly automatic update of the target and the advice to set it at or just above current skill.
- Snappet, «Privacy- & Cookiebeleid», https://snappet.nl/privacy/, read 2026-09-28 - the school as controller and rights requests going to the school.
- Ouders & Onderwijs, «Recht op inzage leerlingdossier», https://oudersenonderwijs.nl/kennisbank/privacy-en-leerlinggegevens/leerlinggegevens/inzage-leerlingdossier-en-andere-rechten/, read 2026-09-28 - parents as legal representatives under 16, a copy of the whole file, the one-month deadline and the cost.
- GDPR Article 15, https://gdpr-info.eu/art-15-gdpr/, read 2026-09-28 - the copy and its common electronic form.
- GDPR Article 20, https://gdpr-info.eu/art-20-gdpr/, read 2026-09-28 - portability limited to consent or contract, and excluded for a task in the public interest.
- ADR-0020 and SPC-0020, `project/adrs/ADR-0020-append-only-event-log-is-the-only-truth.md` and `project/specs/SPC-0020-event-log-and-projections.md` at 47c0a7b, read 2026-09-28 - the blob store, its limits, the event catalogue, the export and the absence of erasure.
- RES-2550, `project/research/RES-2550-data-model.md` at 47c0a7b, read 2026-09-28 - `blobs` as scratchpad metadata.
- RES-2600, `project/research/RES-2600-privacy.md`, and the approved requirements on what leaves the Mac and what the parent is told, `project/requirements/`, at 47c0a7b, read 2026-09-28 - the kinds of data that may leave the Mac.
- ADR-0100, `project/adrs/ADR-0100-model-gateway-tiers-budgets.md` at 47c0a7b, read 2026-09-28 - the roles, the five request classes and tiers fixed by role.
- ADR-0180, RES-2300 and the approved requirements on the report's screens, the PDF snapshot and the Mac-only export, at 47c0a7b, read 2026-09-28 - the eight screens, the post-MVP items, the Mac-only export and the security boundary.
- ADR-0060 and ADR-0070 at 47c0a7b, read 2026-09-28 - the model's inputs and the Director's value formula.
- `CLAUDE.md` at 47c0a7b, read 2026-09-28 - the public repository and the rule on personal data.
