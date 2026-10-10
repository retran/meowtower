---
id: TSK-1093
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0420
closes: [REQ-7066, REQ-7068]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `content/cito-categories.json` maps the four domains from the research table and holds the LOVS categories unconfirmed

After this task, one content file maps each listed Cito category to graph nodes, the four Leerling in beeld domains equal the research table, and the four LOVS categories read nothing until a person confirms them.

## Acceptance criteria

1. Given `content/cito-categories.json`, when the unit test compares the four Leerling in beeld lists with RES-0800's table, then Getallen holds N1 to N7, A1 to A11, A6a, A13, F1 to F8 and D1 to D6, Verhoudingen holds P1 to P6, M8 and A14, Meten en meetkunde holds M1 to M10, M12, M13, G1 and G3 to G7, Verbanden holds S1 to S6 and G4, and T1 to T4 map to no domain (REQ-7066). Closed by: the unit test.
2. Given a list that differs from the table, when verify runs, then it fails with `category_map_drift` and names the domain and the nodes (REQ-7066). Closed by: the check's fixture test with one node removed.
3. Given the four LOVS categories, when the file is read, then each holds a drafted node list with `confirmed: false`, and no row in a LOVS category reads nodes until a person confirms it in the file with the approving record (REQ-7068). Closed by: a unit test on a fixture result and a fixture confirmed copy.
4. Given the file with an unconfirmed LOVS category, when `./meowtower status` runs, then it lists the file once per version as `category_map_unconfirmed`. Closed by: the status command's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Create `content/cito-categories.json` with a `version`, its source and approval entry, and one list of nodes per listed category, in the shape ADR-0310's goal catalogue uses for its approval. Draft the four LOVS lists from Cito's published descriptions, marked `confirmed: false`, because no record maps the LOVS categories yet and the LOVS «getallen» needn't match the domain Getallen. M8 and G4 appear in two domains each, as RES-0800 puts them. The file holds node lists and category names only, and test fixtures are generated, because a real printout must not enter the repository.

## Depends on

Nothing within this epic. The epic realising ADR-0050 supplies the graph's node ids; until it exists the test checks the lists against the research table's text.

## Evidence

Not yet.

## Left alone

The owner's confirmation of the LOVS lists, about 30 minutes of reading the drafts against Cito's category descriptions, which is a person's act and not a task, and the mapping of typed categories by the parent, which TSK-1102 builds.
