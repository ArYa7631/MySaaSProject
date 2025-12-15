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
