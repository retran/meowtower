---
id: TSK-0814
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0240
closes: [REQ-5366, REQ-5368]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The node card shows a matrix of estimate right or wrong by exact answer right or wrong, and «мало данных» under 5 answers a cell

After this task, the node card of each node with estimates shows four cells, estimate right or wrong by exact answer right or wrong, over all the node's first attempts on items with an estimate since the current rules version, the summary screen shows one more matrix pooled over every node, and a cell with fewer than 5 answers shows «мало данных» (too little data).

## Acceptance criteria

1. Given a report fixture with a cell of 4 answers and one of 5, when the matrix is built, then the first shows «мало данных» and the second shows its count (REQ-5368). Closed by: a report test.
2. Given first attempts on items with an estimate, when the matrix is built, then each lands in one of four cells by the estimate's `estimateRight` and the exact answer at credit 1 as right and otherwise wrong, and a «Не знаю» with no estimate stays out (REQ-5366). Closed by: the report test.
3. Given attempts from before the current rules version, when the matrix is built, then they are out, and the matrix restarts with each rules version (REQ-5366). Closed by: the report test with two versions.
4. Given several nodes with estimates, when the summary is built, then the pooled matrix holds the sum of the nodes' cells and its cells carry the same «мало данных» rule (REQ-5366, REQ-5368). Closed by: the report test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the matrix to ADR-0180's node card and a pooled one to the summary screen. I took ADR-0240's choice of no time window and a pooled matrix, because at about one estimate per node a week a 60-day window holds 8 or 9 answers, too few to fill even two cells of 5, while the pooled matrix gets about 10 answers a week. The cell count 5 is a default REQ-5368 records.

An exact answer counts as right at credit 1 and wrong otherwise, because the matrix asks whether she reached the result and a partial answer didn't, the reading ADR-0060 gives a partial answer in its review ladder. The matrix separates a player who feels the size of a result but miscalculates from one who calculates but doesn't feel the size, so it reads `estimateRight` from `verdict`.

## Depends on

- TSK-0813 (blocking): the `estimateRight` field the matrix reads.

The epic realising ADR-0180 supplies the node card and the summary screen; the matrix's wording belongs to its screen spec and ADR-0160's strings.

## Evidence

Not yet.

## Left alone

The check's weekly line, which TSK-0815 holds, and the wording of the matrix for the parent.
