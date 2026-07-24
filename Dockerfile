# Production Dockerfile for Render deployment
FROM node:20-slim AS builder

WORKDIR /app

# Copy ONLY package.json (NOT package-lock.json)
# This forces npm to resolve fresh on Linux, correctly picking up
# Linux-specific optional deps: @rollup/rollup-linux-x64-gnu, @rolldown/binding-linux-x64-gnu
COPY package.json ./

# Install all deps fresh on Linux (no Windows lock file interference)
RUN npm install --legacy-peer-deps

# Fix rolldown binding path:
# postinstall copies to node_modules/rolldown/rolldown-binding.linux-x64-gnu.node
# but rolldown's loader looks for node_modules/rolldown/dist/rolldown-binding.linux-x64-gnu.node
# (relative path ../rolldown-binding.linux-x64-gnu.node from dist/shared/)
RUN node -e " \
  const fs = require('fs'); \
  const path = require('path'); \
  const src = path.join(process.cwd(), 'node_modules/@rolldown/binding-linux-x64-gnu/rolldown-binding.linux-x64-gnu.node'); \
  const dst = path.join(process.cwd(), 'node_modules/rolldown/dist/rolldown-binding.linux-x64-gnu.node'); \
  if (fs.existsSync(src)) { \
    fs.mkdirSync(path.dirname(dst), { recursive: true }); \
    fs.copyFileSync(src, dst); \
    console.log('Rolldown linux binding copied to dist/ successfully'); \
  } else { \
    console.error('ERROR: Source binding not found at', src); \
    process.exit(1); \
  } \
"

# Copy source files AFTER install
COPY . .
RUN rm -f package-lock.json

# Build with node-server preset
ENV NITRO_PRESET=node-server
RUN npm run build

# Verify the server bundle was produced
RUN test -f .output/server/index.mjs && echo "Server bundle OK" || (echo "ERROR: .output/server/index.mjs not found!" && exit 1)

# --- Production runtime stage ---
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000
ENV NITRO_PRESET=node-server

# The Nitro server bundle is fully self-contained
COPY --from=builder /app/.output ./.output

EXPOSE 10000

CMD ["node", ".output/server/index.mjs"]
