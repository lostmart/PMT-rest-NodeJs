import { Router } from "express"
import projectController from "../controllers/project.controller"
import { authMiddleware } from "../middleware/auth"
import { projectValidation } from "../middleware/project.validation"

const router = Router()

// GET all projects
router.get("/", projectController.list)

// GET project by ID
router.get("/:id", authMiddleware, projectController.getProjectById)

// CREATE a new project
router.post(
	"/",
	projectValidation,
	authMiddleware,
	projectController.createProject
)

// UPDATE a project based on its ID
router.put(
	"/:id",
	projectValidation,
	authMiddleware,
	projectController.updateProject
)

// DELETE a project based on its ID
router.delete("/:id", authMiddleware, projectController.deleteProject)

export default router
