import { Router } from "express"
import healthRoutes from "./health"
import echoRoutes from "./echo"
import usersRoutes from "./users"
import projectsRoutes from "./projects"

const router = Router()

// all routes mounted under /api
router.use("/", healthRoutes)
router.use("/", echoRoutes)

router.use("/users", usersRoutes)
router.use("/projects", projectsRoutes)

export default router
