import { Router } from "express"
import healthRoutes from "./health"
import echoRoutes from "./echo"
import usersRoutes from "./users"
import projectsRoutes from "./projects"
import tasksRoutes from "./tasks"

const router = Router()

// all routes mounted under /api
router.use("/", healthRoutes)
router.use("/", echoRoutes)

router.use("/users", usersRoutes)
router.use("/projects", projectsRoutes)
router.use("/tasks", tasksRoutes)

export default router
