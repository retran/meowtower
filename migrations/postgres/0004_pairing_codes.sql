-- Pairing codes (SPC-0010): a 6-digit code lives 5 minutes and pairs one device.
CREATE TABLE pairing_codes (
  code TEXT PRIMARY KEY,
  issued_at_ms BIGINT NOT NULL,
  used BIGINT NOT NULL DEFAULT 0 CHECK (used IN (0, 1))
);
