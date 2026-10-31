-- A database older than migration 0010 keeps `node_snapshots` without `rules_version`, and every
-- recompute at start-up failed on it. The table is derived from the log: dropping it lets the
-- projection create it anew and fill it.
DROP TABLE IF EXISTS node_snapshots;
