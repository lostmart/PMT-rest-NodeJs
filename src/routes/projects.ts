import { Router } from "express"
import projectController from "../controllers/project.controller"
import { authMiddleware } from "../middleware/auth"

const router = Router()

// GET all projects
router.get("/", authMiddleware, projectController.list)

// GET project by ID
router.get("/:id", authMiddleware, projectController.getProjectById)

// CREATE a new project
router.post("/", projectController.createProject)

export default router
