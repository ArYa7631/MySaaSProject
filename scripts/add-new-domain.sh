#!/bin/bash
# Script to add a new domain with SSL certificate and nginx configuration
# Usage: ./scripts/add-new-domain.sh example.com

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

if [ -z "$1" ]; then
    echo -e "${RED}Error: Domain name required${NC}"
    echo "Usage: $0 example.com"
    exit 1
fi

DOMAIN=$1
NGINX_CONF="nginx/nginx.prod.conf"

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Add New Domain - Complete Setup       ║${NC}"
echo -e "${BLUE}║     Domain: ${DOMAIN}                      ${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check DNS
echo -e "${YELLOW}[1/5] Checking DNS...${NC}"
SERVER_IP=$(curl -4 -s ifconfig.me)
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)

echo "Server IP: ${SERVER_IP}"
echo "Domain IP: ${DOMAIN_IP}"

if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
    echo -e "${YELLOW}⚠ Warning: DNS may not be configured correctly${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    [[ ! $REPLY =~ ^[Yy]$ ]] && exit 1
fi

# Step 2: Get SSL Certificate
echo -e "\n${YELLOW}[2/5] Requesting SSL certificate...${NC}"
docker compose -f docker-compose.prod.yml stop nginx

sudo certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email "admin@${DOMAIN}" \
    -d "${DOMAIN}" \
    -d "www.${DOMAIN}" || {
        echo -e "${RED}Failed to get certificate${NC}"
        docker compose -f docker-compose.prod.yml start nginx
        exit 1
    }

echo -e "${GREEN}✓ Certificate obtained${NC}"

# Step 3: Copy certificates to nginx folder
echo -e "\n${YELLOW}[3/5] Copying certificates...${NC}"
cp -r /etc/letsencrypt/* nginx/ssl/
chmod -R 755 nginx/ssl/
echo -e "${GREEN}✓ Certificates copied${NC}"

# Step 4: Add server block to nginx config (FIXED - adds inside http block)
echo -e "\n${YELLOW}[4/5] Updating nginx configuration...${NC}"

if grep -q "server_name ${DOMAIN}" $NGINX_CONF; then
    echo -e "${YELLOW}⚠ Domain already in config${NC}"
else
    # Add new server block BEFORE the closing } of http block
    sed -i "/^}$/i\\
\\
    # ${DOMAIN}\\
    server {\\
        listen 443 ssl http2;\\
        server_name ${DOMAIN} www.${DOMAIN};\\
\\
        ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;\\
        ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;\\
        ssl_protocols TLSv1.2 TLSv1.3;\\
        ssl_ciphers HIGH:!aNULL:!MD5;\\
        ssl_prefer_server_ciphers on;\\
        ssl_session_cache shared:SSL:10m;\\
        ssl_session_timeout 10m;\\
\\
        add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;\\
        add_header X-Frame-Options \"SAMEORIGIN\" always;\\
        add_header X-Content-Type-Options \"nosniff\" always;\\
        add_header X-XSS-Protection \"1; mode=block\" always;\\
\\
        location /health {\\
            return 200 \"healthy\\\\n\";\\
            add_header Content-Type text/plain;\\
        }\\
\\
        location / {\\
            set \$frontend http://frontend:3000;\\
            proxy_pass \$frontend;\\
            proxy_http_version 1.1;\\
            proxy_set_header Upgrade \$http_upgrade;\\
            proxy_set_header Connection '\''upgrade'\'';\\
            proxy_set_header Host \$host;\\
            proxy_set_header X-Real-IP \$remote_addr;\\
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;\\
            proxy_set_header X-Forwarded-Proto \$scheme;\\
            proxy_cache_bypass \$http_upgrade;\\
            proxy_read_timeout 86400;\\
        }\\
\\
        location /api/ {\\
            set \$backend http://backend:3001;\\
            proxy_pass \$backend;\\
            proxy_http_version 1.1;\\
            proxy_set_header Upgrade \$http_upgrade;\\
            proxy_set_header Connection '\''upgrade'\'';\\
            proxy_set_header Host \$host;\\
            proxy_set_header X-Real-IP \$remote_addr;\\
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;\\
            proxy_set_header X-Forwarded-Proto \$scheme;\\
            proxy_cache_bypass \$http_upgrade;\\
            proxy_read_timeout 30s;\\
            proxy_connect_timeout 30s;\\
            proxy_send_timeout 30s;\\
        }\\
    }\\
" $NGINX_CONF
    
    echo -e "${GREEN}✓ Nginx config updated${NC}"
fi

# Step 5: Start and test
echo -e "\n${YELLOW}[5/5] Starting nginx...${NC}"
docker compose -f docker-compose.prod.yml start nginx
sleep 3

docker compose -f docker-compose.prod.yml exec nginx nginx -t
if [ $? -eq 0 ]; then
    docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
    echo -e "${GREEN}✓ Nginx reloaded${NC}"
else
    echo -e "${RED}✗ Nginx config test failed${NC}"
    exit 1
fi

# Final test
echo -e "\n${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║            Setup Complete!                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Domain: https://${DOMAIN}${NC}"
echo ""
echo "Testing..."
curl -I https://${DOMAIN} 2>&1 | head -3
echo ""
echo -e "${YELLOW}Important:${NC}"
echo "User must register on https://aryasoftwaretech.com"
echo "with domain: ${DOMAIN}"
echo ""
echo "Verify community exists in database:"
echo "  docker compose -f docker-compose.prod.yml exec backend rails runner \"puts Community.find_by(domain: '${DOMAIN}')&.domain || 'Not found'\""

