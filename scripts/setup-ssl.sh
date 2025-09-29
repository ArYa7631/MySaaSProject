#!/bin/bash

# SSL Certificate Setup Script for MySaaSProject
# This script sets up SSL certificates using Let's Encrypt

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN=${DOMAIN:-"yourdomain.com"}
EMAIL=${SSL_EMAIL:-"admin@yourdomain.com"}

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if domain and email are set
check_config() {
    if [[ "$DOMAIN" == "yourdomain.com" ]]; then
        error "Please set your domain in the environment variables"
        echo "Usage: DOMAIN=yourdomain.com SSL_EMAIL=your@email.com ./setup-ssl.sh"
        exit 1
    fi
    
    if [[ "$EMAIL" == "admin@yourdomain.com" ]]; then
        error "Please set your email in the environment variables"
        echo "Usage: DOMAIN=yourdomain.com SSL_EMAIL=your@email.com ./setup-ssl.sh"
        exit 1
    fi
    
    success "Configuration validated"
}

# Update nginx configuration with actual domain
update_nginx_config() {
    log "Updating nginx configuration with domain: $DOMAIN"
    
    # Create temporary nginx config with actual domain
    sed "s/yourdomain.com/$DOMAIN/g" nginx/nginx.prod.conf > nginx/nginx.prod.tmp.conf
    
    success "Nginx configuration updated"
}

# Start nginx for domain validation
start_nginx_for_validation() {
    log "Starting nginx for domain validation..."
    
    # Start nginx with temporary config
    docker-compose -f docker-compose.prod.yml up -d nginx
    
    # Wait for nginx to be ready
    sleep 10
    
    success "Nginx started for validation"
}

# Obtain SSL certificate
obtain_certificate() {
    log "Obtaining SSL certificate for $DOMAIN..."
    
    # Run certbot to obtain certificate
    docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/html \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        -d $DOMAIN \
        -d www.$DOMAIN
    
    success "SSL certificate obtained"
}

# Update nginx with SSL configuration
update_nginx_ssl() {
    log "Updating nginx with SSL configuration..."
    
    # Replace temporary config with SSL-enabled config
    mv nginx/nginx.prod.tmp.conf nginx/nginx.prod.conf
    
    # Restart nginx with SSL configuration
    docker-compose -f docker-compose.prod.yml restart nginx
    
    success "Nginx updated with SSL configuration"
}

# Test SSL certificate
test_ssl() {
    log "Testing SSL certificate..."
    
    # Test HTTPS connection
    if curl -f -s https://$DOMAIN/health > /dev/null; then
        success "SSL certificate is working correctly"
    else
        warning "SSL certificate test failed. Please check the configuration."
    fi
}

# Setup certificate renewal
setup_renewal() {
    log "Setting up certificate renewal..."
    
    # Create renewal script
    cat > scripts/renew-ssl.sh << EOF
#!/bin/bash
# SSL Certificate Renewal Script

docker-compose -f docker-compose.prod.yml run --rm certbot renew
docker-compose -f docker-compose.prod.yml restart nginx
EOF
    
    chmod +x scripts/renew-ssl.sh
    
    # Add to crontab (renew every 2 months)
    (crontab -l 2>/dev/null; echo "0 3 1 */2 * $(pwd)/scripts/renew-ssl.sh") | crontab -
    
    success "Certificate renewal setup completed"
}

# Main function
main() {
    log "Starting SSL setup for domain: $DOMAIN"
    
    check_config
    update_nginx_config
    start_nginx_for_validation
    obtain_certificate
    update_nginx_ssl
    test_ssl
    setup_renewal
    
    success "SSL setup completed successfully!"
    echo ""
    echo "Your website should now be accessible at:"
    echo "  - https://$DOMAIN"
    echo "  - https://www.$DOMAIN"
    echo ""
    echo "Certificate will auto-renew every 2 months."
}

# Handle script arguments
case "${1:-setup}" in
    "setup")
        main
        ;;
    "renew")
        log "Renewing SSL certificate..."
        docker-compose -f docker-compose.prod.yml run --rm certbot renew
        docker-compose -f docker-compose.prod.yml restart nginx
        success "SSL certificate renewed"
        ;;
    "test")
        test_ssl
        ;;
    *)
        echo "Usage: $0 {setup|renew|test}"
        echo ""
        echo "Commands:"
        echo "  setup - Complete SSL setup (default)"
        echo "  renew - Renew existing SSL certificate"
        echo "  test  - Test SSL certificate"
        echo ""
        echo "Environment variables:"
        echo "  DOMAIN      - Your domain name"
        echo "  SSL_EMAIL   - Your email for Let's Encrypt"
        exit 1
        ;;
esac
