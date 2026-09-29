# Recompute the derived tables

For the parent on the Mac, comfortable with a terminal. Every table apart from the event log is derived from the log, and `./meowtower recompute` rebuilds all of them from the log while play goes on. You rarely need it: the server recomputes by itself when an update brings a new version of the knowledge model, which estimates what the player knows, or of its thresholds. Run it by hand after the [`recompute_failed`](../reference/parent-notices.md) notice, once you have fixed its cause.

## Before you start

- The server runs: `./meowtower status` shows `meowtower: running`.
- You work in the project folder on the Mac, because the Parent Room's listener answers only requests from the Mac.

## Steps

1. Run the recompute:

   ```sh
   ./meowtower recompute
   ```

## Result

The command prints the tables it rebuilt, the last event it read and the time it took:

```text
Recomputed: items_view, attempts_view, adventures, sessions, parent_settings, node_snapshots
Up to event 103, in 4 ms.
```

The server builds the new tables beside the old ones and swaps them in at the end, in one step.

## If it fails

| Message | Cause | Fix |
| --- | --- | --- |
| `recompute_failed: {"error":"recompute_failed","reason":"<reason>"}` | The cause the `reason` field names. The old tables stay in place, and play goes on. | Fix that cause and run the command again. `./meowtower status` shows the notice until a recompute succeeds. |
| `server_unreachable: run ./meowtower up first.` | The server isn't running. | Run `./meowtower up`, then the recompute again. |
