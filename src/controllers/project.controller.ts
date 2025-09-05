import { RequestHandler, Response, Request } from "express"
import { projectService } from "../services/projects.service"

import dotenv from "dotenv"
import { CreateProjectRequest } from "../interfaces/project.interface"
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
	req: Request<{}, CreateProjectRequest, {}>,
	res: Response
) => {
	return res.status(201).json({ msg: req.body })
	// to do ADD QUERY TO SQLite
}

export default { list, getProjectById, createProject }
