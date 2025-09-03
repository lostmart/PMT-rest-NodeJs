import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import routes from "./routes"
import { logger } from "./utils/logger"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes under /api prefix
app.use("/api", routes)

// welcome message
app.get("/", (req: Request, res: Response) => {
	res.json({ msg: "Welcome to the PMT API" })
})

// Centralized error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
	logger.error(err)
	res.status(500).json({ error: "Internal Server Error" })
})

export { app }
