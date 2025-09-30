#!/bin/bash

# Quick Deployment Script for Hostinger Server
# This script simplifies the deployment process

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Check if .env.prod exists
check_env_file() {
    if [ ! -f .env.prod ]; then
        error ".env.prod file not found!"
        echo ""
        echo "Please create .env.prod file first:"
        echo "  cp env.prod.example .env.prod"
        echo "  nano .env.prod"
        echo ""
        echo "Make sure to configure all required variables:"
        echo "  - DOMAIN"
        echo "  - SSL_EMAIL"
        echo "  - POSTGRES_PASSWORD"
        echo "  - SECRET_KEY_BASE"
        echo "  - JWT_SECRET_KEY"
        echo "  - S3_ACCESS_KEY_ID"
        echo "  - S3_SECRET_ACCESS_KEY"
        echo "  - S3_BUCKET"
        echo "  - S3_REGION"
        exit 1
    fi
    success ".env.prod file found"
}

# Load environment variables
load_env() {
    log "Loading environment variables..."
    export $(cat .env.prod | grep -v '^#' | xargs)
    success "Environment variables loaded"
}

# Verify required variables
verify_env_vars() {
    log "Verifying required environment variables..."
    
    local missing_vars=()
    
    [ -z "$DOMAIN" ] && missing_vars+=("DOMAIN")
    [ -z "$SSL_EMAIL" ] && missing_vars+=("SSL_EMAIL")
    [ -z "$POSTGRES_PASSWORD" ] && missing_vars+=("POSTGRES_PASSWORD")
    [ -z "$SECRET_KEY_BASE" ] && missing_vars+=("SECRET_KEY_BASE")
    [ -z "$JWT_SECRET_KEY" ] && missing_vars+=("JWT_SECRET_KEY")
    [ -z "$S3_ACCESS_KEY_ID" ] && missing_vars+=("S3_ACCESS_KEY_ID")
    [ -z "$S3_SECRET_ACCESS_KEY" ] && missing_vars+=("S3_SECRET_ACCESS_KEY")
    [ -z "$S3_BUCKET" ] && missing_vars+=("S3_BUCKET")
    [ -z "$S3_REGION" ] && missing_vars+=("S3_REGION")
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        error "Missing required environment variables:"
        printf '%s\n' "${missing_vars[@]}"
        exit 1
    fi
    
    success "All required environment variables are set"
}

# Check if domain DNS is configured
check_dns() {
    log "Checking DNS configuration for $DOMAIN..."
    
    if nslookup $DOMAIN > /dev/null 2>&1; then
        success "DNS is configured for $DOMAIN"
    else
        warning "DNS might not be configured yet for $DOMAIN"
        echo "Make sure your domain's A record points to this server's IP"
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Pull latest code
pull_code() {
    log "Pulling latest code from Git..."
    git pull origin main || {
        warning "Git pull failed or no changes"
    }
    success "Code updated"
}

# Build and start services
deploy_services() {
    log "Building and starting Docker services..."
    
    # Stop existing services
    docker compose -f docker-compose.prod.yml down
    
    # Build and start services
    docker compose -f docker-compose.prod.yml up -d --build
    
    success "Services started"
}

# Wait for database
wait_for_database() {
    log "Waiting for database to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker compose -f docker-compose.prod.yml exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
            success "Database is ready"
            return 0
        fi
        log "Waiting for database... (attempt $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    error "Database failed to start"
    return 1
}

# Run migrations
run_migrations() {
    log "Running database migrations..."
    docker compose -f docker-compose.prod.yml exec backend rails db:migrate
    success "Migrations completed"
}

# Check service health
health_check() {
    log "Running health checks..."
    
    sleep 10
    
    # Check if all services are running
    if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        success "All services are running"
    else
        error "Some services are not running"
        docker compose -f docker-compose.prod.yml ps
        return 1
    fi
}

# Display service status
show_status() {
    echo ""
    echo "======================================"
    echo "Service Status:"
    echo "======================================"
    docker compose -f docker-compose.prod.yml ps
    echo ""
    echo "======================================"
    echo "Deployment Information:"
    echo "======================================"
    echo "Frontend URL: https://$DOMAIN"
    echo "API URL: https://$DOMAIN/api"
    echo "Health Check: https://$DOMAIN/health"
    echo ""
    echo "To view logs:"
    echo "  docker compose -f docker-compose.prod.yml logs -f"
    echo ""
    echo "To view specific service logs:"
    echo "  docker compose -f docker-compose.prod.yml logs -f backend"
    echo "  docker compose -f docker-compose.prod.yml logs -f frontend"
    echo "  docker compose -f docker-compose.prod.yml logs -f nginx"
    echo "======================================"
}

# Main deployment function
main() {
    echo ""
    echo "======================================"
    echo "MySaaSProject - Quick Deployment"
    echo "======================================"
    echo ""
    
    check_env_file
    load_env
    verify_env_vars
    check_dns
    pull_code
    deploy_services
    wait_for_database
    run_migrations
    health_check
    
    echo ""
    success "Deployment completed successfully! 🚀"
    echo ""
    
    show_status
}

# Handle different commands
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "status")
        check_env_file
        load_env
        show_status
        ;;
    "logs")
        docker compose -f docker-compose.prod.yml logs -f
        ;;
    "restart")
        log "Restarting services..."
        docker compose -f docker-compose.prod.yml restart
        success "Services restarted"
        ;;
    "stop")
        log "Stopping services..."
        docker compose -f docker-compose.prod.yml down
        success "Services stopped"
        ;;
    "backup")
        check_env_file
        load_env
        log "Creating database backup..."
        mkdir -p backups
        docker compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres mysaasproject_production > backups/backup_$(date +%Y%m%d_%H%M%S).sql
        success "Database backup created in ./backups/"
        ;;
    "help")
        echo "Usage: $0 {deploy|status|logs|restart|stop|backup|help}"
        echo ""
        echo "Commands:"
        echo "  deploy  - Full deployment (default)"
        echo "  status  - Show service status"
        echo "  logs    - View live logs"
        echo "  restart - Restart all services"
        echo "  stop    - Stop all services"
        echo "  backup  - Create database backup"
        echo "  help    - Show this help message"
        ;;
    *)
        error "Unknown command: $1"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac
