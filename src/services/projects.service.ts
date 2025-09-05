import { RequestHandler } from "express"
import { db } from "../db/sqlite"
import { Project } from "../models/project"
import { randomUUID } from "crypto"
import { logger } from "../utils/logger"

export const getAllProjects = db.prepare("SELECT * FROM projects")

export const getProjectById = db.prepare("SELECT * FROM projects WHERE id = ?")

export const createProject = db.prepare(
	"INSERT INTO projects (name, ownerId, manager, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
)

/*  handlers   */

export const projectService = {
	list: (): Project[] => getAllProjects.all() as Project[],

	getById: (id: string): Project => getProjectById.get(id) as Project,

	createProject: async (project: Project) => {
		const now = new Date().toISOString()

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
			createProject.run(
				newProject.projectName,
				newProject.ownerId,
				newProject.manager,
				newProject.description,
				now,
				now
			)
			return newProject as Project
		} catch (e: any) {
			if (e?.code === "SQLITE_CONSTRAINT_UNIQUE")
				throw new Error("UNIQUE_VIOLATION")
			if (e?.code === "SQLITE_CONSTRAINT_CHECK") throw new Error("INVALID_ROLE")
			throw e
		}
	},
}
