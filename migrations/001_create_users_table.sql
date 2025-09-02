-- migrations/001_initial_schema.sql
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    userName TEXT NOT NULL UNIQUE,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'collaborator', 'guest')),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_userName ON users(userName);