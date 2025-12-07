// src/components/PlanDisplay.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Apple, 
  Lightbulb, 
  Quote,
  Clock,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FitnessPlan, UserProfile } from '@/types/fitness';
import { useState } from 'react';

interface PlanDisplayProps {
  plan: FitnessPlan;
  profile: UserProfile | null;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, profile }) => {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0]));

  const toggleDay = (index: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDays(newExpanded);
  };

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote className="w-5 h-5 text-primary" />
              Your Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">{plan.summary}</p>
            <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
              <p className="italic text-muted-foreground">"{plan.motivationalQuote}"</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workout">
            <Dumbbell className="w-4 h-4 mr-2" />
            Workout
          </TabsTrigger>
          <TabsTrigger value="diet">
            <Apple className="w-4 h-4 mr-2" />
            Diet
          </TabsTrigger>
          <TabsTrigger value="tips">
            <Lightbulb className="w-4 h-4 mr-2" />
            Tips
          </TabsTrigger>
        </TabsList>

        {/* Workout Plan */}
        <TabsContent value="workout" className="space-y-4 mt-6">
          {plan.workoutPlan.map((day, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleDay(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Dumbbell className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{day.day}</CardTitle>
                        <p className="text-sm text-muted-foreground">{day.focus}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        {day.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Flame className="w-4 h-4 text-orange-500" />
                        {day.caloriesBurned}
                      </div>
                      {expandedDays.has(index) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                {expandedDays.has(index) && (
                  <CardContent className="space-y-4">
                    {day.exercises.map((exercise, exIndex) => (
                      <div 
                        key={exIndex}
                        className="p-4 rounded-lg bg-muted/30 border border-border"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{exercise.name}</h4>
                          <Badge variant="outline">
                            {exercise.sets} × {exercise.reps}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {exercise.instructions}
                        </p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Rest: {exercise.restTime}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Diet Plan */}
        <TabsContent value="diet" className="space-y-4 mt-6">
          {Object.entries(plan.dietPlan).map(([mealType, meal], index) => (
            <motion.div
              key={mealType}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Apple className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl capitalize">
                        {mealType.replace(/([A-Z])/g, ' $1').trim()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{meal.name}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{meal.description}</p>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-primary">{meal.calories}</div>
                      <div className="text-xs text-muted-foreground">Calories</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-blue-500">{meal.protein}</div>
                      <div className="text-xs text-muted-foreground">Protein</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-amber-500">{meal.carbs}</div>
                      <div className="text-xs text-muted-foreground">Carbs</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-green-500">{meal.fats}</div>
                      <div className="text-xs text-muted-foreground">Fats</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Ingredients:</h4>
                    <div className="flex flex-wrap gap-2">
                      {meal.ingredients.map((ingredient, i) => (
                        <Badge key={i} variant="secondary">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Tips */}
        <TabsContent value="tips" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Personalized Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-border"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {index + 1}
                  </div>
                  <p className="flex-1">{tip}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanDisplay;