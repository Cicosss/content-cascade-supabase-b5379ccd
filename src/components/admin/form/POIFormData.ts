
export interface FormData {
  poi_type: 'place' | 'event';
  name: string;
  category: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  location_name: string;
  organizer_info: string;
  price_info: string;
  duration_info: string;
  target_audience: string;
  phone: string;
  email: string;
  website_url: string;
  opening_hours: string;
  start_datetime: string;
  end_datetime: string;
  tags: string[];
  images: string[];
}

export const initialFormData: FormData = {
  poi_type: 'place',
  name: '',
  category: 'Ristoranti',
  description: '',
  address: '',
  latitude: '',
  longitude: '',
  location_name: '',
  organizer_info: '',
  price_info: '',
  duration_info: '',
  target_audience: 'everyone',
  phone: '',
  email: '',
  website_url: '',
  opening_hours: '',
  start_datetime: '',
  end_datetime: '',
  tags: [],
  images: []
};
