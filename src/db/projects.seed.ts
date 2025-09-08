// db/projects.seed.ts
import Database from "better-sqlite3"

// db/projects.seed.ts
export function seedProjects(db: Database.Database) {
	console.log("🌱 Starting projects seeding...")

	// First, get some users to assign as owners/managers
	const users = db.prepare("SELECT id FROM users").all() as { id: number }[]
	console.log("📋 Available users:", users)

	if (users.length === 0) {
		console.log("❌ No users found to assign as project owners")
		return
	}

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
			ownerId: users[0].id,
			manager: users[0].id,
			description: "Description 1",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			projectName: "Project 2",
			ownerId: users[1].id,
			manager: users[0].id,
			description: "Description 2",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			projectName: "Project 3",
			ownerId: users[0].id,
			manager: users[1].id,
			description: "Description 3",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	]

	let projectsCreated = 0
	for (const project of projects) {
		try {
			const result = insertProject.run(project)
			if (result.changes > 0) {
				projectsCreated++
			}
		} catch (error) {
			console.error("❌ Error inserting project:", error)
		}
	}

	console.log(`✅ Seeded ${projectsCreated} projects.`)

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

	// FIXED: Added 'INTO' keyword
	const insertProjectMember = db.prepare(`
        INSERT INTO projects_members (
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
		{ projectId: projects[0].id, userId: users[3].id }, // Duplicate
		{ projectId: projects[1].id, userId: users[1].id },
	]

	let membersCreated = 0
	for (const member of projectMembers) {
		try {
			const result = insertProjectMember.run(member)
			if (result.changes > 0) {
				membersCreated++
			}
		} catch (error) {
			console.log("⚠️  Could not add member (might be duplicate):", member)
		}
	}

	console.log(`✅ Seeded ${membersCreated} project members.`)

	// Verify the seeding worked
	const countMembers = db
		.prepare("SELECT COUNT(*) as count FROM projects_members")
		.get() as { count: number }
	console.log(`📊 Total project members: ${countMembers.count}`)
}