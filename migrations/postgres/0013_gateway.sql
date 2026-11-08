-- ADR-3100: every model call in full, and every live frame with its status.
CREATE TABLE llm_log (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  at TEXT NOT NULL,
  role TEXT NOT NULL,
  route TEXT NOT NULL,
  model TEXT NOT NULL,
  tier TEXT NOT NULL,
  bucket TEXT NOT NULL,
  input_tokens BIGINT NOT NULL,
  output_tokens BIGINT NOT NULL,
  cost_usd DOUBLE PRECISION NOT NULL,
  latency_ms BIGINT NOT NULL,
  outcome TEXT NOT NULL,
  request TEXT NOT NULL,
  response TEXT NOT NULL
);

CREATE TABLE frames (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  template_id TEXT NOT NULL,
  seed TEXT NOT NULL,
  lang TEXT NOT NULL,
  text TEXT NOT NULL,
  status TEXT NOT NULL,
  step TEXT,
  game_day BIGINT NOT NULL,
  at TEXT NOT NULL
);

CREATE INDEX frames_task ON frames (template_id, seed, lang, status);
CREATE INDEX frames_day ON frames (game_day);
