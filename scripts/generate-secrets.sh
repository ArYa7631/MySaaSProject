#!/bin/bash

# Generate Secrets Script
# This script helps generate secure secrets for production deployment

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "======================================"
echo "Production Secrets Generator"
echo "======================================"
echo ""
echo -e "${YELLOW}This script will generate secure secrets for your production deployment.${NC}"
echo ""

# Function to generate a secret
generate_secret() {
    openssl rand -hex 32
}

# Function to generate a base64 secret
generate_base64_secret() {
    openssl rand -base64 32
}

# Function to generate Rails secret
generate_rails_secret() {
    # This generates a 128-character hex string similar to 'rails secret'
    openssl rand -hex 64
}

echo -e "${BLUE}Generating secrets...${NC}"
echo ""

# Generate all secrets
POSTGRES_PASSWORD=$(generate_base64_secret)
SECRET_KEY_BASE=$(generate_rails_secret)
JWT_SECRET_KEY=$(generate_secret)

# Display generated secrets
echo "======================================"
echo "Generated Secrets (COPY THESE):"
echo "======================================"
echo ""
echo -e "${GREEN}POSTGRES_PASSWORD:${NC}"
echo "$POSTGRES_PASSWORD"
echo ""
echo -e "${GREEN}SECRET_KEY_BASE:${NC}"
echo "$SECRET_KEY_BASE"
echo ""
echo -e "${GREEN}JWT_SECRET_KEY:${NC}"
echo "$JWT_SECRET_KEY"
echo ""
echo "======================================"
echo ""

# Ask if user wants to create .env.prod file
read -p "Do you want to create/update .env.prod file with these secrets? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Prompt for other required values
    echo ""
    echo "Please provide the following information:"
    echo ""
    
    read -p "Your domain (e.g., myapp.com): " DOMAIN
    read -p "Your email for SSL (e.g., admin@myapp.com): " SSL_EMAIL
    read -p "AWS S3 Access Key ID: " S3_ACCESS_KEY_ID
    read -p "AWS S3 Secret Access Key: " S3_SECRET_ACCESS_KEY
    read -p "AWS S3 Bucket Name: " S3_BUCKET
    read -p "AWS S3 Region (e.g., ap-southeast-2, us-east-1): " S3_REGION
    
    # Create .env.prod file
    cat > .env.prod << EOF
# Production Environment Variables
# Generated on $(date)
# WARNING: Keep this file secure and never commit to Git!

# Domain Configuration
DOMAIN=$DOMAIN
SSL_EMAIL=$SSL_EMAIL

# Database Configuration
POSTGRES_PASSWORD=$POSTGRES_PASSWORD

# Rails Secrets
SECRET_KEY_BASE=$SECRET_KEY_BASE
JWT_SECRET_KEY=$JWT_SECRET_KEY

# AWS S3 Configuration (for file uploads)
S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY
S3_BUCKET=$S3_BUCKET
S3_REGION=$S3_REGION
EOF
    
    echo ""
    echo -e "${GREEN}✓ .env.prod file created successfully!${NC}"
    echo ""
    echo "======================================"
    echo "Next Steps:"
    echo "======================================"
    echo "1. Review the .env.prod file"
    echo "2. Ensure all values are correct"
    echo "3. NEVER commit this file to Git"
    echo "4. Copy this file to your production server"
    echo "5. Proceed with deployment"
    echo ""
else
    echo ""
    echo "======================================"
    echo "Manual Setup:"
    echo "======================================"
    echo "1. Copy the secrets above"
    echo "2. Copy env.prod.example to .env.prod"
    echo "3. Paste the generated secrets"
    echo "4. Fill in other required values"
    echo ""
fi

echo "======================================"
echo -e "${YELLOW}IMPORTANT SECURITY NOTES:${NC}"
echo "======================================"
echo "• Keep these secrets secure"
echo "• Never commit .env.prod to Git"
echo "• Use different secrets for dev/staging/prod"
echo "• Rotate secrets regularly"
echo "• Store backup of secrets in a secure location"
echo "======================================"
echo ""
