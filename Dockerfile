# ---------------------------
# Stage 1: Build
# ---------------------------
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Install deps (with package-lock.json if present for reproducibility)
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy source
COPY src ./src

# Build TypeScript -> dist
RUN npm run build

# ---------------------------
# Stage 2: Production runtime
# ---------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install only prod deps
RUN npm ci --omit=dev

# Expose port
EXPOSE 3000

# Run the app
CMD ["node", "dist/index.js"]
