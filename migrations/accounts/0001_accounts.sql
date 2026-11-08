-- ADR-3320: the parent's account on a verified email, the profiles it owns (one a child, each the
-- schema of ADR-3310), and the one-time sign-in codes. These tables sit in their own schema, apart
-- from every profile's.
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  verified_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts (id),
  label TEXT NOT NULL,
  schema_name TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE INDEX profiles_account ON profiles (account_id);

-- One live code for an address: a new one replaces the old. The code is kept as a hash, and the
-- wrong tries and the lockout belong to the address.
CREATE TABLE sign_in_codes (
  email TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL,
  issued_at_ms BIGINT NOT NULL,
  expires_at_ms BIGINT NOT NULL,
  wrong BIGINT NOT NULL DEFAULT 0,
  locked_until_ms BIGINT NOT NULL DEFAULT 0
);
