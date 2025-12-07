// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL:', supabaseUrl);
  console.error('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          age: number;
          gender: string;
          height: number;
          weight: number;
          fitness_goal: string;
          fitness_level: string;
          workout_location: string;
          dietary_preference: string;
          medical_history: string | null;
          stress_level: string | null;
          sleep_hours: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          age: number;
          gender: string;
          height: number;
          weight: number;
          fitness_goal: string;
          fitness_level: string;
          workout_location: string;
          dietary_preference: string;
          medical_history?: string | null;
          stress_level?: string | null;
          sleep_hours?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          age?: number;
          gender?: string;
          height?: number;
          weight?: number;
          fitness_goal?: string;
          fitness_level?: string;
          workout_location?: string;
          dietary_preference?: string;
          medical_history?: string | null;
          stress_level?: string | null;
          sleep_hours?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      fitness_plans: {
        Row: {
          id: string;
          user_id: string;
          profile_id: string;
          plan_data: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          profile_id: string;
          plan_data: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          profile_id?: string;
          plan_data?: any;
          created_at?: string;
        };
      };
    };
  };
}