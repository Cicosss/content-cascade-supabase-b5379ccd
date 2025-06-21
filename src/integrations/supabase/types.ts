export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          booking_reference: string | null
          created_at: string | null
          event_id: string | null
          id: string
          number_of_people: number | null
          poi_id: string | null
          special_requests: string | null
          status: string | null
          total_price: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_date: string
          booking_reference?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          number_of_people?: number | null
          poi_id?: string | null
          special_requests?: string | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          booking_reference?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          number_of_people?: number | null
          poi_id?: string | null
          special_requests?: string | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "points_of_interest"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      eventi_passati: {
        Row: {
          address: string | null
          avg_rating: number | null
          category: string
          description: string | null
          duration_info: string | null
          email: string | null
          end_datetime: string | null
          id: string
          images: string[] | null
          latitude: number | null
          location_name: string | null
          longitude: number | null
          moved_at: string | null
          name: string
          organizer_info: string | null
          original_created_at: string | null
          original_updated_at: string | null
          phone: string | null
          poi_type: string
          price_info: string | null
          start_datetime: string | null
          status: string | null
          target_audience: string | null
          video_url: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          avg_rating?: number | null
          category: string
          description?: string | null
          duration_info?: string | null
          email?: string | null
          end_datetime?: string | null
          id: string
          images?: string[] | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          moved_at?: string | null
          name: string
          organizer_info?: string | null
          original_created_at?: string | null
          original_updated_at?: string | null
          phone?: string | null
          poi_type: string
          price_info?: string | null
          start_datetime?: string | null
          status?: string | null
          target_audience?: string | null
          video_url?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          avg_rating?: number | null
          category?: string
          description?: string | null
          duration_info?: string | null
          email?: string | null
          end_datetime?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          moved_at?: string | null
          name?: string
          organizer_info?: string | null
          original_created_at?: string | null
          original_updated_at?: string | null
          phone?: string | null
          poi_type?: string
          price_info?: string | null
          start_datetime?: string | null
          status?: string | null
          target_audience?: string | null
          video_url?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          address: string | null
          avg_rating: number | null
          category: string
          created_at: string | null
          description: string | null
          end_datetime: string | null
          id: string
          images: string[] | null
          latitude: number | null
          location_name: string | null
          longitude: number | null
          macro_area: string
          name: string
          organizer_info: string | null
          price_info: string | null
          start_datetime: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avg_rating?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          end_datetime?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          macro_area?: string
          name: string
          organizer_info?: string | null
          price_info?: string | null
          start_datetime: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avg_rating?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          end_datetime?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          macro_area?: string
          name?: string
          organizer_info?: string | null
          price_info?: string | null
          start_datetime?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          poi_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          poi_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          poi_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "points_of_interest"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      itineraries: {
        Row: {
          created_at: string | null
          description: string | null
          duration_days: number | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_days?: number | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_days?: number | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itineraries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_stops: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          itinerary_id: string | null
          notes: string | null
          poi_id: string | null
          stop_order: number
          visit_duration: number | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          itinerary_id?: string | null
          notes?: string | null
          poi_id?: string | null
          stop_order: number
          visit_duration?: number | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          itinerary_id?: string | null
          notes?: string | null
          poi_id?: string | null
          stop_order?: number
          visit_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_stops_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itinerary_stops_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itinerary_stops_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "points_of_interest"
            referencedColumns: ["id"]
          },
        ]
      }
      poi_submissions: {
        Row: {
          address: string | null
          admin_notes: string | null
          category: string
          created_at: string | null
          description: string | null
          duration_info: string | null
          email: string | null
          end_datetime: string | null
          id: string
          images: string[] | null
          latitude: number | null
          location_name: string | null
          longitude: number | null
          macro_area: string
          moderated_at: string | null
          moderated_by: string | null
          name: string
          opening_hours: string | null
          organizer_info: string | null
          phone: string | null
          poi_type: string | null
          price_info: string | null
          start_datetime: string | null
          status: string | null
          submitter_email: string
          tags: string[] | null
          target_audience: string | null
          updated_at: string | null
          video_url: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          duration_info?: string | null
          email?: string | null
          end_datetime?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          macro_area?: string
          moderated_at?: string | null
          moderated_by?: string | null
          name: string
          opening_hours?: string | null
          organizer_info?: string | null
          phone?: string | null
          poi_type?: string | null
          price_info?: string | null
          start_datetime?: string | null
          status?: string | null
          submitter_email: string
          tags?: string[] | null
          target_audience?: string | null
          updated_at?: string | null
          video_url?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          duration_info?: string | null
          email?: string | null
          end_datetime?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          macro_area?: string
          moderated_at?: string | null
          moderated_by?: string | null
          name?: string
          opening_hours?: string | null
          organizer_info?: string | null
          phone?: string | null
          poi_type?: string | null
          price_info?: string | null
          start_datetime?: string | null
          status?: string | null
          submitter_email?: string
          tags?: string[] | null
          target_audience?: string | null
          updated_at?: string | null
          video_url?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      points_of_interest: {
        Row: {
          address: string | null
          avg_rating: number | null
          category: string
          created_at: string | null
          description: string | null
          duration_info: string | null
          email: string | null
          end_datetime: string | null
          id: string
          images: string[] | null
          latitude: number
          location_name: string | null
          longitude: number
          macro_area: string
          name: string
          opening_hours: string | null
          organizer_info: string | null
          phone: string | null
          poi_type: string | null
          price_info: string | null
          start_datetime: string | null
          status: string | null
          tags: string[] | null
          target_audience: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          avg_rating?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          duration_info?: string | null
          email?: string | null
          end_datetime?: string | null
          id?: string
          images?: string[] | null
          latitude: number
          location_name?: string | null
          longitude: number
          macro_area?: string
          name: string
          opening_hours?: string | null
          organizer_info?: string | null
          phone?: string | null
          poi_type?: string | null
          price_info?: string | null
          start_datetime?: string | null
          status?: string | null
          tags?: string[] | null
          target_audience?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          avg_rating?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          duration_info?: string | null
          email?: string | null
          end_datetime?: string | null
          id?: string
          images?: string[] | null
          latitude?: number
          location_name?: string | null
          longitude?: number
          macro_area?: string
          name?: string
          opening_hours?: string | null
          organizer_info?: string | null
          phone?: string | null
          poi_type?: string | null
          price_info?: string | null
          start_datetime?: string | null
          status?: string | null
          tags?: string[] | null
          target_audience?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          event_id: string | null
          id: string
          poi_id: string | null
          rating: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          poi_id?: string | null
          rating: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          poi_id?: string | null
          rating?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "points_of_interest"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          item_data: Json
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_data: Json
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_data?: Json
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          arrival_location: string | null
          avatar_url: string | null
          children_ages: string[] | null
          created_at: string | null
          departure_location: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          number_of_people: number | null
          updated_at: string | null
          vacation_type: string | null
        }
        Insert: {
          arrival_location?: string | null
          avatar_url?: string | null
          children_ages?: string[] | null
          created_at?: string | null
          departure_location?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          number_of_people?: number | null
          updated_at?: string | null
          vacation_type?: string | null
        }
        Update: {
          arrival_location?: string | null
          avatar_url?: string | null
          children_ages?: string[] | null
          created_at?: string | null
          departure_location?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          number_of_people?: number | null
          updated_at?: string | null
          vacation_type?: string | null
        }
        Relationships: []
      }
      user_visits: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          poi_id: string
          user_id: string
          visit_timestamp: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          poi_id: string
          user_id: string
          visit_timestamp?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          poi_id?: string
          user_id?: string
          visit_timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_visits_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "points_of_interest"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      move_expired_events: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
