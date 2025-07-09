export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      books: {
        Row: {
          admin_feedback: string | null
          approval_status: string | null
          asin: string | null
          author: string | null
          author_note: string | null
          description: string | null
          explicit_content: boolean | null
          front_cover_url: string | null
          genre: string | null
          id: string
          language: string | null
          manuscript_url: string | null
          title: string
          updated_at: string | null
          upload_status: string | null
          uploaded_at: string
          user_id: string
        }
        Insert: {
          admin_feedback?: string | null
          approval_status?: string | null
          asin?: string | null
          author?: string | null
          author_note?: string | null
          description?: string | null
          explicit_content?: boolean | null
          front_cover_url?: string | null
          genre?: string | null
          id?: string
          language?: string | null
          manuscript_url?: string | null
          title: string
          updated_at?: string | null
          upload_status?: string | null
          uploaded_at?: string
          user_id: string
        }
        Update: {
          admin_feedback?: string | null
          approval_status?: string | null
          asin?: string | null
          author?: string | null
          author_note?: string | null
          description?: string | null
          explicit_content?: boolean | null
          front_cover_url?: string | null
          genre?: string | null
          id?: string
          language?: string | null
          manuscript_url?: string | null
          title?: string
          updated_at?: string | null
          upload_status?: string | null
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_readers: {
        Row: {
          admin_notes: string | null
          age: number | null
          created_at: string
          email: string
          favorite_genres: string[] | null
          full_name: string
          id: string
          location: string | null
          monthly_book_budget: string | null
          occupation: string | null
          preferred_book_formats: string[] | null
          reading_experience: string | null
          reading_frequency: string | null
          recent_book_purchases: string | null
          review_writing_experience: string | null
          reviews_given: number
          social_media_handles: Json | null
          status: string
          updated_at: string
          why_join_community: string | null
        }
        Insert: {
          admin_notes?: string | null
          age?: number | null
          created_at?: string
          email: string
          favorite_genres?: string[] | null
          full_name: string
          id?: string
          location?: string | null
          monthly_book_budget?: string | null
          occupation?: string | null
          preferred_book_formats?: string[] | null
          reading_experience?: string | null
          reading_frequency?: string | null
          recent_book_purchases?: string | null
          review_writing_experience?: string | null
          reviews_given?: number
          social_media_handles?: Json | null
          status?: string
          updated_at?: string
          why_join_community?: string | null
        }
        Update: {
          admin_notes?: string | null
          age?: number | null
          created_at?: string
          email?: string
          favorite_genres?: string[] | null
          full_name?: string
          id?: string
          location?: string | null
          monthly_book_budget?: string | null
          occupation?: string | null
          preferred_book_formats?: string[] | null
          reading_experience?: string | null
          reading_frequency?: string | null
          recent_book_purchases?: string | null
          review_writing_experience?: string | null
          reviews_given?: number
          social_media_handles?: Json | null
          status?: string
          updated_at?: string
          why_join_community?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          admin_notes: string | null
          business_type: string | null
          created_at: string
          email: string
          id: string
          is_buyer: boolean
          lead_source: string
          message: string | null
          monthly_revenue: string | null
          name: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          business_type?: string | null
          created_at?: string
          email: string
          id?: string
          is_buyer?: boolean
          lead_source?: string
          message?: string | null
          monthly_revenue?: string | null
          name: string
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          business_type?: string | null
          created_at?: string
          email?: string
          id?: string
          is_buyer?: boolean
          lead_source?: string
          message?: string | null
          monthly_revenue?: string | null
          name?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_notes: string | null
          completed_at: string | null
          created_at: string
          customer_notes: string | null
          expected_delivery_date: string | null
          id: string
          manuscript_url: string | null
          payment_id: string | null
          payment_status: string | null
          service_id: string
          status: string | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          completed_at?: string | null
          created_at?: string
          customer_notes?: string | null
          expected_delivery_date?: string | null
          id?: string
          manuscript_url?: string | null
          payment_id?: string | null
          payment_status?: string | null
          service_id: string
          status?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          completed_at?: string | null
          created_at?: string
          customer_notes?: string | null
          expected_delivery_date?: string | null
          id?: string
          manuscript_url?: string | null
          payment_id?: string | null
          payment_status?: string | null
          service_id?: string
          status?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          book_price: number | null
          created_at: string
          id: string
          payment_data: Json | null
          paypal_payer_id: string | null
          paypal_payment_id: string | null
          plan_name: string
          plan_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          book_price?: number | null
          created_at?: string
          id?: string
          payment_data?: Json | null
          paypal_payer_id?: string | null
          paypal_payment_id?: string | null
          plan_name: string
          plan_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          book_price?: number | null
          created_at?: string
          id?: string
          payment_data?: Json | null
          paypal_payer_id?: string | null
          paypal_payment_id?: string | null
          plan_name?: string
          plan_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      review_plans: {
        Row: {
          amount_paid: number | null
          book_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          payment_id: string | null
          plan_name: string
          plan_type: string
          purchased_at: string
          status: string
          total_reviews: number
          updated_at: string
          used_reviews: number
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          book_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          plan_name: string
          plan_type: string
          purchased_at?: string
          status?: string
          total_reviews?: number
          updated_at?: string
          used_reviews?: number
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          book_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          plan_name?: string
          plan_type?: string
          purchased_at?: string
          status?: string
          total_reviews?: number
          updated_at?: string
          used_reviews?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_plans_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: true
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_plans_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          amazon_visible: boolean | null
          book_id: string
          comment: string | null
          id: string
          masked_reviewer_name: string | null
          plan_type: string | null
          rating: number
          review_plan_id: string | null
          review_type: string | null
          reviewed_at: string
          reviewer_name: string
        }
        Insert: {
          amazon_visible?: boolean | null
          book_id: string
          comment?: string | null
          id?: string
          masked_reviewer_name?: string | null
          plan_type?: string | null
          rating: number
          review_plan_id?: string | null
          review_type?: string | null
          reviewed_at?: string
          reviewer_name: string
        }
        Update: {
          amazon_visible?: boolean | null
          book_id?: string
          comment?: string | null
          id?: string
          masked_reviewer_name?: string | null
          plan_type?: string | null
          rating?: number
          review_plan_id?: string | null
          review_type?: string | null
          reviewed_at?: string
          reviewer_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          created_at: string
          delivery_time_days: number | null
          description: string | null
          features: string[] | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          delivery_time_days?: number | null
          description?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          delivery_time_days?: number | null
          description?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_role: {
        Args: { p_user_id: string; p_role: string }
        Returns: undefined
      }
      handle_successful_payment: {
        Args: {
          p_payment_id: string
          p_user_id: string
          p_plan_type: string
          p_plan_name: string
          p_amount: number
          p_total_reviews: number
        }
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "customer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["customer", "admin"],
    },
  },
} as const
