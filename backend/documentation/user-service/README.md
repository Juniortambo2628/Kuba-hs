# User Service

Microservice for managing user profiles, addresses, and favorites in the Home Service Platform.

## Features

- ✅ User profile management (get, update, delete)
- ✅ Address CRUD operations with default address support
- ✅ Favorites management (add/remove providers)
- ✅ Profile picture upload to S3
- ✅ Redis caching for performance
- ✅ JWT authentication
- ✅ Input validation
- ✅ Comprehensive error handling
- ✅ Request logging

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Storage**: AWS S3
- **Authentication**: JWT
- **Logging**: Winston

## Prerequisites

- Node.js 20 or higher
- PostgreSQL 15+
- Redis 7+
- AWS Account (for S3 uploads)

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

## Environment Variables

See `.env.example` for all required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT verification
- `AWS_*` - AWS credentials for S3 uploads
- `ALLOWED_ORIGINS` - CORS allowed origins

## Database Setup

The service expects the following tables to exist:

```sql
-- See platform-architecture.md for complete schema
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  role VARCHAR(20),
  email_verified BOOLEAN DEFAULT false,
  profile_picture TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  address_type VARCHAR(20),
  street_address VARCHAR(255),
  apartment VARCHAR(50),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, provider_id)
);
```

## Running the Service

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run tests
npm test

# Run linter
npm run lint
```

The service will start on port 3002 (configurable via PORT env variable).

## API Endpoints

### User Profile

#### Get User
```http
GET /api/users/:userId
Authorization: Bearer <token>
```

#### Update User
```http
PUT /api/users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### Delete User
```http
DELETE /api/users/:userId
Authorization: Bearer <token>
```

### Addresses

#### Get All Addresses
```http
GET /api/users/:userId/addresses
Authorization: Bearer <token>
```

#### Add Address
```http
POST /api/users/:userId/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "addressType": "residential",
  "streetAddress": "123 Main St",
  "apartment": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "USA",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "isDefault": true
}
```

#### Update Address
```http
PUT /api/users/:userId/addresses/:addressId
Authorization: Bearer <token>
Content-Type: application/json

{
  "city": "Brooklyn",
  "postalCode": "11201"
}
```

#### Delete Address
```http
DELETE /api/users/:userId/addresses/:addressId
Authorization: Bearer <token>
```

#### Set Default Address
```http
PATCH /api/users/:userId/addresses/:addressId/default
Authorization: Bearer <token>
```

### Favorites

#### Get Favorites
```http
GET /api/users/:userId/favorites
Authorization: Bearer <token>
```

#### Add to Favorites
```http
POST /api/users/:userId/favorites/:providerId
Authorization: Bearer <token>
```

#### Remove from Favorites
```http
DELETE /api/users/:userId/favorites/:providerId
Authorization: Bearer <token>
```

### Profile Picture

#### Upload Profile Picture
```http
POST /api/users/:userId/profile-picture
Authorization: Bearer <token>
Content-Type: multipart/form-data

profilePicture: <file>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- userService.test.js
```

## Performance

- **Caching**: User data is cached in Redis for 5 minutes
- **Database**: Connection pooling with max 20 connections
- **File Upload**: Direct to S3, max 5MB per file

## Security

- JWT authentication on all routes
- User can only access/modify their own data (except admins)
- Input validation on all endpoints
- File type and size validation for uploads
- SQL injection prevention via parameterized queries
- CORS protection
- Helmet security headers

## Logging

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- Console (development mode)

## Health Check

```http
GET /health
```

Returns service status and uptime.

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Deployment

### Docker

```bash
docker build -t user-service .
docker run -p 3002:3002 --env-file .env user-service
```

### PM2

```bash
pm2 start src/index.js --name user-service
pm2 save
```

## Monitoring

The service logs all requests and errors. Integrate with:
- ELK Stack for log aggregation
- Prometheus for metrics
- Sentry for error tracking

## Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit pull request

## License

MIT
