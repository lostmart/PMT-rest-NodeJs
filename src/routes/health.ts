import { Router, Request, Response } from "express"

const router = Router()

router.get("/health", (_req: Request, res: Response) => {
	res.json({ ok: true, service: "back", ts: new Date().toISOString() })
})

export default router
