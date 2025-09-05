import { Router } from "express"
import projectController from "../controllers/project.controller"
import { authMiddleware } from "../middleware/auth"
import { projectValidation } from "../middleware/project.validation"

const router = Router()

// GET all projects
router.get("/", authMiddleware, projectController.list)

// GET project by ID
router.get("/:id", authMiddleware, projectController.getProjectById)

// CREATE a new project
router.post("/", projectValidation, authMiddleware, projectController.createProject)

export default router
