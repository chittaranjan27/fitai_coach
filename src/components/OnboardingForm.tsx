import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/types/fitness';
import { useFitnessStore } from '@/store/fitnessStore';
import { 
  User, Ruler, Weight, Target, Activity, 
  MapPin, Utensils, Heart, Brain, Moon, 
  ArrowRight, ArrowLeft, Sparkles 
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Body Stats', icon: Ruler },
  { id: 3, title: 'Fitness Goals', icon: Target },
  { id: 4, title: 'Preferences', icon: Utensils },
  { id: 5, title: 'Lifestyle', icon: Heart },
];

interface OnboardingFormProps {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    gender: 'male',
    fitnessGoal: 'general_fitness',
    fitnessLevel: 'beginner',
    workoutLocation: 'home',
    dietaryPreference: 'balanced',
    stressLevel: 'medium',
  });

  const updateFormData = (key: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    if (formData.name && formData.age && formData.height && formData.weight) {
      onComplete(formData as UserProfile);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age && formData.gender;
      case 2:
        return formData.height && formData.weight;
      case 3:
        return formData.fitnessGoal && formData.fitnessLevel;
      case 4:
        return formData.workoutLocation && formData.dietaryPreference;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderOption = (
    key: keyof UserProfile,
    value: string,
    label: string,
    icon?: React.ReactNode
  ) => (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => updateFormData(key, value)}
      className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
        formData[key] === value
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border hover:border-primary/50 bg-card'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <motion.div
              initial={false}
              animate={{
                scale: currentStep === step.id ? 1.1 : 1,
                backgroundColor: currentStep >= step.id ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                currentStep >= step.id ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              <step.icon className="w-5 h-5" />
            </motion.div>
            <span className={`text-xs font-medium hidden sm:block ${
              currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className="hidden sm:block absolute h-0.5 w-16 bg-muted top-6 left-full -translate-x-4" />
            )}
          </div>
        ))}
      </div>

      <Card variant="glass" className="overflow-hidden">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Let's get to know you</h2>
                  <p className="text-muted-foreground">Tell us about yourself to personalize your fitness journey.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">What's your name?</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name || ''}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        variant="filled"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="age">How old are you?</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter your age"
                        value={formData.age || ''}
                        onChange={(e) => updateFormData('age', parseInt(e.target.value))}
                        variant="filled"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Gender</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {renderOption('gender', 'male', 'Male', <User className="w-5 h-5" />)}
                        {renderOption('gender', 'female', 'Female', <User className="w-5 h-5" />)}
                        {renderOption('gender', 'other', 'Other', <User className="w-5 h-5" />)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Your body stats</h2>
                  <p className="text-muted-foreground">This helps us calculate your ideal workout intensity and nutrition.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="height" className="flex items-center gap-2">
                        <Ruler className="w-4 h-4" /> Height (cm)
                      </Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="e.g., 175"
                        value={formData.height || ''}
                        onChange={(e) => updateFormData('height', parseInt(e.target.value))}
                        variant="filled"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="weight" className="flex items-center gap-2">
                        <Weight className="w-4 h-4" /> Weight (kg)
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="e.g., 70"
                        value={formData.weight || ''}
                        onChange={(e) => updateFormData('weight', parseInt(e.target.value))}
                        variant="filled"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Your fitness goals</h2>
                  <p className="text-muted-foreground">What do you want to achieve?</p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Primary Goal</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                        {renderOption('fitnessGoal', 'weight_loss', 'Weight Loss', <Target className="w-5 h-5" />)}
                        {renderOption('fitnessGoal', 'muscle_gain', 'Muscle Gain', <Dumbbell className="w-5 h-5" />)}
                        {renderOption('fitnessGoal', 'endurance', 'Endurance', <Activity className="w-5 h-5" />)}
                        {renderOption('fitnessGoal', 'flexibility', 'Flexibility', <Heart className="w-5 h-5" />)}
                        {renderOption('fitnessGoal', 'general_fitness', 'General Fitness', <Sparkles className="w-5 h-5" />)}
                      </div>
                    </div>

                    <div>
                      <Label>Fitness Level</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {renderOption('fitnessLevel', 'beginner', 'Beginner', <span className="text-lg">🌱</span>)}
                        {renderOption('fitnessLevel', 'intermediate', 'Intermediate', <span className="text-lg">💪</span>)}
                        {renderOption('fitnessLevel', 'advanced', 'Advanced', <span className="text-lg">🔥</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Your preferences</h2>
                  <p className="text-muted-foreground">Where do you workout and what do you eat?</p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Workout Location</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {renderOption('workoutLocation', 'home', 'Home', <MapPin className="w-5 h-5" />)}
                        {renderOption('workoutLocation', 'gym', 'Gym', <Dumbbell className="w-5 h-5" />)}
                        {renderOption('workoutLocation', 'outdoor', 'Outdoor', <MapPin className="w-5 h-5" />)}
                      </div>
                    </div>

                    <div>
                      <Label>Dietary Preference</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                        {renderOption('dietaryPreference', 'vegetarian', 'Vegetarian', <span className="text-lg">🥗</span>)}
                        {renderOption('dietaryPreference', 'non_vegetarian', 'Non-Veg', <span className="text-lg">🍗</span>)}
                        {renderOption('dietaryPreference', 'vegan', 'Vegan', <span className="text-lg">🌱</span>)}
                        {renderOption('dietaryPreference', 'keto', 'Keto', <span className="text-lg">🥑</span>)}
                        {renderOption('dietaryPreference', 'balanced', 'Balanced', <span className="text-lg">⚖️</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Lifestyle factors</h2>
                  <p className="text-muted-foreground">Optional details to fine-tune your plan.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Stress Level</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {renderOption('stressLevel', 'low', 'Low', <Brain className="w-5 h-5 text-green-500" />)}
                        {renderOption('stressLevel', 'medium', 'Medium', <Brain className="w-5 h-5 text-yellow-500" />)}
                        {renderOption('stressLevel', 'high', 'High', <Brain className="w-5 h-5 text-red-500" />)}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="sleep" className="flex items-center gap-2">
                        <Moon className="w-4 h-4" /> Average Sleep Hours
                      </Label>
                      <Input
                        id="sleep"
                        type="number"
                        placeholder="e.g., 7"
                        value={formData.sleepHours || ''}
                        onChange={(e) => updateFormData('sleepHours', parseInt(e.target.value))}
                        variant="filled"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="medical">Medical History (optional)</Label>
                      <Input
                        id="medical"
                        placeholder="Any conditions we should know about?"
                        value={formData.medicalHistory || ''}
                        onChange={(e) => updateFormData('medicalHistory', e.target.value)}
                        variant="filled"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep < 5 ? (
              <Button
                variant="gradient"
                onClick={nextStep}
                disabled={!isStepValid()}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="accent"
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="gap-2"
                size="lg"
              >
                <Sparkles className="w-5 h-5" />
                Generate My Plan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Dumbbell = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6.5 6.5a2 2 0 0 0-3 0l-1 1a2 2 0 0 0 0 3l1 1a2 2 0 0 0 3 0l1-1a2 2 0 0 0 0-3l-1-1z"/>
    <path d="M17.5 17.5a2 2 0 0 0-3 0l-1 1a2 2 0 0 0 0 3l1 1a2 2 0 0 0 3 0l1-1a2 2 0 0 0 0-3l-1-1z"/>
    <path d="M14.5 6.5a2 2 0 0 0 3 0l1-1a2 2 0 0 0 0-3l-1-1a2 2 0 0 0-3 0l-1 1a2 2 0 0 0 0 3l1 1z"/>
    <path d="M5.5 17.5a2 2 0 0 0 3 0l1-1a2 2 0 0 0 0-3l-1-1a2 2 0 0 0-3 0l-1 1a2 2 0 0 0 0 3l1 1z"/>
    <line x1="10" y1="10" x2="14" y2="14"/>
  </svg>
);
