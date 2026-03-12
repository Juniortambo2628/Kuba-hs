# Implementation Roadmap & Getting Started Guide

## Phase 1: Foundation Setup (Week 1-2)

### 1.1 Project Initialization

#### Repository Structure
```bash
home-service-platform/
├── services/
│   ├── auth-service/
│   ├── user-service/
│   ├── provider-service/
│   ├── booking-service/
│   ├── payment-service/
│   ├── review-service/
│   ├── search-service/
│   ├── notification-service/
│   └── chat-service/
├── web-app/
├── mobile-app/
├── admin-dashboard/
├── shared/
│   ├── models/
│   ├── utils/
│   ├── middleware/
│   └── types/
├── infrastructure/
│   ├── terraform/
│   ├── kubernetes/
│   └── docker/
├── docs/
├── scripts/
├── .github/
│   └── workflows/
├── docker-compose.yml
├── .gitignore
└── README.md
```

#### Initialize Git Repository
```bash
# Create main repository
git init
git remote add origin <your-repo-url>

# Create .gitignore
cat > .gitignore << EOF
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.log

# Production
build/
dist/
.next/

# Environment
.env
.env.local
.env.production

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Misc
*.pem
.terraform/
EOF

# Initial commit
git add .
git commit -m "Initial project structure"
git push -u origin main
```

### 1.2 Development Environment Setup

#### Install Required Tools
```bash
# Node.js (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Docker & Docker Compose
# Follow official Docker installation for your OS

# AWS CLI (if using AWS)
pip install awscli

# Terraform
brew install terraform  # macOS
# or download from terraform.io

# Kubernetes CLI (kubectl)
brew install kubectl
```

#### Docker Compose for Local Development
```yaml
# docker-compose.yml
version: '3.8'

services:
  # Databases
  postgres:
    image: postgres:15-alpine
    container_name: home-service-postgres
    environment:
      POSTGRES_DB: homeservice
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: home-service-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  mongodb:
    image: mongo:7
    container_name: home-service-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  elasticsearch:
    image: elasticsearch:8.11.0
    container_name: home-service-elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5

  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: home-service-rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin123
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    healthcheck:
      test: rabbitmq-diagnostics -q ping
      interval: 30s
      timeout: 10s
      retries: 5

  # API Gateway
  api-gateway:
    build:
      context: ./services/api-gateway
      dockerfile: Dockerfile.dev
    container_name: home-service-gateway
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
    volumes:
      - ./services/api-gateway:/app
      - /app/node_modules
    depends_on:
      - auth-service
      - user-service

  # Microservices
  auth-service:
    build:
      context: ./services/auth-service
      dockerfile: Dockerfile.dev
    container_name: auth-service
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/homeservice
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-secret-key-change-in-production
      - JWT_EXPIRES_IN=15m
      - REFRESH_TOKEN_EXPIRES_IN=7d
    volumes:
      - ./services/auth-service:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  user-service:
    build:
      context: ./services/user-service
      dockerfile: Dockerfile.dev
    container_name: user-service
    ports:
      - "3002:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/homeservice
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./services/user-service:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:
  mongo_data:
  es_data:
  rabbitmq_data:

networks:
  default:
    name: home-service-network
```

### 1.3 Database Initialization Script

```sql
-- scripts/init-db.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
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

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Create update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert test data
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
VALUES 
    ('admin@test.com', '$2b$10$test', 'Admin', 'User', 'admin', true),
    ('customer@test.com', '$2b$10$test', 'John', 'Doe', 'customer', true),
    ('provider@test.com', '$2b$10$test', 'Jane', 'Smith', 'provider', true);
```

## Phase 2: Auth Service Implementation (Week 2-3)

### 2.1 Auth Service Structure

```bash
services/auth-service/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   └── index.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── errorHandler.js
│   │   └── validateRequest.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── tokenService.js
│   │   └── emailService.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── validators.js
│   └── index.js
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
├── Dockerfile
├── Dockerfile.dev
└── .env.example
```

### 2.2 Auth Service Implementation

**package.json**
```json
{
  "name": "auth-service",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "joi": "^17.11.0",
    "pg": "^8.11.3",
    "ioredis": "^5.3.2",
    "winston": "^3.11.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "@sendgrid/mail": "^7.7.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.55.0"
  }
}
```

**src/config/database.js**
```javascript
const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  logger.info('Database connected');
});

pool.on('error', (err) => {
  logger.error('Unexpected database error:', err);
  process.exit(-1);
});

module.exports = pool;
```

**src/config/redis.js**
```javascript
const Redis = require('ioredis');
const logger = require('../utils/logger');

const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('error', (err) => {
  logger.error('Redis error:', err);
});

module.exports = redis;
```

**src/utils/logger.js**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'auth-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

module.exports = logger;
```

**src/services/authService.js**
```javascript
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const tokenService = require('./tokenService');
const emailService = require('./emailService');
const logger = require('../utils/logger');

class AuthService {
  async register(userData) {
    const { email, password, firstName, lastName, phone, role = 'customer' } = userData;
    
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, role, created_at`,
      [email, passwordHash, firstName, lastName, phone, role]
    );
    
    const user = result.rows[0];
    
    // Generate email verification token
    const verificationToken = uuidv4();
    await tokenService.storeVerificationToken(user.id, verificationToken);
    
    // Send verification email
    await emailService.sendVerificationEmail(email, firstName, verificationToken);
    
    logger.info(`User registered: ${user.id}`);
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    };
  }
  
  async login(email, password) {
    // Get user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }
    
    const user = result.rows[0];
    
    // Check if user is active
    if (user.status !== 'active') {
      throw new Error('Account is inactive');
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }
    
    // Generate tokens
    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);
    
    // Store refresh token
    await tokenService.storeRefreshToken(user.id, refreshToken);
    
    logger.info(`User logged in: ${user.id}`);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
  
  async logout(userId, refreshToken) {
    await tokenService.revokeRefreshToken(userId, refreshToken);
    logger.info(`User logged out: ${userId}`);
  }
  
  async refreshAccessToken(refreshToken) {
    // Verify refresh token
    const decoded = tokenService.verifyRefreshToken(refreshToken);
    
    // Check if token is revoked
    const isValid = await tokenService.isRefreshTokenValid(decoded.userId, refreshToken);
    
    if (!isValid) {
      throw new Error('Invalid refresh token');
    }
    
    // Get user
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    const user = result.rows[0];
    
    // Generate new access token
    const accessToken = tokenService.generateAccessToken(user);
    
    return { accessToken };
  }
  
  async verifyEmail(token) {
    const userId = await tokenService.getVerificationToken(token);
    
    if (!userId) {
      throw new Error('Invalid or expired verification token');
    }
    
    await pool.query(
      'UPDATE users SET email_verified = true WHERE id = $1',
      [userId]
    );
    
    await tokenService.deleteVerificationToken(token);
    
    logger.info(`Email verified for user: ${userId}`);
  }
  
  async forgotPassword(email) {
    const result = await pool.query(
      'SELECT id, first_name FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      // Don't reveal that email doesn't exist
      return;
    }
    
    const user = result.rows[0];
    const resetToken = uuidv4();
    
    await tokenService.storePasswordResetToken(user.id, resetToken);
    await emailService.sendPasswordResetEmail(email, user.first_name, resetToken);
    
    logger.info(`Password reset requested for user: ${user.id}`);
  }
  
  async resetPassword(token, newPassword) {
    const userId = await tokenService.getPasswordResetToken(token);
    
    if (!userId) {
      throw new Error('Invalid or expired reset token');
    }
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, userId]
    );
    
    await tokenService.deletePasswordResetToken(token);
    
    // Revoke all refresh tokens
    await tokenService.revokeAllRefreshTokens(userId);
    
    logger.info(`Password reset for user: ${userId}`);
  }
}

module.exports = new AuthService();
```

**src/services/tokenService.js**
```javascript
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');

class TokenService {
  generateAccessToken(user) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
  }
  
  generateRefreshToken(user) {
    return jwt.sign(
      {
        userId: user.id,
        tokenType: 'refresh',
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );
  }
  
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }
  
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.tokenType !== 'refresh') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
  
  async storeRefreshToken(userId, token) {
    const key = `refresh_token:${userId}:${token}`;
    await redis.setex(key, 7 * 24 * 60 * 60, '1'); // 7 days
  }
  
  async isRefreshTokenValid(userId, token) {
    const key = `refresh_token:${userId}:${token}`;
    const exists = await redis.exists(key);
    return exists === 1;
  }
  
  async revokeRefreshToken(userId, token) {
    const key = `refresh_token:${userId}:${token}`;
    await redis.del(key);
  }
  
  async revokeAllRefreshTokens(userId) {
    const pattern = `refresh_token:${userId}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
  
  async storeVerificationToken(userId, token) {
    const key = `email_verification:${token}`;
    await redis.setex(key, 24 * 60 * 60, userId); // 24 hours
  }
  
  async getVerificationToken(token) {
    const key = `email_verification:${token}`;
    return await redis.get(key);
  }
  
  async deleteVerificationToken(token) {
    const key = `email_verification:${token}`;
    await redis.del(key);
  }
  
  async storePasswordResetToken(userId, token) {
    const key = `password_reset:${token}`;
    await redis.setex(key, 60 * 60, userId); // 1 hour
  }
  
  async getPasswordResetToken(token) {
    const key = `password_reset:${token}`;
    return await redis.get(key);
  }
  
  async deletePasswordResetToken(token) {
    const key = `password_reset:${token}`;
    await redis.del(key);
  }
}

module.exports = new TokenService();
```

**src/controllers/authController.js**
```javascript
const authService = require('../services/authService');
const { validationResult } = require('express-validator');

class AuthController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const user = await authService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const { userId } = req.user;
      
      if (refreshToken) {
        await authService.logout(userId, refreshToken);
      }
      
      res.clearCookie('refreshToken');
      
      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }
  
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token not found',
        });
      }
      
      const result = await authService.refreshAccessToken(refreshToken);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;
      
      await authService.verifyEmail(token);
      
      res.json({
        success: true,
        message: 'Email verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      
      await authService.forgotPassword(email);
      
      res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.',
      });
    } catch (error) {
      next(error);
    }
  }
  
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      
      await authService.resetPassword(token, newPassword);
      
      res.json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
```

**src/routes/authRoutes.js**
```javascript
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour
  message: 'Too many registration attempts, please try again later',
});

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('phone').optional().isMobilePhone(),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

// Routes
router.post('/register', registerLimiter, registerValidation, authController.register);
router.post('/login', loginLimiter, loginValidation, authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
```

**src/middleware/authenticate.js**
```javascript
const tokenService = require('../services/tokenService');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }
    
    const token = authHeader.substring(7);
    const decoded = tokenService.verifyAccessToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

module.exports = authenticate;
```

**src/middleware/errorHandler.js**
```javascript
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.details,
    });
  }
  
  if (err.message === 'Invalid credentials' || err.message === 'Invalid or expired token') {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
  
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  });
};

module.exports = errorHandler;
```

**src/index.js**
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'auth-service' });
});

app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Auth service running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
```

Continue with next phases...
