import { db } from "../db/sqlite"
import { Project } from "../models/project"
import { randomUUID } from "crypto"
import { logger } from "../utils/logger"

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
			id: randomUUID(),
			projectName: project.projectName,
			ownerId: project.ownerId,
			manager: project.manager,
			description: project.description,
			createdAt: now,
			updatedAt: now,
		}

		logger.info(`Creating project ${newProject.projectName}`)

		try {
			stmt.run(
				newProject.projectName,
				newProject.ownerId,
				newProject.manager,
				newProject.description,
				now,
				now
			)
			return newProject
		} catch (e: any) {
			if (e?.code === "SQLITE_CONSTRAINT_UNIQUE")
				throw new Error("UNIQUE_VIOLATION")
			if (e?.code === "SQLITE_CONSTRAINT_CHECK") throw new Error("INVALID_ROLE")
			throw e
		}
	},
}
