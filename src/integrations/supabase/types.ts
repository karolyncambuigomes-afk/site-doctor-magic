export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      application_rate_limit: {
        Row: {
          created_at: string | null
          email: string
          id: string
          ip_address: unknown
          last_submission: string | null
          submission_count: number | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          ip_address: unknown
          last_submission?: string | null
          submission_count?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          ip_address?: unknown
          last_submission?: string | null
          submission_count?: number | null
        }
        Relationships: []
      }
      application_submission_log: {
        Row: {
          email: string
          id: string
          ip_address: unknown | null
          submitted_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          email: string
          id?: string
          ip_address?: unknown | null
          submitted_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          email?: string
          id?: string
          ip_address?: unknown | null
          submitted_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          id: string
          new_values: Json | null
          old_values: Json | null
          operation: string
          table_name: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation: string
          table_name: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation?: string
          table_name?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image: string | null
          image_local: string | null
          image_url_local: string | null
          is_published: boolean | null
          meta_description: string | null
          published_at: string | null
          read_time: number | null
          seo_keywords: string | null
          service_keywords: string[] | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          image_local?: string | null
          image_url_local?: string | null
          is_published?: boolean | null
          meta_description?: string | null
          published_at?: string | null
          read_time?: number | null
          seo_keywords?: string | null
          service_keywords?: string[] | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          image_local?: string | null
          image_url_local?: string | null
          is_published?: boolean | null
          meta_description?: string | null
          published_at?: string | null
          read_time?: number | null
          seo_keywords?: string | null
          service_keywords?: string[] | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          is_active: boolean
          order_index: number
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_settings: {
        Row: {
          auto_play: boolean | null
          id: string
          overlay_opacity: number | null
          show_dots: boolean | null
          show_scroll_indicator: boolean | null
          slide_duration: number | null
          updated_at: string
        }
        Insert: {
          auto_play?: boolean | null
          id?: string
          overlay_opacity?: number | null
          show_dots?: boolean | null
          show_scroll_indicator?: boolean | null
          slide_duration?: number | null
          updated_at?: string
        }
        Update: {
          auto_play?: boolean | null
          id?: string
          overlay_opacity?: number | null
          show_dots?: boolean | null
          show_scroll_indicator?: boolean | null
          slide_duration?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          active: boolean | null
          button_link: string | null
          button_text: string | null
          created_at: string
          id: string
          image_url: string
          image_url_local: string | null
          image_url_local_desktop: string | null
          image_url_local_fallback: string | null
          image_url_local_mobile: string | null
          media_type: string | null
          order_index: number
          subtitle: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          active?: boolean | null
          button_link?: string | null
          button_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          image_url_local?: string | null
          image_url_local_desktop?: string | null
          image_url_local_fallback?: string | null
          image_url_local_mobile?: string | null
          media_type?: string | null
          order_index?: number
          subtitle?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          active?: boolean | null
          button_link?: string | null
          button_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          image_url_local?: string | null
          image_url_local_desktop?: string | null
          image_url_local_fallback?: string | null
          image_url_local_mobile?: string | null
          media_type?: string | null
          order_index?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      homepage_carousel: {
        Row: {
          created_at: string
          id: string
          image_url: string
          image_url_local: string | null
          is_active: boolean
          model_id: string
          model_name: string
          order_index: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          image_url_local?: string | null
          is_active?: boolean
          model_id: string
          model_name: string
          order_index?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          image_url_local?: string | null
          is_active?: boolean
          model_id?: string
          model_name?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: []
      }
      model_applications: {
        Row: {
          admin_notes: string | null
          age: number | null
          availability: string | null
          created_at: string
          date_of_birth: string | null
          dress_size: string | null
          education: string | null
          email: string
          escort_experience: string | null
          eye_color: string | null
          full_name: string
          hair_color: string | null
          height: string | null
          id: string
          instagram_handle: string | null
          interests: string[] | null
          languages: string[] | null
          location_preference: string | null
          measurements: string | null
          modeling_experience: string | null
          motivation: string | null
          nationality: string | null
          phone: string | null
          photos: string[] | null
          piercings: string | null
          profession: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          shoe_size: string | null
          status: string
          tattoos: string | null
          updated_at: string
          videos: string[] | null
        }
        Insert: {
          admin_notes?: string | null
          age?: number | null
          availability?: string | null
          created_at?: string
          date_of_birth?: string | null
          dress_size?: string | null
          education?: string | null
          email: string
          escort_experience?: string | null
          eye_color?: string | null
          full_name: string
          hair_color?: string | null
          height?: string | null
          id?: string
          instagram_handle?: string | null
          interests?: string[] | null
          languages?: string[] | null
          location_preference?: string | null
          measurements?: string | null
          modeling_experience?: string | null
          motivation?: string | null
          nationality?: string | null
          phone?: string | null
          photos?: string[] | null
          piercings?: string | null
          profession?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          shoe_size?: string | null
          status?: string
          tattoos?: string | null
          updated_at?: string
          videos?: string[] | null
        }
        Update: {
          admin_notes?: string | null
          age?: number | null
          availability?: string | null
          created_at?: string
          date_of_birth?: string | null
          dress_size?: string | null
          education?: string | null
          email?: string
          escort_experience?: string | null
          eye_color?: string | null
          full_name?: string
          hair_color?: string | null
          height?: string | null
          id?: string
          instagram_handle?: string | null
          interests?: string[] | null
          languages?: string[] | null
          location_preference?: string | null
          measurements?: string | null
          modeling_experience?: string | null
          motivation?: string | null
          nationality?: string | null
          phone?: string | null
          photos?: string[] | null
          piercings?: string | null
          profession?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          shoe_size?: string | null
          status?: string
          tattoos?: string | null
          updated_at?: string
          videos?: string[] | null
        }
        Relationships: []
      }
      model_gallery: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          model_id: string
          order_index: number | null
          visibility: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          model_id: string
          order_index?: number | null
          visibility?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          model_id?: string
          order_index?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "model_gallery_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      model_reviews: {
        Row: {
          content: string
          created_at: string
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          is_verified: boolean | null
          model_id: string | null
          rating: number
          reviewer_name: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          is_verified?: boolean | null
          model_id?: string | null
          rating: number
          reviewer_name: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          is_verified?: boolean | null
          model_id?: string | null
          rating?: number
          reviewer_name?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_reviews_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          age: number | null
          all_photos_public: boolean | null
          availability: string | null
          characteristics: string[] | null
          created_at: string
          description: string | null
          education: string | null
          eyes: string | null
          face_visible: boolean | null
          gallery_local_urls: string[] | null
          hair: string | null
          height: string | null
          homepage_order: number | null
          id: string
          image: string | null
          image_local: string | null
          image_url_local_main: string | null
          interests: string[] | null
          location: string | null
          measurements: string | null
          members_only: boolean | null
          name: string
          nationality: string | null
          price: string | null
          pricing: Json | null
          rating: number | null
          reviews: number | null
          services: string[] | null
          show_on_homepage: boolean | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          all_photos_public?: boolean | null
          availability?: string | null
          characteristics?: string[] | null
          created_at?: string
          description?: string | null
          education?: string | null
          eyes?: string | null
          face_visible?: boolean | null
          gallery_local_urls?: string[] | null
          hair?: string | null
          height?: string | null
          homepage_order?: number | null
          id?: string
          image?: string | null
          image_local?: string | null
          image_url_local_main?: string | null
          interests?: string[] | null
          location?: string | null
          measurements?: string | null
          members_only?: boolean | null
          name: string
          nationality?: string | null
          price?: string | null
          pricing?: Json | null
          rating?: number | null
          reviews?: number | null
          services?: string[] | null
          show_on_homepage?: boolean | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          all_photos_public?: boolean | null
          availability?: string | null
          characteristics?: string[] | null
          created_at?: string
          description?: string | null
          education?: string | null
          eyes?: string | null
          face_visible?: boolean | null
          gallery_local_urls?: string[] | null
          hair?: string | null
          height?: string | null
          homepage_order?: number | null
          id?: string
          image?: string | null
          image_local?: string | null
          image_url_local_main?: string | null
          interests?: string[] | null
          location?: string | null
          measurements?: string | null
          members_only?: boolean | null
          name?: string
          nationality?: string | null
          price?: string | null
          pricing?: Json | null
          rating?: number | null
          reviews?: number | null
          services?: string[] | null
          show_on_homepage?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      page_seo: {
        Row: {
          canonical_url: string | null
          created_at: string
          id: string
          is_active: boolean | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_path: string
          seo_score: number | null
          structured_data: Json | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path: string
          seo_score?: number | null
          structured_data?: Json | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path?: string
          seo_score?: number | null
          structured_data?: Json | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      preference_categories: {
        Row: {
          created_at: string
          id: string
          image_alt: string | null
          image_url: string
          is_active: boolean
          name: string
          order_index: number
          path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_alt?: string | null
          image_url: string
          is_active?: boolean
          name: string
          order_index?: number
          path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_alt?: string | null
          image_url?: string
          is_active?: boolean
          name?: string
          order_index?: number
          path?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          email: string | null
          id: string
          requested_at: string | null
          role: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string | null
          id: string
          requested_at?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string | null
          id?: string
          requested_at?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      public_gallery: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          is_featured: boolean | null
          model_id: string
          model_name: string
          order_index: number | null
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_featured?: boolean | null
          model_id: string
          model_name: string
          order_index?: number | null
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_featured?: boolean | null
          model_id?: string
          model_name?: string
          order_index?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          area_name: string
          author_initial: string
          author_name: string
          created_at: string | null
          id: string
          is_featured: boolean | null
          location_postcode: string
          rating: number
          review_text: string
          service_type: string | null
        }
        Insert: {
          area_name: string
          author_initial: string
          author_name: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          location_postcode: string
          rating: number
          review_text: string
          service_type?: string | null
        }
        Update: {
          area_name?: string
          author_initial?: string
          author_name?: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          location_postcode?: string
          rating?: number
          review_text?: string
          service_type?: string | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      seo_audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          page_path: string | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          page_path?: string | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          page_path?: string | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      seo_templates: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          template_data: Json
          template_name: string
          template_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          template_data: Json
          template_name: string
          template_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          template_data?: Json
          template_name?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          button_text: string | null
          button_url: string | null
          content: string | null
          created_at: string
          hero_version: number | null
          id: string
          image_alt: string | null
          image_url: string | null
          image_url_desktop: string | null
          image_url_local_desktop: string | null
          image_url_local_fallback: string | null
          image_url_local_mobile: string | null
          image_url_mobile: string | null
          is_active: boolean | null
          meta_data: Json | null
          section: string
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          button_text?: string | null
          button_url?: string | null
          content?: string | null
          created_at?: string
          hero_version?: number | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          image_url_desktop?: string | null
          image_url_local_desktop?: string | null
          image_url_local_fallback?: string | null
          image_url_local_mobile?: string | null
          image_url_mobile?: string | null
          is_active?: boolean | null
          meta_data?: Json | null
          section: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          button_text?: string | null
          button_url?: string | null
          content?: string | null
          created_at?: string
          hero_version?: number | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          image_url_desktop?: string | null
          image_url_local_desktop?: string | null
          image_url_local_fallback?: string | null
          image_url_local_mobile?: string | null
          image_url_mobile?: string | null
          is_active?: boolean | null
          meta_data?: Json | null
          section?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          active: boolean
          amount: number | null
          created_at: string
          currency: string | null
          expires_at: string | null
          id: string
          plan_type: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          amount?: number | null
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          id?: string
          plan_type?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          amount?: number | null
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          id?: string
          plan_type?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_application_rate_limit: {
        Args: { user_email: string; user_ip?: unknown }
        Returns: Json
      }
      check_user_subscription: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      fetch_migration_items: {
        Args: { query_text: string }
        Returns: {
          category: string
          id: string
          image: string
          image_url: string
          model_name: string
          name: string
          slug: string
          title: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_status: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_public_models: {
        Args: Record<PropertyKey, never>
        Returns: {
          age: number
          availability: string
          characteristics: string[]
          created_at: string
          description: string
          id: string
          image: string
          location: string
          name: string
          price: string
          rating: number
          reviews: number
          services: string[]
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_action: string
          p_new_values?: Json
          p_old_values?: Json
          p_record_id?: string
          p_table_name?: string
        }
        Returns: undefined
      }
      update_user_role: {
        Args: { new_role: string; user_id: string }
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
    Enums: {},
  },
} as const
