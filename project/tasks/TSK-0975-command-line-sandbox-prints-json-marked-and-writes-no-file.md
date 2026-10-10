---
id: TSK-0975
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0340
closes: [REQ-6360, REQ-6362, REQ-6366, REQ-6372]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `./meowtower sandbox` runs an item, a batch or an adventure, prints JSON with a mark and writes no file

After this task, `./meowtower sandbox item`, `sandbox batch --count N` and `sandbox adventure --from-snapshot` call the loopback listener's `/sandbox/*` routes, print one JSON result each with a top-level `sandboxRun`, and leave no file in the repository or the volume.

## Acceptance criteria

1. Given the three commands on the Mac, when each runs, then it prints JSON on standard output: one item, a batch of 10 to 50, and an adventure played from the last sandbox snapshot (REQ-6360). Closed by: an integration test of each command in `replay` mode.
2. Given the same routes asked from the iPad or another machine on the home network, when a request arrives, then the connection is refused or the answer is 404 (REQ-6362). Closed by: a network test that reads the compose file's published address and a request from a second host.
3. Given each command, when it ends, then it leaves no file in the repository and none in the volume, and the temporary file `sandbox-cli-<ULID>.sqlite` is deleted, and a start-up sweep removes one a crash left (REQ-6366). Closed by: a test that lists both directories before and after.
4. Given every output, when it is read, then `sandboxRun` is `snap-<ULID>` for a run on a snapshot and `empty-<ULID>` otherwise (REQ-6372). Closed by: a schema test over the three commands.
5. Given `batch --count 9`, when it runs, then it exits 2 with `sandbox_batch_size` and clamps nothing; given `adventure --from-snapshot` with no snapshot, then it exits 2 with `sandbox_snapshot_missing` and takes none (REQ-6360). Closed by: two command tests.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the three routes under `/sandbox/` on the loopback listener, which `compose.yaml` publishes on `127.0.0.1` only, and the three commands in the `meowtower` script. Each run works on its own `sandbox-cli-<ULID>.sqlite` in the volume, so it never shares the parent's sandbox state. `item` and `batch` start from an empty profile, and `adventure --from-snapshot` copies `sandbox-snapshot.sqlite` into the run's file. The script prints to standard output and writes no file. Model calls spend from the sandbox bucket, as TSK-0970 sets.

## Depends on

- TSK-0964 (blocking): the run's temporary file is opened with role `sandbox`.
- TSK-0968 (blocking): `adventure --from-snapshot` reads the snapshot that task builds.
- TSK-0971 (blocking): the routes use the sandbox's engine context and its play mount.
- TSK-0970 (not blocking): spend is recorded in the ledger once that task lands; until then the commands run in `replay` mode.

## Evidence

Not yet.

## Left alone

The repository scan that keys on the mark, which TSK-0976 builds.
