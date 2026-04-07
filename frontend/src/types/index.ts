export interface User {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'provider' | 'customer';
  is_active: boolean;
  is_verified?: boolean;
  avatar_url?: string;
  created_at: string;
  permissions?: string[];
  roles?: string[];
  membership_tier?: LoyaltyTier;
  total_points?: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  slug?: string;
  icon: string | null;
  services?: Service[];
}

export interface Service {
  id: number;
  name: string;
  description: string;
  icon_url?: string;
  is_active?: boolean;
  is_featured?: boolean;
  category_id?: number;
  category?: Category;
  price?: number;
}

export interface Provider {
  id: number;
  business_name: string;
  brand_name?: string;
  bio?: string;
  experience_years?: number;
  location_name?: string;
  rating?: number;
  review_count?: number;
  is_verified?: boolean;
  logo?: string;
  latitude?: number;
  longitude?: number;
  service_radius?: number;
  specialized_skills?: string[];
  user?: User;
  services?: ProviderService[];
  reviews?: Review[];
  starting_price?: number | string | null;
}

export interface ProviderService {
  id: number;
  service_id: number;
  base_price: number;
  pricing_type: string;
  min_hours?: number;
  travel_fee?: number;
  equipment_included?: boolean;
  extra_configs?: any;
  is_available: boolean;
  name?: string;
  description?: string;
  category?: string;
  image_urls?: string[];
  provider?: Provider;
  service?: Service;
}

export interface Booking {
  id: number;
  booking_number: string;
  customer_id?: string;
  provider_id?: string;
  service_id?: number;
  address_id?: number;
  scheduled_date: string;
  rescheduled_at?: string;
  cancellation_reason?: string;
  scheduled_time?: string;
  scheduled_end_date?: string;
  started_at?: string;
  completed_at?: string;
  elapsed_seconds?: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'pending_cash';
  payment_method?: string;
  estimated_price: number;
  final_price: number;
  service_type?: string;
  quantity: number;
  description?: string;
  image_urls?: string[];
  created_at: string;
  customer?: User;
  provider?: Provider;
  service?: Service;
  address?: Address;
  payment?: Payment;
  review?: Review;
}

export interface Address {
  id: number;
  street_address: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  latitude?: number;
  longitude?: number;
}

export interface Payment {
  id: number;
  transaction_id: string;
  amount: number;
  platform_fee: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  customer?: User;
  provider?: {
    business_name: string;
  };
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user?: User;
  booking?: {
    service?: { name: string };
    provider?: { user?: { name: string } };
  };
}

export interface LoyaltyTransaction {
  id: number;
  user_id: string;
  points: number;
  transaction_type: 'earn' | 'redeem';
  description: string;
  created_at: string;
}

export interface LoyaltyTier {
  id: number;
  name: string;
  min_points: number;
  benefits?: string[];
  is_active: boolean;
}

export interface Conversation {
  id: string;
  customer_id: number;
  provider_id: number;
  last_message_at: string;
  unread_count: number;
  customer: User;
  provider: { user: User };
  booking: {
    service: { name: string };
  };
  latestMessage?: Message;
}

export interface Message {
  id: string;
  sender_id: number;
  body: string;
  created_at: string;
  read_at: string | null;
  sender?: User;
}

export interface InvestorInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  investment_range: string;
  message: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'rejected';
  created_at: string;
}

export interface CustomQuote {
  id: string;
  organization_name: string;
  contact_person: string;
  email: string;
  phone: string;
  organization_type: 'commercial' | 'cooperative' | 'other';
  service_category: string;
  description: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'contracted' | 'rejected';
  created_at: string;
}

export interface EmailTemplate {
  id: string;
  key: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface Post {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image_url?: string;
  is_published: boolean;
  author_id: string | number;
  created_at: string;
  author?: User;
}

export interface ContactMessage {
  id: string | number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}
