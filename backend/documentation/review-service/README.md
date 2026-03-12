# Review Service

Microservice for managing reviews, ratings, and feedback in the Home Service Platform.

## Features

- ✅ Create and manage reviews
- ✅ 5-star rating system
- ✅ Detailed ratings (service quality, communication, timeliness, professionalism)
- ✅ Provider responses to reviews
- ✅ Review statistics and analytics
- ✅ Rating distribution
- ✅ Review flagging/moderation
- ✅ Edit reviews (within 30 days)
- ✅ Soft delete support
- ✅ Redis caching for performance

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT

## Rating System

### Overall Rating (1-5 stars)
Required for all reviews.

### Detailed Ratings (Optional)
- **Service Quality** (1-5)
- **Communication** (1-5)
- **Timeliness** (1-5)
- **Professionalism** (1-5)

## Installation

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
```

## Database Tables Required

```sql
-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) UNIQUE,
  customer_id UUID REFERENCES users(id),
  provider_id UUID REFERENCES providers(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  timeliness INTEGER CHECK (timeliness >= 1 AND timeliness <= 5),
  professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
  provider_response TEXT,
  response_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_reviews_booking ON reviews(booking_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);
CREATE INDEX idx_reviews_provider ON reviews(provider_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created ON reviews(created_at);

-- Review flags table (for moderation)
CREATE TABLE review_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id),
  flagged_by UUID REFERENCES users(id),
  reason TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(review_id, flagged_by)
);

CREATE INDEX idx_review_flags_review ON review_flags(review_id);
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

Service runs on: **http://localhost:3006**

## API Endpoints

### Public Routes (No Authentication)

#### Get Provider Reviews
```http
GET /api/reviews/providers/:providerId?minRating=4&page=1&limit=20&sortBy=created_at&sortOrder=DESC
```

#### Get Provider Statistics
```http
GET /api/reviews/providers/:providerId/statistics
```

Response:
```json
{
  "success": true,
  "data": {
    "totalReviews": 45,
    "averageRating": "4.67",
    "avgServiceQuality": "4.80",
    "avgCommunication": "4.60",
    "avgTimeliness": "4.50",
    "avgProfessionalism": "4.70",
    "ratingDistribution": {
      "5": 30,
      "4": 10,
      "3": 3,
      "2": 1,
      "1": 1
    },
    "responseRate": "88.9"
  }
}
```

#### Get Review Details
```http
GET /api/reviews/:reviewId
```

### Protected Routes (Authentication Required)

#### Create Review
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "booking-uuid",
  "providerId": "provider-uuid",
  "rating": 5,
  "comment": "Excellent service! Very professional and completed on time.",
  "serviceQuality": 5,
  "communication": 5,
  "timeliness": 5,
  "professionalism": 5
}
```

#### Get My Reviews (Customer)
```http
GET /api/reviews/customer/my-reviews?page=1&limit=20
Authorization: Bearer <token>
```

#### Update Review
```http
PUT /api/reviews/:reviewId
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated comment"
}
```

Note: Reviews can only be edited within 30 days of creation.

#### Delete Review
```http
DELETE /api/reviews/:reviewId
Authorization: Bearer <token>
```

#### Add Provider Response
```http
POST /api/reviews/:reviewId/response
Authorization: Bearer <provider-token>
Content-Type: application/json

{
  "response": "Thank you for your kind words! It was a pleasure working with you."
}
```

#### Update Provider Response
```http
PUT /api/reviews/:reviewId/response
Authorization: Bearer <provider-token>
Content-Type: application/json

{
  "response": "Updated response text"
}
```

#### Flag Review for Moderation
```http
POST /api/reviews/:reviewId/flag
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Inappropriate language"
}
```

## Review Flow

```
1. Customer completes booking
        ↓
2. Booking status: completed
        ↓
3. Customer creates review
        ↓
4. Provider receives notification
        ↓
5. Provider's rating updated automatically
        ↓
6. Provider can respond to review
        ↓
7. Customer receives notification of response
```

## Business Rules

1. **One Review Per Booking**: Each booking can only have one review
2. **Completed Bookings Only**: Can only review completed bookings
3. **Edit Window**: Reviews can be edited within 30 days
4. **Provider Response**: Providers can respond once, then edit anytime
5. **Soft Delete**: Deleted reviews don't count in ratings
6. **Auto-update**: Provider ratings update automatically

## Rating Calculation

Provider average rating is calculated from all non-deleted reviews:

```sql
AVG(rating) FROM reviews 
WHERE provider_id = ? AND deleted_at IS NULL
```

Updates automatically when:
- New review created
- Review updated
- Review deleted

## Response Format

### Success
```json
{
  "success": true,
  "message": "Review created successfully",
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

## Testing

```bash
# Health check
curl http://localhost:3006/health

# Get provider statistics
curl http://localhost:3006/api/reviews/providers/provider-uuid/statistics

# Create review
curl -X POST http://localhost:3006/api/reviews \
  -H "Authorization: Bearer customer-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "booking-uuid",
    "providerId": "provider-uuid",
    "rating": 5,
    "comment": "Great service!"
  }'
```

## Performance

- Redis caching for provider reviews (5min TTL)
- Redis caching for statistics (10min TTL)
- Database indexes on common queries
- Efficient aggregation queries

## Security

- JWT authentication on protected routes
- Only customers can create reviews
- Only providers can respond to reviews
- Users can only edit/delete their own reviews
- Soft delete preserves data integrity

## License

MIT
