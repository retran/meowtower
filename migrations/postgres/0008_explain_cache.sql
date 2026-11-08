-- The explanation cache (ADR-0120). Emptying it loses no fact about play (REQ-3816).
CREATE TABLE explain_cache (
  variant_id TEXT PRIMARY KEY,
  group_key TEXT NOT NULL,
  text TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('visible', 'hidden', 'retired')),
  prompt_version TEXT NOT NULL,
  checks TEXT NOT NULL,
  reuse_failures BIGINT NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
