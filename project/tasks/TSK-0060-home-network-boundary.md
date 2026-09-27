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

Not yet.

## Left alone

The export routes themselves, which ADR-0020 defines.
