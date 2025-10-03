#!/bin/bash

# Manual SSL Setup - Step by Step
# This script helps you set up SSL manually with better debugging

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

DOMAIN="aryasoftwaretech.com"
EMAIL="aryasoftwaretech@gmail.com"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Manual SSL Certificate Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Domain:${NC} $DOMAIN"
echo -e "${YELLOW}Email:${NC} $EMAIL"
echo ""
echo -e "${RED}NOTE: This is a step-by-step manual process${NC}"
echo ""

# Step 1: Create and test webroot
echo -e "${GREEN}Step 1: Creating webroot directory${NC}"
mkdir -p nginx/webroot/.well-known/acme-challenge
chmod -R 777 nginx/webroot
echo "test-file-for-letsencrypt" > nginx/webroot/.well-known/acme-challenge/test.txt
echo -e "Created test file at: nginx/webroot/.well-known/acme-challenge/test.txt"
echo ""

# Step 2: Create simple nginx config for verification
echo -e "${GREEN}Step 2: Creating simple nginx config${NC}"
cat > nginx/nginx.temp.conf << 'EOFNGINX'
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

        # Critical: Serve Let's Encrypt challenges FIRST
        location /.well-known/acme-challenge/ {
            root /var/www/html;
            default_type text/plain;
            try_files $uri =404;
        }

        # All other requests go to frontend
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
EOFNGINX

# Backup current config
cp nginx/nginx.prod.conf nginx/nginx.prod.conf.backup

# Use temporary config
cp nginx/nginx.temp.conf nginx/nginx.prod.conf

echo -e "${GREEN}✓ Nginx config created${NC}"
echo ""

# Step 3: Restart nginx
echo -e "${GREEN}Step 3: Restarting nginx${NC}"
docker-compose -f docker-compose.prod.yml restart nginx
sleep 5
echo -e "${GREEN}✓ Nginx restarted${NC}"
echo ""

# Step 4: Test webroot accessibility
echo -e "${GREEN}Step 4: Testing if webroot is accessible${NC}"
echo ""
echo -e "${YELLOW}Testing URL: http://$DOMAIN/.well-known/acme-challenge/test.txt${NC}"
sleep 3

if curl -v http://$DOMAIN/.well-known/acme-challenge/test.txt 2>&1 | grep -q "test-file-for-letsencrypt"; then
    echo -e "${GREEN}✓✓✓ SUCCESS! Webroot is accessible!${NC}"
    echo ""
else
    echo -e "${RED}✗✗✗ FAILED! Webroot is NOT accessible${NC}"
    echo ""
    echo -e "${YELLOW}Debugging information:${NC}"
    echo "1. Check if webroot directory exists in nginx container:"
    echo "   docker-compose -f docker-compose.prod.yml exec nginx ls -la /var/www/html/.well-known/acme-challenge/"
    echo ""
    echo "2. Check nginx logs:"
    echo "   docker-compose -f docker-compose.prod.yml logs nginx --tail=20"
    echo ""
    echo "3. Try accessing from browser: http://$DOMAIN/.well-known/acme-challenge/test.txt"
    echo ""
    echo -e "${RED}Fix the above issues before proceeding!${NC}"
    exit 1
fi

# Step 5: Request certificate
echo -e "${GREEN}Step 5: Requesting SSL certificate from Let's Encrypt${NC}"
echo -e "${YELLOW}This will take a few minutes...${NC}"
echo ""

docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/html \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    --verbose \
    -d $DOMAIN \
    -d www.$DOMAIN

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓✓✓ SSL Certificate obtained successfully!${NC}"
    echo ""
    
    # Step 6: Restore full nginx config
    echo -e "${GREEN}Step 6: Restoring full nginx config with HTTPS${NC}"
    mv nginx/nginx.prod.conf.backup nginx/nginx.prod.conf
    
    # Step 7: Restart nginx
    echo -e "${GREEN}Step 7: Restarting nginx with HTTPS${NC}"
    docker-compose -f docker-compose.prod.yml restart nginx
    sleep 5
    
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ SSL SETUP COMPLETE!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "Your site should now be accessible at:"
    echo -e "  ${GREEN}✓ https://aryasoftwaretech.com${NC}"
    echo -e "  ${GREEN}✓ https://www.aryasoftwaretech.com${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}✗✗✗ Failed to obtain SSL certificate${NC}"
    echo ""
    echo -e "${YELLOW}Restoring original config...${NC}"
    mv nginx/nginx.prod.conf.backup nginx/nginx.prod.conf
    docker-compose -f docker-compose.prod.yml restart nginx
    exit 1
fi