
export interface POIDetailData {
  id: string;
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  images: string[];
  price_info?: string;
  duration_info?: string;
  opening_hours?: string;
  phone?: string;
  email?: string;
  website_url?: string;
  video_url?: string;
  target_audience: string;
  poi_type?: string;
  start_datetime?: string;
  end_datetime?: string;
  location_name?: string;
  organizer_info?: string;
}
