-- ADR-3280, REQ-8270: a change above approved work marks that work for review. `needs_review` is 1 for an
-- approved node that something above it changed since the parent last approved or reviewed it.
ALTER TABLE story_nodes ADD COLUMN needs_review INTEGER NOT NULL DEFAULT 0;
