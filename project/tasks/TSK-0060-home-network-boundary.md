---
id: TSK-0060
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0010
closes: [REQ-2510]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server answers only on the home network, and the Parent Room listener only on the Mac

After this task, `./tower up` refuses to start on a network other than the home one, and the Parent Room listener on port 8080 answers only on the Mac's loopback address.

## Acceptance criteria

1. Given the default gateway recorded at setup, when the Mac's current default gateway differs and the parent runs `./tower up`, then it prints `wrong_network` with the recorded gateway and the current one, starts nothing and exits non-zero. Closed by: the command's output and exit status on a second network or with a simulated gateway.
2. Given the containers run, when a second machine on the home network opens `http://<mac-name>.local:8080`, then the connection is refused. Closed by: the request's output.
3. Given the containers run, when a browser on the Mac opens `http://localhost:8080`, then it serves the Parent Room. Closed by: the request's output.

## What to do

Add the gateway check to `./tower up` and the second listener in `tower`, published on `127.0.0.1:8080` only, as SPC-0010 states them. The loopback listener is the only place where the export routes of ADR-0020 are mounted. No router port is forwarded, which the setup instructions state.

## Depends on

TSK-0010, because the listeners and `./tower up` must exist.

## Evidence

Collected on 2026-09-27 on the Mac, whose Docker engine is OrbStack. Criteria 1 and 3 are met; criterion 2 needs a second machine.

- Verbs: `meow-verbs run format lint check test build` exited 0; Vitest 30 tests and Playwright 2 tests passed.
- Criterion 1, REQ-2510: `tests/smoke/home-network.test.ts`, seen failing before the check existed, now passes: `set-home-network` records the gateway, `up` on a different gateway prints `wrong_network` with both gateways and exits 1, and `up` on the recorded one passes the check. On the Mac, with the recorded gateway `192.168.178.1 unknown` and a simulated router `00:11:22:33:44:55`, `./meowtower up` printed `wrong_network` and exited 1.
- The home network is recorded as the gateway's IP address and the router's hardware address, in `data/home-gateway`, on the first `./meowtower up` or by `./meowtower set-home-network`. Here the Mac's ARP table had no entry for the router, so the address is recorded as `unknown` and the IP address decides.
- Criterion 3: `curl http://localhost:8480/` returned HTTP 200 with the page «Комната родителя». Port 8080 is published by another project on this Mac (meowhub), so `./meowtower up` refused with `port_in_use` on the default, and the local `.env`, which git ignores, sets `MEOWTOWER_PARENT_PORT=8480`.
- Criterion 2, partly: `lsof` shows the Parent Room listening on `127.0.0.1:8480` only, and a request from the Mac to its own home-network address on that port got no connection (curl exit 28). A second machine on the home network is still to try it.
- Fixed on the way: reading the router's hardware address no longer stops the script when the ARP table has no entry, and a Docker engine that isn't running now reads `docker_not_running` for Docker Desktop and OrbStack alike.

## Left alone

The export routes themselves, which ADR-0020 defines.
