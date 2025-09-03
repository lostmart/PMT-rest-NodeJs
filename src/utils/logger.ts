import pino from "pino"

const level =
	process.env.LOG_LEVEL ??
	(process.env.NODE_ENV === "development" ? "debug" : "info")
const isDev =
	process.env.NODE_ENV === "development" || process.env.PRETTY_LOGS === "1"

function createLogger() {
	if (isDev) {
		try {
			// Only reference pino-pretty when we actually want it.
			return pino({
				level,
				transport: {
					target: "pino-pretty",
					options: { colorize: true, translateTime: "SYS:standard" },
				},
			})
		} catch {
			// If pino-pretty isn't installed, just use plain JSON
			return pino({ level })
		}
	}
	// Production (Render) => plain JSON (fast, structured)
	return pino({ level })
}

export const logger = createLogger()
