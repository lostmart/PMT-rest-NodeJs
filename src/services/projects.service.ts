import { RequestHandler } from "express"
import { db } from "../db/sqlite"
import { Project } from "../models/project"
import { randomUUID } from "crypto"

export const getAllProjects = db.prepare("SELECT * FROM projects")

export const getProjectById = db.prepare("SELECT * FROM projects WHERE id = ?")

export const createProject = db.prepare(
	"INSERT INTO projects (name, owner_id, manager, members, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)"
)

/*  handlers   */

export const projectService = {
	list: (): Project[] => getAllProjects.all() as Project[],

	getById: (id: string): Project => getProjectById.get(id) as Project,

    createProject: async (project: Project) => {
        // const now = new Date().toISOString()

		// const preparedProject = {
        //     ...project,
        //     id: randomUUID(),
        //     owner_id: "1",
        //     manager: "1",
        //     members: ["1"],
		// 	createdAt: now,
		// 	updatedAt: now,
		// }
        // return createProject.run(preparedProject) as unknown
        return createProject.run(project)
	},
}
