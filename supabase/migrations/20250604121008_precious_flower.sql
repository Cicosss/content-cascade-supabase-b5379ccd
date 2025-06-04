/*
  # Create Points of Interest Table

  1. New Tables
    - `points_of_interest`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `poi_type` (text) - restaurant, experience, etc.
      - `category` (text)
      - `address` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `price_info` (text)
      - `duration_info` (text)
      - `avg_rating` (numeric)
      - `review_count` (integer)
      - `images` (text[])
      - `website_url` (text)
      - `phone` (text)
      - `email` (text)
      - `target_audience` (text)
      - `created_by` (uuid) - References user_profiles
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for admin write access
*/

CREATE TABLE IF NOT EXISTS points_of_interest (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  poi_type text NOT NULL,
  category text,
  address text,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  price_info text,
  duration_info text,
  avg_rating numeric,
  review_count integer DEFAULT 0,
  images text[],
  website_url text,
  phone text,
  email text,
  target_audience text,
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE points_of_interest ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON points_of_interest
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin write access"
  ON points_of_interest
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create updated_at trigger
CREATE TRIGGER set_points_of_interest_updated_at
  BEFORE UPDATE ON points_of_interest
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();