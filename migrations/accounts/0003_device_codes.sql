-- ADR-3320: a pairing code names the profile whose Parent Room issued it, so a child's device that
-- enters it reaches that profile and no other. A code lives 5 minutes, as in a profile.
CREATE TABLE device_codes (
  code TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles (id),
  issued_at_ms BIGINT NOT NULL
);
