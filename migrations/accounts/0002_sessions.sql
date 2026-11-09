-- ADR-3320: a parent's sign-in on one browser. The token lives in a cookie; only its hash is kept.
CREATE TABLE account_sessions (
  token_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts (id),
  created_at_ms BIGINT NOT NULL,
  last_used_ms BIGINT NOT NULL,
  revoked BIGINT NOT NULL DEFAULT 0 CHECK (revoked IN (0, 1))
);

CREATE INDEX account_sessions_account ON account_sessions (account_id);
