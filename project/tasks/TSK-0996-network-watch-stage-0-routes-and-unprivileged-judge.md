---
id: TSK-0996
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-2510, REQ-2512, REQ-1644]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The host stops the stack when its gateway changes, the stage 0 write routes are gone and the local judge runs as an unprivileged account

After this task, `./meowtower up` refuses to start when a gateway's hardware address is unknown, a host job stops the containers within 70 seconds of a changed gateway, the two stage 0 write routes answer 404, and no check routes to a local judge that runs as root or as a member of `admin`.

## Acceptance criteria

1. Given a recorded gateway and a current gateway whose hardware address can't be read, when `./meowtower up` runs, then it exits with `gateway_unverified` and starts no container (REQ-2510). Closed by: a shell test with a stubbed `arp` answer.
2. Given a running stack, when the stubbed gateway's hardware address changes, then the host job stops the containers with `wrong_network` within 70 seconds, and a run with an unchanged address stops nothing (REQ-2510). Closed by: a network test that drives the job with the stub and a fake clock.
3. Given the server from stage 0.1 on, when `POST /api/stage0/write` and `GET /api/stage0/write/:id` are requested, then both answer 404 and the version 0 events they wrote still read (ADR-0360 entry 3, no requirement of its own). Closed by: a route test and a replay test over a stored version 0 event.
4. Given a local judge whose process owner is root, a member of `admin` or not the dedicated account, when the server resolves routes, then no check routes to it, and `./meowtower setup` creates the dedicated standard account once (REQ-2512). Closed by: a setup test that reads `data/judges/owners.json` and a route test over synthetic owners.
5. Given a configured local judge whose `/props` names a file other than the configured one, when the server starts, then it exits with `judge_file_mismatch` naming both files (REQ-1644). Closed by: a start-up test with a mocked `/props`.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the hardware-address check to `up` and the 60-second host launchd job, which also rewrites `data/judges/owners.json` on each run, as ADR-0360 entries 1 and 2 and SPC-0350 state. Remove the two stage 0 routes from the server's route table. Make the judge's launchd agent a daemon run as the dedicated account that `./meowtower setup` creates; setup needs administrator rights once, which the owner runs. The account name and the daemon's file name are choices this task makes and records in its pull request, because ADR-0360 leaves them to the epic step.

## Depends on

Nothing in this epic. The epic realising ADR-0350 supplies the local judge's route table and `/props` probe; until it exists, tests 4 and 5 run against a stub judge that answers `/props`, and the real judge's route is left to that epic. The epic realising ADR-0010 supplies `./meowtower up`; this task adds one check to it.

## Evidence

Not yet.

## Left alone

The judge's candidates, thresholds and bake-off, which ADR-0350 owns, and the setup step's run on the family Mac, which the owner does.
