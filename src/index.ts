import { app } from "./server"
import { logger } from "./utils/logger"

import dotenv from "dotenv"

// Load environment variables FIRST
dotenv.config()

// Then initialize DB
import initializeDB from "./db"
const db = initializeDB()

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
	logger.info(`API running on http://localhost:${PORT}/api/health`)
	// logger.info(
	// 	`DB initialized at path: ${process.env.DB_PATH || "[default path]"}`
	// )
})
