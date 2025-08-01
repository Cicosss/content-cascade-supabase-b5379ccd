
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  location_name?: string;
  latitude: number;
  longitude: number;
  price_info: string;
  duration_info: string;
  target_audience: string;
  images: string[];
  website_url: string;
  phone: string;
  email: string;
  avg_rating: number;
  status: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  opening_hours?: string;
}
