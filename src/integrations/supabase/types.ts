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
      affiliate_commissions: {
        Row: {
          affiliate_id: string
          commission_amount: number
          commission_rate: number
          created_at: string
          id: string
          paid_at: string | null
          payment_id: string | null
          referral_id: string
          sale_amount: number
          status: string
        }
        Insert: {
          affiliate_id: string
          commission_amount: number
          commission_rate: number
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          referral_id: string
          sale_amount: number
          status?: string
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          referral_id?: string
          sale_amount?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_commissions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_commissions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_commissions_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string
          id: string
          notes: string | null
          payment_details: Json | null
          payment_method: string
          processed_at: string | null
          processed_by: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_details?: Json | null
          payment_method: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_details?: Json | null
          payment_method?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          affiliate_code: string
          approved_at: string | null
          approved_by: string | null
          commission_rate: number
          created_at: string
          id: string
          notes: string | null
          payment_email: string | null
          payment_method: string | null
          status: string
          total_conversions: number
          total_earnings: number
          total_referrals: number
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_code: string
          approved_at?: string | null
          approved_by?: string | null
          commission_rate?: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_email?: string | null
          payment_method?: string | null
          status?: string
          total_conversions?: number
          total_earnings?: number
          total_referrals?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_code?: string
          approved_at?: string | null
          approved_by?: string | null
          commission_rate?: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_email?: string | null
          payment_method?: string | null
          status?: string
          total_conversions?: number
          total_earnings?: number
          total_referrals?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
      community_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          id: string
          is_solved: boolean
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          upvotes: number
          view_count: number
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          id?: string
          is_solved?: boolean
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          upvotes?: number
          view_count?: number
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_solved?: boolean
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          upvotes?: number
          view_count?: number
        }
        Relationships: []
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
      community_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_solution: boolean
          is_support_reply: boolean
          post_id: string
          updated_at: string
          upvotes: number
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_solution?: boolean
          is_support_reply?: boolean
          post_id: string
          updated_at?: string
          upvotes?: number
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_solution?: boolean
          is_support_reply?: boolean
          post_id?: string
          updated_at?: string
          upvotes?: number
        }
        Relationships: [
          {
            foreignKeyName: "community_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_votes: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          reply_id: string | null
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          reply_id?: string | null
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          reply_id?: string | null
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_votes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "community_replies"
            referencedColumns: ["id"]
          },
        ]
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
      help_articles: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean
          id: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number
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
      referrals: {
        Row: {
          affiliate_id: string
          clicked_at: string
          conversion_value: number | null
          converted_at: string | null
          id: string
          ip_address: unknown | null
          referral_code: string
          referred_user_id: string | null
          status: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          affiliate_id: string
          clicked_at?: string
          conversion_value?: number | null
          converted_at?: string | null
          id?: string
          ip_address?: unknown | null
          referral_code: string
          referred_user_id?: string | null
          status?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          affiliate_id?: string
          clicked_at?: string
          conversion_value?: number | null
          converted_at?: string | null
          id?: string
          ip_address?: unknown | null
          referral_code?: string
          referred_user_id?: string | null
          status?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
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
          review_link: string | null
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
          review_link?: string | null
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
          review_link?: string | null
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
      user_surveys: {
        Row: {
          additional_comments: string | null
          book_genres: string[] | null
          book_status: string | null
          created_at: string
          current_challenges: string[] | null
          how_did_you_hear: string | null
          id: string
          main_goals: string[] | null
          marketing_budget: string | null
          monthly_revenue_goal: string | null
          previous_publishing: string | null
          primary_interest: string | null
          target_audience: string | null
          updated_at: string
          user_id: string
          writing_experience: string | null
        }
        Insert: {
          additional_comments?: string | null
          book_genres?: string[] | null
          book_status?: string | null
          created_at?: string
          current_challenges?: string[] | null
          how_did_you_hear?: string | null
          id?: string
          main_goals?: string[] | null
          marketing_budget?: string | null
          monthly_revenue_goal?: string | null
          previous_publishing?: string | null
          primary_interest?: string | null
          target_audience?: string | null
          updated_at?: string
          user_id: string
          writing_experience?: string | null
        }
        Update: {
          additional_comments?: string | null
          book_genres?: string[] | null
          book_status?: string | null
          created_at?: string
          current_challenges?: string[] | null
          how_did_you_hear?: string | null
          id?: string
          main_goals?: string[] | null
          marketing_budget?: string | null
          monthly_revenue_goal?: string | null
          previous_publishing?: string | null
          primary_interest?: string | null
          target_audience?: string | null
          updated_at?: string
          user_id?: string
          writing_experience?: string | null
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
      generate_affiliate_code: {
        Args: Record<PropertyKey, never>
        Returns: string
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
      populate_sample_community_content: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      track_affiliate_conversion: {
        Args: {
          p_payment_id: string
          p_referral_code: string
          p_sale_amount: number
        }
        Returns: undefined
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
