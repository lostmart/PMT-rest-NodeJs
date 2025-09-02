# ---------- Stage 1: Build (compile TS and native modules) ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install prod deps (native addon will compile here)
COPY package*.json tsconfig.json ./
RUN apk add --no-cache python3 make g++ \
 && npm ci --omit=dev

# Build TS -> dist
COPY src ./src
RUN npm run build

# ---------- Stage 2: Runtime (small, no build tools) ----------
FROM node:20-alpine AS runner
WORKDIR /app

# Prod mode so logger won't try to load pino-pretty
ENV NODE_ENV=production

# Non-root user
RUN addgroup -S app && adduser -S app -G app

# Bring in only what's needed
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Data dir for SQLite (persist this with a volume)
RUN mkdir -p /app/data && chown -R app:app /app
USER app

EXPOSE 3000

# Basic healthcheck (busybox wget available on alpine)
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "dist/index.js"]