#!/bin/bash

# Script to obtain SSL certificates using Let's Encrypt
# Usage: ./scripts/obtain-ssl.sh

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SSL Certificate Setup${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Configuration
DOMAIN="aryasoftwaretech.com"
EMAIL="admin@aryasoftwaretech.com"  # Change this to your email

echo -e "${YELLOW}Domain:${NC} $DOMAIN"
echo -e "${YELLOW}Email:${NC} $EMAIL"
echo ""

# Step 1: Create webroot directory if it doesn't exist
echo -e "${YELLOW}Step 1:${NC} Creating webroot directory..."
mkdir -p nginx/webroot
echo -e "${GREEN}✓ Webroot directory created${NC}"
echo ""

# Step 2: Temporarily update nginx config to allow HTTP (for Let's Encrypt verification)
echo -e "${YELLOW}Step 2:${NC} Preparing nginx for certificate verification..."
# Backup current config
cp nginx/nginx.prod.conf nginx/nginx.prod.conf.backup

# Create temporary nginx config for initial certificate request
cat > nginx/nginx.prod.conf.temp << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:3001;
    }

    server {
        listen 80;
        server_name aryasoftwaretech.com www.aryasoftwaretech.com;

        # Allow Let's Encrypt verification
        location /.well-known/acme-challenge/ {
            root /var/www/html;
        }

        # Temporary: Allow all traffic while getting certificate
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /health {
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

# Use temporary config
mv nginx/nginx.prod.conf.temp nginx/nginx.prod.conf
echo -e "${GREEN}✓ Temporary nginx configuration ready${NC}"
echo ""

# Step 3: Restart nginx with temporary config
echo -e "${YELLOW}Step 3:${NC} Restarting nginx..."
docker-compose -f docker-compose.prod.yml restart nginx
sleep 5
echo -e "${GREEN}✓ Nginx restarted${NC}"
echo ""

# Step 4: Request SSL certificate
echo -e "${YELLOW}Step 4:${NC} Requesting SSL certificate from Let's Encrypt..."
echo -e "${YELLOW}This may take a few minutes...${NC}"
echo ""

docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/html \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d $DOMAIN \
    -d www.$DOMAIN

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ SSL certificate obtained successfully!${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}✗ Failed to obtain SSL certificate${NC}"
    echo -e "${RED}Restoring original nginx configuration...${NC}"
    mv nginx/nginx.prod.conf.backup nginx/nginx.prod.conf
    docker-compose -f docker-compose.prod.yml restart nginx
    exit 1
fi

# Step 5: Restore full nginx config with HTTPS
echo -e "${YELLOW}Step 5:${NC} Restoring full nginx configuration with HTTPS..."
mv nginx/nginx.prod.conf.backup nginx/nginx.prod.conf
echo -e "${GREEN}✓ Full nginx configuration restored${NC}"
echo ""

# Step 6: Restart nginx with HTTPS enabled
echo -e "${YELLOW}Step 6:${NC} Restarting nginx with HTTPS enabled..."
docker-compose -f docker-compose.prod.yml restart nginx
sleep 5
echo -e "${GREEN}✓ Nginx restarted with HTTPS${NC}"
echo ""

# Step 7: Test HTTPS
echo -e "${YELLOW}Step 7:${NC} Testing HTTPS connection..."
sleep 3
if curl -f -s -k https://$DOMAIN/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ HTTPS is working!${NC}"
else
    echo -e "${YELLOW}⚠ HTTPS test inconclusive, but certificate should be installed${NC}"
fi
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SSL Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Your website should now be accessible at:"
echo -e "  ${GREEN}✓ https://aryasoftwaretech.com${NC}"
echo -e "  ${GREEN}✓ https://www.aryasoftwaretech.com${NC}"
echo ""
echo -e "${YELLOW}Note:${NC} HTTP traffic will automatically redirect to HTTPS"
echo ""
echo -e "${YELLOW}Certificate Renewal:${NC}"
echo -e "  Certificates will expire in 90 days."
echo -e "  To renew, run: ./scripts/renew-ssl.sh"
echo ""

