# Complete Backend Services Implementation Guide

## 🎯 Overview

You have the **complete Auth Service** as a reference. This guide shows you exactly how to build the remaining 8 services following the same pattern.

## 📋 Services to Build

1. ✅ **Auth Service** - COMPLETE (reference implementation)
2. **User Service** - Profile, addresses, favorites
3. **Provider Service** - Provider registration, services, availability
4. **Booking Service** - Create, manage, track bookings
5. **Payment Service** - Stripe integration, transactions
6. **Review Service** - Reviews, ratings, responses
7. **Search Service** - Provider search, filters
8. **Notification Service** - Email, SMS, push notifications
9. **Chat Service** - Real-time messaging

## 🏗️ Service Template Structure

Each service follows this exact structure (copy from auth-service):

```
service-name/
├── src/
│   ├── controllers/
│   │   └── serviceController.js
│   ├── services/
│   │   └── serviceLogic.js
│   ├── routes/
│   │   └── serviceRoutes.js
│   ├── middleware/
│   │   ├── authenticate.js      (copy from auth-service)
│   │   └── errorHandler.js      (copy from auth-service)
│   ├── config/
│   │   ├── database.js          (copy from auth-service)
│   │   └── redis.js             (copy from auth-service)
│   ├── utils/
│   │   └── logger.js            (copy from auth-service)
│   └── index.js
├── tests/
├── package.json
├── .env.example
└── README.md
```

## 📝 Step-by-Step Implementation

### Step 1: Copy Auth Service Structure

```bash
# For each new service:
cp -r services/auth-service services/user-service
cd services/user-service

# Update package.json name
sed -i 's/auth-service/user-service/g' package.json
sed -i 's/3001/3002/g' .env.example
```

### Step 2: Implement Service Logic

Replace `src/services/authService.js` with your service logic.

Here's the pattern for **USER SERVICE**:

```javascript
// src/services/userService.js
const pool = require('../config/database');
const redis = require('../config/redis');
const logger = require('../utils/logger');

class UserService {
  /**
   * Get user by ID
   */
  async getUser(userId) {
    // 1. Check cache
    const cacheKey = `user:${userId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // 2. Query database
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = this.formatUser(result.rows[0]);

    // 3. Cache result
    await redis.setex(cacheKey, 300, JSON.stringify(user));

    return user;
  }

  /**
   * Update user profile
   */
  async updateUser(userId, data) {
    const { firstName, lastName, phone } = data;
    
    const result = await pool.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, phone = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [firstName, lastName, phone, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    // Invalidate cache
    await redis.del(`user:${userId}`);

    logger.info(`User updated: ${userId}`);
    return this.formatUser(result.rows[0]);
  }

  /**
   * Get user addresses
   */
  async getAddresses(userId) {
    const result = await pool.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC',
      [userId]
    );

    return result.rows.map(this.formatAddress);
  }

  /**
   * Add address
   */
  async addAddress(userId, addressData) {
    const {
      addressType, streetAddress, city, state, postalCode, country, isDefault
    } = addressData;

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // If setting as default, unset others
      if (isDefault) {
        await client.query(
          'UPDATE addresses SET is_default = false WHERE user_id = $1',
          [userId]
        );
      }

      const result = await client.query(
        `INSERT INTO addresses 
         (user_id, address_type, street_address, city, state, postal_code, country, is_default)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [userId, addressType, streetAddress, city, state, postalCode, country, isDefault || false]
      );

      await client.query('COMMIT');
      
      logger.info(`Address added for user: ${userId}`);
      return this.formatAddress(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Format methods
  formatUser(row) {
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      role: row.role,
      emailVerified: row.email_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  formatAddress(row) {
    return {
      id: row.id,
      userId: row.user_id,
      addressType: row.address_type,
      streetAddress: row.street_address,
      city: row.city,
      state: row.state,
      postalCode: row.postal_code,
      country: row.country,
      isDefault: row.is_default,
      createdAt: row.created_at
    };
  }
}

module.exports = new UserService();
```

### Step 3: Implement Controller

```javascript
// src/controllers/userController.js
const userService = require('../services/userService');
const { validationResult } = require('express-validator');

class UserController {
  async getUser(req, res, next) {
    try {
      const { userId } = req.params;
      
      // Authorization check
      if (req.user.userId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const user = await userService.getUser(userId);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      const { userId } = req.params;

      if (req.user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const user = await userService.updateUser(userId, req.body);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async getAddresses(req, res, next) {
    try {
      const { userId } = req.params;

      if (req.user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const addresses = await userService.getAddresses(userId);

      res.json({
        success: true,
        data: addresses
      });
    } catch (error) {
      next(error);
    }
  }

  async addAddress(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      const { userId } = req.params;

      if (req.user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const address = await userService.addAddress(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Address added successfully',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
```

### Step 4: Define Routes

```javascript
// src/routes/userRoutes.js
const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Validation
const addressValidation = [
  body('addressType').isIn(['residential', 'commercial']),
  body('streetAddress').trim().notEmpty(),
  body('city').trim().notEmpty(),
  body('state').trim().notEmpty(),
  body('postalCode').trim().notEmpty(),
  body('country').trim().notEmpty()
];

// Routes
router.get('/:userId', authenticate, userController.getUser);
router.put('/:userId', authenticate, userController.updateUser);
router.get('/:userId/addresses', authenticate, userController.getAddresses);
router.post('/:userId/addresses', authenticate, addressValidation, userController.addAddress);

module.exports = router;
```

### Step 5: Update Main Index

```javascript
// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(','), credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'user-service' });
});

app.use('/api/users', userRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`User service running on port ${PORT}`);
});
```

## 🔥 Quick Implementation for Each Service

### BOOKING SERVICE (Port 3003)

**Key Methods:**
```javascript
class BookingService {
  async createBooking(bookingData) {
    // 1. Validate provider availability
    // 2. Create booking with status 'pending'
    // 3. Send notification to provider
    // 4. Return booking
  }

  async getBooking(bookingId) {
    // 1. Fetch from database with joins (user, provider, service)
    // 2. Return formatted booking
  }

  async getBookings(filters) {
    // 1. Build WHERE clause from filters
    // 2. Add pagination
    // 3. Return bookings with metadata
  }

  async updateBooking(bookingId, data) {
    // 1. Check if update is allowed (status-based rules)
    // 2. Update booking
    // 3. Send notifications if needed
  }

  async cancelBooking(bookingId, reason) {
    // 1. Check cancellation policy
    // 2. Update status to 'cancelled'
    // 3. Process refund if payment made
    // 4. Notify both parties
  }

  async startBooking(bookingId) {
    // Provider starts the job
    // Update status to 'in_progress'
  }

  async completeBooking(bookingId, finalPrice, notes) {
    // 1. Update status to 'completed'
    // 2. Update final_price if different
    // 3. Trigger payment if not paid
    // 4. Request review
  }
}
```

### PAYMENT SERVICE (Port 3004)

**Key Methods:**
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  async createPaymentIntent(bookingId, amount) {
    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: { bookingId }
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  }

  async processPayment(bookingId, paymentMethodId, amount) {
    // 1. Create payment intent
    // 2. Confirm payment
    // 3. Calculate platform fee (15%)
    // 4. Store transaction in database
    // 5. Update booking payment_status
    // 6. Schedule provider payout
  }

  async refund(paymentId, amount, reason) {
    // 1. Fetch payment record
    // 2. Create Stripe refund
    // 3. Update payment status
    // 4. Update booking payment_status
  }

  async createPayout(providerId) {
    // 1. Calculate provider earnings
    // 2. Create Stripe transfer to provider
    // 3. Record payout
  }
}
```

### PROVIDER SERVICE (Port 3005)

**Key Methods:**
```javascript
class ProviderService {
  async registerProvider(userId, providerData) {
    // 1. Create provider record
    // 2. Set status to 'pending' verification
    // 3. Store documents for verification
    // 4. Send verification notification
  }

  async getProvider(providerId) {
    // Fetch provider with services, ratings, stats
  }

  async updateProvider(providerId, data) {
    // Update business info, service radius, etc.
  }

  async addService(providerId, serviceData) {
    // Add a service offering with pricing
  }

  async updateAvailability(providerId, schedule) {
    // Update weekly availability schedule
  }

  async verifyProvider(providerId, status, notes) {
    // Admin action to verify/reject provider
  }

  async getEarnings(providerId, startDate, endDate) {
    // Calculate earnings for date range
  }
}
```

### REVIEW SERVICE (Port 3006)

**Key Methods:**
```javascript
class ReviewService {
  async createReview(reviewData) {
    // 1. Verify booking is completed
    // 2. Check no existing review
    // 3. Create review
    // 4. Update provider average rating
    // 5. Notify provider
  }

  async getProviderReviews(providerId, filters) {
    // Fetch with pagination, filtering
  }

  async addProviderResponse(reviewId, response) {
    // Provider responds to review
  }

  async updateProviderRating(providerId) {
    // Recalculate average rating
    const result = await pool.query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total
       FROM reviews WHERE provider_id = $1`,
      [providerId]
    );

    await pool.query(
      `UPDATE providers 
       SET average_rating = $1, total_reviews = $2
       WHERE id = $3`,
      [result.rows[0].avg_rating, result.rows[0].total, providerId]
    );
  }
}
```

### SEARCH SERVICE (Port 3007)

**Key Methods:**
```javascript
class SearchService {
  async searchProviders(filters) {
    const {
      service, latitude, longitude, radius,
      minRating, maxPrice, availability
    } = filters;

    // Build complex query
    let query = `
      SELECT p.*, ps.base_price,
             earth_distance(
               ll_to_earth(p.latitude, p.longitude),
               ll_to_earth($1, $2)
             ) / 1000 as distance
      FROM providers p
      JOIN provider_services ps ON p.id = ps.provider_id
      WHERE p.verification_status = 'verified'
    `;

    const params = [latitude, longitude];
    let paramCount = 3;

    if (service) {
      query += ` AND ps.service_id = $${paramCount++}`;
      params.push(service);
    }

    if (radius) {
      query += ` AND earth_distance(
        ll_to_earth(p.latitude, p.longitude),
        ll_to_earth($1, $2)
      ) <= $${paramCount++} * 1000`;
      params.push(radius);
    }

    if (minRating) {
      query += ` AND p.average_rating >= $${paramCount++}`;
      params.push(minRating);
    }

    query += ' ORDER BY distance, p.average_rating DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  async getAutocomplete(query) {
    // Search service names and provider names
  }
}
```

### NOTIFICATION SERVICE (Port 3008)

**Key Methods:**
```javascript
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

class NotificationService {
  async sendEmail(userId, type, data) {
    const user = await this.getUser(userId);
    
    const templates = {
      'booking_confirmed': 'd-xxxxx',
      'booking_reminder': 'd-yyyyy'
    };

    await sgMail.send({
      to: user.email,
      from: process.env.FROM_EMAIL,
      templateId: templates[type],
      dynamicTemplateData: data
    });
  }

  async sendSMS(phone, message) {
    const client = twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_TOKEN
    );

    await client.messages.create({
      body: message,
      to: phone,
      from: process.env.TWILIO_PHONE
    });
  }

  async sendPushNotification(userId, notification) {
    // Use Firebase Admin SDK
  }
}
```

### CHAT SERVICE (Port 3009)

**Uses WebSocket (Socket.io):**
```javascript
// src/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const chatService = require('./services/chatService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.ALLOWED_ORIGINS?.split(',') }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_conversation', async ({ conversationId }) => {
    socket.join(conversationId);
  });

  socket.on('send_message', async ({ conversationId, message }) => {
    const msg = await chatService.saveMessage(conversationId, {
      senderId: socket.userId,
      message,
      type: 'text'
    });

    io.to(conversationId).emit('message_received', msg);
  });

  socket.on('typing', ({ conversationId, isTyping }) => {
    socket.to(conversationId).emit('user_typing', {
      userId: socket.userId,
      isTyping
    });
  });
});

server.listen(3009);
```

## 🚀 Quick Build Script

Create this script to build all services:

```bash
#!/bin/bash
# build-all-services.sh

SERVICES=("user-service" "provider-service" "booking-service" "payment-service" "review-service" "search-service" "notification-service" "chat-service")
PORTS=(3002 3003 3004 3005 3006 3007 3008 3009)

for i in "${!SERVICES[@]}"; do
  SERVICE="${SERVICES[$i]}"
  PORT="${PORTS[$i]}"
  
  echo "Setting up $SERVICE..."
  
  # Copy auth service as template
  cp -r services/auth-service "services/$SERVICE"
  
  # Update package.json
  sed -i "s/auth-service/$SERVICE/g" "services/$SERVICE/package.json"
  
  # Update port
  sed -i "s/3001/$PORT/g" "services/$SERVICE/.env.example"
  
  echo "$SERVICE ready at port $PORT"
done
```

## ✅ Testing Each Service

```bash
# Health check
curl http://localhost:3002/health

# Create test request
curl -X POST http://localhost:3002/api/users/user-123/addresses \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "addressType": "residential",
    "streetAddress": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  }'
```

## 📊 Development Timeline

**Per Service (following pattern):**
- Setup: 30 minutes
- Core logic: 4-6 hours
- Testing: 2 hours
- **Total: 1 day per service**

**All 8 services: 8-10 days**

## 💡 Pro Tips

1. **Start with User Service** - It's the simplest
2. **Copy middleware/config** from auth-service (don't rewrite)
3. **Test as you go** - Use Postman/curl
4. **Follow the pattern** - Don't deviate from auth-service structure
5. **Use transactions** - For multi-table operations
6. **Cache aggressively** - Redis for read-heavy data
7. **Log everything** - Winston for debugging

You have everything you need - the pattern is clear, the database is designed, and the frontend is waiting!
