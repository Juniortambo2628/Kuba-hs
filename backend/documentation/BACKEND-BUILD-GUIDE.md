# Backend Services - Complete Implementation Summary

## 🎯 Current Status

You have **1 complete service** (Auth) and need to build **8 more services**.

## ✅ What You Have

### Auth Service (100% Complete)
- **Location**: `implementation-roadmap.md` (lines 200-500+)
- **Features**: Login, register, logout, password reset, email verification, token refresh
- **Files**: Full implementation with ~600 lines of production code
- **Status**: Ready to deploy

## 🏗️ How to Build Each Service (10 Minutes Each)

### Step-by-Step Process

**1. Copy Auth Service Structure**
```bash
cp -r services/auth-service services/user-service
cd services/user-service
```

**2. Update Configuration**
```bash
# Change service name in package.json
sed -i 's/auth-service/user-service/g' package.json

# Change port in .env.example  
sed -i 's/3001/3002/g' .env.example
```

**3. Replace Service Logic**

Open `src/services/authService.js` and replace with your service logic following this pattern:

```javascript
// PATTERN FOR ANY SERVICE
const pool = require('../config/database');
const redis = require('../config/redis');
const logger = require('../utils/logger');

class YourService {
  // GET single resource
  async getResource(id) {
    // 1. Check cache
    const cached = await redis.get(`resource:${id}`);
    if (cached) return JSON.parse(cached);

    // 2. Query database
    const result = await pool.query('SELECT * FROM table WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      throw new Error('Not found');
    }

    const data = this.formatData(result.rows[0]);

    // 3. Cache (5 min TTL)
    await redis.setex(`resource:${id}`, 300, JSON.stringify(data));

    return data;
  }

  // CREATE resource
  async createResource(data) {
    const result = await pool.query(
      'INSERT INTO table (field1, field2) VALUES ($1, $2) RETURNING *',
      [data.field1, data.field2]
    );

    logger.info(`Resource created: ${result.rows[0].id}`);
    return this.formatData(result.rows[0]);
  }

  // UPDATE resource
  async updateResource(id, data) {
    const result = await pool.query(
      'UPDATE table SET field1 = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [data.field1, id]
    );

    if (result.rows.length === 0) {
      throw new Error('Not found');
    }

    // Invalidate cache
    await redis.del(`resource:${id}`);

    logger.info(`Resource updated: ${id}`);
    return this.formatData(result.rows[0]);
  }

  // DELETE resource
  async deleteResource(id) {
    const result = await pool.query('DELETE FROM table WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      throw new Error('Not found');
    }

    await redis.del(`resource:${id}`);
    logger.info(`Resource deleted: ${id}`);
  }

  // LIST resources with pagination
  async listResources(filters = {}) {
    const { page = 1, limit = 20, status } = filters;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM table WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount++}`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM table WHERE 1=1');
    const total = parseInt(countResult.rows[0].count);

    return {
      data: result.rows.map(this.formatData),
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Helper to format database rows
  formatData(row) {
    return {
      id: row.id,
      field1: row.field_1,
      field2: row.field_2,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = new YourService();
```

**4. Update Controller**

The controller stays almost identical - just change method names:

```javascript
const yourService = require('../services/yourService');

class YourController {
  async getResource(req, res, next) {
    try {
      const { id } = req.params;
      const data = await yourService.getResource(id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async createResource(req, res, next) {
    try {
      const data = await yourService.createResource(req.body);
      res.status(201).json({ 
        success: true, 
        message: 'Created successfully',
        data 
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new YourController();
```

**5. Update Routes**

```javascript
const express = require('express');
const yourController = require('../controllers/yourController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/:id', authenticate, yourController.getResource);
router.post('/', authenticate, yourController.createResource);
router.put('/:id', authenticate, yourController.updateResource);
router.delete('/:id', authenticate, yourController.deleteResource);

module.exports = router;
```

**6. Update Main Index**

```javascript
// src/index.js
const yourRoutes = require('./routes/yourRoutes');

app.use('/api/your-resource', yourRoutes);
```

**Done!** That's it - your service is ready.

## 📝 Service-Specific Implementation Examples

### USER SERVICE (Port 3002)

```javascript
// src/services/userService.js

async getUser(userId) {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  const result = await pool.query(
    'SELECT id, email, first_name, last_name, phone, role, email_verified, profile_picture, created_at FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) throw new Error('User not found');

  const user = {
    id: result.rows[0].id,
    email: result.rows[0].email,
    firstName: result.rows[0].first_name,
    lastName: result.rows[0].last_name,
    phone: result.rows[0].phone,
    role: result.rows[0].role,
    emailVerified: result.rows[0].email_verified,
    profilePicture: result.rows[0].profile_picture,
    createdAt: result.rows[0].created_at
  };

  await redis.setex(`user:${userId}`, 300, JSON.stringify(user));
  return user;
}

async addAddress(userId, data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (data.isDefault) {
      await client.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [userId]);
    }

    const result = await client.query(
      `INSERT INTO addresses (user_id, address_type, street_address, city, state, postal_code, country, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, data.addressType, data.streetAddress, data.city, data.state, data.postalCode, data.country, data.isDefault || false]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

### BOOKING SERVICE (Port 3003)

```javascript
// src/services/bookingService.js

async createBooking(data) {
  const bookingNumber = `BK-${Date.now()}`;
  
  const result = await pool.query(
    `INSERT INTO bookings 
     (customer_id, provider_id, service_id, booking_number, scheduled_date, address_id, description, estimated_price, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
     RETURNING *`,
    [data.customerId, data.providerId, data.serviceId, bookingNumber, data.scheduledDate, data.addressId, data.description, data.estimatedPrice]
  );

  // Send notification to provider (async - don't wait)
  this.notifyProvider(data.providerId, result.rows[0].id).catch(err => logger.error(err));

  return result.rows[0];
}

async cancelBooking(bookingId, reason) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update booking
    await client.query(
      `UPDATE bookings SET status = 'cancelled', cancellation_reason = $1 WHERE id = $2`,
      [reason, bookingId]
    );

    // Check if payment was made
    const payment = await client.query(
      'SELECT * FROM payments WHERE booking_id = $1 AND status = completed',
      [bookingId]
    );

    // Process refund if needed
    if (payment.rows.length > 0) {
      // Call payment service to refund
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

### PAYMENT SERVICE (Port 3004)

```javascript
// src/services/paymentService.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async createPaymentIntent(bookingId, amount) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    metadata: { bookingId }
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  };
}

async processPayment(bookingId, paymentMethodId, amount) {
  // Confirm payment with Stripe
  const paymentIntent = await stripe.paymentIntents.confirm(paymentMethodId);

  const platformFee = amount * 0.15; // 15% platform fee
  const providerAmount = amount - platformFee;

  // Store in database
  const result = await pool.query(
    `INSERT INTO payments (booking_id, amount, platform_fee, provider_amount, transaction_id, status, payment_gateway)
     VALUES ($1, $2, $3, $4, $5, 'completed', 'stripe')
     RETURNING *`,
    [bookingId, amount, platformFee, providerAmount, paymentIntent.id]
  );

  // Update booking payment status
  await pool.query(
    'UPDATE bookings SET payment_status = $1 WHERE id = $2',
    ['paid', bookingId]
  );

  return result.rows[0];
}
```

### SEARCH SERVICE (Port 3007)

```javascript
// src/services/searchService.js

async searchProviders(filters) {
  const { service, latitude, longitude, radius = 10, minRating, page = 1, limit = 20 } = filters;
  
  let query = `
    SELECT p.*, ps.base_price, ps.pricing_type,
           earth_distance(ll_to_earth(p.latitude, p.longitude), ll_to_earth($1, $2)) / 1000 as distance
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
    query += ` AND earth_distance(ll_to_earth(p.latitude, p.longitude), ll_to_earth($1, $2)) <= $${paramCount++} * 1000`;
    params.push(radius);
  }

  if (minRating) {
    query += ` AND p.average_rating >= $${paramCount++}`;
    params.push(minRating);
  }

  query += ` ORDER BY distance, p.average_rating DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
  params.push(limit, (page - 1) * limit);

  const result = await pool.query(query, params);
  return result.rows;
}
```

## 🚀 Quick Build Commands

```bash
# Build user service
cd services
cp -r auth-service user-service
cd user-service
sed -i 's/auth-service/user-service/g' package.json
sed -i 's/3001/3002/g' .env.example
# Then replace service logic

# Start the service
npm install
cp .env.example .env
npm run dev
```

## ✅ Testing

```bash
# Health check
curl http://localhost:3002/health

# Test endpoint (with auth token)
curl -X GET http://localhost:3002/api/users/user-123 \
  -H "Authorization: Bearer your-jwt-token"
```

## 📊 Estimated Time

**Per Service:**
- Setup (copy & configure): 10 minutes
- Implement service logic: 3-4 hours
- Test: 1 hour
- **Total: Half day per service**

**All 8 Services: 4-5 days**

## 💡 Pro Tips

1. **Don't Reinvent** - Copy auth-service structure exactly
2. **Reuse Middleware** - Use same authenticate.js, errorHandler.js, logger.js
3. **Follow Naming** - Keep controller/service/routes pattern consistent
4. **Test Incrementally** - Build and test one method at a time
5. **Use Transactions** - For operations affecting multiple tables
6. **Cache Smart** - Cache GET operations, invalidate on updates
7. **Log Everything** - Winston is already set up

## 🎯 Priority Order

Build in this order for fastest MVP:

1. **User Service** (Simplest - good warm-up)
2. **Provider Service** (Core business logic)
3. **Booking Service** (Main feature)
4. **Payment Service** (Critical path)
5. **Search Service** (User experience)
6. **Review Service** (Trust & credibility)
7. **Notification Service** (Engagement)
8. **Chat Service** (Nice to have)

## ✨ You're Ready!

You have:
- ✅ Complete auth service as reference
- ✅ Database schema designed
- ✅ Frontend already calling these APIs
- ✅ Clear pattern to follow

Just copy, modify, and deploy! 🚀
