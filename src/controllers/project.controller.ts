import { RequestHandler, Response, Request } from "express"
import { projectService } from "../services/projects.service"
import { CreateProjectRequest } from "../interfaces/project.interface"

import dotenv from "dotenv"
import { logger } from "../utils/logger"
import { Project } from "../models/project"
dotenv.config()

/* ---------- handlers ---------- */

const list: RequestHandler = (_req, res) => {
	return res.json({ projects: projectService.list() })
}

const getProjectById: RequestHandler<{ id: string }> = (req, res) => {
	const project = projectService.getById(req.params.id)
	if (!project) return res.status(404).json({ error: "Project not found" })
	return res.json({ project })
}

const createProject: RequestHandler = async (
	req: Request<{}, CreateProjectRequest, any>,
	res: Response
) => {
	try {
		const { projectName, description } = req.body
		const userId = req.user?.id

		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" })
		}

		logger.info({ userId }, "Creating project")
		const newProject = await projectService.createProject({
			projectName,
			description,
			ownerId: userId,
			manager: userId,
		} as Project)
		return res
			.status(201)
			.json({ message: "Project created successfully", project: newProject })
	} catch (error: any) {
		logger.error({ error, body: req.body }, "Failed to create project")

		if (error.message === "UNIQUE_VIOLATION") {
			return res.status(409).json({
				error: "Project already exists",
				details: "A project with this name already exists",
			})
		}

		if (error.message === "INVALID_ROLE") {
			return res.status(400).json({
				error: "Invalid role specified",
				details: "Please check the role value",
			})
		}

		return res.status(500).json({
			error: "Internal server error",
			details: "Failed to create project",
		})
	}
}

export default { list, getProjectById, createProject }
