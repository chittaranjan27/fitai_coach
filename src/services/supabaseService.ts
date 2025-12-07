// src/services/supabaseService.ts
import { supabase } from '@/lib/supabase';
import { UserProfile, FitnessPlan } from '@/types/fitness';

export class SupabaseService {
  // User Profile Management
  async createUserProfile(userId: string, profile: UserProfile) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        age: profile.age,
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        fitness_goal: profile.fitnessGoal,
        fitness_level: profile.fitnessLevel,
        workout_location: profile.workoutLocation,
        dietary_preference: profile.dietaryPreference,
        medical_history: profile.medicalHistory || null,
        stress_level: profile.stressLevel || null,
        sleep_hours: profile.sleepHours || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateUserProfile(profileId: string, profile: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        age: profile.age,
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        fitness_goal: profile.fitnessGoal,
        fitness_level: profile.fitnessLevel,
        workout_location: profile.workoutLocation,
        dietary_preference: profile.dietaryPreference,
        medical_history: profile.medicalHistory || null,
        stress_level: profile.stressLevel || null,
        sleep_hours: profile.sleepHours || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Fitness Plan Management
  async saveFitnessPlan(userId: string, profileId: string, plan: FitnessPlan) {
    const { data, error } = await supabase
      .from('fitness_plans')
      .insert({
        user_id: userId,
        profile_id: profileId,
        plan_data: plan,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserPlans(userId: string) {
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*, user_profiles(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getFitnessPlan(planId: string) {
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*, user_profiles(*)')
      .eq('id', planId)
      .single();

    if (error) throw error;
    return data;
  }

  async deleteFitnessPlan(planId: string) {
    const { error } = await supabase
      .from('fitness_plans')
      .delete()
      .eq('id', planId);

    if (error) throw error;
  }

  // Auth helpers
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });
  }
}

export const supabaseService = new SupabaseService();