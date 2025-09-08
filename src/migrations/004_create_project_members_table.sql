-- db/migrations/create_projects.sql
CREATE TABLE IF NOT EXISTS projects_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projectId INTEGER,
  userId INTEGER,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_projectId ON projects(id);