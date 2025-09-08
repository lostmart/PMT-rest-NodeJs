// Copy SQL migrations into dist if src/migrations exists.
// Works on Windows/macOS/Linux and won't fail CI if the folder is absent.
const fs = require("fs")
const path = require("path")

const srcDir = path.join(process.cwd(), "src", "migrations")
const outDir = path.join(process.cwd(), "dist", "migrations")

try {
	if (fs.existsSync(srcDir) && fs.statSync(srcDir).isDirectory()) {
		fs.mkdirSync(outDir, { recursive: true })
		// Node 16+: use cpSync; for older Node, fallback to manual copy
		if (fs.cpSync) {
			fs.cpSync(srcDir, outDir, { recursive: true })
		} else {
			for (const f of fs.readdirSync(srcDir)) {
				fs.copyFileSync(path.join(srcDir, f), path.join(outDir, f))
			}
		}
		console.log(`[postbuild] Copied migrations to ${outDir}`)
	} else {
		console.log("[postbuild] No src/migrations directory; skipping copy.")
	}
} catch (err) {
	console.warn("[postbuild] Skipped copying migrations:", err.message)
	// Don't throw — keep CI green even if nothing to copy
}
