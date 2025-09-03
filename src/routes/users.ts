import { Router } from "express"
import userController from "../controllers/user.controller"

const router = Router()

router.get("/", userController.list)
router.get("/:id", userController.getById)

router.post("/register", userController.create)
router.post("/login", userController.login)

router.patch("/:id", userController.update)
router.delete("/:id", userController.remove)

export default router
