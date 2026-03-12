# Booking Service - Complete & Ready to Deploy! 🚀

## ✅ What's Included

A **production-ready** Booking Service - the heart of your platform that connects customers with providers.

### Files Created (17 total)
```
booking-service/
├── src/
│   ├── controllers/
│   │   └── bookingController.js    ✅ 14 endpoints
│   ├── services/
│   │   └── bookingService.js       ✅ Complete booking logic
│   ├── routes/
│   │   └── bookingRoutes.js        ✅ All routes with validation
│   ├── middleware/
│   │   ├── authenticate.js         ✅ JWT authentication
│   │   └── errorHandler.js         ✅ Error handling
│   ├── config/
│   │   ├── database.js             ✅ PostgreSQL pool
│   │   └── redis.js                ✅ Redis client
│   ├── utils/
│   │   ├── logger.js               ✅ Winston logging
│   │   └── s3.js                   ✅ S3 image upload
│   └── index.js                    ✅ Express server
├── package.json                    ✅ All dependencies
├── .env.example                    ✅ Environment template
├── .gitignore                      ✅ Git configuration
├── Dockerfile                      ✅ Docker build
├── docker-compose.yml              ✅ Full stack deployment
├── .dockerignore                   ✅ Docker ignore rules
└── README.md                       ✅ Complete documentation
```

### Features Implemented ✅

1. **Complete Booking Lifecycle**
   ```
   Create → Confirm → Start → Complete
        ↓         ↓
    Cancel   Reschedule
   ```

2. **Status Management**
   - Pending (awaiting provider confirmation)
   - Confirmed (provider accepted)
   - In Progress (provider working)
   - Completed (job finished)
   - Cancelled (by customer or provider)

3. **Booking Operations**
   - Create with availability validation
   - Update booking details (pending only)
   - Reschedule to new date/time
   - Cancel with reason
   - Provider confirmation
   - Start work tracking
   - Complete with final price & photos

4. **Image Management**
   - Upload before/after photos
   - Completion documentation
   - Multiple images per booking
   - Track uploader (customer/provider)

5. **Service Integrations**
   - **Payment Service**: Request payment on completion, refund on cancellation
   - **Notification Service**: Notify both parties on all status changes

6. **Smart Features**
   - Automatic booking number generation
   - Provider availability validation
   - Provider verification check
   - Authorization (customers/providers can only access their bookings)
   - Statistics dashboard

7. **Security & Performance**
   - JWT authentication
   - Role-based authorization
   - Redis caching (2-minute TTL)
   - Input validation
   - File upload validation
   - SQL injection prevention

### Code Statistics
- **Lines of Code**: ~1,400 lines
- **Endpoints**: 14 API endpoints
- **Database Queries**: Optimized with proper indexing
- **Caching Strategy**: Redis for booking details
- **File Upload**: Direct to AWS S3

## 🚀 Quick Start (3 Steps)

### Step 1: Extract and Install

```bash
tar -xzf booking-service-complete.tar.gz
cd booking-service
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
nano .env
```

**Required Configuration:**
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/homeservice

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secret (same as other services)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# AWS S3 (for booking images)
AWS_REGION=us-east-1
AWS_S3_BUCKET=homeservice-uploads
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key

# Microservices (optional - for integrations)
NOTIFICATION_SERVICE_URL=http://localhost:3008
PAYMENT_SERVICE_URL=http://localhost:3005

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### Step 3: Run the Service

```bash
# Development mode
npm run dev

# Or production mode
npm start
```

**Service starts at: http://localhost:3004**

## 📊 Database Setup

The service needs these tables:

```sql
-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id),
  provider_id UUID REFERENCES providers(id),
  service_id UUID REFERENCES services(id),
  booking_number VARCHAR(50) UNIQUE NOT NULL,
  scheduled_date TIMESTAMP NOT NULL,
  address_id UUID REFERENCES addresses(id),
  description TEXT,
  estimated_price DECIMAL(10, 2),
  final_price DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  payment_status VARCHAR(20) DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  completion_notes TEXT,
  cancellation_reason TEXT,
  confirmed_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_date);
CREATE INDEX idx_bookings_number ON bookings(booking_number);

-- Booking images
CREATE TABLE booking_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type VARCHAR(20) CHECK (image_type IN ('before', 'after', 'completion', 'other')),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_booking_images ON booking_images(booking_id);
```

## 🐳 Docker Deployment

### With Full Stack

```bash
docker-compose up -d

# Check logs
docker-compose logs -f booking-service
```

### Service Only

```bash
docker build -t booking-service .
docker run -d -p 3004:3004 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  -e JWT_SECRET=... \
  booking-service
```

## 🧪 Testing the Service

### Health Check
```bash
curl http://localhost:3004/health
```

### Create Booking (Customer)
```bash
curl -X POST http://localhost:3004/api/bookings \
  -H "Authorization: Bearer customer-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "providerId": "provider-uuid",
    "serviceId": "service-uuid",
    "scheduledDate": "2024-02-15T10:00:00Z",
    "addressId": "address-uuid",
    "description": "Kitchen sink is clogged, need urgent repair",
    "estimatedPrice": 150.00
  }'
```

Response:
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "booking-uuid",
    "bookingNumber": "BK-1706180400000-ABC123",
    "status": "pending",
    "paymentStatus": "unpaid",
    ...
  }
}
```

### Confirm Booking (Provider)
```bash
curl -X POST http://localhost:3004/api/bookings/booking-id/confirm \
  -H "Authorization: Bearer provider-jwt-token"
```

### Start Work (Provider)
```bash
curl -X POST http://localhost:3004/api/bookings/booking-id/start \
  -H "Authorization: Bearer provider-jwt-token"
```

### Complete Booking (Provider)
```bash
curl -X POST http://localhost:3004/api/bookings/booking-id/complete \
  -H "Authorization: Bearer provider-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "finalPrice": 165.00,
    "notes": "Fixed the clog, replaced worn gasket. Everything working perfectly.",
    "images": ["s3-url-1", "s3-url-2"]
  }'
```

### Get Bookings
```bash
# Customer bookings
curl "http://localhost:3004/api/bookings?type=customer&status=pending" \
  -H "Authorization: Bearer customer-jwt-token"

# Provider bookings
curl "http://localhost:3004/api/bookings?type=provider&status=confirmed" \
  -H "Authorization: Bearer provider-jwt-token"
```

### Upload Images
```bash
curl -X POST http://localhost:3004/api/bookings/booking-id/images \
  -H "Authorization: Bearer your-jwt-token" \
  -F "images=@before.jpg" \
  -F "images=@after.jpg" \
  -F "imageType=completion"
```

## 📝 API Endpoints Reference

| Method | Endpoint | Description | Auth | Who |
|--------|----------|-------------|------|-----|
| GET | `/health` | Health check | No | All |
| **Booking Management** |
| POST | `/api/bookings` | Create booking | Yes | Customer |
| GET | `/api/bookings` | List bookings | Yes | Customer/Provider |
| GET | `/api/bookings/:id` | Get booking details | Yes | Customer/Provider |
| PUT | `/api/bookings/:id` | Update booking | Yes | Customer |
| **Booking Actions** |
| POST | `/api/bookings/:id/reschedule` | Reschedule | Yes | Customer/Provider |
| POST | `/api/bookings/:id/cancel` | Cancel | Yes | Customer/Provider |
| POST | `/api/bookings/:id/confirm` | Confirm | Yes | Provider |
| POST | `/api/bookings/:id/start` | Start work | Yes | Provider |
| POST | `/api/bookings/:id/complete` | Complete | Yes | Provider |
| **Images** |
| GET | `/api/bookings/:id/images` | List images | Yes | Customer/Provider |
| POST | `/api/bookings/:id/images` | Upload images | Yes | Customer/Provider |
| **Statistics** |
| GET | `/api/bookings/statistics` | Get stats | Yes | Customer/Provider |

## 🔄 Booking Lifecycle Explained

### Complete Flow Example

```
1. CUSTOMER creates booking
   Status: pending
   → Provider receives notification
   
2. PROVIDER confirms booking
   Status: confirmed
   → Customer receives confirmation
   → Payment may be requested (depending on policy)
   
3. PROVIDER arrives and starts work
   Status: in_progress
   → Customer receives "work started" notification
   
4. PROVIDER completes work
   - Uploads before/after photos
   - Sets final price (if different from estimate)
   - Adds completion notes
   Status: completed
   → Customer receives completion notification
   → Payment requested (if not already paid)
   → Review requested from customer
   
5. CUSTOMER leaves review
   → Provider can respond to review
```

### Alternative Flows

**Rescheduling:**
```
Status: pending or confirmed
↓
Customer or Provider requests new date
↓
Both parties receive notification
↓
Status remains same, date updated
```

**Cancellation:**
```
Status: any (except completed)
↓
Customer or Provider cancels with reason
↓
Status: cancelled
↓
If paid → Refund initiated
↓
Both parties receive notification
```

## 🔧 Integration with Frontend

Your web app is already configured!

```typescript
// Frontend code (already in web-app):
import bookingService from '@/services/booking.service';

// Create booking
const booking = await bookingService.createBooking({
  providerId,
  serviceId,
  scheduledDate: '2024-02-15T10:00:00Z',
  addressId,
  description: 'Need plumbing repair',
  estimatedPrice: 150
});

// Get bookings
const bookings = await bookingService.getBookings({
  status: 'pending',
  page: 1,
  limit: 10
});

// Confirm booking (provider)
await bookingService.confirmBooking(bookingId);

// Complete booking (provider)
await bookingService.completeBooking(bookingId, {
  finalPrice: 165,
  notes: 'Job completed successfully',
  images: ['url1', 'url2']
});
```

## 🌟 Key Features Explained

### 1. Availability Validation

When creating a booking, the service:
1. Checks if provider is verified
2. Validates provider is available on selected day
3. Prevents double-booking (can be enhanced)

### 2. Smart Notifications

Automatically notifies:
- Provider when new booking created
- Customer when booking confirmed
- Customer when work started
- Customer when work completed
- Both parties when rescheduled
- Both parties when cancelled

### 3. Payment Integration

- Requests payment on completion
- Processes refunds on cancellation
- Tracks payment status separately from booking status

### 4. Image Documentation

- Before photos (customer can upload)
- After photos (provider uploads)
- Completion documentation
- Multiple images supported
- Stored in S3 with CDN access

### 5. Statistics Dashboard

Returns counts:
```json
{
  "pending": 3,
  "confirmed": 5,
  "inProgress": 2,
  "completed": 45,
  "cancelled": 1,
  "total": 56
}
```

## 📈 Performance Optimizations

1. **Redis Caching**: Booking details cached for 2 minutes
2. **Database Indexes**: On customer_id, provider_id, status, scheduled_date
3. **Async Operations**: Notifications and payments don't block response
4. **Connection Pooling**: Max 20 database connections
5. **Optimized Queries**: Proper joins with selected fields

## 🔒 Security Features

✅ JWT authentication on all routes  
✅ Authorization checks (users can only access their bookings)  
✅ Provider verification before booking creation  
✅ Status transition validation  
✅ File upload validation (type, size)  
✅ SQL injection prevention  
✅ Input validation on all endpoints  

## 📊 Service Progress

| Service | Port | Status | Complexity |
|---------|------|--------|------------|
| Auth Service | 3001 | ✅ Complete | Medium |
| User Service | 3002 | ✅ Complete | Medium |
| Provider Service | 3003 | ✅ Complete | High |
| **Booking Service** | 3004 | ✅ **COMPLETE** | Very High |
| Payment Service | 3005 | 📝 Next | High |
| Review Service | 3006 | 📝 To do | Medium |
| Search Service | 3007 | 📝 To do | Medium |
| Notification Service | 3008 | 📝 To do | Medium |
| Chat Service | 3009 | 📝 To do | High |

**Progress: 4/9 services complete (44%)** 🎉

## 🎯 What's Next?

**Option 1**: Test this service
```bash
npm run dev
curl http://localhost:3004/health
```

**Option 2**: Build Payment Service
The most critical integration - handles Stripe payments, refunds, and payouts.

**Want me to build the Payment Service next?** It integrates directly with Stripe and manages the entire financial flow.

You now have **4 complete services** including the most complex one (Booking)! That's huge progress! 🚀

## 💡 Pro Tips

1. **Test the Flow**: Create → Confirm → Start → Complete
2. **Check Integrations**: Ensure Payment and Notification services are configured
3. **Monitor Status**: Track bookings through each state
4. **Use Statistics**: Build dashboards with the stats endpoint
5. **Image Quality**: Encourage high-quality before/after photos

This is your **core business logic** - the booking service connects everything together! 🎉
