import { app } from "./server"
import { logger } from "./utils/logger"
import initSeeding from "./scripts/seed"
import dotenv from "dotenv"

// Load environment variables FIRST
dotenv.config()

// Initialize DB and run migrations FIRST
import initializeDB from "./db"
const db = initializeDB()

if (!db) throw new Error("Failed to initialize DB")

initSeeding()

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
	logger.info(`API running on http://localhost:${PORT}/api/health`)
})
