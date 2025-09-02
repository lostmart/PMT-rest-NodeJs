import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import routes from "./routes"
import { logger } from "./utils/logger"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api", routes)

// Centralized error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
	logger.error(err)
	res.status(500).json({ error: "Internal Server Error" })
})

export { app }
