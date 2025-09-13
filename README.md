# MySaaSProject

A modern SaaS application built with Next.js frontend and Ruby on Rails backend, designed for community management and landing page building.

## 🚀 Features

### Frontend (Next.js)
- **Modern UI/UX**: Built with Tailwind CSS and Radix UI components
- **Type Safety**: Full TypeScript support throughout the application
- **State Management**: React Query for server state, custom hooks for client state
- **Landing Page Builder**: Dynamic section-based landing page creation
- **Admin Dashboard**: Comprehensive admin interface for community management
- **Authentication**: JWT-based authentication with persistent sessions
- **Responsive Design**: Mobile-first responsive design
- **Dark Mode**: Built-in dark/light theme support

### Backend (Ruby on Rails)
- **RESTful API**: Clean, RESTful API design
- **Authentication**: JWT-based authentication system
- **Community Management**: Multi-tenant community system
- **File Upload**: Secure file upload with validation
- **Analytics**: Built-in analytics and tracking
- **Database**: PostgreSQL with ActiveRecord ORM
- **Caching**: Redis-based caching system

## 🏗️ Architecture

```
mysaasproject/
├── apps/
│   ├── frontend/          # Next.js frontend application
│   └── backend/           # Ruby on Rails API
├── packages/
│   └── shared/            # Shared types and utilities
├── nginx/                 # Nginx configuration
├── docker-compose.yml     # Docker Compose setup
└── README.md             # This file
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library + Playwright

### Backend
- **Framework**: Ruby on Rails 7
- **Language**: Ruby 3.2
- **Database**: PostgreSQL
- **Caching**: Redis
- **Authentication**: JWT
- **Testing**: RSpec

### DevOps
- **Containerization**: Docker
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt
- **CI/CD**: GitHub Actions
- **Monitoring**: Built-in health checks

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- Ruby 3.2+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose

### 🚀 Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mysaasproject.git
   cd mysaasproject
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the application in development mode**
   ```bash
   # For development (recommended)
   docker-compose -f docker-compose.dev.yml up -d
   
   # For production
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Backend Health Check: http://localhost:3001/health
   - Admin Dashboard: http://localhost:3000/admin

### 🛠️ Manual Installation (Local Development)

#### Backend Server Setup
```bash
# Navigate to backend directory
cd apps/backend

# Install Ruby dependencies
bundle install

# Set up database
rails db:create
rails db:migrate
rails db:seed

# Start the Rails server
rails server -p 3001
```

#### Frontend Server Setup
```bash
# Navigate to frontend directory
cd apps/frontend

# Install Node.js dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

### 🔧 Development Commands

#### Docker Commands
```bash
# Start all services in development mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down

# Rebuild and restart
docker-compose -f docker-compose.dev.yml up -d --build

# Access backend container
docker exec -it mysaasproject-backend-1 bash

# Access database
docker exec -it mysaasproject-postgres-1 psql -U postgres -d mysaasproject_development
```

#### Backend Commands
```bash
# Database operations
rails db:create                    # Create database
rails db:migrate                   # Run migrations
rails db:seed                      # Seed database
rails db:reset                     # Reset database
rails db:migrate:status            # Check migration status

# Rails console
rails console                      # Start Rails console
rails console --environment=production  # Production console

# Testing
bundle exec rspec                  # Run all tests
bundle exec rspec spec/models/     # Run model tests
bundle exec rspec spec/controllers/ # Run controller tests

# Server
rails server -p 3001              # Start server on port 3001
rails server -b 0.0.0.0 -p 3001   # Start server accessible from outside
```

#### Frontend Commands
```bash
# Development
npm run dev                        # Start development server
npm run build                      # Build for production
npm run start                      # Start production server
npm run lint                       # Run ESLint
npm run lint:fix                   # Fix ESLint issues

# Testing
npm run test                       # Run unit tests
npm run test:watch                 # Run tests in watch mode
npm run test:coverage              # Run tests with coverage
npm run test:e2e                   # Run E2E tests

# Type checking
npm run type-check                 # Run TypeScript type checking
```

### 🐛 Troubleshooting

#### Common Issues

1. **Backend not connecting to database**
   ```bash
   # Check if PostgreSQL is running
   docker ps | grep postgres
   
   # Check database connection
   docker exec mysaasproject-backend-1 rails db:migrate:status
   ```

2. **Frontend not connecting to backend**
   ```bash
   # Check if backend is running
   curl http://localhost:3001/health
   
   # Check CORS configuration in backend
   # Verify NEXT_PUBLIC_API_URL in frontend .env.local
   ```

3. **Port conflicts**
   ```bash
   # Check what's using the ports
   lsof -i :3000  # Frontend port
   lsof -i :3001  # Backend port
   lsof -i :5432  # PostgreSQL port
   ```

4. **Docker issues**
   ```bash
   # Clean up Docker containers and volumes
   docker-compose down -v
   docker system prune -a
   
   # Rebuild from scratch
   docker-compose -f docker-compose.dev.yml up -d --build
   ```

### 📋 Environment Setup Checklist

- [ ] Docker and Docker Compose installed
- [ ] Environment variables configured (.env file)
- [ ] Database created and migrated
- [ ] Backend server running on port 3001
- [ ] Frontend server running on port 3000
- [ ] Health check endpoint responding
- [ ] API endpoints accessible

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

#### Backend (.env)
```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@postgres:5432/mysaasproject_development
RAILS_ENV=development

# Redis Configuration
REDIS_URL=redis://redis:6379/0

# Security Keys (Generate your own)
JWT_SECRET_KEY=your_jwt_secret_key_here
SECRET_KEY_BASE=your_rails_secret_key_base_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 🗂️ Important Project Information

#### Project Structure
```
mysaasproject/
├── apps/
│   ├── frontend/                 # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/             # App Router pages
│   │   │   ├── components/      # React components
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── services/        # API service functions
│   │   │   └── types/           # TypeScript type definitions
│   │   ├── public/              # Static assets
│   │   └── package.json         # Frontend dependencies
│   └── backend/                 # Ruby on Rails API
│       ├── app/
│       │   ├── controllers/     # API controllers
│       │   ├── models/          # ActiveRecord models
│       │   ├── serializers/     # JSON serializers
│       │   └── views/           # View templates
│       ├── config/              # Rails configuration
│       ├── db/                  # Database files
│       │   ├── migrate/         # Database migrations
│       │   └── seeds.rb         # Database seeds
│       └── Gemfile              # Ruby dependencies
├── packages/
│   └── shared/                  # Shared types and utilities
├── nginx/                       # Nginx configuration
├── docker-compose.yml           # Production Docker setup
├── docker-compose.dev.yml       # Development Docker setup
└── README.md                    # This file
```

#### Key Features & Components

**Frontend Features:**
- **Landing Page Builder**: Dynamic section-based landing page creation
- **Admin Dashboard**: Community management interface
- **Authentication System**: JWT-based login/register
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Theme switching capability

**Backend Features:**
- **Multi-tenant Architecture**: Community-based organization
- **RESTful API**: Clean API design with proper HTTP methods
- **JWT Authentication**: Secure token-based authentication
- **File Upload**: Secure file handling with validation
- **Database Relations**: Complex relationships between entities

#### Database Schema
- **Users**: User authentication and profile data
- **Communities**: Multi-tenant community management
- **Landing Pages**: Dynamic landing page configurations
- **Content Pages**: Static content management
- **Marketplace Configurations**: E-commerce settings
- **Translations**: Multi-language support

#### API Endpoints Overview
- **Authentication**: `/api/auth/*` - Login, register, password reset
- **Communities**: `/api/v1/communities/*` - Community management
- **Landing Pages**: `/api/v1/communities/:id/landing_page` - Landing page config
- **Content**: `/api/v1/communities/:id/content_pages` - Content management
- **Health Check**: `/health` - System health monitoring

#### Development Workflow
1. **Backend First**: Start with Rails API development
2. **Database Migrations**: Use Rails migrations for schema changes
3. **API Testing**: Test endpoints with RSpec
4. **Frontend Integration**: Connect Next.js to Rails API
5. **Component Development**: Build reusable React components
6. **E2E Testing**: Test complete user workflows

#### Production Considerations
- **Environment Variables**: Secure configuration management
- **Database Backups**: Regular PostgreSQL backups
- **SSL Certificates**: Let's Encrypt integration
- **Monitoring**: Health checks and logging
- **Scaling**: Docker-based horizontal scaling

## 🧪 Testing

### Frontend Tests
```bash
cd apps/frontend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:coverage # Coverage report
```

### Backend Tests
```bash
cd apps/backend
bundle exec rspec
```

## 🚀 Deployment

### Production Deployment

1. **Build Docker images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Set production environment variables**
   ```bash
   export NODE_ENV=production
   export RAILS_ENV=production
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow that:
- Runs tests and linting
- Builds Docker images
- Deploys to staging/production
- Performs security scans
- Runs performance tests

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Community Endpoints

```http
GET    /api/v1/communities
POST   /api/v1/communities
GET    /api/v1/communities/:id
PUT    /api/v1/communities/:id
DELETE /api/v1/communities/:id
```

### Landing Page Endpoints

```http
GET  /api/v1/communities/:id/landing_page
PUT  /api/v1/communities/:id/landing_page
GET  /api/v1/communities/:id/marketplace_configuration
PUT  /api/v1/communities/:id/marketplace_configuration
```

## 🎨 Customization

### Adding New Sections

1. Create a new section component in `apps/frontend/src/components/sections/`
2. Add the section type to the renderer in `apps/frontend/src/components/sections/render-sections.tsx`
3. Update the section builder in `apps/frontend/src/components/admin/section-builder.tsx`

### Styling

The application uses Tailwind CSS for styling. Custom styles can be added in:
- `apps/frontend/src/app/globals.css`
- Component-specific CSS modules
- Tailwind configuration in `apps/frontend/tailwind.config.js`

## 🔒 Security

- JWT-based authentication
- CORS configuration
- Rate limiting
- Input validation
- SQL injection protection
- XSS protection
- CSRF protection

## 📊 Monitoring

- Health check endpoints
- Application logging
- Error tracking
- Performance monitoring
- Analytics integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation
- Ensure all tests pass
- Follow the commit message convention

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-username/mysaasproject/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/mysaasproject/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/mysaasproject/discussions)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Ruby on Rails team for the robust backend framework
- Tailwind CSS for the utility-first CSS framework
- Radix UI for the accessible component primitives
- All contributors and maintainers

## 🚀 Quick Reference

### Most Common Commands

#### Start Development Environment
```bash
# Start everything with Docker (recommended)
docker-compose -f docker-compose.dev.yml up -d

# Check if everything is running
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

#### Backend Commands
```bash
# Start backend server
cd apps/backend && rails server -p 3001

# Database operations
rails db:migrate
rails db:seed
rails console

# Run tests
bundle exec rspec
```

#### Frontend Commands
```bash
# Start frontend server
cd apps/frontend && npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

#### Health Checks
```bash
# Backend health
curl http://localhost:3001/health

# Frontend (should show Next.js page)
curl http://localhost:3000

# Database connection
docker exec mysaasproject-backend-1 rails db:migrate:status
```

#### Troubleshooting
```bash
# Restart everything
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d

# Clean rebuild
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d --build

# Check container logs
docker logs mysaasproject-backend-1
docker logs mysaasproject-frontend-1
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Admin Dashboard**: http://localhost:3000/admin

---

**Built with ❤️ by the MySaaSProject team**

