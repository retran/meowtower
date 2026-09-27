-- REQ-3802: every derived table records the versions it was computed with,
-- the last event it took into account and when. The projections' own tables
-- belong to their registry, which creates and rebuilds them from the log.
CREATE TABLE derived_meta (
  name TEXT PRIMARY KEY,
  model_version TEXT NOT NULL,
  threshold_version TEXT NOT NULL,
  graph_version TEXT NOT NULL,
  last_seq INTEGER NOT NULL,
  computed_at TEXT NOT NULL
) STRICT;
