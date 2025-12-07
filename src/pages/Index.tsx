import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { OnboardingForm } from '@/components/OnboardingForm';
import { LoadingScreen } from '@/components/LoadingScreen';
import { PlanDisplay } from '@/components/PlanDisplay';
import { useFitnessStore } from '@/store/fitnessStore';
import { UserProfile, FitnessPlan } from '@/types/fitness';
import { exportToPDF } from '@/utils/pdfExport';
import { getFallbackPlan } from '@/utils/aiPlanGenerator';
import { useToast } from '@/hooks/use-toast';

type AppState = 'hero' | 'onboarding' | 'loading' | 'plan';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('hero');
  const [loadingStep, setLoadingStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { 
    userProfile, 
    fitnessPlan, 
    setUserProfile, 
    setFitnessPlan,
    clearPlan 
  } = useFitnessStore();
  const { toast } = useToast();

  // Check if we have a saved plan on mount
  useEffect(() => {
    if (fitnessPlan && userProfile) {
      setAppState('plan');
    }
  }, []);

  const handleGetStarted = () => {
    setAppState('onboarding');
  };

  const handleProfileComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    setAppState('loading');
    setLoadingStep(0);

    // Simulate AI generation with loading steps
    const steps = [0, 1, 2, 3];
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoadingStep(step);
    }

    // For now, use the fallback plan (will be replaced with actual AI call)
    const plan = getFallbackPlan(profile);
    setFitnessPlan(plan);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setAppState('plan');

    toast({
      title: "Plan Generated!",
      description: "Your personalized fitness plan is ready.",
    });
  };

  const handleRegenerate = async () => {
    if (!userProfile) return;
    
    setAppState('loading');
    setLoadingStep(0);

    const steps = [0, 1, 2, 3];
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoadingStep(step);
    }

    const plan = getFallbackPlan(userProfile);
    setFitnessPlan(plan);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setAppState('plan');

    toast({
      title: "Plan Regenerated!",
      description: "Your new fitness plan is ready.",
    });
  };

  const handleExportPDF = () => {
    if (fitnessPlan) {
      exportToPDF(fitnessPlan, userProfile);
      toast({
        title: "PDF Exported!",
        description: "Your plan has been downloaded.",
      });
    }
  };

  const handleSpeak = async (text: string, section: 'workout' | 'diet') => {
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);

    toast({
      title: `Reading ${section === 'workout' ? 'Workout' : 'Diet'} Plan`,
      description: "Listen to your personalized plan.",
    });
  };

  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <AnimatePresence mode="wait">
          {appState === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HeroSection onGetStarted={handleGetStarted} />
            </motion.div>
          )}

          {appState === 'onboarding' && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen flex items-center justify-center px-4 py-20"
            >
              <OnboardingForm onComplete={handleProfileComplete} />
            </motion.div>
          )}

          {appState === 'loading' && (
            <LoadingScreen currentStep={loadingStep} />
          )}

          {appState === 'plan' && fitnessPlan && (
            <motion.div
              key="plan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PlanDisplay
                plan={fitnessPlan}
                onRegenerate={handleRegenerate}
                onExportPDF={handleExportPDF}
                onSpeak={handleSpeak}
                isSpeaking={isSpeaking}
                onStopSpeaking={handleStopSpeaking}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
