-- Paired devices (SPC-0010): one row per device, holding its token's SHA-256
-- hash, never the token. A service table outside the log (ADR-0020).
CREATE TABLE devices (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL CHECK (kind IN ('tablet', 'computer')),
  revoked INTEGER NOT NULL DEFAULT 0 CHECK (revoked IN (0, 1)),
  created_at TEXT NOT NULL
) STRICT;
