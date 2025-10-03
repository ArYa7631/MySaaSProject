#!/bin/bash

# Script to add SSL certificate for a new domain
# Usage: ./scripts/add-domain-ssl.sh example.com

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if domain is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Domain name is required${NC}"
    echo "Usage: $0 example.com"
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-"admin@${DOMAIN}"}  # Use provided email or generate from domain

echo -e "${GREEN}=== Adding SSL Certificate for ${DOMAIN} ===${NC}\n"

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Certbot not found. Installing...${NC}"
    sudo apt-get update
    sudo apt-get install -y certbot
fi

# Check if domain resolves to this server
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)

echo -e "Server IP: ${GREEN}${SERVER_IP}${NC}"
echo -e "Domain IP: ${GREEN}${DOMAIN_IP}${NC}\n"

if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
    echo -e "${YELLOW}Warning: Domain does not resolve to this server!${NC}"
    echo "Please update your DNS A record to point to ${SERVER_IP}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Stop nginx temporarily to use port 80 for verification
echo -e "${YELLOW}Stopping nginx...${NC}"
docker-compose -f docker-compose.prod.yml stop nginx

# Request certificate using standalone mode
echo -e "${GREEN}Requesting SSL certificate...${NC}"
sudo certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email "${EMAIL}" \
    --domains "${DOMAIN}" \
    --domains "www.${DOMAIN}" \
    || true

# Check if certificate was created
if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
    echo -e "${RED}Failed to create certificate for ${DOMAIN}${NC}"
    echo "Restarting nginx..."
    docker-compose -f docker-compose.prod.yml start nginx
    exit 1
fi

echo -e "${GREEN}Certificate created successfully!${NC}\n"

# Update nginx configuration to include the new domain
# Note: With server_name _; it already accepts all domains
# But we'll log the certificate location for reference
echo -e "Certificate location: ${GREEN}/etc/letsencrypt/live/${DOMAIN}/${NC}"
echo -e "fullchain.pem: /etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
echo -e "privkey.pem: /etc/letsencrypt/live/${DOMAIN}/privkey.pem"

# Start nginx
echo -e "\n${YELLOW}Starting nginx...${NC}"
docker-compose -f docker-compose.prod.yml start nginx

# Wait a moment for nginx to start
sleep 2

# Test nginx configuration
echo -e "\n${YELLOW}Testing nginx configuration...${NC}"
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Reload nginx to apply changes
echo -e "${YELLOW}Reloading nginx...${NC}"
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo -e "\n${GREEN}=== SSL Certificate Setup Complete! ===${NC}"
echo -e "\nNext steps:"
echo "1. Test your domain: https://${DOMAIN}"
echo "2. Certificate will auto-renew via certbot"
echo "   Check status: sudo certbot certificates"
echo ""
echo "Note: Community should already exist in database from user registration"
echo -e "\n${GREEN}Done!${NC}"

