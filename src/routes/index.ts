import { Router } from "express"
import healthRoutes from "./health"
import echoRoutes from "./echo"
import usersRoutes from "./users"

const router = Router()

// all routes mounted under /api
router.use("/", healthRoutes)
router.use("/", echoRoutes)

router.use("/users", usersRoutes)

export default router
