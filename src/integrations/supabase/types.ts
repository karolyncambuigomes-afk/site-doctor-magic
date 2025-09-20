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
      admin_audit_log: {
        Row: {
          action_type: string
          admin_user_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string | null
          risk_level: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          risk_level?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          risk_level?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_login_attempts: {
        Row: {
          created_at: string | null
          email: string
          failure_reason: string | null
          id: string
          ip_address: unknown | null
          success: boolean
          two_factor_used: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          success?: boolean
          two_factor_used?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          success?: boolean
          two_factor_used?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_rate_limits: {
        Row: {
          attempt_count: number | null
          blocked_until: string | null
          created_at: string | null
          id: string
          identifier: string
          window_start: string | null
        }
        Insert: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier: string
          window_start?: string | null
        }
        Update: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier?: string
          window_start?: string | null
        }
        Relationships: []
      }
      admin_security_sessions: {
        Row: {
          created_at: string | null
          deactivated_reason: string | null
          expires_at: string
          id: string
          idle_timeout_at: string | null
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          security_level: string | null
          session_token: string
          two_factor_verified: boolean | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deactivated_reason?: string | null
          expires_at: string
          id?: string
          idle_timeout_at?: string | null
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          security_level?: string | null
          session_token: string
          two_factor_verified?: boolean | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deactivated_reason?: string | null
          expires_at?: string
          id?: string
          idle_timeout_at?: string | null
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          security_level?: string | null
          session_token?: string
          two_factor_verified?: boolean | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_two_factor: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          last_used: string | null
          secret_key: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          last_used?: string | null
          secret_key: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          last_used?: string | null
          secret_key?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
      content_items: {
        Row: {
          author_id: string | null
          content: Json
          content_type_id: string | null
          created_at: string | null
          id: string
          meta_data: Json | null
          published_at: string | null
          seo_data: Json | null
          slug: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: Json
          content_type_id?: string | null
          created_at?: string | null
          id?: string
          meta_data?: Json | null
          published_at?: string | null
          seo_data?: Json | null
          slug: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: Json
          content_type_id?: string | null
          created_at?: string | null
          id?: string
          meta_data?: Json | null
          published_at?: string | null
          seo_data?: Json | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_items_content_type_id_fkey"
            columns: ["content_type_id"]
            isOneToOne: false
            referencedRelation: "content_types"
            referencedColumns: ["id"]
          },
        ]
      }
      content_preview: {
        Row: {
          content_item_id: string | null
          created_at: string | null
          created_by: string | null
          expires_at: string
          id: string
          preview_data: Json
          preview_token: string
        }
        Insert: {
          content_item_id?: string | null
          created_at?: string | null
          created_by?: string | null
          expires_at?: string
          id?: string
          preview_data?: Json
          preview_token?: string
        }
        Update: {
          content_item_id?: string | null
          created_at?: string | null
          created_by?: string | null
          expires_at?: string
          id?: string
          preview_data?: Json
          preview_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_preview_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      content_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          schema: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          schema?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          schema?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      content_versions: {
        Row: {
          change_summary: string | null
          content: Json
          content_item_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          meta_data: Json | null
          seo_data: Json | null
          title: string
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          content?: Json
          content_item_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          meta_data?: Json | null
          seo_data?: Json | null
          title: string
          version_number: number
        }
        Update: {
          change_summary?: string | null
          content?: Json
          content_item_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          meta_data?: Json | null
          seo_data?: Json | null
          title?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_versions_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
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
          date_of_birth_encrypted: string | null
          dress_size: string | null
          education: string | null
          email: string
          email_encrypted: string | null
          escort_experience: string | null
          escort_experience_encrypted: string | null
          eye_color: string | null
          full_name: string
          full_name_encrypted: string | null
          hair_color: string | null
          height: string | null
          height_encrypted: string | null
          id: string
          instagram_handle: string | null
          instagram_handle_encrypted: string | null
          interests: string[] | null
          languages: string[] | null
          location_preference: string | null
          measurements: string | null
          measurements_encrypted: string | null
          modeling_experience: string | null
          motivation: string | null
          nationality: string | null
          phone: string | null
          phone_encrypted: string | null
          photos: string[] | null
          photos_encrypted: string | null
          piercings: string | null
          piercings_encrypted: string | null
          profession: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          shoe_size: string | null
          status: string
          tattoos: string | null
          tattoos_encrypted: string | null
          updated_at: string
          videos: string[] | null
          videos_encrypted: string | null
        }
        Insert: {
          admin_notes?: string | null
          age?: number | null
          availability?: string | null
          created_at?: string
          date_of_birth?: string | null
          date_of_birth_encrypted?: string | null
          dress_size?: string | null
          education?: string | null
          email: string
          email_encrypted?: string | null
          escort_experience?: string | null
          escort_experience_encrypted?: string | null
          eye_color?: string | null
          full_name: string
          full_name_encrypted?: string | null
          hair_color?: string | null
          height?: string | null
          height_encrypted?: string | null
          id?: string
          instagram_handle?: string | null
          instagram_handle_encrypted?: string | null
          interests?: string[] | null
          languages?: string[] | null
          location_preference?: string | null
          measurements?: string | null
          measurements_encrypted?: string | null
          modeling_experience?: string | null
          motivation?: string | null
          nationality?: string | null
          phone?: string | null
          phone_encrypted?: string | null
          photos?: string[] | null
          photos_encrypted?: string | null
          piercings?: string | null
          piercings_encrypted?: string | null
          profession?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          shoe_size?: string | null
          status?: string
          tattoos?: string | null
          tattoos_encrypted?: string | null
          updated_at?: string
          videos?: string[] | null
          videos_encrypted?: string | null
        }
        Update: {
          admin_notes?: string | null
          age?: number | null
          availability?: string | null
          created_at?: string
          date_of_birth?: string | null
          date_of_birth_encrypted?: string | null
          dress_size?: string | null
          education?: string | null
          email?: string
          email_encrypted?: string | null
          escort_experience?: string | null
          escort_experience_encrypted?: string | null
          eye_color?: string | null
          full_name?: string
          full_name_encrypted?: string | null
          hair_color?: string | null
          height?: string | null
          height_encrypted?: string | null
          id?: string
          instagram_handle?: string | null
          instagram_handle_encrypted?: string | null
          interests?: string[] | null
          languages?: string[] | null
          location_preference?: string | null
          measurements?: string | null
          measurements_encrypted?: string | null
          modeling_experience?: string | null
          motivation?: string | null
          nationality?: string | null
          phone?: string | null
          phone_encrypted?: string | null
          photos?: string[] | null
          photos_encrypted?: string | null
          piercings?: string | null
          piercings_encrypted?: string | null
          profession?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          shoe_size?: string | null
          status?: string
          tattoos?: string | null
          tattoos_encrypted?: string | null
          updated_at?: string
          videos?: string[] | null
          videos_encrypted?: string | null
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
          gallery_external_urls: string[] | null
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
          gallery_external_urls?: string[] | null
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
          gallery_external_urls?: string[] | null
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
      optimized_images: {
        Row: {
          alt_text: string | null
          bucket_path: string
          compression_ratio: number | null
          created_at: string | null
          dimensions: Json | null
          id: string
          optimized_filename: string
          optimized_format: string
          optimized_size: number
          original_filename: string
          original_format: string
          original_size: number
        }
        Insert: {
          alt_text?: string | null
          bucket_path: string
          compression_ratio?: number | null
          created_at?: string | null
          dimensions?: Json | null
          id?: string
          optimized_filename: string
          optimized_format?: string
          optimized_size: number
          original_filename: string
          original_format: string
          original_size: number
        }
        Update: {
          alt_text?: string | null
          bucket_path?: string
          compression_ratio?: number | null
          created_at?: string | null
          dimensions?: Json | null
          id?: string
          optimized_filename?: string
          optimized_format?: string
          optimized_size?: number
          original_filename?: string
          original_format?: string
          original_size?: number
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
      permissions: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
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
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
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
      session_timeout_policies: {
        Row: {
          created_at: string | null
          force_logout_on_timeout: boolean | null
          id: string
          idle_timeout_minutes: number
          max_concurrent_sessions: number
          role_type: string
          session_timeout_minutes: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          force_logout_on_timeout?: boolean | null
          id?: string
          idle_timeout_minutes?: number
          max_concurrent_sessions?: number
          role_type?: string
          session_timeout_minutes?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          force_logout_on_timeout?: boolean | null
          id?: string
          idle_timeout_minutes?: number
          max_concurrent_sessions?: number
          role_type?: string
          session_timeout_minutes?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      site_banners: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          device_type: string | null
          id: string
          image_url: string
          is_active: boolean | null
          order_index: number | null
          section: string
          visibility: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          order_index?: number | null
          section: string
          visibility?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          order_index?: number | null
          section?: string
          visibility?: string | null
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
      user_management_audit: {
        Row: {
          action: string
          admin_user_id: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          target_user_id: string | null
          timestamp: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_user_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_user_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
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
      check_admin_rate_limit: {
        Args: { identifier_value: string }
        Returns: Json
      }
      check_application_rate_limit: {
        Args: { user_email: string; user_ip?: unknown }
        Returns: Json
      }
      check_user_subscription: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      cleanup_admin_security_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      cleanup_plaintext_pii_data: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      create_admin_session: {
        Args: {
          p_ip_address?: unknown
          p_security_level?: string
          p_session_token: string
          p_two_factor_verified?: boolean
          p_user_agent?: string
          p_user_id: string
        }
        Returns: Json
      }
      create_preview_token: {
        Args: { content_id: string; preview_data?: Json }
        Returns: string
      }
      decrypt_pii_data: {
        Args: { encrypted_text: string; field_type?: string }
        Returns: string
      }
      decrypt_sensitive_field: {
        Args: { encrypted_text: string; encryption_key?: string }
        Returns: string
      }
      encrypt_existing_application_data: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      encrypt_pii_data: {
        Args: { field_type?: string; plain_text: string }
        Returns: string
      }
      encrypt_sensitive_field: {
        Args: { encryption_key?: string; plain_text: string }
        Returns: string
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
      get_masked_application_data: {
        Args: { application_id: string }
        Returns: Json
      }
      get_model_applications_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          id: string
          reviewed_at: string
          status: string
        }[]
      }
      get_model_applications_secure: {
        Args: { include_encrypted?: boolean }
        Returns: {
          admin_notes: string
          age: number
          created_at: string
          email: string
          full_name: string
          id: string
          measurements: string
          phone: string
          photos: string[]
          status: string
          videos: string[]
        }[]
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
      get_secure_model_application: {
        Args: { application_id: string }
        Returns: Json
      }
      get_secure_model_applications: {
        Args: { include_sensitive?: boolean }
        Returns: {
          age: number
          created_at: string
          id: string
          languages: string[]
          masked_email: string
          masked_full_name: string
          masked_phone: string
          measurements: string
          nationality: string
          photos: string[]
          status: string
          updated_at: string
          videos: string[]
        }[]
      }
      get_security_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      invalidate_admin_session: {
        Args: { session_token: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_approved_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          action_type_param: string
          new_values_param?: Json
          old_values_param?: Json
          resource_id_param?: string
          resource_type_param?: string
          risk_level_param?: string
        }
        Returns: undefined
      }
      log_admin_login: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
      log_sensitive_data_access: {
        Args:
          | {
              access_reason?: string
              accessed_fields: string[]
              accessed_table: string
            }
          | {
              access_type: string
              field_accessed?: string
              record_id: string
              table_name: string
            }
        Returns: undefined
      }
      mask_sensitive_application_data: {
        Args: { access_level?: string; data_text: string; field_type: string }
        Returns: string
      }
      mask_sensitive_data: {
        Args: { data_text: string; mask_type?: string }
        Returns: string
      }
      migrate_existing_sensitive_data: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      migrate_gallery_arrays_to_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      publish_content: {
        Args: { change_summary?: string; content_id: string }
        Returns: Json
      }
      rollback_content: {
        Args: {
          content_id: string
          rollback_reason?: string
          target_version: number
        }
        Returns: Json
      }
      update_user_role: {
        Args: { new_role: string; user_id: string }
        Returns: undefined
      }
      validate_admin_session_security: {
        Args: { session_token: string }
        Returns: Json
      }
      validate_and_refresh_session: {
        Args: { session_token: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "team" | "member"
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
      app_role: ["admin", "team", "member"],
    },
  },
} as const
