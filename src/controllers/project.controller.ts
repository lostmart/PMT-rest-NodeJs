import { RequestHandler, Response, Request } from "express"
import { projectService } from "../services/projects.service"

import dotenv from "dotenv"
import { CreateProjectRequest } from "../interfaces/project.interface"
import { logger } from "../utils/logger"
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

const createProject: RequestHandler = (
	req: Request<{}, CreateProjectRequest, any>,
	res: Response
) => {
	logger.info(req.body)
	return res.json({ project: projectService.createProject(req.body) })
}

export default { list, getProjectById, createProject }
