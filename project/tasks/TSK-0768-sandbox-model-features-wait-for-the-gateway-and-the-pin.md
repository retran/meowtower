---
id: TSK-0768
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5094, REQ-5098]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The sandbox's model routes answer 409 until the gateway and the PIN exist, and its pages are served only on the loopback listener until then

After this task, a sandbox model route answers `409 sandbox_models_unavailable` while the model gateway or the Parent Room's PIN is missing, and until the PIN guards the sandbox, the server serves it only on ADR-0010's loopback listener, `http://localhost:8080`, which the iPad can't reach.

## Acceptance criteria

1. Given no PIN set, when a sandbox model route is called, then it answers `409 sandbox_models_unavailable`; given a PIN set and the gateway off, then it answers the same (REQ-5094). Closed by: an integration test with both states.
2. Given a PIN set and the gateway on, when the same route is called, then it passes to the gateway (REQ-5094). Closed by: the integration test.
3. Given no PIN set, when a request for a sandbox page arrives on the listener the iPad uses, then it is refused, and on the loopback listener it is served (REQ-5098). Closed by: an integration test on two listeners.
4. Given no PIN set and the iPad on the home network, when the player tries the loopback address, then the connection is refused and no link to the sandbox appears on her screens (REQ-5098). Closed by: the person at the stage acceptance who tries it from the iPad, as a judgement, because only a real device on the real network shows that the address is unreachable.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add a guard in front of the sandbox's model routes that checks two facts: the gateway is configured and the Parent Room's PIN is set. While either is missing, the route answers `409 sandbox_models_unavailable`.

Add a listener rule: until the PIN guards the sandbox, the server mounts the sandbox's routes only on the loopback listener of ADR-0010. The player's screens carry no link to it in any state. After the PIN exists, the sandbox is served under the PIN with the Parent Room, as ADR-0180 sets.

## Depends on

Nothing.

The epic realising ADR-0340 supplies the sandbox's routes and pages; this task guards a stand-in route and a stand-in page and leaves their content to that epic. The epics realising ADR-0100 and ADR-0180 supply the gateway and the PIN, and the guard reads their settings by name.

## Evidence

Not yet.

Criterion 4 rests on judgement: a test on one machine can't show what an iPad on another network sees.

## Left alone

What the sandbox shows and changes, and the PIN's own rules, which ADR-0340 and ADR-0180 own.
