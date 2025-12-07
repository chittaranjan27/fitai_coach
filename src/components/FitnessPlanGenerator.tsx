// src/components/FitnessPlanGenerator.tsx
import React, { useState } from 'react';
import { geminiService } from '@/services/geminiService';
import { supabaseService } from '@/services/supabaseService';
import { UserProfile, FitnessPlan } from '@/types/fitness';
import { useToast } from '@/components/ui/use-toast';

export const FitnessPlanGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const { toast } = useToast();

  const handleGeneratePlan = async (profile: UserProfile) => {
    setLoading(true);
    
    try {
      // Get current user
      const user = await supabaseService.getCurrentUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to generate a fitness plan",
          variant: "destructive",
        });
        return;
      }

      // Generate plan with Gemini AI
      const generatedPlan = await geminiService.generateFitnessPlan(profile);
      setPlan(generatedPlan);

      // Save profile to Supabase
      const savedProfile = await supabaseService.createUserProfile(user.id, profile);

      // Save fitness plan to Supabase
      await supabaseService.saveFitnessPlan(user.id, savedProfile.id, generatedPlan);

      toast({
        title: "Success!",
        description: "Your personalized fitness plan has been generated and saved.",
      });

    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate fitness plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMealImage = async (mealName: string) => {
    try {
      const imageUrl = await geminiService.generateDietImage(mealName);
      return imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  return (
    <div className="fitness-plan-generator">
      {/* Your form and UI components here */}
      {loading && <div>Generating your personalized plan...</div>}
      {plan && (
        <div>
          {/* Display the generated plan */}
          <h2>Your Fitness Plan</h2>
          {/* Render plan details */}
        </div>
      )}
    </div>
  );
};

export default FitnessPlanGenerator;