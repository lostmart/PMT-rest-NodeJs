import { app } from "./server"
import { logger } from "./utils/logger"
import dotenv from "dotenv"

// Load environment variables FIRST
dotenv.config()

// Initialize DB and run migrations FIRST

async function bootstrap() {
	// Initialize DB (runs migrations inside initializeDB)
	//const db = initializeDB()
	// if (!db) throw new Error("Failed to initialize DB")

	// Start server

	const PORT = Number(process.env.PORT) || 3000
	app.listen(PORT, () => {
		logger.info(`API running on http://localhost:${PORT}/api/health`)
	})
}

bootstrap().catch((err) => {
	console.error(err)
	process.exit(1)
})
