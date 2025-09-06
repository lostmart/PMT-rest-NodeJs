// db/seed.ts
import Database from "better-sqlite3"
import { Project } from "../models/project"

export function seedProjects(db: Database.Database) {
	// First, get some actual user IDs from the users table
	const getUsers = db.prepare("SELECT id FROM users LIMIT 2")
	const users = getUsers.all() as { id: number }[]

	if (users.length < 2) {
		console.log("❌ Need at least 2 users to seed projects")
		return
	}

	console.log("📋 Found users:", users)

	const insertProject = db.prepare(`
    INSERT OR IGNORE INTO projects (
      projectName, ownerId, manager, description, createdAt, updatedAt
    ) VALUES (
      @projectName, @ownerId, @manager, @description, @createdAt, @updatedAt
    )
  `)

	const projects = [
		{
			projectName: "Project 1",
			ownerId: users[0].id, // Use actual user ID
			manager: users[1].id, // Use actual user ID
			description: "Description 1",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		} as Project,
		{
			projectName: "Project 2",
			ownerId: users[1].id, // Use actual user ID
			manager: users[0].id, // Use actual user ID
			description: "Description 2",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		} as Project,
		{
			projectName: "Project 3",
			ownerId: users[0].id, // Use actual user ID
			manager: users[1].id, // Use actual user ID
			description: "Description 3",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		} as Project,
	]

	for (const project of projects) {
		insertProject.run(project)
	}

	console.log("✅ Seeded fixed projects.")
}
