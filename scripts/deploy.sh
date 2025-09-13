#!/bin/bash

# MySaaSProject Deployment Script
# This script handles production deployment of the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-ghcr.io}
IMAGE_NAME=${IMAGE_NAME:-mysaasproject}
VERSION=${VERSION:-$(git rev-parse --short HEAD)}

# Logging function
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

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check if required environment variables are set
    if [[ -z "$SECRET_KEY_BASE" ]]; then
        error "SECRET_KEY_BASE environment variable is not set"
        exit 1
    fi
    
    if [[ -z "$JWT_SECRET_KEY" ]]; then
        error "JWT_SECRET_KEY environment variable is not set"
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Build Docker images
build_images() {
    log "Building Docker images..."
    
    # Build frontend image
    log "Building frontend image..."
    docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}/frontend:${VERSION} ./apps/frontend
    docker tag ${DOCKER_REGISTRY}/${IMAGE_NAME}/frontend:${VERSION} ${DOCKER_REGISTRY}/${IMAGE_NAME}/frontend:latest
    
    # Build backend image
    log "Building backend image..."
    docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}/backend:${VERSION} ./apps/backend
    docker tag ${DOCKER_REGISTRY}/${IMAGE_NAME}/backend:${VERSION} ${DOCKER_REGISTRY}/${IMAGE_NAME}/backend:latest
    
    success "Docker images built successfully"
}

# Push Docker images
push_images() {
    log "Pushing Docker images to registry..."
    
    # Login to registry if credentials are provided
    if [[ -n "$DOCKER_USERNAME" && -n "$DOCKER_PASSWORD" ]]; then
        echo "$DOCKER_PASSWORD" | docker login ${DOCKER_REGISTRY} -u "$DOCKER_USERNAME" --password-stdin
    fi
    
    # Push frontend image
    log "Pushing frontend image..."
    docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}/frontend:${VERSION}
    docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}/frontend:latest
    
    # Push backend image
    log "Pushing backend image..."
    docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}/backend:${VERSION}
    docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}/backend:latest
    
    success "Docker images pushed successfully"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Wait for database to be ready
    log "Waiting for database to be ready..."
    timeout 60 bash -c 'until docker-compose exec -T postgres pg_isready -U postgres; do sleep 2; done'
    
    # Run migrations
    docker-compose exec -T backend rails db:migrate
    
    success "Database migrations completed"
}

# Deploy application
deploy_application() {
    log "Deploying application..."
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose down --remove-orphans
    
    # Pull latest images
    log "Pulling latest images..."
    docker-compose pull
    
    # Start services
    log "Starting services..."
    docker-compose up -d
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    timeout 120 bash -c 'until docker-compose ps | grep -q "Up"; do sleep 5; done'
    
    success "Application deployed successfully"
}

# Run health checks
health_check() {
    log "Running health checks..."
    
    # Check if services are responding
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log "Health check attempt $attempt/$max_attempts"
        
        # Check frontend
        if curl -f -s http://localhost:3000/health > /dev/null; then
            success "Frontend health check passed"
        else
            warning "Frontend health check failed (attempt $attempt)"
        fi
        
        # Check backend
        if curl -f -s http://localhost:3001/health > /dev/null; then
            success "Backend health check passed"
        else
            warning "Backend health check failed (attempt $attempt)"
        fi
        
        # Check if all services are healthy
        if docker-compose ps | grep -q "Up" && ! docker-compose ps | grep -q "Exit"; then
            success "All services are healthy"
            return 0
        fi
        
        sleep 10
        attempt=$((attempt + 1))
    done
    
    error "Health checks failed after $max_attempts attempts"
    return 1
}

# Backup database
backup_database() {
    log "Creating database backup..."
    
    local backup_dir="./backups"
    local timestamp=$(date +'%Y%m%d_%H%M%S')
    local backup_file="${backup_dir}/backup_${timestamp}.sql"
    
    # Create backup directory if it doesn't exist
    mkdir -p "$backup_dir"
    
    # Create backup
    docker-compose exec -T postgres pg_dump -U postgres mysaasproject_production > "$backup_file"
    
    # Compress backup
    gzip "$backup_file"
    
    success "Database backup created: ${backup_file}.gz"
}

# Rollback deployment
rollback() {
    log "Rolling back deployment..."
    
    # Stop current deployment
    docker-compose down
    
    # Revert to previous version
    if [[ -n "$PREVIOUS_VERSION" ]]; then
        log "Rolling back to version: $PREVIOUS_VERSION"
        
        # Update docker-compose.yml with previous version
        sed -i "s/image: ${DOCKER_REGISTRY}\/${IMAGE_NAME}\/frontend:.*/image: ${DOCKER_REGISTRY}\/${IMAGE_NAME}\/frontend:${PREVIOUS_VERSION}/" docker-compose.yml
        sed -i "s/image: ${DOCKER_REGISTRY}\/${IMAGE_NAME}\/backend:.*/image: ${DOCKER_REGISTRY}\/${IMAGE_NAME}\/backend:${PREVIOUS_VERSION}/" docker-compose.yml
        
        # Start services with previous version
        docker-compose up -d
        
        success "Rollback completed"
    else
        error "No previous version available for rollback"
        exit 1
    fi
}

# Cleanup old images
cleanup() {
    log "Cleaning up old Docker images..."
    
    # Remove dangling images
    docker image prune -f
    
    # Remove old images (keep last 5 versions)
    docker images ${DOCKER_REGISTRY}/${IMAGE_NAME}/frontend --format "table {{.Repository}}:{{.Tag}}" | tail -n +6 | awk '{print $1}' | xargs -r docker rmi
    docker images ${DOCKER_REGISTRY}/${IMAGE_NAME}/backend --format "table {{.Repository}}:{{.Tag}}" | tail -n +6 | awk '{print $1}' | xargs -r docker rmi
    
    success "Cleanup completed"
}

# Main deployment function
main() {
    log "Starting deployment for environment: $ENVIRONMENT"
    
    # Store current version for potential rollback
    PREVIOUS_VERSION=$(docker-compose images -q backend | head -1 | cut -d: -f2 2>/dev/null || echo "")
    
    # Run deployment steps
    check_prerequisites
    backup_database
    build_images
    push_images
    deploy_application
    run_migrations
    health_check
    
    if [ $? -eq 0 ]; then
        success "Deployment completed successfully!"
        cleanup
    else
        error "Deployment failed!"
        rollback
        exit 1
    fi
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "build")
        check_prerequisites
        build_images
        ;;
    "push")
        push_images
        ;;
    "migrate")
        run_migrations
        ;;
    "health")
        health_check
        ;;
    "rollback")
        rollback
        ;;
    "cleanup")
        cleanup
        ;;
    "backup")
        backup_database
        ;;
    *)
        echo "Usage: $0 {deploy|build|push|migrate|health|rollback|cleanup|backup}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Full deployment (default)"
        echo "  build    - Build Docker images only"
        echo "  push     - Push Docker images only"
        echo "  migrate  - Run database migrations only"
        echo "  health   - Run health checks only"
        echo "  rollback - Rollback to previous version"
        echo "  cleanup  - Clean up old Docker images"
        echo "  backup   - Create database backup"
        exit 1
        ;;
esac
