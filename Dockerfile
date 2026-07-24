# Production Dockerfile for Render deployment
# Uses pre-built .output/ committed to the repo (pure JavaScript, cross-platform)
FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000
ENV NITRO_PRESET=node-server

# Copy the pre-built Nitro server bundle (committed to git)
COPY .output ./.output

EXPOSE 10000

CMD ["node", ".output/server/index.mjs"]
