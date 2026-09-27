-- Stage 0 (ADR-0190): the one write the spike logs, until ADR-0020's event
-- log replaces it.
CREATE TABLE stage0_writes (
  id TEXT PRIMARY KEY,
  received_at TEXT NOT NULL
) STRICT;
