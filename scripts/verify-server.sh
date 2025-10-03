#!/bin/bash

# Server Verification Script
# Run this on your production server to verify multi-domain setup

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Multi-Domain Configuration Verification Script        ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Check 1: Current Git Status
echo -e "${YELLOW}[1/12] Checking Git status...${NC}"
git status
echo ""

# Check 2: Docker Compose File
echo -e "${YELLOW}[2/12] Checking docker-compose.prod.yml...${NC}"
if [ -f "docker-compose.prod.yml" ]; then
    echo -e "${GREEN}✓ docker-compose.prod.yml exists${NC}"
    
    # Check for relative URLs
    if grep -q "NEXT_PUBLIC_API_URL=/api/v1" docker-compose.prod.yml; then
        echo -e "${GREEN}✓ Frontend uses relative API URL${NC}"
    else
        echo -e "${RED}✗ Frontend still has hardcoded URL${NC}"
    fi
else
    echo -e "${RED}✗ docker-compose.prod.yml not found${NC}"
fi
echo ""

# Check 3: Nginx Configuration
echo -e "${YELLOW}[3/12] Checking nginx configuration...${NC}"
if [ -f "nginx/nginx.prod.conf" ]; then
    echo -e "${GREEN}✓ nginx.prod.conf exists${NC}"
    
    # Check for wildcard server_name
    if grep -q "server_name _;" nginx/nginx.prod.conf; then
        echo -e "${GREEN}✓ Nginx accepts all domains (server_name _)${NC}"
    else
        echo -e "${RED}✗ Nginx still has specific server_name${NC}"
    fi
else
    echo -e "${RED}✗ nginx.prod.conf not found${NC}"
fi
echo ""

# Check 4: SSL Certificates
echo -e "${YELLOW}[4/12] Checking SSL certificates...${NC}"
if command -v certbot &> /dev/null; then
    echo -e "${GREEN}✓ Certbot is installed${NC}"
    echo "Existing certificates:"
    sudo certbot certificates || echo "No certificates found"
else
    echo -e "${RED}✗ Certbot not installed${NC}"
fi
echo ""

# Check 5: Docker Installation
echo -e "${YELLOW}[5/12] Checking Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker is installed${NC}"
    docker --version
else
    echo -e "${RED}✗ Docker not installed${NC}"
fi
echo ""

# Check 6: Docker Compose
echo -e "${YELLOW}[6/12] Checking Docker Compose...${NC}"
if docker compose version &> /dev/null; then
    echo -e "${GREEN}✓ Docker Compose is installed${NC}"
    docker compose version
else
    echo -e "${RED}✗ Docker Compose not installed${NC}"
fi
echo ""

# Check 7: Running Containers
echo -e "${YELLOW}[7/12] Checking running containers...${NC}"
if docker compose -f docker-compose.prod.yml ps &> /dev/null; then
    docker compose -f docker-compose.prod.yml ps
else
    echo -e "${YELLOW}⚠ No containers running (this is OK if not deployed yet)${NC}"
fi
echo ""

# Check 8: Server IP
echo -e "${YELLOW}[8/12] Checking server IP...${NC}"
SERVER_IP=$(curl -s ifconfig.me || curl -s icanhazip.com || echo "Unable to determine")
echo -e "Server IP: ${GREEN}${SERVER_IP}${NC}"
echo ""

# Check 9: Open Ports
echo -e "${YELLOW}[9/12] Checking open ports...${NC}"
if command -v netstat &> /dev/null; then
    echo "Port 80 (HTTP):"
    netstat -tuln | grep :80 || echo "Port 80 not listening"
    echo "Port 443 (HTTPS):"
    netstat -tuln | grep :443 || echo "Port 443 not listening"
elif command -v ss &> /dev/null; then
    echo "Port 80 (HTTP):"
    ss -tuln | grep :80 || echo "Port 80 not listening"
    echo "Port 443 (HTTPS):"
    ss -tuln | grep :443 || echo "Port 443 not listening"
else
    echo -e "${YELLOW}⚠ Cannot check ports (netstat/ss not available)${NC}"
fi
echo ""

# Check 10: Disk Space
echo -e "${YELLOW}[10/12] Checking disk space...${NC}"
df -h / | tail -1 | awk '{print "Used: "$3" / "$2" ("$5")"}'
echo ""

# Check 11: Environment File
echo -e "${YELLOW}[11/12] Checking environment file...${NC}"
if [ -f ".env.prod" ]; then
    echo -e "${GREEN}✓ .env.prod exists${NC}"
    echo "Required variables:"
    grep -E "^(POSTGRES_PASSWORD|SECRET_KEY_BASE|JWT_SECRET_KEY)" .env.prod > /dev/null && echo -e "${GREEN}✓ Core secrets present${NC}" || echo -e "${RED}✗ Missing required secrets${NC}"
else
    echo -e "${RED}✗ .env.prod not found${NC}"
fi
echo ""

# Check 12: Database Connection
echo -e "${YELLOW}[12/12] Checking database...${NC}"
if docker compose -f docker-compose.prod.yml ps postgres 2>/dev/null | grep -q "Up"; then
    echo -e "${GREEN}✓ PostgreSQL container is running${NC}"
    
    # Try to list communities
    echo "Checking communities in database:"
    docker compose -f docker-compose.prod.yml exec -T backend rails runner "
      begin
        count = Community.count
        puts \"✓ Found #{count} communities\"
        Community.limit(5).each do |c|
          puts \"  - #{c.domain} (ID: #{c.id}, Enabled: #{c.is_enabled})\"
        end
      rescue => e
        puts '✗ Database error: ' + e.message
      end
    " 2>/dev/null || echo -e "${YELLOW}⚠ Cannot connect to database (containers might not be running)${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL not running${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    VERIFICATION SUMMARY                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✓ = Pass${NC}  ${RED}✗ = Fail${NC}  ${YELLOW}⚠ = Warning${NC}"
echo ""
echo "If you see any ${RED}red ✗ marks${NC}, please fix them before deploying."
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. If configuration files need updates: git pull"
echo "2. Deploy: docker-compose -f docker-compose.prod.yml down && docker-compose -f docker-compose.prod.yml up -d --build"
echo "3. Test domain: curl -I https://aryasoftwaretech.com"
echo ""

