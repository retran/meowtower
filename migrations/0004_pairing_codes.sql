-- Pairing codes (SPC-0010): a 6-digit code lives 5 minutes and pairs one
-- device. A service table outside the log (ADR-0020).
CREATE TABLE pairing_codes (
  code TEXT PRIMARY KEY,
  issued_at_ms INTEGER NOT NULL,
  used INTEGER NOT NULL DEFAULT 0 CHECK (used IN (0, 1))
) STRICT;
