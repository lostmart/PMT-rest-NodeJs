# ---------- Stage 1: Build (compile TS and native modules) ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Need build tools to compile better-sqlite3
RUN apk add --no-cache python3 make g++

# Install ALL deps (dev included) so tsc is available
COPY package*.json tsconfig.json ./
RUN npm ci

# Build TS -> dist
COPY src ./src
RUN npm run build

# Remove dev deps; keep compiled native addons
RUN npm prune --omit=dev

# ---------- Stage 2: Runtime (small, no build tools) ----------
FROM node:20-alpine AS runner
WORKDIR /app

# Prod mode so logger won't try to load pino-pretty
ENV NODE_ENV=production

# Non-root user
RUN addgroup -S app && adduser -S app -G app

# Bring in only what's needed (pruned node_modules from builder)
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Data dir for SQLite (persist with a volume)
RUN mkdir -p /app/data && chown -R app:app /app
USER app

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "dist/index.js"]
