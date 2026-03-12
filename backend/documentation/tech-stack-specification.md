# Technology Stack Specification

## 1. Frontend Stack

### Web Application
**Framework:** React 18+ with Next.js 14
**Why:**
- Server-side rendering for SEO
- Built-in routing and API routes
- Image optimization
- Code splitting
- Fast refresh for development

**State Management:** Redux Toolkit + RTK Query
**Why:**
- Centralized state management
- Built-in API caching
- Optimistic updates
- Reduced boilerplate

**UI Components:** 
- Tailwind CSS for styling
- Headless UI / Radix UI for accessible components
- Framer Motion for animations

**Form Management:** React Hook Form + Zod
**Why:**
- Minimal re-renders
- Built-in validation
- Type-safe schemas

**Additional Libraries:**
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.16.0",
    "date-fns": "^2.30.0",
    "axios": "^1.6.0",
    "socket.io-client": "^4.6.0",
    "@stripe/stripe-js": "^2.2.0",
    "@stripe/react-stripe-js": "^2.4.0",
    "react-google-maps": "^1.0.0",
    "react-calendar": "^4.6.0",
    "react-toastify": "^9.1.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "cypress": "^13.6.0"
  }
}
```

### Mobile Application
**Framework:** React Native with Expo
**Why:**
- Code sharing between iOS and Android
- Over-the-air updates
- Managed workflow
- Large ecosystem

**Navigation:** React Navigation 6
**State Management:** Redux Toolkit (shared with web)
**Native Modules:**
- expo-location (GPS tracking)
- expo-image-picker (profile pictures)
- expo-notifications (push notifications)
- expo-camera (document verification)

**Mobile Stack:**
```json
{
  "dependencies": {
    "expo": "^50.0.0",
    "react-native": "0.73.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "axios": "^1.6.0",
    "socket.io-client": "^4.6.0",
    "expo-location": "~16.5.0",
    "expo-image-picker": "~14.7.0",
    "expo-notifications": "~0.27.0",
    "expo-camera": "~14.0.0",
    "@stripe/stripe-react-native": "^0.35.0",
    "react-native-maps": "1.10.0"
  }
}
```

### Admin Dashboard
**Framework:** React + Vite (for faster builds)
**UI Library:** Ant Design or Material-UI
**Charts:** Recharts / Chart.js
**Tables:** TanStack Table (React Table v8)

## 2. Backend Stack

### Primary Technology: Node.js + Express
**Version:** Node.js 20 LTS
**Why:**
- JavaScript across full stack
- Large ecosystem
- Non-blocking I/O (good for real-time features)
- Easy to find developers

### Alternative Options:
1. **Python + FastAPI** (if data science/ML is priority)
2. **Go** (if extreme performance is needed)
3. **Ruby on Rails** (if rapid development is priority)

### Recommended Backend Structure (Node.js)

```javascript
// Package.json for each microservice
{
  "name": "auth-service",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "joi": "^17.11.0",
    "pg": "^8.11.0",
    "ioredis": "^5.3.0",
    "winston": "^3.11.0",
    "express-rate-limit": "^7.1.0",
    "express-validator": "^7.0.0",
    "@aws-sdk/client-s3": "^3.470.0",
    "stripe": "^14.7.0",
    "twilio": "^4.20.0",
    "@sendgrid/mail": "^7.7.0",
    "socket.io": "^4.6.0",
    "bull": "^4.12.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.0",
    "eslint": "^8.55.0",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0"
  }
}
```

### API Framework Options:
**Express (Recommended for flexibility)**
```javascript
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
```

**NestJS (Recommended for large teams/enterprise)**
- Built-in TypeScript support
- Dependency injection
- Modular architecture
- Built-in testing utilities

### ORM/Query Builder
**Prisma (Recommended)**
```javascript
// schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  firstName String?
  lastName  String?
  role      Role     @default(CUSTOMER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  provider  Provider?
  bookings  Booking[]
}
```

**Alternatives:**
- Sequelize (mature, widely used)
- TypeORM (TypeScript-first)
- Knex.js (query builder)

## 3. Database Stack

### Primary Database: PostgreSQL 15+
**Why:**
- ACID compliance
- JSON support (for flexible schemas)
- Full-text search
- Geographic queries (PostGIS extension)
- Mature replication
- Strong community

**Configuration for Production:**
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy search

-- Connection pooling settings (postgresql.conf)
max_connections = 200
shared_buffers = 4GB
effective_cache_size = 12GB
work_mem = 64MB
maintenance_work_mem = 1GB
```

**Hosting Options:**
1. AWS RDS Aurora PostgreSQL (Recommended)
2. Google Cloud SQL
3. Azure Database for PostgreSQL
4. Self-managed on EC2/VMs

### Secondary Database: MongoDB 7+
**Use Cases:**
- Chat messages (high write throughput)
- Logs and analytics
- Session storage
- Flexible schemas

**Configuration:**
```javascript
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    userId: String,
    role: String,
    name: String
  }],
  bookingId: String,
  lastMessage: {
    text: String,
    senderId: String,
    timestamp: Date
  },
  unreadCount: Map
}, { timestamps: true });

conversationSchema.index({ 'participants.userId': 1 });
conversationSchema.index({ bookingId: 1 });
```

### Cache Layer: Redis 7+
**Use Cases:**
- Session storage
- API response caching
- Rate limiting
- Real-time analytics
- Pub/Sub for chat
- Job queues (Bull/BullMQ)

**Redis Configuration:**
```javascript
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  }
});

// Usage examples:
// Session storage
await redis.setex(`session:${userId}`, 3600, JSON.stringify(sessionData));

// Rate limiting
const key = `rate:${ip}:${endpoint}`;
const current = await redis.incr(key);
if (current === 1) {
  await redis.expire(key, 60); // 1 minute window
}

// Caching
await redis.setex(`provider:${id}`, 300, JSON.stringify(providerData));
```

### Search Engine: Elasticsearch 8+
**Use Cases:**
- Provider search with complex filters
- Full-text search
- Autocomplete
- Analytics and reporting

**Mapping Example:**
```json
{
  "mappings": {
    "properties": {
      "businessName": {
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": { "type": "keyword" },
          "autocomplete": {
            "type": "text",
            "analyzer": "autocomplete"
          }
        }
      },
      "services": {
        "type": "nested",
        "properties": {
          "name": { "type": "text" },
          "category": { "type": "keyword" }
        }
      },
      "location": { "type": "geo_point" },
      "rating": { "type": "float" },
      "priceRange": { "type": "keyword" }
    }
  }
}
```

## 4. Message Queue / Event Bus

### Bull (Redis-based) for Job Queues
**Use Cases:**
- Email sending
- SMS notifications
- Payment processing
- Report generation

```javascript
const Queue = require('bull');

const emailQueue = new Queue('email', {
  redis: {
    host: process.env.REDIS_HOST,
    port: 6379
  }
});

// Producer
await emailQueue.add('welcome', {
  email: user.email,
  name: user.firstName
}, {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000
  }
});

// Consumer
emailQueue.process('welcome', async (job) => {
  await sendWelcomeEmail(job.data);
});
```

### RabbitMQ / Apache Kafka (for event-driven architecture)
**When to use:**
- Microservices need to communicate
- Event sourcing
- High-throughput scenarios

**Example with RabbitMQ:**
```javascript
const amqp = require('amqplib');

// Publisher
const publishEvent = async (exchange, routingKey, message) => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  
  await channel.assertExchange(exchange, 'topic', { durable: true });
  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
};

// Example usage
await publishEvent('bookings', 'booking.created', {
  bookingId: '123',
  customerId: 'user-456',
  providerId: 'provider-789'
});
```

## 5. Cloud Infrastructure

### AWS Services (Recommended)
```yaml
Services:
  Compute:
    - ECS Fargate (containerized microservices)
    - Lambda (serverless functions for triggers)
    - EC2 (if needed for specific workloads)
  
  Database:
    - RDS Aurora PostgreSQL (primary database)
    - DocumentDB (MongoDB-compatible)
    - ElastiCache Redis (caching)
  
  Storage:
    - S3 (media files, backups)
    - EBS (database volumes)
  
  Networking:
    - VPC (network isolation)
    - Route 53 (DNS)
    - CloudFront (CDN)
    - ALB/NLB (load balancing)
  
  Security:
    - IAM (access management)
    - Secrets Manager (credentials)
    - WAF (web application firewall)
    - Shield (DDoS protection)
  
  Monitoring:
    - CloudWatch (logs and metrics)
    - X-Ray (distributed tracing)
  
  CI/CD:
    - CodePipeline
    - CodeBuild
    - ECR (container registry)
  
  Messaging:
    - SQS (message queues)
    - SNS (notifications)
    - EventBridge (event bus)
```

### Infrastructure as Code
**Terraform Configuration Example:**
```hcl
# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name        = "home-service-vpc"
    Environment = var.environment
  }
}

# RDS Aurora Cluster
resource "aws_rds_cluster" "postgresql" {
  cluster_identifier      = "home-service-db"
  engine                  = "aurora-postgresql"
  engine_version          = "15.4"
  database_name           = "homeservice"
  master_username         = var.db_username
  master_password         = var.db_password
  backup_retention_period = 30
  preferred_backup_window = "03:00-04:00"
  vpc_security_group_ids  = [aws_security_group.database.id]
  db_subnet_group_name    = aws_db_subnet_group.main.name
  
  tags = {
    Environment = var.environment
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "home-service-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
```

### Docker Configuration
**Dockerfile for Node.js Service:**
```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build if needed (TypeScript)
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built artifacts and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

**Docker Compose for Local Development:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: homeservice
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
  
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
  
  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data
  
  auth-service:
    build: ./services/auth-service
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/homeservice
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-secret-key
    depends_on:
      - postgres
      - redis
  
  user-service:
    build: ./services/user-service
    ports:
      - "3002:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/homeservice
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
  mongo_data:
  es_data:
```

## 6. Third-Party Integrations

### Payment Processing
**Stripe (Recommended)**
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: booking.amount * 100, // cents
  currency: 'usd',
  customer: customer.stripeCustomerId,
  metadata: {
    bookingId: booking.id,
    customerId: customer.id,
    providerId: provider.id
  },
  transfer_group: booking.id
});

// Transfer to provider (with platform fee)
const transfer = await stripe.transfers.create({
  amount: (booking.amount * 0.85) * 100, // 15% platform fee
  currency: 'usd',
  destination: provider.stripeAccountId,
  transfer_group: booking.id
});
```

### Communication
**Twilio (SMS & Voice)**
```javascript
const twilio = require('twilio');
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send SMS
await client.messages.create({
  body: `Your booking #${booking.number} is confirmed!`,
  to: customer.phone,
  from: process.env.TWILIO_PHONE_NUMBER
});
```

**SendGrid (Email)**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: customer.email,
  from: 'noreply@yourplatform.com',
  templateId: 'd-xxxxxxxxx',
  dynamicTemplateData: {
    customerName: customer.firstName,
    bookingNumber: booking.number,
    serviceDate: booking.scheduledDate
  }
};

await sgMail.send(msg);
```

### Maps & Location
**Google Maps Platform**
```javascript
const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});

// Geocoding
const response = await client.geocode({
  params: {
    address: '1600 Amphitheatre Parkway, Mountain View, CA',
    key: process.env.GOOGLE_MAPS_API_KEY
  }
});

const location = response.data.results[0].geometry.location;
```

### Push Notifications
**Firebase Cloud Messaging**
```javascript
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const message = {
  notification: {
    title: 'Booking Confirmed',
    body: `Your service is scheduled for ${date}`
  },
  token: deviceToken
};

await admin.messaging().send(message);
```

## 7. Development Tools

### Code Quality
```json
{
  "devDependencies": {
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.2.0",
    "commitlint": "^18.4.0"
  }
}
```

**.eslintrc.json:**
```json
{
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

**prettier.config.js:**
```javascript
module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2
};
```

### Testing
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run"
  }
}
```

### Monitoring
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog / New Relic** - APM
- **Grafana + Prometheus** - Metrics visualization

## 8. Cost Estimation (Monthly)

### Startup Phase (100-1000 users)
- AWS Infrastructure: $500-1000
- Database (RDS): $200-400
- CDN (CloudFront): $50-100
- Redis/ElastiCache: $100-200
- Third-party APIs: $200-500
- **Total: ~$1,500-2,500/month**

### Growth Phase (10,000+ users)
- AWS Infrastructure: $2,000-5,000
- Database: $1,000-2,000
- CDN: $300-600
- Caching: $400-800
- Third-party APIs: $1,000-3,000
- **Total: ~$5,000-12,000/month**

### Enterprise Scale (100,000+ users)
- AWS Infrastructure: $10,000-20,000
- Database: $5,000-10,000
- CDN: $1,500-3,000
- Caching: $2,000-4,000
- Third-party APIs: $5,000-15,000
- **Total: ~$25,000-60,000/month**
