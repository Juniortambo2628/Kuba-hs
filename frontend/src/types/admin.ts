export interface Testimonial {
  id: number;
  client_name: string;
  client_role: string;
  content: string;
  rating: number;
  order: number;
  avatar?: string;
  image_url?: string;
}

export interface TrustPartner {
  id: number;
  name: string;
  logo_path: string;
  is_active: boolean;
}

export interface WorkforceProposal {
  id: number;
  document_type: string;
  file_path: string;
  status: string;
  created_at: string;
  provider?: {
    business_name?: string;
    user?: { email?: string };
  };
}
