#!/bin/bash

# Script to rebuild and restart frontend in production
# Usage: ./scripts/rebuild-frontend.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Rebuilding Frontend${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Load environment variables
echo -e "${YELLOW}Loading environment variables...${NC}"
export $(cat .env.prod | grep -v '^#' | xargs)
echo -e "${GREEN}✓ Environment loaded${NC}"
echo ""

# Stop frontend
echo -e "${YELLOW}Stopping frontend container...${NC}"
docker compose -f docker-compose.prod.yml stop frontend
echo -e "${GREEN}✓ Frontend stopped${NC}"
echo ""

# Remove frontend container
echo -e "${YELLOW}Removing frontend container...${NC}"
docker compose -f docker-compose.prod.yml rm -f frontend
echo -e "${GREEN}✓ Frontend container removed${NC}"
echo ""

# Remove frontend image
echo -e "${YELLOW}Removing frontend image...${NC}"
docker rmi mysaasproject-frontend 2>/dev/null || echo "Image already removed or doesn't exist"
echo -e "${GREEN}✓ Frontend image removed${NC}"
echo ""

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
docker compose -f docker-compose.prod.yml build frontend
echo -e "${GREEN}✓ Frontend built${NC}"
echo ""

# Start frontend
echo -e "${YELLOW}Starting frontend...${NC}"
docker compose -f docker-compose.prod.yml up -d frontend
echo -e "${GREEN}✓ Frontend started${NC}"
echo ""

# Wait for container to initialize
echo -e "${YELLOW}Waiting for container to initialize...${NC}"
sleep 15
echo ""

# Show status
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Container Status${NC}"
echo -e "${GREEN}========================================${NC}"
docker compose -f docker-compose.prod.yml ps
echo ""
echo -e "${GREEN}✓ Frontend rebuild complete!${NC}"

