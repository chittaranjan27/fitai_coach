import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FitnessPlan, WorkoutDay, Meal } from '@/types/fitness';
import { useFitnessStore } from '@/store/fitnessStore';
import { 
  Dumbbell, Utensils, Lightbulb, Quote, Play, Pause, 
  Download, RefreshCw, Volume2, VolumeX, Image, Clock,
  Flame, Target, ChevronDown, ChevronUp
} from 'lucide-react';
import { ExerciseCard } from './ExerciseCard';
import { MealCard } from './MealCard';

interface PlanDisplayProps {
  plan: FitnessPlan;
  onRegenerate: () => void;
  onExportPDF: () => void;
  onSpeak: (text: string, section: 'workout' | 'diet') => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

export const PlanDisplay = ({ 
  plan, 
  onRegenerate, 
  onExportPDF,
  onSpeak,
  isSpeaking,
  onStopSpeaking 
}: PlanDisplayProps) => {
  const { userProfile } = useFitnessStore();
  const [activeTab, setActiveTab] = useState<'workout' | 'diet' | 'tips'>('workout');
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  const tabs = [
    { id: 'workout', label: 'Workout Plan', icon: Dumbbell },
    { id: 'diet', label: 'Diet Plan', icon: Utensils },
    { id: 'tips', label: 'Tips & Motivation', icon: Lightbulb },
  ];

  const getWorkoutPlanText = () => {
    return plan.workoutPlan.map(day => 
      `${day.day}: ${day.focus}. ${day.exercises.map(ex => 
        `${ex.name}: ${ex.sets} sets of ${ex.reps}`
      ).join('. ')}`
    ).join('. ');
  };

  const getDietPlanText = () => {
    const meals = plan.dietPlan;
    return `Breakfast: ${meals.breakfast.name}. 
      Morning Snack: ${meals.morningSnack.name}. 
      Lunch: ${meals.lunch.name}. 
      Evening Snack: ${meals.eveningSnack.name}. 
      Dinner: ${meals.dinner.name}.`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Your Personalized Plan
        </h1>
        <p className="text-muted-foreground">
          {userProfile?.name ? `Hey ${userProfile.name}! ` : ''}
          Here's your AI-generated fitness journey
        </p>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card variant="gradient" className="overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center shrink-0">
              <Quote className="w-6 h-6 text-accent-foreground" />
            </div>
            <p className="text-lg italic font-medium">{plan.motivationalQuote}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3 justify-center mb-8"
      >
        <Button variant="outline" onClick={onRegenerate} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Regenerate Plan
        </Button>
        <Button variant="outline" onClick={onExportPDF} className="gap-2">
          <Download className="w-4 h-4" />
          Export as PDF
        </Button>
        {isSpeaking ? (
          <Button variant="destructive" onClick={onStopSpeaking} className="gap-2">
            <VolumeX className="w-4 h-4" />
            Stop Reading
          </Button>
        ) : (
          <>
            <Button 
              variant="secondary" 
              onClick={() => onSpeak(getWorkoutPlanText(), 'workout')} 
              className="gap-2"
            >
              <Volume2 className="w-4 h-4" />
              Read Workout
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => onSpeak(getDietPlanText(), 'diet')} 
              className="gap-2"
            >
              <Volume2 className="w-4 h-4" />
              Read Diet
            </Button>
          </>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center gap-2 mb-8"
      >
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'gradient' : 'ghost'}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className="gap-2"
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </Button>
        ))}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'workout' && (
          <motion.div
            key="workout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {plan.workoutPlan.map((day, index) => (
              <WorkoutDayCard
                key={index}
                day={day}
                isExpanded={expandedDay === index}
                onToggle={() => setExpandedDay(expandedDay === index ? null : index)}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {activeTab === 'diet' && (
          <motion.div
            key="diet"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <MealCard meal={plan.dietPlan.breakfast} mealType="Breakfast" icon="🌅" />
            <MealCard meal={plan.dietPlan.morningSnack} mealType="Morning Snack" icon="🍎" />
            <MealCard meal={plan.dietPlan.lunch} mealType="Lunch" icon="☀️" />
            <MealCard meal={plan.dietPlan.eveningSnack} mealType="Evening Snack" icon="🥜" />
            <MealCard meal={plan.dietPlan.dinner} mealType="Dinner" icon="🌙" />
          </motion.div>
        )}

        {activeTab === 'tips' && (
          <motion.div
            key="tips"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  AI Tips & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.tips.map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-sm text-primary-foreground shrink-0">
                        {index + 1}
                      </span>
                      <p className="text-muted-foreground">{tip}</p>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Plan Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{plan.summary}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface WorkoutDayCardProps {
  day: WorkoutDay;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

const WorkoutDayCard = ({ day, isExpanded, onToggle, index }: WorkoutDayCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card variant="elevated" className="overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{day.day}</h3>
              <p className="text-sm text-muted-foreground">{day.focus}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {day.duration}
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-accent" />
                {day.caloriesBurned}
              </span>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {day.exercises.map((exercise, idx) => (
                  <ExerciseCard key={idx} exercise={exercise} index={idx} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
