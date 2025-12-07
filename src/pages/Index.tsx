// src/pages/Index.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  Apple, 
  Target, 
  Sparkles,
  Download,
  ArrowRight,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FitnessPlan, UserProfile } from '@/types/fitness';
import { geminiService } from '@/services/geminiService';
import { exportToPDF } from '@/utils/pdfExport';
import UserProfileForm from '@/components/UserProfileForm';
import PlanDisplay from '@/components/PlanDisplay';

const Index = () => {
  const [step, setStep] = useState<'welcome' | 'form' | 'generating' | 'result'>('welcome');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGeneratePlan = async (userProfile: UserProfile) => {
    setProfile(userProfile);
    setStep('generating');
    setLoading(true);

    try {
      // Generate plan with Gemini AI
      toast({
        title: "Generating Your Plan",
        description: "Our AI is creating your personalized fitness journey...",
      });

      const generatedPlan = await geminiService.generateFitnessPlan(userProfile);
      setPlan(generatedPlan);

      toast({
        title: "Success! 🎉",
        description: "Your personalized fitness plan is ready!",
      });

      setStep('result');
    } catch (error) {
      console.error('Error generating plan:', error);
      
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate fitness plan. Please try again.",
        variant: "destructive",
      });

      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (plan && profile) {
      exportToPDF(plan, profile);
      toast({
        title: "PDF Downloaded!",
        description: "Your fitness plan has been saved as a PDF",
      });
    }
  };

  const handleStartOver = () => {
    setPlan(null);
    setProfile(null);
    setStep('welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/20">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="max-w-4xl w-full">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">AI-Powered Fitness Coach</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  FitGenius AI
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                  Your personalized fitness journey starts here
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  {[
                    { icon: Dumbbell, title: 'Custom Workouts', desc: 'Tailored to your level & goals' },
                    { icon: Apple, title: 'Nutrition Plans', desc: 'Meals that match your diet' },
                    { icon: Target, title: 'AI Guidance', desc: 'Smart tips from Gemini AI' },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="p-6 rounded-2xl bg-card border border-border shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <feature.icon className="w-10 h-10 text-primary mb-4 mx-auto" />
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full"
                  onClick={() => setStep('form')}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <UserProfileForm 
              onSubmit={handleGeneratePlan}
              onBack={() => setStep('welcome')}
            />
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Creating Your Perfect Plan</h2>
              <p className="text-muted-foreground mb-8">
                Our AI is analyzing your profile and generating personalized recommendations...
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Analyzing your goals
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Crafting workout routines
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Designing meal plans
              </div>
            </div>
          </motion.div>
        )}

        {step === 'result' && plan && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Your Fitness Plan</h1>
                  <p className="text-muted-foreground">
                    Generated with AI for {profile?.name}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleStartOver}>
                    Create New Plan
                  </Button>
                  <Button onClick={handleExportPDF}>
                    <Download className="mr-2 w-4 h-4" />
                    Download PDF
                  </Button>
                </div>
              </div>

              <PlanDisplay plan={plan} profile={profile} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;