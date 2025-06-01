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
      events: {
        Row: {
          address: string | null
          avg_rating: number | null
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          end_datetime: string | null
          id: string
          images: string[] | null
          latitude: number
          location: unknown | null
          location_name: string | null
          longitude: number
          name: string
          organizer_info: string | null
          price_info: string | null
          review_count: number | null
          start_datetime: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          avg_rating?: number | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_datetime?: string | null
          id?: string
          images?: string[] | null
          latitude: number
          location?: unknown | null
          location_name?: string | null
          longitude: number
          name: string
          organizer_info?: string | null
          price_info?: string | null
          review_count?: number | null
          start_datetime: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          avg_rating?: number | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_datetime?: string | null
          id?: string
          images?: string[] | null
          latitude?: number
          location?: unknown | null
          location_name?: string | null
          longitude?: number
          name?: string
          organizer_info?: string | null
          price_info?: string | null
          review_count?: number | null
          start_datetime?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      points_of_interest: {
        Row: {
          address: string | null
          avg_rating: number | null
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration_info: string | null
          email: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          latitude: number
          location: unknown | null
          longitude: number
          min_age: number | null
          name: string
          phone: string | null
          poi_type: string
          price_info: string | null
          review_count: number | null
          target_audience: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          avg_rating?: number | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_info?: string | null
          email?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          latitude: number
          location?: unknown | null
          longitude: number
          min_age?: number | null
          name: string
          phone?: string | null
          poi_type: string
          price_info?: string | null
          review_count?: number | null
          target_audience?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          avg_rating?: number | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_info?: string | null
          email?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          latitude?: number
          location?: unknown | null
          longitude?: number
          min_age?: number | null
          name?: string
          phone?: string | null
          poi_type?: string
          price_info?: string | null
          review_count?: number | null
          target_audience?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "points_of_interest_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          arrival_location: string | null
          avatar_url: string | null
          children_ages: string[] | null
          created_at: string
          date_of_birth: string | null
          departure_location: string | null
          email: string | null
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          number_of_people: number | null
          vacation_type: string | null
        }
        Insert: {
          arrival_location?: string | null
          avatar_url?: string | null
          children_ages?: string[] | null
          created_at?: string
          date_of_birth?: string | null
          departure_location?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id: string
          last_name?: string | null
          number_of_people?: number | null
          vacation_type?: string | null
        }
        Update: {
          arrival_location?: string | null
          avatar_url?: string | null
          children_ages?: string[] | null
          created_at?: string
          date_of_birth?: string | null
          departure_location?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          number_of_people?: number | null
          vacation_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
