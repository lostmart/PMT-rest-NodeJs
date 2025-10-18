import { Router } from "express"

const router = Router()

router.get("/", (_req, res) => {
	res.json({
		message: "Hello tasks",
	})
})

// GET all tasks based on project ID
router.get("/project/:id", (_req, res) => {
	res.json({
		message: "tasks based on project ID",
	})
})

// GET all tasks based on user ID
router.get("/user/:id", (_req, res) => {
	res.json({
		message: "asks based on user ID",
	})
})

export default router
