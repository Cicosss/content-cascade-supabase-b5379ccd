
export interface POISubmission {
  id: string;
  submitter_email: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  address: string;
  latitude: number;
  longitude: number;
  price_info: string;
  duration_info: string;
  target_audience: string;
  website_url: string;
  phone: string;
  email: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  organizer_info: string;
  video_url: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected' | 'edited';
  admin_notes: string;
  created_at: string;
  updated_at: string;
  moderated_at: string;
  moderated_by: string;
  poi_type: string;
  opening_hours: string;
}
