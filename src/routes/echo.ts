import { Router, Request, Response } from "express"

const router = Router()

router.post("/echo", (req: Request, res: Response) => {
	res.status(200).json({ youSent: req.body })
})

export default router
