export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general_fitness';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  workoutLocation: 'home' | 'gym' | 'outdoor';
  dietaryPreference: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'keto' | 'balanced';
  medicalHistory?: string;
  stressLevel?: 'low' | 'medium' | 'high';
  sleepHours?: number;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  restTime: string;
  instructions: string;
  imageUrl?: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  duration: string;
  caloriesBurned: string;
}

export interface Meal {
  name: string;
  description: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  ingredients: string[];
  imageUrl?: string;
}

export interface DayMeals {
  breakfast: Meal;
  morningSnack: Meal;
  lunch: Meal;
  eveningSnack: Meal;
  dinner: Meal;
}

export interface FitnessPlan {
  workoutPlan: WorkoutDay[];
  dietPlan: DayMeals;
  tips: string[];
  motivationalQuote: string;
  summary: string;
}
