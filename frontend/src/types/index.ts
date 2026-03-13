export interface User {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  role: 'admin' | 'provider' | 'customer';
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
  permissions?: string[];
  roles?: string[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  services?: Service[];
}

export interface Service {
  id: number;
  name: string;
  description: string;
  category_id: number;
  price?: number;
}

export interface Booking {
  id: number;
  booking_number: string;
  customer_id: string;
  provider_id: string;
  service_id: number;
  address_id: number;
  scheduled_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  total_amount: number;
  service_type?: string;
  quantity?: number;
  created_at: string;
  customer?: User;
  provider?: {
      id: number;
      business_name: string;
      user: User;
  };
  service?: Service;
  address?: Address;
  payment?: Payment;
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
