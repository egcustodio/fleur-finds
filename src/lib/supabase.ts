import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for build time
const getSupabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const getSupabaseAnonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const getSupabaseServiceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// Client-side Supabase client
export const createBrowserClient = () => {
  return createClientComponentClient();
};

// Default client for server components
export const createClient = () => {
  return createSupabaseClient(
    getSupabaseUrl(),
    getSupabaseAnonKey()
  );
};

// Server-side Supabase client with service role (for admin operations)
export const createAdminClient = () => {
  return createSupabaseClient(
    getSupabaseUrl(),
    getSupabaseServiceKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

// Types
export type Database = {
  public: {
    Tables: {
      stories: {
        Row: {
          id: string;
          title: string;
          cover_image: string;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          cover_image: string;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          cover_image?: string;
          order?: number;
          updated_at?: string;
        };
      };
      story_items: {
        Row: {
          id: string;
          story_id: string;
          image: string;
          caption: string | null;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          story_id: string;
          image: string;
          caption?: string | null;
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          story_id?: string;
          image?: string;
          caption?: string | null;
          order?: number;
        };
      };
      site_content: {
        Row: {
          id: string;
          section: string;
          content: any;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section: string;
          content: any;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section?: string;
          content?: any;
          updated_at?: string;
        };
      };
    };
  };
};
