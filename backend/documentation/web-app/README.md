# Home Service Platform - Web Application

A modern, full-featured web application for the home service marketplace platform built with Next.js 14, React 18, TypeScript, and Redux Toolkit.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Key Components](#key-components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Deployment](#deployment)

## ✨ Features

### Customer Features
- 🔍 **Advanced Search** - Find providers by service, location, rating, and price
- 📅 **Easy Booking** - Schedule services with calendar integration
- 💳 **Secure Payments** - Stripe integration for safe transactions
- ⭐ **Reviews & Ratings** - Read and write reviews
- 💬 **Real-time Chat** - Communicate with providers via WebSocket
- 📱 **Responsive Design** - Works on all devices
- 🔔 **Notifications** - Email, SMS, and push notifications

### Provider Features
- 📊 **Dashboard** - Manage bookings and earnings
- 📋 **Service Management** - Add/edit services and pricing
- ⏰ **Availability Calendar** - Set working hours
- 💰 **Payment Tracking** - View earnings and transactions
- 👥 **Customer Communication** - Chat with customers
- 📈 **Analytics** - Track performance metrics

### Admin Features
- 👤 **User Management** - Manage customers and providers
- ✅ **Provider Verification** - Approve/reject provider applications
- 🎫 **Dispute Resolution** - Handle customer complaints
- 📊 **Platform Analytics** - Monitor platform performance

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **WebSocket**: Socket.io Client
- **Payments**: Stripe React Components
- **Maps**: Google Maps API
- **Notifications**: React Toastify
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📁 Project Structure

```
web-app/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── (auth)/              # Auth routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (customer)/          # Customer routes
│   │   │   ├── bookings/
│   │   │   ├── search/
│   │   │   └── profile/
│   │   ├── (provider)/          # Provider routes
│   │   │   ├── dashboard/
│   │   │   ├── bookings/
│   │   │   └── earnings/
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   │
│   ├── components/              # React components
│   │   ├── layout/              # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── auth/                # Auth components
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── booking/             # Booking components
│   │   │   ├── BookingCard.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   └── BookingDetails.tsx
│   │   ├── search/              # Search components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── ProviderCard.tsx
│   │   ├── provider/            # Provider components
│   │   │   ├── ProviderProfile.tsx
│   │   │   └── ServiceManager.tsx
│   │   ├── chat/                # Chat components
│   │   │   ├── ChatWindow.tsx
│   │   │   └── MessageList.tsx
│   │   └── common/              # Shared components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── services/                # API services
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── provider.service.ts
│   │   ├── booking.service.ts
│   │   ├── payment.service.ts
│   │   ├── review.service.ts
│   │   ├── search.service.ts
│   │   ├── notification.service.ts
│   │   └── chat.service.ts
│   │
│   ├── store/                   # Redux store
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   ├── bookingSlice.ts
│   │   │   ├── searchSlice.ts
│   │   │   └── chatSlice.ts
│   │   └── index.ts
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useBooking.ts
│   │   └── useDebounce.ts
│   │
│   ├── lib/                     # Utilities
│   │   ├── api-client.ts
│   │   └── utils.ts
│   │
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   │
│   └── styles/                  # Global styles
│       └── globals.css
│
├── public/                      # Static files
│   ├── images/
│   └── icons/
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- npm or yarn
- Backend services running (see main platform docs)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd web-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3009
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000` |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL for chat | `ws://localhost:3009` |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe publishable key | `pk_test_...` |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Google Maps API key | `AIza...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_NAME` | Application name | `HomeService` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |

## 🎯 Key Components

### Authentication

**LoginForm** (`src/components/auth/LoginForm.tsx`)
- Email/password authentication
- Social login (Google, Facebook)
- Remember me functionality
- Password reset link

**RegisterForm** (`src/components/auth/RegisterForm.tsx`)
- User registration
- Field validation with Zod
- Email verification flow
- Role selection (customer/provider)

### Search & Discovery

**SearchBar** (`src/components/search/SearchBar.tsx`)
- Service search
- Location-based search
- Autocomplete suggestions
- Recent searches

**ProviderCard** (`src/components/search/ProviderCard.tsx`)
- Provider information
- Rating display
- Quick booking button
- Favorite toggle

### Booking System

**BookingForm** (`src/components/booking/BookingForm.tsx`)
- Service selection
- Date/time picker
- Address selection
- Price calculator

**BookingCard** (`src/components/booking/BookingCard.tsx`)
- Booking status
- Provider details
- Actions (cancel, reschedule, complete)
- Review prompt

### Real-time Chat

**ChatWindow** (`src/components/chat/ChatWindow.tsx`)
- WebSocket connection
- Message history
- Typing indicators
- File/image upload

### Payment

**PaymentForm** (`src/components/payment/PaymentForm.tsx`)
- Stripe Elements integration
- Saved payment methods
- Secure checkout
- Payment confirmation

## 🗂 State Management

The app uses Redux Toolkit for state management:

### Auth State
```typescript
{
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null
}
```

### Booking State
```typescript
{
  bookings: Booking[],
  currentBooking: Booking | null,
  upcomingBookings: Booking[],
  pagination: PaginationMetadata
}
```

### Chat State
```typescript
{
  conversations: Conversation[],
  currentConversation: Conversation | null,
  messages: Message[],
  socket: Socket | null
}
```

## 🔌 API Integration

All API calls go through centralized service files:

**Example: Booking Service**
```typescript
import bookingService from '@/services/booking.service';

// Create booking
const booking = await bookingService.createBooking(bookingData);

// Get bookings
const bookings = await bookingService.getBookings({ status: 'pending' });

// Cancel booking
await bookingService.cancelBooking(bookingId, reason);
```

**Using Redux Thunks**
```typescript
import { useAppDispatch } from '@/store';
import { createBooking } from '@/store/slices/bookingSlice';

const dispatch = useAppDispatch();
dispatch(createBooking(bookingData));
```

## 🎨 Styling

### Tailwind CSS

The app uses Tailwind CSS for styling with a custom configuration:

**Custom Colors**
```javascript
colors: {
  primary: { 500: '#0ea5e9', 600: '#0284c7', ... },
  secondary: { 500: '#a855f7', ... },
  success: { 500: '#22c55e', ... },
  warning: { 500: '#f59e0b', ... },
  error: { 500: '#ef4444', ... }
}
```

**Usage**
```tsx
<button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg">
  Book Now
</button>
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect repository**
```bash
vercel
```

2. **Set environment variables** in Vercel dashboard

3. **Deploy**
```bash
vercel --prod
```

### Docker

1. **Build image**
```bash
docker build -t home-service-web .
```

2. **Run container**
```bash
docker run -p 3000:3000 home-service-web
```

### Self-hosted

1. **Build for production**
```bash
npm run build
```

2. **Start production server**
```bash
npm start
```

## 📱 Mobile Responsiveness

All components are built with mobile-first approach:
- Responsive navigation
- Touch-friendly UI
- Optimized images
- Mobile-specific features

## 🔒 Security

- JWT authentication with refresh tokens
- CSRF protection
- XSS prevention
- Secure headers (via Helmet)
- Input sanitization
- Rate limiting

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- LoginForm.test.tsx

# Run with coverage
npm run test:coverage
```

## 📄 License

[Your License]

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📞 Support

- Documentation: [docs.yourplatform.com](https://docs.yourplatform.com)
- Issues: [GitHub Issues](https://github.com/yourorg/platform/issues)
- Email: support@yourplatform.com
