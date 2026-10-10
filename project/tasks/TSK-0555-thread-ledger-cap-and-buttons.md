---
id: TSK-0555
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0080
closes: [REQ-0518, REQ-0520, REQ-0522, REQ-0524]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The guiding-thread stock is a projection of the log, never above 30, and a surplus thread turns silently into 2 buttons

After this task, `src/engine/attempt/threads.ts` computes the stock from `thread_granted`, `thread_spent` and `pocket_thread_given` events, a grant fills the stock up to 30 and turns each thread above 30 into 2 buttons in the same event with no window, sound or line, and no item in the shop grants threads.

## Acceptance criteria

1. Given a stock of 29 and a grant of 3, when the grant is applied, then the stock is 30 and the one `thread_granted` event holds 1 thread to the stock and 4 buttons, 2 for each of the 2 threads above the cap (REQ-0518, REQ-0520). Closed by: a unit test with exact numbers.
2. Given random sequences of grants, spends, pocket draws and resumes, when the ledger is replayed, then the stock never exceeds 30 or falls below 0, each thread above 30 adds exactly 2 buttons, and a repeated `clientSeq` never charges twice (REQ-0518, REQ-0520). Closed by: a property test with fast-check over at least 1,000 sequences.
3. Given a grant that converts a surplus, when the next packet is read, then its stock and its buttons count carry the new values and no event, window, sound or line was produced for the conversion (REQ-0522). Closed by: an integration test and a Playwright test that watches the window.
4. Given the shop's content data, when it is searched, then no item grants guiding threads (REQ-0524). Closed by: a content test over `content/` for the shop's items.
5. Given a recompute from the log, when the stock is rebuilt, then it equals the stock the server held, and only the server writes it. Closed by: the rebuild check over the projection.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the ledger as a projection through the registry of the epic realising ADR-0020. The `thread_granted` event gains the stock part and the button part in a new payload version with its upcast, because the schema holds only `source` and `count`; add the `pocket_thread_given` schema with `itemId`, `roomId` and `floorId`, `roomId` null for a task outside any room. Replace the stand-in `STANDIN_THREADS` and `stockAt` of the play routes with the ledger.

The morning grant isn't back-filled for game days she doesn't open the game, a choice ADR-0080 records, since a week away would otherwise return her to a full stock of 30 and teach nothing. The morning grant itself is ADR-0330's.

## Depends on

Nothing. The event log and the projection registry exist from the epic realising ADR-0020.

## Evidence

Not yet.

## Left alone

The sources that grant threads, which TSK-0557 adds, the spending rules, which TSK-0556 adds, and the shop's items, which the epic realising ADR-0140 builds.
