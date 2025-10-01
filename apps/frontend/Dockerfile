FROM node:18-alpine

# Accept build arguments from docker-compose
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

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

# Start
CMD ["./node_modules/.bin/next", "start"]
