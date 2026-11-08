-- The graph versions (ADR-0050, SPC-0050): the canonical content of each graph version the server
-- has started on.
CREATE TABLE graph_versions (
  version TEXT PRIMARY KEY,
  canonical TEXT NOT NULL,
  stored_at TEXT NOT NULL
);
