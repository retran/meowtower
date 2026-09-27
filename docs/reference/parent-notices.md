# Parent notices

For the parent. The server raises a notice when something needs you, and shows it in `./meowtower status` and on the Parent Room page on the Mac. The last column says what clears each one. The server keeps the notices in `data/snapshots/notices.json`, and it logs the details of each failure, which `docker compose logs meowtower` shows from the project folder.

| Notice | When the server raises it | What it means | What to do | What clears it |
| --- | --- | --- | --- | --- |
| `backup_failed` | The snapshot the server takes after a session failed. | The last good snapshot is older than the last session. | Check the free space on the Mac and that `data/snapshots/` is writable, and read the reason in the log. | The next good snapshot. |
| `storage_ceiling` | `data/` passed 20 GB, and again at each further 10 GB. | Each snapshot is a full copy of the database, and the server keeps the first snapshot of every month for good, so snapshots grow most. | Move old exports out of `data/exports/`, and leave the snapshots, because the monthly ones are the only copy of each past month. | Nothing: the notice stays and shows the last level passed. |
| `recompute_failed` | A recompute stopped partway. | The old derived tables are still in place, so play goes on. The notice names the versions and the time. | Read the reason in the log, fix it, and run `./meowtower recompute`. | A recompute that succeeds. |
| `recompute_slow` | A full recompute took longer than 60 seconds. | Rebuilds after a version change leave the Parent Room's figures stale for longer. | You needn't act now. | Nothing: the server raises it once and keeps it. |
| `log_write_failed` | A write to the event log failed, for example on a full disk. | The game refused the request with a 503 error, and the player's answer waits on her device. | Check the free space on the Mac, and read the reason in the log. | The next write that succeeds. |
| `log_large` | The event log passed 1 GB. | The log grows with play and is never trimmed. | You needn't act now. | Nothing: the server raises it once and keeps it. |

In `./meowtower status` a notice reads, for example, as below; its "projections" are the derived tables:

```text
recompute_failed: the recompute at 2026-09-27T21:46:42.762Z (model none, thresholds none, graph none) failed; the old projections stay.
```
