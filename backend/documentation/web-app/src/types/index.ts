// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'provider' | 'admin';
  emailVerified: boolean;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

// Address types
export interface Address {
  id: string;
  userId: string;
  addressType: 'residential' | 'commercial';
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt: string;
}

// Provider types
export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  serviceRadius: number;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  averageRating: number;
  totalReviews: number;
  totalJobsCompleted: number;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderService {
  id: string;
  providerId: string;
  serviceId: string;
  name: string;
  category: string;
  basePrice: number;
  pricingType: 'fixed' | 'hourly' | 'quote';
  isAvailable: boolean;
  description?: string;
}

export interface Availability {
  monday?: { start: string; end: string } | null;
  tuesday?: { start: string; end: string } | null;
  wednesday?: { start: string; end: string } | null;
  thursday?: { start: string; end: string } | null;
  friday?: { start: string; end: string } | null;
  saturday?: { start: string; end: string } | null;
  sunday?: { start: string; end: string } | null;
}

// Service types
export interface Service {
  id: string;
  name: string;
  categoryId: string;
  category?: ServiceCategory;
  description: string;
  iconUrl?: string;
  isActive: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  parentCategoryId?: string;
  description: string;
  iconUrl?: string;
  sortOrder: number;
}

// Booking types
export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  bookingNumber: string;
  scheduledDate: string;
  scheduledEndDate?: string;
  status: BookingStatus;
  address: Address;
  description: string;
  estimatedPrice: number;
  finalPrice?: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  cancellationReason?: string;
  customer?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  provider?: {
    id: string;
    businessName: string;
    phone: string;
  };
  service?: {
    id: string;
    name: string;
    category: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  providerId: string;
  serviceId: string;
  scheduledDate: string;
  scheduledEndDate?: string;
  addressId: string;
  description: string;
  estimatedPrice: number;
  images?: string[];
}

// Payment types
export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  amount: number;
  platformFee: number;
  providerAmount: number;
  paymentMethod: string;
  transactionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentGateway: string;
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  rating: number;
  comment: string;
  categories?: {
    professionalism?: number;
    quality?: number;
    value?: number;
    communication?: number;
  };
  providerResponse?: string;
  providerResponseAt?: string;
  isVerified: boolean;
  helpfulCount: number;
  customer?: {
    name: string;
    initials: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  bookingId: string;
  providerId: string;
  rating: number;
  comment: string;
  categories?: {
    professionalism: number;
    quality: number;
    value: number;
    communication: number;
  };
}

// Search types
export interface SearchFilters {
  query?: string;
  service?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  minRating?: number;
  maxPrice?: number;
  availability?: string;
  page?: number;
  limit?: number;
}

export interface ProviderSearchResult {
  id: string;
  businessName: string;
  rating: number;
  totalReviews: number;
  distance?: number;
  basePrice: number;
  pricingType: string;
  availability: 'available' | 'busy' | 'unavailable';
  services: string[];
  profileImage?: string;
  badges: string[];
}

// Notification types
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

export interface NotificationPreferences {
  email: {
    bookingConfirmations: boolean;
    bookingReminders: boolean;
    promotions: boolean;
    messages: boolean;
  };
  push: {
    bookingConfirmations: boolean;
    bookingReminders: boolean;
    messages: boolean;
  };
  sms: {
    bookingReminders: boolean;
  };
}

// Chat types
export interface Conversation {
  id: string;
  participants: Array<{
    userId: string;
    role: 'customer' | 'provider';
    name: string;
    avatarUrl?: string;
  }>;
  bookingId?: string;
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: string;
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'provider';
  messageType: 'text' | 'image' | 'file';
  content: string;
  attachments?: Array<{
    url: string;
    type: string;
    name: string;
    size: number;
  }>;
  readBy: string[];
  createdAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'customer' | 'provider';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

// Pagination types
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: PaginationMetadata;
}
