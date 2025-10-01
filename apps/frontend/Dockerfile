FROM node:18-alpine

WORKDIR /app

# Copy all package files
COPY package.json yarn.lock* ./
COPY packages/ ./packages/
COPY apps/frontend ./apps/frontend

# Install dependencies
RUN yarn install --frozen-lockfile

# Build shared package
WORKDIR /app/packages/shared
RUN yarn build || echo "Using source"

# Build frontend
WORKDIR /app/apps/frontend
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build

# Runtime config
EXPOSE 3000
ENV PORT=3000

# Start (next binary is in node_modules/.bin/)
CMD ["./node_modules/.bin/next", "start"]
