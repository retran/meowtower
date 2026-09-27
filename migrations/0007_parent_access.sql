-- The Parent Room PIN and the two lockout counters (SPC-0010). Service tables
-- outside the log (ADR-0020). The PIN is kept as an scrypt hash with its salt.
CREATE TABLE parent_pin (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  set_at TEXT NOT NULL
) STRICT;

-- Wrong entries in a row, per kind, and the end of a running lockout.
CREATE TABLE lockouts (
  kind TEXT PRIMARY KEY CHECK (kind IN ('pairing', 'pin')),
  wrong INTEGER NOT NULL DEFAULT 0,
  locked_until_ms INTEGER NOT NULL DEFAULT 0
) STRICT;
