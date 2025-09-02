import { Router } from "express"
import healthRoutes from "./health"
import echoRoutes from "./echo"

const router = Router()

// all routes mounted under /api
router.use("/", healthRoutes)
router.use("/", echoRoutes)

export default router
