import { app } from "./server"
import { logger } from "./utils/logger"
import dotenv from "dotenv"

// Load environment variables FIRST
dotenv.config()

// Initialize DB and run migrations FIRST

async function bootstrap() {
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
