import { db } from "../db/sqlite"
import { Project } from "../models/project"

export const projectService = {
	list: (): Project[] => {
		const stmt = db.prepare("SELECT * FROM projects")
		return stmt.all() as Project[]
	},

	getById: (id: string): Project => {
		const stmt = db.prepare("SELECT * FROM projects WHERE id = ?")
		return stmt.get(id) as Project
	},

	createProject: async (project: Project) => {
		const now = new Date().toISOString()
		const stmt = db.prepare(
			"INSERT INTO projects (projectName, ownerId, manager, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
		)

		const newProject: Project = {
			id: null,
			projectName: project.projectName,
			ownerId: project.ownerId,
			manager: project.manager,
			description: project.description,
			createdAt: now,
			updatedAt: now,
		}

		try {
			const result = await stmt.run(
				newProject.projectName,
				newProject.ownerId,
				newProject.manager,
				newProject.description,
				now,
				now
			)
			// Get the auto-generated ID
			const projectId = result.lastInsertRowid

			newProject.id = projectId

			return newProject
		} catch (e: any) {
			if (e?.code === "SQLITE_CONSTRAINT_UNIQUE")
				throw new Error("UNIQUE_VIOLATION")
			if (e?.code === "SQLITE_CONSTRAINT_CHECK") throw new Error("INVALID_ROLE")
			throw e
		}
	},

	updateProject: (id: string, project: Project) => {
		try {
			const stmt = db.prepare(
				"UPDATE projects SET projectName = ?, manager = ?, description = ?, updatedAt = ? WHERE id = ?"
			)
			stmt.run(
				project.projectName,
				project.manager,
				project.description,
				new Date().toISOString(),
				id
			)
			return true
		} catch (error: any) {
			throw error
		}
	},

	deleteProject: (id: string) => {
		try {
			const stmt = db.prepare("DELETE FROM projects WHERE id = ?")
			stmt.run(id)
			return true
		} catch (error: any) {
			throw error(error.message)
		}
	},
}
