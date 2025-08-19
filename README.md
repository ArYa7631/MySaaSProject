# MySaaSProject

A modern SaaS application built with Ruby on Rails (API) and Next.js 14, organized as a monorepo.

## 🏗️ Architecture

- **Backend**: Ruby on Rails 7 (API mode) with PostgreSQL, Devise + JWT authentication
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and ShadCN UI
- **Database**: PostgreSQL
- **Monorepo**: Managed with Yarn workspaces

## 📁 Project Structure

```
mysaasproject/
├── apps/
│   ├── backend/          # Rails API application
│   └── frontend/         # Next.js application
├── packages/
│   └── shared/           # Shared utilities and types
├── docker-compose.yml    # Local development setup
└── package.json          # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- Ruby 3.2+ and Rails 7
- Docker and Docker Compose
- PostgreSQL (optional, Docker will provide this)

### Option 1: Docker Development (Recommended)

1. **Clone and setup**:
   ```bash
   git clone <your-repo>
   cd mysaasproject
   ```

2. **Start all services**:
   ```bash
   yarn docker:up
   ```

3. **Setup database** (first time only):
   ```bash
   docker-compose exec backend rails db:create db:migrate db:seed
   ```

4. **Access applications**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Option 2: Local Development

1. **Install dependencies**:
   ```bash
   yarn install
   ```

2. **Setup environment variables**:
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   cp apps/frontend/.env.example apps/frontend/.env.local
   ```

3. **Start PostgreSQL** (if not using Docker):
   ```bash
   # Using Docker for just the database
   docker-compose up postgres -d
   ```

4. **Setup backend**:
   ```bash
   cd apps/backend
   bundle install
   rails db:create db:migrate db:seed
   rails server -p 3001
   ```

5. **Setup frontend** (in new terminal):
   ```bash
   cd apps/frontend
   yarn dev
   ```

## 🔧 Development

### Available Scripts

- `yarn dev` - Start both frontend and backend in development mode
- `yarn build` - Build the frontend for production
- `yarn test` - Run tests across all workspaces
- `yarn lint` - Run linting across all workspaces
- `yarn format` - Format code across all workspaces
- `yarn docker:up` - Start all services with Docker
- `yarn docker:down` - Stop all Docker services
- `yarn docker:logs` - View Docker logs

### Backend Development

The Rails API is configured with:
- Devise for authentication
- JWT token generation
- CORS enabled for frontend
- PostgreSQL database
- API-only mode

Key endpoints:
- `POST /api/auth/sign_in` - User login
- `POST /api/auth/sign_up` - User registration
- `GET /api/auth/me` - Get current user
- `DELETE /api/auth/sign_out` - User logout

### Frontend Development

The Next.js app includes:
- TypeScript configuration
- Tailwind CSS for styling
- ShadCN UI components
- Axios for API calls
- Authentication context
- Protected routes

## 🌍 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/mysaasproject_development
RAILS_ENV=development
JWT_SECRET_KEY=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set build command: `yarn workspace @mysaasproject/frontend build`
3. Set output directory: `apps/frontend/.next`
4. Add environment variables in Vercel dashboard

### Backend (Railway)
1. Connect your repository to Railway
2. Set the source directory to `apps/backend`
3. Add environment variables in Railway dashboard
4. Set the start command: `rails server -p $PORT`

## 📝 API Documentation

### Authentication Endpoints

All authentication endpoints are prefixed with `/api/auth/`

- `POST /api/auth/sign_up`
  ```json
  {
    "user": {
      "email": "user@example.com",
      "password": "password123",
      "password_confirmation": "password123"
    }
  }
  ```

- `POST /api/auth/sign_in`
  ```json
  {
    "user": {
      "email": "user@example.com",
      "password": "password123"
    }
  }
  ```

- `GET /api/auth/me` (requires Authorization header)
  ```
  Authorization: Bearer <jwt_token>
  ```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

