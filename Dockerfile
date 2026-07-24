# Production Dockerfile for Render deployment
FROM node:20-slim AS builder

WORKDIR /app

# Copy ONLY package.json (NOT package-lock.json)
# This forces npm to resolve fresh on Linux, correctly picking up
# Linux-specific optional deps: @rollup/rollup-linux-x64-gnu, @rolldown/binding-linux-x64-gnu
COPY package.json ./

# Install all deps fresh on Linux (no Windows lock file interference)
RUN npm install --legacy-peer-deps

# Copy source files AFTER install (so lock file from Windows doesn't override)
COPY . .
# Remove any Windows-generated lock file that was just copied
RUN rm -f package-lock.json

# Build with node-server preset
ENV NITRO_PRESET=node-server
RUN npm run build

# Verify the server bundle was produced
RUN test -f .output/server/index.mjs || (echo "ERROR: .output/server/index.mjs not found after build!" && exit 1)

# --- Production runtime stage ---
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000
ENV NITRO_PRESET=node-server

# The Nitro server bundle is fully self-contained (only needs tslib which is traced)
COPY --from=builder /app/.output ./.output

EXPOSE 10000

CMD ["node", ".output/server/index.mjs"]
