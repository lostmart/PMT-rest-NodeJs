// db/projects.seed.ts
import Database from "better-sqlite3"
import { Project } from "../models/project"

export function seedProjects(db: Database.Database) {
	// ... your existing projects seeding code ...

	console.log("✅ Seeded fixed projects.")

	// Now seed project members
	seedProjectMembers(db)
}

export function seedProjectMembers(db: Database.Database) {
	// First, get all users and projects
	const getUsers = db.prepare("SELECT id FROM users")
	const getProjects = db.prepare("SELECT id FROM projects")

	const users = getUsers.all() as { id: number }[]
	const projects = getProjects.all() as { id: number }[]

	if (users.length === 0 || projects.length === 0) {
		console.log("❌ Need users and projects to seed project members")
		return
	}

	console.log("📋 Found users for members:", users)
	console.log("📋 Found projects for members:", projects)

	const insertProjectMember = db.prepare(`
        INSERT OR IGNORE INTO projects_members (
            projectId, userId
        ) VALUES (
            @projectId, @userId
        )
    `)

	// Create diverse member assignments
	const projectMembers = [
		// Project 1: All users as members
		{ projectId: projects[0].id, userId: users[0].id },
		{ projectId: projects[0].id, userId: users[1].id },
		{ projectId: projects[0].id, userId: users[2].id },
		{ projectId: projects[0].id, userId: users[3].id },

		// Project 2: Mixed members
		{ projectId: projects[1].id, userId: users[0].id },
		{ projectId: projects[1].id, userId: users[2].id },

		// Project 3: Different mixed members
		{ projectId: projects[2].id, userId: users[1].id },
		{ projectId: projects[2].id, userId: users[3].id },

		// Additional assignments for testing
		{ projectId: projects[0].id, userId: users[3].id }, // Duplicate (should be ignored due to OR IGNORE)
		{ projectId: projects[1].id, userId: users[1].id },
	]

	for (const member of projectMembers) {
		try {
			insertProjectMember.run(member)
		} catch (error) {
			console.log("⚠️  Could not add member (might be duplicate):", member)
		}
	}

	console.log("✅ Seeded project members.")

	// Verify the seeding worked
	const countMembers = db
		.prepare("SELECT COUNT(*) as count FROM projects_members")
		.get() as { count: number }
	console.log(`📊 Total project members: ${countMembers.count}`)
}
