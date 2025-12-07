import { FitnessPlan, UserProfile } from '@/types/fitness';

export const generateFitnessPlanPrompt = (profile: UserProfile): string => {
  return `Generate a comprehensive, personalized fitness plan for the following user:

USER PROFILE:
- Name: ${profile.name}
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Fitness Goal: ${profile.fitnessGoal.replace('_', ' ')}
- Current Fitness Level: ${profile.fitnessLevel}
- Workout Location: ${profile.workoutLocation}
- Dietary Preference: ${profile.dietaryPreference.replace('_', ' ')}
${profile.medicalHistory ? `- Medical History: ${profile.medicalHistory}` : ''}
${profile.stressLevel ? `- Stress Level: ${profile.stressLevel}` : ''}
${profile.sleepHours ? `- Average Sleep: ${profile.sleepHours} hours` : ''}

REQUIREMENTS:
1. Create a 7-day workout plan with exercises suitable for their fitness level and location
2. Include specific sets, reps, and rest times for each exercise
3. Create a full day meal plan with breakfast, morning snack, lunch, evening snack, and dinner
4. Ensure all meals match their dietary preference
5. Provide 5 personalized tips for their specific goals
6. Include an inspiring motivational quote

RESPONSE FORMAT (JSON):
{
  "workoutPlan": [
    {
      "day": "Day 1 - Monday",
      "focus": "Upper Body Strength",
      "duration": "45 mins",
      "caloriesBurned": "300-400 cal",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": "10-12",
          "restTime": "60 sec",
          "instructions": "Brief instruction for proper form"
        }
      ]
    }
  ],
  "dietPlan": {
    "breakfast": {
      "name": "Meal Name",
      "description": "Brief description",
      "calories": "400",
      "protein": "25g",
      "carbs": "45g",
      "fats": "15g",
      "ingredients": ["ingredient1", "ingredient2"]
    },
    "morningSnack": {...},
    "lunch": {...},
    "eveningSnack": {...},
    "dinner": {...}
  },
  "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
  "motivationalQuote": "An inspiring quote here",
  "summary": "A 2-3 sentence summary of the overall plan approach"
}`;
};

export const parseFitnessPlanResponse = (response: string): FitnessPlan | null => {
  try {
    // Try to extract JSON from the response
    let jsonStr = response;
    
    // If the response contains markdown code blocks, extract the JSON
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }
    
    // Try to find JSON object in the response
    const jsonStartIndex = jsonStr.indexOf('{');
    const jsonEndIndex = jsonStr.lastIndexOf('}');
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      jsonStr = jsonStr.slice(jsonStartIndex, jsonEndIndex + 1);
    }

    const parsed = JSON.parse(jsonStr);
    
    // Validate the structure
    if (!parsed.workoutPlan || !parsed.dietPlan || !parsed.tips) {
      console.error('Invalid plan structure');
      return null;
    }

    return parsed as FitnessPlan;
  } catch (error) {
    console.error('Failed to parse fitness plan:', error);
    return null;
  }
};

// Fallback plan for demo/offline mode
export const getFallbackPlan = (profile: UserProfile): FitnessPlan => {
  const isGym = profile.workoutLocation === 'gym';
  const isVeg = ['vegetarian', 'vegan'].includes(profile.dietaryPreference);

  return {
    workoutPlan: [
      {
        day: "Day 1 - Monday",
        focus: "Upper Body",
        duration: "45 mins",
        caloriesBurned: "300-350 cal",
        exercises: [
          { name: isGym ? "Barbell Bench Press" : "Push-ups", sets: 3, reps: "10-12", restTime: "60 sec", instructions: "Keep your core tight and lower slowly" },
          { name: isGym ? "Dumbbell Rows" : "Resistance Band Rows", sets: 3, reps: "10-12", restTime: "60 sec", instructions: "Squeeze your shoulder blades together" },
          { name: isGym ? "Overhead Press" : "Pike Push-ups", sets: 3, reps: "8-10", restTime: "60 sec", instructions: "Press straight up, engage core" },
          { name: "Plank Hold", sets: 3, reps: "30-45 sec", restTime: "30 sec", instructions: "Keep body in straight line" },
        ]
      },
      {
        day: "Day 2 - Tuesday",
        focus: "Lower Body",
        duration: "50 mins",
        caloriesBurned: "400-450 cal",
        exercises: [
          { name: isGym ? "Barbell Squats" : "Bodyweight Squats", sets: 4, reps: "10-12", restTime: "90 sec", instructions: "Go parallel or below, keep chest up" },
          { name: isGym ? "Romanian Deadlifts" : "Single Leg Deadlifts", sets: 3, reps: "10-12", restTime: "60 sec", instructions: "Hinge at hips, keep back straight" },
          { name: "Walking Lunges", sets: 3, reps: "12 each leg", restTime: "60 sec", instructions: "Keep front knee over ankle" },
          { name: "Calf Raises", sets: 3, reps: "15-20", restTime: "30 sec", instructions: "Full range of motion, pause at top" },
        ]
      },
      {
        day: "Day 3 - Wednesday",
        focus: "Active Recovery",
        duration: "30 mins",
        caloriesBurned: "150-200 cal",
        exercises: [
          { name: "Light Yoga Flow", sets: 1, reps: "15 mins", restTime: "N/A", instructions: "Focus on deep breathing and stretching" },
          { name: "Foam Rolling", sets: 1, reps: "10 mins", restTime: "N/A", instructions: "Roll slowly on tight areas" },
          { name: "Walking", sets: 1, reps: "20 mins", restTime: "N/A", instructions: "Brisk pace, outdoors if possible" },
        ]
      },
      {
        day: "Day 4 - Thursday",
        focus: "Push Day",
        duration: "45 mins",
        caloriesBurned: "300-350 cal",
        exercises: [
          { name: isGym ? "Incline Dumbbell Press" : "Decline Push-ups", sets: 3, reps: "10-12", restTime: "60 sec", instructions: "Control the weight throughout" },
          { name: isGym ? "Cable Flyes" : "Wide Push-ups", sets: 3, reps: "12-15", restTime: "45 sec", instructions: "Focus on the squeeze" },
          { name: isGym ? "Tricep Pushdowns" : "Diamond Push-ups", sets: 3, reps: "12-15", restTime: "45 sec", instructions: "Keep elbows close to body" },
          { name: "Lateral Raises", sets: 3, reps: "12-15", restTime: "45 sec", instructions: "Lead with elbows, control descent" },
        ]
      },
      {
        day: "Day 5 - Friday",
        focus: "Pull Day",
        duration: "45 mins",
        caloriesBurned: "300-350 cal",
        exercises: [
          { name: isGym ? "Lat Pulldowns" : "Resistance Band Pulldowns", sets: 3, reps: "10-12", restTime: "60 sec", instructions: "Pull to upper chest, squeeze lats" },
          { name: isGym ? "Seated Cable Rows" : "Inverted Rows", sets: 3, reps: "10-12", restTime: "60 sec", instructions: "Pull to lower chest" },
          { name: "Face Pulls", sets: 3, reps: "15-20", restTime: "45 sec", instructions: "Pull to face level, external rotate" },
          { name: isGym ? "Bicep Curls" : "Resistance Band Curls", sets: 3, reps: "12-15", restTime: "45 sec", instructions: "Keep elbows stationary" },
        ]
      },
      {
        day: "Day 6 - Saturday",
        focus: "HIIT & Core",
        duration: "35 mins",
        caloriesBurned: "400-500 cal",
        exercises: [
          { name: "Burpees", sets: 4, reps: "10", restTime: "30 sec", instructions: "Full extension at top, chest to floor" },
          { name: "Mountain Climbers", sets: 4, reps: "20 each side", restTime: "30 sec", instructions: "Keep hips level, move fast" },
          { name: "Russian Twists", sets: 3, reps: "20 total", restTime: "30 sec", instructions: "Rotate from core, not just arms" },
          { name: "Bicycle Crunches", sets: 3, reps: "20 total", restTime: "30 sec", instructions: "Elbow to opposite knee" },
        ]
      },
      {
        day: "Day 7 - Sunday",
        focus: "Rest Day",
        duration: "20 mins",
        caloriesBurned: "100-150 cal",
        exercises: [
          { name: "Light Stretching", sets: 1, reps: "10 mins", restTime: "N/A", instructions: "Focus on tight muscle groups" },
          { name: "Meditation", sets: 1, reps: "10 mins", restTime: "N/A", instructions: "Deep breathing, clear your mind" },
        ]
      },
    ],
    dietPlan: {
      breakfast: {
        name: isVeg ? "Protein Oatmeal Bowl" : "Eggs & Avocado Toast",
        description: isVeg ? "Creamy oats topped with nuts, seeds, and berries" : "Whole grain toast with eggs, avocado, and tomatoes",
        calories: "450",
        protein: isVeg ? "18g" : "25g",
        carbs: "55g",
        fats: "18g",
        ingredients: isVeg 
          ? ["Oats", "Almond milk", "Protein powder", "Mixed berries", "Almonds", "Chia seeds"]
          : ["Eggs", "Whole grain bread", "Avocado", "Cherry tomatoes", "Olive oil"]
      },
      morningSnack: {
        name: isVeg ? "Greek Yogurt Parfait" : "Protein Shake",
        description: "A quick energy boost to fuel your morning",
        calories: "200",
        protein: "15g",
        carbs: "25g",
        fats: "5g",
        ingredients: isVeg
          ? ["Greek yogurt", "Granola", "Honey", "Berries"]
          : ["Whey protein", "Banana", "Almond milk", "Peanut butter"]
      },
      lunch: {
        name: isVeg ? "Buddha Bowl" : "Grilled Chicken Salad",
        description: "A nutrient-packed balanced meal",
        calories: "550",
        protein: isVeg ? "22g" : "40g",
        carbs: "60g",
        fats: "20g",
        ingredients: isVeg
          ? ["Quinoa", "Chickpeas", "Roasted vegetables", "Tahini dressing", "Avocado", "Spinach"]
          : ["Grilled chicken breast", "Mixed greens", "Quinoa", "Avocado", "Olive oil dressing"]
      },
      eveningSnack: {
        name: "Mixed Nuts & Fruit",
        description: "Healthy fats and natural sugars for sustained energy",
        calories: "180",
        protein: "6g",
        carbs: "20g",
        fats: "10g",
        ingredients: ["Almonds", "Walnuts", "Apple slices", "Dark chocolate chips"]
      },
      dinner: {
        name: isVeg ? "Lentil Curry with Rice" : "Salmon with Sweet Potato",
        description: "A satisfying meal to end the day and support recovery",
        calories: "600",
        protein: isVeg ? "25g" : "35g",
        carbs: "65g",
        fats: "22g",
        ingredients: isVeg
          ? ["Red lentils", "Brown rice", "Coconut milk", "Spinach", "Curry spices", "Naan bread"]
          : ["Salmon fillet", "Sweet potato", "Asparagus", "Lemon", "Olive oil", "Herbs"]
      }
    },
    tips: [
      `Since your goal is ${profile.fitnessGoal.replace('_', ' ')}, consistency is more important than intensity. Stick to the plan!`,
      `As a ${profile.fitnessLevel}, focus on form over weight. Master the movements before progressing.`,
      `Stay hydrated! Aim for at least 8 glasses of water daily, more on workout days.`,
      profile.stressLevel === 'high' 
        ? "With higher stress levels, prioritize sleep and recovery. Consider adding meditation to your routine."
        : "Your workouts are designed to challenge you while being sustainable. Push yourself but listen to your body.",
      `Your ${profile.dietaryPreference.replace('_', ' ')} diet provides all necessary nutrients. Focus on whole foods and avoid processed items.`
    ],
    motivationalQuote: "The only bad workout is the one that didn't happen. Every step forward is progress!",
    summary: `This plan is tailored for ${profile.name}, a ${profile.fitnessLevel} looking to achieve ${profile.fitnessGoal.replace('_', ' ')}. With ${profile.workoutLocation}-based workouts and a ${profile.dietaryPreference.replace('_', ' ')} diet, this comprehensive program balances strength, cardio, and recovery for optimal results.`
  };
};
