-- The explanation cache (ADR-0120): groups of explanation variants with
-- their status, prompt version, check results and reuse failures. A service
-- table outside the log (ADR-0020); only the explanation request reads it,
-- and emptying it loses no fact about play (REQ-3816).
CREATE TABLE explain_cache (
  variant_id TEXT PRIMARY KEY,
  group_key TEXT NOT NULL,
  text TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('visible', 'hidden', 'retired')),
  prompt_version TEXT NOT NULL,
  checks TEXT NOT NULL,
  reuse_failures INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
) STRICT;
