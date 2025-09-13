# Development Guide

This guide provides comprehensive information for developers working on the MySaaSProject application.

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Ruby 3.2+** - [Download](https://www.ruby-lang.org/)
- **PostgreSQL 15+** - [Download](https://www.postgresql.org/)
- **Redis 7+** - [Download](https://redis.io/)
- **Docker & Docker Compose** - [Download](https://www.docker.com/)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mysaasproject.git
   cd mysaasproject
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   cd apps/frontend
   npm install
   
   # Backend dependencies
   cd ../backend
   bundle install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example environment file
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Start the development environment**
   ```bash
   # Start all services with Docker
   docker-compose up -d
   
   # Or start services individually
   # Backend
   cd apps/backend
   rails server -p 3001
   
   # Frontend (in new terminal)
   cd apps/frontend
   npm run dev
   ```

## 🏗️ Project Structure

```
mysaasproject/
├── apps/
│   ├── frontend/                 # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/             # Next.js App Router pages
│   │   │   ├── components/      # React components
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── services/        # API services
│   │   │   ├── utils/           # Utility functions
│   │   │   └── types/           # TypeScript type definitions
│   │   ├── public/              # Static assets
│   │   └── package.json
│   └── backend/                 # Ruby on Rails API
│       ├── app/
│       │   ├── controllers/     # API controllers
│       │   ├── models/          # ActiveRecord models
│       │   ├── services/        # Business logic services
│       │   └── serializers/     # JSON serializers
│       ├── config/              # Rails configuration
│       ├── db/                  # Database migrations
│       └── Gemfile
├── packages/
│   └── shared/                  # Shared types and utilities
├── docs/                        # Documentation
├── scripts/                     # Deployment and utility scripts
└── nginx/                       # Nginx configuration
```

## 🛠️ Development Workflow

### Code Style

#### Frontend (TypeScript/React)
- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Use **functional components** with hooks
- Implement **proper error boundaries**
- Write **comprehensive tests**

#### Backend (Ruby/Rails)
- Follow **RuboCop** style guidelines
- Use **RSpec** for testing
- Implement **service objects** for complex logic
- Use **strong parameters** in controllers
- Follow **RESTful** conventions

### Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(auth): add two-factor authentication"
git commit -m "fix(api): resolve user registration validation issue"
git commit -m "docs: update API documentation"
```

## 🧪 Testing

### Frontend Testing

#### Unit Tests
```bash
cd apps/frontend
npm run test
```

#### E2E Tests
```bash
npm run test:e2e
```

#### Coverage Report
```bash
npm run test:coverage
```

### Backend Testing

#### Unit Tests
```bash
cd apps/backend
bundle exec rspec
```

#### Integration Tests
```bash
bundle exec rspec spec/requests/
```

#### Coverage Report
```bash
COVERAGE=true bundle exec rspec
```

### Testing Best Practices

1. **Write tests first** (TDD approach)
2. **Test edge cases** and error scenarios
3. **Mock external dependencies**
4. **Use descriptive test names**
5. **Keep tests fast and isolated**

## 🔧 Development Tools

### VS Code Extensions

Recommended extensions for development:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "rebornix.ruby",
    "wingrunr21.vscode-ruby",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-docker"
  ]
}
```

### Debugging

#### Frontend Debugging
```bash
# Start with debugging enabled
npm run dev:debug

# Use React Developer Tools browser extension
# Use Next.js debugging features
```

#### Backend Debugging
```bash
# Start Rails server with debugging
rails server -p 3001 --debugger

# Use byebug in your code
byebug
```

### Database Management

#### Rails Console
```bash
cd apps/backend
rails console
```

#### Database Migrations
```bash
# Create migration
rails generate migration AddFieldToModel

# Run migrations
rails db:migrate

# Rollback migration
rails db:rollback
```

#### Database Seeding
```bash
# Run seeds
rails db:seed

# Reset database
rails db:reset
```

## 📦 Package Management

### Frontend Dependencies

#### Adding Dependencies
```bash
cd apps/frontend

# Production dependency
npm install package-name

# Development dependency
npm install --save-dev package-name
```

#### Updating Dependencies
```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update specific package
npm install package-name@latest
```

### Backend Dependencies

#### Adding Gems
```bash
cd apps/backend

# Add to Gemfile
gem 'gem-name'

# Install
bundle install
```

#### Updating Gems
```bash
# Check for updates
bundle outdated

# Update gems
bundle update

# Update specific gem
bundle update gem-name
```

## 🔍 Code Quality

### Linting

#### Frontend
```bash
cd apps/frontend

# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

#### Backend
```bash
cd apps/backend

# Run RuboCop
bundle exec rubocop

# Auto-fix issues
bundle exec rubocop -a
```

### Formatting

#### Frontend
```bash
cd apps/frontend

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

#### Backend
```bash
cd apps/backend

# Format Ruby code
bundle exec standardrb --fix
```

## 🚀 Performance Optimization

### Frontend Optimization

1. **Code Splitting**
   - Use dynamic imports
   - Implement route-based splitting

2. **Image Optimization**
   - Use Next.js Image component
   - Implement lazy loading

3. **Bundle Analysis**
   ```bash
   npm run build:analyze
   ```

### Backend Optimization

1. **Database Optimization**
   - Use proper indexes
   - Implement eager loading
   - Monitor N+1 queries

2. **Caching**
   - Use Redis for caching
   - Implement fragment caching
   - Use HTTP caching headers

3. **Background Jobs**
   - Use Sidekiq for async tasks
   - Implement job queuing

## 🔒 Security

### Frontend Security

1. **Input Validation**
   - Use Zod for schema validation
   - Sanitize user inputs

2. **Authentication**
   - Implement proper JWT handling
   - Use secure storage methods

3. **Content Security Policy**
   - Configure CSP headers
   - Prevent XSS attacks

### Backend Security

1. **Authentication & Authorization**
   - Use strong authentication
   - Implement role-based access

2. **Input Validation**
   - Use strong parameters
   - Validate all inputs

3. **SQL Injection Prevention**
   - Use parameterized queries
   - Avoid raw SQL

## 📊 Monitoring & Logging

### Frontend Monitoring

```javascript
// Error tracking
import * as Sentry from '@sentry/nextjs'

Sentry.captureException(error)

// Performance monitoring
import { track } from '@/utils/analytics'

track('page_view', { page: '/dashboard' })
```

### Backend Monitoring

```ruby
# Logging
Rails.logger.info "User #{user.id} logged in"

# Error tracking
Sentry.capture_exception(exception)

# Performance monitoring
ActiveSupport::Notifications.instrument('custom.event') do
  # Your code here
end
```

## 🔄 Continuous Integration

### Pre-commit Hooks

Install pre-commit hooks:
```bash
# Install husky
npm install --save-dev husky

# Install pre-commit hooks
npx husky install
npx husky add .husky/pre-commit "npm run lint && npm run test"
```

### CI Pipeline

The project uses GitHub Actions for CI/CD:

1. **Linting** - Check code style
2. **Testing** - Run all tests
3. **Security** - Vulnerability scanning
4. **Build** - Create Docker images
5. **Deploy** - Deploy to environments

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Ruby on Rails Guides](https://guides.rubyonrails.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tools
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [RuboCop](https://rubocop.org/)
- [RSpec](https://rspec.info/)

### Best Practices
- [React Best Practices](https://react.dev/learn)
- [Rails Best Practices](https://rails-bestpractices.com/)
- [TypeScript Best Practices](https://github.com/typescript-eslint/typescript-eslint)

## 🤝 Contributing

### Before Contributing

1. **Read the documentation**
2. **Check existing issues**
3. **Follow the coding standards**
4. **Write comprehensive tests**
5. **Update documentation**

### Pull Request Process

1. **Create a feature branch**
2. **Make your changes**
3. **Write/update tests**
4. **Update documentation**
5. **Ensure all tests pass**
6. **Submit pull request**

### Code Review Guidelines

1. **Be constructive and respectful**
2. **Focus on the code, not the person**
3. **Provide specific feedback**
4. **Suggest improvements**
5. **Approve when satisfied**

## 🆘 Getting Help

### Support Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and discussions
- **Documentation** - Comprehensive guides and references
- **Code Comments** - Inline documentation

### Common Issues

#### Frontend Issues
- **Build errors** - Check Node.js version and dependencies
- **Type errors** - Ensure TypeScript types are correct
- **Styling issues** - Verify Tailwind CSS configuration

#### Backend Issues
- **Database errors** - Check migrations and database setup
- **Gem conflicts** - Update Gemfile.lock and run bundle install
- **Rails errors** - Check Rails logs and configuration

---

**Happy coding! 🚀**
