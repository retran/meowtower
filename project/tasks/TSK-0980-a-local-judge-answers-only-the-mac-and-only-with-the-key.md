---
id: TSK-0980
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0350
closes: [REQ-3910]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A local judge answers only the Mac and only with the key

After this task, `./meowtower up` starts one `llama-server` process for each entry of `LOCAL_JUDGES` on the loopback address with the key on every route but `/health`, the containers reach it through `host.docker.internal`, and no device other than the Mac gets a model answer from it.

## Acceptance criteria

1. Given a running judge, when a second machine on the home network and the Mac's own LAN address each send a completion request to the judge's port, then the connection is refused or the reply is `401`, and neither carries a model answer (REQ-3910). Closed by: a network test run from a second machine, and the iPad's browser opening the same URL to a refused connection or a `401`.
2. Given a running judge, when the `tower` container sends a request through `host.docker.internal` with the key, then it gets a model answer; without the key, `401`; and `GET /health` answers a status with no model answer in either case (REQ-3910). Closed by: a stage 0 test on the family Mac whose output records which binding the Mac uses, `loopback` or `all`.
3. Given `LOCAL_JUDGES` with 3 entries, a key shorter than 32 bytes, a model file outside `models/`, or `LOCAL_JUDGE_BIND=all` with no key, when `./meowtower up` runs, then it logs `model_config_invalid` naming the entry and the fault, starts nothing for that entry and starts the others. Closed by: a shell test over the four configurations.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `LOCAL_JUDGES` (a JSON array of `{ name, file, port, params }`, at most 2 entries), `LOCAL_JUDGE_KEY` and `LOCAL_JUDGE_BIND` to `.env`, generate the key as 32 random bytes when `.env` holds none, pin `llama.cpp` with `brew pin`, and start each judge with `--host 127.0.0.1` (or `0.0.0.0` when the bind is `all`), the port, `--api-key`, `--parallel 10` and a context of 4,096 tokens a slot. `./meowtower down` unloads the judges, and `./meowtower status` prints one line for each with its state. Mount `models/` read-only into `tower` and `tools`, and add it to `.gitignore`.

The judge runs as a native macOS process, because no container runtime on the Mac gives a Linux container the Metal GPU. Which account runs it and how `data/judges/owners.json` is written belong to the epic realising ADR-0360 (entry 1); until that task lands, start the judge as the owner's user, which that task replaces.

RES-3910 couldn't confirm that a container reaches a service bound to `127.0.0.1`. The stage 0 test settles it, and if it fails the judge binds to all addresses and the key alone meets REQ-3910, which is why `up` refuses a missing or short key.

## Depends on

Nothing in this epic. The epic realising ADR-0010 supplies `./meowtower up`, `down` and `status` and the container mounts; until it exists the task runs the same commands in a script under `tools/`.

## Evidence

Not yet.

## Left alone

What a judge's answer looks like and how the gateway reads it, which TSK-0982 builds, and the judge account, the network watch and `owners.json`, which the epic realising ADR-0360 builds.
