# API Design Documentation

## API Standards & Conventions

### Base URL Structure
```
Development: http://localhost:3000/api/v1
Staging:     https://api-staging.yourplatform.com/api/v1
Production:  https://api.yourplatform.com/api/v1
```

### Response Format
All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "metadata": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "code": "VALIDATION_ERROR"
}
```

### HTTP Status Codes
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Authentication
All authenticated endpoints require a Bearer token:
```
Authorization: Bearer <access_token>
```

## API Endpoints

### 1. Authentication Service

#### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "customer"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  }
}
```

#### POST /api/auth/login
Authenticate user and receive tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /api/auth/logout
Logout user and invalidate tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### POST /api/auth/refresh-token
Get new access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET /api/auth/verify-email/:token
Verify user's email address.

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### POST /api/auth/forgot-password
Request password reset.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent."
}
```

#### POST /api/auth/reset-password
Reset password with token.

**Request:**
```json
{
  "token": "reset-token-here",
  "newPassword": "NewSecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 2. User Service

#### GET /api/users/:id
Get user profile by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "customer",
    "emailVerified": true,
    "profilePicture": "https://cdn.example.com/profiles/user.jpg",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

#### PUT /api/users/:id
Update user profile.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "profilePicture": "base64-encoded-image"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890"
  }
}
```

#### GET /api/users/:id/addresses
Get user's addresses.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "address-uuid-1",
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
  ]
}
```

#### POST /api/users/:id/addresses
Add new address.

**Request:**
```json
{
  "addressType": "residential",
  "streetAddress": "456 Oak Ave",
  "apartment": "Suite 200",
  "city": "San Francisco",
  "state": "CA",
  "postalCode": "94102",
  "country": "USA",
  "isDefault": false
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Address added successfully",
  "data": {
    "id": "address-uuid-2",
    "streetAddress": "456 Oak Ave",
    "city": "San Francisco",
    "isDefault": false
  }
}
```

#### DELETE /api/users/:id/addresses/:addressId
Delete an address.

**Response (204):**
No content

---

### 3. Provider Service

#### POST /api/providers
Register as a service provider.

**Request:**
```json
{
  "businessName": "John's Plumbing Services",
  "description": "Professional plumbing services for 20+ years",
  "serviceRadius": 50,
  "address": {
    "streetAddress": "789 Business Blvd",
    "city": "Los Angeles",
    "state": "CA",
    "postalCode": "90001",
    "country": "USA"
  },
  "services": ["plumbing", "emergency-plumbing"],
  "documents": [
    {
      "type": "license",
      "url": "https://s3.amazonaws.com/docs/license.pdf"
    },
    {
      "type": "insurance",
      "url": "https://s3.amazonaws.com/docs/insurance.pdf"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Provider registration submitted for verification",
  "data": {
    "id": "provider-uuid-1",
    "businessName": "John's Plumbing Services",
    "verificationStatus": "pending"
  }
}
```

#### GET /api/providers/:id
Get provider profile.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "provider-uuid-1",
    "userId": "user-uuid",
    "businessName": "John's Plumbing Services",
    "description": "Professional plumbing services for 20+ years",
    "serviceRadius": 50,
    "location": {
      "latitude": 34.0522,
      "longitude": -118.2437,
      "city": "Los Angeles",
      "state": "CA"
    },
    "verificationStatus": "verified",
    "averageRating": 4.8,
    "totalReviews": 127,
    "totalJobsCompleted": 342,
    "services": [
      {
        "id": "service-1",
        "name": "General Plumbing",
        "category": "Plumbing",
        "basePrice": 75.00,
        "pricingType": "hourly"
      }
    ],
    "availability": {
      "monday": { "start": "08:00", "end": "18:00" },
      "tuesday": { "start": "08:00", "end": "18:00" },
      "wednesday": { "start": "08:00", "end": "18:00" },
      "thursday": { "start": "08:00", "end": "18:00" },
      "friday": { "start": "08:00", "end": "18:00" },
      "saturday": { "start": "09:00", "end": "14:00" },
      "sunday": null
    }
  }
}
```

#### PUT /api/providers/:id
Update provider profile.

**Request:**
```json
{
  "businessName": "John's Premium Plumbing",
  "description": "Updated description",
  "serviceRadius": 75
}
```

#### GET /api/providers/:id/services
Get provider's services.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "service-1",
      "serviceId": "plumbing-general",
      "name": "General Plumbing",
      "category": "Plumbing",
      "basePrice": 75.00,
      "pricingType": "hourly",
      "isAvailable": true,
      "description": "General plumbing repairs and maintenance"
    }
  ]
}
```

#### POST /api/providers/:id/services
Add a service offering.

**Request:**
```json
{
  "serviceId": "plumbing-emergency",
  "basePrice": 150.00,
  "pricingType": "hourly",
  "description": "24/7 emergency plumbing services"
}
```

#### PUT /api/providers/:id/availability
Update availability schedule.

**Request:**
```json
{
  "monday": { "start": "07:00", "end": "19:00" },
  "tuesday": { "start": "07:00", "end": "19:00" },
  "wednesday": { "start": "07:00", "end": "19:00" },
  "thursday": { "start": "07:00", "end": "19:00" },
  "friday": { "start": "07:00", "end": "19:00" },
  "saturday": { "start": "08:00", "end": "16:00" },
  "sunday": { "start": "10:00", "end": "14:00" }
}
```

---

### 4. Booking Service

#### POST /api/bookings
Create a new booking.

**Request:**
```json
{
  "providerId": "provider-uuid-1",
  "serviceId": "service-uuid-1",
  "scheduledDate": "2024-02-15T10:00:00Z",
  "scheduledEndDate": "2024-02-15T12:00:00Z",
  "addressId": "address-uuid-1",
  "description": "Kitchen sink is leaking. Need urgent repair.",
  "estimatedPrice": 150.00,
  "images": [
    "https://s3.amazonaws.com/bookings/image1.jpg"
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "booking-uuid-1",
    "bookingNumber": "BK-20240115-001",
    "status": "pending",
    "scheduledDate": "2024-02-15T10:00:00Z",
    "estimatedPrice": 150.00,
    "provider": {
      "id": "provider-uuid-1",
      "businessName": "John's Plumbing Services",
      "phone": "+1234567890"
    }
  }
}
```

#### GET /api/bookings/:id
Get booking details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "booking-uuid-1",
    "bookingNumber": "BK-20240115-001",
    "status": "confirmed",
    "customer": {
      "id": "user-uuid",
      "name": "John Doe",
      "phone": "+1234567890"
    },
    "provider": {
      "id": "provider-uuid-1",
      "businessName": "John's Plumbing Services",
      "phone": "+1987654321"
    },
    "service": {
      "id": "service-uuid-1",
      "name": "General Plumbing",
      "category": "Plumbing"
    },
    "scheduledDate": "2024-02-15T10:00:00Z",
    "scheduledEndDate": "2024-02-15T12:00:00Z",
    "address": {
      "streetAddress": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001"
    },
    "description": "Kitchen sink is leaking",
    "estimatedPrice": 150.00,
    "finalPrice": null,
    "paymentStatus": "pending",
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-01-15T09:30:00Z"
  }
}
```

#### GET /api/bookings
Get user's bookings with filters.

**Query Parameters:**
- `status` - Filter by status (pending, confirmed, in_progress, completed, cancelled)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sortBy` - Sort field (scheduledDate, createdAt)
- `sortOrder` - Sort order (asc, desc)

**Example:** `GET /api/bookings?status=confirmed&page=1&limit=10&sortBy=scheduledDate&sortOrder=desc`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "booking-uuid-1",
      "bookingNumber": "BK-20240115-001",
      "status": "confirmed",
      "scheduledDate": "2024-02-15T10:00:00Z",
      "service": "General Plumbing",
      "provider": "John's Plumbing Services",
      "estimatedPrice": 150.00
    }
  ],
  "metadata": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### PUT /api/bookings/:id
Update booking (reschedule, update details).

**Request:**
```json
{
  "scheduledDate": "2024-02-16T14:00:00Z",
  "description": "Updated description"
}
```

#### POST /api/bookings/:id/cancel
Cancel a booking.

**Request:**
```json
{
  "reason": "Found another provider",
  "cancelledBy": "customer"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": "booking-uuid-1",
    "status": "cancelled",
    "cancellationReason": "Found another provider"
  }
}
```

#### POST /api/bookings/:id/complete
Mark booking as completed.

**Request:**
```json
{
  "finalPrice": 175.00,
  "notes": "Additional work required for pipe replacement"
}
```

#### POST /api/bookings/:id/start
Provider starts the job.

**Response (200):**
```json
{
  "success": true,
  "message": "Job started",
  "data": {
    "id": "booking-uuid-1",
    "status": "in_progress",
    "startedAt": "2024-02-15T10:00:00Z"
  }
}
```

---

### 5. Payment Service

#### POST /api/payments/intent
Create payment intent.

**Request:**
```json
{
  "bookingId": "booking-uuid-1",
  "amount": 150.00,
  "currency": "usd"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxxxxxxxxxxxx_secret_xxxxxxxxxxxxx",
    "paymentIntentId": "pi_xxxxxxxxxxxxx"
  }
}
```

#### POST /api/payments/process
Process payment.

**Request:**
```json
{
  "bookingId": "booking-uuid-1",
  "paymentMethodId": "pm_xxxxxxxxxxxxx",
  "amount": 150.00
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "id": "payment-uuid-1",
    "transactionId": "txn_xxxxxxxxxxxxx",
    "amount": 150.00,
    "platformFee": 22.50,
    "providerAmount": 127.50,
    "status": "completed"
  }
}
```

#### GET /api/payments/:id
Get payment details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "payment-uuid-1",
    "bookingId": "booking-uuid-1",
    "amount": 150.00,
    "platformFee": 22.50,
    "providerAmount": 127.50,
    "status": "completed",
    "paymentMethod": "card",
    "transactionId": "txn_xxxxxxxxxxxxx",
    "createdAt": "2024-02-15T12:00:00Z"
  }
}
```

#### POST /api/payments/:id/refund
Refund a payment.

**Request:**
```json
{
  "amount": 150.00,
  "reason": "Service not provided"
}
```

#### GET /api/payments/transactions
Get payment history.

**Query Parameters:**
- `startDate` - Filter from date
- `endDate` - Filter to date
- `status` - Filter by status
- `page` - Page number
- `limit` - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "payment-uuid-1",
      "bookingNumber": "BK-20240115-001",
      "amount": 150.00,
      "status": "completed",
      "createdAt": "2024-02-15T12:00:00Z"
    }
  ],
  "metadata": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### 6. Review Service

#### POST /api/reviews
Create a review.

**Request:**
```json
{
  "bookingId": "booking-uuid-1",
  "providerId": "provider-uuid-1",
  "rating": 5,
  "comment": "Excellent service! Very professional and punctual.",
  "categories": {
    "professionalism": 5,
    "quality": 5,
    "value": 4,
    "communication": 5
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "id": "review-uuid-1",
    "rating": 5,
    "comment": "Excellent service!",
    "isVerified": true,
    "createdAt": "2024-02-15T14:00:00Z"
  }
}
```

#### GET /api/reviews/provider/:providerId
Get provider reviews.

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `rating` - Filter by rating (1-5)
- `sortBy` - Sort by (date, rating, helpful)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "provider": {
      "id": "provider-uuid-1",
      "businessName": "John's Plumbing Services",
      "averageRating": 4.8,
      "totalReviews": 127
    },
    "reviews": [
      {
        "id": "review-uuid-1",
        "customer": {
          "name": "John D.",
          "initials": "JD"
        },
        "rating": 5,
        "comment": "Excellent service!",
        "categories": {
          "professionalism": 5,
          "quality": 5,
          "value": 4,
          "communication": 5
        },
        "isVerified": true,
        "providerResponse": null,
        "helpfulCount": 12,
        "createdAt": "2024-02-15T14:00:00Z"
      }
    ],
    "ratingDistribution": {
      "5": 85,
      "4": 30,
      "3": 8,
      "2": 3,
      "1": 1
    }
  },
  "metadata": {
    "page": 1,
    "limit": 10,
    "total": 127,
    "totalPages": 13
  }
}
```

#### POST /api/reviews/:id/response
Provider responds to review.

**Request:**
```json
{
  "response": "Thank you for your kind words! It was a pleasure working with you."
}
```

#### POST /api/reviews/:id/helpful
Mark review as helpful.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "helpfulCount": 13
  }
}
```

---

### 7. Search Service

#### GET /api/search/providers
Search for providers.

**Query Parameters:**
- `q` - Search query
- `service` - Service category
- `latitude` - User latitude
- `longitude` - User longitude
- `radius` - Search radius in km
- `minRating` - Minimum rating (1-5)
- `maxPrice` - Maximum price
- `availability` - Date availability
- `page` - Page number
- `limit` - Items per page

**Example:** `GET /api/search/providers?service=plumbing&latitude=40.7128&longitude=-74.0060&radius=10&minRating=4`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "provider-uuid-1",
      "businessName": "John's Plumbing Services",
      "rating": 4.8,
      "totalReviews": 127,
      "distance": 2.5,
      "basePrice": 75.00,
      "pricingType": "hourly",
      "availability": "available",
      "services": ["General Plumbing", "Emergency Plumbing"],
      "profileImage": "https://cdn.example.com/providers/provider1.jpg",
      "badges": ["verified", "topRated", "quickResponse"]
    }
  ],
  "metadata": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

#### GET /api/search/services
Search for services.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "service-uuid-1",
      "name": "General Plumbing",
      "category": "Plumbing",
      "icon": "https://cdn.example.com/icons/plumbing.svg",
      "averagePrice": 85.00,
      "providerCount": 234
    }
  ]
}
```

#### GET /api/search/autocomplete
Get autocomplete suggestions.

**Query Parameters:**
- `q` - Search query
- `type` - Type (services, providers, locations)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "type": "service",
      "value": "Plumbing",
      "label": "Plumbing Services",
      "count": 234
    },
    {
      "type": "provider",
      "value": "provider-uuid-1",
      "label": "John's Plumbing Services",
      "rating": 4.8
    }
  ]
}
```

---

### 8. Notification Service

#### POST /api/notifications/send
Send a notification (internal use).

**Request:**
```json
{
  "userId": "user-uuid-1",
  "type": "booking_confirmed",
  "channels": ["push", "email", "sms"],
  "data": {
    "bookingNumber": "BK-20240115-001",
    "scheduledDate": "2024-02-15T10:00:00Z"
  }
}
```

#### GET /api/notifications/:userId
Get user notifications.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "notification-uuid-1",
      "type": "booking_confirmed",
      "title": "Booking Confirmed",
      "message": "Your booking #BK-20240115-001 has been confirmed",
      "isRead": false,
      "createdAt": "2024-01-15T09:30:00Z",
      "data": {
        "bookingId": "booking-uuid-1",
        "action": "view_booking"
      }
    }
  ],
  "metadata": {
    "unreadCount": 5,
    "total": 50
  }
}
```

#### PUT /api/notifications/:id/read
Mark notification as read.

#### PUT /api/notifications/preferences/:userId
Update notification preferences.

**Request:**
```json
{
  "email": {
    "bookingConfirmations": true,
    "bookingReminders": true,
    "promotions": false
  },
  "push": {
    "bookingConfirmations": true,
    "messages": true
  },
  "sms": {
    "bookingReminders": true
  }
}
```

---

### 9. Chat Service

#### WebSocket Connection
```
ws://localhost:3009/chat?token=<access_token>
```

#### Events

**Client → Server:**

**join_conversation:**
```json
{
  "event": "join_conversation",
  "data": {
    "conversationId": "conversation-uuid-1"
  }
}
```

**send_message:**
```json
{
  "event": "send_message",
  "data": {
    "conversationId": "conversation-uuid-1",
    "message": "Hello, when can you start the job?",
    "type": "text"
  }
}
```

**typing:**
```json
{
  "event": "typing",
  "data": {
    "conversationId": "conversation-uuid-1",
    "isTyping": true
  }
}
```

**Server → Client:**

**message_received:**
```json
{
  "event": "message_received",
  "data": {
    "id": "message-uuid-1",
    "conversationId": "conversation-uuid-1",
    "senderId": "user-uuid-2",
    "senderName": "Jane Smith",
    "message": "I can start tomorrow at 10 AM",
    "type": "text",
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

**user_typing:**
```json
{
  "event": "user_typing",
  "data": {
    "conversationId": "conversation-uuid-1",
    "userId": "user-uuid-2",
    "userName": "Jane Smith",
    "isTyping": true
  }
}
```

#### REST Endpoints

#### GET /api/chat/conversations
Get user's conversations.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "conversation-uuid-1",
      "participants": [
        {
          "userId": "user-uuid-1",
          "name": "John Doe",
          "role": "customer"
        },
        {
          "userId": "provider-uuid-1",
          "name": "Jane's Services",
          "role": "provider"
        }
      ],
      "lastMessage": {
        "text": "I can start tomorrow at 10 AM",
        "timestamp": "2024-01-15T10:00:00Z"
      },
      "unreadCount": 2,
      "bookingId": "booking-uuid-1"
    }
  ]
}
```

#### GET /api/chat/conversations/:id/messages
Get conversation messages.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "message-uuid-1",
      "senderId": "user-uuid-1",
      "senderName": "John Doe",
      "message": "Hello, when can you start?",
      "type": "text",
      "createdAt": "2024-01-15T09:00:00Z"
    },
    {
      "id": "message-uuid-2",
      "senderId": "provider-uuid-1",
      "senderName": "Jane's Services",
      "message": "I can start tomorrow at 10 AM",
      "type": "text",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

## Rate Limiting

All API endpoints are rate-limited:

**General endpoints:**
- 100 requests per minute per IP
- 1000 requests per hour per user

**Authentication endpoints:**
- Login: 5 requests per 15 minutes
- Register: 3 requests per hour
- Password reset: 3 requests per hour

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642262400
```

## Webhooks

For provider integrations and third-party services.

### POST /api/webhooks/stripe
Stripe webhook for payment events.

### POST /api/webhooks/twilio
Twilio webhook for SMS delivery status.

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| AUTH_001 | Invalid credentials | Email or password incorrect |
| AUTH_002 | Email not verified | User must verify email first |
| AUTH_003 | Account suspended | User account is suspended |
| VAL_001 | Validation error | Input validation failed |
| BOOK_001 | Provider unavailable | Provider not available for selected time |
| BOOK_002 | Booking conflict | Time slot already booked |
| PAY_001 | Payment failed | Payment processing failed |
| PAY_002 | Insufficient funds | Card has insufficient funds |
| SYS_001 | Internal server error | Unexpected server error |

## Pagination

All list endpoints support pagination:

**Request:**
```
GET /api/bookings?page=2&limit=20
```

**Response includes metadata:**
```json
{
  "data": [...],
  "metadata": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## Filtering & Sorting

Most list endpoints support filtering and sorting:

```
GET /api/bookings?status=completed&sortBy=createdAt&sortOrder=desc&minPrice=100&maxPrice=500
```

Common query parameters:
- `sortBy` - Field to sort by
- `sortOrder` - asc or desc
- `filter[field]` - Filter by field value
