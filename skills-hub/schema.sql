CREATE TABLE IF NOT EXISTS skills (
 id TEXT PRIMARY KEY,
 source TEXT NOT NULL,
 revision TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('pending','approved','disabled')) DEFAULT 'pending'
);
CREATE TABLE IF NOT EXISTS jobs (
 id TEXT PRIMARY KEY,
 skill_id TEXT NOT NULL REFERENCES skills(id),
 query TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('queued','running','completed','failed','cancelled')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 artifact_url TEXT,
 error TEXT
);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status,created_at);