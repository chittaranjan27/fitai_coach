// src/utils/aiPlanGenerator.ts
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