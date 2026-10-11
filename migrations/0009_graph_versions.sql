-- The graph versions (ADR-0050, SPC-0050): the canonical content of each graph
-- version the server has started on, so a snapshot names a graph that can be
-- read back without git. A service table outside the log (ADR-0020); no play
-- fact is derived from it.
CREATE TABLE graph_versions (
  version TEXT PRIMARY KEY,
  canonical TEXT NOT NULL,
  stored_at TEXT NOT NULL
) STRICT;
