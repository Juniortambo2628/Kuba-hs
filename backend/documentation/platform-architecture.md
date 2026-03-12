# Home Service Platform - Complete Architecture

## 1. High-Level System Architecture

### Overview
A multi-tenant marketplace platform connecting customers with service providers for residential and commercial services.

### Core Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  Web App (React)  │  iOS App (Swift)  │  Android App (Kotlin)  │
│  Admin Dashboard  │  Provider Portal  │                         │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY / LOAD BALANCER                   │
│                    (NGINX / AWS ALB)                             │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER (Microservices)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Auth      │  │   User      │  │  Provider   │            │
│  │  Service    │  │  Service    │  │   Service   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Booking    │  │  Payment    │  │   Review    │            │
│  │  Service    │  │  Service    │  │   Service   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │Notification │  │   Search    │  │   Chat      │            │
│  │  Service    │  │  Service    │  │   Service   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ PostgreSQL   │  │  MongoDB     │  │    Redis     │         │
│  │ (Primary DB) │  │ (Chat/Logs)  │  │   (Cache)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │Elasticsearch │  │  S3/Storage  │                            │
│  │  (Search)    │  │  (Media)     │                            │
│  └──────────────┘  └──────────────┘                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                              │
├─────────────────────────────────────────────────────────────────┤
│  Stripe/PayPal  │  Twilio  │  SendGrid  │  Google Maps         │
│  AWS SNS/SQS    │  Firebase │  Cloudinary│  Analytics           │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Microservices Architecture Detail

### 2.1 Auth Service
**Responsibilities:**
- User authentication (JWT tokens)
- OAuth integration (Google, Facebook, Apple)
- Password management
- Role-based access control (RBAC)
- Session management

**Tech Stack:**
- Node.js + Express
- JWT for tokens
- bcrypt for password hashing
- Redis for session storage

**API Endpoints:**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/verify-email/:token
```

### 2.2 User Service
**Responsibilities:**
- User profile management
- Customer preferences
- Address management
- Service history
- Favorite providers

**Tech Stack:**
- Node.js + Express
- PostgreSQL
- Redis caching

**API Endpoints:**
```
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/users/:id/addresses
POST   /api/users/:id/addresses
GET    /api/users/:id/bookings
GET    /api/users/:id/favorites
POST   /api/users/:id/favorites/:providerId
```

### 2.3 Provider Service
**Responsibilities:**
- Provider registration & verification
- Service catalog management
- Availability management
- Provider profiles
- Certifications & documents
- Pricing management

**Tech Stack:**
- Node.js + Express
- PostgreSQL
- S3 for document storage

**API Endpoints:**
```
POST   /api/providers
GET    /api/providers/:id
PUT    /api/providers/:id
GET    /api/providers/:id/services
POST   /api/providers/:id/services
PUT    /api/providers/:id/services/:serviceId
GET    /api/providers/:id/availability
PUT    /api/providers/:id/availability
POST   /api/providers/:id/documents
GET    /api/providers/:id/verification-status
```

### 2.4 Booking Service
**Responsibilities:**
- Booking creation & management
- Scheduling
- Status tracking (pending, confirmed, in-progress, completed, cancelled)
- Assignment to providers
- Booking history

**Tech Stack:**
- Node.js + Express
- PostgreSQL
- Event-driven architecture (RabbitMQ/Kafka)

**API Endpoints:**
```
POST   /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id
DELETE /api/bookings/:id
GET    /api/bookings
POST   /api/bookings/:id/cancel
POST   /api/bookings/:id/reschedule
POST   /api/bookings/:id/complete
GET    /api/bookings/:id/status
```

### 2.5 Payment Service
**Responsibilities:**
- Payment processing
- Escrow management
- Provider payouts
- Transaction history
- Refunds
- Invoice generation

**Tech Stack:**
- Node.js + Express
- Stripe/PayPal SDK
- PostgreSQL
- Queue system for async processing

**API Endpoints:**
```
POST   /api/payments/intent
POST   /api/payments/process
GET    /api/payments/:id
POST   /api/payments/:id/refund
GET    /api/payments/transactions
POST   /api/payments/payout/:providerId
GET    /api/payments/invoices/:bookingId
```

### 2.6 Review Service
**Responsibilities:**
- Reviews and ratings
- Review moderation
- Rating calculations
- Review responses (from providers)

**Tech Stack:**
- Node.js + Express
- PostgreSQL
- Redis for caching aggregated ratings

**API Endpoints:**
```
POST   /api/reviews
GET    /api/reviews/:id
PUT    /api/reviews/:id
DELETE /api/reviews/:id
GET    /api/reviews/provider/:providerId
GET    /api/reviews/booking/:bookingId
POST   /api/reviews/:id/response
GET    /api/reviews/provider/:providerId/stats
```

### 2.7 Search Service
**Responsibilities:**
- Provider search with filters
- Service catalog search
- Location-based search
- Advanced filtering (price, rating, availability)
- Search autocomplete

**Tech Stack:**
- Node.js + Express
- Elasticsearch
- Redis for caching popular searches

**API Endpoints:**
```
GET    /api/search/providers
GET    /api/search/services
GET    /api/search/autocomplete
POST   /api/search/advanced
GET    /api/search/nearby
```

### 2.8 Notification Service
**Responsibilities:**
- Push notifications
- Email notifications
- SMS notifications
- In-app notifications
- Notification preferences

**Tech Stack:**
- Node.js + Express
- Firebase Cloud Messaging
- Twilio for SMS
- SendGrid for emails
- RabbitMQ/SQS for queuing

**API Endpoints:**
```
POST   /api/notifications/send
GET    /api/notifications/:userId
PUT    /api/notifications/:id/read
GET    /api/notifications/preferences/:userId
PUT    /api/notifications/preferences/:userId
```

### 2.9 Chat Service
**Responsibilities:**
- Real-time messaging
- Chat history
- File sharing
- Read receipts
- Typing indicators

**Tech Stack:**
- Node.js + Socket.io
- MongoDB
- Redis for pub/sub
- S3 for file storage

**API Endpoints:**
```
WebSocket: /ws/chat
POST   /api/chat/conversations
GET    /api/chat/conversations/:id
GET    /api/chat/conversations/:id/messages
POST   /api/chat/conversations/:id/messages
PUT    /api/chat/messages/:id/read
```

## 3. Database Schema Design

### 3.1 PostgreSQL Schema

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'provider', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Providers Table
```sql
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255),
    description TEXT,
    service_radius INTEGER, -- in kilometers
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_jobs_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_providers_user_id ON providers(user_id);
CREATE INDEX idx_providers_location ON providers USING GIST(ll_to_earth(latitude, longitude));
```

#### Services Table
```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES service_categories(id),
    description TEXT,
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Service Categories Table
```sql
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    parent_category_id UUID REFERENCES service_categories(id),
    description TEXT,
    icon_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Provider Services Table
```sql
CREATE TABLE provider_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    base_price DECIMAL(10, 2),
    pricing_type VARCHAR(20) CHECK (pricing_type IN ('fixed', 'hourly', 'quote')),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_provider_services_provider ON provider_services(provider_id);
CREATE INDEX idx_provider_services_service ON provider_services(service_id);
```

#### Bookings Table
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id),
    provider_id UUID REFERENCES providers(id),
    service_id UUID REFERENCES services(id),
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    scheduled_end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    address_id UUID REFERENCES addresses(id),
    description TEXT,
    estimated_price DECIMAL(10, 2),
    final_price DECIMAL(10, 2),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled_date ON bookings(scheduled_date);
```

#### Addresses Table
```sql
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    address_type VARCHAR(20) CHECK (address_type IN ('residential', 'commercial')),
    street_address VARCHAR(255) NOT NULL,
    apartment VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
```

#### Reviews Table
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id),
    provider_id UUID REFERENCES providers(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    provider_response TEXT,
    provider_response_at TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_provider ON reviews(provider_id);
CREATE INDEX idx_reviews_booking ON reviews(booking_id);
```

#### Payments Table
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    customer_id UUID REFERENCES users(id),
    provider_id UUID REFERENCES providers(id),
    amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    provider_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255) UNIQUE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    payment_gateway VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### 3.2 MongoDB Collections (for Chat & Logs)

#### Conversations Collection
```javascript
{
    _id: ObjectId,
    participants: [
        {
            userId: UUID,
            role: String, // 'customer' or 'provider'
            name: String,
            avatarUrl: String
        }
    ],
    bookingId: UUID,
    lastMessage: {
        text: String,
        senderId: UUID,
        timestamp: Date
    },
    unreadCount: {
        [userId]: Number
    },
    createdAt: Date,
    updatedAt: Date
}
```

#### Messages Collection
```javascript
{
    _id: ObjectId,
    conversationId: ObjectId,
    senderId: UUID,
    senderRole: String,
    messageType: String, // 'text', 'image', 'file'
    content: String,
    attachments: [
        {
            url: String,
            type: String,
            name: String,
            size: Number
        }
    ],
    readBy: [UUID],
    createdAt: Date
}
```

## 4. Infrastructure Architecture

### 4.1 Cloud Infrastructure (AWS Example)

```
┌─────────────────────────────────────────────────────────────┐
│                     Route 53 (DNS)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                CloudFront (CDN)                             │
│          (Static assets, API caching)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│        Application Load Balancer (Multi-AZ)                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              ECS/EKS Cluster (Containers)                   │
│   ┌────────────────────────────────────────────┐           │
│   │  Auto Scaling Group (Multiple AZs)         │           │
│   │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │           │
│   │  │ API  │ │ API  │ │ API  │ │ API  │      │           │
│   │  │ Pod  │ │ Pod  │ │ Pod  │ │ Pod  │      │           │
│   │  └──────┘ └──────┘ └──────┘ └──────┘      │           │
│   └────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│   RDS Aurora     │    │  ElastiCache     │
│  (PostgreSQL)    │    │    (Redis)       │
│   Multi-AZ       │    │   Multi-AZ       │
└──────────────────┘    └──────────────────┘
        │
        ▼
┌──────────────────┐    ┌──────────────────┐
│   S3 Buckets     │    │  ElasticSearch   │
│  (Media Files)   │    │    Service       │
└──────────────────┘    └──────────────────┘
```

### 4.2 Deployment Strategy

**Environments:**
1. **Development** - Developer local environments + shared dev server
2. **Staging** - Pre-production environment (mirrors production)
3. **Production** - Live environment with full redundancy

**CI/CD Pipeline:**
```
Developer Push → GitHub
      ↓
GitHub Actions Triggered
      ↓
Run Tests (Unit, Integration)
      ↓
Build Docker Images
      ↓
Push to Container Registry (ECR)
      ↓
Deploy to Staging (Auto)
      ↓
Run E2E Tests
      ↓
Manual Approval
      ↓
Deploy to Production (Blue-Green)
      ↓
Health Checks
      ↓
Complete/Rollback
```

## 5. Security Architecture

### 5.1 Security Layers

**Application Layer:**
- JWT token authentication
- Rate limiting (Redis-based)
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF tokens for web app
- API key management for internal services

**Network Layer:**
- VPC with private/public subnets
- Security groups (strict ingress/egress rules)
- WAF (Web Application Firewall)
- DDoS protection (AWS Shield)
- SSL/TLS encryption (Let's Encrypt)

**Data Layer:**
- Encryption at rest (RDS, S3)
- Encryption in transit (TLS 1.3)
- Database access via IAM roles
- Regular automated backups
- Point-in-time recovery

**Compliance:**
- PCI-DSS for payment processing
- GDPR compliance for user data
- SOC 2 Type II certification path
- Regular security audits
- Penetration testing

### 5.2 Authentication Flow

```
1. User Login Request
   ↓
2. Validate credentials
   ↓
3. Generate JWT (access token: 15min, refresh token: 7days)
   ↓
4. Store refresh token in Redis
   ↓
5. Return tokens to client
   ↓
6. Client stores access token in memory, refresh token in httpOnly cookie
   ↓
7. Subsequent requests include access token in Authorization header
   ↓
8. API Gateway validates token
   ↓
9. On expiry, use refresh token to get new access token
```

## 6. Scalability Considerations

### 6.1 Horizontal Scaling
- Microservices can scale independently
- Container orchestration (Kubernetes)
- Auto-scaling based on CPU/memory/request metrics
- Load balancing across multiple instances

### 6.2 Database Scaling
- Read replicas for PostgreSQL
- Database sharding for large datasets
- Caching layer (Redis) to reduce DB load
- Connection pooling

### 6.3 Caching Strategy
```
Level 1: Browser cache (static assets)
Level 2: CDN cache (CloudFront)
Level 3: Application cache (Redis)
    - User sessions
    - API responses (short TTL)
    - Provider ratings/stats
    - Popular search results
Level 4: Database query cache
```

## 7. Monitoring and Observability

### 7.1 Monitoring Stack
- **Application Monitoring:** New Relic / Datadog
- **Log Aggregation:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **Metrics:** Prometheus + Grafana
- **APM:** Distributed tracing with Jaeger
- **Uptime Monitoring:** Pingdom / StatusPage
- **Error Tracking:** Sentry

### 7.2 Key Metrics to Monitor
- Request rate and latency (p50, p95, p99)
- Error rates (4xx, 5xx)
- Database query performance
- Cache hit/miss ratios
- Container resource utilization
- Queue depths and processing times
- Payment success rates
- User conversion funnels

## 8. Disaster Recovery & Business Continuity

### 8.1 Backup Strategy
- **Database:** Daily automated backups, 30-day retention
- **Transaction logs:** Real-time replication
- **Media files:** S3 with versioning enabled
- **Configuration:** Version controlled in Git

### 8.2 Recovery Objectives
- **RTO (Recovery Time Objective):** < 4 hours
- **RPO (Recovery Point Objective):** < 15 minutes
- **Multi-region failover capability**
- **Regular disaster recovery drills** (quarterly)

## 9. Development Best Practices

### 9.1 Code Organization
```
project-root/
├── services/
│   ├── auth-service/
│   ├── user-service/
│   ├── booking-service/
│   └── ...
├── shared/
│   ├── models/
│   ├── utils/
│   └── middleware/
├── web-app/
├── mobile-app/
├── admin-dashboard/
├── infrastructure/
│   ├── terraform/
│   └── kubernetes/
└── docs/
```

### 9.2 API Versioning
- URL versioning: `/api/v1/`, `/api/v2/`
- Maintain backward compatibility
- Deprecation notices with 6-month window

### 9.3 Testing Strategy
- **Unit tests:** 80%+ coverage
- **Integration tests:** Critical user flows
- **E2E tests:** Key business scenarios
- **Load testing:** Before major releases
- **Security testing:** Automated vulnerability scanning

## 10. Estimated Timeline & Phases

### Phase 1: MVP (3-4 months)
- Core authentication
- Basic user/provider profiles
- Simple booking flow
- Payment integration
- Web application
- Admin dashboard basics

### Phase 2: Enhancement (2-3 months)
- Mobile apps (iOS & Android)
- Advanced search
- Reviews and ratings
- Chat functionality
- Notifications

### Phase 3: Optimization (2-3 months)
- Performance optimization
- Advanced analytics
- Provider verification workflow
- Dispute resolution system
- Marketing tools

### Phase 4: Scale (Ongoing)
- Multi-region deployment
- Advanced features
- AI-powered matching
- Predictive scheduling
- Business intelligence

## Next Steps

1. Set up development environment
2. Create project repositories
3. Set up CI/CD pipelines
4. Implement authentication service
5. Build API gateway
6. Develop core services iteratively
