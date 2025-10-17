// src/db/tasks.seed.ts
import Database from "better-sqlite3"

export function seedTasks(db: Database.Database) {
	console.log("🌱 Starting tasks seeding...")

	// Get existing projects and users
	const projects = db.prepare("SELECT id FROM projects").all() as {
		id: number
	}[]
	const users = db.prepare("SELECT id FROM users").all() as { id: number }[]

	if (projects.length === 0 || users.length === 0) {
		console.log("❌ Need projects and users to seed tasks")
		return
	}

	console.log("📋 Found projects for tasks:", projects)
	console.log("📋 Found users to assign:", users)

	const insertTask = db.prepare(`
		INSERT OR IGNORE INTO tasks (
			title, description, projectId, assignedTo, status, createdAt, updatedAt
		) VALUES (
			@title, @description, @projectId, @assignedTo, @status, @createdAt, @updatedAt
		)
	`)

	const now = new Date().toISOString()
	const statuses = ["todo", "in_progress", "done"]

	const tasks = [
		// Project 1 tasks
		{
			title: "Setup project structure",
			description:
				"Initialize the project with proper folder structure and dependencies",
			projectId: projects[0].id,
			assignedTo: users[0].id,
			status: "done",
			createdAt: now,
			updatedAt: now,
		},
		{
			title: "Design database schema",
			description: "Create ERD and define all tables and relationships",
			projectId: projects[0].id,
			assignedTo: users[1].id,
			status: "done",
			createdAt: now,
			updatedAt: now,
		},
		{
			title: "Implement authentication",
			description: "Add JWT-based authentication with bcrypt password hashing",
			projectId: projects[0].id,
			assignedTo: users[0].id,
			status: "in_progress",
			createdAt: now,
			updatedAt: now,
		},
		{
			title: "Create API endpoints",
			description: "Build RESTful API endpoints for all resources",
			projectId: projects[0].id,
			assignedTo: users[2].id,
			status: "in_progress",
			createdAt: now,
			updatedAt: now,
		},
		{
			title: "Write unit tests",
			description: "Add comprehensive test coverage for all services",
			projectId: projects[0].id,
			assignedTo: users[3].id,
			status: "todo",
			createdAt: now,
			updatedAt: now,
		},

		// Project 2 tasks
		{
			title: "Research UI frameworks",
			description: "Evaluate React, Vue, and Svelte for the frontend",
			projectId: projects[1].id,
			assignedTo: users[1].id,
			status: "done",
			createdAt: now,
			updatedAt: now,
		},
		{
			title: "Setup build pipeline",
			description: "Configure Vite with TypeScript and hot reload",
			projectId: projects[1].id,
			assignedTo: users[0].id,
			status: "in_progress",
			createdAt: now,
			updatedAt: now,
		},
		{
			title: "Design component library",
			description: "Create reusable UI components with Tailwind CSS",
			projectId: projects[1].id,
			assignedTo: users[2].id,
			status: "todo",
			createdAt: now,
			updatedAt: now,
		},
		{
			title: "Implement state management",
			description: "Setup Zustand or Context API for global state",
			projectId: projects[1].id,
			assignedTo: null, // Unassigned task
			status: "todo",
			createdAt: now,
			updatedAt: now,
		},

		// Project 3 tasks
		{
			title: "Setup CI/CD pipeline",
			description:
				"Configure GitHub Actions for automated testing and deployment",
			projectId: projects[2].id,
			assignedTo: users[3].id,
			status: "in_progress",
			createdAt: now,
			updatedAt: now,
		},
		{
			title: "Configure Docker containers",
			description: "Create Dockerfile and docker-compose for local development",
			projectId: projects[2].id,
			assignedTo: users[1].id,
			status: "done",
			createdAt: now,
			updatedAt: now,
		},
		{
			title: "Setup monitoring and logging",
			description: "Implement Pino logger with proper log levels",
			projectId: projects[2].id,
			assignedTo: users[0].id,
			status: "todo",
			createdAt: now,
			updatedAt: now,
		},
		{
			title: "Write API documentation",
			description: "Document all endpoints with examples and response schemas",
			projectId: projects[2].id,
			assignedTo: null, // Unassigned
			status: "todo",
			createdAt: now,
			updatedAt: now,
		},
		{
			title: "Security audit",
			description: "Review code for security vulnerabilities and fix issues",
			projectId: projects[2].id,
			assignedTo: users[2].id,
			status: "todo",
			createdAt: now,
			updatedAt: now,
		},
	]

	let tasksCreated = 0
	for (const task of tasks) {
		try {
			const result = insertTask.run(task)
			if (result.changes > 0) {
				tasksCreated++
			}
		} catch (error) {
			console.error("❌ Error inserting task:", error)
		}
	}

	console.log(`✅ Seeded ${tasksCreated} tasks`)

	// Summary stats
	const todoCount = db
		.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'todo'")
		.get() as { count: number }
	const inProgressCount = db
		.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'in_progress'")
		.get() as { count: number }
	const doneCount = db
		.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'done'")
		.get() as { count: number }
	const unassignedCount = db
		.prepare("SELECT COUNT(*) as count FROM tasks WHERE assignedTo IS NULL")
		.get() as { count: number }

	console.log(`📊 Task summary:`)
	console.log(`   - Todo: ${todoCount.count}`)
	console.log(`   - In Progress: ${inProgressCount.count}`)
	console.log(`   - Done: ${doneCount.count}`)
	console.log(`   - Unassigned: ${unassignedCount.count}`)
}
