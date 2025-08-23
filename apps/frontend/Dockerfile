FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files from root and frontend
COPY package.json yarn.lock ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn workspace @mysaasproject/frontend build

# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "workspace", "@mysaasproject/frontend", "dev"]


