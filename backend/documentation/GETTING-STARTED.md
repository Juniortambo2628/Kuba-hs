# Quick Start Guide

## Prerequisites

- **Node.js**: v20+ ([Download](https://nodejs.org/))
- **Docker & Docker Compose**: ([Download](https://www.docker.com/))
- **Git**: ([Download](https://git-scm.com/))
- **PostgreSQL** (optional - can use Docker)
- **Redis** (optional - can use Docker)

## Getting Started (5 Minutes)

### 1. Clone and Setup

```bash
# Clone the repository (once you create it)
git clone <your-repo-url>
cd home-service-platform

# Install dependencies for all services
npm run install:all

# Or manually for each service
cd services/auth-service && npm install
cd ../user-service && npm install
# ... repeat for other services
```

### 2. Environment Configuration

Create `.env` files for each service:

**services/auth-service/.env**
```env
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/homeservice

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourplatform.com

# Client URLs
WEB_APP_URL=http://localhost:3000
EMAIL_VERIFICATION_URL=http://localhost:3000/verify-email

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**services/user-service/.env**
```env
NODE_ENV=development
PORT=3002
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/homeservice
REDIS_URL=redis://localhost:6379
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

**services/booking-service/.env**
```env
NODE_ENV=development
PORT=3003
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/homeservice
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost:5672
```

**services/payment-service/.env**
```env
NODE_ENV=development
PORT=3004
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/homeservice
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PLATFORM_FEE_PERCENTAGE=15
```

### 3. Start Infrastructure Services

```bash
# Start databases and supporting services
docker-compose up -d postgres redis mongodb elasticsearch rabbitmq

# Wait for services to be healthy (check with)
docker-compose ps

# Initialize database
docker exec -i home-service-postgres psql -U postgres -d homeservice < scripts/init-db.sql
```

### 4. Start Microservices

**Option A: Using Docker Compose (Recommended)**
```bash
# Start all services
docker-compose up

# Or start specific services
docker-compose up auth-service user-service
```

**Option B: Run Services Individually**
```bash
# Terminal 1: Auth Service
cd services/auth-service
npm run dev

# Terminal 2: User Service
cd services/user-service
npm run dev

# Terminal 3: Booking Service
cd services/booking-service
npm run dev

# ... and so on
```

### 5. Start Web Application

```bash
cd web-app
npm install
npm run dev
```

Access at: http://localhost:3000

### 6. Test the Setup

```bash
# Register a new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

## Project Structure Overview

```
home-service-platform/
│
├── services/                    # Backend microservices
│   ├── auth-service/           # Authentication & authorization
│   ├── user-service/           # User profile management
│   ├── provider-service/       # Service provider management
│   ├── booking-service/        # Booking & scheduling
│   ├── payment-service/        # Payment processing
│   ├── review-service/         # Reviews & ratings
│   ├── search-service/         # Search & discovery
│   ├── notification-service/   # Notifications (email, SMS, push)
│   └── chat-service/           # Real-time messaging
│
├── web-app/                    # React web application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Redux store
│   │   ├── services/          # API services
│   │   └── utils/             # Utility functions
│   └── public/
│
├── mobile-app/                 # React Native mobile app
│   ├── src/
│   │   ├── screens/           # Screen components
│   │   ├── components/        # Reusable components
│   │   ├── navigation/        # Navigation setup
│   │   └── services/          # API services
│   └── assets/
│
├── admin-dashboard/            # Admin panel
│   └── src/
│
├── shared/                     # Shared code
│   ├── models/                # Data models
│   ├── types/                 # TypeScript types
│   └── utils/                 # Common utilities
│
├── infrastructure/             # Infrastructure as Code
│   ├── terraform/             # Terraform configs
│   └── kubernetes/            # K8s manifests
│
├── scripts/                    # Utility scripts
│   ├── init-db.sql            # Database initialization
│   ├── seed-data.js           # Seed test data
│   └── deploy.sh              # Deployment script
│
├── docs/                       # Documentation
│
├── docker-compose.yml          # Local development
└── README.md
```

## Development Workflow

### 1. Creating a New Feature

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make changes
# ...

# Test locally
npm test

# Commit changes
git add .
git commit -m "Add: your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request
```

### 2. Running Tests

```bash
# Run all tests
npm test

# Run tests for specific service
cd services/auth-service
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### 3. Database Migrations

```bash
# Create a new migration
npm run migration:create -- add-new-table

# Run migrations
npm run migration:up

# Rollback migration
npm run migration:down
```

### 4. Debugging

```bash
# Debug auth service with Chrome DevTools
cd services/auth-service
node --inspect-brk src/index.js

# Then open chrome://inspect in Chrome
```

## Common Commands

```bash
# Install all dependencies
npm run install:all

# Start all services in development
docker-compose up

# Stop all services
docker-compose down

# View logs for specific service
docker-compose logs -f auth-service

# Rebuild specific service
docker-compose up --build auth-service

# Clean all Docker volumes (fresh start)
docker-compose down -v

# Run database migrations
npm run migrate

# Seed database with test data
npm run seed

# Lint all code
npm run lint

# Format all code
npm run format

# Run security audit
npm audit
```

## API Documentation

Once services are running, access API documentation at:

- **Auth Service**: http://localhost:3001/api-docs
- **User Service**: http://localhost:3002/api-docs
- **Booking Service**: http://localhost:3003/api-docs

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check PostgreSQL logs
docker logs home-service-postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
npm run migrate
```

### Redis Connection Issues
```bash
# Check if Redis is running
docker ps | grep redis

# Test Redis connection
docker exec -it home-service-redis redis-cli ping
# Should return: PONG
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Docker Issues
```bash
# Clean up Docker
docker system prune -a

# Restart Docker daemon
# (varies by OS)
```

## Next Steps

1. **Read the Architecture Documentation**: `/docs/platform-architecture.md`
2. **Review API Specifications**: Each service has its own API docs
3. **Set Up Your Development Environment**: IDE, extensions, etc.
4. **Join the Team**: Slack channel, standups, etc.
5. **Pick Your First Task**: Check the project board

## Resources

- [Platform Architecture](./platform-architecture.md)
- [Technology Stack](./tech-stack-specification.md)
- [Implementation Roadmap](./implementation-roadmap.md)
- [API Documentation](http://localhost:3000/api-docs)
- [Database Schema](./docs/database-schema.md)

## Support

- **Technical Issues**: Create an issue in GitHub
- **Questions**: Ask in Slack #dev-help channel
- **Security Issues**: Email security@yourcompany.com

## License

[Your License Here]
