# Provider Service

Microservice for managing service providers in the Home Service Platform - registration, verification, service offerings, availability, and earnings tracking.

## Features

- ✅ Provider registration and profile management
- ✅ Service offerings CRUD with pricing
- ✅ Weekly availability scheduling
- ✅ Document upload and verification
- ✅ Provider search with geolocation
- ✅ Earnings calculation and reporting
- ✅ Admin verification workflow
- ✅ Redis caching for performance
- ✅ JWT authentication

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL with PostGIS
- **Cache**: Redis
- **Storage**: AWS S3
- **Authentication**: JWT

## Installation

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
```

## Database Tables Required

```sql
-- Providers table
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  business_name VARCHAR(255) NOT NULL,
  description TEXT,
  service_radius INTEGER DEFAULT 10,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city VARCHAR(100),
  state VARCHAR(100),
  verification_status VARCHAR(20) DEFAULT 'pending',
  verification_notes TEXT,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_jobs_completed INTEGER DEFAULT 0,
  profile_image TEXT,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_providers_location ON providers USING GIST(ll_to_earth(latitude, longitude));
CREATE INDEX idx_providers_verification ON providers(verification_status);

-- Services catalog
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Provider services
CREATE TABLE provider_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  base_price DECIMAL(10, 2),
  pricing_type VARCHAR(20) CHECK (pricing_type IN ('fixed', 'hourly', 'quote')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider_id, service_id)
);

-- Provider availability
CREATE TABLE provider_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Provider documents
CREATE TABLE provider_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  document_type VARCHAR(50),
  document_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  rejection_reason TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP
);

-- Enable PostGIS for geolocation
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;
```

## Running the Service

```bash
# Development
npm run dev

# Production
npm start

# Docker
docker-compose up -d
```

Service runs on: **http://localhost:3003**

## API Endpoints

### Public Routes

#### Search Providers
```http
GET /api/providers/search?service=uuid&latitude=40.7&longitude=-74&radius=25&minRating=4&page=1&limit=20
```

#### Get Provider
```http
GET /api/providers/:providerId
```

#### Get Provider Services
```http
GET /api/providers/:providerId/services
```

#### Get Provider Availability
```http
GET /api/providers/:providerId/availability
```

### Protected Routes (Authentication Required)

#### Register as Provider
```http
POST /api/providers/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "ABC Plumbing",
  "description": "Professional plumbing services",
  "serviceRadius": 25,
  "city": "New York",
  "state": "NY",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

#### Update Provider Profile
```http
PUT /api/providers/:providerId
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "ABC Pro Plumbing",
  "description": "Updated description",
  "serviceRadius": 30
}
```

#### Add Service Offering
```http
POST /api/providers/:providerId/services
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceId": "service-uuid",
  "basePrice": 150.00,
  "pricingType": "fixed",
  "description": "Standard drain cleaning"
}
```

#### Update Service Offering
```http
PUT /api/providers/:providerId/services/:serviceId
Authorization: Bearer <token>
Content-Type: application/json

{
  "basePrice": 175.00,
  "isActive": true
}
```

#### Remove Service
```http
DELETE /api/providers/:providerId/services/:serviceId
Authorization: Bearer <token>
```

#### Update Availability
```http
PUT /api/providers/:providerId/availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "schedule": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "17:00",
      "isAvailable": true
    },
    {
      "dayOfWeek": 2,
      "startTime": "09:00",
      "endTime": "17:00",
      "isAvailable": true
    }
  ]
}
```

#### Upload Document
```http
POST /api/providers/:providerId/documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

document: <file>
documentType: license
```

#### Get Documents
```http
GET /api/providers/:providerId/documents
Authorization: Bearer <token>
```

#### Get Earnings
```http
GET /api/providers/:providerId/earnings?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

### Admin Routes

#### Verify Provider
```http
POST /api/providers/:providerId/verify
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "verified",
  "notes": "All documents verified"
}
```

## Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## Search Algorithm

Providers are searched using:
1. **Service filtering** - Match requested service
2. **Geolocation** - Calculate distance using PostGIS earthdistance
3. **Availability** - Filter by verification status
4. **Rating** - Filter by minimum rating
5. **Sorting** - By distance (if coords provided), then rating

Example search with all filters:
```
/api/providers/search?
  service=plumbing-uuid&
  latitude=40.7128&
  longitude=-74.0060&
  radius=15&
  minRating=4.5&
  city=New%20York&
  state=NY&
  page=1&
  limit=10
```

## Verification Workflow

1. Provider registers → Status: `pending`
2. Provider uploads documents
3. Admin reviews documents
4. Admin verifies → Status: `verified` or `rejected`
5. Only verified providers appear in search

## Earnings Calculation

Tracks for date range:
- Total jobs (all statuses)
- Completed jobs
- Total revenue (gross)
- Total earnings (after platform fee)
- Total fees (platform commission)
- Average rating

## Testing

```bash
# Health check
curl http://localhost:3003/health

# Search providers near location
curl "http://localhost:3003/api/providers/search?latitude=40.7128&longitude=-74.0060&radius=25"

# Register as provider
curl -X POST http://localhost:3003/api/providers/register \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Test Plumbing",
    "city": "New York",
    "state": "NY",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

## Security

- JWT authentication on protected routes
- Provider can only manage their own profile
- Admin-only verification endpoint
- File upload validation (type, size)
- SQL injection prevention
- Input validation on all endpoints

## Performance

- Redis caching for provider profiles (5min TTL)
- PostGIS geospatial indexing
- Database connection pooling
- Optimized search queries with proper indexes

## License

MIT
