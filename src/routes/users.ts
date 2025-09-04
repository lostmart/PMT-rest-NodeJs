import { Router } from "express"
import userController from "../controllers/user.controller"
import { authMiddleware } from "../middleware/auth"
import { logger } from "../utils/logger"

const router = Router()

router.get("/", authMiddleware, userController.list)
router.get("/:id", authMiddleware, userController.getById)

router.post("/register", userController.create)
router.post("/login", userController.login)

router.patch("/:id", userController.update)
router.delete("/:id", userController.remove)

export default router
