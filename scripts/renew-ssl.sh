#!/bin/bash

# Script to renew SSL certificates
# Usage: ./scripts/renew-ssl.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SSL Certificate Renewal${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

echo -e "${YELLOW}Renewing SSL certificate...${NC}"
docker-compose -f docker-compose.prod.yml run --rm certbot renew

echo ""
echo -e "${YELLOW}Restarting nginx...${NC}"
docker-compose -f docker-compose.prod.yml restart nginx

echo ""
echo -e "${GREEN}✓ SSL certificate renewed successfully!${NC}"
echo ""

